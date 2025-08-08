import { getQuestionBySlug, getRelatedQuestions } from '@/lib/db.server'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import ClientOnly from '@/components/ClientOnly'
import { buildQuestionMetadata } from '@/lib/seo'
import QuestionJsonLd from '@/components/QuestionJsonLd'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedAnswers from '@/components/RelatedAnswers'
import BackToTop from '@/app/(ui)/BackToTop'
import PrevNextNavigation from '@/components/PrevNextNavigation'
import EntityLinkedContent from '@/components/EntityLinkedContent'

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

  return buildQuestionMetadata(
    question.question,
    question.short_answer || 'No short answer available',
    slug
  )
}

// Loading skeleton
function AnswerSkeleton() {
  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse w-32"></div>
        </div>
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main content component
async function AnswerContent({ params }: Props) {
  const { slug } = await params
  const [question, relatedQuestions] = await Promise.all([
    getQuestionBySlug(slug),
    getRelatedQuestions(slug, 5)
  ])

  if (!question) {
    notFound()
  }

  // Guard against null values
  const safeShortAnswer = question.short_answer || 'No short answer available'
  const safeAnswer = question.answer || 'No detailed answer available'
  const safeCategory = question.category || 'Uncategorized'
  const safeRawCategory = question.raw_category || safeCategory

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Answers', href: '/answers' },
    { label: safeCategory, href: `/categories/${encodeURIComponent(safeCategory)}` },
    { label: question.question }
  ]

  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <QuestionJsonLd question={question} relatedQuestions={relatedQuestions} />
      <article className="mx-auto max-w-3xl">
        {/* Breadcrumbs */}
        <Breadcrumbs category={safeCategory} slug={slug} />

        {/* Question */}
        <section className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 leading-tight">
            {question.question}
          </h1>
          <div className="inline-flex px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium mb-6">
            {safeCategory}
          </div>
          <div className="text-lg text-gray-700 mb-6 leading-relaxed">
            {safeShortAnswer}
          </div>
        </section>

        {/* Full Answer */}
        <section className="prose prose-gray max-w-none">
          <EntityLinkedContent 
            content={safeAnswer}
            className="prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
          />
        </section>

        {/* Related Answers */}
        <RelatedAnswers currentId={question.id} category={safeRawCategory} />

        {/* Prev/Next Navigation */}
        <PrevNextNavigation currentSlug={slug} />

        {/* Back to top */}
        <BackToTop />
      </article>
    </div>
  )
}

export default function AnswerPage(props: Props) {
  return (
    <>
      <Suspense fallback={<AnswerSkeleton />}>
        <AnswerContent {...props} />
      </Suspense>
      <ClientOnly>
        <GoogleAnalytics />
      </ClientOnly>
    </>
  )
}
