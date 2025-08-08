# Structured Data & Entity Linking Implementation

This document describes the comprehensive structured data and entity linking system implemented for Deeper Global to maximize semantic clarity for Google, AI search, and knowledge graph systems.

## Overview

The implementation transforms Deeper Global into the most richly annotated mental health knowledge base online, with schema so complete that it dominates AI overviews and People Also Ask panels.

## Architecture

### Core Components

1. **Schema Library** (`/lib/schema.ts`)
   - Centralized schema generation functions
   - Mental health entity mapping
   - Organization and website schemas
   - Entity linking utilities

2. **Enhanced JSON-LD Components**
   - `QuestionJsonLd` - Q&A and FAQ page schemas
   - `ClusterJsonLd` - Category/collection page schemas
   - `HomepageJsonLd` - Organization and website schemas
   - `EntityLinkedContent` - HTML content with entity links

3. **Entity Mapping System**
   - 40+ mental health entities mapped to authoritative sources
   - Wikipedia, NIH, and other authoritative URLs
   - Automatic entity extraction from content

## Mental Health Entity Mapping

### Core Conditions
- **Anxiety disorders** → Wikipedia: Anxiety disorder
- **Depression** → Wikipedia: Major depressive disorder
- **PTSD** → Wikipedia: Post-traumatic stress disorder
- **OCD** → Wikipedia: Obsessive-compulsive disorder
- **Bipolar disorder** → Wikipedia: Bipolar disorder
- **ADHD** → Wikipedia: Attention deficit hyperactivity disorder
- **Autism** → Wikipedia: Autism spectrum disorder
- **Eating disorders** → Wikipedia: Eating disorder
- **Substance abuse** → Wikipedia: Substance use disorder
- **Schizophrenia** → Wikipedia: Schizophrenia

### Therapies & Treatments
- **Therapy** → Wikipedia: Psychotherapy
- **CBT** → Wikipedia: Cognitive behavioral therapy
- **DBT** → Wikipedia: Dialectical behavior therapy
- **Medication** → Wikipedia: Psychiatric medication
- **Mindfulness** → Wikipedia: Mindfulness
- **Meditation** → Wikipedia: Meditation

### Mental Health Concepts
- **Self-care** → Wikipedia: Self-care
- **Mental health** → Wikipedia: Mental health
- **Wellness** → Wikipedia: Wellness
- **Resilience** → Wikipedia: Psychological resilience
- **Stress** → Wikipedia: Psychological stress
- **Burnout** → Wikipedia: Occupational burnout

### Relationships & Social
- **Relationships** → Wikipedia: Interpersonal relationship
- **Communication** → Wikipedia: Communication
- **Boundaries** → Wikipedia: Personal boundaries
- **Attachment** → Wikipedia: Attachment theory

### Life Stages & Transitions
- **Adolescence** → Wikipedia: Adolescence
- **Adulthood** → Wikipedia: Adult
- **Aging** → Wikipedia: Ageing
- **Grief** → Wikipedia: Grief
- **Trauma** → Wikipedia: Psychological trauma

## Schema Implementation

### Q&A Pages (`/answers/[slug]`)

**Schema Types:**
- `FAQPage` (when related questions present)
- `QAPage` (single question/answer)

**Key Features:**
- Full question/answer pairs with `acceptedAnswer`
- Entity linking via `about` arrays
- Author attribution to Deeper Global organization
- Breadcrumb navigation
- Related questions as additional FAQ items
- Proper `@id` and canonical URLs

**Example Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://deeper.global/answers/what-is-anxiety",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Anxiety is a natural response...",
        "author": {
          "@type": "Organization",
          "name": "Deeper Global"
        }
      },
      "about": [
        {
          "@type": "MedicalCondition",
          "name": "Anxiety disorder",
          "url": "https://en.wikipedia.org/wiki/Anxiety_disorder"
        }
      ]
    }
  ]
}
```

### Category Pages (`/categories/[category]`, `/clusters/[slug]`)

**Schema Type:** `CollectionPage`

**Key Features:**
- `ItemList` with all questions in category
- Category-specific entity mapping
- Breadcrumb navigation
- Proper pagination support

**Example Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Anxiety Questions",
  "about": [
    {
      "@type": "MedicalCondition",
      "name": "Anxiety disorder",
      "url": "https://en.wikipedia.org/wiki/Anxiety_disorder"
    }
  ],
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": 50,
    "itemListElement": [...]
  }
}
```

### Homepage (`/`)

**Schema Types:** `Organization` + `WebSite` + `WebPage`

**Key Features:**
- Complete organization profile
- `knowsAbout` array with all mental health entities
- `potentialAction` for site search
- Social media links via `sameAs`
- Website structure with proper `@id` references

**Example Schema:**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Deeper Global",
      "knowsAbout": [
        "https://en.wikipedia.org/wiki/Anxiety_disorder",
        "https://en.wikipedia.org/wiki/Major_depressive_disorder"
      ],
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "urlTemplate": "https://deeper.global/answers?q={search_term_string}"
        }
      }
    },
    {
      "@type": "WebSite",
      "name": "Deeper Global",
      "publisher": {...}
    }
  ]
}
```

## Entity Linking in HTML

### Automatic Entity Detection
- Scans content for mental health terms
- Links first occurrence to authoritative source
- Maintains consistent anchor text across site
- Opens links in new tab with proper rel attributes

### Implementation
```tsx
<EntityLinkedContent 
  content={question.answer}
  className="prose prose-gray max-w-none"
/>
```

### Example Output
```html
<p>
  <a href="https://en.wikipedia.org/wiki/Anxiety_disorder" target="_blank" rel="noopener noreferrer">Anxiety disorder</a> 
  and <a href="https://en.wikipedia.org/wiki/Major_depressive_disorder" target="_blank" rel="noopener noreferrer">major depressive disorder</a> 
  can be treated with <a href="https://en.wikipedia.org/wiki/Psychotherapy" target="_blank" rel="noopener noreferrer">psychotherapy</a> 
  and <a href="https://en.wikipedia.org/wiki/Psychiatric_medication" target="_blank" rel="noopener noreferrer">psychiatric medication</a>.
</p>
```

## Performance & SEO Benefits

### Rich Snippets Eligibility
- **FAQ Rich Snippets** - All Q&A pages eligible
- **People Also Ask** - Related questions boost eligibility
- **Knowledge Graph** - Entity linking improves inclusion
- **Featured Snippets** - Structured answers increase chances

### AI Search Optimization
- **Semantic Clarity** - Rich entity relationships
- **Topical Authority** - Comprehensive mental health coverage
- **Contextual Understanding** - Proper schema hierarchy
- **Source Attribution** - Clear organization identity

### Technical Benefits
- **Zero CLS Impact** - Server-side rendered schema
- **Minimal Bundle Size** - Efficient schema generation
- **Fast Loading** - No client-side schema injection
- **SEO Crawlability** - All schema in initial HTML

## Validation & Testing

### Schema Validation
```bash
node scripts/validate-schema.mjs
```

**Tests:**
- Schema structure validation
- Entity linking functionality
- Organization schema integrity
- Entity mapping completeness

### Google Rich Results Test
- Validate FAQPage schema
- Check QAPage structure
- Verify organization markup
- Test entity relationships

### Schema.org Validator
- JSON-LD syntax validation
- Schema type verification
- Required field checking
- Relationship validation

## Implementation Checklist

### ✅ Completed
- [x] Comprehensive entity mapping (40+ entities)
- [x] Enhanced Q&A page schemas (FAQPage/QAPage)
- [x] Category page schemas (CollectionPage)
- [x] Homepage schemas (Organization/WebSite)
- [x] Entity linking in HTML content
- [x] Breadcrumb navigation schemas
- [x] Author attribution to Deeper Global
- [x] Related questions integration
- [x] Schema validation script
- [x] Performance optimization

### 🔄 Ongoing
- [ ] Monitor rich snippet performance
- [ ] Track knowledge graph inclusion
- [ ] Analyze AI search visibility
- [ ] Optimize entity coverage

## Expected Outcomes

### Search Engine Impact
- **Rich Snippets** - FAQ and Q&A rich results
- **Knowledge Graph** - Entity inclusion and relationships
- **People Also Ask** - Related questions in SERPs
- **Featured Snippets** - Structured answer prominence

### AI Search Benefits
- **Semantic Understanding** - Clear mental health expertise
- **Entity Recognition** - Proper condition/treatment mapping
- **Source Authority** - Recognized mental health knowledge base
- **Contextual Relevance** - Topic-specific answer matching

### User Experience
- **Trust Signals** - Authoritative source links
- **Information Depth** - Rich entity relationships
- **Navigation Clarity** - Structured breadcrumbs
- **Content Discovery** - Related questions and topics

## Monitoring & Analytics

### Key Metrics
- Rich snippet impressions and CTR
- Knowledge graph inclusion rate
- Entity link click-through rates
- Search console structured data reports

### Tools
- Google Search Console
- Google Rich Results Test
- Schema.org Validator
- Custom validation scripts

## Future Enhancements

### Potential Additions
- **Medical Entity Schema** - Enhanced condition/treatment markup
- **Review Schema** - User feedback and ratings
- **Event Schema** - Mental health awareness events
- **Article Schema** - Blog post and resource markup
- **Video Schema** - Multimedia content markup

### AI Search Optimization
- **Conversational Schema** - Q&A flow optimization
- **Intent Mapping** - Search intent classification
- **Contextual Entities** - Dynamic entity relationships
- **Personalization** - User-specific entity relevance

## Conclusion

This structured data implementation positions Deeper Global as the most semantically rich mental health knowledge base online. The comprehensive entity mapping, enhanced schemas, and automatic linking create a foundation for:

- **Rich snippet dominance** in mental health searches
- **Knowledge graph inclusion** with proper entity relationships
- **AI search optimization** for conversational queries
- **Topical authority** across mental health topics

The implementation maintains performance standards while maximizing semantic clarity for search engines and AI systems.
