import { createClient } from '@supabase/supabase-js';
import { isBearerAuthorized, readJsonBody, cleanText } from '../../scripts/lib/admin-auth.mjs';
import {
  fetchAllQuestionsCompact,
  planDuplicateFixFromRows,
  applyDuplicateFix,
} from '../../scripts/lib/duplicate-slug-fixer.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
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
    const body = await readJsonBody(req);
    const apply = Boolean(body.apply);
    const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

    const rows = await fetchAllQuestionsCompact(supabase);
    const plan = planDuplicateFixFromRows(rows);

    let applied = [];
    if (apply && plan.patches.length) {
      applied = await applyDuplicateFix(supabase, plan.patches);
    }

    const report = {
      generated_at: new Date().toISOString(),
      mode: apply ? 'apply' : 'dry-run',
      duplicates: plan.duplicates,
      backup_rows: plan.backup_rows,
      patches: apply ? undefined : plan.patches,
      resolutions: plan.resolutions,
      apply_results: apply ? applied : undefined,
      apply_path: 'remote_admin',
    };

    // If apply mode had any failures, return non-2xx to surface partial apply
    if (apply && applied.some((r) => r.status === 'failed')) {
      res.statusCode = 500;
    } else {
      res.statusCode = 200;
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(report));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message ?? String(error) }));
  }
}

