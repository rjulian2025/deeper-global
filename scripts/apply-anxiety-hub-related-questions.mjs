#!/usr/bin/env node
/**
 * Apply Anxiety hub related_questions patches to questions_master.
 *
 * Dry run:
 *   npm run content:apply-anxiety-hub-related
 *
 * Apply:
 *   npm run content:apply-anxiety-hub-related -- --apply
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const DEFAULT_BATCH_PATH = 'reports/anxiety-hub/related-questions-batch.json';
const OUT_DIR = 'reports/anxiety-hub';

function parseArgs(argv) {
  const args = { apply: false, batchPath: DEFAULT_BATCH_PATH };

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
    if (!arg.startsWith('-')) {
      args.batchPath = arg;
    }
  }

  return args;
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = JSON.parse(readFileSync(args.batchPath, 'utf8'));
  const batch = report.batch ?? [];

  if (!batch.length) {
    throw new Error(`No batch entries found in ${args.batchPath}.`);
  }

  const { url, key, serviceRoleKey } = resolveSupabaseConfig({ requireWrite: args.apply });
  const client = createClient(url, args.apply ? serviceRoleKey : key, { auth: { persistSession: false } });

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
  if (args.apply) {
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

  const output = {
    generated_at: new Date().toISOString(),
    mode: args.apply ? 'apply' : 'dry-run',
    batch_path: args.batchPath,
    hub_resolution_rate: report.in_graph_resolution_rate,
    summary: {
      batch_entries: batch.length,
      rows_found: patches.length,
      missing_slugs: missing.length,
      applied: applyResults.filter((item) => item.applied).length,
    },
    missing_slugs: missing,
    patches,
    apply_results: args.apply ? applyResults : null,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/related-questions-apply-${stamp()}.json`;
  writeFileSync(reportPath, `${JSON.stringify(output, null, 2)}\n`);

  console.log(`Mode: ${output.mode}`);
  console.log(`Batch entries: ${output.summary.batch_entries}`);
  console.log(`Rows found: ${output.summary.rows_found}`);
  console.log(`Missing slugs: ${output.summary.missing_slugs}`);
  console.log(`In-graph resolution rate: ${report.in_graph_resolution_rate}`);
  console.log(`Report: ${reportPath}`);

  if (missing.length) {
    throw new Error(`Missing slugs in questions_master: ${missing.join(', ')}`);
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
