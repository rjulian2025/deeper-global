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

test('audit handles many identical created_at with deterministic id tiebreaker', async () => {
  const data = makeRows(1200, true);
  const pageSize = 500;
  let lastFrom = -1;

  const client = {
    from() {
      return {
        select() {
          return {
            order(field, { ascending }) {
              // We honor both created_at then id ordering
              return {
                order(field2, { ascending: asc2 }) {
                  return {
                    range(from, to) {
                      lastFrom = from;
                      const slice = data
                        .slice()
                        .sort((a, b) => {
                          // created_at descending
                          const t = new Date(b.created_at) - new Date(a.created_at);
                          if (t !== 0) return t * (ascending ? -1 : 1);
                          // id ascending tiebreak
                          return String(a.id).localeCompare(String(b.id)) * (asc2 ? 1 : -1);
                        })
                        .slice(from, to + 1);
                      return Promise.resolve({ data: slice, error: null });
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
  };

  const report = await runDataIntegrityAudit(client);
  assert.equal(report.summary.total_rows, 1200);
  const critIds = new Set(report.issues.filter((i) => i.severity === 'critical').map((i) => i.id));
  assert.equal(critIds.has('duplicate_slug'), false);
  assert.equal(critIds.has('pagination_duplicate_row'), false);
});

test('audit detects pagination_duplicate_row when ids repeat', async () => {
  const base = makeRows(100, true);
  // Force a duplicate id occurrence in the second page
  const dup = { ...base[0] };
  const data = base.concat([dup]);
  const client = {
    from() {
      return {
        select() {
          return {
            order() {
              return {
                order() {
                  return {
                    range(from, to) {
                      const slice = data.slice(from, to + 1);
                      return Promise.resolve({ data: slice, error: null });
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
  };
  const report = await runDataIntegrityAudit(client);
  const critIds = new Set(report.issues.filter((i) => i.severity === 'critical').map((i) => i.id));
  assert.equal(critIds.has('pagination_duplicate_row'), true);
});
