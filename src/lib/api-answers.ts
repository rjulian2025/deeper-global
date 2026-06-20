import {
  displayCategory,
  getAnswerDisplayTitle,
  getAnswerPlainText,
  getAnswerSummary,
  getCareNote,
  getDisplayAnswerSections,
  getFollowUpQuestions,
  getKeyTakeaways,
  getQuestionCitation,
  truncate,
} from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import type { Question } from '@/lib/supabase';
import { getReviewTier, getRiskClass, getUpgradePriority } from '@/lib/taxonomy';
import { getSourceRefs } from '@/lib/trust';

export const DEEPER_API_BOUNDARY =
  'Educational content only; not a substitute for diagnosis, treatment, therapy, crisis support, or emergency care.';

export function serializeAnswerRecord(question: Question) {
  const citation = getQuestionCitation(question);
  const priority = getUpgradePriority(question);

  return {
    id: question.id,
    slug: question.slug,
    canonical_url: citation.url,
    api_url: `${SITE_URL}/api/v1/answers/${question.slug}`,
    title: getAnswerDisplayTitle(question),
    original_question: question.question,
    topic: displayCategory(question),
    summary: getAnswerSummary(question),
    extract: truncate(getAnswerPlainText(question), 600),
    risk_class: getRiskClass(question),
    review_tier: getReviewTier(question),
    review_status: question.review_status ?? null,
    reviewed_by: question.reviewed_by ?? null,
    reviewed_at: question.reviewed_at ?? null,
    updated_at: citation.dateModified,
    source_refs: getSourceRefs(question),
    upgrade_priority: {
      score: priority.score,
      reasons: priority.reasons,
    },
  };
}

export function serializeAnswerDetail(question: Question) {
  return {
    ...serializeAnswerRecord(question),
    key_takeaways: getKeyTakeaways(question),
    care_note: getCareNote(question),
    answer_sections: getDisplayAnswerSections(question),
    follow_up_questions: getFollowUpQuestions(question),
    clinical_boundary: DEEPER_API_BOUNDARY,
  };
}

export function answerIndexResponse(questions: Question[]) {
  const answers = questions.map(serializeAnswerRecord);

  return {
    name: 'Deeper Global Answer Index',
    base_url: SITE_URL,
    generated_at: new Date().toISOString(),
    count: answers.length,
    total_count: answers.length,
    limit: answers.length,
    offset: 0,
    next_offset: null,
    clinical_boundary: DEEPER_API_BOUNDARY,
    answers,
  };
}

export function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Cache-Control', headers.get('Cache-Control') ?? 'public, max-age=3600');

  return Response.json(body, {
    ...init,
    headers,
  });
}
