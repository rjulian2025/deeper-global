import { readFileSync } from 'node:fs';
import { cleanText, rowFromEnrichmentDraft } from './content-enrichment-utils.mjs';

export const ENRICHMENT_CAMPAIGNS = {
  'addiction-enrichment': {
    promptVersion: 'deeper-addiction-enrichment-v1',
    citationNote: 'Addiction legacy enrichment promotion.',
  },
  enrichment: {
    promptVersion: 'deeper-answer-enrichment-v1',
    citationNote: 'Legacy answer enrichment promotion.',
  },
};

export function loadDraftsFromPaths(paths) {
  const drafts = paths.flatMap((path) => {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    if (!Array.isArray(parsed)) {
      throw new Error(`${path} must contain a JSON array.`);
    }
    return parsed;
  });

  const duplicateSlugs = drafts
    .map((draft) => cleanText(draft.slug))
    .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);

  if (duplicateSlugs.length) {
    throw new Error(`Duplicate input slugs: ${Array.from(new Set(duplicateSlugs)).join(', ')}`);
  }

  return drafts;
}

export function mergeReviewFields(updateRow, existingRow, preserveReview) {
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

export function buildPromotionPlan(drafts, { campaign = 'addiction-enrichment', preserveReview = true } = {}) {
  const campaignConfig = ENRICHMENT_CAMPAIGNS[campaign];
  if (!campaignConfig) {
    throw new Error(`Unknown campaign "${campaign}". Use one of: ${Object.keys(ENRICHMENT_CAMPAIGNS).join(', ')}`);
  }

  const updateRows = drafts.map((draft) =>
    rowFromEnrichmentDraft(draft, {
      promptVersion: campaignConfig.promptVersion,
      citationNote: campaignConfig.citationNote,
    })
  );

  return {
    campaign,
    campaignConfig,
    preserveReview,
    updateRows,
    slugs: updateRows.map((row) => row.slug),
  };
}

export async function fetchExistingRows(supabase, slugs) {
  const { data: existingRows, error } = await supabase
    .from('questions_master')
    .select('id, slug, review_status, reviewed_by, reviewed_at, content_enriched_at')
    .in('slug', slugs);

  if (error) throw error;

  const existingBySlug = new Map((existingRows ?? []).map((row) => [row.slug, row]));
  const missingSlugs = slugs.filter((slug) => !existingBySlug.has(slug));
  if (missingSlugs.length) {
    throw new Error(`Refusing to promote: slug(s) not found in questions_master: ${missingSlugs.join(', ')}`);
  }

  return existingBySlug;
}

export async function applyPromotionUpdates(supabase, updateRows, existingBySlug, preserveReview) {
  const mergedRows = updateRows.map((row) => mergeReviewFields({ ...row }, existingBySlug.get(row.slug), preserveReview));

  for (const row of mergedRows) {
    const { slug, ...payload } = row;
    const { data, error } = await supabase.from('questions_master').update(payload).eq('slug', slug).select('slug');
    if (error) throw error;
    if (!data?.length) {
      throw new Error(`Update affected zero rows for slug ${slug}.`);
    }
  }

  return mergedRows;
}

export function promotionReport({ mode, campaign, preserveReview, mergedRows }) {
  return {
    generated_at: new Date().toISOString(),
    mode,
    campaign,
    preserve_review: preserveReview,
    draft_count: mergedRows.length,
    slugs: mergedRows.map((row) => row.slug),
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
}
