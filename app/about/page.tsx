import { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import ClientOnly from '@/components/ClientOnly'

export const metadata: Metadata = {
  title: 'About Deeper | Our Mission & Team',
  description: 'Learn about our mission to make mental health information more accessible through AI-optimized search.',
}

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1>About Deeper</h1>
          <p className="lead">
            Making mental health information more accessible through AI-optimized search.
          </p>

          <h2>Our Mission</h2>
          <p>
            Deeper exists to bridge the gap between mental health information and those who need it most. By structuring content for both AI systems and human readers, we ensure that quality mental health resources are easily discoverable.
          </p>

          <h2>Curation Philosophy</h2>
          <ul>
            <li>Evidence-based content from peer-reviewed sources</li>
            <li>Clear, accessible language for all readers</li>
            <li>Structured for optimal AI and search engine understanding</li>
            <li>Regular updates to reflect current research</li>
          </ul>

          <h2>Frequently Asked Questions</h2>
          
          <h3>How do you ensure accuracy?</h3>
          <p>
            All content is sourced from peer-reviewed research and validated clinical guidelines. Our team regularly reviews and updates information to reflect current best practices.
          </p>

          <h3>Why focus on AI optimization?</h3>
          <p>
            As AI systems become increasingly important in how people find and consume information, we believe mental health content should be structured to work seamlessly with these systems while maintaining human readability.
          </p>

          <h3>Can I contribute?</h3>
          <p>
            We welcome feedback and suggestions from mental health professionals and researchers. Please contact us to learn more about collaboration opportunities.
          </p>
        </div>
      </main>
      <ClientOnly>
        <GoogleAnalytics />
      </ClientOnly>
    </>
  )
}
