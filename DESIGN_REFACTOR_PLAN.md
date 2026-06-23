# Deeper Design Refactor Plan

**Version:** 1.0  
**Date:** June 2026  
**Scope:** Evolve Deeper from generic AI knowledge-site patterns into a world-class mental health knowledge institution.  
**Principle:** Typography is the primary interface. Hierarchy from type, spacing, rhythm, measure, and IA — not pills, badges, borders, shadows, or card stacking.

---

## Executive summary

Deeper’s **design intent** (DESIGN.md) is editorial, warm, and restrained. The **live implementation** drifts toward SaaS templates: pill-heavy metadata, bordered card grids, chatbot search UX, boxed “AI summaries,” and competing accent colors. The gap between spec and CSS is the primary source of “AI-generated” feeling.

This plan preserves all trust signals (reviewers, citations, dates, related topics, authority) while making them **quieter and more editorial**. Refactor is evolutionary, not a rebrand.

**Prototype comparison:** `/design-evolution/answer-directions/` — three answer-page directions applied to the same representative content.

---

## Part 1 — Current issues (audit findings)

### 1.1 System drift: DESIGN.md vs `global.css`

| Area | DESIGN.md spec | Live implementation | Impact |
|------|----------------|---------------------|--------|
| Headings | Cormorant Garamond | Georgia in `h1`, `h2`, `.answer-card`, `.brand-word` | Inconsistent editorial voice |
| Spacing | Token-only (`--space-*`) | 62px, 58px, 22px, 56px, 34px, 18px scattered | Broken rhythm, template feel |
| Answer lede | Open prose, normal weight, no box | `.ai-answer-summary`: white box, 4px ocean border, **italic** | Reads as AI chat output |
| Key takeaways | `--paper-deep`, brass left rule, **no border** | Full border + uppercase Jost h2 | Componentized, not editorial |
| Answer cards | Left accent, hover shadow | Homepage grid: hover `--mist` fill, no accent; duplicate styles in AnswerCard vs global | Inconsistent discovery patterns |
| Accent rule | Max 2 ocean elements per viewport | Topic badge + summary border + trust panel + pills + rabbit cards | Visual noise, SaaS badge stack |

**Severity:** High. Fixing drift alone improves credibility before any new visual territory.

---

### 1.2 Patterns that feel AI-generated or template-like

#### Pills and badges (highest frequency)

| Location | Pattern | Why it fails |
|----------|---------|--------------|
| Homepage | `.topic-pill`, `.trending-chip`, `.featured-meta .pill` | Pill walls = startup discovery UI |
| Answer page | `.answer-topic-badge` above h1 | Badge announces category; should be metadata line |
| AnswerCard | `.pill--category`, `.pill--date` | Two pills per row = marketplace listing |
| Search results | JS `resultTemplate` renders same pill pair | Duplicated noise at scale |
| Rabbit grid | Uppercase category span per card | 4-col card grid with badge headers |

**Count:** 50+ pill/badge/card references across `src/` and `global.css`.

#### Cards and grids

| Location | Pattern | Why it fails |
|----------|---------|--------------|
| Homepage | `.question-grid` 3-col with 1px grid lines | Dashboard/catalog, not reading room |
| Homepage | 4× `.featured-answer` split cards (ADHD, AI, modalities…) | Repeated template block |
| Topic hub | `.cluster-grid` 2-col `.hub-cluster-card` + AnswerCard list | Cards inside cards |
| Answer sidebar | 5–8 `.sidebar-card` stacks | Trust buried in boxes |
| Related section | `.rabbit-grid` 4-column | Marketplace cross-sell |

#### Search UI

| Location | Pattern | Why it fails |
|----------|---------|--------------|
| Homepage | Typing placeholder animation with cursor `\|` | Chatbot / prompt-engine aesthetic |
| Homepage + answers | Pill-shaped search (999px radius) + floating submit button | Consumer app, not library catalog |
| Homepage | `data-typed-prompts` rotating conversational questions | AI assistant onboarding |

#### Metadata treatments

| Location | Pattern | Why it fails |
|----------|---------|--------------|
| Answer page | Trust strip hidden on desktop, shown mobile-only | Trust should be visible, quiet, always |
| Eyebrows | `font-weight: 900`, ocean/brass color, uppercase | Marketing section labels everywhere |
| AnswerTrustPanel | Nested inside another sidebar card | “How this answer was reviewed” boxed like a widget |
| Reviewer profile | Plain `.content` page, bare URL list | Under-designed vs answer pages; no shared profile system |

#### Typography and reading

| Location | Pattern | Why it fails |
|----------|---------|--------------|
| `.ai-answer-summary .summary` | Italic lede in bordered box | Classic “AI summary” trope |
| `.accepted-answer` | `#34302c` hardcoded, mixed with `--ink` | Subtle cheapening |
| h1 sizes | 4.4rem global, 3rem answer, 2.45rem mobile | Uncontrolled display scale |
| `.text-link` | `font-weight: 800` | Shouting links, not editorial |

#### Imagery and hero

| Location | Pattern | Why it fails |
|----------|---------|--------------|
| Homepage hero | Stock reader photo + navy gradient | Generic wellness/editorial stock |
| Topic section | Full-width navy + pill grid | Second hero; competes with first |

#### Authority / therapist profiles

| Location | Pattern | Why it fails |
|----------|---------|--------------|
| `components/authority/*` | ServiceFitCards, ReferralEngine, DiagnosticJourney | SaaS landing page modules |
| Authority pages | Card-heavy marketing layout (from component names) | Conflicts with editorial answer corpus |

---

### 1.3 Emotional / brand gaps

- **Trusted:** Trust data exists but is boxed and label-heavy; feels compliance-widget not earned authority.
- **Editorial:** Serif/sans pairing is right; execution uses dashboard grids.
- **Calm:** Competing accents (ocean, brass, clay, mist pills) create restlessness.
- **Premium:** Shadow-on-hover cards and pill CTAs read mid-market SaaS.
- **Clinically credible:** Reviewer credentials present; presentation lacks Mayo/NYT gravitas.
- **Timeless:** Typing search + AI summary box date the UI to 2024–2025 AI products.

---

## Part 2 — Opportunities

### 2.1 Quick wins (high impact, low risk)

1. **Editorial metadata line** — Replace topic badge + trust strip + pills with one line under h1:
   `Anxiety · Reviewed by Dr. Ken Christian · Updated June 2026 · 3 sources`
2. **Remove typing search animation** — Static placeholder: `Search the answer library`
3. **Unbox the lede** — Remove `.ai-answer-summary` chrome; apply `.summary` as open `--text-md` prose
4. **Align CSS to DESIGN.md** — Cormorant everywhere; tokenize arbitrary px
5. **AnswerTrustStrip always visible** — Merge into metadata line on desktop

### 2.2 Medium-term (structural)

1. **Discovery list row** (`.discovery-row`) — Replace AnswerCard bordered box with title + summary + metadata + `--line` divider
2. **Sidebar sections** (`.sidebar-section`) — Replace `.sidebar-card` stack with labeled dividers; reserve `.care-card` only for YMYL
3. **Related questions list** — Replace `.rabbit-grid` with bibliography-style link list
4. **Homepage simplification** — One featured editorial band; topic index as typographic list; remove repeated featured-answer clones
5. **Shared profile template** — Reviewer + therapist profiles use `.profile-header`, `.profile-meta`, `.profile-section`

### 2.3 Strategic (differentiation)

1. **Mental landscape visual system** — See `MENTAL_LANDSCAPE_EXPLORATION.md`
2. **DESIGN.md v1.1** — Add editorial primitives; demote pill/card specs to legacy
3. **Grayscale hierarchy test** — Every page must read clearly with color removed except links

---

## Part 3 — Component inventory

### 3.1 Components to evolve (keep, refactor)

| Component | File | Current role | Target role |
|-----------|------|--------------|-------------|
| AnswerCard | `components/AnswerCard.astro` | Bordered card + pills | Discovery list row OR optional compact card (hub only) |
| AnswerTrustStrip | `components/AnswerTrustStrip.astro` | Mobile-only dot line | Part of `.editorial-meta` always visible |
| AnswerTrustPanel | `components/AnswerTrustPanel.astro` | Sidebar card | `.sidebar-section` with dividers, no outer border |
| CrisisBanner | `components/CrisisBanner.astro` | YMYL banner | Keep; ensure calm warm tone (not alert red SaaS) |
| PractitionerCallout | `components/PractitionerCallout.astro` | Sidebar card | Text block + link; no card chrome |
| QuestionContextPanel | `components/QuestionContextPanel.astro` | Semantic enrichment sidebar | Prose list; hide differential from default UI per spec |
| EmptyState | `components/EmptyState.astro` | Placeholder | Editorial empty copy, no card box |

### 3.2 CSS classes to deprecate (phase out)

| Class | Replacement |
|-------|-------------|
| `.pill`, `.pill--category`, `.pill--date` | `.editorial-meta` inline links + text |
| `.answer-topic-badge` | Topic link in `.editorial-meta` |
| `.ai-answer-summary` (boxed) | `.answer-lede` (unboxed) |
| `.question-grid` | `.discovery-list` |
| `.topic-pill`, `.trending-chip` | `.discovery-links` (text) |
| `.rabbit-grid` / `.rabbit-card` | `.related-list` |
| `.featured-answer` (repeated) | `.editorial-feature` (single pattern) |
| `.sidebar-card` (default) | `.sidebar-section` |

### 3.3 New primitives to add

```html
<!-- Editorial metadata -->
<p class="editorial-meta">
  <a href="/categories/anxiety/">Anxiety</a>
  <span class="meta-sep" aria-hidden="true">·</span>
  <span>Reviewed by <a href="/reviewers/...">Dr. Ken Christian</a></span>
  <span class="meta-sep" aria-hidden="true">·</span>
  <time datetime="2026-06-01">Updated June 2026</time>
</p>

<!-- Discovery list row -->
<article class="discovery-row">
  <h2><a href="...">Title</a></h2>
  <p class="discovery-summary">...</p>
  <p class="editorial-meta">...</p>
</article>

<!-- Sidebar section (no card) -->
<section class="sidebar-section" aria-labelledby="...">
  <h2 class="sidebar-heading" id="...">Related questions</h2>
  <ul class="sidebar-link-list">...</ul>
</section>
```

### 3.4 Pages — refactor priority

| Page | Priority | Primary changes |
|------|----------|-----------------|
| Answer `[slug]` | P0 | Metadata line, unbox lede, sidebar dividers, related list |
| Search `/answers/` | P0 | List rows, catalog search field, quiet result count |
| Homepage `/` | P1 | Remove typing UX, list discovery, one feature band |
| Topic hub `/categories/[cat]` | P1 | Flatten cluster cards to sections |
| Reviewer profile | P1 | Profile template + bibliography answers |
| Therapist authority | P2 | Strip marketing cards; align to profile template |
| Hub pages (ADHD, AI, modalities) | P2 | Reuse topic hub patterns |

---

## Part 4 — Priority recommendations

### Phase 0 — Foundation (1 week)

- [ ] Add `.editorial-meta`, `.discovery-row`, `.sidebar-section` to `global.css`
- [ ] Token audit: replace arbitrary px in `global.css` with `--space-*` / `--text-*`
- [ ] Unify heading font to Cormorant (remove Georgia overrides)
- [ ] Document v1.1 additions in DESIGN.md

### Phase 1 — Answer page (1 week) ★ highest leverage

- [ ] Replace topic badge + trust strip with `.editorial-meta`
- [ ] Remove `.ai-answer-summary` box; open lede
- [ ] Key takeaways per DESIGN.md (no full border)
- [ ] Sidebar: unwrap cards → sections + dividers; keep `.care-card` only
- [ ] Related questions: list not grid
- [ ] Ship direction comparison review; pick primary visual direction

### Phase 2 — Discovery surfaces (1 week)

- [ ] Refactor `AnswerCard` → `DiscoveryRow`
- [ ] Update search `resultTemplate` to list rows + metadata line
- [ ] Homepage: remove typing animation; text popular links
- [ ] Homepage: replace question-grid with discovery list
- [ ] Flatten homepage featured sections (max 1 editorial feature + topic index)

### Phase 3 — Hubs and profiles (1 week)

- [ ] Topic hub cluster cards → section + link lists
- [ ] Reviewer profile template
- [ ] Therapist authority page simplification
- [ ] Shared `.profile-header` component

### Phase 4 — Visual territory (2–3 weeks, parallel)

- [ ] Implement chosen direction from `/design-evolution/answer-directions/`
- [ ] Contour/weather motifs where appropriate (not stock photos)
- [ ] Hero evolution (remove or replace stock reader image)
- [ ] Psychology Weather Map legend alignment with Deeper tokens

---

## Part 5 — Estimated effort

| Phase | Scope | Engineering | Design | Total |
|-------|-------|-------------|--------|-------|
| 0 Foundation | Tokens + primitives | 2–3 days | 1 day | ~1 week |
| 1 Answer page | P0 refactor | 3–4 days | 2 days | ~1 week |
| 2 Discovery | Homepage + search + card | 3–4 days | 1 day | ~1 week |
| 3 Hubs + profiles | Templates | 3–4 days | 2 days | ~1 week |
| 4 Visual territory | Direction implementation | 5–8 days | 5–8 days | 2–3 weeks |

**Minimum viable evolution (Phases 0–1):** ~2 weeks — answer pages alone shift brand perception.  
**Full refactor (Phases 0–3):** ~4 weeks.  
**With visual territory (0–4):** ~6–8 weeks.

---

## Part 6 — Success criteria

1. **Grayscale test:** Screenshot answer page in grayscale; hierarchy still obvious.
2. **Pill budget:** Max 0 pills on answer page; max 0 on search results; homepage ≤ 0 (topic index uses text).
3. **Card budget:** Answer main column has 0 bordered cards; sidebar ≤ 1 elevated surface (care only).
4. **Trust visible:** Reviewer + date readable without scrolling on desktop.
5. **No chatbot signals:** No typing animation, no italic summary box, no “AI section” chrome visible to users.
6. **DESIGN.md compliance:** Zero arbitrary spacing/colors in touched files.
7. **Stakeholder review:** `/design-evolution/answer-directions/` direction selected with rationale.

---

## Part 7 — What we explicitly preserve

- All schema.org / `data-ai-*` attributes (semantic structure unchanged)
- Reviewer attribution, sources, citations, editorial policy links
- Crisis banner and care notes (clay accent allowed)
- Related topics, follow-up questions, modality links
- Search indexing and analytics events
- Content governance pipeline (no copy changes required for Phase 1)

---

## Appendix — File touch list (Phase 1)

| File | Changes |
|------|---------|
| `src/styles/global.css` | Primitives, deprecate conflicting rules |
| `src/pages/answers/[slug].astro` | Layout + metadata |
| `src/components/AnswerTrustStrip.astro` | Merge into meta pattern |
| `src/components/AnswerTrustPanel.astro` | Sidebar section styling |
| `src/components/AnswerCard.astro` | Phase 2 → DiscoveryRow |
| `DESIGN.md` | v1.1 editorial primitives |

---

*Next: Review `MENTAL_LANDSCAPE_EXPLORATION.md` and `/design-evolution/answer-directions/` prototypes before Phase 1 implementation.*
