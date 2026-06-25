-- geo_cache: persistent store for geocoded (country, state, city) coordinates.
--
-- location_key format: country|state|city  (pipe-delimited, nulls as empty string)
-- Matches the format produced by api/lib/geo.js buildLocationKey().
--
-- Rows are written by:
--   api/geocode-backfill.js  (one-time backfill of existing intent_events)
--   api/sync-trends.js       (geocodes new locations after every trend sync)
--
-- Rows are read by:
--   api/map-signals.js       (enriches trend rows with lat/lng before returning JSON)
--   public.map_density_geojson() RPC (server-side GeoJSON aggregation)

create table if not exists public.geo_cache (
  location_key  text primary key,
  country       text,
  state         text,
  city          text,
  lat           double precision not null,
  lng           double precision not null,
  geocoder      text not null default 'mapbox',   -- 'mapbox' | 'static_centroid'
  geocoded_at   timestamptz not null default now()
);

comment on table public.geo_cache is
  'Geocoded lat/lng for unique (country, state, city) location tuples used on the Psychology Weather Map. '
  'Populated by the geocode-backfill endpoint and the sync-trends cron job.';

comment on column public.geo_cache.location_key is
  'Pipe-delimited composite key: country|state|city. Matches buildLocationKey() in api/lib/geo.js.';

comment on column public.geo_cache.geocoder is
  'mapbox for Mapbox Geocoding API v5 results; static_centroid for hardcoded US state centroid coordinates.';

create index if not exists geo_cache_country_idx on public.geo_cache (country);

-- Enable RLS (no user PII in this table; service_role writes, anon reads).
alter table public.geo_cache enable row level security;

create policy "geo_cache_read_all"
  on public.geo_cache for select using (true);

grant select on public.geo_cache to anon, authenticated;
grant select, insert, update on public.geo_cache to service_role;


-- ── Updated map_density_geojson RPC ─────────────────────────────────────────
--
-- Queries trend_region_sync intent_events directly (matching the live map data
-- source) and joins with geo_cache to resolve coordinates.  Returns a GeoJSON
-- FeatureCollection of density-bucketed points, one feature per
-- (rounded_lng, rounded_lat, category) bucket.
--
-- Replaces the earlier stub that read from map_signals (answer_viewed data).

create or replace function public.map_density_geojson(
  p_category text default null
)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'type', 'FeatureCollection',
    'features', coalesce(
      (
        select json_agg(
          json_build_object(
            'type',     'Feature',
            'geometry', json_build_object(
              'type',        'Point',
              'coordinates', json_build_array(
                round(g.lng::numeric, 2),
                round(g.lat::numeric, 2)
              )
            ),
            'properties', json_build_object(
              'category', t.category,
              'weight',   t.weight
            )
          )
        )
        from (
          select
            ie.category,
            ie.region_country
              || '|' || coalesce(ie.region_state, '')
              || '|' || coalesce(ie.region_city,  '')  as location_key,
            sum((ie.metadata ->> 'trend_score')::numeric)::integer as weight
          from public.intent_events ie
          where
            ie.event_name      = 'trend_region_sync'
            and ie.region_country is not null
            and (p_category is null or ie.category = p_category)
          group by
            ie.category,
            location_key
        ) t
        join public.geo_cache g on g.location_key = t.location_key
      ),
      '[]'::json
    )
  );
$$;

comment on function public.map_density_geojson(text) is
  'Returns a GeoJSON FeatureCollection of density-bucketed trend_region_sync signals, '
  'joined with geo_cache for coordinates (~1.1 km bucket via 2-decimal rounding). '
  'Pass a category name to filter; omit or pass null for all categories.';

grant execute on function public.map_density_geojson(text) to anon, authenticated, service_role;
