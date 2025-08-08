import { NextRequest } from 'next/server'
import { getCategoriesWithCounts } from '@/lib/db.server'

export const revalidate = 3600 // Revalidate every hour

export async function GET(request: NextRequest) {
  const baseUrl = 'https://deeper.global'
  const categories = await getCategoriesWithCounts()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories.map(category => `  <url>
    <loc>${baseUrl}/categories/${encodeURIComponent(category.category)}</loc>
    <lastmod>${category.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
