#!/usr/bin/env node
/**
 * Promote Claude rewrite staging fields onto live questions_master columns.
 *
 *   npm run content:promote-answer-rewrite
 *   npm run content:promote-answer-rewrite -- --apply --slug my-answer-slug
 *   npm run content:promote-answer-rewrite:safe
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { ANSWER_REWRITE_PROMPT_VERSION } from './lib/answer-rewrite-system-prompt.mjs';
import { evaluateStagingRewrite } from './lib/answer-rewrite-qa.mjs';
import {
  buildPromotionUpdateFromStaging,
  hasCompleteStaging,
  isUnpromotedStaging,
} from './lib/answer-rewrite-utils.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/answer-rewrite/promote-updates';
const STAGING_SELECT = [
  'id',
  'slug',
  'question',
  'review_status',
  'reviewed_by',
  'reviewed_at',
  'content_prompt_version',
  'staging_rewrite_at',
  'staging_rewrite_error',
  'staging_rewrite_prompt_version',
  'staging_primary_term',
  'staging_canonical_answer',
  'staging_lede',
  'staging_key_takeaways',
  'staging_what_you_might_be_experiencing',
  'staging_what_can_help',
  'staging_when_to_reach_out',
].join(', ');

function parseArgs(argv) {
  const args = {
    apply: false,
    slugs: [],
    limit: 25,
    all: false,
    unpromotedOnly: true,
    allowWarn: false,
    preserveReview: true,
    reviewer: null,
    reviewedAt: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      args.apply = true;
      continue;
    }
    if (arg === '--all') {
      args.all = true;
      continue;
    }
    if (arg === '--include-promoted') {
      args.unpromotedOnly = false;
      continue;
    }
    if (arg === '--allow-warn') {
      args.allowWarn = true;
      continue;
    }
    if (arg === '--overwrite-review') {
      args.preserveReview = false;
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
    if (arg === '--slug') {
      const value = argv[index + 1];
      if (!value) throw new Error('--slug requires a value.');
      args.slugs.push(value);
      index += 1;
      continue;
    }
    if (arg.startsWith('--slug=')) {
      args.slugs.push(arg.slice('--slug='.length));
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
  }

  if (!Number.isFinite(args.limit) || args.limit < 1) {
    throw new Error('--limit must be a positive number.');
  }

  return args;
}

async function fetchCandidateRows(supabase, args) {
  if (args.slugs.length) {
    const { data, error } = await supabase
      .from('questions_master')
      .select(STAGING_SELECT)
      .in('slug', args.slugs)
      .order('slug', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  const pageSize = 200;
  const rows = [];

  for (let offset = 0; offset < 10000; offset += pageSize) {
    const { data, error } = await supabase
      .from('questions_master')
      .select(STAGING_SELECT)
      .not('staging_rewrite_at', 'is', null)
      .is('staging_rewrite_error', null)
      .eq('staging_rewrite_prompt_version', ANSWER_REWRITE_PROMPT_VERSION)
      .order('staging_rewrite_at', { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw new Error(error.message);
    const page = data ?? [];
    rows.push(...page);
    if (page.length < pageSize) break;
  }

  const filtered = rows.filter((row) => hasCompleteStaging(row));
  const scoped = args.unpromotedOnly ? filtered.filter((row) => isUnpromotedStaging(row)) : filtered;
  return args.all ? scoped : scoped.slice(0, args.limit);
}

function promotionAllowed(score, allowWarn) {
  if (score === 'PASS') return true;
  if (score === 'WARN' && allowWarn) return true;
  return false;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { url, key } = resolveSupabaseConfig({ requireWrite: args.apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const candidates = await fetchCandidateRows(supabase, args);

  if (!candidates.length) {
    console.log(JSON.stringify({ message: 'No staging rows eligible for promotion.', promoted: 0 }, null, 2));
    return;
  }

  const evaluated = candidates.map((row) => ({
    row,
    qa: evaluateStagingRewrite(row),
  }));

  const promotable = evaluated.filter(({ qa }) => promotionAllowed(qa.score, args.allowWarn));
  const blocked = evaluated.filter(({ qa }) => !promotionAllowed(qa.score, args.allowWarn));

  console.log(
    JSON.stringify(
      {
        mode: args.apply ? 'apply' : 'dry-run',
        prompt_version: ANSWER_REWRITE_PROMPT_VERSION,
        candidates: candidates.length,
        promotable: promotable.length,
        blocked: blocked.length,
        allow_warn: args.allowWarn,
        unpromoted_only: args.unpromotedOnly,
      },
      null,
      2
    )
  );

  if (blocked.length) {
    console.log('─── BLOCKED (QA) ───');
    for (const { row, qa } of blocked.slice(0, 20)) {
      console.log(`${row.slug} — ${qa.score}`);
      for (const issue of qa.issues.filter((item) => item.severity === 'FAIL').slice(0, 3)) {
        console.log(`  ${issue.field}: ${issue.issue}`);
      }
    }
    if (blocked.length > 20) console.log(`...and ${blocked.length - 20} more blocked rows`);
  }

  const updates = promotable.map(({ row }) => ({
    slug: row.slug,
    ...buildPromotionUpdateFromStaging(row, {
      preserveReview: args.preserveReview,
      reviewer: args.reviewer,
      reviewedAt: args.reviewedAt,
    }),
  }));

  if (!args.apply) {
    for (const update of updates.slice(0, 10)) {
      console.log(`[dry-run] ${update.slug} → ${update.answer_sections.length} sections, ${update.key_takeaways.length} takeaways`);
    }
    if (updates.length > 10) console.log(`...and ${updates.length - 10} more promotable rows`);
  } else {
    for (const update of updates) {
      const { slug, ...payload } = update;
      const { error } = await supabase.from('questions_master').update(payload).eq('slug', slug);
      if (error) throw new Error(`Failed to promote ${slug}: ${error.message}`);
      console.log(`[promoted] ${slug}`);
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/promote-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        mode: args.apply ? 'applied' : 'dry-run',
        prompt_version: ANSWER_REWRITE_PROMPT_VERSION,
        candidates: evaluated.map(({ row, qa }) => ({
          slug: row.slug,
          qa_score: qa.score,
          qa_issues: qa.issues,
          promoted: args.apply && promotionAllowed(qa.score, args.allowWarn),
        })),
      },
      null,
      2
    )
  );

  console.log(JSON.stringify({ report_path: reportPath, promoted: args.apply ? updates.length : 0 }, null, 2));

  if (blocked.length && !args.allowWarn) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
