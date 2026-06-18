const CATEGORY_KEYWORDS = [
  { category: 'Anxiety & Stress', keyword: 'anxiety' },
  { category: 'Depression', keyword: 'depression' },
  { category: 'Addiction & Recovery', keyword: 'addiction recovery' },
  { category: 'Trauma & Safety', keyword: 'trauma therapy' },
  { category: 'Therapy & Care Navigation', keyword: 'find a therapist' },
  { category: 'Identity & Self-Worth', keyword: 'self worth' },
  { category: 'Relationships & Communication', keyword: 'relationship problems' },
  { category: 'Family & Parenting', keyword: 'parenting stress' },
  { category: 'Grief & Loss', keyword: 'grief counseling' },
  { category: 'Work & Burnout', keyword: 'burnout' },
  { category: 'Teens & Identity', keyword: 'teen mental health' },
  { category: 'Loneliness & Belonging', keyword: 'loneliness' },
  { category: 'Neurodivergence & Attention', keyword: 'ADHD' },
  { category: 'Gender, Sexuality & Intimacy', keyword: 'gender identity' },
  { category: 'Meaning, Faith & Existential Questions', keyword: 'existential crisis' },
  { category: 'General Mental Health', keyword: 'mental health' },
];

const INTERNATIONAL_GEOS = [
  'GB', 'CA', 'AU', 'NZ', 'IE', 'IN', 'ZA',
  'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'FI', 'CH',
  'BR', 'MX', 'JP', 'KR', 'SG',
];

const TREND_EVENT_NAME = 'trend_region_sync';
const TREND_SOURCE = 'serpapi_trends';

function getSupabaseWriteConfig() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return { supabaseUrl, supabaseServiceRoleKey };
}

function supabaseHeaders(supabaseServiceRoleKey, prefer) {
  const headers = {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (prefer) headers.Prefer = prefer;
  return headers;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function cleanRegion(value, maxLength = 80) {
  if (typeof value !== 'string') return null;
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (!normalized) return null;
  return normalized.replace(/[^a-zA-Z0-9 -]/g, '').slice(0, maxLength) || null;
}

function parseUsLocation(location, geo) {
  const text = typeof location === 'string' ? location.trim() : '';

  if (!text) {
    return { state: null, city: null };
  }

  if (text.includes(',')) {
    const [cityPart, statePart] = text.split(',').map((part) => part.trim());
    return {
      city: cleanRegion(cityPart, 80),
      state: cleanRegion(statePart, 80),
    };
  }

  if (typeof geo === 'string' && /^US-[A-Z]{2}$/.test(geo)) {
    return {
      city: null,
      state: cleanRegion(geo.slice(3), 2)?.toUpperCase() ?? null,
    };
  }

  return {
    city: null,
    state: cleanRegion(text, 80),
  };
}

function normalizeTrendItem(item, category, day, country = 'US') {
  const eventCount = Number(item?.extracted_value ?? item?.value ?? 0);
  if (!Number.isFinite(eventCount) || eventCount <= 0) return null;

  const { state, city } = parseUsLocation(item?.location, item?.geo);

  return {
    country,
    state,
    city,
    category,
    day,
    event_count: Math.round(eventCount),
  };
}

async function fetchTrendRegions(keyword, serpApiKey, geo = 'US') {
  const params = new URLSearchParams({
    engine: 'google_trends',
    q: keyword,
    data_type: 'GEO_MAP_0',
    geo,
    api_key: serpApiKey,
  });

  const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`serpapi_request_failed:${keyword}:${response.status}`);
  }

  const payload = await response.json();
  if (payload?.error) {
    throw new Error(`serpapi_error:${payload.error}`);
  }

  return Array.isArray(payload?.interest_by_region) ? payload.interest_by_region : [];
}

const SYNC_FETCH_CONCURRENCY = 2;
const SYNC_BATCH_DELAY_MS = 250;

async function collectTrendRowsForJob(serpApiKey, day, geo, category, keyword) {
  try {
    const regions = await fetchTrendRegions(keyword, serpApiKey, geo);
    const rows = [];

    for (const item of regions) {
      const normalized = normalizeTrendItem(item, category, day, geo);
      if (!normalized) continue;
      rows.push(toIntentEventRow(normalized, keyword));
    }

    return { rows, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_job_error';
    console.error('sync_trends_job_failed', { geo, category, keyword, message });
    return { rows: [], error: message };
  }
}

async function collectAllTrendRows(serpApiKey, day) {
  const jobs = [{ geo: 'US', categories: CATEGORY_KEYWORDS }];

  for (const geo of INTERNATIONAL_GEOS) {
    jobs.push({ geo, categories: CATEGORY_KEYWORDS });
  }

  const tasks = jobs.flatMap(({ geo, categories }) =>
    categories.map(({ category, keyword }) => ({ geo, category, keyword }))
  );

  const intentRows = [];
  let failedJobs = 0;
  let lastError = null;

  for (let index = 0; index < tasks.length; index += SYNC_FETCH_CONCURRENCY) {
    const batch = tasks.slice(index, index + SYNC_FETCH_CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(({ geo, category, keyword }) => collectTrendRowsForJob(serpApiKey, day, geo, category, keyword))
    );

    for (const result of batchResults) {
      if (result.error) {
        failedJobs += 1;
        lastError = result.error;
      }
      intentRows.push(...result.rows);
    }

    if (index + SYNC_FETCH_CONCURRENCY < tasks.length) {
      await new Promise((resolve) => setTimeout(resolve, SYNC_BATCH_DELAY_MS));
    }
  }

  return { intentRows, failedJobs, lastError, totalJobs: tasks.length };
}

function toIntentEventRow(normalizedRow, keyword) {
  return {
    event_name: TREND_EVENT_NAME,
    content_type: 'hub',
    category: normalizedRow.category,
    region_country: normalizedRow.country,
    region_state: normalizedRow.state,
    region_city: normalizedRow.city,
    risk_class: 'unknown',
    sensitivity: ['standard'],
    device_type: 'unknown',
    occurred_at: `${normalizedRow.day}T12:00:00.000Z`,
    metadata: {
      source: TREND_SOURCE,
      keyword,
      trend_day: normalizedRow.day,
      trend_score: normalizedRow.event_count,
    },
  };
}

async function deleteExistingTrendRows(supabaseUrl, supabaseServiceRoleKey, day) {
  const query = [
    `event_name=eq.${encodeURIComponent(TREND_EVENT_NAME)}`,
    `occurred_at=gte.${encodeURIComponent(`${day}T00:00:00.000Z`)}`,
    `occurred_at=lt.${encodeURIComponent(`${day}T23:59:59.999Z`)}`,
    `metadata->>source=eq.${encodeURIComponent(TREND_SOURCE)}`,
  ].join('&');

  const response = await fetch(`${supabaseUrl}/rest/v1/intent_events?${query}`, {
    method: 'DELETE',
    headers: supabaseHeaders(supabaseServiceRoleKey, 'return=minimal'),
  });

  if (!response.ok) {
    return { ok: false, reason: await response.text() };
  }

  return { ok: true };
}

async function insertTrendRows(supabaseUrl, supabaseServiceRoleKey, rows) {
  if (!rows.length) return { ok: true, inserted: 0 };

  const chunkSize = 500;
  let inserted = 0;

  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize);
    const response = await fetch(`${supabaseUrl}/rest/v1/intent_events`, {
      method: 'POST',
      headers: supabaseHeaders(supabaseServiceRoleKey, 'return=minimal'),
      body: JSON.stringify(chunk),
    });

    if (!response.ok) {
      return { ok: false, reason: await response.text() };
    }

    inserted += chunk.length;
  }

  return { ok: true, inserted };
}

async function refreshMapSignals(supabaseUrl, supabaseServiceRoleKey) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/refresh_map_signals`, {
    method: 'POST',
    headers: supabaseHeaders(supabaseServiceRoleKey),
    body: '{}',
  });

  if (!response.ok) {
    return { ok: false, reason: await response.text() };
  }

  return { ok: true };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const cronSecret = process.env.CRON_SECRET;
  const providedSecret = req.headers['x-sync-secret'];

  if (!cronSecret || providedSecret !== cronSecret) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const serpApiKey = process.env.SERPAPI_KEY;
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseWriteConfig();

  if (!serpApiKey) {
    return res.status(500).json({ error: 'missing_serpapi_key' });
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(500).json({ error: 'missing_supabase_service_role_key' });
  }

  const day = todayIsoDate();

  try {
    const { intentRows, failedJobs, lastError, totalJobs } = await collectAllTrendRows(serpApiKey, day);

    if (!intentRows.length) {
      return res.status(502).json({
        error: 'sync_trends_no_rows',
        message: lastError ?? 'no_trend_rows_collected',
        failed_jobs: failedJobs,
        total_jobs: totalJobs,
      });
    }

    const deleteResult = await deleteExistingTrendRows(supabaseUrl, supabaseServiceRoleKey, day);
    if (!deleteResult.ok) {
      console.error('sync_trends_delete_failed', deleteResult.reason);
      return res.status(500).json({ error: 'sync_trends_delete_failed' });
    }

    const insertResult = await insertTrendRows(supabaseUrl, supabaseServiceRoleKey, intentRows);
    if (!insertResult.ok) {
      console.error('sync_trends_insert_failed', insertResult.reason);
      return res.status(500).json({ error: 'sync_trends_insert_failed' });
    }

    const refreshResult = await refreshMapSignals(supabaseUrl, supabaseServiceRoleKey);
    if (!refreshResult.ok) {
      console.error('sync_trends_refresh_failed', refreshResult.reason);
      return res.status(500).json({ error: 'sync_trends_refresh_failed' });
    }

    return res.status(200).json({
      synced: intentRows.length,
      categories: CATEGORY_KEYWORDS.length,
      map_signals_refreshed: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('sync_trends_error', error);
    return res.status(500).json({
      error: 'sync_trends_failed',
      message: error instanceof Error ? error.message : 'unknown_error',
    });
  }
}
