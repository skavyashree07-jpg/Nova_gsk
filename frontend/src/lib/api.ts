import type { LanguageCode } from '../types';

export interface MatchedSpan {
  concept: string;
  surface: string;
  match_type: string;
}

export interface SuggestedConcept {
  concept: string;
  matched_phrase: string;
  score: number;
}

export interface NormaliseResult {
  concepts: string[];
  matched_spans: MatchedSpan[];
  low_confidence: boolean;
  did_you_mean: SuggestedConcept[];
}

export interface TriageResult {
  concepts: string[];
  care_level: string;
  care_guidance: string;
  pattern: string;
  pattern_suppressed: boolean;
  triggered_red_flags: string[];
  red_flag_concepts: string[];
  doctor_questions: string[];
  summary_lines: string[];
  disclaimer: string;
  low_confidence: boolean;
}

export interface SymptomAnalysis {
  normalise: NormaliseResult;
  triage: TriageResult;
}

export class CareServiceError extends Error {
  constructor(message: string, readonly reachable: boolean) {
    super(message);
    this.name = 'CareServiceError';
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

const backendLanguages: Record<LanguageCode, string> = {
  en: 'en',
  hi: 'hi',
  hinglish: 'hi_rom',
  ta: 'ta',
  kn: 'kn',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isNormaliseResult(value: unknown): value is NormaliseResult {
  if (!isRecord(value)) return false;
  return (
    isStringArray(value.concepts) &&
    Array.isArray(value.matched_spans) &&
    value.matched_spans.every(
      (span) =>
        isRecord(span) &&
        typeof span.concept === 'string' &&
        typeof span.surface === 'string' &&
        typeof span.match_type === 'string',
    ) &&
    typeof value.low_confidence === 'boolean' &&
    Array.isArray(value.did_you_mean) &&
    value.did_you_mean.every(
      (suggestion) =>
        isRecord(suggestion) &&
        typeof suggestion.concept === 'string' &&
        typeof suggestion.matched_phrase === 'string' &&
        typeof suggestion.score === 'number',
    )
  );
}

function isTriageResult(value: unknown): value is TriageResult {
  if (!isRecord(value)) return false;
  return (
    isStringArray(value.concepts) &&
    typeof value.care_level === 'string' &&
    typeof value.care_guidance === 'string' &&
    typeof value.pattern === 'string' &&
    typeof value.pattern_suppressed === 'boolean' &&
    isStringArray(value.triggered_red_flags) &&
    isStringArray(value.red_flag_concepts) &&
    isStringArray(value.doctor_questions) &&
    isStringArray(value.summary_lines) &&
    typeof value.disclaimer === 'string' &&
    typeof value.low_confidence === 'boolean'
  );
}

async function postJson(path: string, body: Record<string, unknown>): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new CareServiceError(
      `Cannot reach the care service at ${apiBaseUrl}. Make sure the backend is running and VITE_API_BASE_URL is correct.`,
      false,
    );
  }

  const payload: unknown = await response.json();
  if (!response.ok) {
    const detail = isRecord(payload) ? payload.detail : undefined;
    const validationMessages = Array.isArray(detail)
      ? detail.flatMap((item) => isRecord(item) && typeof item.msg === 'string' ? [item.msg] : [])
      : [];
    const message = typeof detail === 'string'
      ? detail
      : validationMessages.length > 0
        ? validationMessages.join(' ')
        : `Care service returned HTTP ${response.status}.`;
    throw new CareServiceError(message, true);
  }
  return payload;
}

export async function analyzeSymptoms(text: string, language: LanguageCode): Promise<SymptomAnalysis> {
  const request = { text, lang: backendLanguages[language] };
  const [normaliseResponse, triageResponse] = await Promise.all([
    postJson('/normalise', request),
    postJson('/triage', request),
  ]);

  if (!isNormaliseResult(normaliseResponse) || !isTriageResult(triageResponse)) {
    throw new Error('The care service returned an unexpected response. Please try again.');
  }

  return { normalise: normaliseResponse, triage: triageResponse };
}

export async function checkCareService(): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/ready`);
  } catch {
    throw new Error(`Care service unavailable at ${apiBaseUrl}.`);
  }

  if (!response.ok) throw new Error(`Care service returned HTTP ${response.status}.`);
  const payload: unknown = await response.json();
  if (!isRecord(payload) || payload.ready !== true) {
    throw new Error('Care service is running but its reference data is not ready.');
  }
}
