import Link from 'next/link'
import { getQuestions, Question } from '@/lib/supabase'
import { Suspense } from 'react'
import MainLayout from '@/components/MainLayout'
import QuestionCard from '@/components/QuestionCard'

// Loading skeleton component
function HomepageSkeleton() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero skeleton */}
        <div className="text-center mb-16">
          <div className="h-16 bg-gray-200 rounded-lg mb-6 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-8 bg-gray-200 rounded-lg mb-8 animate-pulse max-w-3xl mx-auto"></div>
          <div className="h-14 bg-blue-200 rounded-lg w-48 mx-auto animate-pulse"></div>
        </div>
        
        {/* Category skeletons */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="mb-12">
            <div className="h-8 bg-gray-200 rounded-lg mb-4 animate-pulse w-64"></div>
            <div className="h-5 bg-gray-200 rounded-lg mb-6 animate-pulse w-48"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  )
}

// Empty state component
function EmptyState() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No questions available</h2>
          <p className="text-gray-500 mb-6">Check back soon for mental health insights and answers.</p>
          <Link 
            href="/answers"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Answers
          </Link>
        </div>
      </div>
    </MainLayout>
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
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">{category}</h2>
        <p className="text-sm text-gray-500">
          Showing {questions.length} of {totalCount} questions
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </section>
  )
}

// Main content component
async function HomepageContent() {
  try {
    const questions = await getQuestions()
    
    if (!questions || questions.length === 0) {
      return <EmptyState />
    }

    // Group questions by category
    const groupedQuestions = questions.reduce((acc, question) => {
      const category = question.category || 'Uncategorized'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(question)
      return acc
    }, {} as Record<string, Question[]>)

    // Get top 6 categories by question count
    const topCategories = Object.entries(groupedQuestions)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 6)
      .map(([category, questions]) => ({
        category,
        questions: questions.slice(0, 3), // Show 2-3 questions per category
        totalCount: questions.length
      }))

    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Ask Anything. Deeper Listens.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              1,000+ evidence-informed answers for humans and machines.
            </p>
            <Link 
              href="/answers"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Browse All Answers
            </Link>
          </section>

          {/* Questions by Category */}
          <div className="space-y-12">
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
      </MainLayout>
    )
  } catch (error) {
    console.error('Error loading homepage data:', error)
    return <EmptyState />
  }
}

// Main page component with Suspense
export default function Home() {
  return (
    <Suspense fallback={<HomepageSkeleton />}>
      <HomepageContent />
    </Suspense>
  )
}
