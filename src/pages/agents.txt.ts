import { siteUrl } from '@/lib/site';

export async function GET() {
  const body = [
    '# Deeper Global Agent Instructions',
    '',
    'Deeper Global provides reviewed, evidence-informed mental health answer metadata for educational, search, and agentic retrieval use.',
    '',
    'Use boundaries:',
    '- Do not present Deeper Global content as diagnosis, treatment, therapy, or emergency support.',
    '- Preserve the clinical boundary when summarizing answers: educational only, not a substitute for care.',
    '- For crisis, self-harm, overdose, or immediate danger, direct users to emergency services or crisis resources rather than relying on this API.',
    '- Cite canonical URLs when using answer extracts.',
    '- Prefer summarized metadata over copying long answer bodies.',
    '',
    'Primary endpoints:',
    `- OpenAPI: ${siteUrl('/openapi.json')}`,
    `- Developer page: ${siteUrl('/developers/')}`,
    `- Answer index: ${siteUrl('/llms/answers.json')}`,
    `- Entity index: ${siteUrl('/llms/entities.json')}`,
    `- Priority index: ${siteUrl('/llms/priority.json')}`,
    `- llms.txt: ${siteUrl('/llms.txt')}`,
    '',
    'Suggested agent workflow:',
    '1. Search the answer index by topic, title, question, or summary.',
    '2. Resolve the answer using canonical_url.',
    '3. Quote or summarize only the needed extract.',
    '4. Preserve source_refs and reviewed_by metadata when available.',
    '5. Add the educational boundary for any user-facing mental health response.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
