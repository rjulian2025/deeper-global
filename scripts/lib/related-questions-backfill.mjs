import { cleanText, isV2Answer } from './content-enrichment-utils.mjs';
import { REDIRECT_SOURCE_SLUGS as REDIRECT_SOURCE_SLUGS_ARRAY } from './redirect-sources.mjs';

function displayCategory(question) {
  return cleanText(question.category) || cleanText(question.raw_category) || 'General';
}
const REDIRECT_SOURCE_SLUGS = new Set(REDIRECT_SOURCE_SLUGS_ARRAY);

function normalizeMatchText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isPublishable(question) {
  const status = cleanText(question.review_status).toLowerCase();
  if (status === 'retired_duplicate') return false;
  if (REDIRECT_SOURCE_SLUGS.has(question.slug)) return false;
  return !status || ['approved', 'published', 'reviewed'].includes(status);
}

function buildTextIndex(questions) {
  const index = new Map();
  for (const q of questions) {
    const add = (key) => {
      if (key && !index.has(key)) index.set(key, q);
    };
    add(normalizeMatchText(q.question));
    if (cleanText(q.improved_title)) add(normalizeMatchText(q.improved_title));
  }
  return index;
}

export function resolveRelatedTexts(question, textIndex) {
  const existing = Array.isArray(question.related_questions) ? question.related_questions : [];
  const resolvable = [];
  const unresolved = [];
  for (const text of existing) {
    const match = textIndex.get(normalizeMatchText(text));
    if (match) resolvable.push({ slug: match.slug, question: match.question });
    else unresolved.push(text);
  }
  return { resolvable, unresolved };
}

function buildThemeSet(question) {
  const themes = [cleanText(question.primary_theme), ...(Array.isArray(question.related_themes) ? question.related_themes : [])]
    .map((t) => normalizeMatchText(t))
    .filter(Boolean);
  themes.push(normalizeMatchText(displayCategory(question)));
  return new Set(themes);
}

function sharedThemeScore(targetSet, candidate) {
  const candThemes = buildThemeSet(candidate);
  let score = 0;
  for (const t of candThemes) {
    if (targetSet.has(t)) score += 3;
  }
  return score;
}

function clusterFor(question) {
  const theme = normalizeMatchText(question.primary_theme);
  const cat = normalizeMatchText(question.category || question.raw_category);
  if (cat.includes('neurodivergence') || theme.includes('adhd')) return 'ADHD';
  if (cat.includes('anxiety') || theme.includes('anxiety')) return 'ANXIETY';
  if (cat.includes('ai') || theme.includes('ai')) return 'AI';
  if (theme === normalizeMatchText('Imago Relationship Therapy')) return 'IMAGO';
  return null;
}

function sameHubBonus(a, b) {
  const ca = clusterFor(a);
  const cb = clusterFor(b);
  return ca && cb && ca === cb ? 8 : 0;
}

export function scoreCandidates(target, candidates) {
  const targetThemes = buildThemeSet(target);
  const targetCategory = displayCategory(target);
  const targetSlug = target.slug;
  return candidates
    .filter((c) => c.slug !== targetSlug)
    .map((c) => {
      let score = 0;
      if (displayCategory(c) === targetCategory) score += 2;
      score += sharedThemeScore(targetThemes, c);
      score += sameHubBonus({ slug: targetSlug, category: target.category, raw_category: target.raw_category, primary_theme: target.primary_theme }, c);
      return { candidate: c, score };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.slug.localeCompare(b.candidate.slug));
}

export function buildBackfillPlan(questions) {
  const publishable = questions.filter(isPublishable);
  const textIndex = buildTextIndex(publishable);
  const bySlug = new Map(questions.map((q) => [q.slug, q]));
  const plan = {};

  for (const q of publishable) {
    if (!isV2Answer(q)) continue;
    const existing = Array.isArray(q.related_questions) ? q.related_questions : [];
    if (existing.length >= 5) continue;

    const { resolvable, unresolved } = resolveRelatedTexts(q, textIndex);
    const seen = new Set(resolvable.map((r) => r.slug));
    const pool = publishable.filter((p) => p.slug !== q.slug && !seen.has(p.slug) && !REDIRECT_SOURCE_SLUGS.has(p.slug));
    const scored = scoreCandidates(q, pool);
    const needed = Math.max(0, 5 - resolvable.length);
    const additions = scored.slice(0, needed).map(({ candidate, score }) => ({
      slug: candidate.slug,
      question: candidate.question,
      score,
    }));
    if (resolvable.length + additions.length < 5) continue;
    plan[q.slug] = {
      before: existing.slice(0, 5),
      dropped_unresolvable: unresolved,
      added: additions,
      after: [...resolvable.map((r) => r.question), ...additions.map((a) => a.question)].slice(0, 5),
      category: displayCategory(q),
    };
  }

  return plan;
}

