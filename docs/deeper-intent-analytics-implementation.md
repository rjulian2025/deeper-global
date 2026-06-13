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

`/api/reports/intent-email` sends a weekly private intent report through Resend. It is scheduled in `vercel.json` for Mondays at 13:00 UTC and reads thresholded intent rollup views plus aggregate-only GA4 site KPIs when GA4 service-account credentials are configured.

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

The weekly GA4 Data API queries filter on GA4's `hostName` dimension so site KPIs exclude shared-property, preview, staging, or other noisy host traffic. If any GA4 env var is missing, or if the GA4 Data API request fails, the email still sends the intent rollup sections and includes a "site KPI data unavailable" note. If the Supabase intent rollup views have not been applied yet, the email still sends the site KPI section and includes an "intent rollup data unavailable" setup note.

Authorized manual testing:

```bash
vercel curl "/api/reports/intent-email?dryRun=1" --deployment <deployment-url> -H "Authorization: Bearer $CRON_SECRET"
```

The report currently includes aggregate GA4 site KPIs (active users, total users, sessions, page/screen views, engagement time, engagement rate, bounce rate when available, top pages, traffic sources/channels, and country/region distribution), top searched topics, top searched topics by region, no-result searches, care-navigation demand, and safety-sensitive aggregate signals. It does not include raw queries, raw GA4 user/session identifiers, or below-threshold intent location segments.

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
- Keep public reporting national/state-level and aggregate-only.
