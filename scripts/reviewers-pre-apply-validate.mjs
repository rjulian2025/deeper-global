#!/usr/bin/env node
/**
 * Pre-apply validation. Refuses if package incomplete or apply is requested.
 * Does not write to Supabase.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'reports/reviewer-migration';
const APPLY = join(OUT, 'apply-package');
const required = [
  join(OUT, 'qa-sample.csv'),
  join(OUT, 'qa-sample.md'),
  join(OUT, 'reviewer-coverage-coherence.csv'),
  join(OUT, 'reviewer-topic-outliers.csv'),
  join(OUT, 'unmatched-editorial-transition.csv'),
  join(OUT, 'profile-activation-readiness.csv'),
  join(APPLY, 'clinical-contributor-backfill-all-high.json'),
  join(APPLY, 'editorial-transition-145.json'),
  join(APPLY, 'rollback-mapping.json'),
  'supabase/migrations/20260716210000_clinical_attribution_model.sql',
  'supabase/migrations/20260716210000_clinical_attribution_model.rollback.sql',
];

const missing = required.filter((p) => !existsSync(p));
if (missing.length) {
  console.error(JSON.stringify({ ok: false, error: 'missing_artifacts', missing }, null, 2));
  process.exitCode = 1;
  process.exit();
}

const high = JSON.parse(readFileSync(join(APPLY, 'clinical-contributor-backfill-all-high.json'), 'utf8'));
const editorial = JSON.parse(readFileSync(join(APPLY, 'editorial-transition-145.json'), 'utf8'));
const rollback = JSON.parse(readFileSync(join(APPLY, 'rollback-mapping.json'), 'utf8'));
const summary = JSON.parse(readFileSync(join(OUT, 'phase-c-summary.json'), 'utf8'));

const issues = [];
if (high.count !== 923) issues.push(`expected_923_high_got_${high.count}`);
if (editorial.count !== 145) issues.push(`expected_145_editorial_got_${editorial.count}`);
if (rollback.count !== 923 + 145) issues.push(`expected_1068_rollback_got_${rollback.count}`);
if (summary.high_confidence_original !== 923) issues.push('summary_high_mismatch');

console.log(
  JSON.stringify(
    {
      ok: issues.length === 0,
      issues,
      high_backfill: high.count,
      editorial_transition: editorial.count,
      rollback_rows: rollback.count,
      sql_migration: 'supabase/migrations/20260716210000_clinical_attribution_model.sql',
      apply_blocked: true,
      message: 'Package valid for review. Do not apply until human QA on qa-sample.csv is complete.',
    },
    null,
    2
  )
);
if (issues.length) process.exitCode = 1;
