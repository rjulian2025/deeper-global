import { answerPath, getAnswerDisplayTitle } from '@/lib/content';
import { getTrendingQuestions } from '@/lib/engagement';
import { homepageStartingPoints } from '@/lib/homepage-starting-points';
import { getUnexpectedOverlapLinks, type UnexpectedOverlapLink } from '@/lib/unexpected-overlaps';
import type { Question } from '@/lib/supabase';

export type HomepageSidebarLink = {
  title: string;
  href: string;
};

export type HomepageSidebarData = {
  askingNow: HomepageSidebarLink[];
  unexpectedOverlaps: UnexpectedOverlapLink[];
  startingPoints: typeof homepageStartingPoints;
  newThisWeek: HomepageSidebarLink[];
  randomAnswerHref: string;
};

function questionTimestamp(question: Question): number {
  const value = question.updated_at || question.created_at;
  return value ? Date.parse(value) : 0;
}

export function buildHomepageSidebarData(questions: Question[], asOf: Date = new Date()): HomepageSidebarData {
  const askingNowQuestions = getTrendingQuestions(questions, 3);
  const askingNowSlugs = new Set(askingNowQuestions.map((question) => question.slug));

  const unexpectedOverlaps = getUnexpectedOverlapLinks(questions, asOf, 3);
  const overlapHrefs = new Set(unexpectedOverlaps.map((link) => link.href));

  const excludedSlugs = new Set([...askingNowSlugs]);
  for (const link of unexpectedOverlaps) {
    const slug = link.href.replace(/^\/answers\//, '').replace(/\/$/, '');
    if (slug) excludedSlugs.add(slug);
  }

  const newThisWeek = [...questions]
    .filter((question) => !excludedSlugs.has(question.slug))
    .sort((a, b) => questionTimestamp(b) - questionTimestamp(a))
    .slice(0, 2)
    .map((question) => ({
      title: getAnswerDisplayTitle(question),
      href: answerPath(question.slug),
    }))
    .filter((link) => !overlapHrefs.has(link.href));

  return {
    askingNow: askingNowQuestions.map((question) => ({
      title: getAnswerDisplayTitle(question),
      href: answerPath(question.slug),
    })),
    unexpectedOverlaps,
    startingPoints: homepageStartingPoints,
    newThisWeek,
    randomAnswerHref: '/answers/random/',
  };
}
