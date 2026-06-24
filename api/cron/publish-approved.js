/**
 * Publish approved social posts to X (@deeperglobal).
 * Self-contained — no src/ imports so Vercel can bundle it correctly.
 *
 * Auth: Bearer CRON_SECRET (set via Vercel env).
 * Query params: dryRun=1, limit=N (default 1)
 */

// ── X weighted length (mirrors generate-drafts logic) ────────────────────────

const X_TCO_URL_LENGTH = 23;
const X_MAX_WEIGHTED_LENGTH = 280;

function getXWeightedLength(text) {
  return text.replace(/https?:\/\/\S+/g, 'x'.repeat(X_TCO_URL_LENGTH)).length;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers['authorization'] ?? req.headers['Authorization'];
  const header = req.headers['x-cron-secret'] ?? req.headers['x-sync-secret'];
  const query = req.query?.secret;
  return auth === `Bearer ${secret}` || header === secret || query === secret;
}

// ── Supabase client ───────────────────────────────────────────────────────────

function createSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');

  return {
    from: (table) => ({
      select: (cols) => buildQuery({ url, key, table, method: 'GET', cols }),
    }),
    _url: url,
    _key: key,
  };
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

async function getApprovedPostsToPublish(url, key, limit, now) {
  const ts = (now ?? new Date()).toISOString();
  const qs = new URLSearchParams({
    select: '*',
    status: 'eq.approved',
    x_post_id: 'is.null',
    or: `scheduled_for.is.null,scheduled_for.lte.${ts}`,
    order: 'scheduled_for.asc.nullsfirst,created_at.asc',
    limit: String(Math.max(1, Math.min(limit, 25))),
  });
  return supabaseRequest(url, key, `social_posts?${qs}`);
}

async function markPublished(url, key, postId, xPostId) {
  const qs = new URLSearchParams({ id: `eq.${postId}` });
  return supabaseRequest(url, key, `social_posts?${qs}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'published',
      x_post_id: xPostId,
      published_at: new Date().toISOString(),
    }),
  });
}

async function markFailed(url, key, postId) {
  const qs = new URLSearchParams({ id: `eq.${postId}` });
  return supabaseRequest(url, key, `social_posts?${qs}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'failed' }),
  });
}

// ── X posting ─────────────────────────────────────────────────────────────────

async function postToX(text) {
  const { TwitterApi } = await import('twitter-api-v2');
  const credentials = {
    appKey: process.env.X_API_KEY?.trim(),
    appSecret: process.env.X_API_SECRET?.trim(),
    accessToken: process.env.X_ACCESS_TOKEN?.trim(),
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET?.trim(),
  };
  if (!credentials.appKey || !credentials.appSecret || !credentials.accessToken || !credentials.accessSecret) {
    throw new Error('Missing X credentials (X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET)');
  }

  const body = text.trim();
  if (!body) throw new Error('x_post_body_required');
  const weightedLength = getXWeightedLength(body);
  if (weightedLength > X_MAX_WEIGHTED_LENGTH) throw new Error(`x_post_body_too_long:${weightedLength}`);

  const client = new TwitterApi(credentials);
  const payload = await client.v2.tweet(body);
  const id = payload.data?.id;
  if (typeof id !== 'string' || !id) throw new Error(`x_post_missing_id:${JSON.stringify(payload)}`);
  return { id };
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

  const dryRun =
    req.query?.dryRun === '1' || req.query?.dryRun === 'true';
  const limitParam = parseInt(req.query?.limit ?? '1', 10);
  const limit = isFinite(limitParam) ? limitParam : 1;

  try {
    const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');

    const posts = await getApprovedPostsToPublish(url, key, limit);
    const results = [];

    for (const post of posts) {
      if (dryRun) {
        results.push({ post_id: post.id, status: 'dry_run', x_post_id: null, body: post.body, error: null });
        continue;
      }
      try {
        const published = await postToX(post.body);
        await markPublished(url, key, post.id, published.id);
        results.push({ post_id: post.id, status: 'published', x_post_id: published.id, body: post.body, error: null });
      } catch (err) {
        console.error('social_publish_failed', { post_id: post.id, error: err });
        await markFailed(url, key, post.id).catch(() => {});
        results.push({ post_id: post.id, status: 'failed', x_post_id: null, body: post.body, error: err instanceof Error ? err.message : String(err) });
      }
    }

    return res.status(200).json({
      ok: true,
      dryRun,
      requested: limit,
      found: posts.length,
      published: results.filter((r) => r.status === 'published').length,
      failed: results.filter((r) => r.status === 'failed').length,
      results,
    });
  } catch (error) {
    console.error('publish_approved_social_posts_failed', error);
    return res.status(500).json({
      error: 'publish_approved_social_posts_failed',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
