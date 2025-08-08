import { NextRequest, NextResponse } from 'next/server'
import { containsExternalUrl } from '@/lib/sanitizeNoExternalLinks'

function assertNoExternalLinks(field: string, value: string) {
  if (containsExternalUrl(value)) {
    throw new Error(`External links are not allowed in ${field}. Remove URLs.`)
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    
    // Validate required fields
    if (!payload.question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }
    
    if (!payload.short_answer) {
      return NextResponse.json(
        { error: 'Short answer is required' },
        { status: 400 }
      )
    }
    
    // Check for external links in content
    assertNoExternalLinks('question', payload.question)
    assertNoExternalLinks('short_answer', payload.short_answer)
    
    if (payload.answer) {
      assertNoExternalLinks('answer', payload.answer)
    }
    
    // If we get here, content is clean - proceed with insert
    // Note: This is a validation endpoint - actual insert would be handled elsewhere
    // or you could add the insert logic here
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Content validated successfully - no external links found',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Content validation error:', error)
    return NextResponse.json(
      { 
        error: 'Content validation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    )
  }
}
