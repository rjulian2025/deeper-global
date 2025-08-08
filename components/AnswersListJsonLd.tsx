import JsonLd from './JsonLd'
import { Question } from '@/lib/supabase'

interface AnswersListJsonLdProps {
  questions: Question[]
}

export default function AnswersListJsonLd({ questions }: AnswersListJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mental Health Questions and Answers',
    description: 'A comprehensive collection of evidence-informed mental health answers',
    numberOfItems: questions.length,
    itemListElement: questions.slice(0, 20).map((question, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Question',
        name: question.question,
        url: `https://deeper.global/answers/${question.slug}`,
        author: {
          '@type': 'Organization',
          name: 'Deeper',
          url: 'https://deeper.global'
        }
      }
    }))
  }

  return <JsonLd data={jsonLd} />
}
