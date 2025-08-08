import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { invalidateAllQuestions, invalidateCluster, invalidateQuestion } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tag, secret } = body

    // Check secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag is required' },
        { status: 400 }
      )
    }

    console.log(`🔄 Revalidating tag: ${tag}`)

    // Handle different tag patterns
    if (tag === 'questions') {
      await invalidateAllQuestions()
    } else if (tag.startsWith('cluster:')) {
      const clusterSlug = tag.replace('cluster:', '')
      await invalidateCluster(clusterSlug)
    } else if (tag.startsWith('question:')) {
      const questionSlug = tag.replace('question:', '')
      await invalidateQuestion(questionSlug)
    } else {
      // Generic tag revalidation
      revalidateTag(tag)
    }

    console.log(`✅ Successfully revalidated tag: ${tag}`)

    return NextResponse.json(
      { 
        success: true, 
        message: `Revalidated tag: ${tag}`,
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
