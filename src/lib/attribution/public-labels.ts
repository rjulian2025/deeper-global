import {
  PUBLIC_LABEL_BY_ROLE,
  type AnswerAttribution,
  type AttributionRole,
  type PublicAttributionLabel,
} from '@/data/attribution-types';
import { isKenLegacyId } from '@/data/reviewer-identity';
import type { ReviewerProfile } from '@/data/reviewers';
import type { Question } from '@/lib/supabase';

export type PublicDateKind = 'clinically_reviewed' | 'editorially_reviewed' | 'updated' | 'none';

export type PublicAttributionView = {
  role: AttributionRole | null;
  label: PublicAttributionLabel | null;
  showReviewDate: boolean;
  dateKind: PublicDateKind;
  dateValue: string | null;
  practiceName?: string | null;
  practiceUrl?: string | null;
  specialties?: string[];
};

function isEditorialReviewer(profile: ReviewerProfile | null): boolean {
  if (!profile) return false;
  return (
    profile.trustRoleLabel === 'Editorial Reviewer' ||
    profile.reviewAttributionPrefix === 'Editorially reviewed by' ||
    profile.id === 'rick-julian'
  );
}

/**
 * Resolve the public attribution presentation without inventing clinical review.
 * Specialty-matched contributors use "Clinical contributor" and no review date.
 */
export function resolvePublicAttributionView(input: {
  question: Question;
  reviewerProfile: ReviewerProfile | null;
  proposedAttribution?: AnswerAttribution | null;
}): PublicAttributionView {
  const { question, reviewerProfile, proposedAttribution } = input;
  const legacyReviewedAt = question.reviewed_at?.trim() || null;
  const updatedAt = question.updated_at?.trim() || question.created_at;

  if (proposedAttribution?.clinicalContributor) {
    return {
      role: 'clinicalContributor',
      label: PUBLIC_LABEL_BY_ROLE.clinicalContributor,
      showReviewDate: false,
      dateKind: 'none',
      dateValue: null,
      practiceName: reviewerProfile?.practiceName ?? 'Peachtree Psychology',
      practiceUrl: reviewerProfile?.practiceName ? '/organizations/peachtree-psychology/' : null,
      specialties: reviewerProfile?.expertiseTags?.slice(0, 2),
    };
  }

  if (proposedAttribution?.clinicalReviewer || reviewerProfile?.trustRoleLabel === 'Clinical Reviewer') {
    // Legacy Ken bulk IDs must not present bulk approval dates as clinical review dates.
    if (isKenLegacyId(question.reviewed_by) && !proposedAttribution?.clinicallyReviewedAt) {
      return {
        role: 'clinicalContributor',
        label: PUBLIC_LABEL_BY_ROLE.clinicalContributor,
        showReviewDate: false,
        dateKind: 'updated',
        dateValue: updatedAt,
        specialties: reviewerProfile ? [reviewerProfile.specialtyLabel] : [],
      };
    }

    if (proposedAttribution?.clinicallyReviewedAt || legacyReviewedAt) {
      return {
        role: 'clinicalReviewer',
        label: PUBLIC_LABEL_BY_ROLE.clinicalReviewer,
        showReviewDate: true,
        dateKind: 'clinically_reviewed',
        dateValue: proposedAttribution?.clinicallyReviewedAt || legacyReviewedAt,
        specialties: reviewerProfile ? [reviewerProfile.specialtyLabel] : [],
      };
    }
  }

  if (proposedAttribution?.editorialReviewer || isEditorialReviewer(reviewerProfile)) {
    const editorialDate = proposedAttribution?.editoriallyReviewedAt || legacyReviewedAt;
    return {
      role: 'editorialReviewer',
      label: PUBLIC_LABEL_BY_ROLE.editorialReviewer,
      showReviewDate: Boolean(editorialDate),
      dateKind: editorialDate ? 'editorially_reviewed' : 'updated',
      dateValue: editorialDate || updatedAt,
      specialties: reviewerProfile ? [reviewerProfile.specialtyLabel] : [],
    };
  }

  if (reviewerProfile) {
    return {
      role: 'clinicalReviewer',
      label: (reviewerProfile.trustRoleLabel as PublicAttributionLabel) || 'Clinical reviewer',
      showReviewDate: false,
      dateKind: 'updated',
      dateValue: updatedAt,
      specialties: [reviewerProfile.specialtyLabel],
    };
  }

  return {
    role: null,
    label: null,
    showReviewDate: false,
    dateKind: 'updated',
    dateValue: updatedAt,
  };
}

export function formatPublicAttributionDate(view: PublicAttributionView, formattedDate: string): string | null {
  if (view.dateKind === 'clinically_reviewed' && view.showReviewDate) {
    return `Clinically reviewed ${formattedDate}`;
  }
  if (view.dateKind === 'editorially_reviewed' && view.showReviewDate) {
    return `Editorially reviewed ${formattedDate}`;
  }
  if (view.dateKind === 'updated' && view.dateValue) {
    return `Updated ${formattedDate}`;
  }
  return null;
}
