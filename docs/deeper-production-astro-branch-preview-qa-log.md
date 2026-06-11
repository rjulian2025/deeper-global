# Deeper Global — Production Astro Branch Preview QA Log

**Date:** 2026-06-11  
**Branch:** `production/astro`  
**Commit:** `d1e19e8` — *Document final prealignment preview QA*  
**App path:** repo root  
**Vercel project:** `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`)  
**Purpose:** Validate the clean long-term production branch name before platform alignment

---

## ⚠️ NO PRODUCTION DEPLOY

Preview-only session. Production (`www.deeper.global`) was **not** updated.

---

## Local build (repo root @ `d1e19e8`)

| Step | Result | Notes |
|------|--------|-------|
| `npm install` | **PASS** | |
| `npm run build` | **PASS** | **1,168 pages** |
| `npm run check` | **PASS** | |

| Local artifact | Result |
|----------------|--------|
| `/llms.txt`, `/entities/`, sitemaps, `/answers/` | **PASS** |
| Sitemap URL count | **PASS** — 1,030 |
| `_archive/` in `dist/` | **PASS** — 0 paths |

---

## Vercel preview deployment

| Field | Value |
|-------|-------|
| **Preview URL** | https://deeper-global-h65m-cn0fo197k-gps4.vercel.app |
| **Deployment ID** | `dpl_78kdUzqRe611uhTa23dWn9AaVKfA` |
| **Inspector** | https://vercel.com/gps4/deeper-global-h65m/78kdUzqRe611uhTa23dWn9AaVKfA |
| **Target** | `preview` |
| **Production aliases** | **None** |
| **`vercel --prod` used?** | **No** |

Project link: `deeper-global-h65m` confirmed at repo root.

---

## Route checks (11)

| Path | Result |
|------|--------|
| `/` | **PASS** |
| `/llms.txt` | **PASS** |
| `/entities/` | **PASS** |
| `/sitemap-index.xml` | **PASS** |
| `/sitemap-0.xml` | **PASS** |
| `/answers/` | **PASS** |
| `/categories/` | **PASS** |
| `/favicon.ico` | **PASS** |
| `/favicon.svg` | **PASS** |
| `/images/deeper-hero-reader-1200.webp` | **PASS** |
| `/_astro/BaseLayout.DHHP_8JI.css` | **PASS** |

---

## Sample pages (4)

| Page | Result |
|------|--------|
| `/answers/how-do-i-know-if-i-need-therapy/` | **PASS** |
| `/answers/what-should-i-do-if-im-having-suicidal-thoughts/` | **PASS** + crisis banner |
| `/entities/anxiety-and-stress/` | **PASS** |
| `/categories/anxiety-and-stress/` | **PASS** |

---

## SEO / indexation (12)

| Check | Result |
|-------|--------|
| Homepage canonical `www.deeper.global` | **PASS** |
| Answers hub canonical | **PASS** |
| Homepage indexable | **PASS** |
| Answers hub indexable | **PASS** |
| Therapy answer `noindex,follow` | **PASS** |
| Crisis answer `noindex,follow` | **PASS** |
| Categories hub `noindex,follow` | **PASS (expected)** |
| Entities hub `noindex,follow` | **PASS (expected)** |
| Category detail `noindex,follow` | **PASS (expected)** |
| Entity detail `noindex,follow` | **PASS (expected)** |
| Answer canonicals use www | **PASS** |
| Primary hubs indexable | **PASS** |

---

## Assets & CSS (4)

| Check | Result |
|-------|--------|
| Hero image | **PASS** |
| Favicons | **PASS** |
| CSS `BaseLayout.DHHP_8JI.css` | **PASS** |
| No broken CSS ref | **PASS** |

---

## Sitemap & llms.txt (5)

| Check | Result |
|-------|--------|
| 1,030 sitemap URLs | **PASS** |
| Excludes `/entities/*` | **PASS** |
| Excludes `/categories/*` | **PASS** |
| llms.txt www URLs (1,080) | **PASS** |
| Zero apex-only URLs | **PASS** |

---

## Comparison vs final prealignment preview (`codex/deeper-global-astro-v1` @ `d1e19e8`)

| Metric | Prealignment (`dpl_6cSMneVCB8ZyoSq4DXD2o8LwGZFv`) | This run (`dpl_78kdUzqRe611uhTa23dWn9AaVKfA`) | Match? |
|--------|---------------------------------------------------|-----------------------------------------------|--------|
| Branch | `codex/deeper-global-astro-v1` | `production/astro` | Same commit |
| Commit | `d1e19e8` | `d1e19e8` | **Yes** |
| Homepage bytes | 12,180 | 12,180 | **Yes** |
| Sitemap URLs | 1,030 | 1,030 | **Yes** |
| CSS bundle | `BaseLayout.DHHP_8JI.css` | `BaseLayout.DHHP_8JI.css` | **Yes** |
| QA score | 36/36 | 36/36 | **Yes** |

**Parity verdict:** `production/astro` at `d1e19e8` is identical to the validated codex tip. Branch rename introduces no build or preview regression.

---

## QA summary

**Overall: 36 / 36 checks passed**

---

## Safety confirmations

| Item | Status |
|------|--------|
| Production `www.deeper.global` | **Untouched** |
| GitHub `main` | **Untouched** |
| GitHub default branch | **Untouched** (still `main`) |
| Vercel settings | **Untouched** |
| `vercel --prod` | **Not used** |

---

## Recommendation

**Safe to proceed** with platform alignment using `production/astro` as the target Production Branch and future default branch, when explicitly approved per [`deeper-platform-alignment-cutover-plan.md`](./deeper-platform-alignment-cutover-plan.md).

---

## Related documents

- [`deeper-final-prealignment-preview-qa-log.md`](./deeper-final-prealignment-preview-qa-log.md)
- [`deeper-platform-alignment-cutover-plan.md`](./deeper-platform-alignment-cutover-plan.md)
- [`deeper-root-preview-qa-log.md`](./deeper-root-preview-qa-log.md)

---

**Reminder: Preview only. No production promote.**
