-- RPC: map_density_geojson
--
-- Returns a GeoJSON FeatureCollection of aggregated trend signals bucketed by
-- rounded lat/lng (2 decimal places, ~1.1 km grid) and category. Each feature
-- carries a `weight` property equal to the summed event_count, which the
-- Mapbox heatmap layer uses for `heatmap-weight`.
--
-- Prerequisite: the `map_signals` materialized view must have lat/lng populated
-- by the geocoding step in `api/map-signals.js` (or by a future server-side
-- geocoding pipeline). Until lat/lng are stored, this RPC is a stub — the
-- client-side geocoding path in weather-map.astro remains the live path.
--
-- TODO: Run a geocoding backfill job that writes lat/lng back into `map_signals`
-- (or into `intent_events.metadata`), then switch `api/map-density-geojson.js`
-- to call this RPC instead of raw intent_events.

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
      json_agg(
        json_build_object(
          'type', 'Feature',
          'geometry', json_build_object(
            'type', 'Point',
            'coordinates', json_build_array(
              round(lng::numeric, 2),
              round(lat::numeric, 2)
            )
          ),
          'properties', json_build_object(
            'category', category,
            'weight',   sum_weight
          )
        )
      ),
      '[]'::json
    )
  )
  from (
    select
      round(lng::numeric, 2)    as lng,
      round(lat::numeric, 2)    as lat,
      category,
      sum(event_count)::integer as sum_weight
    from public.map_signals
    where
      lat  is not null
      and lng  is not null
      and (p_category is null or category = p_category)
    group by
      round(lng::numeric, 2),
      round(lat::numeric, 2),
      category
  ) bucketed;
$$;

comment on function public.map_density_geojson(text) is
  'Returns a GeoJSON FeatureCollection of density-bucketed map_signals points '
  '(~1.1 km grid). Pass a category name to filter; omit for all categories. '
  'Requires lat/lng to be populated in map_signals — currently a stub until '
  'server-side geocoding is wired.';

-- Grant read access to the anon/service role so api/map-signals.js can call it.
grant execute on function public.map_density_geojson(text) to anon, authenticated, service_role;
