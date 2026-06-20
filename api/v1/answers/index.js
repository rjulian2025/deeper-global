import { answerIndexResponse, fetchQuestions } from '../../lib/deeper-api.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const questions = await fetchQuestions();

    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).json(answerIndexResponse(questions));
  } catch (error) {
    console.error('deeper_api_answers_failed', error);
    return res.status(500).json({ error: 'answers_query_failed' });
  }
}
