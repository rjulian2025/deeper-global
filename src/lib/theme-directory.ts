import { displayCategory, slugify, type EntitySummary } from './content';
import { getTrendingQuestions } from './engagement';
import { getCanonicalTopic, normalizeTopicKey } from './taxonomy';
import type { Question } from './supabase';

/**
 * Theme directory clustering
 *
 * Each raw Supabase category (theme) maps to exactly ONE meta-cluster via its
 * canonical topic (`getCanonicalTopic`). Themes are never duplicated across
 * clusters — when a name could fit multiple buckets (e.g. "Trauma & Grief"),
 * the canonical mapping in `taxonomy.ts` is the source of truth.
 *
 * Optional per-theme descriptions: set `themeDescriptionsBySlug` when a theme has
 * editorial copy distinct from auto-generated category summaries. The directory
 * renders no description line when none is defined (no boilerplate placeholders).
 */

export type ThemeClusterSlug =
  | 'anxiety-and-mood'
  | 'relationships-and-connection'
  | 'family-and-parenting'
  | 'identity-and-self-worth'
  | 'trauma-and-safety'
  | 'work-and-purpose'
  | 'spirituality-and-meaning'
  | 'care-and-therapy'
  | 'life-transitions-and-change';

export type ThemeClusterDefinition = {
  slug: ThemeClusterSlug;
  name: string;
  order: number;
};

export const themeClusters: ThemeClusterDefinition[] = [
  { slug: 'anxiety-and-mood', name: 'Anxiety & mood', order: 1 },
  { slug: 'relationships-and-connection', name: 'Relationships & connection', order: 2 },
  { slug: 'family-and-parenting', name: 'Family & parenting', order: 3 },
  { slug: 'identity-and-self-worth', name: 'Identity & self-worth', order: 4 },
  { slug: 'trauma-and-safety', name: 'Trauma & safety', order: 5 },
  { slug: 'work-and-purpose', name: 'Work & purpose', order: 6 },
  { slug: 'spirituality-and-meaning', name: 'Spirituality & meaning', order: 7 },
  { slug: 'care-and-therapy', name: 'Care & therapy', order: 8 },
  { slug: 'life-transitions-and-change', name: 'Life transitions & change', order: 9 },
];

const canonicalTopicCluster: Record<string, ThemeClusterSlug> = {
  'anxiety-and-stress': 'anxiety-and-mood',
  depression: 'anxiety-and-mood',
  'relationships-and-communication': 'relationships-and-connection',
  'gender-sexuality-and-intimacy': 'relationships-and-connection',
  'loneliness-and-belonging': 'relationships-and-connection',
  'family-and-parenting': 'family-and-parenting',
  'teens-and-identity': 'family-and-parenting',
  'identity-and-self-worth': 'identity-and-self-worth',
  'trauma-and-safety': 'trauma-and-safety',
  'addiction-and-recovery': 'trauma-and-safety',
  'work-and-burnout': 'work-and-purpose',
  'meaning-faith-and-existential-questions': 'spirituality-and-meaning',
  'therapy-and-care-navigation': 'care-and-therapy',
  'neurodivergence-and-attention': 'care-and-therapy',
  'grief-and-loss': 'life-transitions-and-change',
  'general-mental-health': 'life-transitions-and-change',
};

/** Editorial theme descriptions — only render when present; no auto-generated filler. */
export const themeDescriptionsBySlug: Record<string, string> = {};

export type ThemeDirectoryEntry = EntitySummary & {
  cluster: ThemeClusterSlug;
  href: string;
  /** Distinct editorial description, or null to render title-only. */
  themeDescription: string | null;
};

export type GroupedThemeCluster = ThemeClusterDefinition & {
  anchorId: string;
  themes: ThemeDirectoryEntry[];
};

export function getThemeClusterForCategory(categoryName: string): ThemeClusterSlug {
  const canonical = getCanonicalTopic(categoryName);
  return canonicalTopicCluster[canonical.slug] ?? 'life-transitions-and-change';
}

export function getThemeDisplayDescription(entity: EntitySummary): string | null {
  const editorial = themeDescriptionsBySlug[entity.slug]?.trim();
  if (editorial) return editorial;

  const generated = entity.description?.trim();
  if (!generated) return null;

  const normalizedGenerated = normalizeTopicKey(generated);
  const boilerplatePatterns = [
    normalizeTopicKey(`Explore answers about ${entity.name}.`),
    normalizeTopicKey(
      `${entity.count} vetted answer${entity.count === 1 ? '' : 's'} about ${entity.name.toLowerCase()}, written for people seeking clear next steps.`
    ),
  ];

  if (boilerplatePatterns.some((pattern) => normalizedGenerated === pattern)) {
    return null;
  }

  return generated;
}

export function buildThemeDirectoryEntries(entities: EntitySummary[]): ThemeDirectoryEntry[] {
  return entities.map((entity) => ({
    ...entity,
    cluster: getThemeClusterForCategory(entity.name),
    href: `/entities/${entity.slug}/`,
    themeDescription: getThemeDisplayDescription(entity),
  }));
}

export function buildGroupedThemeClusters(entities: EntitySummary[]): GroupedThemeCluster[] {
  const entries = buildThemeDirectoryEntries(entities);
  const byCluster = new Map<ThemeClusterSlug, ThemeDirectoryEntry[]>();

  for (const entry of entries) {
    const list = byCluster.get(entry.cluster) ?? [];
    list.push(entry);
    byCluster.set(entry.cluster, list);
  }

  return themeClusters
    .map((cluster) => {
      const themes = (byCluster.get(cluster.slug) ?? []).sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name)
      );

      return {
        ...cluster,
        anchorId: `theme-cluster-${cluster.slug}`,
        themes,
      };
    })
    .filter((cluster) => cluster.themes.length > 0);
}

/**
 * Trending themes derived from editorial answer slugs until GA4 theme rollup exists.
 * TODO: Replace with analytics-backed theme traffic when available.
 */
export function getTrendingThemeEntries(
  questions: Question[],
  entities: EntitySummary[],
  limit = 3
): ThemeDirectoryEntry[] {
  const entriesByName = new Map(buildThemeDirectoryEntries(entities).map((entry) => [entry.name, entry]));
  const seen = new Set<string>();
  const trending: ThemeDirectoryEntry[] = [];

  for (const question of getTrendingQuestions(questions, 12)) {
    const category = displayCategory(question);
    const entry = entriesByName.get(category);
    if (!entry || seen.has(entry.slug)) continue;
    seen.add(entry.slug);
    trending.push(entry);
    if (trending.length >= limit) break;
  }

  if (trending.length >= limit) return trending;

  for (const entry of buildThemeDirectoryEntries(entities)) {
    if (seen.has(entry.slug)) continue;
    trending.push(entry);
    if (trending.length >= limit) break;
  }

  return trending;
}

export function themeClusterJumpHref(anchorId: string) {
  return `#${anchorId}`;
}
