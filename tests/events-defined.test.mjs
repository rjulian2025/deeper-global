import assert from 'node:assert/strict';
import test from 'node:test';
import { __EVENT_NAMES__, clickToCall, primaryCtaClicked, generateLead, leadMessageSubmit, bookCall } from '../src/lib/events.mjs';
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

test('exported GA4 event wrappers exist and include attribution params', () => {
  // Required wrappers
  const expected = ['click_to_call', 'primary_cta_clicked', 'generate_lead', 'lead_message_submit', 'book_call'];
  assert.deepEqual(__EVENT_NAMES__.sort(), expected.sort());

  // Prepare attribution
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();
  const storage = { localStorage, sessionStorage };
  captureAttributionOnLanding(new URL('https://www.deeper.global/answers/?utm_source=x&utm_medium=social&utm_campaign=abc&utm_content=slug'), 'https://twitter.com/x', storage);

  const calls = [];
  global.window = {
    deeperTrackEvent: (name, params) => calls.push({ name, params }),
    localStorage,
    sessionStorage,
  };

  clickToCall('header');
  primaryCtaClicked('nav');
  generateLead('body', { form_id: 'test' });
  leadMessageSubmit('footer', { form_id: 'contact' });
  // Do not actually rely on bookCall firing in production unless booking exists
  bookCall('body', { note: 'noop' });

  assert.equal(calls.length, 5);
  for (const c of calls) {
    const at = c.params;
    for (const key of ['ft_source', 'ft_medium', 'ft_campaign', 'ft_content', 'lt_source', 'lt_medium', 'lt_campaign', 'lt_content', 'referrer', 'landing_page']) {
      assert.ok(key in at, `${c.name} missing ${key}`);
      if (typeof at[key] === 'string') {
        assert.ok(at[key].length <= 100, `${key} should be truncated to 100`);
      }
    }
    if (['click_to_call', 'primary_cta_clicked', 'generate_lead', 'lead_message_submit', 'book_call'].includes(c.name)) {
      assert.ok(typeof at.cta_location === 'string', `${c.name} should include cta_location`);
    }
  }
});

