# Deeper AI concerns sprint draft batches

Scope: local draft-prep only. No Supabase writes, publishing, redirects, or indexation changes.

## Summary

- Draft-eligible candidates: 64
- Batch size: 10
- Batch files: 7
- AI psychosis, crisis, diagnosis, minor, trauma, abuse, and addiction-sensitive candidates require human review before insertion or promotion.

## Batches

| Batch | Count | Categories | Primary pair clusters |
| --- | ---: | --- | --- |
| `reports/ai-sprint/draft-batches/batch-01.json` | 10 | General Mental Health, Anxiety & Stress, Family & Parenting | AI + psychosis / delusional spirals, AI + paranoia, AI + grandiosity / delusion, AI + sleep loss, ... |
| `reports/ai-sprint/draft-batches/batch-02.json` | 10 | Identity & Self-Worth, Addiction & Recovery, Anxiety & Stress, Loneliness & Isolation, Relationships & Communication | AI + dependency, AI + addiction / compulsive use, AI + compulsive loop, AI + attachment / withdrawal, ... |
| `reports/ai-sprint/draft-batches/batch-03.json` | 10 | Relationships & Divorce, Grief & Loss, Identity & Self-Worth, Therapy Navigation, Therapy & Mental Health | AI + intimacy, AI + relationship conflict, AI + griefbots, AI + grief, ... |
| `reports/ai-sprint/draft-batches/batch-04.json` | 10 | Teen-Specific Questions, Parenting, Work & Burnout | AI + teens / parenting, AI + teen boundaries, AI + child attachment, AI + lonely teens, ... |
| `reports/ai-sprint/draft-batches/batch-05.json` | 10 | Work & Burnout, Identity & Self-Worth, Trauma & Grief, Anxiety & Stress | AI + manager communication, AI + burnout, AI + skill adaptation, AI + impostor syndrome, ... |
| `reports/ai-sprint/draft-batches/batch-06.json` | 10 | Anxiety & Stress, Relationships & Communication, Communication & Conflict, Identity & Self-Worth, General Mental Health | AI + moral anxiety, AI + health anxiety, AI + relationship anxiety, AI + text analysis / relationships, ... |
| `reports/ai-sprint/draft-batches/batch-07.json` | 4 | Depression, Identity & Self-Worth, Loneliness & Isolation | AI + emotional numbness, AI + shame, AI + isolation, AI + reconnection |

## Recommended drafting order

1. Start with `batch-01.json` and `batch-02.json` for AI psychosis/delusional spiral and emergency-threshold coverage.
2. Review all crisis and diagnosis-risk pages before drafting lower-risk lifestyle/work pages.
3. Keep all outputs as `review_status = draft` and `indexation_instruction = noindex_until_reviewed` until explicit promotion.
4. Do not publish AI psychosis pages without source review and visible crisis/care-note QA.
