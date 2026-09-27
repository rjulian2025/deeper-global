import test from 'node:test';
import assert from 'node:assert/strict';
import { runDataIntegrityAudit } from '../scripts/lib/data-integrity-audit.mjs';

function makeRows(count, sameCreatedAt = true) {
  const createdAt = '2026-01-01T00:00:00.000Z';
  const rows = [];
  for (let i = 1; i <= count; i++) {
    rows.push({
      id: String(i),
      slug: `slug-${i}`,
      question: `Question ${i}`,
      category: 'General Mental Health',
      raw_category: null,
      short_answer: '',
      answer: '',
      improved_title: '',
      improved_meta_description: '',
      improved_summary: '',
      answer_sections: [],
      key_takeaways: [],
      care_note: '',
      related_questions: [],
      suggested_schema_question: '',
      suggested_schema_answer: '',
      primary_theme: '',
      related_themes: [],
      source_refs: [],
      content_prompt_version: '',
      content_enriched_at: null,
      review_status: '',
      reviewed_by: '',
      reviewed_at: null,
      created_at: sameCreatedAt ? createdAt : new Date(Date.now() - i * 1000).toISOString(),
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
          // Build a comparator from requested orders
          let rows = allRows.slice();
          const effectiveOrders = ignoreIdOrder ? orders.filter((o) => o.field !== 'id') : orders.slice();
          const hasIdOrder = effectiveOrders.some((o) => o.field === 'id');
          if (orders.length === 0) {
            // default no-op
          } else {
            // Apply orders in the sequence requested
            rows.sort((a, b) => {
              for (const { field, ascending } of effectiveOrders) {
                if (field === 'created_at') {
                  const t = new Date(b.created_at) - new Date(a.created_at); // desc if ascending=false
                  if (t !== 0) return t * (ascending ? -1 : 1);
                } else if (field === 'id') {
                  const cmp = String(a.id).localeCompare(String(b.id));
                  if (cmp !== 0) return ascending ? cmp : -cmp;
                } else if (field === 'slug') {
                  const cmp = String(a.slug).localeCompare(String(b.slug));
                  if (cmp !== 0) return ascending ? cmp : -cmp;
                }
              }
              return 0;
            });
          }
          // Simulate unstable pagination when many created_at are tied and no id order provided:
          if (shuffleTiesWhenNoIdOrder && !hasIdOrder) {
            const createdAt = rows[0]?.created_at ?? null;
            const ties = rows.filter((r) => r.created_at === createdAt);
            const others = rows.filter((r) => r.created_at !== createdAt);
            // Deterministic shuffle per page index: flip order each page
            const pageSize = to - from + 1;
            const seed = Math.floor(from / pageSize);
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

test('audit handles many identical created_at with deterministic id tiebreaker', async () => {
  const data = makeRows(1200, true);
  const client = makeFakeClientWithUnstablePagination(data);
  const report = await runDataIntegrityAudit(client);
  assert.equal(report.summary.total_rows, 1200);
  const critIds = new Set(report.issues.filter((i) => i.severity === 'critical').map((i) => i.id));
  assert.equal(critIds.has('duplicate_slug'), false, 'no duplicate_slug when id tiebreaker present');
  assert.equal(critIds.has('pagination_duplicate_row'), false, 'no pagination_duplicate_row when id tiebreaker present');
});

test('audit detects pagination_duplicate_row when ids repeat', async () => {
  const base = makeRows(100, true);
  // Force a duplicate id occurrence in the second page
  const dup = { ...base[0] };
  const data = base.concat([dup]);
  const client = makeFakeClientWithUnstablePagination(data, { shuffleTiesWhenNoIdOrder: false });
  const report = await runDataIntegrityAudit(client);
  const critIds = new Set(report.issues.filter((i) => i.severity === 'critical').map((i) => i.id));
  assert.equal(critIds.has('pagination_duplicate_row'), true);
});
