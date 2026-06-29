import { fetchQuestionBySlug } from '../../lib/answer-api.mjs';
import { buildAnswerOgSvg, getAnswerDisplayTitle } from '../../lib/og-answer-image.mjs';
import { renderOgPng } from '../../lib/render-og-png.mjs';

function cleanSlug(value) {
  return typeof value === 'string' ? value.trim().replace(/\.png$/i, '') : '';
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const slug = cleanSlug(req.query.slug);
  if (!slug) {
    return res.status(400).json({ error: 'missing_slug' });
  }

  try {
    const question = await fetchQuestionBySlug(slug);
    if (!question) {
      return res.status(404).json({ error: 'answer_not_found', slug });
    }

    const title = getAnswerDisplayTitle(question);
    const svg = buildAnswerOgSvg(title);
    const png = renderOgPng(svg);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
    res.setHeader('Content-Length', String(png.length));

    if (req.method === 'HEAD') {
      return res.status(200).end();
    }

    return res.status(200).send(Buffer.from(png));
  } catch (error) {
    console.error('og_answer_image_failed', { slug, error });
    return res.status(500).json({ error: 'og_image_generation_failed' });
  }
}
