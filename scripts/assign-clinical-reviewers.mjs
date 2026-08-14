#!/usr/bin/env node
/**
 * Clinical contributor assignment (DRY-RUN ONLY by default).
 *
 *   npm run reviewers:assign -- --dry-run
 *   npm run reviewers:assign -- --dry-run --include-medium
 *
 * Refuses --apply in Phase A–B (no production mutation).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runAssignment } from './lib/reviewers/assignment-engine.mjs';

const OUT_DIR = 'reports/reviewer-migration';

function parseArgs(argv) {
  const args = {
    dryRun: true,
    apply: false,
    includeMedium: false,
    includeReportOnly: false,
  };
  for (const arg of argv) {
    if (arg === '--dry-run') args.dryRun = true;
    if (arg === '--apply') args.apply = true;
    if (arg === '--include-medium') args.includeMedium = true;
    if (arg === '--include-report-only') args.includeReportOnly = true;
  }
  return args;
}

function csvEscape(value) {
  const str = value == null ? '' : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function toCsv(rows, columns) {
  const header = columns.join(',');
  const lines = rows.map((row) => columns.map((col) => csvEscape(row[col])).join(','));
  return [header, ...lines].join('\n') + '\n';
}

function writeReport(name, content) {
  const path = join(OUT_DIR, name);
  writeFileSync(path, typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n');
  return path;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.apply) {
    console.error(
      JSON.stringify(
        {
          error: 'apply_blocked',
          message:
            'Phase A–B refuses production mutation. Re-run with --dry-run only. No Supabase writes will be performed.',
        },
        null,
        2
      )
    );
    process.exitCode = 2;
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const highOnly = await runAssignment({
    includeMedium: false,
    includeReportOnly: args.includeReportOnly,
  });
  const withMedium = await runAssignment({
    includeMedium: true,
    includeReportOnly: args.includeReportOnly,
  });

  const detailCols = [
    'answer_id',
    'answer_slug',
    'current_reviewer_id',
    'current_public_reviewer_name',
    'proposed_contributor_id',
    'proposed_contributor_name',
    'best_contributor_id',
    'best_contributor_name',
    'matched_specialty',
    'deeper_topic',
    'deeper_topic_name',
    'deeper_theme',
    'deeper_category',
    'score',
    'confidence',
    'match_reasons',
    'exclusions_evaluated',
    'soft_cap_impact',
    'profile_completeness',
    'profile_publishable',
    'blocked_incomplete',
    'proposed_public_label',
    'assignment_method',
    'approval_source_internal',
    'misleading_review_date_today',
    'reviewed_at_legacy',
  ];

  const details = highOnly.details;
  const highRows = details.filter((d) => d.proposed_contributor_id && d.confidence === 'high');
  const mediumRows = details.filter((d) => d.confidence === 'medium');
  const lowRows = details.filter((d) => d.confidence === 'low');
  const unmatchedRows = details.filter((d) => d.confidence === 'unmatched' || (!d.proposed_contributor_id && d.confidence !== 'high'));
  // cleaner unmatched = no proposal under high-only defaults
  const unmatchedDefault = details.filter((d) => !d.proposed_contributor_id);

  const mediumIfIncluded = withMedium.details.filter((d) => d.proposed_contributor_id && d.confidence === 'medium');

  const summary = {
    ...highOnly.meta,
    counts: {
      ...highOnly.counts,
      medium_confidence_total: mediumRows.length,
      medium_would_assign_if_included: mediumIfIncluded.length,
      low_confidence: lowRows.length,
      unmatched_default: unmatchedDefault.length,
      blocked_incomplete_profiles: details.filter((d) => d.blocked_incomplete).length,
      ken_remaining_under_high_only: highOnly.meta.ken_evaluated - highRows.length,
      ken_remaining_if_medium_included:
        highOnly.meta.ken_evaluated - highRows.length - mediumIfIncluded.length,
    },
    distribution_high_only: highOnly.distribution,
    distribution_if_medium_included: withMedium.distribution,
    soft_cap_exceptions: highOnly.softCapExceptions,
    unmatched_end_state_scenarios: highOnly.unmatchedScenarios,
    sample_explanations: pickRepresentativeSamples(details, 20),
  };

  function pickRepresentativeSamples(rows, limit) {
    const picked = [];
    const seenTopics = new Set();
    const high = rows.filter((d) => d.proposed_contributor_id && d.confidence === 'high');
    const medium = rows.filter((d) => d.confidence === 'medium');
    const unmatched = rows.filter((d) => !d.proposed_contributor_id);

    for (const d of high) {
      if (picked.length >= Math.min(14, limit)) break;
      if (seenTopics.has(d.deeper_topic) && seenTopics.size < 10) continue;
      seenTopics.add(d.deeper_topic);
      picked.push(d);
    }
    for (const d of medium) {
      if (picked.length >= Math.min(17, limit)) break;
      picked.push(d);
    }
    for (const d of unmatched) {
      if (picked.length >= limit) break;
      picked.push(d);
    }
    while (picked.length < limit && high[picked.length]) picked.push(high[picked.length]);

    return picked.slice(0, limit).map((d) => ({
      slug: d.answer_slug,
      topic: d.deeper_topic_name,
      theme: d.deeper_theme,
      from: d.current_reviewer_id,
      to: d.proposed_contributor_id,
      to_name: d.proposed_contributor_name,
      confidence: d.confidence,
      specialty: d.matched_specialty,
      score: d.score,
      reasons: d.match_reasons,
      public_label: d.proposed_public_label,
      misleading_review_date_today: d.misleading_review_date_today,
    }));
  }

  writeReport('assignment-summary.json', summary);
  writeReport('assignment-detail.csv', toCsv(details, detailCols));
  writeReport('high-confidence-assignments.csv', toCsv(highRows, detailCols));
  writeReport('medium-confidence-assignments.csv', toCsv(mediumRows, detailCols));
  writeReport('low-confidence-assignments.csv', toCsv(lowRows, detailCols));
  writeReport('unmatched-answers.csv', toCsv(unmatchedDefault, detailCols));

  const distRows = Object.entries(highOnly.distribution).map(([id, row]) => ({
    contributor_id: id,
    full_name: row.fullName,
    proposed_high: row.proposed_high,
    proposed_if_medium_included: withMedium.distribution[id]?.proposed_all_included ?? 0,
    profile_status: row.profileStatus,
    assignment_eligibility: row.assignmentEligibility,
    publishable: row.publishable,
  }));
  writeReport(
    'reviewer-distribution.csv',
    toCsv(distRows, [
      'contributor_id',
      'full_name',
      'proposed_high',
      'proposed_if_medium_included',
      'profile_status',
      'assignment_eligibility',
      'publishable',
    ])
  );

  // Topic coverage before/after
  const topicBefore = new Map();
  const topicAfter = new Map();
  for (const d of details) {
    topicBefore.set(d.deeper_topic, (topicBefore.get(d.deeper_topic) || 0) + 1);
    if (d.proposed_contributor_id) {
      topicAfter.set(d.deeper_topic, (topicAfter.get(d.deeper_topic) || 0) + 1);
    }
  }
  const topicRows = [...new Set([...topicBefore.keys(), ...topicAfter.keys()])].sort().map((topic) => ({
    topic,
    ken_before: topicBefore.get(topic) || 0,
    high_confidence_reassigned: topicAfter.get(topic) || 0,
    remaining_if_high_only: (topicBefore.get(topic) || 0) - (topicAfter.get(topic) || 0),
  }));
  writeReport(
    'topic-coverage-before-after.csv',
    toCsv(topicRows, ['topic', 'ken_before', 'high_confidence_reassigned', 'remaining_if_high_only'])
  );

  writeReport(
    'ken-attribution-remaining.csv',
    toCsv(unmatchedDefault, [
      'answer_id',
      'answer_slug',
      'current_reviewer_id',
      'deeper_topic',
      'deeper_topic_name',
      'confidence',
      'best_contributor_id',
      'score',
      'match_reasons',
      'exclusions_evaluated',
      'misleading_review_date_today',
    ])
  );

  const legacyRisk = details
    .filter((d) => d.misleading_review_date_today)
    .map((d) => ({
      answer_id: d.answer_id,
      answer_slug: d.answer_slug,
      current_reviewer_id: d.current_reviewer_id,
      reviewed_at_legacy: d.reviewed_at_legacy,
      risk: 'UI currently can present bulk approval date as individual clinical review date',
      proposed_ui_fix: 'Clinical contributor with no review date (or Updated date only)',
    }));
  writeReport(
    'legacy-review-date-risk.csv',
    toCsv(legacyRisk, [
      'answer_id',
      'answer_slug',
      'current_reviewer_id',
      'reviewed_at_legacy',
      'risk',
      'proposed_ui_fix',
    ])
  );

  // Identity resolution report
  const identity = [
    {
      legacy_id: 'kenneth-w-christian-phd',
      displayed_name: 'Kenneth W. Christian, PhD',
      specialty_lane: 'Performance, Purpose & Self-Limiting Patterns',
      canonical_id: 'kenneth-w-christian-phd',
      status: 'canonical',
      live_answer_count: highOnly.answers.filter((a) => a.reviewed_by === 'kenneth-w-christian-phd').length,
      notes: 'Canonical Ken person ID; 0 live answers currently',
    },
    {
      legacy_id: 'david-k-gore-phd',
      displayed_name: 'Kenneth W. Christian, PhD',
      specialty_lane: 'Addiction & Recovery',
      canonical_id: 'kenneth-w-christian-phd',
      status: 'legacy_alias_misnamed',
      live_answer_count: highOnly.answers.filter((a) => a.reviewed_by === 'david-k-gore-phd').length,
      notes: 'Misnamed ID displaying as Ken; holds bulk corpus; redirect later; hide duplicate directory entry',
    },
  ];
  writeReport(
    'identity-resolution.csv',
    toCsv(identity, [
      'legacy_id',
      'displayed_name',
      'specialty_lane',
      'canonical_id',
      'status',
      'live_answer_count',
      'notes',
    ])
  );

  const completeness = highOnly.contributors.map((c) => ({
    contributor_id: c.id,
    full_name: c.fullName,
    profile_status: c.profileStatus,
    assignment_eligibility: c.assignmentEligibility,
    publishable: c.publishable,
    profile_gaps: (c.profileGaps || []).join('|'),
    specialty_count: c.specialties.length,
    external_url: c.externalPracticeUrl,
  }));
  writeReport(
    'profile-completeness.csv',
    toCsv(completeness, [
      'contributor_id',
      'full_name',
      'profile_status',
      'assignment_eligibility',
      'publishable',
      'profile_gaps',
      'specialty_count',
      'external_url',
    ])
  );

  const sourceData = highOnly.contributors.map((c) => ({
    contributor_id: c.id,
    full_name: c.fullName,
    credentials: c.credentials,
    professional_title: c.professionalTitle,
    specialties: c.specialties.join('|'),
    source_url: c.externalPracticeUrl,
    role_class: c.roleClass,
    retrieved_at: '2026-07-16',
  }));
  writeReport(
    'clinician-source-data.csv',
    toCsv(sourceData, [
      'contributor_id',
      'full_name',
      'credentials',
      'professional_title',
      'specialties',
      'source_url',
      'role_class',
      'retrieved_at',
    ])
  );

  writeReport(
    'soft-cap-exceptions.csv',
    toCsv(highOnly.softCapExceptions, [
      'answer_id',
      'answer_slug',
      'contributor_id',
      'score',
      'confidence',
      'reason',
    ])
  );

  const protectedAudit = highOnly.protectedAnswers.map((a) => {
    let accurate_label = 'Clinical reviewer';
    let notes = 'Protected; not reassigned';
    if (a.reviewed_by === 'rick-julian') {
      accurate_label = 'Editorial reviewer';
      notes = 'Rick is editorial/authorial, not a clinical reviewer';
    } else if (a.reviewed_by === 'alex-crenshaw-phd') {
      accurate_label = 'Clinical reviewer (existing page-level attribution retained)';
      notes = 'Link into Peachtree org graph; keep current assignments';
    } else if (a.reviewed_by === 'michelle-morris-lpc') {
      accurate_label = 'Clinical reviewer';
      notes = 'Not Peachtree; preserve Imago assignments';
    }
    return {
      answer_id: a.id,
      answer_slug: a.slug,
      reviewed_by: a.reviewed_by,
      topic: a.topic,
      reviewed_at: a.reviewed_at,
      accurate_public_label: accurate_label,
      notes,
    };
  });
  writeReport(
    'protected-assignment-audit.csv',
    toCsv(protectedAudit, [
      'answer_id',
      'answer_slug',
      'reviewed_by',
      'topic',
      'reviewed_at',
      'accurate_public_label',
      'notes',
    ])
  );

  console.log(
    JSON.stringify(
      {
        mode: 'dry-run',
        out_dir: OUT_DIR,
        ken_evaluated: summary.counts.ken_evaluated ?? highOnly.meta.ken_evaluated,
        high_confidence_proposed: highRows.length,
        medium_confidence_total: mediumRows.length,
        medium_would_assign_if_included: mediumIfIncluded.length,
        low_confidence: lowRows.length,
        unmatched_default: unmatchedDefault.length,
        blocked_incomplete: details.filter((d) => d.blocked_incomplete).length,
        ken_remaining_high_only: highOnly.meta.ken_evaluated - highRows.length,
        soft_cap_exceptions: highOnly.softCapExceptions.length,
        reports_written: 15,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
