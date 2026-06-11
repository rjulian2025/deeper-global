

# CBO Repositioning: Hero, Services Section, Schema, and Nav Updates

## Overview

Shift the homepage identity from "Fractional CMO" to "Fractional Chief Branding Officer + Growth Architect" across the hero, a new services preview section, schema/SEO metadata, and navigation labels. The CMO-focused strategic answer pages remain untouched to preserve search traffic.

---

## 1. Hero Section (`src/components/Hero.tsx`)

**Eyebrow label:**
- FROM: "Fractional CMO & Growth Architect"
- TO: "Fractional Chief Branding Officer + Growth Architect"

**H1:** Keep "I make brands make sense -- then scale." (no change)

**Subhead copy** (replace both current paragraphs):
- Primary: "When positioning, story, and systems drift apart, growth stalls. I realign them so the business scales with clarity."
- Qualifier: "For founders who've outgrown guesswork."

**Proof line:** Keep as-is ("20+ years. $500M+ in launches...")

**CTA:** Keep "Apply for Strategic Review" (already matches the brief). Keep secondary "View Case Work" link.

**Alt text** on hero image: Update to "Rick Julian -- Fractional Chief Branding Officer and Growth Architect"

---

## 2. New Services Preview Section (new component)

Create `src/components/ServiceArchitecture.tsx` -- a minimal 3-column section placed immediately after the Hero (before StrategicGrowthExplained).

Three pillars, each with a short benefit-led description:

| Pillar | Description |
|---|---|
| Brand Strategy | Positioning, narrative, and differentiation that give the business a defensible identity and a reason to be chosen. |
| Growth Architecture | Systems, sequencing, and go-to-market structure that convert brand clarity into scalable revenue. |
| AI-Enabled Execution | Operational acceleration through AI tooling -- applied to content, workflows, and market intelligence. Strategy stays human. |

Design: editorial spacing (py-24), no cards or boxes, serif headings, muted descriptions. Consistent with the site's continuous-narrative aesthetic.

**Update `src/pages/Index.tsx`** to import and render `ServiceArchitecture` between `Hero` and `StrategicGrowthExplained`.

---

## 3. StrategicGrowthExplained Update (`src/components/StrategicGrowthExplained.tsx`)

Hybrid rewrite -- shift from pure "CMO" framing to CBO-led language while keeping CMO as a searchable bridge term:

- "What Is a Fractional Chief Branding Officer?" (body mentions: "sometimes called a fractional CMO")
- "When Should You Hire One?" -- reframe around brand/positioning breakdown, not just marketing conversion
- "How Is This Different From an Agency?" -- keep largely as-is, already strong

---

## 4. Schema and SEO Updates

**`src/lib/schema-entities.ts`** (identity layer):
- `personEntity.jobTitle`: "Fractional Chief Branding Officer & Growth Architect"
- `hasOccupation`: Replace "Fractional CMO" with "Fractional Chief Branding Officer", keep all others
- `knowsAbout`: Keep "Fractional CMO" in the array (search signal), add "Fractional Chief Branding Officer"

**`src/pages/Index.tsx`** (page-level schema and meta):
- Update `<title>` and `meta description` to lead with "Chief Branding Officer"
- Update `professionalServiceSchema.description` to lead with brand strategy
- Update `personSchema.jobTitle` to match the canonical entity
- Update `personSchema.hasOccupation[0]` to "Fractional Chief Branding Officer"
- FAQ schema: keep CMO questions as-is (they target real search queries)
- `useSEO` title/description: update to CBO framing, keep "fractional CMO" in keywords array

---

## 5. Navigation Label Updates (`src/components/Navigation.tsx`)

Minor refinements to match the repositioned tone:

| Current | Proposed | Reason |
|---|---|---|
| Case Study | Case Work | Broader, matches hero secondary link text |
| Consultation | unchanged | Already neutral enough |
| Book Consultation (CTA button) | Book Strategic Consult | Higher-trust framing |

---

## Files Changed

| File | Change |
|---|---|
| `src/components/Hero.tsx` | Eyebrow, subhead copy, alt text |
| `src/components/ServiceArchitecture.tsx` | **New file** -- 3-pillar services preview |
| `src/pages/Index.tsx` | Import ServiceArchitecture, update schema/meta/SEO |
| `src/components/StrategicGrowthExplained.tsx` | Reframe Q&A headings with CBO language |
| `src/lib/schema-entities.ts` | jobTitle, hasOccupation, knowsAbout |
| `src/components/Navigation.tsx` | "Case Study" to "Case Work", button text |

## What Stays Untouched

- All `/strategic-answers/fractional-cmo-*` pages and URLs (preserves SEO traffic)
- FAQ schema questions mentioning "CMO" (real search queries)
- "Fractional CMO" retained in `knowsAbout` array and keywords for search coverage
- Visual layout, dark editorial aesthetic, hero image, and portrait

