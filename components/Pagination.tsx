import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  className?: string
}

export default function Pagination({ currentPage, totalPages, baseUrl, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl
    return `${baseUrl}?page=${page}`
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Previous
        </Link>
      )}

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
          ) : (
            <Link
              href={getPageUrl(page as number)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </Link>
          )}
        </div>
      ))}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Next
        </Link>
      )}
    </nav>
  )
}
