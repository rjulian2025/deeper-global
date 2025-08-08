import 'server-only'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ldizjhrfnxaacedmbujt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkaXpqaHJmbnhhYWNlZG1idWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNjk5NTAsImV4cCI6MjA2Mzc0NTk1MH0.JQZBTYkrGLMLd_0HK6aPwZPpDkHEj023hps7Nggu2js'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


