import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ldizjhrfnxaacedmbujt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkaXpqaHJmbnhhYWNlZG1idWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNjk5NTAsImV4cCI6MjA2Mzc0NTk1MH0.JQZBTYkrGLMLd_0HK6aPwZPpDkHEj023hps7Nggu2js'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Question = {
  id: number
  question: string
  short_answer: string
  answer: string
  category: string
  raw_category: string
  slug: string
  created_at: string
  updated_at: string
}

export async function getQuestions() {
  try {
    const { data, error } = await supabase
      .from('questions_master')
      .select('question, short_answer, category, slug, id, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Supabase error:', error.message)
      return []
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ Supabase connected but returned 0 results')
      return []
    }

    console.log('✅ Supabase data fetched:', data.length, 'questions')
    return data as Question[]
  } catch (error) {
    console.warn('Failed to fetch questions:', error)
    return [] // Return empty array for build-time
  }
}

export async function getQuestionBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('questions_master')
      .select('id, question, short_answer, answer, category, raw_category, slug, created_at, updated_at')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    return data as Question
  } catch (error) {
    console.warn(`Failed to fetch question by slug ${slug}:`, error)
    return null // Return null for build-time
  }
}

export async function getQuestionsByCategory(category: string) {
  try {
    const { data, error } = await supabase
      .from('questions_master')
      .select('id, question, short_answer, answer, category, raw_category, slug, created_at, updated_at')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Question[]
  } catch (error) {
    console.warn(`Failed to fetch questions by category ${category}:`, error)
    return [] // Return empty array for build-time
  }
}
