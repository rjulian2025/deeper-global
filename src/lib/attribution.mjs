/**
 * Attribution capture and retrieval utilities.
 * - First touch: persisted in localStorage, never overwritten
 * - Last touch: persisted in sessionStorage, replaced only when a new landing includes UTMs/gclid
 *
 * Stored fields:
 * - source, medium, campaign, content, term, gclid
 * - referrer (full document.referrer)
 * - landing_page (pathname + search)
 * - first_seen_ts (ISO 8601)
 */

const FIRST_TOUCH_KEY = 'dg_attribution_ft';
const LAST_TOUCH_KEY = 'dg_attribution_lt';
const MAX_VALUE_LEN = 100;
const INTERNAL_HOSTS = new Set(['deeper.global', 'www.deeper.global']);

function safeTruncate(value, max = MAX_VALUE_LEN) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.replace(/\s+/g, ' ').trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function hostFromReferrer(referrer) {
  if (!referrer) return undefined;
  try {
    const u = new URL(referrer);
    const host = u.hostname || undefined;
    if (host && !INTERNAL_HOSTS.has(host)) return host;
    return undefined; // ignore internal referrers
  } catch {
    return undefined;
  }
}

function extractFromLocation(locationLike) {
  const loc = typeof locationLike === 'string' ? new URL(locationLike, 'https://example.com') : locationLike;
  const pathname = loc?.pathname ?? '/';
  const search = loc?.search ?? '';
  const urlSearch = new URLSearchParams(search);
  const hasUtm =
    urlSearch.has('utm_source') ||
    urlSearch.has('utm_medium') ||
    urlSearch.has('utm_campaign') ||
    urlSearch.has('utm_content') ||
    urlSearch.has('utm_term');
  const gclid = urlSearch.get('gclid') ?? undefined;

  return {
    hasUtm: hasUtm || Boolean(gclid),
    params: {
      source: safeTruncate(urlSearch.get('utm_source') ?? undefined),
      medium: safeTruncate(urlSearch.get('utm_medium') ?? undefined),
      campaign: safeTruncate(urlSearch.get('utm_campaign') ?? undefined),
      content: safeTruncate(urlSearch.get('utm_content') ?? undefined),
      term: safeTruncate(urlSearch.get('utm_term') ?? undefined),
      gclid: safeTruncate(gclid ?? undefined),
      // path only (no query) to avoid leaking PII
      landing_page: safeTruncate(`${pathname}`.slice(0, MAX_VALUE_LEN)),
    },
  };
}

/**
 * Capture attribution on landing.
 * - Always writes first-touch if missing (even if no UTMs present)
 * - Writes last-touch only when UTMs/gclid are present on this landing
 *
 * @param {Location|URL|string} locationLike
 * @param {string|undefined} referrer
 * @param {{ localStorage?: Storage, sessionStorage?: Storage }} [storageOverride]
 */
export function captureAttributionOnLanding(locationLike, referrer, storageOverride = {}) {
  try {
    const { hasUtm, params } = extractFromLocation(locationLike);
    const refHost = hostFromReferrer(referrer);
    const local = storageOverride.localStorage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
    const session = storageOverride.sessionStorage ?? (typeof window !== 'undefined' ? window.sessionStorage : undefined);
    if (!local || !session) return;

    const nowIso = new Date().toISOString();
    const firstTouchExisting = safeParseJson(local.getItem(FIRST_TOUCH_KEY));
    if (!firstTouchExisting) {
      const firstTouch = {
        ...params,
        referrer: safeTruncate(refHost ?? ''),
        first_seen_ts: nowIso,
      };
      local.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
    }

    // Update last touch when:
    // - UTMs/gclid are present, OR
    // - An external referrer (non-internal) arrives even without UTMs
    if (hasUtm || refHost) {
      const lastTouch = {
        ...params,
        referrer: safeTruncate(refHost ?? ''),
      };
      session.setItem(LAST_TOUCH_KEY, JSON.stringify(lastTouch));
    }
  } catch {
    // Never break the page due to attribution capture
  }
}

function safeParseJson(text) {
  if (typeof text !== 'string' || !text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeTouch(obj) {
  if (!obj || typeof obj !== 'object') return null;
  return {
    source: safeTruncate(obj.source),
    medium: safeTruncate(obj.medium),
    campaign: safeTruncate(obj.campaign),
    content: safeTruncate(obj.content),
    term: safeTruncate(obj.term),
    gclid: safeTruncate(obj.gclid),
    referrer: safeTruncate(obj.referrer),
    landing_page: safeTruncate(obj.landing_page),
    first_seen_ts: safeTruncate(obj.first_seen_ts ?? ''),
  };
}

/**
 * Read stored first/last touch and return GA4-param-friendly mapping.
 * - Keys: ft_source, ft_medium, ft_campaign, ft_content, lt_*, referrer, landing_page
 */
export function getAttributionParams(storageOverride = {}) {
  try {
    const local = storageOverride.localStorage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);
    const session = storageOverride.sessionStorage ?? (typeof window !== 'undefined' ? window.sessionStorage : undefined);
    if (!local || !session) return {};
    const firstTouch = normalizeTouch(safeParseJson(local.getItem(FIRST_TOUCH_KEY))) ?? {};
    const lastTouch = normalizeTouch(safeParseJson(session.getItem(LAST_TOUCH_KEY))) ?? {};

    const params = {
      // first-touch
      ft_source: firstTouch.source,
      ft_medium: firstTouch.medium,
      ft_campaign: firstTouch.campaign,
      ft_content: firstTouch.content,
      // last-touch
      lt_source: lastTouch.source,
      lt_medium: lastTouch.medium,
      lt_campaign: lastTouch.campaign,
      lt_content: lastTouch.content,
      // shared context
      referrer: firstTouch.referrer,
      landing_page: firstTouch.landing_page,
    };

    // Drop undefined/null/empty values
    return Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
  } catch {
    return {};
  }
}

export const __TESTING__ = {
  extractFromLocation,
  safeTruncate,
  FIRST_TOUCH_KEY,
  LAST_TOUCH_KEY,
};

