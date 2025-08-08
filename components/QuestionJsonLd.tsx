import JsonLd from './JsonLd'
import type { QuestionDetail } from '@/lib/db.server'
import { generateQuestionSchema } from '@/lib/schema'

interface QuestionJsonLdProps {
  question: QuestionDetail
  relatedQuestions?: any[]
}

export default function QuestionJsonLd({ question, relatedQuestions = [] }: QuestionJsonLdProps) {
  const jsonLd = generateQuestionSchema(question, relatedQuestions)
  return <JsonLd data={jsonLd} />
}
