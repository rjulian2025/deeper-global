# SEO Link Graph & Sitemap System

This document describes the comprehensive internal linking and sitemap system implemented for Deeper 2 to maximize crawl depth, speed, and topical authority.

## Overview

The system implements a production-ready crawl & linking package that enhances SEO without changing the page look/feel. It includes:

- **Breadcrumbs** with JSON-LD structured data
- **Related Questions** (People Also Ask) with FAQPage JSON-LD
- **Prev/Next Navigation** within categories
- **Paginated Hubs** with proper rel prev/next tags
- **Split Sitemaps** with lastmod dates
- **Internal Link Density** on hub pages
- **Smart Revalidation** with cache tags

## Components

### 1. Breadcrumbs Component

**File:** `components/Breadcrumbs.tsx`

Renders semantic HTML navigation with Schema.org BreadcrumbList JSON-LD.

**Usage:**
```tsx
<Breadcrumbs 
  items={[
    { label: 'Home', href: '/' },
    { label: 'Answers', href: '/answers' },
    { label: 'Category', href: '/categories/category' },
    { label: 'Question Title' }
  ]} 
/>
```

**Features:**
- Semantic HTML with `aria-label="Breadcrumb"`
- JSON-LD structured data for search engines
- Responsive design with existing typography classes
- Automatic URL generation for structured data

### 2. Related Questions Component

**File:** `components/RelatedQuestions.tsx`

Displays related questions from the same category with FAQPage JSON-LD.

**Usage:**
```tsx
<RelatedQuestions currentSlug="question-slug" />
```

**Features:**
- Fetches 3-5 related questions by same category
- Excludes current question from results
- Renders FAQPage JSON-LD structured data
- Uses existing card styling for consistency

### 3. Prev/Next Navigation Component

**File:** `components/PrevNextNavigation.tsx`

Shows previous and next questions within the same category.

**Usage:**
```tsx
<PrevNextNavigation currentSlug="question-slug" />
```

**Features:**
- Wraps to first/last when at edges
- Orders by slug for consistent navigation
- Minimal styling with text links
- Hover animations for better UX

### 4. Pagination Component

**File:** `components/Pagination.tsx`

Server-side pagination for hub pages with proper rel prev/next metadata.

**Usage:**
```tsx
<Pagination 
  currentPage={2} 
  totalPages={10} 
  baseUrl="/answers" 
/>
```

**Features:**
- Smart page number display with ellipsis
- Proper URL generation (no ?page=1 for first page)
- Accessible navigation with ARIA labels
- Responsive design

### 5. Additional Links Component

**File:** `components/AdditionalLinks.tsx`

Shows more links in the same category/cluster after the main grid.

**Usage:**
```tsx
<AdditionalLinks 
  category="anxiety"
  excludeSlugs={['slug1', 'slug2']} 
/>
```

**Features:**
- Excludes already visible items
- Shows 8 additional links by default
- Category-specific when provided
- Text list format for density

## Database Functions

### New Helper Functions

**File:** `lib/db.server.ts`

All functions use `unstable_cache` with appropriate tags and 1-hour revalidation.

#### `getRelatedQuestions(slug, limit = 5)`
- Fetches related questions by same category
- Excludes current question
- Ordered by `updated_at` descending

#### `getPrevNextInCategory(slug)`
- Returns `{ prev, next }` questions in same category
- Orders by slug for consistent navigation
- Wraps to first/last when at edges

#### `getAnswersPage(page, pageSize = 24)`
- Paginated questions for answers hub
- Returns `{ questions, totalCount, totalPages }`
- Ordered by `updated_at` descending

#### `getClusterPage(category, page, pageSize = 24)`
- Paginated questions for cluster pages
- Returns `{ questions, totalCount, totalPages }`
- Filtered by category

#### `getCategoriesWithCounts()`
- Returns categories with question counts and latest update
- Used for sitemap generation
- Sorted by count descending

#### `getAllQuestionsForSitemap()`
- Returns all questions with timestamps
- Used for sitemap generation
- Includes `updated_at` and `created_at`

#### `getAdditionalHubLinks(category?, excludeSlugs[], limit = 8)`
- Additional links for hub pages
- Category-specific when provided
- Excludes specified slugs

## Sitemap System

### Sitemap Index

**Route:** `/sitemap.xml`

References all child sitemaps:
- `/sitemaps/base.xml` - Static pages
- `/sitemaps/categories.xml` - Category hubs
- `/sitemaps/clusters.xml` - Cluster hubs  
- `/sitemaps/answers-1.xml`, `/sitemaps/answers-2.xml`, etc. - Answer chunks

### Base Sitemap

**Route:** `/sitemaps/base/route.ts`

Contains static pages:
- Homepage (`/`)
- Answers hub (`/answers`)
- About page (`/about`)
- Protocol page (`/protocol`)

### Categories Sitemap

**Route:** `/sitemaps/categories/route.ts`

Contains all category hub pages with:
- URL: `/categories/{category}`
- `lastmod` from latest question update
- `changefreq: weekly`
- `priority: 0.8`

### Clusters Sitemap

**Route:** `/sitemaps/clusters/route.ts`

Contains all cluster hub pages with:
- URL: `/clusters/{category}`
- `lastmod` from latest question update
- `changefreq: weekly`
- `priority: 0.8`

### Answers Sitemaps

**Route:** `/sitemaps/answers-[chunk]/route.ts`

Dynamic route that splits answers into chunks of 500 URLs:
- URL: `/answers/{slug}`
- `lastmod` from question `updated_at`
- `changefreq: monthly`
- `priority: 0.7`

## Page Updates

### Individual Answer Pages

**File:** `app/answers/[slug]/page.tsx`

Added:
- Breadcrumbs with proper hierarchy
- Related Questions section
- Prev/Next navigation
- All existing functionality preserved

### Answers Hub Page

**File:** `app/answers/page.tsx`

Added:
- Breadcrumbs
- Server-side pagination (24 cards/page)
- Pagination component
- Additional links section
- Query param support (`?page=N`)

### Cluster Pages

**File:** `app/clusters/[slug]/page.tsx`

Added:
- Breadcrumbs
- Server-side pagination (24 cards/page)
- Pagination component
- Additional links section
- Query param support (`?page=N`)

## Revalidation System

### Updated API

**File:** `app/api/revalidate/route.ts`

New request format:
```json
{
  "type": "question" | "category" | "cluster",
  "slug": "optional-slug",
  "secret": "REVALIDATE_SECRET"
}
```

### Cache Tags

All new functions use appropriate cache tags:
- `questions` - All questions
- `category:{name}` - Specific category
- `cluster:{slug}` - Specific cluster

## Testing

### Smoke Test Script

**File:** `scripts/link_graph_smoke.mjs`

Run with:
```bash
node scripts/link_graph_smoke.mjs
```

Tests:
- Breadcrumbs present on detail pages
- Related questions present (≥3 links)
- Prev/Next navigation present
- Hub pagination working
- Sitemaps accessible and valid

## Verification Checklist

### Post-Implementation

1. **Visit `/answers/[slug]`** → see Breadcrumbs, Related Questions (3–5), Prev/Next links
2. **Visit `/answers?page=2` and `/clusters/anxiety?page=2`** → server pagination works; head contains rel prev/next
3. **Fetch `/sitemap.xml`** → references all child sitemaps; child sitemaps contain expected URLs with lastmod
4. **Run `node scripts/link_graph_smoke.mjs`** → all asserts pass
5. **Run `npm run build && npm run analyze`** → no bundle regressions, no deopt warnings

## Expected Outcomes

- **Deeper internal linking** through breadcrumbs, related questions, and prev/next navigation
- **Better crawl paths** with structured navigation
- **Faster discovery/recrawl** thanks to lastmod dates and smaller sitemaps
- **Higher topical authority** from Related/Prev-Next/Breadcrumbs
- **No design changes** - all using existing typography and styling

## Performance Considerations

- All database queries cached with 1-hour revalidation
- Sitemaps cached with proper headers
- Pagination uses efficient database queries
- Related questions limited to 5 for performance
- Additional links limited to 8 for density

## Maintenance

### Adding New Pages

1. Update breadcrumb items in page component
2. Add to appropriate sitemap if needed
3. Update smoke test if adding new page types

### Updating Cache Tags

1. Add new tags to database functions
2. Update revalidation API to handle new types
3. Test cache invalidation

### Monitoring

- Check sitemap accessibility via smoke test
- Monitor crawl stats in Google Search Console
- Verify structured data with Google's Rich Results Test
