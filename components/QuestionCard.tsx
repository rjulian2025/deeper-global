import Link from 'next/link'
import { Question } from '@/lib/supabase'

interface QuestionCardProps {
  question: Question
  showCategory?: boolean
}

export default function QuestionCard({ question, showCategory = true }: QuestionCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group">
      <Link href={`/answers/${question.slug}`} className="block">
        <h3 className="font-semibold text-lg mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {question.question}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {question.short_answer}
        </p>
        <div className="flex items-center justify-between">
          {showCategory && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {question.category}
            </div>
          )}
          <div className="text-sm text-blue-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
            Read more
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  )
}
