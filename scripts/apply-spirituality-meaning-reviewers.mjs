#!/usr/bin/env node
/**
 * Set reviewed_by / reviewed_at / review_status after Part C promote.
 *
 *   node scripts/apply-spirituality-meaning-reviewers.mjs
 *   node scripts/apply-spirituality-meaning-reviewers.mjs --apply
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { CANDIDATES } from './lib/spirituality-meaning-candidates.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/reviewer-attribution';

function parseArgs(argv) {
  return { apply: argv.includes('--apply') };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const reviewedAt = new Date().toISOString();
  const config = resolveSupabaseConfig({ requireWrite: args.apply });
  const supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey);

  const slugs = CANDIDATES.map((c) => c.slug);
  const { data: rows, error } = await supabase
    .from('questions_master')
    .select('slug, reviewed_by, reviewed_at, review_status')
    .in('slug', slugs);
  if (error) throw error;

  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const updates = CANDIDATES.map((candidate) => ({
    slug: candidate.slug,
    gap_id: candidate.gap_id,
    before: bySlug.get(candidate.slug)?.reviewed_by ?? null,
    after: candidate.target_reviewed_by,
    review_status: 'reviewed',
    reviewed_at: reviewedAt,
  }));

  console.log(`Spirituality Part C reviewer assignment (${args.apply ? 'APPLY' : 'dry run'})`);
  for (const row of updates) {
    console.log(`  ${row.slug}`);
    console.log(`    ${row.before ?? '(null)'} → ${row.after}`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/spirituality-meaning-part-c-reviewers-${reviewedAt.replace(/[:.]/g, '-')}.json`;
  writeFileSync(reportPath, `${JSON.stringify({ reviewedAt, updates }, null, 2)}\n`);

  if (!args.apply) {
    console.log(`\nDry run. Report: ${reportPath}`);
    return;
  }

  for (const row of updates) {
    const { error: updateError } = await supabase
      .from('questions_master')
      .update({
        reviewed_by: row.after,
        reviewed_at: row.reviewed_at,
        review_status: row.review_status,
      })
      .eq('slug', row.slug);
    if (updateError) throw new Error(`Update failed for ${row.slug}: ${updateError.message}`);
  }

  console.log(`\nApplied ${updates.length} reviewer updates. Report: ${reportPath}`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
