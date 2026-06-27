import { isAdminAuthorized } from '../../scripts/lib/admin-auth.mjs';
import { buildEnvHealthReport } from '../../scripts/lib/env-health.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  if (!isAdminAuthorized(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized.' }));
    return;
  }

  const report = buildEnvHealthReport();
  res.statusCode = report.ok ? 200 : 503;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(report));
}
