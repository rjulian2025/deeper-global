import Link from 'next/link'
import { getQuestions, Question } from '@/lib/supabase'
import { Suspense } from 'react'

// Loading component for Suspense fallback
function HomepageLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded mb-8 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-12 bg-blue-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        
        {/* Category skeletons */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="mb-12">
            <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse w-48"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="border rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Component to group questions by category
function QuestionsByCategory({ questions }: { questions: Question[] }) {
  // Group questions by category
  const groupedQuestions = questions.reduce((acc, question) => {
    const category = question.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(question)
    return acc
  }, {} as Record<string, Question[]>)

  // Get top categories with most questions
  const topCategories = Object.entries(groupedQuestions)
    .sort(([, a], [, b]) => (b as Question[]).length - (a as Question[]).length)
    .slice(0, 6) // Show top 6 categories

  return (
    <div className="space-y-12">
              {topCategories.map(([category, categoryQuestions]) => (
          <section key={category}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">{category}</h2>
              <p className="text-sm text-gray-500">
                Showing {Math.min((categoryQuestions as Question[]).length, 4)} of {(categoryQuestions as Question[]).length} questions
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {(categoryQuestions as Question[]).slice(0, 4).map((question: Question) => (
              <article key={question.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <Link href={`/answers/${question.slug}`} className="block">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                    {question.question}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {question.short_answer}
                  </p>
                  <div className="text-sm text-blue-600 font-medium">
                    {category} →
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

// Main homepage component
async function HomepageContent() {
  const questions = await getQuestions()
  
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Ask Anything. Deeper Listens.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            1,000+ evidence-informed answers for humans and machines.
          </p>
          <Link 
            href="/answers"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse All Answers
          </Link>
        </section>

        {/* Questions by Category */}
        <QuestionsByCategory questions={questions} />
      </div>
    </main>
  )
}

// Main page component with Suspense
export default function Home() {
  return (
    <Suspense fallback={<HomepageLoading />}>
      <HomepageContent />
    </Suspense>
  )
}
