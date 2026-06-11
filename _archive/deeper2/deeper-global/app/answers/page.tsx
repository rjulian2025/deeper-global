import { getQuestions } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 3600 // Revalidate every hour

export default async function AnswersPage() {
  const questions = await getQuestions()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Mental Health Questions & Answers</h1>
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
              <div className="mt-4">
                <span className="inline-block bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {question.category}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
