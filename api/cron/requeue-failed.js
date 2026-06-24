/**
 * Reset failed social posts back to approved so the next cron run retries them.
 * Call once after deploying the x-publish character-limit fix to recover the backlog.
 *
 * Auth: Bearer CRON_SECRET
 */

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers['authorization'] ?? req.headers['Authorization'];
  const header = req.headers['x-cron-secret'] ?? req.headers['x-sync-secret'];
  const query = req.query?.secret;
  return auth === `Bearer ${secret}` || header === secret || query === secret;
}

async function supabaseRequest(url, key, path, options = {}) {
  const resp = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer ?? 'return=representation',
      ...(options.headers ?? {}),
    },
  });
  const data = await resp.json().catch(() => null);
  if (!resp.ok) throw new Error(`Supabase error: ${JSON.stringify(data)}`);
  return data;
}

async function requeueFailedPosts(url, key, limit) {
  const normalizedLimit = Math.max(1, Math.min(limit, 100));
  const qs = new URLSearchParams({
    status: 'eq.failed',
    x_post_id: 'is.null',
    limit: String(normalizedLimit),
  });
  return supabaseRequest(url, key, `social_posts?${qs}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'approved' }),
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const limitParam = parseInt(req.query?.limit ?? '100', 10);
  const limit = isFinite(limitParam) ? limitParam : 100;

  try {
    const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');

    const requeued = await requeueFailedPosts(url, key, limit);
    return res.status(200).json({
      ok: true,
      requeued: Array.isArray(requeued) ? requeued.length : requeued,
      posts: Array.isArray(requeued)
        ? requeued.map((p) => ({ id: p.id, format: p.format, body: p.body?.slice(0, 60) }))
        : [],
    });
  } catch (error) {
    console.error('requeue_failed_posts_error', error);
    return res.status(500).json({
      error: 'requeue_failed_posts_error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
