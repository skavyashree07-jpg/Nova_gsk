# Deha-Chitra — Symptom-to-Care Backend

**Purpose:** convert everyday symptom descriptions—including selected regional-language and code-mixed phrases—into matched symptom concepts and non-diagnostic guidance about an appropriate next step. PCOS-related pattern output is educational only; it is not a diagnosis.

> **Important limitation:** this is a student prototype, not a medical device or clinical decision-support system. The rules, translations, and guidance have not been established as clinically validated. Do not use it to rule out a condition or delay care. A qualified clinician and native-language reviewers must review the content before any real-world deployment.

## Included capabilities

- FastAPI endpoints: `GET /health`, `GET /ready`, `POST /normalise`, `POST /triage`.
- Local JSON datasets for concepts/surface forms, number patterns, templates, negation, triage rules, and diagnosis/medication intent guards.
- English, Hindi, Kannada, Tamil, selected Romanised forms, and mixed-language input support based on explicit phrase dictionaries. This is **not** unrestricted translation or general multilingual understanding.
- Red-flag rules take priority over PCOS-pattern output; urgent/emergency rules can suppress pattern display.
- Unrecognised and empty text is surfaced as unrecognised instead of silently implying that no symptoms were found.
- Optional MongoDB Atlas rules overlay; local JSON rules remain the fallback if Atlas is unavailable or fails structural checks.
- Gold and holdout-style example datasets, automated tests, and validation/evaluation scripts.
- The API does not intentionally persist symptom text. Deployments should still use HTTPS, restrict access, and avoid logging request bodies.

## Run locally

Requires Python 3.10+ (Python 3.11+ recommended).

```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Open `http://127.0.0.1:8000/docs` for interactive API documentation.

## API examples

```bash
curl -X POST http://127.0.0.1:8000/normalise \
  -H "Content-Type: application/json" \
  -d '{"text":"irregular periods and chin hair","lang":"en"}'

curl -X POST http://127.0.0.1:8000/triage \
  -H "Content-Type: application/json" \
  -d '{"text":"I might be pregnant and having heavy bleeding","lang":"en"}'
```

`lang` accepts `en`, `hi`, `kn`, `ta`, `hi_rom`, `kn_rom`, or `mixed`. Specifying a language selects available response copy; it does not translate arbitrary input. Unsupported language codes are rejected.

## Configuration

Copy `.env.example` to `.env` if needed. `CORS_ORIGINS` should contain only the exact frontend origins you trust, separated by commas. Leave `MONGODB_URI` empty to use local data. If Atlas is configured, use a least-privilege database account and a URI with a default database; do not commit secrets.

## Quality checks

```bash
python scripts/validate_data.py
python scripts/eval_gold.py
pytest -q
```

- `validate_data.py` checks local dataset structure and references.
- `eval_gold.py` checks the included examples and fails when expected red-flag concepts are missed.
- `pytest` checks API contracts, input validation, safety behavior, and selected multilingual cases.

Passing these checks only demonstrates behavior on the included examples. It does **not** establish real-world sensitivity, specificity, translation quality, clinical safety, or readiness for public use. Keep a separate, human-reviewed test set that is not used to tune rules; report per-language results and false negatives before claiming performance.

## Safety and release checklist

1. Have a qualified clinician review each red-flag rule, care level, confounder, and patient-facing message.
2. Have native speakers review each language and code-mixed phrase; test dialects, spelling variation, negation, and ambiguous statements.
3. Evaluate on diverse, consented or appropriately synthetic examples that are separate from development examples; measure false negatives for urgent cases.
4. Add monitoring and a documented incident/rollback process. Never rely on a PCOS pattern score to diagnose, prescribe, or exclude other conditions.
5. Before deployment, configure HTTPS, authentication/rate limiting where appropriate, secrets management, minimal logging, and a privacy notice.

## Project status

Prototype version 2.2.0. It is designed to help users describe symptoms and understand possible next steps, not to determine what disease they have. A high project-quality rating requires reproducible tests, independent evaluation, and clinical/language review—not feature count alone.
