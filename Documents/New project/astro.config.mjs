import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.deeper.global',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/entities/') && !page.includes('/categories/'),
    }),
  ],
});
