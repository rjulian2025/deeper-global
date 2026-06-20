import type { Question } from './supabase';

export const ADHD_HUB_PATH = '/adhd';
export const ADHD_HUB_PROMPT_VERSION = 'deeper-adhd-hub-v1';

export const adhdFeaturedSlugs = [
  'how-do-i-know-if-i-have-adhd-as-an-adult',
  'what-is-executive-dysfunction-and-how-does-it-affect-daily-life',
  'how-do-i-manage-adhd-without-medication',
];

export const adhdHubClusters = [
  {
    name: 'Diagnosis, signs, and getting clarity',
    description: 'For adults wondering whether ADHD fits, how testing works, and how ADHD shows up in women and daily life.',
    slugs: [
      'how-do-i-know-if-i-have-adhd-as-an-adult',
      'what-is-adhd-and-how-is-it-different-from-just-being-distracted',
      'how-do-i-get-tested-for-adhd-as-an-adult',
      'what-are-the-signs-of-adhd-in-women',
      'can-trauma-look-like-adhd',
      'what-is-the-difference-between-adhd-and-bipolar-disorder',
    ],
  },
  {
    name: 'Executive function, focus, and daily tasks',
    description: 'For time blindness, procrastination, overwhelm with simple tasks, motivation, and getting things done.',
    slugs: [
      'what-is-executive-dysfunction-and-how-does-it-affect-daily-life',
      'how-do-i-cope-with-adhd-time-blindness',
      'how-do-i-stop-procrastinating-when-im-afraid-of-no-187459-013',
      'how-do-i-stop-forgetting-things-with-adhd',
      'is-hyperfocus-a-symptom-of-adhd',
      'why-do-i-feel-overwhelmed-by-simple-dail-190648-007',
      'why-do-i-feel-like-i-cant-handle-normal-adult-184730-088',
      'can-depression-make-basic-tasks-hard',
    ],
  },
  {
    name: 'Emotional overwhelm and rejection sensitivity',
    description: 'For intense emotions, shame after small setbacks, and feeling flooded when life asks too much at once.',
    slugs: [
      'why-do-i-get-so-emotionally-overwhelmed-with-adhd',
      'what-is-rejection-sensitive-dysphoria-and-adhd',
      'how-do-i-stop-feeling-overwhelmed-by-everything',
      'how-do-i-function-when-anxiety-makes-everything-feel-overwhelming',
      'can-adhd-cause-anxiety-and-depression',
    ],
  },
  {
    name: 'Treatment, medication, and routines',
    description: 'For medication decisions, building sustainable routines, burnout recovery, and non-medication supports.',
    slugs: [
      'how-do-i-manage-adhd-without-medication',
      'how-do-adhd-medications-work',
      'how-do-i-build-routines-with-adhd',
      'how-do-i-manage-adhd-burnout',
      'how-do-i-find-motivation-when-im-depressed-z8a9b1',
    ],
  },
  {
    name: 'Work, school, and accommodations',
    description: 'For focus at work, explaining ADHD to employers, accommodations, and learning with ADHD.',
    slugs: [
      'how-do-i-stay-focused-at-work-with-adhd',
      'how-do-i-explain-adhd-to-my-employer',
      'what-workplace-accommodations-help-adults-with-adhd',
      'how-do-i-study-with-adhd',
      'how-do-i-deal-with-feeling-overwhelmed-by-wo-177941-013',
    ],
  },
  {
    name: 'Relationships and communication',
    description: 'For partners, conflict patterns, feeling misunderstood, and talking about ADHD with people you love.',
    slugs: [
      'how-do-i-manage-adhd-in-relationships',
      'what-should-i-tell-my-partner-about-adhd',
      'how-do-i-stop-feeling-overwhelmed-by-social-y7z3a6',
    ],
  },
];

export const adhdHubSlugs = [...new Set(adhdHubClusters.flatMap((cluster) => cluster.slugs))];

export function isAdhdHubSlug(slug: string) {
  return adhdHubSlugs.includes(slug);
}

export function getAdhdHubQuestions(questions: Question[]) {
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  return adhdHubSlugs
    .map((slug) => bySlug.get(slug))
    .filter((question): question is Question => Boolean(question));
}

export function getAdhdHubClusterCards(questions: Question[]) {
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  return adhdHubClusters.map((cluster) => ({
    ...cluster,
    questions: cluster.slugs
      .map((slug) => bySlug.get(slug))
      .filter((question): question is Question => Boolean(question)),
  }));
}
