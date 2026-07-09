/**
 * Vercel Cron: keep the @deeperglobal publish queue stocked.
 *
 * When approved posts drop below the minimum threshold, requeue failed posts
 * and generate new approved drafts spaced 6 hours apart.
 *
 * Auth: CRON_SECRET (Vercel injects Authorization header on scheduled runs).
 * Query params: dryRun=1, force=1
 */
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '../../scripts/lib/admin-auth.mjs';
import {
  refillSocialQueue,
  SOCIAL_QUEUE_MIN_APPROVED,
  SOCIAL_QUEUE_TARGET_APPROVED,
} from '../../scripts/lib/social-queue-refill.mjs';

function queryFlag(value) {
  return value === '1' || value === 'true';
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

  const dryRun = queryFlag(req.query?.dryRun);
  const force = queryFlag(req.query?.force);

  const url = (process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? '').trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
  const anthropicApiKey = (process.env.ANTHROPIC_API_KEY ?? '').trim();

  if (!url || !serviceRoleKey) {
    return res.status(500).json({
      error: 'missing_supabase_credentials',
      message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in Vercel production.',
    });
  }

  if (!anthropicApiKey) {
    return res.status(500).json({
      error: 'missing_anthropic_api_key',
      message: 'ANTHROPIC_API_KEY must be set in Vercel production.',
    });
  }

  try {
    const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
    const report = await refillSocialQueue({
      supabase,
      anthropicApiKey,
      targetCount: SOCIAL_QUEUE_TARGET_APPROVED,
      minThreshold: SOCIAL_QUEUE_MIN_APPROVED,
      dryRun,
      force,
      logger: console,
    });

    return res.status(200).json({
      ...report,
      dryRun,
      force,
      min_threshold: SOCIAL_QUEUE_MIN_APPROVED,
      target_count: SOCIAL_QUEUE_TARGET_APPROVED,
      triggered_by: req.headers['user-agent'] ?? null,
    });
  } catch (error) {
    console.error('refill_social_queue_failed', error);
    return res.status(500).json({
      error: 'refill_social_queue_failed',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
