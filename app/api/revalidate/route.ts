import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { invalidateAllQuestions, invalidateCluster, invalidateQuestion } from '@/lib/db.server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, slug, secret } = body

    // Check secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      )
    }

    console.log(`🔄 Revalidating type: ${type}, slug: ${slug || 'all'}`)

    // Handle different revalidation types
    switch (type) {
      case 'question':
        if (slug) {
          revalidateTag(`question:${slug}`)
          console.log(`✅ Revalidated question: ${slug}`)
        } else {
          revalidateTag('questions')
          console.log(`✅ Revalidated all questions`)
        }
        break
      case 'category':
        if (slug) {
          revalidateTag(`category:${slug}`)
          console.log(`✅ Revalidated category: ${slug}`)
        } else {
          revalidateTag('questions')
          console.log(`✅ Revalidated all questions`)
        }
        break
      case 'cluster':
        if (slug) {
          revalidateTag(`cluster:${slug}`)
          console.log(`✅ Revalidated cluster: ${slug}`)
        } else {
          revalidateTag('questions')
          console.log(`✅ Revalidated all questions`)
        }
        break
      default:
        return NextResponse.json(
          { error: 'Invalid type. Must be question, category, or cluster' },
          { status: 400 }
        )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Revalidated ${type}${slug ? `: ${slug}` : ''}`,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Revalidation error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
