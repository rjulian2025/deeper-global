# Cloud content pipeline

Production content runs without per-session secret setup. **Secrets are not stored in cloud agent VMs.**

## Architecture (permanent)

```text
Cloud agent (no production secrets)
  → commits draft JSON to git
  → merges to production/astro
GitHub Actions (one durable secret: CRON_SECRET)
  → auto-applies when *-drafts.json changes
  → POST https://www.deeper.global/api/admin/run-visit-priority-pipeline
Vercel production (secret vault)
  → SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, CRON_SECRET, etc.
  → executes inserts + Claude rewrites
```

## One-time setup (do this once)

Vercel dashboard **cannot copy** encrypted `CRON_SECRET`. Rotate once via CLI and sync to GitHub in the same terminal session:

```bash
# From repo root, after: vercel login && vercel link --project deeper-global-www-production
chmod +x scripts/setup-github-cron-secret.sh
./scripts/setup-github-cron-secret.sh
```

This script:

1. Generates a clean `CRON_SECRET` (`openssl rand -hex 32`)
2. Sets it on Vercel production
3. Sets the same value in GitHub → Settings → Secrets → Actions
4. Pushes an empty commit to `production/astro` to redeploy and apply the pending batch

### Confirm Vercel production env (already required)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `CRON_SECRET` (set by setup script)

### Weekly canary

`Pipeline Credentials Check` runs Mondays 12:00 UTC. It dry-runs the admin API and fails if `CRON_SECRET` drifts or is missing.

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

## Credential fallbacks (optional)

If you prefer not to duplicate `CRON_SECRET`, add instead:

| Secrets | Path |
| --- | --- |
| `VERCEL_TOKEN` + `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` | `vercel pull` in Actions |
| `SUPABASE_SERVICE_ROLE_KEY` (+ `ANTHROPIC_API_KEY`) | Direct Supabase write in Actions |

`CRON_SECRET` is the recommended path: one secret, no duplication of Supabase/Anthropic keys in GitHub.

## Safety

- Visit-priority inserts use `review_status = draft`
- Crisis/self-harm/abuse/minor items need human review before indexation promotion
- Rewrites write to `staging_*` only; promote remains manual per `docs/content-governance.md`
