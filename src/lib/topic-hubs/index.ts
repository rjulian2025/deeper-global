import { buildTopicHubPageData } from '@/lib/topic-hub';
import { getAdhdTopicHubConfig } from '@/lib/topic-hubs/adhd';
import { getAiMentalHealthTopicHubConfig } from '@/lib/topic-hubs/ai-mental-health';
import { getModalityHubConfig } from '@/lib/topic-hubs/modalities';

export const topicHubConfigs = {
  adhd: getAdhdTopicHubConfig,
  'ai-mental-health': getAiMentalHealthTopicHubConfig,
} as const;

export type TopicHubId = keyof typeof topicHubConfigs;

export function getTopicHubConfig(id: TopicHubId) {
  return topicHubConfigs[id]();
}

export { getAdhdTopicHubConfig } from '@/lib/topic-hubs/adhd';
export { getAiMentalHealthTopicHubConfig } from '@/lib/topic-hubs/ai-mental-health';
export { getModalityHubConfig } from '@/lib/topic-hubs/modalities';

export function buildTopicHubById(id: TopicHubId, questions: Parameters<typeof buildTopicHubPageData>[1]) {
  const config = getTopicHubConfig(id);
  return buildTopicHubPageData(config, questions);
}
