import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Deeper Protocol | Mental Health Search',
  description: 'Learn about how we structure and validate mental health information for AI and human search.',
}

export default function ProtocolPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>The Deeper Protocol</h1>
        <p className="lead">
          Our approach to structuring mental health information for both human readers and AI systems.
        </p>
        
        <h2>Evidence-Based Foundation</h2>
        <p>
          Every answer in our database is grounded in peer-reviewed research and clinical guidelines from reputable mental health organizations.
        </p>

        <h2>AI-Optimized Structure</h2>
        <p>
          We structure our content to be easily parsed by both search engines and AI language models, while maintaining natural readability for humans.
        </p>

        <h2>Semantic Markup</h2>
        <p>
          All content is enhanced with proper schema.org markup and semantic HTML to ensure maximum understanding by AI systems.
        </p>

        <h2>Regular Updates</h2>
        <p>
          Our content is regularly reviewed and updated to reflect the latest research and best practices in mental health care.
        </p>
      </div>
    </main>
  )
}
