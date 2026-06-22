import { answerPath, getAnswerDisplayTitle, getDisplayLede } from '@/lib/content';
import { pickCuriosityQuestions } from '@/lib/homepage-curiosity';
import type { Question } from '@/lib/supabase';

export type HeroHookItem = {
  title: string;
  href: string;
  teaser: string;
  placeholder: string;
};

export type HeroStatCounter = {
  numericValue: number | null;
  displayValue: string;
  label: string;
};

const TEASER_WORD_COUNT = 20;

export function truncateWords(value: string, maxWords = TEASER_WORD_COUNT): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return value.trim();
  return `${words.slice(0, maxWords).join(' ')}…`;
}

export function buildHeroHookItems(questions: Question[], limit = 6): HeroHookItem[] {
  const picked = pickCuriosityQuestions(questions, limit);

  return picked.map((question) => {
    const title = getAnswerDisplayTitle(question);
    const lede = getDisplayLede(question);

    return {
      title,
      href: answerPath(question.slug),
      teaser: truncateWords(lede),
      placeholder: title.endsWith('?') ? title : `${title}?`,
    };
  });
}

export function estimateHeroRotatingMinHeight(items: HeroHookItem[]): string {
  if (!items.length) return '8rem';

  const longestTitle = items.reduce(
    (longest, item) => (item.title.length > longest.length ? item.title : longest),
    '',
  );
  const titleLines = Math.min(3, Math.max(2, Math.ceil(longestTitle.length / 36)));
  const titleBlockRem = titleLines * 3.125 * 1.12;
  const teaserBlockRem = 1.5 * 1.5;

  return `${(titleBlockRem + teaserBlockRem + 0.75).toFixed(2)}rem`;
}

export function buildHeroStatCounters(questions: Question[], categoryCount: number): HeroStatCounter[] {
  const reviewedCount = questions.filter((question) => question.reviewed_by).length;

  return [
    {
      numericValue: questions.length || null,
      displayValue: questions.length ? questions.length.toLocaleString() : '1,000+',
      label: 'Vetted answers',
    },
    {
      numericValue: categoryCount || null,
      displayValue: categoryCount ? categoryCount.toLocaleString() : '38',
      label: 'Topic areas',
    },
    reviewedCount > 0
      ? {
          numericValue: reviewedCount,
          displayValue: reviewedCount.toLocaleString(),
          label: 'Clinically reviewed',
        }
      : {
          numericValue: null,
          displayValue: '✓',
          label: 'Evidence-based',
        },
  ];
}
