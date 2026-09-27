import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAttributionHiddenFields } from '../src/lib/forms-attribution.mjs';
import { captureAttributionOnLanding } from '../src/lib/attribution.mjs';

function makeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
  };
}

test('buildAttributionHiddenFields returns expected keys', () => {
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();
  global.window = { localStorage, sessionStorage };

  // first touch (no utm) then last touch (with utm)
  captureAttributionOnLanding(new URL('https://www.deeper.global/answers/'), '', { localStorage, sessionStorage });
  captureAttributionOnLanding(
    new URL('https://www.deeper.global/answers/slug?utm_source=x&utm_medium=social&utm_campaign=c1&utm_content=slug'),
    'https://twitter.com/abc',
    { localStorage, sessionStorage }
  );

  const fields = buildAttributionHiddenFields();
  // ft_* may be empty due to no utm on first touch; lt_* should be present
  assert.equal(fields.attr_lt_source, 'x');
  assert.equal(fields.attr_lt_medium, 'social');
  assert.equal(fields.attr_lt_campaign, 'c1');
  assert.equal(fields.attr_lt_content, 'slug');
  assert.ok(fields.attr_landing_page);
});

