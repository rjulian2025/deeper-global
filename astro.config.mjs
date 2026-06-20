import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { shouldIncludeAnswerPathInSitemap } from './src/lib/indexing-policy.ts';

export default defineConfig({
  site: 'https://www.deeper.global',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes('/entities/') || page.includes('/categories/')) return false;
        try {
          const pathname = new URL(page).pathname;
          return shouldIncludeAnswerPathInSitemap(pathname);
        } catch {
          return true;
        }
      },
    }),
  ],
});
