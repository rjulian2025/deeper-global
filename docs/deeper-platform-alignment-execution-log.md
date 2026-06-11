# Deeper Global — Platform Alignment Execution Log

**Date:** 2026-06-11  
**Executor:** Cursor agent (platform alignment session)  
**Branch:** `production/astro` @ `09bcb06`  
**Repo:** `rjulian2025/deeper-global`  
**Vercel project:** `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`)  
**Task type:** Platform governance alignment — **no app code changes**

---

## ⚠️ Production deploy status

**No production deployment was triggered during this session.**

- `vercel --prod` was **not** run
- No deployment was promoted to production
- Live production deployment remains **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`**
- `www.deeper.global` and `deeper.global` continue to resolve to the prior CLI production deployment

---

## 1. Repo verification (pre-execution)

| Check | Result |
|-------|--------|
| Working directory | `/Users/rickjulian/deeper-global-production` |
| Remote | `origin` → `https://github.com/rjulian2025/deeper-global.git` |
| Current branch | `production/astro` |
| Working tree | Clean |
| Latest commit | `09bcb06` — *Document production Astro branch preview QA* |
| Runtime-validated commit | `d1e19e8` (doc-only delta in `09bcb06`) |
| Branch pushed to origin | Yes — `origin/production/astro` @ `09bcb06` |

---

## 2. Before-state snapshot (platform)

Captured immediately before alignment changes.

### GitHub

| Setting | Value |
|---------|-------|
| Repository | `rjulian2025/deeper-global` |
| **Default branch** | **`main`** |

### Vercel (`deeper-global-h65m`)

| Setting | Value |
|---------|-------|
| **Production Branch** | **`main`** (`link.productionBranch`) |
| **Root Directory** | `.` (null in API) |
| **Framework Preset** | **`nextjs`** (stale) |
| **Build Command** | null (Next.js default) |
| **Output Directory** | null (Next.js default) |
| **Install Command** | null (default) |
| **Node.js Version** | `22.x` |
| Git link | `github` / `rjulian2025/deeper-global` |
| Git link flag | `sourceless: true` |

### Environment variables (unchanged throughout)

| Variable | Environments |
|----------|--------------|
| `SUPABASE_URL` | production, preview, development |
| `SUPABASE_ANON_KEY` | production, preview, development |
| `NEXT_PUBLIC_GA_ID` | production, preview, development |

### Live production (before)

| Item | Value |
|------|-------|
| **Production deployment ID** | **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`** |
| Deploy source | CLI (not Git) |
| Production URL | `deeper-global-h65m-otakf8iqd-gps4.vercel.app` |
| **Production aliases** | `www.deeper.global`, `deeper.global`, `deeper-global-h65m.vercel.app`, `deeper-global-h65m-gps4.vercel.app`, `deeper-global-h65m-rjulian2025-gps4.vercel.app` |
| Latest validated Astro preview | `dpl_78kdUzqRe611uhTa23dWn9AaVKfA` (`production/astro` @ `d1e19e8`, 36/36 QA) |

---

## 3. Target state (planned)

| Setting | Target |
|---------|--------|
| GitHub default branch | `production/astro` |
| Vercel Production Branch | `production/astro` |
| Vercel Root Directory | `.` |
| Framework Preset | Astro |
| Install Command | `npm install` (or default) |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | `22.x` |
| Environment variables | No changes |

---

## 4. Actions taken

### 4.1 GitHub default branch — **CHANGED**

**Method:** GitHub REST API via `gh api`

```bash
gh api repos/rjulian2025/deeper-global -X PATCH -f default_branch=production/astro
```

**Result:** Success. GitHub default branch is now `production/astro`.

**Production deploy triggered?** No. Changing GitHub default branch does not deploy to Vercel.

### 4.2 Vercel framework / build settings — **CHANGED**

**Method:** Vercel REST API `PATCH /v9/projects/deeper-global-h65m`

```json
{
  "framework": "astro",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

**Result:** Success. Project `updatedAt` advanced; settings confirmed via GET.

**Production deploy triggered?** No. Build/framework dashboard settings do not redeploy production by themselves.

### 4.3 Vercel Production Branch — **NOT CHANGED (blocked)**

**Target:** `production/astro`

**Methods attempted:**

1. `PATCH /v9/projects/{id}` with `link` object → `bad_request: should NOT have additional property link`
2. `PATCH /v9/projects/{id}` with top-level `productionBranch` → `bad_request: should NOT have additional property productionBranch`
3. `PATCH /v9/projects/{id}/branch` with `{"branch":"production/astro"}` → `git_branch_not_found: Branch "production/astro" not found in the connected Git repository`
4. Same endpoint with `main`, `codex/deeper-global-astro-v1`, `production/astro-root` → **all** returned `git_branch_not_found`
5. Alternate payloads (`refs/heads/...`, URL-encoded branch name) → same failure

**Root cause:** Vercel Git link reports `sourceless: true` and cannot enumerate branches from the connected repository. The undocumented `/branch` endpoint rejects every branch name, including `main`, even though `main` is the current configured production branch.

**Manual remediation required:**

1. Open [Vercel project settings → Environments](https://vercel.com/gps4/deeper-global-h65m/settings/environments)
2. Select **Production** → **Branch Tracking**
3. Set branch to **`production/astro`** and save  
   *(Alternative path: Settings → Git → Production Branch, if visible in current UI)*
4. If the branch is not listed, reconnect the GitHub repository integration to refresh branch discovery, then retry

**Important:** Saving Production Branch to `production/astro` does **not** immediately redeploy production, but the **next push/merge to `production/astro` will create a production deployment**. Treat that as a separate gated step.

---

## 5. After-state snapshot (post-execution)

Verified after alignment actions and before committing this log.

### GitHub

| Setting | Value | Changed? |
|---------|-------|----------|
| Default branch | **`production/astro`** | ✅ Yes |

### Vercel

| Setting | Value | Changed? |
|---------|-------|----------|
| **Production Branch** | **`main`** | ❌ No (blocked) |
| Root Directory | `.` (null) | — unchanged |
| Framework Preset | **`astro`** | ✅ Yes |
| Build Command | **`npm run build`** | ✅ Yes |
| Output Directory | **`dist`** | ✅ Yes |
| Install Command | **`npm install`** | ✅ Yes |
| Node.js Version | `22.x` | — unchanged |
| Git link `sourceless` | `true` | — unchanged (still problematic) |

### Environment variables

**No changes.** Same three variables on production, preview, and development.

### Live production (after)

| Item | Value | Changed? |
|------|-------|----------|
| **Production deployment ID** | **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`** | ❌ No |
| Production aliases | `www.deeper.global`, `deeper.global`, project Vercel aliases | ❌ No |
| `www.deeper.global` HTTP | `200` (unchanged live site) | ❌ No |

---

## 6. Exact settings changed vs not changed

### Changed

| Platform | Setting | Before | After |
|----------|---------|--------|-------|
| GitHub | Default branch | `main` | `production/astro` |
| Vercel | Framework Preset | `nextjs` | `astro` |
| Vercel | Build Command | null / Next default | `npm run build` |
| Vercel | Output Directory | null / Next default | `dist` |
| Vercel | Install Command | null / default | `npm install` |

### Not changed

| Item | Reason |
|------|--------|
| Vercel Production Branch (`main`) | API blocked — `git_branch_not_found` on stale/sourceless Git link |
| Vercel Root Directory (`.`) | Already correct |
| Vercel Node version (`22.x`) | Already correct |
| Environment variables | Explicitly out of scope |
| `main` branch content | Explicitly out of scope — no merges |
| Any app source files | Explicitly out of scope |
| Live production deployment | No deploy/promote performed |
| Production domain aliases | Still on rollback deployment |

---

## 7. Rollback reference

### Known-good production deployment

| Field | Value |
|-------|-------|
| **Rollback deployment ID** | **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`** |
| URL | `deeper-global-h65m-otakf8iqd-gps4.vercel.app` |
| Aliases | `www.deeper.global`, `deeper.global`, `deeper-global-h65m.vercel.app`, … |
| State at end of alignment | `READY` / `PROMOTED` |

### Rollback instructions (if a future deploy misbehaves)

**Option A — Vercel Dashboard**

1. Deployments → locate `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`
2. ⋮ menu → **Promote to Production** (or **Instant Rollback** if offered)

**Option B — Vercel CLI**

```bash
vercel rollback dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2 --scope gps4
```

**Option C — GitHub default branch (only if needed for governance rollback)**

```bash
gh api repos/rjulian2025/deeper-global -X PATCH -f default_branch=main
```

Do not rollback GitHub/Vercel branch settings unless intentionally reverting the alignment plan.

---

## 8. Recommendation — production deploy as next step

**Platform alignment is partially complete.** GitHub and Vercel build settings now match the root-level Astro app on `production/astro`, but Vercel still tracks **`main`** as the production branch.

### Before any production deploy

1. **Complete Vercel Production Branch** → `production/astro` via dashboard (see §4.3)
2. Confirm Git link can see branches (`sourceless: false` or branch picker lists `production/astro`)
3. Re-read `docs/deeper-platform-alignment-cutover-plan.md` gates

### When explicitly approved for production

Preferred sequence:

1. Push/merge to `production/astro` (triggers Git production build **only after** step 1 above)
2. Validate the new production deployment (or promote validated preview `dpl_78kdUzqRe611uhTa23dWn9AaVKfA` lineage)
3. Confirm aliases move to the new deployment
4. Keep **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`** noted for instant rollback

**Is production deploy safe now?** Not as an automatic follow-on to this session. Finish Vercel Production Branch alignment manually first, then run a deliberate production deploy with rollback ID ready.

---

## 9. Related documentation

| Document | Purpose |
|----------|---------|
| `docs/deeper-platform-alignment-cutover-plan.md` | Pre-alignment planning and gates |
| `docs/deeper-production-astro-branch-preview-qa-log.md` | 36/36 preview QA on `production/astro` |
| `docs/deeper-final-prealignment-preview-qa-log.md` | Pre-branch-cut preview QA |

---

## 10. Session summary

| Question | Answer |
|----------|--------|
| GitHub default branch changed? | **Yes** → `production/astro` |
| Vercel Production Branch changed? | **No** → still `main` (API blocked) |
| Vercel framework/build settings changed? | **Yes** → Astro / `npm run build` / `dist` |
| Production deployment triggered? | **No** |
| `www.deeper.global` unchanged? | **Yes** — still on `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` |
| Rollback ID recorded? | **Yes** — `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` |
