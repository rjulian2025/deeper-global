# Phase C apply status

Updated: 2026-08-07

## Completed

| Step | Status |
| --- | --- |
| C0 Merge/deploy PR #44 | **done** (`68f9657` → production READY) |
| Apply tooling | **done** (`npm run reviewers:apply`, admin API, GitHub Action) |
| CRON_SECRET → admin API path | **verified working** |
| Bundled migration SQL in admin runtime | **done** |

## Blocked: C1 additive SQL

Production Supabase does **not** yet have the attribution columns, and neither GitHub Actions nor Vercel Production has a DDL credential:

- `SUPABASE_ACCESS_TOKEN` — missing
- `SUPABASE_DB_PASSWORD` / `SUPABASE_DB_URL` / `POSTGRES_URL*` — missing
- `SUPABASE_SERVICE_ROLE_KEY` in GitHub — missing (Vercel has it, but service role cannot run `ALTER TABLE`)

Latest failed apply run: https://github.com/rjulian2025/deeper-global/actions/runs/31181629295

Error:

> Additive attribution columns are missing and migration could not be applied from this runtime.

## Unblock (pick one)

### Option A — paste SQL once (fastest)

In Supabase SQL editor for project `ldizjhrfnxaacedmbujt`, run:

`supabase/migrations/20260716210000_clinical_attribution_model.sql`

Then re-run apply:

```bash
# from a machine/agent with CRON_SECRET, or push to production/astro with:
# [clinical-attribution-apply] in the commit message
npm run reviewers:apply -- --apply --force-remote
```

Or push an empty/status commit containing `[clinical-attribution-apply]` that touches a watched path under `reports/reviewer-migration/`.

### Option B — add one secret, then re-run

Add **either** to GitHub Actions secrets **or** Vercel Production:

- `SUPABASE_ACCESS_TOKEN` (Supabase personal access token), or
- `SUPABASE_DB_PASSWORD` / `POSTGRES_URL`

Then push `[clinical-attribution-apply]` again.

## Still deferred after C1/C2

- C4 profile indexing / sitemap inclusion
- C5 Ken alias redirects

## Package ready for C2

- 923 high-confidence clinical contributor rows
- 145 editorial transition rows
- Rollback mapping 1068
- Erin excluded; Amanda MSW; QA 105/105 approve
