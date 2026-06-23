# Deeper intent analytics implementation

## Status

Initial implementation is in the repo:

- GA4 receives lightweight custom events.
- `/api/intent-event` receives sanitized event payloads and forwards them to Supabase.
- `docs/supabase-intent-analytics.sql` defines the first-party storage table, recorder RPC, and rollup views.

The first-party Supabase layer becomes active after `docs/supabase-intent-analytics.sql` is applied in Supabase.

## Event Flow

1. Browser calls `window.deeperTrackEvent(eventName, params)`.
2. GA4 receives the event for immediate analytics.
3. The same compacted payload is posted to `/api/intent-event`.
4. The Vercel Function adds coarse region context from Vercel headers:
   - `x-vercel-ip-country`
   - `x-vercel-ip-country-region`
   - `x-vercel-ip-city`

   **Geo note (June 2026):** `region_city` was added for the Psychology Weather Map feature. City is stored for aggregate city-level rollups only. City-level aggregation remains the privacy boundary: no individual identification, no user-level profiles, and no public reporting below thresholded aggregates.

5. The function calls Supabase RPC `record_intent_event`.
6. Supabase stores sanitized rows in `intent_events`.
7. Reports read from thresholded rollup views, not raw events.

Public API citation reads use the same Supabase table. `/api/v1/answers` emits `api_answers_listed`, and `/api/v1/answers/{slug}` emits `api_answer_fetched`. The base SQL now allowlists both events; existing projects that applied the older SQL can run:

```bash
npm run db:apply-api-citation-events
```

## Privacy Boundaries

Do not use this system for:

- user-level mental health profiles;
- ad retargeting based on sensitive topic behavior;
- zip-code or neighborhood reporting;
- raw query-log sales;
- individual referral ranking.

Allowed uses:

- aggregate content demand by topic;
- aggregate search-topic demand by country/state;
- coverage-gap analysis;
- practitioner positioning strategy;
- internal safety and crisis-resource QA;
- public macro reports only after threshold review.

## Rollup Surfaces

`intent_internal_daily_rollups`

- Minimum threshold: 25 events per segment.
- Intended for internal planning.
- Can include state-level rows when volume clears threshold.

`intent_public_macro_rollups`

- Minimum national threshold: 25 events.
- Minimum state threshold: 50 events.
- Sensitive categories such as crisis, abuse, minors, addiction, and medication suppress state-level location and require higher aggregation.

## Scheduled Email Report

`/api/reports/intent-email` sends a weekly private intent report through Resend. It is scheduled in `vercel.json` for Mondays at 13:00 UTC and reads thresholded intent rollup views plus aggregate-only GA4 site KPIs and Google Search Console performance metrics when Google service-account credentials are configured.

## Scheduled Content Ops Report

`/api/reports/content-ops-email` sends a separate Tuesday tactical queue through Resend. It is scheduled in `vercel.json` for Tuesdays at 14:00 UTC (9:00 AM ET). The report ranks existing `/answers/{slug}` upgrade candidates from GSC click movement and confidence thresholds. It does not create new pages in v1 and does not auto-promote or deploy.

Generate the same plan locally with:

```bash
npm run content:gsc-weekly-plan
```

Optional production environment variables:

- `CONTENT_OPS_EMAIL_TO`: recipient for the Tuesday content-ops email. Defaults to `REPORT_EMAIL_TO`.
- `CONTENT_OPS_MODE`: `recommend` (default) or `auto-stage`. Keep `recommend` for the first 2 to 3 cycles; `auto-stage` only marks slugs as auto-stage eligible in the report payload. Promote/deploy remain manual until you wire a separate staging job.

GSC credentials are a hard prerequisite for this loop. Run `npm run env:check` and confirm `ready_for_gsc_content_ops: true` (proxy or private-key path) before trusting weekly recommendations.

For a non-secret GSC readiness check with the exact missing inputs, run:

```bash
npm run content:gsc-preflight
```

To populate local cloud-agent env files from Vercel Production, set `VERCEL_TOKEN` in the shell or install and authenticate the Vercel CLI, then run:

```bash
npm run env:sync
```

The sync writes ignored local files only. It expects production to already contain `SUPABASE_URL`, `SUPABASE_ANON_KEY` or `PUBLIC_SUPABASE_ANON_KEY`, and either `GSC_PROXY_URL` plus `GSC_PROXY_SECRET` or approved service-account key credentials.

Required production environment variables:

- `CRON_SECRET`: authorizes the Vercel Cron request.
- `RESEND_API_KEY`: sends the email through Resend.
- `REPORT_EMAIL_FROM`: verified Resend sender, for example `Deeper Global <reports@deeper.global>`.

Optional production environment variable:

- `REPORT_EMAIL_TO`: defaults to `rjulian@qvbrands.com`.

Optional GA4 KPI environment variables:

- `GA4_PROPERTY_ID`: GA4 numeric property ID. `properties/123456789` is also accepted.
- `GA4_CLIENT_EMAIL`: Google service-account client email with read access to the GA4 property.
- `GA4_PRIVATE_KEY`: Google service-account private key. Escaped newlines (`\n`) are supported for Vercel env storage.
- `GA4_REPORT_HOSTNAME` or `GA4_REPORT_HOSTNAMES`: optional host filter for GA4 site KPIs. Defaults to `www.deeper.global`; use a comma-separated `GA4_REPORT_HOSTNAMES` value only if more than one production host should be included.
- `REPORT_TARGET_MARKET_COUNTRIES`: optional comma-separated target-market country list for qualified intent reporting. Defaults to `United States`.

Optional Google Search Console environment variables:

- `GSC_SITE_URL`: Search Console property URL. Defaults to `https://www.deeper.global/`. Production uses the domain property `sc-domain:deeper.global`.
- `GSC_PROXY_URL`: Preferred keyless Search Console proxy endpoint when service-account key creation is blocked by Google Cloud org policy.
- `GSC_PROXY_SECRET`: Shared bearer secret for the keyless Search Console proxy.
- `GSC_CLIENT_EMAIL`: Google service-account client email with Search Console access. Defaults to `GA4_CLIENT_EMAIL` when unset. Used only with the private-key fallback path.
- `GSC_PRIVATE_KEY`: Google service-account private key. Defaults to `GA4_PRIVATE_KEY` when unset. Use only when a key exception is explicitly approved.

The weekly GA4 Data API queries filter on GA4's `hostName` dimension so site KPIs exclude shared-property, preview, staging, or other noisy host traffic. Search Console queries use the read-only `https://www.googleapis.com/auth/webmasters.readonly` scope against `https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`. In production, Vercel should call the GSC proxy when `GSC_PROXY_URL` and `GSC_PROXY_SECRET` are present; the proxy runs on Google Cloud with an attached service account and does not require a downloadable service-account key. Proxy source lives in `cloud-run/gsc-proxy/`.

To enable Search Console in the report:

- Enable the Google Search Console API in the Google Cloud project that owns the service account.
- Add the service account email as a user on the relevant Search Console property, or otherwise grant it access to the property used by `GSC_SITE_URL`.
- Configure `GSC_SITE_URL` only if the default `https://www.deeper.global/` is not the exact Search Console property to query.
- Prefer `GSC_PROXY_URL` and `GSC_PROXY_SECRET` when service-account key creation is blocked by `iam.disableServiceAccountKeyCreation`.
- Reuse the GA4 service account credentials only when the private-key fallback path is approved.

If any GA4 env var is missing, or if the GA4 Data API request fails, the email still sends the intent rollup and Search Console sections and includes a "site KPI data unavailable" note. If Search Console credentials are missing, the API is disabled, the site property is not verified/shared with the service account, or the query fails, the email still sends the other sections and includes a "Search Console data unavailable" note with a non-secret reason. If the Supabase intent rollup views have not been applied yet, the email still sends the site KPI and Search Console sections and includes an "intent rollup data unavailable" setup note.

The report intentionally separates raw host-filtered GA4 KPIs from quarantine, qualified intent, and search visibility interpretation:

- Raw all-traffic site KPIs show GA4's aggregate active users, sessions, views, engagement, bounce rate, and duration without suppressing noisy traffic.
- Traffic quarantine uses aggregate GA4 `country`, `sessionDefaultChannelGroup`, and `sessionSourceMedium` buckets to label likely-noise traffic. Current reason codes cover Singapore direct traffic, China direct traffic, short duration with other weak signals, one-page plus zero-engagement buckets, and suspicious direct traffic from non-target countries.
- Quarantined sessions are unique source/country bucket sessions counted once and shown as a capped share of raw sessions. Quarantine reason-code matches are intentionally separate because one bucket can match multiple reasons; those overlapping matches may exceed raw sessions and are labeled as reason-code matches, not traffic share.
- Qualified intent has two layers. The loose criteria view is exploratory and includes buckets that meet at least one positive criterion: engaged sessions, non-direct source, average session duration above 10 seconds, 2+ pageviews/session, US or configured target-market country, organic search source, or referral/social source. Criteria totals are overlapping criteria matches, not unique traffic shares.
- Strict qualified traffic is more conservative: it excludes quarantined buckets and requires stronger evidence such as engaged sessions, non-direct source, organic/referral/social source, or target-market traffic with engagement, duration, or pageview quality. Strict qualified sessions are unique source/country bucket sessions counted once and shown as a capped share of raw sessions.
- Mixed-signal / needs-review traffic captures short-duration buckets that still have promising source or target-market signals. These buckets are not automatically quarantined unless short duration is combined with additional weak signals such as direct source, non-target country, zero engaged sessions, one-page behavior, or known noisy direct countries.
- The qualified intent section also breaks out target-market sessions, non-direct sessions, engaged sessions, organic search sessions, and referral/social sessions so those layers are visible without hiding raw traffic.
- Data quality / bot-noise flags highlight suspicious aggregate conditions instead of hiding them from the headline. Current thresholds flag direct sessions above 80%, top country share above 70%, engagement rate below 5%, average session duration below 5 seconds, views per active user near 1, and source/country combinations that look like concentrated direct bot or proxy traffic.
- Top source/country combinations, top quarantined buckets, top needs-review buckets, and top loose/strict qualified buckets are included to make country, channel, and source concentration easier to interpret while staying aggregate-only.

Use raw KPIs to understand what GA4 counted, traffic quarantine to understand likely noise, qualified intent to judge real audience activity, and Search Console to understand indexed/query visibility. Do not cite raw site KPIs externally when quarantine or bot/noise flags are present without explaining the quality caveat.

Quarantine and qualified intent limitations:

- These calculations use aggregate GA4 rows only. They do not use raw user IDs, session IDs, IPs, or raw event streams.
- The source/country bucket query is capped for runtime control and ordered by sessions, so long-tail low-volume buckets may not appear in the detailed quarantine or qualified bucket lists.
- GA4 aggregate rows cannot isolate exact zero-duration sessions in this implementation. The report uses `averageSessionDuration < 10 seconds` on source/country buckets as a short-duration signal, but short duration alone is not treated as automatic quarantine.
- One-page plus zero-engagement buckets are derived from `screenPageViews / sessions` and `engagedSessions` on aggregate rows.
- GA4 Data API does not expose user agent in the current report query. Known crawler/user-agent quarantine requires Vercel logs, Vercel Firewall analytics, or additional explicit collection.

Search Console metrics are aggregate-only Google organic search metrics:

- The report includes total clicks, impressions, CTR, and average position; top queries; top Google landing pages; top countries; and top devices.
- Search Console data commonly lags recent dates, so the report uses a separate 30-day Search Console window ending 3 days before the send date. The exact Search Console window is printed in the dry-run JSON and email.
- Average position is impression-weighted and can move because of query mix changes, not just ranking changes for a single page.
- Search Console query rows are external Google search terms, not first-party site-search logs. Treat them as aggregate acquisition signals, not raw user-level behavior.

Authorized manual testing:

```bash
vercel curl "/api/reports/intent-email?dryRun=1" --deployment <deployment-url> -H "Authorization: Bearer $CRON_SECRET"
```

The report currently includes aggregate GA4 site KPIs (active users, total users, sessions, engaged sessions, page/screen views, engagement time, engagement rate, bounce rate when available, top pages, traffic sources/channels, source/country combinations, country/region distribution, traffic quarantine, mixed-signal needs-review traffic, loose and strict qualified intent metrics, and data quality flags), aggregate Search Console metrics (clicks, impressions, CTR, average position, top queries/pages/countries/devices), top searched topics, top searched topics by region, no-result searches, care-navigation demand, and safety-sensitive aggregate signals. It does not include raw first-party site-search queries, raw GA4 user/session identifiers, or below-threshold intent location segments.

## Example Questions

Top searched topics by country:

```sql
select
  date,
  category,
  region_country,
  sum(event_count) as searches
from public.intent_public_macro_rollups
where event_name = 'site_search_performed'
group by date, category, region_country
order by date desc, searches desc;
```

Rising state-level care-navigation demand:

```sql
select
  date,
  category,
  region_country,
  region_state,
  sum(event_count) as events
from public.intent_public_macro_rollups
where intent_stage = 'care_navigation'
  and region_state is not null
group by date, category, region_country, region_state
order by date desc, events desc;
```

Coverage gaps from searches with no results:

```sql
select
  date,
  category,
  region_country,
  sum(event_count) as no_result_searches
from public.intent_internal_daily_rollups
where event_name = 'site_search_performed'
  and search_has_results = false
group by date, category, region_country
order by date desc, no_result_searches desc;
```

## Activation Checklist

- Apply `docs/supabase-intent-analytics.sql` in Supabase.
- If the base SQL was applied before API citation events were added, run `npm run db:apply-api-citation-events`.
- Confirm `/api/intent-event` logs no `intent_event_not_recorded` errors.
- Confirm public API requests log `api_citation_access`; if the content ops report still shows zero events after traffic, reapply `docs/supabase-api-citation-events.sql` and make sure the report has `SUPABASE_SERVICE_ROLE_KEY`.
- Trigger a test search and answer view.
- Confirm rows appear in `intent_events`.
- Confirm thresholded rows appear only after minimum counts are met.
- Configure `CRON_SECRET`, `RESEND_API_KEY`, and `REPORT_EMAIL_FROM` in Vercel production.
- To include site KPIs, configure `GA4_PROPERTY_ID`, `GA4_CLIENT_EMAIL`, and `GA4_PRIVATE_KEY` in Vercel production and grant the service account Viewer access to the GA4 property. Leave `GA4_REPORT_HOSTNAME` unset for the default `www.deeper.global` filter unless production traffic intentionally spans more hosts.
- To include Search Console metrics, enable the Search Console API, grant the service account access to the Search Console property, set `GSC_SITE_URL` to the exact property (`sc-domain:deeper.global` in production), and prefer `GSC_PROXY_URL` + `GSC_PROXY_SECRET` when org policy blocks downloadable keys.
- Keep public reporting national/state-level and aggregate-only.
