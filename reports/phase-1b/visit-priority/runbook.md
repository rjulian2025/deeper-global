# Visit-priority content pipeline (cloud-only)

No local terminal work is required after one-time setup (see `docs/cloud-content-pipeline.md`).

## One-time setup (repo admin)

```bash
./scripts/setup-github-cron-secret.sh
```

## How cloud agents run the pipeline (after setup)

1. Commit or update `batch-*-drafts.json`
2. Merge PR to `production/astro`
3. GitHub Actions auto-applies (no manual trigger)

Optional override: `npm run content:trigger-visit-priority-pipeline -- --apply`

## What it does

| Lane | Target | Outcome |
| --- | ---: | --- |
| New pairs | 25 slugs in `batch-25-drafts.json` | Net corpus increase (skips existing) |
| GSC rewrites | 4 slugs in `rewrite-batch-priority-4.json` | `staging_*` fields updated |

## Artifacts

- `batch-25-candidates.json` / `batch-25-summary.md`: ranked queue
- `batch-25-drafts.json`: publish input
- `pipeline-run-*.json`: execution report (written on each run)

## Human review queue

Prioritize review before indexation promotion:

- `what-to-do-if-i-have-no-one-to-talk-to`
- `what-to-do-if-my-teen-says-they-hate-themselves`
- `when-to-get-help-for-grief`
- `support-someone-grieving-a-traumatic-death`
- `why-do-i-miss-someone-who-treated-me-badly`
- `partner-refuses-to-talk-about-problems`
