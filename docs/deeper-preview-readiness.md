# Deeper Global — Preview Deployment Readiness

**Date:** 2026-06-11  
**Branch:** `production/astro-v1-recovered`  
**Commit:** `c5a1ac7` — *Recover live Astro production source* (`c5a1ac7d5d53ebb92bbf76b9db5b75b6879c408d`)  
**Repo:** `rjulian2025/deeper-global`  
**Recovered Astro app path:** `Documents/New project/`  
**Vercel project (production):** `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`)  
**PR status:** Not opened (as of this audit)

---

## ⚠️ NO PRODUCTION DEPLOY

**Do not run `vercel --prod`, merge to `main`, or promote any deployment to production.**

This document is a **readiness analysis only**. It does not authorize production changes, Vercel dashboard edits, hoisting, or code changes.

---

## Executive summary

| Question | Answer |
|----------|--------|
| Will automatic Git preview deploy work today? | **No — very likely to fail** |
| Why? | Vercel **Root Directory** is repo root (`.`), and the recovery branch has **no `package.json` at repo root** |
| Is `vercel.json` in the right place? | **Yes** — `Documents/New project/vercel.json` |
| Is that `vercel.json` sufficient for Astro preview? | **Yes** — framework, build command, output directory, and redirects are defined |
| Are preview env vars already on the project? | **Yes** — `SUPABASE_URL`, `SUPABASE_ANON_KEY` (and `NEXT_PUBLIC_GA_ID`, unused by app code) |
| Lowest-risk preview path | **Option B** — one-off CLI preview from `Documents/New project/` **without** `--prod` |

---

## 1. Repo structure (recovery branch)

Top-level paths on `production/astro-v1-recovered`:

```
deeper-global-production/          # GitHub clone root
├── Desktop/qv-brand-alchemy-main/ # unrelated Astro/React project
├── deeper2/deeper-global/       # older Next.js prototype
├── Documents/New project/       # ✅ recovered live Astro app
└── docs/                          # recovery / parity documentation
```

**There is no `package.json` at repo root on this branch.**

The Astro app lives entirely under `Documents/New project/`:

| File / folder | Present |
|---------------|---------|
| `package.json` | ✅ |
| `astro.config.mjs` | ✅ |
| `vercel.json` | ✅ |
| `src/` | ✅ |
| `public/` | ✅ |
| `scripts/` | ✅ (build-time scripts not invoked by `npm run build`) |

Local build parity was confirmed on commit `c5a1ac7` (~1,168 pages, sitemap 1,030 URLs, CSS hash matches live).

---

## 2. Where will Vercel build from?

### Current Vercel project settings (`deeper-global-h65m`)

Queried via Vercel CLI / API on 2026-06-11:

| Setting | Current value | Implication |
|---------|---------------|-------------|
| **Root Directory** | `.` (null in API) | Builds from **repo root**, not `Documents/New project/` |
| **Framework Preset** | Next.js | **Stale** — production Astro was deployed via CLI, not Git |
| **Build Command** | (default) `npm run build` or `next build` | Wrong default if Vercel treats repo as Next.js |
| **Output Directory** | Next.js default | Wrong unless overridden by nested `vercel.json` |
| **Install Command** | (default) `npm install` | **Fails at repo root** — no root `package.json` |
| **Node.js Version** | 22.x | Compatible with Astro 6 |
| **Git connection** | `github.com/rjulian2025/deeper-global` | Connected; production branch = `main` |
| **Recent deploy source** | **`cli` only** (last 20+ deploys) | No recent Git-triggered builds |

### Git-triggered preview (e.g. open PR)

If a PR is opened from `production/astro-v1-recovered`:

1. Vercel clones the branch.
2. Enters **Root Directory** `.` (repo root).
3. Runs `npm install` → **expected failure** (no root `package.json`).
4. Even if install succeeded, framework detection would not reliably find the nested Astro app.

**Verdict: automatic preview deploy from a PR is unlikely to work without changing Root Directory or hoisting.**

### CLI deploy from nested directory

If you `cd "Documents/New project"` and run `vercel` (no `--prod`):

1. Vercel uses the **current working directory** as the deployment root.
2. `Documents/New project/vercel.json` applies.
3. Framework resolves to **Astro** per `vercel.json`.
4. Preview URL is issued; **production aliases (`www.deeper.global`) are not affected**.

**Verdict: CLI preview from the nested app directory will work with existing project env vars.**

---

## 3. `vercel.json` assessment

**Location:** `Documents/New project/vercel.json` (not at repo root)

**Relevant settings:**

```json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

Plus ~200 permanent slug redirects under `/answers/...`.

| Aspect | Sufficient for preview? | Notes |
|--------|-------------------------|-------|
| Framework | ✅ | Overrides stale Next.js dashboard preset when building from this directory |
| Build command | ✅ | Matches `package.json` `"build": "astro build"` |
| Output directory | ✅ | Astro static output → `dist/` |
| Redirects | ✅ | Will apply on preview URL (good for route QA) |
| Headers / rewrites | N/A | Not defined; not required for static Astro |
| Root-level copy | ❌ | No `vercel.json` at repo root — irrelevant until Root Directory is `.` |

---

## 4. Required Vercel settings for a successful preview

Use these values **when building from `Documents/New project/`** (either via Root Directory setting or CLI cwd):

| Setting | Required value |
|---------|----------------|
| **Root Directory** | `Documents/New project` |
| **Framework Preset** | Astro (or auto-detect; `vercel.json` sets `"framework": "astro"`) |
| **Install Command** | `npm install` (default) or `npm ci` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Node.js Version** | 22.x (matches current project) |

**Note on path with space:** The directory name `New project` contains a space. Vercel supports this in Root Directory, but shell commands must quote the path: `"Documents/New project"`.

If Root Directory remains `.` (repo root), **none of the above will produce a working preview** on the recovery branch.

---

## 5. Environment variables

### Required for full-content static build

The Astro build calls Supabase at build time to generate `/answers/[slug]/`, `/entities/`, `/llms.txt`, etc.

| Variable | Required for `npm run build`? | Already on Vercel (Preview)? | Used in app code |
|----------|----------------------------|--------------------------------|------------------|
| `SUPABASE_URL` | **Yes** (for full corpus) | ✅ Production, Preview, Development | `src/lib/supabase.ts` |
| `SUPABASE_ANON_KEY` | **Yes** (for full corpus) | ✅ Production, Preview, Development | `src/lib/supabase.ts` |

Fallback names also accepted by code (not required if primary vars are set):

- `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Without Supabase vars:** build succeeds with empty states (~shell pages only). Not suitable for parity QA.

### Present on Vercel but not used by recovered source

| Variable | On Vercel? | Used in app? |
|----------|------------|--------------|
| `NEXT_PUBLIC_GA_ID` | ✅ | ❌ — GA4 ID is hardcoded as `G-VY56C15LGV` in `src/layouts/BaseLayout.astro` |

### Not required for preview build (scripts / maintenance only)

These are used by `scripts/*.mjs` (`npm run seo:*`, migrations, enrichment). **`npm run build` does not invoke them.**

| Variable | Used by |
|----------|---------|
| `SUPABASE_DB_PASSWORD` | `apply-structured-content-migration.mjs`, draft insert/promote scripts |
| `SUPABASE_ACCESS_TOKEN` | `supabase-sql.mjs` |
| `P1_LIMIT` | `prepare-p1-enrichment-sources.mjs` |
| `ALLOW_STALE_PILOT_SOURCE` | `prepare-enrichment-pilot.mjs` |

`pg` is in `package.json` for scripts only; the web app uses `@supabase/supabase-js`.

---

## 6. Missing root `package.json` — impact

| Scenario | Impact |
|----------|--------|
| **Git PR preview** (Root Directory = `.`) | **Build fails** at install step |
| **CLI preview** from `Documents/New project/` | **Works** — uses nested `package.json` |
| **Production today** | Unaffected — prod deploys are **CLI-sourced**, not Git-sourced |
| **After hoist** | Root `package.json` would unblock Git previews with Root Directory = `.` |

GitHub `main` branch **does** have a root `package.json` (Next.js app). That branch is unrelated to the recovered Astro tree. Do not merge the recovery branch to `main` without a deliberate migration plan.

---

## 7. Preview options compared

### Option A — Set Vercel Root Directory to `Documents/New project`

**What:** Dashboard change on `deeper-global-h65m` → Settings → General → Root Directory.

| Pros | Cons |
|------|------|
| Enables automatic preview on PR push | Changes **project-wide** config (affects future prod deploys too) |
| Matches where the Astro app actually lives | Path contains a space (minor friction) |
| Uses existing Preview env vars | Requires explicit approval (out of scope for this audit) |

**Production risk:** Medium. Does not deploy production by itself, but the **next** `vercel --prod` or production promotion would build from the new root. Must coordinate before any production action.

### Option B — One-off CLI preview from `Documents/New project/` (recommended)

**What:**

```bash
cd "/path/to/deeper-global-production/Documents/New project"
vercel link --project deeper-global-h65m   # if not already linked
vercel                                     # preview only — do NOT pass --prod
```

| Pros | Cons |
|------|------|
| **No dashboard / project setting changes** | Manual; not tied to PR checks |
| Preview URL only; no production alias | Must re-run for each verification |
| Uses nested `vercel.json` + existing Preview env vars | Canonical URLs in HTML still point to `https://www.deeper.global` (hardcoded in `astro.config.mjs` / `src/lib/site.ts`) |
| Matches how production has been deployed (CLI) | |

**Production risk:** **Lowest**, provided `--prod` is never passed and deployment is not manually promoted.

### Option C — Defer preview until hoist

**What:** Hoist `Documents/New project/*` to repo root first, then preview.

| Pros | Cons |
|------|------|
| Clean long-term Git + Vercel alignment | Larger change; hoist explicitly deferred |
| Root Directory can stay `.` after hoist | Delays parity verification on Vercel infrastructure |

**Production risk:** Low (no deploy), but postpones cloud QA.

---

## 8. Recommendation — lowest-risk path

**Use Option B: one-off CLI preview from `Documents/New project/` without `--prod`.**

Rationale:

1. Production has been **CLI-only** for months; Git previews were never the active path.
2. **No Vercel dashboard changes** are required (aligned with current constraints).
3. **Preview env vars already exist** on the project for Supabase.
4. Opening a PR today would likely produce a **failed** Git preview (no root `package.json`) — noisy but not production-impacting.
5. Option A is the right follow-up **only after explicit approval** to change project Root Directory, and only when ready for ongoing PR previews.

**Do not merge the PR or run `vercel --prod`.**

---

## 9. Preview QA checklist

Run against the **preview URL** (not `www.deeper.global`).

### Build / deploy

- [ ] Deploy completes without `--prod`
- [ ] Preview URL loads (no 404 at `/`)
- [ ] Build log shows Astro (`astro build`), not Next.js
- [ ] Build duration and page count ≈ local parity (~1,000+ answer routes)

### Content / routes

- [ ] `/answers/` lists answers (not empty state)
- [ ] Sample answer slug renders full content
- [ ] `/entities/` populated
- [ ] `/categories/` populated
- [ ] `/llms.txt` returns plain text with answer index
- [ ] `/robots.txt` references sitemap

### SEO / head (compare sample pages to live)

- [ ] `<link rel="canonical">` uses `https://www.deeper.global/.../` (expected even on preview — hardcoded site URL)
- [ ] Crisis answer: banner + `data-risk-class="crisis-sensitive"` + `noindex,follow` where applicable
- [ ] Non-indexed answers respect `shouldIndexQuestion()` / `review_status`
- [ ] JSON-LD includes Organization, WebSite, MedicalWebPage/Article
- [ ] `og:image` and favicons resolve

### Assets

- [ ] `/favicon.svg`, `/favicon.ico` load
- [ ] `/images/deeper-hero-reader-1200.webp` (and avif variants) load
- [ ] `/_astro/*` CSS bundle loads (hash `f7b89a8a…` if unchanged)

### Sitemap

- [ ] `/sitemap-index.xml` accessible
- [ ] `/sitemap-0.xml` contains ~1,030 URLs
- [ ] Sitemap excludes `/entities/*` and `/categories/*` paths

### Redirects

- [ ] Spot-check 2–3 legacy slug redirects from `vercel.json`

### Regression guards

- [ ] GA4 snippet present (`G-VY56C15LGV`)
- [ ] No service-role or DB password env vars required for build
- [ ] Preview URL is **not** assigned to `www.deeper.global` or `deeper.global`

---

## 10. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Accidental `vercel --prod` | **Critical** | Never pass `--prod`; verify deployment target in CLI prompt |
| Manual promote preview → production | **Critical** | Do not promote in Vercel dashboard |
| Merge recovery branch to `main` | **High** | Do not merge; `main` is a different Next.js app |
| Change Root Directory on prod project | **Medium** | Defer until explicit approval; use Option B first |
| PR triggers failed Git build | **Low** | Failure is noisy only; does not affect live site |
| Canonical / sitemap URLs point to production domain on preview | **Low** | Expected (`site: 'https://www.deeper.global'`); compare HTML structure, not host |
| Supabase anon key exposed in build logs | **Low** | Anon key is public by design; never add service role to Vercel |
| Wrong app built (Next.js at `main` root) | **N/A on recovery branch** | Recovery branch has no root app; failure mode is install error, not wrong app |

---

## 11. Suggested next steps (ordered)

1. **Optional:** Open PR for review only — expect Git preview **failure** unless Root Directory is changed.
2. **Recommended:** Run **Option B** CLI preview from `Documents/New project/` when ready (explicit human approval).
3. Walk through §9 QA checklist on the preview URL.
4. **Only after QA passes and explicit approval:** consider Option A (Root Directory) or hoist (Option C path) for sustainable Git previews.
5. **Never** run production deploy until hoist/migration plan is approved.

---

## 12. References

| Resource | Value |
|----------|-------|
| Recovery commit | `c5a1ac7d5d53ebb92bbf76b9db5b75b6879c408d` |
| Astro app path | `Documents/New project/` |
| Vercel project | `deeper-global-h65m` |
| Latest production deployment | `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` (CLI) |
| Related docs | [`deeper-production-recovery-notes.md`](./deeper-production-recovery-notes.md), [`deeper-production-parity-recovery-log.md`](./deeper-production-parity-recovery-log.md) |
| Manual PR URL | https://github.com/rjulian2025/deeper-global/pull/new/production/astro-v1-recovered |

---

**Reminder: This audit does not authorize production deployment, Vercel setting changes, merge, or hoist.**
