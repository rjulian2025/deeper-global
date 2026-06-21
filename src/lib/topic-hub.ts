import { answerPath, formatDate, getAnswerDisplayTitle } from '@/lib/content';
import type { Question } from '@/lib/supabase';

export const TOPIC_HUB_EXCERPT_MAX = 140;
export const TOPIC_HUB_FEATURED_MAX = 5;
export const TOPIC_HUB_CLUSTER_PREVIEW_COUNT = 3;
export const TOPIC_HUB_SEE_ALL_THRESHOLD = 7;
export const TOPIC_HUB_ACCORDION_INLINE_THRESHOLD = 10;
export const TOPIC_HUB_RECENT_MAX = 3;

export type TopicHubHeroAction = {
  label: string;
  href: string;
};

export type TopicHubIntroBlock = {
  eyebrow: string;
  title: string;
  description: string;
};

export type TopicHubClusterCrossLink = {
  overlapLabel: string;
  hubPath: string;
  hubLabel: string;
};

export type TopicHubClusterConfig = {
  id: string;
  name: string;
  description: string;
  slugs: string[];
  crossLink?: TopicHubClusterCrossLink;
  expandIndexPath?: string;
};

export type TopicHubRelatedHub = {
  label: string;
  href: string;
};

export type TopicHubConfig = {
  id: string;
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
  heroActions?: TopicHubHeroAction[];
  introBlocks: TopicHubIntroBlock[];
  featuredSlugs: string[];
  featuredSectionEyebrow?: string;
  featuredSectionTitle?: string;
  clusterSectionEyebrow?: string;
  clusterSectionTitle?: string;
  clusters: TopicHubClusterConfig[];
  allSlugs: string[];
  searchPlaceholder: string;
  searchQuery: string;
  relatedHubs: TopicHubRelatedHub[];
  jsonLdName: string;
  jsonLdDescription: string;
  featuredMax?: number;
  clusterPreviewCount?: number;
  seeAllThreshold?: number;
  accordionInlineThreshold?: number;
};

export type TopicHubClusterModule = {
  id: string;
  name: string;
  description: string;
  previewQuestions: Question[];
  hiddenQuestions: Question[];
  totalCount: number;
  expandInline: boolean;
  expandIndexHref: string;
  showSeeAllLink: boolean;
  crossLink?: TopicHubClusterCrossLink;
};

export type TopicHubPageData = {
  config: TopicHubConfig;
  featuredQuestions: Question[];
  clusterModules: TopicHubClusterModule[];
  recentQuestions: Question[];
  hubQuestions: Question[];
  usedSlugs: string[];
};

function getQuestionTimestamp(question: Question): number {
  const value = question.updated_at || question.created_at;
  return value ? Date.parse(value) : 0;
}

export function buildTopicHubPageData(config: TopicHubConfig, questions: Question[]): TopicHubPageData {
  const bySlug = new Map(questions.map((question) => [question.slug, question]));
  const featuredMax = config.featuredMax ?? TOPIC_HUB_FEATURED_MAX;
  const previewCount = config.clusterPreviewCount ?? TOPIC_HUB_CLUSTER_PREVIEW_COUNT;
  const seeAllThreshold = config.seeAllThreshold ?? TOPIC_HUB_SEE_ALL_THRESHOLD;
  const accordionThreshold = config.accordionInlineThreshold ?? TOPIC_HUB_ACCORDION_INLINE_THRESHOLD;

  const featuredQuestions = config.featuredSlugs
    .map((slug) => bySlug.get(slug))
    .filter((question): question is Question => Boolean(question))
    .slice(0, featuredMax);

  const featuredSlugSet = new Set(featuredQuestions.map((question) => question.slug));
  const usedSlugs = new Set<string>(featuredSlugSet);

  const clusterModules = config.clusters.map((cluster) => {
    const clusterQuestions = cluster.slugs
      .map((slug) => bySlug.get(slug))
      .filter((question): question is Question => Boolean(question))
      .filter((question) => !featuredSlugSet.has(question.slug));

    clusterQuestions.forEach((question) => usedSlugs.add(question.slug));

    const previewQuestions = clusterQuestions.slice(0, previewCount);
    const hiddenQuestions = clusterQuestions.slice(previewCount);
    const totalCount = clusterQuestions.length;
    const expandInline = totalCount > previewCount && totalCount <= accordionThreshold;
    const expandIndexHref = cluster.expandIndexPath ?? `/answers/?q=${encodeURIComponent(config.searchQuery)}`;

    return {
      id: cluster.id,
      name: cluster.name,
      description: cluster.description,
      previewQuestions,
      hiddenQuestions: expandInline ? hiddenQuestions : [],
      totalCount,
      expandInline,
      expandIndexHref,
      crossLink: cluster.crossLink,
      showSeeAllLink: totalCount > seeAllThreshold && totalCount > accordionThreshold,
    };
  });

  const hubQuestions = config.allSlugs
    .map((slug) => bySlug.get(slug))
    .filter((question): question is Question => Boolean(question));

  const recentQuestions = [...hubQuestions]
    .filter((question) => !featuredSlugSet.has(question.slug))
    .sort((a, b) => getQuestionTimestamp(b) - getQuestionTimestamp(a))
    .slice(0, TOPIC_HUB_RECENT_MAX);

  recentQuestions.forEach((question) => usedSlugs.add(question.slug));

  return {
    config,
    featuredQuestions,
    clusterModules,
    recentQuestions,
    hubQuestions,
    usedSlugs: [...usedSlugs],
  };
}

export function getTopicHubRecentLabel(question: Question): string {
  return getAnswerDisplayTitle(question);
}

export function getTopicHubRecentHref(question: Question): string {
  return answerPath(question.slug);
}

export function formatTopicHubRecentMeta(question: Question): string {
  return formatDate(question.updated_at || question.created_at);
}
