import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const URL_BLOCK = /(https?:\/\/|www\.)/i;

function assertNoExternalLinks(field: string, value: string) {
  if (URL_BLOCK.test(value || '')) {
    throw new Error(`External links are not allowed in ${field}.`);
  }
}

serve(async (req) => {
  try {
    const body = await req.json()
    
    // Validate required fields
    if (!body.question) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        { 
          headers: { "Content-Type": "application/json" },
          status: 400
        }
      )
    }
    
    if (!body.short_answer) {
      return new Response(
        JSON.stringify({ error: 'Short answer is required' }),
        { 
          headers: { "Content-Type": "application/json" },
          status: 400
        }
      )
    }
    
    // Check for external links in content
    assertNoExternalLinks('question', body.question)
    assertNoExternalLinks('short_answer', body.short_answer)
    
    if (body.answer) {
      assertNoExternalLinks('answer', body.answer)
    }
    
    // If we get here, content is clean
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Content validated successfully - no external links found',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Content validation failed',
        message: error.message
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 400
      }
    )
  }
})
