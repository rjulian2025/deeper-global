import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { shouldIncludePathInSitemap } from './src/lib/indexing-policy.ts';

export default defineConfig({
  site: 'https://www.deeper.global',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        try {
          const pathname = new URL(page).pathname;
          return shouldIncludePathInSitemap(pathname);
        } catch {
          return false;
        }
      },
    }),
  ],
});
