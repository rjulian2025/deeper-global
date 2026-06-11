# Deeper Global — Final Pre-Alignment Preview QA Log

**Date:** 2026-06-11  
**Branch:** `codex/deeper-global-astro-v1`  
**Commit:** `1c840bb` — *Document Deeper platform alignment cutover plan*  
**App path:** repo root  
**Vercel project:** `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`)  
**Purpose:** Final preview validation before GitHub/Vercel platform alignment

---

## ⚠️ NO PRODUCTION DEPLOY

Preview-only session. Production (`www.deeper.global`) was **not** updated. Do not run `vercel --prod` or promote this deployment.

---

## Local build (repo root @ `1c840bb`)

| Step | Result | Notes |
|------|--------|-------|
| `npm install` | **PASS** | Dependencies installed |
| `npm run build` | **PASS** | **1,168 pages** in ~4.0s |
| `npm run check` | **PASS** | Astro build check succeeded |

### Local `dist/` verification

| Check | Result |
|-------|--------|
| `/llms.txt` | **PASS** |
| `/entities/` | **PASS** |
| `/sitemap-index.xml` | **PASS** |
| `/sitemap-0.xml` | **PASS** |
| `/answers/` routes | **PASS** |
| Sitemap URL count | **PASS** — **1,030** URLs |
| `_archive/` in output | **PASS** — 0 paths |

---

## Vercel preview deployment

| Field | Value |
|-------|-------|
| **Preview URL** | https://deeper-global-h65m-kyqlk7c5m-gps4.vercel.app |
| **Deployment ID** | `dpl_6cSMneVCB8ZyoSq4DXD2o8LwGZFv` |
| **Inspector** | https://vercel.com/gps4/deeper-global-h65m/6cSMneVCB8ZyoSq4DXD2o8LwGZFv |
| **Target** | `preview` |
| **Production aliases** | **None** |
| **Build duration** | ~29s on Vercel |
| **Deploy cwd** | Repo root |
| **`vercel --prod` used?** | **No** |

### Commands

```bash
git checkout codex/deeper-global-astro-v1
git pull --ff-only origin codex/deeper-global-astro-v1
npm install && npm run build && npm run check
vercel --yes    # preview only — NOT vercel --prod
```

Project link confirmed: `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`).

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

## Sample content pages (4)

| Page | Path | Result |
|------|------|--------|
| Therapy answer | `/answers/how-do-i-know-if-i-need-therapy/` | **PASS** |
| Crisis answer | `/answers/what-should-i-do-if-im-having-suicidal-thoughts/` | **PASS** + crisis banner |
| Entity detail | `/entities/anxiety-and-stress/` | **PASS** |
| Category detail | `/categories/anxiety-and-stress/` | **PASS** |

---

## SEO / indexation (12)

| Check | Result |
|-------|--------|
| Homepage canonical `www.deeper.global` | **PASS** |
| Answers hub canonical | **PASS** |
| Homepage indexable | **PASS** |
| Answers hub indexable | **PASS** |
| Therapy answer canonical | **PASS** |
| Therapy answer `noindex,follow` | **PASS** |
| Crisis answer canonical | **PASS** |
| Crisis answer `noindex,follow` | **PASS** |
| Categories hub `noindex,follow` | **PASS (expected)** |
| Entities hub `noindex,follow` | **PASS (expected)** |
| Category detail `noindex,follow` | **PASS (expected)** |
| Entity detail `noindex,follow` | **PASS (expected)** |

---

## Assets & CSS (4)

| Check | Result |
|-------|--------|
| Hero image | **PASS** |
| Favicon `.ico` / `.svg` | **PASS** |
| CSS bundle `BaseLayout.DHHP_8JI.css` | **PASS** |
| No broken CSS reference | **PASS** |

---

## Sitemap & llms.txt (5)

| Check | Result |
|-------|--------|
| Sitemap URL count | **PASS** — 1,030 |
| Excludes `/entities/*` | **PASS** |
| Excludes `/categories/*` | **PASS** |
| llms.txt www URLs | **PASS** — 1,080 refs |
| Zero apex-only URLs | **PASS** |

---

## Comparison vs previous root preview (`production/astro-root` @ `b4a1ac0`)

| Metric | Previous (`dpl_2cXEsAwiRKwbHWWb18XSzKe81F7r`) | This run (`dpl_6cSMneVCB8ZyoSq4DXD2o8LwGZFv`) | Match? |
|--------|-----------------------------------------------|-----------------------------------------------|--------|
| Preview URL | `10wz9r1le-gps4.vercel.app` | `kyqlk7c5m-gps4.vercel.app` | N/A |
| Homepage bytes | 12,180 | 12,180 | **Yes** |
| Sitemap URLs | 1,030 | 1,030 | **Yes** |
| CSS bundle | `BaseLayout.DHHP_8JI.css` | `BaseLayout.DHHP_8JI.css` | **Yes** |
| llms www refs | 1,080 | 1,080 | **Yes** |
| QA score | 36/36 | 36/36 | **Yes** |

**Parity verdict:** Governed branch tip (`1c840bb`) matches prior root preview on all compared signals. Documentation-only delta since last preview does not affect build output.

---

## QA summary

| Category | Pass | Fail |
|----------|------|------|
| Core routes | 11 | 0 |
| Sample pages | 4 | 0 |
| SEO / indexation | 12 | 0 |
| Assets / CSS | 4 | 0 |
| Sitemap / llms.txt | 5 | 0 |

**Overall: 36 / 36 checks passed**

---

## Safety confirmations

| Item | Status |
|------|--------|
| Production `www.deeper.global` | **Untouched** |
| GitHub `main` | **Untouched** |
| Vercel dashboard settings | **Untouched** |
| GitHub default branch | **Untouched** |
| `vercel --prod` | **Not used** |

---

## Recommendation

**Safe to proceed** with platform alignment planning execution when explicitly approved (see [`deeper-platform-alignment-cutover-plan.md`](./deeper-platform-alignment-cutover-plan.md)).

Pre-alignment gate satisfied:

- Fresh local build from `1c840bb` ✅
- Fresh Vercel preview from repo root ✅
- 36/36 QA ✅
- Parity with prior root preview ✅

**Do not align GitHub/Vercel settings or deploy production without explicit cutover approval.**

---

## Related documents

- [`deeper-platform-alignment-cutover-plan.md`](./deeper-platform-alignment-cutover-plan.md)
- [`deeper-root-preview-qa-log.md`](./deeper-root-preview-qa-log.md)
- [`deeper-preview-qa-log.md`](./deeper-preview-qa-log.md)

---

**Reminder: Preview only. No production promote.**
