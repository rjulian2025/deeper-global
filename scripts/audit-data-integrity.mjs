#!/usr/bin/env node
/**
 * Comprehensive data integrity audit for questions_master.
 * Read-only — does not mutate Supabase.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import {
  cleanText,
  completenessScore,
  hasSourceRefs,
  isV2Answer,
  missingFields,
  resolveSupabaseConfig,
  sectionCount,
  takeawayCount,
  relatedQuestionCount,
  tierForScore,
} from './lib/content-enrichment-utils.mjs';

const OUT_DIR = 'reports/data-integrity';
const OUT_JSON = `${OUT_DIR}/audit-2026-06-14.json`;
const OUT_MD = `${OUT_DIR}/audit-2026-06-14.md`;
const MIN_ANSWER_COUNT = 950;
const PAGE_SIZE = 1000;

const VALID_REVIEW_STATUSES = new Set(['', 'draft', 'reviewed', 'approved', 'published']);
const INDEXABLE_REVIEW_STATUSES = new Set(['approved', 'published', 'reviewed']);
const VALID_REVIEWER_IDS = new Set(['david-k-gore-phd', 'kenneth-w-christian-phd', 'codex-seo-review']);
const REVIEWER_ALIASES = {
  'david-k-gore-phd': 'david-k-gore-phd',
  'david k gore phd': 'david-k-gore-phd',
  'david k. gore phd': 'david-k-gore-phd',
  'david k. gore, phd': 'david-k-gore-phd',
  'kenneth-w-christian-phd': 'kenneth-w-christian-phd',
  'kenneth w christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian, phd': 'kenneth-w-christian-phd',
  'codex-seo-review': 'codex-seo-review',
};
const ADDICTION_REVIEW_REPORT = 'reports/review-updates/addiction-review-2026-03-13.json';
const ADDICTION_PROMPT_VERSION = 'deeper-addiction-enrichment-v1';
const CORPUS_PROMPT_VERSION = 'deeper-answer-enrichment-v1';
const AI_SPRINT_PROMPT_VERSION = 'deeper-ai-concerns-sprint-v1';

function normalizeReviewerLabel(value) {
  return value
    .toLowerCase()
    .replace(/[,.-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveReviewerId(reviewedBy) {
  const label = cleanText(reviewedBy);
  if (!label) return null;
  return REVIEWER_ALIASES[label.toLowerCase()] ?? REVIEWER_ALIASES[normalizeReviewerLabel(label)] ?? null;
}

function pct(count, total) {
  if (!total) return '0.0%';
  return `${((count / total) * 100).toFixed(1)}%`;
}

function addIssue(issues, { id, severity, message, slug, field, value, count }) {
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
      .select('*')
      .order('created_at', { ascending: false })
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
  question.answer_sections.forEach((section, index) => {
    if (!section || typeof section !== 'object') {
      addIssue(issues, {
        id: 'answer_sections_invalid_item',
        severity: 'critical',
        message: 'answer_sections contains non-object item',
        slug: question.slug,
        field: 'answer_sections',
      });
      return;
    }
    if (!cleanText(section.body)) {
      addIssue(issues, {
        id: 'answer_sections_missing_body',
        severity: 'critical',
        message: 'answer_sections item missing body',
        slug: question.slug,
        field: 'answer_sections',
      });
    }
    if (!cleanText(section.heading)) {
      addIssue(issues, {
        id: 'answer_sections_missing_heading',
        severity: 'warning',
        message: 'answer_sections item missing heading',
        slug: question.slug,
        field: 'answer_sections',
      });
    }
  });
}

function auditSourceRefs(question, issues) {
  if (!Array.isArray(question.source_refs)) return;
  for (const item of question.source_refs) {
    if (!item || typeof item !== 'object') {
      addIssue(issues, {
        id: 'source_refs_invalid_item',
        severity: 'critical',
        message: 'source_refs contains non-object item',
        slug: question.slug,
        field: 'source_refs',
      });
      continue;
    }
    const title = cleanText(item.title);
    const url = cleanText(item.url);
    if (!title && !url) {
      addIssue(issues, {
        id: 'source_refs_empty_entry',
        severity: 'critical',
        message: 'source_refs entry has neither title nor url',
        slug: question.slug,
        field: 'source_refs',
      });
    } else if (!title) {
      addIssue(issues, {
        id: 'source_refs_missing_title',
        severity: 'warning',
        message: 'source_refs entry missing title',
        slug: question.slug,
        field: 'source_refs',
      });
    } else if (!url) {
      addIssue(issues, {
        id: 'source_refs_missing_url',
        severity: 'warning',
        message: 'source_refs entry missing url',
        slug: question.slug,
        field: 'source_refs',
      });
    }
  }
}

function auditRow(question, issues, addictionSlugs) {
  const slug = cleanText(question.slug);
  const score = completenessScore(question);
  const missing = missingFields(question);
  const enriched = Boolean(question.content_enriched_at);
  const hasSections = sectionCount(question) > 0;

  if (!slug) {
    addIssue(issues, {
      id: 'missing_slug',
      severity: 'critical',
      message: 'Row missing slug',
      slug: String(question.id),
      field: 'slug',
    });
  }

  if (!cleanText(question.question)) {
    addIssue(issues, {
      id: 'missing_question',
      severity: 'critical',
      message: 'Row missing question text',
      slug,
      field: 'question',
    });
  }

  if (!cleanText(question.category) && !cleanText(question.raw_category)) {
    addIssue(issues, {
      id: 'missing_category',
      severity: 'critical',
      message: 'Row missing category and raw_category',
      slug,
      field: 'category',
    });
  }

  for (const field of missing) {
    const severity = field.includes('>=') || field === 'content_enriched_at|answer_sections' ? 'critical' : 'warning';
    addIssue(issues, {
      id: `missing_${field.replace(/[^a-z0-9]+/gi, '_')}`,
      severity,
      message: `Missing enrichment field: ${field}`,
      slug,
      field,
    });
  }

  if (score < 100) {
    addIssue(issues, {
      id: 'completeness_below_100',
      severity: score < 60 ? 'critical' : 'warning',
      message: `Completeness score ${score} (expected 100)`,
      slug,
      field: 'completeness_score',
      value: String(score),
    });
  }

  const status = cleanText(question.review_status).toLowerCase();
  if (!VALID_REVIEW_STATUSES.has(status)) {
    addIssue(issues, {
      id: 'invalid_review_status',
      severity: 'critical',
      message: `Invalid review_status: ${status}`,
      slug,
      field: 'review_status',
      value: status,
    });
  }

  const reviewedBy = cleanText(question.reviewed_by);
  if (reviewedBy) {
    const reviewerId = resolveReviewerId(reviewedBy);
    if (!reviewerId || !VALID_REVIEWER_IDS.has(reviewerId)) {
      addIssue(issues, {
        id: 'orphan_reviewed_by',
        severity: 'critical',
        message: `reviewed_by not in reviewers.ts: ${reviewedBy}`,
        slug,
        field: 'reviewed_by',
        value: reviewedBy,
      });
    }
    if (status === 'draft') {
      addIssue(issues, {
        id: 'reviewed_by_with_draft_status',
        severity: 'warning',
        message: 'reviewed_by set but review_status is draft',
        slug,
        field: 'review_status',
      });
    }
    if (!status || status === 'draft') {
      addIssue(issues, {
        id: 'reviewed_by_non_indexable_status',
        severity: 'warning',
        message: 'reviewed_by set but review_status is not indexable',
        slug,
        field: 'review_status',
        value: status || '(empty)',
      });
    }
    if (reviewerId && !cleanText(question.reviewed_at) && reviewerId !== 'codex-seo-review') {
      addIssue(issues, {
        id: 'clinical_reviewer_missing_reviewed_at',
        severity: 'warning',
        message: 'Clinical reviewer set but reviewed_at is empty',
        slug,
        field: 'reviewed_at',
      });
    }
  }

  if (enriched && !hasSections) {
    addIssue(issues, {
      id: 'enriched_without_sections',
      severity: 'critical',
      message: 'content_enriched_at set but answer_sections empty',
      slug,
      field: 'content_enriched_at',
    });
  }
  if (hasSections && !enriched) {
    addIssue(issues, {
      id: 'sections_without_enriched_at',
      severity: 'warning',
      message: 'answer_sections present but content_enriched_at empty',
      slug,
      field: 'content_enriched_at',
    });
  }

  const schemaQ = cleanText(question.suggested_schema_question);
  const originalQ = cleanText(question.question);
  if (schemaQ && originalQ && schemaQ.toLowerCase() === originalQ.toLowerCase()) {
    addIssue(issues, {
      id: 'schema_question_equals_original',
      severity: 'info',
      message: 'suggested_schema_question identical to question (may be intentional fallback)',
      slug,
      field: 'suggested_schema_question',
    });
  }

  if (isV2Answer(question) && relatedQuestionCount(question) < 5) {
    addIssue(issues, {
      id: 'related_questions_below_5',
      severity: relatedQuestionCount(question) < 3 ? 'critical' : 'warning',
      message: `related_questions count ${relatedQuestionCount(question)} (expected ≥5 for enriched answers)`,
      slug,
      field: 'related_questions',
      value: String(relatedQuestionCount(question)),
    });
  }

  for (const field of [
    'answer_sections',
    'key_takeaways',
    'related_questions',
    'related_themes',
    'source_refs',
    'primary_entities',
    'related_entities',
  ]) {
    if (!isValidJsonArray(question[field])) {
      addIssue(issues, {
        id: `jsonb_not_array_${field}`,
        severity: 'critical',
        message: `${field} is not a JSON array`,
        slug,
        field,
      });
    }
  }

  auditAnswerSections(question, issues);
  auditSourceRefs(question, issues);

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
    const reviewerId = resolveReviewerId(reviewedBy);
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
  }

  if (cleanText(question.content_prompt_version) === CORPUS_PROMPT_VERSION && addictionSlugs.includes(slug)) {
    addIssue(issues, {
      id: 'addiction_corpus_prompt_mismatch',
      severity: 'warning',
      message: 'Addiction slug promoted with corpus prompt version',
      slug,
      field: 'content_prompt_version',
    });
  }

  return { score, missing, tier: tierForScore(score) };
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
    const list = bySlug.get(slug) ?? [];
    list.push(question.id);
    bySlug.set(slug, list);
  }
  return [...bySlug.entries()].filter(([, ids]) => ids.length > 1);
}

function crossReferencePromoteReports(questions, promoteReports, issues) {
  const bySlug = new Map(questions.map((q) => [q.slug, q]));
  for (const report of promoteReports) {
    for (const slug of report.slugs) {
      const row = bySlug.get(slug);
      if (!row) {
        addIssue(issues, {
          id: 'promote_slug_missing_in_db',
          severity: 'critical',
          message: `Promoted slug missing from DB (${report.path})`,
          slug,
        });
        continue;
      }
      if (!row.content_enriched_at) {
        addIssue(issues, {
          id: 'promote_not_enriched_in_db',
          severity: 'critical',
          message: `Promoted slug lacks content_enriched_at (${report.path})`,
          slug,
        });
      }
      const update = report.updates?.find((item) => item.slug === slug);
      if (update?.section_count && sectionCount(row) < update.section_count) {
        addIssue(issues, {
          id: 'promote_section_count_mismatch',
          severity: 'warning',
          message: `Promoted section_count ${update.section_count} but DB has ${sectionCount(row)}`,
          slug,
        });
      }
    }
  }
}

function buildMarkdown(report) {
  const { summary, issues, schema_documentation, recommendations } = report;
  const bySeverity = (severity) => issues.filter((item) => item.severity === severity);

  const issueTable = (items) =>
    items.length
      ? items
          .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
          .map(
            (item) =>
              `| ${item.id} | ${item.severity} | ${item.count ?? 1} | ${item.message} | ${item.examples.slice(0, 5).join(', ') || '—'} |`
          )
          .join('\n')
      : '| — | — | 0 | None | — |';

  return `# Deeper Global Data Integrity Audit

Generated: ${report.generated_at}

Read-only audit of \`questions_master\` against site schema, enrichment gates, and trust layer expectations.

## Executive Summary

| Area | Status | Notes |
| --- | --- | --- |
| Row count floor (${MIN_ANSWER_COUNT}+) | ${summary.build_floor.pass ? '**PASS**' : '**FAIL**'} | ${summary.total_rows} rows |
| Completeness score = 100 | ${summary.completeness.all_100 ? '**PASS**' : '**FAIL**'} | ${summary.completeness.at_100} / ${summary.total_rows} at 100 |
| Slug uniqueness | ${summary.slug_uniqueness.pass ? '**PASS**' : '**FAIL**'} | ${summary.slug_uniqueness.duplicates} duplicate slugs |
| JSONB array integrity | ${summary.jsonb_integrity.pass ? '**PASS**' : '**FAIL**'} | |
| Reviewer attribution | ${summary.reviewer_attribution.pass ? '**PASS**' : '**FAIL**'} | ${summary.reviewer_attribution.orphan_count} orphan reviewers |
| Enrichment consistency | ${summary.enrichment_consistency.pass ? '**PASS**' : '**FAIL**'} | enriched/sections alignment |
| Promote report alignment | ${summary.promote_alignment.pass ? '**PASS**' : '**FAIL**'} | ${summary.promote_alignment.reports_checked} reports |
| Site indexability | ${summary.indexability.pass ? '**PASS**' : '**WARN**'} | ${summary.indexability.indexable} indexable |

**Overall:** ${summary.overall_status}

## Issue Counts by Severity

| Severity | Count |
| --- | ---: |
| Critical | ${summary.issue_counts.critical} |
| Warning | ${summary.issue_counts.warning} |
| Info | ${summary.issue_counts.info} |

## Completeness Score Distribution

| Score band | Count | Share |
| --- | ---: | ---: |
${Object.entries(summary.completeness.distribution)
  .sort((a, b) => Number(a[0]) - Number(b[0]))
  .map(([band, count]) => `| ${band} | ${count} | ${pct(count, summary.total_rows)} |`)
  .join('\n')}

| Tier | Count | Share |
| --- | ---: | ---: |
${Object.entries(summary.completeness.tiers)
  .map(([tier, count]) => `| ${tier} | ${count} | ${pct(count, summary.total_rows)} |`)
  .join('\n')}

## review_status Distribution

| Status | Count | Share |
| --- | ---: | ---: |
${summary.review_status_distribution
  .map(([status, count]) => `| ${status} | ${count} | ${pct(count, summary.total_rows)} |`)
  .join('\n')}

## Critical Issues

| ID | Severity | Count | Message | Example slugs |
| --- | --- | ---: | --- | --- |
${issueTable(bySeverity('critical'))}

## Warning Issues

| ID | Severity | Count | Message | Example slugs |
| --- | --- | ---: | --- | --- |
${issueTable(bySeverity('warning'))}

## Info Issues

| ID | Severity | Count | Message | Example slugs |
| --- | --- | ---: | --- | --- |
${issueTable(bySeverity('info'))}

## Duplicate Questions (normalized text)

${
  summary.duplicate_questions.length
    ? summary.duplicate_questions
        .slice(0, 20)
        .map(([text, slugs]) => `- "${text.slice(0, 80)}${text.length > 80 ? '…' : ''}" → ${slugs.join(', ')}`)
        .join('\n')
    : 'No duplicate question text detected.'
}

## Cross-Reference: Promote Reports

| Report | Slugs | Missing in DB | Not enriched |
| --- | ---: | ---: | ---: |
${summary.promote_alignment.details
  .map((row) => `| ${row.path} | ${row.slug_count} | ${row.missing} | ${row.not_enriched} |`)
  .join('\n')}

## Schema Documentation Summary

${schema_documentation}

## Recommendations

${recommendations.map((item, index) => `${index + 1}. **${item.title}** — ${item.detail}`).join('\n')}
`;
}

function parseArgs(argv) {
  return { failOnCritical: argv.includes('--fail-on-critical') };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });
  const questions = await fetchAllQuestions(client);
  const total = questions.length;
  const generatedAt = new Date().toISOString();
  const issues = [];
  const addictionSlugs = loadAddictionSlugs();
  const promoteReports = loadPromoteReports();

  const scoreDistribution = {};
  const tierCounts = {};
  const reviewStatusCounts = new Map();
  let at100 = 0;
  let indexable = 0;

  for (const question of questions) {
    const { score, tier } = auditRow(question, issues, addictionSlugs);
    const band = `${Math.floor(score / 10) * 10}-${Math.floor(score / 10) * 10 + 9}`;
    scoreDistribution[band] = (scoreDistribution[band] ?? 0) + 1;
    tierCounts[tier] = (tierCounts[tier] ?? 0) + 1;
    if (score === 100) at100 += 1;

    const status = cleanText(question.review_status).toLowerCase() || '(empty)';
    reviewStatusCounts.set(status, (reviewStatusCounts.get(status) ?? 0) + 1);

    if (!status || INDEXABLE_REVIEW_STATUSES.has(status)) indexable += 1;
  }

  const slugCollisions = detectSlugCollisions(questions);
  for (const [slug, ids] of slugCollisions) {
    addIssue(issues, {
      id: 'duplicate_slug',
      severity: 'critical',
      message: `Duplicate slug (${ids.length} rows)`,
      slug,
      field: 'slug',
      count: ids.length,
    });
  }

  const duplicateQuestions = detectDuplicateQuestions(questions);
  for (const [, slugs] of duplicateQuestions) {
    addIssue(issues, {
      id: 'duplicate_question_text',
      severity: 'warning',
      message: `Duplicate question text (${slugs.length} slugs)`,
      slug: slugs[0],
      field: 'question',
      count: slugs.length,
    });
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
    completeness: {
      all_100: at100 === total,
      at_100: at100,
      distribution: scoreDistribution,
      tiers: tierCounts,
    },
    slug_uniqueness: { pass: slugCollisions.length === 0, duplicates: slugCollisions.length },
    jsonb_integrity: {
      pass: !issues.some((item) => item.id.startsWith('jsonb_not_array_')),
    },
    reviewer_attribution: {
      pass: !issues.some((item) => item.id === 'orphan_reviewed_by'),
      orphan_count: issues.find((item) => item.id === 'orphan_reviewed_by')?.count ?? 0,
    },
    enrichment_consistency: {
      pass: !issues.some((item) => ['enriched_without_sections', 'sections_without_enriched_at'].includes(item.id)),
    },
    promote_alignment: {
      pass: promoteDetails.every((row) => row.missing === 0 && row.not_enriched === 0),
      reports_checked: promoteReports.length,
      details: promoteDetails,
    },
    indexability: { pass: indexable === total, indexable, non_indexable: total - indexable },
    issue_counts: issueCounts,
    review_status_distribution: [...reviewStatusCounts.entries()].sort((a, b) => b[1] - a[1]),
    duplicate_questions: duplicateQuestions,
    addiction_slug_count: addictionSlugs.length,
    overall_status:
      issueCounts.critical === 0
        ? issueCounts.warning === 0
          ? 'PASS'
          : 'PASS WITH WARNINGS'
        : 'FAIL',
  };

  const schemaDocumentation = `### Question type (src/lib/supabase.ts)
Core fields: \`question\`, \`short_answer\`, \`answer\`, \`slug\`, \`category\`/\`raw_category\`, timestamps.
Enrichment fields: \`improved_title\`, \`improved_meta_description\`, \`improved_summary\`, \`answer_sections[]\`, \`key_takeaways[]\`, \`care_note\`, \`related_questions[]\`, \`suggested_schema_question\`, \`suggested_schema_answer\`, \`primary_theme\`, \`related_themes[]\`, \`content_prompt_version\`, \`content_enriched_at\`.
Trust fields: \`review_status\`, \`reviewed_by\`, \`reviewed_at\`, \`source_refs[]\`.
Entity fields: \`primary_entities[]\`, \`related_entities[]\`.

### Completeness gate (scripts/lib/content-enrichment-utils.mjs)
16 checks → score 0–100. Promotion expects 100: title, meta, summary, ≥3 sections, ≥3 takeaways, care_note, ≥3 related_questions, schema Q/A, primary_theme, related_themes, ≥2 source_refs, content_enriched_at|sections.

### Site consumption
- \`[slug].astro\`: MedicalWebPage, Article, Question, Answer, DefinedTerm, BreadcrumbList JSON-LD; uses improved_* with legacy fallbacks.
- \`shouldIndexQuestion\`: indexable when review_status empty or in {approved, published, reviewed}.
- Reviewers: david-k-gore-phd, kenneth-w-christian-phd (+ codex-seo-review internal).
- \`indexation_instruction\` is draft-only metadata, not a DB column.

### DB constraints (docs/supabase-structured-content.sql)
JSONB fields must be arrays when non-null.`;

  const recommendations = [];
  if (!summary.completeness.all_100) {
    recommendations.push({
      title: 'Run targeted enrichment for incomplete rows',
      detail: `Only ${at100}/${total} rows score 100. Use prepare-corpus-enrichment-sources.mjs queue and apply-enrichment with validation gate blocking promote when completenessScore < 100.`,
    });
  }
  if (issueCounts.critical > 0) {
    recommendations.push({
      title: 'Add pre-promote validation script',
      detail:
        'Extend apply-enrichment dry-run to fail on orphan reviewed_by, empty source_refs entries, sections without body, and enriched_at/sections mismatch before any write.',
    });
  }
  if (!summary.reviewer_attribution.pass) {
    recommendations.push({
      title: 'Normalize reviewed_by to canonical reviewer IDs',
      detail:
        'Map all reviewed_by values to david-k-gore-phd, kenneth-w-christian-phd, or codex-seo-review; reject unknown labels at promote time.',
    });
  }
  recommendations.push({
    title: 'Add Supabase CHECK constraints for review_status',
    detail: "ALTER TABLE to enforce review_status IN ('draft','reviewed','approved','published') and require reviewed_at when reviewed_by is a clinical reviewer.",
  });
  recommendations.push({
    title: 'Gate static build on completeness floor',
    detail:
      'Add CI step running this audit; fail build if any enriched row has completeness < 100 or critical JSONB/section issues.',
  });
  if (duplicateQuestions.length) {
    recommendations.push({
      title: 'Resolve duplicate question text',
      detail: `${duplicateQuestions.length} normalized question clusters need canonical slug decisions or redirects.`,
    });
  }

  const report = {
    generated_at: generatedAt,
    source: 'questions_master',
    summary,
    issues: issues.sort((a, b) => {
      const order = { critical: 0, warning: 1, info: 2 };
      return order[a.severity] - order[b.severity] || (b.count ?? 0) - (a.count ?? 0);
    }),
    schema_documentation: schemaDocumentation,
    recommendations,
    site_consumption: {
      answer_page: 'src/pages/answers/[slug].astro',
      json_ld_types: ['MedicalWebPage', 'Article', 'Question', 'Answer', 'DefinedTerm', 'BreadcrumbList', 'Person'],
      llms_indexes: ['src/pages/llms.txt.ts', 'src/pages/llms/answers.json.ts', 'src/pages/llms/entities.json.ts'],
      trust_module: 'src/lib/trust.ts',
      content_module: 'src/lib/content.ts',
    },
    cross_reference: {
      addiction_slugs_expected: addictionSlugs.length,
      promote_reports: promoteDetails,
      supabase_slugs: total,
      build_static_paths: total,
    },
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(OUT_MD, `${buildMarkdown(report)}\n`);

  console.log(`Audited ${total} rows`);
  console.log(`Critical: ${issueCounts.critical}, Warning: ${issueCounts.warning}, Info: ${issueCounts.info}`);
  console.log(`Wrote ${OUT_JSON}`);
  console.log(`Wrote ${OUT_MD}`);

  if (args.failOnCritical && issueCounts.critical > 0) {
    console.error(`Failing: ${issueCounts.critical} critical issue(s) found`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
