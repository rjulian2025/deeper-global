#!/usr/bin/env node
/**
 * Promote approved enrichment drafts onto existing questions_master rows.
 *
 * Prefer:
 *   npm run content:apply-enrichment -- --apply <draft.json>
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import {
  applyPromotionUpdates,
  buildPromotionPlan,
  fetchExistingRows,
  loadDraftsFromPaths,
  promotionReport,
} from './lib/enrichment-promote.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/enrichment-addiction/promote-updates';

function parseArgs(argv) {
  let campaign = 'addiction-enrichment';
  let apply = false;
  let preserveReview = true;
  const paths = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      apply = true;
      continue;
    }
    if (arg === '--overwrite-review') {
      preserveReview = false;
      continue;
    }
    if (arg === '--campaign') {
      campaign = argv[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg.startsWith('--campaign=')) {
      campaign = arg.slice('--campaign='.length);
      continue;
    }
    paths.push(arg);
  }

  if (!paths.length) {
    throw new Error('Pass one or more draft JSON files.');
  }

  return { apply, campaign, preserveReview, paths };
}

async function main() {
  const { apply, campaign, preserveReview, paths } = parseArgs(process.argv.slice(2));
  const drafts = loadDraftsFromPaths(paths);
  const plan = buildPromotionPlan(drafts, { campaign, preserveReview });
  const { url, key } = resolveSupabaseConfig({ requireWrite: apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const existingBySlug = await fetchExistingRows(supabase, plan.slugs);

  let report;
  if (!apply) {
    const previewRows = plan.updateRows.map((row) => ({
      ...row,
      reviewed_by: preserveReview ? existingBySlug.get(row.slug)?.reviewed_by ?? row.reviewed_by : row.reviewed_by,
      reviewed_at: preserveReview ? existingBySlug.get(row.slug)?.reviewed_at ?? row.reviewed_at : row.reviewed_at,
      review_status: preserveReview
        ? existingBySlug.get(row.slug)?.review_status ?? row.review_status
        : row.review_status,
    }));
    report = promotionReport({ mode: 'dry-run', campaign, preserveReview, mergedRows: previewRows });
  } else {
    const mergedRows = await applyPromotionUpdates(supabase, plan.updateRows, existingBySlug, preserveReview);
    report = promotionReport({ mode: 'applied', campaign, preserveReview, mergedRows });
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/${campaign}-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        ...report,
        report_path: reportPath,
        note: apply ? undefined : 'Dry run only. Re-run with --apply to update existing rows.',
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
