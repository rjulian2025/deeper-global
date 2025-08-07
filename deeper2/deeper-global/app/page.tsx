import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-8">
          Mental Health Answers, Optimized for AI
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300">
          Deeper is an AI-structured search engine for mental health. Browse 1,000+ evidence-informed answers, crafted for both humans and machines.
        </p>
        <Link 
          href="/answers"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Explore Answers
        </Link>
      </div>
    </main>
  )
}
