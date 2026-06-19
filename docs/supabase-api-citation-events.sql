-- Extend intent analytics to track public read API citation usage.
-- Apply in Supabase SQL editor after docs/supabase-intent-analytics.sql.

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
    left(coalesce(event->>'page_path', ''), 220),
    left(coalesce(event->>'referrer_domain', ''), 120),
    coalesce(nullif(left(coalesce(event->>'content_type', ''), 40), ''), 'hub'),
    left(coalesce(event->>'answer_slug', ''), 160),
    left(coalesce(event->>'category', ''), 120),
    left(coalesce(event->>'entity_slug', ''), 160),
    left(coalesce(event->>'review_status', ''), 40),
    coalesce(nullif(left(coalesce(event->>'risk_class', ''), 40), ''), 'unknown'),
    left(coalesce(event->>'intent_stage', ''), 80),
    sensitivity_value,
    left(coalesce(event->>'region_country', ''), 2),
    left(coalesce(event->>'region_state', ''), 80),
    left(coalesce(event->>'region_city', ''), 80),
    left(coalesce(event->>'device_type', ''), 40),
    coalesce(event->'metadata', '{}'::jsonb)
  );
end;
$$;
