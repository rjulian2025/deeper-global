# Legacy review-date correction (display only)

Database `reviewed_at` values are **not** erased in Phase C. Public rendering changes.

## Before (misleading)

For Ken bulk rows (`david-k-gore-phd`, `reviewed_at` ≈ 2026-06-19):

- Meta: `Clinical Reviewer · Reviewed June 19, 2026`
- Sidebar: `Reviewed June 19, 2026`
- Schema risk: `reviewedBy` Person implied clinical review; no accurate contributor distinction

Example slug: any of the 1,036 rows dated 2026-06-19 in the live API.

## After (Phase C code)

Same DB row, no mutation:

- Meta: `Clinical contributor · Updated {content updated_at}`
- Sidebar attribution block:
  - Clinical contributor
  - Kenneth W. Christian, PhD
  - specialty line
  - Updated {content updated_at}
  - **No** “Reviewed June 19, 2026”
- Schema: Person linked as `contributor` (not `reviewedBy`); no `dateReviewed`

## After apply (planned)

High-confidence rows:

- `clinical_contributor_id` = Peachtree clinician
- Public: Clinical contributor + clinician + specialties + Peachtree Psychology
- No clinical review date

Unmatched 145:

- Public: `Editorially reviewed by Deeper`
- No named clinician
- No clinical review date
- Legacy Ken ids retained only in `attribution_legacy_*` audit fields
