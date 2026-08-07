# Clinical contributor migration (Phase A–B)

Dry-run only. No production `reviewed_by` / `reviewed_at` mutations.

## Commands

```bash
npm run reviewers:audit
npm run reviewers:assign -- --dry-run
npm run reviewers:assign -- --dry-run --include-medium
npm run reviewers:validate
npm run reviewers:rollback
```

`--apply` is intentionally blocked.

## Public attribution

Specialty-matched Peachtree assignments use **Clinical contributor** (not Clinical reviewer / Reviewed by). No review date is shown for these assignments.

## Reports

Written to `reports/reviewer-migration/` (see assignment-summary.json).
