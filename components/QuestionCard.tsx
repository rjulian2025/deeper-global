import Link from 'next/link'
import type { Question } from '@/lib/db'

type QuestionCardProps = Pick<Question, 'slug' | 'question' | 'short_answer' | 'category'>

export default function QuestionCard({ slug, question, short_answer, category }: QuestionCardProps) {
  return (
    <Link 
      href={`/answers/${slug}`} 
      className="group block card p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-all duration-200"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 leading-tight">
          {question}
        </h3>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          {short_answer}
        </p>
      </div>
      
      {category && (
        <div className="category-pill mt-auto">
          {category}
        </div>
      )}
    </Link>
  )
}
