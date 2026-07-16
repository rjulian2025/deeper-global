import { RETIRED_DUPLICATE_REVIEW_STATUS, type Question } from './supabase';
import { reviewerProfiles, reviewerProfilesById, type ReviewerProfile } from '@/data/reviewers';
import { peachtreeClinicalContributorsById } from '@/data/clinical-contributors';
import { clinicalContributorToReviewerProfile } from '@/data/clinical-contributors/to-reviewer-profile';
import { cleanText } from './content-utils';
import { siteUrl } from './site';

export type { ReviewerProfile };
export { reviewerProfiles };

export type SourceRef = {
  title: string;
  url: string;
  publisher: string;
};

const INDEXABLE_REVIEW_STATUSES = new Set(['approved', 'published', 'reviewed']);
const INTERNAL_REVIEWER_LABELS = new Set(['codex-seo-review']);
const GENERIC_EDITORIAL_REVIEW_LABEL = 'Reviewed for clarity, structure, and source alignment';
const REVIEWER_ALIASES: Record<string, string> = {
  'alex-crenshaw-phd': 'alex-crenshaw-phd',
  'alex crenshaw phd': 'alex-crenshaw-phd',
  'alex crenshaw, phd': 'alex-crenshaw-phd',
  'dr alex crenshaw phd': 'alex-crenshaw-phd',
  'dr. alex crenshaw, phd': 'alex-crenshaw-phd',
  'david-k-gore-phd': 'david-k-gore-phd',
  'david k gore phd': 'david-k-gore-phd',
  'david k. gore phd': 'david-k-gore-phd',
  'david k. gore, phd': 'david-k-gore-phd',
  'kenneth-w-christian-phd': 'kenneth-w-christian-phd',
  'kenneth w christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian, phd': 'kenneth-w-christian-phd',
  'rick-julian': 'rick-julian',
  'rick julian': 'rick-julian',
  'michelle-morris-lpc': 'michelle-morris-lpc',
  'michelle morris lpc': 'michelle-morris-lpc',
  'michelle morris lpc lpcc': 'michelle-morris-lpc',
  'michelle morris, lpc': 'michelle-morris-lpc',
  'michelle morris, lpc, lpcc': 'michelle-morris-lpc',
};

function normalizeReviewerLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/[,.-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getSourceRefs(question: Question): SourceRef[] {
  if (!Array.isArray(question.source_refs)) return [];

  return question.source_refs
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const title = cleanText(typeof record.title === 'string' ? record.title : '');
      const url = cleanText(typeof record.url === 'string' ? record.url : '');
      const publisher = cleanText(typeof record.publisher === 'string' ? record.publisher : '');

      if (!title && !url) return null;

      return {
        title: title || url,
        url,
        publisher,
      };
    })
    .filter((item): item is SourceRef => Boolean(item));
}

export function getReviewedByLabel(question: Question) {
  return cleanText(question.reviewed_by);
}

export function getReviewedAt(question: Question) {
  return cleanText(question.reviewed_at);
}

export function isInternalReviewerLabel(label: string) {
  return INTERNAL_REVIEWER_LABELS.has(label.toLowerCase().trim());
}

function resolveProfileById(id: string): ReviewerProfile | null {
  const legacy = reviewerProfilesById.get(id);
  if (legacy) return legacy;
  const contributor = peachtreeClinicalContributorsById.get(id);
  if (contributor) return clinicalContributorToReviewerProfile(contributor);
  return null;
}

export function getReviewerProfile(question: Question & { clinical_contributor_id?: string | null }) {
  // Prefer additive contributor field when present (post-migration).
  const contributorId = cleanText(question.clinical_contributor_id);
  if (contributorId) {
    return resolveProfileById(contributorId);
  }

  const reviewedBy = getReviewedByLabel(question);
  if (!reviewedBy) return null;

  const reviewerId = REVIEWER_ALIASES[reviewedBy.toLowerCase().trim()] ?? REVIEWER_ALIASES[normalizeReviewerLabel(reviewedBy)];
  if (!reviewerId) return null;

  return resolveProfileById(reviewerId);
}

export function getReviewerDisplayLabel(question: Question) {
  const reviewerProfile = getReviewerProfile(question);
  if (reviewerProfile) return reviewerProfile.name;

  const reviewedBy = getReviewedByLabel(question);
  if (!reviewedBy) return '';
  if (isInternalReviewerLabel(reviewedBy)) return GENERIC_EDITORIAL_REVIEW_LABEL;
  return reviewedBy;
}

export function isDraftReviewStatus(question: Question) {
  return getReviewStatusLabel(question) === 'draft';
}

export function getReviewerTrustRoleLabel(reviewerProfile: ReviewerProfile, isDraft = false) {
  if (isDraft) return 'Expert reviewer';
  return reviewerProfile.trustRoleLabel ?? 'Clinical reviewer';
}

export function getReviewerAttributionPrefix(reviewerProfile: ReviewerProfile, isDraft = false) {
  if (isDraft) return 'Expert reviewed by';
  // Specialty-contributor and legacy Ken labels must not say "Reviewed by".
  if (reviewerProfile.trustRoleLabel === 'Clinical contributor') {
    return reviewerProfile.reviewAttributionPrefix ?? 'Clinical contributor';
  }
  if (reviewerProfile.trustRoleLabel === 'Editorial Reviewer') {
    return reviewerProfile.reviewAttributionPrefix ?? 'Editorially reviewed by';
  }
  return reviewerProfile.reviewAttributionPrefix ?? 'Clinically reviewed by';
}

export function getReviewerAttributionHeadline(question: Question) {
  const reviewerProfile = getReviewerProfile(question);
  if (!reviewerProfile) return '';

  const prefix = getReviewerAttributionPrefix(reviewerProfile, isDraftReviewStatus(question));
  return `${prefix} ${reviewerProfile.name}`;
}

export function getReviewerAttributionDetail(question: Question) {
  const reviewerProfile = getReviewerProfile(question);
  if (!reviewerProfile) return '';

  if (isDraftReviewStatus(question)) {
    return `Reviewed for ${reviewerProfile.specialtyLabel.toLowerCase()} relevance`;
  }

  return reviewerProfile.specialtyLabel;
}

export function getReviewerSchemaNode(question: Question) {
  const reviewerProfile = getReviewerProfile(question);
  if (!reviewerProfile) return null;

  const personId = `${siteUrl(`/reviewers/${reviewerProfile.slug}`)}#person`;
  const affiliation =
    reviewerProfile.practiceName === 'Peachtree Psychology'
      ? {
          affiliation: {
            '@type': 'Organization',
            '@id': `${siteUrl('/organizations/peachtree-psychology/')}#organization`,
            name: 'Peachtree Psychology',
            url: siteUrl('/organizations/peachtree-psychology/'),
          },
        }
      : {};

  return {
    '@type': 'Person',
    '@id': personId,
    name: reviewerProfile.name,
    url: siteUrl(reviewerProfile.url),
    jobTitle: reviewerProfile.role || reviewerProfile.specialtyLabel,
    knowsAbout: reviewerProfile.expertiseTags,
    ...(reviewerProfile.sameAs.length > 0 ? { sameAs: reviewerProfile.sameAs } : {}),
    ...affiliation,
  };
}

export function isV2Answer(question: Question) {
  if (question.content_enriched_at) return true;
  return Array.isArray(question.answer_sections) && question.answer_sections.length > 0;
}

export function hasClinicalReviewSignal(question: Question) {
  return Boolean(getReviewedByLabel(question) || getReviewedAt(question) || getSourceRefs(question).length);
}

export function getReviewStatusLabel(question: Question) {
  const status = question.review_status?.toLowerCase().trim();
  return status || '';
}

export function isIndexableReviewStatus(question: Question) {
  const status = getReviewStatusLabel(question);
  if (!status) return true;
  if (status === RETIRED_DUPLICATE_REVIEW_STATUS) return false;
  return INDEXABLE_REVIEW_STATUSES.has(status);
}
