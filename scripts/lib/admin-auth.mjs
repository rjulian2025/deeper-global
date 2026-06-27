export function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

export function resolveAdminSecret() {
  return cleanText(process.env.CRON_SECRET ?? process.env.REPORT_CRON_SECRET);
}

export function resolveAdminPassphrase() {
  return cleanText(process.env.ADMIN_PASSPHRASE);
}

export function isAdminAuthorized(req) {
  const secret = resolveAdminSecret();
  const passphrase = resolveAdminPassphrase();

  const authHeader = req.headers?.authorization ?? req.headers?.Authorization;
  const headerSecret = req.headers?.['x-report-secret'] ?? req.headers?.['x-cron-secret'];
  const querySecret = req.query?.secret;

  const bearer = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : '';

  const matchesCron =
    Boolean(secret) &&
    (authHeader === `Bearer ${secret}` || headerSecret === secret || querySecret === secret);

  const matchesPassphrase = Boolean(passphrase) && bearer === passphrase;

  return matchesCron || matchesPassphrase;
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
