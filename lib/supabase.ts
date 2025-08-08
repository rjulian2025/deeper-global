import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Question = {
  id: number
  question: string
  short_answer: string
  answer: string
  triage: string
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
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
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
      .select('*')
      .eq('slug', slug)
      .single()

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
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Question[]
  } catch (error) {
    console.warn(`Failed to fetch questions by category ${category}:`, error)
    return [] // Return empty array for build-time
  }
}
