import JsonLd from './JsonLd'
import { Question } from '@/lib/supabase'

interface ClusterJsonLdProps {
  clusterName: string
  questions: Question[]
}

export default function ClusterJsonLd({ clusterName, questions }: ClusterJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${clusterName} Questions`,
    description: `Mental health questions and answers in the ${clusterName} category`,
    url: `https://deeper.global/clusters/${encodeURIComponent(clusterName)}`,
    mainEntity: {
      '@type': 'ItemList',
      name: `${clusterName} Questions`,
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
  }

  return <JsonLd data={jsonLd} />
}
