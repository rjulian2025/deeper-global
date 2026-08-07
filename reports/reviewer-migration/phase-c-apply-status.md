# Phase C apply status

Updated: 2026-08-07

## Completed

| Step | Status |
| --- | --- |
| C0 Merge/deploy PR #44 | **done** |
| C1 Additive SQL (`clinical_contributor_*` columns) | **done** (manual SQL editor apply; Success. No rows returned) |
| Apply tooling | **done** |

## In progress

| Step | Status |
| --- | --- |
| C2 Backfill 923 contributors + 145 editorial | **running** via `[clinical-attribution-apply]` |

## Still deferred

- C4 profile indexing / sitemap inclusion
- C5 Ken alias redirects

## Package

- 923 high-confidence clinical contributor rows
- 145 editorial transition rows
- Rollback mapping 1068
- Erin excluded; Amanda MSW; QA 105/105 approve
