import { getCategorySummaries } from '@/lib/content';
import { filterPublishableQuestions } from '@/lib/indexing-policy';
import { SITE_URL, siteUrl } from '@/lib/site';
import { getQuestions } from '@/lib/supabase';
import { getCanonicalTopic, getCanonicalTopicSummaries } from '@/lib/taxonomy';

export async function GET() {
  const questions = filterPublishableQuestions(await getQuestions());

  // Raw (uncanonicalized) category pages — /entities/[entity] and
  // /categories/[category] — are built from question.category/raw_category
  // directly and often fragment into several pages per canonical topic (e.g.
  // "Existential", "Spiritual Doubt", and "Life Purpose" all roll up into the
  // single canonical "Meaning, Faith & Existential Questions" topic). There is
  // no one raw slug that reliably matches a canonical topic slug, so list the
  // actual raw-category pages per topic instead of guessing a single URL.
  const rawCategoryPagesByTopicSlug = new Map<
    string,
    { name: string; slug: string; answer_count: number; url: string }[]
  >();
  for (const raw of getCategorySummaries(questions)) {
    const topicSlug = getCanonicalTopic(raw.name).slug;
    const pages = rawCategoryPagesByTopicSlug.get(topicSlug) ?? [];
    pages.push({
      name: raw.name,
      slug: raw.slug,
      answer_count: raw.count,
      url: siteUrl(`/entities/${raw.slug}`),
    });
    rawCategoryPagesByTopicSlug.set(topicSlug, pages);
  }

  const entities = getCanonicalTopicSummaries(questions).map((entity) => {
    // /topics/{slug} always builds — every canonical topic in taxonomy.ts has
    // a static page regardless of answer count, so this URL never 404s.
    const canonicalTopicUrl = siteUrl(`/topics/${entity.slug}`);

    return {
      name: entity.name,
      slug: entity.slug,
      // canonical_url / topic_url previously pointed at /entities/{slug} and
      // /categories/{slug}, which assume a raw-category page exists at the
      // canonical topic slug — it often doesn't (see raw_category_pages
      // below). Both now resolve to the canonical topic page, which always
      // builds. canonical_topic_url is kept for backward compatibility and is
      // identical.
      canonical_url: canonicalTopicUrl,
      topic_url: canonicalTopicUrl,
      canonical_topic_url: canonicalTopicUrl,
      aliases: entity.aliases,
      answer_count: entity.count,
      representative_answer_slugs: entity.relatedQuestionSlugs,
      raw_category_pages: rawCategoryPagesByTopicSlug.get(entity.slug) ?? [],
    };
  });

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
