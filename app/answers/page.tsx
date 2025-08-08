import { getQuestions } from '@/lib/supabase'
import MainLayout from '@/components/MainLayout'
import QuestionCard from '@/components/QuestionCard'
import { Suspense } from 'react'

// Loading skeleton
function AnswersSkeleton() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-lg mb-4 animate-pulse w-64"></div>
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-48"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

// Main content component
async function AnswersContent() {
  const questions = await getQuestions()

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mental Health Questions & Answers
          </h1>
          <p className="text-lg text-gray-600">
            Browse {questions.length} evidence-informed answers to mental health questions
          </p>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>

        {/* Empty state */}
        {questions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No questions available</h2>
            <p className="text-gray-500">Check back soon for mental health insights and answers.</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default function AnswersPage() {
  return (
    <Suspense fallback={<AnswersSkeleton />}>
      <AnswersContent />
    </Suspense>
  )
}
