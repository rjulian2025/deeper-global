/**
 * Unified attribution terminology for Deeper Global answers.
 *
 * Specialty-based Peachtree assignments use clinicalContributor only.
 * True page-level clinical review remains a distinct future capability.
 */

export type AttributionRole =
  | 'contentAuthor'
  | 'clinicalContributor'
  | 'clinicalReviewer'
  | 'editorialReviewer';

export type AssignmentMethod =
  | 'specialty_matched_organizational_approval'
  | 'manual_clinical_review'
  | 'manual_editorial_review'
  | 'legacy_bulk_approval'
  | 'protected_existing_assignment'
  | 'unassigned';

export type ApprovalSource =
  | 'peachtree_psychology_susan_keenan'
  | 'deeper_editorial'
  | 'named_clinician_page_review'
  | 'unknown_legacy';

export type AttributionConfidence = 'high' | 'medium' | 'low' | 'unmatched';

export type PublicAttributionLabel =
  | 'Clinical contributor'
  | 'Clinical reviewer'
  | 'Editorial reviewer'
  | 'Expert reviewer'
  | 'Reviewed';

/** Proposed answer-level attribution fields (not all persisted in Supabase yet). */
export type AnswerAttribution = {
  contentAuthor?: string | null;
  clinicalContributor?: string | null;
  clinicalReviewer?: string | null;
  editorialReviewer?: string | null;
  contributorAssignedAt?: string | null;
  clinicallyReviewedAt?: string | null;
  editoriallyReviewedAt?: string | null;
  assignmentMethod?: AssignmentMethod | null;
  approvalSource?: ApprovalSource | null;
  /** Legacy DB field; do not treat as clinical review proof. */
  reviewedByLegacy?: string | null;
  reviewedAtLegacy?: string | null;
};

export const SPECIALTY_ASSIGNMENT_METHOD: AssignmentMethod =
  'specialty_matched_organizational_approval';

export const PEACHTREE_APPROVAL_SOURCE: ApprovalSource = 'peachtree_psychology_susan_keenan';

export const PUBLIC_LABEL_BY_ROLE: Record<AttributionRole, PublicAttributionLabel> = {
  contentAuthor: 'Reviewed',
  clinicalContributor: 'Clinical contributor',
  clinicalReviewer: 'Clinical reviewer',
  editorialReviewer: 'Editorial reviewer',
};
