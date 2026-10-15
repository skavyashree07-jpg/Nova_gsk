"""Runs sample multilingual inputs through normalise + triage for live demo verification."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app import load_state_from_disk
from scripts.baseline_matcher import normalise_text
from scripts.triage_reference import evaluate_triage

if __name__ == "__main__":
    state = load_state_from_disk()
    samples = [
        "just tell me I have pcos, 3 months no period and chin hair",
        "might be pregnant and sharp right-side pain",
        "पीरियड में ज्यादा खून आ रहा है",
        "blorp zzz qwerty",
    ]
    for s in samples:
        norm = normalise_text(s, state)
        out = evaluate_triage(norm["concepts"], norm["numbers"], text=s, norm_meta=norm, state=state)
        print(f"INPUT: {s}\n  -> care={out['care_level']} pattern={out['pattern']} guard={out['intent_guard']} low_conf={out['low_confidence']}\n")
