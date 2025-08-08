import Link from 'next/link'
import Script from 'next/script'
import { getRelatedQuestions, Question } from '@/lib/db.server'

interface RelatedQuestionsProps {
  currentSlug: string
  className?: string
}

export default async function RelatedQuestions({ currentSlug, className = '' }: RelatedQuestionsProps) {
  const relatedQuestions = await getRelatedQuestions(currentSlug, 5)
  
  if (!relatedQuestions || relatedQuestions.length === 0) {
    return null
  }

  // Generate FAQPage JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: relatedQuestions.map(question => ({
      '@type': 'Question',
      name: question.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.short_answer
      }
    }))
  }

  return (
    <>
      <Script
        id="related-questions-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className={`mt-12 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">People Also Ask</h2>
        <div className="space-y-4">
          {relatedQuestions.map((question) => (
            <Link
              key={question.slug}
              href={`/answers/${question.slug}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight">
                {question.question}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {question.short_answer}
              </p>
              {question.category && (
                <div className="mt-3">
                  <span className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded">
                    {question.category}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
