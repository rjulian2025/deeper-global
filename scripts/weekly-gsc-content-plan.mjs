#!/usr/bin/env node
/**
 * Build the weekly GSC-driven content ops plan (upgrade-existing scope only).
 *
 *   npm run content:gsc-weekly-plan
 *   npm run content:gsc-weekly-plan -- --mode auto-stage
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { buildWeeklyContentPlan, planMarkdown } from './lib/gsc-content-plan.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/gsc-weekly';

function parseArgs(argv) {
  const args = { mode: 'recommend', includeQueryGaps: true };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--mode') {
      args.mode = argv[index + 1] ?? args.mode;
      index += 1;
      continue;
    }
    if (arg.startsWith('--mode=')) {
      args.mode = arg.slice('--mode='.length);
      continue;
    }
    if (arg === '--include-query-gaps') {
      args.includeQueryGaps = true;
      continue;
    }
    if (arg === '--no-query-gaps') {
      args.includeQueryGaps = false;
    }
  }

  if (!['recommend', 'auto-stage'].includes(args.mode)) {
    throw new Error('--mode must be "recommend" or "auto-stage".');
  }

  return args;
}

function stamp() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });

  const plan = await buildWeeklyContentPlan({
    supabaseClient: client,
    mode: args.mode,
    includeQueryGaps: args.includeQueryGaps,
  });

  mkdirSync(OUT_DIR, { recursive: true });
  const dateStamp = stamp();

  writeFileSync(`${OUT_DIR}/content-plan-${dateStamp}.json`, `${JSON.stringify(plan, null, 2)}\n`);
  writeFileSync(`${OUT_DIR}/content-plan-${dateStamp}.md`, `${planMarkdown(plan)}\n`);
  writeFileSync(
    `${OUT_DIR}/rewrite-batch.json`,
    `${JSON.stringify(
      {
        generated_at: plan.generated_at,
        mode: plan.mode,
        slugs: plan.rewrite_batch.slugs,
        auto_stage_slugs: plan.rewrite_batch.auto_stage_slugs,
      },
      null,
      2
    )}\n`
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        gsc_available: plan.gsc.available,
        gsc_reason: plan.gsc.reason,
        mode: plan.mode,
        recommended: plan.summary.recommended_count,
        confident: plan.summary.confident_count,
        auto_stage: plan.summary.auto_stage_count,
        outputs: {
          json: `${OUT_DIR}/content-plan-${dateStamp}.json`,
          markdown: `${OUT_DIR}/content-plan-${dateStamp}.md`,
          rewrite_batch: `${OUT_DIR}/rewrite-batch.json`,
        },
      },
      null,
      2
    )
  );

  if (!plan.gsc.available) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
