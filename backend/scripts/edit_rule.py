"""CLI helper to record reviewer sign-off in data/rules.json."""
import json
import sys
from pathlib import Path

RULES_PATH = Path(__file__).resolve().parent.parent / "data" / "rules.json"

def mark_reviewed(item_key: str, reviewer: str, decision: str):
    data = json.loads(RULES_PATH.read_text(encoding="utf-8"))
    if item_key in data.get("review_status", {}):
        data["review_status"][item_key]["status"] = decision
        data["review_status"][item_key]["reviewed_by"] = reviewer
        RULES_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"Updated {item_key} -> {decision} by {reviewer}")

if __name__ == "__main__":
    if len(sys.argv) == 4:
        mark_reviewed(sys.argv[1], sys.argv[2], sys.argv[3])
