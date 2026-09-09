import sitemap from '@astrojs/sitemap';
import { defineConfig, envField } from 'astro/config';
import { shouldIncludePathInSitemap } from './src/lib/indexing-policy.ts';

const isIndexableBuild =
  process.env.PUBLIC_INDEXABLE !== 'false' && process.env.VERCEL_ENV !== 'preview';

const sitemapIntegration = sitemap({
  filter: (page) => {
    try {
      const pathname = new URL(page).pathname;
      return shouldIncludePathInSitemap(pathname);
    } catch {
      return false;
    }
  },
});

export default defineConfig({
  site: 'https://www.deeper.global',
  trailingSlash: 'always',
  env: {
    schema: {
      VERCEL_ENV: envField.string({ context: 'server', access: 'public', optional: true }),
      PUBLIC_INDEXABLE: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GA_MEASUREMENT_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GA4_MEASUREMENT_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      NEXT_PUBLIC_GA_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  integrations: isIndexableBuild ? [sitemapIntegration] : [],
});
