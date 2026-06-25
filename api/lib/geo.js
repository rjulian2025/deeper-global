// Shared geocoding utilities for the Psychology Weather Map.
//
// Used by:
//   api/geocode-backfill.js  - one-time backfill of existing intent_events
//   api/sync-trends.js       - geocodes new locations after every trend sync

export const US_STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii',
  ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska',
  NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico',
  NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

// Geographic centroids for US states — used to avoid Mapbox API calls for
// state-level rows that have no city, saving rate-limit quota during sync.
export const US_STATE_CENTROIDS = {
  AL: { lng: -86.9023, lat: 32.3182 }, AK: { lng: -152.4044, lat: 61.3707 },
  AZ: { lng: -111.0937, lat: 34.0489 }, AR: { lng: -92.3731, lat: 34.9697 },
  CA: { lng: -119.4179, lat: 36.7783 }, CO: { lng: -105.7821, lat: 39.5501 },
  CT: { lng: -72.7554, lat: 41.6032 }, DE: { lng: -75.5277, lat: 38.9108 },
  DC: { lng: -77.0369, lat: 38.9072 }, FL: { lng: -81.5158, lat: 27.6648 },
  GA: { lng: -83.5007, lat: 32.1656 }, HI: { lng: -155.5828, lat: 19.8968 },
  ID: { lng: -114.742, lat: 44.0682 }, IL: { lng: -89.3985, lat: 40.6331 },
  IN: { lng: -86.1349, lat: 40.2672 }, IA: { lng: -93.0977, lat: 41.878 },
  KS: { lng: -98.4842, lat: 39.0119 }, KY: { lng: -84.27, lat: 37.8393 },
  LA: { lng: -91.8749, lat: 30.9843 }, ME: { lng: -69.4455, lat: 45.2538 },
  MD: { lng: -76.6413, lat: 39.0458 }, MA: { lng: -71.3824, lat: 42.4072 },
  MI: { lng: -84.5361, lat: 44.3148 }, MN: { lng: -94.6859, lat: 46.7296 },
  MS: { lng: -89.3985, lat: 32.3547 }, MO: { lng: -91.8318, lat: 37.9643 },
  MT: { lng: -110.3626, lat: 46.8797 }, NE: { lng: -99.9018, lat: 41.4925 },
  NV: { lng: -116.4194, lat: 38.8026 }, NH: { lng: -71.5724, lat: 43.1939 },
  NJ: { lng: -74.4057, lat: 40.0583 }, NM: { lng: -105.8701, lat: 34.5199 },
  NY: { lng: -75.5268, lat: 43.2994 }, NC: { lng: -79.0193, lat: 35.7596 },
  ND: { lng: -101.002, lat: 47.5515 }, OH: { lng: -82.9071, lat: 40.4173 },
  OK: { lng: -97.0929, lat: 35.0078 }, OR: { lng: -120.5542, lat: 43.8041 },
  PA: { lng: -77.1945, lat: 41.2033 }, RI: { lng: -71.4774, lat: 41.5801 },
  SC: { lng: -81.1637, lat: 33.8361 }, SD: { lng: -99.9018, lat: 43.9695 },
  TN: { lng: -86.5804, lat: 35.5175 }, TX: { lng: -99.9018, lat: 31.9686 },
  UT: { lng: -111.0937, lat: 39.321 }, VT: { lng: -72.5778, lat: 44.5588 },
  VA: { lng: -78.6569, lat: 37.4316 }, WA: { lng: -120.7401, lat: 47.7511 },
  WV: { lng: -80.4549, lat: 38.5976 }, WI: { lng: -89.6165, lat: 43.7844 },
  WY: { lng: -107.2903, lat: 43.076 },
};

/**
 * Build the pipe-delimited location key used as primary key in geo_cache.
 * Nulls become empty strings so the key is always deterministic.
 *
 * @param {string|null} country
 * @param {string|null} state
 * @param {string|null} city
 * @returns {string}
 */
export function buildLocationKey(country, state, city) {
  return [country ?? '', state ?? '', city ?? ''].join('|');
}

/**
 * Return hardcoded coordinates for US state-only rows without calling the
 * Mapbox API — avoids burning geocoding quota for the most common signal type.
 *
 * Returns null for rows with a city or non-US country so they fall through
 * to the Mapbox API path.
 *
 * @param {string|null} country
 * @param {string|null} state
 * @param {string|null} city
 * @returns {{ lat: number, lng: number } | null}
 */
export function resolveStaticCoords(country, state, city) {
  if (city) return null;
  if (country === 'US' && state && US_STATE_CENTROIDS[state]) {
    return US_STATE_CENTROIDS[state];
  }
  return null;
}

/**
 * Build the query string to pass to Mapbox Geocoding API.
 *
 * @param {string|null} country
 * @param {string|null} state
 * @param {string|null} city
 * @returns {string}
 */
export function buildGeocodeQuery(country, state, city) {
  const parts = [];
  if (city) parts.push(city);
  if (state) {
    parts.push(country === 'US' && US_STATE_NAMES[state] ? US_STATE_NAMES[state] : state);
  }
  if (country) parts.push(country);
  return parts.join(', ');
}

/**
 * Geocode a single location via Mapbox Geocoding API v5.
 * Returns { lat, lng, geocoder: 'mapbox' } or null on failure.
 *
 * @param {string|null} country
 * @param {string|null} state
 * @param {string|null} city
 * @param {string} mapboxToken
 * @returns {Promise<{ lat: number, lng: number, geocoder: string } | null>}
 */
export async function geocodeViaMapbox(country, state, city, mapboxToken) {
  const query = buildGeocodeQuery(country, state, city);
  if (!query) return null;

  const countryParam = country ? `&country=${encodeURIComponent(country.toLowerCase())}` : '';
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1${countryParam}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const payload = await response.json();
    const center = payload.features?.[0]?.center;
    if (!Array.isArray(center) || center.length < 2) return null;

    return { lng: center[0], lat: center[1], geocoder: 'mapbox' };
  } catch {
    return null;
  }
}

/**
 * Geocode a list of unique locations, returning a Map of
 * locationKey -> { lat, lng, geocoder }.
 *
 * Resolution order:
 *  1. Static US state centroids (no API call)
 *  2. Mapbox Geocoding API (rate-limited via batchSize + delayMs)
 *
 * @param {Array<{ country: string|null, state: string|null, city: string|null }>} locations
 * @param {string} mapboxToken
 * @param {{ batchSize?: number, delayMs?: number }} [opts]
 * @returns {Promise<Map<string, { lat: number, lng: number, geocoder: string }>>}
 */
export async function geocodeLocations(locations, mapboxToken, opts = {}) {
  const { batchSize = 6, delayMs = 200 } = opts;
  const results = new Map();

  const needsApi = [];

  for (const { country, state, city } of locations) {
    const key = buildLocationKey(country, state, city);
    const static_ = resolveStaticCoords(country, state, city);

    if (static_) {
      results.set(key, { ...static_, geocoder: 'static_centroid' });
    } else {
      needsApi.push({ country, state, city, key });
    }
  }

  for (let i = 0; i < needsApi.length; i += batchSize) {
    const batch = needsApi.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async ({ country, state, city, key }) => {
        const coords = await geocodeViaMapbox(country, state, city, mapboxToken);
        if (coords) results.set(key, coords);
      })
    );

    if (i + batchSize < needsApi.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Upsert geocoded rows to geo_cache via Supabase PostgREST.
 *
 * @param {string} supabaseUrl
 * @param {string} supabaseServiceRoleKey
 * @param {Array<{ location_key, country, state, city, lat, lng, geocoder }>} rows
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
export async function upsertGeoCache(supabaseUrl, supabaseServiceRoleKey, rows) {
  if (!rows.length) return { ok: true };

  const chunkSize = 200;

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);

    const response = await fetch(`${supabaseUrl}/rest/v1/geo_cache`, {
      method: 'POST',
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(chunk),
    });

    if (!response.ok) {
      return { ok: false, reason: await response.text() };
    }
  }

  return { ok: true };
}

/**
 * Fetch all existing location_keys from geo_cache.
 *
 * @param {string} supabaseUrl
 * @param {string} supabaseServiceRoleKey
 * @returns {Promise<Set<string>>}
 */
export async function fetchExistingGeoCacheKeys(supabaseUrl, supabaseServiceRoleKey) {
  const response = await fetch(`${supabaseUrl}/rest/v1/geo_cache?select=location_key`, {
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) return new Set();

  const rows = await response.json();
  return new Set(Array.isArray(rows) ? rows.map((r) => r.location_key) : []);
}
