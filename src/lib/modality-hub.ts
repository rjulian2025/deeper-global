import { answerPath, getAnswerDisplayTitle } from './content';
import { siteUrl, websiteId } from './site';
import type { Modality, Question } from './supabase';

export const MODALITIES_HUB_PATH = '/modalities';

export type ModalityLinkSet = {
  relatedModalitySlugs: string[];
  relatedQuestionSlugs: string[];
};

export const modalityFeaturedSlugs = [
  'emdr-therapy',
  'cbt-therapy',
  'dbt-therapy',
  'ifs-therapy',
  'eft-therapy',
];

export const modalityCategoryLabels: Record<string, string> = {
  'evidence-based': 'Evidence-Based Approaches',
  somatic: 'Somatic Approaches',
  integrative: 'Integrative Approaches',
  emerging: 'Emerging Approaches',
};

/** Curated cross-links per modality — registry overrides empty DB fields at build time. */
export const modalityLinkRegistry: Record<string, ModalityLinkSet> = {
  'emdr-therapy': {
    relatedModalitySlugs: ['prolonged-exposure-therapy', 'cpt-therapy', 'somatic-experiencing', 'brainspotting-therapy'],
    relatedQuestionSlugs: [
      'what-is-complex-ptsd-and-how-is-it-different-from-regular-ptsd',
      'how-do-i-know-if-i-have-ptsd-or-trauma',
      'what-should-i-do-immediately-after-experiencing-a-traumatic-event',
      'how-do-i-find-a-therapist-thats-right-fo-184729-014',
    ],
  },
  'ifs-therapy': {
    relatedModalitySlugs: ['aedp-therapy', 'narrative-therapy', 'sensorimotor-psychotherapy', 'eft-therapy'],
    relatedQuestionSlugs: [
      'can-you-actually-change-your-attachment-style-or-a-186602-009',
      'whats-the-difference-between-therapy-typ-185387-025',
      'how-do-i-find-a-therapist-who-understands-x8y3z6',
    ],
  },
  'dbt-therapy': {
    relatedModalitySlugs: ['cbt-therapy', 'act-therapy', 'mbsr-therapy'],
    relatedQuestionSlugs: [
      'what-are-the-signs-of-borderline-personality-disorder',
      'whats-the-difference-between-therapy-typ-185387-025',
    ],
  },
  'cbt-therapy': {
    relatedModalitySlugs: ['act-therapy', 'dbt-therapy', 'cpt-therapy', 'mbsr-therapy'],
    relatedQuestionSlugs: [
      'whats-the-difference-between-therapy-typ-185387-025',
      'whats-the-difference-between-cbt-and-other-types-of-therapy-for-depression',
    ],
  },
  'act-therapy': {
    relatedModalitySlugs: ['cbt-therapy', 'mbsr-therapy', 'narrative-therapy'],
    relatedQuestionSlugs: [
      'how-do-i-start-practicing-mindfulness',
      'whats-the-difference-between-therapy-typ-185387-025',
    ],
  },
  'cpt-therapy': {
    relatedModalitySlugs: ['emdr-therapy', 'prolonged-exposure-therapy', 'cbt-therapy'],
    relatedQuestionSlugs: [
      'what-is-complex-ptsd-and-how-is-it-different-from-regular-ptsd',
      'how-do-i-know-if-i-have-ptsd-or-just-nor-181288-027',
    ],
  },
  'prolonged-exposure-therapy': {
    relatedModalitySlugs: ['emdr-therapy', 'cpt-therapy', 'cbt-therapy'],
    relatedQuestionSlugs: [
      'how-do-i-know-if-i-have-ptsd-or-trauma',
      'what-should-i-do-immediately-after-experiencing-a-traumatic-event',
    ],
  },
  'mbsr-therapy': {
    relatedModalitySlugs: ['act-therapy', 'cbt-therapy'],
    relatedQuestionSlugs: [
      'how-do-i-start-practicing-mindfulness',
      'what-is-the-difference-between-mindfulness-and-meditation',
    ],
  },
  'somatic-experiencing': {
    relatedModalitySlugs: ['sensorimotor-psychotherapy', 'brainspotting-therapy', 'emdr-therapy', 'aedp-therapy'],
    relatedQuestionSlugs: [
      'how-can-i-support-someone-who-has-experienced-trauma',
      'can-trauma-look-like-adhd',
    ],
  },
  'brainspotting-therapy': {
    relatedModalitySlugs: ['emdr-therapy', 'somatic-experiencing', 'sensorimotor-psychotherapy'],
    relatedQuestionSlugs: [
      'how-do-i-know-if-i-have-ptsd-or-trauma',
      'what-should-i-do-immediately-after-experiencing-a-traumatic-event',
    ],
  },
  'sensorimotor-psychotherapy': {
    relatedModalitySlugs: ['somatic-experiencing', 'brainspotting-therapy', 'ifs-therapy'],
    relatedQuestionSlugs: ['how-can-i-support-someone-who-has-experienced-trauma'],
  },
  'aedp-therapy': {
    relatedModalitySlugs: ['eft-therapy', 'ifs-therapy', 'imago-therapy', 'somatic-experiencing'],
    relatedQuestionSlugs: [
      'can-you-actually-change-your-attachment-style-or-a-186602-009',
      'what-is-attachment-theory-and-how-does-i-184729-012',
    ],
  },
  'eft-therapy': {
    relatedModalitySlugs: ['imago-therapy', 'aedp-therapy'],
    relatedQuestionSlugs: [
      'can-you-actually-change-your-attachment-style-or-a-186602-009',
      'what-is-attachment-theory-and-how-does-i-184729-012',
      'how-do-i-find-a-therapist-thats-right-fo-184729-014',
    ],
  },
  'imago-therapy': {
    relatedModalitySlugs: ['eft-therapy', 'aedp-therapy', 'narrative-therapy'],
    relatedQuestionSlugs: [
      'what-is-attachment-theory-and-how-does-i-184729-012',
      'how-do-i-find-a-therapist-thats-right-fo-184729-014',
    ],
  },
  'narrative-therapy': {
    relatedModalitySlugs: ['ifs-therapy', 'act-therapy', 'imago-therapy'],
    relatedQuestionSlugs: ['whats-the-difference-between-therapy-typ-185387-025'],
  },
  'psychedelic-assisted-therapy': {
    relatedModalitySlugs: ['somatic-experiencing', 'ifs-therapy', 'mbsr-therapy'],
    relatedQuestionSlugs: [
      'what-should-i-expect-during-a-psychedelic-therapy-b9c2d5',
      'how-do-i-integrate-psychedelic-experiences-into-a8b3c6',
      'how-do-i-know-if-psychedelics-could-help-with-my-depression-h7k3m9',
      'how-do-i-find-a-therapist-who-understands-x8y3z6',
    ],
  },
};

export const modalityExploreClusters = [
  {
    id: 'trauma-ptsd',
    name: 'Trauma and PTSD',
    description: 'Approaches commonly used for trauma processing, PTSD symptoms, and nervous-system recovery.',
    modalitySlugs: ['emdr-therapy', 'prolonged-exposure-therapy', 'cpt-therapy', 'somatic-experiencing', 'brainspotting-therapy'],
    answerSlugs: [
      'what-is-complex-ptsd-and-how-is-it-different-from-regular-ptsd',
      'how-do-i-know-if-i-have-ptsd-or-trauma',
      'what-should-i-do-immediately-after-experiencing-a-traumatic-event',
    ],
  },
  {
    id: 'emotion-regulation',
    name: 'Emotion regulation and distress tolerance',
    description: 'Structured therapies for intense emotions, impulsivity, and building skills between sessions.',
    modalitySlugs: ['dbt-therapy', 'cbt-therapy', 'act-therapy', 'mbsr-therapy'],
    answerSlugs: [
      'what-are-the-signs-of-borderline-personality-disorder',
      'whats-the-difference-between-therapy-typ-185387-025',
    ],
  },
  {
    id: 'couples-attachment',
    name: 'Couples and attachment',
    description: 'Relationship-focused and attachment-informed approaches for partners and connection patterns.',
    modalitySlugs: ['eft-therapy', 'imago-therapy', 'aedp-therapy', 'ifs-therapy'],
    answerSlugs: [
      'what-is-attachment-theory-and-how-does-i-184729-012',
      'can-you-actually-change-your-attachment-style-or-a-186602-009',
    ],
  },
  {
    id: 'body-somatic',
    name: 'Body-based and somatic',
    description: 'Therapies that work with bodily sensation, nervous-system states, and non-verbal trauma memory.',
    modalitySlugs: ['somatic-experiencing', 'sensorimotor-psychotherapy', 'brainspotting-therapy'],
    answerSlugs: ['how-can-i-support-someone-who-has-experienced-trauma'],
  },
  {
    id: 'choosing-therapy',
    name: 'Choosing the right approach',
    description: 'Start here if you are comparing modalities or deciding what to ask a new therapist.',
    modalitySlugs: ['cbt-therapy', 'dbt-therapy', 'act-therapy', 'narrative-therapy'],
    answerSlugs: [
      'whats-the-difference-between-therapy-typ-185387-025',
      'how-do-i-find-a-therapist-thats-right-fo-184729-014',
      'whats-the-difference-between-cbt-and-other-types-of-therapy-for-depression',
    ],
  },
];

const answerSlugToModalities = new Map<string, string[]>();

for (const [modalitySlug, links] of Object.entries(modalityLinkRegistry)) {
  for (const answerSlug of links.relatedQuestionSlugs) {
    const existing = answerSlugToModalities.get(answerSlug) ?? [];
    if (!existing.includes(modalitySlug)) {
      answerSlugToModalities.set(answerSlug, [...existing, modalitySlug]);
    }
  }
}

export function modalityPath(slug: string) {
  return `${MODALITIES_HUB_PATH}/${slug}`;
}

export function modalityCategoryAnchor(category: string) {
  return `${MODALITIES_HUB_PATH}/#${category}`;
}

export function resolveModalityLinks(modality: Modality): ModalityLinkSet {
  const registry = modalityLinkRegistry[modality.slug];
  const dbModalitySlugs = modality.related_modality_slugs ?? [];
  const dbQuestionSlugs = modality.related_question_slugs ?? [];

  return {
    relatedModalitySlugs: uniqueSlugs([
      ...(registry?.relatedModalitySlugs ?? []),
      ...dbModalitySlugs,
    ]),
    relatedQuestionSlugs: uniqueSlugs([
      ...(registry?.relatedQuestionSlugs ?? []),
      ...dbQuestionSlugs,
    ]),
  };
}

export function getRelatedModalities(modality: Modality, allModalities: Modality[]) {
  const links = resolveModalityLinks(modality);
  const bySlug = new Map(allModalities.map((item) => [item.slug, item]));
  return links.relatedModalitySlugs
    .filter((slug) => slug !== modality.slug)
    .map((slug) => bySlug.get(slug))
    .filter((item): item is Modality => Boolean(item));
}

export function getRelatedQuestionsForModality(modality: Modality, questions: Question[]) {
  const links = resolveModalityLinks(modality);
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  return links.relatedQuestionSlugs
    .map((slug) => bySlug.get(slug))
    .filter((question): question is Question => Boolean(question));
}

export function getModalitiesForAnswerSlug(answerSlug: string) {
  return answerSlugToModalities.get(answerSlug) ?? [];
}

export function isModalityAnswerSlug(answerSlug: string) {
  return getModalitiesForAnswerSlug(answerSlug).length > 0;
}

export function getModalityCardsForAnswer(answerSlug: string, modalities: Modality[]) {
  const slugs = getModalitiesForAnswerSlug(answerSlug);
  const bySlug = new Map(modalities.map((modality) => [modality.slug, modality]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((modality): modality is Modality => Boolean(modality));
}

export function getModalityExploreClusterCards(modalities: Modality[], questions: Question[]) {
  const modalitiesBySlug = new Map(modalities.map((modality) => [modality.slug, modality]));
  const questionsBySlug = new Map(questions.map((question) => [question.slug, question]));

  return modalityExploreClusters.map((cluster) => ({
    ...cluster,
    modalities: cluster.modalitySlugs
      .map((slug) => modalitiesBySlug.get(slug))
      .filter((modality): modality is Modality => Boolean(modality)),
    questions: cluster.answerSlugs
      .map((slug) => questionsBySlug.get(slug))
      .filter((question): question is Question => Boolean(question)),
  }));
}

export function buildModalityDetailJsonLd({
  modality,
  relatedModalities,
  relatedQuestions,
}: {
  modality: Modality;
  relatedModalities: Modality[];
  relatedQuestions: Question[];
}) {
  const pageUrl = siteUrl(modalityPath(modality.slug));
  const canonicalAnswer = modality.canonical_answer ?? modality.staging_canonical_answer ?? '';
  const relatedLinks = [
    ...relatedModalities.map((related) => ({
      '@type': 'MedicalTherapy',
      name: related.name,
      url: siteUrl(modalityPath(related.slug)),
    })),
    ...relatedQuestions.map((question) => ({
      '@type': 'Question',
      name: getAnswerDisplayTitle(question),
      url: siteUrl(answerPath(question.slug)),
    })),
  ];

  return {
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: modality.name,
        description: modality.meta_description ?? modality.schema_description ?? undefined,
        dateModified: modality.updated_at ?? modality.created_at,
        isPartOf: { '@id': websiteId() },
        about: {
          '@type': 'MedicalTherapy',
          name: modality.primary_term ?? modality.name,
          alternateName: modality.also_known_as ?? undefined,
          description: canonicalAnswer || modality.schema_description || undefined,
        },
        relatedLink: relatedLinks.length ? relatedLinks : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Deeper Global', item: siteUrl() },
          { '@type': 'ListItem', position: 2, name: 'Modalities', item: siteUrl(MODALITIES_HUB_PATH) },
          { '@type': 'ListItem', position: 3, name: modality.name, item: pageUrl },
        ],
      },
    ],
  };
}

function uniqueSlugs(slugs: string[]) {
  return [...new Set(slugs.filter(Boolean))];
}
