import test from 'node:test';
import assert from 'node:assert/strict';
import { applyDuplicateFix } from '../scripts/lib/duplicate-slug-fixer.mjs';

test('applyDuplicateFix records per-row apply status including failures', async () => {
  const calls = [];
  const client = {
    from() {
      return {
        update(update) {
          return {
            eq(_, id) {
              calls.push({ id, update });
              return {
                select() {
                  if (id === 'bad') {
                    return Promise.resolve({ data: null, error: new Error('boom') });
                  }
                  return Promise.resolve({ data: [{ id, slug: update.slug }], error: null });
                },
              };
            },
          };
        },
      };
    },
  };

  const patches = [
    { slug: 'a', update: { id: 'ok1', slug: 'a-retired-duplicate-00000000', review_status: 'retired_duplicate' } },
    { slug: 'a', update: { id: 'bad', slug: 'a-retired-duplicate-11111111', review_status: 'retired_duplicate' } },
  ];

  const results = await applyDuplicateFix(client, patches);
  const byId = Object.fromEntries(results.map((r) => [r.id, r]));
  assert.equal(byId['ok1'].status, 'applied');
  assert.equal(byId['bad'].status, 'failed');
  assert.match(byId['bad'].error, /boom/);
});
