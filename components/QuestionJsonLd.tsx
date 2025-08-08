import JsonLd from './JsonLd'
import { Question } from '@/lib/supabase'

interface QuestionJsonLdProps {
  question: Question
}

export default function QuestionJsonLd({ question }: QuestionJsonLdProps) {
  const safeAnswer = question.answer || 'No detailed answer available'
  
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
        text: safeAnswer,
        dateCreated: question.created_at,
        author: {
          '@type': 'Organization',
          name: 'Deeper',
          url: 'https://deeper.global'
        }
      }
    }
  }

  return <JsonLd data={jsonLd} />
}
