import http from 'node:http';

const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const METADATA_TOKEN_URL = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token?scopes=${encodeURIComponent(GSC_SCOPE)}`;
const DEFAULT_SITE_URL = 'sc-domain:deeper.global';
const MAX_ROW_LIMIT = 25000;
const PORT = Number(process.env.PORT || 8080);

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(cleanText(value));
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 32_768) {
      throw new Error('Request body too large.');
    }
    chunks.push(chunk);
  }

  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function fetchAccessToken() {
  const response = await fetch(METADATA_TOKEN_URL, {
    headers: { 'Metadata-Flavor': 'Google' },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.access_token) {
    throw new Error(`Metadata token request failed: ${payload.error_description ?? payload.error ?? response.statusText}`);
  }

  return payload.access_token;
}

async function querySearchConsole({ accessToken, siteUrl, startDate, endDate, dimensions, rowLimit, startRow, dataState }) {
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
        dataState,
      }),
    }
  );
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? response.statusText);
  }

  return payload;
}

async function handleQuery(req, res) {
  const expectedSecret = cleanText(process.env.GSC_PROXY_SECRET);
  const authorization = cleanText(req.headers.authorization);

  if (!expectedSecret) {
    return sendJson(res, 500, { ok: false, error: 'Proxy secret is not configured.' });
  }

  if (authorization !== `Bearer ${expectedSecret}`) {
    return sendJson(res, 401, { ok: false, error: 'Unauthorized.' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { ok: false, error: 'Invalid JSON request body.' });
  }

  const siteUrl = cleanText(body.siteUrl) || DEFAULT_SITE_URL;
  const startDate = cleanText(body.startDate);
  const endDate = cleanText(body.endDate);
  const dimensions = Array.isArray(body.dimensions) ? body.dimensions.map(cleanText).filter(Boolean) : [];
  const rowLimit = Math.min(Math.max(Number(body.rowLimit || 1000), 1), MAX_ROW_LIMIT);
  const startRow = Math.max(Number(body.startRow || 0), 0);
  const dataState = cleanText(body.dataState) || 'final';

  if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
    return sendJson(res, 400, { ok: false, error: 'startDate and endDate must use YYYY-MM-DD format.' });
  }

  try {
    const accessToken = await fetchAccessToken();
    const payload = await querySearchConsole({
      accessToken,
      siteUrl,
      startDate,
      endDate,
      dimensions,
      rowLimit,
      startRow,
      dataState,
    });

    return sendJson(res, 200, {
      ok: true,
      source: 'Google Search Console API',
      siteUrl,
      rows: payload.rows ?? [],
      responseAggregationType: payload.responseAggregationType,
    });
  } catch (error) {
    return sendJson(res, 502, { ok: false, error: error.message });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/healthz') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'POST' && (req.url === '/' || req.url === '/query')) {
    return handleQuery(req, res);
  }

  return sendJson(res, 404, { ok: false, error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`GSC proxy listening on ${PORT}`);
});
