import {
  API_CONSTANTS,
  buildAnswerPayload,
  fetchQuestionBySlug,
  jsonResponse,
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
