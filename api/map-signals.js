import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLocationKey } from './lib/geo.js';

const SEED_FILE = join(dirname(fileURLToPath(import.meta.url)), '../src/data/map-signals-seed.json');
const TREND_EVENT_NAME = 'trend_region_sync';
const PAGE_SIZE = 1000;
const MAX_PAGES = 10;

function useSeedData() {
  return process.env.USE_SEED_DATA === 'true';
}

function loadSeedSignals() {
  return JSON.parse(readFileSync(SEED_FILE, 'utf8'));
}

function getSupabaseReadConfig() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return { supabaseUrl, supabaseServiceRoleKey };
}

function normalizeTrendEventRow(row, geoCache) {
  const eventCount = Number(row.event_count ?? 0);
  const occurredAt = typeof row.occurred_at === 'string' ? row.occurred_at : '';

  const geo = geoCache?.get(
    buildLocationKey(row.region_country, row.region_state, row.region_city)
  );

  return {
    country: row.region_country ?? null,
    state: row.region_state ?? null,
    city: row.region_city ?? null,
    category: row.category ?? null,
    day: occurredAt.slice(0, 10) || null,
    event_count: Number.isFinite(eventCount) ? Math.round(eventCount) : 0,
    lat: geo?.lat ?? null,
    lng: geo?.lng ?? null,
  };
}

async function fetchGeoCache(supabaseUrl, supabaseServiceRoleKey) {
  const response = await fetch(`${supabaseUrl}/rest/v1/geo_cache?select=location_key,lat,lng`, {
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    console.warn('geo_cache_fetch_failed', response.status);
    return new Map();
  }

  const rows = await response.json();
  return new Map(
    Array.isArray(rows) ? rows.map((r) => [r.location_key, { lat: r.lat, lng: r.lng }]) : []
  );
}

async function fetchTrendSignalsPage(supabaseUrl, supabaseServiceRoleKey, rangeStart) {
  const rangeEnd = rangeStart + PAGE_SIZE - 1;
  const params = new URLSearchParams({
    select: 'region_country,region_state,region_city,category,occurred_at,event_count:metadata->>trend_score',
    event_name: `eq.${TREND_EVENT_NAME}`,
    order: 'occurred_at.desc',
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/intent_events?${params.toString()}`, {
    method: 'GET',
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Accept: 'application/json',
      'Range-Unit': 'items',
      Range: `${rangeStart}-${rangeEnd}`,
    },
  });

  if (!response.ok) {
    return { ok: false, reason: await response.text() };
  }

  const rows = await response.json();
  return { ok: true, data: Array.isArray(rows) ? rows : [] };
}

async function fetchTrendSignalsFromSupabase() {
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseReadConfig();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { ok: false, reason: 'missing_supabase_service_role_key' };
  }

  // Fetch trend rows and geo_cache in parallel to minimize latency.
  const [geoCacheResult, paginatedRows] = await Promise.all([
    fetchGeoCache(supabaseUrl, supabaseServiceRoleKey),
    (async () => {
      const allRows = [];

      for (let page = 0; page < MAX_PAGES; page++) {
        const rangeStart = page * PAGE_SIZE;
        const result = await fetchTrendSignalsPage(supabaseUrl, supabaseServiceRoleKey, rangeStart);

        if (!result.ok) return { ok: false, reason: result.reason };
        if (result.data.length === 0) break;

        allRows.push(...result.data);
        if (result.data.length < PAGE_SIZE) break;
      }

      return { ok: true, data: allRows };
    })(),
  ]);

  if (!paginatedRows.ok) {
    return { ok: false, reason: paginatedRows.reason };
  }

  return {
    ok: true,
    data: paginatedRows.data.map((row) => normalizeTrendEventRow(row, geoCacheResult)),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (useSeedData()) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(loadSeedSignals());
  }

  try {
    const result = await fetchTrendSignalsFromSupabase();

    if (!result.ok) {
      console.error('map_signals_not_loaded', result.reason);
      return res.status(500).json({ error: 'map_signals_query_failed' });
    }

    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('map_signals_error', error);
    return res.status(500).json({ error: 'map_signals_query_failed' });
  }
}
