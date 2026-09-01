import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = join(import.meta.dirname, '..');
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));

const BASELINE_HEADERS = [
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Strict-Transport-Security', 'max-age=63072000'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  ['X-Frame-Options', 'SAMEORIGIN'],
];

function globalHeaderBlock() {
  return vercel.headers?.find((entry) => entry.source === '/(.*)');
}

test('vercel.json declares RJOS baseline security headers on all routes', () => {
  const block = globalHeaderBlock();
  assert.ok(block, 'expected a global /(.*) header block');

  for (const [key, value] of BASELINE_HEADERS) {
    const header = block.headers.find((entry) => entry.key === key);
    assert.ok(header, `missing header ${key}`);
    assert.equal(header.value, value);
  }
});

test('vercel.json does not declare enforced CSP', () => {
  const block = globalHeaderBlock();
  const csp = block?.headers?.find((entry) => entry.key === 'Content-Security-Policy');
  assert.equal(csp, undefined);
});

test('vercel.json preserves apex host redirect to www', () => {
  assert.ok(
    vercel.redirects?.some(
      (rule) => rule.has?.some((entry) => entry.type === 'host' && entry.value === 'deeper.global'),
    ),
  );
});

test('vercel.json preserves legacy answer redirect map entries', () => {
  assert.ok(vercel.redirects?.some((rule) => rule.source === '/clusters'));
  assert.ok(vercel.redirects?.some((rule) => rule.source === '/openapi.json'));
});

test('vercel.json preserves cron and function definitions', () => {
  assert.ok(vercel.crons?.length > 0);
  assert.ok(vercel.functions?.['api/cron/publish-approved.js']);
});
