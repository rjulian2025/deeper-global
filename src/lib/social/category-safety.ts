export type CategorySafetyTier = 'excluded' | 'restricted' | 'standard';

/**
 * Single source of truth for automated social-content category safety.
 *
 * The categories listed below default to "excluded" pending clinical review
 * by Susan Keenan and policy sign-off from Rick. Change this file, and only
 * this file, when category eligibility decisions are made.
 *
 * Tier meanings:
 * - excluded: never selected for automated generation at all.
 * - restricted: eligible, but question_insight posts must include the fixed crisis-resource line.
 *   No category uses this tier yet; it is reserved for future policy work.
 * - standard: normal pipeline, no additional category-level restrictions.
 */
export const CATEGORY_SAFETY_TIERS: Record<string, CategorySafetyTier> = {
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

export function getCategorySafetyTier(category: string | null | undefined): CategorySafetyTier {
  if (!category) return 'standard';
  return CATEGORY_SAFETY_TIERS[category] ?? 'standard';
}

export function getCategoriesBySafetyTier(tier: CategorySafetyTier) {
  return Object.entries(CATEGORY_SAFETY_TIERS)
    .filter(([, categoryTier]) => categoryTier === tier)
    .map(([category]) => category);
}
