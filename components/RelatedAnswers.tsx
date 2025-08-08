import Link from 'next/link';
import { supabase } from '@/lib/supabase.server';

type Related = { slug: string; question: string; category: string };

export async function getRelatedAnswers(currentId: string, category: string, limit = 6): Promise<Related[]> {
  const { data, error } = await supabase
    .from('questions_master')
    .select('id, slug, question, category')
    .neq('id', currentId)
    .eq('category', category)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related answers:', error);
    return [];
  }

  return (data || []) as Related[];
}

export default async function RelatedAnswers({ currentId, category }: { currentId: string; category: string }) {
  const items = await getRelatedAnswers(currentId, category, 6);
  if (!items?.length) return null;
  
  return (
    <section className="mt-12 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">Related answers</h3>
      <ul className="grid gap-2">
        {items.map(it => (
          <li key={it.slug}>
            <Link 
              href={`/answers/${it.slug}`} 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {it.question}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
