import type { Question } from './supabase';

export const AI_MENTAL_HEALTH_HUB_PATH = '/ai-mental-health';
export const AI_MENTAL_HEALTH_PROMPT_VERSION = 'deeper-ai-concerns-sprint-v1';

export const aiMentalHealthFeaturedSlugs = [
  'can-ai-chatbots-make-delusional-thoughts-worse',
  'what-is-ai-psychosis-and-is-it-a-real-diagnosis',
  'can-using-ai-for-emotional-support-become-addictive',
];

export const aiMentalHealthClusters = [
  {
    name: 'Reality testing and AI psychosis',
    description: 'For searches about delusional spirals, paranoia, sentience beliefs, grandiosity, and emergency thresholds.',
    slugs: [
      'can-ai-chatbots-make-delusional-thoughts-worse',
      'what-is-ai-psychosis-and-is-it-a-real-diagnosis',
      'how-to-tell-if-ai-conversation-is-making-me-paranoid',
      'what-if-ai-chatbot-says-i-have-a-special-mission',
      'what-if-i-think-an-ai-chatbot-is-sentient',
      'when-are-ai-related-beliefs-a-mental-health-emergency',
    ],
  },
  {
    name: 'Dependency, attachment, and loneliness',
    description: 'For people who feel emotionally dependent on AI, attached to a companion, or isolated from real-world support.',
    slugs: [
      'how-to-know-if-too-emotionally-dependent-on-ai',
      'can-using-ai-for-emotional-support-become-addictive',
      'take-a-break-from-ai-without-feeling-abandoned',
      'can-ai-companions-reduce-loneliness-or-make-it-worse',
      'why-ai-companion-feels-more-comforting-than-real-people',
      'can-ai-make-isolation-feel-normal',
    ],
  },
  {
    name: 'Therapy, advice, and crisis boundaries',
    description: 'For deciding when AI is useful reflection, when it is bad advice, and when a real person needs to be involved.',
    slugs: [
      'how-to-know-if-ai-is-helping-therapy-or-replacing-it',
      'should-i-tell-my-therapist-how-much-i-use-ai',
      'can-ai-give-bad-mental-health-advice',
      'when-should-i-stop-using-ai-and-talk-to-a-real-person',
      'can-ai-therapy-apps-replace-a-licensed-therapist',
      'can-an-ai-chatbot-make-suicidal-thoughts-worse',
    ],
  },
  {
    name: 'Teens, parents, and AI companions',
    description: 'For parents trying to understand teen attachment, AI best-friend dynamics, and companion-risk boundaries.',
    slugs: [
      'how-to-know-if-teenager-is-too-attached-to-ai',
      'should-parents-limit-ai-companion-use-for-teens',
      'what-if-my-child-says-ai-is-their-best-friend',
      'can-ai-companions-be-risky-for-lonely-teens',
      'how-to-talk-to-teenager-about-ai-relationships',
    ],
  },
  {
    name: 'Work, identity, and AI anxiety',
    description: 'For job insecurity, replaceability, workplace monitoring, burnout, creativity, and future fear.',
    slugs: [
      'why-am-i-anxious-about-ai-replacing-my-job',
      'how-to-handle-feeling-replaceable-because-of-ai',
      'can-ai-workplace-monitoring-affect-mental-health',
      'can-ai-make-burnout-worse',
      'can-ai-make-impostor-syndrome-worse',
      'why-ai-makes-me-question-what-makes-me-human',
    ],
  },
  {
    name: 'Safety, privacy, and harmful content',
    description: 'For AI deepfakes, body image, intrusive thoughts, reassurance loops, relationship checking, and doomscrolling.',
    slugs: [
      'why-ai-generated-images-make-me-feel-insecure-about-my-body',
      'can-deepfakes-cause-trauma-or-anxiety',
      'what-to-do-if-someone-made-an-ai-deepfake-of-me',
      'can-ai-make-intrusive-thoughts-worse',
      'is-using-ai-to-check-if-im-a-bad-person-making-things-worse',
      'can-ai-make-health-anxiety-worse',
    ],
  },
];

export const aiMentalHealthHubSlugs = [...new Set(aiMentalHealthClusters.flatMap((cluster) => cluster.slugs))];

export function isAiMentalHealthHubSlug(slug: string) {
  return aiMentalHealthHubSlugs.includes(slug);
}

export function isAiMentalHealthSprintQuestion(question: Question) {
  return question.content_prompt_version === AI_MENTAL_HEALTH_PROMPT_VERSION;
}

export function getAiMentalHealthHubQuestions(questions: Question[]) {
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  return aiMentalHealthHubSlugs
    .map((slug) => bySlug.get(slug))
    .filter((question): question is Question => Boolean(question));
}

export function getAiMentalHealthClusterCards(questions: Question[]) {
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  return aiMentalHealthClusters.map((cluster) => ({
    ...cluster,
    questions: cluster.slugs
      .map((slug) => bySlug.get(slug))
      .filter((question): question is Question => Boolean(question)),
  }));
}
