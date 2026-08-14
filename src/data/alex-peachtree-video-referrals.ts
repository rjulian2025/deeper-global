/**
 * Contextual Peachtree video links for clinically related Deeper answers.
 * Peachtree remains the canonical transcript/consultation destination.
 */

const PEACHTREE = 'https://peachtreepsychology.com';

function peachtreeVideoUrl(slug: string) {
  return `${PEACHTREE}/answers/${slug}?utm_source=deeper_global&utm_medium=referral&utm_campaign=deeper_network&utm_content=alex_video_${slug}`;
}

export type AlexPeachtreeVideoReferral = {
  title: string;
  teaser: string;
  href: string;
};

const byDeeperSlug: Record<string, AlexPeachtreeVideoReferral> = {
  'how-do-i-know-if-i-have-adhd-as-an-adult': {
    title: '7 Signs of Adult ADHD a Psychologist Wants You to Know',
    teaser: 'Watch Dr. Alex Crenshaw explain common adult ADHD signs, with transcript on Peachtree.',
    href: peachtreeVideoUrl('signs-of-adult-adhd'),
  },
  'what-is-adhd-and-how-is-it-different-from-just-being-distracted': {
    title: 'Is It Just a Busy Week, or ADHD?',
    teaser: 'Where everyday distraction ends and consistent functional interference begins.',
    href: peachtreeVideoUrl('busy-week-or-adhd'),
  },
  'can-adhd-cause-anxiety-and-depression': {
    title: 'ADHD vs. Stress, Anxiety & Burnout',
    teaser: 'Why attention problems are often confused, and why assessment disentangles causes.',
    href: peachtreeVideoUrl('adhd-vs-stress-anxiety-burnout'),
  },
  'can-trauma-look-like-adhd': {
    title: 'ADHD vs. Stress, Anxiety & Burnout',
    teaser: 'A short clinician video on look-alike attention problems and comprehensive evaluation.',
    href: peachtreeVideoUrl('adhd-vs-stress-anxiety-burnout'),
  },
  'how-do-i-get-tested-for-adhd-as-an-adult': {
    title: 'Online ADHD Quiz vs. Real Evaluation',
    teaser: 'What a multi-source evaluation adds beyond a screening questionnaire.',
    href: peachtreeVideoUrl('online-adhd-quiz-vs-evaluation'),
  },
};

export function getAlexPeachtreeVideoReferral(slug: string): AlexPeachtreeVideoReferral | null {
  return byDeeperSlug[slug] ?? null;
}
