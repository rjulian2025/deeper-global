import { createSign } from 'node:crypto';

const DEFAULT_REPORT_TO = 'rjulian@qvbrands.com';
const REPORT_WINDOW_DAYS = 30;
const DEFAULT_GA4_REPORT_HOSTNAME = 'www.deeper.global';
const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

function cleanText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function isoDateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET ?? process.env.REPORT_CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.authorization ?? req.headers.Authorization;
  const headerSecret = req.headers['x-report-secret'];
  const querySecret = req.query?.secret;

  return authHeader === `Bearer ${secret}` || headerSecret === secret || querySecret === secret;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { url, key };
}

async function fetchRollups(viewName, sinceDate) {
  const { url, key } = supabaseConfig();
  if (!url || !key) throw new Error('Missing Supabase report credentials.');

  const params = new URLSearchParams();
  params.set(
    'select',
    'date,event_name,content_type,category,entity_slug,intent_stage,primary_sensitivity,search_has_results,region_country,region_state,event_count'
  );
  params.set('date', `gte.${sinceDate}`);
  params.set('order', 'event_count.desc');
  params.set('limit', '1000');

  const response = await fetch(`${url}/rest/v1/${viewName}?${params.toString()}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (!response.ok) {
    throw new Error(`${viewName} query failed: ${await response.text()}`);
  }

  return response.json();
}

async function fetchRollupsSafe(viewName, sinceDate) {
  try {
    return { rows: await fetchRollups(viewName, sinceDate), error: null };
  } catch (error) {
    console.error('intent_rollups_unavailable', viewName, error);
    return { rows: [], error: error.message };
  }
}

function normalizeGa4PrivateKey(value) {
  return cleanText(value).replace(/\\n/g, '\n');
}

function ga4ReportHostnames() {
  const configuredHostnames = cleanText(process.env.GA4_REPORT_HOSTNAMES ?? process.env.GA4_REPORT_HOSTNAME);
  const hostnames = configuredHostnames
    ? configuredHostnames
        .split(',')
        .map((hostname) => cleanText(hostname).toLowerCase())
        .filter(Boolean)
    : [DEFAULT_GA4_REPORT_HOSTNAME];

  return Array.from(new Set(hostnames.length ? hostnames : [DEFAULT_GA4_REPORT_HOSTNAME]));
}

function ga4HostDimensionFilter(hostnames) {
  const expressions = hostnames.map((hostname) => ({
    filter: {
      fieldName: 'hostName',
      stringFilter: {
        matchType: 'EXACT',
        value: hostname,
        caseSensitive: false,
      },
    },
  }));

  if (expressions.length === 1) return expressions[0];
  return { orGroup: { expressions } };
}

function base64Url(value) {
  const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function createServiceAccountJwt({ clientEmail, privateKey }) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: clientEmail,
    scope: GA4_SCOPE,
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

function ga4Config() {
  const propertyId = cleanText(process.env.GA4_PROPERTY_ID).replace(/^properties\//, '');
  const clientEmail = cleanText(process.env.GA4_CLIENT_EMAIL);
  const privateKey = normalizeGa4PrivateKey(process.env.GA4_PRIVATE_KEY);
  const hostnames = ga4ReportHostnames();

  if (!propertyId || !clientEmail || !privateKey) {
    return { ok: false, reason: 'Missing GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, or GA4_PRIVATE_KEY.', hostnames };
  }

  return { ok: true, propertyId, clientEmail, privateKey, hostnames };
}

async function fetchGa4AccessToken(config) {
  const assertion = createServiceAccountJwt(config);
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
    throw new Error(`GA4 token request failed: ${payload.error_description ?? payload.error ?? response.statusText}`);
  }

  return payload.access_token;
}

async function runGa4Report({ propertyId, accessToken, sinceDate, metrics, dimensions = [], limit = 10, orderBys = [], dimensionFilter }) {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dateRanges: [{ startDate: sinceDate, endDate: 'today' }],
      metrics: metrics.map((name) => ({ name })),
      dimensions: dimensions.map((name) => ({ name })),
      ...(dimensionFilter ? { dimensionFilter } : {}),
      limit,
      orderBys,
      keepEmptyRows: false,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`GA4 report request failed: ${payload?.error?.message ?? response.statusText}`);
  }

  return payload;
}

function metricValue(row, metricNames, name) {
  const index = metricNames.indexOf(name);
  return index === -1 ? null : Number(row.metricValues?.[index]?.value ?? 0);
}

function dimensionValue(row, dimensionNames, name, fallback = '(not set)') {
  const index = dimensionNames.indexOf(name);
  const value = index === -1 ? null : row.dimensionValues?.[index]?.value;
  return cleanText(value, fallback);
}

function parseGa4Rows(payload, metricNames, dimensionNames = []) {
  return (payload.rows ?? []).map((row) => ({
    dimensions: Object.fromEntries(dimensionNames.map((name) => [name, dimensionValue(row, dimensionNames, name)])),
    metrics: Object.fromEntries(metricNames.map((name) => [name, metricValue(row, metricNames, name)])),
  }));
}

function firstGa4MetricRow(payload, metricNames) {
  return parseGa4Rows(payload, metricNames)[0]?.metrics ?? {};
}

async function fetchSiteKpis(sinceDate) {
  const config = ga4Config();
  if (!config.ok) return { available: false, reason: config.reason, hostnames: config.hostnames };

  try {
    const accessToken = await fetchGa4AccessToken(config);
    const common = {
      propertyId: config.propertyId,
      accessToken,
      sinceDate,
      dimensionFilter: ga4HostDimensionFilter(config.hostnames),
    };
    const summaryMetrics = [
      'activeUsers',
      'totalUsers',
      'sessions',
      'screenPageViews',
      'userEngagementDuration',
      'engagementRate',
      'bounceRate',
      'averageSessionDuration',
    ];
    const [summary, topPages, trafficSources, countries] = await Promise.all([
      runGa4Report({
        ...common,
        metrics: summaryMetrics,
        limit: 1,
      }),
      runGa4Report({
        ...common,
        dimensions: ['pagePath', 'pageTitle'],
        metrics: ['screenPageViews', 'sessions', 'activeUsers', 'userEngagementDuration'],
        limit: 10,
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      }),
      runGa4Report({
        ...common,
        dimensions: ['sessionDefaultChannelGroup', 'sessionSourceMedium'],
        metrics: ['sessions', 'activeUsers', 'screenPageViews', 'engagementRate', 'bounceRate'],
        limit: 10,
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),
      runGa4Report({
        ...common,
        dimensions: ['country', 'region'],
        metrics: ['activeUsers', 'sessions', 'screenPageViews'],
        limit: 10,
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      }),
    ]);

    return {
      available: true,
      source: 'GA4 Data API',
      hostnames: config.hostnames,
      summary: firstGa4MetricRow(summary, summaryMetrics),
      topPages: parseGa4Rows(topPages, ['screenPageViews', 'sessions', 'activeUsers', 'userEngagementDuration'], ['pagePath', 'pageTitle']),
      trafficSources: parseGa4Rows(
        trafficSources,
        ['sessions', 'activeUsers', 'screenPageViews', 'engagementRate', 'bounceRate'],
        ['sessionDefaultChannelGroup', 'sessionSourceMedium']
      ),
      countries: parseGa4Rows(countries, ['activeUsers', 'sessions', 'screenPageViews'], ['country', 'region']),
    };
  } catch (error) {
    console.error('site_kpi_report_unavailable', error);
    return { available: false, reason: error.message, hostnames: config.hostnames };
  }
}

function sumRows(rows, keyFn, filterFn = () => true) {
  const totals = new Map();

  for (const row of rows) {
    if (!filterFn(row)) continue;
    const key = keyFn(row);
    if (!key) continue;
    totals.set(key, (totals.get(key) ?? 0) + Number(row.event_count ?? 0));
  }

  return [...totals.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

function splitKey(value) {
  return String(value).split('||');
}

function buildReport({ internalRows, publicRows, sinceDate, siteKpis, intentRollups }) {
  const topSearchTopics = sumRows(
    publicRows,
    (row) => row.category,
    (row) => row.event_name === 'site_search_performed'
  ).slice(0, 10);

  const topSearchRegions = sumRows(
    publicRows,
    (row) => [row.category || 'Uncategorized', row.region_country || 'Unknown', row.region_state || ''].join('||'),
    (row) => row.event_name === 'site_search_performed'
  ).slice(0, 10);

  const noResultSearches = sumRows(
    internalRows,
    (row) => [row.category || 'Uncategorized', row.region_country || 'Unknown'].join('||'),
    (row) => row.event_name === 'site_search_performed' && row.search_has_results === false
  ).slice(0, 10);

  const careNavigationRegions = sumRows(
    publicRows,
    (row) => [row.category || 'Uncategorized', row.region_country || 'Unknown', row.region_state || ''].join('||'),
    (row) => row.intent_stage === 'care_navigation'
  ).slice(0, 10);

  const safetySignals = sumRows(
    internalRows,
    (row) => row.primary_sensitivity || row.intent_stage || 'safety signal',
    (row) => ['crisis-sensitive', 'abuse', 'minor', 'addiction', 'medication'].includes(row.primary_sensitivity) || row.intent_stage === 'risk_support'
  ).slice(0, 8);

  return {
    generatedAt: new Date().toISOString(),
    sinceDate,
    windowDays: REPORT_WINDOW_DAYS,
    topSearchTopics,
    topSearchRegions,
    noResultSearches,
    careNavigationRegions,
    safetySignals,
    siteKpis,
    intentRollups,
    rawRollupRows: {
      internal: internalRows.length,
      public: publicRows.length,
    },
  };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function listHtml(items, formatter) {
  if (!items.length) return '<p>No threshold-cleared rows yet.</p>';
  return `<ol>${items.map((item) => `<li>${formatter(item)}</li>`).join('')}</ol>`;
}

function formatInteger(value) {
  return Number.isFinite(value) ? Math.round(value).toLocaleString('en-US') : 'n/a';
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return 'n/a';
  return `${(value * 100).toFixed(1)}%`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return 'n/a';
  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;

  return minutes ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
}

function averageEngagementSeconds(summary) {
  const activeUsers = Number(summary?.activeUsers ?? 0);
  const totalEngagementSeconds = Number(summary?.userEngagementDuration ?? 0);

  return activeUsers > 0 ? totalEngagementSeconds / activeUsers : null;
}

function siteKpiHtml(siteKpis) {
  if (!siteKpis?.available) {
    const hostScope = siteKpis?.hostnames?.length ? ` Host filter: ${siteKpis.hostnames.map(escapeHtml).join(', ')}.` : '';
    return `<p><strong>Site KPI data unavailable.</strong> ${escapeHtml(siteKpis?.reason ?? 'GA4 was not configured or returned no data.')}${hostScope}</p>`;
  }

  const summary = siteKpis.summary ?? {};
  const hostScope = siteKpis.hostnames?.length ? ` Host filter: ${siteKpis.hostnames.map(escapeHtml).join(', ')}.` : '';

  return `
    <p>Source: ${escapeHtml(siteKpis.source)}.${hostScope} Aggregate-only GA4 metrics; no raw user or session identifiers.</p>
    <ul>
      <li><strong>Active users:</strong> ${formatInteger(summary.activeUsers)}</li>
      <li><strong>Total users:</strong> ${formatInteger(summary.totalUsers)}</li>
      <li><strong>Sessions:</strong> ${formatInteger(summary.sessions)}</li>
      <li><strong>Page/screen views:</strong> ${formatInteger(summary.screenPageViews)}</li>
      <li><strong>Avg. engagement time per active user:</strong> ${formatDuration(averageEngagementSeconds(summary))}</li>
      <li><strong>Avg. session duration:</strong> ${formatDuration(summary.averageSessionDuration)}</li>
      <li><strong>Engagement rate:</strong> ${formatPercent(summary.engagementRate)}</li>
      <li><strong>Bounce rate:</strong> ${formatPercent(summary.bounceRate)}</li>
    </ul>

    <h3>Top pages</h3>
    ${listHtml(siteKpis.topPages ?? [], (item) => {
      const title = item.dimensions.pageTitle && item.dimensions.pageTitle !== '(not set)' ? ` (${item.dimensions.pageTitle})` : '';
      return `${escapeHtml(item.dimensions.pagePath)}${escapeHtml(title)} — <strong>${formatInteger(item.metrics.screenPageViews)}</strong> views, ${formatInteger(item.metrics.sessions)} sessions`;
    })}

    <h3>Traffic sources / channels</h3>
    ${listHtml(siteKpis.trafficSources ?? [], (item) => {
      return `${escapeHtml(item.dimensions.sessionDefaultChannelGroup)} — ${escapeHtml(item.dimensions.sessionSourceMedium)}: <strong>${formatInteger(item.metrics.sessions)}</strong> sessions, ${formatPercent(item.metrics.engagementRate)} engagement`;
    })}

    <h3>Country / region distribution</h3>
    ${listHtml(siteKpis.countries ?? [], (item) => {
      const region = item.dimensions.region && item.dimensions.region !== '(not set)' ? ` / ${item.dimensions.region}` : '';
      return `${escapeHtml(item.dimensions.country)}${escapeHtml(region)} — <strong>${formatInteger(item.metrics.activeUsers)}</strong> active users, ${formatInteger(item.metrics.sessions)} sessions`;
    })}
  `;
}

function intentRollupHtml(intentRollups) {
  if (intentRollups?.available) return '';

  const reasons = [intentRollups?.internalError, intentRollups?.publicError].filter(Boolean);
  const detail = reasons.length ? ` ${escapeHtml(Array.from(new Set(reasons)).join(' '))}` : '';

  return `<p><strong>Intent rollup data unavailable.</strong> Apply <code>docs/supabase-intent-analytics.sql</code> in Supabase to enable thresholded topic and regional insights.${detail}</p>`;
}

function reportHtml(report) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Deeper Global Intent Report</title>
  </head>
  <body style="font-family: Arial, sans-serif; color: #191716; line-height: 1.5;">
    <h1>Deeper Global intent report</h1>
    <p>Window: last ${report.windowDays} days, starting ${escapeHtml(report.sinceDate)}.</p>
    <p>This report uses thresholded aggregate rollups only. It does not include raw searches or user-level data.</p>

    <h2>Site KPIs</h2>
    ${siteKpiHtml(report.siteKpis)}

    ${intentRollupHtml(report.intentRollups)}

    <h2>Top searched topics</h2>
    ${listHtml(report.topSearchTopics, (item) => `${escapeHtml(item.key)} — <strong>${item.count}</strong> searches`)}

    <h2>Top searched topics by region</h2>
    ${listHtml(report.topSearchRegions, (item) => {
      const [category, country, state] = splitKey(item.key);
      return `${escapeHtml(category)} — ${escapeHtml(country)}${state ? ` / ${escapeHtml(state)}` : ''}: <strong>${item.count}</strong>`;
    })}

    <h2>No-result searches</h2>
    ${listHtml(report.noResultSearches, (item) => {
      const [category, country] = splitKey(item.key);
      return `${escapeHtml(category)} — ${escapeHtml(country)}: <strong>${item.count}</strong>`;
    })}

    <h2>Care-navigation demand</h2>
    ${listHtml(report.careNavigationRegions, (item) => {
      const [category, country, state] = splitKey(item.key);
      return `${escapeHtml(category)} — ${escapeHtml(country)}${state ? ` / ${escapeHtml(state)}` : ''}: <strong>${item.count}</strong>`;
    })}

    <h2>Safety-sensitive aggregate signals</h2>
    ${listHtml(report.safetySignals, (item) => `${escapeHtml(item.key)} — <strong>${item.count}</strong> events`)}

    <p style="color: #6b675f; font-size: 13px;">
      Internal planning use only. Public reporting should use public-safe rollups and editorial approval.
      Rollup rows read: internal ${report.rawRollupRows.internal}, public ${report.rawRollupRows.public}.
    </p>
  </body>
</html>`;
}

function reportText(report) {
  const siteKpis = report.siteKpis;
  const siteKpiLines = siteKpis?.available
    ? [
        'Site KPIs:',
        ...(siteKpis.hostnames?.length ? [`- Host filter: ${siteKpis.hostnames.join(', ')}`] : []),
        `- Active users: ${formatInteger(siteKpis.summary?.activeUsers)}`,
        `- Total users: ${formatInteger(siteKpis.summary?.totalUsers)}`,
        `- Sessions: ${formatInteger(siteKpis.summary?.sessions)}`,
        `- Page/screen views: ${formatInteger(siteKpis.summary?.screenPageViews)}`,
        `- Avg. engagement time per active user: ${formatDuration(averageEngagementSeconds(siteKpis.summary))}`,
        `- Engagement rate: ${formatPercent(siteKpis.summary?.engagementRate)}`,
        `- Bounce rate: ${formatPercent(siteKpis.summary?.bounceRate)}`,
        '',
        'Top pages:',
        ...(siteKpis.topPages ?? []).map(
          (item) => `- ${item.dimensions.pagePath}: ${formatInteger(item.metrics.screenPageViews)} views, ${formatInteger(item.metrics.sessions)} sessions`
        ),
        '',
        'Traffic sources / channels:',
        ...(siteKpis.trafficSources ?? []).map(
          (item) =>
            `- ${item.dimensions.sessionDefaultChannelGroup} / ${item.dimensions.sessionSourceMedium}: ${formatInteger(item.metrics.sessions)} sessions`
        ),
        '',
        'Country / region distribution:',
        ...(siteKpis.countries ?? []).map((item) => {
          const region = item.dimensions.region && item.dimensions.region !== '(not set)' ? ` / ${item.dimensions.region}` : '';
          return `- ${item.dimensions.country}${region}: ${formatInteger(item.metrics.activeUsers)} active users`;
        }),
      ]
    : [
        'Site KPIs:',
        ...(siteKpis?.hostnames?.length ? [`- Host filter: ${siteKpis.hostnames.join(', ')}`] : []),
        `- Site KPI data unavailable: ${siteKpis?.reason ?? 'GA4 was not configured or returned no data.'}`,
      ];

  const lines = [
    'Deeper Global intent report',
    `Window: last ${report.windowDays} days, starting ${report.sinceDate}.`,
    'Uses thresholded aggregate rollups only.',
    '',
    ...siteKpiLines,
    '',
    ...(report.intentRollups?.available
      ? []
      : [
          'Intent rollups:',
          '- Intent rollup data unavailable. Apply docs/supabase-intent-analytics.sql in Supabase to enable thresholded topic and regional insights.',
          '',
        ]),
    'Top searched topics:',
    ...report.topSearchTopics.map((item) => `- ${item.key}: ${item.count}`),
    '',
    'No-result searches:',
    ...report.noResultSearches.map((item) => `- ${item.key.replaceAll('||', ' / ')}: ${item.count}`),
    '',
    'Care-navigation demand:',
    ...report.careNavigationRegions.map((item) => `- ${item.key.replaceAll('||', ' / ')}: ${item.count}`),
  ];

  return lines.join('\n');
}

async function sendEmail(report) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = cleanText(process.env.REPORT_EMAIL_FROM);
  const to = cleanText(process.env.REPORT_EMAIL_TO, DEFAULT_REPORT_TO);

  if (!apiKey) throw new Error('Missing RESEND_API_KEY.');
  if (!from) throw new Error('Missing REPORT_EMAIL_FROM.');

  const subject = `Deeper Global intent report — ${new Date().toISOString().slice(0, 10)}`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `intent-report/${new Date().toISOString().slice(0, 10)}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html: reportHtml(report),
      text: reportText(report),
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Resend send failed: ${payload?.message ?? response.statusText}`);
  }

  return payload;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const sinceDate = isoDateDaysAgo(REPORT_WINDOW_DAYS);
    const [internalRollups, publicRollups, siteKpis] = await Promise.all([
      fetchRollupsSafe('intent_internal_daily_rollups', sinceDate),
      fetchRollupsSafe('intent_public_macro_rollups', sinceDate),
      fetchSiteKpis(sinceDate),
    ]);
    const intentRollups = {
      available: !internalRollups.error && !publicRollups.error,
      internalError: internalRollups.error,
      publicError: publicRollups.error,
    };
    const report = buildReport({
      internalRows: internalRollups.rows,
      publicRows: publicRollups.rows,
      sinceDate,
      siteKpis,
      intentRollups,
    });

    if (req.query?.dryRun === '1') {
      return res.status(200).json({ mode: 'dry-run', report });
    }

    const email = await sendEmail(report);
    return res.status(202).json({ accepted: true, email_id: email?.id ?? email?.data?.id ?? null });
  } catch (error) {
    console.error('intent_report_email_error', error);
    return res.status(500).json({ error: 'report_failed', message: error.message });
  }
}
