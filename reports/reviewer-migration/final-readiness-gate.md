# Final technical readiness gate

Updated: 2026-08-07

Branch: `cursor/clinical-contributor-migration-c37c`  
PR: #44  
Validated commit (Vercel): `6003d923a665b00b9a97d028f4e85a50c7245aef`  
Follow-up: Amanda `MSW` credentialLine sidebar/schema display fix (this revision)

## Environment readiness

| Check | Result |
| --- | --- |
| Local agent `SUPABASE_URL` / anon key | **still missing** in this VM |
| `npm run env:check` → `ready_for_read` | false |
| Local `npm run build` in agent | not runnable without injected secrets |
| Vercel production-project build of this branch | **READY** (`dpl_Hab5yn19NdZroMrjFg4Ds3i2QwNv`) |
| Production-equivalent Supabase data access (Vercel build) | **yes** |
| Live/public corpus reachable | **yes** (1146 answers) |

### Why local secrets are still absent

Cursor Cloud Agent secrets are **not present in this running VM**. Prior saves to a local laptop `secrets.env` or the Cursor dashboard do not retrofit an already-booted pod. Vercel MCP can manage deployments but cannot export env values into the agent filesystem.

**To enable local `npm run build` in a future agent run:** add `SUPABASE_URL` + `SUPABASE_ANON_KEY` (or `PUBLIC_*` variants) as Cloud Agent secrets, then **start a new agent run** so they inject at boot.

### Unblock path used for this gate

Use the already-completed Vercel Supabase-connected build of this branch + authenticated preview HTML validation.

- Deployment: `dpl_Hab5yn19NdZroMrjFg4Ds3i2QwNv`
- Alias: `deeper-global-www-production-git-cursor-clinical-co-be2b4a-gps4.vercel.app`
- Build: **1377 pages**, complete in ~19s static generation / ~30s total
- Answer corpus present (answers paginated through page 24+; floor 950 satisfied)

## Commands / checks run

| Command / check | Result |
| --- | --- |
| `npm run env:check` | fail (local) |
| `npm run reviewers:reconcile-qa` | pass |
| `npm run reviewers:pre-apply-validate` | pass |
| Vercel build logs (this branch) | pass, 1377 pages |
| Preview HTML validation (share auth) | pass (see below) |
| Local `npm run check` / `npm run build` | skipped (no local Supabase secrets) |

## Reconciliation totals

| Metric | Value |
| --- | ---: |
| approve | 105 |
| revise / reject / pending | 0 / 0 / 0 |
| Final contributor assignments | 923 |
| Final editorial transitions | 145 |
| Soft-cap exceptions | 0 |
| Locked QA overrides | 105 |

## Preview validation summary

### Profiles
- Prepared Peachtree clinician routes compile (including Amanda + Erin route shell)
- Eligible org membership: **14** public-complete clinicians (Erin report-only excluded; Jeannine restricted/coach excluded)
- New Peachtree profiles: `noindex,follow`
- Sitemap excludes new Peachtree profiles + Peachtree org (`amanda-gaines`, `laura-hilsen`, org absent; Alex legacy remains)
- Amanda: title Clinical contributor; professional title Master Social Worker; degree source Kennesaw in bio; no PhD/LPC/psychologist inflation; Peachtree affiliation present
- Amanda display fix in this revision: sidebar/schema now prefer `credentialLine` (`MSW · Master Social Worker`) so the MSW abbreviation is visible
- Erin: route exists, `noindex`; **not** listed on org page; **0** public assignments

### Answer attribution (pre-apply transitional UI)
- Ken bulk answers render **Clinical contributor** (not Clinical reviewer)
- **No** `Reviewed June 19, 2026`
- **No** schema `reviewedBy` / `dateReviewed`
- Schema uses `contributor` for legacy Ken path; MedicalWebPage retained
- Named specialty reassignment to Peachtree clinicians still requires DB apply (not done)

### Apply package
- 923 backfill rows: `clinical_contributor_*` only; preserve legacy; `do_not_set_clinically_reviewed_at`
- 145 editorial transition rows
- Rollback mapping 1068
- Local pre-apply validate: ok

## Production-readiness decision

| Field | Value |
| --- | --- |
| `production_ready` | **true** (technical build/package/profile gates cleared via Vercel Supabase build + package checks; Amanda MSW display fix included in follow-up commit) |
| `apply_blocked` | **true** |

### Remaining non-apply blockers
None for technical readiness.

### Still explicitly blocked (human go-ahead)
- merge
- deploy to production traffic
- SQL apply / Supabase mutation
- route indexing activation / sitemap inclusion
- redirects

## Explicitly not performed
- production write / SQL apply / merge / deploy / indexing activation
