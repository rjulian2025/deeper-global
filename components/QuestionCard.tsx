import Link from 'next/link'

interface QuestionCardProps {
  slug: string
  question: string
  short_answer: string
  category?: string
}

export default function QuestionCard({ slug, question, short_answer, category }: QuestionCardProps) {
  return (
    <Link href={`/questions/${slug}`} className="block p-4 bg-white border rounded hover:shadow transition-shadow">
      <h3 className="font-semibold text-blue-700 hover:underline">{question}</h3>
      <p className="text-sm text-gray-500 mt-1">{short_answer}</p>
      {category && (
        <div className="text-xs text-gray-400 mt-2">{category}</div>
      )}
    </Link>
  )
}
