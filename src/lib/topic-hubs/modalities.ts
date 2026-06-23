import {
  MODALITIES_HUB_PATH,
  modalityFeaturedSlugs,
} from '@/lib/modality-hub';
import type { ModalityHubConfig } from '@/lib/modality-hub-page';
import { ADHD_HUB_PATH } from '@/lib/adhd-hub';
import { AI_MENTAL_HEALTH_HUB_PATH } from '@/lib/ai-mental-health-hub';

export function getModalityHubConfig(): ModalityHubConfig {
  return {
    id: 'modalities',
    path: MODALITIES_HUB_PATH,
    eyebrow: 'Treatment approaches',
    title: 'How therapy actually works',
    lede:
      'A guided atlas of therapy approaches: what each one is for, how sessions tend to work, and what the evidence says.',
    heroActions: [
      { label: 'Browse A–Z index', href: '#modality-az-index' },
      { label: 'Search therapy answers', href: '/answers/?q=therapy' },
    ],
    introBlocks: [
      {
        eyebrow: 'Coverage',
        title: 'Structured modality guides',
        description:
          'Evidence summaries, session expectations, conditions treated, and related answers, organized so you can compare approaches before choosing a therapist.',
      },
      {
        eyebrow: 'Wayfinding',
        title: 'Not sure where to start?',
        description:
          'If you know the concern but not the therapy name, use the concern map below; each module pairs approaches with related answers. If you already have a modality in mind, jump to the A–Z index.',
      },
    ],
    featuredModalitySlugs: modalityFeaturedSlugs,
    featuredSectionEyebrow: 'Start here',
    featuredSectionTitle: 'Most searched therapy approaches',
    clusterSectionEyebrow: 'Explore by concern',
    clusterSectionTitle: "Find the right approach for what you're going through",
    relatedHubs: [
      { label: 'ADHD hub', href: `${ADHD_HUB_PATH}/` },
      { label: 'AI mental health hub', href: `${AI_MENTAL_HEALTH_HUB_PATH}/` },
      { label: 'Anxiety & stress', href: '/categories/anxiety-and-stress/' },
      { label: 'Trauma & grief', href: '/categories/trauma-and-grief/' },
    ],
    searchPlaceholder: 'Search therapy answers',
    searchQuery: 'therapy',
    jsonLdName: 'Therapy modalities explained',
    jsonLdDescription:
      'A structured Deeper Global guide to therapy approaches: what they are, what they treat, session expectations, and evidence summaries.',
  };
}
