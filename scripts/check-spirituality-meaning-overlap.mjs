#!/usr/bin/env node
/**
 * Re-check Part C candidates against current Spirituality & Meaning hub rows.
 *
 *   node scripts/check-spirituality-meaning-overlap.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';
import { CANDIDATES, HUB_CATEGORIES } from './lib/spirituality-meaning-candidates.mjs';

const OUT_DIR = 'reports/phase-1b/spirituality-meaning';

function tokens(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3);
}

function jaccard(a, b) {
  const left = new Set(tokens(a));
  const right = new Set(tokens(b));
  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }
  const union = new Set([...left, ...right]).size;
  return union ? intersection / union : 0;
}

async function main() {
  const config = resolveSupabaseConfig({ requireWrite: false });
  const supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey);

  const { data: hubRows, error: hubError } = await supabase
    .from('questions_master')
    .select('slug, question, category, improved_title')
    .in('category', HUB_CATEGORIES);
  if (hubError) throw hubError;

  const slugs = CANDIDATES.map((candidate) => candidate.slug);
  const { data: slugRows, error: slugError } = await supabase
    .from('questions_master')
    .select('slug, question')
    .in('slug', slugs);
  if (slugError) throw slugError;

  const slugHits = new Map((slugRows ?? []).map((row) => [row.slug, row]));
  const results = CANDIDATES.map((candidate) => {
    const slugExists = slugHits.has(candidate.slug);
    const exactQuestion = hubRows.some(
      (row) => row.question.trim().toLowerCase() === candidate.question.trim().toLowerCase()
    );
    const nearMatches = hubRows
      .map((row) => ({
        slug: row.slug,
        title: row.improved_title || row.question,
        category: row.category,
        score: jaccard(candidate.question, row.improved_title || row.question),
      }))
      .filter((row) => row.score >= 0.25)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    let status = 'distinct';
    if (slugExists || exactQuestion) status = 'blocked';
    else if (nearMatches.some((match) => match.score >= 0.4)) status = 'review_overlap';

    return {
      gap_id: candidate.gap_id,
      question: candidate.question,
      slug: candidate.slug,
      category: candidate.category,
      reviewer_class: candidate.reviewer_class,
      status,
      slug_exists: slugExists,
      exact_question_match: exactQuestion,
      near_hub_matches: nearMatches,
      crisis_safety_flag: candidate.crisis_safety_flag,
    };
  });

  mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString();
  const jsonPath = `${OUT_DIR}/overlap-recheck-${stamp.slice(0, 10)}.json`;
  writeFileSync(jsonPath, `${JSON.stringify({ generated_at: stamp, results }, null, 2)}\n`);

  const mdLines = [
    '# Spirituality & Meaning Part C overlap re-check',
    '',
    `Generated: ${stamp}`,
    '',
    'Hub categories: Spiritual Doubt, Spiritual Struggle / Existential Crisis, Existential, Life Purpose.',
    '',
    '| # | Status | Question | Slug | Near hub (≥25%) |',
    '|---:|---|---|---|---|',
  ];

  for (const row of results) {
    const near =
      row.near_hub_matches.length === 0
        ? '—'
        : row.near_hub_matches.map((match) => `\`${match.slug}\` (${Math.round(match.score * 100)}%)`).join('; ');
    mdLines.push(
      `| ${row.gap_id} | **${row.status}** | ${row.question.replace(/\|/g, '\\|')} | \`${row.slug}\` | ${near} |`
    );
  }

  mdLines.push('', '## Notes', '');
  mdLines.push(
    '- **blocked**: slug or exact question already exists; do not insert.',
    '- **review_overlap**: token overlap ≥40% with an existing hub page; confirm angle before promote.',
    '- **distinct**: safe to draft; no slug collision.',
    '',
    `JSON: \`${jsonPath}\``,
  );

  const mdPath = `${OUT_DIR}/overlap-recheck-summary.md`;
  writeFileSync(mdPath, `${mdLines.join('\n')}\n`);

  console.log(`Overlap re-check complete (${results.length} candidates)`);
  console.log(`  distinct: ${results.filter((row) => row.status === 'distinct').length}`);
  console.log(`  review_overlap: ${results.filter((row) => row.status === 'review_overlap').length}`);
  console.log(`  blocked: ${results.filter((row) => row.status === 'blocked').length}`);
  console.log(`  report: ${mdPath}`);
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
