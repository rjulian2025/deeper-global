# Phase C deployment sequence (do not execute yet)

## Compatibility plan

1. Deploy application code that **reads** additive columns if present and ignores them if absent.
2. Apply additive SQL migration (`20260716210000_clinical_attribution_model.sql`).
3. Backfill `clinical_contributor_*` for high-confidence answers and editorial fields for unmatched answers.
4. Mark Ken bulk rows with `attribution_legacy_bulk_approval = true` without deleting `reviewed_at`.
5. Only after UI/API/schema are live: activate contributor profile indexing and directory inclusion.
6. Redirects for `david-k-gore-phd` remain deferred until validation.

Never apply DB backfill before the code that can render the new attribution states is deployed.

## Phased order

| Phase | Action | Risk if reversed |
| --- | --- | --- |
| C0 | Merge/deploy code (this PR) with noindex profiles | Low |
| C1 | Apply additive SQL only | Low; old code ignores columns |
| C2 | Backfill contributor + editorial + legacy bulk flags | Medium; requires rollback mapping |
| C3 | Human QA sign-off on `qa-sample.csv` | Gate |
| C4 | Activate profile index/directory for complete profiles | SEO |
| C5 | Optional Ken alias redirects | URL |

## Emergency rollback

1. Restore `reviewed_by` / `reviewed_at` / `review_status` from `apply-package/rollback-mapping.json`.
2. Null out new attribution columns for affected IDs.
3. If needed, run `20260716210000_clinical_attribution_model.rollback.sql` only after code no longer selects those columns.

## Backfill plan

- Source: `reports/reviewer-migration/apply-package/clinical-contributor-backfill-all-high.json` (923)
- Editorial: `editorial-transition-145.json`
- Preserve legacy: copy current `reviewed_by`/`reviewed_at` into `attribution_legacy_*` and set `attribution_legacy_bulk_approval` for Ken bulk dates
- Do **not** set `clinically_reviewed_at` during migration
