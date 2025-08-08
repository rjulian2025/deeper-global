import Link from 'next/link'

interface QuestionCardProps {
  slug: string
  question: string
  short_answer: string
  category?: string
}

export default function QuestionCard({ slug, question, short_answer, category }: QuestionCardProps) {
  return (
    <Link href={`/questions/${slug}`} className="group block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
        {question}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
        {short_answer}
      </p>
      {category && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {category}
        </div>
      )}
    </Link>
  )
}
