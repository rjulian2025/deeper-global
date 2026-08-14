import {
  peachtreeClinicalContributors,
  type ClinicalContributor,
} from '@/data/clinical-contributors';
import { clinicalContributorToReviewerProfile } from '@/data/clinical-contributors/to-reviewer-profile';
import { reviewerProfiles, type ReviewerProfile } from '@/data/reviewers';

export type ContributorRouteProfile = ReviewerProfile & {
  activation: {
    source: 'legacy_reviewer' | 'peachtree_contributor';
    profileStatus: 'complete' | 'incomplete';
    indexable: boolean;
    publicDirectory: boolean;
    assignmentEligibility: string;
  };
};

const EXISTING_IDS = new Set(reviewerProfiles.map((p) => p.id));

/** Peachtree contributors that do not already have a rich legacy profile (Alex). */
export function getNewPeachtreeRouteProfiles(): ContributorRouteProfile[] {
  return peachtreeClinicalContributors
    .filter((c) => !EXISTING_IDS.has(c.id))
    .map((contributor) => toRouteProfile(contributor));
}

export function toRouteProfile(contributor: ClinicalContributor): ContributorRouteProfile {
  const base = clinicalContributorToReviewerProfile(contributor);
  const indexable = false; // Phase C: keep noindex until apply + approval
  const publicDirectory = false; // keep out of /reviewers/ directory until activation
  return {
    ...base,
    activation: {
      source: 'peachtree_contributor',
      profileStatus: contributor.profileStatus,
      indexable,
      publicDirectory,
      assignmentEligibility: contributor.assignmentEligibility,
    },
  };
}

export function getAllReviewerRouteProfiles(): ContributorRouteProfile[] {
  const legacy: ContributorRouteProfile[] = reviewerProfiles.map((profile) => ({
    ...profile,
    activation: {
      source: 'legacy_reviewer',
      profileStatus: 'complete',
      indexable: profile.id !== 'david-k-gore-phd',
      publicDirectory: profile.id !== 'david-k-gore-phd',
      assignmentEligibility: 'public',
    },
  }));
  return [...legacy, ...getNewPeachtreeRouteProfiles()];
}

export function buildProfileReadinessRows(proposedCounts: Map<string, number>) {
  return peachtreeClinicalContributors.map((c) => {
    const gaps = [...c.profileGaps];
    if (!c.headshotUrl) gaps.push('missing_image');
    if (!(c.fullBio || c.shortBio)) gaps.push('missing_biography');
    if (!c.credentials && !c.professionalTitle) gaps.push('missing_credentials');
    if (c.specialties.length < 3) gaps.push('missing_specialty_detail');

    let readiness: string = 'complete';
    if (c.assignmentEligibility === 'report_only' || c.roleClass === 'intern') {
      readiness = 'report_only';
    } else if (gaps.includes('missing_image') || gaps.includes('missing_biography')) {
      readiness = 'incomplete';
    } else if (gaps.includes('missing_credentials')) {
      readiness = 'requires_source_correction';
    }

    const proposed = proposedCounts.get(c.id) || 0;
    return {
      contributor_id: c.id,
      full_name: c.fullName,
      readiness,
      profile_status: c.profileStatus,
      assignment_eligibility: c.assignmentEligibility,
      indexable_after_apply: readiness === 'complete' && c.assignmentEligibility !== 'report_only',
      public_directory_after_apply: readiness === 'complete' && c.assignmentEligibility === 'public',
      proposed_answer_count: proposed,
      missing_image: !c.headshotUrl,
      missing_biography: !(c.fullBio || c.shortBio),
      missing_credentials: !c.credentials,
      missing_specialty_detail: c.specialties.length < 3,
      external_url: c.externalPracticeUrl,
      deeper_route: `/reviewers/${c.slug}/`,
      notes: gaps.join('|'),
    };
  });
}
