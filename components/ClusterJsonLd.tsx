import JsonLd from './JsonLd'
import type { Question } from '@/lib/db.server'
import { generateCategorySchema } from '@/lib/schema'

interface ClusterJsonLdProps {
  clusterName: string
  questions: Question[]
  totalCount?: number
}

export default function ClusterJsonLd({ clusterName, questions, totalCount }: ClusterJsonLdProps) {
  const jsonLd = generateCategorySchema(clusterName, questions, totalCount || questions.length)
  return <JsonLd data={jsonLd} />
}
