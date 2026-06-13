#!/usr/bin/env node
/**
 * Score the full corpus and build GSC/demand-prioritized enrichment batches.
 *
 *   npm run content:prepare-corpus-enrichment
 *   npm run content:prepare-corpus-enrichment -- --min-score 90 --batch-size 15
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import {
  completenessScore,
  isCrisisSensitive,
  isV2Answer,
  missingFields,
  resolveSupabaseConfig,
  sourceQuestionForPrompt,
  tierForScore,
} from './lib/content-enrichment-utils.mjs';
import { fetchAnswerPageMetrics } from './lib/gsc-fetch.mjs';

const OUT_DIR = 'reports/enrichment-corpus';
const BATCH_DIR = `${OUT_DIR}/batches`;
const DEMAND_REPORT = 'reports/authority/content-upgrade/top-100-demand-risk-selection.md';
const ADDICTION_REVIEW = 'reports/review-updates/addiction-review-2026-03-13.json';
const PROMPT_PATH = `${OUT_DIR}/corpus-enrichment-codex-prompt.md`;
const PAGE_SIZE = 1000;
const DEFAULT_BATCH_SIZE = 15;
const DEFAULT_MIN_SCORE = 100;

const SELECT_COLUMNS = [
  'id',
  'slug',
  'question',
  'category',
  'raw_category',
  'short_answer',
  'answer',
  'improved_title',
  'improved_meta_description',
  'improved_summary',
  'answer_sections',
  'key_takeaways',
  'care_note',
  'related_questions',
  'suggested_schema_question',
  'suggested_schema_answer',
  'primary_theme',
  'related_themes',
  'source_refs',
  'review_status',
  'reviewed_by',
  'reviewed_at',
  'content_enriched_at',
].join(', ');

function parseArgs(argv) {
  const args = { batchSize: DEFAULT_BATCH_SIZE, minScore: DEFAULT_MIN_SCORE, limit: null };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--batch-size') {
      args.batchSize = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith('--batch-size=')) {
      args.batchSize = Number(arg.slice('--batch-size='.length));
      continue;
    }
    if (arg === '--min-score') {
      args.minScore = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith('--min-score=')) {
      args.minScore = Number(arg.slice('--min-score='.length));
      continue;
    }
    if (arg === '--limit') {
      args.limit = Number(argv[index + 1]);
      index += 1;
    }
  }

  return args;
}

function pct(count, total) {
  if (!total) return '0.0%';
  return `${((count / total) * 100).toFixed(1)}%`;
}

function chunk(items, size) {
  const batches = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

function loadAddictionSlugs() {
  try {
    const report = JSON.parse(readFileSync(ADDICTION_REVIEW, 'utf8'));
    return new Set((report.matches ?? []).map((match) => match.slug).filter(Boolean));
  } catch {
    return new Set();
  }
}

function loadDemandProxyRanks() {
  const ranks = new Map();
  try {
    const markdown = readFileSync(DEMAND_REPORT, 'utf8');
    const rows = markdown.match(/^\|\s*\d+\s*\|[^|\n]+\|[^|\n]+\|[^|\n]+\|\s*([a-z0-9-]+)\s*\|/gm) ?? [];
    for (const row of rows) {
      const match = row.match(/^\|\s*(\d+)\s*\|[^|\n]+\|[^|\n]+\|[^|\n]+\|\s*([a-z0-9-]+)\s*\|/);
      if (!match) continue;
      ranks.set(match[2], Number(match[1]));
    }
  } catch {
    // demand report optional
  }
  return ranks;
}

async function fetchAllQuestions(client) {
  const rows = [];
  let from = 0;

  while (true) {
    const { data, error } = await client
      .from('questions_master')
      .select(SELECT_COLUMNS)
      .order('slug', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

function priorityScore(row) {
  const gsc = row.gsc ?? { clicks: 0, impressions: 0 };
  const demandBoost = row.demand_proxy_rank ? Math.max(0, 220 - row.demand_proxy_rank) : 0;
  const completenessPenalty = 100 - row.completeness_score;
  const crisisBoost = row.crisis_sensitive ? 25 : 0;

  return gsc.clicks * 100 + gsc.impressions + demandBoost * 5 + completenessPenalty + crisisBoost;
}

function markdownReport({ generatedAt, args, gsc, scoredRows, upgradeQueue, batches, addictionSlugs }) {
  const total = scoredRows.length;
  const needsUpgrade = upgradeQueue.length;
  const avgScore = total ? Math.round(scoredRows.reduce((sum, row) => sum + row.completeness_score, 0) / total) : 0;
  const gscMatched = upgradeQueue.filter((row) => row.gsc?.impressions).length;

  const queueRows = upgradeQueue
    .slice(0, 40)
    .map(
      (row, index) =>
        `| ${index + 1} | ${row.slug} | ${row.completeness_score} | ${row.gsc?.clicks ?? 0} | ${row.gsc?.impressions ?? 0} | ${row.demand_proxy_rank ?? '—'} | ${row.category} | ${row.missing_fields.slice(0, 3).join(', ') || '—'} |`
    )
    .join('\n');

  const batchList = batches
    .map((batch, index) => {
      const gscInBatch = batch.filter((row) => row.gsc?.impressions).length;
      return `- \`batches/batch-${String(index + 1).padStart(2, '0')}-input.json\` — ${batch.length} answers (${gscInBatch} with GSC impressions)`;
    })
    .join('\n');

  return `# Corpus enrichment priority audit

Generated: ${generatedAt}

Upgrade threshold: completeness score < ${args.minScore}

## Demand signals

| Signal | Status |
| --- | --- |
| Google Search Console | ${gsc.available ? `available (${gsc.dateRange.startDate} to ${gsc.dateRange.endDate})` : `unavailable — ${gsc.reason}`} |
| Demand-proxy ranks | \`${DEMAND_REPORT}\` |
| Addiction corpus complete | ${addictionSlugs.size} slugs tracked in review report |

Priority order: **GSC clicks/impressions → demand-proxy rank → completeness gap → crisis sensitivity**.

## Summary

| Metric | Count | Share |
| --- | ---: | ---: |
| Total answers scanned | ${total} | 100% |
| Needs upgrade (< ${args.minScore}) | ${needsUpgrade} | ${pct(needsUpgrade, total)} |
| Upgrade queue with GSC data | ${gscMatched} | ${pct(gscMatched, needsUpgrade)} |
| Average completeness (all) | ${avgScore} | — |

## Upgrade queue (top 40)

| # | Slug | Score | GSC clicks | GSC impr. | Demand rank | Category | Missing (sample) |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
${queueRows || '| — | — | — | — | — | — | — | — |'}

## Generation batches

Use \`${PROMPT_PATH}\` with one batch at a time.

${batchList || '- none'}

## Workflow

1. Generate drafts: \`reports/enrichment-corpus/draft-answers/batch-01-drafts.json\`
2. Dry-run: \`npm run content:apply-enrichment -- --campaign enrichment reports/enrichment-corpus/draft-answers/batch-01-drafts.json\`
3. Apply: \`npm run content:apply-enrichment -- --apply --campaign enrichment reports/enrichment-corpus/draft-answers/batch-01-drafts.json\`
`;
}

function writePromptFile() {
  const prompt = `# Codex prompt — Corpus legacy enrichment (GSC-prioritized)

Use one batch input file at a time from \`reports/enrichment-corpus/batches/\`.

\`\`\`text
You are upgrading existing Deeper Global mental-health answers in place.

Goal:
Create v2 enrichment draft content for the provided legacy answer batch only.

Hard rules:
- Do not write to Supabase.
- Do not change slugs or URLs.
- Do not assign or change reviewer names.
- Do not mark anything reviewed, approved, published, clinically reviewed, or medically reviewed.
- Every output item must remain review_status = "draft".
- Every output item must remain indexation_instruction = "noindex_until_reviewed".
- Preserve the original question intent and slug exactly.
- If source coverage is weak, flag it in citation_gaps instead of pretending it is complete.
- No diagnosis, no medication instructions, no legal advice.

Output: single JSON array only (same schema as addiction enrichment drafts).

Sections: What may be happening / What can help / When to get support
Include: improved_title, improved_meta_description, improved_summary, key_takeaways (4),
answer_sections (3), care_note, related_questions (5), suggested_schema_question,
suggested_schema_answer, primary_theme, related_themes, source_refs (2+),
citation_gaps, safety_flags, draft_notes.

After returning the JSON array, stop.
\`\`\`
`;

  writeFileSync(PROMPT_PATH, prompt);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });
  const addictionSlugs = loadAddictionSlugs();
  const demandRanks = loadDemandProxyRanks();
  const gsc = await fetchAnswerPageMetrics({ rowLimit: 1000 });

  const questions = await fetchAllQuestions(client);
  const scoredRows = questions.map((question) => {
    const score = completenessScore(question);
    const missing = missingFields(question);
    const crisisSensitive = isCrisisSensitive(question);
    const gscMetrics = gsc.bySlug.get(question.slug) ?? null;

    return {
      ...sourceQuestionForPrompt(question, {
        completeness: score,
        missing,
        crisisSensitive,
      }),
      tier: tierForScore(score),
      is_v2: isV2Answer(question),
      missing_fields: missing,
      crisis_sensitive: crisisSensitive,
      completeness_score: score,
      is_addiction_corpus: addictionSlugs.has(question.slug),
      demand_proxy_rank: demandRanks.get(question.slug) ?? null,
      gsc: gscMetrics,
      priority_score: 0,
    };
  });

  const upgradeQueue = scoredRows
    .filter((row) => row.completeness_score < args.minScore)
    .map((row) => ({ ...row, priority_score: priorityScore(row) }))
    .sort((a, b) => {
      if (b.priority_score !== a.priority_score) return b.priority_score - a.priority_score;
      return a.slug.localeCompare(b.slug);
    });

  const limitedQueue = args.limit ? upgradeQueue.slice(0, args.limit) : upgradeQueue;
  const batches = chunk(limitedQueue, args.batchSize);
  const generatedAt = new Date().toISOString();

  mkdirSync(BATCH_DIR, { recursive: true });
  mkdirSync(`${OUT_DIR}/draft-answers`, { recursive: true });
  writePromptFile();

  writeFileSync(`${OUT_DIR}/priority-queue.json`, `${JSON.stringify(limitedQueue, null, 2)}\n`);
  writeFileSync(
    `${OUT_DIR}/summary.json`,
    `${JSON.stringify(
      {
        generated_at: generatedAt,
        total_scanned: scoredRows.length,
        needs_upgrade: upgradeQueue.length,
        upgrade_with_gsc: upgradeQueue.filter((row) => row.gsc?.impressions).length,
        average_completeness_all: scoredRows.length
          ? Math.round(scoredRows.reduce((sum, row) => sum + row.completeness_score, 0) / scoredRows.length)
          : 0,
        average_completeness_needs_upgrade: upgradeQueue.length
          ? Math.round(upgradeQueue.reduce((sum, row) => sum + row.completeness_score, 0) / upgradeQueue.length)
          : 0,
        gsc_available: gsc.available,
        gsc_reason: gsc.available ? null : gsc.reason,
        gsc_date_range: gsc.dateRange,
        batch_count: batches.length,
        batch_size: args.batchSize,
        min_score: args.minScore,
        top_10: limitedQueue.slice(0, 10).map((row) => ({
          slug: row.slug,
          score: row.completeness_score,
          priority_score: row.priority_score,
          gsc_clicks: row.gsc?.clicks ?? 0,
          gsc_impressions: row.gsc?.impressions ?? 0,
          demand_proxy_rank: row.demand_proxy_rank,
        })),
      },
      null,
      2
    )}\n`
  );

  batches.forEach((batch, index) => {
    const batchName = `batch-${String(index + 1).padStart(2, '0')}-input.json`;
    writeFileSync(`${BATCH_DIR}/${batchName}`, `${JSON.stringify(batch, null, 2)}\n`);
  });

  writeFileSync(
    `${OUT_DIR}/priority-queue.md`,
    markdownReport({ generatedAt, args, gsc, scoredRows, upgradeQueue: limitedQueue, batches, addictionSlugs })
  );

  console.log(
    JSON.stringify(
      {
        out_dir: OUT_DIR,
        total_scanned: scoredRows.length,
        needs_upgrade: upgradeQueue.length,
        gsc_available: gsc.available,
        batch_count: batches.length,
        priority_report: `${OUT_DIR}/priority-queue.md`,
        top_slug: limitedQueue[0]?.slug ?? null,
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
