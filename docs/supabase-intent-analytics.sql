-- Deeper Global privacy-safe intent analytics foundation
--
-- Purpose:
-- - Accept sanitized events from the Vercel /api/intent-event function.
-- - Store first-party intent signals for aggregate reporting.
-- - Expose only thresholded rollups for macro insights.
--
-- Apply in Supabase SQL editor before relying on first-party trend reports.

create table if not exists public.intent_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  occurred_at timestamptz not null default now(),
  page_path text,
  referrer_domain text,
  content_type text not null default 'hub',
  answer_slug text,
  category text,
  entity_slug text,
  review_status text,
  risk_class text not null default 'unknown',
  intent_stage text,
  sensitivity text[] not null default array['standard']::text[],
  region_country text,
  region_state text,
  region_city text,
  device_type text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.intent_events enable row level security;

create index if not exists intent_events_occurred_at_idx
  on public.intent_events (occurred_at desc);

create index if not exists intent_events_event_topic_idx
  on public.intent_events (event_name, category, intent_stage);

create index if not exists intent_events_region_idx
  on public.intent_events (region_country, region_state);

create index if not exists intent_events_sensitivity_gin_idx
  on public.intent_events using gin (sensitivity);

create index if not exists intent_events_api_citation_idx
  on public.intent_events (occurred_at desc, event_name, answer_slug)
  where event_name in ('api_answer_fetched', 'api_answers_listed');

create or replace function public.record_intent_event(event jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed_events constant text[] := array[
    'answer_viewed',
    'category_viewed',
    'entity_viewed',
    'site_search_performed',
    'site_search_result_clicked',
    'crisis_banner_seen',
    'crisis_resource_clicked',
    'source_ref_clicked',
    'practitioner_callout_viewed',
    'practitioner_callout_clicked',
    'deeper_outbound_click',
    'external_referral_clicked',
    'editorial_policy_viewed',
    'answer_related_clicked',
    'api_answer_fetched',
    'api_answers_listed'
  ];
  event_name_value text := left(coalesce(event->>'event_name', ''), 80);
  sensitivity_value text[] := coalesce(
    array(
      select value
      from jsonb_array_elements_text(
        case
          when jsonb_typeof(event->'sensitivity') = 'array' then event->'sensitivity'
          else jsonb_build_array(coalesce(event->>'sensitivity', 'standard'))
        end
      ) as value
      where value in ('standard', 'diagnosis-risk', 'medication', 'crisis-sensitive', 'abuse', 'minor', 'addiction', 'trauma')
    ),
    array['standard']::text[]
  );
begin
  if event_name_value <> all(allowed_events) then
    return;
  end if;

  insert into public.intent_events (
    event_name,
    page_path,
    referrer_domain,
    content_type,
    answer_slug,
    category,
    entity_slug,
    review_status,
    risk_class,
    intent_stage,
    sensitivity,
    region_country,
    region_state,
    region_city,
    device_type,
    metadata
  )
  values (
    event_name_value,
    nullif(left(coalesce(event->>'page_path', ''), 220), ''),
    nullif(left(coalesce(event->>'referrer_domain', ''), 120), ''),
    coalesce(nullif(left(coalesce(event->>'content_type', ''), 80), ''), 'hub'),
    nullif(left(coalesce(event->>'answer_slug', ''), 160), ''),
    nullif(left(coalesce(event->>'category', ''), 120), ''),
    nullif(left(coalesce(event->>'entity_slug', ''), 160), ''),
    nullif(left(coalesce(event->>'review_status', ''), 40), ''),
    coalesce(nullif(left(coalesce(event->>'risk_class', ''), 40), ''), 'unknown'),
    nullif(left(coalesce(event->>'intent_stage', ''), 80), ''),
    case when array_length(sensitivity_value, 1) is null then array['standard']::text[] else sensitivity_value end,
    nullif(upper(left(coalesce(event->>'region_country', ''), 2)), ''),
    nullif(left(coalesce(event->>'region_state', ''), 80), ''),
    nullif(left(coalesce(event->>'region_city', ''), 80), ''),
    nullif(left(coalesce(event->>'device_type', ''), 40), ''),
    case when jsonb_typeof(event->'metadata') = 'object' then event->'metadata' else '{}'::jsonb end
  );
end;
$$;

revoke all on function public.record_intent_event(jsonb) from public;
grant execute on function public.record_intent_event(jsonb) to anon, authenticated, service_role;
grant select on table public.intent_events to service_role;

create or replace view public.intent_internal_daily_rollups as
select
  occurred_at::date as date,
  event_name,
  content_type,
  category,
  entity_slug,
  intent_stage,
  sensitivity[1] as primary_sensitivity,
  (metadata->>'search_has_results')::boolean as search_has_results,
  region_country,
  region_state,
  device_type,
  count(*)::integer as event_count
from public.intent_events
group by
  occurred_at::date,
  event_name,
  content_type,
  category,
  entity_slug,
  intent_stage,
  sensitivity[1],
  (metadata->>'search_has_results')::boolean,
  region_country,
  region_state,
  device_type
having count(*) >= 25;

create or replace view public.intent_public_macro_rollups as
with normalized_events as (
  select
    occurred_at::date as date,
    event_name,
    content_type,
    category,
    entity_slug,
    intent_stage,
    sensitivity[1] as primary_sensitivity,
    (metadata->>'search_has_results')::boolean as search_has_results,
    region_country,
    case
      when sensitivity && array['crisis-sensitive', 'abuse', 'minor', 'addiction', 'medication']::text[] then null
      else region_state
    end as reportable_region_state
  from public.intent_events
)
select
  date,
  event_name,
  content_type,
  category,
  entity_slug,
  intent_stage,
  primary_sensitivity,
  search_has_results,
  region_country,
  reportable_region_state as region_state,
  count(*)::integer as event_count
from normalized_events
group by
  date,
  event_name,
  content_type,
  category,
  entity_slug,
  intent_stage,
  primary_sensitivity,
  search_has_results,
  region_country,
  reportable_region_state
having count(*) >= case
  when reportable_region_state is null then 25
  else 50
end;

comment on table public.intent_events is
  'Sanitized first-party intent events for aggregate Deeper Global trend reporting. Do not expose raw rows publicly.';

comment on view public.intent_internal_daily_rollups is
  'Internal aggregate trend rollups with a minimum 25-event threshold.';

comment on view public.intent_public_macro_rollups is
  'Public-safe macro rollups with state suppression for sensitive categories and higher minimum thresholds.';

create materialized view public.map_signals as
select
  region_country as country,
  region_state as state,
  region_city as city,
  category,
  occurred_at::date as day,
  count(*)::integer as event_count,
  null::double precision as lat,
  null::double precision as lng
from public.intent_events
where event_name = 'answer_viewed'
  and region_country is not null
  and not (sensitivity && array['crisis-sensitive', 'abuse', 'minor', 'addiction', 'medication']::text[])
group by
  region_country,
  region_state,
  region_city,
  category,
  occurred_at::date;

comment on materialized view public.map_signals is
  'Psychology Weather Map signal rollups: daily answer_viewed counts by country, state, city, and category. Excludes null-country rows and sensitive-topic events. lat/lng reserved for downstream geocoding.';
