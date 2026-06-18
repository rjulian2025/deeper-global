#!/usr/bin/env node
/**
 * Generate modality psychoeducation content with Claude and write staging fields.
 *
 * Prerequisites:
 *   1. Apply docs/supabase-modalities-table.sql and docs/supabase-modalities-seed.sql in Supabase.
 *   2. Set ANTHROPIC_API_KEY in ~/.config/deeper-global/secrets.env or .env.local.
 *   3. Set SUPABASE_SERVICE_ROLE_KEY for writes.
 *
 * Usage:
 *   node scripts/generate-modality-content.mjs
 *   node scripts/generate-modality-content.mjs --apply
 *   node scripts/generate-modality-content.mjs --apply --limit 5
 */
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import {
  MODALITY_GENERATION_PROMPT_VERSION,
  MODALITY_GENERATION_SYSTEM_PROMPT,
} from './lib/modality-generation-system-prompt.mjs';
import { loadLocalEnv, resolveSupabaseConfig } from './lib/supabase-env.mjs';

const TABLE = 'modalities';
const OUT_DIR = 'reports/modality-generate';
const DEFAULT_LIMIT = 5;
const DEFAULT_BATCH_SIZE = 5;
const BATCH_DELAY_MS = 1000;
const DEFAULT_MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 8192;

const SELECT_COLUMNS = [
  'id',
  'slug',
  'name',
  'also_known_as',
  'category',
  'status',
  'staging_rewrite_at',
].join(', ');

const REQUIRED_OUTPUT_FIELDS = [
  'primary_term',
  'canonical_answer',
  'lede',
  'key_takeaways',
  'what_it_is',
  'what_a_session_looks_like',
  'what_it_treats',
  'what_the_evidence_says',
  'who_it_is_for',
  'how_to_find_a_practitioner',
  'ymyl_flagged',
  'schema_description',
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

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function buildUserMessage(record) {
  const name = cleanText(record.name);
  const alsoKnownAs = Array.isArray(record.also_known_as)
    ? record.also_known_as.map((item) => cleanText(item)).filter(Boolean).join(', ')
    : 'none';
  const category = cleanText(record.category);

  if (!name) {
    throw new Error('Modality name is required.');
  }
  if (!category) {
    throw new Error('Modality category is required.');
  }

  return `MODALITY_NAME: ${name}\nALSO_KNOWN_AS: ${alsoKnownAs || 'none'}\nCATEGORY: ${category}`;
}

function parseModelJson(text) {
  const trimmed = text.trim();
  const withoutFences = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(withoutFences);
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Model response must be a JSON object.');
  }

  for (const field of REQUIRED_OUTPUT_FIELDS) {
    if (!(field in payload)) {
      throw new Error(`Model response missing required field: ${field}.`);
    }
  }

  for (const field of REQUIRED_OUTPUT_FIELDS) {
    if (field === 'key_takeaways' || field === 'ymyl_flagged') continue;
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

  if (typeof payload.ymyl_flagged !== 'boolean') {
    throw new Error('Model response ymyl_flagged must be a boolean.');
  }
}

function stagingUpdateFromPayload(payload, { model, error = null }) {
  const now = new Date().toISOString();

  if (error) {
    return {
      staging_rewrite_at: now,
      staging_rewrite_model: model,
      staging_rewrite_prompt_version: MODALITY_GENERATION_PROMPT_VERSION,
      staging_rewrite_error: error,
      staging_lede: null,
      staging_what_it_is: null,
      staging_what_a_session_looks_like: null,
      staging_what_it_treats: null,
      staging_what_the_evidence_says: null,
      staging_who_it_is_for: null,
      staging_how_to_find_a_practitioner: null,
      staging_key_takeaways: null,
      staging_canonical_answer: null,
      primary_term: null,
      canonical_answer: null,
      schema_description: null,
      ymyl_flagged: false,
    };
  }

  return {
    primary_term: payload.primary_term.trim(),
    canonical_answer: payload.canonical_answer.trim(),
    schema_description: payload.schema_description.trim(),
    staging_lede: payload.lede.trim(),
    staging_key_takeaways: payload.key_takeaways.map((item) => item.trim()),
    staging_what_it_is: payload.what_it_is.trim(),
    staging_what_a_session_looks_like: payload.what_a_session_looks_like.trim(),
    staging_what_it_treats: payload.what_it_treats.trim(),
    staging_what_the_evidence_says: payload.what_the_evidence_says.trim(),
    staging_who_it_is_for: payload.who_it_is_for.trim(),
    staging_how_to_find_a_practitioner: payload.how_to_find_a_practitioner.trim(),
    staging_canonical_answer: payload.canonical_answer.trim(),
    ymyl_flagged: payload.ymyl_flagged,
    staging_rewrite_at: now,
    staging_rewrite_model: model,
    staging_rewrite_prompt_version: MODALITY_GENERATION_PROMPT_VERSION,
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
  'what_it_is',
  'what_a_session_looks_like',
  'what_it_treats',
  'what_the_evidence_says',
  'who_it_is_for',
  'how_to_find_a_practitioner',
  'ymyl_flagged',
  'schema_description',
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
    truncateForCsv(payload.what_it_is),
    truncateForCsv(payload.what_a_session_looks_like),
    truncateForCsv(payload.what_it_treats),
    truncateForCsv(payload.what_the_evidence_says),
    truncateForCsv(payload.who_it_is_for),
    truncateForCsv(payload.how_to_find_a_practitioner),
    String(payload.ymyl_flagged),
    truncateForCsv(payload.schema_description),
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
  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT_COLUMNS)
    .is('staging_rewrite_at', null)
    .neq('status', 'published')
    .order('slug', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch records: ${error.message}`);
  }

  return data ?? [];
}

async function writeStagingFields(supabase, recordId, update) {
  const { error } = await supabase.from(TABLE).update(update).eq('id', recordId);
  if (error) {
    throw new Error(`Failed to write staging fields: ${error.message}`);
  }
}

function isBudgetExhaustedError(message) {
  return /credit balance|billing|budget|rate.?limit|overloaded/i.test(message);
}

async function generateRecord(client, record, model) {
  const startedAt = Date.now();
  const userMessage = buildUserMessage(record);

  const response = await client.messages.create({
    model,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: 'text',
        text: MODALITY_GENERATION_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral', ttl: '1h' },
      },
    ],
    messages: [{ role: 'user', content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock?.text?.trim()) {
    throw new Error('Claude response did not include text content.');
  }

  const payload = parseModelJson(textBlock.text);
  validatePayload(payload);

  return {
    payload,
    durationMs: Date.now() - startedAt,
    inputTokens: response.usage?.input_tokens ?? null,
    outputTokens: response.usage?.output_tokens ?? null,
  };
}

async function processRecord({ anthropic, supabase, record, model, apply, csvPath }) {
  const baseRow = {
    processed_at: new Date().toISOString(),
    record_id: record.id,
    slug: record.slug ?? '',
  };

  try {
    if (!apply) {
      writeCsvOperationalRow(csvPath, [
        baseRow.processed_at,
        baseRow.record_id,
        baseRow.slug,
        'skipped',
        'dry-run (pass --apply to call Claude and write staging fields)',
        model,
        '',
        '',
        '',
      ]);
      return { ok: true, recordId: record.id, slug: record.slug };
    }

    const result = await generateRecord(anthropic, record, model);
    await writeStagingFields(supabase, record.id, stagingUpdateFromPayload(result.payload, { model }));

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
    console.log(JSON.stringify({ message: 'No pending modality records found.', processed: 0 }, null, 2));
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const runStamp = new Date().toISOString().replace(/[:.]/g, '-');
  const csvPath = `${OUT_DIR}/generate-run-${runStamp}.csv`;
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
        prompt_version: MODALITY_GENERATION_PROMPT_VERSION,
        csv_path: csvPath,
      },
      null,
      2
    )
  );

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
    const batch = batches[batchIndex];

    for (const record of batch) {
      const result = await processRecord({
        anthropic,
        supabase,
        record,
        model: args.model,
        apply: args.apply,
        csvPath,
      });
      results.push(result);

      const status = result.ok ? (args.apply ? 'success' : 'skipped') : 'failure';
      const detail = result.ok ? '' : ` — ${result.error}`;
      console.log(`[${status}] id=${result.recordId} slug=${result.slug ?? ''}${detail}`);

      if (result.budgetExhausted) {
        console.log(JSON.stringify({ halted: true, reason: 'api_budget_exhausted' }, null, 2));
        batchIndex = batches.length;
        break;
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
