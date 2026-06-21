import { getAnswerDisplayTitle } from '@/lib/content';
import { siteUrl, websiteId } from '@/lib/site';
import type { TopicHubConfig, TopicHubPageData } from '@/lib/topic-hub';

export function buildTopicHubJsonLd(config: TopicHubConfig, hub: TopicHubPageData) {
  return {
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl(config.path)}#collection`,
        url: siteUrl(config.path),
        name: config.jsonLdName,
        description: config.jsonLdDescription,
        isPartOf: {
          '@id': websiteId(),
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: hub.hubQuestions.length,
          itemListElement: hub.hubQuestions.slice(0, 24).map((question, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: siteUrl(`/answers/${question.slug}`),
            name: getAnswerDisplayTitle(question),
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl(config.path)}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Deeper Global',
            item: siteUrl(),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: config.eyebrow.replace(/ hub$/i, ''),
            item: siteUrl(config.path),
          },
        ],
      },
    ],
  };
}
