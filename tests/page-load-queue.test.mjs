import assert from 'node:assert/strict';
import test from 'node:test';

function makeStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
  };
}

test('page-load event queued before attribution flush includes ft/lt params after init', async () => {
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();
  const recorded = [];
  // Minimal window/doc stubs
  global.window = {
    localStorage,
    sessionStorage,
    location: { hostname: 'www.deeper.global', pathname: '/', search: '?utm_source=x&utm_medium=social&utm_campaign=abc&utm_content=slug' },
    __dgAttributionReady: false,
    __dgEventQueue: [{ name: 'answer_viewed', params: {} }],
    deeperTrackEvent: (name, params) => {
      // simulate BaseLayout merge behavior by adding __dgAttribution() result
      const at = (global.window.__dgAttribution && global.window.__dgAttribution()) || {};
      recorded.push({ name, params: { ...at, ...params } });
    },
  };
  global.document = { referrer: 'https://twitter.com/some-post' };

  // Run init (captures attribution and flushes queue)
  await import('../src/scripts/attribution-init.mjs');

  assert.equal(recorded.length, 1, 'one queued event should be flushed');
  const evt = recorded[0];
  assert.equal(evt.name, 'answer_viewed');
  for (const key of ['ft_source', 'ft_medium', 'ft_campaign', 'ft_content', 'lt_source', 'lt_medium', 'lt_campaign', 'lt_content', 'landing_page']) {
    assert.ok(key in evt.params, `queued event missing ${key}`);
  }
});

