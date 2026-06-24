const ALLOWED_API_EVENTS = new Set(['api_answer_fetched', 'api_answers_listed']);

function cleanText(value, maxLength = 160) {
  if (typeof value !== 'string') return null;
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function cleanPath(value) {
  const path = cleanText(value, 220);
  return path?.startsWith('/') ? path : null;
}

function cleanRegion(value, maxLength = 80) {
  const text = cleanText(Array.isArray(value) ? value[0] : value, maxLength);
  if (!text) return null;
  return text.replace(/[^a-zA-Z0-9 -]/g, '').slice(0, maxLength) || null;
}

export async function recordApiAccess({
  eventName,
  slug = null,
  topic = null,
  query = null,
  attribution = null,
  referrerDomain = null,
  headers = {},
}) {
  if (!ALLOWED_API_EVENTS.has(eventName)) return { ok: false, reason: 'invalid_event' };

  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const payload = {
    event_name: eventName,
    page_path: slug ? `/api/v1/answers/${slug}` : '/api/v1/answers',
    referrer_domain: cleanText(referrerDomain, 120),
    content_type: 'answer',
    answer_slug: cleanText(slug, 160),
    category: cleanText(topic, 120),
    review_status: 'reviewed',
    risk_class: 'unknown',
    region_country: cleanRegion(headers['x-vercel-ip-country'], 2)?.toUpperCase() ?? null,
    region_state: cleanRegion(headers['x-vercel-ip-country-region'], 80),
    region_city: cleanRegion(headers['x-vercel-ip-city'], 80),
    metadata: {
      api_version: 'v1',
      search_query: cleanText(query, 120),
      attribution: cleanText(attribution, 220),
    },
  };

  console.info('api_citation_access', JSON.stringify(payload));

  if (!supabaseUrl || !supabaseKey) {
    return { ok: false, reason: 'missing_supabase_env' };
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/record_intent_event`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event: payload }),
    });

    if (!response.ok) {
      return { ok: false, reason: await response.text() };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : 'unknown_error' };
  }
}

export function readAttributionHeader(req) {
  const header = req.headers['x-deeper-attribution'];
  return typeof header === 'string' ? header : null;
}

export function readReferrerDomain(req) {
  const referer = req.headers.referer ?? req.headers.referrer;
  if (typeof referer !== 'string' || !referer) return null;

  try {
    return new URL(referer).hostname;
  } catch {
    return null;
  }
}
