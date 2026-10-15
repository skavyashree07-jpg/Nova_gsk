"""
Comprehensive pytest suite (Item 14):
Covers all safety fixes (Items 1-5), clinical adjustments (Items 6-8),
matcher upgrades (Items 9-11), red-flag suppression of full patterns,
and FastAPI contract endpoints (Items 15-16).
"""
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app import app, load_state_from_disk
from scripts.baseline_matcher import normalise_text
from scripts.triage_reference import evaluate_triage

@pytest.fixture(scope="module")
def state():
    return load_state_from_disk()

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

# --- ITEM 1: Smarter PCOS Intent Guard ---
def test_item1_demo_line_just_tell_me_i_have_pcos(state):
    text = "just tell me I have pcos"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["intent_guard"] is True

def test_item1_multilingual_demand_cue_plus_pcos_term(state):
    text = "Nanage PCOD idya? confirm madtira?"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["intent_guard"] is True

# --- ITEM 2: Missing Red Flags (virilisation, thunderclap_headache, preg+bleeding) ---
def test_item2_virilisation_urgent_and_suppresses_pattern(state):
    text = "I have irregular periods, chin hair, and sudden deep voice"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert "virilisation" in res["concepts"]
    assert res["care_level"] == "urgent"
    assert res["pattern_suppressed"] is True
    assert res["pattern"] == "suppressed"

def test_item2_thunderclap_headache_emergency_and_suppresses(state):
    text = "missed periods, acne, and worst headache of my life"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert "thunderclap_headache" in res["concepts"]
    assert res["care_level"] == "emergency"
    assert res["pattern_suppressed"] is True

def test_item2_pregnancy_with_heavy_bleeding(state):
    text = "I might be pregnant and having heavy bleeding"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["care_level"] == "emergency"
    assert "RF_PREG_BLEEDING" in res["triggered_red_flags"]
    assert res["pattern_suppressed"] is True

# --- ITEM 3: Fix Red-Flag Misses (Devanagari heavy bleeding + unilateral pain proximity) ---
def test_item3_hindi_heavy_bleeding_jyada_khoon(state):
    text = "पीरियड में ज्यादा खून आ रहा है"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert "heavy_bleeding" in res["concepts"]
    assert res["care_level"] in ("urgent", "emergency")

def test_item3_ectopic_proximity_sharp_right_side_pain(state):
    text = "might be pregnant and sharp right-side pain"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert "pregnancy_possible" in res["concepts"]
    assert "unilateral_pelvic_pain" in res["concepts"]
    assert res["care_level"] == "emergency"
    assert res["pattern_suppressed"] is True

# --- ITEM 4 & 8: Numeric Age & Gynaecological Age Override teen_age ---
def test_item4_age_24_with_first_period_phrase_not_capped_to_teen(state):
    text = "I am 24 years old, my first period was at age 13, irregular periods and chin hair"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert "teen_age" not in res["concepts"]
    assert res["pattern"] == "strong"

def test_item8_age_19_seven_years_post_menarche_not_capped(state):
    text = "I am 19 years old, first period at 12, irregular cycles and facial hair"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["numbers"]["years_since_first_period"] == 7
    assert "teen_age" not in res["concepts"]
    assert res["pattern"] == "strong"

def test_item8_within_3_years_of_menarche_is_capped_to_weak(state):
    text = "I am 15 years old, first period at 13, irregular periods and chin hair"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert "teen_age" in res["concepts"]
    assert res["pattern"] == "weak"

# --- ITEM 5: No Silent "Nothing Found" ---
def test_item5_unrecognised_text_returns_low_confidence_and_did_you_mean(state):
    text = "irreguler peroidnd"
    norm = normalise_text(text, state)
    res = evaluate_triage([], {}, text=text, norm_meta={**norm, "low_confidence": True}, state=state)
    assert res["low_confidence"] is True
    assert res["care_level"] == "unrecognised"
    assert len(res["did_you_mean"]) <= 3

def test_item5_gibberish_never_returns_silent_self_track(state):
    text = "xyzzy qwerty blorp"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["low_confidence"] is True
    assert res["care_level"] == "unrecognised"

# --- ITEM 6 & 7: Clinical Updates (P_STRONG_B tightening & RF_DIZZY) ---
def test_item6_acne_plus_weight_and_dark_neck_is_partial_not_strong(state):
    text = "irregular periods, acne, weight gain, and dark neck"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["pattern"] == "partial"
    assert any("insulin" in q.lower() for q in res["doctor_questions"])

def test_item7_dizziness_alone_is_see_soon_without_suppression(state):
    text = "feeling dizzy, irregular periods and chin hair"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["care_level"] == "see_soon"
    assert res["pattern_suppressed"] is False
    assert res["pattern"] == "strong"

def test_item7_dizziness_with_heavy_bleeding_is_emergency_with_suppression(state):
    text = "feeling dizzy and heavy bleeding with irregular periods and chin hair"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["care_level"] == "emergency"
    assert res["pattern_suppressed"] is True

# --- ITEM 9, 10, 11: Matcher Updates (Post-negation, short-word typos, galactorrhoea) ---
def test_item9_english_post_negation_acne_is_not_there(state):
    text = "irregular periods, but acne is not there and pimples are not there"
    norm = normalise_text(text, state)
    assert "irregular_cycles" in norm["concepts"]
    assert "acne" not in norm["concepts"]

def test_item10_short_word_typo_pimpels_matched_with_antonym_guard(state):
    norm = normalise_text("I have pimpels on my face", state)
    assert "acne" in norm["concepts"]
    # Antonym guard: "regular periods" must not fuzzy-match "irregular periods"
    norm_reg = normalise_text("I have regular periods", state)
    assert "irregular_cycles" not in norm_reg["concepts"]

def test_item11_breastfeeding_or_galactorrhoea_caps_pattern_and_adds_prolactin_question(state):
    text = "irregular periods, chin hair, and milky discharge from nipple"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert "breastfeeding_or_galactorrhoea" in res["concepts"]
    assert res["pattern"] == "partial"
    assert any("prolactin" in q.lower() for q in res["doctor_questions"])

# --- ITEM 15 & 16: FastAPI Contract Endpoints ---
def test_item15_and_16_fastapi_normalise_and_triage_unified_contract(client):
    r1 = client.post("/normalise", json={"text": "3 months no period and chin hair"})
    assert r1.status_code == 200
    assert "irregular_cycles" in r1.json()["concepts"]

    r2 = client.post("/triage", json={"text": "3 months no period and chin hair", "age": 23})
    assert r2.status_code == 200
    body = r2.json()
    # Both README keys and Member C contract keys present
    for key in ["concepts", "numbers", "care_level", "chips", "answers", "urgency", "lines"]:
        assert key in body
    assert body["care_level"] == body["urgency"] == "see_soon"
    assert body["pattern"] == "strong"


# --- Reliability, input validation, and non-diagnostic boundary ---
def test_diagnosis_request_suppresses_pattern_but_keeps_triage(state):
    text = "Do I have PCOS? irregular periods and chin hair"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["intent_guard"] is True
    assert res["pattern"] == "suppressed"
    assert res["pattern_suppressed"] is True
    assert res["suppression_reason"] == "diagnosis_request"
    assert res["care_guidance"]


def test_emergency_guidance_is_present_and_pattern_is_suppressed(state):
    text = "I might be pregnant and having heavy bleeding"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, norm_meta=norm, state=state)
    assert res["care_level"] == "emergency"
    assert "emergency" in res["care_guidance"].lower()
    assert res["pattern_suppressed"] is True


def test_regional_care_guidance_has_localized_copy(state):
    text = "पीरियड में ज्यादा खून आ रहा है"
    norm = normalise_text(text, state)
    res = evaluate_triage(norm["concepts"], norm["numbers"], text=text, lang="hi", norm_meta=norm, state=state)
    assert res["care_level"] in ("urgent", "emergency")
    assert res["care_guidance"]
    assert "medical" not in res["care_guidance"].lower()


def test_api_rejects_oversized_symptom_text(client):
    response = client.post("/normalise", json={"text": "x" * 4001})
    assert response.status_code == 422


def test_api_rejects_invalid_age_and_unknown_request_fields(client):
    assert client.post("/triage", json={"text": "period pain", "age": -1}).status_code == 422
    assert client.post("/triage", json={"text": "period pain", "unexpected": True}).status_code == 422


def test_api_filters_unknown_concept_ids_and_returns_disclaimer(client):
    response = client.post("/triage", json={"text": "irregular periods", "concepts": ["not_a_real_concept"]})
    assert response.status_code == 200
    body = response.json()
    assert body["rejected_concept_ids"] == ["not_a_real_concept"]
    assert body["disclaimer"]
    assert "not diagnose" in body["disclaimer"].lower()


def test_api_language_validation(client):
    assert client.post("/normalise", json={"text": "period pain", "lang": "kn"}).status_code == 200
    assert client.post("/normalise", json={"text": "period pain", "lang": "xx"}).status_code == 422


def test_readiness_endpoint_reports_loaded_data(client):
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json()["ready"] is True

# --- Additional safety/regression checks (v2.2.0) ---
def test_empty_text_is_not_misrepresented_as_self_track(state):
    norm = normalise_text("   ", state)
    assert norm["low_confidence"] is True
    assert norm["concepts"] == []
    res = evaluate_triage([], {}, text="   ", norm_meta=norm, state=state)
    assert res["care_level"] == "unrecognised"
    assert "not a diagnosis" not in res["care_guidance"].lower() or res["care_guidance"]


def test_api_empty_triage_returns_unrecognised_not_reassurance(client):
    response = client.post("/triage", json={"text": "   "})
    assert response.status_code == 200
    body = response.json()
    assert body["care_level"] == "unrecognised"
    assert body["diagnostic"] is False
    assert body["disclaimer"]


def test_api_contract_marks_outputs_non_diagnostic(client):
    normalise_response = client.post("/normalise", json={"text": "irregular periods"})
    triage_response = client.post("/triage", json={"text": "irregular periods"})
    assert normalise_response.status_code == 200
    assert triage_response.status_code == 200
    assert normalise_response.json()["diagnostic"] is False
    assert triage_response.json()["diagnostic"] is False


def test_api_rejects_invalid_answer_values_and_too_many_chips(client):
    assert client.post("/triage", json={"text": "period pain", "answers": {"days": 1201}}).status_code == 422
    assert client.post("/triage", json={"text": "period pain", "chips": ["x"] * 41}).status_code == 422


def test_negated_first_occurrence_does_not_hide_later_affirmed_symptom(state):
    norm = normalise_text("I had no acne before, but acne is present now", state)
    assert "acne" in norm["concepts"]
    assert any(span["concept"] == "acne" and span["match_type"] == "exact" for span in norm["matched_spans"])


def test_all_occurrences_negated_do_not_create_symptom(state):
    norm = normalise_text("acne is not there and pimples are not there", state)
    assert "acne" not in norm["concepts"]
