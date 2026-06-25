import {
  anxietyFeaturedSlugs,
  anxietyHubClusters,
  anxietyHubSlugs,
  ANXIETY_HUB_PATH,
} from '@/lib/anxiety-hub';
import type { TopicHubConfig } from '@/lib/topic-hub';

export function getAnxietyTopicHubConfig(): TopicHubConfig {
  return {
    id: 'anxiety',
    path: ANXIETY_HUB_PATH,
    eyebrow: 'Anxiety hub',
    title: 'Anxiety & stress, understood.',
    lede:
      'Most people arrive with a body signal before they have a label: tight chest, racing thoughts, dread with no clear cause. These answers start where you actually are.',
    heroActions: [
      { label: 'Search anxiety answers', href: '/answers/?q=anxiety' },
      { label: 'Anxiety topic hub', href: '/categories/anxiety-and-stress/' },
    ],
    introBlocks: [
      {
        eyebrow: 'Coverage',
        title: 'From daily worry to acute panic',
        description:
          'Physical symptoms, social anxiety, rumination, work stress, medication questions, grounding skills, and when to seek professional support.',
      },
      {
        eyebrow: 'Care boundary',
        title: 'Education, not diagnosis',
        description:
          'These answers explain patterns and options. Only a qualified clinician can determine whether anxiety, another condition, or situational stress best fits your experience.',
      },
    ],
    clinicalReviewer: {
      name: 'Dr. Alex Crenshaw, PhD',
      href: '/reviewers/alex-crenshaw-phd/',
      specialty: 'Licensed psychologist · Adult ADHD Testing & Psychological Evaluation',
    },
    featuredSlugs: anxietyFeaturedSlugs,
    featuredSectionEyebrow: 'Start here',
    featuredSectionTitle: 'Common anxiety concerns',
    clusterSectionEyebrow: 'Concern map',
    clusterSectionTitle: 'Browse the anxiety cluster',
    clusters: anxietyHubClusters.map((cluster, index) => ({
      id: `anxiety-cluster-${index + 1}`,
      name: cluster.name,
      description: cluster.description,
      slugs: cluster.slugs,
      ...(index === 0
        ? {
            crossLink: {
              overlapLabel: 'Coping skills',
              hubPath: '/anxiety/#anxiety-cluster-6',
              hubLabel: 'Grounding & coping cluster',
            },
          }
        : {}),
      ...(index === 3
        ? {
            crossLink: {
              overlapLabel: 'Work stress',
              hubPath: '/categories/work-and-burnout/',
              hubLabel: 'Work & burnout hub',
            },
          }
        : {}),
    })),
    allSlugs: anxietyHubSlugs,
    searchPlaceholder: 'Search anxiety answers',
    searchQuery: 'anxiety',
    relatedHubs: [
      { label: 'Depression', href: '/categories/depression/' },
      { label: 'Work & burnout', href: '/categories/work-and-burnout/' },
      { label: 'ADHD hub', href: '/adhd/' },
      { label: 'Therapy modalities', href: '/modalities/' },
    ],
    jsonLdName: 'Anxiety hub: panic, worry, social anxiety, coping, and getting help',
    jsonLdDescription:
      'A curated Deeper Global hub for anxiety and stress: physical symptoms, social worry, rumination, work pressure, medication questions, grounding skills, and when to seek support.',
  };
}
