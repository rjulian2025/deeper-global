import Link from "@/components/Link";

const BlogMadBuddha = () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Mad Men Are Dead. Meet the Mad Buddha.",
    "description": "The ad world's old guard is fading. A new archetype is rising—one who blends creative swagger with spiritual precision. Enter the Mad Buddha.",
    "author": {
      "@type": "Person",
      "name": "Rick Julian",
      "jobTitle": "Brand Strategist",
      "url": "https://www.qvbrands.com/meet-the-strategist"
    },
    "publisher": {
      "@type": "Organization",
      "name": "QV BRANDS",
      "url": "https://www.qvbrands.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.qvbrands.com/logo.png"
      }
    },
    "datePublished": "2025-01-11",
    "dateModified": "2025-01-11",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.qvbrands.com/blog/mad-buddha"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://www.qvbrands.com/blog-images/mad-buddha.jpg",
      "alt": "A serene figure in a blazer seated in a futuristic zendo, glowing with insight"
    },
    "url": "https://www.qvbrands.com/blog/mad-buddha"
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Mad Men Are Dead. Meet the Mad Buddha.
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-8">
              <span>By Rick Julian</span>
              <span>•</span>
              <time dateTime="2025-01-11">January 11, 2025</time>
              <span>•</span>
              <span>4 min read</span>
            </div>
          </header>

          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-4">
                Brand Strategy with a Spine and a Soul
              </h2>
              <p className="text-lg leading-relaxed mb-6">
                The Mad Men era gave us big egos, great suits, and messaging that could manipulate. The Mad Buddha era gives us something else: swagger without chaos, precision without pretension.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                This is branding in the thin air—where clarity, cultural resonance, and strategy converge.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">
                From Manipulation to Meaning
              </h3>
              <p className="text-lg leading-relaxed mb-6">
                The future doesn't need more tricks. It needs more truth. Mad Buddha brands don't scream. They radiate. They don't sell noise. They offer stillness in a storm.
              </p>
              <div className="bg-muted p-6 rounded-lg my-8">
                <p className="text-base italic">
                  Image: A serene figure in a blazer seated in a futuristic zendo, glowing with insight
                </p>
              </div>
              <p className="text-lg leading-relaxed mb-6">
                In a world drowning in manufactured urgency, the Mad Buddha approach cuts through. It's not about being louder—it's about being clearer. Not about forcing attention—but earning it through authentic presence.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-4">
                The New Brand Architecture
              </h3>
              <p className="text-lg leading-relaxed mb-6">
                Mad Buddha brands operate from a different foundation. They build systems, not campaigns. They create protocols, not just promises. Every touchpoint becomes an extension of their core clarity.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                This isn't spiritual bypassing disguised as strategy. It's the recognition that in an age of infinite choice, the brands that survive will be the ones that help people think less, not more.
              </p>
            </section>

            <section className="border-t pt-8">
              <p className="text-lg">
                Read next: <Link 
                  href="/blog/clarity-operating-system" 
                  className="text-primary hover:underline font-medium"
                >
                  The Clarity Operating System
                </Link>
              </p>
            </section>

            <section className="bg-primary/5 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Ready to Channel Your Inner Mad Buddha?</h3>
              <p className="mb-6">
                Let's build a brand that radiates clarity instead of creating noise.
              </p>
              <Link 
                href="/contact" 
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Begin Your Transformation
              </Link>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogMadBuddha;