import {
  completenessScore,
  isCrisisSensitive,
  cleanText,
} from './content-enrichment-utils.mjs';
import {
  apiCitationHtmlSection,
  apiCitationMarkdownSection,
  fetchApiCitationStats,
} from './api-citation-stats.mjs';
import { fetchAnswerPageMetricsComparison } from './gsc-fetch.mjs';

export const PLAN_VERSION = 'gsc-content-ops-v1';
export const MAX_BATCH_SIZE = 25;
export const MAX_CRISIS_SHARE = 0.3;
export const RECENT_STAGING_DAYS = 14;

export const THRESHOLDS = {
  minImpressionsConfident: 100,
  minClicksConfident: 5,
  minClicksProven: 10,
  strikerMinImpressions: 100,
  strikerMinPosition: 8,
  strikerMaxPosition: 20,
  ctrFixMinImpressions: 50,
  ctrFixMaxCtr: 0.02,
  ctrFixMaxPosition: 10,
  momentumMinImpressions: 50,
  momentumMinDeltaPct: 20,
};

const QUESTION_SELECT_COLUMNS = [
  'id',
  'slug',
  'question',
  'category',
  'raw_category',
  'review_status',
  'staging_rewrite_at',
  'staging_rewrite_error',
  'short_answer',
  'answer',
  'answer_sections',
  'improved_title',
  'improved_meta_description',
  'improved_summary',
  'key_takeaways',
  'source_refs',
  'content_enriched_at',
].join(', ');

function pctDelta(current, prior) {
  const cur = Number(current ?? 0);
  const prev = Number(prior ?? 0);
  if (prev <= 0) return cur > 0 ? 100 : 0;
  return ((cur - prev) / prev) * 100;
}

function daysSince(isoDate) {
  if (!isoDate) return null;
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / (24 * 60 * 60 * 1000));
}

function displayCategory(question) {
  return cleanText(question.category) || cleanText(question.raw_category) || 'General';
}

export function classifyOpportunity(metrics) {
  const current = metrics.current ?? {};
  const delta = metrics.delta ?? {};

  if (
    current.impressions >= THRESHOLDS.ctrFixMinImpressions &&
    current.ctr < THRESHOLDS.ctrFixMaxCtr &&
    current.position > 0 &&
    current.position <= THRESHOLDS.ctrFixMaxPosition
  ) {
    return 'CTR_FIX';
  }

  if (
    current.impressions >= THRESHOLDS.strikerMinImpressions &&
    current.position >= THRESHOLDS.strikerMinPosition &&
    current.position <= THRESHOLDS.strikerMaxPosition
  ) {
    return 'STRIKER';
  }

  if (current.clicks >= THRESHOLDS.minClicksProven) {
    return 'PROVEN_CLICKS';
  }

  if (
    current.impressions >= THRESHOLDS.momentumMinImpressions &&
    delta.impressions_pct >= THRESHOLDS.momentumMinDeltaPct
  ) {
    return 'MOMENTUM';
  }

  if (current.clicks > 0 || current.impressions > 0) {
    return 'RECOMMENDED';
  }

  return 'NO_SIGNAL';
}

export function confidenceForOpportunity(metrics, opportunityType) {
  const current = metrics.current ?? {};
  const delta = metrics.delta ?? {};

  if (opportunityType === 'NO_SIGNAL') {
    return { confident: false, reason: 'no_gsc_signal' };
  }

  if (current.clicks >= THRESHOLDS.minClicksConfident) {
    return { confident: true, reason: 'clicks_threshold' };
  }

  if (current.impressions >= THRESHOLDS.minImpressionsConfident) {
    return { confident: true, reason: 'impressions_threshold' };
  }

  if (opportunityType === 'CTR_FIX') {
    return { confident: true, reason: 'ctr_gap' };
  }

  if (opportunityType === 'STRIKER') {
    return { confident: true, reason: 'striker_position_band' };
  }

  if (opportunityType === 'MOMENTUM' && delta.impressions_pct >= THRESHOLDS.momentumMinDeltaPct) {
    return { confident: true, reason: 'impression_momentum' };
  }

  return { confident: false, reason: 'below_confidence_threshold' };
}

export function priorityScore(row) {
  const current = row.gsc?.current ?? {};
  const delta = row.gsc?.delta ?? {};
  const typeBonus = {
    CTR_FIX: 80,
    STRIKER: 70,
    PROVEN_CLICKS: 60,
    MOMENTUM: 50,
    RECOMMENDED: 10,
    NO_SIGNAL: 0,
  };

  let score =
    Number(current.clicks ?? 0) * 1000 +
    Math.max(0, Number(delta.clicks ?? 0)) * 500 +
    Number(current.impressions ?? 0) * 0.1 +
    (typeBonus[row.opportunity_type] ?? 0) +
    (100 - row.completeness_score) * 2;

  if (row.crisis_sensitive) score += 25;
  if (row.recently_staged) score -= 1000;

  return Math.round(score);
}

function applyCrisisCap(rows, maxCount = MAX_BATCH_SIZE) {
  const crisisLimit = Math.floor(maxCount * MAX_CRISIS_SHARE);
  const selected = [];
  let crisisCount = 0;

  for (const row of rows) {
    if (row.crisis_sensitive && crisisCount >= crisisLimit) continue;
    selected.push(row);
    if (row.crisis_sensitive) crisisCount += 1;
    if (selected.length >= maxCount) break;
  }

  return selected;
}

async function fetchAllQuestions(client) {
  const rows = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await client
      .from('questions_master')
      .select(QUESTION_SELECT_COLUMNS)
      .order('slug', { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

function buildSlugIndex(questions) {
  const bySlug = new Map();
  const questionTexts = [];

  for (const question of questions) {
    bySlug.set(question.slug, question);
    questionTexts.push({
      slug: question.slug,
      text: cleanText(question.question).toLowerCase(),
    });
  }

  return { bySlug, questionTexts };
}

function queryMapsToExistingSlug(query, questionTexts) {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return null;

  for (const item of questionTexts) {
    if (!item.text) continue;
    if (item.text.includes(normalized) || normalized.includes(item.text.slice(0, 40))) {
      return item.slug;
    }
  }

  return null;
}

export async function buildWeeklyContentPlan({
  supabaseClient,
  mode = 'recommend',
  maxBatchSize = MAX_BATCH_SIZE,
  includeQueryGaps = false,
  windowDays = 28,
  lagDays = 3,
} = {}) {
  const gsc = await fetchAnswerPageMetricsComparison({ includeQueries: includeQueryGaps, windowDays, lagDays });
  const questions = await fetchAllQuestions(supabaseClient);
  const { bySlug, questionTexts } = buildSlugIndex(questions);

  const candidates = [];

  for (const question of questions) {
    const current = gsc.current.bySlug.get(question.slug) ?? {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
      page: `/answers/${question.slug}/`,
    };
    const prior = gsc.prior.bySlug.get(question.slug) ?? {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
    };

    const metrics = {
      current,
      prior,
      delta: {
        clicks: Number(current.clicks ?? 0) - Number(prior.clicks ?? 0),
        impressions: Number(current.impressions ?? 0) - Number(prior.impressions ?? 0),
        clicks_pct: pctDelta(current.clicks, prior.clicks),
        impressions_pct: pctDelta(current.impressions, prior.impressions),
      },
    };

    const opportunityType = classifyOpportunity(metrics);
    if (opportunityType === 'NO_SIGNAL') continue;

    const confidence = confidenceForOpportunity(metrics, opportunityType);
    const stagingAgeDays = daysSince(question.staging_rewrite_at);
    const recentlyStaged = stagingAgeDays !== null && stagingAgeDays < RECENT_STAGING_DAYS;

    const row = {
      slug: question.slug,
      question: cleanText(question.question),
      category: displayCategory(question),
      review_status: cleanText(question.review_status) || null,
      completeness_score: completenessScore(question),
      crisis_sensitive: isCrisisSensitive(question),
      opportunity_type: opportunityType,
      confidence,
      recently_staged: recentlyStaged,
      staging_rewrite_at: question.staging_rewrite_at ?? null,
      gsc: metrics,
      priority_score: 0,
      auto_stage_eligible: false,
      recommendation: 'rewrite_existing',
    };

    row.priority_score = priorityScore(row);
    row.auto_stage_eligible =
      mode === 'auto-stage' &&
      confidence.confident &&
      !recentlyStaged &&
      !question.staging_rewrite_at;

    candidates.push(row);
  }

  candidates.sort((a, b) => {
    if (b.priority_score !== a.priority_score) return b.priority_score - a.priority_score;
    return a.slug.localeCompare(b.slug);
  });

  const recommended = candidates.slice(0, maxBatchSize);
  const confidentCandidates = candidates.filter((row) => row.confidence.confident && !row.recently_staged);
  const autoStagePool = applyCrisisCap(confidentCandidates, maxBatchSize);
  const autoStage = mode === 'auto-stage' ? autoStagePool.filter((row) => row.auto_stage_eligible) : [];

  const deferredV2QueryGaps = [];
  if (includeQueryGaps && gsc.current.queries?.length) {
    for (const queryRow of gsc.current.queries) {
      const mappedSlug = queryMapsToExistingSlug(queryRow.query, questionTexts);
      if (mappedSlug) continue;
      if (queryRow.impressions < THRESHOLDS.minImpressionsConfident) continue;
      deferredV2QueryGaps.push({
        query: queryRow.query,
        clicks: queryRow.clicks,
        impressions: queryRow.impressions,
        position: queryRow.position,
        recommendation: 'deferred_v2_new_page',
      });
    }
    deferredV2QueryGaps.sort((a, b) => b.impressions - a.impressions);
  }

  const totalClicks = [...gsc.current.bySlug.values()].reduce((sum, row) => sum + Number(row.clicks ?? 0), 0);
  const priorTotalClicks = [...gsc.prior.bySlug.values()].reduce((sum, row) => sum + Number(row.clicks ?? 0), 0);
  const apiCitation = supabaseClient
    ? await fetchApiCitationStats(supabaseClient, { windowDays: Math.min(windowDays, 28) })
    : null;

  return {
    version: PLAN_VERSION,
    generated_at: new Date().toISOString(),
    mode,
    scope: 'upgrade_existing_only',
    success_metric: 'gsc_clicks',
    gsc: {
      available: gsc.available,
      reason: gsc.available ? null : gsc.reason,
      site_url: gsc.siteUrl,
      window_days: windowDays,
      lag_days: lagDays,
      current_range: gsc.current.dateRange,
      prior_range: gsc.prior.dateRange,
      answer_pages_with_signal: candidates.length,
      total_clicks_current: totalClicks,
      total_clicks_prior: priorTotalClicks,
      total_clicks_delta: totalClicks - priorTotalClicks,
    },
    thresholds: THRESHOLDS,
    summary: {
      recommended_count: recommended.length,
      confident_count: confidentCandidates.length,
      auto_stage_count: autoStage.length,
      crisis_in_auto_stage: autoStage.filter((row) => row.crisis_sensitive).length,
      deferred_v2_query_gaps: deferredV2QueryGaps.length,
    },
    recommended,
    auto_stage: autoStage,
    deferred_v2_query_gaps: deferredV2QueryGaps.slice(0, 15),
    rewrite_batch: {
      slugs: recommended.map((row) => row.slug),
      auto_stage_slugs: autoStage.map((row) => row.slug),
    },
    api_citation: apiCitation,
  };
}

export function planMarkdown(plan) {
  const lines = [
    '# Weekly GSC content ops plan',
    '',
    `Generated: ${plan.generated_at}`,
    `Mode: **${plan.mode}** (scope: ${plan.scope})`,
    `Window: **${plan.gsc.window_days ?? 28} days** (lag: ${plan.gsc.lag_days ?? 3} days)`,
    `Primary success metric: **${plan.success_metric}**`,
    '',
    '## GSC status',
    '',
    `| Field | Value |`,
    `| --- | --- |`,
    `| Available | ${plan.gsc.available ? 'yes' : `no — ${plan.gsc.reason}`} |`,
    `| Current window | ${plan.gsc.current_range?.startDate ?? '—'} → ${plan.gsc.current_range?.endDate ?? '—'} |`,
    `| Prior window | ${plan.gsc.prior_range?.startDate ?? '—'} → ${plan.gsc.prior_range?.endDate ?? '—'} |`,
    `| Answer pages with signal | ${plan.gsc.answer_pages_with_signal} |`,
    `| Total clicks (current / prior / delta) | ${plan.gsc.total_clicks_current} / ${plan.gsc.total_clicks_prior} / ${plan.gsc.total_clicks_delta >= 0 ? '+' : ''}${plan.gsc.total_clicks_delta} |`,
    apiCitationMarkdownSection(plan.api_citation),
    '',
    '## Summary',
    '',
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Recommended rewrite candidates | ${plan.summary.recommended_count} |`,
    `| Confidence-qualified | ${plan.summary.confident_count} |`,
    `| Auto-stage eligible (${plan.mode}) | ${plan.summary.auto_stage_count} |`,
    '',
    '## Recommended batch (upgrade existing only)',
    '',
    '| # | Slug | Type | Clicks | Δ clicks | Impr. | Position | Confident | Score |',
    '| ---: | --- | --- | ---: | ---: | ---: | ---: | --- | ---: |',
  ];

  for (const [index, row] of plan.recommended.entries()) {
    lines.push(
      `| ${index + 1} | ${row.slug} | ${row.opportunity_type} | ${row.gsc.current.clicks} | ${row.gsc.delta.clicks >= 0 ? '+' : ''}${row.gsc.delta.clicks} | ${row.gsc.current.impressions} | ${row.gsc.current.position.toFixed(1)} | ${row.confidence.confident ? 'yes' : 'no'} | ${row.priority_score} |`
    );
  }

  if (plan.auto_stage.length) {
    lines.push('', '## Auto-stage queue', '', plan.auto_stage.map((row) => `- ${row.slug} (${row.opportunity_type})`).join('\n'));
  } else if (plan.mode === 'recommend') {
    lines.push('', '_Auto-staging is disabled for the first cycles. Approve slugs manually, then run the rewrite pipeline._');
  }

  if (plan.deferred_v2_query_gaps.length) {
    lines.push('', '## Deferred v2 — unmapped queries (not acted on in v1)', '');
    for (const gap of plan.deferred_v2_query_gaps.slice(0, 10)) {
      lines.push(`- "${gap.query}" — ${gap.impressions} impr., ${gap.clicks} clicks, pos ${gap.position.toFixed(1)}`);
    }
  }

  lines.push(
    '',
    '## Next steps',
    '',
    '1. Review recommended slugs above.',
    '2. Rewrite: `npm run content:rewrite-answers-claude -- --apply --slugs-file reports/gsc-weekly/rewrite-batch.json`',
    '3. Run QA + promote dry-run via `docs/content-governance.md`.',
    '4. Promote and deploy manually after review.',
    ''
  );

  return lines.join('\n');
}

export function planEmailHtml(plan) {
  const rows = plan.recommended
    .slice(0, 25)
    .map(
      (row, index) => `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;">${index + 1}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;"><code>${escapeHtml(row.slug)}</code></td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(row.opportunity_type)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">${row.gsc.current.clicks}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">${row.gsc.delta.clicks >= 0 ? '+' : ''}${row.gsc.delta.clicks}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">${row.gsc.current.impressions}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;">${row.confidence.confident ? 'yes' : 'no'}</td>
      </tr>`
    )
    .join('');

  const gscNote = plan.gsc.available
    ? `Current window ${plan.gsc.current_range.startDate} → ${plan.gsc.current_range.endDate}. Site clicks: ${plan.gsc.total_clicks_current} (${plan.gsc.total_clicks_delta >= 0 ? '+' : ''}${plan.gsc.total_clicks_delta} vs prior period).`
    : `<strong>GSC unavailable:</strong> ${escapeHtml(plan.gsc.reason)}. Configure GSC credentials on Vercel before trusting this queue.`;

  return `<!DOCTYPE html>
<html><body style="font-family:Georgia,serif;color:#111827;line-height:1.5;max-width:760px;">
  <h1 style="font-size:22px;margin-bottom:8px;">Deeper Global — weekly content ops</h1>
  <p style="color:#4b5563;margin-top:0;">${new Date(plan.generated_at).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })} UTC</p>
  <p>${gscNote}</p>
  ${apiCitationHtmlSection(plan.api_citation)}
  <p><strong>Mode:</strong> ${escapeHtml(plan.mode)} · <strong>Scope:</strong> upgrade existing answers only · <strong>Metric:</strong> GSC clicks</p>
  <p>Recommended: ${plan.summary.recommended_count} · Confidence-qualified: ${plan.summary.confident_count} · Auto-stage: ${plan.summary.auto_stage_count}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <thead>
      <tr style="background:#f9fafb;text-align:left;">
        <th style="padding:6px 8px;">#</th>
        <th style="padding:6px 8px;">Slug</th>
        <th style="padding:6px 8px;">Type</th>
        <th style="padding:6px 8px;text-align:right;">Clicks</th>
        <th style="padding:6px 8px;text-align:right;">Δ</th>
        <th style="padding:6px 8px;text-align:right;">Impr.</th>
        <th style="padding:6px 8px;">Conf.</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="margin-top:24px;color:#4b5563;">Approve slugs, then run the rewrite pipeline per <code>docs/content-governance.md</code>. Promote and deploy stay manual.</p>
</body></html>`;
}

export function planEmailText(plan) {
  return planMarkdown(plan);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
