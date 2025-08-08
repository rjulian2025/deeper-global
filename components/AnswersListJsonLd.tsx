import JsonLd from './JsonLd'
import type { Question } from '@/lib/db.server'
import { generateCategorySchema } from '@/lib/schema'

interface AnswersListJsonLdProps {
  questions: Question[]
}

export default function AnswersListJsonLd({ questions }: AnswersListJsonLdProps) {
  const jsonLd = generateCategorySchema('Mental Health', questions, questions.length)
  return <JsonLd data={jsonLd} />
}
