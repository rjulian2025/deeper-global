// Backfill geocoded coordinates for all distinct (country, state, city)
// combinations that appear in intent_events with event_name = 'trend_region_sync'
// but are not yet present in geo_cache.
//
// Typical usage: call once after deploying the geo_cache migration, then again
// after any sync that adds new geographic regions.
//
// Auth: same x-sync-secret header as api/sync-trends.js
//
// Query params:
//   ?dry_run=1   — count missing locations without geocoding or writing
//   ?limit=N     — cap the number of new locations geocoded in this run (default: 500)

import {
  buildLocationKey,
  geocodeLocations,
  upsertGeoCache,
  fetchExistingGeoCacheKeys,
} from './lib/geo.js';

const TREND_EVENT_NAME = 'trend_region_sync';
const PAGE_SIZE = 1000;
const MAX_PAGES = 20;

function getConfig() {
  return {
    supabaseUrl: process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    mapboxToken: process.env.PUBLIC_MAPBOX_TOKEN ?? process.env.MAPBOX_TOKEN,
    cronSecret: process.env.CRON_SECRET,
  };
}

async function fetchAllTrendLocations(supabaseUrl, supabaseServiceRoleKey) {
  const allLocations = new Map(); // locationKey -> { country, state, city }

  for (let page = 0; page < MAX_PAGES; page++) {
    const rangeStart = page * PAGE_SIZE;
    const rangeEnd = rangeStart + PAGE_SIZE - 1;

    const params = new URLSearchParams({
      select: 'region_country,region_state,region_city',
      event_name: `eq.${TREND_EVENT_NAME}`,
      region_country: 'not.is.null',
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/intent_events?${params.toString()}`, {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Accept: 'application/json',
        'Range-Unit': 'items',
        Range: `${rangeStart}-${rangeEnd}`,
      },
    });

    if (!response.ok) {
      throw new Error(`fetch_trend_locations_failed: ${await response.text()}`);
    }

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) break;

    for (const row of rows) {
      const key = buildLocationKey(row.region_country, row.region_state, row.region_city);
      if (!allLocations.has(key)) {
        allLocations.set(key, {
          country: row.region_country ?? null,
          state: row.region_state ?? null,
          city: row.region_city ?? null,
        });
      }
    }

    if (rows.length < PAGE_SIZE) break;
  }

  return allLocations;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { supabaseUrl, supabaseServiceRoleKey, mapboxToken, cronSecret } = getConfig();
  const providedSecret = req.headers['x-sync-secret'];

  if (!cronSecret || providedSecret !== cronSecret) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(500).json({ error: 'missing_supabase_config' });
  }

  if (!mapboxToken) {
    return res.status(500).json({ error: 'missing_mapbox_token' });
  }

  const isDryRun = req.query?.dry_run === '1' || req.query?.dry_run === 'true';
  const limit = Math.min(parseInt(req.query?.limit ?? '500', 10) || 500, 2000);

  try {
    const [allLocations, existingKeys] = await Promise.all([
      fetchAllTrendLocations(supabaseUrl, supabaseServiceRoleKey),
      fetchExistingGeoCacheKeys(supabaseUrl, supabaseServiceRoleKey),
    ]);

    const missing = [...allLocations.entries()]
      .filter(([key]) => !existingKeys.has(key))
      .slice(0, limit)
      .map(([, loc]) => loc);

    if (isDryRun) {
      return res.status(200).json({
        dry_run: true,
        total_locations: allLocations.size,
        already_cached: existingKeys.size,
        missing: allLocations.size - existingKeys.size,
        would_geocode: missing.length,
      });
    }

    if (!missing.length) {
      return res.status(200).json({
        geocoded: 0,
        failed: 0,
        total_locations: allLocations.size,
        already_cached: existingKeys.size,
        message: 'all_locations_already_cached',
      });
    }

    const geocoded = await geocodeLocations(missing, mapboxToken, {
      batchSize: 6,
      delayMs: 150,
    });

    const cacheRows = [...geocoded.entries()].map(([location_key, coords]) => {
      const loc = allLocations.get(location_key) ?? {};
      return {
        location_key,
        country: loc.country ?? null,
        state: loc.state ?? null,
        city: loc.city ?? null,
        lat: coords.lat,
        lng: coords.lng,
        geocoder: coords.geocoder,
        geocoded_at: new Date().toISOString(),
      };
    });

    const upsertResult = await upsertGeoCache(supabaseUrl, supabaseServiceRoleKey, cacheRows);

    if (!upsertResult.ok) {
      console.error('geocode_backfill_upsert_failed', upsertResult.reason);
      return res.status(500).json({ error: 'upsert_failed', reason: upsertResult.reason });
    }

    return res.status(200).json({
      geocoded: cacheRows.length,
      failed: missing.length - geocoded.size,
      total_locations: allLocations.size,
      already_cached: existingKeys.size,
      limit_applied: missing.length === limit,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('geocode_backfill_error', error);
    return res.status(500).json({
      error: 'geocode_backfill_failed',
      message: error instanceof Error ? error.message : 'unknown_error',
    });
  }
}
