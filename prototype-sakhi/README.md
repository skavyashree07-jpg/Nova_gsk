# Sakhi

A warm, private-first symptom reflection prototype built with React and Vite. The current analyzer uses local mock fixtures and rules; it does not diagnose or replace professional care.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5187/` after Vite starts. This app uses a dedicated port because `5173` is already serving another project in this workspace. Use a browser with Web Speech API support and microphone permission to try voice input. Text entry and the quick check-in remain available without speech support.

## What is included

- Instant UI language switching for English, Kannada, Hindi, Tamil and Telugu; speech recognition locale follows the selected language.
- Editable voice transcript with explicit “Looks right” confirmation before analysis.
- Mock `analyzeSymptoms(text, lang)` contract in `src/lib/analyze.js`, with six rule fixtures: irregular cycles/acne, heavy bleeding, dizziness or severe discomfort, cramps, acne, and vague input. Kannada and Hindi terms are included for mixed-language matching.
- Care level, plain-language explanation, doctor types, questions, follow-up prompt, cycle timeline and printable visit summary.
- Urgent-care panel when a red flag is matched, informational-only disclaimer, privacy note and an offline checkbox/cycle-length fallback.
- Responsive layout, reduced-motion support, keyboard focus styles and print styles.

## Failure cases handled

- Empty note and notes over 2,000 characters.
- Unsupported speech recognition, microphone permission denial, and speech recognition errors; the text box is focused as a fallback.
- 8-second analysis timeout with a retry action, and loading-state button disabling.
- Offline browser state with a form-based fallback.
- Unexpected render errors with a recovery boundary.

## Backend integration

Replace the mock implementation in `src/lib/analyze.js` with the API request and preserve its returned object shape. The UI only depends on `analyzeSymptoms(text, lang)` and can stay unchanged.

All user-facing UI strings are grouped in `src/lib/i18n.js`. The clinical content in the mock fixtures is currently English; localization of backend response content should be part of the eventual service contract.
