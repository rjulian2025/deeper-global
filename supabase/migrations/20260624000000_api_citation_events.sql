-- Extend record_intent_event to accept API citation events.
--
-- This migration replaces the function defined in docs/supabase-intent-analytics.sql
-- with a version that also allows api_answer_fetched and api_answers_listed,
-- while preserving every event from the original allowlist (including
-- deeper_outbound_click, which docs/supabase-api-citation-events.sql
-- accidentally dropped by not including it).
--
-- Safe to apply even if the base function already exists: CREATE OR REPLACE
-- is idempotent. Apply after docs/supabase-intent-analytics.sql has been run
-- at least once (the intent_events table must already exist).

create or replace function public.record_intent_event(event jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed_events constant text[] := array[
    -- on-site behavioral events (from supabase-intent-analytics.sql)
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
    -- public read API citation events (added by this migration)
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
