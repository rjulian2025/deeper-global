import { ADHD_HUB_PROMPT_VERSION, isAdhdHubSlug } from './adhd-hub';
import { isAiMentalHealthHubSlug, isAiMentalHealthSprintQuestion } from './ai-mental-health-hub';
import { getAnswerDisplayTitle } from './content';
import { trendingAnswerSlugs } from './engagement';
import { getCanonicalTopic } from './taxonomy';
import type { Question } from './supabase';

/** Broad-appeal topics surface first; niche sprint clusters defer to later pages. */
const LIBRARY_TOPIC_PRIORITY: string[] = [
  'relationships-and-communication',
  'anxiety-and-stress',
  'depression',
  'grief-and-loss',
  'identity-and-self-worth',
  'loneliness-and-belonging',
  'therapy-and-care-navigation',
  'trauma-and-safety',
  'work-and-burnout',
  'family-and-parenting',
  'addiction-and-recovery',
  'meaning-faith-and-existential-questions',
  'gender-sexuality-and-intimacy',
  'teens-and-identity',
  'general-mental-health',
  'neurodivergence-and-attention',
];

const FIRST_PAGE_SIZE = 48;
const FIRST_PAGE_ADHD_CAP = 2;
const FIRST_PAGE_AI_CAP = 2;
const DEFERRED_INSERT_START = 22;

type LibraryLane = 'standard' | 'adhd' | 'ai';

function questionTimestamp(question: Question): number {
  const value = question.updated_at || question.created_at;
  return value ? Date.parse(value) : 0;
}

function isAdhdThemedQuestion(question: Question): boolean {
  if (isAdhdHubSlug(question.slug)) return true;
  if (question.content_prompt_version === ADHD_HUB_PROMPT_VERSION) return true;

  const slug = question.slug.toLowerCase();
  const title = getAnswerDisplayTitle(question).toLowerCase();

  return (
    /\badhd\b/.test(slug) ||
    /executive-dysfunction|rejection-sensitive|time-blindness/.test(slug) ||
    /\badhd\b/.test(title) ||
    /executive dysfunction|rejection sensitive dysphoria|time blindness/.test(title)
  );
}

function isAiThemedQuestion(question: Question): boolean {
  if (isAiMentalHealthHubSlug(question.slug)) return true;
  if (isAiMentalHealthSprintQuestion(question)) return true;

  const slug = question.slug.toLowerCase();
  const title = getAnswerDisplayTitle(question).toLowerCase();

  return (
    /\b(ai|chatbot|chat-bot|ai-companion|ai-psychosis|deepfake|virtual-companion)\b/.test(slug) ||
    /\b(ai chatbot|chatbot|ai companion|artificial intelligence|ai psychosis|ai-generated|deepfake|virtual companion)\b/.test(
      title
    ) ||
    (/\bai\b/.test(title) &&
      /\b(future|work|lonely|ashamed|rely|dependent|companion|psychosis|paranoid|replacing|sentient)\b/.test(title))
  );
}

function getLibraryLane(question: Question): LibraryLane {
  if (isAdhdThemedQuestion(question)) return 'adhd';
  if (isAiThemedQuestion(question)) return 'ai';
  return 'standard';
}

function getLibraryTopicSlug(question: Question): string {
  return getCanonicalTopic(question.category || question.raw_category || question.primary_theme).slug;
}

/** Rank within a topic bucket — favors curiosity-friendly titles over recency alone. */
export function libraryDiscoveryScore(question: Question): number {
  let score = 0;
  const title = getAnswerDisplayTitle(question);

  if (trendingAnswerSlugs.includes(question.slug)) score += 40;
  if (question.reviewed_by) score += 18;
  if (title.includes('?')) score += 14;
  if (/^(how|what|why|when|can|do|is|are|should|could|would)\b/i.test(title)) score += 12;
  if (title.length <= 56) score += 10;
  if (title.length > 72) score -= 10;
  if (title.length > 90) score -= 18;
  if (/^How to /i.test(title)) score -= 8;
  if (/^(why do i|why does|what if|how do i know if)\b/i.test(title)) score += 8;

  return score;
}

function compareLibraryQuestions(a: Question, b: Question): number {
  const scoreDelta = libraryDiscoveryScore(b) - libraryDiscoveryScore(a);
  if (scoreDelta !== 0) return scoreDelta;
  return questionTimestamp(b) - questionTimestamp(a);
}

function sortTopicBuckets(buckets: Map<string, Question[]>) {
  for (const list of buckets.values()) {
    list.sort(compareLibraryQuestions);
  }
}

function roundRobinByTopic(buckets: Map<string, Question[]>, topicOrder: string[]): Question[] {
  const ordered: Question[] = [];
  const queues = new Map(topicOrder.map((topic) => [topic, [...(buckets.get(topic) ?? [])]]));

  while (queues.size > 0) {
    let pickedThisRound = false;

    for (const topic of topicOrder) {
      const queue = queues.get(topic);
      if (!queue?.length) {
        queues.delete(topic);
        continue;
      }

      ordered.push(queue.shift()!);
      pickedThisRound = true;

      if (!queue.length) {
        queues.delete(topic);
      }
    }

    if (!pickedThisRound) break;
  }

  return ordered;
}

function insertDeferredWithCaps(
  primary: Question[],
  deferred: Question[],
  options: {
    startIndex: number;
    maxInFirstPage: number;
    spacing: number;
    firstPageSize: number;
  }
): Question[] {
  if (!deferred.length) return primary;

  const result = [...primary];
  let insertedInFirstPage = 0;
  let insertAt = options.startIndex;
  let deferredIndex = 0;

  while (deferredIndex < deferred.length) {
    const onFirstPage = insertAt < options.firstPageSize;

    if (onFirstPage && insertedInFirstPage >= options.maxInFirstPage) {
      insertAt = options.firstPageSize;
      continue;
    }

    insertAt = Math.min(Math.max(insertAt, 0), result.length);
    result.splice(insertAt, 0, deferred[deferredIndex]!);
    deferredIndex += 1;
    insertedInFirstPage += onFirstPage ? 1 : 0;
    insertAt += options.spacing + 1;
  }

  return result;
}

/**
 * Re-sequence the answer library for browse surfaces: interleave canonical topics,
 * lead with curiosity-friendly titles, and keep ADHD / AI hub sprint content from
 * dominating page 1.
 */
export function orderAnswersLibrary(questions: Question[]): Question[] {
  const standardBuckets = new Map<string, Question[]>();
  const adhdPool: Question[] = [];
  const aiPool: Question[] = [];

  for (const question of questions) {
    const lane = getLibraryLane(question);

    if (lane === 'adhd') {
      adhdPool.push(question);
      continue;
    }

    if (lane === 'ai') {
      aiPool.push(question);
      continue;
    }

    const topic = getLibraryTopicSlug(question);
    const bucket = standardBuckets.get(topic) ?? [];
    bucket.push(question);
    standardBuckets.set(topic, bucket);
  }

  sortTopicBuckets(standardBuckets);
  adhdPool.sort(compareLibraryQuestions);
  aiPool.sort(compareLibraryQuestions);

  const activeTopics = [
    ...LIBRARY_TOPIC_PRIORITY.filter((topic) => standardBuckets.has(topic)),
    ...[...standardBuckets.keys()].filter((topic) => !LIBRARY_TOPIC_PRIORITY.includes(topic)),
  ];

  let ordered = roundRobinByTopic(standardBuckets, activeTopics);

  ordered = insertDeferredWithCaps(ordered, adhdPool, {
    startIndex: DEFERRED_INSERT_START,
    maxInFirstPage: FIRST_PAGE_ADHD_CAP,
    spacing: 10,
    firstPageSize: FIRST_PAGE_SIZE,
  });

  ordered = insertDeferredWithCaps(ordered, aiPool, {
    startIndex: DEFERRED_INSERT_START + 4,
    maxInFirstPage: FIRST_PAGE_AI_CAP,
    spacing: 10,
    firstPageSize: FIRST_PAGE_SIZE,
  });

  const seen = new Set(ordered.map((question) => question.slug));
  for (const question of questions) {
    if (!seen.has(question.slug)) {
      ordered.push(question);
      seen.add(question.slug);
    }
  }

  return ordered;
}
