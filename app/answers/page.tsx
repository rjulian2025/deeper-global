import QuestionCard from '@/components/QuestionCard'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import ClientOnly from '@/components/ClientOnly'
import { buildAnswersMetadata } from '@/lib/seo'
import AnswersListJsonLd from '@/components/AnswersListJsonLd'
import { getQuestionsWithFilters, getCategories, Question } from '@/lib/db.server'
import { Suspense } from 'react'
import AdditionalLinks from '@/components/AdditionalLinks'
import Breadcrumbs from '@/app/(ui)/Breadcrumbs'
import BackToTop from '@/app/(ui)/BackToTop'

export const revalidate = 3600 // Revalidate every hour
export const metadata = buildAnswersMetadata()

interface Props {
  searchParams: Promise<{ page?: string; q?: string; category?: string; pageSize?: string }>
}

export default async function AnswersPage({ searchParams }: Props) {
  const { page, q, category, pageSize } = await searchParams
  const currentPage = page ? parseInt(page, 10) : 1
  const pageSizeNum = pageSize ? parseInt(pageSize, 10) : 24
  
  const { rows: questions, total } = await getQuestionsWithFilters({ 
    q: q || "", 
    category: category || "", 
    page: currentPage, 
    pageSize: pageSizeNum 
  })
  const categories = await getCategories()
  
  const totalPages = Math.max(1, Math.ceil(total / pageSizeNum))
  const hasFilters = q || category
  const hasResults = questions.length > 0

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Answers' }
  ]

  return (
    <>
      <AnswersListJsonLd questions={questions} />
      <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
              Ask Anything.<br />
              <span className="text-blue-600">Deeper Listens.</span>
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              1,000+ evidence-informed answers for humans and machines.
            </p>
          </div>

          {/* Filters */}
          <form method="get" className="mb-8 flex flex-wrap items-center gap-3 text-sm">
            <div className="relative flex-1 max-w-xs">
              <input
                type="search"
                name="q"
                defaultValue={q || ""}
                placeholder="Search answers…"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    const form = document.querySelector('form');
                    const input = form?.querySelector('input[name="q"]') as HTMLInputElement;
                    if (input) {
                      input.value = '';
                      form?.submit();
                    }
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <select
              name="category"
              defaultValue={category || ""}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button 
              type="submit"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Apply
            </button>
            {hasFilters && (
              <a
                href="/answers"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm"
              >
                Clear filters
              </a>
            )}
          </form>

          {/* Results Summary */}
          {hasFilters && (
            <div className="mb-6 text-sm text-gray-600">
              {hasResults ? (
                <p>Found {total} result{total !== 1 ? 's' : ''} for your search</p>
              ) : (
                <p>No results found for your search</p>
              )}
            </div>
          )}

          {/* Questions Grid or Empty State */}
          {hasResults ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.map((q) => (
                <QuestionCard key={q.slug} {...q} />
              ))}
            </div>
          ) : hasFilters ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or browse all categories to find what you're looking for.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.slice(0, 6).map((cat) => (
                    <a
                      key={cat}
                      href={`/answers?category=${encodeURIComponent(cat)}`}
                      className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-blue-100 hover:text-blue-800 transition-all duration-200"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.map((q) => (
                <QuestionCard key={q.slug} {...q} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {hasResults && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <a
                href={`?${new URLSearchParams({ q: q || "", category: category || "", page: String(Math.max(1, currentPage - 1)) })}`}
                className={`rounded-md border px-4 py-2 text-sm transition-all duration-200 ${
                  currentPage === 1 
                    ? "border-gray-200 text-gray-400 cursor-not-allowed" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
                aria-disabled={currentPage === 1}
              >
                ← Previous
              </a>
              <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
              <a
                href={`?${new URLSearchParams({ q: q || "", category: category || "", page: String(Math.min(totalPages, currentPage + 1)) })}`}
                className={`rounded-md border px-4 py-2 text-sm transition-all duration-200 ${
                  currentPage >= totalPages 
                    ? "border-gray-200 text-gray-400 cursor-not-allowed" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
                aria-disabled={currentPage >= totalPages}
              >
                Next →
              </a>
            </div>
          )}

          {/* Additional Links */}
          {hasResults && (
            <AdditionalLinks 
              excludeSlugs={questions.map(q => q.slug)} 
              className="mt-16"
            />
          )}

          {/* Back to top */}
          <BackToTop />
        </div>
      </div>
      <ClientOnly>
        <GoogleAnalytics />
      </ClientOnly>
    </>
  )
}
