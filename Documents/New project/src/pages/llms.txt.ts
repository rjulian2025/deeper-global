import {
  displayCategory,
  getAnswerDisplayTitle,
  getAnswerPlainText,
  getAnswerSummary,
  getEntitySummaries,
  getQuestionCitation,
  pluralizeAnswer,
  truncate,
} from '@/lib/content';
import { siteUrl, SITE_URL } from '@/lib/site';
import { getQuestions } from '@/lib/supabase';

export async function GET() {
  const questions = await getQuestions();
  const entities = getEntitySummaries(questions);
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
    `- [Topics](${siteUrl('/categories')}): Public topic hubs.`,
    `- [Entities](${siteUrl('/entities')}): Canonical mental health entity map.`,
    `- [Protocol](${siteUrl('/protocol')}): Content governance and trust protocol.`,
    `- [Privacy](${siteUrl('/privacy')}): Privacy posture for mental health intent data.`,
    '',
    '## Entity Map',
    '',
    ...entities.map((entity) => `- [${entity.name}](${siteUrl(`/entities/${entity.slug}`)}): ${pluralizeAnswer(entity.count)}. Aliases: ${entity.sameAs.length ? entity.sameAs.join(', ') : 'none listed'}.`),
    '',
    '## Answer Index',
    '',
    ...questions.flatMap((question) => {
      const citation = getQuestionCitation(question);
      const text = truncate(getAnswerPlainText(question), 320);
      return [
        `- [${getAnswerDisplayTitle(question)}](${citation.url})`,
        `  - Entity: ${displayCategory(question)}`,
        `  - Summary: ${getAnswerSummary(question)}`,
        `  - Extract: ${text}`,
        `  - Updated: ${citation.dateModified}`,
      ];
    }),
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
