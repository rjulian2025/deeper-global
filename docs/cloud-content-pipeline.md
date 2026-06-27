# Cloud content pipeline

Production content runs without per-session secret setup. **Secrets live only in Vercel production.**

## Architecture (permanent)

```text
Cloud agent (no production secrets)
  → commits draft JSON to git
  → merges to production/astro
GitHub Actions (one GitHub secret: VERCEL_TOKEN)
  → vercel pull at runtime → CRON_SECRET from Vercel production
  → POST https://www.deeper.global/api/admin/run-visit-priority-pipeline
Vercel production (secret vault)
  → SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, CRON_SECRET, etc.
  → executes inserts + Claude rewrites
```

## One-time setup (do this once)

### Vercel production env

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `CRON_SECRET` (rotate via `./scripts/setup-github-cron-secret.sh`)
- `ADMIN_PASSPHRASE` (optional; unlocks `/admin/` console without exposing CRON_SECRET)

### GitHub Actions

Add **only** `VERCEL_TOKEN` in GitHub → Settings → Secrets → Actions.

Project scope is committed in `.github/vercel-project.json` (`deeper-global-h65m`).

**Remove legacy duplicate secrets** (if present): `CRON_SECRET`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`.

### Rotate CRON_SECRET

```bash
vercel login
vercel link --project deeper-global-h65m
./scripts/setup-github-cron-secret.sh
```

No GitHub secret sync step. Actions pull the current value from Vercel on every run.

## Operations without a terminal

| Surface | Use |
| --- | --- |
| GitHub Actions → Visit Priority Content Pipeline | `workflow_dispatch` with apply on/off |
| `/admin/` | Health check + dry run / apply (passphrase or CRON_SECRET) |
| `GET /api/admin/health` | Bearer `CRON_SECRET` or `ADMIN_PASSPHRASE` |

## Weekly canary

`Pipeline Credentials Check` runs Mondays 12:00 UTC. It pulls production env via `VERCEL_TOKEN`, then calls `/api/admin/health`.

## Automation after setup

| Event | Behavior |
| --- | --- |
| Merge `*-drafts.json` under `reports/phase-1b/visit-priority/` to `production/astro` | **Auto-apply** (insert + rewrite) |
| Merge candidates/summary only | Dry-run (report artifact only) |
| Commit message contains `[visit-priority-apply]` | Force apply |
| Manual: Actions → Visit Priority Content Pipeline | Choose apply on/off |

Cloud agents **do not trigger workflows manually**. Merge the PR; Actions handles the rest.

## How cloud agents run future batches

1. Generate or edit `reports/phase-1b/visit-priority/batch-*-drafts.json`
2. Open PR → merge to `production/astro`
3. Done (pipeline runs automatically)

Optional explicit trigger:

```bash
npm run content:trigger-visit-priority-pipeline -- --apply
```

Requires `gh` CLI with workflow dispatch permission.

## What the pipeline does

1. Inserts up to **25** new rows from `batch-25-drafts.json` (`review_status = draft`, skips existing slugs)
2. Rewrites **4** GSC momentum pages from `rewrite-batch-priority-4.json` into `staging_*`
3. Uploads JSON report as a GitHub Actions artifact

## Safety

- Visit-priority inserts use `review_status = draft`
- Crisis/self-harm/abuse/minor items need human review before indexation promotion
- Rewrites write to `staging_*` only; promote remains manual per `docs/content-governance.md`
