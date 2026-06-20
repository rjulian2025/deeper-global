import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_SAFETY_DISCLAIMER =
  'This information supports educational self-understanding only. It does not diagnose any condition and is not a substitute for evaluation by a qualified professional.';

const PILOT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../reports/semantic-enrichment/adhd-pilot-v1.json'
);

let pilotEnrichmentBySlug = null;

function loadPilotEnrichmentBySlug() {
  if (pilotEnrichmentBySlug) return pilotEnrichmentBySlug;
  pilotEnrichmentBySlug = {};

  try {
    if (!existsSync(PILOT_PATH)) return pilotEnrichmentBySlug;
    const payload = JSON.parse(readFileSync(PILOT_PATH, 'utf8'));
    for (const item of payload.items ?? []) {
      const result = validateSemanticEnrichmentV1(item.semantic_enrichment_v1);
      if (result.enrichment) {
        pilotEnrichmentBySlug[item.slug] = result.enrichment;
      }
    }
  } catch {
    pilotEnrichmentBySlug = {};
  }

  return pilotEnrichmentBySlug;
}

function resolveSemanticEnrichment(question) {
  return parseQuestionSemanticEnrichment(question) ?? loadPilotEnrichmentBySlug()[question?.slug] ?? null;
}

export const INTENDED_NEXT_STEPS = [
  'self_education',
  'self_reflection',
  'professional_evaluation',
  'therapy',
  'crisis_support',
  'medical_consult',
  'relationship_support',
  'no_specific_next_step',
];

export const ENRICHMENT_STATUSES = [
  'not_started',
  'ai_generated',
  'human_reviewed',
  'clinically_reviewed',
  'needs_review',
];

export const FORBIDDEN_DIAGNOSTIC_PATTERNS = [
  /\byou have\b/i,
  /\byou are diagnosed\b/i,
  /\bthis means you\b/i,
  /\bdiagnosis engine\b/i,
  /\bdefinitely have\b/i,
  /\bconfirmed (?:adhd|depression|anxiety|ptsd|bipolar)\b/i,
];

function cleanString(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function cleanStringList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanString(item)).filter(Boolean);
}

export function scanForbiddenDiagnosticLanguage(enrichment) {
  const fieldsToScan = [
    enrichment.canonical_question,
    enrichment.safety_disclaimer,
    ...enrichment.alternate_questions,
    ...enrichment.emotional_phrasings,
    ...enrichment.possible_interpretations,
    ...enrichment.differential_considerations,
    ...enrichment.user_situations,
    ...enrichment.ai_prompt_variants,
  ];

  const warnings = [];
  for (const text of fieldsToScan) {
    for (const pattern of FORBIDDEN_DIAGNOSTIC_PATTERNS) {
      if (pattern.test(text)) {
        warnings.push(`Forbidden diagnostic pattern ${pattern} in: "${text.slice(0, 80)}"`);
      }
    }
  }
  return warnings;
}

export function validateSemanticEnrichmentV1(value) {
  const errors = [];
  if (!value || typeof value !== 'object') {
    return { valid: false, enrichment: null, errors: ['semantic_enrichment_v1 must be an object'], warnings: [] };
  }

  const raw = value;
  const canonical_question = cleanString(raw.canonical_question);
  if (!canonical_question) errors.push('canonical_question is required');

  const intended_next_step = cleanString(raw.intended_next_step);
  if (!INTENDED_NEXT_STEPS.includes(intended_next_step)) {
    errors.push(`intended_next_step must be one of: ${INTENDED_NEXT_STEPS.join(', ')}`);
  }

  const enrichment_status = cleanString(raw.enrichment_status);
  if (!ENRICHMENT_STATUSES.includes(enrichment_status)) {
    errors.push(`enrichment_status must be one of: ${ENRICHMENT_STATUSES.join(', ')}`);
  }

  const safety_disclaimer = cleanString(raw.safety_disclaimer);
  if (!safety_disclaimer) errors.push('safety_disclaimer is required');

  const enrichment_updated_at = cleanString(raw.enrichment_updated_at);
  if (!enrichment_updated_at) errors.push('enrichment_updated_at is required');

  const enrichment = {
    canonical_question,
    alternate_questions: cleanStringList(raw.alternate_questions),
    emotional_phrasings: cleanStringList(raw.emotional_phrasings),
    related_symptoms: cleanStringList(raw.related_symptoms),
    possible_interpretations: cleanStringList(raw.possible_interpretations),
    differential_considerations: cleanStringList(raw.differential_considerations),
    user_situations: cleanStringList(raw.user_situations),
    ai_prompt_variants: cleanStringList(raw.ai_prompt_variants),
    related_entities: cleanStringList(raw.related_entities),
    primary_hub: cleanString(raw.primary_hub),
    secondary_hubs: cleanStringList(raw.secondary_hubs),
    reviewer_id: cleanString(raw.reviewer_id) || null,
    intended_next_step,
    safety_disclaimer,
    enrichment_status,
    enrichment_updated_at,
  };

  if (errors.length) {
    return { valid: false, enrichment: null, errors, warnings: [] };
  }

  const warnings = scanForbiddenDiagnosticLanguage(enrichment);
  return { valid: warnings.length === 0, enrichment, errors, warnings };
}

export function parseQuestionSemanticEnrichment(question) {
  const raw = question?.semantic_enrichment_v1;
  if (!raw) return null;
  const result = validateSemanticEnrichmentV1(raw);
  return result.enrichment;
}

export function getSemanticEnrichmentForApi(question) {
  const enrichment = resolveSemanticEnrichment(question);
  if (!enrichment) return null;
  return {
    ...enrichment,
    semantic_boundary:
      'Educational semantic metadata for discovery and self-understanding. Does not diagnose the reader or replace professional evaluation.',
  };
}

export function getSemanticSearchHaystack(question) {
  const enrichment = resolveSemanticEnrichment(question);
  if (!enrichment) return '';

  return [
    enrichment.canonical_question,
    ...enrichment.alternate_questions,
    ...enrichment.emotional_phrasings,
    ...enrichment.user_situations,
    ...enrichment.related_symptoms,
    ...enrichment.possible_interpretations,
    ...enrichment.related_entities,
    ...enrichment.ai_prompt_variants,
  ].join(' ');
}
