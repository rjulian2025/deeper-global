import { buildRssFeed, getFeedItems } from '@/lib/feed';
import { getQuestions } from '@/lib/supabase';

export async function GET() {
  const questions = await getQuestions();
  const xml = buildRssFeed(getFeedItems(questions));

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
