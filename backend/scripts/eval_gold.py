"""
Evaluates gold_set.json and holdout_unseen.json.
Item 12: Reports concept-level red-flag recall and exits with code 1 if ANY expected
red-flag concept is missed.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app import load_state_from_disk
from scripts.baseline_matcher import normalise_text
from scripts.triage_reference import evaluate_triage

ROOT_DIR = Path(__file__).resolve().parent.parent

def run_eval(dataset_path: Path) -> tuple[int, int, list[str]]:
    state = load_state_from_disk()
    items = json.loads(dataset_path.read_text(encoding="utf-8"))
    passed = 0
    rf_misses: list[str] = []
    failures: list[str] = []

    for item in items:
        norm = normalise_text(item["text"], state)
        res = evaluate_triage(
            concepts=norm["concepts"],
            numbers=norm["numbers"],
            text=item["text"],
            norm_meta=norm,
            state=state,
        )
        expected_rfs = set(item.get("expected_red_flag_concepts", []))
        found_rfs = set(res.get("red_flag_concepts", []))
        missing_rfs = expected_rfs - found_rfs
        if missing_rfs:
            rf_misses.append(f"{item['id']}: missed red-flag concepts {sorted(missing_rfs)} (got {sorted(found_rfs)})")

        expected_concepts = set(item.get("expected_concepts", []))
        found_concepts = set(res.get("concepts", []))
        care_ok = res["care_level"] == item["expected_care_level"]
        concepts_ok = expected_concepts.issubset(found_concepts)
        if care_ok and concepts_ok and not missing_rfs:
            passed += 1
        else:
            message = f"{item['id']} | care={res['care_level']} (exp {item['expected_care_level']}) | concepts={sorted(found_concepts)} (expected at least {sorted(expected_concepts)})"
            failures.append(message)
            print(f"[FAIL] {message}")

    return passed, len(items), rf_misses, failures

if __name__ == "__main__":
    all_rf_misses = []
    all_failures = []
    for name in ["gold/gold_set.json", "gold/holdout_unseen.json"]:
        p, total, misses, failures = run_eval(ROOT_DIR / name)
        print(f"Dataset {name}: {p}/{total} passed ({100.0 * p / total:.1f}%)")
        all_rf_misses.extend(misses)
        all_failures.extend(failures)

    if all_rf_misses or all_failures:
        print("\n[CI HARD FAILURE] One or more evaluation examples failed.")
        for m in all_rf_misses:
            print("  - Red-flag miss:", m)
        for m in all_failures:
            print("  - Evaluation failure:", m)
        sys.exit(1)
    print("\n[CI PASS] All included evaluation examples passed. This is not clinical validation.")
