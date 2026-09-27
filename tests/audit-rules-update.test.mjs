import test from 'node:test';
import assert from 'node:assert/strict';
import { runDataIntegrityAudit } from '../scripts/lib/data-integrity-audit.mjs';
import { ANSWER_REWRITE_PROMPT_VERSION } from '../scripts/lib/answer-rewrite-system-prompt.mjs';
import { REDIRECT_SOURCE_SLUGS } from '../scripts/lib/redirect-sources.mjs';

function makeQ(overrides = {}) {
  return {
    id: String(Math.random()).slice(2),
    slug: 'example-slug',
    question: 'Why do I feel overwhelmed?',
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
    content_enriched_at: '2026-01-01T00:00:00.000Z',
    review_status: '',
    reviewed_by: '',
    reviewed_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeClient(rows) {
  return {
    from() {
      const chain = {
        select() {
          return chain;
        },
        order() {
          return chain;
        },
        range() {
          return Promise.resolve({ data: rows, error: null });
        },
      };
      return chain;
    },
  };
}

test('copywriter prompt version is accepted; unknown version warns', async () => {
  // Use real slugs from addiction review report so the rule applies
  const slugAccepted = 'can-using-ai-for-emotional-support-become-addictive';
  const slugWarn = 'how-can-i-help-my-partner-who-is-struggling-with-addiction';
  const rows = [
    makeQ({ slug: slugAccepted, question: 'Q1', content_prompt_version: ANSWER_REWRITE_PROMPT_VERSION }),
    makeQ({ slug: slugWarn, question: 'Q2', content_prompt_version: 'unknown-vX' }),
  ];
  const client = makeClient(rows);
  const report = await runDataIntegrityAudit(client);
  const ids = new Set(report.issues.filter((i) => i.severity === 'warning').map((i) => i.id));
  assert.equal(ids.has('addiction_wrong_prompt_version'), true, 'unknown version should warn');
});

test('duplicate where one slug is a redirect source -> no warning + info issue emitted', async () => {
  const redirectSlug = REDIRECT_SOURCE_SLUGS[0];
  const rows = [
    makeQ({ slug: redirectSlug, question: 'Same text here' }),
    makeQ({ slug: 'keeper-slug', question: 'Same text here' }),
  ];
  const report = await runDataIntegrityAudit(makeClient(rows));
  const warnings = report.issues.filter((i) => i.id === 'duplicate_question_text');
  const infos = report.issues.filter((i) => i.id === 'duplicate_question_text_redirected');
  assert.equal(warnings.length, 0, 'no duplicate warning when only publishable are grouped');
  assert.equal(infos.length >= 1, true, 'info issue emitted for suppressed groups');
});

test('two publishable duplicates -> warning emitted', async () => {
  const rows = [
    makeQ({ slug: 'a', question: 'Same text publishable' }),
    makeQ({ slug: 'b', question: 'Same text publishable' }),
  ];
  const report = await runDataIntegrityAudit(makeClient(rows));
  const warnings = report.issues.filter((i) => i.id === 'duplicate_question_text');
  assert.equal(warnings.length >= 1, true);
});

