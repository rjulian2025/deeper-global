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

function getXWeightedLength(text: string) {
  return text.replace(/https?:\/\/\S+/g, 'x'.repeat(X_TCO_URL_LENGTH)).length;
}

/**
 * The post body is the question itself plus the answer link, nothing more.
 * Explanation/insight only happens on deeper.global after the click-through;
 * the X post must never start to answer the question.
 */
function buildQuestionOnlyPost(
  question: SocialQuestionSource,
  questionOnlyText: string,
  categorySafetyTier: CategorySafetyTier
) {
  const url = `https://www.deeper.global/answers/${question.slug}/`;
  const restricted = categorySafetyTier === 'restricted';
  const linkBlock = `\n\n${url}`;
  const crisisBlock = restricted ? `\n\n${RESTRICTED_CATEGORY_CRISIS_RESOURCE_LINE}` : '';
  const maxQuestionLength = 280 - getXWeightedLength(linkBlock) - crisisBlock.length;

  if (maxQuestionLength < 40) {
    throw new Error('question_only_budget_too_small');
  }

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

  let questionOnlyBody: string;
  try {
    questionOnlyBody = buildQuestionOnlyPost(question, questionOnly, categorySafetyTier);
  } catch (error) {
    logger.error('social_generation_failed_no_drafts_written', {
      question_id: question.id,
      error,
    });
    throw error;
  }

  const drafts: GeneratedSocialDraft[] = [{ format: 'question_only', body: questionOnlyBody }];

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
