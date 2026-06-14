#!/usr/bin/env node
/**
 * Apply data integrity remediations identified by audit-data-integrity.mjs.
 *
 *   npm run content:apply-integrity-fixes              # dry-run (default)
 *   npm run content:apply-integrity-fixes -- --apply   # write to Supabase
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import {
  cleanText,
  isV2Answer,
  relatedQuestionCount,
  resolveSupabaseConfig,
} from './lib/content-enrichment-utils.mjs';

const OUT_DIR = 'reports/data-integrity';
const KENNETH_REPORT = 'reports/reviewer-attribution/kenneth-w-christian-phd.json';
const KENNETH_REVIEWER = 'kenneth-w-christian-phd';
const KENNETH_REVIEWED_AT = '2026-06-13';
const ADDICTION_PROMPT_VERSION = 'deeper-addiction-enrichment-v1';
const PAGE_SIZE = 1000;

/** canonical slug → duplicate slug (redirect source) */
const DUPLICATE_CLUSTERS = [
  {
    canonical: 'why-do-i-feel-empty-even-when-my-life-looks-good-on-paper-t2u3v4',
    duplicate: 'why-do-i-feel-empty-even-when-my-life-looks-177941-018',
  },
  {
    canonical: 'why-do-i-feel-so-lonely-even-when-im-surrounded-by-people',
    duplicate: 'why-do-i-feel-so-lonely-even-when-im-surrounded-by-people-p7q8r9',
  },
  {
    canonical: 'why-do-i-feel-like-im-pretending-to-be-someone-im-not-r8s9t1',
    duplicate: 'why-do-i-feel-like-im-pretending-to-be-s-177940-018',
  },
  {
    canonical: 'how-do-i-stop-overthinking-every-conversation-i-have',
    duplicate: 'how-do-i-stop-overthinking-every-conversation-i-have-e5f6g7',
  },
  {
    canonical: 'why-do-i-feel-like-im-failing-at-everything-b2c3d4',
    duplicate: 'why-do-i-feel-like-im-failing-at-everyth-177940-030',
  },
  {
    canonical: 'why-do-i-feel-guilty-when-im-happy-i8j9k1',
    duplicate: 'why-do-i-feel-guilty-when-im-happy-177941-002',
  },
  {
    canonical: 'how-do-i-stop-feeling-guilty-about-setting-boundaries-q8r9s1',
    duplicate: 'how-do-i-stop-feeling-guilty-about-setti-177940-013',
  },
  {
    canonical: 'how-do-i-find-motivation-when-im-depressed-z8a9b1',
    duplicate: 'how-do-i-find-motivation-when-im-depress-190648-011',
  },
];

const ADDICTION_PROMPT_FIX_SLUGS = [
  'can-using-ai-for-emotional-support-become-addictive',
  'is-it-normal-to-feel-bored-or-empty-after-getting-sober',
  'what-should-i-do-after-a-relapse-in-recovery',
  'support-someone-with-addiction-without-enabling',
  'when-to-seek-professional-help-for-substance-use',
];

const SELECT_FIELDS =
  'id,slug,question,category,raw_category,primary_theme,related_questions,review_status,reviewed_by,reviewed_at,content_prompt_version,content_enriched_at,answer_sections,citation_notes';

function parseArgs(argv) {
  const apply = argv.includes('--apply');
  const dryRun = argv.includes('--dry-run') || !apply;
  return { apply, dryRun };
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

async function fetchAllQuestions(client) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await client
      .from('questions_master')
      .select(SELECT_FIELDS)
      .order('slug')
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

function loadKennethPreserveDraftSlugs() {
  if (!existsSync(KENNETH_REPORT)) return [];
  const report = JSON.parse(readFileSync(KENNETH_REPORT, 'utf8'));
  return (report.assigned ?? [])
    .filter((item) => item.preserve_draft_status)
    .map((item) => item.slug)
    .filter(Boolean);
}

function normalizeRelatedList(related) {
  if (!Array.isArray(related)) return [];
  return related.map((item) => cleanText(typeof item === 'string' ? item : item?.question ?? item?.text ?? '')).filter(Boolean);
}

function sameThemeOrCategory(a, b) {
  const themeA = cleanText(a.primary_theme).toLowerCase();
  const themeB = cleanText(b.primary_theme).toLowerCase();
  if (themeA && themeB && themeA === themeB) return true;

  const catA = cleanText(a.category || a.raw_category).toLowerCase();
  const catB = cleanText(b.category || b.raw_category).toLowerCase();
  return Boolean(catA && catB && catA === catB);
}

function pickFifthRelatedQuestion(target, pool, bySlug) {
  const existing = new Set(normalizeRelatedList(target.related_questions).map((item) => item.toLowerCase()));
  const existingSlugs = new Set(
    normalizeRelatedList(target.related_questions)
      .map((text) => {
        for (const row of pool) {
          if (cleanText(row.question).toLowerCase() === text.toLowerCase()) return row.slug;
        }
        return null;
      })
      .filter(Boolean)
  );

  const candidates = pool
    .filter((row) => row.slug !== target.slug)
    .filter((row) => sameThemeOrCategory(target, row))
    .filter((row) => !existingSlugs.has(row.slug))
    .filter((row) => !existing.has(cleanText(row.question).toLowerCase()))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return candidates[0] ?? null;
}

function buildDuplicateNote(canonicalSlug, existingNotes) {
  const note = `Duplicate of canonical slug ${canonicalSlug}; demoted to draft for redirect consolidation.`;
  const prior = cleanText(existingNotes);
  if (!prior) return note;
  if (prior.includes(canonicalSlug)) return prior;
  return `${prior}\n\n${note}`;
}

function planKennethPromotions(rows, expectedSlugs) {
  const patches = [];
  const expected = new Set(expectedSlugs);

  for (const row of rows) {
    const reviewedBy = cleanText(row.reviewed_by);
    const status = cleanText(row.review_status).toLowerCase();
    if (reviewedBy !== KENNETH_REVIEWER || status !== 'draft') continue;

    const update = {
      id: row.id,
      slug: row.slug,
      review_status: 'reviewed',
      reviewed_by: KENNETH_REVIEWER,
      reviewed_at: cleanText(row.reviewed_at) || KENNETH_REVIEWED_AT,
    };
    patches.push({
      ...update,
      expected_from_report: expected.has(row.slug),
      previous: {
        review_status: row.review_status,
        reviewed_by: row.reviewed_by,
        reviewed_at: row.reviewed_at,
      },
    });
  }

  return patches;
}

function planDuplicateDemotions(rows) {
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const patches = [];

  for (const { canonical, duplicate } of DUPLICATE_CLUSTERS) {
    const row = bySlug.get(duplicate);
    if (!row) {
      patches.push({ slug: duplicate, canonical, skipped: true, reason: 'duplicate slug not found' });
      continue;
    }
    if (!bySlug.has(canonical)) {
      patches.push({ slug: duplicate, canonical, skipped: true, reason: 'canonical slug not found' });
      continue;
    }

    const nextNotes = buildDuplicateNote(canonical, row.citation_notes);
    const alreadyDemoted =
      cleanText(row.review_status).toLowerCase() === 'draft' &&
      !cleanText(row.reviewed_by) &&
      !cleanText(row.reviewed_at) &&
      nextNotes === (row.citation_notes ?? '');

    if (alreadyDemoted) {
      patches.push({ slug: duplicate, canonical, skipped: true, reason: 'already demoted' });
      continue;
    }

    patches.push({
      id: row.id,
      slug: duplicate,
      canonical,
      review_status: 'draft',
      reviewed_by: null,
      reviewed_at: null,
      citation_notes: buildDuplicateNote(canonical, row.citation_notes),
      previous: {
        review_status: row.review_status,
        reviewed_by: row.reviewed_by,
        reviewed_at: row.reviewed_at,
        citation_notes: row.citation_notes,
      },
    });
  }

  return patches;
}

function planRelatedQuestionBackfill(rows) {
  const patches = [];
  const enriched = rows.filter((row) => isV2Answer(row) && relatedQuestionCount(row) === 4);

  for (const row of enriched) {
    const candidate = pickFifthRelatedQuestion(row, rows, null);
    if (!candidate) {
      patches.push({ slug: row.slug, skipped: true, reason: 'no pool candidate found' });
      continue;
    }

    const related_questions = [...(row.related_questions ?? []), cleanText(candidate.question)];
    patches.push({
      id: row.id,
      slug: row.slug,
      related_questions,
      added_from_slug: candidate.slug,
      added_question: candidate.question,
      primary_theme: row.primary_theme,
      category: row.category || row.raw_category,
      previous_count: relatedQuestionCount(row),
    });
  }

  return patches;
}

function planAddictionPromptFixes(rows) {
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const patches = [];

  for (const slug of ADDICTION_PROMPT_FIX_SLUGS) {
    const row = bySlug.get(slug);
    if (!row) {
      patches.push({ slug, skipped: true, reason: 'slug not found' });
      continue;
    }
    const current = cleanText(row.content_prompt_version);
    if (current === ADDICTION_PROMPT_VERSION) {
      patches.push({ slug, skipped: true, reason: 'already correct' });
      continue;
    }
    patches.push({
      id: row.id,
      slug,
      content_prompt_version: ADDICTION_PROMPT_VERSION,
      previous: row.content_prompt_version,
    });
  }

  return patches;
}

async function applyPatch(client, table, patch) {
  const {
    id,
    slug,
    skipped,
    previous,
    expected_from_report,
    added_from_slug,
    added_question,
    canonical,
    previous_count,
    primary_theme,
    category,
    reason,
    ...update
  } = patch;
  if (skipped) return { slug, applied: false, skipped: true, reason: patch.reason };

  const { data, error } = await client.from(table).update(update).eq('id', id).select('id,slug');
  if (error) throw error;
  return { slug, applied: Boolean(data?.length), skipped: false };
}

async function main() {
  const { apply, dryRun } = parseArgs(process.argv.slice(2));
  const { url, key, serviceRoleKey } = resolveSupabaseConfig({ requireWrite: apply });
  const client = createClient(url, apply ? serviceRoleKey : key, { auth: { persistSession: false } });

  const rows = await fetchAllQuestions(client);
  const kennethExpected = loadKennethPreserveDraftSlugs();

  const kennethPatches = planKennethPromotions(rows, kennethExpected);
  const duplicatePatches = planDuplicateDemotions(rows);
  const relatedPatches = planRelatedQuestionBackfill(rows);
  const addictionPatches = planAddictionPromptFixes(rows);

  const results = {
    kenneth_promotions: [],
    duplicate_demotions: [],
    related_question_backfill: [],
    addiction_prompt_fixes: [],
  };

  if (apply) {
    for (const patch of kennethPatches) {
      results.kenneth_promotions.push(await applyPatch(client, 'questions_master', patch));
    }
    for (const patch of duplicatePatches) {
      results.duplicate_demotions.push(await applyPatch(client, 'questions_master', patch));
    }
    for (const patch of relatedPatches) {
      results.related_question_backfill.push(await applyPatch(client, 'questions_master', patch));
    }
    for (const patch of addictionPatches) {
      results.addiction_prompt_fixes.push(await applyPatch(client, 'questions_master', patch));
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    mode: apply ? 'apply' : 'dry-run',
    summary: {
      kenneth_promotions: {
        planned: kennethPatches.filter((item) => !item.skipped).length,
        expected_from_kenneth_report: kennethExpected.length,
        applied: results.kenneth_promotions.filter((item) => item.applied).length,
      },
      duplicate_demotions: {
        planned: duplicatePatches.filter((item) => !item.skipped).length,
        applied: results.duplicate_demotions.filter((item) => item.applied).length,
      },
      related_question_backfill: {
        planned: relatedPatches.filter((item) => !item.skipped).length,
        applied: results.related_question_backfill.filter((item) => item.applied).length,
      },
      addiction_prompt_fixes: {
        planned: addictionPatches.filter((item) => !item.skipped).length,
        applied: results.addiction_prompt_fixes.filter((item) => item.applied).length,
      },
    },
    kenneth_promotions: kennethPatches,
    duplicate_demotions: duplicatePatches,
    related_question_backfill: relatedPatches,
    addiction_prompt_fixes: addictionPatches,
    apply_results: apply ? results : null,
    vercel_redirects: DUPLICATE_CLUSTERS.map(({ canonical, duplicate }) => ({
      source: `/answers/${duplicate}`,
      destination: `/answers/${canonical}/`,
      permanent: true,
    })),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/fixes-applied-${todayStamp()}.json`;
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Mode: ${report.mode}`);
  console.log(`Kenneth promotions: ${report.summary.kenneth_promotions.planned} planned`);
  console.log(`Duplicate demotions: ${report.summary.duplicate_demotions.planned} planned`);
  console.log(`Related question backfill: ${report.summary.related_question_backfill.planned} planned`);
  console.log(`Addiction prompt fixes: ${report.summary.addiction_prompt_fixes.planned} planned`);
  console.log(`Wrote ${reportPath}`);

  if (apply) {
    console.log(`Applied kenneth: ${report.summary.kenneth_promotions.applied}`);
    console.log(`Applied duplicates: ${report.summary.duplicate_demotions.applied}`);
    console.log(`Applied related: ${report.summary.related_question_backfill.applied}`);
    console.log(`Applied addiction: ${report.summary.addiction_prompt_fixes.applied}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
