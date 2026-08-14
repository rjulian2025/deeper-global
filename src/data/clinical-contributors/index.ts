export type {
  AssignmentEligibility,
  AttributionStatus,
  ClinicalContributor,
  ContributorRoleClass,
  ProfileStatus,
} from './types';
export {
  PEACHTREE_CLINICIAN_IDS,
  peachtreeClinicalContributors,
  peachtreeClinicalContributorsById,
  peachtreeClinicalContributorsBySlug,
} from './peachtree';

import { peachtreePsychologyOrganization } from '@/data/organizations/peachtree-psychology';
import { PEACHTREE_CLINICIAN_IDS, peachtreeClinicalContributors } from './peachtree';

/** Organization record with clinician membership filled from import. */
export function getPeachtreePsychologyOrganization() {
  return {
    ...peachtreePsychologyOrganization,
    clinicianIds: [...PEACHTREE_CLINICIAN_IDS],
  };
}

export function getPublishableClinicalContributors() {
  return peachtreeClinicalContributors.filter(
    (c) => c.profileStatus === 'complete' && c.assignmentEligibility === 'public'
  );
}

export function isPublishableClinicalContributor(id: string) {
  return getPublishableClinicalContributors().some((c) => c.id === id);
}
