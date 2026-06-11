# Deeper Global — Preview QA Log

**Date:** 2026-06-11  
**Branch:** `production/astro-v1-recovered`  
**Commit:** `c5a1ac7` — *Recover live Astro production source*  
**App path:** `Documents/New project/`  
**Vercel project:** `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`)

---

## ⚠️ NO PRODUCTION DEPLOY

This session created a **preview-only** deployment. Production was **not** updated. Do not run `vercel --prod`, promote this deployment, or merge to `main`.

---

## Deployment details

| Field | Value |
|-------|-------|
| **Preview URL** | https://deeper-global-h65m-bgnfp9nya-gps4.vercel.app |
| **Deployment ID** | `dpl_BthFdebMjhxW183G5xfHp8zucVGy` |
| **Inspector** | https://vercel.com/gps4/deeper-global-h65m/BthFdebMjhxW183G5xfHp8zucVGy |
| **Target** | `preview` (confirmed via `vercel inspect`) |
| **Production aliases** | **None** — `www.deeper.global` / `deeper.global` not assigned |
| **Build duration** | ~48s on Vercel (iad1) |
| **`vercel --prod` used?** | **No** |

### Commands executed

```bash
cd /Users/rickjulian/deeper-global-production
git branch --show-current   # production/astro-v1-recovered
git log -1 --oneline        # c5a1ac7 Recover live Astro production source.

cd "/Users/rickjulian/deeper-global-production/Documents/New project"
vercel link --yes --project deeper-global-h65m
vercel --yes                  # preview only — NOT vercel --prod
```

**Link result:** `Linked to gps4/deeper-global-h65m (created .vercel)`

---

## Deployment protection note

The preview URL is behind **Vercel Deployment Protection** (SSO/auth wall for unauthenticated browser visitors).

QA in this session used authenticated **`vercel curl`** from the linked project directory (CLI auto-generated a protection bypass token). Human browser QA may require Vercel team login or a bypass token.

---

## Route checks

| Path | Result | Notes |
|------|--------|-------|
| `/` | **PASS** | Homepage HTML, 1,005 answers shown in hero stats |
| `/llms.txt` | **PASS** | Plain text, ~738 KB |
| `/entities/` | **PASS** | Entity index HTML |
| `/sitemap-index.xml` | **PASS** | Valid sitemap index |
| `/sitemap-0.xml` | **PASS** | Valid urlset |
| `/answers/` | **PASS** | Answers hub HTML |
| `/categories/` | **PASS** | Categories hub HTML |
| `/favicon.ico` | **PASS** | 959 bytes |
| `/favicon.svg` | **PASS** | 288 bytes |
| `/images/deeper-hero-reader-1200.webp` | **PASS** | ~21 KB WEBP |
| `/_astro/BaseLayout.DHHP_8JI.css` | **PASS** | ~13 KB CSS bundle |

---

## Sample content pages

| Page | Path | Result | Notes |
|------|------|--------|-------|
| Therapy answer | `/answers/how-do-i-know-if-i-need-therapy/` | **PASS** | Full answer content loads |
| Crisis answer | `/answers/what-should-i-do-if-im-having-suicidal-thoughts/` | **PASS** | Crisis banner present (`data-risk-class="crisis-sensitive"`) |
| Entity detail | `/entities/anxiety-and-stress/` | **PASS** | Loads with expected robots/canonical |
| Category detail | `/categories/anxiety-and-stress/` | **PASS** | Loads with expected robots/canonical |

---

## SEO / indexation checks

| Check | Result | Detail |
|-------|--------|--------|
| Homepage canonical | **PASS** | `https://www.deeper.global/` |
| Answers hub canonical | **PASS** | `https://www.deeper.global/answers/` |
| Homepage indexable | **PASS** | No `noindex` meta |
| Answers hub indexable | **PASS** | No `noindex` meta |
| Answer page canonical | **PASS** | Uses `https://www.deeper.global/answers/.../` |
| Therapy answer `noindex,follow` | **PASS** | Present — `review_status` not in approved/published/reviewed set |
| Crisis answer `noindex,follow` | **PASS** | Present + crisis banner |
| Categories hub `noindex,follow` | **PASS (expected)** | Intentional per `src/pages/categories/index.astro` |
| Entities hub `noindex,follow` | **PASS (expected)** | Intentional per `src/pages/entities/index.astro` |
| Category detail `noindex,follow` | **PASS (expected)** | Intentional per `src/pages/categories/[category].astro` |
| Entity detail `noindex,follow` | **PASS (expected)** | Intentional per `src/pages/entities/[entity].astro` |
| Primary hubs indexable | **PASS** | `/` and `/answers/` remain indexable; `/categories/` and `/entities/` are utility hubs excluded from sitemap by design |

---

## Assets & styling

| Check | Result | Detail |
|-------|--------|--------|
| Hero image | **PASS** | `/images/deeper-hero-reader-1200.webp` serves valid WEBP |
| Favicon | **PASS** | `.ico` and `.svg` both serve |
| CSS bundle | **PASS** | `/_astro/BaseLayout.DHHP_8JI.css` loads (same hash as live recovery) |
| Broken CSS | **PASS** | No missing stylesheet references observed on sampled pages |

---

## Sitemap & llms.txt

| Check | Result | Detail |
|-------|--------|--------|
| Sitemap URL count | **PASS** | **1,030** `<loc>` entries in `/sitemap-0.xml` (matches local/live parity target) |
| Sitemap excludes `/entities/*` | **PASS** | 0 entity URLs in sitemap |
| Sitemap excludes `/categories/*` | **PASS** | 0 category URLs in sitemap |
| Answer URLs in sitemap | **PASS** | ~1,026 answer paths |
| llms.txt uses `www.deeper.global` | **PASS** | 1,080 `https://www.deeper.global` references; 0 apex-only URLs |

---

## Errors / mismatches

| Item | Severity | Notes |
|------|----------|-------|
| Deployment protection on preview URL | **Info** | Direct browser access requires Vercel auth; use `vercel curl` or team login for QA |
| Canonicals point to production domain | **Info (expected)** | `astro.config.mjs` / `src/lib/site.ts` hardcode `https://www.deeper.global` — correct for parity testing of HTML, not preview hostname |
| `/categories/` and `/entities/` hubs are `noindex` | **Info (expected)** | Matches source code and live sitemap exclusion policy; primary content hubs `/` and `/answers/` remain indexable |
| `.vercel/` link directory created | **Info** | Created by `vercel link` in `Documents/New project/` (gitignored) |

No build failures, missing routes, or broken asset errors were observed.

---

## QA summary

| Category | Pass | Fail | Notes |
|----------|------|------|-------|
| Core routes | 11 | 0 | |
| Sample pages | 4 | 0 | |
| SEO / indexation | 12 | 0 | All behaviors match recovered source intent |
| Assets / CSS | 4 | 0 | |
| Sitemap / llms.txt | 5 | 0 | |

**Overall:** **36 / 36 checks passed** (including expected `noindex` on category/entity surfaces).

---

## Recommendation

**Safe to continue** with recovery work (PR review, optional hoist planning, further parity spot-checks against live).

**Do not deploy to production** until:

1. Explicit stakeholder approval
2. Root Directory / hoist strategy decided
3. Full side-by-side live vs preview QA on a representative slug set

This preview confirms the recovered nested source **builds and serves correctly on Vercel** with existing Preview env vars and appears **preview-parity safe** relative to prior local build validation.

---

## Related documents

- [`deeper-preview-readiness.md`](./deeper-preview-readiness.md)
- [`deeper-production-parity-recovery-log.md`](./deeper-production-parity-recovery-log.md)

---

**Reminder: Preview deployment only. No production promote. No merge.**
