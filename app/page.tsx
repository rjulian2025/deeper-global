import Link from 'next/link'
import { getQuestions, Question } from '@/lib/supabase'
import { Suspense } from 'react'
import QuestionCard from '@/components/QuestionCard'

// Loading skeleton component
function HomepageSkeleton() {
  return (
    <div className="bg-white text-black min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-200 rounded mb-6 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded mb-8 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-40 mx-auto animate-pulse"></div>
        </div>
        
        {/* Category skeletons */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-white border border-gray-300 p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
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
    <div className="bg-white text-black min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🤔</div>
        <h2 className="text-2xl font-semibold text-black mb-2">No questions available</h2>
        <p className="text-black mb-6">Check back soon for mental health insights and answers.</p>
        <Link 
          href="/answers"
          className="inline-block bg-blue-600 text-white px-6 py-3 text-base font-medium underline"
        >
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
        <h2 className="text-2xl font-semibold text-black">{category}</h2>
        <Link 
          href={`/categories/${encodeURIComponent(category)}`}
          className="text-blue-600 underline"
        >
          View all {totalCount} questions
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {questions.map((question) => (
          <QuestionCard key={question.id} {...question} />
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
      <div className="bg-white text-black min-h-screen px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6 text-black">
              Ask Anything. Deeper Listens.
            </h1>
            <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
              1,000+ evidence-informed answers for humans and machines.
            </p>
            <Link 
              href="/answers"
              className="inline-block bg-blue-600 text-white px-6 py-3 text-base font-medium underline"
            >
              Browse All Answers
            </Link>
          </section>

          {/* Questions by Category */}
          <div className="space-y-16">
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
    <div className="bg-white text-black min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-black">
          Ask Anything. Deeper Listens.
        </h1>
        <p className="text-lg text-black mb-8">
          1,000+ evidence-informed answers for humans and machines.
        </p>
        <div className="bg-blue-100 border-2 border-blue-300 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Test Page - Enhanced Styling
          </h2>
          <p className="text-blue-700 mb-4">
            This is a test page with explicit styling to verify our changes are working.
          </p>
          <div className="bg-white border-2 border-gray-300 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Sample Question Card
            </h3>
            <p className="text-gray-700 mb-3">
              This shows how our enhanced QuestionCard component should look.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border-2 border-blue-200">
              Test Category
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
