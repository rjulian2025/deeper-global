import {
  answerIndexResponse,
  applyAnswerQuery,
  checkRateLimit,
  fetchQuestions,
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
    const questions = await fetchQuestions();
    const result = applyAnswerQuery(questions, req.query);

    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).json(answerIndexResponse(questions, result));
  } catch (error) {
    console.error('deeper_api_answers_failed', error);
    return res.status(500).json({ error: 'answers_query_failed' });
  }
}
