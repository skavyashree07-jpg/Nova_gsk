"""
Seeds `data/*.json` into MongoDB Atlas and verifies read/write permissions (Item 17).
Run: python3 scripts/seed.py
"""
import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def seed_atlas():
    uri = os.getenv("MONGODB_URI")
    if not uri:
        print("MONGODB_URI not set in environment or .env. Skipping live Atlas seed.")
        return 0
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.admin.command("ping")
        db = client.get_default_database()
        for name in ["concepts", "number_patterns", "templates", "negation", "rules", "intent_guard"]:
            payload = json.loads((DATA_DIR / f"{name}.json").read_text(encoding="utf-8"))
            col = db[name]
            col.replace_one({"_id": f"active_{name}"}, {"_id": f"active_{name}", **payload}, upsert=True)
            print(f"[OK] Seeded collection `{name}`")
        print("[SUCCESS] MongoDB Atlas cluster verified and seeded.")
        return 0
    except Exception as exc:
        print(f"[ERROR] Failed to seed MongoDB Atlas: {exc}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(seed_atlas())
