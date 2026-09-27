import type { Question } from './supabase';
import { shouldIndexQuestion } from './content';
import { isTopicIndexable } from './topic-content';
// Single source of truth lives under scripts/lib to serve audits and site build.
// Importing an .mjs module from TS is fine at runtime; types default to any.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { REDIRECT_SOURCE_SLUGS as REDIRECT_SOURCE_SLUGS_ARRAY } from '../../scripts/lib/redirect-sources.mjs';

/** Slugs that 301 to a canonical answer via vercel.json — do not publish or sitemap. */
export const REDIRECT_SOURCE_SLUGS = new Set<string>(REDIRECT_SOURCE_SLUGS_ARRAY as string[]);

export function isRedirectSourceSlug(slug: string) {
  return REDIRECT_SOURCE_SLUGS.has(slug);
}

export function shouldPublishAnswerPage(question: Question) {
  return shouldIndexQuestion(question) && !isRedirectSourceSlug(question.slug);
}

export function filterPublishableQuestions(questions: Question[]) {
  return questions.filter(shouldPublishAnswerPage);
}

export function shouldIncludeAnswerPathInSitemap(pathname: string) {
  const match = pathname.match(/\/answers\/([^/]+)\/?$/);
  if (!match) return true;
  const segment = match[1];
  if (segment === 'page') return true;
  return !isRedirectSourceSlug(segment);
}

/** Peachtree contributor profiles prepared in Phase C; noindex + sitemap-excluded until apply approval. */
const PREPARED_NONINDEX_REVIEWER_SLUGS = new Set([
  'laura-hilsen',
  'michaela-hilburn',
  'liz-webb',
  'kelsey-donahue',
  'jackie-malone',
  'jeannine-jannot',
  'lexi-cooper',
  'meredith-price',
  'sarah-evers',
  'samantha-bryant',
  'erin-benator',
  'lynn-lane',
  'lauren-sanders',
  'susan-keenan',
  'amanda-gaines',
  'david-k-gore-phd', // misnamed Ken alias; keep URL, exclude from sitemap
]);

/** Paths excluded from sitemap.xml — URLs remain live; crawl budget only. */
export function shouldIncludePathInSitemap(pathname: string) {
  const path = pathname.endsWith('/') || pathname.includes('.') ? pathname : `${pathname}/`;

  if (path.startsWith('/entities/') || path.startsWith('/categories/')) return false;
  // Organization contributor pages stay out of sitemap until activation approval.
  if (path.startsWith('/organizations/')) return false;
  const reviewerMatch = path.match(/^\/reviewers\/([^/]+)\/$/);
  if (reviewerMatch && PREPARED_NONINDEX_REVIEWER_SLUGS.has(reviewerMatch[1])) return false;
  if (path.startsWith('/topics/')) {
    // /topics/ itself (the index) always stays out; child topic pages are an allowlist
    // driven by topic-content.ts `indexable`, not a blanket prefix exclusion.
    const match = path.match(/^\/topics\/([^/]+)\/$/);
    if (!match) return false;
    return isTopicIndexable(match[1]);
  }
  if (path.startsWith('/design-evolution/')) return false;
  if (path === '/answers/random/') return false;

  return shouldIncludeAnswerPathInSitemap(path);
}
