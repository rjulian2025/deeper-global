import assert from 'node:assert/strict';
import test from 'node:test';
import { __TESTING__ as T, captureAttributionOnLanding, getAttributionParams } from '../src/lib/attribution.mjs';

function makeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
    _dump: () => Object.fromEntries(map.entries()),
  };
}

test('legacy utm_* and gclid come from ONE whole touch (prefer lt when it has source)', () => {
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();
  const storage = { localStorage, sessionStorage };
  // Seed first-touch with full UTMs
  captureAttributionOnLanding(new URL('https://www.deeper.global/answers/?utm_source=ft&utm_medium=search&utm_campaign=a&utm_content=c&utm_term=term1&gclid=FT-GL'), 'https://google.com', storage);
  // Now land with partial last touch (missing term, different values)
  captureAttributionOnLanding(new URL('https://www.deeper.global/answers/?utm_source=lt&utm_medium=social&utm_campaign=b&utm_content=d'), 'https://twitter.com/p', storage);
  const at = getAttributionParams(storage);
  // chosen is lt (has source), and fields must NOT backfill from ft one-by-one
  assert.equal(at.utm_source, 'lt');
  assert.equal(at.utm_medium, 'social');
  assert.equal(at.utm_campaign, 'b');
  assert.equal(at.utm_content, 'd');
  assert.equal(at.utm_term, undefined, 'must not mix from ft');
  // gclid comes only from chosen touch -> absent because lt lacked it
  assert.equal(at.gclid, undefined);
});

test('corrupt and non-object JSON are treated as missing and overwritten on next landing (ft and lt)', () => {
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();
  // Write corrupt JSON
  localStorage.setItem(T.FIRST_TOUCH_KEY, '{not json');
  sessionStorage.setItem(T.LAST_TOUCH_KEY, '{broken');
  // Next landing with UTMs should set both touches safely
  captureAttributionOnLanding(new URL('https://www.deeper.global/answers/?utm_source=x&utm_medium=social&utm_campaign=c&utm_content=d&utm_term=t&gclid=GL'), 'https://twitter.com/y', { localStorage, sessionStorage });
  const ft = JSON.parse(localStorage.getItem(T.FIRST_TOUCH_KEY));
  const lt = JSON.parse(sessionStorage.getItem(T.LAST_TOUCH_KEY));
  assert.equal(ft.source, 'x');
  assert.equal(lt.source, 'x');

  // Overwrite with valid-but-non-object JSON and ensure next landing rewrites again
  localStorage.setItem(T.FIRST_TOUCH_KEY, JSON.stringify('x'));
  sessionStorage.setItem(T.LAST_TOUCH_KEY, JSON.stringify(5));
  captureAttributionOnLanding(new URL('https://www.deeper.global/answers/?utm_source=z&utm_medium=ref&utm_campaign=e&utm_content=f&utm_term=t2&gclid=GL2'), 'https://facebook.com/p', { localStorage, sessionStorage });
  const ft2 = JSON.parse(localStorage.getItem(T.FIRST_TOUCH_KEY));
  const lt2 = JSON.parse(sessionStorage.getItem(T.LAST_TOUCH_KEY));
  assert.equal(ft2.source, 'z');
  assert.equal(lt2.source, 'z');
});

