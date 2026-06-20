import { categoryPath, displayCategory } from './content';
import { getCanonicalTopic, getCanonicalTopicSummaries } from './taxonomy';
import type { Question } from './supabase';

export type EditorialTopicLink = {
  name: string;
  slug: string;
  count: number;
  href: string;
};

export type EditorialTopicGroup = {
  name: string;
  topics: EditorialTopicLink[];
};

const EDITORIAL_TOPIC_GROUPS: Array<{ name: string; slugs: string[] }> = [
  {
    name: 'Mood & emotional health',
    slugs: ['anxiety-and-stress', 'depression', 'grief-and-loss', 'loneliness-and-belonging'],
  },
  {
    name: 'Recovery, trauma & safety',
    slugs: ['addiction-and-recovery', 'trauma-and-safety'],
  },
  {
    name: 'Relationships & family',
    slugs: ['relationships-and-communication', 'family-and-parenting', 'gender-sexuality-and-intimacy'],
  },
  {
    name: 'Identity, work & meaning',
    slugs: ['identity-and-self-worth', 'work-and-burnout', 'meaning-faith-and-existential-questions', 'teens-and-identity'],
  },
  {
    name: 'Care, attention & daily life',
    slugs: ['therapy-and-care-navigation', 'neurodivergence-and-attention', 'general-mental-health'],
  },
];

function topicDirectoryHref(topicSlug: string, questions: Question[]) {
  const categoryCounts = new Map<string, number>();

  for (const question of questions) {
    const topic = getCanonicalTopic(question.category || question.raw_category || question.primary_theme);
    if (topic.slug !== topicSlug) continue;
    const category = displayCategory(question);
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  const topCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  return topCategory ? categoryPath(topCategory[0]) : '/categories/';
}

export function getEditorialTopicDirectory(questions: Question[]): EditorialTopicGroup[] {
  const summaries = new Map(getCanonicalTopicSummaries(questions).map((topic) => [topic.slug, topic]));

  return EDITORIAL_TOPIC_GROUPS.map((group) => ({
    name: group.name,
    topics: group.slugs
      .map((slug) => summaries.get(slug))
      .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic))
      .map((topic) => ({
        name: topic.name,
        slug: topic.slug,
        count: topic.count,
        href: topicDirectoryHref(topic.slug, questions),
      })),
  })).filter((group) => group.topics.length > 0);
}
