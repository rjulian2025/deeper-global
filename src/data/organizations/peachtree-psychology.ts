export type OrganizationRecord = {
  id: string;
  slug: string;
  name: string;
  url: string;
  externalUrl: string;
  shortOverview: string;
  relationshipLanguage: string;
  locationLine: string;
  sameAs: string[];
  clinicianIds: string[];
  schemaType: 'Organization';
  profileStatus: 'complete' | 'incomplete';
};

export const PEACHTREE_PSYCHOLOGY_ID = 'peachtree-psychology';
export const PEACHTREE_PSYCHOLOGY_SLUG = 'peachtree-psychology';
export const PEACHTREE_EXTERNAL_URL = 'https://peachtreepsychology.com';

/**
 * Organization record for Peachtree Psychology.
 * Clinician membership is wired after clinical-contributor import.
 */
export const peachtreePsychologyOrganization: OrganizationRecord = {
  id: PEACHTREE_PSYCHOLOGY_ID,
  slug: PEACHTREE_PSYCHOLOGY_SLUG,
  name: 'Peachtree Psychology',
  url: `/organizations/${PEACHTREE_PSYCHOLOGY_SLUG}/`,
  externalUrl: PEACHTREE_EXTERNAL_URL,
  shortOverview:
    'Peachtree Psychology is an independent mental health practice in the Atlanta area. Selected clinicians participate in Deeper Global’s specialty-matched clinical contributor program.',
  relationshipLanguage:
    'Deeper Global does not own, employ, certify, or independently verify Peachtree Psychology. Named clinicians appear as clinical contributors based on organizational approval and specialty alignment, not as page-by-page clinical reviewers unless a separate clinical review is recorded.',
  locationLine: '555 Sun Valley Drive, Suite M-2 · Roswell, GA 30076',
  sameAs: [PEACHTREE_EXTERNAL_URL, `${PEACHTREE_EXTERNAL_URL}/`],
  clinicianIds: [],
  schemaType: 'Organization',
  profileStatus: 'complete',
};
