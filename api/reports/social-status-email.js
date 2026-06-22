/**
 * @deeperglobal X pipeline status report — Monday & Friday email.
 *
 * Checks pipeline health, posts published since the last report, upcoming
 * schedule, queue depth, and any failures. Sends to REPORT_EMAIL_TO via Resend.
 *
 * Authorization: same CRON_SECRET used by other cron endpoints.
 * Vercel calls this with Bearer <CRON_SECRET> automatically.
 *
 * Query params:
 *   dryRun=1  — returns JSON report, no email sent
 */

const DEFAULT_REPORT_TO = 'rjulian@qvbrands.com';
const SITE_URL = 'https://deeper.global';
const X_HANDLE = '@deeperglobal';
const X_PROFILE_URL = 'https://twitter.com/deeperglobal';

/** Window shown in the "recently published" section (days). */
const PUBLISHED_WINDOW_DAYS = 7;

/** Posts shown in the upcoming queue preview. */
const QUEUE_PREVIEW_COUNT = 14;

/** Flag as stale if no post published in this many hours when there should have been one. */
const FRESHNESS_WARN_HOURS = 30;

// ── Auth ─────────────────────────────────────────────────────────────────────

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET ?? process.env.REPORT_CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.authorization ?? req.headers.Authorization;
  const header = req.headers['x-cron-secret'] ?? req.headers['x-report-secret'];
  const query = req.query?.secret;
  return auth === `Bearer ${secret}` || header === secret || query === secret;
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

function supabaseConfig() {
  const url =
    process.env.SUPABASE_URL ??
    process.env.PUBLIC_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, key };
}

async function supabaseQuery(path, params = {}) {
  const { url, key } = supabaseConfig();
  if (!url || !key) throw new Error('Missing Supabase credentials.');
  const search = new URLSearchParams(params).toString();
  const response = await fetch(`${url}/rest/v1/${path}${search ? `?${search}` : ''}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=representation' },
  });
  if (!response.ok) throw new Error(`Supabase ${path} failed: ${await response.text()}`);
  return response.json();
}

// ── Data fetch ────────────────────────────────────────────────────────────────

async function fetchPipelineData() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - PUBLISHED_WINDOW_DAYS);
  const sinceIso = since.toISOString();

  const now = new Date().toISOString();

  const [recentlyPublished, recentlyFailed, upcomingQueue, totalApproved] = await Promise.all([
    // Posts published in the last 7 days
    supabaseQuery('social_posts', {
      select: 'id,format,body,x_post_id,published_at,question_id',
      status: 'eq.published',
      published_at: `gte.${sinceIso}`,
      order: 'published_at.desc',
      limit: 50,
    }),
    // Posts that have failed
    supabaseQuery('social_posts', {
      select: 'id,format,body,status,updated_at,question_id',
      status: 'eq.failed',
      order: 'updated_at.desc',
      limit: 20,
    }),
    // Next N approved posts in queue
    supabaseQuery('social_posts', {
      select: 'id,format,body,scheduled_for,question_id',
      status: 'eq.approved',
      'x_post_id': 'is.null',
      order: 'scheduled_for.asc.nullsfirst',
      limit: QUEUE_PREVIEW_COUNT,
    }),
    // Total approved count
    supabaseQuery('social_posts', {
      select: 'id',
      status: 'eq.approved',
      'x_post_id': 'is.null',
      limit: 500,
    }),
  ]);

  // Pipeline freshness check
  const lastPublished = recentlyPublished[0] ?? null;
  const lastPublishedAt = lastPublished?.published_at ? new Date(lastPublished.published_at) : null;
  const hoursSinceLast = lastPublishedAt
    ? (Date.now() - lastPublishedAt.getTime()) / (1000 * 60 * 60)
    : Infinity;

  // Queue runway — when does the approved supply run out?
  const queueCount = Array.isArray(totalApproved) ? totalApproved.length : 0;
  const lastScheduled =
    Array.isArray(upcomingQueue) && upcomingQueue.length > 0
      ? upcomingQueue.at(-1)?.scheduled_for
      : null;
  const lastApprovedQueue = [...(Array.isArray(totalApproved) ? totalApproved : [])];
  // Get the latest scheduled_for from all approved posts
  const approvedWithSchedule = await supabaseQuery('social_posts', {
    select: 'scheduled_for',
    status: 'eq.approved',
    'x_post_id': 'is.null',
    order: 'scheduled_for.desc.nullslast',
    limit: 1,
  });
  const queueRunsUntil = approvedWithSchedule[0]?.scheduled_for ?? null;

  const pipelineHealthy =
    hoursSinceLast < FRESHNESS_WARN_HOURS &&
    recentlyFailed.length === 0 &&
    queueCount > 0;

  return {
    generatedAt: new Date().toISOString(),
    pipelineHealthy,
    hoursSinceLast: Math.round(hoursSinceLast),
    lastPublishedAt: lastPublishedAt?.toISOString() ?? null,
    recentlyPublished: Array.isArray(recentlyPublished) ? recentlyPublished : [],
    recentlyFailed: Array.isArray(recentlyFailed) ? recentlyFailed : [],
    upcomingQueue: Array.isArray(upcomingQueue) ? upcomingQueue : [],
    queueCount,
    queueRunsUntil,
  };
}

// ── Formatting helpers ────────────────────────────────────────────────────────

function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fmtDate(iso) {
  if (!iso) return 'unknown';
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

function fmtShortDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function tweetLink(xPostId) {
  if (!xPostId) return null;
  return `https://twitter.com/${X_HANDLE.replace('@', '')}/status/${xPostId}`;
}

function truncate(text, max = 120) {
  const t = String(text ?? '').trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function formatPostFormat(format) {
  const labels = {
    question_only: 'Question',
    question_insight: 'Insight',
    reflection: 'Reflection',
  };
  return labels[format] ?? format;
}

// ── HTML email ────────────────────────────────────────────────────────────────

function buildEmailHtml(data) {
  const statusColor = data.pipelineHealthy ? '#16a34a' : '#dc2626';
  const statusLabel = data.pipelineHealthy ? '✅ Healthy' : '⚠️ Needs attention';
  const statusBg = data.pipelineHealthy ? '#f0fdf4' : '#fef2f2';
  const borderColor = data.pipelineHealthy ? '#86efac' : '#fca5a5';

  const todayLabel = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Recently published section
  const publishedRows = data.recentlyPublished.length === 0
    ? '<tr><td colspan="3" style="padding:10px 0;color:#6b7280;font-style:italic;">No posts published in the last 7 days.</td></tr>'
    : data.recentlyPublished.map((p) => {
        const link = tweetLink(p.x_post_id);
        const bodyText = esc(truncate(p.body, 100));
        return `<tr style="border-bottom:1px solid #f3f4f6;">
          <td style="padding:8px 12px 8px 0;color:#6b7280;white-space:nowrap;font-size:13px;">${esc(fmtShortDate(p.published_at))}</td>
          <td style="padding:8px 12px;font-size:13px;"><span style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:600;">${esc(formatPostFormat(p.format))}</span></td>
          <td style="padding:8px 0;font-size:13px;">${bodyText}${link ? ` <a href="${esc(link)}" style="color:#1d9bf0;font-size:11px;text-decoration:none;">[tweet]</a>` : ''}</td>
        </tr>`;
      }).join('');

  // Upcoming queue section
  const queueRows = data.upcomingQueue.length === 0
    ? '<tr><td colspan="3" style="padding:10px 0;color:#dc2626;font-style:italic;">No posts in queue — refill needed.</td></tr>'
    : data.upcomingQueue.map((p) => `<tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:8px 12px 8px 0;color:#6b7280;white-space:nowrap;font-size:13px;">${esc(fmtShortDate(p.scheduled_for))}</td>
        <td style="padding:8px 12px;font-size:13px;"><span style="background:#f3f4f6;color:#374151;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:600;">${esc(formatPostFormat(p.format))}</span></td>
        <td style="padding:8px 0;font-size:13px;color:#374151;">${esc(truncate(p.body, 100))}</td>
      </tr>`).join('');

  // Failures section
  const failureSection = data.recentlyFailed.length === 0 ? '' : `
    <h2 style="font-size:16px;font-weight:600;color:#dc2626;margin:28px 0 10px;">⚠️ Failed posts (${data.recentlyFailed.length})</h2>
    <p style="font-size:13px;color:#6b7280;margin:0 0 12px;">These posts could not be published. Review and re-approve or delete in Supabase.</p>
    <table style="width:100%;border-collapse:collapse;">
      ${data.recentlyFailed.map((p) => `<tr style="border-bottom:1px solid #fee2e2;">
        <td style="padding:8px 12px 8px 0;color:#6b7280;white-space:nowrap;font-size:13px;">${esc(fmtShortDate(p.updated_at))}</td>
        <td style="padding:8px 0;font-size:13px;color:#374151;">${esc(truncate(p.body, 120))}</td>
      </tr>`).join('')}
    </table>`;

  // Queue runway
  const queueRunsUntilFmt = data.queueRunsUntil
    ? new Date(data.queueRunsUntil).toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'long', day: 'numeric', year: 'numeric' })
    : 'unknown';

  const queueWarning = data.queueCount < 7
    ? `<p style="background:#fef9c3;border:1px solid #fde047;border-radius:6px;padding:10px 14px;font-size:13px;margin:12px 0 0;"><strong>⚠️ Low queue:</strong> Only ${data.queueCount} post${data.queueCount === 1 ? '' : 's'} remaining. Run <code>generate-30day-batch.mjs --apply</code> and <code>approve-social-batch.mjs --apply</code> to refill.</p>`
    : '';

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>@deeperglobal Social Status</title></head>
<body style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;max-width:680px;margin:0 auto;padding:24px 16px;">

  <p style="color:#6b7280;font-size:13px;margin:0 0 16px;">${esc(todayLabel)}</p>

  <h1 style="font-size:22px;font-weight:700;margin:0 0 4px;">
    <a href="${esc(X_PROFILE_URL)}" style="color:#111827;text-decoration:none;">${esc(X_HANDLE)}</a> — Social pipeline status
  </h1>
  <p style="font-size:14px;color:#6b7280;margin:0 0 20px;">Deeper Global · <a href="${esc(SITE_URL)}" style="color:#6b7280;">${esc(SITE_URL)}</a></p>

  <!-- Status banner -->
  <div style="background:${statusBg};border:1px solid ${borderColor};border-radius:8px;padding:14px 18px;margin-bottom:24px;">
    <span style="font-size:15px;font-weight:700;color:${statusColor};">${statusLabel}</span>
    <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#374151;">
      <li>Last published: ${data.lastPublishedAt ? `<strong>${esc(fmtDate(data.lastPublishedAt))}</strong> (${data.hoursSinceLast}h ago)` : '<strong style="color:#dc2626;">No recent posts found</strong>'}</li>
      <li>Approved posts in queue: <strong>${data.queueCount}</strong></li>
      <li>Queue runs until: <strong>${esc(queueRunsUntilFmt)}</strong></li>
      <li>Failed posts: <strong style="color:${data.recentlyFailed.length > 0 ? '#dc2626' : 'inherit'}">${data.recentlyFailed.length}</strong></li>
    </ul>
  </div>

  <!-- Published section -->
  <h2 style="font-size:16px;font-weight:600;margin:0 0 10px;">Posts published — last 7 days (${data.recentlyPublished.length})</h2>
  <table style="width:100%;border-collapse:collapse;">
    ${publishedRows}
  </table>

  ${failureSection}

  <!-- Upcoming queue -->
  <h2 style="font-size:16px;font-weight:600;margin:28px 0 10px;">Upcoming queue — next ${data.upcomingQueue.length} posts</h2>
  <table style="width:100%;border-collapse:collapse;">
    ${queueRows}
  </table>
  ${queueWarning}

  <!-- Footer -->
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px;">
  <p style="font-size:12px;color:#9ca3af;margin:0;">
    Automated status report · Deeper Global social pipeline ·
    <a href="${esc(SITE_URL)}" style="color:#9ca3af;">deeper.global</a>
  </p>

</body>
</html>`;
}

// ── Plain text fallback ───────────────────────────────────────────────────────

function buildEmailText(data) {
  const lines = [
    `@deeperglobal social pipeline status — ${new Date().toISOString().slice(0, 10)}`,
    '',
    `Status: ${data.pipelineHealthy ? 'HEALTHY' : 'NEEDS ATTENTION'}`,
    `Last published: ${data.lastPublishedAt ? `${fmtDate(data.lastPublishedAt)} (${data.hoursSinceLast}h ago)` : 'No recent posts found'}`,
    `Queue remaining: ${data.queueCount} posts`,
    `Queue runs until: ${data.queueRunsUntil ? data.queueRunsUntil.slice(0, 10) : 'unknown'}`,
    `Failed posts: ${data.recentlyFailed.length}`,
    '',
    `--- Posts published (last 7 days: ${data.recentlyPublished.length}) ---`,
    ...(data.recentlyPublished.length === 0
      ? ['No posts published in the last 7 days.']
      : data.recentlyPublished.map((p) => {
          const link = tweetLink(p.x_post_id);
          return `[${formatPostFormat(p.format)}] ${fmtShortDate(p.published_at)}: ${truncate(p.body, 80)}${link ? `  ${link}` : ''}`;
        })),
    '',
    `--- Upcoming queue (next ${data.upcomingQueue.length}) ---`,
    ...(data.upcomingQueue.length === 0
      ? ['No posts in queue.']
      : data.upcomingQueue.map((p) => `[${formatPostFormat(p.format)}] ${fmtShortDate(p.scheduled_for)}: ${truncate(p.body, 80)}`)),
    ...(data.recentlyFailed.length > 0
      ? [
          '',
          `--- Failed posts (${data.recentlyFailed.length}) ---`,
          ...data.recentlyFailed.map((p) => `${fmtShortDate(p.updated_at)}: ${truncate(p.body, 80)}`),
        ]
      : []),
    '',
    `Deeper Global · ${SITE_URL}`,
  ];
  return lines.join('\n');
}

// ── Twilio SMS send ───────────────────────────────────────────────────────────
// Env vars required:
//   TWILIO_ACCOUNT_SID   — from Twilio Console dashboard
//   TWILIO_AUTH_TOKEN    — from Twilio Console dashboard
//   TWILIO_FROM_NUMBER   — your Twilio number, e.g. +18333509520
//   TWILIO_TO_NUMBER     — your mobile, e.g. +14048221018

function buildSmsBody(data) {
  const status = data.pipelineHealthy ? '✅ Healthy' : '⚠️ Issue';
  const day = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric' });
  const lastPost = data.lastPublishedAt
    ? `${data.hoursSinceLast}h ago`
    : 'never';
  const runsUntil = data.queueRunsUntil
    ? new Date(data.queueRunsUntil).toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric' })
    : '?';
  const failLine = data.recentlyFailed.length > 0
    ? `\nFailed posts: ${data.recentlyFailed.length} ⚠️`
    : '';

  return [
    `@deeperglobal ${status} · ${day}`,
    `Last post: ${lastPost}`,
    `Published this week: ${data.recentlyPublished.length}`,
    `Queue: ${data.queueCount} posts (thru ${runsUntil})${failLine}`,
    `deeper.global`,
  ].join('\n');
}

async function sendNotification(data) {
  const accountSid = (process.env.TWILIO_ACCOUNT_SID ?? '').trim();
  const authToken = (process.env.TWILIO_AUTH_TOKEN ?? '').trim();
  const messagingServiceSid = (process.env.TWILIO_MESSAGING_SERVICE_SID ?? '').trim();
  const from = (process.env.TWILIO_FROM_NUMBER ?? '').trim();
  const to = (process.env.TWILIO_TO_NUMBER ?? '+14048221018').trim();

  if (!accountSid || !authToken) {
    throw new Error('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN.');
  }
  if (!messagingServiceSid && !from) {
    throw new Error('Missing TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM_NUMBER.');
  }

  const body = buildSmsBody(data);
  const sender = messagingServiceSid
    ? { MessagingServiceSid: messagingServiceSid }
    : { From: from };
  const params = new URLSearchParams({ To: to, Body: body, ...sender });
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  );

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Twilio SMS failed: ${result?.message ?? response.statusText}`);
  }
  return result;
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const data = await fetchPipelineData();

    if (req.query?.dryRun === '1') {
      return res.status(200).json({ mode: 'dry-run', data });
    }

    const sms = await sendNotification(data);
    return res.status(202).json({
      ok: true,
      pipelineHealthy: data.pipelineHealthy,
      queueCount: data.queueCount,
      publishedLast7Days: data.recentlyPublished.length,
      failedCount: data.recentlyFailed.length,
      sms_sid: sms?.sid ?? null,
    });
  } catch (error) {
    console.error('social_status_report_failed', error);
    return res.status(500).json({ error: 'report_failed', message: error instanceof Error ? error.message : String(error) });
  }
}
