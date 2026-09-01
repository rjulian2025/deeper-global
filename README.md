# Deeper Global

Deeper Global is an Astro-based public knowledge layer for trusted mental health questions and answers. Supabase is the content source; Astro generates a fast, SEO-oriented publication layer at `https://www.deeper.global`.

## Source and worktrees

| Path | Branch | Role |
|------|--------|------|
| `https://github.com/rjulian2025/deeper-global` | `production/astro` | Canonical Git repository |
| `/Users/rickjulian/deeper-global-production` | `production/astro` | **Protected production worktree** — do not remediate here during RJOS isolation |
| `/Users/rickjulian/projects/rjos-worktrees/deeper-global-baseline` | `rjos/deeper-global-remediation` | Isolated RJOS remediation workspace |
| `/Users/rickjulian/Documents/New project/deeper-global` | `feat/deeper-api-adoption-foundation` | **Unsafe WIP clone** — cron/social/API experiments; never deploy from this tree |

## Production identity

| Field | Value |
|-------|--------|
| Domain | `https://www.deeper.global` (apex `deeper.global` redirects to www) |
| Vercel project | `deeper-global-www-production` (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`) |
| Production branch | `production/astro` (Git-linked) |
| Current production SHA | `26a7ba6b8f7bb289fc23158fe36a1a2cd6147549` |
| Current deployment | `dpl_6fLFK15UgqZJypNzYeWDpKmiKXZ1` |
| Rollback SHA | `802af12f390cfe0cd0cf5089fc137678e253b8c2` |
| Rollback deployment | `dpl_A8w1W1jPG1LMqJ8EF3JmwFskCeH9` |

### Canonical host note (C03)

Apex currently returns **HTTP 307** to www in live probes, while `vercel.json` declares a host redirect with `"permanent": true`. Treat canonical host behavior as **PARTIAL / accepted exception** until a separate permanent-normalization change is approved. Do not change apex routing during infrastructure remediation.

## Local development

```bash
npm install
npm run dev
```

## Builds

| Command | Purpose |
|---------|---------|
| `npm run build` | Production indexable build → `dist/` |
| `npm run build:preview` | Preview/non-indexable build → `dist-preview/` |
| `npm test` | Configuration and guardrail tests |

### Credentialed read-only production build (C12)

Production builds require Supabase read credentials and enforce `MIN_ANSWER_COUNT=950`. The build path is **read-only** toward Supabase (static page generation only).

Do **not** copy `.env.local` into this repository. Load credentials ephemerally from the protected worktree or `~/.config/deeper-global/secrets.env`:

```bash
(
  set -a
  source "/Users/rickjulian/deeper-global-production/.env.local"
  set +a
  export VERCEL=1 CI=1
  npm run build
)
```

Unset `VERCEL`/`CI` for empty-corpus structural builds. Never commit credential files.

### Preview / non-indexable build (C05)

```bash
npm run build:preview
```

Preview builds emit:

- global `noindex, nofollow` meta
- `robots.txt` with `Disallow: /`
- no sitemap promotion (`postbuild` skips `sitemap.xml`)
- no GA4 loader (even if a measurement ID is configured)
- no change to production indexing policy in source

## Environment contract

Documented in `.env.example`. Never commit real values.

| Variable | Scope | Purpose |
|----------|-------|---------|
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Build (server) | Corpus read at build time |
| `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` | Aliases | Legacy names still tolerated |
| `PUBLIC_GA_MEASUREMENT_ID` | Client | **Preferred** GA4 measurement ID |
| `PUBLIC_GA4_MEASUREMENT_ID` | Client | Alias |
| `NEXT_PUBLIC_GA_ID` | Client | Legacy alias (Vercel may still carry this name) |
| `PUBLIC_INDEXABLE` | Client | `false` for preview builds |
| `PUBLIC_MAPBOX_TOKEN` | Client | Weather map Mapbox GL (geocoding API; no browser geolocation) |
| `CRON_SECRET` | Server | Cron/admin routes (not used during static builds) |

GA4 loads only when:

1. A measurement ID is configured via the variables above (no hardcoded fallback), and
2. The build/runtime context is production-like (`VERCEL_ENV=production` or local `PROD` without preview flags), and
3. The served hostname is `deeper.global` or `www.deeper.global`.

**Deploy prerequisite:** set `PUBLIC_GA_MEASUREMENT_ID` in Vercel Production before deploying analytics-contract changes (do not mutate Vercel during isolated remediation).

## Security headers (C07)

Global headers in `vercel.json`:

- `Strict-Transport-Security: max-age=63072000` (preserved)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Frame-Options: SAMEORIGIN`

The weather map uses Mapbox Geocoding API and map tiles only — **no** `navigator.geolocation` or `GeolocateControl`. `geolocation=()` is therefore compatible.

No enforced CSP.

## Deployment

Git-linked Vercel deploy from `production/astro` via project `deeper-global-www-production`.

```bash
# After merge to production/astro and explicit deploy authorization:
git push origin production/astro
# Vercel auto-deploys on push (normal path)
```

Emergency manual deploy is documented in `docs/deeper-preview-readiness.md` — avoid `vercel deploy --prod` except incidents.

### Rollback

1. Revert Git to rollback SHA `802af12f…` on `production/astro` and push, **or**
2. Promote Vercel deployment `dpl_A8w1W1jPG1LMqJ8EF3JmwFskCeH9` in the Vercel dashboard.

Re-verify live sitemap count (~1,197 URLs), headers, and GA loader after rollback.

## Forbidden during RJOS infrastructure work

Do **not** run from this remediation branch:

- `content:*`, `db:*`, `deploy:*` (except documented read-only build), cron triggers
- `scripts/publish-*`, `scripts/rewrite-*`, `scripts/promote-*`, social/X pipelines
- Supabase migrations or any script that writes to the database
- Vercel env changes without explicit authorization

## Sitemap / corpus validation

After a credentialed production build, expect approximately:

- **~1,158** answer URLs
- **17** modality pages
- **5** reviewer routes (index + profiles)
- **3** indexable topic exceptions
- static hubs (`/`, `/protocol/`, `/editorial-policy/`, `/weather-map/`, etc.)

Compare `dist/sitemap.xml` URL counts with live `https://www.deeper.global/sitemap-0.xml`.

## Architecture

See [docs/platform-architecture.md](docs/platform-architecture.md) for product and data architecture.

## Incident recovery

1. Confirm production SHA/deployment in Vercel.
2. Check Supabase connectivity (build floor `MIN_ANSWER_COUNT=950`).
3. Roll back via Git or prior deployment (see above).
4. Re-run `npm test`, credentialed `npm run build`, and Site OS `verify:ops` live checks.
