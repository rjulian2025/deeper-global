import {
  buildAnswerPayload,
  checkRateLimit,
  fetchQuestionBySlug,
  jsonResponse,
  setRateLimitHeaders,
  shouldIndexQuestion,
} from '../../lib/answer-api.mjs';
import { readAttributionHeader, readReferrerDomain, recordApiAccess } from '../../lib/record-api-access.mjs';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Deeper-Attribution');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return jsonResponse(res, 405, { error: 'method_not_allowed' });
  }

  const rateLimit = checkRateLimit(req);
  setRateLimitHeaders(res, rateLimit);

  if (rateLimit.limited) {
    res.setHeader('Retry-After', String(Math.max(1, rateLimit.reset - Math.ceil(Date.now() / 1000))));
    return jsonResponse(
      res,
      429,
      {
        error: 'rate_limited',
        message: 'Too many requests. Please retry after the rate limit window resets.',
      },
      { cacheSeconds: 0 }
    );
  }

  const slug = cleanSlug(req.query.slug);
  if (!slug) {
    return jsonResponse(res, 400, { error: 'missing_slug' });
  }

  try {
    const question = await fetchQuestionBySlug(slug);
    if (!question) {
      return jsonResponse(res, 404, { error: 'answer_not_found', slug });
    }

    if (!shouldIndexQuestion(question)) {
      return jsonResponse(res, 404, { error: 'answer_not_available', slug });
    }

    recordApiAccess({
      eventName: 'api_answer_fetched',
      slug,
      attribution: readAttributionHeader(req),
      referrerDomain: readReferrerDomain(req),
      headers: req.headers,
    }).catch(() => {});

    return jsonResponse(res, 200, buildAnswerPayload(question));
  } catch (error) {
    console.error('answer_api_error', slug, error);
    return jsonResponse(
      res,
      500,
      { error: 'internal_error', message: error instanceof Error ? error.message : 'unknown_error' },
      { cacheSeconds: 0 }
    );
  }
}

function cleanSlug(value) {
  if (typeof value !== 'string') return null;
  const slug = value.replace(/\s+/g, '').trim();
  return slug || null;
}
