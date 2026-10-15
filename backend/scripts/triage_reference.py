"""
Deterministic triage & pattern evaluation engine.
Implements Items 1-8, 11, and 15 (unified README + Member C contract).
"""
from typing import Any

CARE_PRIORITY = {
    "unrecognised": 0,
    "self_track": 1,
    "see_soon": 2,
    "urgent": 3,
    "emergency": 4,
}

PATTERN_ORDER = {
    "none": 0,
    "weak": 1,
    "partial": 2,
    "strong": 3,
}

# Draft patient-facing copy. Regional translations must be checked by native
# speakers and clinical reviewers before production use.
CARE_GUIDANCE = {
    "en": {
        "unrecognised": "I could not confidently match that description. Try describing the symptom, when it started, and how it affects you. Do not treat a failed match as reassurance.",
        "self_track": "If symptoms are mild and stable, you may record dates, duration, and changes. Arrange medical advice if symptoms persist, recur, worry you, or affect daily life.",
        "see_soon": "Arrange an appointment with a qualified healthcare professional soon, especially if symptoms are new, persistent, or changing.",
        "urgent": "Seek same-day urgent medical assessment. Do not wait for this tool to interpret the symptoms.",
        "emergency": "Seek emergency medical care now or contact your local emergency service. Do not delay care to use this tool.",
    },
    "hi": {
        "unrecognised": "मैं इस विवरण को भरोसे के साथ समझ नहीं पाया। लक्षण, कब शुरू हुआ और इसका आप पर क्या असर है—यह बताकर दोबारा लिखें। मिलान न होना यह साबित नहीं करता कि सब ठीक है।",
        "self_track": "यदि लक्षण हल्के और स्थिर हैं, तो तारीख, अवधि और बदलाव लिख सकती हैं। लक्षण बने रहें, लौटें, चिंता हो या रोज़मर्रा के काम प्रभावित हों, तो स्वास्थ्यकर्मी से सलाह लें।",
        "see_soon": "जल्द ही योग्य स्वास्थ्यकर्मी से अपॉइंटमेंट लें, खासकर यदि लक्षण नए हैं, बने हुए हैं या बदल रहे हैं।",
        "urgent": "आज ही तत्काल चिकित्सकीय जाँच कराएँ। लक्षणों की व्याख्या के लिए इस टूल का इंतज़ार न करें।",
        "emergency": "अभी आपातकालीन चिकित्सा सहायता लें या स्थानीय आपात सेवा से संपर्क करें। इस टूल के कारण मदद लेने में देरी न करें।",
    },
    "kn": {
        "unrecognised": "ಈ ವಿವರಣೆಯನ್ನು ಖಚಿತವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಲಕ್ಷಣ, ಅದು ಯಾವಾಗ ಆರಂಭವಾಯಿತು ಮತ್ತು ಅದರ ಪರಿಣಾಮವನ್ನು ವಿವರಿಸಿ ಮತ್ತೆ ಬರೆಯಿರಿ. ಹೊಂದಾಣಿಕೆ ಸಿಗದಿರುವುದು ಎಲ್ಲವೂ ಸರಿಯಿದೆ ಎಂಬುದಕ್ಕೆ ಸಾಕ್ಷಿಯಲ್ಲ.",
        "self_track": "ಲಕ್ಷಣಗಳು ಸೌಮ್ಯವಾಗಿದ್ದು ಬದಲಾಗದಿದ್ದರೆ ದಿನಾಂಕ, ಅವಧಿ ಮತ್ತು ಬದಲಾವಣೆಗಳನ್ನು ದಾಖಲಿಸಬಹುದು. ಲಕ್ಷಣಗಳು ಮುಂದುವರಿದರೆ, ಮತ್ತೆ ಬಂದರೆ, ಚಿಂತೆ ಉಂಟುಮಾಡಿದರೆ ಅಥವಾ ದೈನಂದಿನ ಜೀವನಕ್ಕೆ ಅಡ್ಡಿಯಾದರೆ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
        "see_soon": "ವಿಶೇಷವಾಗಿ ಲಕ್ಷಣಗಳು ಹೊಸದಾಗಿದ್ದರೆ, ಮುಂದುವರಿದರೆ ಅಥವಾ ಬದಲಾಗುತ್ತಿದ್ದರೆ, ಶೀಘ್ರದಲ್ಲೇ ಅರ್ಹ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರೊಂದಿಗೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮಾಡಿ.",
        "urgent": "ಇಂದೇ ತುರ್ತು ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಮಾಪನ ಪಡೆಯಿರಿ. ಲಕ್ಷಣಗಳನ್ನು ಈ ಸಾಧನ ಅರ್ಥೈಸುವವರೆಗೆ ಕಾಯಬೇಡಿ.",
        "emergency": "ಈಗಲೇ ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ ಅಥವಾ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಈ ಸಾಧನ ಬಳಸುವುದರಿಂದ ಸಹಾಯ ಪಡೆಯುವುದನ್ನು ವಿಳಂಬಿಸಬೇಡಿ.",
    },
    "ta": {
        "unrecognised": "இந்த விளக்கத்தை நம்பகமாகப் பொருத்த முடியவில்லை. அறிகுறி, அது எப்போது தொடங்கியது, அதன் தாக்கம் ஆகியவற்றைச் சொல்லி மீண்டும் எழுதுங்கள். பொருத்தம் கிடைக்காதது எல்லாம் சரி என்பதற்கான உறுதி அல்ல.",
        "self_track": "அறிகுறிகள் லேசாகவும் மாறாமலும் இருந்தால் தேதிகள், கால அளவு, மாற்றங்களைப் பதிவு செய்யலாம். அவை நீடித்தால், மீண்டும் வந்தால், கவலை அளித்தால் அல்லது அன்றாட வாழ்க்கையைப் பாதித்தால் சுகாதார நிபுணரிடம் ஆலோசனை பெறுங்கள்.",
        "see_soon": "குறிப்பாக அறிகுறிகள் புதிதாக இருந்தால், நீடித்தால் அல்லது மாறினால், விரைவில் தகுதியான சுகாதார நிபுணரைச் சந்திக்கவும்.",
        "urgent": "இன்றே அவசர மருத்துவ மதிப்பீடு பெறுங்கள். அறிகுறிகளை இந்தக் கருவி விளக்கும் வரை காத்திருக்க வேண்டாம்.",
        "emergency": "உடனடியாக அவசர மருத்துவ உதவியைப் பெறுங்கள் அல்லது உள்ளூர் அவசர சேவையைத் தொடர்புகொள்ளுங்கள். இந்தக் கருவியைப் பயன்படுத்துவதால் உதவி பெறுவதைத் தாமதிக்க வேண்டாம்.",
    },
}


def get_care_guidance(care_level: str, lang: str) -> str:
    """Return clear next-step guidance; fallback to English for unsupported copy."""
    language = lang if lang in CARE_GUIDANCE else "en"
    return CARE_GUIDANCE.get(language, CARE_GUIDANCE["en"]).get(
        care_level, CARE_GUIDANCE["en"]["see_soon"]
    )

def check_intent_guard(text: str, guard_cfg: dict) -> dict[str, bool]:
    low = (text or "").lower()
    exact_hit = any(p in low for p in guard_cfg.get("exact_phrases", []))
    has_pcos = any(t in low for t in guard_cfg.get("pcos_terms", []))
    has_cue = any(c in low for c in guard_cfg.get("demand_cues", []))
    med_hit = any(m in low for m in guard_cfg.get("medication_terms", []))
    triggered = exact_hit or (has_pcos and has_cue) or med_hit
    return {
        "intent_guard_triggered": triggered,
        "medication_guard_triggered": med_hit,
    }

def evaluate_triage(
    concepts: list[str],
    numbers: dict[str, int] | None = None,
    age: int | None = None,
    menarche_age: int | None = None,
    text: str = "",
    lang: str = "en",
    norm_meta: dict[str, Any] | None = None,
    state: dict[str, Any] | None = None,
) -> dict[str, Any]:
    numbers = dict(numbers or {})
    if age is not None:
        numbers["age"] = age
    if menarche_age is not None:
        numbers["menarche_age"] = menarche_age
    if "age" in numbers and "menarche_age" in numbers and "years_since_first_period" not in numbers:
        if numbers["age"] >= numbers["menarche_age"]:
            numbers["years_since_first_period"] = numbers["age"] - numbers["menarche_age"]

    active = list(dict.fromkeys(concepts))

    # Enforce Item 4 & Item 8 (gynaecological age <= 3 or numeric age > 19 override)
    yrs_since = numbers.get("years_since_first_period")
    num_age = numbers.get("age")
    if yrs_since is not None:
        if yrs_since <= 3:
            if "teen_age" not in active:
                active.append("teen_age")
        else:
            active = [c for c in active if c != "teen_age"]
    elif num_age is not None:
        if num_age <= 19:
            if "teen_age" not in active:
                active.append("teen_age")
        else:
            active = [c for c in active if c != "teen_age"]

    rules_cfg = state["rules"]
    templates_cfg = state["templates"]
    guard_info = check_intent_guard(text, state["intent_guard"])

    low_confidence = False
    did_you_mean: list[dict[str, Any]] = []
    if norm_meta is not None:
        low_confidence = bool(norm_meta.get("low_confidence", False)) and len(active) == 0
        did_you_mean = norm_meta.get("did_you_mean", [])
    elif text.strip() and len(active) == 0:
        low_confidence = True

    # Item 5: If unrecognised non-empty text and no chips, show "we couldn't understand" instead of a silent care card
    if low_confidence and len(active) == 0:
        msg = templates_cfg["unrecognised_input"].get(lang, templates_cfg["unrecognised_input"]["en"])
        lines = [msg]
        if guard_info["intent_guard_triggered"]:
            lines.insert(0, templates_cfg["intent_guard_banner"].get(lang, templates_cfg["intent_guard_banner"]["en"]))
        return {
            "concepts": [],
            "numbers": numbers,
            "care_level": "unrecognised",
            "pattern": "none",
            "pattern_suppressed": False,
            "triggered_red_flags": [],
            "red_flag_concepts": [],
            "confounders": [],
            "intent_guard": guard_info["intent_guard_triggered"],
            "medication_guard": guard_info["medication_guard_triggered"],
            "low_confidence": True,
            "did_you_mean": did_you_mean,
            "doctor_questions": [],
            "summary_lines": lines,
            "care_guidance": get_care_guidance("unrecognised", lang),
            "suppression_reason": "diagnosis_request" if guard_info["intent_guard_triggered"] else None,
            # Member C contract adapter keys (Item 15)
            "chips": [],
            "answers": numbers,
            "urgency": "unrecognised",
            "lines": lines,
        }

    # Evaluate Red Flag Rules (Items 2, 3, 7)
    triggered_rfs: list[dict[str, Any]] = []
    rf_concepts: set[str] = set()
    # A direct diagnosis/medication request hides the pattern from the user,
    # but the underlying symptom rules still determine an appropriate care level.
    # Red flags independently suppress pattern evaluation/display.
    suppress_pattern = False
    hide_pattern = bool(guard_info["intent_guard_triggered"])
    care_level = "self_track"

    for rf in rules_cfg.get("red_flag_rules", []):
        req_all = rf.get("requires_all", [])
        req_any = rf.get("requires_any", [])
        if all(c in active for c in req_all) and (not req_any or any(c in active for c in req_any)):
            triggered_rfs.append(rf)
            for c in req_all:
                rf_concepts.add(c)
            for c in req_any:
                if c in active:
                    rf_concepts.add(c)
            if rf.get("suppress_pattern", False):
                suppress_pattern = True
            if CARE_PRIORITY[rf["care_level"]] > CARE_PRIORITY[care_level]:
                care_level = rf["care_level"]

    # Evaluate PCOS Pattern Strength (Item 6)
    pattern = "none"
    if not suppress_pattern:
        for pr in rules_cfg.get("pattern_rules", []):
            req_all = pr.get("requires_all", [])
            req_any = pr.get("requires_any", [])
            if all(c in active for c in req_all) and (not req_any or any(c in active for c in req_any)):
                if PATTERN_ORDER[pr["pattern"]] > PATTERN_ORDER[pattern]:
                    pattern = pr["pattern"]
                if CARE_PRIORITY[pr["care_level"]] > CARE_PRIORITY[care_level]:
                    care_level = pr["care_level"]
                # Evaluate every matching rule; later rules may be stronger or
                # require a higher care level. PATTERN_ORDER chooses the maximum.

    # Prolonged absence of periods merits a clinician review even when the
    # phrase matcher only identifies irregular cycles. This is care guidance,
    # not a cause-specific diagnosis; pregnancy and other context still matter.
    if numbers.get("cycle_gap_months", 0) >= 3 or numbers.get("cycle_length_days", 0) >= 90:
        if CARE_PRIORITY["see_soon"] > CARE_PRIORITY[care_level]:
            care_level = "see_soon"

    # Apply Confounder Caps (Items 4, 8, 11)
    active_confounders: list[str] = []
    for cr in rules_cfg.get("confounder_rules", []):
        c_name = cr["concept"]
        if c_name in active:
            active_confounders.append(c_name)
            if not suppress_pattern and pattern != "none":
                cap = cr["cap_pattern_to"]
                if PATTERN_ORDER[pattern] > PATTERN_ORDER[cap]:
                    pattern = cap

    # Build Doctor Questions (Items 6 & 11)
    doc_questions = list(templates_cfg["doctor_questions"]["default"])
    if "acanthosis_nigricans" in active or "weight_gain" in active:
        doc_questions.append(templates_cfg["doctor_questions"]["metabolic"])
    for conf in ["thyroid_clues", "breastfeeding_or_galactorrhoea", "teen_age"]:
        if conf in active and conf in templates_cfg["doctor_questions"]:
            doc_questions.append(templates_cfg["doctor_questions"][conf])

    # Build Output Summary Lines
    lines: list[str] = []
    if guard_info["intent_guard_triggered"]:
        lines.append(templates_cfg["intent_guard_banner"].get(lang, templates_cfg["intent_guard_banner"]["en"]))
    for rf in triggered_rfs:
        lines.append(rf["reason"])
    if not suppress_pattern and not hide_pattern and pattern != "none":
        lines.append(f"Educational pattern strength: {pattern} (non-diagnostic).")

    return {
        # README schema keys
        "concepts": active,
        "numbers": numbers,
        "care_level": care_level,
        "pattern": "suppressed" if (suppress_pattern or hide_pattern) else pattern,
        "pattern_suppressed": bool(suppress_pattern or hide_pattern),
        "triggered_red_flags": [r["id"] for r in triggered_rfs],
        "red_flag_concepts": sorted(rf_concepts),
        "confounders": active_confounders,
        "intent_guard": guard_info["intent_guard_triggered"],
        "medication_guard": guard_info["medication_guard_triggered"],
        "low_confidence": bool(norm_meta.get("low_confidence", False)) if norm_meta else False,
        "did_you_mean": norm_meta.get("did_you_mean", []) if norm_meta else [],
        "doctor_questions": doc_questions,
        "summary_lines": lines,
        "care_guidance": get_care_guidance(care_level, lang),
        "suppression_reason": "diagnosis_request" if hide_pattern else ("red_flag" if suppress_pattern else None),
        # Member C agreed contract keys (Item 15)
        "chips": active,
        "answers": numbers,
        "urgency": care_level,
        "lines": lines,
    }
