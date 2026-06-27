import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized, readJsonBody, cleanText } from '../../scripts/lib/admin-auth.mjs';
import { publishPhase1bDrafts } from '../../scripts/lib/publish-phase-1b.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  if (!isAdminAuthorized(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized.' }));
    return;
  }

  const serviceRoleKey = cleanText(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const url = cleanText(process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL);
  if (!url || !serviceRoleKey) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel Production environment.',
      })
    );
    return;
  }

  try {
    const body = await readJsonBody(req);
    const apply = Boolean(body.apply);
    const campaign = cleanText(body.campaign) || 'phase-1b';
    const skipExisting = body.skipExisting !== false;
    const drafts = Array.isArray(body.drafts) ? body.drafts : [];

    if (!drafts.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Request body must include a non-empty drafts array.' }));
      return;
    }

    const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
    const report = await publishPhase1bDrafts({
      supabase,
      drafts,
      campaign,
      apply,
      skipExisting,
    });

    res.statusCode = 200;
    res.end(JSON.stringify({ ...report, apply_path: 'remote-admin' }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message ?? 'Publish phase-1b drafts failed.' }));
  }
}
