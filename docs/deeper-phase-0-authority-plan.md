# Deeper Global — Phase 0 Authority Plan

**Date:** 2026-06-11  
**Plan type:** Implementation-ready planning — **no code, content, deploy, or settings changes authorized by this document**  
**Inputs:**

- Fable post-recovery authority audit (external, 2026-06-11)
- Cursor live + repo reconciliation (2026-06-11)
- Platform docs: `deeper-platform-alignment-cutover-plan.md`, `deeper-platform-alignment-execution-log.md`, `deeper-production-cutover-log.md`
- Repo source review: indexation, sitemap, schema, entity/category routes, Supabase build

**Live production reference:**

- Branch: `production/astro`
- Deployment: **`dpl_3rtTXesrfc9Bq3AipfmUmuaDrGcZ`**
- Commit: **`38d4fc8`**
- URL: `https://www.deeper.global`

**Companion doc:** `docs/deeper-post-recovery-authority-audit.md` (raw Fable audit)

---

## Rick’s strategic direction (planning — not implemented)

**Recorded 2026-06-11.** This is the recommended architecture pending GSC/Supabase validation. **No code, redirects, URL changes, indexation changes, or schema changes are approved yet.**

| Layer | Role |
|-------|------|
| **`/entities/`** | **Canonical concept nodes** — the future authoritative knowledge-graph layer: definitions, aliases, related concepts, linked answers, and AI-search concept authority |
| **`/categories/`** | **Browse/navigation indexes** — user-friendly topic browsing; not the primary semantic authority layer |

**Do not fold entities into categories** unless later data strongly argues otherwise.

**Before any implementation:**

1. Complete Phase 0 GSC + Supabase exports (Section D).
2. Sign entity consolidation map (Section E).
3. Explicit Rick approval for Week 2+ work (Section K).

Until then: consolidate taxonomy in **data/planning only**; live routes, robots, sitemap, and templates remain unchanged.

---

## A. Executive Summary

### What changed after recovery

Platform recovery and Git-governed cutover are **complete**:

| Layer | State |
|-------|-------|
| GitHub default branch | `production/astro` |
| Vercel Production Branch | `production/astro` |
| Build stack | Astro root app → `dist`, Node 22.x, Supabase env present |
| Deploy path | Git push → Vercel production (first successful cutover 2026-06-11) |
| Live site | Astro app serving `www.deeper.global` with 36/36 post-cutover QA pass |
| Rollback reference | `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` (prior CLI deployment) |

The site is **technically stable**. The limiting factor is no longer deployment—it is **editorial authority, taxonomy coherence, and indexation governance**.

### Why the next problem is editorial authority, not deployment

Fable audited **rendered production output** (what crawlers and AI systems see). Cursor reconciled that audit against **repo behavior**. Together they show:

- **Strengths:** llms.txt format, v2 answer template shape, Protocol page, canonical/OG hygiene, JSON-LD on answers, honest scale claims, Git-only production path.
- **Gaps:** fragmented entity/category taxonomy (~68 overlapping topic areas), two-tier content corpus (v2 vs legacy 2025 batch), trust fields in DB not rendered (`source_refs`, `reviewed_by`), Protocol promises exceeding page delivery, inverted practical indexation (most answers `noindex,follow` today), slug debt, batch freshness timestamps, build without answer-count floor.

None of these are fixed by another platform alignment pass. They require **Phase 0 data gathering**, **taxonomy decisions**, and **sequenced implementation sprints** (trust layer → entity consolidation → graduated indexation → top-answer upgrades).

### The 80/20 recommendation

The **20% that yields ~80% of authority gain**, in order:

1. **Entity consolidation map** (68 → ~24 canonical entities; aliases + redirect table; no code until GSC baseline).
2. **Week 0 data exports** (GSC + Supabase distributions) to gate every URL and indexation decision.
3. **Trust layer sprint** (render `source_refs` + `reviewed_by`, editorial policy page, explicit crisis component policy, preserve disclaimers).
4. **Graduated indexation** (use existing `review_status` code path; populate DB; do not flip indexation without GSC proof).
5. **Top-150 answer upgrade program** (v2 rewrite + sources + reviewer + clean slug/301 only during upgrade; merge ~15–25 duplicate pairs first).

Everything else (full legacy rewrite, entities-as-rich-concept-pages, API product, conversion bridges) sequences **after** these five.

---

## B. Confirmed Technical Ground Truth

### Production branch and deployment

| Item | Value |
|------|-------|
| Production branch | `production/astro` |
| GitHub default | `production/astro` |
| Live deployment ID | **`dpl_3rtTXesrfc9Bq3AipfmUmuaDrGcZ`** |
| Deployed commit | **`38d4fc822a2e757aee28f6862439974812cc2421`** |
| Deploy mechanism | Git push (not CLI `--prod`) |
| Local unpushed doc | Cutover log commit `fcc36e4` (optional future doc push) |

### Indexation logic (repo)

**Answers** (`src/pages/answers/[slug].astro`):

```text
noindex={!shouldIndexQuestion(question)}
```

**`shouldIndexQuestion()`** (`src/lib/content.ts`):

| `review_status` | Indexable? |
|-----------------|------------|
| *(empty / null)* | **Yes** → no `noindex` |
| `approved`, `published`, `reviewed` | **Yes** |
| Any other value | **No** → `noindex,follow` |

**Live sample (2026-06-11):** legacy answers such as `/answers/how-do-i-know-if-i-need-therapy/` render `noindex,follow` → their `review_status` is set and **not** in the allowlist.

**Hubs and indexes:**

| Route | `noindex` |
|-------|-----------|
| `/answers/` (library hub) | **No** — indexable |
| `/`, `/about/`, `/protocol/`, `/privacy/` | **No** — indexable |
| `/categories/` and `/categories/[category]/` | **Yes** — always `noindex,follow` |
| `/entities/` and `/entities/[entity]/` | **Yes** — always `noindex,follow` |

### Sitemap policy

**Integration:** `@astrojs/sitemap` in `astro.config.mjs`

```javascript
filter: (page) => !page.includes('/entities/') && !page.includes('/categories/')
```

| In sitemap (~1,030 URLs) | Excluded |
|--------------------------|----------|
| Home, answers, static pages | `/entities/*`, `/categories/*` |

**lastmod:** Generated at build time from Astro static routes; answer `dateModified` in JSON-LD uses `updated_at || created_at` from Supabase (batch-identical timestamps in legacy data propagate).

### Category / entity behavior

- **Data source:** Both derive from **`displayCategory(question)`** → `category || raw_category || 'General'`.
- **Categories:** Primary UX — breadcrumbs, topic badges, sidebar “Related theme,” homepage “Topics.”
- **Entities:** Parallel “Themes” nav + llms.txt entity map; `getEntitySummaries()` mirrors categories with hardcoded `entityAliases` for ~12 names only.
- **JSON-LD on answers:** `about` points to `/entities/{slug}#entity` but sidebar links to **`/categories/`**.
- **Neither hub type is sitemap-listed or indexable today.**

### Schema behavior (live + repo)

**Global (`BaseLayout.astro`):** Organization + WebSite JSON-LD on every page.

**Answer pages (`[slug].astro`):** `@graph` includes MedicalWebPage, Article, Question, Answer, DefinedTerm (entity), BreadcrumbList. **Present on live production** (Fable “verify” item — confirmed live).

**Not rendered from DB:** `source_refs`, `reviewed_by`, explicit `risk_class` (Protocol §2 field).

**Author in schema:** `"Deeper Global"` (organization), not named clinician.

### Trust-layer gaps (rendered vs Protocol)

| Protocol promise | Rendered today |
|------------------|----------------|
| Source set per answer | ❌ `source_refs` in schema, not in UI |
| Review state / clinical review path | ⚠️ Anonymous “Deeper review signal” bullet list only |
| Risk class | ⚠️ Keyword heuristic (`isCrisisSensitive`) → `CrisisBanner`; no DB `risk_class` |
| Crisis support on risk-classed answers | ✅ Banner on keyword matches (e.g. suicidal-thoughts URL shows 988) |
| “Evidence-informed” | Asserted in copy; no visible citations |

**Sidebar today:** “Deeper review signal” (generic bullets), citation block (URL/title/date), “Not a substitute for care.”

### Supabase / build risks

| Behavior | Location | Risk |
|----------|----------|------|
| Full table fetch | `questions_master`, paginated 1000 | Single point of failure |
| Missing env | Returns `[]` silently | Local/dev empty site |
| Fetch error | Throws | Build fails (good on Vercel) |
| Answer count floor | **None** | Partial fetch could ship gutted site |
| Content snapshot fallback | **None** | Repeat of recovery failure mode |
| Cache | In-memory `questionsCache` per build | N/A for static build |

**Env vars (Vercel production):** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_GA_ID`.

---

## C. Fable Audit Reconciliation

### What Fable got right

| Finding | Reconciliation |
|---------|----------------|
| llms.txt is best-in-class | ✅ Confirmed live (~1,080 www refs, entity map + answer index) |
| v2 template is the target shape | ✅ Repo template supports takeaways, sections, citation, follow-ups |
| Entity taxonomy fragmented (~68 areas, many thin/overlapping) | ✅ `getCategorySummaries()` derives one hub per distinct category string |
| Two-tier corpus (v2 vs legacy 2025 batch) | ✅ Visible in timestamps, voice, slug patterns |
| “Evidence-informed” under-substantiated on pages | ✅ No `source_refs` rendering |
| Categories vs entities duplication | ✅ Same labels; categories win UX; both noindex |
| Indexation strategy needs rethink | ✅ Most sampled answers are `noindex,follow` via `review_status` |
| Slug debt (`-final-1000`, hash suffixes) | ✅ Observable in llms.txt index |
| Batch `updated` timestamps | ✅ Flow to JSON-LD/sitemap |
| Build Supabase dependency + no count floor | ✅ Confirmed in `supabase.ts` |
| Crisis thinner than llms.txt on some pages | ⚠️ Partially true — keyword-triggered pages have banner |
| No conversion bridge | ✅ Observation only (out of Phase 0 scope) |

### What needed correction

| Fable statement | Correction |
|-----------------|------------|
| JSON-LD “verify in repo” | **Already live** on answer pages (MedicalWebPage, QAPage graph, Organization, WebSite) |
| “Hubs indexable, answers possibly noindex” | **Precise rule:** `/answers/` hub indexable; **answers** use `review_status` gate (most legacy = noindex); **category/entity hubs always noindex** |
| Crisis only generic footer | **Keyword-classified** crisis answers render `CrisisBanner` with 988; non-crisis pages get care note only |
| `/entities/` vestigial | **Partially true** — intentionally in llms.txt as “canonical entity map” but UX/schema point at categories |

### Unknown until GSC / Supabase export

| Unknown | Why it matters |
|---------|----------------|
| Indexed URL counts by type | Gates any indexation flip |
| Impressions/clicks per answer URL | Top-150 selection |
| Which slugs earn citations / AI referral | Upgrade priority |
| Full `review_status` distribution | Predicts indexable count if policy unchanged |
| `source_refs` / `reviewed_by` population rates | Trust sprint scope |
| Explicit `risk_class` column existence/coverage | Crisis policy |
| Duplicate pair inventory with traffic split | Merge vs 301 decisions |
| Search Console duplicate/canonical issues | Repo has stale GSC script path `reports/gsc-indexing/2026-05-05` — **refresh needed** |

---

## D. Phase 0 Data Requirements

**Week 0 deliverable:** a single **`reports/phase-0/`** folder (CSV + summary markdown). No production changes until this exists.

### GSC export fields needed

Export from Google Search Console (last 16 months + current indexing):

| Field | Use |
|-------|-----|
| URL | Join key to Supabase slugs |
| Clicks, Impressions, CTR, Position | Top-150 ranking |
| Top query (or query report joined by page) | Intent + upgrade priority |
| Indexing status (indexed / not indexed / crawled-not-indexed) | Indexation policy |
| Canonical Google selected vs user-declared | Duplicate/canonical risk |
| Last crawl date | Staleness |

**Reports to pull:**

1. Pages — performance
2. Pages — indexing (or URL inspection sample for hub types)
3. Sitemaps — indexed count vs submitted (expect ~1,030 submitted)
4. Optional: Search results → queries filtered to `/answers/`

### Counts required (by page type)

| Page type | Metrics |
|-----------|---------|
| `/answers/[slug]/` | Total URLs, indexed count, noindex count (from crawl or sample), impressions sum |
| `/answers/` hub | Indexed? impressions |
| `/categories/*` | Crawled count (expect noindex) |
| `/entities/*` | Crawled count (expect noindex) |
| Static (`/`, `/protocol/`, `/about/`, `/llms.txt`) | Indexed + impressions |

### Supabase export (`questions_master`)

Run read-only export with columns:

```text
slug, question, category, raw_category, primary_theme, related_themes,
review_status, reviewed_by, source_refs,
content_enriched_at, content_prompt_version,
created_at, updated_at, triage,
primary_entities, related_entities, citation_notes
```

**Derived reports to produce:**

| Report | Purpose |
|--------|---------|
| `review_status` distribution | Indexation forecast |
| `source_refs` non-null count / sample | Trust sprint |
| `reviewed_by` non-null count | Trust sprint |
| `content_enriched_at` non-null (= v2 proxy) count | Corpus tier split |
| Slug pattern flags (`-final-1000`, `-l2m3n4`, `\d{6}-\d+`) | Slug debt queue |
| Category/entity count + answer counts per category | Consolidation map |
| Duplicate title similarity clusters | Dedupe pass (Fable cited ~15–25 pairs) |
| Crisis keyword hits vs `triage` values | Crisis policy |

### Duplicate / slug debt sample list (seed from Fable — validate in export)

| Pattern | Example pairs / notes |
|---------|----------------------|
| Semantic dupes | “waiting for the other shoe to drop” vs “waiting for something bad to happen” |
| Semantic dupes | “too much for other people” (×2) |
| Semantic dupes | “don’t deserve good things” (×2) |
| Slug suffix debt | `-final-1000`, `-l2m3n4`, `-184730-102` |
| Misfiled cluster | Psychedelic therapy, find-a-therapist, first session → often under Identity & Self-Worth |

**Rule:** No merge/301 until each pair has GSC impressions attached.

---

## E. Entity Consolidation Planning

### Current problem

- **~68 distinct category strings** in `questions_master` → 68 “topic areas” on homepage / llms.txt entity map.
- **~35 entities with ≤2 answers** (Fable estimate — confirm in Supabase export).
- Heavy overlap: multiple anxiety, relationship, work/burnout, teen, grief/trauma variants.
- `entityAliases` in code covers **~12** canonical names only; most entities have **no aliases**.
- Thin hubs pollute llms.txt entity map and JSON-LD `DefinedTerm` nodes without adding graph coherence.

### Proposed target: 22–25 canonical entities

**Draft canonical entity list** (human approval required):

| # | Canonical entity | Merge candidates (aliases / absorb) |
|---|------------------|-------------------------------------|
| 1 | **Anxiety & Stress** | Anxiety & Worry, Anxiety Management, Generalized Anxiety, Social Anxiety, Panic (if separate) |
| 2 | **Depression** | Low Mood, Depressive Symptoms (if separate) |
| 3 | **OCD & Intrusive Thoughts** | Checking compulsions, intrusive thought clusters |
| 4 | **Trauma & PTSD** | Trauma & Triggers, Trauma & Grief (trauma side) |
| 5 | **Grief & Loss** | Bereavement, Complicated Grief |
| 6 | **Addiction & Recovery** | Substance use, Relapse, Sobriety |
| 7 | **Relationships & Communication** | Relationship stress, Conflict, Communication & Conflict |
| 8 | **Relationships & Divorce** | Separation, co-parenting stress |
| 9 | **Family & Parenting** | Parenting, Children & teens (non-teen-specific) |
| 10 | **Teens & Youth** | Teens & Identity, adolescent-specific hubs |
| 11 | **Identity & Self-Worth** | Self-Worth (duplicate label), self-esteem clusters |
| 12 | **Work, Stress & Burnout** | Work & Life Balance, Workplace Mental Health, Work & Burnout variants |
| 13 | **Therapy & Treatment Navigation** | **New canonical** — absorb misfiled therapy/psychedelic/first-session/find-therapist answers |
| 14 | **Medication & Treatment Decisions** | Antidepressant/adjunct topics (non-crisis) |
| 15 | **Sleep & Rest** | Insomnia, sleep anxiety |
| 16 | **General Mental Health** | Catch-all only where no fit; shrink over time |
| 17 | **Eating & Body Image** | If present as distinct cluster |
| 18 | **ADHD & Attention** | If present |
| 19 | **Autism & Neurodiversity** | If present |
| 20 | **LGBTQ+ & Identity** | If present |
| 21 | **Anger & Emotional Regulation** | If present |
| 22 | **Loneliness & Connection** | If present |
| 23 | **Self-Harm & Suicide** (hub label only) | Crisis-adjacent taxonomy — **not** a marketing hub; governance-heavy |
| 24 | **Substance Use & Harm Reduction** | Optional split from Addiction if volume warrants |

**Target after merge:** ~22–24 active canonical entities; ≤3 catch-all buckets.

### Alias strategy

1. **llms.txt:** Extend entity map aliases (format already supports “Aliases: …” per entity).
2. **Code `entityAliases`:** Expand to cover all canonical entities post-merge.
3. **Supabase:** `primary_entities` / `related_entities` fields (already in schema) become authoritative over time; `category` string remains display fallback until migration complete.
4. **Do not rename** category slugs in URLs until redirect table approved.

### Merge candidates (priority order)

1. Anxiety cluster (5 → 1)
2. Work/burnout cluster (4 → 1)
3. Relationship cluster (5 → 2)
4. Grief vs trauma split ( clarify Trauma & Grief split)
5. Self-Worth vs Identity & Self-Worth
6. Teen entities (2 → 1)
7. Thin hubs (<3 answers) → nearest canonical parent

### Human-decision entities

| Decision | Options |
|----------|---------|
| Trauma & Grief combined vs split | Keep combined label vs split trauma/grief |
| Therapy & Treatment Navigation scope | Include psychedelic-adjacent? medication? |
| General Mental Health catch-all | Maximum answer count before forced re-home |
| Self-Harm & Suicide as named hub | YMYL visibility vs consolidation under General + crisis UX |
| `/entities/` URL fate | See Section F |

### Redirect principles

1. **No mass URL changes** before GSC review complete.
2. **Entity hub merges:** 301 `/entities/old-slug/` → `/entities/new-slug/` only when entity URLs have inbound links or impressions (unlikely today — both noindex).
3. **Answer dupes:** 301 loser slug → keeper during v2 upgrade only.
4. **Category slug changes:** 301 old → new when category rename is part of consolidation (high impact — defer until map signed off).
5. **Never 301** a URL with material impressions without capturing pre/post in GSC.

---

## F. `/entities/` vs `/categories/` Decision

### Option 1: Entities = canonical concept nodes; categories = browse indexes

| Pros | Cons |
|------|------|
| Aligns with llms.txt “Entity Map” and JSON-LD `DefinedTerm` | Requires building out entity pages (definition, related entities, curated answers) |
| Supports AI/knowledge-graph positioning | Two hub types to maintain |
| Categories stay simple alphabetical/topic browse | Migration work on breadcrumbs/schema |

**Implementation implications (future — not Phase 0):**

- Categories: keep `noindex`, sitemap-excluded, browse UX.
- Entities: **eventually indexable** when ≥N answers + definition block; add to sitemap selectively.
- Answer breadcrumbs/schema `about` → entity URL; sidebar “Related theme” → entity (not category).
- llms.txt remains entity-centric.

### Option 2: Fold entities into categories; redirect `/entities/*`

| Pros | Cons |
|------|------|
| One hub type; less duplication | Loses explicit “entity map” URL space |
| Matches current UX (breadcrumbs already use categories) | llms.txt entity links need retargeting |
| Simpler indexation policy | Weaker differentiation for AI graph claims |

**Implementation implications:**

- 301 `/entities/` → `/categories/` (or `/topics/` rename).
- llms.txt entity map links → category URLs.
- Remove DefinedTerm entity nodes or point to category URLs.

### Recommendation — **Rick decision (2026-06-11)**

**Option 1 is the chosen strategic direction:** entities become canonical concept nodes; categories remain browse/navigation indexes.

| Surface | Future authority role |
|---------|----------------------|
| `/entities/` | Knowledge-graph layer — definitions, aliases, related concepts, linked answers, AI-search concept authority |
| `/categories/` | User-facing browse layer — navigation and topic discovery, not primary semantic authority |

**Option 2 (fold entities into categories) is rejected** unless Phase 0 data later strongly argues for it.

**Rationale:** llms.txt and Protocol already market an **entity map**. Categories already win today’s UX (breadcrumbs, badges); entities should catch up as the **semantic** source of truth, not be collapsed into browse hubs.

**Implementation gate (unchanged):**

- **Not approved yet:** redirects, URL changes, indexation flips, schema/breadcrumb rewires, sitemap inclusion for entities.
- **Approved for Phase 0:** planning, Supabase category-string consolidation map, alias design, GSC validation.
- Do not index either hub type until entity pages meet enrichment criteria and GSC baseline exists.
- **Do consolidate** category strings in Supabase export/map (data planning only).

---

## G. Graduated Indexation Policy

### Current code behavior (summary)

```text
Answer indexable  ⇔  review_status is empty OR ∈ {approved, published, reviewed}
Category/entity   ⇔  always noindex,follow
/answers/ hub     ⇔  indexable (default)
Sitemap           ⇔  includes indexable static + answer routes; excludes category/entity
```

**Observed live:** Legacy answers carry non-allowlist `review_status` → **`noindex,follow`**.

### Recommended `review_status` policy

| Status | Meaning | Robots | Sitemap |
|--------|---------|--------|---------|
| *(unset)* | Legacy default — **treat as unreviewed** | `noindex,follow` | Include URL (optional) or exclude until reviewed — **decide Week 0** |
| `draft` / `legacy` | Unreviewed batch content | `noindex,follow` | Exclude or include with low priority |
| `in_review` | Editorially in progress | `noindex,follow` | Exclude |
| `reviewed` / `approved` / `published` | v2 + sources + reviewer (when required) | **index,follow** | Include |
| `blocked` | Quality/legal hold | `noindex,nofollow` | Exclude |

**Code change note (future):** Today empty `review_status` → indexable. Fable + risk posture suggest **inverting default to noindex until reviewed**. That requires a **one-line logic change + DB backfill** — schedule Week 2 after GSC baseline, not Phase 0.

### Pages that should stay noindex (recommended steady state)

| Page type | Rationale |
|-----------|-------------|
| Unreviewed / legacy answers | YMYL quality gate |
| Category hubs (short term) | Browse indexes; duplicate entity surface |
| Entity hubs until rich + consolidated | Thin/tag-cloud risk |
| Admin/test routes | N/A today |
| Risk-blocked answers | Legal/clinical hold |

### Pages that can become indexable

| Page type | Condition |
|-----------|-----------|
| v2 upgraded answers | `review_status ∈ allowlist` + sources + reviewer (if high-risk) |
| `/answers/` hub | Always (primary library entry) |
| `/protocol/`, `/about/` | Always (trust) |
| Entity hubs (Option 1 only) | Post-consolidation, ≥5 answers, definition block, Rick approval |
| Category hubs (Option 2 path) | Maybe index top categories only — defer decision |

### Avoiding accidental legacy indexation

1. **Default-unreviewed = noindex** (recommended code change in Week 2).
2. **Never bulk-set `review_status=approved`** without v2 + sources pass.
3. **Sitemap filter (future):** optionally exclude `noindex` answer URLs from sitemap even if crawlable.
4. **CI check:** answer count + count of `review_status=approved` within expected bands.

### Required GSC checks before flipping indexation

- [ ] Baseline indexed `/answers/*` count
- [ ] List indexed URLs with zero impressions (candidates to stay noindex)
- [ ] List high-impression URLs currently noindex (candidates to upgrade + flip)
- [ ] Confirm no critical duplicate/canonical conflicts
- [ ] Re-run after first 50 upgrades only — not big-bang

---

## H. Trust Layer Sprint

**Goal:** Close gap between Protocol promises and rendered pages **without** softening Protocol.

### Components (implementation backlog — ordered)

| # | Item | Source field / behavior | Acceptance criteria |
|---|------|---------------------------|---------------------|
| 1 | **Source set rendering** | `source_refs` | 2–4 reputable links visible on reviewed answers; structured list + optional `citation_notes` |
| 2 | **Reviewer rendering** | `reviewed_by` | Named reviewer + credentials on reviewed/high-risk answers |
| 3 | **Editorial policy page** | New static route | AI-assisted drafting disclosure, review process, conflict policy, link from footer + answers |
| 4 | **Crisis resources component** | DB `risk_class` **or** expanded heuristic | 988 + emergency guidance on all risk-classed answers; align with Protocol §2 |
| 5 | **Schema refinements** | JSON-LD | Add `reviewedBy` Person, `citation` / `isBasedOn` where sources exist; keep existing graph |
| 6 | **Organization/About linkage** | `/about/` | Founder/entity disambiguation (deeperwebsites.com collision); link from Organization schema |

### Disclosure posture (recommended)

- State clearly: **AI-assisted drafting with human editorial accountability** (Protocol §3 aligned).
- Do not claim clinical endorsement without named reviewer.
- Preserve verbatim: **“Not a substitute for care”** footer/sidebar line everywhere.

### Disclaimers to preserve (do-not-touch)

- “Not a substitute for care” / educational-only boundary
- llms.txt crisis boundary block
- Protocol risk classification section
- Privacy posture link

---

## I. Build Safety / Deployment Hygiene

### Answer-count floor (recommended)

```text
MIN_ANSWERS = 950  # ~95% of ~1,005 expected; tune after Supabase export
```

- Assert at end of `astro build` or dedicated `npm run check:content` script.
- Fail CI if `getQuestions().length < MIN_ANSWERS`.

### Build failure on Supabase fetch error

- **Keep throw on error** (current behavior on Vercel).
- **Change:** missing env in CI/production should **fail**, not return `[]`.

### Content snapshot / cache fallback (recommended)

| Tier | Approach |
|------|----------|
| Short term | Commit **`reports/content-snapshot/count.json`** updated by scheduled export (not full HTML) |
| Medium term | Optional committed JSON snapshot for disaster rebuild (legal review on PII) |
| Long term | Read-only replica or edge cache — out of Phase 0 |

### Branch protection

- **`production/astro`:** PR-only merges, required preview deploy success.
- **GitHub default branch:** stays `production/astro`.

### Git-only deploy discipline

- **Prohibit CLI production deploys** except documented rollback (`dpl_BaKp…` procedure).
- Vercel Production Branch = `production/astro` only.

---

## J. Top-150 Answer Upgrade Method

### Selection criteria (weighted score)

| Factor | Weight | Source |
|--------|--------|--------|
| GSC impressions (16 mo) | 35% | GSC export |
| GSC clicks + CTR | 15% | GSC export |
| Risk / YMYL class | 20% | Supabase `triage` + keyword + future `risk_class` |
| AI citation likelihood | 15% | Heuristic: question clarity, extract length, v2 structure, llms.txt extract quality |
| Business relevance | 10% | Therapy/treatment navigation, care-intent queries |
| Duplicate penalty | −20% | In identified dupe cluster (non-keeper) |

### Output

- **`reports/phase-0/top-150-answers.csv`** — ranked slug list with score components.
- **`reports/phase-0/dupe-merge-queue.csv`** — pairs with keeper/loser + 301 plan.

### Upgrade definition of done (per answer)

- [ ] v2 sections populated (`answer_sections`, `key_takeaways`, etc.)
- [ ] `source_refs` ≥ 2
- [ ] `reviewed_by` set (if risk ≥ medium)
- [ ] `review_status = reviewed`
- [ ] Slug cleaned **only if** loser in dupe merge or slug has pipeline suffix **and** GSC confirms low external links to old slug
- [ ] 301 from old slug when slug changes
- [ ] Spot-check live: indexable, sources visible, crisis component if risk-classed

### Cadence

- **Week 3:** First 50
- **Ongoing:** ~25/week
- **Gate:** Trust layer components deployed before flipping indexation on upgraded batch

---

## K. Recommended Implementation Sequence

### Week 0 — Data and maps (no deploy dependency)

| Deliverable | Owner |
|-------------|-------|
| GSC exports → `reports/phase-0/gsc/` | Rick / SEO |
| Supabase export → `reports/phase-0/supabase/` | Rick / data |
| Entity consolidation map v1 (24 canonical + merge table) | Rick + editor |
| `/entities/` vs `/categories/` decision | Rick |
| Top-150 + dupe queue CSVs | Derived from exports |
| **`review_status` distribution report** | Derived |
| Indexation baseline memo (indexed vs noindex counts) | Derived |

**Exit gate:** Rick signs entity map + hub decision + indexation default policy.

### Week 1 — Trust layer + build safety

| Item | Type |
|------|------|
| Render `source_refs`, `reviewed_by` | Code |
| Editorial policy page | Code + copy |
| Crisis component policy (DB or heuristic v2) | Code |
| Schema `reviewedBy` / citations | Code |
| Answer-count floor + fail-hard missing env | Code |
| Branch protection verified | GitHub |
| **Deploy via PR → preview QA → merge to `production/astro`** | Git |

**Exit gate:** Trust components visible on **one** staged reviewed answer in preview; build fails if answer count drops.

### Week 2 — Entity / category / indexation

| Item | Type |
|------|------|
| Supabase category re-homes (miscategorized therapy cluster) | Content DB |
| Entity merge in data (no URL change yet) | Content DB |
| llms.txt alias updates | Generated at build from data |
| **`shouldIndexQuestion` default flip** (if approved) | Code + DB backfill |
| Optional: entity page enrichment (Option 1) | Code |

**Exit gate:** GSC re-baseline 2 weeks after first indexation flips (not same day).

### Week 3 — First 50 upgrades

| Item | Type |
|------|------|
| 50 answers upgraded to v2 + sources + reviewer | Content pipeline |
| 3–5 dupe merges with 301 | Content + redirect config |
| Index flip for upgraded slugs only | DB `review_status` |

### Ongoing

- ~25 answers/week upgraded
- Monthly GSC + llms.txt parity check (URL count ~1,030)
- Quarterly entity map review

---

## L. Do-Not-Touch List

| Item | Reason |
|------|--------|
| **llms.txt structure and section order** | AI retrieval asset; extend only |
| **v2 answer template shape** | Apply broadly; do not redesign yet |
| **URLs with GSC impressions/citations** | Until upgrade merge plan exists |
| **`production/astro` Git-only governance** | Recovery lesson |
| **Live Vercel settings** (branch, Astro, env) | Stable post-cutover |
| **Risk-classed pages without clinical review** | YMYL |
| **“Not a substitute for care” language** | Required posture |
| **Mass slug migration** | Only per-answer during upgrade |
| **CLI `--prod` deploys** | Rollback doc only |

---

## M. Open Questions for Rick

1. **GSC access:** Can you export Pages (performance + indexing) for `/answers/*` and share to `reports/phase-0/`? Without this, top-150 and indexation flip are blocked.

2. **Clinician reviewer:** Is a named LPC/clinical reviewer available (even part-time) for high-risk + top-150 answers?

3. **Deeper conversion role:** When should brand attribution expand vs therapist-finder bridge vs email capture? (Recommendation: attribution now; bridges after trust layer.)

4. **Entity vs category decision:** **Resolved for planning** — Option 1 (entities = concept nodes, categories = browse). Confirm after GSC/Supabase export if data contradicts.

5. **Disclosure posture:** Approve explicit AI-assisted drafting language on editorial policy page?

6. **Indexation default flip:** Approve changing code so **empty `review_status` = noindex** (safer) vs today (**empty = index**)? Requires DB audit.

7. **Budget/time for top-150:** Weeks of editor/clinical time — in-house, contractor, or phased over quarters?

8. **Supabase content edits in Phase 1:** Confirm content pipeline ownership (who runs category re-homes and `review_status` updates).

---

## Appendix: Related repo artifacts

| Artifact | Path |
|----------|------|
| Indexation priority script (stale GSC path) | `scripts/generate-indexation-priority.mjs` |
| Platform cutover plan | `docs/deeper-platform-alignment-cutover-plan.md` |
| Platform execution log | `docs/deeper-platform-alignment-execution-log.md` |
| Production cutover log | `docs/deeper-production-cutover-log.md` |
| Rollback deployment | `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` |

---

**End of Phase 0 plan. Nothing implemented. No deploy authorized.**
