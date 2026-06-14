#!/usr/bin/env node
/**
 * Apply enrichment drafts locally when possible, otherwise via secured production API.
 *
 *   npm run content:apply-enrichment -- reports/enrichment-addiction/draft-answers/batch-01-drafts.json
 *   npm run content:apply-enrichment -- --apply reports/enrichment-addiction/draft-answers/batch-01-drafts.json
 *
 * After promoting enriched content, run the integrity audit gate:
 *   npm run content:promote-with-audit -- --apply <draft-json-paths...>
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import {
  applyPromotionUpdates,
  buildPromotionPlan,
  fetchExistingRows,
  loadDraftsFromPaths,
  promotionReport,
} from './lib/enrichment-promote.mjs';
import { resolveCronSecret, resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIRS = {
  'addiction-enrichment': 'reports/enrichment-addiction/promote-updates',
  enrichment: 'reports/enrichment-corpus/promote-updates',
};
const DEFAULT_REMOTE_URL = 'https://www.deeper.global/api/admin/apply-enrichment';

function parseArgs(argv) {
  let campaign = 'addiction-enrichment';
  let apply = false;
  let preserveReview = true;
  let remoteUrl = process.env.DGP_APPLY_ENRICHMENT_URL ?? DEFAULT_REMOTE_URL;
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
    if (arg === '--remote') {
      remoteUrl = argv[index + 1] ?? DEFAULT_REMOTE_URL;
      index += 1;
      continue;
    }
    if (arg.startsWith('--remote=')) {
      remoteUrl = arg.slice('--remote='.length);
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

  return { apply, campaign, preserveReview, remoteUrl, paths };
}

async function applyLocally({ apply, campaign, preserveReview, paths }) {
  const drafts = loadDraftsFromPaths(paths);
  const plan = buildPromotionPlan(drafts, { campaign, preserveReview });
  const { url, key } = resolveSupabaseConfig({ requireWrite: apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const existingBySlug = await fetchExistingRows(supabase, plan.slugs);

  if (!apply) {
    const previewRows = plan.updateRows.map((row) =>
      plan.preserveReview
        ? {
            ...row,
            reviewed_by: existingBySlug.get(row.slug)?.reviewed_by ?? row.reviewed_by,
            reviewed_at: existingBySlug.get(row.slug)?.reviewed_at ?? row.reviewed_at,
            review_status: existingBySlug.get(row.slug)?.review_status ?? row.review_status,
          }
        : row
    );

    return promotionReport({
      mode: 'dry-run-local',
      campaign,
      preserveReview,
      mergedRows: previewRows,
    });
  }

  const mergedRows = await applyPromotionUpdates(supabase, plan.updateRows, existingBySlug, preserveReview);
  return promotionReport({
    mode: 'applied-local',
    campaign,
    preserveReview,
    mergedRows,
  });
}

async function applyRemotely({ apply, campaign, preserveReview, remoteUrl, paths }) {
  const cronSecret = resolveCronSecret();
  if (!cronSecret) {
    throw new Error('Remote apply requires CRON_SECRET in ~/.config/deeper-global/secrets.env or .env.local.');
  }

  const drafts = JSON.parse(readFileSync(paths[0], 'utf8'));
  if (!Array.isArray(drafts)) {
    throw new Error(`${paths[0]} must contain a JSON array.`);
  }

  const response = await fetch(remoteUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cronSecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apply,
      campaign,
      preserveReview,
      drafts,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? `Remote apply failed with status ${response.status}.`);
  }

  return payload;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let report;

  try {
    resolveSupabaseConfig({ requireWrite: args.apply });
    report = await applyLocally(args);
    report.apply_path = 'local';
  } catch (error) {
    if (!args.apply || !/SUPABASE_SERVICE_ROLE_KEY/.test(error.message ?? '')) {
      throw error;
    }

    report = await applyRemotely(args);
    report.apply_path = 'remote';
  }

  mkdirSync(OUT_DIRS[args.campaign] ?? 'reports/enrichment-addiction/promote-updates', { recursive: true });
  const reportPath = `${OUT_DIRS[args.campaign] ?? 'reports/enrichment-addiction/promote-updates'}/${args.campaign}-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(reportPath, `${JSON.stringify({ ...report, report_path: reportPath }, null, 2)}\n`);
  console.log(JSON.stringify({ ...report, report_path: reportPath }, null, 2));
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
