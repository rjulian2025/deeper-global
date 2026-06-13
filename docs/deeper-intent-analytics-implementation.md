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
- Keep public reporting national/state-level and aggregate-only.
