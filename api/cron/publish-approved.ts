import {
  getApprovedPostsToPublish,
  markFailed,
  markPublished,
} from '../../src/lib/social/db';
import {
  createXPoster,
  publishApprovedPosts,
  resolveXCredentials,
} from '../../src/lib/social/x-publish';

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isAuthorized(req: { headers: Record<string, string | string[] | undefined>; query?: Record<string, string | string[] | undefined> }) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.authorization;
  const headerSecret = req.headers['x-cron-secret'] ?? req.headers['x-sync-secret'];
  const querySecret = req.query?.secret;

  return (
    authHeader === `Bearer ${secret}` ||
    headerSecret === secret ||
    querySecret === secret
  );
}

export default async function handler(
  req: {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    query?: Record<string, string | string[] | undefined>;
  },
  res: {
    setHeader: (name: string, value: string) => void;
    status: (statusCode: number) => { json: (body: unknown) => void };
  }
) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const dryRun = firstQueryValue(req.query?.dryRun) === '1' || firstQueryValue(req.query?.dryRun) === 'true';
  const limitParam = Number.parseInt(firstQueryValue(req.query?.limit) ?? '1', 10);
  const limit = Number.isFinite(limitParam) ? limitParam : 1;

  try {
    const postToX = dryRun ? async () => ({ id: 'dry-run' }) : createXPoster(resolveXCredentials());
    const result = await publishApprovedPosts(
      {
        getApprovedPostsToPublish,
        postToX,
        markPublished,
        markFailed,
        logger: console,
      },
      {
        limit,
        dryRun,
      }
    );

    return res.status(200).json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error('publish_approved_social_posts_failed', error);
    return res.status(500).json({
      error: 'publish_approved_social_posts_failed',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
