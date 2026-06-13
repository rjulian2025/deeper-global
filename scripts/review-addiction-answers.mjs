#!/usr/bin/env node
/**
 * Identify addiction-related answers and optionally mark them clinically reviewed.
 *
 * Dry run with report:
 *   npm run content:review-addiction -- --write-report
 *
 * Apply with service role credentials:
 *   SUPABASE_SERVICE_ROLE_KEY=... npm run content:review-addiction -- --apply
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const ENV_PATH = '.vercel/.env.production.local';
const OUT_DIR = 'reports/review-updates';
const DEFAULT_REVIEWER = 'david-k-gore-phd';
const DEFAULT_REVIEWED_AT = '2026-03-13';
const PAGE_SIZE = 1000;
const ADDICTION_CONTEXT_PATTERN =
  /\baddict(?:ion|ive|ed)?s?\b|\bsubstance(?:s)?(?: use)?\b|\bdrug use\b|\balcohol(?:ic|ism)?\b|\bdrink(?:ing)?\b|\bsober|sobriety\b/;

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

function firstPresent(...values) {
  return values.find((value) => typeof value === 'string' && value.trim());
}

function readEnv() {
  const fileEnv = (() => {
    try {
      return parseEnv(ENV_PATH);
    } catch {
      return {};
    }
  })();

  const serviceRoleKey = firstPresent(process.env.SUPABASE_SERVICE_ROLE_KEY, fileEnv.SUPABASE_SERVICE_ROLE_KEY);
  const url = firstPresent(
    process.env.SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    fileEnv.SUPABASE_URL,
    fileEnv.PUBLIC_SUPABASE_URL,
    fileEnv.NEXT_PUBLIC_SUPABASE_URL
  );
  const anonKey = firstPresent(
    process.env.SUPABASE_ANON_KEY,
    process.env.PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    fileEnv.SUPABASE_ANON_KEY,
    fileEnv.PUBLIC_SUPABASE_ANON_KEY,
    fileEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return { url, anonKey, serviceRoleKey };
}

function parseArgs(argv) {
  const args = {
    apply: false,
    writeReport: false,
    reviewer: DEFAULT_REVIEWER,
    reviewedAt: DEFAULT_REVIEWED_AT,
  };

  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    if (arg === '--write-report') args.writeReport = true;
    if (arg.startsWith('--reviewer=')) args.reviewer = arg.slice('--reviewer='.length);
    if (arg.startsWith('--reviewed-at=')) args.reviewedAt = arg.slice('--reviewed-at='.length);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reviewedAt)) {
    throw new Error(`reviewed_at must be YYYY-MM-DD, got "${args.reviewedAt}".`);
  }

  return args;
}

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function valuesFromJson(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === 'string') return [item];
      if (item && typeof item === 'object') return Object.values(item).filter((entry) => typeof entry === 'string');
      return [];
    });
  }
  if (typeof value === 'object') return Object.values(value).filter((entry) => typeof entry === 'string');
  return [];
}

function searchableText(question) {
  return normalize(
    [
      question.slug,
      question.question,
      question.improved_title,
      question.category,
      question.raw_category,
      question.primary_theme,
      ...valuesFromJson(question.related_themes),
      ...valuesFromJson(question.primary_entities),
      ...valuesFromJson(question.related_entities),
    ].join(' ')
  );
}

function matchAddictionAnswer(question) {
  const text = searchableText(question);
  const reasons = [];

  const addReason = (label, pattern) => {
    if (pattern.test(text)) reasons.push(label);
  };

  addReason('addiction term', /\baddict(?:ion|ive|ed)?s?\b/);
  addReason('substance use term', /\bsubstance(?:s)?(?: use)?\b|\bdrug use\b/);
  addReason('sobriety term', /\bsober|sobriety\b/);
  addReason('alcohol/drinking term', /\balcohol(?:ic|ism)?\b|\bdrink(?:ing)?\b|\bdrunk\b/);
  addReason('treatment setting term', /\brehab\b|\bdetox\b/);
  addReason('specific substance term', /\b(?:opioid|cannabis|marijuana|cocaine|meth|stimulant|benzodiazepine)s?\b/);
  addReason('process addiction term', /\b(compulsive|problem) (porn|pornography|gambling|sexual|shopping)\b/);
  addReason('12-step term', /\b12 step\b|\btwelve step\b/);
  addReason('medication dependency term', /\b(?:medication|prescription|drug)s? (?:dependency|dependence)\b|\b(?:dependency|dependence) (?:on|to) (?:medication|prescription|drug)s?\b/);

  if (/\brelapse\b/.test(text) && ADDICTION_CONTEXT_PATTERN.test(text)) {
    reasons.push('relapse with addiction context');
  }

  if (/\brecovery\b/.test(text) && ADDICTION_CONTEXT_PATTERN.test(text)) {
    reasons.push('recovery with addiction context');
  }

  if (/\btreatment\b/.test(text) && ADDICTION_CONTEXT_PATTERN.test(text)) {
    reasons.push('treatment with addiction context');
  }

  return Array.from(new Set(reasons));
}

async function hasReviewedAtColumn(client) {
  const { error } = await client.from('questions_master').select('reviewed_at').limit(1);

  if (!error) return true;
  if (error.code === '42703' || /reviewed_at.*does not exist/i.test(error.message ?? '')) return false;
  throw error;
}

async function fetchAllQuestions(client, { includeReviewedAt }) {
  const pages = [];
  const selectColumns = [
    'id',
    'slug',
    'question',
    'category',
    'raw_category',
    'improved_title',
    'improved_summary',
    'short_answer',
    'primary_theme',
    'related_themes',
    'primary_entities',
    'related_entities',
    'review_status',
    'reviewed_by',
    includeReviewedAt ? 'reviewed_at' : null,
  ]
    .filter(Boolean)
    .join(', ');

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await client
      .from('questions_master')
      .select(selectColumns)
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    pages.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }

  return pages;
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function reportFor({ args, questions, matches, appliedCount, includeReviewedAt }) {
  const slugs = matches.map((match) => match.slug);

  return {
    generated_at: new Date().toISOString(),
    source_table: 'public.questions_master',
    mode: args.apply ? 'apply' : 'dry-run',
    reviewed_by: args.reviewer,
    reviewed_at: args.reviewedAt,
    total_answers_scanned: questions.length,
    addiction_answers_identified: matches.length,
    applied_count: appliedCount,
    schema_notes: includeReviewedAt
      ? []
      : [
          'Column public.questions_master.reviewed_at was not found. Apply the SQL proposal to add it before running --apply.',
          'No production data was mutated by this dry run.',
        ],
    sql_proposal:
      slugs.length > 0
        ? [
            'alter table public.questions_master',
            '  add column if not exists reviewed_at date;',
            '',
            'update public.questions_master',
            'set',
            `  review_status = 'reviewed',`,
            `  reviewed_by = ${sqlString(args.reviewer)},`,
            `  reviewed_at = ${sqlString(args.reviewedAt)}::date`,
            `where slug = any(array[${slugs.map(sqlString).join(', ')}]);`,
          ].join('\n')
        : '',
    matches,
  };
}

async function applyReviewUpdate(client, matches, args) {
  if (!matches.length) return 0;

  const ids = matches.map((match) => match.id);
  const { data, error } = await client
    .from('questions_master')
    .update({
      review_status: 'reviewed',
      reviewed_by: args.reviewer,
      reviewed_at: args.reviewedAt,
    })
    .in('id', ids)
    .select('id');

  if (error) throw error;
  return data?.length ?? 0;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = readEnv();

  if (!env.url || (!env.anonKey && !env.serviceRoleKey)) {
    throw new Error('Missing Supabase credentials. Set SUPABASE_URL plus SUPABASE_ANON_KEY, or use .vercel/.env.production.local.');
  }

  if (args.apply && !env.serviceRoleKey) {
    throw new Error('Applying review updates requires SUPABASE_SERVICE_ROLE_KEY.');
  }

  const client = createClient(env.url, args.apply ? env.serviceRoleKey : env.anonKey || env.serviceRoleKey, {
    auth: { persistSession: false },
  });
  const includeReviewedAt = await hasReviewedAtColumn(client);

  if (args.apply && !includeReviewedAt) {
    throw new Error('Cannot apply: public.questions_master.reviewed_at does not exist. Run the SQL proposal first, then rerun with --apply.');
  }

  const questions = await fetchAllQuestions(client, { includeReviewedAt });
  const matches = questions
    .map((question) => ({ question, reasons: matchAddictionAnswer(question) }))
    .filter((item) => item.reasons.length > 0)
    .map(({ question, reasons }) => ({
      id: question.id,
      slug: question.slug,
      question: question.question,
      category: question.category ?? question.raw_category,
      primary_theme: question.primary_theme,
      previous_review_status: question.review_status,
      previous_reviewed_by: question.reviewed_by,
      previous_reviewed_at: question.reviewed_at,
      match_reasons: reasons,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const appliedCount = args.apply ? await applyReviewUpdate(client, matches, args) : 0;
  const report = reportFor({ args, questions, matches, appliedCount, includeReviewedAt });

  if (args.writeReport || args.apply) {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(`${OUT_DIR}/addiction-review-${args.reviewedAt}.json`, `${JSON.stringify(report, null, 2)}\n`);
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
