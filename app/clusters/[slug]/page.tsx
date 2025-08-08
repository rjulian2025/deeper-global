import QuestionCard from '@/components/QuestionCard'
import Link from 'next/link'
import { Metadata } from 'next'
import { buildClusterMetadata } from '@/lib/seo'
import ClusterJsonLd from '@/components/ClusterJsonLd'
import { getQuestionsByCategory, getQuestionsCount, Question } from '@/lib/db'

export const revalidate = 3600 // Revalidate every hour

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  
  // Get question count for this cluster
  const questionCount = await getQuestionsCount(decodedSlug)
  
  return buildClusterMetadata(decodedSlug, questionCount)
}

export default async function ClusterPage({ params }: Props) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const questions = await getQuestionsByCategory(decodedSlug, { limit: 100 })

  return (
    <>
      <ClusterJsonLd clusterName={decodeURIComponent(slug)} questions={questions} />
      <div className="bg-white text-black min-h-screen px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/answers" className="text-blue-600 hover:underline">
              ← Back to all questions
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 text-black">{slug.replace(/-/g, ' ')}</h1>
          <p className="text-black mb-8">{questions.length} questions in this cluster</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((q) => (
              <QuestionCard key={q.slug} {...q} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
