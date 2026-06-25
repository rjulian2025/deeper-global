import type { Question } from './supabase';

export const ANXIETY_HUB_PATH = '/anxiety';
export const ANXIETY_HUB_PROMPT_VERSION = 'deeper-anxiety-hub-v1';

export const anxietyFeaturedSlugs = [
  'why-do-i-feel-anxious-for-no-reason',
  'my-chest-tightens-whenever-someone-texts-me-unexpectedly',
  'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed',
];

export const anxietyHubClusters = [
  {
    name: 'Physical anxiety and panic',
    description:
      'For chest tightness, racing heart, breathlessness, panic attacks, and the body signals that show up before your mind catches up.',
    slugs: [
      'my-chest-tightens-whenever-someone-texts-me-unexpectedly',
      'why-does-my-chest-feel-tight-when-im-anx-181083-001',
      'how-do-i-know-if-im-having-a-panic-attack-184730-067',
      'what-should-i-do-during-a-panic-attack',
      'can-anxiety-make-me-feel-like-i-cant-bre-181083-011',
      'why-does-my-heart-race-even-when-im-just-181083-005',
    ],
  },
  {
    name: 'Social anxiety and overthinking',
    description:
      'For conversation replay, fear of judgment, awkwardness in groups, and the mental rehearsal that starts hours before you arrive.',
    slugs: [
      'why-do-i-overthink-every-conversation-after-it-happens',
      'how-do-i-stop-overthinking-everything-i-say-and-184730-036',
      'what-is-social-anxiety-and-how-do-i-overcome-it',
      'how-do-i-cope-with-the-fear-of-being-judged-by-others-w5x6y7',
      'why-do-i-feel-awkward-in-social-situatio-181083-074',
      'i-rehearse-conversations-in-my-head-for-hours-before-they-happen',
    ],
  },
  {
    name: 'Worry, uncertainty, and intrusive thoughts',
    description:
      'For anxiety with no clear trigger, catastrophizing, waiting-for-the-other-shoe-to-drop dread, and future-focused spirals.',
    slugs: [
      'why-do-i-feel-anxious-for-no-reason',
      'what-to-do-when-anxious-for-no-clear-reason',
      'why-do-i-worry-about-things-that-havent-181288-006',
      'why-do-i-feel-like-im-always-waiting-for-the-r8s3t6',
      'how-do-i-stop-catastrophizing-every-smal-190219-005',
      'how-do-i-deal-with-anxiety-about-the-future',
    ],
  },
  {
    name: 'Performance, perfectionism, and work stress',
    description:
      'For Sunday-night dread, decision paralysis, money worry, workplace social anxiety, and the pressure to never fall behind.',
    slugs: [
      'how-do-i-deal-with-sunday-night-anxiety-181083-050',
      'how-do-i-deal-with-social-anxiety-at-wor-191368-004',
      'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed',
      'how-do-i-deal-with-the-anxiety-of-making-the-wrong-decision-m4n5o6',
      'why-do-i-feel-anxious-when-i-check-my-ba-181083-027',
      'is-it-normal-to-lose-sleep-over-money-wo-181083-022',
    ],
  },
  {
    name: 'Anxiety, medication, and getting help',
    description:
      'For telling stress from anxiety, knowing when worry is clinical, medication fear, and deciding whether professional support fits.',
    slugs: [
      'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed',
      'how-do-i-know-if-my-anxiety-is-normal-or-184730-038',
      'how-do-i-know-if-i-need-professional-help-for-my-anxiety',
      'how-can-i-manage-my-anxiety-without-medication',
      'is-it-normal-to-be-scared-of-starting-ps-181083-066',
      'whats-the-difference-between-stress-and-anxiety',
    ],
  },
  {
    name: 'Coping, grounding, and when to reach out',
    description:
      'For calming techniques in the moment, sleep disruption, nighttime spirals, and knowing when anxiety needs more than self-help.',
    slugs: [
      'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
      'what-is-grounding-and-how-can-it-help-with-anxiety',
      'how-does-meditation-help-with-anxiety',
      'what-do-i-do-when-my-anxiety-is-so-bad-i-177940-004',
      'why-does-my-anxiety-get-worse-at-night',
      'how-do-i-stop-my-mind-from-racing-when-i-181083-044',
    ],
  },
];

export const anxietyHubSlugs = [...new Set(anxietyHubClusters.flatMap((cluster) => cluster.slugs))];

export function isAnxietyHubSlug(slug: string) {
  return anxietyHubSlugs.includes(slug);
}

export function getAnxietyHubQuestions(questions: Question[]) {
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  return anxietyHubSlugs
    .map((slug) => bySlug.get(slug))
    .filter((question): question is Question => Boolean(question));
}

export function getAnxietyHubClusterCards(questions: Question[]) {
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  return anxietyHubClusters.map((cluster) => ({
    ...cluster,
    questions: cluster.slugs
      .map((slug) => bySlug.get(slug))
      .filter((question): question is Question => Boolean(question)),
  }));
}
