#!/usr/bin/env node
/**
 * Mark unreviewed answer pages indexable with clinical reviewer attribution.
 *
 * Dry run:
 *   npm run content:approve-unreviewed-corpus
 *
 * Apply:
 *   npm run content:approve-unreviewed-corpus -- --apply
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/answer-rewrite/approve-updates';
const PAGE_SIZE = 1000;
const INDEXABLE_REVIEW_STATUSES = new Set(['approved', 'published', 'reviewed']);
const VALID_REVIEWER_IDS = new Set(['david-k-gore-phd', 'kenneth-w-christian-phd', 'codex-seo-review']);
const DEFAULT_REVIEWER = 'david-k-gore-phd';

function parseArgs(argv) {
  const args = {
    apply: false,
    reviewer: DEFAULT_REVIEWER,
    reviewedAt: new Date().toISOString(),
    reviewStatus: 'reviewed',
    overwriteReviewer: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      args.apply = true;
      continue;
    }
    if (arg === '--overwrite-reviewer') {
      args.overwriteReviewer = true;
      continue;
    }
    if (arg === '--reviewer') {
      const value = argv[index + 1];
      if (!value) throw new Error('--reviewer requires a value.');
      args.reviewer = value;
      index += 1;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      args.reviewer = arg.slice('--reviewer='.length);
      continue;
    }
    if (arg === '--reviewed-at') {
      const value = argv[index + 1];
      if (!value) throw new Error('--reviewed-at requires a value.');
      args.reviewedAt = value;
      index += 1;
      continue;
    }
    if (arg.startsWith('--reviewed-at=')) {
      args.reviewedAt = arg.slice('--reviewed-at='.length);
      continue;
    }
    if (arg === '--review-status') {
      const value = argv[index + 1];
      if (!value) throw new Error('--review-status requires a value.');
      args.reviewStatus = value;
      index += 1;
      continue;
    }
    if (arg.startsWith('--review-status=')) {
      args.reviewStatus = arg.slice('--review-status='.length);
      continue;
    }
  }

  if (!VALID_REVIEWER_IDS.has(args.reviewer)) {
    throw new Error(`Invalid reviewer id: ${args.reviewer}`);
  }
  if (!INDEXABLE_REVIEW_STATUSES.has(args.reviewStatus)) {
    throw new Error(`Invalid review_status: ${args.reviewStatus}`);
  }

  return args;
}

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function needsApproval(row) {
  const status = cleanText(row.review_status).toLowerCase();
  const reviewedBy = cleanText(row.reviewed_by);
  const statusIndexable = INDEXABLE_REVIEW_STATUSES.has(status);
  const hasReviewer = Boolean(reviewedBy);
  return !statusIndexable || !hasReviewer;
}

async function fetchAllQuestions(client) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await client
      .from('questions_master')
      .select('slug,review_status,reviewed_by,reviewed_at')
      .order('slug')
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { url, key } = resolveSupabaseConfig({ requireWrite: args.apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const rows = await fetchAllQuestions(supabase);
  const candidates = rows.filter((row) => needsApproval(row));

  const updates = candidates.map((row) => {
    const reviewedBy = cleanText(row.reviewed_by);
    const payload = {
      review_status: args.reviewStatus,
      updated_at: new Date().toISOString(),
    };

    if (!reviewedBy || args.overwriteReviewer) {
      payload.reviewed_by = args.reviewer;
      payload.reviewed_at = args.reviewedAt;
    } else if (!cleanText(row.reviewed_at)) {
      payload.reviewed_at = args.reviewedAt;
    }

    return { slug: row.slug, previous: row, payload };
  });

  console.log(
    JSON.stringify(
      {
        mode: args.apply ? 'apply' : 'dry-run',
        total_rows: rows.length,
        candidates: updates.length,
        reviewer: args.reviewer,
        review_status: args.reviewStatus,
      },
      null,
      2
    )
  );

  for (const update of updates.slice(0, 10)) {
    console.log(`[${args.apply ? 'apply' : 'dry-run'}] ${update.slug}`);
  }
  if (updates.length > 10) {
    console.log(`...and ${updates.length - 10} more`);
  }

  if (args.apply) {
    for (const update of updates) {
      const { error } = await supabase.from('questions_master').update(update.payload).eq('slug', update.slug);
      if (error) throw new Error(`Failed to approve ${update.slug}: ${error.message}`);
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/approve-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        mode: args.apply ? 'applied' : 'dry-run',
        reviewer: args.reviewer,
        review_status: args.reviewStatus,
        updated: args.apply ? updates.length : 0,
        updates,
      },
      null,
      2
    )
  );

  console.log(JSON.stringify({ report_path: reportPath, updated: args.apply ? updates.length : 0 }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
