const SITE_URL = 'https://www.deeper.global';
const PAGE_SIZE = 1000;
const MIN_ANSWER_COUNT = 950;
const CLINICAL_BOUNDARY =
  'Educational content only; not a substitute for diagnosis, treatment, therapy, crisis support, or emergency care.';

function getSupabaseConfig() {
  const supabaseUrl =
    process.env.SUPABASE_URL ??
    process.env.PUBLIC_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { supabaseUrl, supabaseKey };
}

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function stripHtml(value) {
  return cleanText(
    String(value ?? '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  );
}

function truncate(value, maxLength = 600) {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

function displayCategory(row) {
  return row.category || row.raw_category || 'General';
}

function displayTitle(row) {
  return cleanText(row.improved_title) || row.question;
}

function summary(row) {
  return cleanText(row.improved_summary) || row.short_answer || '';
}

function answerPlainText(row) {
  if (Array.isArray(row.answer_sections) && row.answer_sections.length) {
    return row.answer_sections
      .map((section) => [section.heading, section.body].filter(Boolean).join('. '))
      .join(' ');
  }

  return stripHtml(row.answer);
}

function dateModified(row) {
  return row.updated_at || row.content_enriched_at || row.reviewed_at || row.created_at || null;
}

function sourceRefs(row) {
  return Array.isArray(row.source_refs) ? row.source_refs : [];
}

function stringList(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        return item.question ?? item.theme ?? item.name ?? item.text ?? item.title ?? '';
      }

      return '';
    })
    .map(cleanText)
    .filter(Boolean);
}

function riskClass(row) {
  const text = `${row.question ?? ''} ${row.improved_title ?? ''} ${row.short_answer ?? ''} ${row.triage ?? ''}`.toLowerCase();
  if (/suicide|suicidal|self-harm|self harm|kill myself|overdose|crisis|danger|unsafe/.test(text)) {
    return 'crisis-sensitive';
  }
  if (/diagnos|medication|trauma|panic|self harm|addiction|abuse|therapy|treatment/.test(text)) {
    return 'higher-care-navigation';
  }
  return 'educational';
}

function reviewTier(row) {
  if (row.reviewed_by && row.review_status) return 'reviewed';
  if (row.source_refs && Array.isArray(row.source_refs) && row.source_refs.length) return 'sourced';
  return 'standard';
}

function upgradePriority(row) {
  const reasons = [];
  let score = 0;

  if (riskClass(row) !== 'educational') {
    score += 3;
    reasons.push('higher_risk_topic');
  }
  if (!row.reviewed_by) {
    score += 2;
    reasons.push('reviewer_missing');
  }
  if (!Array.isArray(row.source_refs) || row.source_refs.length === 0) {
    score += 1;
    reasons.push('source_refs_missing');
  }

  return { score, reasons };
}

export function serializeAnswerRecord(row) {
  const priority = upgradePriority(row);

  return {
    id: row.id,
    slug: row.slug,
    canonical_url: `${SITE_URL}/answers/${row.slug}/`,
    api_url: `${SITE_URL}/api/v1/answers/${row.slug}`,
    title: displayTitle(row),
    original_question: row.question,
    topic: displayCategory(row),
    summary: summary(row),
    extract: truncate(answerPlainText(row), 600),
    risk_class: riskClass(row),
    review_tier: reviewTier(row),
    review_status: row.review_status ?? null,
    reviewed_by: row.reviewed_by ?? null,
    reviewed_at: row.reviewed_at ?? null,
    updated_at: dateModified(row),
    source_refs: sourceRefs(row),
    upgrade_priority: priority,
  };
}

export function serializeAnswerDetail(row) {
  return {
    ...serializeAnswerRecord(row),
    key_takeaways: stringList(row.key_takeaways ?? row.staging_key_takeaways),
    care_note:
      cleanText(row.care_note) ||
      'If this is interfering with daily life, relationships, work, sleep, or your sense of safety, consider talking with a licensed mental health professional.',
    answer_sections: Array.isArray(row.answer_sections) ? row.answer_sections : [],
    follow_up_questions: stringList(row.related_questions),
    clinical_boundary: CLINICAL_BOUNDARY,
  };
}

export async function fetchQuestions() {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('missing_supabase_config');
  }

  const rows = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const to = from + PAGE_SIZE - 1;
    const params = new URLSearchParams({
      select: '*',
      order: 'created_at.desc',
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/questions_master?${params.toString()}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json',
        Range: `${from}-${to}`,
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const page = await response.json();
    rows.push(...(Array.isArray(page) ? page : []));

    if (!Array.isArray(page) || page.length < PAGE_SIZE) break;
  }

  if (rows.length < MIN_ANSWER_COUNT) {
    throw new Error(`answer_count_floor_failed:${rows.length}`);
  }

  return rows;
}

export async function fetchQuestionBySlug(slug) {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('missing_supabase_config');
  }

  const params = new URLSearchParams({
    select: '*',
    slug: `eq.${slug}`,
    limit: '1',
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/questions_master?${params.toString()}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows[0] ?? null : null;
}

export function answerIndexResponse(rows) {
  const answers = rows.map(serializeAnswerRecord);

  return {
    name: 'Deeper Global Answer Index',
    base_url: SITE_URL,
    generated_at: new Date().toISOString(),
    count: answers.length,
    clinical_boundary: CLINICAL_BOUNDARY,
    answers,
  };
}
