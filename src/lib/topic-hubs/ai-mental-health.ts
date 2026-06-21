import {
  aiMentalHealthFeaturedSlugs,
  aiMentalHealthClusters,
  aiMentalHealthHubSlugs,
  AI_MENTAL_HEALTH_HUB_PATH,
} from '@/lib/ai-mental-health-hub';
import { ADHD_HUB_PATH } from '@/lib/adhd-hub';
import type { TopicHubConfig } from '@/lib/topic-hub';

export function getAiMentalHealthTopicHubConfig(): TopicHubConfig {
  return {
    id: 'ai-mental-health',
    path: AI_MENTAL_HEALTH_HUB_PATH,
    eyebrow: 'AI mental health hub',
    title: 'When AI enters the picture',
    lede:
      'A curated guide to the mental health questions people ask as AI becomes more personal, persuasive, and present in daily life.',
    heroActions: [
      { label: 'Search AI answers', href: '/answers/?q=artificial%20intelligence' },
      { label: 'Machine-readable index', href: '/llms/answers.json' },
    ],
    introBlocks: [
      {
        eyebrow: 'Coverage',
        title: 'Emerging AI concerns',
        description:
          'AI psychosis, emotional dependency, AI companions, teen use, work anxiety, deepfakes, reassurance loops, and when to stop using AI and involve a real person.',
      },
      {
        eyebrow: 'Safety boundary',
        title: 'AI is not crisis care',
        description:
          'If AI conversations involve suicidal thoughts, commands to act, severe sleep loss, danger, or losing touch with reality, the priority is urgent real-world support.',
      },
    ],
    featuredSlugs: aiMentalHealthFeaturedSlugs,
    featuredSectionEyebrow: 'Start here',
    featuredSectionTitle: 'Highest-safety AI concerns',
    clusterSectionEyebrow: 'Concern map',
    clusterSectionTitle: 'Browse the AI mental health cluster',
    clusters: aiMentalHealthClusters.map((cluster, index) => ({
      id: `ai-cluster-${index + 1}`,
      name: cluster.name,
      description: cluster.description,
      slugs: cluster.slugs,
      ...(index === 2
        ? {
            crossLink: {
              overlapLabel: 'Therapy modalities',
              hubPath: '/modalities/',
              hubLabel: 'Modalities hub',
            },
          }
        : {}),
      ...(index === 4
        ? {
            crossLink: {
              overlapLabel: 'Work & burnout',
              hubPath: '/categories/work-and-burnout/',
              hubLabel: 'Work & burnout hub',
            },
          }
        : {}),
    })),
    allSlugs: aiMentalHealthHubSlugs,
    searchPlaceholder: 'Search AI answers',
    searchQuery: 'artificial intelligence',
    relatedHubs: [
      { label: 'ADHD hub', href: `${ADHD_HUB_PATH}/` },
      { label: 'Anxiety & stress', href: '/categories/anxiety-and-stress/' },
      { label: 'Depression', href: '/categories/depression/' },
      { label: 'Therapy modalities', href: '/modalities/' },
    ],
    jsonLdName: 'AI mental health hub: AI psychosis, chatbot dependency, and safety',
    jsonLdDescription:
      'A curated Deeper Global hub for AI-related mental health concerns, including AI psychosis, chatbot dependency, AI companions, teen AI use, job anxiety, deepfakes, and safety boundaries.',
  };
}
