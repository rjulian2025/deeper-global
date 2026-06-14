#!/usr/bin/env node
/**
 * Final completeness report for all answers in questions_master.
 *
 *   npm run content:report-completeness
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { completenessScore, tierForScore } from './lib/content-enrichment-utils.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/enrichment-corpus';
const SELECT_FIELDS =
  'slug,question,category,review_status,reviewed_by,content_enriched_at,improved_title,improved_meta_description,improved_summary,answer_sections,key_takeaways,care_note,related_questions,suggested_schema_question,suggested_schema_answer,primary_theme,related_themes,source_refs';

async function fetchAllQuestions(client) {
  const rows = [];
  let from = 0;

  while (true) {
    const { data, error } = await client.from('questions_master').select(SELECT_FIELDS).range(from, from + 999);
    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }

  return rows;
}

async function main() {
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });
  const questions = await fetchAllQuestions(client);

  const scored = questions.map((question) => ({
    slug: question.slug,
    question: question.question,
    category: question.category,
    score: completenessScore(question),
    tier: tierForScore(completenessScore(question)),
    review_status: question.review_status,
    reviewed_by: question.reviewed_by,
    enriched: Boolean(question.content_enriched_at),
    section_count: Array.isArray(question.answer_sections) ? question.answer_sections.length : 0,
    takeaway_count: Array.isArray(question.key_takeaways) ? question.key_takeaways.length : 0,
    source_ref_count: Array.isArray(question.source_refs) ? question.source_refs.length : 0,
  }));

  const buckets = {};
  for (const row of scored) {
    buckets[row.score] = (buckets[row.score] || 0) + 1;
  }

  const below100 = scored.filter((row) => row.score < 100).sort((a, b) => a.score - b.score || a.slug.localeCompare(b.slug));
  const at100 = scored.filter((row) => row.score >= 100).length;

  const report = {
    generated_at: new Date().toISOString(),
    total_answers: scored.length,
    completeness_100: at100,
    completeness_below_100: below100.length,
    pct_complete: scored.length ? Math.round((at100 / scored.length) * 1000) / 10 : 0,
    score_buckets: buckets,
    enriched_count: scored.filter((row) => row.enriched).length,
    below_100: below100,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(`${OUT_DIR}/completeness-final.json`, `${JSON.stringify(report, null, 2)}\n`);

  const md = `# Final completeness report

Generated: ${report.generated_at}

## Summary

| Metric | Count |
| --- | ---: |
| Total answers | ${report.total_answers} |
| **Completeness 100** | **${report.completeness_100}** (${report.pct_complete}%) |
| Below 100 | ${report.completeness_below_100} |
| With \`content_enriched_at\` | ${report.enriched_count} |

## Score distribution

${Object.entries(buckets)
  .sort((a, b) => Number(b[0]) - Number(a[0]))
  .map(([score, count]) => `- **${score}**: ${count}`)
  .join('\n')}

## Below 100 (${below100.length})

${below100.length ? below100.map((row) => `- \`${row.slug}\` — score ${row.score}, refs ${row.source_ref_count}`).join('\n') : '_None — all answers at 100/100._'}
`;

  writeFileSync(`${OUT_DIR}/completeness-final.md`, md);
  console.log(JSON.stringify({
    total: report.total_answers,
    at100: report.completeness_100,
    below100: report.completeness_below_100,
    pct: report.pct_complete,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
