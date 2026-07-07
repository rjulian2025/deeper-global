import type { Question } from './supabase';
import { canonicalTopics, getCanonicalTopic } from './taxonomy';

const GENERAL_MENTAL_HEALTH_SLUG = canonicalTopics.at(-1)!.slug;
const KNOWN_SLUGS = new Set(canonicalTopics.map((topic) => topic.slug));

export type TopicFallbackReport = {
  /** Publishable answers with no category/raw_category/primary_theme at all; default to General Mental Health. */
  noCategory: Question[];
  /** Publishable answers whose raw category string matched no canonical alias; excluded from every /topics/ page. */
  unmappedCategory: Array<{ question: Question; rawValue: string }>;
};

export function buildTopicFallbackReport(questions: Question[]): TopicFallbackReport {
  const noCategory: Question[] = [];
  const unmappedCategory: Array<{ question: Question; rawValue: string }> = [];

  for (const question of questions) {
    const rawValue = question.category || question.raw_category || question.primary_theme;

    if (!rawValue) {
      noCategory.push(question);
      continue;
    }

    const topic = getCanonicalTopic(rawValue);
    if (!KNOWN_SLUGS.has(topic.slug)) {
      unmappedCategory.push({ question, rawValue });
    }
  }

  return { noCategory, unmappedCategory };
}

/** Warns (does not fail the build) when publishable answers fall through to the General Mental Health fallback. */
export function logTopicFallbackReport(questions: Question[]) {
  const { noCategory, unmappedCategory } = buildTopicFallbackReport(questions);

  if (noCategory.length === 0 && unmappedCategory.length === 0) return;

  console.warn(
    `[topic-fallback] ${noCategory.length} publishable answer(s) have no category/raw_category/primary_theme ` +
      `(default to "${GENERAL_MENTAL_HEALTH_SLUG}"); ${unmappedCategory.length} have a category string matching no ` +
      'canonical alias (excluded from every /topics/ page).'
  );

  if (noCategory.length) {
    console.warn('[topic-fallback] no-category slugs:', noCategory.map((question) => question.slug).join(', '));
  }

  if (unmappedCategory.length) {
    console.warn(
      '[topic-fallback] unmapped category values:',
      [...new Set(unmappedCategory.map((entry) => entry.rawValue))].join(', ')
    );
  }
}
