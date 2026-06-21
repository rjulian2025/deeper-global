import { answerPath, displayCategory, getAnswerDisplayTitle, getAnswerSummary, getPrimaryTheme, getRelatedThemeNames } from './content';
import { libraryDiscoveryScore } from './answers-library-order';
import { isAdhdHubSlug } from './adhd-hub';
import { isAiMentalHealthHubSlug, isAiMentalHealthSprintQuestion } from './ai-mental-health-hub';
import { getPilotEnrichmentBySlug, resolveSemanticEnrichmentSync } from './semantic-enrichment';
import { getRiskClass } from './taxonomy';
import { getThemeClusterForCategory, themeClusters, type ThemeClusterSlug } from './theme-directory';
import { getIsoWeek, weekRotationScore } from './week-rotation';
import type { Question } from './supabase';

export type UnexpectedOverlapLink = {
  title: string;
  href: string;
};

const CLUSTER_SHORT_NAMES: Record<ThemeClusterSlug, string> = {
  'anxiety-and-mood': 'Anxiety',
  'relationships-and-connection': 'Relationships',
  'family-and-parenting': 'Family',
  'identity-and-self-worth': 'Self-worth',
  'trauma-and-safety': 'Trauma',
  'work-and-purpose': 'Work stress',
  'spirituality-and-meaning': 'Meaning',
  'care-and-therapy': 'Therapy',
  'life-transitions-and-change': 'Life change',
};

const OVERLAP_TEMPLATES = [
  (a: string, b: string) => `${a} & ${b}, closer than you'd think`,
  (a: string, b: string) => `Why ${a} and ${b} overlap`,
  (a: string, b: string) => `${a} and ${b}, often together`,
  (a: string, b: string) => `${a} meets ${b} more than you'd guess`,
] as const;

const SIMILARITY_THRESHOLD = 0.07;
const TOP_PER_CLUSTER = 18;

/**
 * Cross-cluster overlap candidates from content-graph signals (entity overlap,
 * shared themes, lexical similarity). No pgvector at build time yet — when
 * embedding similarity is available, prefer that over this heuristic layer.
 *
 * TODO(review): spot-check weekly selections for clinically appropriate pairings
 * before promoting to production if the candidate pool changes materially.
 */
type OverlapCandidate = {
  bridge: Question;
  clusterA: ThemeClusterSlug;
  clusterB: ThemeClusterSlug;
  score: number;
  pairKey: string;
};

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(value: string): Set<string> {
  const stop = new Set(['what', 'when', 'where', 'with', 'that', 'this', 'from', 'have', 'your', 'about', 'feel', 'does']);
  return new Set(
    normalizeToken(value)
      .split(' ')
      .filter((token) => token.length > 3 && !stop.has(token))
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
}

function parseEntityList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      if (entry && typeof entry === 'object' && 'name' in entry) return String((entry as { name: unknown }).name);
      if (entry && typeof entry === 'object' && 'slug' in entry) return String((entry as { slug: unknown }).slug);
      return '';
    })
    .map((value) => normalizeToken(value).replace(/\s+/g, '-'))
    .filter(Boolean);
}

function getQuestionTokens(question: Question, pilotBySlug: Record<string, import('./semantic-enrichment').SemanticEnrichmentV1>): Set<string> {
  const enrichment = resolveSemanticEnrichmentSync(question, pilotBySlug);
  const searchTerms = enrichment
    ? [
        ...enrichment.possible_interpretations,
        ...enrichment.related_symptoms,
        ...enrichment.related_entities,
        ...enrichment.user_situations,
      ]
    : [];

  const text = [
    getAnswerDisplayTitle(question),
    getAnswerSummary(question),
    getPrimaryTheme(question),
    ...getRelatedThemeNames(question),
    ...searchTerms,
    ...parseEntityList(question.primary_entities),
    ...parseEntityList(question.related_entities),
  ].join(' ');

  return tokenize(text);
}

function getEntitySet(question: Question): Set<string> {
  return new Set([
    ...parseEntityList(question.primary_entities),
    ...parseEntityList(question.related_entities),
  ]);
}

function sharedThemeOverlap(a: Question, b: Question): number {
  const themesA = new Set(
    [getPrimaryTheme(a), ...getRelatedThemeNames(a), displayCategory(a)].map((value) => normalizeToken(value)).filter(Boolean)
  );
  let score = 0;
  for (const theme of [getPrimaryTheme(b), ...getRelatedThemeNames(b)]) {
    const normalized = normalizeToken(theme);
    if (normalized && themesA.has(normalized)) score += 1;
  }
  return score;
}

function isExcludedOverlapAnchor(question: Question): boolean {
  if (isAdhdHubSlug(question.slug)) return true;
  if (isAiMentalHealthHubSlug(question.slug)) return true;
  if (isAiMentalHealthSprintQuestion(question)) return true;

  const slug = question.slug.toLowerCase();
  const title = getAnswerDisplayTitle(question).toLowerCase();

  return (
    /\b(ai|chatbot|chat-bot|ai-companion|deepfake|virtual-companion)\b/.test(slug) ||
    /\b(ai chatbot|chatbot|ai companion|artificial intelligence|deepfake)\b/.test(title) ||
    /\badhd\b|executive dysfunction/.test(title)
  );
}

function questionMetaCluster(question: Question): ThemeClusterSlug {
  return getThemeClusterForCategory(displayCategory(question));
}

function pickBridgeQuestion(a: Question, b: Question, clusterA: ThemeClusterSlug, clusterB: ThemeClusterSlug): Question | null {
  const candidates = [a, b].filter((question) => !isExcludedOverlapAnchor(question));
  if (!candidates.length) return null;

  const inCluster = candidates.filter((question) => {
    const cluster = questionMetaCluster(question);
    return cluster === clusterA || cluster === clusterB;
  });

  const pool = inCluster.length ? inCluster : candidates;
  return pool.sort((left, right) => libraryDiscoveryScore(right) - libraryDiscoveryScore(left))[0] ?? null;
}

function isAppropriateOverlapPair(a: Question, b: Question): boolean {
  if (isExcludedOverlapAnchor(a) || isExcludedOverlapAnchor(b)) return false;
  if (getRiskClass(a) === 'crisis' || getRiskClass(b) === 'crisis') return false;

  const combined = `${getAnswerDisplayTitle(a)} ${getAnswerDisplayTitle(b)}`.toLowerCase();
  if (/suicide|self[\s-]?harm|overdose|sexual abuse|domestic violence|child abuse/.test(combined)) {
    return false;
  }

  const sensitiveCount = [a, b].filter((question) => getRiskClass(question) === 'sensitive').length;
  if (sensitiveCount === 1) return false;

  return true;
}

function computeCrossClusterSimilarity(
  a: Question,
  b: Question,
  pilotBySlug: Record<string, import('./semantic-enrichment').SemanticEnrichmentV1>
): number {
  const tokenScore = jaccardSimilarity(getQuestionTokens(a, pilotBySlug), getQuestionTokens(b, pilotBySlug));
  const entityA = getEntitySet(a);
  const entityB = getEntitySet(b);
  const sharedEntities = [...entityA].filter((entity) => entityB.has(entity)).length;
  const themeScore = sharedThemeOverlap(a, b);

  return tokenScore + sharedEntities * 0.08 + themeScore * 0.04;
}

function clusterLabel(slug: ThemeClusterSlug): string {
  return CLUSTER_SHORT_NAMES[slug] ?? themeClusters.find((cluster) => cluster.slug === slug)?.name ?? slug;
}

function formatOverlapTitle(clusterA: ThemeClusterSlug, clusterB: ThemeClusterSlug, templateIndex: number): string {
  const [left, right] = [clusterLabel(clusterA), clusterLabel(clusterB)].sort((a, b) => a.localeCompare(b));
  const template = OVERLAP_TEMPLATES[templateIndex % OVERLAP_TEMPLATES.length]!;
  return template(left, right);
}

function buildOverlapCandidates(questions: Question[]): OverlapCandidate[] {
  const pilotBySlug = getPilotEnrichmentBySlug();
  const byCluster = new Map<ThemeClusterSlug, Question[]>();

  for (const question of questions) {
    const cluster = getThemeClusterForCategory(displayCategory(question));
    const bucket = byCluster.get(cluster) ?? [];
    bucket.push(question);
    byCluster.set(cluster, bucket);
  }

  for (const bucket of byCluster.values()) {
    bucket.sort((a, b) => libraryDiscoveryScore(b) - libraryDiscoveryScore(a));
  }

  const candidates: OverlapCandidate[] = [];
  const clusterSlugs = [...byCluster.keys()];

  for (let i = 0; i < clusterSlugs.length; i += 1) {
    for (let j = i + 1; j < clusterSlugs.length; j += 1) {
      const clusterA = clusterSlugs[i]!;
      const clusterB = clusterSlugs[j]!;
      const poolA = (byCluster.get(clusterA) ?? []).slice(0, TOP_PER_CLUSTER);
      const poolB = (byCluster.get(clusterB) ?? []).slice(0, TOP_PER_CLUSTER);

      for (const questionA of poolA) {
        let best: { question: Question; score: number } | null = null;

        for (const questionB of poolB) {
          if (!isAppropriateOverlapPair(questionA, questionB)) continue;
          const score = computeCrossClusterSimilarity(questionA, questionB, pilotBySlug);
          if (score < SIMILARITY_THRESHOLD) continue;
          if (!best || score > best.score) {
            best = { question: questionB, score };
          }
        }

        if (!best) continue;

        const bridge = pickBridgeQuestion(questionA, best.question, clusterA, clusterB);
        if (!bridge) continue;

        const pairKey = [clusterA, clusterB].sort().join('|');

        candidates.push({
          bridge,
          clusterA,
          clusterB,
          score: best.score,
          pairKey,
        });
      }
    }
  }

  return candidates.sort((a, b) => b.score - a.score);
}

export function getUnexpectedOverlapLinks(questions: Question[], asOf: Date = new Date(), limit = 3): UnexpectedOverlapLink[] {
  const week = getIsoWeek(asOf);
  const candidates = buildOverlapCandidates(questions);
  const seenPairs = new Set<string>();
  const seenSlugs = new Set<string>();
  const links: UnexpectedOverlapLink[] = [];

  const rotated = [...candidates].sort(
    (a, b) => weekRotationScore(`${a.pairKey}:${a.bridge.slug}`, week) - weekRotationScore(`${b.pairKey}:${b.bridge.slug}`, week)
  );

  for (const candidate of rotated) {
    if (links.length >= limit) break;
    if (seenPairs.has(candidate.pairKey)) continue;
    if (seenSlugs.has(candidate.bridge.slug)) continue;

    const templateIndex = weekRotationScore(candidate.pairKey, week) % OVERLAP_TEMPLATES.length;

    links.push({
      title: formatOverlapTitle(candidate.clusterA, candidate.clusterB, templateIndex),
      href: answerPath(candidate.bridge.slug),
    });

    seenPairs.add(candidate.pairKey);
    seenSlugs.add(candidate.bridge.slug);
  }

  return links;
}
