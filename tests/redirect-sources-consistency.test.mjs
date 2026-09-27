import test from 'node:test';
import assert from 'node:assert/strict';
import { REDIRECT_SOURCE_SLUGS } from '../scripts/lib/redirect-sources.mjs';
import { readFileSync } from 'node:fs';

test('every redirect source slug has a vercel.json redirect and every /answers/* redirect is listed', async () => {
  const redirects = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects ?? [];
  const answerRedirects = redirects.filter((r) => typeof r.source === 'string' && r.source.startsWith('/answers/'));
  const sourcesInVercel = new Set(answerRedirects.map((r) => r.source.replace(/^\/answers\//, '').replace(/\/?$/, '')));
  const listSet = new Set(REDIRECT_SOURCE_SLUGS);

  // 1) Every listed slug must exist in vercel.json
  for (const slug of REDIRECT_SOURCE_SLUGS) {
    assert.ok(sourcesInVercel.has(slug), `Missing vercel.json redirect for /answers/${slug}`);
  }

  // 2) Every /answers/* redirect must be in REDIRECT_SOURCE_SLUGS
  for (const src of sourcesInVercel) {
    assert.ok(listSet.has(src), `Redirect source /answers/${src} missing from REDIRECT_SOURCE_SLUGS`);
  }
});

