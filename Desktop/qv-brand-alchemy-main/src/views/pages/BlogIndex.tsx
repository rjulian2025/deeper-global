import Link from "@/components/Link";
import CTAFooter from "@/components/CTAFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    title: "The Clarity Operating System",
    slug: "/blog/clarity-operating-system",
    excerpt: "In a world drowning in noise, clarity is the new power move. Discover how QV Brands' Clarity OS brings order, presence, and meaning to modern brand building.",
    readTime: "5 min read",
    date: "January 11, 2025"
  },
  {
    title: "Mad Men Are Dead. Meet the Mad Buddha.",
    slug: "/blog/mad-buddha",
    excerpt: "The ad world's old guard is fading. A new archetype is rising—one who blends creative swagger with spiritual precision. Enter the Mad Buddha.",
    readTime: "4 min read",
    date: "January 11, 2025"
  },
  {
    title: "Brand Architecture for the Second Brain Era",
    slug: "/blog/second-brain-architecture",
    excerpt: "Your audience is outsourcing memory and meaning to digital systems. Here's how to build a brand they can actually remember.",
    readTime: "6 min read",
    date: "January 11, 2025"
  },
  {
    title: "The Death of the Logo: Why Strategy Is the New Signal",
    slug: "/blog/strategy-is-the-new-logo",
    excerpt: "In the AI era, design alone won't save you. Rick Julian explains why clarity architecture and narrative systems now outrank visual identity.",
    readTime: "8 min read",
    date: "2024"
  },
  {
    title: "How Founders Can Build Brands That Scale Without Losing Soul",
    slug: "/blog/scale-without-losing-soul",
    excerpt: "Scaling doesn't require dilution. Learn how QV BRANDS helps high-integrity founders grow without compromising identity.",
    readTime: "6 min read",
    date: "2024"
  },
  {
    title: "What Is a Clarity System? A New Operating Model for Modern Brands",
    slug: "/blog/what-is-a-clarity-system",
    excerpt: "Forget vague positioning decks. Learn what a 'Clarity System' is and how it transforms identity into operational power.",
    readTime: "7 min read",
    date: "2024"
  },
  {
    title: "Brand Strategy in the Synthetic Content Era",
    slug: "/blog/brand-strategy-in-synthetic-era",
    excerpt: "As AI generates infinite noise, clarity becomes a brand's only shield. This is how QV BRANDS builds brands that stand apart.",
    readTime: "9 min read",
    date: "2024"
  },
  {
    title: "The 4 Brand Archetypes That Will Survive the AI Wave",
    slug: "/blog/brand-archetypes-ai-era",
    excerpt: "In the coming algorithmic collapse, only a few brand types will endure. Rick Julian outlines the four strategic postures that will matter most.",
    readTime: "10 min read",
    date: "2024"
  }
];

const BlogIndex = () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "QV BRANDS Blog",
    "url": "https://www.qvbrands.com/blog",
    "description": "Strategic insights on brand clarity, identity architecture, and building brands that endure in the AI era.",
    "publisher": {
      "@type": "Organization",
      "name": "QV BRANDS",
      "url": "https://www.qvbrands.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.qvbrands.com/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <div className="min-h-screen bg-brand-dark text-brand-text">
        <main className="pt-20">
          <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="mb-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-hero mb-6">
                Strategic Insights
              </h1>
              <p className="text-xl text-brand-text-light max-w-3xl mx-auto">
                Essential thinking on brand strategy, clarity systems, and building identity that endures in the AI era.
              </p>
            </div>
            
            {/* Blog Posts Grid */}
            <div className="grid gap-8 md:gap-12">
              {blogPosts.map((post, index) => (
                <Card key={post.slug} className="bg-brand-surface border-brand-accent/20 hover:border-brand-accent/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-brand-text-light mb-4">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl text-brand-hero hover:text-brand-accent transition-colors">
                      <Link href={post.slug}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-lg text-brand-text-light leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" size="lg" className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark">
                      <Link href={post.slug}>
                        Read Article →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* CTA Section */}
            <div className="mt-20 text-center">
              <div className="bg-brand-surface border border-brand-accent/20 rounded-lg p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-brand-hero mb-4">
                  Ready to Build Your Clarity System?
                </h2>
                <p className="text-lg text-brand-text-light mb-8 max-w-2xl mx-auto">
                  Transform your brand from confusion to clarity. Let's discuss how strategic architecture can unlock your company's true potential.
                </p>
                <Button asChild size="lg" className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90">
                  <Link href="/meet-the-strategist">
                    Meet the Strategist
                  </Link>
                </Button>
              </div>
            </div>
            {/* Cross-hub Links */}
            <div className="mt-16 pt-8 border-t border-brand-accent/20">
              <h3 className="text-sm font-medium text-brand-text-light uppercase tracking-wider mb-4">Also Explore</h3>
              <nav className="flex flex-wrap gap-x-8 gap-y-3">
                <Link href="/strategic-answers" className="text-brand-hero hover:text-brand-accent transition-colors">
                  Strategic Growth Answers →
                </Link>
                <Link href="/answers" className="text-brand-hero hover:text-brand-accent transition-colors">
                  Brand Strategy Knowledge Base →
                </Link>
                <Link href="/rick-julian" className="text-brand-hero hover:text-brand-accent transition-colors">
                  About Rick Julian →
                </Link>
                <Link href="/packages" className="text-brand-hero hover:text-brand-accent transition-colors">
                  Engagement Packages →
                </Link>
              </nav>
            </div>
          </div>
        </main>
        <CTAFooter />
      </div>
    </>
  );
};

export default BlogIndex;