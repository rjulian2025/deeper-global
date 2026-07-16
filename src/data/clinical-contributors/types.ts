export type ContributorRoleClass =
  | 'licensed'
  | 'licensed_psychologist'
  | 'licensed_social_worker'
  | 'licensed_director'
  | 'associate'
  | 'master_social_worker'
  | 'intern'
  | 'coach';

export type AssignmentEligibility = 'public' | 'restricted' | 'report_only';

export type ProfileStatus = 'complete' | 'incomplete';

export type AttributionStatus = 'eligible' | 'ineligible_public' | 'legacy_only';

export type ClinicalContributor = {
  id: string;
  slug: string;
  fullName: string;
  credentials: string | null;
  professionalTitle: string | null;
  shortBio: string | null;
  fullBio: string | null;
  headshotUrl: string | null;
  practiceId: string;
  practiceName: string;
  practiceProfileUrl: string;
  externalPracticeUrl: string;
  licenseTypes: string[];
  licenseStates: string[];
  specialties: string[];
  specialtyAliases: string[];
  eligibleTopicIds: string[];
  eligibleThemeIds: string[];
  excludedTopicIds: string[];
  reviewedAnswerIds: string[];
  attributionStatus: AttributionStatus;
  profileStatus: ProfileStatus;
  profileGaps: string[];
  schemaSameAs: string[];
  sourceNotes: string[];
  roleClass: ContributorRoleClass;
  assignmentEligibility: AssignmentEligibility;
  roleRestrictions: string[];
  whoTheyWorkWith: string[];
  supervisionNotes: string[];
  locationLine: string | null;
  specialtyLabel: string;
  credentialLine: string;
  trustRoleLabel: string;
  reviewAttributionPrefix: string;
  disclaimer: string;
};
