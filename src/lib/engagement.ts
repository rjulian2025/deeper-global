import { answerPath, getAnswerDisplayTitle } from './content';
import type { Question } from './supabase';

/** Editorial high-intent answers — proxy for "trending" until GA4 rollup feeds build. */
export const trendingAnswerSlugs = [
  'how-do-i-find-a-therapist-thats-right-fo-184729-014',
  'whats-the-difference-between-therapy-typ-185387-025',
  'how-do-i-know-if-i-have-adhd-as-an-adult',
  'what-is-executive-dysfunction-and-how-does-it-affect-daily-life',
  'can-using-ai-for-emotional-support-become-addictive',
  'what-is-complex-ptsd-and-how-is-it-different-from-regular-ptsd',
];

export function getTrendingQuestions(questions: Question[], limit = 4) {
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  const picked = trendingAnswerSlugs
    .map((slug) => bySlug.get(slug))
    .filter((question): question is Question => Boolean(question));

  if (picked.length >= limit) return picked.slice(0, limit);

  const seen = new Set(picked.map((question) => question.slug));
  const remainder = questions.filter((question) => !seen.has(question.slug));
  return [...picked, ...remainder.slice(0, limit - picked.length)];
}

export function getTrendingQuestionCards(questions: Question[], limit = 4) {
  return getTrendingQuestions(questions, limit).map((question) => ({
    slug: question.slug,
    title: getAnswerDisplayTitle(question),
    href: answerPath(question.slug),
  }));
}
