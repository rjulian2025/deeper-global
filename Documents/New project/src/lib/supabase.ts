import { createClient } from '@supabase/supabase-js';

export type Question = {
  id: number | string;
  question: string;
  short_answer: string;
  answer: string;
  triage: string | null;
  category: string | null;
  raw_category: string | null;
  slug: string;
  created_at: string;
  updated_at: string | null;
};

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
    questionsCache = requireSupabase()
      .from('questions_master')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as Question[];
      });
  }

  return questionsCache;
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
