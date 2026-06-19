#!/usr/bin/env node
/**
 * Build the weekly GSC-driven content ops plan (upgrade-existing scope only).
 *
 *   npm run content:gsc-weekly-plan
 *   npm run content:gsc-weekly-plan -- --window-days 7
 *   npm run content:gsc-weekly-plan -- --mode auto-stage
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { buildWeeklyContentPlan, planMarkdown } from './lib/gsc-content-plan.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/gsc-weekly';
const DEFAULT_WINDOW_DAYS = 28;
const DEFAULT_LAG_DAYS = 3;

function parseArgs(argv) {
  const args = {
    mode: 'recommend',
    includeQueryGaps: true,
    windowDays: DEFAULT_WINDOW_DAYS,
    lagDays: DEFAULT_LAG_DAYS,
  };

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
    if (arg === '--window-days') {
      args.windowDays = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith('--window-days=')) {
      args.windowDays = Number(arg.slice('--window-days='.length));
      continue;
    }
    if (arg === '--lag-days') {
      args.lagDays = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith('--lag-days=')) {
      args.lagDays = Number(arg.slice('--lag-days='.length));
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
  if (!Number.isFinite(args.windowDays) || args.windowDays < 1) {
    throw new Error('--window-days must be a positive number.');
  }
  if (!Number.isFinite(args.lagDays) || args.lagDays < 0) {
    throw new Error('--lag-days must be zero or a positive number.');
  }

  return args;
}

function stamp() {
  return new Date().toISOString().slice(0, 10);
}

function outputSuffix(windowDays) {
  return windowDays === DEFAULT_WINDOW_DAYS ? '' : `-${windowDays}d`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });

  const plan = await buildWeeklyContentPlan({
    supabaseClient: client,
    mode: args.mode,
    includeQueryGaps: args.includeQueryGaps,
    windowDays: args.windowDays,
    lagDays: args.lagDays,
  });

  mkdirSync(OUT_DIR, { recursive: true });
  const dateStamp = stamp();
  const suffix = outputSuffix(args.windowDays);
  const planBase = `${OUT_DIR}/content-plan${suffix}-${dateStamp}`;

  writeFileSync(`${planBase}.json`, `${JSON.stringify(plan, null, 2)}\n`);
  writeFileSync(`${planBase}.md`, `${planMarkdown(plan)}\n`);
  writeFileSync(
    `${OUT_DIR}/rewrite-batch${suffix}.json`,
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
        window_days: args.windowDays,
        lag_days: args.lagDays,
        date_range: plan.gsc.current_range,
        recommended: plan.summary.recommended_count,
        confident: plan.summary.confident_count,
        auto_stage: plan.summary.auto_stage_count,
        outputs: {
          json: `${planBase}.json`,
          markdown: `${planBase}.md`,
          rewrite_batch: `${OUT_DIR}/rewrite-batch${suffix}.json`,
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
