import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function QuestionDetail({ params }: Props) {
  const { slug } = await params
  
  const { data } = await supabase
    .from('questions_master')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!data) return notFound()

  return (
    <div className="bg-white text-black min-h-screen px-4 py-10">
      <article className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/answers" className="text-blue-600 hover:underline">
            ← Back to all questions
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-black">{data.question}</h1>
        <p className="text-black mb-4">Medically Reviewed · 2 min read · by Dr. D.K. Gore</p>

        <section className="mb-6 bg-gray-50 border rounded p-4">
          <h2 className="font-semibold text-black">Quick Answer</h2>
          <p className="text-black">{data.short_answer}</p>
        </section>

        {data.bullets && data.bullets.length > 0 && (
          <section className="mb-6">
            <h3 className="font-semibold text-black">Key Points</h3>
            <ul className="list-disc ml-6 space-y-1 text-black">
              {data.bullets.map((pt: string, index: number) => (
                <li key={index}>{pt}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="prose max-w-none">
          <h3 className="font-semibold text-black">Detailed Answer</h3>
          <div className="text-black" dangerouslySetInnerHTML={{ __html: data.answer }} />
        </section>
      </article>
    </div>
  )
}
