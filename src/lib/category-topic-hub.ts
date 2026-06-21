import { categoryPath, displayCategory, getPrimaryTheme, slugify } from '@/lib/content';
import { getSourceRefs } from '@/lib/trust';
import type { TopicHubClusterConfig, TopicHubConfig } from '@/lib/topic-hub';
import type { Question } from '@/lib/supabase';

/** Categories with enough corpus depth for editorial cluster layout. */
export const CATEGORY_TOPIC_HUB_MIN_ANSWERS = 20;

export type CategoryHubOverride = {
  title?: string;
  lede?: string;
  eyebrow?: string;
  introBlocks?: TopicHubConfig['introBlocks'];
  relatedHubs?: TopicHubConfig['relatedHubs'];
  heroActions?: TopicHubConfig['heroActions'];
};

const CATEGORY_HUB_OVERRIDES: Record<string, CategoryHubOverride> = {
  'Anxiety & Stress': {
    title: 'Anxiety & stress, understood.',
    lede:
      'Worry, panic, intrusive thoughts, and the physical edge of stress — answers written for people trying to name what their body and mind are doing.',
    introBlocks: [
      {
        eyebrow: 'Coverage',
        title: 'From daily worry to acute panic',
        description:
          'Social anxiety, perfectionism, intrusive thoughts, panic symptoms, and the overlap between stress and mood.',
      },
      {
        eyebrow: 'Care boundary',
        title: 'Education, not diagnosis',
        description:
          'These answers explain patterns and options. Only a qualified clinician can determine whether anxiety, another condition, or situational stress best fits your experience.',
      },
    ],
    relatedHubs: [
      { label: 'Depression', href: '/categories/depression/' },
      { label: 'Trauma & grief', href: '/categories/trauma-and-grief/' },
      { label: 'Therapy navigation', href: '/categories/therapy-navigation/' },
      { label: 'ADHD hub', href: '/adhd/' },
    ],
  },
  Depression: {
    title: 'Depression, without the platitudes.',
    lede:
      'Low mood, numbness, motivation collapse, and the questions people ask before they know whether they need help — answered in plain language.',
    introBlocks: [
      {
        eyebrow: 'Coverage',
        title: 'Mood, motivation, and meaning',
        description:
          'Emotional numbness, self-criticism, fatigue, grief overlap, medication questions, and when low mood becomes urgent.',
      },
      {
        eyebrow: 'Care boundary',
        title: 'Support starts with clarity',
        description:
          'Educational answers cannot replace evaluation or treatment planning with a qualified professional.',
      },
    ],
    relatedHubs: [
      { label: 'Anxiety & stress', href: '/categories/anxiety-and-stress/' },
      { label: 'Grief & loss', href: '/categories/grief-and-loss/' },
      { label: 'Identity & self-worth', href: '/categories/identity-and-self-worth/' },
      { label: 'Therapy modalities', href: '/modalities/' },
    ],
  },
  'Identity & Self-Worth': {
    title: 'Identity & self-worth.',
    lede:
      'Shame, comparison, people-pleasing, and the quiet question of whether you are allowed to take up space — explored without toxic positivity.',
    introBlocks: [
      {
        eyebrow: 'Coverage',
        title: 'Who you are and how you measure yourself',
        description:
          'Self-esteem, inner criticism, belonging, purpose, and the language people use when they feel not enough.',
      },
    ],
    relatedHubs: [
      { label: 'Relationships', href: '/categories/relationships-and-communication/' },
      { label: 'Teens & identity', href: '/categories/teens-and-identity/' },
      { label: 'Work & burnout', href: '/categories/work-and-burnout/' },
    ],
  },
  'Addiction & Recovery': {
    title: 'Addiction & recovery.',
    lede:
      'Substance use, relapse fear, sobriety, and the early questions people ask before they are ready to call it addiction.',
    relatedHubs: [
      { label: 'Trauma & grief', href: '/categories/trauma-and-grief/' },
      { label: 'Family & parenting', href: '/categories/family-and-parenting/' },
      { label: 'Therapy navigation', href: '/categories/therapy-navigation/' },
    ],
  },
  'Relationships & Communication': {
    title: 'Relationships & communication.',
    lede:
      'Conflict, attachment, boundaries, intimacy, and the language people search when a relationship feels stuck or unsafe.',
    relatedHubs: [
      { label: 'Family & parenting', href: '/categories/family-and-parenting/' },
      { label: 'Identity & self-worth', href: '/categories/identity-and-self-worth/' },
      { label: 'Grief & loss', href: '/categories/grief-and-loss/' },
    ],
  },
  'Grief & Loss': {
    title: 'Grief & loss.',
    lede:
      'Bereavement, complicated grief, and the questions that surface when loss reshapes daily life.',
    relatedHubs: [
      { label: 'Depression', href: '/categories/depression/' },
      { label: 'Family & parenting', href: '/categories/family-and-parenting/' },
      { label: 'Trauma & grief', href: '/categories/trauma-and-grief/' },
    ],
  },
  'Trauma & Grief': {
    title: 'Trauma & safety.',
    lede:
      'Triggers, abuse, PTSD language, and care-seeking questions when the past still feels present.',
    relatedHubs: [
      { label: 'Therapy modalities', href: '/modalities/' },
      { label: 'Grief & loss', href: '/categories/grief-and-loss/' },
      { label: 'Addiction & recovery', href: '/categories/addiction-and-recovery/' },
    ],
  },
  'Family & Parenting': {
    title: 'Family & parenting.',
    lede:
      'Parenting stress, teen mental health, family boundaries, and the questions caregivers ask when someone they love is struggling.',
    relatedHubs: [
      { label: 'Teens & identity', href: '/categories/teens-and-identity/' },
      { label: 'Relationships', href: '/categories/relationships-and-communication/' },
      { label: 'AI mental health hub', href: '/ai-mental-health/' },
    ],
  },
  'Work & Burnout': {
    title: 'Work & burnout.',
    lede:
      'Workplace stress, exhaustion, imposter feelings, and the boundary between a hard season and burnout.',
    relatedHubs: [
      { label: 'Anxiety & stress', href: '/categories/anxiety-and-stress/' },
      { label: 'Depression', href: '/categories/depression/' },
      { label: 'Identity & self-worth', href: '/categories/identity-and-self-worth/' },
    ],
  },
  'General Mental Health': {
    title: 'General mental health.',
    lede:
      'Cross-cutting questions about emotional regulation, life transitions, anger, and everyday mental health language.',
    relatedHubs: [
      { label: 'Anxiety & stress', href: '/categories/anxiety-and-stress/' },
      { label: 'Therapy navigation', href: '/categories/therapy-navigation/' },
      { label: 'Themes directory', href: '/themes/' },
    ],
  },
};

function questionScore(question: Question): number {
  let score = 0;
  if (getSourceRefs(question).length > 0) score += 12;
  if (question.reviewed_by?.trim()) score += 8;
  const updated = Date.parse(question.updated_at || question.created_at || '');
  if (!Number.isNaN(updated)) score += updated / 1e12;
  return score;
}

function buildThemeClusters(categoryName: string, questions: Question[]): TopicHubClusterConfig[] {
  const byTheme = new Map<string, Question[]>();

  for (const question of questions) {
    const theme = getPrimaryTheme(question) || 'General questions';
    const bucket = byTheme.get(theme) ?? [];
    bucket.push(question);
    byTheme.set(theme, bucket);
  }

  const sortedThemes = [...byTheme.entries()].sort(
    (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])
  );

  const clusters: TopicHubClusterConfig[] = [];
  const absorbed = new Set<string>();

  for (const [theme, themeQuestions] of sortedThemes) {
    if (themeQuestions.length >= 3 && clusters.length < 6) {
      themeQuestions.forEach((question) => absorbed.add(question.slug));
      clusters.push({
        id: slugify(`${categoryName}-${theme}`),
        name: theme,
        description: `Questions about ${theme.toLowerCase()} within ${categoryName.toLowerCase()}.`,
        slugs: themeQuestions.map((question) => question.slug),
      });
    }
  }

  const remainder = questions.filter((question) => !absorbed.has(question.slug));

  if (remainder.length > 0) {
    if (clusters.length === 0) {
      for (const [theme, themeQuestions] of sortedThemes.slice(0, 6)) {
        clusters.push({
          id: slugify(`${categoryName}-${theme}`),
          name: theme,
          description: `Questions about ${theme.toLowerCase()}.`,
          slugs: themeQuestions.map((question) => question.slug),
        });
      }
    } else {
      clusters.push({
        id: slugify(`${categoryName}-more`),
        name: `More in ${categoryName}`,
        description: `Additional answers across ${categoryName.toLowerCase()}.`,
        slugs: remainder.map((question) => question.slug),
      });
    }
  }

  return clusters.filter((cluster) => cluster.slugs.length > 0);
}

export function shouldUseCategoryTopicHub(categoryName: string, questions: Question[]): boolean {
  return questions.length >= CATEGORY_TOPIC_HUB_MIN_ANSWERS;
}

export function buildCategoryTopicHubConfig(categoryName: string, questions: Question[]): TopicHubConfig {
  const override = CATEGORY_HUB_OVERRIDES[categoryName] ?? {};
  const slug = slugify(categoryName);
  const path = categoryPath(categoryName);
  const clusters = buildThemeClusters(categoryName, questions);
  const featuredSlugs = [...questions]
    .sort((a, b) => questionScore(b) - questionScore(a))
    .slice(0, 5)
    .map((question) => question.slug);

  return {
    id: `category-${slug}`,
    path,
    eyebrow: override.eyebrow ?? 'Topic hub',
    title: override.title ?? categoryName,
    lede:
      override.lede ??
      `Common questions, patterns, and care-seeking language around ${categoryName.toLowerCase()}.`,
    heroActions: override.heroActions ?? [{ label: `Search ${categoryName} answers`, href: `/answers/?q=${encodeURIComponent(categoryName)}` }],
    introBlocks: override.introBlocks ?? [
      {
        eyebrow: 'Browse',
        title: `${questions.length} answers in this topic`,
        description: `Explore vetted answers organized by theme clusters below.`,
      },
    ],
    featuredSlugs,
    featuredSectionEyebrow: 'Start here',
    featuredSectionTitle: `Common ${categoryName.toLowerCase()} concerns`,
    clusterSectionEyebrow: 'Concern map',
    clusterSectionTitle: `Browse ${categoryName.toLowerCase()} clusters`,
    clusters,
    allSlugs: questions.map((question) => question.slug),
    searchPlaceholder: `Search ${categoryName} answers`,
    searchQuery: categoryName,
    relatedHubs: override.relatedHubs ?? [
      { label: 'All topics', href: '/categories/' },
      { label: 'Themes directory', href: '/themes/' },
    ],
    jsonLdName: `${categoryName} questions and answers`,
    jsonLdDescription: `Deeper Global topic hub for ${categoryName.toLowerCase()} with curated answer clusters.`,
  };
}

export function getCategoryTopicHubCategoryName(categoryName: string, questions: Question[]) {
  return displayCategory(questions[0] ?? { category: categoryName } as Question) || categoryName;
}
