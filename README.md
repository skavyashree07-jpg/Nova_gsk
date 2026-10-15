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

## Deploy the frontend to GitHub Pages

The frontend is in `frontend/`, not the repository root. Do not deploy the repository root as a static site; that displays this README. The included `.github/workflows/deploy-frontend.yml` builds `frontend/` and publishes `frontend/dist` to GitHub Pages when changes are pushed to `main`.

In the repository's **Settings → Pages**, set the build and deployment source to **GitHub Actions**. After the workflow completes, the site URL is `https://skavyashree07-jpg.github.io/Nova_gsk/`.

GitHub Pages only hosts the static frontend; it cannot run the FastAPI backend. Deploy `backend/` separately to a Python-capable service, add a repository Actions variable named `VITE_API_BASE_URL` with that backend's public HTTPS base URL, and set the backend's `CORS_ORIGINS` to `https://skavyashree07-jpg.github.io`. Push a frontend change or manually run the deploy workflow again after adding the variable so the URL is included in the frontend build. Until then, the site will load but symptom analysis will report that the care service URL is not configured.

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
