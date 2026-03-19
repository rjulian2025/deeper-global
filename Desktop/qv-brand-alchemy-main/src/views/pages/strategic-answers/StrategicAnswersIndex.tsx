import Link from "@/components/Link";
import CTAFooter from "@/components/CTAFooter";
import {
  generateStrategicAnswersCollectionSchema,
  strategicAnswersBreadcrumb,
  strategicAnswerPages,
} from "@/lib/schema-entities";

const fractionalLeadership = strategicAnswerPages.slice(0, 5);
const growthArchitecture = strategicAnswerPages.slice(5, 10);
const brandLeadership = strategicAnswerPages.slice(10, 13);

const descriptions: Record<string, string> = {
  "fractional-cmo-cost": "What determines the investment and what you should expect at each tier.",
  "fractional-cmo-vs-agency": "When embedded leadership outperforms outsourced execution.",
  "when-to-hire-fractional-cmo": "The signals that indicate your company needs strategic leadership, not more tactics.",
  "is-fractional-cmo-worth-it": "How to evaluate ROI on installed executive marketing leadership.",
  "fractional-cmo-saas-guide": "How fractional CMO engagement works for SaaS companies at growth stage.",
  "why-growth-stalls": "The structural reasons companies plateau after initial traction.",
  "why-rebrands-fail": "Why most brand overhauls fail to change market position.",
  "align-sales-and-marketing": "The strategic architecture that makes alignment operational, not aspirational.",
  "gtm-system-not-campaign": "Why campaigns without a system underneath them produce diminishing returns.",
  "installed-leadership-model": "What it means to install strategic leadership vs. advise from the outside.",
  "what-does-a-cbo-do": "The executive role that owns positioning, narrative, and brand-led growth strategy.",
  "brand-strategy-fails-without-leadership": "Why strategy documents fail without a senior leader to install and govern them.",
  "brand-positioning-vs-brand-marketing": "The sequencing error that causes marketing spend to underperform.",
};

const StrategicAnswersIndex = () => {
    const collectionSchema = generateStrategicAnswersCollectionSchema();

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-3xl mx-auto px-8">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-6 tracking-tight leading-tight">
            Strategic Growth Answers for Founders
          </h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            Authoritative perspectives on fractional leadership, growth architecture, and the strategic decisions that determine whether companies scale or stall.
          </p>
        </div>
      </section>

      {/* Brand Leadership */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-10 tracking-tight">
            Brand Leadership
          </h2>
          <div className="space-y-8">
            {brandLeadership.map((page) => (
              <div key={page.slug}>
                <Link
                  href={`/strategic-answers/${page.slug}`}
                  className="font-medium text-foreground hover:text-accent transition-colors text-lg"
                >
                  {page.title}
                </Link>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  {descriptions[page.slug]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fractional Leadership */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-10 tracking-tight">
            Fractional Leadership
          </h2>
          <div className="space-y-8">
            {fractionalLeadership.map((page) => (
              <div key={page.slug}>
                <Link
                  href={`/strategic-answers/${page.slug}`}
                  className="font-medium text-foreground hover:text-accent transition-colors text-lg"
                >
                  {page.title}
                </Link>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  {descriptions[page.slug]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Architecture */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-10 tracking-tight">
            Growth Architecture
          </h2>
          <div className="space-y-8">
            {growthArchitecture.map((page) => (
              <div key={page.slug}>
                <Link
                  href={`/strategic-answers/${page.slug}`}
                  className="font-medium text-foreground hover:text-accent transition-colors text-lg"
                >
                  {page.title}
                </Link>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  {descriptions[page.slug]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-hub Links */}
      <section className="py-16 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Also Explore
          </h3>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-base">
            <Link href="/answers" className="text-foreground hover:text-accent transition-colors font-light">
              Brand Strategy Knowledge Base →
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

      <CTAFooter />
    </div>
  );
};

export default StrategicAnswersIndex;
