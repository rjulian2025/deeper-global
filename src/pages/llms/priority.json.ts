import { displayCategory, getAnswerDisplayTitle, getQuestionCitation } from '@/lib/content';
import { SITE_URL } from '@/lib/site';
import { getQuestions } from '@/lib/supabase';
import { getReviewTier, getRiskClass, getUpgradePriority } from '@/lib/taxonomy';

export async function GET() {
  const questions = await getQuestions();
  const priority = questions
    .map((question) => {
      const citation = getQuestionCitation(question);
      const upgrade = getUpgradePriority(question);

      return {
        slug: question.slug,
        canonical_url: citation.url,
        title: getAnswerDisplayTitle(question),
        topic: displayCategory(question),
        risk_class: getRiskClass(question),
        review_tier: getReviewTier(question),
        score: upgrade.score,
        reasons: upgrade.reasons,
        source_count: Array.isArray(question.source_refs) ? question.source_refs.length : 0,
        reviewed_by: question.reviewed_by ?? null,
        updated_at: citation.dateModified,
      };
    })
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, 100);

  return Response.json(
    {
      name: 'Deeper Global Top 100 Upgrade Queue',
      base_url: SITE_URL,
      generated_at: new Date().toISOString(),
      scoring_model: 'risk + demand phrasing + missing sources + missing reviewer + legacy slug signals',
      count: priority.length,
      priority,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
