import Link from 'next/link'
import { getPrevNextInCategory, Question } from '@/lib/db.server'

interface PrevNextNavigationProps {
  currentSlug: string
  className?: string
}

export default async function PrevNextNavigation({ currentSlug, className = '' }: PrevNextNavigationProps) {
  const { prev, next } = await getPrevNextInCategory(currentSlug)
  
  if (!prev && !next) {
    return null
  }

  return (
    <nav className={`flex items-center justify-between pt-8 mt-8 border-t border-gray-200 ${className}`}>
      <div className="flex-1">
        {prev && (
          <Link
            href={`/answers/${prev.slug}`}
            className="group inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <svg 
              className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left">
              <div className="text-sm text-gray-500">Previous</div>
              <div className="font-medium leading-tight">{prev.question}</div>
            </div>
          </Link>
        )}
      </div>
      
      <div className="flex-1 text-right">
        {next && (
          <Link
            href={`/answers/${next.slug}`}
            className="group inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <div className="text-right">
              <div className="text-sm text-gray-500">Next</div>
              <div className="font-medium leading-tight">{next.question}</div>
            </div>
            <svg 
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  )
}
