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
    .order('id', { ascending: true })
    .limit(1000);

  const questions = data || [];

  return (
    <main className="bg-white text-black min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Mental Health Questions & Answers</h1>
        <p className="text-lg mb-10">Browse {questions.length} evidence-informed answers to mental health questions.</p>

        <div className="space-y-8">
          {questions.map((q) => (
            <div
              key={q.id}
              className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  href={`/answers/${q.slug}`}
                  className="text-blue-700 underline hover:text-blue-900"
                >
                  {q.question}
                </Link>
              </h2>
              <p className="text-gray-800 mb-2">{q.short_answer}</p>
              <div className="text-sm text-gray-600">{q.category}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
