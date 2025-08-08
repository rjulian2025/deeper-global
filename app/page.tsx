import Link from 'next/link'
import { getQuestions, Question } from '@/lib/db.server'
import { Suspense } from 'react'
import QuestionCard from '@/components/QuestionCard'
import ClientOnly from '@/components/ClientOnly'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import HomepageJsonLd from '@/components/HomepageJsonLd'

// Loading skeleton component
function HomepageSkeleton() {
  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-200 rounded-lg mb-6 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded mb-8 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-48 mx-auto animate-pulse"></div>
        </div>
        
        {/* Category skeletons */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="card p-6">
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

// Empty state component
function EmptyState() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🤔</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">No questions available</h2>
        <p className="text-gray-700 mb-8 leading-relaxed">Check back soon for mental health insights and answers.</p>
        <Link href="/answers" className="btn-primary">
          Browse Answers
        </Link>
      </div>
    </div>
  )
}

// Category section component
function CategorySection({ 
  category, 
  questions, 
  totalCount 
}: { 
  category: string; 
  questions: Question[]; 
  totalCount: number 
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">{category}</h2>
        <Link 
          href={`/categories/${encodeURIComponent(category)}`}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
        >
          View all {totalCount} questions →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <QuestionCard key={question.id} {...question} />
        ))}
      </div>
    </section>
  )
}

// Get questions for homepage (already cached in db.ts)
const getHomepageQuestions = async () => {
  return await getQuestions({ limit: 18 }) // Show 6 categories × 3 questions each
}

// Main content component
async function HomepageContent() {
  try {
    const questions = await getHomepageQuestions()
    
    if (!questions || questions.length === 0) {
      return <EmptyState />
    }

    // Group questions by category
    const groupedQuestions = questions.reduce((acc: Record<string, Question[]>, question: Question) => {
      const category = question.category || 'Uncategorized'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(question)
      return acc
    }, {} as Record<string, Question[]>)

    // Get top 6 categories by question count
    const topCategories = Object.entries(groupedQuestions)
      .sort(([, a], [, b]) => (b as Question[]).length - (a as Question[]).length)
      .slice(0, 6)
      .map(([category, questions]) => ({
        category,
        questions: (questions as Question[]).slice(0, 3), // Show 3 questions per category
        totalCount: (questions as Question[]).length
      }))

    return (
      <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl font-semibold mb-6 text-gray-900 leading-tight">
              Ask Anything.<br />
              <span className="text-blue-600">Deeper Listens.</span>
            </h1>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              1,000+ evidence-informed answers for humans and machines.
            </p>
            <Link href="/answers" className="btn-primary">
              Browse All Answers
            </Link>
          </section>

          {/* Questions by Category */}
          <div className="space-y-20">
            {topCategories.map(({ category, questions, totalCount }) => (
              <CategorySection 
                key={category}
                category={category}
                questions={questions}
                totalCount={totalCount}
              />
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading homepage data:', error)
    return <EmptyState />
  }
}

// Main page component with Suspense
export default function Home() {
  return (
    <>
      <HomepageJsonLd />
      <Suspense fallback={<HomepageSkeleton />}>
        <HomepageContent />
      </Suspense>
      <ClientOnly>
        <GoogleAnalytics />
      </ClientOnly>
    </>
  )
}
