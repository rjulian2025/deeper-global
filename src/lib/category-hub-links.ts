import { ADHD_HUB_PATH, adhdHubClusters } from './adhd-hub';
import { AI_MENTAL_HEALTH_HUB_PATH, aiMentalHealthClusters } from './ai-mental-health-hub';
import { ANXIETY_HUB_PATH, anxietyHubClusters } from './anxiety-hub';
import { answerPath, displayCategory } from './content';
import { filterPublishableQuestions } from './indexing-policy';
import { MODALITIES_HUB_PATH, modalityExploreClusters } from './modality-hub';
import type { Question } from './supabase';

export type CategoryHubSection = {
  hubTitle: string;
  hubPath: string;
  hubDescription: string;
  clusterName: string;
  clusterDescription: string;
  questions: Question[];
};

const CATEGORY_MODALITY_CLUSTERS: Record<string, string[]> = {
  'Therapy and Mental Health': ['choosing-therapy', 'trauma-ptsd', 'emotion-regulation'],
  'Trauma & Grief': ['trauma-ptsd', 'body-somatic'],
  'Relationships & Communication': ['couples-attachment'],
  Depression: ['emotion-regulation', 'choosing-therapy'],
};

function clusterSectionForCategory(
  categoryName: string,
  hubTitle: string,
  hubPath: string,
  hubDescription: string,
  cluster: { name: string; description: string; slugs: string[] },
  allBySlug: Map<string, Question>,
  minOverlap = 1
): CategoryHubSection | null {
  const overlap = cluster.slugs.filter((slug) => {
    const question = allBySlug.get(slug);
    return question && displayCategory(question) === categoryName;
  });

  if (overlap.length < minOverlap) return null;

  const questions = cluster.slugs
    .map((slug) => allBySlug.get(slug))
    .filter((question): question is Question => Boolean(question));

  if (!questions.length) return null;

  return {
    hubTitle,
    hubPath,
    hubDescription,
    clusterName: cluster.name,
    clusterDescription: cluster.description,
    questions,
  };
}

export function getCategoryHubSections(categoryName: string, questions: Question[]) {
  const allBySlug = new Map(filterPublishableQuestions(questions).map((question) => [question.slug, question]));
  const sections: CategoryHubSection[] = [];

  const adhdMatches = adhdHubClusters
    .map((cluster) =>
      clusterSectionForCategory(
        categoryName,
        'ADHD hub',
        ADHD_HUB_PATH,
        'Curated answers on adult ADHD, executive function, medication, work, and relationships.',
        cluster,
        allBySlug
      )
    )
    .filter((section): section is CategoryHubSection => Boolean(section));

  if (adhdMatches.length) {
    sections.push(...adhdMatches.slice(0, 2));
  }

  const aiMatches = aiMentalHealthClusters
    .map((cluster) =>
      clusterSectionForCategory(
        categoryName,
        'AI mental health hub',
        AI_MENTAL_HEALTH_HUB_PATH,
        'Curated answers on AI psychosis, chatbot dependency, companions, teens, and safety boundaries.',
        cluster,
        allBySlug
      )
    )
    .filter((section): section is CategoryHubSection => Boolean(section));

  if (aiMatches.length) {
    sections.push(...aiMatches.slice(0, 2));
  }

  const anxietyMatches = anxietyHubClusters
    .map((cluster) =>
      clusterSectionForCategory(
        categoryName,
        'Anxiety hub',
        ANXIETY_HUB_PATH,
        'Curated answers on panic, social anxiety, worry, work stress, medication, and coping skills.',
        cluster,
        allBySlug
      )
    )
    .filter((section): section is CategoryHubSection => Boolean(section));

  if (anxietyMatches.length) {
    sections.push(...anxietyMatches.slice(0, 2));
  }

  const modalityClusterNames = CATEGORY_MODALITY_CLUSTERS[categoryName] ?? [];
  for (const clusterId of modalityClusterNames) {
    const cluster = modalityExploreClusters.find((item) => item.id === clusterId);
    if (!cluster) continue;
    const section = clusterSectionForCategory(
      categoryName,
      'Therapy modalities hub',
      MODALITIES_HUB_PATH,
      'Structured guides to therapy approaches with linked mental health answers.',
      {
        name: cluster.name,
        description: cluster.description,
        slugs: cluster.answerSlugs,
      },
      allBySlug
    );
    if (section) sections.push(section);
  }

  return sections;
}

export function getCategoryFeaturedAnswers(categoryName: string, questions: Question[], limit = 12) {
  const hubSlugs = new Set(
    getCategoryHubSections(categoryName, questions).flatMap((section) =>
      section.questions.map((question) => question.slug)
    )
  );

  return filterPublishableQuestions(questions)
    .filter((question) => !hubSlugs.has(question.slug))
    .slice(0, limit);
}

export function categoryAnswerLinks(questions: Question[]) {
  return filterPublishableQuestions(questions).map((question) => ({
    question,
    href: answerPath(question.slug),
    category: displayCategory(question),
  }));
}
