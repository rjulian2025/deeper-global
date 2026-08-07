# Phase C apply status

Updated: 2026-08-07

## Intent

Execute Phase C after explicit go-ahead:

1. **C0** Merge/deploy application code (noindex contributor profiles)
2. **C1** Additive SQL attribution columns
3. **C2** Backfill 923 clinical contributors + 145 editorial transitions
4. **C4/C5** Indexing activation and Ken redirects remain deferred

## Tooling added

- `npm run reviewers:apply` / `npm run reviewers:apply -- --apply`
- `POST /api/admin/apply-clinical-attribution`
- GitHub Action: `Clinical Attribution Apply` (`workflow_dispatch`)

## Guards

- Does not mutate `reviewed_by` / `reviewed_at`
- Does not set `clinically_reviewed_at`
- Erin Benator excluded
- Soft-cap exceptions remain 0 in package
- Rollback mapping retained at `apply-package/rollback-mapping.json`

## Execution path

This cloud agent VM has no Supabase/CRON secrets. Apply is executed via GitHub Actions secrets after C0 merge/deploy.
