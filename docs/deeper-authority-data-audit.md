# Deeper authority data audit

Generated: 2026-06-11T19:25:26.217Z

Read-only snapshot from `questions_master`. No data was modified.

## Summary

| Metric | Count | Share |
| --- | ---: | ---: |
| Total answers | 1005 | 100% |
| Likely v2 answers (`content_enriched_at` or `answer_sections`) | 6 | 0.6% |
| Indexable by current `shouldIndexQuestion` rule | 6 | 0.6% |
| With populated `source_refs` | 6 | 0.6% |
| With populated `reviewed_by` | 6 | 0.6% |
| Crisis-sensitive (keyword heuristic) | 11 | 1.1% |
| Build answer-count floor (`950+`) | PASS | — |

## review_status distribution

| Status | Count | Share |
| --- | ---: | ---: |
| draft | 999 | 99.4% |
| reviewed | 6 | 0.6% |

## Trust field coverage

- `source_refs`: rendered on answer pages only when at least one ref has a title or URL.
- `reviewed_by`: rendered on answer pages only when the field is non-empty.
- Answers without either field show a neutral editorial statement and link to `/editorial-policy/`.

## Entity / category answer counts (top 20 by slug)

| Entity slug | Answers |
| --- | ---: |
| identity-and-self-worth | 167 |
| anxiety-and-stress | 113 |
| depression | 103 |
| addiction-and-recovery | 81 |
| general-mental-health | 67 |
| relationships-and-communication | 55 |
| relationships-and-divorce | 47 |
| grief-and-loss | 32 |
| trauma-and-grief | 29 |
| family-and-parenting | 28 |
| communication-and-conflict | 26 |
| work-and-burnout | 24 |
| teens-and-identity | 24 |
| work-and-life-balance | 20 |
| therapy-and-mental-health | 15 |
| therapy-navigation | 12 |
| work-stress-and-burnout | 11 |
| teen-specific-questions | 10 |
| loneliness-and-isolation | 9 |
| parenting | 8 |

## Category labels (top 20)

| Category | Answers |
| --- | ---: |
| Identity & Self-Worth | 167 |
| Anxiety & Stress | 113 |
| Depression | 103 |
| Addiction & Recovery | 81 |
| General Mental Health | 67 |
| Relationships & Communication | 55 |
| Relationships & Divorce | 47 |
| Grief & Loss | 32 |
| Trauma & Grief | 29 |
| Family & Parenting | 28 |
| Communication & Conflict | 26 |
| Work & Burnout | 24 |
| Teens & Identity | 24 |
| Work & Life Balance | 20 |
| Therapy & Mental Health | 15 |
| Therapy Navigation | 12 |
| Work, Stress & Burnout | 11 |
| Teen-Specific Questions | 10 |
| Loneliness & Isolation | 9 |
| Parenting | 8 |

## Duplicate-looking slug patterns

| Prefix pattern | Count |
| --- | ---: |
| `why-do-i-feel-like` | 79 |
| `how-do-i-deal-with-feeling-like` | 34 |
| `how-do-i-stop-feeling-like` | 26 |
| `what-should-i-do-if` | 58 |
| `what-if` | 24 |
| `how-do-i-know-if` | 63 |

## Slug collisions

No duplicate slugs detected.

## Notes for Phase 1B+

- Indexation was not changed in Phase 1A; indexable counts reflect existing `shouldIndexQuestion` logic only.
- Entity consolidation and category/entity routing were not changed.
- Use this audit before any broad indexation or canonical entity work.

