import Link from 'next/link'
import { getAdditionalHubLinks, Question } from '@/lib/db.server'

interface AdditionalLinksProps {
  category?: string
  excludeSlugs: string[]
  className?: string
}

export default async function AdditionalLinks({ category, excludeSlugs, className = '' }: AdditionalLinksProps) {
  const additionalLinks = await getAdditionalHubLinks(category, excludeSlugs, 8)
  
  if (!additionalLinks || additionalLinks.length === 0) {
    return null
  }

  const sectionTitle = category 
    ? `Explore more in ${category}`
    : 'Explore more questions'

  return (
    <section className={`mt-16 pt-8 border-t border-gray-200 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{sectionTitle}</h2>
      <div className="space-y-3">
        {additionalLinks.map((question) => (
          <Link
            key={question.slug}
            href={`/answers/${question.slug}`}
            className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
          >
            <div className="font-medium leading-tight">{question.question}</div>
            <div className="text-sm text-gray-600 mt-1">{question.short_answer}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
