import { supabase } from '@/lib/supabase'
import QuestionCard from '@/components/QuestionCard'

interface Question {
  id: string
  slug: string
  question: string
  short_answer: string
  category: string
}

export default async function AnswersPage() {
  const { data } = await supabase.from('questions_master').select('*')

  const questions = (data || []) as Question[]

  const grouped = questions.reduce((acc, q) => {
    acc[q.category] ||= []
    acc[q.category].push(q)
    return acc
  }, {} as Record<string, Question[]>)

  return (
    <div className="bg-white text-black min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Ask Anything. Deeper Listens.</h1>
        {Object.entries(grouped).map(([category, questions]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-black">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions.map((q) => (
                <QuestionCard key={q.slug} {...q} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
