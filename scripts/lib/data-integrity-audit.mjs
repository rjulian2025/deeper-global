import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  cleanText,
  completenessScore,
  isV2Answer,
  missingFields,
  sectionCount,
  relatedQuestionCount,
  tierForScore,
} from './content-enrichment-utils.mjs';

const MIN_ANSWER_COUNT = 950;
const PAGE_SIZE = 500;
const SELECT_COLUMNS = [
  'id',
  'slug',
  'question',
  'category',
  'raw_category',
  'short_answer',
  'answer',
  'improved_title',
  'improved_meta_description',
  'improved_summary',
  'answer_sections',
  'key_takeaways',
  'care_note',
  'related_questions',
  'suggested_schema_question',
  'suggested_schema_answer',
  'primary_theme',
  'related_themes',
  'source_refs',
  'content_prompt_version',
  'content_enriched_at',
  'review_status',
  'reviewed_by',
  'reviewed_at',
  'created_at',
].join(',');

const VALID_REVIEW_STATUSES = new Set(['', 'draft', 'reviewed', 'approved', 'published', 'retired_duplicate']);
const INDEXABLE_REVIEW_STATUSES = new Set(['approved', 'published', 'reviewed']);
const VALID_REVIEWER_IDS = new Set(['david-k-gore-phd', 'kenneth-w-christian-phd', 'alex-crenshaw-phd', 'rick-julian', 'michelle-morris-lpc', 'codex-seo-review']);
const REVIEWER_ALIASES = {
  'david-k-gore-phd': 'david-k-gore-phd',
  'david k gore phd': 'david-k-gore-phd',
  'david k. gore phd': 'david-k-gore-phd',
  'david k. gore, phd': 'david-k-gore-phd',
  'kenneth-w-christian-phd': 'kenneth-w-christian-phd',
  'kenneth w christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian, phd': 'kenneth-w-christian-phd',
  'alex-crenshaw-phd': 'alex-crenshaw-phd',
  'alex crenshaw phd': 'alex-crenshaw-phd',
  'alex crenshaw, phd': 'alex-crenshaw-phd',
  'dr. alex crenshaw, phd': 'alex-crenshaw-phd',
  'dr. alex crenshaw phd': 'alex-crenshaw-phd',
  'rick-julian': 'rick-julian',
  'rick julian': 'rick-julian',
  'michelle-morris-lpc': 'michelle-morris-lpc',
  'michelle morris lpc': 'michelle-morris-lpc',
  'michelle morris lpc lpcc': 'michelle-morris-lpc',
  'michelle morris, lpc': 'michelle-morris-lpc',
  'michelle morris, lpc, lpcc': 'michelle-morris-lpc',
  'codex-seo-review': 'codex-seo-review',
};

const ADDICTION_REVIEW_REPORT = 'reports/review-updates/addiction-review-2026-03-13.json';
const ADDICTION_PROMPT_VERSION = 'deeper-addiction-enrichment-v1';
const CORPUS_PROMPT_VERSION = 'deeper-answer-enrichment-v1';

function normalizeReviewerLabel(value) {
  return value.toLowerCase().replace(/[,.-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function resolveReviewerId(reviewedBy) {
  const label = cleanText(reviewedBy);
  if (!label) return null;
  return REVIEWER_ALIASES[label.toLowerCase()] ?? REVIEWER_ALIASES[normalizeReviewerLabel(label)] ?? null;
}

function addIssue(issues, { id, severity, message, slug, field, value, count }) {
  if (severity === 'critical') {
    try {
      globalThis.__CRITICAL_DETAILS__ = globalThis.__CRITICAL_DETAILS__ || [];
      globalThis.__CRITICAL_DETAILS__.push({
        issue_id: id,
        severity,
        slug: slug ?? null,
        field: field ?? null,
        value: typeof value === 'string' ? cleanText(value) : value ?? null,
      });
    } catch {
      // best-effort only
    }
  }
  const existing = issues.find((item) => item.id === id);
  if (existing) {
    existing.count = (existing.count ?? 1) + (count ?? 1);
    if (slug && existing.examples.length < 15 && !existing.examples.includes(slug)) {
      existing.examples.push(slug);
    }
    return;
  }
  issues.push({
    id,
    severity,
    message,
    field: field ?? null,
    count: count ?? 1,
    examples: slug ? [slug] : [],
    sample_value: value ?? null,
  });
}

async function fetchAllQuestions(client) {
  const pages = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await client
      .from('questions_master')
      .select(SELECT_COLUMNS)
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .range(from, to);
    if (error) throw error;
    const page = data ?? [];
    pages.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return pages;
}

function loadAddictionSlugs() {
  if (!existsSync(ADDICTION_REVIEW_REPORT)) return [];
  const report = JSON.parse(readFileSync(ADDICTION_REVIEW_REPORT, 'utf8'));
  return (report.matches ?? []).map((match) => match.slug).filter(Boolean);
}

function loadPromoteReports() {
  const reports = [];
  for (const dir of ['reports/enrichment-corpus/promote-updates', 'reports/enrichment-addiction/promote-updates']) {
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((name) => name.endsWith('.json'))) {
      try {
        const parsed = JSON.parse(readFileSync(join(dir, file), 'utf8'));
        if (parsed.slugs?.length) {
          reports.push({ path: join(dir, file), ...parsed });
        }
      } catch {
        // skip malformed
      }
    }
  }
  return reports;
}

function normalizeQuestionText(value) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function isValidJsonArray(value) {
  return value === null || value === undefined || Array.isArray(value);
}

function auditAnswerSections(question, issues) {
  if (!Array.isArray(question.answer_sections)) return;
  question.answer_sections.forEach((section) => {
    if (!section || typeof section !== 'object') {
      addIssue(issues, { id: 'answer_sections_invalid_item', severity: 'critical', message: 'answer_sections contains non-object item', slug: question.slug, field: 'answer_sections' });
      return;
    }
    if (!cleanText(section.body)) {
      addIssue(issues, { id: 'answer_sections_missing_body', severity: 'critical', message: 'answer_sections item missing body', slug: question.slug, field: 'answer_sections' });
    }
    if (!cleanText(section.heading)) {
      addIssue(issues, { id: 'answer_sections_missing_heading', severity: 'warning', message: 'answer_sections item missing heading', slug: question.slug, field: 'answer_sections' });
    }
  });
}

function auditSourceRefs(question, issues) {
  if (!Array.isArray(question.source_refs)) return;
  for (const item of question.source_refs) {
    if (!item || typeof item !== 'object') {
      addIssue(issues, { id: 'source_refs_invalid_item', severity: 'critical', message: 'source_refs contains non-object item', slug: question.slug, field: 'source_refs' });
      continue;
    }
    const title = cleanText(item.title);
    const url = cleanText(item.url);
    if (!title && !url) {
      addIssue(issues, { id: 'source_refs_empty_entry', severity: 'critical', message: 'source_refs entry has neither title nor url', slug: question.slug, field: 'source_refs' });
    } else if (!title) {
      addIssue(issues, { id: 'source_refs_missing_title', severity: 'warning', message: 'source_refs entry missing title', slug: question.slug, field: 'source_refs' });
    } else if (!url) {
      addIssue(issues, { id: 'source_refs_missing_url', severity: 'warning', message: 'source_refs entry missing url', slug: question.slug, field: 'source_refs' });
    }
  }
}

function auditRow(question, issues, addictionSlugs) {
  const slug = cleanText(question.slug);
  const score = completenessScore(question);
  const missing = missingFields(question);
  const enriched = Boolean(question.content_enriched_at);
  const hasSections = sectionCount(question) > 0;
  const reviewedBy = cleanText(question.reviewed_by);
  const reviewerId = resolveReviewerId(reviewedBy);

  if (!slug) {
    addIssue(issues, { id: 'missing_slug', severity: 'critical', message: 'Row missing slug', slug: String(question.id), field: 'slug' });
  }
  if (!cleanText(question.question)) {
    addIssue(issues, { id: 'missing_question', severity: 'critical', message: 'Row missing question text', slug, field: 'question' });
  }
  if (!cleanText(question.category) && !cleanText(question.raw_category)) {
    addIssue(issues, { id: 'missing_category', severity: 'critical', message: 'Row missing category and raw_category', slug, field: 'category' });
  }
  for (const field of missing) {
    const severity = field.includes('>=') || field === 'content_enriched_at|answer_sections' ? 'critical' : 'warning';
    addIssue(issues, { id: `missing_${field.replace(/[^a-z0-9]+/gi, '_')}`, severity, message: `Missing enrichment field: ${field}`, slug, field });
  }
  if (score < 100) {
    addIssue(issues, { id: 'completeness_below_100', severity: score < 60 ? 'critical' : 'warning', message: `Completeness score ${score} (expected 100)`, slug, field: 'completeness_score', value: String(score) });
  }

  const status = cleanText(question.review_status).toLowerCase();
  if (!VALID_REVIEW_STATUSES.has(status)) {
    addIssue(issues, { id: 'invalid_review_status', severity: 'critical', message: `Invalid review_status: ${status}`, slug, field: 'review_status', value: status });
  }

  if (reviewedBy) {
    if (!reviewerId || !VALID_REVIEWER_IDS.has(reviewerId)) {
      addIssue(issues, { id: 'orphan_reviewed_by', severity: 'critical', message: `reviewed_by not in reviewers.ts: ${reviewedBy}`, slug, field: 'reviewed_by', value: reviewedBy });
    }
    if (status === 'draft') {
      addIssue(issues, { id: 'reviewed_by_with_draft_status', severity: 'warning', message: 'reviewed_by set but review_status is draft', slug, field: 'review_status' });
    }
    if (!status || status === 'draft') {
      addIssue(issues, { id: 'reviewed_by_non_indexable_status', severity: 'warning', message: 'reviewed_by set but review_status is not indexable', slug, field: 'review_status', value: status || '(empty)' });
    }
    if (reviewerId && !cleanText(question.reviewed_at) && reviewerId !== 'codex-seo-review') {
      addIssue(issues, { id: 'clinical_reviewer_missing_reviewed_at', severity: 'warning', message: 'Clinical reviewer set but reviewed_at is empty', slug, field: 'reviewed_at' });
    }
  }

  if (enriched && !hasSections) {
    addIssue(issues, { id: 'enriched_without_sections', severity: 'critical', message: 'content_enriched_at set but answer_sections empty', slug, field: 'content_enriched_at' });
  }
  if (hasSections && !enriched) {
    addIssue(issues, { id: 'sections_without_enriched_at', severity: 'warning', message: 'answer_sections present but content_enriched_at empty', slug, field: 'content_enriched_at' });
  }

  const schemaQ = cleanText(question.suggested_schema_question);
  const originalQ = cleanText(question.question);
  if (schemaQ && originalQ && schemaQ.toLowerCase() === originalQ.toLowerCase()) {
    addIssue(issues, { id: 'schema_question_equals_original', severity: 'info', message: 'suggested_schema_question identical to question (may be intentional fallback)', slug, field: 'suggested_schema_question' });
  }

  if (isV2Answer(question) && relatedQuestionCount(question) < 5) {
    addIssue(issues, { id: 'related_questions_below_5', severity: relatedQuestionCount(question) < 3 ? 'critical' : 'warning', message: `related_questions count ${relatedQuestionCount(question)} (expected ≥5 for enriched answers)`, slug, field: 'related_questions', value: String(relatedQuestionCount(question)) });
  }

  for (const field of ['answer_sections', 'key_takeaways', 'related_questions', 'related_themes', 'source_refs', 'primary_entities', 'related_entities']) {
    if (!isValidJsonArray(question[field])) {
      addIssue(issues, { id: `jsonb_not_array_${field}`, severity: 'critical', message: `${field} is not a JSON array`, slug, field });
    }
  }

  auditAnswerSections(question, issues);
  auditSourceRefs(question, issues);

  // Addiction-specific checks restored
  if (addictionSlugs.includes(slug)) {
    const promptVersion = cleanText(question.content_prompt_version);
    if (promptVersion && promptVersion !== ADDICTION_PROMPT_VERSION) {
      addIssue(issues, {
        id: 'addiction_wrong_prompt_version',
        severity: 'warning',
        message: `Addiction answer has unexpected content_prompt_version: ${promptVersion}`,
        slug,
        field: 'content_prompt_version',
        value: promptVersion,
      });
    }
    if (isV2Answer(question) && reviewerId !== 'david-k-gore-phd' && reviewerId !== 'codex-seo-review') {
      addIssue(issues, {
        id: 'addiction_missing_gore_reviewer',
        severity: 'info',
        message: 'Addiction enriched answer not reviewed by david-k-gore-phd',
        slug,
        field: 'reviewed_by',
        value: reviewedBy || '(empty)',
      });
    }
    if (promptVersion === CORPUS_PROMPT_VERSION) {
      addIssue(issues, {
        id: 'addiction_corpus_prompt_mismatch',
        severity: 'warning',
        message: 'Addiction slug promoted with corpus prompt version',
        slug,
        field: 'content_prompt_version',
      });
    }
  }

  return { score };
}

function detectDuplicateQuestions(questions) {
  const byNormalized = new Map();
  for (const question of questions) {
    const key = normalizeQuestionText(question.question);
    if (!key) continue;
    const list = byNormalized.get(key) ?? [];
    list.push(question.slug);
    byNormalized.set(key, list);
  }
  return [...byNormalized.entries()].filter(([, slugs]) => slugs.length > 1);
}

function detectSlugCollisions(questions) {
  const bySlug = new Map();
  for (const question of questions) {
    const slug = cleanText(question.slug);
    if (!slug) continue;
    const set = bySlug.get(slug) ?? new Set();
    set.add(question.id);
    bySlug.set(slug, set);
  }
  return [...bySlug.entries()].filter(([, idSet]) => idSet.size > 1).map(([slug, idSet]) => [slug, [...idSet]]);
}

function crossReferencePromoteReports(questions, promoteReports, issues) {
  const bySlug = new Map(questions.map((q) => [q.slug, q]));
  for (const report of promoteReports) {
    for (const slug of report.slugs) {
      const row = bySlug.get(slug);
      if (!row) {
        addIssue(issues, { id: 'promote_slug_missing_in_db', severity: 'critical', message: `Promoted slug missing from DB (${report.path})`, slug });
        continue;
      }
      if (!row.content_enriched_at) {
        addIssue(issues, { id: 'promote_not_enriched_in_db', severity: 'critical', message: `Promoted slug lacks content_enriched_at (${report.path})`, slug });
      }
      const update = report.updates?.find((item) => item.slug === slug);
      if (update?.section_count && sectionCount(row) < update.section_count) {
        addIssue(issues, { id: 'promote_section_count_mismatch', severity: 'warning', message: `Promoted section_count ${update.section_count} but DB has ${sectionCount(row)}`, slug });
      }
    }
  }
}

export async function runDataIntegrityAudit(client) {
  const questions = await fetchAllQuestions(client);
  const total = questions.length;
  const generatedAt = new Date().toISOString();
  const issues = [];
  const addictionSlugs = loadAddictionSlugs();
  const promoteReports = loadPromoteReports();
  const inputsLoaded = [];
  if (existsSync(ADDICTION_REVIEW_REPORT)) inputsLoaded.push(ADDICTION_REVIEW_REPORT);
  for (const dir of ['reports/enrichment-corpus/promote-updates', 'reports/enrichment-addiction/promote-updates']) {
    if (existsSync(dir)) inputsLoaded.push(dir);
  }

  const scoreDistribution = {};
  const tierCounts = {};
  const reviewStatusCounts = new Map();
  let at100 = 0;
  let indexable = 0;

  for (const question of questions) {
    const { score } = auditRow(question, issues, addictionSlugs);
    const band = `${Math.floor(score / 10) * 10}-${Math.floor(score / 10) * 10 + 9}`;
    scoreDistribution[band] = (scoreDistribution[band] ?? 0) + 1;
    const tier = tierForScore(score);
    tierCounts[tier] = (tierCounts[tier] ?? 0) + 1;
    if (score === 100) at100 += 1;

    const status = cleanText(question.review_status).toLowerCase() || '(empty)';
    reviewStatusCounts.set(status, (reviewStatusCounts.get(status) ?? 0) + 1);
    if (!status || INDEXABLE_REVIEW_STATUSES.has(status)) indexable += 1;
  }

  // Detect any pagination duplication of the same row id
  const distinctIds = new Set(questions.map((q) => q.id));
  if (distinctIds.size !== questions.length) {
    addIssue(issues, {
      id: 'pagination_duplicate_row',
      severity: 'critical',
      message: `Fetched ${questions.length} rows but ${distinctIds.size} distinct ids`,
      slug: null,
      field: 'id',
      value: `${questions.length} vs ${distinctIds.size}`,
    });
  }

  const slugCollisions = detectSlugCollisions(questions);
  for (const [slug, ids] of slugCollisions) {
    addIssue(issues, { id: 'duplicate_slug', severity: 'critical', message: `Duplicate slug (${ids.length} rows)`, slug, field: 'slug', count: ids.length });
  }

  const duplicateQuestions = detectDuplicateQuestions(questions);
  for (const [, slugs] of duplicateQuestions) {
    addIssue(issues, { id: 'duplicate_question_text', severity: 'warning', message: `Duplicate question text (${slugs.length} slugs)`, slug: slugs[0], field: 'question', count: slugs.length });
  }

  crossReferencePromoteReports(questions, promoteReports, issues);

  const issueCounts = {
    critical: issues.filter((item) => item.severity === 'critical').reduce((sum, item) => sum + (item.count ?? 1), 0),
    warning: issues.filter((item) => item.severity === 'warning').reduce((sum, item) => sum + (item.count ?? 1), 0),
    info: issues.filter((item) => item.severity === 'info').reduce((sum, item) => sum + (item.count ?? 1), 0),
  };

  const promoteDetails = promoteReports.map((report) => {
    const bySlug = new Map(questions.map((q) => [q.slug, q]));
    let missing = 0;
    let notEnriched = 0;
    for (const slug of report.slugs) {
      const row = bySlug.get(slug);
      if (!row) missing += 1;
      else if (!row.content_enriched_at) notEnriched += 1;
    }
    return { path: report.path, slug_count: report.slugs.length, missing, not_enriched: notEnriched };
  });

  const summary = {
    total_rows: total,
    build_floor: { pass: total >= MIN_ANSWER_COUNT, minimum: MIN_ANSWER_COUNT },
    completeness: { all_100: at100 === total, at_100: at100, distribution: scoreDistribution, tiers: tierCounts },
    slug_uniqueness: { pass: slugCollisions.length === 0, duplicates: slugCollisions.length },
    jsonb_integrity: { pass: !issues.some((item) => item.id.startsWith('jsonb_not_array_')) },
    reviewer_attribution: { pass: !issues.some((item) => item.id === 'orphan_reviewed_by'), orphan_count: issues.find((item) => item.id === 'orphan_reviewed_by')?.count ?? 0 },
    enrichment_consistency: { pass: !issues.some((item) => ['enriched_without_sections', 'sections_without_enriched_at'].includes(item.id)) },
    promote_alignment: { pass: promoteDetails.every((row) => row.missing === 0 && row.not_enriched === 0), reports_checked: promoteReports.length, details: promoteDetails },
    indexability: { pass: indexable === total, indexable, non_indexable: total - indexable },
    issue_counts: issueCounts,
    review_status_distribution: [...reviewStatusCounts.entries()].sort((a, b) => b[1] - a[1]),
    duplicate_questions: duplicateQuestions,
    addiction_slug_count: addictionSlugs.length,
    overall_status: issueCounts.critical === 0 ? (issueCounts.warning === 0 ? 'PASS' : 'PASS WITH WARNINGS') : 'FAIL',
  };

  return {
    generated_at: generatedAt,
    source: 'questions_master',
    summary,
    issues: issues.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 };
      return order[a.severity] - order[b.severity] || (b.count ?? 0) - (a.count ?? 0);
    }),
    critical_instances: Array.isArray(globalThis.__CRITICAL_DETAILS__) ? globalThis.__CRITICAL_DETAILS__ : [],
    inputs_loaded: inputsLoaded,
  };
}
