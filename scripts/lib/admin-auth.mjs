export function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

export function resolveAdminSecret() {
  return cleanText(process.env.CRON_SECRET ?? process.env.REPORT_CRON_SECRET);
}

export function resolveAdminPassphrase() {
  return cleanText(process.env.ADMIN_PASSPHRASE);
}

function readBearerToken(req) {
  const authHeader = req.headers?.authorization ?? req.headers?.Authorization;
  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return '';
  }
  return authHeader.slice('Bearer '.length);
}

/** Machine-to-machine admin auth (cron secret). Used by scheduled jobs and GitHub Actions. */
export function isCronAuthorized(req) {
  const secret = resolveAdminSecret();
  if (!secret) return false;

  const authHeader = req.headers?.authorization ?? req.headers?.Authorization;
  const headerSecret = req.headers?.['x-report-secret'] ?? req.headers?.['x-cron-secret'];
  const querySecret = req.query?.secret;

  return authHeader === `Bearer ${secret}` || headerSecret === secret || querySecret === secret;
}

/** Human console auth only. Separate from CRON_SECRET so automation keys cannot unlock /admin/. */
export function isConsolePassphraseAuthorized(req) {
  const passphrase = resolveAdminPassphrase();
  if (!passphrase) return false;
  return readBearerToken(req) === passphrase;
}

/** Cron-only gate for admin API routes (default). */
export function isAdminAuthorized(req) {
  return isCronAuthorized(req);
}

/** Cron or console passphrase (for routes the /admin/ UI calls after unlock). */
export function isAdminOrConsoleAuthorized(req) {
  return isCronAuthorized(req) || isConsolePassphraseAuthorized(req);
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
