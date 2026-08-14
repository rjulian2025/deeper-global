/**
 * Identity resolution for legacy Ken / Gore reviewer IDs.
 *
 * Findings (Phase A audit):
 * - `david-k-gore-phd` is a misnamed legacy ID whose public display name is
 *   Kenneth W. Christian, PhD (Addiction & Recovery specialty lane).
 * - `kenneth-w-christian-phd` is the same person under a Performance /
 *   Purpose specialty lane; currently has 0 live answer attributions.
 * - No public evidence in-repo that David K. Gore is a separate current reviewer.
 *
 * Phase A does not activate redirects or delete routes. This file defines the
 * canonical plan for later phases.
 */

export type IdentityResolutionStatus =
  | 'canonical'
  | 'legacy_alias'
  | 'deprecated_duplicate_profile'
  | 'protected_unrelated';

export type ReviewerIdentityRecord = {
  legacyId: string;
  legacySlug: string;
  legacyPublicUrl: string;
  displayedNameToday: string;
  specialtyLaneToday: string;
  intendedPerson: string;
  canonicalId: string;
  canonicalSlug: string;
  canonicalPublicUrl: string;
  status: IdentityResolutionStatus;
  directoryVisibility: 'show_canonical_only' | 'show' | 'hide_after_redirect';
  redirectPlan: 'preserve_until_validated' | 'none';
  notes: string[];
};

export const KEN_LEGACY_IDS = ['david-k-gore-phd', 'kenneth-w-christian-phd'] as const;

export const reviewerIdentityResolution: ReviewerIdentityRecord[] = [
  {
    legacyId: 'kenneth-w-christian-phd',
    legacySlug: 'kenneth-w-christian-phd',
    legacyPublicUrl: '/reviewers/kenneth-w-christian-phd/',
    displayedNameToday: 'Kenneth W. Christian, PhD',
    specialtyLaneToday: 'Performance, Purpose & Self-Limiting Patterns',
    intendedPerson: 'Kenneth W. Christian, PhD',
    canonicalId: 'kenneth-w-christian-phd',
    canonicalSlug: 'kenneth-w-christian-phd',
    canonicalPublicUrl: '/reviewers/kenneth-w-christian-phd/',
    status: 'canonical',
    directoryVisibility: 'show_canonical_only',
    redirectPlan: 'none',
    notes: [
      'Canonical person ID for Kenneth W. Christian, PhD.',
      'Performance specialty lane historically used by content:review-performance.',
      'Live API currently shows 0 answers on this ID; migration corpus is on david-k-gore-phd.',
    ],
  },
  {
    legacyId: 'david-k-gore-phd',
    legacySlug: 'david-k-gore-phd',
    legacyPublicUrl: '/reviewers/david-k-gore-phd/',
    displayedNameToday: 'Kenneth W. Christian, PhD',
    specialtyLaneToday: 'Addiction & Recovery',
    intendedPerson: 'Kenneth W. Christian, PhD',
    canonicalId: 'kenneth-w-christian-phd',
    canonicalSlug: 'kenneth-w-christian-phd',
    canonicalPublicUrl: '/reviewers/kenneth-w-christian-phd/',
    status: 'legacy_alias',
    directoryVisibility: 'hide_after_redirect',
    redirectPlan: 'preserve_until_validated',
    notes: [
      'Critical identity debt: ID slug says david-k-gore-phd but display name is Kenneth W. Christian, PhD.',
      'Holds the bulk legacy corpus (~1068 answers) from approve-unreviewed-corpus default reviewer.',
      'Treat as alias of kenneth-w-christian-phd for person identity; do not present as a second Ken profile.',
      'Do not activate redirects until Phase C validation.',
    ],
  },
];

export function resolveCanonicalReviewerId(legacyId: string | null | undefined): string | null {
  if (!legacyId) return null;
  const hit = reviewerIdentityResolution.find((row) => row.legacyId === legacyId);
  return hit?.canonicalId ?? legacyId;
}

export function isKenLegacyId(id: string | null | undefined): boolean {
  return Boolean(id && (KEN_LEGACY_IDS as readonly string[]).includes(id));
}

export function getDirectoryReviewerIds(existingIds: string[]): string[] {
  const hide = new Set(
    reviewerIdentityResolution
      .filter((row) => row.directoryVisibility === 'hide_after_redirect')
      .map((row) => row.legacyId)
  );
  return existingIds.filter((id) => !hide.has(id));
}
