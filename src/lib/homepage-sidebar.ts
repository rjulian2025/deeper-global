import { answerPath, getAnswerDisplayTitle } from '@/lib/content';
import { pickCuriosityQuestions } from '@/lib/homepage-curiosity';
import { homepageStartingPoints } from '@/lib/homepage-starting-points';
import type { Question } from '@/lib/supabase';

export type HomepageSidebarLink = {
  title: string;
  href: string;
};

export type HomepageSidebarData = {
  askingNow: HomepageSidebarLink[];
  startingPoints: typeof homepageStartingPoints;
  newThisWeek: HomepageSidebarLink[];
  randomAnswerHref: string;
};

function questionTimestamp(question: Question): number {
  const value = question.updated_at || question.created_at;
  return value ? Date.parse(value) : 0;
}

export function buildHomepageSidebarData(questions: Question[]): HomepageSidebarData {
  const askingNowQuestions = pickCuriosityQuestions(questions, 3, {
    maxPerCategory: 1,
    maxAdhdQuestions: 1,
  });
  const askingNowSlugs = new Set(askingNowQuestions.map((question) => question.slug));

  const newThisWeek = [...questions]
    .filter((question) => !askingNowSlugs.has(question.slug))
    .sort((a, b) => questionTimestamp(b) - questionTimestamp(a))
    .slice(0, 2)
    .map((question) => ({
      title: getAnswerDisplayTitle(question),
      href: answerPath(question.slug),
    }));

  return {
    askingNow: askingNowQuestions.map((question) => ({
      title: getAnswerDisplayTitle(question),
      href: answerPath(question.slug),
    })),
    startingPoints: homepageStartingPoints,
    newThisWeek,
    randomAnswerHref: '/answers/random/',
  };
}
