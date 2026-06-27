import Anthropic from '@anthropic-ai/sdk';
import {
  ANSWER_REWRITE_PROMPT_VERSION,
  ANSWER_REWRITE_SYSTEM_PROMPT,
} from './answer-rewrite-system-prompt.mjs';
import { sanitizeRewritePayload } from './answer-rewrite-utils.mjs';
import { answerTextFromSections, cleanText } from './content-enrichment-utils.mjs';

const TABLE = 'questions_master';
const DEFAULT_MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 4096;
const BATCH_DELAY_MS = 1000;

const SELECT_COLUMNS = [
  'id',
  'slug',
  'question',
  'short_answer',
  'answer',
  'answer_sections',
  'staging_rewrite_at',
].join(', ');

const REQUIRED_OUTPUT_FIELDS = [
  'primary_term',
  'canonical_answer',
  'lede',
  'key_takeaways',
  'what_you_might_be_experiencing',
  'what_can_help',
  'when_to_reach_out',
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function currentAnswerText(record) {
  if (Array.isArray(record.answer_sections) && record.answer_sections.length > 0) {
    const fromSections = answerTextFromSections(record.answer_sections);
    if (fromSections) return fromSections;
  }

  const answer = cleanText(record.answer);
  if (answer) return answer;

  return cleanText(record.short_answer);
}

function buildUserMessage(record) {
  const question = cleanText(record.question);
  const currentAnswer = currentAnswerText(record);

  if (!question) throw new Error('Question text is required.');
  if (!currentAnswer) throw new Error('Current answer text is required.');

  return `QUESTION: ${question}\nCURRENT_ANSWER: ${currentAnswer}`;
}

function parseModelJson(text) {
  const trimmed = text.trim();
  const withoutFences = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(withoutFences);
}

function validateRewritePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Model response must be a JSON object.');
  }

  for (const field of REQUIRED_OUTPUT_FIELDS) {
    if (!(field in payload)) {
      throw new Error(`Model response missing required field: ${field}.`);
    }
  }

  for (const field of REQUIRED_OUTPUT_FIELDS) {
    if (field === 'key_takeaways') continue;
    if (typeof payload[field] !== 'string' || !payload[field].trim()) {
      throw new Error(`Model response field ${field} must be a non-empty string.`);
    }
  }

  if (!Array.isArray(payload.key_takeaways) || payload.key_takeaways.length !== 5) {
    throw new Error('Model response key_takeaways must be an array of exactly 5 strings.');
  }
}

function stagingUpdateFromPayload(payload, { model, error = null }) {
  const now = new Date().toISOString();

  if (error) {
    return {
      staging_rewrite_at: now,
      staging_rewrite_model: model,
      staging_rewrite_prompt_version: ANSWER_REWRITE_PROMPT_VERSION,
      staging_rewrite_error: error,
      staging_primary_term: null,
      staging_canonical_answer: null,
      staging_lede: null,
      staging_key_takeaways: null,
      staging_what_you_might_be_experiencing: null,
      staging_what_can_help: null,
      staging_when_to_reach_out: null,
    };
  }

  return {
    staging_primary_term: payload.primary_term.trim(),
    staging_canonical_answer: payload.canonical_answer.trim(),
    staging_lede: payload.lede.trim(),
    staging_key_takeaways: payload.key_takeaways.map((item) => item.trim()),
    staging_what_you_might_be_experiencing: payload.what_you_might_be_experiencing.trim(),
    staging_what_can_help: payload.what_can_help.trim(),
    staging_when_to_reach_out: payload.when_to_reach_out.trim(),
    staging_rewrite_at: now,
    staging_rewrite_model: model,
    staging_rewrite_prompt_version: ANSWER_REWRITE_PROMPT_VERSION,
    staging_rewrite_error: null,
  };
}

export function loadRewriteSlugsFromPayload(payload) {
  if (Array.isArray(payload)) return payload.map((slug) => cleanText(slug)).filter(Boolean);
  if (Array.isArray(payload.slugs)) return payload.slugs.map((slug) => cleanText(slug)).filter(Boolean);
  throw new Error('Rewrite slugs must be a JSON array or { slugs: [] } object.');
}

async function fetchRecordsBySlugs(supabase, slugs, { onlyUnstaged = true } = {}) {
  if (!slugs.length) return [];

  let query = supabase.from(TABLE).select(SELECT_COLUMNS).in('slug', slugs).not('question', 'is', null);
  if (onlyUnstaged) {
    query = query.is('staging_rewrite_at', null);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch slug records: ${error.message}`);

  const bySlug = new Map((data ?? []).map((record) => [record.slug, record]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((record) => record && currentAnswerText(record));
}

async function rewriteRecord(client, record, model) {
  const startedAt = Date.now();
  const response = await client.messages.create({
    model,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: 'text',
        text: ANSWER_REWRITE_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral', ttl: '1h' },
      },
    ],
    messages: [{ role: 'user', content: buildUserMessage(record) }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock?.text?.trim()) {
    throw new Error('Claude response did not include text content.');
  }

  const payload = sanitizeRewritePayload(parseModelJson(textBlock.text));
  validateRewritePayload(payload);

  return {
    payload,
    durationMs: Date.now() - startedAt,
    inputTokens: response.usage?.input_tokens ?? null,
    outputTokens: response.usage?.output_tokens ?? null,
  };
}

async function writeStagingFields(supabase, recordId, update) {
  const { error } = await supabase.from(TABLE).update(update).eq('id', recordId);
  if (error) throw new Error(`Failed to update record ${recordId}: ${error.message}`);
}

function isBudgetExhaustedError(message) {
  const text = String(message ?? '').toLowerCase();
  return text.includes('credit balance is too low') || text.includes('insufficient credit');
}

async function processRecord({ anthropic, supabase, record, model, apply }) {
  try {
    const result = await rewriteRecord(anthropic, record, model);
    const update = stagingUpdateFromPayload(result.payload, { model });

    if (apply) {
      await writeStagingFields(supabase, record.id, update);
    }

    return {
      ok: true,
      slug: record.slug,
      recordId: record.id,
      durationMs: result.durationMs,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const budgetExhausted = isBudgetExhaustedError(message);

    if (apply && !budgetExhausted) {
      await writeStagingFields(
        supabase,
        record.id,
        stagingUpdateFromPayload(null, { model, error: message })
      );
    }

    return {
      ok: false,
      slug: record.slug,
      recordId: record.id,
      error: message,
      budgetExhausted,
    };
  }
}

export function resolveAnthropicApiKey() {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    throw new Error('Missing ANTHROPIC_API_KEY.');
  }
  return key;
}

export async function runAnswerRewrite({
  supabase,
  slugs,
  apply = false,
  model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL,
  onlyUnstaged = true,
  batchDelayMs = BATCH_DELAY_MS,
}) {
  const records = await fetchRecordsBySlugs(supabase, slugs, { onlyUnstaged });
  const missingSlugs = slugs.filter((slug) => !records.some((record) => record.slug === slug));

  if (!records.length) {
    return {
      mode: apply ? 'apply' : 'dry-run',
      processed: 0,
      successes: 0,
      failures: 0,
      skippedSlugs: slugs,
      missingSlugs,
      results: [],
    };
  }

  if (!apply) {
    return {
      mode: 'dry-run',
      processed: records.length,
      successes: 0,
      failures: 0,
      skippedSlugs: missingSlugs,
      results: records.map((record) => ({
        ok: true,
        slug: record.slug,
        recordId: record.id,
        status: 'would_rewrite',
      })),
    };
  }

  const anthropic = new Anthropic({ apiKey: resolveAnthropicApiKey() });
  const results = [];

  for (const [index, record] of records.entries()) {
    const result = await processRecord({ anthropic, supabase, record, model, apply: true });
    results.push(result);

    if (result.budgetExhausted) break;
    if (index < records.length - 1) {
      await sleep(batchDelayMs);
    }
  }

  return {
    mode: 'apply',
    processed: results.length,
    successes: results.filter((result) => result.ok).length,
    failures: results.filter((result) => !result.ok).length,
    skippedSlugs: missingSlugs,
    results,
  };
}
