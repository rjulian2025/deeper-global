# Vercel project scope for GitHub Actions

Committed IDs avoid a live API call on every workflow run. The pull script uses
`orgId` from this file first and only resolves via the Vercel API when missing
or when pull fails with an org/scope mismatch.

## Fill in orgId (one-time, local)

After `vercel login` and linking this repo:

```bash
vercel link --project deeper-global-h65m
jq -r '.orgId' .vercel/project.json
```

Paste the value into `orgId` in `vercel-project.json` and commit.

Alternative (API, needs `VERCEL_TOKEN`):

```bash
curl -fsSL -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v9/projects/prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL" \
  | jq -r '.accountId // .teamId'
```

Until `orgId` is committed, CI falls back to API resolution automatically.
