/**
 * Vercel Cron: run visit-priority content pipeline.
 *
 * Auth: CRON_SECRET (Vercel injects Authorization header on scheduled/manual cron runs).
 * Query: apply=1 to insert + rewrite; omit for dry-run.
 */
import { isAdminAuthorized, cleanText } from '../../scripts/lib/admin-auth.mjs';
import { runVisitPriorityPipeline } from '../../scripts/lib/visit-priority-pipeline.mjs';

export const dynamic = 'force-dynamic';

function queryFlag(value) {
  return value === '1' || value === 'true';
}

function shouldApply(req) {
  if (queryFlag(req.query?.apply)) return true;
  if (req.query?.apply === '0' || req.query?.apply === 'false') return false;
  const userAgent = cleanText(req.headers['user-agent']);
  return userAgent.startsWith('vercel-cron/');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const serviceRoleKey = cleanText(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const url = cleanText(process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL);
  if (!url || !serviceRoleKey) {
    return res.status(500).json({
      error: 'missing_supabase_credentials',
      message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in Vercel production.',
    });
  }

  if (!cleanText(process.env.ANTHROPIC_API_KEY)) {
    return res.status(500).json({
      error: 'missing_anthropic_api_key',
      message: 'ANTHROPIC_API_KEY must be set in Vercel production for rewrite lane.',
    });
  }

  try {
    const apply = shouldApply(req);
    const rewriteOnlyUnstaged = queryFlag(req.query?.rewrite_only_unstaged);

    const report = await runVisitPriorityPipeline({
      apply,
      rewriteOnlyUnstaged,
    });

    return res.status(200).json({
      ...report,
      apply_path: 'vercel-cron',
      triggered_by: req.headers['user-agent'] ?? null,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'visit_priority_pipeline_failed',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
