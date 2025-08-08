import QuestionCard from '@/components/QuestionCard'
import Link from 'next/link'
import { Metadata } from 'next'
import { buildClusterMetadata } from '@/lib/seo'
import ClusterJsonLd from '@/components/ClusterJsonLd'
import { getClusterPage, getQuestionsCount, Question } from '@/lib/db.server'
import Pagination from '@/components/Pagination'
import AdditionalLinks from '@/components/AdditionalLinks'
import Breadcrumbs from '@/components/Breadcrumbs'

export const revalidate = 3600 // Revalidate every hour

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  
  // Get question count for this cluster
  const questionCount = await getQuestionsCount(decodedSlug)
  
  return buildClusterMetadata(decodedSlug, questionCount)
}

export default async function ClusterPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page } = await searchParams
  const decodedSlug = decodeURIComponent(slug)
  const currentPage = page ? parseInt(page, 10) : 1
  
  const { questions, totalCount, totalPages } = await getClusterPage(decodedSlug, currentPage, 24)

  return (
    <>
      <ClusterJsonLd clusterName={decodedSlug} questions={questions} totalCount={totalCount} />
      <div className="bg-white text-black min-h-screen px-4 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs category={decodedSlug} slug={slug} />
          
          <h1 className="text-3xl font-bold mb-6 text-black">{decodedSlug}</h1>
          <p className="text-black mb-8">{totalCount} questions in this cluster</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((q: Question) => (
              <QuestionCard key={q.slug} {...q} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            baseUrl={`/clusters/${slug}`} 
            className="mt-16"
          />

          {/* Additional Links */}
          <AdditionalLinks 
            category={decodedSlug}
            excludeSlugs={questions.map((q: Question) => q.slug)} 
            className="mt-16"
          />
        </div>
      </div>
    </>
  )
}
