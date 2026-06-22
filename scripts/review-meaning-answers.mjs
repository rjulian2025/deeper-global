#!/usr/bin/env node
/**
 * Apply Rick Julian reviewer attribution to all Meaning, Faith & Existential Questions answers.
 *
 * Dry run (default):
 *   node scripts/review-meaning-answers.mjs
 *
 * Apply to Supabase:
 *   node scripts/review-meaning-answers.mjs --apply
 *
 * Options:
 *   --apply              Write changes to Supabase (default: dry run)
 *   --overwrite-reviewer Also update rows already assigned to another reviewer
 *   --reviewed-at=DATE   Override review date (default: today)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const REVIEWER = 'rick-julian';
const OUT_DIR = 'reports/reviewer-attribution';
const PAGE_SIZE = 1000;

const TARGET_CATEGORIES = new Set([
  'Meaning, Faith & Existential Questions',
  'Spiritual Struggle / Existential Crisis',
  'Spiritual Doubt',
  'Existential',
  'Life Purpose',
]);

function parseArgs(argv) {
  const args = {
    apply: false,
    overwriteReviewer: false,
    reviewedAt: new Date().toISOString().slice(0, 10),
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--apply') { args.apply = true; continue; }
    if (arg === '--overwrite-reviewer') { args.overwriteReviewer = true; continue; }
    if (arg === '--reviewed-at') { args.reviewedAt = argv[++i]; continue; }
    if (arg.startsWith('--reviewed-at=')) { args.reviewedAt = arg.slice('--reviewed-at='.length); continue; }
  }
  return args;
}

async function fetchAllQuestions(supabase) {
  const rows = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('questions_master')
      .select('id, slug, question, category, reviewed_by, reviewed_at, review_status')
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Supabase fetch failed: ${error.message}`);
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log(`\nMeaning & Faith reviewer attribution — ${REVIEWER}`);
  console.log(`  Target categories: ${[...TARGET_CATEGORIES].join(', ')}`);
  console.log(`  Review date      : ${args.reviewedAt}`);
  console.log(`  Mode             : ${args.apply ? 'APPLY' : 'dry run'}`);
  if (args.overwriteReviewer) console.log('  Overwrite        : existing reviewed_by will be replaced');
  console.log('');

  const config = resolveSupabaseConfig({ requireWrite: args.apply });
  const supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey);

  const allQuestions = await fetchAllQuestions(supabase);
  const inScope = allQuestions.filter((q) => TARGET_CATEGORIES.has(q.category ?? ''));

  const toUpdate = [];
  const skipped = [];

  for (const row of inScope) {
    if (row.reviewed_by && row.reviewed_by !== REVIEWER && !args.overwriteReviewer) {
      skipped.push({ slug: row.slug, existing_reviewer: row.reviewed_by, reason: 'already attributed to another reviewer' });
      continue;
    }
    toUpdate.push(row);
  }

  console.log(`  In scope         : ${inScope.length} rows`);
  console.log(`  Will update      : ${toUpdate.length}`);
  console.log(`  Skipped          : ${skipped.length} (already attributed to another reviewer)`);

  if (skipped.length > 0) {
    console.log('\nSkipped slugs:');
    for (const s of skipped) console.log(`  ${s.slug} → ${s.existing_reviewer}`);
  }

  if (toUpdate.length === 0) {
    console.log('\nNothing to update.');
    return;
  }

  if (!args.apply) {
    console.log('\n[Dry run] Would update:');
    for (const row of toUpdate) {
      const prev = row.reviewed_by ? ` (was: ${row.reviewed_by})` : '';
      console.log(`  ${row.slug}${prev} [${row.category}]`);
    }
    console.log('\nRe-run with --apply to write changes.');
    return;
  }

  const updateSlugs = toUpdate.map((r) => r.slug);
  const { error } = await supabase
    .from('questions_master')
    .update({
      reviewed_by: REVIEWER,
      reviewed_at: args.reviewedAt,
      review_status: 'reviewed',
    })
    .in('slug', updateSlugs);

  if (error) throw new Error(`Supabase update failed: ${error.message}`);

  console.log(`\n✓ Updated ${toUpdate.length} rows.`);

  const result = {
    applied_at: new Date().toISOString(),
    reviewer: REVIEWER,
    reviewed_at: args.reviewedAt,
    updated_count: toUpdate.length,
    skipped_count: skipped.length,
    updated: toUpdate.map((r) => ({
      id: r.id,
      slug: r.slug,
      category: r.category,
      previous_reviewed_by: r.reviewed_by ?? null,
      previous_reviewed_at: r.reviewed_at ?? null,
      previous_review_status: r.review_status ?? null,
    })),
    skipped,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const outFile = `${OUT_DIR}/apply-meaning-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  writeFileSync(outFile, JSON.stringify(result, null, 2));
  console.log(`\nResult written to ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
