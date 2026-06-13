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
5. The function calls Supabase RPC `record_intent_event`.
6. Supabase stores sanitized rows in `intent_events`.
7. Reports read from thresholded rollup views, not raw events.

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

Optional Google Search Console environment variables:

- `GSC_SITE_URL`: Search Console property URL. Defaults to `https://www.deeper.global/`. Use the exact URL-prefix or domain property value registered in Search Console.
- `GSC_CLIENT_EMAIL`: Google service-account client email with Search Console access. Defaults to `GA4_CLIENT_EMAIL` when unset.
- `GSC_PRIVATE_KEY`: Google service-account private key. Defaults to `GA4_PRIVATE_KEY` when unset, and escaped newlines (`\n`) are supported for Vercel env storage.

The weekly GA4 Data API queries filter on GA4's `hostName` dimension so site KPIs exclude shared-property, preview, staging, or other noisy host traffic. Search Console queries use the read-only `https://www.googleapis.com/auth/webmasters.readonly` scope against `https://searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`.

To enable Search Console in the report:

- Enable the Google Search Console API in the Google Cloud project that owns the service account.
- Add the service account email as a user on the relevant Search Console property, or otherwise grant it access to the property used by `GSC_SITE_URL`.
- Configure `GSC_SITE_URL` only if the default `https://www.deeper.global/` is not the exact Search Console property to query.
- Reuse the GA4 service account credentials if that same account has both GA4 Viewer and Search Console property access, or set separate `GSC_CLIENT_EMAIL` and `GSC_PRIVATE_KEY` values.

If any GA4 env var is missing, or if the GA4 Data API request fails, the email still sends the intent rollup and Search Console sections and includes a "site KPI data unavailable" note. If Search Console credentials are missing, the API is disabled, the site property is not verified/shared with the service account, or the query fails, the email still sends the other sections and includes a "Search Console data unavailable" note with a non-secret reason. If the Supabase intent rollup views have not been applied yet, the email still sends the site KPI and Search Console sections and includes an "intent rollup data unavailable" setup note.

The report intentionally separates raw host-filtered GA4 KPIs from qualified/engaged traffic interpretation:

- Raw site KPIs show GA4's aggregate active users, sessions, views, engagement, bounce rate, and duration without suppressing noisy traffic.
- Qualified / engaged traffic shows aggregate-derived engaged sessions, non-direct sessions, organic/social/referral sessions, direct-session share, views per active user, engagement per session, and top country concentration.
- Data quality / bot-noise flags highlight suspicious aggregate conditions instead of hiding them from the headline. Current thresholds flag direct sessions above 80%, top country share above 70%, engagement rate below 5%, average session duration below 5 seconds, views per active user near 1, and source/country combinations that look like concentrated direct bot or proxy traffic.
- Top source/country combinations are included to make country, channel, and source concentration easier to interpret while staying aggregate-only.

Use raw KPIs to understand what GA4 counted, and use qualified traffic plus data quality flags to judge whether the counted activity likely represents real audience intent. Do not cite raw site KPIs externally when bot/noise flags are present without explaining the quality caveat.

Search Console metrics are aggregate-only Google organic search metrics:

- The report includes total clicks, impressions, CTR, and average position; top queries; top Google landing pages; top countries; and top devices.
- Search Console data commonly lags recent dates, so the report uses a separate 30-day Search Console window ending 3 days before the send date. The exact Search Console window is printed in the dry-run JSON and email.
- Average position is impression-weighted and can move because of query mix changes, not just ranking changes for a single page.
- Search Console query rows are external Google search terms, not first-party site-search logs. Treat them as aggregate acquisition signals, not raw user-level behavior.

Authorized manual testing:

```bash
vercel curl "/api/reports/intent-email?dryRun=1" --deployment <deployment-url> -H "Authorization: Bearer $CRON_SECRET"
```

The report currently includes aggregate GA4 site KPIs (active users, total users, sessions, engaged sessions, page/screen views, engagement time, engagement rate, bounce rate when available, top pages, traffic sources/channels, source/country combinations, country/region distribution, qualified traffic metrics, and data quality flags), aggregate Search Console metrics (clicks, impressions, CTR, average position, top queries/pages/countries/devices), top searched topics, top searched topics by region, no-result searches, care-navigation demand, and safety-sensitive aggregate signals. It does not include raw first-party site-search queries, raw GA4 user/session identifiers, or below-threshold intent location segments.

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
- Confirm `/api/intent-event` logs no `intent_event_not_recorded` errors.
- Trigger a test search and answer view.
- Confirm rows appear in `intent_events`.
- Confirm thresholded rows appear only after minimum counts are met.
- Configure `CRON_SECRET`, `RESEND_API_KEY`, and `REPORT_EMAIL_FROM` in Vercel production.
- To include site KPIs, configure `GA4_PROPERTY_ID`, `GA4_CLIENT_EMAIL`, and `GA4_PRIVATE_KEY` in Vercel production and grant the service account Viewer access to the GA4 property. Leave `GA4_REPORT_HOSTNAME` unset for the default `www.deeper.global` filter unless production traffic intentionally spans more hosts.
- To include Search Console metrics, enable the Search Console API, grant the service account access to the Search Console property, and set `GSC_SITE_URL` if the default `https://www.deeper.global/` does not match the property exactly. Set separate `GSC_CLIENT_EMAIL` and `GSC_PRIVATE_KEY` only when reusing the GA4 credentials is not appropriate.
- Keep public reporting national/state-level and aggregate-only.
