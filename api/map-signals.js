import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SEED_FILE = join(dirname(fileURLToPath(import.meta.url)), '../src/data/map-signals-seed.json');
const TREND_EVENT_NAME = 'trend_region_sync';

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

function normalizeTrendEventRow(row) {
  const eventCount = Number(row.event_count ?? 0);
  const occurredAt = typeof row.occurred_at === 'string' ? row.occurred_at : '';

  return {
    country: row.region_country ?? null,
    state: row.region_state ?? null,
    city: row.region_city ?? null,
    category: row.category ?? null,
    day: occurredAt.slice(0, 10) || null,
    event_count: Number.isFinite(eventCount) ? Math.round(eventCount) : 0,
  };
}

async function fetchTrendSignalsFromSupabase() {
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseReadConfig();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { ok: false, reason: 'missing_supabase_service_role_key' };
  }

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
    },
  });

  if (!response.ok) {
    return { ok: false, reason: await response.text() };
  }

  const rows = await response.json();
  return { ok: true, data: Array.isArray(rows) ? rows.map(normalizeTrendEventRow) : [] };
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
