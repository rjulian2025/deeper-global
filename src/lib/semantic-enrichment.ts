import type { Question } from './supabase';
import pilotPayload from '../../reports/semantic-enrichment/adhd-pilot-v1.json';

export const INTENDED_NEXT_STEPS = [
  'self_education',
  'self_reflection',
  'professional_evaluation',
  'therapy',
  'crisis_support',
  'medical_consult',
  'relationship_support',
  'no_specific_next_step',
] as const;

export const ENRICHMENT_STATUSES = [
  'not_started',
  'ai_generated',
  'human_reviewed',
  'clinically_reviewed',
  'needs_review',
] as const;

export type IntendedNextStep = (typeof INTENDED_NEXT_STEPS)[number];
export type EnrichmentStatus = (typeof ENRICHMENT_STATUSES)[number];

export type SemanticEnrichmentV1 = {
  canonical_question: string;
  alternate_questions: string[];
  emotional_phrasings: string[];
  related_symptoms: string[];
  possible_interpretations: string[];
  differential_considerations: string[];
  user_situations: string[];
  ai_prompt_variants: string[];
  related_entities: string[];
  primary_hub: string;
  secondary_hubs: string[];
  reviewer_id: string | null;
  intended_next_step: IntendedNextStep;
  safety_disclaimer: string;
  enrichment_status: EnrichmentStatus;
  enrichment_updated_at: string;
};

export const DEFAULT_SAFETY_DISCLAIMER =
  'This information supports educational self-understanding only. It does not diagnose any condition and is not a substitute for evaluation by a qualified professional.';

export const FORBIDDEN_DIAGNOSTIC_PATTERNS = [
  /\byou have\b/i,
  /\byou are diagnosed\b/i,
  /\bthis means you\b/i,
  /\bdiagnosis engine\b/i,
  /\bdefinitely have\b/i,
  /\bconfirmed (?:adhd|depression|anxiety|ptsd|bipolar)\b/i,
];

export const EXAMPLE_SEMANTIC_ENRICHMENT_V1: SemanticEnrichmentV1 = {
  canonical_question: "Why can't I get my life together?",
  alternate_questions: [
    'Why do I keep falling behind on everything?',
    'Why does adult life feel harder than it should?',
  ],
  emotional_phrasings: [
    "Why can't I get my shit together?",
    'Why do I feel lazy even when I care?',
    'Why do I keep disappointing myself?',
  ],
  related_symptoms: ['procrastination', 'overwhelm', 'shame after unfinished tasks'],
  possible_interpretations: [
    'executive dysfunction',
    'shame and self-criticism',
    'overwhelm',
    'anxiety',
    'burnout',
    'ADHD-related patterns',
  ],
  differential_considerations: [
    'ADHD',
    'anxiety disorders',
    'depression',
    'sleep problems',
    'trauma-related stress',
    'burnout',
  ],
  user_situations: [
    'adult falling behind on bills and chores despite effort',
    'high performer crashing after sustained stress',
  ],
  ai_prompt_variants: [
    'why cant I get my life together ADHD or lazy',
    'adult executive dysfunction symptoms',
  ],
  related_entities: ['executive-function', 'adhd', 'burnout'],
  primary_hub: '/adhd/',
  secondary_hubs: [],
  reviewer_id: null,
  intended_next_step: 'professional_evaluation',
  safety_disclaimer: DEFAULT_SAFETY_DISCLAIMER,
  enrichment_status: 'ai_generated',
  enrichment_updated_at: '2026-06-20T12:00:00.000Z',
};

const NEXT_STEP_LABELS: Record<IntendedNextStep, string> = {
  self_education: 'Learn more about this topic',
  self_reflection: 'Reflect on patterns that resonate with you',
  professional_evaluation: 'Consider a professional evaluation',
  therapy: 'Consider speaking with a therapist',
  crisis_support: 'Reach out for crisis support if you feel unsafe',
  medical_consult: 'Consider a medical consultation',
  relationship_support: 'Consider relationship or communication support',
  no_specific_next_step: 'Explore related answers at your own pace',
};

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function cleanStringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanString(item)).filter(Boolean);
}

export function scanForbiddenDiagnosticLanguage(enrichment: SemanticEnrichmentV1) {
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

  const warnings: string[] = [];

  for (const text of fieldsToScan) {
    for (const pattern of FORBIDDEN_DIAGNOSTIC_PATTERNS) {
      if (pattern.test(text)) {
        warnings.push(`Forbidden diagnostic pattern ${pattern} in: "${text.slice(0, 80)}"`);
      }
    }
  }

  return warnings;
}

export function validateSemanticEnrichmentV1(value: unknown): {
  valid: boolean;
  enrichment: SemanticEnrichmentV1 | null;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];

  if (!value || typeof value !== 'object') {
    return { valid: false, enrichment: null, errors: ['semantic_enrichment_v1 must be an object'], warnings: [] };
  }

  const raw = value as Record<string, unknown>;
  const canonical_question = cleanString(raw.canonical_question);
  if (!canonical_question) errors.push('canonical_question is required');

  const intended_next_step = cleanString(raw.intended_next_step) as IntendedNextStep;
  if (!INTENDED_NEXT_STEPS.includes(intended_next_step)) {
    errors.push(`intended_next_step must be one of: ${INTENDED_NEXT_STEPS.join(', ')}`);
  }

  const enrichment_status = cleanString(raw.enrichment_status) as EnrichmentStatus;
  if (!ENRICHMENT_STATUSES.includes(enrichment_status)) {
    errors.push(`enrichment_status must be one of: ${ENRICHMENT_STATUSES.join(', ')}`);
  }

  const safety_disclaimer = cleanString(raw.safety_disclaimer);
  if (!safety_disclaimer) errors.push('safety_disclaimer is required');

  const enrichment_updated_at = cleanString(raw.enrichment_updated_at);
  if (!enrichment_updated_at) errors.push('enrichment_updated_at is required');

  const enrichment: SemanticEnrichmentV1 = {
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

export function createSafeFallbackEnrichment(question: Pick<Question, 'question' | 'slug'>): SemanticEnrichmentV1 {
  const canonical = cleanString(question.question) || question.slug.replace(/-/g, ' ');
  const now = new Date().toISOString();

  return {
    canonical_question: canonical,
    alternate_questions: [],
    emotional_phrasings: [],
    related_symptoms: [],
    possible_interpretations: [],
    differential_considerations: [],
    user_situations: [],
    ai_prompt_variants: [],
    related_entities: [],
    primary_hub: '',
    secondary_hubs: [],
    reviewer_id: null,
    intended_next_step: 'self_education',
    safety_disclaimer: DEFAULT_SAFETY_DISCLAIMER,
    enrichment_status: 'not_started',
    enrichment_updated_at: now,
  };
}

export function getNextStepLabel(step: IntendedNextStep) {
  return NEXT_STEP_LABELS[step] ?? NEXT_STEP_LABELS.self_education;
}

export function getPublicSemanticEnrichment(enrichment: SemanticEnrichmentV1) {
  return {
    canonical_question: enrichment.canonical_question,
    alternate_questions: enrichment.alternate_questions,
    emotional_phrasings: enrichment.emotional_phrasings,
    related_concerns: enrichment.possible_interpretations,
    intended_next_step: enrichment.intended_next_step,
    intended_next_step_label: getNextStepLabel(enrichment.intended_next_step),
    safety_disclaimer: enrichment.safety_disclaimer,
    enrichment_status: enrichment.enrichment_status,
  };
}

export function getSemanticSearchTerms(enrichment: SemanticEnrichmentV1 | null | undefined) {
  if (!enrichment) return { high: [], medium: [], low: [] };

  return {
    high: [enrichment.canonical_question].filter(Boolean),
    medium: [
      ...enrichment.alternate_questions,
      ...enrichment.emotional_phrasings,
      ...enrichment.user_situations,
    ],
    low: [
      ...enrichment.related_entities,
      ...enrichment.possible_interpretations,
      ...enrichment.related_symptoms,
    ],
  };
}

const PILOT_ENRICHMENT_BY_SLUG: Record<string, SemanticEnrichmentV1> = Object.fromEntries(
  ((pilotPayload as { items?: Array<{ slug: string; semantic_enrichment_v1: SemanticEnrichmentV1 }> }).items ?? [])
    .map((item) => {
      const result = validateSemanticEnrichmentV1(item.semantic_enrichment_v1);
      return result.enrichment ? [item.slug, result.enrichment] as const : null;
    })
    .filter((entry): entry is [string, SemanticEnrichmentV1] => Boolean(entry))
);

export function getPilotEnrichmentBySlug() {
  return PILOT_ENRICHMENT_BY_SLUG;
}

export function parseQuestionSemanticEnrichment(question: Question): SemanticEnrichmentV1 | null {
  const raw = (question as Question & { semantic_enrichment_v1?: unknown }).semantic_enrichment_v1;
  if (!raw) return null;
  const result = validateSemanticEnrichmentV1(raw);
  return result.enrichment;
}

export async function resolveSemanticEnrichment(question: Question): Promise<SemanticEnrichmentV1 | null> {
  return resolveSemanticEnrichmentSync(question, PILOT_ENRICHMENT_BY_SLUG);
}

export function resolveSemanticEnrichmentSync(
  question: Question,
  pilotBySlug: Record<string, SemanticEnrichmentV1> = {}
): SemanticEnrichmentV1 | null {
  return parseQuestionSemanticEnrichment(question) ?? pilotBySlug[question.slug] ?? null;
}
