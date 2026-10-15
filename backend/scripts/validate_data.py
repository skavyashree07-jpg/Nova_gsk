"""Validates JSON syntax and schema invariants across `data/*.json`."""
import json
import sys
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def main():
    concepts = json.loads((DATA_DIR / "concepts.json").read_text(encoding="utf-8"))["concepts"]
    rules = json.loads((DATA_DIR / "rules.json").read_text(encoding="utf-8"))
    for rf in rules["red_flag_rules"]:
        for c in rf["requires_all"] + rf["requires_any"]:
            assert c in concepts, f"Unknown concept {c} in rule {rf['id']}"
    print("[OK] All data files and concept references are valid.")

if __name__ == "__main__":
    main()
