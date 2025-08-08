import Link from 'next/link'
import { Question } from '@/lib/supabase'

interface QuestionCardProps {
  question: Question
  showCategory?: boolean
}

export default function QuestionCard({ question, showCategory = true }: QuestionCardProps) {
  return (
    <article className="bg-white border border-gray-300 p-4 hover:shadow-md">
      <Link href={`/answers/${question.slug}`} className="block">
        <h3 className="font-semibold text-lg mb-2 text-black">
          {question.question}
        </h3>
        <p className="text-black mb-3 text-sm leading-relaxed">
          {question.short_answer}
        </p>
        <div className="flex items-center justify-between">
          {showCategory && (
            <div className="text-xs text-black border border-gray-300 px-2 py-1">
              {question.category}
            </div>
          )}
          <div className="text-sm text-blue-600 underline">
            Read more
          </div>
        </div>
      </Link>
    </article>
  )
}
