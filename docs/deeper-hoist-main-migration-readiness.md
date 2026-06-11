# Deeper Global — Hoist & Main Migration Readiness

**Date:** 2026-06-11  
**Audit type:** Planning only — **no implementation**  
**Recovery branch:** `production/astro-v1-recovered` @ `4432a0a`  
**Open PR:** [#3](https://github.com/rjulian2025/deeper-global/pull/3) → base `codex/deeper-global-astro-v1`  
**Live site:** `www.deeper.global` / `deeper.global`  
**Vercel project:** `deeper-global-h65m` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`)

---

## ⚠️ NO-DEPLOY WARNING

**Do not deploy, merge PR #3 to `main`, promote Vercel deployments, or change Vercel dashboard settings based on this document alone.**

This is a **readiness audit** for long-term governance. Implementation requires explicit approval at each gate.

---

## 1. Source-of-truth map (current)

| Layer | What it is today | Governs production? |
|-------|------------------|---------------------|
| **Live site** | `www.deeper.global` served by Vercel project `deeper-global-h65m` | ✅ Yes (runtime truth) |
| **Last prod deploy** | CLI-sourced (`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`, ~37d ago) | ✅ Yes (last known good deploy artifact) |
| **Recovered git source** | `Documents/New project/` on `production/astro-v1-recovered` | ⚠️ Best git anchor; preview-validated 36/36 |
| **GitHub `main`** | Root-level **Next.js** app (`app/`, `next.config.js`, etc.) | ❌ Not what serves live Astro production |
| **`codex/deeper-global-astro-v1`** | Nested workspace; Astro scaffold at `Documents/New project/` | ❌ Pre-recovery Astro lineage only |
| **Vercel Git config** | Repo linked; **production branch = `main`**; **Root Directory = `.`** | ⚠️ Misaligned with live Astro + recovery branch |
| **Vercel framework preset** | Next.js (stale) | ❌ Live builds are Astro via CLI + nested `vercel.json` |

**Practical conclusion:** Production is governed by **CLI deploys from the nested Astro app**, not by GitHub `main`. Git and Vercel project settings are **not** the current source of truth for what runs in production.

---

## 2. Branch & git history map

### Branch topology

```
main (41 commits)
└── Root Next.js app — NO shared history with Astro lineage

codex/deeper-global-astro-v1 (15 commits)
├── Desktop/qv-brand-alchemy-main/
├── deeper2/deeper-global/
└── Documents/New project/          ← Astro app (pre-recovery scaffold)

production/astro-v1-recovered (17 commits = codex + 2)
├── (same nested trees as codex)
├── docs/                           ← recovery audit docs at repo root
└── Documents/New project/          ← live-parity Astro (recovered)
    ├── c5a1ac7  Recover live Astro production source
    └── 4432a0a  Document Vercel preview readiness and QA results
```

### Merge-base facts

| Branches | Common ancestor? |
|----------|------------------|
| `main` ↔ `codex/deeper-global-astro-v1` | **None** (unrelated histories) |
| `main` ↔ `production/astro-v1-recovered` | **None** (unrelated histories) |
| `codex/deeper-global-astro-v1` ↔ `production/astro-v1-recovered` | **`4ef2a69`** (Build Astro v1 intelligence layer) |

GitHub therefore **rejects PRs into `main`** from the recovery branch. PR #3 correctly targets the Astro lineage base.

### Top-level tree comparison

| Path | `main` | `codex/*` / `production/astro-v1-recovered` |
|------|--------|---------------------------------------------|
| Root `package.json` | ✅ Next.js | ❌ Missing |
| `app/`, `next.config.js` | ✅ | ❌ |
| `Documents/New project/` | ❌ | ✅ Astro app |
| `Desktop/`, `deeper2/` | ❌ | ✅ (unrelated / legacy) |
| Root `docs/` (recovery) | Partial / different | ✅ on recovery branch |

---

## 3. PR #3 — what it accomplishes and does not

**URL:** https://github.com/rjulian2025/deeper-global/pull/3  
**Head:** `production/astro-v1-recovered`  
**Base:** `codex/deeper-global-astro-v1`  
**State:** Open (not merged)  
**Diff:** 2 commits, +6,920 / −376 lines, 46 files

### What PR #3 accomplishes

- Codifies **live Astro production parity** into git on the **Astro lineage** (not `main`).
- Adds recovered `public/`, `scripts/`, live UI/CSS, `www` canonicals, sitemap filter, noindex policy, redirects, and maintenance scripts under `Documents/New project/`.
- Adds recovery/preview audit docs under root `docs/`.
- Creates a **reviewable, mergeable unit** within the branch family that actually contains the Astro app.
- Preserves safety record: no secrets, no production deploy in this work.

### What PR #3 does **not** accomplish

- Does **not** change GitHub default branch (`main` stays Next.js).
- Does **not** change Vercel Root Directory, framework preset, or production branch.
- Does **not** enable Git-based Vercel builds for the recovered app (Root Directory still `.`).
- Does **not** hoist Astro to repo root or retire nested cruft (`Desktop/`, `deeper2/`).
- Does **not** replace or reconcile unrelated `main` history.
- Does **not** authorize production deploy — merging to `codex/deeper-global-astro-v1` alone does not deploy anything.

---

## 4. Vercel alignment snapshot (unchanged in this audit)

| Setting | Current value | Aligned with live Astro? |
|---------|---------------|--------------------------|
| Root Directory | `.` (null) | ❌ App is nested |
| Framework Preset | Next.js | ❌ Stale |
| Production Branch | `main` | ❌ `main` is Next.js, not Astro |
| Recent deploy source | CLI only | ⚠️ Bypasses Git config |
| Preview env vars | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | ✅ Sufficient for build |

Validated preview (36/36): CLI from `Documents/New project/` → `dpl_BthFdebMjhxW183G5xfHp8zucVGy` (preview target only).

---

## 5. Future path options

### Option A — Keep nested; manual CLI preview/deploy

**Description:** Leave repo layout and Vercel dashboard unchanged. Continue `cd "Documents/New project" && vercel` (preview) and, when explicitly approved, `vercel --prod` from the same directory.

| Dimension | Assessment |
|-----------|------------|
| **Operational risk** | **Low** — matches how production has been deployed for months |
| **Production risk** | **Low–medium** — human error (`--prod` from wrong cwd) is the main hazard |
| **GitHub/Vercel complexity** | **Low** — no config changes; Git integration remains effectively unused for Astro |
| **Rollback path** | **Strong** — prior prod deployment (`dpl_BaKpUGFGS1nJTCLadaNDr2S8uEF2`) remains in Vercel history |
| **Long-term maintainability** | **Poor** — nested path, unrelated `main`, no PR previews, cruft at repo root |
| **Preserves 36/36 parity** | **Yes** — already proven on this path |
| **Future steps (when approved)** | 1. Merge PR #3 to `codex/deeper-global-astro-v1` for git record. 2. Tag recovery commit. 3. CLI preview before any prod. 4. CLI prod only with explicit gate checklist. |

---

### Option B — Set Vercel Root Directory to `Documents/New project/`; Git-based preview/deploy on Astro branch

**Description:** Dashboard change: Root Directory → `Documents/New project`. Optionally change Production Branch from `main` to `production/astro-v1-recovered` (or post-merge `codex/deeper-global-astro-v1`). Rely on Git pushes/PRs for preview; prod via merge + auto-deploy or manual promote.

| Dimension | Assessment |
|-----------|------------|
| **Operational risk** | **Medium** — project-wide setting; path contains a space; team must understand new rules |
| **Production risk** | **Medium–high** if Production Branch stays `main` — pushes to `main` would build wrong/missing app from nested root. **High** if prod auto-deploy fires on wrong branch |
| **GitHub/Vercel complexity** | **Medium** — one dashboard change + branch strategy decision + `.vercelignore` for `Desktop/`, `deeper2/` recommended |
| **Rollback path** | **Medium** — revert Root Directory to `.` and redeploy prior CLI prod; document previous settings first |
| **Long-term maintainability** | **Medium** — Git previews work, but nested layout and unrelated `main` remain confusing |
| **Preserves 36/36 parity** | **Likely yes** — same build root as validated preview, assuming env vars unchanged |
| **Future steps (when approved)** | 1. Snapshot current Vercel settings. 2. Set Root Directory. 3. Update Framework to Astro (or rely on `vercel.json`). 4. **Change Production Branch** away from `main` OR disable auto-prod on `main`. 5. Merge PR #3. 6. PR preview QA. 7. Prod deploy gate. |

**Critical constraint:** With Production Branch = `main` and Root Directory = `Documents/New project/`, **any `main` deploy will fail or build nonsense**. Option B is unsafe unless Production Branch and Git workflow are updated in the same change window.

---

### Option C — Hoist to repo root; explicit `main` migration

**Description:** Move `Documents/New project/*` to repo root on a dedicated migration branch. Archive or relocate `Desktop/`, `deeper2/`, and legacy Next.js `main` content. Replace `main` through an explicit strategy (orphan branch, unrelated-histories merge, or new default branch). Align Vercel Root Directory = `.` and Production Branch with the Astro branch.

| Dimension | Assessment |
|-----------|------------|
| **Operational risk** | **High** — large tree move, unrelated histories, many files touched |
| **Production risk** | **High during migration** — mitigated by preview-first and keeping CLI rollback deploy |
| **GitHub/Vercel complexity** | **High** — requires migration strategy for `main`, PR policy, Vercel branch + root updates |
| **Rollback path** | **Medium** — git revert/restore branch + Vercel promote previous deployment; must archive pre-hoist state first |
| **Long-term maintainability** | **Best** — standard repo layout, Git previews, clear default branch, CI-friendly |
| **Preserves 36/36 parity** | **Yes, if hoist is move-only** — no logic changes; re-run full preview QA after hoist |
| **Future steps (when approved)** | See §7 implementation checklist |

#### Migration strategies for unrelated `main` (pick one at implementation time)

| Strategy | Pros | Cons |
|----------|------|------|
| **C1. New default branch** — hoist on `production/astro-v1-recovered`, make it GitHub default + Vercel Production Branch; leave `main` archived | No force-push; clear cutover | `main` name remains misleading until renamed |
| **C2. Replace `main` via orphan commit** — new root tree as orphan, force-push `main` after backup tag | Clean `main` name | Destructive; requires backup and team coordination |
| **C3. Unrelated histories merge** — merge Astro hoist into `main` with `--allow-unrelated-histories` | Preserves both histories | Messy merge commit; dual-root artifacts to clean |
| **C4. New repository** — hoist into fresh repo; re-link Vercel | Cleanest separation | Migration overhead, URL/CI rewiring |

---

## 6. Option comparison summary

| Criterion | Option A (nested CLI) | Option B (Vercel root) | Option C (hoist → main) |
|-----------|----------------------|--------------------------|-------------------------|
| Operational risk | 🟢 Low | 🟡 Medium | 🔴 High |
| Production risk | 🟢 Low–medium | 🟡 Medium–high* | 🔴 High (during cutover) |
| GitHub/Vercel complexity | 🟢 Low | 🟡 Medium | 🔴 High |
| Rollback ease | 🟢 Strong | 🟡 Moderate | 🟡 Moderate |
| Long-term maintainability | 🔴 Poor | 🟡 Medium | 🟢 Best |
| 36/36 parity preserved | 🟢 Proven | 🟢 Likely | 🟢 If move-only + re-QA |
| Changes Vercel settings | ❌ No | ✅ Yes | ✅ Yes (later) |
| Fixes `main` misalignment | ❌ No | ❌ No | ✅ Yes |

\*Option B production risk drops to **medium** only if Production Branch is changed **simultaneously** with Root Directory.

---

## 7. Recommended path

### Safest **next** step (now)

**Stay on Option A. Review and merge PR #3 into `codex/deeper-global-astro-v1` only when ready — not into `main`.**

Rationale:

1. **Production is stable** and was not deployed during recovery; no urgent config change required.
2. **36/36 preview parity is proven** via nested CLI — the lowest-risk known path.
3. **Option B without branch realignment is dangerous** (Production Branch = `main` + nested root = broken auto-deploys).
4. **Option C is the right long-term goal** but should not start until PR #3 is merged and a explicit migration strategy (C1–C4) is chosen.
5. Merging PR #3 to `codex/deeper-global-astro-v1` **records recovery in git** without touching Vercel or `main`.

### Recommended **sequence** (future, gated)

```
Phase 0 (now)     → Option A; PR #3 review; no Vercel changes; no prod deploy
Phase 1 (git)     → Merge PR #3 to codex/deeper-global-astro-v1; tag `astro-recovery-v1`
Phase 2 (plan)    → Choose Option C strategy (C1 recommended: new default branch)
Phase 3 (hoist)   → Move-only hoist branch; `.vercelignore`; re-run 36/36 preview QA
Phase 4 (align)   → GitHub default branch + Vercel Production Branch + Root Directory = `.`
Phase 5 (gate)    → Preview on new layout → explicit prod deploy approval
```

**Do not skip Phase 3 preview QA after hoist.** Move-only still changes paths Vercel and tooling resolve.

---

## 8. Explicit non-goals

This audit does **not** authorize:

- Merging PR #3 into `main`
- Hoisting files or deleting `Desktop/`, `deeper2/`, or legacy Next.js trees
- Changing Vercel Root Directory, Production Branch, or framework preset
- Running `vercel --prod` or promoting any deployment
- Force-pushing `main` without a documented backup strategy
- Creating a new Vercel project (unless explicitly approved later)
- Treating GitHub `main` as the live Astro source of truth

---

## 9. Future implementation checklist (Option C — when approved)

### Pre-hoist

- [ ] Merge PR #3 to `codex/deeper-global-astro-v1`
- [ ] Tag: `pre-hoist-astro-recovery` @ `4432a0a`
- [ ] Choose migration strategy (C1–C4); document in ADR or recovery doc
- [ ] Export/archive current `main` (tag `legacy-nextjs-main-2026-06-11`)
- [ ] Snapshot Vercel settings (Root Directory, Production Branch, env vars)

### Hoist commit (single focused PR)

- [ ] Branch from `production/astro-v1-recovered`
- [ ] Move `Documents/New project/*` → repo root (`package.json`, `src/`, `public/`, `vercel.json`, etc.)
- [ ] Move recovery docs: keep `docs/deeper-*.md`
- [ ] Relocate (do not delete) `Desktop/`, `deeper2/` → `_archive/` or leave in place with `.vercelignore`
- [ ] Merge root `.gitignore` from Astro app
- [ ] **No** functional code edits in hoist commit

### Post-hoist validation

- [ ] `npm ci && npm run build` locally with Supabase env
- [ ] Vercel preview from repo root (no `--prod`)
- [ ] Re-run full preview QA checklist (36 checks)
- [ ] Confirm sitemap 1,030 URLs, CSS hash, llms.txt www URLs

### Platform alignment (same change window)

- [ ] Set GitHub default branch to hoisted branch (if C1)
- [ ] Vercel: Root Directory = `.`, Framework = Astro, Production Branch = new default
- [ ] Add `.vercelignore`: `_archive/`, `Desktop/`, `deeper2/` (if retained)
- [ ] Verify `main` push does not auto-deploy broken build

### Production cutover (explicit approval only)

- [ ] Preview QA sign-off
- [ ] CLI or Git preview deploy reviewed
- [ ] `vercel --prod` or promote — **one authorized action**
- [ ] Post-deploy smoke test on `www.deeper.global`
- [ ] Rollback plan documented (prior deployment ID)

---

## 10. Related documents

| Document | Purpose |
|----------|---------|
| [`deeper-production-recovery-notes.md`](./deeper-production-recovery-notes.md) | Initial recovery + hoist outline |
| [`deeper-preview-readiness.md`](./deeper-preview-readiness.md) | Vercel preview settings analysis |
| [`deeper-preview-qa-log.md`](./deeper-preview-qa-log.md) | 36/36 preview validation record |
| [`deeper-production-parity-recovery-log.md`](./deeper-production-parity-recovery-log.md) | Worktree discovery + merge |
| [PR #3](https://github.com/rjulian2025/deeper-global/pull/3) | Recovery review PR |

---

## 11. Audit summary

| Question | Answer |
|----------|--------|
| What governs production today? | CLI deploys from nested Astro app, not GitHub `main` |
| Can PR #3 fix `main`? | **No** — it only merges within Astro lineage |
| Safest near-term path? | **Option A** — nested CLI; merge PR #3 to `codex/*` when ready |
| Safest long-term path? | **Option C** (strategy **C1** preferred) after gated hoist + re-QA |
| Is Option B alone safe? | **No** — requires simultaneous Production Branch change |
| Ready to hoist now? | **No** — plan approved; implementation not started |

---

**Reminder: Planning audit only. No deploy. No merge to `main`. No Vercel setting changes.**
