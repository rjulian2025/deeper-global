import Link from 'next/link'

interface QuestionCardProps {
  slug: string
  question: string
  short_answer: string
  category?: string
}

export default function QuestionCard({ slug, question, short_answer, category }: QuestionCardProps) {
  return (
    <Link 
      href={`/questions/${slug}`} 
      className="group block bg-white border-2 border-gray-300 rounded-xl p-8 hover:shadow-xl hover:border-blue-400 transition-all duration-300 mb-4"
      style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
    >
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-4">
        {question}
      </h3>
      <p className="text-base text-gray-700 leading-relaxed mb-6">
        {short_answer}
      </p>
      {category && (
        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border-2 border-blue-200">
          {category}
        </div>
      )}
    </Link>
  )
}
