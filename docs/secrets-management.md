# Secrets Management — deeper-global-www-production

## Rule: never set secrets via the Vercel dashboard UI

### Incident (Jun 24, 2026)

`CRON_SECRET` was edited by hand in the Vercel dashboard. A trailing or
leading whitespace character was inadvertently stored. Vercel's build-time
validation detects this and fails every deploy immediately:

```
Error: The `CRON_SECRET` environment variable contains leading or trailing
whitespace, which is not allowed in HTTP header values.
```

The build failure was silent from the dashboard UI: the project showed
`state: ERROR` but no clear error surface unless you inspected the build logs.
The site continued serving the last READY deployment, so the failure was
invisible at the URL level. Two commits worth of production code went undeployed
before the cause was identified.

### Rule

**All Vercel secrets must be set exclusively via the CLI using generated values
piped with `--value` or `printf`. Never use the dashboard paste UI for
`CRON_SECRET` or any other secret.**

### Correct rotation procedure

```bash
# 1. Generate a clean value (hex only, no whitespace possible)
NEW_SECRET=$(openssl rand -hex 32)

# 2. Remove the old value
vercel env rm CRON_SECRET production --yes

# 3. Set the new value — --value flag, no clipboard, no echo
vercel env add CRON_SECRET production --value "$NEW_SECRET" --yes

# 4. Trigger a redeploy to confirm the build passes
git commit --allow-empty -m "chore: trigger redeploy after CRON_SECRET rotation"
git push origin production/astro
```

Do both `rm` and `add` in the same terminal session so `$NEW_SECRET` stays in
scope and is never printed to stdout.

### Why `openssl rand -hex 32` is safe

The hex character set (`[0-9a-f]`) structurally cannot contain whitespace.
You do not need to inspect the output for spaces or newlines.

### What to update when rotating

`CRON_SECRET` is read from `process.env.CRON_SECRET` at runtime in these files:

| File | Usage |
|---|---|
| `api/cron/publish-approved.ts` | Bearer / x-cron-secret / ?secret= auth check |
| `api/cron/generate-drafts.ts` | same |
| `api/cron/requeue-failed.ts` | same |
| `api/reports/social-status-email.js` | same |
| `api/reports/content-ops-email.js` | same |
| `api/reports/intent-email.js` | same |
| `api/sync-trends.js` | same |
| `api/admin/apply-enrichment.js` | same |
| `scripts/lib/supabase-env.mjs` | local dev credential resolver |

Vercel's own cron scheduler injects the stored value automatically. There are
no external callers with hardcoded copies of this secret. Rotating it requires
only the env var update; no code changes are needed.

### Canary signal

If any build in `deeper-global-www-production` shows `state: ERROR` with no
obvious code change, check for the whitespace error first:

```bash
vercel inspect <deployment-id> | grep -A5 "Builds"
```

A build that completes in `0ms` is a pre-build validation failure, not a code
error. The most common cause is a whitespace-contaminated secret.
