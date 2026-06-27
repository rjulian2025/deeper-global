import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';

export const PHASE_1B_CAMPAIGNS = {
  'phase-1b': {
    promptVersion: 'deeper-phase-1b-new-question-v1',
    citationNote: 'Phase 1B new-question batch promotion.',
    reviewStatus: 'reviewed',
    reviewedBy: 'codex-seo-review',
  },
  'visit-priority': {
    promptVersion: 'deeper-visit-priority-v1',
    citationNote: 'Visit-priority batch from map_signals demand and GSC momentum.',
    reviewStatus: 'draft',
    reviewedBy: null,
  },
  'ai-sprint': {
    promptVersion: 'deeper-ai-concerns-sprint-v1',
    citationNote: 'AI mental health concerns sprint promotion.',
    reviewStatus: 'reviewed',
    reviewedBy: 'codex-seo-review',
  },
  'adhd-hub': {
    promptVersion: 'deeper-adhd-hub-v1',
    citationNote: 'ADHD authority hub seed batch promotion.',
    reviewStatus: 'reviewed',
    reviewedBy: 'codex-seo-review',
  },
  'imago-hub': {
    promptVersion: 'deeper-imago-hub-v1',
    citationNote: 'Imago Relationship Therapy hub seed batch promotion.',
    reviewStatus: 'reviewed',
    reviewedBy: 'codex-seo-review',
  },
  'spirituality-meaning': {
    promptVersion: 'deeper-spirituality-meaning-v1',
    citationNote: 'Spirituality & Meaning hub Part C batch (15 high-confidence candidates).',
    reviewStatus: 'draft',
    reviewedBy: null,
  },
};

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizeSafetyFlags(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanText(item)).filter(Boolean);
}

function requireArray(value, label, draft) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${draft.slug}: missing required array ${label}.`);
  }
  return value;
}

export function answerTextFromSections(sections) {
  return sections
    .map((section) => {
      const heading = cleanText(section.heading);
      const body = cleanText(section.body);
      return heading ? `## ${heading}\n\n${body}` : body;
    })
    .filter(Boolean)
    .join('\n\n');
}

function wordCount(value) {
  return cleanText(value).split(/\s+/).filter(Boolean).length;
}

function sourceRefsForInsert(value, draft) {
  const sourceRefs = requireArray(value, 'source_refs', draft)
    .map((source) => ({
      title: cleanText(source?.title),
      url: cleanText(source?.url),
      publisher: cleanText(source?.publisher),
      note: cleanText(source?.note),
    }))
    .filter((source) => source.title || source.url);

  if (!sourceRefs.length) {
    throw new Error(`${draft.slug}: at least one source reference with title or URL is required.`);
  }

  return sourceRefs;
}

function entitiesFromDraft(draft) {
  const names = [draft.primary_theme, draft.category, ...(Array.isArray(draft.related_themes) ? draft.related_themes : [])]
    .map((name) => cleanText(name))
    .filter(Boolean);

  return Array.from(new Set(names)).map((name) => ({ name, type: 'Topic' }));
}

function citationNotesFromDraft(draft, campaignConfig) {
  const notes = [
    campaignConfig.citationNote,
    cleanText(draft.draft_notes) && `Draft notes: ${cleanText(draft.draft_notes)}`,
    normalizeSafetyFlags(draft.safety_flags).length && `Safety flags: ${normalizeSafetyFlags(draft.safety_flags).join(', ')}`,
    Array.isArray(draft.citation_gaps) && draft.citation_gaps.length && `Citation follow-ups: ${draft.citation_gaps.map((gap) => cleanText(gap)).filter(Boolean).join(' ')}`,
  ].filter(Boolean);

  return notes.join('\n');
}

export function rowFromDraft(draft, campaignConfig) {
  const question = cleanText(draft.question);
  const slug = cleanText(draft.slug);
  const category = cleanText(draft.category);
  const sections = requireArray(draft.answer_sections, 'answer_sections', draft);
  const answer = answerTextFromSections(sections);

  if (!question) throw new Error(`${slug || 'unknown draft'}: question is required.`);
  if (!slug) throw new Error(`${question}: slug is required.`);
  if (!category) throw new Error(`${slug}: category is required.`);
  if (!answer) throw new Error(`${slug}: answer text is required.`);

  const reviewStatus = campaignConfig.reviewStatus ?? 'reviewed';
  const reviewedBy = campaignConfig.reviewedBy ?? null;

  return {
    id: randomUUID(),
    question,
    answer,
    word_count: wordCount(answer),
    short_answer: cleanText(draft.improved_summary || draft.suggested_schema_answer),
    raw_category: category,
    category,
    slug,
    published: true,
    improved_title: cleanText(draft.improved_title),
    improved_meta_description: cleanText(draft.improved_meta_description),
    improved_summary: cleanText(draft.improved_summary),
    answer_sections: sections,
    key_takeaways: requireArray(draft.key_takeaways, 'key_takeaways', draft),
    care_note: cleanText(draft.care_note),
    related_questions: Array.isArray(draft.related_questions) ? draft.related_questions : [],
    suggested_schema_question: cleanText(draft.suggested_schema_question || draft.suggested_schema_faq || question),
    suggested_schema_answer: cleanText(draft.suggested_schema_answer || draft.improved_summary),
    primary_theme: cleanText(draft.primary_theme || category),
    related_themes: Array.isArray(draft.related_themes) ? draft.related_themes : [],
    citation_notes: citationNotesFromDraft(draft, campaignConfig),
    content_prompt_version: campaignConfig.promptVersion,
    content_enriched_at: new Date().toISOString(),
    review_status: reviewStatus,
    reviewed_by: reviewedBy,
    source_refs: sourceRefsForInsert(draft.source_refs, draft),
    primary_entities: entitiesFromDraft(draft).slice(0, 3),
    related_entities: entitiesFromDraft(draft),
  };
}

export function loadDraftsFromPaths(paths) {
  return paths.flatMap((path) => {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    if (!Array.isArray(parsed)) {
      throw new Error(`${path} must contain a JSON array.`);
    }
    return parsed;
  });
}

export function resolveCampaignConfig(campaign) {
  const campaignConfig = PHASE_1B_CAMPAIGNS[campaign];
  if (!campaignConfig) {
    throw new Error(`Unknown campaign "${campaign}". Use one of: ${Object.keys(PHASE_1B_CAMPAIGNS).join(', ')}`);
  }
  return campaignConfig;
}

export async function publishPhase1bDrafts({
  supabase,
  drafts,
  campaign = 'phase-1b',
  apply = false,
  skipExisting = true,
}) {
  const campaignConfig = resolveCampaignConfig(campaign);
  const rows = drafts.map((draft) => rowFromDraft(draft, campaignConfig));
  const duplicateInputSlugs = rows
    .map((row) => row.slug)
    .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);

  if (duplicateInputSlugs.length) {
    throw new Error(`Duplicate input slugs: ${Array.from(new Set(duplicateInputSlugs)).join(', ')}`);
  }

  const slugs = rows.map((row) => row.slug);
  const { data: existingRows, error: existingError } = await supabase
    .from('questions_master')
    .select('slug, review_status')
    .in('slug', slugs);

  if (existingError) throw existingError;

  const existingSlugs = new Set((existingRows ?? []).map((row) => row.slug));
  const rowsToInsert = skipExisting ? rows.filter((row) => !existingSlugs.has(row.slug)) : rows;

  if (!skipExisting && existingSlugs.size) {
    throw new Error(`Refusing to publish over existing slugs: ${Array.from(existingSlugs).join(', ')}`);
  }

  const { count: beforeCount, error: beforeCountError } = await supabase
    .from('questions_master')
    .select('id', { count: 'exact', head: true });

  if (beforeCountError) throw beforeCountError;

  if (!apply) {
    return {
      mode: 'dry-run',
      campaign,
      rowsReady: rows.length,
      skippedExisting: rows.length - rowsToInsert.length,
      rowsToInsert: rowsToInsert.length,
      beforeCount,
      expectedAfterCount: (beforeCount ?? 0) + rowsToInsert.length,
      slugs,
      insertSlugs: rowsToInsert.map((row) => row.slug),
      existingSlugs: Array.from(existingSlugs),
    };
  }

  if (!rowsToInsert.length) {
    return {
      mode: 'applied',
      campaign,
      inserted: 0,
      skippedExisting: rows.length,
      beforeCount,
      afterCount: beforeCount,
      slugs,
      insertSlugs: [],
      existingSlugs: Array.from(existingSlugs),
      message: 'All slugs already exist; nothing inserted.',
    };
  }

  const { error: insertError } = await supabase.from('questions_master').insert(rowsToInsert);
  if (insertError) throw insertError;

  const { count: afterCount, error: afterCountError } = await supabase
    .from('questions_master')
    .select('id', { count: 'exact', head: true });

  if (afterCountError) throw afterCountError;

  return {
    mode: 'applied',
    campaign,
    inserted: rowsToInsert.length,
    skippedExisting: rows.length - rowsToInsert.length,
    beforeCount,
    afterCount,
    expectedAfterCount: (beforeCount ?? 0) + rowsToInsert.length,
    slugs,
    insertSlugs: rowsToInsert.map((row) => row.slug),
    existingSlugs: Array.from(existingSlugs),
  };
}
