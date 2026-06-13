#!/usr/bin/env node
/**
 * Read-only audit for proposed Deeper Global question candidates.
 *
 * Usage:
 *   npm run content:audit-candidates -- reports/phase-1b/candidates.json
 *
 * The input must be a JSON array of objects:
 *   {
 *     "question": "How do I know if I need therapy?",
 *     "category": "Therapy Navigation",
 *     "slug": "how-do-i-know-if-i-need-therapy",
 *     "source_refs": [{ "title": "...", "url": "...", "publisher": "..." }],
 *     "notes": "Optional editorial note"
 *   }
 *
 * This script does not write to Supabase. It compares candidates against the
 * current `questions_master` table and writes a local Markdown report.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const ENV_PATH = '.vercel/.env.production.local';
const OUT_DIR = 'reports/phase-1b';
const OUT_PATH = `${OUT_DIR}/content-candidates-audit.md`;
const PAGE_SIZE = 1000;

const ALLOWED_PILOT_CATEGORIES = [
  'Addiction & Recovery',
  'Anxiety & Stress',
  'Communication & Conflict',
  'Depression',
  'Family & Parenting',
  'General Mental Health',
  'Grief & Loss',
  'Identity & Self-Worth',
  'Loneliness & Isolation',
  'Parenting',
  'Relationships & Communication',
  'Relationships & Divorce',
  'Teen-Specific Questions',
  'Teens & Identity',
  'Therapy & Mental Health',
  'Therapy Navigation',
  'Trauma & Grief',
  'Work & Burnout',
  'Work & Life Balance',
  'Work, Stress & Burnout',
];

const CRISIS_TERMS = [
  'suicide',
  'suicidal',
  'self-harm',
  'self harm',
  'kill myself',
  'overdose',
  'crisis',
];

const DUPLICATE_PREFIX_PATTERNS = [
  'why-do-i-feel-like',
  'how-do-i-deal-with-feeling-like',
  'how-do-i-stop-feeling-like',
  'what-should-i-do-if',
  'what-if',
  'how-do-i-know-if',
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

function normalizeQuestion(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function tokenSet(value) {
  return new Set(
    normalizeQuestion(value)
      .split(' ')
      .filter((token) => token.length > 2)
  );
}

function jaccard(a, b) {
  const left = tokenSet(a);
  const right = tokenSet(b);
  if (!left.size || !right.size) return 0;

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }

  const union = new Set([...left, ...right]).size;
  return intersection / union;
}

function isCrisisSensitive(candidate) {
  const text = `${candidate.question ?? ''} ${candidate.notes ?? ''}`.toLowerCase();
  return CRISIS_TERMS.some((term) => text.includes(term));
}

function hasSourceRefs(candidate) {
  if (!Array.isArray(candidate.source_refs)) return false;
  return candidate.source_refs.some((source) => {
    if (!source || typeof source !== 'object') return false;
    return Boolean(cleanText(source.title) || cleanText(source.url));
  });
}

async function fetchAllQuestions(client) {
  const pages = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await client
      .from('questions_master')
      .select('id, question, slug, category, raw_category, review_status')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const page = data ?? [];
    pages.push(...page);
    if (page.length < PAGE_SIZE) break;
  }

  return pages;
}

function loadCandidates(path) {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(raw)) {
    throw new Error(`Expected ${path} to contain a JSON array.`);
  }

  return raw.map((candidate, index) => ({
    index: index + 1,
    question: cleanText(candidate.question),
    category: cleanText(candidate.category),
    slug: cleanText(candidate.slug) || slugify(candidate.question),
    source_refs: candidate.source_refs,
    notes: cleanText(candidate.notes),
  }));
}

function auditCandidate(candidate, existingQuestions, existingSlugs, existingQuestionMap, candidateSlugs) {
  const issues = [];
  const warnings = [];
  const category = candidate.category;
  const slug = slugify(candidate.slug || candidate.question);
  const normalizedQuestion = normalizeQuestion(candidate.question);

  if (!candidate.question) issues.push('Missing question');
  if (!category) issues.push('Missing category');
  if (!slug) issues.push('Missing slug');

  if (existingSlugs.has(slug)) issues.push(`Slug already exists: ${slug}`);
  if (candidateSlugs.get(slug) > 1) issues.push(`Duplicate slug within candidate batch: ${slug}`);

  if (existingQuestionMap.has(normalizedQuestion)) {
    const existing = existingQuestionMap.get(normalizedQuestion);
    issues.push(`Exact question duplicate of existing slug: ${existing.slug}`);
  }

  if (!ALLOWED_PILOT_CATEGORIES.includes(category)) {
    warnings.push(`Category is outside Phase 1B pilot allowlist: ${category || '(empty)'}`);
  }

  for (const pattern of DUPLICATE_PREFIX_PATTERNS) {
    if (slug.startsWith(pattern)) {
      warnings.push(`Slug starts with duplicate-prone pattern: ${pattern}`);
    }
  }

  const nearest = existingQuestions
    .map((question) => ({
      slug: question.slug,
      question: question.question,
      score: jaccard(candidate.question, question.question),
    }))
    .sort((a, b) => b.score - a.score)[0];

  if (nearest?.score >= 0.72) {
    warnings.push(`Near-duplicate candidate: ${nearest.slug} (${nearest.score.toFixed(2)} similarity)`);
  }

  if (isCrisisSensitive(candidate)) {
    warnings.push('Crisis-sensitive candidate: requires manual safety review before drafting');
  }

  if (!hasSourceRefs(candidate)) {
    warnings.push('No source_refs candidates supplied yet');
  }

  return {
    ...candidate,
    slug,
    issues,
    warnings,
    nearest,
    status: issues.length ? 'BLOCK' : warnings.length ? 'REVIEW' : 'PASS',
  };
}

function summarizeCounts(audits) {
  return audits.reduce(
    (counts, audit) => {
      counts[audit.status] += 1;
      if (audit.warnings.some((warning) => warning.includes('Crisis-sensitive'))) counts.crisis += 1;
      if (audit.warnings.some((warning) => warning.includes('outside Phase 1B'))) counts.categoryWarnings += 1;
      return counts;
    },
    { PASS: 0, REVIEW: 0, BLOCK: 0, crisis: 0, categoryWarnings: 0 }
  );
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    throw new Error('Usage: npm run content:audit-candidates -- reports/phase-1b/candidates.json');
  }

  const candidates = loadCandidates(inputPath);
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });
  const existingQuestions = await fetchAllQuestions(client);
  const existingSlugs = new Set(existingQuestions.map((question) => slugify(question.slug)));
  const existingQuestionMap = new Map(
    existingQuestions.map((question) => [normalizeQuestion(question.question), question])
  );
  const candidateSlugs = candidates.reduce((counts, candidate) => {
    const slug = slugify(candidate.slug || candidate.question);
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
    return counts;
  }, new Map());

  const audits = candidates.map((candidate) =>
    auditCandidate(candidate, existingQuestions, existingSlugs, existingQuestionMap, candidateSlugs)
  );
  const counts = summarizeCounts(audits);
  const generatedAt = new Date().toISOString();

  const lines = [
    '# Deeper Phase 1B content candidate audit',
    '',
    `Generated: ${generatedAt}`,
    `Input: \`${inputPath}\``,
    `Existing answer count checked: ${existingQuestions.length}`,
    '',
    'Read-only audit. No Supabase data was modified.',
    '',
    '## Summary',
    '',
    '| Status | Count |',
    '| --- | ---: |',
    `| PASS | ${counts.PASS} |`,
    `| REVIEW | ${counts.REVIEW} |`,
    `| BLOCK | ${counts.BLOCK} |`,
    `| Crisis-sensitive warnings | ${counts.crisis} |`,
    `| Category allowlist warnings | ${counts.categoryWarnings} |`,
    '',
    '## Candidate results',
    '',
    '| # | Status | Category | Slug | Issues | Warnings |',
    '| ---: | --- | --- | --- | --- | --- |',
    ...audits.map((audit) => {
      const issues = audit.issues.length ? audit.issues.join('; ') : '—';
      const warnings = audit.warnings.length ? audit.warnings.join('; ') : '—';
      return `| ${audit.index} | ${audit.status} | ${audit.category || '—'} | \`${audit.slug}\` | ${issues} | ${warnings} |`;
    }),
    '',
    '## Phase 1B pilot allowlist',
    '',
    ...ALLOWED_PILOT_CATEGORIES.map((category) => `- ${category}`),
    '',
    '## Next step',
    '',
    '- Fix all BLOCK items before drafting.',
    '- Human-review all REVIEW items before any insert or promotion.',
    '- Keep new answers as `review_status = draft` until source and review criteria are met.',
    '',
  ];

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, `${lines.join('\n')}\n`);
  console.log(`Wrote ${OUT_PATH} (${audits.length} candidates from ${basename(inputPath)})`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
