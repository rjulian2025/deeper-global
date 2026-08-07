import {
  SPECIALTY_ASSIGNMENT_METHOD,
  type AnswerAttribution,
  type AssignmentMethod,
} from '@/data/attribution-types';
import { isKenLegacyId } from '@/data/reviewer-identity';
import type { ReviewerProfile } from '@/data/reviewers';
import type { Question } from '@/lib/supabase';

export type AttributionState =
  | 'clinical_contributor'
  | 'clinical_reviewer'
  | 'editorial_deeper'
  | 'editorial_named'
  | 'legacy_ken_bulk'
  | 'none';

export type ResolvedAttribution = {
  state: AttributionState;
  publicRoleLabel: string | null;
  personName: string | null;
  personUrl: string | null;
  credentialsLine: string | null;
  specialties: string[];
  practiceName: string | null;
  practiceUrl: string | null;
  /** Only set for true clinical or editorial review with a supported date. */
  reviewDate: string | null;
  reviewDateKind: 'clinically_reviewed' | 'editorially_reviewed' | null;
  /** Content update date; never used as a review date. */
  updatedAt: string | null;
  showUpdatedDate: boolean;
  schemaRole: 'contributor' | 'reviewedBy' | 'editorial' | null;
  legacyBulkApproval: boolean;
  assignmentMethod: AssignmentMethod | null;
};

type QuestionAttributionFields = Question & {
  clinical_contributor_id?: string | null;
  clinical_contributor_assigned_at?: string | null;
  clinical_contributor_method?: string | null;
  clinical_reviewer_id?: string | null;
  clinically_reviewed_at?: string | null;
  editorial_review_status?: string | null;
  editorial_reviewer_id?: string | null;
  editorially_reviewed_at?: string | null;
  attribution_legacy_bulk_approval?: boolean | null;
};

const LEGACY_BULK_DATES = new Set(['2026-06-19']);

export function isLegacyBulkApprovalDate(value: string | null | undefined): boolean {
  if (!value) return false;
  return LEGACY_BULK_DATES.has(value.slice(0, 10));
}

/**
 * Single attribution resolver shared by answer UI, API shaping, and schema helpers.
 */
export function resolveAttribution(input: {
  question: QuestionAttributionFields;
  reviewerProfile: ReviewerProfile | null;
  proposedAttribution?: AnswerAttribution | null;
}): ResolvedAttribution {
  const { question, reviewerProfile, proposedAttribution } = input;
  const updatedAt = question.updated_at?.trim() || question.created_at || null;
  const legacyReviewedAt = question.reviewed_at?.trim() || null;
  const legacyBulk =
    Boolean(question.attribution_legacy_bulk_approval) ||
    (isKenLegacyId(question.reviewed_by) && isLegacyBulkApprovalDate(legacyReviewedAt));

  const contributorId =
    proposedAttribution?.clinicalContributor ||
    question.clinical_contributor_id ||
    (reviewerProfile?.trustRoleLabel === 'Clinical contributor' ? reviewerProfile.id : null);

  const clinicalReviewerId =
    proposedAttribution?.clinicalReviewer || question.clinical_reviewer_id || null;
  const clinicallyReviewedAt =
    proposedAttribution?.clinicallyReviewedAt || question.clinically_reviewed_at || null;

  const editorialId =
    proposedAttribution?.editorialReviewer || question.editorial_reviewer_id || null;
  const editoriallyReviewedAt =
    proposedAttribution?.editoriallyReviewedAt || question.editorially_reviewed_at || null;

  // 1) True clinical review (requires reviewer + real date, not legacy bulk)
  if (clinicalReviewerId && clinicallyReviewedAt && !isLegacyBulkApprovalDate(clinicallyReviewedAt)) {
    return {
      state: 'clinical_reviewer',
      publicRoleLabel: 'Clinically reviewed by',
      personName: reviewerProfile?.name || clinicalReviewerId,
      personUrl: reviewerProfile?.url || null,
      credentialsLine: reviewerProfile?.credentialLine || null,
      specialties: reviewerProfile ? [reviewerProfile.specialtyLabel].filter(Boolean) : [],
      practiceName: reviewerProfile?.practiceName || null,
      practiceUrl:
        reviewerProfile?.practiceName === 'Peachtree Psychology'
          ? '/organizations/peachtree-psychology/'
          : null,
      reviewDate: clinicallyReviewedAt,
      reviewDateKind: 'clinically_reviewed',
      updatedAt,
      showUpdatedDate: Boolean(updatedAt),
      schemaRole: 'reviewedBy',
      legacyBulkApproval: legacyBulk,
      assignmentMethod: 'manual_clinical_review',
    };
  }

  // 2) Specialty clinical contributor (no review date). Prefer explicit DB id over profile inference.
  if (contributorId) {
    return {
      state: 'clinical_contributor',
      publicRoleLabel: 'Clinical contributor',
      personName: reviewerProfile?.displayName || reviewerProfile?.name || contributorId,
      personUrl: reviewerProfile?.url || null,
      credentialsLine: reviewerProfile?.credentialLine || null,
      specialties: (reviewerProfile?.expertiseTags || []).slice(0, 2),
      practiceName: 'Peachtree Psychology',
      practiceUrl: '/organizations/peachtree-psychology/',
      reviewDate: null,
      reviewDateKind: null,
      updatedAt,
      showUpdatedDate: Boolean(updatedAt),
      schemaRole: 'contributor',
      legacyBulkApproval: legacyBulk,
      assignmentMethod:
        (question.clinical_contributor_method as AssignmentMethod) ||
        proposedAttribution?.assignmentMethod ||
        SPECIALTY_ASSIGNMENT_METHOD,
    };
  }

  // 3) Explicit editorial assignments win over legacy Ken bulk (post-apply editorial transition).
  if (
    editorialId === 'rick-julian' ||
    reviewerProfile?.id === 'rick-julian' ||
    reviewerProfile?.trustRoleLabel === 'Editorial Reviewer'
  ) {
    return {
      state: 'editorial_named',
      publicRoleLabel: 'Editorially reviewed by',
      personName: reviewerProfile?.name || editorialId,
      personUrl: reviewerProfile?.url || null,
      credentialsLine: reviewerProfile?.credentialLine || null,
      specialties: reviewerProfile ? [reviewerProfile.specialtyLabel] : [],
      practiceName: null,
      practiceUrl: null,
      reviewDate: editoriallyReviewedAt || (!legacyBulk ? legacyReviewedAt : null),
      reviewDateKind: editoriallyReviewedAt || legacyReviewedAt ? 'editorially_reviewed' : null,
      updatedAt,
      showUpdatedDate: Boolean(updatedAt),
      schemaRole: 'editorial',
      legacyBulkApproval: false,
      assignmentMethod: 'manual_editorial_review',
    };
  }

  if (editorialId === 'deeper-editorial' || question.editorial_review_status === 'reviewed') {
    return {
      state: 'editorial_deeper',
      publicRoleLabel: 'Editorially reviewed by Deeper',
      personName: null,
      personUrl: null,
      credentialsLine: null,
      specialties: [],
      practiceName: null,
      practiceUrl: null,
      reviewDate: null,
      reviewDateKind: null,
      updatedAt,
      showUpdatedDate: Boolean(updatedAt),
      schemaRole: 'editorial',
      legacyBulkApproval: legacyBulk,
      assignmentMethod: 'manual_editorial_review',
    };
  }

  // 4) Legacy Ken bulk: strip misleading clinical review date when no specialty/editorial assignment yet.
  if (legacyBulk || (isKenLegacyId(question.reviewed_by) && !clinicallyReviewedAt)) {
    if (reviewerProfile) {
      return {
        state: 'legacy_ken_bulk',
        publicRoleLabel: 'Clinical contributor',
        personName: reviewerProfile.displayName || reviewerProfile.name,
        personUrl: reviewerProfile.url,
        credentialsLine: reviewerProfile.credentialLine,
        specialties: [reviewerProfile.specialtyLabel].filter(Boolean),
        practiceName: null,
        practiceUrl: null,
        reviewDate: null,
        reviewDateKind: null,
        updatedAt,
        showUpdatedDate: Boolean(updatedAt),
        schemaRole: 'contributor',
        legacyBulkApproval: true,
        assignmentMethod: 'legacy_bulk_approval',
      };
    }
    return {
      state: 'editorial_deeper',
      publicRoleLabel: 'Editorially reviewed by Deeper',
      personName: null,
      personUrl: null,
      credentialsLine: null,
      specialties: [],
      practiceName: null,
      practiceUrl: null,
      reviewDate: null,
      reviewDateKind: null,
      updatedAt,
      showUpdatedDate: Boolean(updatedAt),
      schemaRole: 'editorial',
      legacyBulkApproval: true,
      assignmentMethod: 'legacy_bulk_approval',
    };
  }

  // 6) Existing protected clinical reviewers (Alex, Michelle) with legacy reviewed_at
  if (reviewerProfile && reviewerProfile.trustRoleLabel !== 'Clinical contributor') {
    const realDate = clinicallyReviewedAt || (!legacyBulk ? legacyReviewedAt : null);
    if (realDate) {
      return {
        state: 'clinical_reviewer',
        publicRoleLabel: 'Clinically reviewed by',
        personName: reviewerProfile.name,
        personUrl: reviewerProfile.url,
        credentialsLine: reviewerProfile.credentialLine,
        specialties: [reviewerProfile.specialtyLabel],
        practiceName: reviewerProfile.practiceName || null,
        practiceUrl:
          reviewerProfile.practiceName === 'Peachtree Psychology'
            ? '/organizations/peachtree-psychology/'
            : null,
        reviewDate: realDate,
        reviewDateKind: 'clinically_reviewed',
        updatedAt,
        showUpdatedDate: Boolean(updatedAt),
        schemaRole: 'reviewedBy',
        legacyBulkApproval: false,
        assignmentMethod: 'protected_existing_assignment',
      };
    }
  }

  return {
    state: 'none',
    publicRoleLabel: null,
    personName: null,
    personUrl: null,
    credentialsLine: null,
    specialties: [],
    practiceName: null,
    practiceUrl: null,
    reviewDate: null,
    reviewDateKind: null,
    updatedAt,
    showUpdatedDate: Boolean(updatedAt),
    schemaRole: null,
    legacyBulkApproval: legacyBulk,
    assignmentMethod: null,
  };
}
