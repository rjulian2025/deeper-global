import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
// Static output - deploy to Vercel by connecting the repo (no adapter needed for static)
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
      nesting: true,
    }),
  ],
  output: 'static',
  site: 'https://www.qvbrands.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
