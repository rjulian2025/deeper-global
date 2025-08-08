import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Question {
  id: string;
  slug: string;
  question: string;
  short_answer: string;
  category: string;
}

export default async function AnswersPage() {
  const { data } = await supabase
    .from('questions_master')
    .select('id, slug, question, short_answer, category')
    .limit(1000);

  const questions = data || [];

  const grouped = questions.reduce((acc, q) => {
    acc[q.category] = acc[q.category] || [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, typeof questions>);

  return (
    <main className="bg-white text-black min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Ask Anything. Deeper Listens.</h1>
          <p className="text-lg text-gray-700">1,000+ evidence-informed answers for humans and machines.</p>
        </header>

        {Object.entries(grouped).map(([category, qs]) => (
          <section key={category} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <ul className="space-y-4">
              {qs.slice(0, 3).map((q) => (
                <li key={q.id} className="border rounded-lg p-4 hover:shadow-sm transition">
                  <Link href={`/answers/${q.slug}`}>
                    <h3 className="text-lg font-medium text-blue-700 hover:underline">
                      {q.question}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-700 mt-1">{q.short_answer}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
