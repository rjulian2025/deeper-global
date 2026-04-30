# Deeper Global v1 Platform Architecture

Deeper Global should be treated as a trust-and-intelligence platform, not a direct port of the prototype.

## Product Thesis

Deeper Global is the public, consumer-facing knowledge layer for mental health questions. The first product job is to become a trusted resource for people asking sensitive questions before they seek care. The second product job is to turn those questions, topics, and language patterns into ethical intelligence for referrals, therapist websites, and future ecosystem products.

## Layer Model

1. Public knowledge layer
   - Astro site at `deeper.global`
   - Answer pages, topic hubs, protocol/about/privacy pages
   - Static generation from Supabase when credentials are present
   - Schema.org QAPage markup on answer pages
   - `llms.txt` machine-readable content index for AI systems
   - Entity profile pages that separate canonical topics from raw Q&A URLs

2. Content intelligence layer
   - Supabase/Postgres remains the source of record for the v1 corpus
   - Current seed table: `questions_master`
   - The frontend reads from Supabase at build time and generates a fast public site
   - Categories are promoted into v1 entity profiles until a richer entity table exists

3. Editorial governance layer
   - Needs explicit review, source, risk, and status fields as the corpus matures
   - AI can draft and structure content, but publication should retain editorial accountability

4. Commercial layer
   - Deferred until trust and audience are established
   - Future options: therapist referrals, sponsored provider profiles, aggregator partnerships, B2B insights, and Deeper Websites intelligence
   - Must remain privacy-first because mental health intent is sensitive

## Current Supabase Contract

The prototype expects `questions_master` with:

- `id`
- `question`
- `short_answer`
- `answer`
- `triage`
- `category`
- `raw_category`
- `slug`
- `created_at`
- `updated_at`

This is enough for v1 publishing, but not enough for long-term trust operations.

## Recommended Next Schema Additions

Add these fields or related tables before scaling the corpus:

- `review_status`: draft, generated, editorial_reviewed, clinician_reviewed, published, archived
- `risk_level`: low, medium, crisis_sensitive, clinical_sensitive
- `source_count`
- `sources`: separate table with title, url, publisher, date_accessed
- `reviewed_by`
- `reviewed_at`
- `canonical_topic_id`
- `entity_id`
- `entity_aliases`
- `entity_relationships`: broader_than, narrower_than, related_to
- `search_intent`: informational, crisis, therapy_seeking, diagnosis, medication, relationship, workplace, youth, parent
- `commercial_sensitivity`: none, referral_possible, referral_restricted

## AI Citability Requirements

AI citability is not the same as traditional SEO. V1 supports it through:

- `/llms.txt` as a machine-readable content map
- visible citation panels on answer pages
- `data-ai-*` attributes on primary answer and entity markup
- QAPage, Question, Answer, and DefinedTerm JSON-LD
- entity pages at `/entities/[entity]`
- stable canonical answer URLs
- plain-language short answers plus extractable accepted answer sections

Future versions should add source-level citations, reviewer attribution, and per-claim evidence metadata.

## Build Strategy

V1 uses Astro static generation:

- Fast public pages
- Minimal JavaScript
- Strong SEO and crawler behavior
- Simple Vercel deployment

If content changes frequently, add scheduled Vercel rebuilds or move selected routes to SSR later.

## Environment Variables

The app supports these server-side environment variable names:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

It also tolerates legacy prototype names:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Prefer the non-public names for build-time server usage.
