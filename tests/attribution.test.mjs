import assert from 'node:assert/strict';
import test from 'node:test';
import { captureAttributionOnLanding, getAttributionParams, __TESTING__ as T } from '../src/lib/attribution.mjs';

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

test('attribution capture: first-touch always set; last-touch only on UTM landing', () => {
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();
  const storage = { localStorage, sessionStorage };

  // First landing: no UTMs, with external referrer
  captureAttributionOnLanding(new URL('https://www.deeper.global/answers/'), 'https://www.google.com', storage);
  const firstDump = localStorage._dump();
  assert.ok(firstDump[T.FIRST_TOUCH_KEY], 'first touch should be written');
  const firstTouch = JSON.parse(firstDump[T.FIRST_TOUCH_KEY]);
  assert.equal(firstTouch.landing_page, '/answers/');
  assert.ok(firstTouch.first_seen_ts, 'first_seen_ts present');
  // Last touch should also be set on external referrer even without UTMs
  const ltAfterFirst = sessionStorage.getItem(T.LAST_TOUCH_KEY);
  assert.ok(ltAfterFirst, 'last touch should be written when external referrer present');
  const ltParsed = JSON.parse(ltAfterFirst);
  assert.equal(ltParsed.referrer, 'www.google.com');
  assert.equal(ltParsed.landing_page, '/answers/');
  // And it should carry source/medium for referral last-touch
  const atAfterFirst = getAttributionParams(storage);
  assert.equal(atAfterFirst.lt_source, 'www.google.com');
  assert.equal(atAfterFirst.lt_medium, 'referral');

  // Second landing: with UTMs
  const url2 = 'https://www.deeper.global/answers/how-do-i-feel?utm_source=x&utm_medium=social&utm_campaign=social_question_only&utm_content=why-do-i-feel';
  captureAttributionOnLanding(new URL(url2), 'https://twitter.com/some-post', storage);
  const lastDump = sessionStorage._dump();
  assert.ok(lastDump[T.LAST_TOUCH_KEY], 'last touch should be written');
  const lastTouch = JSON.parse(lastDump[T.LAST_TOUCH_KEY]);
  assert.equal(lastTouch.source, 'x');
  assert.equal(lastTouch.medium, 'social');
  assert.equal(lastTouch.campaign, 'social_question_only');
  assert.equal(lastTouch.content, 'why-do-i-feel');
  assert.equal(lastTouch.landing_page, '/answers/how-do-i-feel', 'landing_page should be path only');

  // Combined GA4 params
  const at = getAttributionParams(storage);
  assert.equal(at.ft_source, undefined, 'first touch may lack UTM');
  assert.equal(at.lt_source, 'x');
  assert.equal(at.referrer, 'www.google.com');
  assert.ok(at.landing_page.startsWith('/answers/'));
});

