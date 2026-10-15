"""
Multilingual & code-mixed symptom matcher with:
- Pre- and post-concept negation window (Item 9)
- Unilateral pain proximity pattern (Item 3)
- rapidfuzz per-length typo matching with antonym guard (Item 10)
- Numeric age / menarche extraction & teen_age override (Item 4)
- Low-confidence & top-3 did_you_mean suggestions when no exact matches exist (Item 5)
"""
import re
from typing import Any
from rapidfuzz import fuzz, process

SIDE_WORDS = r"(?:right|left|one[\s-]+side|एक\s+तरफ|दाएं|बाएं|ಬಲ|ಎಡ|வலது|இடது)"
PAIN_WORDS = r"(?:pain|ache|sharp|stabbing|cramp|दर्द|ನೋವು|வலி)"
UNILATERAL_PROXIMITY_RE = re.compile(
    rf"\b(?:{SIDE_WORDS}\W+(?:\w+\W+){{0,5}}?{PAIN_WORDS}|{PAIN_WORDS}\W+(?:\w+\W+){{0,5}}?{SIDE_WORDS})\b",
    re.IGNORECASE
)

def _clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())

def _is_negated(cleaned: str, start: int, end: int, neg_cfg: dict, allow_negated: bool = False) -> bool:
    if allow_negated:
        return False
    pre_window = cleaned[max(0, start - 45):start].strip()
    post_window = cleaned[end:min(len(cleaned), end + 45)].strip()

    # Check post-cues first ("acne is not there", "pimples nahi hai")
    for cue in neg_cfg.get("post_cues", []):
        if post_window.startswith(cue) or re.search(rf"^(\W*\w+){{0,2}}\W*\b{re.escape(cue)}\b", post_window):
            return True

    # Check pre-cues ("no acne", "without facial hair")
    # Negation should attach to the nearest clause, not every later symptom.
    # Example: "no period and chin hair" negates period, not chin hair.
    clause_parts = re.split(
        r"\b(?:and|but|or|also|और|लेकिन|तथा|ಮತ್ತು|ಆದರೆ|ಅಥವಾ|மற்றும்|ஆனால்|அல்லது|matte)\b|[,;]",
        pre_window,
        flags=re.IGNORECASE,
    )
    nearest_clause = clause_parts[-1] if clause_parts else pre_window
    pre_tokens = nearest_clause.split()[-neg_cfg.get("window_tokens", 4):]
    pre_tail = " ".join(pre_tokens)
    for cue in neg_cfg.get("pre_cues", []):
        if re.search(rf"(?<!\w){re.escape(cue)}(?!\w)", pre_tail):
            return True
    return False

def _violates_antonym_guard(token: str, candidate: str, antonym_pairs: list[list[str]]) -> bool:
    for a, b in antonym_pairs:
        if (token == a and candidate == b) or (token == b and candidate == a):
            return True
        if (a in token and b in candidate) or (b in token and a in candidate):
            return True
    return False

def extract_numbers(text: str, num_cfg: dict) -> dict[str, int]:
    numbers: dict[str, int] = {}
    low = text.lower()
    for field, patterns in [
        ("age", num_cfg.get("age_patterns", [])),
        ("menarche_age", num_cfg.get("menarche_age_patterns", [])),
        ("years_since_first_period", num_cfg.get("years_since_menarche_patterns", [])),
        ("cycle_gap_months", num_cfg.get("cycle_gap_months_patterns", [])),
        ("cycle_length_days", num_cfg.get("cycle_length_days_patterns", [])),
        ("bleeding_days", num_cfg.get("bleeding_days_patterns", [])),
    ]:
        for pat in patterns:
            m = re.search(pat, low)
            if m:
                try:
                    numbers[field] = int(m.group(1))
                    break
                except ValueError:
                    pass
    if "age" in numbers and "menarche_age" in numbers and "years_since_first_period" not in numbers:
        diff = numbers["age"] - numbers["menarche_age"]
        if diff >= 0:
            numbers["years_since_first_period"] = diff
    return numbers

def build_surface_index(concepts_cfg: dict) -> dict[str, str]:
    surface_map: dict[str, str] = {}
    for cid, meta in concepts_cfg.get("concepts", {}).items():
        for phrase in meta.get("surface_forms", []):
            surface_map[phrase.lower()] = cid
    return surface_map

def get_did_you_mean(text: str, surface_map: dict[str, str], top_k: int = 3) -> list[dict[str, Any]]:
    cleaned = _clean_text(text)
    if not cleaned:
        return []
    matches = process.extract(cleaned, list(surface_map.keys()), scorer=fuzz.WRatio, limit=top_k * 4)
    seen = set()
    suggestions = []
    for phrase, score, _ in matches:
        cid = surface_map[phrase]
        if cid not in seen and score >= 45.0:
            seen.add(cid)
            suggestions.append({
                "concept": cid,
                "matched_phrase": phrase,
                "score": round(float(score), 1)
            })
        if len(suggestions) >= top_k:
            break
    return suggestions

def normalise_text(text: str, state: dict) -> dict[str, Any]:
    cleaned = _clean_text(text)
    concepts_cfg = state["concepts"]
    neg_cfg = state["negation"]
    num_cfg = state["number_patterns"]
    antonym_pairs = concepts_cfg.get("antonym_guards", [])

    exact_concepts: list[str] = []
    fuzzy_concepts: list[str] = []
    matched_spans: list[dict[str, Any]] = []

    # 1. Exact phrase matching with pre/post negation check
    for cid, meta in concepts_cfg.get("concepts", {}).items():
        allow_neg = meta.get("allow_negated_trigger", False)
        for form in meta.get("surface_forms", []):
            form_low = form.lower()
            # Examine every occurrence: a negated first mention must not hide a
            # later affirmed mention (e.g. "no acne before, but acne now").
            start = 0
            while form_low and (idx := cleaned.find(form_low, start)) != -1:
                end_idx = idx + len(form_low)
                start = idx + 1
                if not _is_negated(cleaned, idx, end_idx, neg_cfg, allow_negated=allow_neg):
                    if cid not in exact_concepts:
                        exact_concepts.append(cid)
                    if not any(span["concept"] == cid and span["surface"] == form_low for span in matched_spans):
                        matched_spans.append({"concept": cid, "surface": form_low, "match_type": "exact"})
                    break

    # 2. Proximity pattern for unilateral pelvic pain (Item 3)
    if "unilateral_pelvic_pain" not in exact_concepts and UNILATERAL_PROXIMITY_RE.search(cleaned):
        exact_concepts.append("unilateral_pelvic_pain")
        matched_spans.append({"concept": "unilateral_pelvic_pain", "surface": "side+pain_proximity", "match_type": "proximity"})

    # 3. Number extraction & numeric rules (Item 4 & 8)
    numbers = extract_numbers(cleaned, num_cfg)
    if numbers.get("cycle_gap_months", 0) >= 2 or numbers.get("cycle_length_days", 0) > 35:
        if "irregular_cycles" not in exact_concepts:
            exact_concepts.append("irregular_cycles")
    if numbers.get("bleeding_days", 0) >= 10:
        if "heavy_bleeding" not in exact_concepts:
            exact_concepts.append("heavy_bleeding")

    # 4. Short-word & token-level rapidfuzz matching with per-length threshold (Item 10)
    words = re.findall(r"[a-zA-Zऀ-ॿಀ-೿஀-௿]+", cleaned)
    for cid, meta in concepts_cfg.get("concepts", {}).items():
        if cid in exact_concepts or cid == "teen_age":
            continue
        allow_neg = meta.get("allow_negated_trigger", False)
        for form in meta.get("surface_forms", []):
            form_low = form.lower()
            form_tokens = form_low.split()
            if len(form_tokens) == 1:
                lex_tok = form_tokens[0]
                n = len(lex_tok)
                if n < 5:
                    continue
                threshold = 84.0 if n <= 7 else 80.0
                for w in words:
                    if len(w) < 5 or _violates_antonym_guard(w, lex_tok, antonym_pairs):
                        continue
                    score = fuzz.ratio(w, lex_tok)
                    if score >= threshold:
                        pos = cleaned.find(w)
                        if not _is_negated(cleaned, pos, pos + len(w), neg_cfg, allow_negated=allow_neg):
                            if cid not in fuzzy_concepts:
                                fuzzy_concepts.append(cid)
                            matched_spans.append({"concept": cid, "surface": w, "target": lex_tok, "match_type": "fuzzy", "score": round(score, 1)})
                            break

    all_concepts = list(dict.fromkeys(exact_concepts + fuzzy_concepts))

    # 5. Numeric age / years_since_first_period overrides text teen_age (Item 4 & 8)
    yrs_since = numbers.get("years_since_first_period")
    num_age = numbers.get("age")
    if yrs_since is not None:
        if yrs_since <= 3:
            if "teen_age" not in all_concepts:
                all_concepts.append("teen_age")
        else:
            all_concepts = [c for c in all_concepts if c != "teen_age"]
            exact_concepts = [c for c in exact_concepts if c != "teen_age"]
    elif num_age is not None:
        if num_age <= 19:
            if "teen_age" not in all_concepts:
                all_concepts.append("teen_age")
        else:
            all_concepts = [c for c in all_concepts if c != "teen_age"]
            exact_concepts = [c for c in exact_concepts if c != "teen_age"]

    # 6. No silent "nothing found" (Item 5)
    surface_map = build_surface_index(concepts_cfg)
    has_non_empty_text = bool(cleaned)
    # Empty input is not evidence that symptoms are absent. Mark it as
    # unrecognised so the API cannot silently imply that self-monitoring is enough.
    low_confidence = (not has_non_empty_text) or (len(exact_concepts) == 0)
    did_you_mean = get_did_you_mean(cleaned, surface_map, top_k=3) if (low_confidence and has_non_empty_text) else []

    return {
        "concepts": all_concepts,
        "exact_concepts": exact_concepts,
        "fuzzy_concepts": fuzzy_concepts,
        "numbers": numbers,
        "matched_spans": matched_spans,
        "low_confidence": low_confidence,
        "did_you_mean": did_you_mean,
    }
