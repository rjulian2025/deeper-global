import {
  createDraftPost,
  getFeaturedQuestions,
  getQuestionForSocialPost,
} from '../../src/lib/social/db';
import { generateAndMaybeSaveSocialDrafts } from '../../src/lib/social/generate-drafts';

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

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!anthropicApiKey) {
    return res.status(500).json({ error: 'missing_anthropic_api_key' });
  }

  try {
    const result = await generateAndMaybeSaveSocialDrafts(
      {
        getFeaturedQuestions,
        getQuestionById: getQuestionForSocialPost,
        createDraftPost,
        logger: console,
      },
      {
        anthropicApiKey,
        writeDrafts: true,
      }
    );

    return res.status(200).json({
      ok: true,
      strategy: result.strategy,
      question_id: result.question.id,
      slug: result.question.slug,
      question_only_path: result.questionOnlyPath,
      drafts_written: result.written,
    });
  } catch (error) {
    console.error('generate_social_drafts_failed', error);
    return res.status(500).json({
      error: 'generate_social_drafts_failed',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
