import { modalityPath } from '@/lib/modality-hub';
import { siteUrl, websiteId } from '@/lib/site';
import type { ModalityHubConfig, ModalityHubPageData } from '@/lib/modality-hub-page';

export function buildModalityHubJsonLd(config: ModalityHubConfig, hub: ModalityHubPageData) {
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
          numberOfItems: hub.allModalities.length,
          itemListElement: hub.allModalities.map((modality, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: siteUrl(modalityPath(modality.slug)),
            name: modality.name,
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
            name: 'Modalities',
            item: siteUrl(config.path),
          },
        ],
      },
    ],
  };
}
