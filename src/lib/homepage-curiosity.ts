import { displayCategory, getAnswerDisplayTitle, getAnswerSummary } from '@/lib/content';
import type { Question } from '@/lib/supabase';

const CURIOSITY_SIGNALS = [
  'anxious',
  'anxiety',
  'overthink',
  'replay',
  'shut down',
  'shutdown',
  'emotionally unavailable',
  'relationship',
  'panic',
  'freeze',
  'numb',
  'guilt',
  'lonely',
  'alone',
  'burnout',
  'depressed',
  'exhausted',
  'trauma',
  'attachment',
  'avoid',
  'people-pleasing',
  'self-worth',
  'control',
  'focus',
];

const PRIVATE_QUESTION_STARTERS = /^(why|how|what|is|can|could|do|does|should|am)\b/i;

export type CuriosityPickOptions = {
  maxPerCategory?: number;
  maxAdhdQuestions?: number;
};

function questionTimestamp(question: Question): number {
  const value = question.updated_at || question.created_at;
  return value ? Date.parse(value) : 0;
}

function questionText(question: Question) {
  return [
    getAnswerDisplayTitle(question),
    question.question,
    getAnswerSummary(question),
    displayCategory(question),
    question.primary_theme,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function curiosityScore(question: Question) {
  const title = getAnswerDisplayTitle(question);
  const text = questionText(question);
  let score = 0;

  if (title.includes('?')) score += 20;
  if (PRIVATE_QUESTION_STARTERS.test(title)) score += 18;
  if (/^(what are the|what is|what's the signs?|symptoms of)\b/i.test(title)) score -= 14;
  if (/adhd/i.test(text)) score -= 12;
  if (/therapy|therapist|cbt|dbt|modality|diagnosis/i.test(text)) score -= 8;

  for (const signal of CURIOSITY_SIGNALS) {
    if (text.includes(signal)) score += 12;
  }

  if (title.length >= 38 && title.length <= 82) score += 8;
  if (title.length > 96) score -= 10;
  if (question.reviewed_by) score += 6;

  return score;
}

export function pickCuriosityQuestions(
  source: Question[],
  limit: number,
  options: CuriosityPickOptions = {},
) {
  const maxPerCategory = options.maxPerCategory ?? 2;
  const maxAdhdQuestions = options.maxAdhdQuestions ?? 1;

  const ranked = [...source].sort((a, b) => {
    const scoreDelta = curiosityScore(b) - curiosityScore(a);
    if (scoreDelta !== 0) return scoreDelta;
    return questionTimestamp(b) - questionTimestamp(a);
  });

  const picked: Question[] = [];
  const categoryCounts = new Map<string, number>();
  let adhdCount = 0;

  for (const question of ranked) {
    if (picked.length >= limit) break;
    const text = questionText(question);
    const category = displayCategory(question);
    const categoryCount = categoryCounts.get(category) ?? 0;
    const isAdhd = /adhd|attention deficit|neurodivergence/.test(text);

    if (categoryCount >= maxPerCategory) continue;
    if (isAdhd && adhdCount >= maxAdhdQuestions) continue;

    picked.push(question);
    categoryCounts.set(category, categoryCount + 1);
    if (isAdhd) adhdCount += 1;
  }

  if (picked.length < limit) {
    for (const question of ranked) {
      if (picked.length >= limit) break;
      if (picked.some((item) => item.slug === question.slug)) continue;
      picked.push(question);
    }
  }

  return picked.length ? picked : source.slice(0, limit);
}
