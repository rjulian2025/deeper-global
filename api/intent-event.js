const ALLOWED_EVENTS = new Set([
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
  'deeper_outbound_click',
  'external_referral_clicked',
  'editorial_policy_viewed',
  'answer_related_clicked',
  'api_answer_fetched',
  'api_answers_listed',
]);

const ALLOWED_CONTENT_TYPES = new Set(['answer', 'category', 'entity', 'hub', 'policy', 'search', 'external_referral']);
const ALLOWED_RISK_CLASSES = new Set(['standard', 'crisis-sensitive', 'unknown']);
const ALLOWED_INTENT_STAGES = new Set([
  'understanding_symptom',
  'self_management',
  'care_navigation',
  'relationship_navigation',
  'identity_meaning',
  'risk_support',
  'practitioner_relevance',
]);
const ALLOWED_SENSITIVITIES = new Set(['standard', 'diagnosis-risk', 'medication', 'crisis-sensitive', 'abuse', 'minor', 'addiction', 'trauma']);
const ALLOWED_DEVICE_TYPES = new Set(['desktop', 'mobile', 'tablet', 'unknown']);
const METADATA_KEYS = new Set([
  'search_topic',
  'search_result_count',
  'search_has_results',
  'search_result_position',
  'search_token_count',
  'outbound_domain',
  'destination_domain',
  'placement',
  'source_page',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'target_path',
]);

function cleanText(value, maxLength = 120) {
  if (typeof value !== 'string') return null;
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function cleanPath(value) {
  const path = cleanText(value, 220);
  return path?.startsWith('/') ? path : null;
}

function cleanBoolean(value) {
  return typeof value === 'boolean' ? value : null;
}

function cleanNumber(value) {
  return Number.isFinite(value) ? value : null;
}

function cleanEnum(value, allowedValues, fallback = null) {
  const text = cleanText(value, 80);
  return text && allowedValues.has(text) ? text : fallback;
}

function cleanSensitivity(value) {
  const values = Array.isArray(value) ? value : [value];
  const cleaned = values
    .map((item) => cleanEnum(item, ALLOWED_SENSITIVITIES))
    .filter(Boolean);
  return cleaned.length ? Array.from(new Set(cleaned)) : ['standard'];
}

function cleanRegion(value, maxLength = 80) {
  const text = cleanText(value, maxLength);
  if (!text) return null;
  return text.replace(/[^a-zA-Z0-9 -]/g, '').slice(0, maxLength) || null;
}

function bodyFromRequest(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(req.body)) {
    try {
      return JSON.parse(req.body.toString('utf8'));
    } catch {
      return {};
    }
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

function sanitizedMetadata(params) {
  const metadata = {};

  for (const [key, value] of Object.entries(params)) {
    if (!METADATA_KEYS.has(key)) continue;

    if (typeof value === 'boolean') {
      metadata[key] = value;
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      metadata[key] = value;
    } else if (typeof value === 'string') {
      metadata[key] = cleanText(value, key === 'target_path' ? 220 : 120);
    }
  }

  return metadata;
}

function sanitizeEvent(payload, req) {
  const params = payload?.event_params && typeof payload.event_params === 'object' ? payload.event_params : payload ?? {};
  const eventName = cleanEnum(payload?.event_name ?? params.event_name, ALLOWED_EVENTS);

  if (!eventName) return null;

  const sensitivity = cleanSensitivity(params.sensitivity);
  const regionCountry = cleanRegion(req.headers['x-vercel-ip-country'], 2);
  const regionState = cleanRegion(req.headers['x-vercel-ip-country-region'], 80);
  const regionCity = cleanRegion(req.headers['x-vercel-ip-city'], 80);

  return {
    event_name: eventName,
    page_path: cleanPath(params.page_path),
    referrer_domain: cleanText(params.referrer_domain, 120),
    content_type: cleanEnum(params.content_type, ALLOWED_CONTENT_TYPES, 'hub'),
    answer_slug: cleanText(params.answer_slug, 160),
    category: cleanText(params.category ?? params.search_topic, 120),
    entity_slug: cleanText(params.entity_slug, 160),
    review_status: cleanText(params.review_status, 40),
    risk_class: cleanEnum(params.risk_class, ALLOWED_RISK_CLASSES, 'unknown'),
    intent_stage: cleanEnum(params.intent_stage, ALLOWED_INTENT_STAGES),
    sensitivity,
    region_country: regionCountry,
    region_state: regionState,
    region_city: regionCity,
    device_type: cleanEnum(params.device_type, ALLOWED_DEVICE_TYPES, 'unknown'),
    metadata: {
      ...sanitizedMetadata(params),
      search_has_results: cleanBoolean(params.search_has_results),
      search_result_count: cleanNumber(params.search_result_count),
      search_result_position: cleanNumber(params.search_result_position),
      search_token_count: cleanNumber(params.search_token_count),
    },
  };
}

async function recordInSupabase(event) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { ok: false, reason: 'missing_supabase_env' };
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/record_intent_event`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event }),
  });

  if (!response.ok) {
    return { ok: false, reason: await response.text() };
  }

  return { ok: true };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const event = sanitizeEvent(bodyFromRequest(req), req);

  if (!event) {
    return res.status(204).end();
  }

  try {
    const result = await recordInSupabase(event);
    if (!result.ok) console.error('intent_event_not_recorded', result.reason);
  } catch (error) {
    console.error('intent_event_error', error);
  }

  return res.status(202).json({ accepted: true });
}
