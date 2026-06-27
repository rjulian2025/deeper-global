import type { Question } from './supabase';
import { shouldIndexQuestion } from './content';

/** Slugs that 301 to a canonical answer via vercel.json — do not publish or sitemap. */
export const REDIRECT_SOURCE_SLUGS = new Set([
  'can-i-drink-alcohol-while-taking-psychiatric-medication',
  'can-stress-and-anxiety-really-cause-stomach-problems',
  'how-do-i-deal-with-feeling-like-im-not-interesting-enough',
  'how-do-i-deal-with-feeling-like-im-too-much-for-people',
  'how-do-i-deal-with-intrusive-sexual-thoughts',
  'how-do-i-deal-with-not-having-anyone-to-call-in-an-emergency',
  'how-do-i-deal-with-panic-attacks-at-work',
  'how-do-i-deal-with-people-who-dont-support-my-recovery',
  'how-do-i-deal-with-seeing-my-ex-with-someone-new',
  'how-do-i-decide-what-to-do-with-their-belongings',
  'how-do-i-help-my-anxious-child-without-making-it-worse',
  'how-do-i-integrate-psychedelic-experiences-into-my-daily-life',
  'how-do-i-know-if-im-experiencing-spiritual-bypassing',
  'how-do-i-manage-panic-attacks-while-in-public',
  'how-do-i-stop-feeling-guilty-about-my-past-mistakes',
  'how-do-i-stop-feeling-like-i-need-to-earn-my-place-everywhere',
  'how-do-i-stop-feeling-like-i-need-to-prove-myself-constantly',
  'how-do-i-stop-feeling-like-im-a-burden-to-others',
  'how-do-i-stop-feeling-like-im-behind-everyone-else-professionally',
  'what-if-i-become-dependent-on-anxiety-medication',
  'whats-the-difference-between-healthy-and-toxic-masculinity',
  'why-do-i-feel-disconnected-from-my-cultural-food-traditions',
  'why-do-i-feel-furious-over-small-things-that-shouldnt-matter',
  'why-do-i-feel-guilty-about-taking-sick-days-for-mental-health',
  'why-do-i-feel-guilty-for-being-happy-after-my-breakup',
  'why-do-i-feel-guilty-for-doubting-my-faith',
  'why-do-i-feel-like-i-have-to-be-perfect-all-the-time',
  'why-do-i-feel-like-ill-never-find-love-again',
  'why-do-i-feel-like-im-living-someone-elses-life',
  'why-do-i-feel-like-im-never-enough-for-anyone',
  'why-do-i-feel-like-im-not-allowed-to-have-problems',
  'why-do-i-feel-lonely-even-when-im-around-people',
  'why-do-i-feel-more-like-myself-when-interacting-with-ai-than-in-real-life',
  'why-do-i-feel-so-angry-all-the-time',
  'why-do-i-feel-spiritually-empty-despite-having-everything-i-thought-i-wanted',
  'why-do-i-get-trembling-hands-when-im-nervous',
  'why-do-i-shut-down-emotionally-when-conflict-starts',
  'why-does-my-chest-feel-tight-when-im-anxious',
  'why-does-my-teenager-seem-to-hate-spending-time-with-family',
  'why-does-my-throat-feel-tight-when-im-stressed',
  'how-do-i-find-motivation-when-im-depress-190648-011',
  'how-do-i-stop-feeling-guilty-about-setti-177940-013',
  'how-do-i-stop-overthinking-every-conversation-i-have-e5f6g7',
  'why-do-i-feel-empty-even-when-my-life-looks-177941-018',
  'why-do-i-feel-guilty-when-im-happy-177941-002',
  'why-do-i-feel-like-im-failing-at-everyth-177940-030',
  'why-do-i-feel-like-im-pretending-to-be-s-177940-018',
  'why-do-i-feel-so-lonely-even-when-im-surrounded-by-people-p7q8r9',
  'why-am-i-losing-faith-in-everything-i-used-to-believe',
  'how-do-i-find-my-purpose-when-nothing-feels-meaningful-h8i9j1',
  'why-do-i-feel-guilty-for-doubting-my-fai-181083-035',
]);

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

/** Paths excluded from sitemap.xml — URLs remain live; crawl budget only. */
export function shouldIncludePathInSitemap(pathname: string) {
  const path = pathname.endsWith('/') || pathname.includes('.') ? pathname : `${pathname}/`;

  if (path.startsWith('/entities/') || path.startsWith('/categories/')) return false;
  if (path.startsWith('/design-evolution/')) return false;
  if (path === '/answers/random/') return false;

  return shouldIncludeAnswerPathInSitemap(path);
}
