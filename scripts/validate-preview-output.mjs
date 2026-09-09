#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const distDir = process.env.DIST_DIR || 'dist';
const dist = new URL(`../${distDir}/`, import.meta.url);
const homepage = readFileSync(new URL('index.html', dist), 'utf8');
const robots = readFileSync(new URL('robots.txt', dist), 'utf8');
const notFound = readFileSync(new URL('404.html', dist), 'utf8');
const hasNoindex =
  /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(homepage);
const disallowsAll = /User-agent:\s*\*[\s\S]*Disallow:\s*\/\s*$/m.test(robots);
const notFoundNoindex =
  /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(notFound);
console.log(
  JSON.stringify({ hasNoindex, robotsDisallowsAll: disallowsAll, notFoundNoindex }, null, 2)
);
if (!hasNoindex || !disallowsAll || !notFoundNoindex) process.exit(1);
