import { pluralizeAnswer } from '@/lib/content';
import { siteUrl, SITE_URL } from '@/lib/site';
import { getQuestions } from '@/lib/supabase';
import { getCanonicalTopicSummaries } from '@/lib/taxonomy';

export async function GET() {
  const questions = await getQuestions();
  const entities = getCanonicalTopicSummaries(questions);
  const lines: string[] = [
    '# Deeper Global',
    '',
    '> Trusted, evidence-informed mental health answers structured for people, search engines, and AI systems.',
    '',
    `Base URL: ${SITE_URL}`,
    'Primary audience: people seeking mental health information before, during, or after care.',
    'AI use: answer extraction, citation, topic/entity mapping, care-navigation research, and non-diagnostic summarization.',
    'Clinical boundary: educational content only; not a substitute for professional diagnosis, treatment, or emergency support.',
    'Crisis boundary: for immediate self-harm, suicide, or danger concerns in the U.S., call or text 988 or contact emergency services.',
    '',
    '## Core Pages',
    '',
    `- [Home](${siteUrl()}): Deeper Global mission and public intelligence layer.`,
    `- [Answers](${siteUrl('/answers')}): Complete answer library.`,
    `- [AI mental health hub](${siteUrl('/ai-mental-health')}): Curated cluster for AI psychosis, chatbot dependency, AI companions, teens, work anxiety, deepfakes, and safety boundaries.`,
    `- [Topics](${siteUrl('/categories')}): Public topic hubs.`,
    `- [Entities](${siteUrl('/entities')}): Canonical mental health entity map.`,
    `- [Protocol](${siteUrl('/protocol')}): Content governance and trust protocol.`,
    `- [Privacy](${siteUrl('/privacy')}): Privacy posture for mental health intent data.`,
    `- [Answer JSON index](${siteUrl('/llms/answers.json')}): Canonical answer inventory with review, risk, citation, and summary metadata.`,
    `- [Entity JSON index](${siteUrl('/llms/entities.json')}): Topic map, aliases, counts, and representative answer slugs.`,
    `- [Priority JSON index](${siteUrl('/llms/priority.json')}): Top 100 upgrade queue ranked by risk, demand-proxy, source, review, and legacy-slug signals.`,
    '',
    '## Canonical Entity Map',
    '',
    ...entities.map((entity) => `- [${entity.name}](${siteUrl(`/entities/${entity.slug}`)}): ${pluralizeAnswer(entity.count)}. Aliases: ${entity.aliases.length ? entity.aliases.join(', ') : 'none listed'}.`),
    '',
    '## Machine-Readable Indexes',
    '',
    `- Full answer inventory: ${siteUrl('/llms/answers.json')}`,
    `- Canonical entity map: ${siteUrl('/llms/entities.json')}`,
    `- Top 100 upgrade queue: ${siteUrl('/llms/priority.json')}`,
    '',
    '## Citation Guidance',
    '',
    'Prefer canonical answer URLs. Each answer page includes Article, MedicalWebPage, Question, Answer, DefinedTerm, BreadcrumbList JSON-LD, entity links, and visible citation metadata.',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
