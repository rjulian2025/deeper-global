import { Card, CardContent } from "@/components/ui/card";
import Link from "@/components/Link";
import { Calendar, Clock } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      title: "Brand Archetypes in the AI Era",
      excerpt: "How traditional brand personalities evolve when everyone has access to the same creative tools.",
      date: "Dec 2024",
      readTime: "5 min read",
      slug: "/blog/brand-archetypes-ai-era"
    },
    {
      title: "What Is a Clarity System?",
      excerpt: "The strategic framework that helps brands make consistent decisions at scale.",
      date: "Nov 2024", 
      readTime: "8 min read",
      slug: "/blog/what-is-a-clarity-system"
    },
    {
      title: "Scale Without Losing Soul",
      excerpt: "Maintaining brand authenticity while growing beyond founder-market fit.",
      date: "Oct 2024",
      readTime: "6 min read", 
      slug: "/blog/scale-without-losing-soul"
    }
  ];

  return (
    <section className="py-16 bg-background relative">
      {/* Visual anchor - subtle gradient line */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Section header with tighter spacing */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-brand-accent/60 text-sm font-medium">↳ From the QV Desk</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-brand-hero mb-3 leading-tight">
            Recent Thinking
          </h2>
          <p className="text-brand-text-light max-w-2xl mx-auto">
            Insights on building brands that endure in an age of acceleration.
          </p>
        </div>
        
        {/* Blog cards with optimized layout */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="border border-border/50 shadow-none bg-transparent hover:bg-card/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-brand-text-light/70 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-brand-hero mb-3 leading-tight group-hover:text-brand-accent transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-brand-text-light leading-relaxed font-light mb-4">
                  {post.excerpt}
                </p>
                
                <Link 
                  href={post.slug}
                  className="text-brand-accent hover:text-brand-accent/80 font-medium text-sm transition-colors inline-flex items-center gap-1 group-hover:gap-2"
                >
                  Read More <span className="transition-all duration-300">→</span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* CTA with reduced spacing */}
        <div className="text-center">
          <Link 
            href="/blog"
            className="text-brand-accent hover:text-brand-accent/80 font-medium transition-colors inline-flex items-center gap-2 hover:gap-3"
          >
            View All Articles <span className="transition-all duration-300">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;