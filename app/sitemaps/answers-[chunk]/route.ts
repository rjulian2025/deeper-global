import { NextRequest } from 'next/server'
import { getAllQuestionsForSitemap } from '@/lib/db.server'

export const revalidate = 3600 // Revalidate every hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chunk: string }> }
) {
  const resolvedParams = await params
  if (!resolvedParams?.chunk) {
    return new Response('Invalid chunk parameter', { status: 400 })
  }
  
  const { chunk } = resolvedParams
  const chunkNumber = parseInt(chunk, 10)
  
  if (isNaN(chunkNumber) || chunkNumber < 1) {
    return new Response('Invalid chunk number', { status: 400 })
  }

  const baseUrl = 'https://deeper.global'
  const questionsPerChunk = 500
  const allQuestions = await getAllQuestionsForSitemap()
  
  const startIndex = (chunkNumber - 1) * questionsPerChunk
  const endIndex = startIndex + questionsPerChunk
  const chunkQuestions = allQuestions.slice(startIndex, endIndex)
  
  if (chunkQuestions.length === 0) {
    return new Response('Chunk not found', { status: 404 })
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunkQuestions.map(question => `  <url>
    <loc>${baseUrl}/answers/${question.slug}</loc>
    <lastmod>${question.updated_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
