# Nova GSK — Combined Repository

This repository combines the Nova GSK frontend, the Deha-Chitra FastAPI symptom-to-care backend and its local JSON data, plus the separate earlier Sakhi prototype.

## Repository layout

- `frontend/` — React, TypeScript and Vite website.
- `backend/` — FastAPI service, rule/data JSON files, tests and quality scripts.
- `prototype-sakhi/` — earlier standalone React/Vite Sakhi prototype, kept separate because it is a different UI and package setup.

## Run the integrated website locally

Requirements: Node.js and Python 3.10+ (Python 3.11+ recommended). Start the backend and frontend in separate terminals.

Backend terminal:

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Frontend terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally http://localhost:3000). The frontend uses `VITE_API_BASE_URL` from `frontend/.env.local`, defaulting to `http://localhost:8000`. The backend allows the local frontend origin by default. API docs: http://127.0.0.1:8000/docs.

The backend uses versioned local JSON datasets in `backend/data/` by default. MongoDB Atlas is optional; copy `backend/.env.example` to `backend/.env` and configure `MONGODB_URI` only if you want the optional database overlay. Keep `.env` files untracked.

## Run the earlier Sakhi prototype (optional)

```bash
cd prototype-sakhi
npm install
npm run dev
```

## Backend endpoints

- `GET /health`
- `GET /ready`
- `POST /normalise`
- `POST /triage`

The main frontend calls `/normalise` and `/triage` for symptom matching and care guidance. Its service status indicator checks `/ready`. For separate deployments, set `VITE_API_BASE_URL` to the backend HTTPS URL and set backend `CORS_ORIGINS` to the exact frontend origin. The Sakhi prototype remains a separate standalone mock.

## Health and privacy disclaimer

This is a student prototype, not a medical device or clinically validated decision-support system. It must not be used to diagnose, rule out a condition, or delay urgent care. Review clinical guidance and translations with qualified professionals before real-world use. Avoid logging or storing raw symptom text, use HTTPS, and restrict production access appropriately.
