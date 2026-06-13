import { createClient } from '@supabase/supabase-js';

export type Question = {
  id: number | string;
  question: string;
  improved_title?: string | null;
  improved_meta_description?: string | null;
  improved_summary?: string | null;
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
  source_refs?: unknown[] | null;
  primary_entities?: unknown[] | null;
  related_entities?: unknown[] | null;
  triage: string | null;
  category: string | null;
  raw_category: string | null;
  slug: string;
  created_at: string;
  updated_at: string | null;
};

export type AnswerSection = {
  type?: string | null;
  heading?: string | null;
  body: string;
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

async function getAllQuestions() {
  if (!hasSupabaseConfig) {
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
