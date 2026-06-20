import { answerPath, categoryPath, displayCategory, getAnswerDisplayTitle } from './content';
import { trendingAnswerSlugs } from './engagement';
import { getCanonicalTopic, getCanonicalTopicSummaries } from './taxonomy';
import type { Question } from './supabase';

export type EditorialTopicLink = {
  name: string;
  slug: string;
  count: number;
  href: string;
};

export type EditorialDiscoveryLink = {
  title: string;
  href: string;
};

export type TopicQuestionsLabel = 'people-often-ask' | 'common-questions' | 'frequently-explored';

export const TOPIC_QUESTIONS_LABELS: Record<TopicQuestionsLabel, string> = {
  'people-often-ask': 'People often ask',
  'common-questions': 'Common questions',
  'frequently-explored': 'Frequently explored',
};

export type EditorialTopicGroup = {
  name: string;
  description: string;
  topics: EditorialTopicLink[];
  discoveryLinks: EditorialDiscoveryLink[];
};

const EDITORIAL_TOPIC_GROUPS: Array<{ name: string; description: string; slugs: string[] }> = [
  {
    name: 'Mood & emotional health',
    description: 'When feelings overwhelm, persist, or leave you isolated.',
    slugs: ['anxiety-and-stress', 'depression', 'grief-and-loss', 'loneliness-and-belonging'],
  },
  {
    name: 'Recovery, trauma & safety',
    description: 'Healing, substance use, trauma responses, and staying safe.',
    slugs: ['addiction-and-recovery', 'trauma-and-safety'],
  },
  {
    name: 'Relationships & family',
    description: 'Partners, parents, conflict, intimacy, and belonging at home.',
    slugs: ['relationships-and-communication', 'family-and-parenting', 'gender-sexuality-and-intimacy'],
  },
  {
    name: 'Identity, work & meaning',
    description: 'Who you are, how you work, and what gives life direction.',
    slugs: ['identity-and-self-worth', 'work-and-burnout', 'meaning-faith-and-existential-questions', 'teens-and-identity'],
  },
  {
    name: 'Care, attention & daily life',
    description: 'Finding care, neurodivergence, and the questions that surface every day.',
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

const DISCOVERY_QUESTION_OVERRIDES: Record<string, string> = {
  'how-do-i-find-a-therapist-thats-right-fo-184729-014': 'How do I find a therapist who\'s right for me?',
  'whats-the-difference-between-therapy-typ-185387-025': 'What\'s the difference between CBT, DBT, and psychodynamic therapy?',
  'how-do-i-know-if-i-have-adhd-as-an-adult': 'Could I have ADHD as an adult?',
  'what-is-executive-dysfunction-and-how-does-it-affect-daily-life': 'What is executive dysfunction?',
  'what-is-complex-ptsd-and-how-is-it-different-from-regular-ptsd': 'What\'s the difference between complex PTSD and PTSD?',
  'can-using-ai-for-emotional-support-become-addictive': 'Can using AI for emotional support become addictive?',
  'what-to-do-after-a-relapse-without-turning-it-into-shame': 'What should I do after a relapse?',
  'how-to-bring-up-a-hard-topic-without-turning-it-into-a-fight': 'How do I bring up a hard topic without fighting?',
  'what-to-do-when-someone-shuts-down-during-conflict': 'What do I do when someone shuts down during conflict?',
  'why-grief-comes-in-waves-instead-of-moving-in-a-straight-line': 'Why does grief come in waves?',
  'can-trauma-look-like-adhd': 'Can trauma look like ADHD?',
};

function formatDiscoveryQuestion(question: Question): string {
  const override = DISCOVERY_QUESTION_OVERRIDES[question.slug];
  if (override) return override;

  let title = getAnswerDisplayTitle(question).trim();
  if (title.endsWith('?')) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  title = title
    .replace(/^How to tell if /i, 'Could it be that ')
    .replace(/^How to help someone who /i, 'How do I help someone who ')
    .replace(/^How to bring up /i, 'How do I bring up ')
    .replace(/^How to /i, 'How do I ')
    .replace(/^What to do (when|after|if) /i, 'What should I do $1 ')
    .replace(/^What parents can do when /i, 'What can parents do when ')
    .replace(/\.$/, '');

  if (title.length > 68) {
    const shortened = title.replace(/\s+\S*$/, '').trim();
    if (shortened.length >= 24) {
      title = shortened;
    }
  }

  return `${title}?`.replace('??', '?');
}

function discoveryScore(question: Question): number {
  let score = 0;
  const title = getAnswerDisplayTitle(question);

  if (trendingAnswerSlugs.includes(question.slug)) score += 100;
  if (question.reviewed_by) score += 20;
  if (question.content_prompt_version === 'deeper-ai-concerns-sprint-v1') score -= 25;
  if (title.includes('?')) score += 12;
  if (/^(how|what|why|when|can|do|is|are|should|could|would)\b/i.test(title)) score += 10;
  if (title.length <= 56) score += 8;
  if (title.length > 72) score -= 12;
  if (title.length > 90) score -= 20;
  if (/^How to /i.test(title)) score -= 6;

  return score;
}

function pickStrongestQuestions(questions: Question[], limit = 3): Question[] {
  const ranked = [...questions].sort((a, b) => {
    const scoreDelta = discoveryScore(b) - discoveryScore(a);
    if (scoreDelta !== 0) return scoreDelta;
    return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
  });

  const picked: Question[] = [];
  const usedTopics = new Set<string>();

  for (const question of ranked) {
    if (picked.length >= limit) break;
    const topicSlug = getCanonicalTopic(question.category || question.raw_category || question.primary_theme).slug;
    if (usedTopics.has(topicSlug) && picked.length < limit - 1) continue;
    usedTopics.add(topicSlug);
    picked.push(question);
  }

  if (picked.length < limit) {
    for (const question of ranked) {
      if (picked.length >= limit) break;
      if (picked.some((item) => item.slug === question.slug)) continue;
      picked.push(question);
    }
  }

  return picked;
}

function getGroupDiscoveryLinks(slugs: string[], questions: Question[], limit = 3): EditorialDiscoveryLink[] {
  const slugSet = new Set(slugs);
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  const candidates: Question[] = [];
  const seen = new Set<string>();

  const matchesGroup = (question: Question) => {
    const topic = getCanonicalTopic(question.category || question.raw_category || question.primary_theme);
    return slugSet.has(topic.slug);
  };

  const pushQuestion = (question: Question) => {
    if (seen.has(question.slug)) return;
    seen.add(question.slug);
    candidates.push(question);
  };

  for (const slug of trendingAnswerSlugs) {
    const question = bySlug.get(slug);
    if (!question || !matchesGroup(question)) continue;
    pushQuestion(question);
  }

  const matching = questions.filter(matchesGroup);
  for (const question of matching) {
    pushQuestion(question);
  }

  return pickStrongestQuestions(candidates, limit).map((question) => ({
    title: formatDiscoveryQuestion(question),
    href: answerPath(question.slug),
  }));
}

export function getEditorialTopicDirectory(questions: Question[]): EditorialTopicGroup[] {
  const summaries = new Map(getCanonicalTopicSummaries(questions).map((topic) => [topic.slug, topic]));

  return EDITORIAL_TOPIC_GROUPS.map((group) => ({
    name: group.name,
    description: group.description,
    topics: group.slugs
      .map((slug) => summaries.get(slug))
      .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic))
      .map((topic) => ({
        name: topic.name,
        slug: topic.slug,
        count: topic.count,
        href: topicDirectoryHref(topic.slug, questions),
      })),
    discoveryLinks: getGroupDiscoveryLinks(group.slugs, questions),
  })).filter((group) => group.topics.length > 0);
}
