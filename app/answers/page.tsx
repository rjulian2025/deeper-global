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
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ask Anything. Deeper Listens.</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            1,000+ evidence-informed answers for humans and machines.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {Object.entries(grouped).map(([category, questions]) => (
            <section key={category} className="border-b border-gray-100 pb-12 last:border-b-0">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                <span className="text-sm text-gray-500">{questions.length} questions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((q) => (
                  <QuestionCard key={q.slug} {...q} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
