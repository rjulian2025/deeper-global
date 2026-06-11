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

---

## 11. Addendum — Vercel Git branch visibility diagnosis (2026-06-11)

**Session type:** Diagnosis only — no deploy, no push, no Vercel settings changed, no app edits.

### Dashboard error observed

When attempting **Settings → Environments → Production → Branch Tracking → `production/astro` → Save**, Vercel rejected the change:

```text
Branch "production/astro" not found in the connected Git repository.
```

Same error class as earlier API attempts (`git_branch_not_found`).

### GitHub branch verification

Remote heads confirmed on `origin` (`https://github.com/rjulian2025/deeper-global.git`):

| Branch | Remote SHA | Exists? |
|--------|------------|---------|
| `production/astro` | `eb5cf8b` | ✅ Yes |
| `codex/deeper-global-astro-v1` | `d1e19e8` | ✅ Yes |
| `main` | `0007864` | ✅ Yes |

GitHub API branch list (8 branches total) includes both slash and slashless names, e.g. `production/astro`, `codex/deeper-global-astro-v1`, `opt/sprint-01`, `vercel/install-vercel-web-analytics-rwkict`.

GitHub metadata:

| Field | Value |
|-------|-------|
| Full name | `rjulian2025/deeper-global` |
| Repo ID | `1034144062` |
| Default branch | `production/astro` |
| Last push | `2026-06-11T17:16:26Z` |

Local repo: on `production/astro`, clean working tree, `origin/production/astro` tracked.

### Vercel Git link inspection

| Field | Value |
|-------|-------|
| Project | `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`) |
| Git provider | `github` |
| Connected repo | **`rjulian2025/deeper-global`** ✅ matches GitHub |
| Repo ID | `1034144062` ✅ matches GitHub |
| Repo owner ID | `204274351` |
| Git credential ID | `cred_c45f9bd688e6bfebba31e55116d8e84ebe477bec` |
| Production branch (configured) | `main` |
| **`sourceless`** | **`true`** ⚠️ |
| Link `createdAt` / `updatedAt` | `1754610356689` / `1754610356689` (never refreshed since project link creation) |
| Project `updatedAt` | `1781198046883` (framework/build settings only) |

Build settings remain aligned: Astro, root `.`, `npm install`, `npm run build`, `dist`, Node `22.x`.

### Slash vs slashless branch test (diagnostic API probes)

Read-only diagnosis used the undocumented `/branch` endpoint; **all probes failed** with `git_branch_not_found` — no setting was mutated:

| Branch tested | Result |
|---------------|--------|
| `main` | `git_branch_not_found` |
| `production/astro` | `git_branch_not_found` |
| `codex/deeper-global-astro-v1` | `git_branch_not_found` |
| `opt/sprint-01` | `git_branch_not_found` |
| `production-astro` (hypothetical slashless) | `git_branch_not_found` |
| `astro-production` (hypothetical slashless) | `git_branch_not_found` |

**Conclusion:** This is **not** a slash-in-branch-name problem. Vercel cannot enumerate **any** branch from the connected repository, including `main` (the currently configured production branch).

### Likely root cause

1. **Stale / sourceless Git link** — `sourceless: true` with link metadata frozen at project creation time indicates Vercel is not successfully reading the live GitHub branch list through its stored credential.
2. **Branch cache never populated** — Dashboard Branch Tracking validates against Vercel’s internal branch index, not GitHub directly; that index appears empty or disconnected.
3. **Not a wrong-repo problem** — Repo ID and owner match GitHub exactly.
4. **Not a missing-branch problem** — Branch exists and is GitHub default.

Recent preview deployments carry `githubCommitRef` in metadata, but those were **CLI-initiated** (`actor: cursor-cli`), not proof that Git webhook branch tracking is healthy. Live production (`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`) is **CLI-only** with no Git ref metadata.

### Workaround options evaluated (not implemented)

| Option | Description | Verdict |
|--------|-------------|---------|
| **A** | Slashless alias branch (e.g. `production-astro`) | ❌ **Unlikely to help** — even `main` and `opt/sprint-01` fail branch validation |
| **B** | Reconnect Vercel Git integration to `rjulian2025/deeper-global` | ✅ **Recommended primary fix** — refreshes credential and branch index; do **not** redeploy on save |
| **C** | Keep CLI deploy workflow; skip Git production branch alignment | ✅ **Safest short-term** — production already CLI-driven; defers Git cutover |
| **D** | Use `codex/deeper-global-astro-v1` as production branch | ❌ **Same failure** — also rejected by branch index |
| **E** | Rename long-term branch to `production-astro` | ❌ **Same failure** — hypothetical slashless names also rejected |

### Recommended workaround (when approved to act)

**Primary:** Option **B** — In Vercel **Settings → Git**, reconnect `rjulian2025/deeper-global` (or refresh GitHub App permissions for the Vercel integration on GitHub). After reconnect:

1. Confirm `sourceless` becomes `false` or branch picker lists branches.
2. Retry **Production → Branch Tracking → `production/astro`**.
3. **Do not redeploy** until explicitly approved.
4. **Do not push** to `production/astro` until production deploy is intentionally gated — once branch tracking is fixed, the next push **will** trigger a production deployment.

**Fallback:** Option **C** — Continue validated CLI preview → explicit promote workflow; treat Git production branch as non-blocking until reconnect is safe.

### Production unchanged confirmation

| Check | Result |
|-------|--------|
| Live production deployment | **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`** (unchanged) |
| `www.deeper.global` | HTTP **200** |
| Vercel Production Branch | Still **`main`** (dashboard change blocked) |
| New production deployment | **None** |
| Vercel settings mutated | **No** (diagnostic probes failed without effect) |
| Deploy / push / promote | **None** |

---

## 12. Addendum — Vercel Git reconnection and Production Branch (2026-06-11)

**Session type:** Manual dashboard repair + API verification — no deploy, no push, no `vercel` CLI.

### Manual actions performed (user-confirmed)

1. **Settings → Git** — confirmed connection was `GitHub → rjulian2025/deeper-global`
2. **Disconnected** and **reconnected** the same repository (Vercel showed “connected just now”)
3. **Settings → Environments → Production → Branch Tracking** — set to **`production/astro`** and saved successfully
4. **Did not** click Redeploy, Deploy, Promote, Create Deployment, Deploy latest commit, or push to GitHub

### Post-reconnect API verification

| Setting | Before reconnect | After reconnect |
|---------|------------------|-----------------|
| Git repo | `rjulian2025/deeper-global` | `rjulian2025/deeper-global` (unchanged) |
| Repo ID | `1034144062` | `1034144062` (unchanged) |
| **`sourceless`** | **`true`** | **`null` / absent** ✅ (branch index restored) |
| **`productionBranch`** | **`main`** | **`production/astro`** ✅ |
| Link `updatedAt` | `1754610356689` (frozen) | **`1781198955459`** ✅ (refreshed) |
| Framework | Astro | Astro ✅ |
| Root Directory | `.` | `.` ✅ |
| Install Command | `npm install` | `npm install` ✅ |
| Build Command | `npm run build` | `npm run build` ✅ |
| Output Directory | `dist` | `dist` ✅ |
| Node.js Version | `22.x` | `22.x` ✅ |

### Branch visibility restored

Diagnostic branch API validation (post-reconnect):

| Branch | Result |
|--------|--------|
| `main` | **SUCCESS** (recognized) |
| `production/astro` | **SUCCESS** (recognized) |

Dashboard Branch Tracking save for **`production/astro`** succeeded — confirms Vercel can enumerate GitHub branches again.

### Production unchanged confirmation

| Check | Result |
|-------|--------|
| Live production deployment | **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`** ✅ unchanged |
| Production aliases | `www.deeper.global`, `deeper.global`, project Vercel aliases ✅ |
| `www.deeper.global` | HTTP **200** ✅ |
| New production deployment | **None** — latest prod deploys remain CLI-sourced |
| Environment variables | **Unchanged** |
| GitHub push | **None** |

### Platform alignment status

| Layer | Status |
|-------|--------|
| GitHub default branch | `production/astro` ✅ |
| Vercel Production Branch | `production/astro` ✅ |
| Vercel build/framework settings | Astro / root / `npm run build` / `dist` ✅ |
| Git branch enumeration | **Repaired** ✅ |
| Live production runtime | **Still prior CLI deployment** — cutover not yet executed |

### ⚠️ Warning — next push will trigger production deploy

With Production Branch now set to **`production/astro`**, **any push to that branch will create a production deployment** and may move `www.deeper.global` off `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`.

**Unpushed local commits** on `production/astro` (including doc commits) must **not** be pushed until production deploy is explicitly approved.

Rollback reference remains: **`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`**

### Recommended next step (separate gated session)

When ready for production cutover:

1. Push `production/astro` (or merge to it) only with explicit approval
2. Monitor the Git-triggered production build
3. Validate the new production deployment before alias cutover completes
4. Keep rollback deployment ID ready

---

## 13. Updated session summary (post Git reconnect)

| Question | Answer |
|----------|--------|
| Git reconnection completed? | **Yes** — same repo reconnected |
| Branch visibility restored? | **Yes** — `sourceless` cleared; branches recognized |
| Production Branch now `production/astro`? | **Yes** |
| Build/framework settings aligned? | **Yes** — unchanged and correct |
| Production deployment triggered? | **No** |
| `www.deeper.global` unchanged? | **Yes** — still on `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` |
| Push occurred? | **No** |
| Rollback ID recorded? | **Yes** — `dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2` |
