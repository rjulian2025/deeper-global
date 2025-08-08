# External Link Blocking System

This document describes the comprehensive external link blocking system implemented for Deeper Global to ensure no external links are rendered in answer pages.

## 🎯 Objectives

- **Never render external links** inside answer pages
- **Reject any new content** containing external URLs at ingest time
- **Clean existing rows** in questions_master to remove links
- **Allow links to deeper.global only** (optional—default: strip all)

## 📁 Implementation Files

### 1. Sanitizer Utility
**File:** `lib/sanitizeNoExternalLinks.ts`

Core sanitization functions:
- `stripExternalLinks(html, allowDeeperOnly = false)` - Removes all external links
- `containsExternalUrl(s)` - Detects if string contains external URLs

**Features:**
- Strips markdown links `[text](url)` → `text`
- Strips HTML anchors `<a href="...">text</a>` → `text`
- Removes bare URLs `https://example.com` → ``
- Optional `allowDeeperOnly` parameter for future use

### 2. Rehype Plugin
**File:** `lib/rehypeNoExternalLinks.ts`

MDX/Markdown processing plugin that neuters anchor tags at render time:
- Converts `<a>` tags to `<span>` tags
- Removes href, target, and rel attributes
- Preserves link text content

### 3. Answer Renderer
**File:** `components/AnswerRenderer.tsx`

Component that applies sanitization to answer content:
- Uses `stripExternalLinks()` to clean content
- Renders sanitized HTML safely

### 4. Updated EntityLinkedContent
**File:** `components/EntityLinkedContent.tsx`

Modified to apply sanitization after entity linking:
1. Generate entity links (Wikipedia links)
2. Rewrite to internal routes where possible
3. **Strip any remaining external links**

### 5. MDX Components Safety
**File:** `components/mdxComponents.tsx`

Ensures anchor tags are never rendered as links:
```tsx
export const mdxComponents = {
  a: (props: any) => <span>{props.children}</span> // never render as link
};
```

## 🔒 Content Validation

### API Route
**File:** `app/api/ingest/route.ts`

Validates new content at ingest time:
- Checks `question`, `short_answer`, and `answer` fields
- Throws error if external URLs detected
- Returns validation success/failure

**Usage:**
```bash
curl -X POST /api/ingest \
  -H "Content-Type: application/json" \
  -d '{"question": "What is anxiety?", "short_answer": "Anxiety is...", "answer": "Detailed answer..."}'
```

### Supabase Edge Function
**File:** `supabase/functions/validate-content/index.ts`

Serverless validation function for Supabase:
- Same validation logic as API route
- Can be called from database triggers
- Returns structured error responses

## 🧹 Database Cleanup

### SQL Script
**File:** `scripts/cleanup-external-links.sql`

One-time cleanup script to remove existing external links:

1. **Backup** existing data
2. **Strip markdown links** from all fields
3. **Strip HTML anchors** from all fields  
4. **Remove bare URLs** from all fields
5. **Verify cleanup** with count query

**Run in Supabase SQL Editor:**
```sql
-- Execute the cleanup script
\i scripts/cleanup-external-links.sql
```

## 🧪 Testing

### Test Script
**File:** `scripts/test-sanitizer-simple.mjs`

Comprehensive test suite for sanitizer functions:
- Tests markdown link removal
- Tests HTML anchor removal
- Tests bare URL removal
- Tests URL detection
- Tests edge cases (empty strings, null values)

**Run tests:**
```bash
node scripts/test-sanitizer-simple.mjs
```

## 🔧 Integration Points

### 1. Content Rendering
All answer content flows through `EntityLinkedContent` which now applies sanitization as the final step.

### 2. Content Ingestion
New content should be validated through the API route or Edge Function before insertion.

### 3. MDX Processing
If using MDX, add `rehypeNoExternalLinks` to your rehype plugins array.

### 4. Database Triggers
Consider adding database triggers to validate content on insert/update.

## 🚀 Deployment Checklist

1. **Install dependencies:**
   ```bash
   npm install unist-util-visit
   ```

2. **Deploy Edge Function:**
   ```bash
   supabase functions deploy validate-content
   ```

3. **Run database cleanup:**
   - Execute `scripts/cleanup-external-links.sql` in Supabase SQL Editor
   - Verify no external links remain

4. **Test validation:**
   ```bash
   # Test API route
   curl -X POST /api/ingest -H "Content-Type: application/json" \
     -d '{"question": "Test", "short_answer": "Test answer", "answer": "https://example.com"}'
   
   # Should return 400 error
   ```

5. **Run sanitizer tests:**
   ```bash
   node scripts/test-sanitizer-simple.mjs
   ```

## 🔍 Monitoring

### Check for External Links
```sql
-- Query to find any remaining external links
SELECT COUNT(*) AS remaining_with_urls
FROM questions_master
WHERE answer ~ '(https?://|www\.)' 
   OR short_answer ~ '(https?://|www\.)'
   OR question ~ '(https?://|www\.)';
```

### Monitor Validation Failures
Check API route logs and Edge Function logs for validation failures.

## 🔮 Future Enhancements

### Allow Deeper.global Links Only
To enable `allowDeeperOnly = true`:

1. Modify `stripExternalLinks()` to preserve deeper.global links
2. Update validation to allow deeper.global URLs
3. Update database cleanup to preserve deeper.global links

### Enhanced URL Detection
- Add support for more URL patterns
- Add domain whitelist/blacklist
- Add URL validation (not just detection)

### Content Preview
- Add preview mode showing what content will look like after sanitization
- Add diff view showing what was removed

## 🛡️ Security Considerations

- **XSS Protection:** Sanitization prevents malicious script injection
- **Data Integrity:** Validation ensures clean content in database
- **User Trust:** No unexpected external links in content
- **SEO Benefits:** No outbound links affecting page authority

## 📞 Support

For issues with the external link blocking system:
1. Check test results: `node scripts/test-sanitizer-simple.mjs`
2. Verify database cleanup: Run verification queries
3. Check API validation: Test with sample content
4. Review logs: Check for validation failures
