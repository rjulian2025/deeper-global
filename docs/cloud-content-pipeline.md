# Cloud content pipeline

Production content batches (new Q&A pairs, visit-priority runs, GSC rewrites) run entirely in **cloud agents** and **CI**. No local terminal steps are required after one-time secret setup in Cursor.

## One-time setup (Cursor Cloud Agent secrets)

Add these in [cursor.com/dashboard](https://cursor.com/dashboard) under Cloud Agents → Secrets for this repository:

| Secret | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Preferred | Direct publish + rewrite from cloud agent |
| `CRON_SECRET` | Fallback | Calls secured production admin APIs when service role is unavailable |
| `ANTHROPIC_API_KEY` | For rewrites | Claude rewrite lane (or rely on Vercel production env after deploy) |

Optional for read-only audits:

| Secret | Purpose |
| --- | --- |
| `SUPABASE_ANON_KEY` | Read-only Supabase queries |

After secrets are saved, restart the cloud agent session so variables are injected.

## Single command: visit-priority pipeline (+25 new pairs + 4 GSC rewrites)

```bash
# Preview (no writes)
npm run content:run-visit-priority-pipeline

# Apply to production
npm run content:run-visit-priority-pipeline -- --apply
```

This command:

1. Bootstraps credentials from injected env vars (no macOS keychain, no manual `env:sync`)
2. Inserts up to **25** new `questions_master` rows from `reports/phase-1b/visit-priority/batch-25-drafts.json` (`review_status = draft`)
3. Skips slugs that already exist (idempotent)
4. Runs Claude rewrites for the top **4** GSC momentum slugs in `reports/gsc-weekly/rewrite-batch-priority-4.json`
5. Writes a JSON report under `reports/phase-1b/visit-priority/pipeline-run-*.json`

### Credential resolution order

1. **Direct write** when `SUPABASE_SERVICE_ROLE_KEY` is present
2. **Remote admin API** when only `CRON_SECRET` is present (production Vercel functions hold service role + Anthropic key)

Remote endpoints (Bearer `CRON_SECRET`):

| Endpoint | Purpose |
| --- | --- |
| `POST /api/admin/run-visit-priority-pipeline` | Full visit-priority pipeline |
| `POST /api/admin/publish-phase-1b-drafts` | Publish arbitrary draft JSON batch |
| `POST /api/admin/rewrite-answers-claude` | Rewrite slug list to staging fields |

## GitHub Actions (optional automation)

Workflow: `.github/workflows/visit-priority-pipeline.yml`

Trigger manually from GitHub Actions → **Visit Priority Content Pipeline** → Run workflow → set `apply=true` to write.

Requires repository secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` or `CRON_SECRET`, and `ANTHROPIC_API_KEY` for direct rewrite runs.

## Regenerating the 25-pair batch

When visit signals change, regenerate ranked candidates and drafts in-repo (cloud agent does this automatically when asked):

```bash
node scripts/generate-visit-priority-batch-25-drafts.mjs
```

Then run the pipeline command above.

## Safety

- Visit-priority inserts use `review_status = draft` (not indexable until human review)
- Crisis/self-harm/abuse/minor flagged items need editorial review before promotion
- Rewrites write to `staging_*` only; promote remains a separate governed step per `docs/content-governance.md`

## Deploy requirement for remote-admin fallback

If the cloud agent only has `CRON_SECRET`, the admin API routes must be deployed to production first. Merge and deploy the branch containing:

- `api/admin/run-visit-priority-pipeline.js`
- `api/admin/publish-phase-1b-drafts.js`
- `api/admin/rewrite-answers-claude.js`
