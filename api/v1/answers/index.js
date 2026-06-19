import {
  API_CONSTANTS,
  fetchIndexableAnswerSummaries,
  jsonResponse,
  listAnswers,
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

  const topic = cleanQueryValue(req.query.topic);
  const q = cleanQueryValue(req.query.q);
  const limit = req.query.limit;
  const cursor = cleanQueryValue(req.query.cursor) ?? '0';

  try {
    const rows = await fetchIndexableAnswerSummaries();
    const payload = listAnswers({ rows, topic, q, limit, cursor });

    recordApiAccess({
      eventName: 'api_answers_listed',
      topic,
      query: q,
      attribution: readAttributionHeader(req),
      referrerDomain: readReferrerDomain(req),
    }).catch(() => {});

    return jsonResponse(res, 200, payload);
  } catch (error) {
    console.error('answers_list_api_error', error);
    return jsonResponse(
      res,
      500,
      { error: 'internal_error', message: error instanceof Error ? error.message : 'unknown_error' },
      { cacheSeconds: 0 }
    );
  }
}

function cleanQueryValue(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}
