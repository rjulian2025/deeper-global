import { NextRequest } from 'next/server'
import { getAllQuestionsForSitemap } from '@/lib/db.server'

export const revalidate = 3600 // Revalidate every hour

export async function GET(request: NextRequest) {
  const baseUrl = 'https://deeper.global'
  const currentDate = new Date().toISOString()
  
  // Calculate number of answer chunks needed
  const allQuestions = await getAllQuestionsForSitemap()
  const questionsPerChunk = 500
  const answerChunks = Math.ceil(allQuestions.length / questionsPerChunk)

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemaps/base.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/categories.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/clusters.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
${Array.from({ length: answerChunks }, (_, i) => `  <sitemap>
    <loc>${baseUrl}/sitemaps/answers-${i + 1}.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new Response(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
