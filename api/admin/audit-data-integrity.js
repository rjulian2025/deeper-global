import { createClient } from '@supabase/supabase-js';
import { isBearerAuthorized, cleanText } from '../../scripts/lib/admin-auth.mjs';
import { runDataIntegrityAudit } from '../../scripts/lib/data-integrity-audit.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  if (!isBearerAuthorized(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized.' }));
    return;
  }

  const serviceRoleKey = cleanText(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const url = cleanText(process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL);
  if (!url || !serviceRoleKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel Production environment.' }));
    return;
  }

  try {
    const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
    // Reset global critical capture per invocation
    globalThis.__CRITICAL_DETAILS__ = [];
    const report = await runDataIntegrityAudit(supabase);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(report));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message ?? String(error) }));
  }
}

