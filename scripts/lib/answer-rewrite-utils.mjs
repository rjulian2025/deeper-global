import { ANSWER_REWRITE_PROMPT_VERSION } from './answer-rewrite-system-prompt.mjs';

export const REWRITE_SECTION_SPECS = [
  {
    type: 'what-you-might-be-experiencing',
    heading: 'What you might be experiencing',
    stagingField: 'staging_what_you_might_be_experiencing',
  },
  {
    type: 'what-can-help',
    heading: 'What can help',
    stagingField: 'staging_what_can_help',
  },
  {
    type: 'when-to-reach-out',
    heading: 'When to reach out',
    stagingField: 'staging_when_to_reach_out',
  },
];

export function sanitizeRewritePayload(payload) {
  const sanitized = { ...payload };

  for (const field of ['canonical_answer', 'lede']) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitized[field].replace(/\s*[—–]\s*/g, ', ').replace(/,\s*,/g, ',').trim();
    }
  }

  if (Array.isArray(sanitized.key_takeaways)) {
    sanitized.key_takeaways = sanitized.key_takeaways.map((item) =>
      typeof item === 'string' ? item.trim() : item
    );
  }

  return sanitized;
}

export function hasCompleteStaging(row) {
  if (!row?.staging_rewrite_at || row.staging_rewrite_error) return false;

  const requiredStrings = [
    'staging_primary_term',
    'staging_canonical_answer',
    'staging_lede',
    'staging_what_you_might_be_experiencing',
    'staging_what_can_help',
    'staging_when_to_reach_out',
  ];

  if (!requiredStrings.every((field) => String(row[field] ?? '').trim())) {
    return false;
  }

  return (
    Array.isArray(row.staging_key_takeaways) &&
    row.staging_key_takeaways.length === 5 &&
    row.staging_key_takeaways.every((item) => String(item).trim())
  );
}

export function buildAnswerSectionsFromStaging(row) {
  return REWRITE_SECTION_SPECS.map((spec) => ({
    type: spec.type,
    heading: spec.heading,
    body: String(row[spec.stagingField] ?? '').trim(),
  }));
}

export function buildPromotionUpdateFromStaging(row, { preserveReview = true } = {}) {
  const now = new Date().toISOString();
  const lede = String(row.staging_lede ?? '').trim();
  const update = {
    short_answer: lede,
    improved_summary: lede,
    key_takeaways: row.staging_key_takeaways,
    answer_sections: buildAnswerSectionsFromStaging(row),
    suggested_schema_answer: String(row.staging_canonical_answer ?? '').trim(),
    primary_theme: String(row.staging_primary_term ?? '').trim(),
    content_prompt_version: row.staging_rewrite_prompt_version || ANSWER_REWRITE_PROMPT_VERSION,
    content_enriched_at: now,
    updated_at: now,
  };

  if (!preserveReview) {
    update.review_status = 'reviewed';
  }

  return update;
}

export function isUnpromotedStaging(row) {
  const promptVersion = String(row.content_prompt_version ?? '').trim();
  const stagingVersion = String(row.staging_rewrite_prompt_version ?? '').trim();
  return Boolean(stagingVersion && promptVersion !== stagingVersion);
}
