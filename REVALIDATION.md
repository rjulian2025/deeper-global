# Cache Revalidation Setup

This document explains how to set up automatic cache revalidation when data changes in Supabase.

## Environment Variables

Add these to your `.env.local`:

```bash
REVALIDATE_SECRET=your-super-secret-key-here
NEXT_PUBLIC_SITE_URL=https://deeper.global
```

## API Endpoint

The revalidation endpoint is available at:
```
POST /api/revalidate
```

### Request Body
```json
{
  "tag": "questions",
  "secret": "your-super-secret-key-here"
}
```

### Response
```json
{
  "success": true,
  "message": "Revalidated tag: questions",
  "timestamp": "2025-08-08T03:30:00.000Z"
}
```

## Supabase Webhook Configuration

### 1. Database Webhook Setup

1. Go to your Supabase dashboard
2. Navigate to Database → Webhooks
3. Click "Create a new webhook"
4. Configure as follows:

**General Settings:**
- Name: `Cache Revalidation`
- Table: `questions_master`
- Events: `INSERT`, `UPDATE`, `DELETE`
- HTTP Method: `POST`
- URL: `https://deeper.global/api/revalidate`

**Headers:**
```
Content-Type: application/json
```

**Body Template:**
```json
{
  "tag": "questions",
  "secret": "your-super-secret-key-here"
}
```

### 2. Edge Function Alternative (Recommended)

For better security and flexibility, create a Supabase Edge Function:

1. Create a new Edge Function in your Supabase project
2. Name it `revalidate-cache`
3. Use this code:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const REVALIDATE_SECRET = Deno.env.get('REVALIDATE_SECRET')
const SITE_URL = Deno.env.get('SITE_URL') || 'https://deeper.global'

serve(async (req) => {
  try {
    const { tag } = await req.json()
    
    const response = await fetch(`${SITE_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tag: tag || 'questions',
        secret: REVALIDATE_SECRET,
      }),
    })

    const result = await response.json()
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { "Content-Type": "application/json" },
        status: response.status
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})
```

4. Deploy the function
5. Set up the database webhook to call the Edge Function instead

### 3. Testing the Webhook

Test the revalidation manually:

```bash
curl -X POST https://deeper.global/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"tag": "questions", "secret": "your-super-secret-key-here"}'
```

## Cache Tags

The following cache tags are used:

- `questions` - Invalidates all question-related caches
- `cluster:{slug}` - Invalidates specific cluster caches
- `question:{slug}` - Invalidates specific question caches

## Manual Cache Invalidation

You can also manually invalidate caches using the utility functions:

```typescript
import { invalidateAllQuestions, invalidateCluster, invalidateQuestion } from '@/lib/supabase'

// Invalidate all questions
await invalidateAllQuestions()

// Invalidate specific cluster
await invalidateCluster('depression')

// Invalidate specific question
await invalidateQuestion('how-to-help-depression')
```

## Security Notes

- Keep your `REVALIDATE_SECRET` secure and unique
- Use HTTPS for all webhook URLs
- Consider rate limiting if needed
- Monitor webhook logs for any issues

