import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import {
  buildWeeklyContentPlan,
  planEmailHtml,
  planEmailText,
} from '../../scripts/lib/gsc-content-plan.mjs';

const DEFAULT_REPORT_TO = 'rjulian@qvbrands.com';

function cleanText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET ?? process.env.REPORT_CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.authorization ?? req.headers.Authorization;
  const headerSecret = req.headers['x-report-secret'];
  const querySecret = req.query?.secret;

  return authHeader === `Bearer ${secret}` || headerSecret === secret || querySecret === secret;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { url, key };
}

function emailPayloadHash(payload) {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 16);
}

async function sendEmail(plan) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = cleanText(process.env.REPORT_EMAIL_FROM);
  const to = cleanText(process.env.CONTENT_OPS_EMAIL_TO, cleanText(process.env.REPORT_EMAIL_TO, DEFAULT_REPORT_TO));

  if (!apiKey) throw new Error('Missing RESEND_API_KEY.');
  if (!from) throw new Error('Missing REPORT_EMAIL_FROM.');

  const date = new Date().toISOString().slice(0, 10);
  const subject = `Deeper Global content ops — ${date}`;
  const payload = {
    from,
    to: [to],
    subject,
    html: planEmailHtml(plan),
    text: planEmailText(plan),
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `content-ops/${date}/${emailPayloadHash(payload)}`,
    },
    body: JSON.stringify(payload),
  });

  const resendPayload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Resend send failed: ${resendPayload?.message ?? response.statusText}`);
  }

  return resendPayload;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const { url, key } = supabaseConfig();
  if (!url || !key) {
    return res.status(500).json({ error: 'Missing Supabase report credentials.' });
  }

  try {
    const mode = cleanText(process.env.CONTENT_OPS_MODE, 'recommend');
    const client = createClient(url, key, { auth: { persistSession: false } });
    const plan = await buildWeeklyContentPlan({
      supabaseClient: client,
      mode: mode === 'auto-stage' ? 'auto-stage' : 'recommend',
      includeQueryGaps: true,
    });

    const email = await sendEmail(plan);

    return res.status(202).json({
      accepted: true,
      email_id: email?.id ?? email?.data?.id ?? null,
      gsc_available: plan.gsc.available,
      recommended: plan.summary.recommended_count,
      confident: plan.summary.confident_count,
      auto_stage: plan.summary.auto_stage_count,
      mode: plan.mode,
      api_citation_events: plan.api_citation?.total_events ?? 0,
    });
  } catch (error) {
    console.error('content_ops_email_error', error);
    return res.status(500).json({ error: error.message ?? 'Content ops email failed.' });
  }
}
