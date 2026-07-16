# Recommended crosswalk revisions (from coherence analysis)

Automated coherence did **not** force-downgrade any of the 923 high-confidence rows.
Eleven clinicians were flagged `needs_review` primarily for spanning more than three major themes
(expected for broad Peachtree generalists). Lauren Sanders was flagged for Life Transitions fallback share.

## Recommended changes before apply

1. **Life Transitions**: require keyword support for high confidence on `work-and-burnout` and `general-mental-health`; demote pure parent-weight matches to medium.
2. **Trauma vs meaning/faith**: do not let Trauma/PTSD specialties win `meaning-faith-and-existential-questions` unless trauma language is primary in title/question.
3. **Perinatal**: Meredith Price Pregnancy specialty should not influence generic anxiety/depression pages without perinatal keywords.
4. **Coach role (Jeannine)**: require student/parent/ADHD/executive-function signals for family pages; otherwise medium/unmatched.
5. **Loneliness cluster**: add explicit loneliness/social-connection specialty mapping or keep those answers in the unmatched editorial set (currently medium).
6. **Broad generalists**: keep soft-cap behavior; human-review QA sample rows for Samantha, Susan, Laura, Michaela before apply.

## Counts

| Metric | Value |
| --- | ---: |
| High-confidence original | 923 |
| Auto-downgraded by coherence rules | 0 |
| Clinicians flagged for human distribution QA | 11 |
| High-confidence surviving automated QA rules | 923 |
| Pending human decisions in `qa-sample.csv` | 105 |
