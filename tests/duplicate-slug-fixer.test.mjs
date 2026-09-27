import test from 'node:test';
import assert from 'node:assert/strict';
import { planDuplicateFixFromRows } from '../scripts/lib/duplicate-slug-fixer.mjs';

function row(overrides) {
  return {
    id: crypto.randomUUID(),
    slug: 'example-slug',
    review_status: '',
    reviewed_by: null,
    reviewed_at: null,
    content_enriched_at: null,
    created_at: new Date().toISOString(),
    updated_at: null,
    citation_notes: '',
    ...overrides,
  };
}

test('planDuplicateFixFromRows returns empty plan when no duplicates', () => {
  const rows = [row({ slug: 'a' }), row({ slug: 'b' })];
  const plan = planDuplicateFixFromRows(rows);
  assert.equal(plan.duplicates, 0);
  assert.equal(plan.patches.length, 0);
});

test('planDuplicateFixFromRows selects canonical and retires others', () => {
  const a1 = row({ slug: 'a', review_status: 'reviewed', id: '1', created_at: '2020-01-01T00:00:00.000Z' });
  const a2 = row({ slug: 'a', review_status: 'draft', id: '2', created_at: '2020-01-02T00:00:00.000Z' });
  const rows = [a1, a2];
  const plan = planDuplicateFixFromRows(rows);
  assert.equal(plan.duplicates, 1);
  assert.equal(plan.patches.length, 1);
  const patch = plan.patches[0];
  assert.equal(patch.canonical_id, '1');
  assert.equal(patch.update.id, '2');
  assert.match(patch.update.slug, /^a-retired-duplicate-/);
});

