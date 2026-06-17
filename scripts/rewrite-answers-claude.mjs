#!/usr/bin/env node
/**
 * Rewrite answer records with Claude and write structured staging fields.
 *
 * Prerequisites:
 *   1. Apply docs/supabase-answer-rewrite-staging.sql in Supabase.
 *   2. Set ANTHROPIC_API_KEY in ~/.config/deeper-global/secrets.env or .env.local.
 *   3. Set SUPABASE_SERVICE_ROLE_KEY for writes.
 *
 * Usage:
 *   npm run content:rewrite-answers-claude
 *   npm run content:rewrite-answers-claude -- --apply
 *   npm run content:rewrite-answers-claude -- --apply --all
 */
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import {
  ANSWER_REWRITE_PROMPT_VERSION,
  ANSWER_REWRITE_SYSTEM_PROMPT,
} from './lib/answer-rewrite-system-prompt.mjs';
import { sanitizeRewritePayload } from './lib/answer-rewrite-utils.mjs';
import { answerTextFromSections, cleanText } from './lib/content-enrichment-utils.mjs';
import { loadLocalEnv, resolveSupabaseConfig } from './lib/supabase-env.mjs';

const TABLE = 'questions_master';
const OUT_DIR = 'reports/answer-rewrite';
const DEFAULT_LIMIT = 25;
const ALL_RECORDS_LIMIT = 10000;
const DEFAULT_BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1000;
const DEFAULT_MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 4096;

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

function parseArgs(argv) {
  const args = {
    apply: false,
    limit: DEFAULT_LIMIT,
    batchSize: DEFAULT_BATCH_SIZE,
    model: process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      args.apply = true;
      continue;
    }
    if (arg === '--limit') {
      args.limit = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg === '--all') {
      args.limit = ALL_RECORDS_LIMIT;
      continue;
    }
    if (arg.startsWith('--limit=')) {
      args.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--batch-size') {
      args.batchSize = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith('--batch-size=')) {
      args.batchSize = Number(arg.slice('--batch-size='.length));
      continue;
    }
    if (arg === '--model') {
      args.model = argv[index + 1] ?? args.model;
      index += 1;
      continue;
    }
    if (arg.startsWith('--model=')) {
      args.model = arg.slice('--model='.length);
    }
  }

  if (!Number.isFinite(args.limit) || args.limit < 1) {
    throw new Error('--limit must be a positive number.');
  }
  if (!Number.isFinite(args.batchSize) || args.batchSize < 1) {
    throw new Error('--batch-size must be a positive number.');
  }

  return args;
}

function resolveAnthropicApiKey() {
  loadLocalEnv();
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    throw new Error(
      'Missing ANTHROPIC_API_KEY. Add it to ~/.config/deeper-global/secrets.env or .env.local.'
    );
  }
  return key;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk(items, size) {
  const batches = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
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

  if (!question) {
    throw new Error('Question text is required.');
  }
  if (!currentAnswer) {
    throw new Error('Current answer text is required.');
  }

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

  for (const [index, takeaway] of payload.key_takeaways.entries()) {
    if (typeof takeaway !== 'string' || !takeaway.trim()) {
      throw new Error(`Model response key_takeaways[${index}] must be a non-empty string.`);
    }
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

const CSV_OPERATIONAL_HEADERS = [
  'processed_at',
  'record_id',
  'slug',
  'status',
  'error_message',
  'model',
  'input_tokens',
  'output_tokens',
  'duration_ms',
];

const CSV_CONTENT_HEADERS = [
  'primary_term',
  'canonical_answer',
  'lede',
  'key_takeaways',
  'what_you_might_be_experiencing',
  'what_can_help',
  'when_to_reach_out',
];

const CSV_HEADERS = [...CSV_OPERATIONAL_HEADERS, ...CSV_CONTENT_HEADERS];

function truncateForCsv(value, max = 500) {
  const text = String(value ?? '');
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

function contentFieldsForCsv(payload) {
  if (!payload) {
    return CSV_CONTENT_HEADERS.map(() => '');
  }

  return [
    truncateForCsv(payload.primary_term),
    truncateForCsv(payload.canonical_answer),
    truncateForCsv(payload.lede),
    truncateForCsv(payload.key_takeaways.join(' | ')),
    truncateForCsv(payload.what_you_might_be_experiencing),
    truncateForCsv(payload.what_can_help),
    truncateForCsv(payload.when_to_reach_out),
  ];
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function appendCsvRow(path, row) {
  const line = row.map(csvEscape).join(',');
  appendFileSync(path, `${line}\n`);
}

function writeCsvOperationalRow(path, operational, payload = null) {
  appendCsvRow(path, [...operational, ...contentFieldsForCsv(payload)]);
}

async function fetchPendingRecords(supabase, limit) {
  const pageSize = 1000;
  const records = [];

  for (let offset = 0; offset < limit; offset += pageSize) {
    const pageLimit = Math.min(pageSize, limit - offset);
    const { data, error } = await supabase
      .from(TABLE)
      .select(SELECT_COLUMNS)
      .is('staging_rewrite_at', null)
      .not('question', 'is', null)
      .order('id', { ascending: true })
      .range(offset, offset + pageLimit - 1);

    if (error) {
      throw new Error(`Failed to fetch records: ${error.message}`);
    }

    const page = (data ?? []).filter((record) => currentAnswerText(record));
    records.push(...page);

    if (!data?.length || data.length < pageLimit) break;
  }

  return records;
}

async function rewriteRecord(client, record, model) {
  const startedAt = Date.now();
  const userMessage = buildUserMessage(record);

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
    messages: [{ role: 'user', content: userMessage }],
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
    cacheReadTokens: response.usage?.cache_read_input_tokens ?? null,
    cacheCreationTokens: response.usage?.cache_creation_input_tokens ?? null,
  };
}

async function writeStagingFields(supabase, recordId, update) {
  const { error } = await supabase.from(TABLE).update(update).eq('id', recordId);
  if (error) {
    throw new Error(`Failed to update record ${recordId}: ${error.message}`);
  }
}

function isBudgetExhaustedError(message) {
  const text = String(message ?? '').toLowerCase();
  return text.includes('credit balance is too low') || text.includes('insufficient credit');
}

async function processRecord({ anthropic, supabase, record, model, apply, csvPath }) {
  const baseRow = {
    processed_at: new Date().toISOString(),
    record_id: record.id,
    slug: record.slug ?? '',
    status: 'failure',
    error_message: '',
    model,
    input_tokens: '',
    output_tokens: '',
    duration_ms: '',
  };

  try {
    const result = await rewriteRecord(anthropic, record, model);
    const update = stagingUpdateFromPayload(result.payload, { model });

    if (apply) {
      await writeStagingFields(supabase, record.id, update);
    }

    writeCsvOperationalRow(
      csvPath,
      [
        baseRow.processed_at,
        baseRow.record_id,
        baseRow.slug,
        'success',
        '',
        model,
        result.inputTokens ?? '',
        result.outputTokens ?? '',
        result.durationMs,
      ],
      result.payload
    );

    return { ok: true, recordId: record.id, slug: record.slug };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const budgetExhausted = isBudgetExhaustedError(message);

    if (apply && !budgetExhausted) {
      try {
        await writeStagingFields(
          supabase,
          record.id,
          stagingUpdateFromPayload(null, { model, error: message })
        );
      } catch (writeError) {
        const writeMessage = writeError instanceof Error ? writeError.message : String(writeError);
        writeCsvOperationalRow(csvPath, [
          baseRow.processed_at,
          baseRow.record_id,
          baseRow.slug,
          'failure',
          `${message} | db_error: ${writeMessage}`,
          model,
          '',
          '',
          '',
        ]);
        return { ok: false, recordId: record.id, slug: record.slug, error: writeMessage };
      }
    }

    writeCsvOperationalRow(csvPath, [
      baseRow.processed_at,
      baseRow.record_id,
      baseRow.slug,
      'failure',
      message,
      model,
      '',
      '',
      '',
    ]);

    return {
      ok: false,
      recordId: record.id,
      slug: record.slug,
      error: message,
      budgetExhausted,
    };
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const anthropicApiKey = args.apply ? resolveAnthropicApiKey() : null;
  const { url, key } = resolveSupabaseConfig({ requireWrite: args.apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

  const records = await fetchPendingRecords(supabase, args.limit);
  if (!records.length) {
    console.log(JSON.stringify({ message: 'No pending records found.', processed: 0 }, null, 2));
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const runStamp = new Date().toISOString().replace(/[:.]/g, '-');
  const csvPath = `${OUT_DIR}/rewrite-run-${runStamp}.csv`;
  writeFileSync(csvPath, `${CSV_HEADERS.join(',')}\n`);

  const batches = chunk(records, args.batchSize);
  const results = [];

  console.log(
    JSON.stringify(
      {
        mode: args.apply ? 'apply' : 'dry-run',
        pending_records: records.length,
        batch_size: args.batchSize,
        batch_delay_ms: BATCH_DELAY_MS,
        limit: args.limit,
        model: args.model,
        prompt_version: ANSWER_REWRITE_PROMPT_VERSION,
        csv_path: csvPath,
      },
      null,
      2
    )
  );

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
    const batch = batches[batchIndex];

    if (!args.apply) {
      for (const record of batch) {
        writeCsvOperationalRow(csvPath, [
          new Date().toISOString(),
          record.id,
          record.slug ?? '',
          'skipped',
          'dry-run (pass --apply to call Claude and write staging fields)',
          args.model,
          '',
          '',
          '',
        ]);
        console.log(`[skipped] id=${record.id} slug=${record.slug ?? ''}`);
      }
    } else {
      for (const record of batch) {
        const result = await processRecord({
          anthropic,
          supabase,
          record,
          model: args.model,
          apply: true,
          csvPath,
        });
        results.push(result);

        const status = result.ok ? 'success' : 'failure';
        const detail = result.ok ? '' : ` — ${result.error}`;
        console.log(`[${status}] id=${result.recordId} slug=${result.slug ?? ''}${detail}`);

        if (result.budgetExhausted) {
          console.log(JSON.stringify({ halted: true, reason: 'api_budget_exhausted' }, null, 2));
          batchIndex = batches.length;
          break;
        }
      }
    }

    if (batchIndex < batches.length - 1) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  const summary = {
    mode: args.apply ? 'apply' : 'dry-run',
    processed: args.apply ? results.length : records.length,
    successes: results.filter((result) => result.ok).length,
    failures: results.filter((result) => !result.ok).length,
    csv_path: csvPath,
    failures_detail: results
      .filter((result) => !result.ok)
      .map((result) => ({ id: result.recordId, slug: result.slug, error: result.error })),
  };

  console.log(JSON.stringify(summary, null, 2));

  if (summary.failures > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
