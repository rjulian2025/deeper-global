# Deeper Global — Platform Alignment Cutover Plan

**Date:** 2026-06-11  
**Plan type:** Planning only — **no implementation authorized by this document**  
**Astro lineage tip:** `origin/codex/deeper-global-astro-v1` @ `50fdfe8`  
**Vercel project:** `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`)  
**Live site:** `www.deeper.global` / `deeper.global`

---

## ⚠️ NO-DEPLOY WARNING

**Do not change GitHub default branch, Vercel settings, or production deployments based on this document alone.**

Cutover requires explicit approval at each gate. Until the final authorized production deploy step, **live production must remain on the current CLI deployment**.

---

## 1. Current state (audited 2026-06-11)

### Git branches

| Branch | Tip commit | Root layout | Role today |
|--------|------------|-------------|------------|
| `origin/main` | `0007864` | Next.js app (`app/`, `next.config.js`, root `package.json`) | GitHub **default branch** — unrelated to live Astro |
| `origin/codex/deeper-global-astro-v1` | `50fdfe8` | **Root-level Astro** (`package.json`, `src/`, `vercel.json`, `_archive/`) | **Authoritative Astro lineage** (PR #3 + PR #4 merged) |
| `origin/production/astro-root` | `b4a1ac0` | Same Astro tree (hoist + QA doc) | Feature branch; content merged into codex via PR #4 |
| `origin/production/astro-v1-recovered` | `4432a0a` | Nested Astro under `Documents/New project/` | Superseded by hoist; historical only |

**Merge history on Astro lineage:**

```
50fdfe8  Merge PR #4 (hoist to repo root)
b4a1ac0  Document root-level Astro preview QA
6519da0  Hoist recovered Astro app to repo root
ba151cc  Merge PR #3 (recover live source)
4432a0a  Document nested preview QA
c5a1ac7  Recover live Astro production source
4ef2a69  Build Astro v1 intelligence layer
```

**`main` ↔ Astro lineage:** no shared git history. PRs to `main` are not possible without a separate migration strategy.

### Root-level Astro app on `codex/deeper-global-astro-v1` (confirmed)

```
.gitignore          .vercelignore       README.md
astro.config.mjs    package.json        package-lock.json
tsconfig.json       vercel.json
src/                public/             scripts/
docs/               _archive/           ← Desktop/, deeper2/ preserved
```

`vercel.json` at repo root:

- `"framework": "astro"`
- `"buildCommand": "npm run build"`
- `"outputDirectory": "dist"`

`.vercelignore` excludes `_archive/`.

### GitHub settings

| Setting | Current value |
|---------|---------------|
| Default branch | `main` |
| Repo | `rjulian2025/deeper-global` |

### Vercel settings (`deeper-global-h65m`)

| Setting | Current value | Aligned with Astro root? |
|---------|---------------|--------------------------|
| **Root Directory** | `.` (null in API) | ✅ Path is correct post-hoist; ❌ was wrong pre-hoist |
| **Framework Preset** | `nextjs` | ❌ Stale — live/preview builds are Astro |
| **Build Command** | (default / null) | ⚠️ Dashboard default is Next.js; root `vercel.json` overrides on Git/CLI builds |
| **Output Directory** | (default / null) | ⚠️ Same — `vercel.json` sets `dist` |
| **Install Command** | (default / null) | ✅ `npm install` default is fine |
| **Node.js Version** | `22.x` | ✅ Compatible with Astro 6 |
| **Production Branch** | `main` | ❌ `main` is Next.js, not Astro |
| **Git repo** | `rjulian2025/deeper-global` | ✅ Connected |

### Environment variables (all environments: Production, Preview, Development)

| Variable | Required for Astro build? | Notes |
|----------|---------------------------|-------|
| `SUPABASE_URL` | **Yes** | Full static path generation |
| `SUPABASE_ANON_KEY` | **Yes** | Full static path generation |
| `NEXT_PUBLIC_GA_ID` | No | GA hardcoded in `BaseLayout.astro` |

**No env var changes required for cutover** — existing vars are sufficient.

### Production runtime today

| Item | Value |
|------|-------|
| **Live deployment** | `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` |
| **Deploy source** | `cli` (not Git) |
| **Last root preview (validated)** | `dpl_2cXEsAwiRKwbHWWb18XSzKe81F7r` @ `b4a1ac0` tree — **36/36 QA pass** |
| **Nested preview (baseline)** | `dpl_BthFdebMjhxW183G5xfHp8zucVGy` — **36/36 QA pass** |

---

## 2. Desired future state

| Layer | Target |
|-------|--------|
| **GitHub default branch** | Astro production branch (see §4) |
| **Vercel Production Branch** | Same Astro production branch |
| **Vercel Root Directory** | `.` (unchanged — already correct for hoisted app) |
| **Vercel Framework** | Astro (explicit, or auto-detect from `vercel.json`) |
| **Build / output** | `npm run build` → `dist` (from `vercel.json` or dashboard) |
| **Deploy mechanism** | Git push / merge → Vercel build → explicit production promote |
| **Source of truth** | Root-level Astro on Astro production branch @ `50fdfe8` or later |
| **`main`** | Archived or renamed (e.g. `archive/nextjs-main-legacy`) — **not** production |

---

## 3. Settings that must eventually change

| Setting | Current | Target | Change required? |
|---------|---------|--------|----------------|
| GitHub default branch | `main` | Astro production branch | **Yes** |
| Vercel Production Branch | `main` | Astro production branch | **Yes** |
| Vercel Root Directory | `.` | `.` | **No** (already correct post-hoist) |
| Vercel Framework Preset | `nextjs` | `astro` | **Yes** (recommended for clarity) |
| Vercel Build Command | null (Next default) | `npm run build` | **Recommended** (explicit; also in `vercel.json`) |
| Vercel Output Directory | null (Next default) | `dist` | **Recommended** (explicit; also in `vercel.json`) |
| Vercel Install Command | null | `npm install` or `npm ci` | Optional |
| Env vars | 3 present | Same 3 | **No** |
| `.vercelignore` | `_archive/` | `_archive/` | **No** (already in repo) |

**Critical:** Production Branch and GitHub default branch must change **in the same change window** to avoid auto-deploying Next.js from `main` or Astro from the wrong branch.

---

## 4. Branch naming strategies

### Option A — Keep `codex/deeper-global-astro-v1` as production branch

| Pros | Cons |
|------|------|
| No rename; tip is already `50fdfe8` with full recovery + hoist | Name is long, opaque (`codex/`), hard to communicate |
| PR #3 and #4 merge history lives here | Slash in branch name adds minor tooling friction |
| Lowest git churn during cutover | Does not read as “production” to new contributors |

### Option B — Cleaner name: `production/astro` (or `main-astro`)

| Pros | Cons |
|------|------|
| Clear production intent | Requires one rename or branch creation step before/at cutover |
| Matches existing naming (`production/astro-root`, `production/astro-v1-recovered`) | Must update Vercel Production Branch to new name atomically |
| Easier runbooks and onboarding | Short window where old branch name must remain as alias or be deleted deliberately |

**Variants under Option B:**

| Name | Recommendation |
|------|----------------|
| `production/astro` | **Preferred** — short, clear, production-scoped |
| `production/astro-root` | Already exists; usable but ties name to hoist event |
| `main-astro` | Avoid — confuses with unrelated `main` |

### Recommendation: **Option B → `production/astro`**

Rename `codex/deeper-global-astro-v1` → `production/astro` on GitHub **immediately before** platform cutover (Phase 0), then point both GitHub default branch and Vercel Production Branch at `production/astro`.

**Rationale:** Cutover is already a high-attention event; a branch rename in the same window costs little and avoids permanently encoding `codex/` in production infrastructure. If rename is deemed too risky, **fallback:** use `codex/deeper-global-astro-v1` for cutover only and rename later.

**Do not use unrelated `main` as the Astro production branch** without retiring or renaming the legacy Next.js `main` first.

---

## 5. Pre-cutover checks (mandatory gate)

Complete **after** PR #4 merge, **before** any GitHub/Vercel setting changes.

### 5.1 Fresh preview from `50fdfe8`

```bash
git fetch origin
git checkout origin/codex/deeper-global-astro-v1   # or production/astro after rename
npm ci
# SUPABASE_URL + SUPABASE_ANON_KEY required
npm run build && npm run check
vercel link --project deeper-global-h65m
vercel --yes    # NEVER --prod
```

### 5.2 Preview QA — 36/36 checklist

Re-run full checklist documented in [`deeper-root-preview-qa-log.md`](./deeper-root-preview-qa-log.md):

- Core routes (11), sample pages (4), SEO/indexation (12), assets (4), sitemap/llms (5)
- Sitemap **1,030** URLs; llms.txt **1,080** www URLs; CSS `BaseLayout.DHHP_8JI.css`
- `_archive/` not in build output or web-accessible

**Note:** Last validated preview was at `b4a1ac0` (same tree as `50fdfe8` minus merge commit). Re-validate from `50fdfe8` after any delay or before cutover.

### 5.3 Environment variable verification

- [ ] `SUPABASE_URL` present on Production, Preview, Development
- [ ] `SUPABASE_ANON_KEY` present on Production, Preview, Development
- [ ] Preview build log shows ~1,000+ answer routes (not empty-state-only)
- [ ] No service-role or `SUPABASE_DB_PASSWORD` in Vercel env

### 5.4 Governance

- [ ] Snapshot Vercel settings (screenshot or API export): Root Directory, Production Branch, Framework, env vars
- [ ] Record rollback deployment ID: `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`
- [ ] Tag git: `pre-platform-cutover-2026-06-11` @ `50fdfe8`
- [ ] Tag legacy main: `archive/nextjs-main-legacy` @ `0007864`
- [ ] Branch protection on Astro production branch (require PR, no force-push)
- [ ] Communicate freeze: no `main` pushes, no Vercel dashboard changes except during cutover window

---

## 6. Cutover sequence (when explicitly approved)

Execute in order within a **single coordinated window** (≤ 1 hour). Assign one operator; one verifier.

### Phase 0 — Branch rename (recommended)

1. Rename `codex/deeper-global-astro-v1` → `production/astro` on GitHub  
   *(or skip and use `codex/deeper-global-astro-v1` as fallback)*
2. Confirm tip remains `50fdfe8` (or equivalent merge commit)

### Phase 1 — Vercel settings (no production deploy yet)

1. Open Vercel → `deeper-global-h65m` → Settings → General  
2. Set **Production Branch** → `production/astro` (or chosen branch)  
3. Confirm **Root Directory** → `.` (leave unchanged)  
4. Set **Framework Preset** → Astro  
5. Set **Build Command** → `npm run build`  
6. Set **Output Directory** → `dist`  
7. Confirm **Node.js** → `22.x`  
8. **Do not** click Deploy or Promote yet  
9. Disable or verify: pushing to old `main` will no longer trigger production *(Production Branch no longer `main`)*

### Phase 2 — GitHub default branch

1. Settings → Branches → Default branch → `production/astro`  
2. Confirm `main` remains available but is no longer default  
3. Optional: rename `main` → `archive/nextjs-main-legacy` in a follow-up (not required for cutover)

### Phase 3 — Git preview validation

1. Push empty commit or open trivial PR to `production/astro` to trigger **Git preview deploy**  
2. Confirm Vercel builds **Astro** from repo root (not Next.js)  
3. Run abbreviated QA on preview URL (routes, sitemap count, CSS bundle)  
4. **Stop if preview fails** — do not proceed to Phase 4

### Phase 4 — Production deploy (separate explicit approval)

**Only after Phase 3 passes and stakeholder sign-off:**

Choose one:

- **A.** Git merge to production branch → Vercel auto-production deploy, **or**
- **B.** Manual promote preview deployment in Vercel dashboard, **or**
- **C.** `vercel --prod` from clean checkout at repo root *(last resort; same project)*

### Phase 5 — Post-cutover smoke test

- [ ] `https://www.deeper.global/` loads Astro homepage  
- [ ] Sample answer, `/llms.txt`, sitemap URLs  
- [ ] GA4 snippet present  
- [ ] No regression vs preview QA  
- [ ] Document new production deployment ID

---

## 7. Rollback plan

**Principle:** Live production stays on `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` until Phase 4 succeeds. Rollback is always available until a new production deployment is promoted.

### If failure occurs before Phase 4 (settings only)

| Step | Action |
|------|--------|
| 1 | Revert Vercel **Production Branch** → `main` |
| 2 | Revert Vercel **Framework** → previous (or leave; CLI prod unaffected) |
| 3 | Revert GitHub **default branch** → `main` |
| 4 | Rename branch back if Phase 0 rename was done |
| 5 | **No production impact** — live site still on CLI deployment |

### If failure occurs after Phase 4 (new prod deploy bad)

| Step | Action |
|------|--------|
| 1 | Vercel dashboard → Deployments → find `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` |
| 2 | **Promote to Production** (rollback instant alias swap) |
| 3 | Revert Vercel Production Branch / GitHub default if needed |
| 4 | Post-mortem before retry |

### If Git push to `main` accidentally triggers build during cutover

- With Production Branch moved off `main`, push should produce **preview only** (or fail if no root Next app). Monitor Vercel dashboard; cancel errant builds.

### Rollback artifacts to preserve now

| Artifact | Value |
|----------|-------|
| Production deployment ID | `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` |
| Legacy `main` commit | `0007864` |
| Pre-cutover Astro commit | `50fdfe8` |
| Validated preview deployment | `dpl_2cXEsAwiRKwbHWWb18XSzKe81F7r` |

---

## 8. Explicit non-goals

This plan does **not** authorize:

- Merging Astro lineage into unrelated `main` (unrelated histories)
- Force-pushing or deleting `main` without archive tag/backup
- Hoisting or code changes during cutover
- Changing Supabase credentials or content
- Deleting `_archive/` or legacy trees
- Creating a new Vercel project (unless explicitly approved)
- Automatic production deploy as part of settings changes (Phases 1–2)

---

## 9. Risk matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Auto-deploy Next.js to production on `main` push | Medium (today) | High | Change Production Branch before encouraging `main` activity |
| Astro Git build fails on first push | Medium | Medium | Phase 3 preview gate before Phase 4 |
| Settings change without deploy breaks CLI workflow | Low | Low | Document new Git-first workflow; CLI still works from root |
| Branch rename breaks local clones | Low | Low | Announce `git fetch; git checkout production/astro` |
| Empty-state build (missing env) | Low | High | Verify env vars in Phase 5.3; check build logs |

---

## 10. Related documents

| Document | Purpose |
|----------|---------|
| [`deeper-hoist-main-migration-readiness.md`](./deeper-hoist-main-migration-readiness.md) | Hoist options and migration context |
| [`deeper-root-preview-qa-log.md`](./deeper-root-preview-qa-log.md) | 36/36 root preview validation |
| [`deeper-preview-qa-log.md`](./deeper-preview-qa-log.md) | Nested preview baseline |
| [PR #3](https://github.com/rjulian2025/deeper-global/pull/3) | Recovery merge (merged) |
| [PR #4](https://github.com/rjulian2025/deeper-global/pull/4) | Hoist merge (merged) |

---

## 11. Summary

| Question | Answer |
|----------|--------|
| Is Astro source ready at repo root on codex? | **Yes** — `50fdfe8` |
| Must Root Directory change? | **No** — already `.` |
| Must Production Branch change? | **Yes** — off `main` |
| Must Framework change? | **Recommended** — `nextjs` → `astro` |
| Must env vars change? | **No** |
| Recommended production branch name | **`production/astro`** (rename from codex) |
| Safest next action | **Pre-cutover fresh preview + 36/36 QA from `50fdfe8`** — no platform changes yet |

---

**Reminder: Planning document only. No deploy. No GitHub/Vercel setting changes until explicit cutover approval.**
