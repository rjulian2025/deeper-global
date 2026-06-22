import { TwitterApi } from 'twitter-api-v2';
import type { SocialPost } from './db';

export type XCredentials = {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
};

export type PublishApprovedPostsDeps = {
  getApprovedPostsToPublish: (limit: number, now?: Date) => Promise<SocialPost[]>;
  postToX: (body: string) => Promise<{ id: string }>;
  markPublished: (postId: string, xPostId: string) => Promise<SocialPost>;
  markFailed: (postId: string) => Promise<SocialPost>;
  logger?: Pick<Console, 'log' | 'warn' | 'error'>;
};

export type PublishApprovedPostsOptions = {
  limit?: number;
  dryRun?: boolean;
  now?: Date;
};

export function resolveXCredentials(env: Record<string, string | undefined> = process.env): XCredentials {
  const apiKey = env.X_API_KEY?.trim();
  const apiSecret = env.X_API_SECRET?.trim();
  const accessToken = env.X_ACCESS_TOKEN?.trim();
  const accessTokenSecret = env.X_ACCESS_TOKEN_SECRET?.trim();

  if (apiKey && apiSecret && accessToken && accessTokenSecret) {
    return {
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken,
      accessSecret: accessTokenSecret,
    };
  }

  throw new Error(
    'Missing X credentials. Set X_API_KEY/X_API_SECRET/X_ACCESS_TOKEN/X_ACCESS_TOKEN_SECRET.'
  );
}

export function createXClient(credentials: XCredentials) {
  return new TwitterApi({
    appKey: credentials.appKey,
    appSecret: credentials.appSecret,
    accessToken: credentials.accessToken,
    accessSecret: credentials.accessSecret,
  });
}

export function createXPoster(credentials: XCredentials) {
  const client = createXClient(credentials);

  return async function postToX(text: string) {
    const body = text.trim();
    if (!body) throw new Error('x_post_body_required');
    if (body.length > 280) throw new Error(`x_post_body_too_long:${body.length}`);

    const payload = await client.v2.tweet(body);
    const id = payload.data?.id;
    if (typeof id !== 'string' || !id) {
      throw new Error(`x_post_missing_id:${JSON.stringify(payload)}`);
    }

    return { id };
  };
}

export async function publishApprovedPosts(deps: PublishApprovedPostsDeps, options: PublishApprovedPostsOptions = {}) {
  const logger = deps.logger ?? console;
  const limit = Math.max(1, Math.min(options.limit ?? 1, 25));
  const dryRun = options.dryRun ?? false;
  const posts = await deps.getApprovedPostsToPublish(limit, options.now);
  const results: Array<{
    post_id: string;
    status: 'dry_run' | 'published' | 'failed';
    x_post_id: string | null;
    body: string;
    error: string | null;
  }> = [];

  for (const post of posts) {
    if (dryRun) {
      results.push({
        post_id: post.id,
        status: 'dry_run',
        x_post_id: null,
        body: post.body,
        error: null,
      });
      continue;
    }

    try {
      const published = await deps.postToX(post.body);
      await deps.markPublished(post.id, published.id);
      results.push({
        post_id: post.id,
        status: 'published',
        x_post_id: published.id,
        body: post.body,
        error: null,
      });
    } catch (error) {
      logger.error('social_publish_failed', {
        post_id: post.id,
        error,
      });
      await deps.markFailed(post.id);
      results.push({
        post_id: post.id,
        status: 'failed',
        x_post_id: null,
        body: post.body,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    dryRun,
    requested: limit,
    found: posts.length,
    published: results.filter((result) => result.status === 'published').length,
    failed: results.filter((result) => result.status === 'failed').length,
    results,
  };
}
