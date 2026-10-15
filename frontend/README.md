# Deha-Chitra frontend

React, TypeScript and Vite interface for the Deha-Chitra symptom-to-care prototype.

## Run locally

Requirements: Node.js.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` if the backend is not at `http://localhost:8000`, then set `VITE_API_BASE_URL` to its URL.
3. Start the backend separately (see `../backend/README.md`).
4. Run `npm run dev` and open the URL printed by Vite (normally `http://localhost:3000`).

The symptom translator sends descriptions to the backend's `/normalise` and `/triage` endpoints. The browser does not persist symptom text. This prototype is educational, not a diagnosis or substitute for clinical care.
