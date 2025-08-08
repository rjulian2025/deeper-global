import { supabase } from './supabase'
import { unstable_cache } from 'next/cache'

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
