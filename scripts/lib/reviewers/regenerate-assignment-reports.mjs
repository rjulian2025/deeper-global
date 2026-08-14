/**
 * Regenerate migration reports + apply package from reconciled assignment rows.
 */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCsv, toCsv, writeCsv, writeJson } from './csv-utils.mjs';
import { loadContributorsRuntime } from './load-contributors-runtime.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../../..');
const OUT = join(root, 'reports/reviewer-migration');
const APPLY = join(OUT, 'apply-package');
const SITE = 'https://www.deeper.global';
const MIGRATABLE = 1068;
const SOFT_CAP_SHARE = 0.15;

function classifyMatchType(reasons) {
  const r = reasons || '';
  const hasExact = /exact_topic:/.test(r);
  const hasAlias = /alias_keyword:|preferred_specialty_keyword:/.test(r);
  const hasTheme = /parent_theme:/.test(r);
  if (hasExact && hasAlias) return 'exact_topic_plus_alias';
  if (hasExact) return 'exact_topic';
  if (hasTheme && hasAlias) return 'parent_theme_plus_alias';
  if (hasTheme) return 'parent_theme';
  if (hasAlias) return 'alias_keyword';
  return 'other';
}

function countMap(values) {
  const m = new Map();
  for (const v of values) m.set(v, (m.get(v) || 0) + 1);
  return m;
}

function topN(map, n) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, n);
}

function isTopicDefensible(topicId, specialties) {
  if (!topicId) return true;
  const joined = specialties.join(' ').toLowerCase();
  const map = {
    'anxiety-and-stress': /anxiety|stress|panic|ocd|obsess|worry|phobia/,
    depression: /depression|mood/,
    'addiction-and-recovery': /addict|substance|alcohol|drug|recovery|sober/,
    'trauma-and-safety': /trauma|ptsd|abuse/,
    'grief-and-loss': /grief|loss|bereavement/,
    'family-and-parenting': /parent|family|child|teen|school|adoption/,
    'teens-and-identity': /teen|child|school|parent|adolescent|youth/,
    'relationships-and-communication': /relationship|couple|marital|codepend|divorce|infidelity|peer/,
    'identity-and-self-worth': /self|esteem|shame|identity|body image|perfection/,
    'work-and-burnout': /work|burnout|career|productivity|life transition/,
    'neurodivergence-and-attention': /adhd|autism|executive|neuro|testing|diagnostic/,
    'therapy-and-care-navigation': /testing|diagnostic|evaluation|assessment|therapy/,
    'gender-sexuality-and-intimacy': /lgbtq|transgender|lesbian|bisexual|sex/,
    'meaning-faith-and-existential-questions': /spirit|faith|meaning/,
    'loneliness-and-belonging': /relationship|peer|self|lgbtq|social/,
    'general-mental-health': /life transition|stress|anxiety|mood|anger|chronic|illness/,
  };
  const re = map[topicId];
  if (!re) return false;
  return re.test(joined);
}

const DETAIL_COLS = [
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
  'qa_override',
  'qa_decision',
];

export function regenerateAssignmentReports({ highRows, unmatchedRows, meta = {} }) {
  mkdirSync(APPLY, { recursive: true });
  const contributors = loadContributorsRuntime();
  const byId = new Map(contributors.map((c) => [c.id, c]));
  const softCap = Math.max(1, Math.floor(MIGRATABLE * SOFT_CAP_SHARE));

  // Soft-cap exceptions among reconciled highs
  const load = countMap(highRows.map((r) => r.proposed_contributor_id));
  const softCapExceptions = [];
  for (const [id, count] of load) {
    if (count > softCap) {
      softCapExceptions.push({
        contributor_id: id,
        contributor_name: byId.get(id)?.fullName || id,
        assigned_count: count,
        soft_cap_count: softCap,
        over_by: count - softCap,
        reason: 'Exceeded 15% soft cap after QA reconciliation; specialty fit / human overrides retained',
      });
    }
  }

  const detail = [
    ...highRows.map((r) => ({
      ...r,
      proposed_public_label: r.proposed_public_label || 'Clinical contributor',
      assignment_method: r.assignment_method || 'specialty_matched_organizational_approval',
      approval_source_internal: r.approval_source_internal || 'peachtree_psychology_susan_keenan',
      qa_override: r.qa_override || '',
      qa_decision: r.qa_decision || '',
    })),
    ...unmatchedRows.map((r) => ({
      ...r,
      proposed_contributor_id: '',
      proposed_contributor_name: '',
      proposed_public_label: '',
      assignment_method: '',
      confidence: r.confidence || 'unmatched',
      qa_override: r.qa_override || '',
      qa_decision: r.qa_decision || '',
    })),
  ];

  writeCsv(join(OUT, 'assignment-detail.csv'), detail, DETAIL_COLS);
  writeCsv(join(OUT, 'high-confidence-assignments.csv'), highRows, DETAIL_COLS);
  writeCsv(join(OUT, 'unmatched-answers.csv'), unmatchedRows, DETAIL_COLS);

  const distRows = contributors.map((c) => ({
    contributor_id: c.id,
    full_name: c.fullName,
    proposed_high: load.get(c.id) || 0,
    proposed_if_medium_included: load.get(c.id) || 0,
    profile_status: c.profileStatus,
    assignment_eligibility: c.assignmentEligibility,
    publishable: c.publishable,
    pct_migratable: (((load.get(c.id) || 0) / MIGRATABLE) * 100).toFixed(2),
    exceeds_soft_cap: (load.get(c.id) || 0) > softCap ? 'yes' : 'no',
  }));
  writeCsv(
    join(OUT, 'reviewer-distribution.csv'),
    distRows.sort((a, b) => Number(b.proposed_high) - Number(a.proposed_high)),
    [
      'contributor_id',
      'full_name',
      'proposed_high',
      'proposed_if_medium_included',
      'profile_status',
      'assignment_eligibility',
      'publishable',
      'pct_migratable',
      'exceeds_soft_cap',
    ]
  );

  writeCsv(
    join(OUT, 'soft-cap-exceptions.csv'),
    softCapExceptions,
    ['contributor_id', 'contributor_name', 'assigned_count', 'soft_cap_count', 'over_by', 'reason']
  );

  // Coherence
  const coverage = [];
  const outliers = [];
  for (const c of contributors) {
    const rows = highRows.filter((r) => r.proposed_contributor_id === c.id);
    if (!rows.length) {
      coverage.push({
        contributor_id: c.id,
        contributor_name: c.fullName,
        proposed_count: 0,
        pct_migratable: '0.00',
        top_topics: '',
        top_themes: '',
        top_match_types: '',
        exact_matches: 0,
        alias_matches: 0,
        parent_theme_matches: 0,
        keyword_assisted_matches: 0,
        specialty_breadth: c.specialties.length,
        outlier_topic_count: 0,
        lowest_scoring_slugs: '',
        flags: '',
        coherence_status: 'coherent',
      });
      continue;
    }
    const matchTypes = rows.map((r) => classifyMatchType(r.match_reasons));
    const exact = matchTypes.filter((t) => t.startsWith('exact_topic')).length;
    const alias = matchTypes.filter((t) => t.includes('alias')).length;
    const theme = matchTypes.filter((t) => t.includes('parent_theme')).length;
    const keyword = matchTypes.filter((t) => t === 'alias_keyword' || t === 'parent_theme_plus_alias').length;
    const topics = countMap(rows.map((r) => r.deeper_topic_name || r.deeper_topic));
    const themes = countMap(rows.map((r) => r.deeper_theme));
    const types = countMap(matchTypes);
    const flags = [];
    if (theme / rows.length > 0.3) flags.push('parent_theme_gt_30pct');
    if (keyword / rows.length > 0.1) flags.push('keyword_gt_10pct');
    if (themes.size > 3) flags.push('spans_gt_3_major_themes');
    let outlierCount = 0;
    for (const [topicName, count] of topics) {
      const sample = rows.find((r) => (r.deeper_topic_name || r.deeper_topic) === topicName);
      if (!isTopicDefensible(sample?.deeper_topic, c.specialties)) {
        outlierCount += 1;
        flags.push(`outlier_topic:${topicName}`);
        outliers.push({
          contributor_id: c.id,
          contributor_name: c.fullName,
          topic: topicName,
          topic_id: sample?.deeper_topic,
          answer_count: count,
          verified_specialties: c.specialties.join('|'),
          reason: 'topic_outside_verified_specialty_crosswalk',
          recommended_action: 'review_crosswalk_or_downgrade_assignments',
        });
      }
    }
    const lowest = [...rows].sort((a, b) => Number(a.score) - Number(b.score)).slice(0, 5);
    coverage.push({
      contributor_id: c.id,
      contributor_name: c.fullName,
      proposed_count: rows.length,
      pct_migratable: ((rows.length / MIGRATABLE) * 100).toFixed(2),
      top_topics: topN(topics, 5).map(([k, v]) => `${k}:${v}`).join('|'),
      top_themes: topN(themes, 5).map(([k, v]) => `${k}:${v}`).join('|'),
      top_match_types: topN(types, 5).map(([k, v]) => `${k}:${v}`).join('|'),
      exact_matches: exact,
      alias_matches: alias,
      parent_theme_matches: theme,
      keyword_assisted_matches: keyword,
      specialty_breadth: c.specialties.length,
      outlier_topic_count: outlierCount,
      lowest_scoring_slugs: lowest.map((r) => `${r.answer_slug}:${r.score}`).join('|'),
      flags: flags.join('|'),
      coherence_status: flags.length ? 'needs_review' : 'coherent',
    });
  }
  writeCsv(
    join(OUT, 'reviewer-coverage-coherence.csv'),
    coverage.sort((a, b) => Number(b.proposed_count) - Number(a.proposed_count)),
    [
      'contributor_id',
      'contributor_name',
      'proposed_count',
      'pct_migratable',
      'top_topics',
      'top_themes',
      'top_match_types',
      'exact_matches',
      'alias_matches',
      'parent_theme_matches',
      'keyword_assisted_matches',
      'specialty_breadth',
      'outlier_topic_count',
      'lowest_scoring_slugs',
      'flags',
      'coherence_status',
    ]
  );
  writeCsv(
    join(OUT, 'reviewer-topic-outliers.csv'),
    outliers,
    [
      'contributor_id',
      'contributor_name',
      'topic',
      'topic_id',
      'answer_count',
      'verified_specialties',
      'reason',
      'recommended_action',
    ]
  );

  // Topic coverage
  const before = readCsv(join(OUT, 'ken-attribution-remaining.csv'));
  // Prefer original detail for before counts if present
  let topicBefore = new Map();
  try {
    const originalDetail = readCsv(join(OUT, 'assignment-detail.csv'));
    // After overwrite this is new; use migratable constant distribution from unmatched+high topics
  } catch {
    /* ignore */
  }
  for (const r of [...highRows, ...unmatchedRows]) {
    topicBefore.set(r.deeper_topic, (topicBefore.get(r.deeper_topic) || 0) + 1);
  }
  const topicAfter = countMap(highRows.map((r) => r.deeper_topic));
  const topicRows = [...new Set([...topicBefore.keys(), ...topicAfter.keys()])].sort().map((topic) => ({
    topic,
    ken_before: topicBefore.get(topic) || 0,
    high_confidence_reassigned: topicAfter.get(topic) || 0,
    remaining_if_high_only: (topicBefore.get(topic) || 0) - (topicAfter.get(topic) || 0),
  }));
  writeCsv(
    join(OUT, 'topic-coverage-before-after.csv'),
    topicRows,
    ['topic', 'ken_before', 'high_confidence_reassigned', 'remaining_if_high_only']
  );

  const editorialRows = unmatchedRows.map((r) => ({
    answer_id: r.answer_id,
    answer_slug: r.answer_slug,
    answer_title: r.answer_title || r.answer_slug,
    answer_url: `${SITE}/answers/${r.answer_slug}/`,
    current_reviewer_id: r.current_reviewer_id,
    deeper_topic: r.deeper_topic,
    deeper_topic_name: r.deeper_topic_name,
    deeper_theme: r.deeper_theme,
    confidence: r.confidence || 'unmatched',
    best_contributor_id: r.best_contributor_id || '',
    score: r.score || '',
    proposed_end_state: 'editorial_reviewed_by_deeper',
    proposed_clinical_contributor_id: '',
    proposed_clinical_reviewer_id: '',
    clear_named_person_attribution: 'yes',
    preserve_reviewed_at_legacy: 'yes',
    public_label: 'Editorially reviewed by Deeper',
    show_clinical_review_date: 'no',
    qa_decision: r.qa_decision || '',
  }));
  writeCsv(
    join(OUT, 'unmatched-editorial-transition.csv'),
    editorialRows,
    [
      'answer_id',
      'answer_slug',
      'answer_title',
      'answer_url',
      'current_reviewer_id',
      'deeper_topic',
      'deeper_topic_name',
      'deeper_theme',
      'confidence',
      'best_contributor_id',
      'score',
      'proposed_end_state',
      'proposed_clinical_contributor_id',
      'proposed_clinical_reviewer_id',
      'clear_named_person_attribution',
      'preserve_reviewed_at_legacy',
      'public_label',
      'show_clinical_review_date',
      'qa_decision',
    ]
  );

  writeCsv(
    join(OUT, 'ken-attribution-remaining.csv'),
    unmatchedRows,
    [
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
      'qa_decision',
    ]
  );

  // Apply package
  const backfill = highRows.map((r) => ({
    answer_id: r.answer_id,
    answer_slug: r.answer_slug,
    clinical_contributor_id: r.proposed_contributor_id,
    clinical_contributor_method: 'specialty_matched_organizational_approval',
    clinical_contributor_assigned_at: 'PENDING_APPLY_TIMESTAMP',
    approval_source: 'peachtree_psychology_susan_keenan',
    do_not_set_clinically_reviewed_at: true,
    preserve_reviewed_by_legacy: r.current_reviewer_id,
    preserve_reviewed_at_legacy: r.reviewed_at_legacy,
    qa_override: r.qa_override || false,
    qa_decision: r.qa_decision || null,
  }));
  writeJson(join(APPLY, 'clinical-contributor-backfill-all-high.json'), {
    count: backfill.length,
    note: 'Reconciled high-confidence contributor assignments',
    rows: backfill,
  });
  writeJson(join(APPLY, 'clinical-contributor-backfill-923.json'), {
    count: backfill.length,
    note: 'Filename retained for compatibility; count is post-reconciliation',
    rows: backfill,
  });

  const editorialMutation = editorialRows.map((r) => ({
    answer_id: r.answer_id,
    answer_slug: r.answer_slug,
    editorial_review_status: 'reviewed',
    editorial_reviewer_id: 'deeper-editorial',
    editorially_reviewed_at: null,
    clinical_contributor_id: null,
    clinical_reviewer_id: null,
    clear_public_named_person: true,
    preserve_reviewed_by_legacy: r.current_reviewer_id,
    preserve_reviewed_at_legacy: 'from_db',
    qa_decision: r.qa_decision || null,
  }));
  writeJson(join(APPLY, 'editorial-transition-145.json'), {
    count: editorialMutation.length,
    note: 'Filename retained for compatibility; count is post-reconciliation unmatched/editorial set',
    rows: editorialMutation,
  });

  const rollback = [...highRows, ...unmatchedRows].map((r) => ({
    answer_id: r.answer_id,
    answer_slug: r.answer_slug,
    original_reviewed_by: r.current_reviewer_id,
    original_reviewed_at: r.reviewed_at_legacy || null,
    original_review_status: 'reviewed',
  }));
  writeJson(join(APPLY, 'rollback-mapping.json'), { count: rollback.length, rows: rollback });

  const summary = {
    generated_at: new Date().toISOString(),
    mode: 'dry-run-reconciled',
    source: 'qa-reconciliation',
    soft_cap_share: SOFT_CAP_SHARE,
    soft_cap_count: softCap,
    ken_evaluated: MIGRATABLE,
    counts: {
      ken_evaluated: MIGRATABLE,
      high_confidence_proposed: highRows.length,
      unmatched_default: unmatchedRows.length,
      editorial_transition: unmatchedRows.length,
      soft_cap_exceptions: softCapExceptions.length,
      ...meta.counts,
    },
    distribution_high_only: Object.fromEntries(
      contributors.map((c) => [
        c.id,
        {
          fullName: c.fullName,
          proposed_high: load.get(c.id) || 0,
          publishable: c.publishable,
          assignmentEligibility: c.assignmentEligibility,
          profileStatus: c.profileStatus,
        },
      ])
    ),
    soft_cap_exceptions: softCapExceptions,
    unmatched_end_state_scenarios: {
      B_remove_named_use_editorial: {
        count: unmatchedRows.length,
        description:
          'Remove unsupported named-person attribution; mark as Deeper editorial review where editorial review is supported',
      },
      recommendation:
        'Prefer scenario B for honesty: remove unsupported named-person attribution and use accurate Deeper editorial attribution without implying clinical review.',
    },
    ...meta,
  };
  writeJson(join(OUT, 'assignment-summary.json'), summary);

  return {
    highCount: highRows.length,
    unmatchedCount: unmatchedRows.length,
    softCapExceptions,
    distribution: distRows,
  };
}
