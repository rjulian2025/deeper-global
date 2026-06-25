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

function stripJsonFence(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function extractFirstJsonObject(text) {
  const start = text.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = inString;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }

  return null;
}

function parseJsonDefensively(text) {
  const stripped = stripJsonFence(text);

  try {
    return JSON.parse(stripped);
  } catch (primaryError) {
    const extracted = extractFirstJsonObject(stripped);
    if (!extracted) throw primaryError;
    return JSON.parse(extracted);
  }
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

function buildSourceSummary(question) {
  const takeaways = Array.isArray(question.key_takeaways)
    ? question.key_takeaways.map(cleanText).filter(Boolean).slice(0, 4)
    : [];

  return {
    question: cleanText(question.question),
    category: cleanText(question.category),
    short_answer: cleanText(question.short_answer),
    key_takeaways: takeaways,
    url: `https://www.deeper.global/answers/${question.slug}/`,
  };
}

function tryTrimInsightToLimit(text, maxLength) {
  const linkMatch = text.match(/^([\s\S]+?)\s+(Read more:\s+https?:\/\/\S+)\s*$/i);
  if (!linkMatch) return null;

  const [, body, link] = linkMatch;
  const linkXLength = getXWeightedLength(link);
  const targetBodyLength = maxLength - linkXLength - 1;
  if (targetBodyLength < 40) return null;

  let trimmed = body.trimEnd();
  for (let i = 0; i < 20 && getXWeightedLength(trimmed) > targetBodyLength; i += 1) {
    const lastSpace = trimmed.lastIndexOf(' ');
    if (lastSpace < 10) break;
    trimmed = trimmed.slice(0, lastSpace);
  }
  trimmed = trimmed.replace(/[,;:-]+$/, '').trimEnd();

  const candidate = `${trimmed} ${link}`;
  return getXWeightedLength(candidate) <= maxLength ? candidate : null;
}

function parseGeneratedJson(text, options) {
  const parsed = parseJsonDefensively(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('anthropic_json_not_object');
  }

  let questionInsight = cleanText(parsed.question_insight);
  const reflection = cleanText(parsed.reflection);

  if (!questionInsight || (options.requireReflection && !reflection)) {
    throw new Error('anthropic_json_missing_fields');
  }

  const questionInsightXLength = getXWeightedLength(questionInsight);
  if (questionInsightXLength > options.questionInsightMaxLength) {
    const salvaged = tryTrimInsightToLimit(questionInsight, options.questionInsightMaxLength);
    if (salvaged) {
      questionInsight = salvaged;
    } else {
      throw new Error(`question_insight_too_long:${questionInsightXLength}`);
    }
  }

  if (reflection && reflection.length > 200) {
    throw new Error(`reflection_too_long:${reflection.length}`);
  }

  return { questionInsight, reflection };
}

async function generateInsightAndReflection(question, questionOnlyText, apiKey, categorySafetyTier) {
  const source = buildSourceSummary(question);
  const restricted = categorySafetyTier === 'restricted';
  const appendedCrisisLine = `\n\n${RESTRICTED_CATEGORY_CRISIS_RESOURCE_LINE}`;
  const questionInsightMaxLength = restricted ? 260 - appendedCrisisLine.length : 260;
  if (questionInsightMaxLength < 80) throw new Error('restricted_question_insight_budget_too_small');

  const text = await callAnthropicText({
    apiKey,
    system: BRAND_SYSTEM_PROMPT,
    maxTokens: 500,
    temperature: 0.5,
    user: `Create two X post drafts from this Deeper Global question record.

Rules:
- Return ONLY valid JSON with exactly these fields: "question_insight" and "reflection".
- Use this exact question text to open the "question_insight" post: ${JSON.stringify(questionOnlyText)}. Do not rephrase or shorten it.
- "question_insight": begin with that exact question text, then 1-2 sentences of genuine insight paraphrased from short_answer/key_takeaways, never copied verbatim, then exactly this link text and URL: Read more: ${source.url}
- "question_insight" must be under ${questionInsightMaxLength} X-weighted characters total: count ordinary text normally, but count the full URL as ${X_TCO_URL_LENGTH} characters because X shortens links with t.co${restricted ? `; the app will append this crisis-resource line afterward, so do not include it yourself: ${JSON.stringify(RESTRICTED_CATEGORY_CRISIS_RESOURCE_LINE)}` : ''}.
- "reflection": ${
      restricted
        ? 'return an empty string because reflection posts are disallowed for restricted categories.'
        : 'a related open-ended reflective prompt inspired by the same theme/category, designed to invite replies rather than just reads. Under 200 characters. Do not include a URL — a link will be appended automatically.'
    }

Source:
${JSON.stringify(source, null, 2)}`,
  });

  const generated = parseGeneratedJson(text, {
    requireReflection: !restricted,
    questionInsightMaxLength,
  });

  return {
    questionInsight: restricted ? `${generated.questionInsight}${appendedCrisisLine}` : generated.questionInsight,
    reflection: generated.reflection,
  };
}

async function generateSocialDraftSet(question, anthropicApiKey, logger = console) {
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

  const generated = await generateInsightAndReflection(question, questionOnly, anthropicApiKey, categorySafetyTier);
  const questionUrl = `https://www.deeper.global/answers/${question.slug}/`;

  const drafts = [
    { format: 'question_only', body: `${questionOnly}\n${questionUrl}` },
    { format: 'question_insight', body: generated.questionInsight },
  ];

  if (categorySafetyTier !== 'restricted') {
    drafts.push({ format: 'reflection', body: `${generated.reflection}\n${questionUrl}` });
  }

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

async function getFeaturedQuestions(strategy, limit) {
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

async function getQuestionForSocialPost(questionId) {
  const params = new URLSearchParams({
    select: 'id,question,slug,category,short_answer,key_takeaways',
    id: `eq.${questionId}`,
  });
  const rows = await supabaseRequest(`questions_master?${params.toString()}`);
  return Array.isArray(rows) ? rows[0] ?? null : null;
}

async function createDraftPost(questionId, format, body, scheduledFor) {
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

async function generateAndMaybeSaveSocialDrafts(options) {
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
