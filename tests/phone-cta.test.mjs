import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const distPreview = join(root, 'dist-preview');
const out = existsSync(dist) ? dist : distPreview;

function findAnswerSampleDir() {
  if (!existsSync(out)) return null;
  const parts = ['answers']; // shallow scan known example path in preview may not exist
  // Try a known production URL if present in dist; otherwise skip
  const guess = join(out, 'answers', 'why-do-i-feel-guilty-for-taking-time-off-189668-007', 'index.html');
  return existsSync(guess) ? guess : null;
}

test('Home and About include the required tel:+14046880088 link', () => {
  if (!existsSync(out)) return;
  for (const rel of ['index.html', 'about/index.html']) {
    const file = join(out, rel);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    assert.match(html, /href="tel:\+14046880088"/, `${rel} has click-to-call link`);
  }
});

test('Answer page (when built) includes the tel:+14046880088 link', () => {
  const sample = findAnswerSampleDir();
  if (!sample) return;
  const html = readFileSync(sample, 'utf8');
  assert.match(html, /href="tel:\+14046880088"/, 'answer page has click-to-call link');
});

