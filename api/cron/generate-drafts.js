/**
 * Generate draft social posts for editorial review.
 * Self-contained so Vercel can deploy this API route without bundling src/.
 *
 * Auth: Bearer CRON_SECRET
 */

const SOCIAL_DRAFT_MODEL = 'claude-haiku-4-5-20251001';
const RESTRICTED_CATEGORY_CRISIS_RESOURCE_LINE =
  "If you're in crisis, the 988 Suicide & Crisis Lifeline (call or text 988) is available 24/7.";
const X_TCO_URL_LENGTH = 23;

const SOCIAL_DRAFT_STRATEGIES = ['top_impressions', 'newest', 'editors_choice', 'random_deep_cut'];
const CATEGORY_SAFETY_TIERS = {
  'Crisis Support': 'excluded',
  'Addiction & Recovery': 'excluded',
  Depression: 'excluded',
  'Depression & Numbness': 'excluded',
  'Grief & Loss': 'excluded',
  'Relationship Abuse': 'excluded',
  'Spiritual Struggle / Existential Crisis': 'excluded',
  'Trauma & Grief': 'excluded',
  'Trauma & Triggers': 'excluded',
};

const BRAND_SYSTEM_PROMPT = `You write social posts for Deeper Global, whose voice is "a practice that loves you back": warm, direct, human, and never clinical-sounding.

This is mental health content. Do not diagnose, imply diagnosis, use crisis-adjacent phrasing, minimize real distress, or make absolute claims. Avoid prescriptive advice. Avoid sounding like an ad. Emoji are optional and should be rare; use none unless one tasteful emoji fits naturally.

Respond with raw JSON only. Do not wrap the response in markdown code fences or backticks. Do not include any text before or after the JSON object.`;

function firstValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function authDiagnostics(req) {
  const secret = (process.env.CRON_SECRET ?? '').trim();
  const auth = firstValue(req.headers.authorization ?? req.headers.Authorization);
  return {
    cronSecretExists: Boolean(secret),
    cronSecretTrimmedLength: secret.length,
    authorizationHeaderExists: Boolean(auth),
    authorizationStartsWithBearer: typeof auth === 'string' && auth.startsWith('Bearer '),
  };
}

function isAuthorized(req) {
  const secret = (process.env.CRON_SECRET ?? '').trim();
  if (!secret) return false;

  const authHeader = firstValue(req.headers.authorization ?? req.headers.Authorization);
  const headerSecret = firstValue(req.headers['x-cron-secret'] ?? req.headers['x-sync-secret']);
  const querySecret = firstValue(req.query?.secret);

  return authHeader === `Bearer ${secret}` || headerSecret === secret || querySecret === secret;
}

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function truncateAtWord(value, maxLength) {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, Math.max(0, maxLength - 3)).trimEnd();
  const lastSpace = clipped.lastIndexOf(' ');
  const base = lastSpace > 80 ? clipped.slice(0, lastSpace) : clipped;
  return `${base.trimEnd()}...`;
}

function getCategorySafetyTier(category) {
  if (!category) return 'standard';
  return CATEGORY_SAFETY_TIERS[category] ?? 'standard';
}

function getCategoriesBySafetyTier(tier) {
  return Object.entries(CATEGORY_SAFETY_TIERS)
    .filter(([, categoryTier]) => categoryTier === tier)
    .map(([category]) => category);
}

function toPostgrestInList(values) {
  return `(${values.map((value) => `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(',')})`;
}

function selectSocialDraftStrategy(date = new Date()) {
  const dayIndex = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
  return SOCIAL_DRAFT_STRATEGIES[dayIndex % SOCIAL_DRAFT_STRATEGIES.length];
}

function shouldSmoothQuestionOnly(question) {
  const text = cleanText(question);
  if (text.length > 200) return true;

  return /\b(do i have|am i clinically|clinically depressed|diagnos(?:e|is|ed|tic)|symptoms? of|ptsd|bipolar|suicid|self-harm|self harm|antidepressants?|psychiatric medication|hospitali[sz]ed)\b/i.test(
    text
  );
}

function getXWeightedLength(text) {
  return text.replace(/https?:\/\/\S+/g, 'x'.repeat(X_TCO_URL_LENGTH)).length;
}

function extractTextFromAnthropicPayload(payload) {
  const content = payload?.content;
  if (!Array.isArray(content)) return '';
  const textBlock = content.find((block) => block?.type === 'text' && typeof block.text === 'string');
  return textBlock?.text ?? '';
}

async function callAnthropicText({ apiKey, system, user, maxTokens, temperature }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: SOCIAL_DRAFT_MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  if (!response.ok) {
    throw new Error(`anthropic_request_failed:${response.status}:${(await response.text()).slice(0, 600)}`);
  }

  const text = extractTextFromAnthropicPayload(await response.json()).trim();
  if (!text) throw new Error('anthropic_empty_response');
  return text;
}

async function smoothQuestionOnly(question, apiKey) {
  const text = await callAnthropicText({
    apiKey,
    system: BRAND_SYSTEM_PROMPT,
    maxTokens: 120,
    temperature: 0.2,
    user: `Tighten this question into a standalone X post under 200 characters. Keep it as a question. Preserve the meaning, but make it warm and non-clinical. Return only the question text, no quotes.

Question: ${question}`,
  });

  return truncateAtWord(text.replace(/^["']|["']$/g, ''), 200);
}

/**
 * The post body is the question itself plus the answer link, nothing more.
 * Explanation/insight only happens on deeper.global after the click-through;
 * the X post must never start to answer the question.
 */
function buildQuestionOnlyPost(question, questionOnlyText, categorySafetyTier) {
  const url = `https://www.deeper.global/answers/${question.slug}/`;
  const restricted = categorySafetyTier === 'restricted';
  const linkBlock = `\n\n${url}`;
  const crisisBlock = restricted ? `\n\n${RESTRICTED_CATEGORY_CRISIS_RESOURCE_LINE}` : '';
  const maxQuestionLength = 280 - getXWeightedLength(linkBlock) - crisisBlock.length;

  if (maxQuestionLength < 40) throw new Error('question_only_budget_too_small');

  const questionText =
    getXWeightedLength(questionOnlyText) > maxQuestionLength
      ? truncateAtWord(questionOnlyText, maxQuestionLength)
      : questionOnlyText;

  const body = `${questionText}${linkBlock}${crisisBlock}`;
  if (getXWeightedLength(body) > 280) {
    throw new Error(`question_only_post_too_long:${getXWeightedLength(body)}`);
  }

  return body;
}

export async function generateSocialDraftSet(question, anthropicApiKey, logger = console) {
  const rawQuestion = cleanText(question.question);
  if (!rawQuestion) throw new Error('question_text_required');
  const categorySafetyTier = getCategorySafetyTier(question.category);

  if (categorySafetyTier === 'excluded') {
    logger.error('social_generation_refused_excluded_category', {
      question_id: question.id,
      category: question.category,
    });
    throw new Error(`social_category_excluded:${question.category ?? 'unknown'}`);
  }

  let questionOnlyPath = 'templated';
  let questionOnly = rawQuestion;

  if (shouldSmoothQuestionOnly(rawQuestion)) {
    try {
      questionOnly = await smoothQuestionOnly(rawQuestion, anthropicApiKey);
      questionOnlyPath = 'model-smoothed';
    } catch (error) {
      logger.warn('social_question_only_smoothing_failed', error);
      questionOnly = truncateAtWord(rawQuestion, 200);
      questionOnlyPath = 'raw-truncated';
    }
  }

  logger.log('social_question_only_path', {
    question_id: question.id,
    path: questionOnlyPath,
  });

  let questionOnlyBody;
  try {
    questionOnlyBody = buildQuestionOnlyPost(question, questionOnly, categorySafetyTier);
  } catch (error) {
    logger.error('social_generation_failed_no_drafts_written', {
      question_id: question.id,
      error,
    });
    throw error;
  }

  const drafts = [{ format: 'question_only', body: questionOnlyBody }];

  return { questionOnlyPath, drafts };
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return { url, key };
}

async function supabaseRequest(path, options = {}) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer ?? 'return=representation',
      ...(options.headers ?? {}),
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase error: ${JSON.stringify(data).slice(0, 600)}`);
  return data;
}

export async function getFeaturedQuestions(strategy, limit) {
  const params = new URLSearchParams({
    select: '*',
    limit: String(Math.max(1, Math.min(limit, 100))),
  });
  const excludedCategories = getCategoriesBySafetyTier('excluded');
  if (excludedCategories.length > 0) params.set('category', `not.in.${toPostgrestInList(excludedCategories)}`);

  if (strategy === 'top_impressions') {
    params.set('order', 'impressions.desc.nullslast');
  } else if (strategy === 'newest') {
    params.set('order', 'publish_date.desc.nullslast');
  }

  return supabaseRequest(`featured_questions?${params.toString()}`);
}

export async function getQuestionForSocialPost(questionId) {
  const params = new URLSearchParams({
    select: 'id,question,slug,category,short_answer,key_takeaways',
    id: `eq.${questionId}`,
  });
  const rows = await supabaseRequest(`questions_master?${params.toString()}`);
  return Array.isArray(rows) ? rows[0] ?? null : null;
}

export async function createDraftPost(questionId, format, body, scheduledFor) {
  const rows = await supabaseRequest('social_posts', {
    method: 'POST',
    body: JSON.stringify({
      question_id: questionId,
      format,
      body,
      status: 'draft',
      scheduled_for: scheduledFor,
    }),
  });
  return Array.isArray(rows) ? rows[0] ?? null : rows;
}

export async function generateAndMaybeSaveSocialDrafts(options) {
  const selectedStrategy = selectSocialDraftStrategy(options.now);
  const strategy = options.questionId ? 'manual_question_id' : selectedStrategy;
  let questionId = options.questionId;

  if (!questionId) {
    const featured = await getFeaturedQuestions(selectedStrategy, 1);
    questionId = featured[0]?.question_id;
  }

  if (!questionId) throw new Error(`No featured question found for strategy: ${strategy}`);

  const question = await getQuestionForSocialPost(questionId);
  if (!question) throw new Error(`Question not found: ${questionId}`);

  const generated = await generateSocialDraftSet(question, options.anthropicApiKey, console);
  let written = 0;

  if (options.writeDrafts) {
    for (const draft of generated.drafts) {
      await createDraftPost(question.id, draft.format, draft.body, null);
      written += 1;
    }
  }

  return {
    question,
    strategy,
    questionOnlyPath: generated.questionOnlyPath,
    drafts: generated.drafts,
    written,
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const auth = authDiagnostics(req);

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!isAuthorized(req)) {
    console.warn('generate_social_drafts_unauthorized', auth);
    return res.status(401).json({ error: 'unauthorized', auth });
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!anthropicApiKey) {
    return res.status(500).json({ error: 'missing_anthropic_api_key' });
  }

  const dryRun = req.query?.dryRun === '1' || req.query?.dryRun === 'true';
  const questionId = cleanText(firstValue(req.query?.question_id));

  try {
    const result = await generateAndMaybeSaveSocialDrafts({
      anthropicApiKey,
      questionId: questionId || undefined,
      writeDrafts: !dryRun,
    });

    return res.status(200).json({
      ok: true,
      dryRun,
      strategy: result.strategy,
      question_id: result.question.id,
      slug: result.question.slug,
      question_only_path: result.questionOnlyPath,
      drafts_generated: result.drafts.length,
      drafts_written: result.written,
      draft_formats: result.drafts.map((draft) => draft.format),
    });
  } catch (error) {
    console.error('generate_social_drafts_failed', error);
    return res.status(500).json({
      error: 'generate_social_drafts_failed',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
