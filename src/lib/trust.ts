import type { Question } from './supabase';
import { reviewerProfiles, reviewerProfilesById, type ReviewerProfile } from '@/data/reviewers';
import {
  authorityToTrustAdapter,
  getAuthorityByReviewerId,
  getAuthorityForAnswer,
  type AuthorityTrustProfile,
} from './authorities';
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
  'david-k-gore-phd': 'david-k-gore-phd',
  'david k gore phd': 'david-k-gore-phd',
  'david k. gore phd': 'david-k-gore-phd',
  'david k. gore, phd': 'david-k-gore-phd',
  'kenneth-w-christian-phd': 'kenneth-w-christian-phd',
  'kenneth w christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian phd': 'kenneth-w-christian-phd',
  'kenneth w. christian, phd': 'kenneth-w-christian-phd',
  'alex-crenshaw-phd': 'alex-crenshaw-phd',
  'alex crenshaw phd': 'alex-crenshaw-phd',
  'dr. alex crenshaw, phd': 'alex-crenshaw-phd',
  'dr alex crenshaw phd': 'alex-crenshaw-phd',
};

export type TrustProfile = (ReviewerProfile & { isAuthority?: false }) | AuthorityTrustProfile;

function resolveTrustProfile(question: Question): TrustProfile | null {
  const authority = getAuthorityForAnswer(question);
  if (authority) return authorityToTrustAdapter(authority);

  const reviewedBy = getReviewedByLabel(question);
  if (!reviewedBy) return null;

  const authorityByLabel = getAuthorityByReviewerId(reviewedBy);
  if (authorityByLabel) return authorityToTrustAdapter(authorityByLabel);

  const reviewerId = REVIEWER_ALIASES[reviewedBy.toLowerCase().trim()] ?? REVIEWER_ALIASES[normalizeReviewerLabel(reviewedBy)];
  if (!reviewerId) return null;

  return reviewerProfilesById.get(reviewerId) ?? null;
}

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

export function getReviewerProfile(question: Question): TrustProfile | null {
  return resolveTrustProfile(question);
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

export function getReviewerAttributionHeadline(question: Question) {
  const reviewerProfile = getReviewerProfile(question);
  if (!reviewerProfile) return '';

  if (isDraftReviewStatus(question)) {
    return `Expert reviewed by ${reviewerProfile.name}`;
  }

  return `Clinically reviewed by ${reviewerProfile.name}`;
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

  const profileUrl = siteUrl(reviewerProfile.url);
  const personId = reviewerProfile.isAuthority
    ? `${profileUrl}#person`
    : siteUrl(`/reviewers/${reviewerProfile.slug}/#person`);

  return {
    '@type': 'Person',
    '@id': personId,
    name: reviewerProfile.name,
    url: profileUrl,
    jobTitle: reviewerProfile.specialtyLabel,
    knowsAbout: reviewerProfile.expertiseTags,
    ...(reviewerProfile.sameAs.length > 0 ? { sameAs: reviewerProfile.sameAs } : {}),
  };
}

export function isV2Answer(question: Question) {
  if (question.content_enriched_at) return true;
  return Array.isArray(question.answer_sections) && question.answer_sections.length > 0;
}

export function hasClinicalReviewSignal(question: Question) {
  return Boolean(
    getReviewedByLabel(question) ||
      getReviewedAt(question) ||
      getSourceRefs(question).length ||
      getAuthorityForAnswer(question)
  );
}

export function getReviewStatusLabel(question: Question) {
  const status = question.review_status?.toLowerCase().trim();
  return status || '';
}

export function isIndexableReviewStatus(question: Question) {
  const status = getReviewStatusLabel(question);
  if (!status) return true;
  return INDEXABLE_REVIEW_STATUSES.has(status);
}
