#!/usr/bin/env node
/**
 * Apply Step 3 reviewer attribution for Spirituality & Meaning hub (content-type axis).
 *
 * Dry run (default):
 *   node scripts/apply-spirituality-reviewer-attribution.mjs
 *
 * Apply:
 *   node scripts/apply-spirituality-reviewer-attribution.mjs --apply
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/reviewer-attribution';

/** Gore → Rick Julian (philosophical / meaning class) */
const TO_RICK = [
  'why-do-i-feel-spiritually-empty-despite-having-n8o2p5',
  'how-do-i-find-my-purpose-when-nothing-feels-meaningful-anymore',
  'can-ai-make-religious-or-spiritual-confusion-worse',
  'can-i-still-be-spiritual-without-being-r-181083-037',
  'how-do-i-cope-with-losing-my-faith-181083-031',
  'how-do-i-explain-my-spiritual-journey-to-181083-041',
  'how-do-i-find-meaning-after-leaving-organized-g5h8i3',
  'how-do-i-find-meaning-after-losing-my-re-181083-034',
  'how-do-i-find-meaning-in-life-when-traditional-c7d2e8',
  'how-do-i-handle-religious-holidays-after-181083-038',
  'how-do-i-know-if-my-spiritual-experiences-are-p5q9r3',
  'is-it-normal-to-feel-angry-at-god-or-rel-181083-033',
  'is-it-normal-to-miss-aspects-of-my-old-f-181083-040',
  'what-do-i-do-when-my-family-rejects-me-f-181083-032',
  'what-does-it-mean-if-i-feel-more-connected-to-z5a2b7',
  'what-does-it-mean-if-i-feel-more-spiritual-in-n2o5p8',
  'what-does-it-mean-to-have-a-spiritual-awakening-j3k6l9',
  'why-do-i-feel-like-i-dont-fit-into-any-spiritual-h4i7j1',
  'why-do-i-feel-like-i-need-to-constantly-prove-y2z6a1',
  'why-do-i-feel-lost-without-religious-com-181083-039',
  'how-do-i-deal-with-feeling-spiritually-lost-after-l3m6n9',
];

/** Rick → Gore (clinical-adjacent class) */
const TO_GORE = [
  'how-do-i-cope-with-the-fear-that-death-means-compl-186602-026',
  'how-do-i-deal-with-feeling-like-my-life-has-177941-025',
];

function parseArgs(argv) {
  return { apply: argv.includes('--apply') };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = resolveSupabaseConfig({ requireWrite: args.apply });
  const supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey);

  const allSlugs = [...TO_RICK, ...TO_GORE];
  const { data: rows, error } = await supabase
    .from('questions_master')
    .select('id, slug, reviewed_by')
    .in('slug', allSlugs);

  if (error) throw new Error(`Supabase fetch failed: ${error.message}`);

  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const missing = allSlugs.filter((slug) => !bySlug.has(slug));
  if (missing.length) {
    throw new Error(`Missing slugs in questions_master: ${missing.join(', ')}`);
  }

  const updates = [
    ...TO_RICK.map((slug) => ({
      slug,
      before: bySlug.get(slug).reviewed_by,
      after: 'rick-julian',
    })),
    ...TO_GORE.map((slug) => ({
      slug,
      before: bySlug.get(slug).reviewed_by,
      after: 'david-k-gore-phd',
    })),
  ];

  console.log(`Spirituality hub reviewer attribution (${args.apply ? 'APPLY' : 'dry run'})`);
  console.log(`  Gore → Rick: ${TO_RICK.length}`);
  console.log(`  Rick → Gore: ${TO_GORE.length}`);
  console.log('');

  for (const row of updates) {
    const unchanged = row.before === row.after;
    console.log(`  ${unchanged ? '=' : '→'} ${row.slug}`);
    console.log(`      ${row.before ?? '(null)'} → ${row.after}`);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `${OUT_DIR}/spirituality-meaning-step3-${stamp}.json`;
  writeFileSync(reportPath, `${JSON.stringify({ updates, missing }, null, 2)}\n`);

  if (!args.apply) {
    console.log(`\nDry run complete. Report: ${reportPath}`);
    return;
  }

  for (const row of updates) {
    if (row.before === row.after) continue;
    const { error: updateError } = await supabase
      .from('questions_master')
      .update({ reviewed_by: row.after })
      .eq('slug', row.slug);
    if (updateError) throw new Error(`Update failed for ${row.slug}: ${updateError.message}`);
  }

  console.log(`\nApplied ${updates.filter((r) => r.before !== r.after).length} updates. Report: ${reportPath}`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
