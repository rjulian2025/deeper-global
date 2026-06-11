# Deeper Global Production Parity Gap Report

**Date:** 2026-06-11  
**Recovered source:** `Documents/New project/` on branch `production/astro-v1-recovered`  
**Live reference:** `https://www.deeper.global` (Vercel project `deeper-global-h65m`)  
**Audit method:** Source file inspection + live HTTP fetch (no build, no deploy)

---

## ⚠️ NO-DEPLOY WARNING

**Do not deploy, push, hoist, or change Vercel settings until parity gaps in this report are closed and verified on a preview build.**

Live production was deployed via Vercel CLI with `gitDirty: 1`. The committed recovery source is an earlier scaffold. Rebuilding from git today would **regress** production UI, SEO, and indexing behavior.

---

## Executive summary

| Area | Recovered source | Live production | Gap severity |
|------|------------------|-----------------|--------------|
| Route surface | ✅ Same paths | ✅ | Low |
| Supabase data layer | ✅ Same table/fields | ✅ | Low |
| `public/` assets | ❌ Missing | ✅ | **Critical** |
| Canonical host (`www`) | ❌ `deeper.global` | ✅ `www.deeper.global` | **Critical** |
| Trailing slashes | ❌ Absent | ✅ Present on all URLs | **High** |
| `noindex,follow` policy | ❌ Not implemented | ✅ Broad (see §4) | **Critical** |
| JSON-LD graph | ⚠️ QAPage-centric | ✅ MedicalWebPage/Article + org graph | **High** |
| Answer page layout | ❌ Single column | ✅ Two-column + breadcrumbs | **High** |
| Homepage | ❌ Simple hero/cards | ✅ Image hero, search, trending, stats | **High** |
| Global CSS / design system | ⚠️ Partial (~370 lines) | ✅ Extended (live-only classes) | **High** |
| Sitemap contents | ⚠️ Default `@astrojs/sitemap` | ✅ Customized 1,030 URLs | **High** |
| `llms.txt` | ⚠️ Same structure, wrong URLs | ✅ | Medium |
| Crisis banner | ⚠️ Present, simpler | ✅ Banner + sidebar care-card | Medium |
| `robots.txt` | ⚠️ Extra `LLMS:` line | ✅ Simpler | Low |
| `scripts/` | ❌ Missing | N/A for runtime | Low (defer) |

**Bottom line:** Data routing and page types match. Everything users and crawlers see — head tags, layout, assets, indexing rules, and sitemap policy — diverges materially.

---

## 1. Live features missing from recovered source

### 1.1 `public/` directory (missing entirely)

Live serves static assets the recovered tree has no folder for:

| Asset path | Purpose | Recoverable from |
|------------|---------|----------------|
| `/favicon.ico` | Browser icon | Live download or design source |
| `/favicon.svg` | SVG icon + JSON-LD logo URL | Live download |
| `/images/deeper-hero-reader.png` | Hero fallback image | Live download |
| `/images/deeper-hero-reader-720.avif` | Responsive hero | Live download |
| `/images/deeper-hero-reader-1200.avif` | Responsive hero + OG default | Live download |
| `/images/deeper-hero-reader-1774.avif` | Responsive hero | Live download |
| `/images/deeper-hero-reader-720.webp` | Responsive hero | Live download |
| `/images/deeper-hero-reader-1200.webp` | OG/Twitter image | Live download |
| `/images/deeper-hero-reader-1774.webp` | Responsive hero | Live download |

Without these, OG previews, favicons, and homepage hero break.

### 1.2 `BaseLayout.astro` head and chrome

**Live has (recovered lacks):**

| Feature | Live | Recovered |
|---------|------|-----------|
| Canonical host | `https://www.deeper.global/.../` | `https://deeper.global/...` (no `www`, no trailing slash) |
| `meta robots` prop | Conditional `noindex,follow` | Never emitted |
| `og:image` | `.../images/deeper-hero-reader-1200.webp` | Absent |
| `twitter:image` | Same as OG | Absent |
| Favicon links | `/favicon.ico`, `/favicon.svg` | Absent |
| `link rel="alternate"` for llms.txt | Present | Absent |
| `rel="preconnect"` GTM | Present | Absent |
| Site-wide JSON-LD | `Organization` + `WebSite` `@graph` on all pages | Only per-page JSON-LD when passed |
| Brand mark | `<span class="brand-word">Deeper</span><span class="brand-dot">.</span>` | Plain text "Deeper Global" |
| Nav CTA | `<a class="nav-cta" href="/answers/">Ask anything</a>` | Absent |
| Entities nav label | **Themes** | **Entities** |
| Internal links | Trailing slashes (`/answers/`, `/entities/`) | No trailing slashes |
| Footer links | Trailing slashes | No trailing slashes |

**File:** `src/layouts/BaseLayout.astro`

### 1.3 Homepage (`/`)

**Live structure (recovered is a different page):**

- Full-bleed `home-hero` with `<picture>` (avif/webp/png srcset)
- Hero H1: *"Answers to the questions you ask before you seek care."*
- `hero-search` form → `/answers/` with `?q=` + typed placeholder animation script
- `trend-row` trending question links
- `hero-stats`: **1,005** vetted answers, **68** topic areas, Citable badge
- `question-grid` answer cards (not `answer-list`)
- Section header with "See all answers" text link

**Recovered:** Text-only `.hero`, three value-prop cards, `answer-list` with 6 items, topic grid — no search, no image, no stats.

**File:** `src/pages/index.astro`, `src/styles/global.css`

### 1.4 Answer pages (`/answers/[slug]/`)

| Feature | Live | Recovered |
|---------|------|-----------|
| `noindex,follow` | **All sampled answers** (crisis and non-crisis) | None |
| Layout class | `answer-layout` two-column | `answer-content` single column |
| Breadcrumbs | `answer-breadcrumbs` | None |
| Sidebar | `answer-sidebar`, `signal-card`, `sidebar-card`, `care-card` | Inline `trust-panel` only |
| Related links | `rabbit-grid` / `rabbit-card` | `answer-list` / `AnswerCard` |
| Topic badge | `answer-topic-badge` → category | `.eyebrow` text |
| Microdata | `itemtype="https://schema.org/Article"` | `itemtype="https://schema.org/QAPage"` |
| JSON-LD types | `MedicalWebPage`, `Article`, `Question`, `Answer`, `DefinedTerm`, `BreadcrumbList` + org graph | `QAPage`, `Question`, `Answer`, `DefinedTerm` only |
| Duplicate JSON-LD | Single `@graph` in head | Head graph + inline legacy `QAPage` block in body |
| Crisis care-card | Sidebar: *"...call or text 988...now"* on crisis slug | Only top `CrisisBanner` (generic copy) |
| Citation panel location | Sidebar | Main column |

**Files:** `src/pages/answers/[slug].astro`, `src/styles/global.css`, likely new sidebar component(s)

### 1.5 Entity pages

| Page | Live | Recovered |
|------|------|-----------|
| `/entities/` title | *Mental Health **Themes*** | *Mental Health **Entity Map*** |
| `/entities/` H1 | Themes framing | *"Mental health entities, not just pages."* |
| `/entities/` robots | `noindex,follow` | Indexable (no robots meta) |
| `/entities/[slug]/` title | `{Name} **Theme** \| Deeper Global` | `{Name} **Entity** \| Deeper Global` |
| `/entities/[slug]/` robots | `noindex,follow` | Indexable |
| JSON-LD index | `DefinedTermSet` inside full `@graph` with org | Standalone `DefinedTermSet`, apex URLs |
| In sitemap | **Excluded** | Would be included by default |

**Files:** `src/pages/entities/index.astro`, `src/pages/entities/[entity].astro`

### 1.6 Category pages

| Page | Live | Recovered |
|------|------|-----------|
| `/categories/` robots | `noindex,follow` | Indexable |
| `/categories/[slug]/` robots | `noindex,follow` | Indexable |
| JSON-LD | `CollectionPage` + `ItemList` | None |
| In sitemap | **Excluded** | Would be included by default |

**Files:** `src/pages/categories/index.astro`, `src/pages/categories/[category].astro`

### 1.7 Indexing / SEO configuration

**Live `noindex,follow` policy (verified 2026-06-11):**

| URL pattern | robots meta |
|-------------|-------------|
| `/` | *(none — indexable)* |
| `/about/`, `/privacy/`, `/answers/`, `/protocol/` | *(none — indexable)* |
| `/answers/[slug]/` | `noindex,follow` |
| `/entities/`, `/entities/[slug]/` | `noindex,follow` |
| `/categories/`, `/categories/[slug]/` | `noindex,follow` |

**Important:** `noindex` is **not** crisis-only on live. Standard answers (e.g. therapy question, anxiety chest-tightening slug) also carry `noindex,follow`. Crisis adds banner + `data-risk-class="crisis-sensitive"` but does not uniquely control noindex.

**Recovered:** No `noindex` anywhere. `isCrisisSensitive()` only toggles banner and `data-risk-class`.

**Files to add/change:** `BaseLayout.astro` + new helper (e.g. `src/lib/seo.ts`) — **must be reconstructed from live behavior**

### 1.8 Sitemap

**Live (`/sitemap-index.xml` → `/sitemap-0.xml`):**

- **1,030** URLs total
- **1,025** `/answers/[slug]/` pages
- Hub pages only: `/`, `/about/`, `/answers/`, `/privacy/`, `/protocol/`
- **Excludes** all `/categories/*` and `/entities/*`
- All URLs use `https://www.deeper.global/.../` with trailing slashes

**Recovered:** `@astrojs/sitemap()` with `site: 'https://deeper.global'` — would emit apex URLs, include category/entity pages, and use default inclusion rules.

**File:** `astro.config.mjs` (+ possible `src/pages/sitemap` customization)

### 1.9 `llms.txt`

| Field | Live | Recovered (`src/pages/llms.txt.ts`) |
|-------|------|-------------------------------------|
| Base URL | `https://www.deeper.global` | `https://deeper.global` |
| Link format | Trailing slashes on all URLs | No trailing slashes |
| Section structure | Same | Same |
| Entity/answer content | ~68 entities, ~1000+ answers (Supabase) | Same generator logic |
| Citation guidance text | References live JSON-LD types | References QAPage JSON-LD |

**Gap:** URL host/slash normalization only — logic is recoverable with small edits once `site` URL is fixed.

### 1.10 `robots.txt`

| Line | Live | Recovered (`src/pages/robots.txt.ts`) |
|------|------|----------------------------------------|
| Sitemap | `https://www.deeper.global/sitemap-index.xml` | `https://deeper.global/sitemap-index.xml` |
| LLMS directive | **Absent** | `LLMS: https://deeper.global/llms.txt` |

**Decision needed:** Match live (drop LLMS line) or keep LLMS intentionally — low risk either way.

### 1.11 `scripts/` directory

Not present in recovered source. Live production Astro build does not require runtime scripts. GitHub `main` has Next.js-era scripts (`deploy_smoke.sh`, `bundle_guard.mjs`) — unrelated to current Astro live site.

**Defer** unless CI/smoke automation is desired post-recovery.

### 1.12 Astro config

**Recovered (`astro.config.mjs`):**

```js
site: 'https://deeper.global',
integrations: [sitemap()],
// no trailingSlash
```

**Live effective config (inferred from output):**

- `site: 'https://www.deeper.global'`
- `trailingSlash: 'always'` (all canonicals and internal links end with `/`)
- Custom sitemap filter (see §1.8)

---

## 2. Source features matching live

These are present in recovered source and align with live behavior (content-dependent on Supabase env at build):

| Feature | Recovered location | Live confirmation |
|---------|-------------------|-------------------|
| Astro SSG framework | `package.json`, build output pattern | `/_astro/BaseLayout.*.css` |
| GA4 `G-VY56C15LGV` | `BaseLayout.astro` | Same ID |
| Route: `/answers/[slug]/` | `src/pages/answers/[slug].astro` | DB slug URLs work |
| Route: `/entities/`, `/entities/[entity]/` | `src/pages/entities/*` | Same paths |
| Route: `/categories/`, `/categories/[category]/` | `src/pages/categories/*` | Same paths |
| Route: `/llms.txt` | `src/pages/llms.txt.ts` | Same endpoint, similar body |
| Route: `/robots.txt` | `src/pages/robots.txt.ts` | Same endpoint |
| Supabase `questions_master` | `src/lib/supabase.ts` | Live corpus ~1005 answers |
| Crisis term detection | `isCrisisSensitive()` in `src/lib/content.ts` | Live `data-risk-class="crisis-sensitive"` on suicidal-thoughts slug |
| Crisis banner component | `src/components/CrisisBanner.astro` | Live `<aside class="crisis">` on crisis slug |
| Entity alias map | `entityAliases` in `src/lib/content.ts` | Live llms.txt aliases match |
| AI data attributes | `data-ai-*` on answer pages | Present on live |
| Citation panel content | `[slug].astro` | Live sidebar citation panel (relocated) |
| Core pages: about, protocol, privacy | `src/pages/*.astro` | Routes exist on live |
| Sitemap integration dependency | `@astrojs/sitemap` | Live `sitemap-index.xml` present |

---

## 3. Exact files likely needed for parity backfill

### 3.1 New directory

```
public/
├── favicon.ico
├── favicon.svg
└── images/
    ├── deeper-hero-reader.png
    ├── deeper-hero-reader-720.avif
    ├── deeper-hero-reader-1200.avif
    ├── deeper-hero-reader-1774.avif
    ├── deeper-hero-reader-720.webp
    ├── deeper-hero-reader-1200.webp
    └── deeper-hero-reader-1774.webp
```

### 3.2 Config

| File | Change type | Priority |
|------|-------------|----------|
| `astro.config.mjs` | Edit: `site`, `trailingSlash`, sitemap filter | P0 |
| `vercel.json` | Verify framework/output (likely OK as-is) | P2 |

### 3.3 Layout / shared

| File | Change type | Priority |
|------|-------------|----------|
| `src/layouts/BaseLayout.astro` | Major rewrite | P0 |
| `src/styles/global.css` | Major expansion (live-only classes) | P0 |
| `src/lib/seo.ts` *(new)* | `noindex` rules, canonical builder, default OG image | P0 |
| `src/lib/content.ts` | Edit citation URLs to `www` + trailing slash | P1 |

### 3.4 Pages

| File | Change type | Priority |
|------|-------------|----------|
| `src/pages/index.astro` | Complete rewrite | P0 |
| `src/pages/answers/[slug].astro` | Major rewrite (layout, JSON-LD, noindex) | P0 |
| `src/pages/entities/index.astro` | Copy/title/noindex/JSON-LD graph | P1 |
| `src/pages/entities/[entity].astro` | Theme naming, noindex, JSON-LD | P1 |
| `src/pages/categories/index.astro` | noindex | P1 |
| `src/pages/categories/[category].astro` | noindex + CollectionPage JSON-LD | P1 |
| `src/pages/llms.txt.ts` | URL normalization | P1 |
| `src/pages/robots.txt.ts` | Sitemap URL host | P2 |

### 3.5 Components (likely new — reconstruct from live HTML)

| File | Purpose |
|------|---------|
| `src/components/AnswerSidebar.astro` *(new)* | Signal card, topic link, citation, care-card |
| `src/components/AnswerBreadcrumbs.astro` *(new)* | Breadcrumb nav |
| `src/components/RabbitCard.astro` *(new)* | Related question cards |
| `src/components/HeroSearch.astro` *(new)* | Homepage search + typed prompts |

Existing components to keep or adapt:

- `src/components/CrisisBanner.astro` — keep; extend with crisis-specific sidebar copy
- `src/components/AnswerCard.astro` — homepage/grid variant may diverge from live `answer-card` / `question-grid`

### 3.6 Optional / defer

| File | Notes |
|------|-------|
| `scripts/*` | Not required for live runtime parity |
| `src/pages/answers/index.astro` | Minor copy/CSS tweaks only |
| `src/pages/about.astro`, `protocol.astro`, `privacy.astro` | Likely minor head-tag inheritance once BaseLayout fixed |

---

## 4. Missing assets (complete list)

All must land under `public/` before preview QA:

1. `favicon.ico`
2. `favicon.svg`
3. `deeper-hero-reader.png`
4. `deeper-hero-reader-720.avif`
5. `deeper-hero-reader-1200.avif`
6. `deeper-hero-reader-1774.avif`
7. `deeper-hero-reader-720.webp`
8. `deeper-hero-reader-1200.webp`
9. `deeper-hero-reader-1774.webp`

**Recovery method:** Download from live (`curl -O`) or restore from designer/source archive. No git history contains these files in the Astro tree.

---

## 5. Live HTML behaviors that must be reconstructed

These do not exist in recovered source and were not found in any committed branch. Reconstruction sources: **live page HTML + CSS bundle** (`/_astro/BaseLayout.DHHP_8JI.css`).

| Behavior | Evidence on live | Reconstruction approach |
|----------|------------------|-------------------------|
| `noindex,follow` routing table | All answer/entity/category detail + listing pages except top hubs | Add `shouldNoindex(pathname)` helper; wire into `BaseLayout` |
| Organization/WebSite JSON-LD on every page | Present in `<head>` on `/`, answers, entities | Add static `@graph` fragment to `BaseLayout` |
| MedicalWebPage + Article answer graph | Answer head JSON-LD | Replace QAPage-centric graph in `[slug].astro` |
| BreadcrumbList JSON-LD | Answer pages | Generate from category + question |
| CollectionPage + ItemList | Category hub pages | Add to `[category].astro` |
| Two-column answer layout + sidebar | `answer-layout`, `answer-sidebar` classes | New markup + CSS from live |
| Crisis-specific care-card copy | Stronger 988 language in sidebar on crisis slug | Conditional in sidebar component |
| Homepage hero + picture srcset | `home-hero-picture` | New index markup + assets |
| Hero search typed prompts | Inline module script on `#ask` | Port script from live HTML |
| Trending row + hero stats | Hardcoded trending links + DB counts | Port structure; wire stats to `getQuestions()` length |
| Brand wordmark + nav CTA | Header chrome | Edit `BaseLayout` |
| "Themes" naming | Nav + entity titles | Copy change across entity pages |
| Sitemap exclusion rules | categories/entities omitted | `astro.config.mjs` sitemap `filter` |
| Trailing slash consistency | All URLs | `trailingSlash: 'always'` + link audit |

**Cannot recover from git alone.** If a local CLI deploy directory still exists on the machine that produced `gitDirty: 1` builds, that artifact would be the fastest source — check before hand-rebuilding from HTML.

---

## 6. Safe to defer (post-parity or optional)

| Item | Rationale |
|------|-----------|
| `scripts/` smoke tests | Not part of live runtime; add for CI later |
| `robots.txt` LLMS line | Live omits it; keeping it is harmless but not parity-critical |
| Homepage trending link slugs | Content/marketing; can use live queries or simplify initially |
| Hero typed-prompt animation | UX polish; search form without animation is acceptable interim |
| Exact CSS hash/bundle name | Changes every build; class names matter, not hash |
| Vercel project `framework: nextjs` metadata | Dashboard label stale; fix at deploy-config time, not source |
| Hoist to repo root | Process change; do after source parity, not before |
| `legacyJsonLd` duplicate block | Recovered source artifact; live removed it — drop during rewrite |

---

## 7. Risk ranking

| Rank | Gap | Risk if deployed without fix |
|------|-----|------------------------------|
| **P0 Critical** | Missing `public/` assets | Broken favicon, OG images, homepage hero |
| **P0 Critical** | Wrong canonical host (`deeper.global` vs `www`) | Duplicate URL signals, SEO regression |
| **P0 Critical** | Missing `noindex,follow` on answers/entities/categories | **Indexation policy change** — live intentionally noindexes ~1025+ URLs |
| **P0 Critical** | Sitemap URL set mismatch | Wrong URLs submitted (apex vs www; extra hub pages) |
| **P1 High** | Answer page layout + JSON-LD | User-visible regression; rich result shape change |
| **P1 High** | Homepage redesign missing | Major brand/UX regression |
| **P1 High** | `trailingSlash` not configured | Canonical duplication, broken relative links on Vercel |
| **P1 High** | Global CSS gap | Visual parity failure even if markup ported |
| **P2 Medium** | Entity "Theme" naming | UX/copy drift |
| **P2 Medium** | llms.txt URL format | AI discovery consistency |
| **P3 Low** | robots.txt LLMS line | Minor crawler discovery difference |
| **P3 Low** | scripts/ absence | No production runtime impact |

---

## 8. Recommended backfill sequence

Execute in order. Still **no production deploy** until step 8 passes on preview.

### Step 1 — Assets and config foundation (P0)

1. Create `public/` and download all 9 assets from live
2. Update `astro.config.mjs`: `site: 'https://www.deeper.global'`, `trailingSlash: 'always'`
3. Add sitemap `filter` to match live inclusion rules

### Step 2 — SEO primitives (P0)

1. Add `src/lib/seo.ts` with canonical URL builder + `shouldNoindex()` matching live table (§1.7)
2. Rewrite `BaseLayout.astro`: robots meta, OG/Twitter images, favicons, org JSON-LD, nav chrome, trailing-slash links

### Step 3 — Answer pages (P0/P1)

1. Rewrite `src/pages/answers/[slug].astro` with live layout, JSON-LD graph, sidebar, breadcrumbs
2. Extend crisis handling (banner + care-card copy)
3. Update `src/lib/content.ts` citation URLs

### Step 4 — Hub pages (P1)

1. Rewrite `src/pages/index.astro`
2. Update entity/category pages for noindex, titles ("Themes"), JSON-LD

### Step 5 — Feed endpoints (P1/P2)

1. Fix `llms.txt.ts` URL host/slashes
2. Fix `robots.txt.ts` sitemap URL

### Step 6 — CSS pass (P1)

1. Expand `global.css` — port live-only classes (`home-hero`, `answer-layout`, `rabbit-grid`, `nav-cta`, `brand-word`, etc.)
2. Source: fetch `/_astro/BaseLayout.DHHP_8JI.css` from live for reference

### Step 7 — Local build verification (gate)

```bash
# Requires explicit approval to install deps
npm ci
SUPABASE_URL=... SUPABASE_ANON_KEY=... npm run build
npm run preview
```

Compare preview vs live checklist:

- [ ] Homepage hero image + search render
- [ ] Answer page two-column layout
- [ ] Crisis slug: banner + `noindex,follow` + `crisis-sensitive`
- [ ] Standard answer: `noindex,follow` (same as live)
- [ ] `/entities/` → `noindex,follow`, title contains "Themes"
- [ ] Canonical on sample pages = `https://www.deeper.global/.../`
- [ ] Sitemap: 1,030 URLs, same hub inclusion pattern
- [ ] llms.txt Base URL = `www`
- [ ] favicon + OG image resolve

### Step 8 — Preview deploy only (explicit approval)

- Deploy to Vercel preview (not production)
- Side-by-side diff against live URLs
- **Only then** consider hoist + production promotion

---

## 9. Page-by-page live vs recovered matrix

| URL | Live robots | Recovered robots | Layout match | JSON-LD match |
|-----|-------------|------------------|--------------|---------------|
| `/` | indexable | indexable | ❌ | ⚠️ partial |
| `/answers/` | indexable | indexable | ⚠️ partial | ❌ |
| `/answers/how-do-i-know-if-i-need-therapy/` | noindex | indexable | ❌ | ❌ |
| `/answers/what-should-i-do-if-im-having-suicidal-thoughts/` | noindex + crisis UI | indexable + banner only | ❌ | ❌ |
| `/answers/my-chest-tightens-whenever-someone-texts-me-unexpectedly/` | noindex | indexable | ❌ | ❌ |
| `/entities/` | noindex | indexable | ⚠️ partial | ⚠️ partial |
| `/entities/identity-and-self-worth/` | noindex | indexable | ⚠️ partial | ⚠️ partial |
| `/categories/` | noindex | indexable | ⚠️ partial | ❌ |
| `/categories/anxiety-and-stress/` | noindex | indexable | ⚠️ partial | ❌ |
| `/protocol/` | indexable | indexable | ⚠️ unknown | ❌ |
| `/llms.txt` | n/a | n/a | ⚠️ URL diffs | n/a |
| `/sitemap-index.xml` | n/a | n/a | ❌ policy diff | n/a |

---

## 10. Smallest safe next action

**Download the nine `public/` assets from live and locate any local CLI deploy artifact from the `gitDirty: 1` Codex/Vercel deploys.**

That is the lowest-risk, highest-leverage step:

1. Assets unblock OG/favicon/hero verification in any subsequent build
2. A local dirty deploy folder (if it still exists) could fill the entire UI/SEO gap faster than reconstructing from HTML

Do **not** hoist, deploy, or push until Step 1–3 of the backfill sequence are complete and preview QA passes.

---

## Related documents

- [`docs/deeper-production-recovery-notes.md`](./deeper-production-recovery-notes.md) — hoist plan and repo cruft audit

---

**Reminder: NO DEPLOY until parity gaps above are closed and verified on preview.**
