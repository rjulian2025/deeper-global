import {
  displayCategory,
  getAnswerDisplayTitle,
  getAnswerPlainText,
  getAnswerSummary,
  getQuestionCitation,
  truncate,
} from '@/lib/content';
import { CONTENT_LICENSE_NAME, CONTENT_LICENSE_URL, SITE_URL, siteUrl } from '@/lib/site';
import { getQuestions } from '@/lib/supabase';
import { filterPublishableQuestions } from '@/lib/indexing-policy';
import { getSourceRefs } from '@/lib/trust';
import { getReviewTier, getRiskClass, getUpgradePriority } from '@/lib/taxonomy';

export async function GET() {
  const questions = filterPublishableQuestions(await getQuestions());
  const answers = questions.map((question) => {
    const citation = getQuestionCitation(question);
    const priority = getUpgradePriority(question);

    return {
      id: question.id,
      slug: question.slug,
      canonical_url: citation.url,
      api_url: siteUrl(`/api/v1/answers/${question.slug}`),
      full_text_available: true,
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
  });

  return Response.json(
    {
      name: 'Deeper Global Answer Index',
      base_url: SITE_URL,
      generated_at: new Date().toISOString(),
      count: answers.length,
      total_count: answers.length,
      limit: answers.length,
      offset: 0,
      next_offset: null,
      license: CONTENT_LICENSE_NAME,
      license_url: CONTENT_LICENSE_URL,
      api: {
        openapi: siteUrl('/api/v1/openapi.json'),
        list: siteUrl('/api/v1/answers'),
        answer_template: siteUrl('/api/v1/answers/{slug}'),
      },
      clinical_boundary: 'Educational content only; not a substitute for diagnosis, treatment, or emergency support.',
      answers,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
