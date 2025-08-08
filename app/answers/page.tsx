import { supabase } from '@/lib/supabase'
import QuestionCard from '@/components/QuestionCard'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import ClientOnly from '@/components/ClientOnly'

export const revalidate = 3600 // Revalidate every hour

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
    <>
      <div className="bg-white text-black min-h-screen px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Ask Anything. Deeper Listens.</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              1,000+ evidence-informed answers for humans and machines.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-20">
            {Object.entries(grouped).map(([category, questions]) => (
              <section key={category} className="border-b-2 border-gray-200 pb-16 last:border-b-0">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl font-bold text-gray-900">{category}</h2>
                  <span className="text-lg text-gray-500 font-medium">{questions.length} questions</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {questions.map((q) => (
                    <QuestionCard key={q.slug} {...q} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      <ClientOnly>
        <GoogleAnalytics />
      </ClientOnly>
    </>
  )
}
