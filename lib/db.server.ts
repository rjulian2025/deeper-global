import 'server-only'
import { supabase } from './supabase.server'
import { unstable_cache, revalidateTag } from 'next/cache'

export interface Question {
  id: string
  slug: string
  question: string
  short_answer: string
  category?: string
  updated_at: string
}

export interface QuestionDetail extends Question {
  answer?: string
  raw_category?: string
  created_at?: string
}

export interface GetQuestionsOptions {
  limit?: number
  offset?: number
  category?: string
}

// Optimized list query - only fetch needed fields
export const getQuestions = unstable_cache(
  async (options: GetQuestionsOptions = {}): Promise<Question[]> => {
    const { limit = 50, offset = 0, category } = options
    
    let query = supabase
      .from('questions_master')
      .select('id, slug, question, short_answer, category, updated_at')
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching questions:', error)
      return []
    }
    
    return (data || []) as Question[]
  },
  ['questions-list'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Optimized detail query - includes full answer
export const getQuestionBySlug = unstable_cache(
  async (slug: string): Promise<QuestionDetail | null> => {
    const { data, error } = await supabase
      .from('questions_master')
      .select('id, slug, question, short_answer, answer, category, raw_category, created_at, updated_at')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error fetching question by slug:', error)
      return null
    }
    
    return data as QuestionDetail
  },
  ['question-by-slug'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Get questions by category with pagination
export const getQuestionsByCategory = unstable_cache(
  async (category: string, options: GetQuestionsOptions = {}): Promise<Question[]> => {
    return getQuestions({ ...options, category })
  },
  ['questions-by-category'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Get all categories for navigation
export const getCategories = unstable_cache(
  async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('questions_master')
      .select('category')
      .not('category', 'is', null)
    
    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }
    
    const categories = [...new Set(data?.map(q => q.category).filter(Boolean))]
    return categories.sort()
  },
  ['categories'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Get total count for pagination
export const getQuestionsCount = unstable_cache(
  async (category?: string): Promise<number> => {
    let query = supabase
      .from('questions_master')
      .select('id', { count: 'exact', head: true })
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { count, error } = await query
    
    if (error) {
      console.error('Error fetching questions count:', error)
      return 0
    }
    
    return count || 0
  },
  ['questions-count'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Cache invalidation utilities
export async function invalidateAllQuestions() {
  revalidateTag('questions')
  console.log('✅ Invalidated questions cache')
}

export async function invalidateCluster(clusterSlug: string) {
  revalidateTag(`cluster:${clusterSlug}`)
  console.log(`✅ Invalidated cluster cache: ${clusterSlug}`)
}

export async function invalidateQuestion(slug: string) {
  revalidateTag(`question:${slug}`)
  console.log(`✅ Invalidated question cache: ${slug}`)
}

// New functions for internal linking system

// Get related questions by same category (fallback to same cluster)
export const getRelatedQuestions = unstable_cache(
  async (slug: string, limit: number = 5): Promise<Question[]> => {
    const question = await getQuestionBySlug(slug)
    if (!question?.category) return []

    const { data, error } = await supabase
      .from('questions_master')
      .select('id, slug, question, short_answer, category, updated_at')
      .eq('category', question.category)
      .neq('slug', slug) // Exclude current question
      .order('updated_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching related questions:', error)
      return []
    }
    
    return (data || []) as Question[]
  },
  ['related-questions'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Get prev/next questions in same category
export const getPrevNextInCategory = unstable_cache(
  async (slug: string): Promise<{ prev: Question | null; next: Question | null }> => {
    const question = await getQuestionBySlug(slug)
    if (!question?.category) return { prev: null, next: null }

    // Get all questions in same category ordered by slug
    const { data, error } = await supabase
      .from('questions_master')
      .select('id, slug, question, short_answer, category, updated_at')
      .eq('category', question.category)
      .order('slug', { ascending: true })
    
    if (error || !data) {
      console.error('Error fetching category questions:', error)
      return { prev: null, next: null }
    }

    const questions = data as Question[]
    const currentIndex = questions.findIndex(q => q.slug === slug)
    
    if (currentIndex === -1) return { prev: null, next: null }
    
    // Handle edge cases for empty array or single item
    if (questions.length <= 1) {
      return { prev: null, next: null }
    }
    
    const prev = currentIndex > 0 ? questions[currentIndex - 1]! : questions[questions.length - 1]! // Wrap to last
    const next = currentIndex < questions.length - 1 ? questions[currentIndex + 1]! : questions[0]! // Wrap to first
    
    return { prev, next }
  },
  ['prev-next-category'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Get paginated questions for answers hub
export const getAnswersPage = unstable_cache(
  async (page: number = 1, pageSize: number = 24): Promise<{ questions: Question[]; totalCount: number; totalPages: number }> => {
    const offset = (page - 1) * pageSize
    
    const [questionsData, countData] = await Promise.all([
      supabase
        .from('questions_master')
        .select('id, slug, question, short_answer, category, updated_at')
        .order('updated_at', { ascending: false })
        .range(offset, offset + pageSize - 1),
      supabase
        .from('questions_master')
        .select('id', { count: 'exact', head: true })
    ])
    
    if (questionsData.error || countData.error) {
      console.error('Error fetching paginated questions:', questionsData.error || countData.error)
      return { questions: [], totalCount: 0, totalPages: 0 }
    }
    
    const questions = (questionsData.data || []) as Question[]
    const totalCount = countData.count || 0
    const totalPages = Math.ceil(totalCount / pageSize)
    
    return { questions, totalCount, totalPages }
  },
  ['answers-page'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Get paginated questions for cluster pages
export const getClusterPage = unstable_cache(
  async (category: string, page: number = 1, pageSize: number = 24): Promise<{ questions: Question[]; totalCount: number; totalPages: number }> => {
    const offset = (page - 1) * pageSize
    
    const [questionsData, countData] = await Promise.all([
      supabase
        .from('questions_master')
        .select('id, slug, question, short_answer, category, updated_at')
        .eq('category', category)
        .order('updated_at', { ascending: false })
        .range(offset, offset + pageSize - 1),
      supabase
        .from('questions_master')
        .select('id', { count: 'exact', head: true })
        .eq('category', category)
    ])
    
    if (questionsData.error || countData.error) {
      console.error('Error fetching paginated cluster questions:', questionsData.error || countData.error)
      return { questions: [], totalCount: 0, totalPages: 0 }
    }
    
    const questions = (questionsData.data || []) as Question[]
    const totalCount = countData.count || 0
    const totalPages = Math.ceil(totalCount / pageSize)
    
    return { questions, totalCount, totalPages }
  },
  ['cluster-page'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Get categories with question counts for sitemap
export const getCategoriesWithCounts = unstable_cache(
  async (): Promise<Array<{ category: string; count: number; updated_at: string }>> => {
    const { data, error } = await supabase
      .from('questions_master')
      .select('category, updated_at')
      .not('category', 'is', null)
    
    if (error) {
      console.error('Error fetching categories with counts:', error)
      return []
    }
    
    const categoryCounts = data?.reduce((acc: Record<string, { count: number; latestUpdate: string }>, row) => {
      const category = row.category
      if (!acc[category]) {
        acc[category] = { count: 0, latestUpdate: row.updated_at }
      }
      acc[category].count++
      if (row.updated_at > acc[category].latestUpdate) {
        acc[category].latestUpdate = row.updated_at
      }
      return acc
    }, {}) || {}
    
    return Object.entries(categoryCounts).map(([category, { count, latestUpdate }]) => ({
      category,
      count,
      updated_at: latestUpdate
    })).sort((a, b) => b.count - a.count)
  },
  ['categories-with-counts'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Get all questions for sitemap generation with timestamps
export const getAllQuestionsForSitemap = unstable_cache(
  async (): Promise<Array<{ slug: string; updated_at: string; created_at?: string }>> => {
    const { data, error } = await supabase
      .from('questions_master')
      .select('slug, updated_at, created_at')
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching questions for sitemap:', error)
      return []
    }
    
    return (data || []) as Array<{ slug: string; updated_at: string; created_at?: string }>
  },
  ['questions-sitemap'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

// Get related questions by category (excluding current question)
export async function getRelatedByCategory(category: string, excludeSlug: string, limit = 6) {
  const supabase = await import('./supabase.server').then(m => m.supabase)
  const { data } = await supabase
    .from("questions_master")
    .select("slug, question, short_answer")
    .eq("raw_category", category)
    .neq("slug", excludeSlug)
    .limit(limit);
  return data ?? [];
}

// Get questions with filters and pagination
export async function getQuestionsWithFilters({
  q = "",
  category = "",
  page = 1,
  pageSize = 24,
}: { q?: string; category?: string; page?: number; pageSize?: number; }) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await import('./supabase.server').then(m => m.supabase)

  let query = supabase
    .from("questions_master")
    .select("id, slug, question, short_answer, category, raw_category, updated_at", { count: "exact" })
    .order("slug", { ascending: true });

  if (q) query = query.ilike("question", `%${q}%`);
  if (category) query = query.eq("raw_category", category);

  const { data, count } = await query.range(from, to);
  return { rows: (data || []) as Question[], total: count ?? 0 };
}

// Get additional links for hub pages (explore more section)
export const getAdditionalHubLinks = unstable_cache(
  async (category?: string, excludeSlugs: string[] = [], limit: number = 8): Promise<Question[]> => {
    let query = supabase
      .from('questions_master')
      .select('id, slug, question, short_answer, category, updated_at')
      .not('slug', 'in', `(${excludeSlugs.map(s => `'${s}'`).join(',')})`)
      .order('updated_at', { ascending: false })
      .limit(limit)
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching additional hub links:', error)
      return []
    }
    
    return (data || []) as Question[]
  },
  ['additional-hub-links'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)
