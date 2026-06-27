export function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

export function resolveAdminSecret() {
  return cleanText(process.env.CRON_SECRET ?? process.env.REPORT_CRON_SECRET);
}

export function isAdminAuthorized(req) {
  const secret = resolveAdminSecret();
  if (!secret) return false;

  const authHeader = req.headers?.authorization ?? req.headers?.Authorization;
  const headerSecret = req.headers?.['x-report-secret'] ?? req.headers?.['x-cron-secret'];
  const querySecret = req.query?.secret;

  return authHeader === `Bearer ${secret}` || headerSecret === secret || querySecret === secret;
}

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}
