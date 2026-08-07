import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized, readJsonBody, cleanText } from '../../scripts/lib/admin-auth.mjs';
import {
  loadApplyPackages,
  runClinicalAttributionApply,
} from '../../scripts/lib/reviewers/apply-clinical-attribution.mjs';

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
    const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

    let high = body.high;
    let editorial = body.editorial;

    if (!high?.rows?.length || !editorial?.rows?.length) {
      if (!body.use_server_package) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            error: 'Request must include high and editorial apply packages (or use_server_package).',
          })
        );
        return;
      }
      const packages = loadApplyPackages({ root: process.cwd() });
      high = packages.high;
      editorial = packages.editorial;
    }

    const report = await runClinicalAttributionApply({
      supabase,
      apply,
      root: process.cwd(),
      highPackage: high,
      editorialPackage: editorial,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ...report, apply_path: 'remote_admin' }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message ?? String(error) }));
  }
}
