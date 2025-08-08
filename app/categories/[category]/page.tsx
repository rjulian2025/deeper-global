import { getQuestionsByCategory } from '@/lib/db.server'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import QuestionCard from '@/components/QuestionCard'
import { Suspense } from 'react'

export const revalidate = 3600 // Revalidate every hour

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  
  return {
    title: `${decodedCategory} Questions & Answers | Deeper`,
    description: `Browse mental health questions and answers related to ${decodedCategory}.`,
  }
}

// Loading skeleton
function CategorySkeleton() {
  return (
    <div className="bg-white text-black min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg mb-4 animate-pulse w-64"></div>
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-48"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main content component
async function CategoryContent({ params }: Props) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const questions = await getQuestionsByCategory(decodedCategory)

  if (!questions.length) {
    notFound()
  }

  return (
    <div className="bg-white text-black min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/answers"
              className="text-blue-600 hover:text-blue-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all answers
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">
            {decodedCategory}
          </h1>
          <p className="text-lg text-black">
            {questions.length} question{questions.length !== 1 ? 's' : ''} in this category
          </p>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <QuestionCard key={question.id} {...question} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage(props: Props) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent {...props} />
    </Suspense>
  )
}
