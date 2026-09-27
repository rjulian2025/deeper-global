import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchAllQuestionsCompact } from '../scripts/lib/duplicate-slug-fixer.mjs';

function makeRows(count, sameCreatedAt = true) {
  const createdAt = '2026-01-01T00:00:00.000Z';
  const rows = [];
  for (let i = 1; i <= count; i++) {
    rows.push({
      id: String(i),
      slug: `slug-${i}`,
      review_status: '',
      reviewed_by: null,
      reviewed_at: null,
      content_enriched_at: null,
      created_at: sameCreatedAt ? createdAt : new Date(Date.now() - i * 1000).toISOString(),
      updated_at: null,
      citation_notes: '',
    });
  }
  return rows;
}

function makeFakeClientWithUnstablePagination(allRows, { shuffleTiesWhenNoIdOrder = true, ignoreIdOrder = false } = {}) {
  return {
    from() {
      const orders = [];
      const chain = {
        select() {
          return chain;
        },
        order(field, opts = {}) {
          orders.push({ field, ascending: Boolean(opts?.ascending) });
          return chain;
        },
        range(from, to) {
          let rows = allRows.slice();
          const effectiveOrders = ignoreIdOrder ? orders.filter((o) => o.field !== 'id') : orders.slice();
          const hasIdOrder = effectiveOrders.some((o) => o.field === 'id');
          if (effectiveOrders.length) {
            rows.sort((a, b) => {
              for (const { field, ascending } of effectiveOrders) {
                if (field === 'created_at') {
                  const t = new Date(b.created_at) - new Date(a.created_at);
                  if (t !== 0) return t * (ascending ? -1 : 1);
                } else if (field === 'id') {
                  const cmp = String(a.id).localeCompare(String(b.id));
                  if (cmp !== 0) return ascending ? cmp : -cmp;
                }
              }
              return 0;
            });
          }
          if (shuffleTiesWhenNoIdOrder && !hasIdOrder) {
            const createdAt = rows[0]?.created_at ?? null;
            const ties = rows.filter((r) => r.created_at === createdAt);
            const others = rows.filter((r) => r.created_at !== createdAt);
            const seed = from + to;
            ties.sort((a, b) => {
              const s = String(a.id).localeCompare(String(b.id));
              return (seed % 2 === 0) ? s : -s;
            });
            rows = ties.concat(others);
          }
          const slice = rows.slice(from, to + 1);
          return Promise.resolve({ data: slice, error: null });
        },
      };
      return chain;
    },
  };
}

test('fetchAllQuestionsCompact retrieves all rows stably with id tiebreaker', async () => {
  const data = makeRows(1200, true);
  const client = makeFakeClientWithUnstablePagination(data);
  const rows = await fetchAllQuestionsCompact(client);
  assert.equal(rows.length, 1200);
  const distinctIds = new Set(rows.map((r) => r.id));
  assert.equal(distinctIds.size, 1200);
});
