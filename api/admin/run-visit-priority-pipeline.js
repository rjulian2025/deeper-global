import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { isAdminOrConsoleAuthorized, readJsonBody, cleanText } from '../../scripts/lib/admin-auth.mjs';
import { runVisitPriorityPipeline, VISIT_PRIORITY_MANIFEST } from '../../scripts/lib/visit-priority-pipeline.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  if (!isAdminOrConsoleAuthorized(req)) {
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
    const rewriteOnlyUnstaged = body.rewriteOnlyUnstaged === true;

    const rootDir = process.cwd();
    const manifest = {
      ...VISIT_PRIORITY_MANIFEST,
      draftsPath: cleanText(body.draftsPath) || VISIT_PRIORITY_MANIFEST.draftsPath,
      rewriteSlugsPath: cleanText(body.rewriteSlugsPath) || VISIT_PRIORITY_MANIFEST.rewriteSlugsPath,
    };

    const report = await runVisitPriorityPipeline({
      apply,
      rootDir,
      manifest,
      rewriteOnlyUnstaged,
    });

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        ...report,
        apply_path: 'remote-admin',
        manifest: {
          draftsPath: manifest.draftsPath,
          rewriteSlugsPath: manifest.rewriteSlugsPath,
          drafts_count: JSON.parse(readFileSync(join(rootDir, manifest.draftsPath), 'utf8')).length,
        },
      })
    );
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message ?? 'Visit priority pipeline failed.' }));
  }
}
