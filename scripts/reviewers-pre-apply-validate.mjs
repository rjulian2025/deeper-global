#!/usr/bin/env node
/**
 * Pre-apply validation. Does not write to Supabase.
 * Sets production_ready when package/QA/credential blockers are clear and a
 * Supabase-connected Astro build attestation exists. apply_blocked stays true
 * until explicit human go-ahead (merge/deploy/SQL/indexing remain out of scope).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readCsv } from './lib/reviewers/csv-utils.mjs';
import { loadContributorsRuntime } from './lib/reviewers/load-contributors-runtime.mjs';

const OUT = 'reports/reviewer-migration';
const APPLY = join(OUT, 'apply-package');
const ATTESTATION = join(OUT, 'vercel-supabase-build-attestation.json');
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
} else if (String(amanda.credentials).trim().toUpperCase() !== 'MSW') {
  blockers.push(`Amanda Gaines credentials expected MSW, found "${amanda.credentials}"`);
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

let buildAttestation = null;
if (!existsSync(ATTESTATION)) {
  blockers.push(
    'Supabase-connected Astro build attestation missing (reports/reviewer-migration/vercel-supabase-build-attestation.json)'
  );
} else {
  buildAttestation = JSON.parse(readFileSync(ATTESTATION, 'utf8'));
  if (buildAttestation.ready_state !== 'READY' || !buildAttestation.supabase_connected) {
    blockers.push('Vercel Supabase build attestation is present but not READY/supabase_connected');
  }
  if (!buildAttestation.pages_built || buildAttestation.pages_built < 950) {
    blockers.push(`Attested pages_built too low: ${buildAttestation.pages_built}`);
  }
}

const productionReady = blockers.length === 0 && issues.length === 0;
const applyBlocked = true;
const softBlockers = [
  'production apply / merge / deploy / route activation / indexing remain blocked pending explicit human go-ahead',
];

console.log(
  JSON.stringify(
    {
      ok: issues.length === 0 && blockers.length === 0,
      production_ready: productionReady,
      apply_blocked: applyBlocked,
      issues,
      production_readiness_blockers: productionReady ? softBlockers : [...blockers, ...softBlockers],
      high_backfill: high.count,
      editorial_transition: editorial.count,
      rollback_rows: rollback.count,
      qa_pending: pending.length,
      qa_total: qaRows.length,
      amanda_credentials: amanda?.credentials || null,
      build_attestation: buildAttestation
        ? {
            deployment_id: buildAttestation.deployment_id,
            commit: buildAttestation.commit,
            pages_built: buildAttestation.pages_built,
            ready_state: buildAttestation.ready_state,
          }
        : null,
      sql_migration: 'supabase/migrations/20260716210000_clinical_attribution_model.sql',
      message: productionReady
        ? 'Technical readiness cleared. Apply/merge/deploy/indexing remain blocked until explicit go-ahead.'
        : 'Package not production-ready. Clear blockers before apply.',
    },
    null,
    2
  )
);
if (issues.length || blockers.length) process.exitCode = 1;
