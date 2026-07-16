#!/usr/bin/env node
/**
 * Pre-apply validation. Refuses production readiness until QA and blockers clear.
 * Does not write to Supabase.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readCsv } from './lib/reviewers/csv-utils.mjs';
import { loadContributorsRuntime } from './lib/reviewers/load-contributors-runtime.mjs';

const OUT = 'reports/reviewer-migration';
const APPLY = join(OUT, 'apply-package');
const required = [
  join(OUT, 'qa-sample.csv'),
  join(OUT, 'qa-sample.md'),
  join(OUT, 'qa-reconciliation-summary.md'),
  join(OUT, 'qa-human-overrides.csv'),
  join(OUT, 'qa-rejected-rules.csv'),
  join(OUT, 'qa-systemic-findings.md'),
  join(OUT, 'reviewer-coverage-coherence.csv'),
  join(OUT, 'reviewer-topic-outliers.csv'),
  join(OUT, 'unmatched-editorial-transition.csv'),
  join(OUT, 'profile-activation-readiness.csv'),
  join(APPLY, 'clinical-contributor-backfill-all-high.json'),
  join(APPLY, 'editorial-transition-145.json'),
  join(APPLY, 'rollback-mapping.json'),
  'src/data/clinical-contributors/qa-human-overrides.json',
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
const summary = JSON.parse(readFileSync(join(OUT, 'assignment-summary.json'), 'utf8'));
const qaRows = readCsv(join(OUT, 'qa-sample.csv'));
const contributors = loadContributorsRuntime();

const blockers = [];
const issues = [];

const pending = qaRows.filter(
  (r) => String(r.human_qa_decision || 'pending').trim().toLowerCase() === 'pending'
);
if (pending.length) {
  blockers.push(`${pending.length} QA sample row(s) still have human_qa_decision=pending`);
}

const amanda = contributors.find((c) => c.id === 'amanda-gaines');
if (!amanda) {
  blockers.push('Amanda Gaines clinician record missing from registry');
} else if (!amanda.credentials || /tbd|needs.?correction/i.test(String(amanda.credentials))) {
  blockers.push(
    "Amanda Gaines's credentials are not corrected (still missing / TBD on source profile)"
  );
}

const erin = contributors.find((c) => c.id === 'erin-benator');
if (!erin) {
  blockers.push('Erin Benator clinician record missing from registry');
} else if (erin.assignmentEligibility !== 'report_only' || erin.roleClass !== 'intern') {
  blockers.push('Erin Benator must remain excluded from publication (report_only / intern)');
} else {
  const erinAssigned = (high.rows || []).some((r) => r.clinical_contributor_id === 'erin-benator');
  if (erinAssigned) blockers.push('Erin Benator appears in high-confidence apply package; must remain excluded');
}

if (!rollback.count || rollback.count !== high.count + editorial.count) {
  issues.push(`rollback_count_mismatch_expected_${high.count + editorial.count}_got_${rollback.count}`);
}

if (summary.production_ready === true) {
  issues.push('assignment_summary_claims_production_ready_while_gate_active');
}

const allBlockers = [
  ...blockers,
  'full Astro production build with Supabase access must pass before apply',
  'production apply / merge / deploy / route activation / indexing remain blocked',
];
const localChecksClear = blockers.length === 0 && issues.length === 0;
// Hard gate: even if local checks pass, apply remains blocked until explicit human go-ahead + Astro build.
const applyBlocked = true;

console.log(
  JSON.stringify(
    {
      ok: issues.length === 0 && blockers.length === 0,
      production_ready: false,
      apply_blocked: applyBlocked,
      issues,
      production_readiness_blockers: allBlockers,
      high_backfill: high.count,
      editorial_transition: editorial.count,
      rollback_rows: rollback.count,
      qa_pending: pending.length,
      qa_total: qaRows.length,
      sql_migration: 'supabase/migrations/20260716210000_clinical_attribution_model.sql',
      message: localChecksClear
        ? 'Local pre-apply checks clear, but apply remains blocked until Astro production build + explicit go-ahead.'
        : 'Package not production-ready. Complete human QA and clear blockers before apply.',
    },
    null,
    2
  )
);
if (issues.length || blockers.length) process.exitCode = 1;
