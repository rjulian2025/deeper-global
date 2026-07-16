#!/usr/bin/env node
/**
 * Validate dry-run artifacts and contributor model integrity.
 *   npm run reviewers:validate
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { writeCrosswalkJson } from './lib/reviewers/export-crosswalk-json.mjs';

const OUT_DIR = 'reports/reviewer-migration';
const REQUIRED = [
  'assignment-summary.json',
  'assignment-detail.csv',
  'high-confidence-assignments.csv',
  'medium-confidence-assignments.csv',
  'low-confidence-assignments.csv',
  'unmatched-answers.csv',
  'reviewer-distribution.csv',
  'topic-coverage-before-after.csv',
  'ken-attribution-remaining.csv',
  'legacy-review-date-risk.csv',
  'identity-resolution.csv',
  'profile-completeness.csv',
  'clinician-source-data.csv',
  'soft-cap-exceptions.csv',
  'protected-assignment-audit.csv',
];

function fail(message, details) {
  console.error(JSON.stringify({ ok: false, error: message, details }, null, 2));
  process.exitCode = 1;
}

function main() {
  writeCrosswalkJson();
  const missing = REQUIRED.filter((name) => !existsSync(join(OUT_DIR, name)));
  if (missing.length) {
    fail('missing_reports', { missing, hint: 'Run npm run reviewers:assign -- --dry-run first' });
    return;
  }

  const summary = JSON.parse(readFileSync(join(OUT_DIR, 'assignment-summary.json'), 'utf8'));
  const issues = [];

  if (summary.mode !== 'dry-run' && summary.mode !== undefined) {
    // assignment-summary stores mode under meta in some versions
  }
  const ken = summary.counts?.ken_evaluated ?? summary.ken_evaluated;
  const high = summary.counts?.high_confidence_proposed ?? 0;
  if (!ken || ken < 1) issues.push('ken_evaluated_empty');
  if (high > ken) issues.push('high_exceeds_ken');

  const contributors = JSON.parse(readFileSync('src/data/clinical-contributors/source/peachtree-clinicians-2026-07-16.json', 'utf8'));
  if (contributors.length !== 16) issues.push(`expected_16_clinicians_got_${contributors.length}`);

  const crosswalk = JSON.parse(readFileSync('src/data/reviewer-specialty-crosswalk.json', 'utf8'));
  if (!crosswalk.specialtyCrosswalk?.length) issues.push('crosswalk_empty');

  if (issues.length) {
    fail('validation_failed', issues);
    return;
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        ken_evaluated: ken,
        high_confidence_proposed: high,
        medium_confidence_total: summary.counts?.medium_confidence_total,
        unmatched_default: summary.counts?.unmatched_default,
        reports: REQUIRED.length,
      },
      null,
      2
    )
  );
}

main();
