import type { ReviewerProfile } from '@/data/reviewers';
import type { ClinicalContributor } from './types';

/**
 * Map a Peachtree clinical contributor into the existing ReviewerProfile shape
 * used by reviewer routes/components. New profiles stay noindex until activation.
 */
export function clinicalContributorToReviewerProfile(contributor: ClinicalContributor): ReviewerProfile {
  const displayName = contributor.credentials
    ? `${contributor.fullName}${contributor.credentials.includes(contributor.fullName) ? '' : ''}`
    : contributor.fullName;

  const nameWithCreds =
    contributor.credentials && !contributor.fullName.includes(contributor.credentials.split(',')[0].trim())
      ? `${contributor.fullName}, ${contributor.credentials.replace(/\s*-\s*Director$/, '').trim()}`
      : contributor.fullName;

  return {
    id: contributor.id,
    slug: contributor.slug,
    name: nameWithCreds,
    displayName: contributor.fullName,
    specialtyLabel: contributor.specialtyLabel,
    designation: contributor.professionalTitle ?? contributor.specialtyLabel,
    credentialLine: contributor.credentialLine,
    role: contributor.professionalTitle ?? undefined,
    practiceName: contributor.practiceName,
    practiceUrl: contributor.externalPracticeUrl,
    image: contributor.headshotUrl ?? undefined,
    imageAlt: `${contributor.fullName}, clinical contributor affiliated with Peachtree Psychology`,
    bio: contributor.shortBio || contributor.fullBio || '',
    overviewParagraphs: contributor.fullBio
      ? contributor.fullBio
          .split(/\n\n+/)
          .map((p) => p.trim())
          .filter(Boolean)
          .slice(0, 4)
      : undefined,
    expertiseTags: contributor.specialties,
    expertiseDomains: contributor.specialties.slice(0, 8).map((label) => ({
      label,
      description: 'Verified specialty listed on the clinician Peachtree Psychology profile.',
    })),
    disclaimer: contributor.disclaimer,
    sameAs: contributor.schemaSameAs,
    url: `/reviewers/${contributor.slug}/`,
    locationLine: contributor.locationLine ?? undefined,
    referralLinks: [
      {
        label: 'Peachtree profile',
        href: contributor.externalPracticeUrl,
        description: 'External practice biography',
      },
    ],
    trustRoleLabel: 'Clinical contributor',
    reviewAttributionPrefix: 'Clinical contributor',
    practiceNotes: [
      'Clinical contributor attribution is specialty-matched and educational.',
      'Deeper Global does not employ or certify this clinician.',
      ...(contributor.supervisionNotes || []),
    ],
  };
}

export type ContributorActivationMeta = {
  id: string;
  slug: string;
  profileStatus: ClinicalContributor['profileStatus'];
  assignmentEligibility: ClinicalContributor['assignmentEligibility'];
  publicDirectory: boolean;
  indexable: boolean;
  deeperRouteActivated: boolean;
  readiness: string[];
};
