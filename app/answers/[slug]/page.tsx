import { getQuestionBySlug } from '@/lib/supabase'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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

export default async function AnswerPage({ params }: Props) {
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
    <main className="min-h-screen p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>{question.question}</h1>
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-8">
          {question.short_answer}
        </div>
        <div dangerouslySetInnerHTML={{ __html: question.answer }} />
      </article>
    </main>
  )
}
