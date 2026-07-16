#!/usr/bin/env node
/**
 * Reconcile completed human QA decisions from qa-sample.csv into the
 * assignment corpus, persist version-controlled overrides, regenerate reports,
 * and evaluate production readiness.
 *
 * Does NOT mutate production data, merge, deploy, activate routes, or change indexing.
 *
 * Usage:
 *   npm run reviewers:reconcile-qa
 *   npm run reviewers:reconcile-qa -- --qa-csv=reports/reviewer-migration/qa-sample.csv
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCsv, writeCsv, writeJson } from './lib/reviewers/csv-utils.mjs';
import {
  loadContributorsRuntime,
  contributorsById,
  isReplacementEligible,
  extractRuleKey,
} from './lib/reviewers/load-contributors-runtime.mjs';
import { regenerateAssignmentReports } from './lib/reviewers/regenerate-assignment-reports.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REPORT_DIR = join(ROOT, 'reports/reviewer-migration');
const OVERRIDES_PATH = join(ROOT, 'src/data/clinical-contributors/qa-human-overrides.json');

const VALID_DECISIONS = new Set(['approve', 'revise', 'reject', 'pending']);

const QA_COLUMNS = [
  'answer_title',
  'answer_slug',
  'answer_url',
  'answer_id',
  'proposed_clinician_id',
  'proposed_clinician_name',
  'clinician_credentials',
  'clinician_professional_title',
  'verified_specialties',
  'matched_specialty',
  'deeper_topic',
  'deeper_topic_name',
  'deeper_category',
  'deeper_theme',
  'exact_match_reason',
  'assignment_score',
  'confidence',
  'confidence_threshold_margin',
  'match_type',
  'other_eligible_clinicians',
  'why_selected_won',
  'reviewer_share_before_pct',
  'reviewer_share_after_pct',
  'sample_inclusion_reasons',
  'ymyl_flag',
  'human_qa_decision',
  'human_qa_replacement_clinician_id',
  'human_qa_notes',
];

function argValue(name, fallback = null) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

function pct(n, total) {
  if (!total) return '0%';
  return `${((n / total) * 100).toFixed(1)}%`;
}

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

function loadOverridesDoc() {
  if (!existsSync(OVERRIDES_PATH)) {
    return {
      version: 1,
      description:
        'Human QA overrides for clinical contributor assignments. Automatic assign runs must never overwrite these decisions.',
      updated_at: null,
      overrides: {},
    };
  }
  return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'));
}

function ensureQaRows(rows) {
  return rows.map((row) => ({
    ...row,
    human_qa_decision: String(row.human_qa_decision || 'pending').trim().toLowerCase(),
    human_qa_replacement_clinician_id: row.human_qa_replacement_clinician_id ?? '',
    human_qa_notes: row.human_qa_notes ?? '',
  }));
}

function parseOtherEligible(raw) {
  if (!raw) return [];
  return String(raw)
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.replace(/\(.*\)$/, '').trim())
    .filter(Boolean);
}

function loadCorpus() {
  const detailPath = join(REPORT_DIR, 'assignment-detail.csv');
  if (!existsSync(detailPath)) {
    console.error('Missing assignment-detail.csv. Run `npm run reviewers:assign` first.');
    process.exit(1);
  }
  /** @type {Map<string, Record<string, any>>} */
  const bySlug = new Map();
  for (const row of readCsv(detailPath)) {
    if (!row.answer_slug) continue;
    bySlug.set(row.answer_slug, { ...row });
  }
  return bySlug;
}

function detectSystemicPatterns(qaRows) {
  /** @type {Map<string, { rejects: number, revisions: number, approves: number, total: number, rule_type: string, sample_slugs: string[] }>} */
  const byRule = new Map();
  /** @type {Map<string, { revisions: number, rejects: number, approves: number }>} */
  const byClinician = new Map();
  /** @type {Map<string, { corrections: number, total: number }>} */
  const byParentTheme = new Map();
  /** @type {Map<string, { corrections: number, total: number }>} */
  const byKeywordAlias = new Map();

  for (const row of qaRows) {
    const decision = row.human_qa_decision;
    const reasons = row.exact_match_reason || '';
    const ruleKey = extractRuleKey(reasons, row.matched_specialty, row.deeper_topic);
    const ruleType = /parent_theme:/.test(reasons)
      ? 'parent_theme'
      : /alias_keyword:|preferred_specialty_keyword:/.test(reasons)
        ? 'keyword_or_alias'
        : /exact_topic:/.test(reasons)
          ? 'exact_topic'
          : 'other';

    const rule = byRule.get(ruleKey) || {
      rejects: 0,
      revisions: 0,
      approves: 0,
      total: 0,
      rule_type: ruleType,
      sample_slugs: [],
    };
    rule.total += 1;
    if (decision === 'reject') {
      rule.rejects += 1;
      if (rule.sample_slugs.length < 5) rule.sample_slugs.push(row.answer_slug);
    } else if (decision === 'revise') {
      rule.revisions += 1;
      if (rule.sample_slugs.length < 5) rule.sample_slugs.push(row.answer_slug);
    } else if (decision === 'approve') {
      rule.approves += 1;
    }
    byRule.set(ruleKey, rule);

    const clinicianId = row.proposed_clinician_id || '';
    if (clinicianId) {
      const c = byClinician.get(clinicianId) || { revisions: 0, rejects: 0, approves: 0 };
      if (decision === 'revise') c.revisions += 1;
      if (decision === 'reject') c.rejects += 1;
      if (decision === 'approve') c.approves += 1;
      byClinician.set(clinicianId, c);
    }

    for (const token of String(reasons).split('|')) {
      const t = token.trim();
      if (t.startsWith('parent_theme:')) {
        const p = byParentTheme.get(t) || { corrections: 0, total: 0 };
        p.total += 1;
        if (decision === 'reject' || decision === 'revise') p.corrections += 1;
        byParentTheme.set(t, p);
      }
      if (t.startsWith('alias_keyword:') || t.startsWith('preferred_specialty_keyword:')) {
        const k = byKeywordAlias.get(t) || { corrections: 0, total: 0 };
        k.total += 1;
        if (decision === 'reject' || decision === 'revise') k.corrections += 1;
        byKeywordAlias.set(t, k);
      }
    }
  }

  const recommendations = [];
  for (const [ruleKey, stats] of byRule) {
    const rejectRate = stats.total > 0 ? stats.rejects / stats.total : 0;
    if (stats.rejects >= 2 || stats.revisions >= 3 || rejectRate > 0.1) {
      recommendations.push({
        rule_key: ruleKey,
        rule_type: stats.rule_type,
        rejects: stats.rejects,
        revisions: stats.revisions,
        total_qa: stats.total,
        reject_rate: Number((rejectRate * 100).toFixed(1)),
        triggers: [
          stats.rejects >= 2 ? '≥2 rejects' : null,
          stats.revisions >= 3 ? '≥3 revisions' : null,
          rejectRate > 0.1 ? '>10% rejection rate' : null,
        ].filter(Boolean),
        sample_slugs: stats.sample_slugs,
        recommendation:
          stats.rejects >= 2
            ? 'Narrow or remove this specialty→topic/theme rule from the crosswalk before production apply.'
            : stats.revisions >= 3
              ? 'Review automatic clinician selection for this rule; strengthen specialty anchors or remove weak aliases.'
              : 'Rejection rate above 10% in QA sample; tighten match criteria before apply.',
      });
    }
  }

  return {
    recommendations: recommendations.sort(
      (a, b) => b.rejects - a.rejects || b.revisions - a.revisions
    ),
    multiRejectRules: [...byRule.entries()]
      .filter(([, s]) => s.rejects >= 2)
      .map(([k, s]) => ({ rule_key: k, rejects: s.rejects, total: s.total })),
    multiReviseClinicians: [...byClinician.entries()]
      .filter(([, s]) => s.revisions >= 2)
      .map(([id, s]) => ({
        clinician_id: id,
        revisions: s.revisions,
        rejects: s.rejects,
        approves: s.approves,
      })),
    parentThemeIssues: [...byParentTheme.entries()]
      .filter(([, s]) => s.corrections >= 2 && s.total > 0 && s.corrections / s.total >= 0.25)
      .map(([k, s]) => ({
        rule: k,
        corrections: s.corrections,
        total: s.total,
        correction_rate: Number(((s.corrections / s.total) * 100).toFixed(1)),
      })),
    keywordAliasIssues: [...byKeywordAlias.entries()]
      .filter(([, s]) => s.corrections >= 2 && s.total > 0 && s.corrections / s.total >= 0.25)
      .map(([k, s]) => ({
        rule: k,
        corrections: s.corrections,
        total: s.total,
        correction_rate: Number(((s.corrections / s.total) * 100).toFixed(1)),
      })),
  };
}

function buildSystemicFindingsMd(patterns, decisionCounts, totalQa) {
  const lines = [
    '# QA systemic findings',
    '',
    'Generated by `npm run reviewers:reconcile-qa`.',
    '',
    '## Decision mix',
    '',
    '| Decision | Count | % of QA sample |',
    '|---|---:|---:|',
    `| approve | ${decisionCounts.approve} | ${pct(decisionCounts.approve, totalQa)} |`,
    `| revise | ${decisionCounts.revise} | ${pct(decisionCounts.revise, totalQa)} |`,
    `| reject | ${decisionCounts.reject} | ${pct(decisionCounts.reject, totalQa)} |`,
    `| pending | ${decisionCounts.pending} | ${pct(decisionCounts.pending, totalQa)} |`,
    '',
    '## Recommended crosswalk revisions',
    '',
    'Triggered when a rule has ≥2 rejects, ≥3 revisions, or >10% rejection rate in the QA sample.',
    '',
  ];

  if (patterns.recommendations.length === 0) {
    lines.push('_No crosswalk revision triggers yet (all QA rows may still be pending)._', '');
  } else {
    lines.push(
      '| Rule | Type | Rejects | Revisions | QA n | Reject % | Triggers | Recommendation |'
    );
    lines.push('|---|---|---:|---:|---:|---:|---|---|');
    for (const r of patterns.recommendations) {
      lines.push(
        `| \`${r.rule_key}\` | ${r.rule_type} | ${r.rejects} | ${r.revisions} | ${r.total_qa} | ${r.reject_rate}% | ${r.triggers.join('; ')} | ${r.recommendation} |`
      );
    }
    lines.push('');
  }

  lines.push('## Pattern: multiple rejects from same specialty→topic/theme rule', '');
  if (!patterns.multiRejectRules.length) lines.push('_None detected._', '');
  else {
    for (const r of patterns.multiRejectRules) {
      lines.push(`- \`${r.rule_key}\`: ${r.rejects} rejects / ${r.total} QA rows`);
    }
    lines.push('');
  }

  lines.push('## Pattern: multiple revisions from the same clinician', '');
  if (!patterns.multiReviseClinicians.length) lines.push('_None detected._', '');
  else {
    for (const c of patterns.multiReviseClinicians) {
      lines.push(
        `- \`${c.clinician_id}\`: ${c.revisions} revisions (${c.rejects} rejects, ${c.approves} approves in sample)`
      );
    }
    lines.push('');
  }

  lines.push('## Pattern: broad parent-theme rules with disproportionate corrections', '');
  if (!patterns.parentThemeIssues.length) lines.push('_None detected._', '');
  else {
    for (const p of patterns.parentThemeIssues) {
      lines.push(`- \`${p.rule}\`: ${p.corrections}/${p.total} corrected (${p.correction_rate}%)`);
    }
    lines.push('');
  }

  lines.push('## Pattern: keyword/alias rules with disproportionate corrections', '');
  if (!patterns.keywordAliasIssues.length) lines.push('_None detected._', '');
  else {
    for (const k of patterns.keywordAliasIssues) {
      lines.push(`- \`${k.rule}\`: ${k.corrections}/${k.total} corrected (${k.correction_rate}%)`);
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

function evaluateReadiness({ pendingCount, contributors }) {
  const blockers = [];
  if (pendingCount > 0) {
    blockers.push(`${pendingCount} QA sample row(s) still have human_qa_decision=pending`);
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
  }

  if (pendingCount > 0) {
    blockers.push(
      'pre-apply validation must pass (`npm run reviewers:pre-apply-validate`) after QA is complete'
    );
  }
  blockers.push('full Astro production build with Supabase access must pass before apply');
  blockers.push(
    'production apply / merge / deploy / route activation / indexing remain blocked until blockers above are cleared'
  );

  // production_ready stays false until Amanda credentials + Astro/Supabase build clear
  return { production_ready: false, blockers };
}

function markHigh(answer, contributor, {
  qaDecision,
  matchReasons,
  matchedSpecialty,
  score,
  assignmentMethod = 'specialty_matched_organizational_approval',
}) {
  return {
    ...answer,
    proposed_contributor_id: contributor.id,
    proposed_contributor_name: contributor.fullName,
    best_contributor_id: contributor.id,
    best_contributor_name: contributor.fullName,
    matched_specialty:
      matchedSpecialty || answer.matched_specialty || contributor.specialties[0] || '',
    score: score ?? answer.score ?? 100,
    confidence: 'high',
    match_reasons: matchReasons || answer.match_reasons || '',
    profile_completeness: contributor.profileStatus,
    profile_publishable: contributor.publishable,
    blocked_incomplete: false,
    proposed_public_label: 'Clinical contributor',
    assignment_method: assignmentMethod,
    approval_source_internal: 'peachtree_psychology_susan_keenan',
    qa_override: 'true',
    qa_decision: qaDecision,
  };
}

function markUnmatched(answer, { qaDecision, unmatchedReason, matchReasons }) {
  return {
    ...answer,
    proposed_contributor_id: '',
    proposed_contributor_name: '',
    proposed_public_label: '',
    assignment_method: '',
    approval_source_internal: '',
    confidence: answer.confidence === 'high' ? 'medium' : answer.confidence || 'medium',
    match_reasons: matchReasons || answer.match_reasons || '',
    exclusions_evaluated: [answer.exclusions_evaluated, unmatchedReason].filter(Boolean).join('|'),
    qa_override: 'true',
    qa_decision: qaDecision,
    unmatched_reason: unmatchedReason,
  };
}

function main() {
  const qaPath = resolve(ROOT, argValue('qa-csv', join(REPORT_DIR, 'qa-sample.csv')));
  if (!existsSync(qaPath)) {
    console.error(`QA CSV not found: ${qaPath}`);
    process.exit(1);
  }

  const contributors = loadContributorsRuntime();
  const byId = contributorsById();
  const qaRows = ensureQaRows(readCsv(qaPath));

  // Persist expanded QA columns without changing decisions
  writeCsv(qaPath, qaRows, QA_COLUMNS);

  const decisionCounts = { approve: 0, revise: 0, reject: 0, pending: 0 };
  const errors = [];
  const overrideExportRows = [];
  const rejectedRuleRows = [];
  const corpus = loadCorpus();
  const existingOverridesDoc = loadOverridesDoc();
  const mergedOverrides = { ...(existingOverridesDoc.overrides || {}) };

  for (const row of qaRows) {
    const decision = row.human_qa_decision;
    if (!VALID_DECISIONS.has(decision)) {
      errors.push(`${row.answer_slug}: invalid human_qa_decision "${row.human_qa_decision}"`);
      continue;
    }
    decisionCounts[decision] += 1;

    const answer = corpus.get(row.answer_slug);
    if (!answer) {
      errors.push(`${row.answer_slug}: not found in assignment corpus`);
      continue;
    }

    const reasons = row.exact_match_reason || answer.match_reasons || '';
    const ruleKey = extractRuleKey(
      reasons,
      row.matched_specialty || answer.matched_specialty,
      row.deeper_topic || answer.deeper_topic
    );

    if (decision === 'pending') continue;

    if (decision === 'approve') {
      const clinicianId = row.proposed_clinician_id || answer.proposed_contributor_id;
      if (!clinicianId) {
        errors.push(`${row.answer_slug}: approve requires proposed_clinician_id`);
        continue;
      }
      const clinician = byId.get(clinicianId);
      if (!clinician) {
        errors.push(`${row.answer_slug}: approve clinician "${clinicianId}" not found`);
        continue;
      }

      const override = {
        slug: row.answer_slug,
        answer_id: row.answer_id || answer.answer_id,
        decision: 'approve',
        clinician_id: clinicianId,
        clinician_name: clinician.fullName,
        previous_clinician_id: clinicianId,
        rule_key: ruleKey,
        match_reasons: reasons,
        matched_specialty: row.matched_specialty || answer.matched_specialty || '',
        notes: row.human_qa_notes || '',
        locked: true,
        source: 'human_qa',
        updated_at: new Date().toISOString(),
      };
      mergedOverrides[row.answer_slug] = override;
      overrideExportRows.push({
        slug: row.answer_slug,
        decision: 'approve',
        clinician_id: clinicianId,
        previous_clinician_id: clinicianId,
        rule_key: ruleKey,
        match_reasons: reasons,
        notes: row.human_qa_notes || '',
        locked: 'true',
      });
      corpus.set(
        row.answer_slug,
        markHigh(answer, clinician, {
          qaDecision: 'approve',
          matchReasons: reasons,
          matchedSpecialty: row.matched_specialty,
          score: row.assignment_score || answer.score,
        })
      );
      continue;
    }

    if (decision === 'revise') {
      const replacementId = String(row.human_qa_replacement_clinician_id || '').trim();
      const notes = String(row.human_qa_notes || '').trim();
      if (!replacementId) {
        errors.push(`${row.answer_slug}: revise requires human_qa_replacement_clinician_id`);
        continue;
      }
      if (!notes) {
        errors.push(`${row.answer_slug}: revise requires human_qa_notes explaining the override`);
        continue;
      }
      const replacement = byId.get(replacementId);
      if (!replacement) {
        errors.push(`${row.answer_slug}: replacement clinician "${replacementId}" not found`);
        continue;
      }
      if (replacement.assignmentEligibility === 'report_only' || replacement.roleClass === 'intern') {
        errors.push(`${row.answer_slug}: replacement "${replacementId}" is not publication-eligible`);
        continue;
      }
      const topicId = row.deeper_topic || answer.deeper_topic || '';
      const haystack = [row.answer_title, answer.answer_slug, reasons].join(' ');
      if (!isReplacementEligible(replacement, topicId, haystack)) {
        errors.push(
          `${row.answer_slug}: replacement "${replacementId}" is not eligible under verified specialties for topic=${topicId}`
        );
        continue;
      }

      const previousId = row.proposed_clinician_id || answer.proposed_contributor_id || '';
      const override = {
        slug: row.answer_slug,
        answer_id: row.answer_id || answer.answer_id,
        decision: 'revise',
        clinician_id: replacementId,
        clinician_name: replacement.fullName,
        previous_clinician_id: previousId,
        rule_key: ruleKey,
        match_reasons: reasons,
        matched_specialty: replacement.specialties[0] || '',
        notes,
        locked: true,
        source: 'human_qa',
        updated_at: new Date().toISOString(),
      };
      mergedOverrides[row.answer_slug] = override;
      overrideExportRows.push({
        slug: row.answer_slug,
        decision: 'revise',
        clinician_id: replacementId,
        previous_clinician_id: previousId,
        rule_key: ruleKey,
        match_reasons: reasons,
        notes,
        locked: 'true',
      });

      const revisedReasons = [`human_qa_revise:${previousId}->${replacementId}`, reasons]
        .filter(Boolean)
        .join('|');
      corpus.set(
        row.answer_slug,
        markHigh(answer, replacement, {
          qaDecision: 'revise',
          matchReasons: revisedReasons,
          matchedSpecialty: replacement.specialties[0] || '',
          score: 100,
          assignmentMethod: 'human_qa_override',
        })
      );
      continue;
    }

    if (decision === 'reject') {
      const previousId = row.proposed_clinician_id || answer.proposed_contributor_id || '';
      rejectedRuleRows.push({
        slug: row.answer_slug,
        rejected_clinician_id: previousId,
        rejected_clinician_name: row.proposed_clinician_name || answer.proposed_contributor_name || '',
        rule_key: ruleKey,
        match_reasons: reasons,
        topic_slug: row.deeper_topic || answer.deeper_topic || '',
        parent_theme: row.deeper_theme || answer.deeper_theme || '',
        notes: row.human_qa_notes || '',
      });

      // Prefer another defensible automatic candidate when present; otherwise editorial transition
      const alternatives = parseOtherEligible(row.other_eligible_clinicians).filter(
        (id) => id !== previousId
      );
      let fallback = null;
      for (const altId of alternatives) {
        const alt = byId.get(altId);
        if (!alt) continue;
        if (alt.assignmentEligibility === 'report_only' || alt.roleClass === 'intern') continue;
        if (!alt.publishable) continue;
        const topicId = row.deeper_topic || answer.deeper_topic || '';
        const haystack = [row.answer_title, reasons].join(' ');
        if (isReplacementEligible(alt, topicId, haystack)) {
          fallback = alt;
          break;
        }
      }

      if (fallback) {
        const override = {
          slug: row.answer_slug,
          answer_id: row.answer_id || answer.answer_id,
          decision: 'reject_with_fallback',
          clinician_id: fallback.id,
          clinician_name: fallback.fullName,
          previous_clinician_id: previousId,
          rejected_rule_key: ruleKey,
          match_reasons: reasons,
          matched_specialty: fallback.specialties[0] || '',
          notes: row.human_qa_notes || '',
          locked: true,
          source: 'human_qa',
          updated_at: new Date().toISOString(),
        };
        mergedOverrides[row.answer_slug] = override;
        overrideExportRows.push({
          slug: row.answer_slug,
          decision: 'reject_with_fallback',
          clinician_id: fallback.id,
          previous_clinician_id: previousId,
          rule_key: ruleKey,
          match_reasons: reasons,
          notes: row.human_qa_notes || '',
          locked: 'true',
        });
        corpus.set(
          row.answer_slug,
          markHigh(answer, fallback, {
            qaDecision: 'reject_with_fallback',
            matchReasons: [`human_qa_reject_fallback:${previousId}->${fallback.id}`, reasons]
              .filter(Boolean)
              .join('|'),
            matchedSpecialty: fallback.specialties[0] || '',
            score: answer.score || row.assignment_score || 80,
            assignmentMethod: 'human_qa_reject_fallback',
          })
        );
      } else {
        const override = {
          slug: row.answer_slug,
          answer_id: row.answer_id || answer.answer_id,
          decision: 'reject',
          clinician_id: null,
          clinician_name: null,
          previous_clinician_id: previousId,
          rejected_rule_key: ruleKey,
          match_reasons: reasons,
          notes: row.human_qa_notes || '',
          locked: true,
          unmatched_reason: 'human_qa_reject',
          source: 'human_qa',
          updated_at: new Date().toISOString(),
        };
        mergedOverrides[row.answer_slug] = override;
        overrideExportRows.push({
          slug: row.answer_slug,
          decision: 'reject',
          clinician_id: '',
          previous_clinician_id: previousId,
          rule_key: ruleKey,
          match_reasons: reasons,
          notes: row.human_qa_notes || '',
          locked: 'true',
        });
        corpus.set(
          row.answer_slug,
          markUnmatched(answer, {
            qaDecision: 'reject',
            unmatchedReason: 'human_qa_reject',
            matchReasons: reasons,
          })
        );
      }
    }
  }

  // Re-apply all locked overrides across corpus (prior + current)
  for (const [slug, override] of Object.entries(mergedOverrides)) {
    const answer = corpus.get(slug);
    if (!answer) continue;
    if (
      (override.decision === 'approve' ||
        override.decision === 'revise' ||
        override.decision === 'reject_with_fallback') &&
      override.clinician_id
    ) {
      const c = byId.get(override.clinician_id);
      if (!c) continue;
      corpus.set(
        slug,
        markHigh(answer, c, {
          qaDecision: override.decision,
          matchReasons: override.match_reasons || answer.match_reasons,
          matchedSpecialty: override.matched_specialty,
          score: override.decision === 'revise' ? 100 : answer.score,
          assignmentMethod:
            override.decision === 'approve'
              ? 'specialty_matched_organizational_approval'
              : override.decision === 'revise'
                ? 'human_qa_override'
                : 'human_qa_reject_fallback',
        })
      );
    } else if (override.decision === 'reject') {
      corpus.set(
        slug,
        markUnmatched(answer, {
          qaDecision: 'reject',
          unmatchedReason: override.unmatched_reason || 'human_qa_reject',
          matchReasons: override.match_reasons || answer.match_reasons,
        })
      );
    }
  }

  if (errors.length) {
    console.error('QA reconciliation errors:');
    for (const e of errors) console.error(`  - ${e}`);
    console.error('\nFix the QA CSV and re-run. Override file was not updated.');
    process.exit(1);
  }

  writeJson(OVERRIDES_PATH, {
    version: 1,
    description:
      'Human QA overrides for clinical contributor assignments. Automatic assign runs must never overwrite these decisions.',
    updated_at: new Date().toISOString(),
    overrides: mergedOverrides,
  });

  const allRows = [...corpus.values()];
  const highRows = allRows.filter((r) => r.confidence === 'high' && r.proposed_contributor_id);
  const unmatchedRows = allRows.filter(
    (r) => !(r.confidence === 'high' && r.proposed_contributor_id)
  );

  const reportMeta = regenerateAssignmentReports({
    highRows,
    unmatchedRows,
    meta: {
      qa_reconciliation: {
        qa_sample_path: 'reports/reviewer-migration/qa-sample.csv',
        decisions: decisionCounts,
        percentages: {
          approve: pct(decisionCounts.approve, qaRows.length),
          revise: pct(decisionCounts.revise, qaRows.length),
          reject: pct(decisionCounts.reject, qaRows.length),
          pending: pct(decisionCounts.pending, qaRows.length),
        },
        locked_overrides: Object.keys(mergedOverrides).length,
        reconciled_at: new Date().toISOString(),
      },
      production_ready: false,
    },
  });

  const patterns = detectSystemicPatterns(qaRows);
  const readiness = evaluateReadiness({
    pendingCount: decisionCounts.pending,
    contributors,
  });

  writeCsv(
    join(REPORT_DIR, 'qa-human-overrides.csv'),
    overrideExportRows.length
      ? overrideExportRows
      : Object.values(mergedOverrides).map((o) => ({
          slug: o.slug,
          decision: o.decision,
          clinician_id: o.clinician_id || '',
          previous_clinician_id: o.previous_clinician_id || '',
          rule_key: o.rule_key || o.rejected_rule_key || '',
          match_reasons: o.match_reasons || '',
          notes: o.notes || '',
          locked: 'true',
        })),
    [
      'slug',
      'decision',
      'clinician_id',
      'previous_clinician_id',
      'rule_key',
      'match_reasons',
      'notes',
      'locked',
    ]
  );

  writeCsv(join(REPORT_DIR, 'qa-rejected-rules.csv'), rejectedRuleRows, [
    'slug',
    'rejected_clinician_id',
    'rejected_clinician_name',
    'rule_key',
    'match_reasons',
    'topic_slug',
    'parent_theme',
    'notes',
  ]);

  writeText(
    join(REPORT_DIR, 'qa-systemic-findings.md'),
    buildSystemicFindingsMd(patterns, decisionCounts, qaRows.length)
  );

  const softCapExceptions = reportMeta.softCapExceptions || [];
  const crosswalkRulesChanged = patterns.recommendations.length;
  const summaryMd = [
    '# QA reconciliation summary',
    '',
    'Generated by `npm run reviewers:reconcile-qa`.',
    '',
    '**Production activity remains paused.** This command does not mutate live data, merge, deploy, activate routes, or change indexing.',
    '',
    '## Decision totals',
    '',
    '| Decision | Count | % |',
    '|---|---:|---:|',
    `| approve | ${decisionCounts.approve} | ${pct(decisionCounts.approve, qaRows.length)} |`,
    `| revise | ${decisionCounts.revise} | ${pct(decisionCounts.revise, qaRows.length)} |`,
    `| reject | ${decisionCounts.reject} | ${pct(decisionCounts.reject, qaRows.length)} |`,
    `| pending | ${decisionCounts.pending} | ${pct(decisionCounts.pending, qaRows.length)} |`,
    `| **QA sample total** | **${qaRows.length}** | |`,
    '',
    '## Post-reconciliation corpus',
    '',
    '| Metric | Count |',
    '|---|---:|',
    `| Final high-confidence contributor assignments | ${highRows.length} |`,
    `| Final editorial-transition / unmatched | ${unmatchedRows.length} |`,
    `| Human overrides locked | ${Object.keys(mergedOverrides).length} |`,
    `| Soft-cap exceptions | ${softCapExceptions.length} |`,
    `| Crosswalk rules recommended for change | ${crosswalkRulesChanged} |`,
    '',
    '## Distribution changes',
    '',
    'See `reviewer-distribution.csv` for per-clinician totals after reconciliation.',
    softCapExceptions.length
      ? `Clinicians exceeding soft cap: ${softCapExceptions
          .map((e) => `${e.contributor_name} (${e.assigned_count})`)
          .join('; ')}.`
      : 'No clinician exceeds the 15% soft cap after reconciliation.',
    '',
    '## Artifacts written',
    '',
    '- `qa-reconciliation-summary.md` (this file)',
    '- `qa-human-overrides.csv`',
    '- `qa-rejected-rules.csv`',
    '- `qa-systemic-findings.md`',
    '- `src/data/clinical-contributors/qa-human-overrides.json` (version-controlled locks)',
    '- Regenerated: assignment-summary.json, assignment-detail.csv, high-confidence-assignments.csv, unmatched-answers.csv, reviewer-distribution.csv, reviewer-coverage-coherence.csv, reviewer-topic-outliers.csv, soft-cap-exceptions.csv, unmatched-editorial-transition.csv, apply-package/*, rollback mappings',
    '',
    '## Production readiness',
    '',
    `**production_ready: ${readiness.production_ready}**`,
    '',
    '### Exact blockers',
    '',
    ...readiness.blockers.map((b) => `- ${b}`),
    '',
    '## How to complete human QA',
    '',
    '1. Edit `reports/reviewer-migration/qa-sample.csv`.',
    '2. Set `human_qa_decision` to `approve`, `revise`, or `reject` (not `pending`).',
    '3. For `revise`: fill `human_qa_replacement_clinician_id` (publication-eligible clinician) and `human_qa_notes`.',
    '4. For `reject` / `revise`: add notes explaining the correction.',
    '5. Re-run `npm run reviewers:reconcile-qa`.',
    '6. Review `qa-systemic-findings.md` for crosswalk revision recommendations before any apply.',
    '',
  ];
  writeText(join(REPORT_DIR, 'qa-reconciliation-summary.md'), `${summaryMd.join('\n')}\n`);

  const summaryPath = join(REPORT_DIR, 'assignment-summary.json');
  const summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
  summary.qa_reconciliation = {
    qa_sample_path: 'reports/reviewer-migration/qa-sample.csv',
    decisions: decisionCounts,
    percentages: {
      approve: pct(decisionCounts.approve, qaRows.length),
      revise: pct(decisionCounts.revise, qaRows.length),
      reject: pct(decisionCounts.reject, qaRows.length),
      pending: pct(decisionCounts.pending, qaRows.length),
    },
    locked_overrides: Object.keys(mergedOverrides).length,
    crosswalk_rules_recommended_for_change: crosswalkRulesChanged,
    soft_cap_exceptions: softCapExceptions.length,
    final_contributor_assignments: highRows.length,
    final_editorial_transition: unmatchedRows.length,
    production_ready: false,
    production_readiness_blockers: readiness.blockers,
    reconciled_at: new Date().toISOString(),
  };
  summary.production_ready = false;
  summary.production_readiness_blockers = readiness.blockers;
  writeJson(summaryPath, summary);

  console.log(`
QA reconciliation complete (no production mutation).

Decisions (${qaRows.length} QA rows):
  approve: ${decisionCounts.approve} (${pct(decisionCounts.approve, qaRows.length)})
  revise:  ${decisionCounts.revise} (${pct(decisionCounts.revise, qaRows.length)})
  reject:  ${decisionCounts.reject} (${pct(decisionCounts.reject, qaRows.length)})
  pending: ${decisionCounts.pending}

Corpus after reconciliation:
  high-confidence assignments: ${highRows.length}
  editorial-transition:        ${unmatchedRows.length}
  locked human overrides:      ${Object.keys(mergedOverrides).length}
  soft-cap exceptions:         ${softCapExceptions.length}
  crosswalk rules to revise:   ${crosswalkRulesChanged}

production_ready: false
Blockers:
${readiness.blockers.map((b) => `  - ${b}`).join('\n')}

Reports:
  ${join(REPORT_DIR, 'qa-reconciliation-summary.md')}
  ${join(REPORT_DIR, 'qa-human-overrides.csv')}
  ${join(REPORT_DIR, 'qa-rejected-rules.csv')}
  ${join(REPORT_DIR, 'qa-systemic-findings.md')}
  ${OVERRIDES_PATH}
`);
}

main();
