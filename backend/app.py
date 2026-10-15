"""FastAPI service for Deha-Chitra's non-diagnostic symptom-to-care engine.

The service uses local, versioned JSON data by default. MongoDB Atlas is optional
and may only override rules after structural validation. No raw symptom text is
persisted by this application.
"""
from contextlib import asynccontextmanager
import json
import logging
import os
from pathlib import Path
from typing import Any, Literal

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator

from scripts.baseline_matcher import normalise_text
from scripts.triage_reference import evaluate_triage

load_dotenv()
logger = logging.getLogger("deha_chitra")
DATA_DIR = Path(__file__).parent / "data"
STATE: dict[str, Any] = {}
SUPPORTED_LANGUAGES = {"en", "hi", "kn", "ta", "hi_rom", "kn_rom", "mixed"}
DATA_FILES = ("concepts", "number_patterns", "templates", "negation", "rules", "intent_guard")


def _validate_rules_payload(payload: Any) -> bool:
    """Reject malformed remote rules before they can replace known-good local rules."""
    if not isinstance(payload, dict):
        return False
    for key in ("red_flag_rules", "pattern_rules", "confounder_rules"):
        if not isinstance(payload.get(key), list):
            return False
    valid_levels = {"self_track", "see_soon", "urgent", "emergency"}
    valid_patterns = {"none", "weak", "partial", "strong"}
    for rule in payload["red_flag_rules"]:
        if not isinstance(rule, dict) or not rule.get("id"):
            return False
        if rule.get("care_level") not in valid_levels:
            return False
        if not isinstance(rule.get("requires_all", []), list) or not isinstance(rule.get("requires_any", []), list):
            return False
    for rule in payload["pattern_rules"]:
        if not isinstance(rule, dict) or not rule.get("id"):
            return False
        if rule.get("care_level") not in valid_levels or rule.get("pattern") not in valid_patterns:
            return False
        if not isinstance(rule.get("requires_all", []), list) or not isinstance(rule.get("requires_any", []), list):
            return False
    for rule in payload["confounder_rules"]:
        if not isinstance(rule, dict) or not rule.get("concept") or rule.get("cap_pattern_to") not in valid_patterns:
            return False
    return True


def load_state_from_disk() -> dict[str, Any]:
    """Load every required dataset atomically; a broken file fails visibly."""
    loaded: dict[str, Any] = {}
    for name in DATA_FILES:
        path = DATA_DIR / f"{name}.json"
        with path.open("r", encoding="utf-8") as handle:
            loaded[name] = json.load(handle)
    if not _validate_rules_payload(loaded["rules"]):
        raise ValueError("Local rules.json failed structural validation")
    concepts = loaded["concepts"].get("concepts", {})
    if not isinstance(concepts, dict) or not concepts:
        raise ValueError("concepts.json must contain a non-empty concepts object")
    STATE.clear()
    STATE.update(loaded)
    return STATE


def overlay_atlas_rules_if_configured() -> bool:
    """Optionally load a structurally valid rules document; fail closed to local data."""
    uri = os.getenv("MONGODB_URI", "").strip()
    if not uri or "<username>" in uri or "<password>" in uri:
        return False
    client = None
    try:
        # Keep pymongo optional for local/test deployments that do not use Atlas.
        from pymongo import MongoClient
        client = MongoClient(uri, serverSelectionTimeoutMS=2500, connectTimeoutMS=2500)
        db = client.get_default_database()
        if db is None:
            logger.warning("MongoDB Atlas overlay skipped: URI has no default database")
            return False
        doc = db.rules.find_one({"_id": "active_rules"}, {"_id": 0})
        if not doc:
            return False
        if not _validate_rules_payload(doc):
            logger.error("MongoDB Atlas rules rejected: structural validation failed; local rules retained")
            return False
        # Require every referenced concept to exist locally.
        known = set(STATE["concepts"].get("concepts", {}))
        for rule in doc["red_flag_rules"] + doc["pattern_rules"]:
            if not set(rule.get("requires_all", []) + rule.get("requires_any", [])).issubset(known):
                logger.error("MongoDB Atlas rules rejected: unknown concept reference; local rules retained")
                return False
        if any(rule["concept"] not in known for rule in doc["confounder_rules"]):
            logger.error("MongoDB Atlas rules rejected: unknown confounder concept; local rules retained")
            return False
        STATE["rules"] = doc
        return True
    except Exception:
        # Do not log connection details; error messages can contain sensitive config.
        logger.warning("MongoDB Atlas rules unavailable; continuing with local rules")
        return False
    finally:
        if client is not None:
            client.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_state_from_disk()
    overlay_atlas_rules_if_configured()
    yield


app = FastAPI(
    title="Deha-Chitra Symptom-to-Care Engine",
    description=("A multilingual, non-diagnostic educational aid. It cannot diagnose PCOS "
                 "or replace a qualified healthcare professional."),
    version="2.2.1",
    lifespan=lifespan,
)

# Explicit allow-list: configure deployed frontend origins through CORS_ORIGINS.
_default_origins = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", _default_origins).split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


class RequestBase(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    text: str = Field(default="", max_length=4000, description="Symptom description; do not include names or contact details.")
    lang: str = Field(default="en", max_length=16)

    @field_validator("lang")
    @classmethod
    def validate_language(cls, value: str) -> str:
        value = value.lower().strip()
        if value not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language. Choose one of: {', '.join(sorted(SUPPORTED_LANGUAGES))}")
        return value


class NormaliseRequest(RequestBase):
    pass


class TriageRequest(RequestBase):
    chips: list[str] = Field(default_factory=list, max_length=40)
    concepts: list[str] = Field(default_factory=list, max_length=40)
    age: int | None = Field(default=None, ge=0, le=120)
    menarche_age: int | None = Field(default=None, ge=5, le=30)
    answers: dict[str, int] = Field(default_factory=dict, max_length=30)

    @field_validator("chips", "concepts")
    @classmethod
    def validate_concept_ids(cls, values: list[str]) -> list[str]:
        cleaned = [v.strip() for v in values if isinstance(v, str) and v.strip()]
        if any(len(v) > 80 for v in cleaned):
            raise ValueError("Concept identifiers must be 80 characters or fewer")
        return list(dict.fromkeys(cleaned))

    @field_validator("answers")
    @classmethod
    def validate_answer_values(cls, values: dict[str, int]) -> dict[str, int]:
        if any(not key.strip() or len(key) > 80 for key in values):
            raise ValueError("Answer keys must be non-empty and 80 characters or fewer")
        if any(value < 0 or value > 1200 for value in values.values()):
            raise ValueError("Numeric answers must be between 0 and 1200")
        return values


@app.get("/health")
def health() -> dict[str, Any]:
    if not STATE:
        load_state_from_disk()
    return {"status": "ok", "version": app.version, "loaded_datasets": sorted(STATE.keys()), "diagnostic": False}


@app.get("/ready")
def ready() -> dict[str, Any]:
    """Readiness endpoint checks that required local data is available."""
    if not STATE:
        load_state_from_disk()
    return {"ready": all(name in STATE for name in DATA_FILES), "dataset_count": len(STATE), "diagnostic": False}


@app.post("/normalise")
def post_normalise(req: NormaliseRequest) -> dict[str, Any]:
    if not STATE:
        load_state_from_disk()
    result = normalise_text(req.text, STATE)
    result["language_requested"] = req.lang
    result["diagnostic"] = False
    result["disclaimer"] = "Symptom matching is approximate and educational; it is not a diagnosis. An unrecognised or empty description does not mean symptoms are absent."
    return result


@app.post("/triage")
def post_triage(req: TriageRequest) -> dict[str, Any]:
    if not STATE:
        load_state_from_disk()
    norm = normalise_text(req.text, STATE)
    known = set(STATE["concepts"].get("concepts", {}))
    supplied = req.chips + req.concepts
    accepted = [concept for concept in supplied if concept in known]
    rejected = list(dict.fromkeys(concept for concept in supplied if concept not in known))
    merged_concepts = list(dict.fromkeys(norm["concepts"] + accepted))
    merged_numbers = {**norm.get("numbers", {}), **req.answers}
    result = evaluate_triage(
        concepts=merged_concepts,
        numbers=merged_numbers,
        age=req.age,
        menarche_age=req.menarche_age,
        text=req.text,
        lang=req.lang,
        norm_meta=norm,
        state=STATE,
    )
    result["rejected_concept_ids"] = rejected
    result["language_requested"] = req.lang
    result["diagnostic"] = False
    result["disclaimer"] = (
        "This tool does not diagnose PCOS or any other condition. Symptom matching may be wrong. "
        "Use the guidance as educational information and contact a qualified healthcare professional "
        "for assessment. If symptoms feel severe or rapidly worsen, seek urgent medical help."
    )
    return result
