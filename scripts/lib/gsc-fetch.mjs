import { createSign } from 'node:crypto';
import { loadLocalEnv } from './supabase-env.mjs';

const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DEFAULT_GSC_SITE_URL = 'https://www.deeper.global/';
const DEFAULT_LAG_DAYS = 3;
const DEFAULT_WINDOW_DAYS = 28;

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizeGooglePrivateKey(value) {
  return cleanText(value).replace(/\\n/g, '\n');
}

function isoDateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function isoDateDaysBefore(dateString, days) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function base64Url(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function createServiceAccountJwt({ clientEmail, privateKey, scope }) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: clientEmail,
    scope,
    aud: GOOGLE_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const unsignedJwt = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claims))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedJwt);
  signer.end();
  return `${unsignedJwt}.${base64Url(signer.sign(privateKey))}`;
}

export function searchConsoleConfig() {
  loadLocalEnv();
  const siteUrl = cleanText(process.env.GSC_SITE_URL, DEFAULT_GSC_SITE_URL);
  const clientEmail = cleanText(process.env.GSC_CLIENT_EMAIL, cleanText(process.env.GA4_CLIENT_EMAIL));
  const privateKey = normalizeGooglePrivateKey(process.env.GSC_PRIVATE_KEY ?? process.env.GA4_PRIVATE_KEY);

  if (!clientEmail || !privateKey) {
    return {
      ok: false,
      reason: 'Missing GSC_CLIENT_EMAIL/GSC_PRIVATE_KEY or GA4_CLIENT_EMAIL/GA4_PRIVATE_KEY.',
      siteUrl,
    };
  }

  return { ok: true, siteUrl, clientEmail, privateKey };
}

async function fetchAccessToken(config) {
  const assertion = createServiceAccountJwt({ ...config, scope: GSC_SCOPE });
  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.access_token) {
    throw new Error(`Search Console token request failed: ${payload.error_description ?? payload.error ?? response.statusText}`);
  }

  return payload.access_token;
}

async function runSearchConsoleQuery({ siteUrl, accessToken, startDate, endDate, dimensions = [], rowLimit = 1000, startRow = 0 }) {
  const response = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        rowLimit,
        startRow,
        dataState: 'final',
      }),
    }
  );
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Search Console query failed: ${payload?.error?.message ?? response.statusText}`);
  }

  return payload;
}

function slugFromAnswerPath(pagePath) {
  const match = cleanText(pagePath).match(/^\/answers\/([^/?#]+)\/?$/i);
  return match ? match[1] : null;
}

/**
 * Fetch GSC page metrics keyed by answer slug.
 * Returns { available, reason, dateRange, bySlug: Map<slug, { clicks, impressions, ctr, position, page }> }
 */
export async function fetchAnswerPageMetrics({ rowLimit = 1000, lagDays = DEFAULT_LAG_DAYS, windowDays = DEFAULT_WINDOW_DAYS } = {}) {
  const config = searchConsoleConfig();
  const endDate = isoDateDaysAgo(lagDays);
  const startDate = isoDateDaysBefore(endDate, windowDays);
  const dateRange = { startDate, endDate, lagDays, windowDays };

  if (!config.ok) {
    return { available: false, reason: config.reason, dateRange, bySlug: new Map() };
  }

  try {
    const accessToken = await fetchAccessToken(config);
    const payload = await runSearchConsoleQuery({
      siteUrl: config.siteUrl,
      accessToken,
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit,
    });

    const bySlug = new Map();
    for (const row of payload.rows ?? []) {
      const page = cleanText(row.keys?.[0]);
      const slug = slugFromAnswerPath(page);
      if (!slug) continue;

      const metrics = {
        page,
        clicks: Number(row.clicks ?? 0),
        impressions: Number(row.impressions ?? 0),
        ctr: Number(row.ctr ?? 0),
        position: Number(row.position ?? 0),
      };

      const existing = bySlug.get(slug);
      if (!existing || metrics.impressions > existing.impressions) {
        bySlug.set(slug, metrics);
      }
    }

    return {
      available: true,
      source: 'Google Search Console API',
      siteUrl: config.siteUrl,
      dateRange,
      rowCount: payload.rows?.length ?? 0,
      bySlug,
    };
  } catch (error) {
    return { available: false, reason: error.message, dateRange, bySlug: new Map() };
  }
}
