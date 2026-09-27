import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBackfillPlan } from '../scripts/lib/related-questions-backfill.mjs';

function q(slug, question, { category = 'General', primary_theme = '', related_themes = [], related_questions = [], review_status = '' } = {}) {
  return {
    id: slug,
    slug,
    question,
    category,
    raw_category: null,
    primary_theme,
    related_themes,
    related_questions,
    content_enriched_at: '2026-01-01T00:00:00.000Z',
    answer_sections: [{ heading: 'H', body: 'B' }, { heading: 'H2', body: 'B2' }, { heading: 'H3', body: 'B3' }],
    key_takeaways: ['a', 'b', 'c', 'd', 'e'],
    suggested_schema_question: '',
    suggested_schema_answer: '',
    review_status,
  };
}

test('backfill is deterministic, never exceeds 5, drops unresolvable, avoids self/redirect/retired', () => {
  const corpus = [
    q('a', 'Alpha one', { category: 'Cat', related_questions: ['Unresolvable X', 'Beta two'] }),
    q('b', 'Beta two', { category: 'Cat' }),
    q('c', 'Gamma three', { category: 'Cat' }),
    q('d', 'Delta four', { category: 'Cat' }),
    q('e', 'Epsilon five', { category: 'Cat' }),
    q('f', 'Zeta six', { category: 'Cat' }),
  ];
  const plan = buildBackfillPlan(corpus);
  const entry = plan['a'];
  assert.ok(entry, 'plan exists for a');
  assert.equal(entry.before.length <= 5, true);
  assert.equal(entry.after.length, 5);
  assert.ok(entry.dropped_unresolvable.includes('Unresolvable X'));
  assert.equal(new Set(entry.added.map((i) => i.slug)).has('a'), false, 'does not add self');
});

