import Link from "@/components/Link";
import CTAFooter from "@/components/CTAFooter";
import { generateAnswersCollectionSchema, answersBreadcrumb } from "@/lib/schema-entities";

const AnswersIndex = () => {
    const coreAnswers = [
    { title: "What Brand Strategy Actually Is", slug: "what-brand-strategy-actually-is" },
    { title: "What Creative Direction Really Controls", slug: "what-creative-direction-controls" },
    { title: "Branding vs Marketing", slug: "branding-vs-marketing" },
    { title: "When a Rebrand Is the Wrong Move", slug: "when-rebrand-is-wrong" },
    { title: "Founder-Led vs Committee-Led Brands", slug: "founder-led-vs-committee-led" },
    { title: "What Breaks When Brands Scale", slug: "what-breaks-when-brands-scale" },
  ];

  const comparisons = [
    { title: "Brand Strategy vs Brand Identity", slug: "brand-strategy-vs-brand-identity" },
    { title: "Creative Direction vs Design", slug: "creative-direction-vs-design" },
    { title: "Rebrand vs Refresh", slug: "rebrand-vs-refresh" },
    { title: "AI Branding vs Human Judgment", slug: "ai-branding-vs-human-judgment" },
  ];

  const momentOfNeed = [
    { title: "How to Tell If Your Brand Is the Problem", slug: "how-to-tell-if-brand-is-problem" },
    { title: "Why Your Company Looks Polished but Feels Weak", slug: "polished-but-weak" },
    { title: "We Hired an Agency and Nothing Changed", slug: "hired-agency-nothing-changed" },
  ];

  const collectionSchema = generateAnswersCollectionSchema();

  return (
    <div className="min-h-screen font-sans bg-background">
      {/* Hero */}
      <section className="pt-40 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 font-medium">
            Knowledge Base
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-10 tracking-tight leading-[1.1]">
            What actually matters
            <span className="block italic font-light">in brand strategy.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
            Authoritative explanations. No sales language. No filler.
          </p>
        </div>
      </section>

      {/* Core Answers */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-8 tracking-tight">
            Core Concepts
          </h2>
          <div className="space-y-4">
            {coreAnswers.map((item) => (
              <Link
                key={item.slug}
                href={`/answers/${item.slug}`}
                className="block py-4 border-b border-border hover:border-foreground transition-colors group"
              >
                <span className="text-lg md:text-xl text-foreground font-light group-hover:text-brand-primary transition-colors">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparisons */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-8 tracking-tight">
            Critical Distinctions
          </h2>
          <div className="space-y-4">
            {comparisons.map((item) => (
              <Link
                key={item.slug}
                href={`/answers/${item.slug}`}
                className="block py-4 border-b border-border hover:border-foreground transition-colors group"
              >
                <span className="text-lg md:text-xl text-foreground font-light group-hover:text-brand-primary transition-colors">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Moment of Need */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-8 tracking-tight">
            Diagnostic Questions
          </h2>
          <div className="space-y-4">
            {momentOfNeed.map((item) => (
              <Link
                key={item.slug}
                href={`/answers/${item.slug}`}
                className="block py-4 border-b border-border hover:border-foreground transition-colors group"
              >
                <span className="text-lg md:text-xl text-foreground font-light group-hover:text-brand-primary transition-colors">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-hub Links */}
      <section className="py-16 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Also Explore
          </h2>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-base">
            <Link href="/strategic-answers" className="text-foreground hover:text-accent transition-colors font-light">
              Strategic Growth Answers →
            </Link>
            <Link href="/blog" className="text-foreground hover:text-accent transition-colors font-light">
              Blog →
            </Link>
            <Link href="/rick-julian" className="text-foreground hover:text-accent transition-colors font-light">
              About Rick Julian →
            </Link>
            <Link href="/packages" className="text-foreground hover:text-accent transition-colors font-light">
              Engagement Packages →
            </Link>
            <Link href="/atlanta-brand-strategy" className="text-foreground hover:text-accent transition-colors font-light">
              Atlanta Brand Strategy →
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default AnswersIndex;
