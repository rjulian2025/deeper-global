const API_EVENT_NAMES = ['api_answer_fetched', 'api_answers_listed'];

function cleanText(value, maxLength = 160) {
  if (typeof value !== 'string') return '';
  const normalized = value.replace(/\s+/g, ' ').trim();
  return maxLength ? normalized.slice(0, maxLength) : normalized;
}

function isoDateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

function incrementCount(map, key, amount = 1) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + amount);
}

function topEntries(map, limit = 10) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

export async function fetchApiCitationStats(supabaseClient, { windowDays = 7 } = {}) {
  const sinceIso = isoDateDaysAgo(windowDays);

  const { data, error } = await supabaseClient
    .from('intent_events')
    .select('event_name, answer_slug, occurred_at, referrer_domain, metadata')
    .in('event_name', API_EVENT_NAMES)
    .gte('occurred_at', sinceIso)
    .order('occurred_at', { ascending: false })
    .limit(5000);

  if (error) {
    return {
      available: false,
      reason: error.message,
      window_days: windowDays,
      since: sinceIso,
      total_events: 0,
      answer_fetches: 0,
      list_requests: 0,
      unique_answers_fetched: 0,
      top_answer_slugs: [],
      top_referrers: [],
      top_attributions: [],
      note: 'API citation telemetry unavailable. Apply docs/supabase-api-citation-events.sql if public API events are not recording.',
    };
  }

  const rows = data ?? [];
  const slugCounts = new Map();
  const referrerCounts = new Map();
  const attributionCounts = new Map();
  let answerFetches = 0;
  let listRequests = 0;

  for (const row of rows) {
    if (row.event_name === 'api_answer_fetched') {
      answerFetches += 1;
      incrementCount(slugCounts, cleanText(row.answer_slug));
    } else if (row.event_name === 'api_answers_listed') {
      listRequests += 1;
    }

    incrementCount(referrerCounts, cleanText(row.referrer_domain, 120));
    const metadata = row.metadata && typeof row.metadata === 'object' ? row.metadata : {};
    incrementCount(attributionCounts, cleanText(metadata.attribution, 120));
    incrementCount(attributionCounts, cleanText(metadata.search_query, 120));
  }

  return {
    available: true,
    reason: null,
    window_days: windowDays,
    since: sinceIso,
    total_events: rows.length,
    answer_fetches: answerFetches,
    list_requests: listRequests,
    unique_answers_fetched: slugCounts.size,
    top_answer_slugs: topEntries(slugCounts, 10),
    top_referrers: topEntries(referrerCounts, 8).filter((item) => item.key),
    top_attributions: topEntries(attributionCounts, 8).filter((item) => item.key),
    note:
      rows.length === 0
        ? 'No API citation events yet. If Vercel logs show api_citation_access entries, apply docs/supabase-api-citation-events.sql and confirm the report uses SUPABASE_SERVICE_ROLE_KEY.'
        : null,
  };
}

export function apiCitationMarkdownSection(apiCitation) {
  if (!apiCitation) return '';

  const lines = [
    '',
    '## Public API citation usage',
    '',
    `| Field | Value |`,
    `| --- | --- |`,
    `| Available | ${apiCitation.available ? 'yes' : `no (${apiCitation.reason})`} |`,
    `| Window | last ${apiCitation.window_days} days (since ${apiCitation.since?.slice(0, 10) ?? 'n/a'}) |`,
    `| Total API events | ${apiCitation.total_events} |`,
    `| Answer fetches | ${apiCitation.answer_fetches} |`,
    `| List/search requests | ${apiCitation.list_requests} |`,
    `| Unique answers fetched | ${apiCitation.unique_answers_fetched} |`,
  ];

  if (apiCitation.top_answer_slugs?.length) {
    lines.push('', '### Top fetched answer slugs', '');
    for (const item of apiCitation.top_answer_slugs) {
      lines.push(`- ${item.key}: ${item.count}`);
    }
  }

  if (apiCitation.top_attributions?.length) {
    lines.push('', '### Top API attributions / searches', '');
    for (const item of apiCitation.top_attributions) {
      lines.push(`- ${item.key}: ${item.count}`);
    }
  }

  if (apiCitation.note) {
    lines.push('', `_${apiCitation.note}_`);
  }

  return lines.join('\n');
}

export function apiCitationTextLines(apiCitation) {
  if (!apiCitation) return [];

  if (!apiCitation.available) {
    return [
      'Public API citation usage:',
      `- API telemetry unavailable: ${apiCitation.reason}`,
      `- ${apiCitation.note ?? 'Apply docs/supabase-api-citation-events.sql to record API events.'}`,
    ];
  }

  return [
    'Public API citation usage:',
    `- Window: last ${apiCitation.window_days} days (since ${apiCitation.since?.slice(0, 10) ?? 'n/a'})`,
    `- Total API events: ${apiCitation.total_events}`,
    `- Answer fetches: ${apiCitation.answer_fetches}`,
    `- List/search requests: ${apiCitation.list_requests}`,
    `- Unique answers fetched: ${apiCitation.unique_answers_fetched}`,
    ...(apiCitation.top_answer_slugs ?? []).map((item) => `- Top slug: ${item.key}: ${item.count}`),
    ...(apiCitation.note ? [`- Note: ${apiCitation.note}`] : []),
  ];
}

export function apiCitationHtmlSection(apiCitation) {
  if (!apiCitation) return '';

  const status = apiCitation.available
    ? `Last ${apiCitation.window_days} days: <strong>${apiCitation.total_events}</strong> API events (${apiCitation.answer_fetches} answer fetches, ${apiCitation.list_requests} list/search requests, ${apiCitation.unique_answers_fetched} unique answers).`
    : `<strong>API telemetry unavailable:</strong> ${escapeHtml(apiCitation.reason)}`;

  const topSlugs = (apiCitation.top_answer_slugs ?? [])
    .slice(0, 5)
    .map((item) => `<li><code>${escapeHtml(item.key)}</code>: ${item.count}</li>`)
    .join('');

  const note = apiCitation.note ? `<p style="color:#6b7280;font-size:13px;">${escapeHtml(apiCitation.note)}</p>` : '';

  return `<h2 style="font-size:18px;margin-top:28px;">Public API citation usage</h2>
  <p>${status}</p>
  ${topSlugs ? `<p><strong>Top fetched slugs</strong></p><ul>${topSlugs}</ul>` : ''}
  ${note}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
