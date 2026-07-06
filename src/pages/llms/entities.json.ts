import { filterPublishableQuestions } from '@/lib/indexing-policy';
import { SITE_URL, siteUrl } from '@/lib/site';
import { getQuestions } from '@/lib/supabase';
import { getCanonicalTopicSummaries } from '@/lib/taxonomy';

export async function GET() {
  const questions = filterPublishableQuestions(await getQuestions());
  const entities = getCanonicalTopicSummaries(questions).map((entity) => ({
    name: entity.name,
    slug: entity.slug,
    canonical_url: siteUrl(`/entities/${entity.slug}`),
    topic_url: siteUrl(`/categories/${entity.slug}`),
    aliases: entity.aliases,
    answer_count: entity.count,
    representative_answer_slugs: entity.relatedQuestionSlugs,
  }));

  return Response.json(
    {
      name: 'Deeper Global Canonical Entity Map',
      base_url: SITE_URL,
      generated_at: new Date().toISOString(),
      count: entities.length,
      entities,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
