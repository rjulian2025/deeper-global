import { formatDate } from '@/lib/content';
import {
  getModalityExploreClusterCards,
  modalityFeaturedSlugs,
  modalityPath,
  MODALITIES_HUB_PATH,
} from '@/lib/modality-hub';
import type { TopicHubClusterCrossLink, TopicHubIntroBlock, TopicHubRelatedHub } from '@/lib/topic-hub';
import type { Modality, Question } from '@/lib/supabase';

export const MODALITY_HUB_RECENT_MAX = 3;

export type ModalityHubHeroAction = {
  label: string;
  href: string;
};

export type ModalityHubConfig = {
  id: string;
  path: string;
  eyebrow: string;
  title: string;
  lede: string;
  heroActions?: ModalityHubHeroAction[];
  introBlocks: TopicHubIntroBlock[];
  featuredModalitySlugs: string[];
  featuredSectionEyebrow?: string;
  featuredSectionTitle?: string;
  clusterSectionEyebrow?: string;
  clusterSectionTitle?: string;
  relatedHubs: TopicHubRelatedHub[];
  searchPlaceholder: string;
  searchQuery: string;
  jsonLdName: string;
  jsonLdDescription: string;
};

export type ModalityClusterModule = {
  id: string;
  name: string;
  description: string;
  modalities: Modality[];
  questions: Question[];
  crossLink?: TopicHubClusterCrossLink;
};

export type ModalityHubPageData = {
  config: ModalityHubConfig;
  featuredModalities: Modality[];
  clusterModules: ModalityClusterModule[];
  recentModalities: Modality[];
  allModalities: Modality[];
};

function getModalityTimestamp(modality: Modality): number {
  const value = modality.updated_at || modality.created_at;
  return value ? Date.parse(value) : 0;
}

export function buildModalityHubPageData(
  config: ModalityHubConfig,
  modalities: Modality[],
  questions: Question[]
): ModalityHubPageData {
  const modalitiesBySlug = new Map(modalities.map((modality) => [modality.slug, modality]));
  const featuredSlugSet = new Set(config.featuredModalitySlugs);

  const featuredModalities = config.featuredModalitySlugs
    .map((slug) => modalitiesBySlug.get(slug))
    .filter((modality): modality is Modality => Boolean(modality));

  const exploreClusters = getModalityExploreClusterCards(modalities, questions);

  const clusterModules: ModalityClusterModule[] = exploreClusters
    .filter((cluster) => cluster.modalities.length > 0)
    .map((cluster) => ({
      id: cluster.id,
      name: cluster.name,
      description: cluster.description,
      modalities: cluster.modalities.filter((modality) => !featuredSlugSet.has(modality.slug)),
      questions: cluster.questions,
      ...(cluster.id === 'trauma-ptsd'
        ? {
            crossLink: {
              overlapLabel: 'Trauma & grief',
              hubPath: '/categories/trauma-and-grief/',
              hubLabel: 'Trauma & grief hub',
            },
          }
        : {}),
      ...(cluster.id === 'choosing-therapy'
        ? {
            crossLink: {
              overlapLabel: 'Therapy types',
              hubPath: '/answers/whats-the-difference-between-therapy-typ-185387-025/',
              hubLabel: 'Therapy types answer',
            },
          }
        : {}),
    }))
    .filter((cluster) => cluster.modalities.length > 0 || cluster.questions.length > 0);

  const recentModalities = [...modalities]
    .sort((a, b) => getModalityTimestamp(b) - getModalityTimestamp(a))
    .slice(0, MODALITY_HUB_RECENT_MAX);

  return {
    config,
    featuredModalities,
    clusterModules,
    recentModalities,
    allModalities: modalities,
  };
}

export function getModalityHubRecentHref(modality: Modality): string {
  return `${modalityPath(modality.slug)}/`;
}

export function formatModalityHubRecentMeta(modality: Modality): string {
  return formatDate(modality.updated_at || modality.created_at);
}

export function getDefaultModalityFeaturedSlugs(): string[] {
  return modalityFeaturedSlugs;
}

export function getModalityHubPath(): string {
  return MODALITIES_HUB_PATH;
}
