import {
  checkRateLimit,
  fetchQuestionBySlug,
  serializeAnswerDetail,
  setRateLimitHeaders,
} from '../../lib/deeper-api.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const rateLimit = checkRateLimit(req);
  setRateLimitHeaders(res, rateLimit);

  if (rateLimit.limited) {
    res.setHeader('Retry-After', String(Math.max(1, rateLimit.reset - Math.ceil(Date.now() / 1000))));
    return res.status(429).json({
      error: 'rate_limited',
      message: 'Too many requests. Please retry after the rate limit window resets.',
    });
  }

  try {
    const slug = typeof req.query.slug === 'string' ? req.query.slug : req.query.slug?.[0];
    const question = slug ? await fetchQuestionBySlug(slug) : null;

    if (!question) {
      res.setHeader('Cache-Control', 'public, max-age=300');
      return res.status(404).json({
        error: 'not_found',
        message: 'No Deeper Global answer exists for this slug.',
      });
    }

    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).json(serializeAnswerDetail(question));
  } catch (error) {
    console.error('deeper_api_answer_detail_failed', error);
    return res.status(500).json({ error: 'answer_query_failed' });
  }
}
