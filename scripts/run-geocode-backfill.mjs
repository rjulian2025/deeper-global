#!/usr/bin/env node
/**
 * Geocode all distinct trend_region_sync locations and upsert to geo_cache.
 * Runs locally — no Vercel endpoint or CRON_SECRET required.
 *
 *   npm run map:geocode-backfill
 *   npm run map:geocode-backfill -- --dry-run
 *   npm run map:geocode-backfill -- --limit=200
 */
import {
  buildLocationKey,
  geocodeLocations,
  upsertGeoCache,
  fetchExistingGeoCacheKeys,
} from '../api/lib/geo.js';
import { loadLocalEnv, resolveSupabaseConfig } from './lib/supabase-env.mjs';

const TREND_EVENT_NAME = 'trend_region_sync';
const PAGE_SIZE = 1000;
const MAX_PAGES = 20;

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

async function fetchAllTrendLocations(supabaseUrl, serviceRoleKey) {
  const allLocations = new Map();

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
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
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

async function main() {
  loadLocalEnv();

  const dryRun = hasFlag('--dry-run');
  const limitArg = getArg('--limit') ?? process.argv.find((arg) => arg.startsWith('--limit='))?.split('=')[1];
  const limit = Math.min(parseInt(limitArg ?? '500', 10) || 500, 2000);

  const { url: supabaseUrl, serviceRoleKey } = resolveSupabaseConfig({ requireWrite: true });
  const mapboxToken = process.env.PUBLIC_MAPBOX_TOKEN ?? process.env.MAPBOX_TOKEN;

  if (!mapboxToken) {
    throw new Error('Missing PUBLIC_MAPBOX_TOKEN or MAPBOX_TOKEN.');
  }

  const [allLocations, existingKeys] = await Promise.all([
    fetchAllTrendLocations(supabaseUrl, serviceRoleKey),
    fetchExistingGeoCacheKeys(supabaseUrl, serviceRoleKey),
  ]);

  const missing = [...allLocations.entries()]
    .filter(([key]) => !existingKeys.has(key))
    .slice(0, limit)
    .map(([, loc]) => loc);

  if (dryRun) {
    console.log(JSON.stringify({
      dry_run: true,
      total_locations: allLocations.size,
      already_cached: existingKeys.size,
      missing: allLocations.size - existingKeys.size,
      would_geocode: missing.length,
    }, null, 2));
    return;
  }

  if (!missing.length) {
    console.log(JSON.stringify({
      geocoded: 0,
      failed: 0,
      total_locations: allLocations.size,
      already_cached: existingKeys.size,
      message: 'all_locations_already_cached',
    }, null, 2));
    return;
  }

  const geocoded = await geocodeLocations(missing, mapboxToken, {
    batchSize: 6,
    delayMs: 150,
  });

  const cacheRows = [...geocoded.entries()].map(([location_key, coords]) => {
    const loc = [...allLocations.entries()].find(([key]) => key === location_key)?.[1] ?? {};
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

  const upsertResult = await upsertGeoCache(supabaseUrl, serviceRoleKey, cacheRows);
  if (!upsertResult.ok) {
    throw new Error(`upsert_failed: ${upsertResult.reason}`);
  }

  console.log(JSON.stringify({
    geocoded: cacheRows.length,
    failed: missing.length - geocoded.size,
    total_locations: allLocations.size,
    already_cached: existingKeys.size,
    limit_applied: missing.length === limit,
    timestamp: new Date().toISOString(),
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
