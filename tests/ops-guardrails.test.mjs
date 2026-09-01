import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = join(import.meta.dirname, '..');

test('404 page source requests noindex,nofollow', () => {
  const source = readFileSync(join(root, 'src/pages/404.astro'), 'utf8');
  assert.match(source, /robots="noindex, nofollow"/);
});

test('dist/404.html includes noindex,nofollow when present', () => {
  const built404 = join(root, 'dist/404/index.html');
  if (!existsSync(built404)) {
    return;
  }
  const html = readFileSync(built404, 'utf8');
  assert.match(html, /noindex,\s*nofollow/i);
});

test('preview dist robots.txt disallows all crawlers when present', () => {
  const previewRobots = join(root, 'dist-preview/robots.txt');
  if (!existsSync(previewRobots)) {
    return;
  }
  const robots = readFileSync(previewRobots, 'utf8');
  assert.match(robots, /Disallow:\s*\//);
  assert.doesNotMatch(robots, /^Sitemap:/m);
});
