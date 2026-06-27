# Cloud content pipeline

Production content runs without per-session secret setup. **Secrets are not stored in cloud agent VMs.**

## Architecture (durable)

```text
Cloud agent (no production secrets)
  → commits draft JSON + manifest to git
  → triggers GitHub Actions (gh workflow run) OR manual Run workflow
GitHub Actions (one durable secret: CRON_SECRET)
  → POST https://www.deeper.global/api/admin/run-visit-priority-pipeline
Vercel production (all real secrets)
  → SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, etc.
  → inserts rows + runs Claude rewrites
```

### Why cloud agents lose secrets

| Store | Problem |
| --- | --- |
| `~/.config/deeper-global/secrets.env` | Ephemeral cloud VM; wiped each session |
| Cursor Secrets injection | Works when configured, but easy to mis-scope or omit |
| `vercel env pull` / Supabase CLI | Requires CLI auth that does not persist in cloud agents |
| Multiple fallback paths | Each failure mode looks like "secrets lost again" |

**Fix:** cloud agents never hold production credentials. They edit git and trigger the durable executor.

## One-time setup (do this once, not per agent session)

### 1. Vercel production (already your secret vault)

Confirm these exist on Vercel production for `deeper-global`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `CRON_SECRET`

### 2. GitHub repository secret (durable executor)

Add **one** secret in GitHub → Settings → Secrets and variables → Actions:

| Secret | Value |
| --- | --- |
| `CRON_SECRET` | Same value as Vercel production `CRON_SECRET` |

### 3. Deploy admin API routes

Merge and deploy the branch containing:

- `api/admin/run-visit-priority-pipeline.js`
- `api/admin/publish-phase-1b-drafts.js`
- `api/admin/rewrite-answers-claude.js`

## How cloud agents run the pipeline

### Option A: Trigger GitHub Actions (recommended)

```bash
node scripts/trigger-visit-priority-pipeline.mjs --apply
```

Requires `gh` CLI auth to the repo (usually already available when the agent can push).

### Option B: GitHub UI

Actions → **Visit Priority Content Pipeline** → Run workflow → set `apply=true`.

### Option C: Direct production API (only if CRON_SECRET is injected)

```bash
npm run content:run-visit-priority-pipeline -- --apply
```

Use only when `CRON_SECRET` is reliably injected. Prefer Option A otherwise.

## What the pipeline does

1. Inserts up to **25** new rows from `reports/phase-1b/visit-priority/batch-25-drafts.json` (`review_status = draft`, skips existing slugs)
2. Rewrites **4** GSC momentum pages from `reports/gsc-weekly/rewrite-batch-priority-4.json` into `staging_*`
3. Returns JSON report in GitHub Actions artifacts

## Regenerating the batch

Cloud agent updates ranked candidates and drafts in-repo:

```bash
node scripts/generate-visit-priority-batch-25-drafts.mjs
```

Then trigger the pipeline (Option A or B).

## Do not use Codex for this

Codex generates **content** (draft JSON). Secret persistence and pipeline execution are **repo infrastructure** problems, solved by:

- Vercel as secret vault
- GitHub Actions as durable trigger
- Admin API as execution layer

## Safety

- Visit-priority inserts use `review_status = draft`
- Crisis/self-harm/abuse/minor items need human review before indexation promotion
- Rewrites write to `staging_*` only; promote remains manual per `docs/content-governance.md`
