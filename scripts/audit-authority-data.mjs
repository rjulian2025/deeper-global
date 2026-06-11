#!/usr/bin/env node
/**
 * Read-only authority data audit for Deeper Global.
 * Does not mutate Supabase or local content.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const OUT_PATH = 'docs/deeper-authority-data-audit.md';
const ENV_PATH = '.vercel/.env.production.local';
const MIN_ANSWER_COUNT = 950;
const INDEXABLE_STATUSES = new Set(['approved', 'published', 'reviewed']);

const crisisTerms = [
  'suicide',
  'suicidal',
  'self-harm',
  'self harm',
  'kill myself',
  'overdose',
  'crisis',
];

function parseEnv(path) {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((line) => !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index);
        let value = line.slice(index + 1);
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        return [key, value];
      })
  );
}

function resolveSupabaseConfig() {
  const fileEnv = (() => {
    try {
      return parseEnv(ENV_PATH);
    } catch {
      return {};
    }
  })();

  const url =
    process.env.SUPABASE_URL ??
    process.env.PUBLIC_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    fileEnv.SUPABASE_URL ??
    fileEnv.PUBLIC_SUPABASE_URL ??
    fileEnv.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    fileEnv.SUPABASE_ANON_KEY ??
    fileEnv.PUBLIC_SUPABASE_ANON_KEY ??
    fileEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY or use .vercel/.env.production.local.'
    );
  }

  return { url, key };
}

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function hasSourceRefs(question) {
  if (!Array.isArray(question.source_refs) || question.source_refs.length === 0) return false;
  return question.source_refs.some((item) => {
    if (!item || typeof item !== 'object') return false;
    const record = item;
    return Boolean(cleanText(record.title) || cleanText(record.url));
  });
}

function isV2Answer(question) {
  if (question.content_enriched_at) return true;
  return Array.isArray(question.answer_sections) && question.answer_sections.length > 0;
}

function isIndexable(question) {
  const status = cleanText(question.review_status).toLowerCase();
  if (!status) return true;
  return INDEXABLE_STATUSES.has(status);
}

function isCrisisSensitive(question) {
  const text = `${question.question} ${question.improved_title ?? ''} ${question.short_answer} ${question.improved_summary ?? ''} ${question.triage ?? ''}`.toLowerCase();
  return crisisTerms.some((term) => text.includes(term));
}

function displayCategory(question) {
  return cleanText(question.category) || cleanText(question.raw_category) || 'Uncategorized';
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function pct(count, total) {
  if (!total) return '0.0%';
  return `${((count / total) * 100).toFixed(1)}%`;
}

function topEntries(map, limit = 15) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

async function fetchAllQuestions(client) {
  const pageSize = 1000;
  const pages = [];

  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const { data, error } = await client
      .from('questions_master')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const page = data ?? [];
    pages.push(...page);
    if (page.length < pageSize) break;
  }

  return pages;
}

function detectDuplicateSlugPatterns(questions) {
  const patterns = {
    'why-do-i-feel-like': 0,
    'how-do-i-deal-with-feeling-like': 0,
    'how-do-i-stop-feeling-like': 0,
    'what-should-i-do-if': 0,
    'what-if': 0,
    'how-do-i-know-if': 0,
  };

  for (const question of questions) {
    const slug = cleanText(question.slug);
    for (const pattern of Object.keys(patterns)) {
      if (slug.startsWith(pattern)) patterns[pattern] += 1;
    }
  }

  return patterns;
}

function duplicateSlugCollisions(questions) {
  const bySlug = new Map();
  for (const question of questions) {
    const slug = cleanText(question.slug);
    bySlug.set(slug, (bySlug.get(slug) ?? 0) + 1);
  }
  return [...bySlug.entries()].filter(([, count]) => count > 1);
}

async function main() {
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });
  const questions = await fetchAllQuestions(client);
  const total = questions.length;
  const generatedAt = new Date().toISOString();

  const reviewStatusCounts = new Map();
  let withSourceRefs = 0;
  let withReviewedBy = 0;
  let v2Count = 0;
  let indexableCount = 0;
  let crisisCount = 0;
  const entityCounts = new Map();
  const categoryCounts = new Map();

  for (const question of questions) {
    const status = cleanText(question.review_status).toLowerCase() || '(empty)';
    reviewStatusCounts.set(status, (reviewStatusCounts.get(status) ?? 0) + 1);

    if (hasSourceRefs(question)) withSourceRefs += 1;
    if (cleanText(question.reviewed_by)) withReviewedBy += 1;
    if (isV2Answer(question)) v2Count += 1;
    if (isIndexable(question)) indexableCount += 1;
    if (isCrisisSensitive(question)) crisisCount += 1;

    const category = displayCategory(question);
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);

    const entitySlug = slugify(category);
    entityCounts.set(entitySlug, (entityCounts.get(entitySlug) ?? 0) + 1);
  }

  const duplicatePatterns = detectDuplicateSlugPatterns(questions);
  const slugCollisions = duplicateSlugCollisions(questions);
  const buildFloorStatus = total >= MIN_ANSWER_COUNT ? 'PASS' : 'FAIL';

  const lines = [
    '# Deeper authority data audit',
    '',
    `Generated: ${generatedAt}`,
    '',
    'Read-only snapshot from `questions_master`. No data was modified.',
    '',
    '## Summary',
    '',
    `| Metric | Count | Share |`,
    `| --- | ---: | ---: |`,
    `| Total answers | ${total} | 100% |`,
    `| Likely v2 answers (\`content_enriched_at\` or \`answer_sections\`) | ${v2Count} | ${pct(v2Count, total)} |`,
    `| Indexable by current \`shouldIndexQuestion\` rule | ${indexableCount} | ${pct(indexableCount, total)} |`,
    `| With populated \`source_refs\` | ${withSourceRefs} | ${pct(withSourceRefs, total)} |`,
    `| With populated \`reviewed_by\` | ${withReviewedBy} | ${pct(withReviewedBy, total)} |`,
    `| Crisis-sensitive (keyword heuristic) | ${crisisCount} | ${pct(crisisCount, total)} |`,
    `| Build answer-count floor (\`${MIN_ANSWER_COUNT}+\`) | ${buildFloorStatus} | — |`,
    '',
    '## review_status distribution',
    '',
    '| Status | Count | Share |',
    '| --- | ---: | ---: |',
    ...topEntries(reviewStatusCounts, 50).map(
      ([status, count]) => `| ${status} | ${count} | ${pct(count, total)} |`
    ),
    '',
    '## Trust field coverage',
    '',
    '- `source_refs`: rendered on answer pages only when at least one ref has a title or URL.',
    '- `reviewed_by`: rendered on answer pages only when the field is non-empty.',
    '- Answers without either field show a neutral editorial statement and link to `/editorial-policy/`.',
    '',
    '## Entity / category answer counts (top 20 by slug)',
    '',
    '| Entity slug | Answers |',
    '| --- | ---: |',
    ...topEntries(entityCounts, 20).map(([slug, count]) => `| ${slug} | ${count} |`),
    '',
    '## Category labels (top 20)',
    '',
    '| Category | Answers |',
    '| --- | ---: |',
    ...topEntries(categoryCounts, 20).map(([name, count]) => `| ${name} | ${count} |`),
    '',
    '## Duplicate-looking slug patterns',
    '',
    '| Prefix pattern | Count |',
    '| --- | ---: |',
    ...Object.entries(duplicatePatterns).map(([pattern, count]) => `| \`${pattern}\` | ${count} |`),
    '',
    '## Slug collisions',
    '',
    slugCollisions.length
      ? slugCollisions.map(([slug, count]) => `- \`${slug}\`: ${count} rows`).join('\n')
      : 'No duplicate slugs detected.',
    '',
    '## Notes for Phase 1B+',
    '',
    '- Indexation was not changed in Phase 1A; indexable counts reflect existing `shouldIndexQuestion` logic only.',
    '- Entity consolidation and category/entity routing were not changed.',
    '- Use this audit before any broad indexation or canonical entity work.',
    '',
  ];

  mkdirSync('docs', { recursive: true });
  writeFileSync(OUT_PATH, `${lines.join('\n')}\n`);
  console.log(`Wrote ${OUT_PATH} (${total} questions audited)`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
