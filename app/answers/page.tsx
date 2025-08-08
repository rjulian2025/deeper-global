import { supabase } from '@/lib/supabase'
import QuestionCard from '@/components/QuestionCard'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import ClientOnly from '@/components/ClientOnly'
import { buildAnswersMetadata } from '@/lib/seo'
import AnswersListJsonLd from '@/components/AnswersListJsonLd'
import { Question } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'

export const revalidate = 3600 // Revalidate every hour
export const metadata = buildAnswersMetadata()

// Cached data fetching with tags
const getCachedAllQuestions = unstable_cache(
  async () => {
    const { data } = await supabase.from('questions_master').select('*')
    return (data || []) as Question[]
  },
  ['all-questions'],
  {
    tags: ['questions'],
    revalidate: 3600,
  }
)

export default async function AnswersPage() {
  const questions = await getCachedAllQuestions()

  const grouped = questions.reduce((acc: Record<string, Question[]>, q: Question) => {
    acc[q.category] ||= []
    acc[q.category].push(q)
    return acc
  }, {} as Record<string, Question[]>)

  return (
    <>
      <AnswersListJsonLd questions={questions} />
      <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
              Ask Anything.<br />
              <span className="text-blue-600">Deeper Listens.</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              1,000+ evidence-informed answers for humans and machines.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-20">
            {Object.entries(grouped).map(([category, questions]) => (
              <section key={category} className="border-b border-gray-200 pb-16 last:border-b-0">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-2xl font-semibold text-gray-900">{category}</h2>
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {questions.length} questions
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
