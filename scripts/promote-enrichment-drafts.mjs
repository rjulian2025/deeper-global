#!/usr/bin/env node
/**
 * Promote approved enrichment drafts onto existing questions_master rows.
 *
 * Dry run:
 *   npm run content:promote-enrichment -- reports/enrichment-addiction/draft-answers/batch-01-drafts.json
 *
 * Apply:
 *   SUPABASE_SERVICE_ROLE_KEY=... npm run content:promote-enrichment -- --apply reports/enrichment-addiction/draft-answers/batch-01-drafts.json
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { cleanText, resolveSupabaseConfig, rowFromEnrichmentDraft } from './lib/content-enrichment-utils.mjs';

const OUT_DIR = 'reports/enrichment-addiction/promote-updates';
const CAMPAIGNS = {
  'addiction-enrichment': {
    promptVersion: 'deeper-addiction-enrichment-v1',
    citationNote: 'Addiction legacy enrichment promotion.',
  },
  enrichment: {
    promptVersion: 'deeper-answer-enrichment-v1',
    citationNote: 'Legacy answer enrichment promotion.',
  },
};

function parseArgs(argv) {
  let campaign = 'addiction-enrichment';
  let apply = false;
  let preserveReview = true;
  const paths = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--apply') {
      apply = true;
      continue;
    }

    if (arg === '--overwrite-review') {
      preserveReview = false;
      continue;
    }

    if (arg === '--campaign') {
      campaign = argv[index + 1] ?? '';
      index += 1;
      continue;
    }

    if (arg.startsWith('--campaign=')) {
      campaign = arg.slice('--campaign='.length);
      continue;
    }

    paths.push(arg);
  }

  const campaignConfig = CAMPAIGNS[campaign];
  if (!campaignConfig) {
    throw new Error(`Unknown campaign "${campaign}". Use one of: ${Object.keys(CAMPAIGNS).join(', ')}`);
  }

  return { apply, campaign, campaignConfig, preserveReview, paths };
}

function loadDrafts(paths) {
  const drafts = paths.flatMap((path) => {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    if (!Array.isArray(parsed)) {
      throw new Error(`${path} must contain a JSON array.`);
    }
    return parsed.map((draft) => ({ ...draft, __source_path: path }));
  });

  const duplicateSlugs = drafts
    .map((draft) => cleanText(draft.slug))
    .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);

  if (duplicateSlugs.length) {
    throw new Error(`Duplicate input slugs: ${Array.from(new Set(duplicateSlugs)).join(', ')}`);
  }

  return drafts;
}

function mergeReviewFields(updateRow, existingRow, preserveReview) {
  if (!preserveReview) {
    updateRow.review_status = 'reviewed';
    return updateRow;
  }

  if (cleanText(existingRow.reviewed_by)) {
    updateRow.reviewed_by = existingRow.reviewed_by;
  }
  if (cleanText(existingRow.reviewed_at)) {
    updateRow.reviewed_at = existingRow.reviewed_at;
  }
  if (cleanText(existingRow.review_status)) {
    updateRow.review_status = existingRow.review_status;
  }

  return updateRow;
}

async function main() {
  const { apply, campaign, campaignConfig, preserveReview, paths } = parseArgs(process.argv.slice(2));

  if (!paths.length) {
    throw new Error('Pass one or more draft JSON files.');
  }

  const drafts = loadDrafts(paths);
  const updateRows = drafts.map((draft) =>
    rowFromEnrichmentDraft(draft, {
      promptVersion: campaignConfig.promptVersion,
      citationNote: campaignConfig.citationNote,
    })
  );
  const slugs = updateRows.map((row) => row.slug);

  const { url, key } = resolveSupabaseConfig({ requireWrite: apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data: existingRows, error: existingError } = await supabase
    .from('questions_master')
    .select('id, slug, review_status, reviewed_by, reviewed_at, content_enriched_at')
    .in('slug', slugs);

  if (existingError) throw existingError;

  const existingBySlug = new Map((existingRows ?? []).map((row) => [row.slug, row]));
  const missingSlugs = slugs.filter((slug) => !existingBySlug.has(slug));
  if (missingSlugs.length) {
    throw new Error(`Refusing to promote: slug(s) not found in questions_master: ${missingSlugs.join(', ')}`);
  }

  const mergedRows = updateRows.map((row) => mergeReviewFields({ ...row }, existingBySlug.get(row.slug), preserveReview));

  const report = {
    generated_at: new Date().toISOString(),
    mode: apply ? 'apply' : 'dry-run',
    campaign,
    preserve_review: preserveReview,
    draft_count: mergedRows.length,
    slugs,
    updates: mergedRows.map((row) => ({
      slug: row.slug,
      review_status: row.review_status ?? null,
      reviewed_by: row.reviewed_by ?? null,
      reviewed_at: row.reviewed_at ?? null,
      content_enriched_at: row.content_enriched_at,
      section_count: Array.isArray(row.answer_sections) ? row.answer_sections.length : 0,
      takeaway_count: Array.isArray(row.key_takeaways) ? row.key_takeaways.length : 0,
      source_ref_count: Array.isArray(row.source_refs) ? row.source_refs.length : 0,
    })),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/${campaign}-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  if (!apply) {
    console.log(
      JSON.stringify(
        {
          ...report,
          report_path: reportPath,
          note: 'Dry run only. Re-run with --apply and SUPABASE_SERVICE_ROLE_KEY to update existing rows.',
        },
        null,
        2
      )
    );
    return;
  }

  let appliedCount = 0;
  for (const row of mergedRows) {
    const { slug, ...payload } = row;
    const { data, error } = await supabase.from('questions_master').update(payload).eq('slug', slug).select('slug');

    if (error) throw error;
    if (!data?.length) {
      throw new Error(`Update affected zero rows for slug ${slug}.`);
    }
    appliedCount += 1;
  }

  console.log(
    JSON.stringify(
      {
        mode: 'applied',
        campaign,
        applied_count: appliedCount,
        preserve_review: preserveReview,
        report_path: reportPath,
        slugs,
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
