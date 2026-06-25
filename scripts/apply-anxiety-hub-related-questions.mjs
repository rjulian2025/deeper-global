#!/usr/bin/env node
/**
 * Apply Anxiety hub related_questions patches to questions_master.
 *
 * Dry run:
 *   npm run content:apply-anxiety-hub-related
 *
 * Apply:
 *   npm run content:apply-anxiety-hub-related -- --apply
 *
 * Credentials are loaded automatically from ~/.config/deeper-global/secrets.env
 * and .env.local. If local Supabase write keys are unavailable, the script falls
 * back to the production admin API using stored CRON_SECRET.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { bootstrapLocalEnv } from './lib/bootstrap-local-env.mjs';
import { postAdminApply } from './lib/remote-admin-request.mjs';
import { envStatus, resolveSupabaseConfig } from './lib/supabase-env.mjs';

const DEFAULT_BATCH_PATH = 'reports/anxiety-hub/related-questions-batch.json';
const DEFAULT_REMOTE_URL = 'https://www.deeper.global/api/admin/apply-anxiety-hub-related';
const OUT_DIR = 'reports/anxiety-hub';

function parseArgs(argv) {
  const args = { apply: false, batchPath: DEFAULT_BATCH_PATH, remoteUrl: process.env.DGP_APPLY_ANXIETY_HUB_URL ?? DEFAULT_REMOTE_URL };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      args.apply = true;
      continue;
    }
    if (arg.startsWith('--batch=')) {
      args.batchPath = arg.slice('--batch='.length);
      continue;
    }
    if (arg === '--remote') {
      args.remoteUrl = argv[index + 1] ?? DEFAULT_REMOTE_URL;
      index += 1;
      continue;
    }
    if (arg.startsWith('--remote=')) {
      args.remoteUrl = arg.slice('--remote='.length);
      continue;
    }
    if (!arg.startsWith('-')) {
      args.batchPath = arg;
    }
  }

  return args;
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function loadBatch(batchPath) {
  const report = JSON.parse(readFileSync(batchPath, 'utf8'));
  const batch = report.batch ?? [];
  if (!batch.length) {
    throw new Error(`No batch entries found in ${batchPath}.`);
  }
  return { report, batch };
}

async function applyLocally({ apply, batch, report, batchPath }) {
  const { url, key, serviceRoleKey } = resolveSupabaseConfig({ requireWrite: apply });
  const client = createClient(url, apply ? serviceRoleKey : key, { auth: { persistSession: false } });

  const slugs = batch.map((entry) => entry.slug);
  const { data: rows, error } = await client
    .from('questions_master')
    .select('id,slug,related_questions')
    .in('slug', slugs);

  if (error) throw error;

  const bySlug = new Map((rows ?? []).map((row) => [row.slug, row]));
  const patches = [];
  const missing = [];

  for (const entry of batch) {
    const row = bySlug.get(entry.slug);
    if (!row) {
      missing.push(entry.slug);
      continue;
    }

    patches.push({
      id: row.id,
      slug: entry.slug,
      related_questions: entry.related_questions,
      previous_related_questions: row.related_questions ?? null,
    });
  }

  const applyResults = [];
  if (apply) {
    for (const patch of patches) {
      const { data, error: updateError } = await client
        .from('questions_master')
        .update({ related_questions: patch.related_questions })
        .eq('id', patch.id)
        .select('id,slug,related_questions');

      if (updateError) throw updateError;
      applyResults.push({
        slug: patch.slug,
        applied: Boolean(data?.length),
        related_count: patch.related_questions.length,
      });
    }
  }

  if (missing.length) {
    throw new Error(`Missing slugs in questions_master: ${missing.join(', ')}`);
  }

  return {
    generated_at: new Date().toISOString(),
    mode: apply ? 'apply' : 'dry-run',
    apply_path: 'local',
    batch_path: batchPath,
    hub_resolution_rate: report.in_graph_resolution_rate,
    summary: {
      batch_entries: batch.length,
      rows_found: patches.length,
      missing_slugs: missing.length,
      applied: applyResults.filter((item) => item.applied).length,
    },
    patches,
    apply_results: apply ? applyResults : null,
  };
}

async function applyRemotely({ apply, batch, remoteUrl }) {
  const payload = await postAdminApply({
    url: remoteUrl,
    body: {
      apply,
      batch: batch.map((entry) => ({
        slug: entry.slug,
        related_questions: entry.related_questions,
      })),
    },
  });

  return {
    ...payload,
    apply_path: 'remote',
  };
}

function canUseRemote(status) {
  return Boolean(status.ready_for_remote_apply);
}

function shouldFallbackRemote(error, status) {
  if (!canUseRemote(status)) return false;
  const message = error?.message ?? '';
  return /Missing Supabase credentials|SUPABASE_SERVICE_ROLE_KEY|Supabase credentials/i.test(message);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { report, batch } = loadBatch(args.batchPath);
  const status = bootstrapLocalEnv();

  let output;

  try {
    output = await applyLocally({ ...args, batch, report });
  } catch (error) {
    const latestStatus = envStatus();
    if (!shouldFallbackRemote(error, latestStatus)) {
      throw error;
    }
    console.error('Local Supabase write unavailable; using stored CRON_SECRET via production admin API.');
    output = await applyRemotely({ ...args, batch });
    output.batch_path = args.batchPath;
    output.hub_resolution_rate = report.in_graph_resolution_rate;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/related-questions-apply-${stamp()}.json`;
  writeFileSync(reportPath, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Mode: ${output.mode}`);
  console.log(`Apply path: ${output.apply_path}`);
  console.log(`Batch entries: ${output.summary?.batch_entries ?? batch.length}`);
  console.log(`Rows found: ${output.summary?.rows_found ?? output.patches?.length ?? 0}`);
  console.log(`Missing slugs: ${output.summary?.missing_slugs ?? 0}`);
  if (report.in_graph_resolution_rate != null) {
    console.log(`In-graph resolution rate: ${report.in_graph_resolution_rate}`);
  }
  console.log(`Report: ${reportPath}`);
}

main().catch((error) => {
  const status = envStatus();
  console.error(error.message ?? error);
  if (!status.ready_for_write && !status.ready_for_remote_apply) {
    console.error('Run once from the repo root: npm run env:sync');
    console.error('Credentials persist in ~/.config/deeper-global/secrets.env');
  }
  process.exit(1);
});
