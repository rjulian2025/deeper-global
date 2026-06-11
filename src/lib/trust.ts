import type { Question } from './supabase';
import { cleanText } from './content-utils';

export type SourceRef = {
  title: string;
  url: string;
  publisher: string;
};

const INDEXABLE_REVIEW_STATUSES = new Set(['approved', 'published', 'reviewed']);

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

export function isV2Answer(question: Question) {
  if (question.content_enriched_at) return true;
  return Array.isArray(question.answer_sections) && question.answer_sections.length > 0;
}

export function hasClinicalReviewSignal(question: Question) {
  return Boolean(getReviewedByLabel(question) || getSourceRefs(question).length);
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
