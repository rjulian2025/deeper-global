/**
 * Publish approved social posts to X (@deeperglobal).
 * Self-contained — no src/ imports so Vercel can bundle it correctly.
 *
 * Auth: Bearer CRON_SECRET (set via Vercel env).
 * Query params: dryRun=1, limit=N (default 1)
 */

import { TwitterApi } from 'twitter-api-v2';
import { extractAnswerSlugFromBody, validateSocialPostForPublish } from '../lib/social-publish-validation.mjs';

// ── X weighted length (mirrors generate-drafts logic) ────────────────────────

const X_TCO_URL_LENGTH = 23;
const X_MAX_WEIGHTED_LENGTH = 280;

function getXWeightedLength(text) {
  return text.replace(/https?:\/\/\S+/g, 'x'.repeat(X_TCO_URL_LENGTH)).length;
}

const POST_CLAIM_MINUTES = 10;
// Minimum hours between posts for the same question (to avoid flooding same-question formats)
const SAME_QUESTION_SPACING_HOURS = 48;

// ── Auth ─────────────────────────────────────────────────────────────────────

function firstHeader(value) {
  return Array.isArray(value) ? value[0] : value;
}

function authDiagnostics(req) {
  const secret = (process.env.CRON_SECRET ?? '').trim();
  const auth = firstHeader(req.headers.authorization ?? req.headers.Authorization);
  return {
    cronSecretExists: Boolean(secret),
    cronSecretTrimmedLength: secret.length,
    authorizationHeaderExists: Boolean(auth),
    authorizationStartsWithBearer: typeof auth === 'string' && auth.startsWith('Bearer '),
  };
}

function isAuthorized(req) {
  const secret = (process.env.CRON_SECRET ?? '').trim();
  if (!secret) return false;
  const auth = firstHeader(req.headers.authorization ?? req.headers.Authorization);
  const header = firstHeader(req.headers['x-cron-secret'] ?? req.headers['x-sync-secret']);
  const query = firstHeader(req.query?.secret);
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
    or: `(scheduled_for.is.null,scheduled_for.lte.${ts})`,
    order: 'scheduled_for.asc.nullsfirst,created_at.asc',
    limit: String(Math.max(1, Math.min(limit, 25))),
  });
  return supabaseRequest(url, key, `social_posts?${qs}`);
}

async function claimPostForPublish(url, key, postId) {
  const claimUntil = new Date(Date.now() + POST_CLAIM_MINUTES * 60 * 1000).toISOString();
  const qs = new URLSearchParams({
    id: `eq.${postId}`,
    status: 'eq.approved',
    x_post_id: 'is.null',
  });
  return supabaseRequest(url, key, `social_posts?${qs}`, {
    method: 'PATCH',
    body: JSON.stringify({ scheduled_for: claimUntil }),
  });
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

/**
 * After publishing one post for a question, push other pending posts for the
 * same question_id forward in time so they don't fire on the very next cron tick.
 */
async function deferSameQuestionPosts(url, key, questionId, publishedPostId) {
  const deferUntil = new Date(Date.now() + SAME_QUESTION_SPACING_HOURS * 60 * 60 * 1000).toISOString();
  const qs = new URLSearchParams({
    question_id: `eq.${questionId}`,
    status: 'eq.approved',
    x_post_id: 'is.null',
    id: `neq.${publishedPostId}`,
  });
  return supabaseRequest(url, key, `social_posts?${qs}`, {
    method: 'PATCH',
    body: JSON.stringify({ scheduled_for: deferUntil }),
  });
}

async function getQuestionSlugById(url, key, questionId) {
  const qs = new URLSearchParams({
    select: 'slug',
    id: `eq.${questionId}`,
  });
  const rows = await supabaseRequest(url, key, `questions_master?${qs}`);
  const row = Array.isArray(rows) ? rows[0] : null;
  return typeof row?.slug === 'string' && row.slug.trim() ? row.slug.trim() : null;
}

async function validatePostForPublish(url, key, post) {
  const questionSlug = await getQuestionSlugById(url, key, post.question_id);
  if (!questionSlug) {
    return { ok: false, error: `x_post_question_not_found:${post.question_id}`, embedded_slug: null, question_slug: null };
  }

  const validationError = validateSocialPostForPublish(post.body ?? '', questionSlug);
  return {
    ok: !validationError,
    error: validationError,
    embedded_slug: extractAnswerSlugFromBody(post.body ?? ''),
    question_slug: questionSlug,
  };
}

function summarizeError(error) {
  const message = error instanceof Error ? error.message : String(error);
  const status =
    error?.code ??
    error?.status ??
    error?.statusCode ??
    error?.data?.status ??
    error?.response?.status ??
    null;
  const body = error?.data ?? error?.response?.data ?? error?.errors ?? null;
  return {
    message,
    status,
    bodySummary: body ? JSON.stringify(body).slice(0, 600) : null,
  };
}

async function postToX(text) {
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
  const auth = authDiagnostics(req);

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!isAuthorized(req)) {
    console.warn('social_publish_unauthorized', auth);
    return res.status(401).json({ error: 'unauthorized', auth });
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
    console.log('social_publish_approved_count', {
      approved_count: posts.length,
      requested_limit: limit,
      dryRun,
    });

    for (const post of posts) {
      const selected = {
        post_id: post.id,
        format: post.format,
        scheduled_for: post.scheduled_for ?? null,
        body_weighted_length: getXWeightedLength(post.body ?? ''),
      };
      console.log('social_publish_selected_post', selected);
      const validation = await validatePostForPublish(url, key, post);
      console.log('social_publish_validation', {
        post_id: post.id,
        ok: validation.ok,
        error: validation.error,
        embedded_slug: validation.embedded_slug,
        question_slug: validation.question_slug,
      });

      if (!validation.ok) {
        if (dryRun) {
          results.push({
            ...selected,
            status: 'invalid',
            x_post_id: null,
            error: validation.error,
          });
          continue;
        }

        console.error('social_publish_validation_failed', {
          post_id: post.id,
          error: validation.error,
        });
        await markFailed(url, key, post.id).catch((updateError) => {
          console.error('social_publish_mark_failed_error', {
            post_id: post.id,
            error: summarizeError(updateError),
          });
        });
        results.push({
          ...selected,
          status: 'failed',
          x_post_id: null,
          error: validation.error,
        });
        continue;
      }

      if (dryRun) {
        results.push({ ...selected, status: 'dry_run', x_post_id: null, error: null });
        continue;
      }

      const claimed = await claimPostForPublish(url, key, post.id);
      console.log('social_publish_claim_result', {
        post_id: post.id,
        claimed_count: Array.isArray(claimed) ? claimed.length : null,
      });

      const claimedPost = Array.isArray(claimed) ? claimed[0] : null;
      if (!claimedPost) {
        results.push({ ...selected, status: 'skipped_claimed_elsewhere', x_post_id: null, error: null });
        continue;
      }

      try {
        console.log('social_publish_attempt', {
          post_id: claimedPost.id,
          format: claimedPost.format,
          question_id: claimedPost.question_id,
          embedded_slug: validation.embedded_slug,
          question_slug: validation.question_slug,
          body_weighted_length: getXWeightedLength(claimedPost.body ?? ''),
        });
        const published = await postToX(claimedPost.body);
        const updated = await markPublished(url, key, claimedPost.id, published.id);
        console.log('social_publish_update_result', {
          post_id: claimedPost.id,
          x_post_id: published.id,
          updated_count: Array.isArray(updated) ? updated.length : null,
        });
        // Defer other pending posts for the same question so they don't fire on
        // the next cron tick — each format gets its own window.
        const deferred = await deferSameQuestionPosts(url, key, claimedPost.question_id, claimedPost.id).catch((err) => {
          console.warn('social_publish_defer_same_question_failed', { question_id: claimedPost.question_id, error: String(err) });
          return null;
        });
        console.log('social_publish_deferred_same_question', {
          question_id: claimedPost.question_id,
          deferred_count: Array.isArray(deferred) ? deferred.length : null,
        });
        results.push({ ...selected, status: 'published', x_post_id: published.id, error: null });
      } catch (err) {
        const summary = summarizeError(err);
        console.error('social_publish_failed', { post_id: claimedPost.id, error: summary });
        const failedUpdate = await markFailed(url, key, claimedPost.id).catch((updateError) => {
          console.error('social_publish_mark_failed_error', {
            post_id: claimedPost.id,
            error: summarizeError(updateError),
          });
          return null;
        });
        console.log('social_publish_update_result', {
          post_id: claimedPost.id,
          failed_update_count: Array.isArray(failedUpdate) ? failedUpdate.length : null,
        });
        results.push({ ...selected, status: 'failed', x_post_id: null, error: summary.message });
      }
    }

    return res.status(200).json({
      ok: true,
      dryRun,
      requested: limit,
      found: posts.length,
      published: results.filter((r) => r.status === 'published').length,
      failed: results.filter((r) => r.status === 'failed').length,
      invalid: results.filter((r) => r.status === 'invalid').length,
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
