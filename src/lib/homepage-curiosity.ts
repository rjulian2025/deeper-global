import { displayCategory, getAnswerDisplayTitle, getAnswerSummary } from '@/lib/content';
import type { Question } from '@/lib/supabase';

const CURIOSITY_SIGNALS = [
  'anxious',
  'anxiety',
  'overthink',
  'replay',
  'shut down',
  'shutdown',
  'emotionally unavailable',
  'relationship',
  'panic',
  'freeze',
  'numb',
  'guilt',
  'lonely',
  'alone',
  'burnout',
  'depressed',
  'exhausted',
  'trauma',
  'attachment',
  'avoid',
  'people-pleasing',
  'self-worth',
  'control',
  'focus',
];

const PRIVATE_QUESTION_STARTERS = /^(why|how|what|is|can|could|do|does|should|am)\b/i;

export type CuriosityPickOptions = {
  maxPerCategory?: number;
  maxAdhdQuestions?: number;
  maxPerTopicCluster?: number;
  excludeSlugs?: Iterable<string>;
};

export type HomepageCuriosityLayout = {
  heroRotating: Question[];
  heroPopular: Question[];
  feed: Question[];
  sidebarAskingNow: Question[];
  featured: Question | null;
};

function questionTimestamp(question: Question): number {
  const value = question.updated_at || question.created_at;
  return value ? Date.parse(value) : 0;
}

function questionText(question: Question) {
  return [
    getAnswerDisplayTitle(question),
    question.question,
    getAnswerSummary(question),
    displayCategory(question),
    question.primary_theme,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function topicCluster(question: Question): string {
  const text = questionText(question);
  const category = displayCategory(question).toLowerCase();

  if (/\b(ai|chatbot|artificial intelligence|deepfake|griefbot)\b/.test(text)) return 'ai';
  if (/\b(relationship|partner|marriage|dating|breakup|divorce|intimacy)\b/.test(text)) return 'relationships';
  if (/\b(adhd|attention deficit|neurodiverg)\b/.test(text)) return 'adhd';
  if (/\b(anxiet|panic|worry|overthink)\b/.test(text)) return 'anxiety';
  if (/\b(depress|hopeless|numb|sadness)\b/.test(text)) return 'depression';
  if (/\b(trauma|ptsd|flashback)\b/.test(text)) return 'trauma';
  if (/\b(addict|recovery|relapse|substance|sober)\b/.test(text)) return 'recovery';
  if (/\b(burnout|work|job|career|impostor)\b/.test(text)) return 'work';
  if (/\b(grief|loss|bereav)\b/.test(text)) return 'grief';
  if (/\b(parent|child|family|teen)\b/.test(text)) return 'family';
  if (/\b(self-worth|shame|identity|lonely|alone)\b/.test(text)) return 'identity';

  return category || 'general';
}

function curiosityScore(question: Question) {
  const title = getAnswerDisplayTitle(question);
  const text = questionText(question);
  let score = 0;

  if (title.includes('?')) score += 20;
  if (PRIVATE_QUESTION_STARTERS.test(title)) score += 18;
  if (/^(what are the|what is|what's the signs?|symptoms of)\b/i.test(title)) score -= 14;
  if (/adhd/i.test(text)) score -= 12;
  if (/therapy|therapist|cbt|dbt|modality|diagnosis/i.test(text)) score -= 8;

  for (const signal of CURIOSITY_SIGNALS) {
    if (text.includes(signal)) score += 12;
  }

  if (title.length >= 38 && title.length <= 82) score += 8;
  if (title.length > 96) score -= 10;
  if (question.reviewed_by) score += 6;

  return score;
}

export function pickCuriosityQuestions(
  source: Question[],
  limit: number,
  options: CuriosityPickOptions = {},
) {
  const maxPerCategory = options.maxPerCategory ?? 2;
  const maxAdhdQuestions = options.maxAdhdQuestions ?? 1;
  const maxPerTopicCluster = options.maxPerTopicCluster ?? maxPerCategory;
  const excluded = new Set(options.excludeSlugs ?? []);

  const pool = source.filter((question) => !excluded.has(question.slug));
  const ranked = [...pool].sort((a, b) => {
    const scoreDelta = curiosityScore(b) - curiosityScore(a);
    if (scoreDelta !== 0) return scoreDelta;
    return questionTimestamp(b) - questionTimestamp(a);
  });

  const picked: Question[] = [];
  const categoryCounts = new Map<string, number>();
  const clusterCounts = new Map<string, number>();
  let adhdCount = 0;

  for (const question of ranked) {
    if (picked.length >= limit) break;
    const text = questionText(question);
    const category = displayCategory(question);
    const cluster = topicCluster(question);
    const categoryCount = categoryCounts.get(category) ?? 0;
    const clusterCount = clusterCounts.get(cluster) ?? 0;
    const isAdhd = /adhd|attention deficit|neurodivergence/.test(text);

    if (categoryCount >= maxPerCategory) continue;
    if (clusterCount >= maxPerTopicCluster) continue;
    if (isAdhd && adhdCount >= maxAdhdQuestions) continue;

    picked.push(question);
    categoryCounts.set(category, categoryCount + 1);
    clusterCounts.set(cluster, clusterCount + 1);
    if (isAdhd) adhdCount += 1;
  }

  if (picked.length < limit) {
    for (const question of ranked) {
      if (picked.length >= limit) break;
      if (picked.some((item) => item.slug === question.slug)) continue;
      picked.push(question);
    }
  }

  if (picked.length) return picked;
  return pool.slice(0, limit);
}

function collectSlugs(...groups: Question[][]) {
  return new Set(groups.flat().map((question) => question.slug));
}

export function buildHomepageCuriosityLayout(questions: Question[]): HomepageCuriosityLayout {
  const heroRotating = pickCuriosityQuestions(questions, 6, {
    maxPerCategory: 1,
    maxPerTopicCluster: 1,
    maxAdhdQuestions: 1,
  });

  const heroPopular = pickCuriosityQuestions(questions, 4, {
    excludeSlugs: collectSlugs(heroRotating),
    maxPerCategory: 1,
    maxPerTopicCluster: 1,
    maxAdhdQuestions: 1,
  });

  const feed = pickCuriosityQuestions(questions, 6, {
    excludeSlugs: collectSlugs(heroRotating, heroPopular),
    maxPerCategory: 1,
    maxPerTopicCluster: 1,
    maxAdhdQuestions: 1,
  });

  const sidebarAskingNow = pickCuriosityQuestions(questions, 3, {
    excludeSlugs: collectSlugs(heroRotating, heroPopular, feed),
    maxPerCategory: 1,
    maxPerTopicCluster: 1,
    maxAdhdQuestions: 1,
  });

  const usedSlugs = collectSlugs(heroRotating, heroPopular, feed, sidebarAskingNow);
  const [featured] = pickCuriosityQuestions(questions, 1, {
    excludeSlugs: usedSlugs,
    maxPerCategory: 1,
    maxPerTopicCluster: 1,
    maxAdhdQuestions: 1,
  });

  return {
    heroRotating,
    heroPopular,
    feed,
    sidebarAskingNow,
    featured: featured ?? null,
  };
}
