# Deeper Global Production Recovery Notes

**Date:** 2026-06-11  
**Branch audited:** `production/astro-v1-recovered` (based on `origin/codex/deeper-global-astro-v1`)  
**Repo:** `rjulian2025/deeper-global`  
**Live domain:** `www.deeper.global` / `deeper.global`  
**Vercel project:** `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`)

---

## ⚠️ NO-DEPLOY WARNING

**Do not deploy, push, or change Vercel settings based on this document alone.**

This is a recovery **planning** artifact only. The recovered git source is **not** byte-for-byte parity with live production. Hoisting and any subsequent deploy must wait until parity gaps are closed and QA passes on a preview deployment.

---

## 1. Is `Documents/New project/` the likely live source?

**Verdict: closest git-tracked Astro lineage — yes; exact live production source — no.**

| Evidence | Finding |
|----------|---------|
| Vercel project `deeper-global-h65m` serves `www.deeper.global` | Confirmed via Vercel API |
| Latest production build (`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`) | Runs `deeper-global@1.0.0` → `astro build` — matches `Documents/New project/package.json` |
| Live HTML | Astro assets (`/_astro/BaseLayout.*.css`), same route surface, same Supabase-driven slugs |
| Git commit on branch | `4ef2a69` — "Build Astro v1 intelligence layer" — adds exactly this tree under `Documents/New project/` |
| Parity | Live site has substantial UI/SEO/features **not present** in recovered source (see §3) |
| Deploy mechanism | Recent production deploys are **`source: cli`** with `meta.actor: codex`; several earlier Astro deploys show **`gitDirty: 1`** on commit `4ef2a69` |

**Conclusion:** `Documents/New project/` is the best **git-recovered anchor** for the Astro app that powers production, but live production almost certainly includes **uncommitted or CLI-only changes** beyond what is in this branch. Treat recovered source as v1 scaffold, not a full production snapshot.

**Repo root today is not an app root.** It contains only:

```
deeper-global-production/
├── Desktop/qv-brand-alchemy-main/   # unrelated QV Brands Astro/React project
├── deeper2/deeper-global/         # older Next.js prototype
└── Documents/New project/         # recovered Astro v1 app
```

GitHub `main` is a **Next.js** app at repo root (not Astro, not nested). Production Astro was deployed outside normal git-to-Vercel flow.

---

## 2. Audit checklist — what exists in `Documents/New project/`

| Item | Present? | Location / notes |
|------|----------|------------------|
| `astro.config.mjs` | ✅ | `site: 'https://deeper.global'`, `@astrojs/sitemap` |
| `src/` | ✅ | pages, layouts, components, lib |
| `public/` | ❌ | **Missing** — live uses `/images/`, `/favicon.svg`, etc. |
| `scripts/` | ❌ | **Missing** — not in this tree (main branch Next app has `scripts/` separately) |
| `llms.txt` | ✅ | `src/pages/llms.txt.ts` (dynamic route) |
| `/entities` route | ✅ | `src/pages/entities/index.astro`, `[entity].astro` |
| Crisis handling | ⚠️ partial | `CrisisBanner.astro` + `isCrisisSensitive()` in `src/lib/content.ts` |
| Crisis **noindex** | ❌ | No `<meta name="robots" content="noindex,follow">` in recovered `BaseLayout` or answer pages |
| Sitemap | ✅ | `@astrojs/sitemap` → `/sitemap-index.xml` + `/sitemap-0.xml` at build time |
| DB-slug answer routes | ✅ | `src/pages/answers/[slug].astro` + `getStaticPaths()` from Supabase `questions_master` |
| `vercel.json` | ✅ | `"framework": "astro"`, `outputDirectory: "dist"` |
| `robots.txt` | ✅ | `src/pages/robots.txt.ts` — includes `LLMS:` line (live production omits this) |

**File count:** 28 tracked files under `Documents/New project/` (no `public/`, no `scripts/`).

---

## 3. What matches live production

Verified against `https://www.deeper.global` on 2026-06-11:

- **Framework:** Astro static output with `/_astro/*` hashed assets
- **Package identity:** `deeper-global@1.0.0`, Astro 6.x build
- **Core routes:** `/`, `/answers/`, `/answers/[slug]/`, `/categories/`, `/entities/`, `/protocol/`, `/about/`, `/privacy/`, `/llms.txt`, `/robots.txt`
- **Content source:** Supabase `questions_master` table (slug-based static paths)
- **Entity map:** `/entities/` and `/entities/[slug]/` driven from category aggregation
- **llms.txt shape:** Same sections (Core Pages, Entity Map, Answer Index, Citation Guidance); live uses `https://www.deeper.global` base URLs
- **Crisis banner:** Present on crisis-sensitive answers (e.g. suicidal-thoughts slug shows `data-risk-class="crisis-sensitive"` and 988 banner)
- **Sitemap reference:** `robots.txt` points to `sitemap-index.xml`
- **Analytics:** GA4 `G-VY56C15LGV`
- **AI markup:** `data-ai-*` attributes on answer pages

---

## 4. What is missing vs live production

These differences mean **hoisting alone will not restore production parity**.

### SEO & indexing

| Feature | Live | Recovered source |
|---------|------|------------------|
| Canonical host | `https://www.deeper.global/` (trailing slash) | `https://deeper.global` (no `www`, often no trailing slash) |
| Answer `noindex` | `<meta name="robots" content="noindex,follow">` on many answers (including crisis and some non-crisis) | **Not implemented** |
| JSON-LD | `MedicalWebPage`, `Article`, `Organization`, `WebSite`, `BreadcrumbList` graph | Primarily `QAPage` / `Question` / `Answer` / `DefinedTerm` |
| `og:image` / Twitter image | `/images/deeper-hero-reader-1200.webp` | **Not present** |
| `robots.txt` LLMS directive | **Absent** on live | Present in recovered `robots.txt.ts` |

### UI / UX

| Feature | Live | Recovered source |
|---------|------|------------------|
| Home hero | Full-bleed image (`picture` + avif/webp/png), refined copy | Simple text hero, different H1 |
| Nav label | "Themes" for `/entities/` | "Entities" |
| Nav CTA | "Ask anything" button | **Not present** |
| Answer layout | Two-column (`answer-layout`, sidebar, breadcrumbs, `rabbit-grid` related cards) | Single-column, simpler `AnswerCard` list |
| Brand mark | `Deeper.` wordmark | Plain "Deeper Global" text link |

### Assets & config

| Feature | Live | Recovered source |
|---------|------|------------------|
| `public/` | favicon.ico, favicon.svg, `/images/deeper-hero-reader-*` | **Missing directory** |
| `scripts/` | Unknown build/deploy helpers (may exist only in CLI deploy bundle) | **Missing** |
| `astro.config.mjs` site URL | Effectively `www` in output | `https://deeper.global` |

### Operational

- Production deploys via **Vercel CLI / Codex**, not GitHub branch auto-deploy
- Vercel project metadata still lists `framework: nextjs` while building Astro — settings may be stale or overridden at deploy time
- **Gap to close before trusting git:** recover CLI-only diff or re-implement missing features from live HTML

---

## 5. `pg` dependency mismatch — investigation

**Finding: `pg` (node-postgres) does not appear anywhere in this recovered Astro tree or its lockfile.**

| Checked | Result |
|---------|--------|
| `Documents/New project/package.json` | Only `astro`, `@astrojs/sitemap`, `@supabase/supabase-js` |
| `Documents/New project/package-lock.json` | No `node_modules/pg` entry |
| Entire workspace `grep` for `"pg"`, `from 'pg'` | No matches |
| Git history (`git log -S'"pg"'`) | No meaningful `pg` package additions; hit on commit `4ef2a69` is lockfile hash noise |
| GitHub `main` `package.json` | Next.js app — **no `pg`** |
| GitHub `codex/deeper-global-astro-v1` Astro `package.json` | **no `pg`** |
| Vercel prod build log (`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`) | `npm install` + `astro build`; no `pg` install line |
| `deeper2/deeper-global/` Next prototype | **no `pg`** — uses `@supabase/supabase-js` only |

**Likely explanations for reported Vercel `pg` sighting:**

1. **Supabase conflation** — architecture docs refer to "Supabase/Postgres"; runtime uses `@supabase/supabase-js`, not direct `pg`
2. **Transitive lockfile names** — `@supabase/postgrest-js` is unrelated to npm `pg`
3. **Different project or deployment** — older `deeper-global` Vercel project or `calm-query` repo history
4. **Vercel Postgres integration UI** — marketplace storage ≠ app dependency
5. **CLI deploy bundle** — if `pg` existed, it was never committed to this repo

**Action before hoisting:** If Vercel UI still shows `pg`, capture a screenshot of the exact file path in the deployment source browser. Do not add `pg` unless direct Postgres connection code is found — current app reads via Supabase client only.

---

## 6. Unrelated cruft at repo root

| Path | What it is | Recovery action |
|------|------------|-----------------|
| `Desktop/qv-brand-alchemy-main/` | QV Brands marketing site (Astro + React islands) | **Leave out** of hoisted app; archive or move to separate repo |
| `deeper2/deeper-global/` | Next.js 14 prototype (`app/`, `@supabase/supabase-js`) | **Reference only**; do not hoist; useful for comparing early Next routes |
| `Documents/` wrapper | macOS path artifact from recovery | Remove after hoist; app should not live under `Documents/New project/` long term |

**Do not delete** until hoist branch is validated and backups exist.

---

## 7. Proposed hoist plan (no-deploy)

Goal: make `Documents/New project/` the repo root Astro app on `production/astro-v1-recovered`, without deploying.

### Phase 0 — Preconditions (read-only)

- [ ] Confirm Supabase env var names used in Vercel prod (`SUPABASE_URL`, `SUPABASE_ANON_KEY` or `PUBLIC_*` variants)
- [ ] Export or snapshot current Vercel CLI deploy directory if still on local machine (closes gitDirty gap)
- [ ] Tag current branch: `pre-hoist-astro-recovery`

### Phase 1 — Hoist (single commit, still no deploy)

1. Create working branch from `production/astro-v1-recovered` (already on it)
2. Move all contents of `Documents/New project/*` → repo root:
   - `astro.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`, `vercel.json`
   - `src/`, `docs/platform-architecture.md` → keep as `docs/platform-architecture.md` or merge with this file
3. Add root `.gitignore` from Astro app (replace/absorb if needed)
4. **Do not move** `Desktop/`, `deeper2/`
5. Leave cruft in place initially OR move to `_archive/` in a follow-up commit (prefer `_archive/` over delete)

### Phase 2 — Repo hygiene (same branch, no deploy)

1. Add root `README.md` from Astro app (overwrite or merge with any root readme)
2. Add `.vercelignore` or root `.gitignore` entries to exclude:
   - `Desktop/`
   - `deeper2/`
   - `_archive/`
3. Document in README that production Vercel project is `deeper-global-h65m`
4. Set Vercel **Root Directory** to `.` (repo root) — **plan only, do not change in dashboard yet**

### Phase 3 — Parity backfill (before any deploy)

Priority order to match live:

1. Add `public/` assets (favicons, hero images) — pull from live site or asset store
2. Update `astro.config.mjs` → `site: 'https://www.deeper.global'`, enable trailing slashes if live uses them
3. Port live `BaseLayout.astro` features (og:image, favicon links, Organization/WebSite JSON-LD)
4. Implement `noindex,follow` policy on answer pages (match live rules — broader than crisis-only)
5. Port answer page layout (sidebar, breadcrumbs, related grid)
6. Reconcile `robots.txt.ts` LLMS line with live (keep or drop intentionally)
7. Recover or rewrite `scripts/` if needed for CI/smoke tests

### Phase 4 — Validate locally (no deploy)

```bash
# Only after explicit approval to install deps
npm ci
SUPABASE_URL=... SUPABASE_ANON_KEY=... npm run build
npm run preview
```

Compare preview output to live URLs in §9 checklist.

### Phase 5 — Deploy gate (future, explicit approval)

- Preview deployment only first
- Update Vercel root directory + framework detection after preview passes
- Production promote only after full QA

---

## 8. Files/folders to move, preserve, ignore, or delete

### Move to repo root (hoist)

```
Documents/New project/astro.config.mjs
Documents/New project/package.json
Documents/New project/package-lock.json
Documents/New project/tsconfig.json
Documents/New project/vercel.json
Documents/New project/src/
Documents/New project/README.md
Documents/New project/docs/platform-architecture.md
Documents/New project/.gitignore  → merge into root .gitignore
```

### Preserve elsewhere (reference / archive)

```
deeper2/deeper-global/          # Next.js prototype
Desktop/qv-brand-alchemy-main/  # unrelated client project
docs/deeper-production-recovery-notes.md  # this file (repo root docs/)
```

### Leave out of Vercel build / add to `.vercelignore`

```
Desktop/
deeper2/
_archive/   (if created)
```

### Do not delete (yet)

- Any path above until post-hoist QA passes and branch is merged/backed up

---

## 9. Parity QA checklist (run before any deploy)

### Build

- [ ] `npm run build` succeeds with production Supabase env vars
- [ ] Build generates hundreds/thousands of `/answers/[slug]/` pages (count ≈ live corpus ~800+)
- [ ] `/sitemap-index.xml` and `/sitemap-0.xml` emitted under `dist/`
- [ ] No empty-state-only build unless env vars intentionally omitted

### Routes & content

- [ ] `/llms.txt` returns plain text; entity count and answer index populated
- [ ] `/entities/` lists entity cards with counts
- [ ] Sample answer slug matches live title and category
- [ ] `/robots.txt` sitemap URL acceptable (`www` vs apex decision documented)

### SEO / head tags (compare to live curl)

- [ ] Canonical uses `https://www.deeper.global/.../` with trailing slash policy
- [ ] Crisis answer: crisis banner + `data-risk-class="crisis-sensitive"` + `noindex,follow`
- [ ] Non-crisis answer: confirm noindex policy matches live (live noindexes some non-crisis pages too)
- [ ] `og:image` and favicon links present
- [ ] JSON-LD `@graph` includes Organization, WebSite, MedicalWebPage/Article as on live

### Assets

- [ ] `/favicon.svg`, `/favicon.ico` resolve
- [ ] `/images/deeper-hero-reader-1200.webp` resolves
- [ ] `/_astro/*` CSS bundle loads

### Regression guards

- [ ] Nav matches live labels ("Themes", CTA)
- [ ] GA4 ID unchanged (`G-VY56C15LGV`)
- [ ] Supabase read-only anon key only (no service role in static build)

---

## 10. Key references

| Resource | Value |
|----------|-------|
| Recovered Astro commit | `4ef2a69948e60f90b5548b0aaf901f5de753223e` |
| Live Vercel project | `deeper-global-h65m` |
| Latest prod deployment | `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` (CLI / codex) |
| Supabase table | `questions_master` |
| Env vars (code) | `SUPABASE_URL`, `SUPABASE_ANON_KEY` (+ `PUBLIC_*` / `NEXT_PUBLIC_*` fallbacks) |

---

## Summary for stakeholders

1. **`Documents/New project/` is the right Astro recovery starting point** but **not** a complete copy of live production.
2. **Live production was deployed via Vercel CLI with dirty/uncommitted changes** — expect to backfill UI, SEO, and assets.
3. **`pg` is not part of the recovered dependency graph** — data access is via Supabase JS client.
4. **Hoist is safe to plan** but must not trigger deploy until parity QA passes on a preview.
5. **Repo root cruft** (`Desktop/`, `deeper2/`) must stay out of the Vercel root after hoist.

**Again: do not deploy or push as part of this recovery planning step.**
