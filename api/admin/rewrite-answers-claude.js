import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized, readJsonBody, cleanText } from '../../scripts/lib/admin-auth.mjs';
import { runAnswerRewrite, loadRewriteSlugsFromPayload } from '../../scripts/lib/answer-rewrite-runner.mjs';

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

  if (!cleanText(process.env.ANTHROPIC_API_KEY)) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY in Vercel Production environment.' }));
    return;
  }

  try {
    const body = await readJsonBody(req);
    const apply = Boolean(body.apply);
    const onlyUnstaged = body.onlyUnstaged !== false;
    const slugs = Array.isArray(body.slugs)
      ? body.slugs.map((slug) => cleanText(slug)).filter(Boolean)
      : loadRewriteSlugsFromPayload(body);

    if (!slugs.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Request body must include slugs or a slugs file payload.' }));
      return;
    }

    const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
    const report = await runAnswerRewrite({
      supabase,
      slugs,
      apply,
      onlyUnstaged,
    });

    res.statusCode = 200;
    res.end(JSON.stringify({ ...report, apply_path: 'remote-admin' }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message ?? 'Answer rewrite failed.' }));
  }
}
