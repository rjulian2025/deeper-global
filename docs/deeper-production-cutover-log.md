# Deeper Global — Git-Governed Production Cutover Log

**Date:** 2026-06-11  
**Branch:** `production/astro`  
**Cutover type:** First Git-governed production deployment  
**Vercel project:** `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`)

---

## Pre-cutover state

| Item | Value |
|------|-------|
| GitHub default branch | `production/astro` |
| Vercel Production Branch | `production/astro` |
| Framework / build | Astro / `npm install` / `npm run build` / `dist` |
| Prior live production deployment | **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`** (CLI-sourced) |
| Rollback target | **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`** |
| Origin tip before push | `eb5cf8b` |
| Local HEAD pushed | **`38d4fc8`** |

### Commits pushed (documentation-only)

| Commit | Message |
|--------|---------|
| `4388170` | Document Vercel branch visibility issue |
| `38d4fc8` | Document Vercel Git reconnection and production branch |

Runtime source unchanged since last **36/36 preview QA** at `d1e19e8`.

---

## Push and deployment

| Step | Result |
|------|--------|
| `git push origin production/astro` | **Success** (`eb5cf8b..38d4fc8`) |
| Trigger | Git push to Vercel Production Branch |
| `vercel --prod` used? | **No** |
| Manual promote? | **No** |

### New production deployment

| Field | Value |
|-------|-------|
| **Deployment ID** | **`dpl_3rtTXesrfc9Bq3AipfmUmuaDrGcZ`** |
| Deployment URL | `deeper-global-h65m-gnjfzi8je-gps4.vercel.app` |
| Commit deployed | **`38d4fc822a2e757aee28f6862439974812cc2421`** |
| Git ref | `production/astro` |
| Build status | **READY** (success) |
| Build duration | **~19 seconds** |
| Target | `production` |
| Production aliases assigned | **Yes** — includes `www.deeper.global`, `deeper.global` |
| Deployment timestamp (created) | `1781199199613` (Vercel API) |

---

## Post-deploy QA — `https://www.deeper.global`

**Result: 22 / 22 PASS**

| Check | Result |
|-------|--------|
| Homepage HTTP 200 | PASS |
| `/answers/` HTTP 200 | PASS |
| `/answers/how-do-i-know-if-i-need-therapy/` HTTP 200 | PASS |
| `/answers/what-should-i-do-if-im-having-suicidal-thoughts/` HTTP 200 + crisis banner | PASS |
| `/entities/` HTTP 200 | PASS |
| `/llms.txt` HTTP 200 | PASS |
| `/sitemap-index.xml` HTTP 200 | PASS |
| `/sitemap-0.xml` HTTP 200 | PASS |
| Sitemap URL count **1,030** | PASS |
| Sitemap excludes `/entities/*` and `/categories/*` | PASS |
| `llms.txt` uses `www.deeper.global` URLs (~1,080 refs) | PASS |
| `llms.txt` zero apex-only URLs | PASS |
| Canonicals use `https://www.deeper.global/` | PASS |
| Hubs indexable (`/answers/`) | PASS |
| Answer pages `noindex,follow` | PASS |
| Entity hub `noindex,follow` | PASS |
| Hero image present | PASS |
| Favicon loads (200) | PASS |
| CSS loads (`/_astro/BaseLayout.DHHP_8JI.css`) | PASS |
| Homepage byte size ~12,180 (actual: 12,019) | PASS |

### Parity signals vs prior preview QA

| Signal | Expected | Production |
|--------|----------|------------|
| Homepage bytes | ~12,180 | 12,019 |
| CSS bundle | `BaseLayout.DHHP_8JI.css` | `BaseLayout.DHHP_8JI.css` |
| Sitemap URLs | 1,030 | 1,030 |
| `llms.txt` www refs | ~1,080 | 1,080 |

---

## Rollback

| Item | Value |
|------|-------|
| Rollback deployment ID | **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`** |
| Rollback executed? | **No** — QA passed |
| Dashboard rollback | Deployments → `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` → Promote to Production |
| CLI rollback | `vercel rollback dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2 --scope gps4` |

---

## Cutover summary

| Question | Answer |
|----------|--------|
| First Git-governed production deploy? | **Yes** |
| Push succeeded? | **Yes** |
| Production build succeeded? | **Yes** |
| `www.deeper.global` moved to new deployment? | **Yes** → `dpl_3rtTXesrfc9Bq3AipfmUmuaDrGcZ` |
| Post-deploy QA | **22/22 PASS** |
| Rollback needed? | **No** |
| Second push after cutover? | **No** (cutover log committed locally only) |
