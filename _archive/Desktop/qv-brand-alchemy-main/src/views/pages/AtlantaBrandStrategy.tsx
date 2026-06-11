import { useEffect } from "react";
import Link from "@/components/Link";
import CTAFooter from "@/components/CTAFooter";
import { SCHEMA_IDS } from "@/lib/schema-entities";

const BASE_URL = "https://www.qvbrands.com";

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Brand Strategy & Creative Direction — Atlanta",
  "description": "Brand strategy and creative direction practice based in Atlanta, serving founder-led companies and growth-stage businesses navigating complexity.",
  "url": `${BASE_URL}/atlanta-brand-strategy`,
  "author": {
    "@id": SCHEMA_IDS.person
  },
  "publisher": {
    "@id": SCHEMA_IDS.organization
  },
  "areaServed": {
    "@type": "City",
    "name": "Atlanta",
    "addressRegion": "GA",
    "addressCountry": "US"
  },
  "isPartOf": {
    "@id": SCHEMA_IDS.website
  }
};

const AtlantaBrandStrategy = () => {
    return (
    <div className="min-h-screen font-sans bg-background">
      <article className="pt-40 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-8 tracking-tight leading-[1.1]">
              Brand Strategy & Creative Direction — Atlanta
            </h1>
          </header>

          <div className="prose prose-lg max-w-none">
            {/* Opening Paragraph */}
            <p className="text-xl text-foreground font-light leading-relaxed mb-16">
              QV is a brand strategy and creative direction practice based in Atlanta, working with companies facing consequential decisions. The work extends beyond the city—serving companies across the country and internationally—but the base matters. Atlanta provides proximity to real businesses making real decisions: founder-led companies, private equity-backed growth plays, and enterprises navigating inflection points. That proximity shapes the work.
            </p>

            {/* Why Atlanta */}
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-6 tracking-tight">
              Why Atlanta
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              Atlanta is dense with decision-making businesses. Not startups chasing hypothetical scale, but companies with revenue, employees, and the complexity that comes with both. Founder-led and privately held companies face tradeoffs that venture-backed companies can defer. Growth-stage businesses encounter brand problems that early-stage companies don't yet recognize.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              The city sits at an intersection of enterprise infrastructure, cultural production, and regional ambition. Companies here tend to be pragmatic. They've survived long enough to know what they need and skeptical enough to recognize what they don't.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-16">
              This is not about serving a local market. It's about being grounded in an environment where brand decisions carry weight and the people making them are accountable for outcomes.
            </p>

            {/* How the Work Is Done */}
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-6 tracking-tight">
              How the Work Is Done
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              The work is decision-making under constraint. Brand strategy is not ideation or exploration—it's the discipline of making <Link href="/answers/what-brand-strategy-actually-is" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">positioning choices</Link> that hold under pressure. Creative direction is not preference or aesthetics—it's the <Link href="/answers/what-creative-direction-controls" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">authority to ensure those choices become visible</Link>, coherent, and felt.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              This is not exploratory work. There are no workshops designed to generate options without resolution. No feedback sessions that defer judgment indefinitely. The engagement model is built around clarity: what the brand must do, why it must do it, and how to make that happen.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              The practice operates with accountability. Strategy and direction are delivered by the same person who defines them. There is no handoff, no translation layer, no dilution between thinking and execution.
            </p>

            {/* Subtle Cross-Link */}
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              For companies navigating brand decisions with real stakes, <Link href="/consultation" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">a focused consultation</Link> is the entry point.
            </p>
          </div>
        </div>
      </article>

      <CTAFooter />
    </div>
  );
};

export default AtlantaBrandStrategy;
