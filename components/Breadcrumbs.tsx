import Link from 'next/link'
import Script from 'next/script'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://deeper.global${item.href}` })
    }))
  }

  return (
    <>
      <Script
        id="breadcrumbs-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center space-x-4 text-sm text-gray-700 ${className}`}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <span className="text-gray-400 mx-2">/</span>
            )}
            {item.href ? (
              <Link 
                href={item.href}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}
