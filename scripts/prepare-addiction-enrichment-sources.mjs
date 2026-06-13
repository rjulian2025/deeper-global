#!/usr/bin/env node
/**
 * Export addiction answer rows with completeness gaps and generation batches.
 *
 *   npm run content:prepare-addiction-enrichment
 *
 * Optional:
 *   npm run content:prepare-addiction-enrichment -- --batch-size 12
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

const OUT_DIR = 'reports/enrichment-addiction';
const BATCH_DIR = `${OUT_DIR}/batches`;
const REVIEW_REPORT = 'reports/review-updates/addiction-review-2026-03-13.json';
const PROMPT_PATH = `${OUT_DIR}/addiction-enrichment-codex-prompt.md`;
const PAGE_SIZE = 1000;
const DEFAULT_BATCH_SIZE = 15;

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
  const args = { batchSize: DEFAULT_BATCH_SIZE, reportPath: REVIEW_REPORT };

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
    if (arg === '--report') {
      args.reportPath = argv[index + 1];
      index += 1;
    }
  }

  if (!Number.isFinite(args.batchSize) || args.batchSize < 1) {
    throw new Error('--batch-size must be a positive number.');
  }

  return args;
}

function loadAddictionSlugs(reportPath) {
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  const slugs = (report.matches ?? []).map((match) => match.slug).filter(Boolean);
  if (!slugs.length) throw new Error(`No addiction slugs found in ${reportPath}.`);
  return slugs;
}

async function fetchQuestionsBySlugs(client, slugs) {
  const bySlug = new Map();

  for (let index = 0; index < slugs.length; index += PAGE_SIZE) {
    const chunk = slugs.slice(index, index + PAGE_SIZE);
    const { data, error } = await client.from('questions_master').select(SELECT_COLUMNS).in('slug', chunk);
    if (error) throw error;
    for (const row of data ?? []) {
      bySlug.set(row.slug, row);
    }
  }

  return bySlug;
}

function sortForUpgrade(rows) {
  return [...rows].sort((a, b) => {
    if (a.crisis_sensitive !== b.crisis_sensitive) return a.crisis_sensitive ? -1 : 1;
    if (a.completeness_score !== b.completeness_score) return a.completeness_score - b.completeness_score;
    return a.slug.localeCompare(b.slug);
  });
}

function chunk(items, size) {
  const batches = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

function pct(count, total) {
  if (!total) return '0.0%';
  return `${((count / total) * 100).toFixed(1)}%`;
}

function markdownReport({ generatedAt, slugs, scoredRows, batches, missingSlugs }) {
  const total = scoredRows.length;
  const v2Count = scoredRows.filter((row) => row.is_v2).length;
  const completeCount = scoredRows.filter((row) => row.tier === 'complete').length;
  const crisisCount = scoredRows.filter((row) => row.crisis_sensitive).length;
  const avgScore = total ? Math.round(scoredRows.reduce((sum, row) => sum + row.completeness_score, 0) / total) : 0;

  const fieldCounts = {};
  for (const row of scoredRows) {
    for (const field of row.missing_fields) {
      fieldCounts[field] = (fieldCounts[field] ?? 0) + 1;
    }
  }

  const topMissing = Object.entries(fieldCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([field, count]) => `| ${field} | ${count} | ${pct(count, total)} |`)
    .join('\n');

  const queueRows = scoredRows
    .slice(0, 30)
    .map(
      (row, index) =>
        `| ${index + 1} | ${row.slug} | ${row.completeness_score} | ${row.tier} | ${row.crisis_sensitive ? 'yes' : 'no'} | ${row.missing_fields.slice(0, 4).join(', ') || '—'} |`
    )
    .join('\n');

  const batchList = batches
    .map((batch, index) => {
      const crisisInBatch = batch.filter((row) => row.crisis_sensitive).length;
      return `- \`batches/batch-${String(index + 1).padStart(2, '0')}-input.json\` — ${batch.length} answers (${crisisInBatch} crisis-sensitive)`;
    })
    .join('\n');

  return `# Addiction enrichment completeness audit

Generated: ${generatedAt}

Source slugs: \`${REVIEW_REPORT}\` (${slugs.length} addiction answers)

## Summary

| Metric | Count | Share |
| --- | ---: | ---: |
| Addiction answers scanned | ${total} | 100% |
| Missing from Supabase | ${missingSlugs.length} | ${pct(missingSlugs.length, slugs.length)} |
| Likely v2 answers | ${v2Count} | ${pct(v2Count, total)} |
| Complete (score ≥ 90) | ${completeCount} | ${pct(completeCount, total)} |
| Crisis-sensitive (priority) | ${crisisCount} | ${pct(crisisCount, total)} |
| Average completeness score | ${avgScore} | — |

## Most common missing fields

| Field | Missing | Share |
| --- | ---: | ---: |
${topMissing || '| — | 0 | 0% |'}

## Upgrade queue (top 30)

| # | Slug | Score | Tier | Crisis | Missing (sample) |
| --- | --- | ---: | --- | --- | --- |
${queueRows || '| — | — | — | — | — |'}

## Generation batches

Use \`${PROMPT_PATH}\` with Cursor/Codex, one batch at a time.

${batchList}

## Workflow

1. Generate drafts: \`reports/enrichment-addiction/draft-answers/batch-01-drafts.json\`
2. Dry-run promote: \`npm run content:promote-enrichment -- reports/enrichment-addiction/draft-answers/batch-01-drafts.json\`
3. Apply promote: \`SUPABASE_SERVICE_ROLE_KEY=... npm run content:promote-enrichment -- --apply reports/enrichment-addiction/draft-answers/batch-01-drafts.json\`
4. Deploy and spot-check 2–3 addiction pages per batch.
`;
}

function writePromptFile() {
  const prompt = `# Codex prompt — Addiction legacy enrichment

Use this prompt with one batch input file at a time, starting with \`reports/enrichment-addiction/batches/batch-01-input.json\`.

\`\`\`text
You are upgrading existing Deeper Global addiction & recovery answers in place.

Goal:
Create v2 enrichment draft content for the provided legacy addiction answer batch only.

Hard rules:
- Do not write to Supabase.
- Do not change app code.
- Do not create redirects.
- Do not change slugs or URLs.
- Do not make indexation decisions.
- Do not publish content.
- Do not assign or change reviewer names.
- Do not mark anything reviewed, approved, published, clinically reviewed, or medically reviewed.
- Every output item must remain review_status = "draft".
- Every output item must remain indexation_instruction = "noindex_until_reviewed".
- Preserve the original question intent and slug exactly.
- If source coverage is weak, flag it in citation_gaps instead of pretending it is complete.

Input:
I will provide a JSON array of existing addiction answers. Each item includes slug, question, category, legacy short_answer/answer, current enriched fields (if any), completeness_score, missing_fields, and crisis_sensitive flags.

Output:
Return a single JSON array only. Do not include Markdown outside the JSON.

For each input item, return:
{
  "question": "original question",
  "slug": "same slug as input",
  "category": "same category as input",
  "review_status": "draft",
  "indexation_instruction": "noindex_until_reviewed",
  "improved_title": "clear, human, search-aligned title",
  "improved_meta_description": "under 160 characters when possible",
  "improved_summary": "2-3 sentence direct answer summary",
  "key_takeaways": ["3-5 concise takeaways"],
  "answer_sections": [
    { "type": "section", "heading": "What may be happening", "body": "short paragraphs" },
    { "type": "section", "heading": "What can help", "body": "short paragraphs" },
    { "type": "section", "heading": "When to get support", "body": "short paragraphs" }
  ],
  "care_note": "calm support note; include urgent/crisis guidance only where relevant",
  "related_questions": ["3-6 natural follow-up questions"],
  "suggested_schema_question": "schema-safe question",
  "suggested_schema_answer": "brief schema-safe answer, non-diagnostic",
  "primary_theme": "Addiction & Recovery or refined theme",
  "related_themes": ["2-5 related themes"],
  "source_refs": [
    {
      "title": "source title",
      "url": "source URL",
      "publisher": "publisher",
      "note": "what this source supports"
    }
  ],
  "citation_gaps": ["list missing/weak source areas, or [] if source support is adequate"],
  "safety_flags": ["crisis-sensitive when appropriate, else none"],
  "draft_notes": "anything a human editor must check before promotion"
}

Writing rules:
- Consumer-facing, calm, plain-English.
- No diagnosis: use may/can/often/for some people.
- Do not provide medication instructions.
- Do not provide legal advice.
- For crisis-sensitive addiction topics (relapse, overdose, withdrawal, detox, pregnancy + use), include appropriate escalation language without making the whole answer alarmist.
- Prefer specific, useful explanation over generic recovery advice.
- Do not imply source_refs are final clinical citations; they are source candidates until reviewed.

After returning the JSON array, stop.
\`\`\`
`;

  writeFileSync(PROMPT_PATH, prompt);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const slugs = loadAddictionSlugs(args.reportPath);
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });
  const bySlug = await fetchQuestionsBySlugs(client, slugs);
  const missingSlugs = slugs.filter((slug) => !bySlug.has(slug));

  const scoredRows = slugs
    .filter((slug) => bySlug.has(slug))
    .map((slug) => {
      const question = bySlug.get(slug);
      const score = completenessScore(question);
      const missing = missingFields(question);
      const crisisSensitive = isCrisisSensitive(question);

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
      };
    });

  const orderedRows = sortForUpgrade(scoredRows);
  const batches = chunk(orderedRows, args.batchSize);
  const generatedAt = new Date().toISOString();

  mkdirSync(BATCH_DIR, { recursive: true });
  mkdirSync(`${OUT_DIR}/draft-answers`, { recursive: true });
  writePromptFile();

  writeFileSync(`${OUT_DIR}/all-slugs.json`, `${JSON.stringify(orderedRows, null, 2)}\n`);
  writeFileSync(`${OUT_DIR}/source-questions.json`, `${JSON.stringify(orderedRows, null, 2)}\n`);
  writeFileSync(
    `${OUT_DIR}/summary.json`,
    `${JSON.stringify(
      {
        generated_at: generatedAt,
        report_path: args.reportPath,
        addiction_slug_count: slugs.length,
        fetched_count: orderedRows.length,
        missing_slug_count: missingSlugs.length,
        missing_slugs: missingSlugs,
        batch_size: args.batchSize,
        batch_count: batches.length,
        v2_count: orderedRows.filter((row) => row.is_v2).length,
        complete_count: orderedRows.filter((row) => row.tier === 'complete').length,
        crisis_sensitive_count: orderedRows.filter((row) => row.crisis_sensitive).length,
        average_completeness_score: orderedRows.length
          ? Math.round(orderedRows.reduce((sum, row) => sum + row.completeness_score, 0) / orderedRows.length)
          : 0,
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
    `${OUT_DIR}/completeness-gaps.md`,
    markdownReport({
      generatedAt,
      slugs,
      scoredRows: orderedRows,
      batches,
      missingSlugs,
    })
  );

  console.log(
    JSON.stringify(
      {
        out_dir: OUT_DIR,
        addiction_slug_count: slugs.length,
        fetched_count: orderedRows.length,
        missing_slug_count: missingSlugs.length,
        batch_count: batches.length,
        batch_size: args.batchSize,
        prompt_path: PROMPT_PATH,
        completeness_report: `${OUT_DIR}/completeness-gaps.md`,
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
