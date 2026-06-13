# Deeper Phase 1B 97-item draft pilot batches

Scope: local draft-prep only. No Supabase writes, publishing, URL changes, redirects, or indexation changes.

## Summary

- Draft-eligible candidates: 97
- Batch size: 10
- Batch files: 10
- All candidates remain `review_status = draft` and `indexation_instruction = noindex_until_reviewed`.

## Batches

| Batch | Count | Categories |
| --- | ---: | --- |
| `reports/phase-1b/draft-batches/batch-01.json` | 10 | Addiction & Recovery, Anxiety & Stress, Communication & Conflict |
| `reports/phase-1b/draft-batches/batch-02.json` | 10 | Communication & Conflict, Depression, Family & Parenting |
| `reports/phase-1b/draft-batches/batch-03.json` | 10 | Family & Parenting, General Mental Health, Grief & Loss |
| `reports/phase-1b/draft-batches/batch-04.json` | 10 | Grief & Loss, Identity & Self-Worth, Loneliness & Isolation |
| `reports/phase-1b/draft-batches/batch-05.json` | 10 | Loneliness & Isolation, Parenting, Relationships & Communication |
| `reports/phase-1b/draft-batches/batch-06.json` | 10 | Relationships & Communication, Relationships & Divorce, Teen-Specific Questions |
| `reports/phase-1b/draft-batches/batch-07.json` | 10 | Teen-Specific Questions, Teens & Identity, Therapy & Mental Health |
| `reports/phase-1b/draft-batches/batch-08.json` | 10 | Therapy & Mental Health, Therapy Navigation, Trauma & Grief |
| `reports/phase-1b/draft-batches/batch-09.json` | 10 | Trauma & Grief, Work & Burnout, Work & Life Balance |
| `reports/phase-1b/draft-batches/batch-10.json` | 7 | Work & Life Balance, Work, Stress & Burnout |

## Recommended drafting order

1. Start with `batch-01.json` as a test of the draft-output format.
2. Do not draft all 97 at once until one batch passes human review.
3. Keep crisis-sensitive, self-harm, abuse, minor, medication, and diagnosis-risk items as draft only until reviewed.
4. Do not set `review_status` to `reviewed`; drafting is not review.
