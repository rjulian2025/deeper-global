# Deeper Phase 1A — hosted preview QA log

**Date:** 2026-06-13  
**Branch:** `production/astro`  
**Commit under test:** `9a4dbab` — Add Deeper trust layer foundation and authority data audit  
**Preview URL:** https://deeper-global-h65m-j7shze8m3-gps4.vercel.app  
**Deployment ID:** `dpl_H7HDLnmiq38gUgHDxMnywDtfbKSA`  
**Deployment target:** preview (not production)  
**Vercel user:** `rjulian2025` (team `gps4`)

## QA method

1. **Unauthenticated check:** plain `curl` to preview URL → **401** (deployment protection active, as expected).
2. **Authenticated check:** Vercel CLI `vercel curl <path> --deployment <preview-url> -- -sS -o …` which applies automatic deployment-protection bypass for the logged-in Vercel account.
3. **Assertions:** HTTP status, HTML/meta content, JSON-LD, sitemap XML, and asset loading on fetched bodies.

No Vercel settings were changed. No production deploy or promotion was performed.

## Local state verified

| Check | Result |
| --- | --- |
| Branch | `production/astro` |
| Pending commit | `9a4dbab Add Deeper trust layer foundation and authority data audit` |
| Ahead of `origin/production/astro` | 1 commit (Phase 1A implementation) |
| Working tree | clean before QA doc commit |

## Pages fetched (all HTTP 200 via `vercel curl`)

| Path | Purpose |
| --- | --- |
| `/` | Homepage |
| `/answers/` | Answers hub |
| `/editorial-policy/` | New editorial policy page |
| `/answers/how-do-i-know-if-i-need-therapy/` | Draft answer (no trust fields) |
| `/answers/what-should-i-do-if-im-having-suicidal-thoughts/` | Crisis-sensitive answer |
| `/answers/i-cannot-stop-checking-if-i-locked-the-door-before-leaving/` | Reviewed/indexable answer (audit-identified) |
| `/llms.txt` | LLM discovery file |
| `/sitemap-index.xml` | Sitemap index |
| `/sitemap-0.xml` | Primary sitemap |
| `/favicon.ico` | Favicon asset |
| `/_astro/BaseLayout.DHHP_8JI.css` | CSS bundle from draft answer |
| `/categories/depression/` | Category hub routing |
| `/entities/depression/` | Entity hub routing |

## Pass/fail checklist

| # | Check | Result | Notes |
| --- | --- | --- | --- |
| 1 | Homepage HTTP 200 | **PASS** | |
| 2 | `/answers/` HTTP 200 | **PASS** | |
| 3 | `/editorial-policy/` HTTP 200 | **PASS** | |
| 4 | Editorial policy indexable (no `noindex`) | **PASS** | |
| 5 | Draft answer `noindex,follow` | **PASS** | therapy slug |
| 6 | Reviewed answer indexable (no `noindex`) | **PASS** | OCD checking slug |
| 7 | Reviewed answer shows `reviewed_by` | **PASS** | `codex-seo-review` from DB |
| 8 | Reviewed answer shows `source_refs` links | **PASS** | NIMH + IOCDF sources rendered |
| 9 | Draft answer does not invent reviewer | **PASS** | no “Reviewed by” in body |
| 10 | Draft answer does not render sources panel | **PASS** | no rendered `<div class="trust-sources">` |
| 11 | Draft shows neutral editorial trust statement | **PASS** | links to `/editorial-policy/` |
| 12 | Crisis answer shows 988 | **PASS** | `tel:988` |
| 13 | Crisis answer shows international/local guidance | **PASS** | “Outside the U.S., contact your local crisis helpline…” |
| 14 | “Not a substitute for care” preserved | **PASS** | draft + crisis |
| 15 | JSON-LD `reviewedBy` only when data exists | **PASS** | present on reviewed; absent on draft |
| 16 | JSON-LD `citation` URLs only when `source_refs` exist | **PASS** | NIMH URLs on reviewed; no external citation array on draft |
| 17 | Sitemap URL count | **PASS** | **1,031** `<loc>` entries |
| 18 | `/entities/` excluded from sitemap | **PASS** | 0 entity URLs |
| 19 | `/categories/` excluded from sitemap | **PASS** | 0 category URLs |
| 20 | `llms.txt` structure unchanged | **PASS** | byte-identical to local build output |
| 21 | CSS bundle loads HTTP 200 | **PASS** | `/_astro/BaseLayout.DHHP_8JI.css` |
| 22 | Favicon loads HTTP 200 | **PASS** | |
| 23 | Category hub routing unchanged | **PASS** | `/categories/depression/` 200, `noindex,follow` |
| 24 | Entity hub routing unchanged | **PASS** | `/entities/depression/` 200, `noindex,follow` |
| 25 | No redirects on key paths | **PASS** | `/`, draft answer, editorial policy → direct 200 |
| 26 | Footer editorial policy link present | **PASS** | on draft answer page |

**Hosted QA pass count: 26/26**

## Sitemap count

- **`/sitemap-0.xml`:** 1,031 URLs
- **Delta vs pre-Phase-1A (~1,030):** +1 from new `/editorial-policy/` page (expected additive page, not a redirect)

## Indexation behavior observed

| Page type | Robots meta |
| --- | --- |
| Draft answer (`how-do-i-know-if-i-need-therapy`) | `noindex,follow` |
| Reviewed answer (`i-cannot-stop-checking-if-i-locked-the-door-before-leaving`) | indexable (no `noindex`) |
| Editorial policy | indexable |
| Category / entity hubs | `noindex,follow` (unchanged) |

Broad indexation logic was **not** changed in Phase 1A.

## Trust panel behavior observed

| Answer | `reviewed_by` | `source_refs` | UI |
| --- | --- | --- | --- |
| Draft therapy answer | empty | empty | Neutral editorial statement + policy/protocol links |
| Reviewed OCD answer | `codex-seo-review` | 2 refs | Reviewer line + linked sources with publishers |
| Crisis suicidal-thoughts answer | empty | empty | Neutral statement + crisis banner (988 + intl) |

No false clinical review or citation claims on draft pages.

## Differences vs local preview

| Area | Hosted preview | Local preview (`npm run preview`) |
| --- | --- | --- |
| Trust panel / indexation / crisis banner | Same | Same |
| `llms.txt` | Byte-identical to local `dist/llms.txt` | — |
| Sitemap count | 1,031 | 1,031 (local build) |
| Access | Requires Vercel auth / `vercel curl` | Open on localhost |

No functional regressions observed between hosted and local preview.

## Preview auth / bypass

| Method | Result |
| --- | --- |
| Unauthenticated browser/curl | **401** |
| `vercel curl --deployment <preview-url>` (logged-in CLI) | **200** on all tested paths |

Bypass worked via Vercel CLI authenticated curl. No protection settings were modified.

## Recommendation

**Safe to push** `production/astro` (commits `9a4dbab` + this QA doc) for Git-governed preview/production pipeline review.

Phase 1A changes behave as intended on hosted preview: trust fields render only when present, crisis support improved, editorial policy added, indexation unchanged, no routing/redirect changes, sitemap + llms stable aside from expected editorial-policy addition.

**Do not promote this preview to production without explicit approval** (per sprint rules).
