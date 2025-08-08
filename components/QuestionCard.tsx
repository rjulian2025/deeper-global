import Link from 'next/link'

type QuestionCardProps = {
  slug: string
  question: string
  short_answer: string
  category?: string
  raw_category?: string
}

export default function QuestionCard({ slug, question, short_answer, category, raw_category }: QuestionCardProps) {
  return (
    <Link 
      href={`/answers/${slug}`} 
      className="group block rounded-xl border border-gray-200 p-6 h-full flex flex-col justify-between shadow-sm hover:bg-gray-50 hover:shadow-lg hover:border-gray-300 transition-all duration-300 ease-out transform hover:-translate-y-1"
    >
      <div>
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3 leading-tight">
          {question}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-200">
          {short_answer}
        </p>
      </div>
      
      {(category || raw_category) && (
        <div className="inline-flex px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium mt-auto group-hover:bg-blue-100 group-hover:text-blue-800 transition-all duration-200 ease-out transform group-hover:scale-105">
          {category || raw_category}
        </div>
      )}
    </Link>
  )
}
