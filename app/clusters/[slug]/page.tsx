import { supabase } from '@/lib/supabase'
import QuestionCard from '@/components/QuestionCard'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ClusterPage({ params }: Props) {
  const { slug } = await params
  
  const { data } = await supabase
    .from('questions_master')
    .select('*')
    .eq('raw_category', decodeURIComponent(slug))

  const questions = data || []

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/answers" className="text-blue-600 hover:underline">
          ← Back to all questions
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">{slug.replace(/-/g, ' ')}</h1>
      <p className="text-gray-600 mb-8">{questions.length} questions in this cluster</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((q) => (
          <QuestionCard key={q.slug} {...q} />
        ))}
      </div>
    </div>
  )
}
