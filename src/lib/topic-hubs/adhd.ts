import {
  adhdFeaturedSlugs,
  adhdHubClusters,
  adhdHubSlugs,
  ADHD_HUB_PATH,
} from '@/lib/adhd-hub';
import type { TopicHubConfig } from '@/lib/topic-hub';

export function getAdhdTopicHubConfig(): TopicHubConfig {
  return {
    id: 'adhd',
    path: ADHD_HUB_PATH,
    eyebrow: 'ADHD hub',
    title: 'ADHD, understood.',
    lede:
      'Most people who find this page already suspect something. Maybe you were just diagnosed. Maybe you\'ve wondered for years. These answers are written for where you actually are.',
    heroActions: [
      { label: 'Search ADHD answers', href: '/answers/?q=ADHD' },
      { label: 'Neurodivergence topic hub', href: '/categories/neurodivergence-and-attention/' },
    ],
    introBlocks: [
      {
        eyebrow: 'Coverage',
        title: 'Adult ADHD, end to end',
        description:
          'Diagnosis and testing, executive dysfunction, time blindness, rejection sensitivity, medication, burnout, work accommodations, study skills, and relationship communication.',
      },
      {
        eyebrow: 'Care boundary',
        title: 'Education, not diagnosis',
        description:
          'These answers explain patterns and options. Only a qualified clinician can determine whether ADHD or another condition fits your experience.',
      },
    ],
    clinicalReviewer: {
      name: 'Dr. Alex Crenshaw, PhD',
      href: '/reviewers/alex-crenshaw-phd/',
      specialty: 'Licensed psychologist · Adult ADHD Testing & Psychological Evaluation',
    },
    featuredSlugs: adhdFeaturedSlugs,
    featuredSectionEyebrow: 'Start here',
    featuredSectionTitle: 'Common ADHD concerns',
    clusterSectionEyebrow: 'Concern map',
    clusterSectionTitle: 'Browse the ADHD cluster',
    clusters: adhdHubClusters.map((cluster, index) => ({
      id: `adhd-cluster-${index + 1}`,
      name: cluster.name,
      description: cluster.description,
      slugs: cluster.slugs,
      ...(index === 0
        ? {
            crossLink: {
              overlapLabel: 'Neurodivergence',
              hubPath: '/categories/neurodivergence-and-attention/',
              hubLabel: 'Neurodivergence hub',
            },
          }
        : {}),
      ...(index === 2
        ? {
            crossLink: {
              overlapLabel: 'Anxiety',
              hubPath: '/anxiety/',
              hubLabel: 'Anxiety hub',
            },
          }
        : {}),
    })),
    allSlugs: adhdHubSlugs,
    searchPlaceholder: 'Search ADHD answers',
    searchQuery: 'ADHD',
    relatedHubs: [
      { label: 'Anxiety hub', href: '/anxiety/' },
      { label: 'Depression', href: '/categories/depression/' },
      { label: 'Neurodivergence & attention', href: '/categories/neurodivergence-and-attention/' },
      { label: 'Work & burnout', href: '/categories/work-and-burnout/' },
    ],
    jsonLdName: 'ADHD hub: diagnosis, executive function, treatment, and daily life',
    jsonLdDescription:
      'A curated Deeper Global hub for ADHD in adults: diagnosis, executive dysfunction, emotional overwhelm, medication, work accommodations, relationships, and daily coping.',
  };
}
