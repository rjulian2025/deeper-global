import { createClient } from '@supabase/supabase-js';

/**
 * review_status value marking an answer as a resolved content duplicate,
 * permanently excluded from all publishable surfaces (static answer pages,
 * llms/answers.json, topic pages, sitemap, search index). Distinct from
 * 'draft', which means new content awaiting its first review.
 */
export const RETIRED_DUPLICATE_REVIEW_STATUS = 'retired_duplicate';

export type Question = {
  id: number | string;
  question: string;
  improved_title?: string | null;
  improved_meta_description?: string | null;
  improved_summary?: string | null;
  staging_lede?: string | null;
  staging_key_takeaways?: string[] | null;
  staging_canonical_answer?: string | null;
  staging_primary_term?: string | null;
  staging_what_you_might_be_experiencing?: string | null;
  staging_what_can_help?: string | null;
  staging_when_to_reach_out?: string | null;
  staging_rewrite_at?: string | null;
  staging_rewrite_prompt_version?: string | null;
  short_answer: string;
  answer: string;
  answer_sections?: AnswerSection[] | null;
  key_takeaways?: string[] | null;
  care_note?: string | null;
  related_questions?: unknown[] | null;
  suggested_schema_question?: string | null;
  suggested_schema_answer?: string | null;
  primary_theme?: string | null;
  related_themes?: unknown[] | null;
  citation_notes?: string | null;
  content_prompt_version?: string | null;
  content_enriched_at?: string | null;
  review_status?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  /** Additive attribution columns (Phase C migration; may be absent until applied). */
  clinical_contributor_id?: string | null;
  clinical_contributor_assigned_at?: string | null;
  clinical_contributor_method?: string | null;
  clinical_contributor_approval_source?: string | null;
  clinical_reviewer_id?: string | null;
  clinically_reviewed_at?: string | null;
  editorial_review_status?: string | null;
  editorial_reviewer_id?: string | null;
  editorially_reviewed_at?: string | null;
  attribution_legacy_reviewed_by?: string | null;
  attribution_legacy_reviewed_at?: string | null;
  attribution_legacy_bulk_approval?: boolean | null;
  source_refs?: unknown[] | null;
  primary_entities?: unknown[] | null;
  related_entities?: unknown[] | null;
  triage: string | null;
  category: string | null;
  raw_category: string | null;
  slug: string;
  created_at: string;
  updated_at: string | null;
  semantic_enrichment_v1?: unknown | null;
};

export type AnswerSection = {
  type?: string | null;
  heading?: string | null;
  body: string;
};

export type ModalitySourceRef = {
  title?: string | null;
  url?: string | null;
  publisher?: string | null;
  note?: string | null;
};

export type Modality = {
  id: string;
  created_at: string;
  updated_at?: string | null;
  slug: string;
  name: string;
  also_known_as?: string[] | null;
  category: string;
  status: string;
  canonical_definition?: string | null;
  lede?: string | null;
  what_it_is?: string | null;
  what_a_session_looks_like?: string | null;
  what_it_treats?: string | null;
  what_the_evidence_says?: string | null;
  who_it_is_for?: string | null;
  how_to_find_a_practitioner?: string | null;
  key_takeaways?: string[] | null;
  primary_term?: string | null;
  canonical_answer?: string | null;
  schema_description?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_status?: string | null;
  source_refs?: ModalitySourceRef[] | null;
  staging_lede?: string | null;
  staging_what_it_is?: string | null;
  staging_what_a_session_looks_like?: string | null;
  staging_what_it_treats?: string | null;
  staging_what_the_evidence_says?: string | null;
  staging_who_it_is_for?: string | null;
  staging_how_to_find_a_practitioner?: string | null;
  staging_key_takeaways?: string[] | null;
  staging_canonical_answer?: string | null;
  staging_rewrite_at?: string | null;
  staging_rewrite_error?: string | null;
  staging_rewrite_model?: string | null;
  staging_rewrite_prompt_version?: string | null;
  ymyl_flagged: boolean;
  related_question_slugs?: string[] | null;
  related_modality_slugs?: string[] | null;
  practitioner_specialty_tags?: string[] | null;
  seo_title?: string | null;
  meta_description?: string | null;
  noindex: boolean;
};

/** Fail production builds if Supabase returns fewer answers than this floor. */
export const MIN_ANSWER_COUNT = 950;

const supabaseUrl =
  import.meta.env.SUPABASE_URL ??
  import.meta.env.PUBLIC_SUPABASE_URL ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.SUPABASE_ANON_KEY ??
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

let questionsCache: Promise<Question[]> | null = null;
let modalitiesCache: Promise<Modality[]> | null = null;
const pageSize = 1000;

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Missing Supabase config. Set SUPABASE_URL and SUPABASE_ANON_KEY, or PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return supabase;
}

export async function getQuestions(limit?: number) {
  const questions = await getAllQuestions();
  return limit ? questions.slice(0, limit) : questions;
}

/**
 * Vercel sets VERCEL=1 and CI=1 during builds. Local `astro dev` / `astro build`
 * without Supabase config keeps working (empty corpus), but a production/CI
 * build must never silently ship a near-empty site.
 */
function isProductionBuildContext() {
  return Boolean(process.env.VERCEL || process.env.CI);
}

async function getAllQuestions() {
  if (!hasSupabaseConfig) {
    if (isProductionBuildContext()) {
      throw new Error(
        'Supabase config is missing in a production/CI build. Set SUPABASE_URL and SUPABASE_ANON_KEY ' +
          '(or PUBLIC_/NEXT_PUBLIC_ variants) so the build cannot ship an empty answer corpus.'
      );
    }
    return [] as Question[];
  }

  if (!questionsCache) {
    questionsCache = fetchQuestionPages();
  }

  return questionsCache;
}

async function fetchQuestionPages() {
  const client = requireSupabase();
  const pages: Question[] = [];

  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const { data, error } = await client
      .from('questions_master')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const page = (data ?? []) as Question[];
    pages.push(...page);

    if (page.length < pageSize) break;
  }

  if (pages.length < MIN_ANSWER_COUNT) {
    throw new Error(
      `Answer count floor failed: expected at least ${MIN_ANSWER_COUNT} questions from Supabase, got ${pages.length}.`
    );
  }

  return pages;
}

export async function getQuestionBySlug(slug: string) {
  if (!hasSupabaseConfig) {
    return null;
  }

  const { data, error } = await requireSupabase()
    .from('questions_master')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as Question | null;
}

export async function getQuestionsByCategory(category: string) {
  const questions = await getQuestions();
  return questions.filter((question) => question.category === category);
}

function isMissingModalitiesTableError(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  const message = error.message?.toLowerCase() ?? '';
  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    message.includes('modalities') && (message.includes('does not exist') || message.includes('could not find'))
  );
}

export async function getModalities(): Promise<Modality[]> {
  if (!hasSupabaseConfig) {
    return [];
  }

  // Module-level cache (same pattern as questionsCache): answer pages call
  // this per page, so without it every static page issues its own query.
  if (!modalitiesCache) {
    modalitiesCache = fetchModalities();
  }

  return modalitiesCache;
}

async function fetchModalities(): Promise<Modality[]> {
  const { data, error } = await requireSupabase()
    .from('modalities')
    .select('*')
    .eq('status', 'published')
    .order('name', { ascending: true });

  if (error) {
    if (isMissingModalitiesTableError(error)) {
      return [];
    }
    throw error;
  }

  return (data ?? []) as Modality[];
}

export async function getModalityBySlug(slug: string): Promise<Modality | null> {
  if (!hasSupabaseConfig) {
    return null;
  }

  const { data, error } = await requireSupabase()
    .from('modalities')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    if (isMissingModalitiesTableError(error)) {
      return null;
    }
    throw error;
  }

  return data as Modality | null;
}
