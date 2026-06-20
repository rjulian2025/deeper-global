import { getSemanticEnrichmentForApi, getSemanticSearchHaystack } from './semantic-enrichment.mjs';

const SITE_URL = 'https://www.deeper.global';
const INDEXABLE_REVIEW_STATUSES = new Set(['approved', 'published', 'reviewed']);
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 120;
const rateLimitBuckets = new Map();
const REVIEWER_PROFILES = {
  'david-k-gore-phd': {
    id: 'david-k-gore-phd',
    name: 'David K. Gore, PhD',
    specialty_label: 'Addiction & Recovery',
    profile_url: `${SITE_URL}/reviewers/david-k-gore-phd/`,
  },
  'kenneth-w-christian-phd': {
    id: 'kenneth-w-christian-phd',
    name: 'Kenneth W. Christian, PhD',
    specialty_label: 'Performance, Purpose & Self-Limiting Patterns',
    profile_url: `${SITE_URL}/reviewers/kenneth-w-christian-phd/`,
  },
};

const REVIEWER_ALIASES = {
  'david-k-gore-phd': 'david-k-gore-phd',
  'david k gore phd': 'david-k-gore-phd',
  'david k. gore phd': 'david-k-gore-phd',
  'david k. gore, phd': 'david-k-gore-phd',
  'kenneth-w-christian-phd': 'kenneth-w-christian-phd',
  'kenneth w christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian, phd': 'kenneth-w-christian-phd',
};

export const API_CONSTANTS = {
  site_url: SITE_URL,
  license: 'CC-BY-4.0',
  license_url: 'https://creativecommons.org/licenses/by/4.0/',
  citation_required: true,
  clinical_boundary:
    'Educational content only; not a substitute for professional diagnosis, treatment, or emergency support.',
  crisis_boundary:
    'For immediate self-harm, suicide, or danger concerns in the U.S., call or text 988 or contact emergency services.',
  attribution_template: 'Source: https://www.deeper.global/answers/{slug}/',
};

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function getStringList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanText(String(item ?? ''))).filter(Boolean);
}

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

export function getSupabaseReadConfig() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  return { supabaseUrl, supabaseKey };
}

export function shouldIndexQuestion(question) {
  const status = cleanText(question?.review_status).toLowerCase();
  if (!status) return true;
  return INDEXABLE_REVIEW_STATUSES.has(status);
}

function displayCategory(question) {
  return cleanText(question.category) || cleanText(question.raw_category) || 'General';
}

function getAnswerDisplayTitle(question) {
  return cleanText(question.improved_title) || cleanText(question.question);
}

function getAnswerSummary(question) {
  return cleanText(question.improved_summary) || cleanText(question.short_answer);
}

function getStructuredAnswerSections(question) {
  if (!Array.isArray(question.answer_sections)) return [];
  return question.answer_sections
    .map((section) => ({
      type: cleanText(section?.type) || null,
      heading: cleanText(section?.heading) || null,
      body: cleanText(section?.body),
    }))
    .filter((section) => section.body);
}

function hasStagingBody(question) {
  return Boolean(
    cleanText(question.staging_what_you_might_be_experiencing) &&
      cleanText(question.staging_what_can_help) &&
      cleanText(question.staging_when_to_reach_out)
  );
}

function getDisplayAnswerSections(question) {
  const liveSections = getStructuredAnswerSections(question);
  if (liveSections.length) return liveSections;

  if (!hasStagingBody(question)) return [];

  return [
    {
      type: 'what-you-might-be-experiencing',
      heading: 'What you might be experiencing',
      body: cleanText(question.staging_what_you_might_be_experiencing),
    },
    {
      type: 'what-can-help',
      heading: 'What can help',
      body: cleanText(question.staging_what_can_help),
    },
    {
      type: 'when-to-reach-out',
      heading: 'When to reach out',
      body: cleanText(question.staging_when_to_reach_out),
    },
  ];
}

function getDisplayKeyTakeaways(question) {
  const staged = getStringList(question.staging_key_takeaways);
  if (staged.length >= 5) return staged.slice(0, 5);
  return getStringList(question.key_takeaways).slice(0, 5);
}

function getDisplayLede(question) {
  return cleanText(question.staging_lede) || getAnswerSummary(question);
}

function getAnswerSchemaQuestion(question) {
  return cleanText(question.suggested_schema_question) || cleanText(question.question);
}

function getAnswerSchemaAnswer(question) {
  const stagedCanonical = cleanText(question.staging_canonical_answer);
  if (stagedCanonical) return stagedCanonical;
  if (cleanText(question.suggested_schema_answer)) return cleanText(question.suggested_schema_answer);

  const sections = getDisplayAnswerSections(question);
  if (sections.length) {
    return sections
      .map((section) => [section.heading, section.body].filter(Boolean).join('. '))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return cleanText(question.answer);
}

function getSourceRefs(question) {
  if (!Array.isArray(question.source_refs)) return [];

  return question.source_refs
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const title = cleanText(item.title);
      const url = cleanText(item.url);
      const publisher = cleanText(item.publisher);
      if (!title && !url) return null;
      return {
        title: title || url,
        url,
        publisher,
      };
    })
    .filter(Boolean);
}

function getReviewer(question) {
  const reviewerId = resolveReviewerId(question.reviewed_by);
  if (!reviewerId) {
    const label = cleanText(question.reviewed_by);
    if (!label) return null;
    if (label === 'codex-seo-review') {
      return {
        id: 'codex-seo-review',
        name: 'Deeper Global editorial review',
        specialty_label: 'Clarity, structure, and source alignment',
        profile_url: `${SITE_URL}/editorial-policy/`,
      };
    }
    return {
      id: label,
      name: label,
      specialty_label: null,
      profile_url: null,
    };
  }

  return REVIEWER_PROFILES[reviewerId] ?? null;
}

export function answerApiUrl(slug) {
  return `${SITE_URL}/api/v1/answers/${slug}`;
}

const LIST_SELECT_FIELDS = [
  'id',
  'slug',
  'question',
  'improved_title',
  'improved_summary',
  'short_answer',
  'category',
  'raw_category',
  'primary_theme',
  'review_status',
  'reviewed_by',
  'reviewed_at',
  'updated_at',
].join(',');

function slugifyTopic(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function matchesTopic(question, topicFilter) {
  const normalized = slugifyTopic(topicFilter);
  if (!normalized) return true;

  const candidates = [
    slugifyTopic(displayCategory(question)),
    slugifyTopic(question.primary_theme),
    slugifyTopic(question.category),
    slugifyTopic(question.raw_category),
  ].filter(Boolean);

  return candidates.some((candidate) => candidate === normalized || candidate.includes(normalized));
}

function matchesQuery(question, query) {
  const haystack = [
    getAnswerDisplayTitle(question),
    cleanText(question.question),
    getAnswerSummary(question),
    cleanText(question.primary_theme),
    displayCategory(question),
    getSemanticSearchHaystack(question),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export async function fetchQuestionBySlug(slug) {
  const { supabaseUrl, supabaseKey } = getSupabaseReadConfig();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('missing_supabase_env');
  }

  const params = new URLSearchParams({
    select: '*',
    slug: `eq.${slug}`,
    limit: '1',
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/questions_master?${params.toString()}`, {
    method: 'GET',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`supabase_fetch_failed:${response.status}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function fetchQuestionsPage({ supabaseUrl, supabaseKey }, from) {
  const params = new URLSearchParams({
    select: LIST_SELECT_FIELDS,
    order: 'slug.asc',
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/questions_master?${params.toString()}`, {
    method: 'GET',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: 'application/json',
      'Range-Unit': 'items',
      Range: `${from}-${from + 999}`,
    },
  });

  if (!response.ok) {
    throw new Error(`supabase_fetch_failed:${response.status}`);
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows : [];
}

export async function fetchIndexableAnswerSummaries() {
  const config = getSupabaseReadConfig();
  if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error('missing_supabase_env');
  }

  const rows = [];
  for (let from = 0; ; from += 1000) {
    const page = await fetchQuestionsPage(config, from);
    rows.push(...page.filter(shouldIndexQuestion));
    if (page.length < 1000) break;
  }

  return rows;
}

export function buildAnswerSummaryItem(question) {
  const citationUrl = `${SITE_URL}/answers/${question.slug}/`;

  return {
    id: question.id,
    slug: question.slug,
    canonical_url: citationUrl,
    api_url: answerApiUrl(question.slug),
    full_text_available: true,
    title: getAnswerDisplayTitle(question),
    original_question: cleanText(question.question),
    topic: displayCategory(question),
    primary_theme: cleanText(question.primary_theme) || displayCategory(question),
    summary: getAnswerSummary(question),
    review_status: cleanText(question.review_status) || null,
    reviewed_by: cleanText(question.reviewed_by) || null,
    reviewed_at: cleanText(question.reviewed_at) || null,
    updated_at: question.updated_at ?? null,
    license: API_CONSTANTS.license,
    license_url: API_CONSTANTS.license_url,
    citation_required: API_CONSTANTS.citation_required,
    attribution: API_CONSTANTS.attribution_template.replace('{slug}', question.slug),
  };
}

export function listAnswers({ rows, topic = '', q = '', limit = 25, cursor = 0 }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const offset = Math.max(Number(cursor) || 0, 0);
  const query = cleanText(q);
  const topicFilter = cleanText(topic);

  let filtered = rows;
  if (topicFilter) {
    filtered = filtered.filter((row) => matchesTopic(row, topicFilter));
  }
  if (query) {
    filtered = filtered.filter((row) => matchesQuery(row, query));
  }

  const page = filtered.slice(offset, offset + safeLimit).map(buildAnswerSummaryItem);
  const nextOffset = offset + safeLimit;
  const nextCursor = nextOffset < filtered.length ? String(nextOffset) : null;

  return {
    api_version: 'v1',
    count: page.length,
    total: filtered.length,
    total_count: filtered.length,
    limit: safeLimit,
    cursor: String(offset),
    offset,
    next_cursor: nextCursor,
    next_offset: nextCursor ? Number(nextCursor) : null,
    license: API_CONSTANTS.license,
    license_url: API_CONSTANTS.license_url,
    citation_required: API_CONSTANTS.citation_required,
    clinical_boundary: API_CONSTANTS.clinical_boundary,
    answers: page,
  };
}

export function checkRateLimit(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim();
  const key = ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const next = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitBuckets.set(key, next);
    return {
      limited: false,
      limit: RATE_LIMIT_MAX,
      remaining: RATE_LIMIT_MAX - 1,
      reset: Math.ceil(next.resetAt / 1000),
    };
  }

  bucket.count += 1;

  return {
    limited: bucket.count > RATE_LIMIT_MAX,
    limit: RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - bucket.count),
    reset: Math.ceil(bucket.resetAt / 1000),
  };
}

export function setRateLimitHeaders(res, rateLimit) {
  res.setHeader('X-RateLimit-Limit', String(rateLimit.limit));
  res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));
  res.setHeader('X-RateLimit-Reset', String(rateLimit.reset));
}

export function buildAnswerPayload(question) {
  const citationUrl = `${SITE_URL}/answers/${question.slug}/`;
  const reviewer = getReviewer(question);
  const semantic_enrichment_v1 = getSemanticEnrichmentForApi(question);

  const payload = {
    api_version: 'v1',
    id: question.id,
    slug: question.slug,
    canonical_url: citationUrl,
    api_url: answerApiUrl(question.slug),
    title: getAnswerDisplayTitle(question),
    original_question: cleanText(question.question),
    schema_question: getAnswerSchemaQuestion(question),
    schema_answer: getAnswerSchemaAnswer(question),
    topic: displayCategory(question),
    primary_theme: cleanText(question.primary_theme) || displayCategory(question),
    summary: getAnswerSummary(question),
    lede: getDisplayLede(question),
    key_takeaways: getDisplayKeyTakeaways(question),
    sections: getDisplayAnswerSections(question),
    care_note: cleanText(question.care_note) || null,
    review_status: cleanText(question.review_status) || null,
    reviewed_by: cleanText(question.reviewed_by) || null,
    reviewed_at: cleanText(question.reviewed_at) || null,
    reviewer,
    source_refs: getSourceRefs(question),
    content_prompt_version: cleanText(question.content_prompt_version) || null,
    content_enriched_at: question.content_enriched_at ?? null,
    created_at: question.created_at ?? null,
    updated_at: question.updated_at ?? null,
    indexable: shouldIndexQuestion(question),
    license: API_CONSTANTS.license,
    license_url: API_CONSTANTS.license_url,
    citation_required: API_CONSTANTS.citation_required,
    attribution: API_CONSTANTS.attribution_template.replace('{slug}', question.slug),
    clinical_boundary: API_CONSTANTS.clinical_boundary,
    crisis_boundary: API_CONSTANTS.crisis_boundary,
  };

  if (semantic_enrichment_v1) {
    payload.semantic_enrichment_v1 = semantic_enrichment_v1;
  }

  return payload;
}

export function jsonResponse(res, status, body, { cacheSeconds = 3600 } = {}) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Deeper-Attribution');
  res.setHeader('Cache-Control', `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`);
  return res.status(status).json(body);
}
