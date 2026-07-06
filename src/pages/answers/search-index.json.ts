import { orderAnswersLibrary } from '@/lib/answers-library-order';
import { buildAnswersSearchIndex } from '@/lib/answers-search-index';
import { filterPublishableQuestions } from '@/lib/indexing-policy';
import { getQuestions } from '@/lib/supabase';

export async function GET() {
  const questions = orderAnswersLibrary(filterPublishableQuestions(await getQuestions()));

  return Response.json(buildAnswersSearchIndex(questions), {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
