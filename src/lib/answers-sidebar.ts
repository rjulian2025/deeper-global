import { answerPath, getAnswerDisplayTitle } from '@/lib/content';
import { getTrendingQuestions } from '@/lib/engagement';
import { themeClusters } from '@/lib/theme-directory';
import type { Question } from '@/lib/supabase';

export type AnswersSidebarLink = {
  title: string;
  href: string;
};

export type AnswersSidebarData = {
  /** Editorially curated highlights — not live analytics traffic. */
  featuredAnswers: AnswersSidebarLink[];
  recentlyAdded: AnswersSidebarLink[];
  browseTopics: AnswersSidebarLink[];
  askAnythingHref: string;
  randomAnswerHref: string;
};

function questionTimestamp(question: Question): number {
  const value = question.updated_at || question.created_at;
  return value ? Date.parse(value) : 0;
}

function getIsoWeek(date: Date): number {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function clusterRotationScore(slug: string, week: number): number {
  let hash = week;
  for (const char of slug) {
    hash = (Math.imul(31, hash) + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

/**
 * Rotates which theme clusters surface in the sidebar by ISO week so the set
 * stays stable across pagination within the same build/week.
 */
export function getBrowseTopicLinks(asOf: Date = new Date()): AnswersSidebarLink[] {
  const week = getIsoWeek(asOf);

  return [...themeClusters]
    .sort((a, b) => clusterRotationScore(a.slug, week) - clusterRotationScore(b.slug, week))
    .slice(0, 3)
    .map((cluster) => ({
      title: cluster.name,
      href: `/themes/#theme-cluster-${cluster.slug}`,
    }));
}

export function buildAnswersSidebarData(questions: Question[], asOf: Date = new Date()): AnswersSidebarData {
  const featuredQuestions = getTrendingQuestions(questions, 3);
  const featuredSlugs = new Set(featuredQuestions.map((question) => question.slug));

  const recentlyAdded = [...questions]
    .filter((question) => !featuredSlugs.has(question.slug))
    .sort((a, b) => questionTimestamp(b) - questionTimestamp(a))
    .slice(0, 2);

  return {
    featuredAnswers: featuredQuestions.map((question) => ({
      title: getAnswerDisplayTitle(question),
      href: answerPath(question.slug),
    })),
    recentlyAdded: recentlyAdded.map((question) => ({
      title: getAnswerDisplayTitle(question),
      href: answerPath(question.slug),
    })),
    browseTopics: getBrowseTopicLinks(asOf),
    askAnythingHref: '/answers/#answer-search-input',
    randomAnswerHref: '/answers/random/',
  };
}
