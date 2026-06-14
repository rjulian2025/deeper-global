#!/usr/bin/env node
/**
 * Identify performance-psychology answers for Kenneth W. Christian, PhD attribution.
 *
 * Dry run with report:
 *   npm run content:review-performance -- --write-report
 *
 * Apply with service role credentials:
 *   SUPABASE_SERVICE_ROLE_KEY=... npm run content:review-performance -- --apply
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/reviewer-attribution';
const DEFAULT_REVIEWER = 'kenneth-w-christian-phd';
const DEFAULT_REVIEWED_AT = '2026-06-13';
const PAGE_SIZE = 1000;

const MANUAL_EXCLUDE_SLUGS = new Set([
  'how-do-i-support-a-friend-with-depression-without-burning-out',
  'how-can-i-learn-to-love-myself',
]);

const EXCLUDED_REVIEWERS = new Set(['david-k-gore-phd']);

const EXCLUSION_PATTERNS = [
  { label: 'suicide/self-harm crisis', pattern: /\b(suicid(?:e|al)|self[-\s]?harm|kill myself|want to die|end my life)\b/ },
  { label: 'psychiatric medication', pattern: /\b(psychiatric medication|antidepressant|ssri|snri|mood stabilizer|prescription for (?:depression|anxiety|bipolar|adhd))\b/ },
  { label: 'psychosis/mania', pattern: /\b(psychosis|psychotic|schizophren|mania|manic|delusion|hallucinat)\b/ },
  { label: 'eating disorder', pattern: /\b(eating disorder|anorexia|bulimia|binge[-\s]?eat|purging)\b/ },
  { label: 'substance treatment protocol', pattern: /\b(detox|withdrawal|rehab|12 step|twelve step|medication assisted treatment|mat program)\b/ },
  { label: 'teen crisis', pattern: /\b(teen(?:ager)?(?:s)? (?:crisis|suicid|self[-\s]?harm)|my teenager (?:is|has) (?:suicid|cutting|self[-\s]?harm))\b/ },
  { label: 'trauma treatment', pattern: /\b(ptsd treatment|trauma therapy|emdr|exposure therapy for trauma|childhood abuse therapy)\b/ },
  { label: 'sexuality/gender identity', pattern: /\b(gender identity|sexual orientation|coming out|transgender|nonbinary|lgbtq)\b/ },
  { label: 'psychiatric diagnosis explainer', pattern: /\b(what is (?:bipolar|schizophrenia|borderline|ocd|adhd|autism|ptsd)|signs of (?:bipolar|schizophrenia|psychosis|mania))\b/ },
  { label: 'abuse/DV crisis', pattern: /\b(domestic violence|intimate partner violence|abusive (?:partner|relationship|spouse)|escape abuse|safety plan (?:for|from) abuse)\b/ },
];

const ADDICTION_CONTEXT_PATTERN =
  /\baddict(?:ion|ive|ed)?s?\b|\bsubstance(?:s)?(?: use)?\b|\bdrug use\b|\balcohol(?:ic|ism)?\b|\bsober|sobriety\b|\brelapse\b|\brecovery from (?:drugs|alcohol|substances)\b/;

const MATCH_RULES = [
  { label: 'underachievement / potential', pattern: /\b(not living up to (?:my )?potential|underachiev|capable but not|wasting my potential)\b/ },
  { label: 'self-sabotage', pattern: /\b(self[-\s]?sabotag|hold myself back|get in my own way|self[-\s]?defeat)\b/ },
  { label: 'procrastination', pattern: /\b(procrastinat|put(?:ting)? things off|delay(?:ing)? important|avoid things i need to do|stop procrastinating)\b/ },
  { label: 'avoidance', pattern: /\b(avoid(?:ance|ing)? (?:tasks|work|responsibilities|things i need)|keep avoiding)\b/ },
  { label: 'perfectionism', pattern: /\b(perfectionis|everything has to be perfect|perfect all the time|all or nothing|fear of making mistakes)\b/ },
  { label: 'imposter syndrome', pattern: /\b(imposter|impostor|feel like a fraud|don(?:'|’)t belong here|not qualified enough)\b/ },
  { label: 'motivation / purpose', pattern: /\b(find (?:my )?purpose|lack of motivation|lost motivation|giving up on (?:my )?dreams|what am i doing with my life)\b/ },
  { label: 'career stuckness', pattern: /\b(stuck in (?:my )?job|career stuck|feel stuck at work|hate my job but afraid|career change anxiety)\b/ },
  { label: 'achievement anxiety', pattern: /\b(achievement anxiety|anxious about good things|waiting for the other shoe|success makes me anxious|fear of success)\b/ },
  { label: 'comparison', pattern: /\b(everyone else has it figured out|compare myself to|behind in life|behind financially|feel behind (?:my )?peers|career figured out)\b/ },
  { label: 'self-criticism', pattern: /\b(critical of myself|self[-\s]?critic|harsh on myself|never good enough|inner critic)\b/ },
  { label: 'self-worth / deserving', pattern: /\b(separate my self[-\s]?worth|self[-\s]?worth from|don(?:'|')t deserve success|not deserving|earn love|earn affection|worth tied to success|only valued for achievement)\b/ },
  { label: 'success guilt / spending', pattern: /\b(guilty spending (?:money )?on myself|success guilt|feel guilty when things go well)\b/ },
  { label: 'needing to be the best', pattern: /\b(need to be the best|have to be perfect|always have to win|fear of being average)\b/ },
  {
    label: 'burnout with identity/purpose',
    pattern: /\b(burned out|burnout)\b.{0,50}\b(purpose|identity|meaning|potential|living up to)\b|\b(purpose|identity|meaning|potential|living up to)\b.{0,50}\b(burned out|burnout)\b/,
  },
];

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
    .replace(/['']/g, '')
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
      question.improved_summary,
      question.short_answer,
      question.category,
      question.raw_category,
      question.primary_theme,
      ...valuesFromJson(question.related_themes),
      ...valuesFromJson(question.primary_entities),
      ...valuesFromJson(question.related_entities),
    ].join(' ')
  );
}

function matchExclusions(text) {
  return EXCLUSION_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
}

function titleText(question) {
  return normalize([question.slug, question.question, question.improved_title].join(' '));
}

function matchPerformanceAnswer(question) {
  const text = searchableText(question);
  const title = titleText(question);
  const exclusions = matchExclusions(text);
  if (exclusions.length > 0) return { reasons: [], exclusions };

  if (MANUAL_EXCLUDE_SLUGS.has(question.slug)) {
    return { reasons: [], exclusions: ['manual weak-fit exclusion'] };
  }

  if (ADDICTION_CONTEXT_PATTERN.test(text)) {
    return { reasons: [], exclusions: ['addiction/recovery primary topic'] };
  }

  const reasons = MATCH_RULES.filter(({ label, pattern }) => {
    if (label === 'burnout with identity/purpose') {
      return pattern.test(title);
    }
    return pattern.test(text);
  }).map(({ label }) => label);
  return { reasons: Array.from(new Set(reasons)), exclusions: [] };
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

function shouldPreserveDraftStatus(reviewStatus) {
  const status = String(reviewStatus ?? '')
    .toLowerCase()
    .trim();
  return status === 'draft';
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function reportFor({ args, questions, matches, skipped, appliedCount, includeReviewedAt }) {
  const slugs = matches.map((match) => match.slug);

  return {
    generated_at: new Date().toISOString(),
    source_table: 'public.questions_master',
    mode: args.apply ? 'apply' : 'dry-run',
    reviewer: args.reviewer,
    reviewed_at: args.reviewedAt,
    total_answers_scanned: questions.length,
    performance_answers_identified: matches.length,
    skipped_candidates: skipped.length,
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
            'update public.questions_master',
            'set',
            `  reviewed_by = ${sqlString(args.reviewer)},`,
            `  reviewed_at = ${sqlString(args.reviewedAt)}::date,`,
            "  review_status = case when lower(coalesce(review_status, '')) = 'draft' then review_status else 'reviewed' end",
            `where slug = any(array[${slugs.map(sqlString).join(', ')}]);`,
          ].join('\n')
        : '',
    assigned: matches,
    skipped,
  };
}

async function applyReviewUpdate(client, matches, args) {
  if (!matches.length) return 0;

  let applied = 0;

  for (const match of matches) {
    const payload = {
      reviewed_by: args.reviewer,
      reviewed_at: args.reviewedAt,
    };

    if (!shouldPreserveDraftStatus(match.previous_review_status)) {
      payload.review_status = 'reviewed';
    }

    const { data, error } = await client.from('questions_master').update(payload).eq('id', match.id).select('id');
    if (error) throw error;
    if (data?.length) applied += 1;
  }

  return applied;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { url, key, anonKey, serviceRoleKey } = resolveSupabaseConfig({ requireWrite: args.apply });

  const client = createClient(url, args.apply ? serviceRoleKey : anonKey || key, {
    auth: { persistSession: false },
  });
  const includeReviewedAt = await hasReviewedAtColumn(client);

  if (args.apply && !includeReviewedAt) {
    throw new Error('Cannot apply: public.questions_master.reviewed_at does not exist. Run the SQL proposal first, then rerun with --apply.');
  }

  const questions = await fetchAllQuestions(client, { includeReviewedAt });
  const matches = [];
  const skipped = [];

  for (const question of questions) {
    const { reasons, exclusions } = matchPerformanceAnswer(question);
    const reviewedBy = String(question.reviewed_by ?? '')
      .toLowerCase()
      .trim();

    if (reasons.length === 0) {
      if (exclusions.length > 0) {
        const wouldMatchWithoutExclusion = MATCH_RULES.some(({ pattern }) => pattern.test(searchableText(question)));
        if (wouldMatchWithoutExclusion || exclusions.some((item) => item !== 'addiction/recovery primary topic')) {
          skipped.push({
            id: question.id,
            slug: question.slug,
            question: question.question,
            category: question.category ?? question.raw_category,
            skip_reasons: exclusions,
            partial_match_reasons: MATCH_RULES.filter(({ pattern }) => pattern.test(searchableText(question))).map(({ label }) => label),
          });
        }
      }
      continue;
    }

    if (reviewedBy && EXCLUDED_REVIEWERS.has(reviewedBy)) {
      skipped.push({
        id: question.id,
        slug: question.slug,
        question: question.question,
        category: question.category ?? question.raw_category,
        skip_reasons: [`already reviewed by ${reviewedBy}`],
        match_reasons: reasons,
      });
      continue;
    }

    if (reviewedBy && reviewedBy !== args.reviewer && reviewedBy !== 'codex-seo-review') {
      skipped.push({
        id: question.id,
        slug: question.slug,
        question: question.question,
        category: question.category ?? question.raw_category,
        skip_reasons: [`already reviewed by ${reviewedBy}`],
        match_reasons: reasons,
      });
      continue;
    }

    matches.push({
      id: question.id,
      slug: question.slug,
      question: question.question,
      category: question.category ?? question.raw_category,
      primary_theme: question.primary_theme,
      previous_review_status: question.review_status,
      previous_reviewed_by: question.reviewed_by,
      previous_reviewed_at: question.reviewed_at,
      match_reasons: reasons,
      preserve_draft_status: shouldPreserveDraftStatus(question.review_status),
    });
  }

  matches.sort((a, b) => a.slug.localeCompare(b.slug));
  skipped.sort((a, b) => a.slug.localeCompare(b.slug));

  const appliedCount = args.apply ? await applyReviewUpdate(client, matches, args) : 0;
  const report = reportFor({ args, questions, matches, skipped, appliedCount, includeReviewedAt });

  if (args.writeReport || args.apply) {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(`${OUT_DIR}/${args.reviewer}.json`, `${JSON.stringify(report, null, 2)}\n`);
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
