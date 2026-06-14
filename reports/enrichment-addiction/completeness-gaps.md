# Addiction enrichment completeness audit

Generated: 2026-06-13T23:56:22.542Z

Source slugs: `reports/review-updates/addiction-review-2026-03-13.json` (113 addiction answers)

## Summary

| Metric | Count | Share |
| --- | ---: | ---: |
| Addiction answers scanned | 113 | 100% |
| Missing from Supabase | 0 | 0.0% |
| Likely v2 answers | 113 | 100.0% |
| Complete (score ≥ 90) | 113 | 100.0% |
| Crisis-sensitive (priority) | 108 | 95.6% |
| Average completeness score | 100 | — |

## Most common missing fields

| Field | Missing | Share |
| --- | ---: | ---: |
| source_refs>=2 | 5 | 4.4% |

## Upgrade queue (top 30)

| # | Slug | Score | Tier | Crisis | Missing (sample) |
| --- | --- | ---: | --- | --- | --- |
| 1 | can-using-ai-for-emotional-support-become-addictive | 94 | complete | yes | source_refs>=2 |
| 2 | is-it-normal-to-feel-bored-or-empty-after-getting-sober | 94 | complete | yes | source_refs>=2 |
| 3 | support-someone-with-addiction-without-enabling | 94 | complete | yes | source_refs>=2 |
| 4 | what-should-i-do-after-a-relapse-in-recovery | 94 | complete | yes | source_refs>=2 |
| 5 | when-to-seek-professional-help-for-substance-use | 94 | complete | yes | source_refs>=2 |
| 6 | can-i-drink-alcohol-while-taking-psychia-181083-061 | 100 | complete | yes | — |
| 7 | can-people-get-addicted-to-ai-chatbots-or-virtual--189142-001 | 100 | complete | yes | — |
| 8 | how-can-i-help-my-partner-who-is-struggling-with-addiction | 100 | complete | yes | — |
| 9 | how-do-i-cope-with-the-stress-of-loving-someone-with-addiction | 100 | complete | yes | — |
| 10 | how-do-i-deal-with-boredom-in-recovery | 100 | complete | yes | — |
| 11 | how-do-i-deal-with-cravings-in-recovery-186032-027 | 100 | complete | yes | — |
| 12 | how-do-i-deal-with-friends-who-dont-support-my-recovery | 100 | complete | yes | — |
| 13 | how-do-i-deal-with-people-who-dont-suppo-181288-035 | 100 | complete | yes | — |
| 14 | how-do-i-deal-with-people-who-dont-understand-addiction | 100 | complete | yes | — |
| 15 | how-do-i-deal-with-people-who-trigger-my-urge-to-use-substances | 100 | complete | yes | — |
| 16 | how-do-i-deal-with-relapse-and-the-shame-185759-024 | 100 | complete | yes | — |
| 17 | how-do-i-deal-with-the-physical-effects-of-long-term-substance-use | 100 | complete | yes | — |
| 18 | how-do-i-deal-with-the-stigma-of-being-in-recovery | 100 | complete | yes | — |
| 19 | how-do-i-explain-gaps-in-my-employment-history-due-to-addiction | 100 | complete | yes | — |
| 20 | how-do-i-find-a-good-therapist-for-addiction-recovery | 100 | complete | yes | — |
| 21 | how-do-i-find-motivation-when-recovery-feels-impossible | 100 | complete | yes | — |
| 22 | how-do-i-handle-anxiety-without-using-substances | 100 | complete | yes | — |
| 23 | how-do-i-handle-drug-testing-at-work-while-in-recovery | 100 | complete | yes | — |
| 24 | how-do-i-handle-holidays-and-family-gatherings-with-an-addicted-relative | 100 | complete | yes | — |
| 25 | how-do-i-handle-holidays-and-special-occasions-in-recovery | 100 | complete | yes | — |
| 26 | how-do-i-handle-peer-pressure-to-drink-or-use-drugs | 100 | complete | yes | — |
| 27 | how-do-i-handle-social-events-and-gatherings-in-recovery | 100 | complete | yes | — |
| 28 | how-do-i-handle-social-situations-where-everyone-is-drinking | 100 | complete | yes | — |
| 29 | how-do-i-handle-stress-without-turning-to-substances | 100 | complete | yes | — |
| 30 | how-do-i-handle-work-stress-without-using-substances | 100 | complete | yes | — |

## Generation batches

Use `reports/enrichment-addiction/addiction-enrichment-codex-prompt.md` with Cursor/Codex, one batch at a time.

- `batches/batch-01-input.json` — 15 answers (15 crisis-sensitive)
- `batches/batch-02-input.json` — 15 answers (15 crisis-sensitive)
- `batches/batch-03-input.json` — 15 answers (15 crisis-sensitive)
- `batches/batch-04-input.json` — 15 answers (15 crisis-sensitive)
- `batches/batch-05-input.json` — 15 answers (15 crisis-sensitive)
- `batches/batch-06-input.json` — 15 answers (15 crisis-sensitive)
- `batches/batch-07-input.json` — 15 answers (15 crisis-sensitive)
- `batches/batch-08-input.json` — 8 answers (3 crisis-sensitive)

## Workflow

1. Generate drafts: `reports/enrichment-addiction/draft-answers/batch-01-drafts.json`
2. Dry-run promote: `npm run content:promote-enrichment -- reports/enrichment-addiction/draft-answers/batch-01-drafts.json`
3. Apply promote: `SUPABASE_SERVICE_ROLE_KEY=... npm run content:promote-enrichment -- --apply reports/enrichment-addiction/draft-answers/batch-01-drafts.json`
4. Deploy and spot-check 2–3 addiction pages per batch.
