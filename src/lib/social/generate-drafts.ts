import type { SocialPostFormat } from '../database.types';
import { getCategorySafetyTier, type CategorySafetyTier } from './category-safety';

export const SOCIAL_DRAFT_MODEL = 'claude-haiku-4-5-20251001';
export const RESTRICTED_CATEGORY_CRISIS_RESOURCE_LINE =
  "If you're in crisis, the 988 Suicide & Crisis Lifeline (call or text 988) is available 24/7.";
export const X_TCO_URL_LENGTH = 23;

export const SOCIAL_DRAFT_STRATEGIES = [
  'top_impressions',
  'newest',
  'editors_choice',
  'random_deep_cut',
] as const;

export type SocialDraftStrategy = (typeof SOCIAL_DRAFT_STRATEGIES)[number];

export type SocialQuestionSource = {
  id: string;
  question: string;
  slug: string;
  category: string | null;
  short_answer: string | null;
  key_takeaways: string[] | null;
};

export type GeneratedSocialDraft = {
  format: SocialPostFormat;
  body: string;
};

export type QuestionOnlyPath = 'templated' | 'model-smoothed' | 'raw-truncated';

export type GenerateDraftSetResult = {
  question: SocialQuestionSource;
  strategy: SocialDraftStrategy | 'manual_question_id';
  questionOnlyPath: QuestionOnlyPath;
  drafts: GeneratedSocialDraft[];
};

type DraftGenerationDeps = {
  getFeaturedQuestions?: (strategy: SocialDraftStrategy, limit: number) => Promise<Array<{ question_id: string }>>;
  getQuestionById: (questionId: string) => Promise<SocialQuestionSource | null>;
  createDraftPost?: (questionId: string, format: SocialPostFormat, body: string, scheduledFor: null) => Promise<unknown>;
  logger?: Pick<Console, 'log' | 'warn' | 'error'>;
};

type GenerateAndMaybeSaveOptions = {
  anthropicApiKey: string;
  questionId?: string;
  now?: Date;
  writeDrafts?: boolean;
};

const BRAND_SYSTEM_PROMPT = `You write social posts for Deeper Global, whose voice is "a practice that loves you back": warm, direct, human, and never clinical-sounding.

This is mental health content. Do not diagnose, imply diagnosis, use crisis-adjacent phrasing, minimize real distress, or make absolute claims. Avoid prescriptive advice. Avoid sounding like an ad. Emoji are optional and should be rare; use none unless one tasteful emoji fits naturally.

Respond with raw JSON only. Do not wrap the response in markdown code fences or backticks. Do not include any text before or after the JSON object.`;

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function truncateAtWord(value: string, maxLength: number) {
  const text = cleanText(value);
  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, Math.max(0, maxLength - 3)).trimEnd();
  const lastSpace = clipped.lastIndexOf(' ');
  const base = lastSpace > 80 ? clipped.slice(0, lastSpace) : clipped;
  return `${base.trimEnd()}...`;
}

export function selectSocialDraftStrategy(date = new Date()): SocialDraftStrategy {
  const dayIndex = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
  return SOCIAL_DRAFT_STRATEGIES[dayIndex % SOCIAL_DRAFT_STRATEGIES.length];
}

export function shouldSmoothQuestionOnly(question: string) {
  const text = cleanText(question);
  if (text.length > 200) return true;

  return /\b(do i have|am i clinically|clinically depressed|diagnos(?:e|is|ed|tic)|symptoms? of|ptsd|bipolar|suicid|self-harm|self harm|antidepressants?|psychiatric medication|hospitali[sz]ed)\b/i.test(
    text
  );
}

function extractTextFromAnthropicPayload(payload: unknown) {
  if (!payload || typeof payload !== 'object') return '';
  const content = (payload as { content?: unknown }).content;
  if (!Array.isArray(content)) return '';

  const textBlock = content.find(
    (block): block is { type: 'text'; text: string } =>
      Boolean(block) &&
      typeof block === 'object' &&
      (block as { type?: unknown }).type === 'text' &&
      typeof (block as { text?: unknown }).text === 'string'
  );

  return textBlock?.text ?? '';
}

async function callAnthropicText({
  apiKey,
  system,
  user,
  maxTokens,
  temperature,
}: {
  apiKey: string;
  system: string;
  user: string;
  maxTokens: number;
  temperature: number;
}) {
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
    throw new Error(`anthropic_request_failed:${response.status}:${await response.text()}`);
  }

  const text = extractTextFromAnthropicPayload(await response.json()).trim();
  if (!text) throw new Error('anthropic_empty_response');
  return text;
}

async function smoothQuestionOnly(question: string, apiKey: string) {
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

function buildSourceSummary(question: SocialQuestionSource) {
  const takeaways = Array.isArray(question.key_takeaways)
    ? question.key_takeaways.map(cleanText).filter(Boolean).slice(0, 4)
    : [];

  return {
    question: cleanText(question.question),
    category: cleanText(question.category),
    short_answer: cleanText(question.short_answer),
    key_takeaways: takeaways,
    url: `https://deeper.global/answers/${question.slug}`,
  };
}

function stripJsonFence(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function extractFirstJsonObject(text: string) {
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

    if (char === '{') {
      depth += 1;
      continue;
    }

    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return null;
}

function parseJsonDefensively(text: string) {
  const stripped = stripJsonFence(text);

  try {
    return JSON.parse(stripped);
  } catch (primaryError) {
    const extracted = extractFirstJsonObject(stripped);
    if (!extracted) throw primaryError;

    try {
      return JSON.parse(extracted);
    } catch {
      throw primaryError;
    }
  }
}

function getXWeightedLength(text: string) {
  return text.replace(/https?:\/\/\S+/g, 'x'.repeat(X_TCO_URL_LENGTH)).length;
}

/**
 * When the model generates a question_insight that's slightly over the limit,
 * try to recover by trimming the body text before the trailing URL link.
 * This handles the common case where the model overshoots by a few words.
 */
function tryTrimInsightToLimit(text: string, maxLength: number): string | null {
  // The post always ends with "Read more: <url>" — split on that pattern
  const linkMatch = text.match(/^([\s\S]+?)\s+(Read more:\s+https?:\/\/\S+)\s*$/i);
  if (!linkMatch) return null;

  const [, body, link] = linkMatch;
  const linkXLength = getXWeightedLength(link);
  const targetBodyLength = maxLength - linkXLength - 1; // -1 for the space separator

  if (targetBodyLength < 40) return null; // too short to be useful

  let trimmed = body.trimEnd();
  for (let i = 0; i < 20 && getXWeightedLength(trimmed) > targetBodyLength; i++) {
    const lastSpace = trimmed.lastIndexOf(' ');
    if (lastSpace < 10) break;
    trimmed = trimmed.slice(0, lastSpace);
  }
  trimmed = trimmed.replace(/[,;:—–\-]+$/, '').trimEnd();

  const candidate = `${trimmed} ${link}`;
  return getXWeightedLength(candidate) <= maxLength ? candidate : null;
}

function parseGeneratedJson(text: string, options: { requireReflection: boolean; questionInsightMaxLength: number }) {
  const parsed = parseJsonDefensively(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('anthropic_json_not_object');
  }

  let questionInsight = cleanText((parsed as { question_insight?: unknown }).question_insight);
  const reflection = cleanText((parsed as { reflection?: unknown }).reflection);

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

async function generateInsightAndReflection(
  question: SocialQuestionSource,
  questionOnlyText: string,
  apiKey: string,
  categorySafetyTier: CategorySafetyTier
) {
  const source = buildSourceSummary(question);
  const restricted = categorySafetyTier === 'restricted';
  const appendedCrisisLine = `\n\n${RESTRICTED_CATEGORY_CRISIS_RESOURCE_LINE}`;
  const questionInsightMaxLength = restricted ? 260 - appendedCrisisLine.length : 260;
  if (questionInsightMaxLength < 80) {
    throw new Error('restricted_question_insight_budget_too_small');
  }

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
        : 'a related open-ended reflective prompt inspired by the same theme/category, designed to invite replies rather than just reads. No link. Under 200 characters.'
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

export async function generateSocialDraftSet(
  question: SocialQuestionSource,
  anthropicApiKey: string,
  logger: Pick<Console, 'log' | 'warn' | 'error'> = console
): Promise<Pick<GenerateDraftSetResult, 'questionOnlyPath' | 'drafts'>> {
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

  let questionOnlyPath: QuestionOnlyPath = 'templated';
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

  let generated: Awaited<ReturnType<typeof generateInsightAndReflection>>;
  try {
    generated = await generateInsightAndReflection(question, questionOnly, anthropicApiKey, categorySafetyTier);
  } catch (error) {
    logger.error('social_generation_failed_no_drafts_written', {
      question_id: question.id,
      error,
    });
    throw error;
  }

  const drafts: GeneratedSocialDraft[] = [
    { format: 'question_only', body: questionOnly },
    { format: 'question_insight', body: generated.questionInsight },
  ];

  if (categorySafetyTier !== 'restricted') {
    drafts.push({ format: 'reflection', body: generated.reflection });
  }

  return {
    questionOnlyPath,
    drafts,
  };
}

export async function generateAndMaybeSaveSocialDrafts(
  deps: DraftGenerationDeps,
  options: GenerateAndMaybeSaveOptions
): Promise<GenerateDraftSetResult & { written: number }> {
  const logger = deps.logger ?? console;
  const selectedStrategy = selectSocialDraftStrategy(options.now);
  const strategy: SocialDraftStrategy | 'manual_question_id' = options.questionId ? 'manual_question_id' : selectedStrategy;
  let questionId = options.questionId;

  if (!questionId) {
    if (!deps.getFeaturedQuestions) throw new Error('getFeaturedQuestions dependency is required without questionId.');
    const featured = await deps.getFeaturedQuestions(selectedStrategy, 1);
    questionId = featured[0]?.question_id;
  }

  if (!questionId) {
    throw new Error(`No featured question found for strategy: ${strategy}`);
  }

  const question = await deps.getQuestionById(questionId);
  if (!question) throw new Error(`Question not found: ${questionId}`);

  const generated = await generateSocialDraftSet(question, options.anthropicApiKey, logger);
  let written = 0;

  if (options.writeDrafts) {
    if (!deps.createDraftPost) throw new Error('createDraftPost dependency is required when writeDrafts is true.');
    for (const draft of generated.drafts) {
      await deps.createDraftPost(question.id, draft.format, draft.body, null);
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
