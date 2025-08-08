import { getQuestionsByCategory } from '@/lib/supabase'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // Revalidate every hour

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  
  return {
    title: `${decodedCategory} Questions & Answers | Deeper`,
    description: `Browse mental health questions and answers related to ${decodedCategory}.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const questions = await getQuestionsByCategory(decodedCategory)

  if (!questions.length) {
    notFound()
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{decodedCategory} Questions & Answers</h1>
        <div className="space-y-8">
          {questions.map((question) => (
            <article key={question.id} className="border-b pb-8">
              <Link href={`/answers/${question.slug}`}>
                <h2 className="text-xl font-semibold mb-4 hover:text-blue-600">
                  {question.question}
                </h2>
              </Link>
              <p className="text-gray-600 dark:text-gray-300">
                {question.short_answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
