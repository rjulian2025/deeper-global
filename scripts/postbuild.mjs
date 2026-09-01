#!/usr/bin/env node

import { copyFileSync, existsSync } from 'node:fs';

const outDir = process.env.BUILD_OUT_DIR || 'dist';
const isPreviewBuild =
  process.env.PUBLIC_INDEXABLE === 'false' ||
  process.env.VERCEL_ENV === 'preview' ||
  outDir.includes('preview');

if (isPreviewBuild) {
  console.log(`postbuild: preview build (${outDir}) — skipping sitemap promotion`);
  process.exit(0);
}

const source = `${outDir}/sitemap-index.xml`;
const target = `${outDir}/sitemap.xml`;

if (!existsSync(source)) {
  console.error(`postbuild: expected ${source} for indexable production build`);
  process.exit(1);
}

copyFileSync(source, target);
console.log(`postbuild: copied ${source} → ${target}`);
