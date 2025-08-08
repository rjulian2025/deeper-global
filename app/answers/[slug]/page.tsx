import { getQuestionBySlug } from '@/lib/supabase'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MainLayout from '@/components/MainLayout'
import { Suspense } from 'react'

export const revalidate = 3600 // Revalidate every hour

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const question = await getQuestionBySlug(slug)
  
  if (!question) {
    return {
      title: 'Not Found | Deeper',
      description: 'The requested answer could not be found.',
    }
  }

  return {
    title: `${question.question} | Deeper`,
    description: question.short_answer,
    openGraph: {
      title: question.question,
      description: question.short_answer,
      type: 'article',
    },
  }
}

// Loading skeleton
function AnswerSkeleton() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse w-32"></div>
        </div>
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

// Main content component
async function AnswerContent({ params }: Props) {
  const { slug } = await params
  const question = await getQuestionBySlug(slug)

  if (!question) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.question,
      text: question.question,
      dateCreated: question.created_at,
      author: {
        '@type': 'Organization',
        name: 'Deeper',
        url: 'https://deeper.global'
      },
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer,
        dateCreated: question.created_at,
        author: {
          '@type': 'Organization',
          name: 'Deeper',
          url: 'https://deeper.global'
        }
      }
    }
  }

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <Link 
              href="/answers"
              className="text-blue-600 hover:text-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All answers
            </Link>
            <span>/</span>
            <Link 
              href={`/categories/${encodeURIComponent(question.category)}`}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              {question.category}
            </Link>
          </div>
        </div>

        {/* Question */}
        <article className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {question.question}
          </h1>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
            {question.category}
          </div>
          <div className="text-lg text-gray-600 mb-6 leading-relaxed">
            {question.short_answer}
          </div>
        </article>

        {/* Full Answer */}
        <article className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Full Answer</h2>
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ __html: question.answer }}
          />
        </article>
      </div>
    </MainLayout>
  )
}

export default function AnswerPage(props: Props) {
  return (
    <Suspense fallback={<AnswerSkeleton />}>
      <AnswerContent {...props} />
    </Suspense>
  )
}
