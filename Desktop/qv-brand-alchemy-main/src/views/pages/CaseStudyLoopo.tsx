import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const CaseStudyLoopo = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero / Snapshot */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8 font-medium">
            Case Study
          </p>
          <img 
            src="/lovable-uploads/loopo-logo.svg" 
            alt="Loopo" 
            className="h-12 md:h-16 mb-12"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Category</p>
              <p className="text-foreground font-light">Pet-Tech / Lifestyle</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Stage</p>
              <p className="text-foreground font-light">Pre-Launch (Kickstarter)</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Duration</p>
              <p className="text-foreground font-light">~10 weeks</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Engagement</p>
              <p className="text-foreground font-light">Brand Strategy, Naming, Identity, GTM</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Investment</p>
              <p className="text-foreground font-light">$20,500+ (Ongoing work)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* The Challenge */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-8 tracking-tight leading-[1.1]">
            Building a premium pet-tech brand from zero—<span className="italic font-light">without false starts.</span>
          </h2>
          
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Loopo began as an early-stage pet-tech concept with strong product intuition but no cohesive brand system. The challenge wasn't creating a logo—it was defining a premium, emotionally resonant brand that could support a Kickstarter launch, future products, and long-term category ambition.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              The founder needed clarity, speed, and momentum—without the churn, over-exploration, or second-guessing that often stalls early launches.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Visual Gallery */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/lovable-uploads/loopo-website-hero.png" 
              alt="Loopo website homepage showing the product and messaging"
              className="w-full"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/lovable-uploads/loopo-brand-collage.png" 
              alt="Loopo brand identity system showing merchandise, app icon, and logo"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* The Approach */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-3 tracking-tight leading-[1.1]">
            From zero to <span className="italic font-light">launch-ready brand system.</span>
          </h2>
          <p className="text-muted-foreground mb-12">
            A principal-led, end-to-end brand and GTM engagement.
          </p>
          
          <ul className="space-y-4">
            <li className="text-lg text-muted-foreground font-light leading-relaxed pl-6 border-l-2 border-brand-primary">
              Brand naming and positioning — origination of the <em>Loopo</em> name, informed by market analysis, category dynamics, and long-term brand extensibility
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed pl-6 border-l-2 border-brand-primary">
              Competitive and category analysis
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed pl-6 border-l-2 border-brand-primary">
              Customer personas and behavioral insight synthesis
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed pl-6 border-l-2 border-brand-primary">
              Brand core definition (purpose, promise, pillars, personality)
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed pl-6 border-l-2 border-brand-primary">
              Visual identity system (logo, typography, color palette, and style guide)
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed pl-6 border-l-2 border-brand-primary">
              Brand story, messaging strategy, and narrative framework
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed pl-6 border-l-2 border-brand-primary">
              Website strategy and structural guidance
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed pl-6 border-l-2 border-brand-primary">
              Creative direction for photo/video shoots and founder content
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed pl-6 border-l-2 border-brand-primary">
              PR and launch marketing plans and assets
            </li>
          </ul>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* What Changed */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-12 tracking-tight leading-[1.1]">
            What changed <span className="italic font-light">as a result of the work</span>
          </h2>
          
          <ul className="space-y-5">
            <li className="text-lg text-muted-foreground font-light leading-relaxed flex items-start gap-4">
              <span className="text-brand-primary font-serif text-xl">→</span>
              The founder gained confidence in the brand's direction and market signal
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed flex items-start gap-4">
              <span className="text-brand-primary font-serif text-xl">→</span>
              Messaging became coherent across product, site, and launch materials
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed flex items-start gap-4">
              <span className="text-brand-primary font-serif text-xl">→</span>
              Creative and strategic decisions accelerated instead of stalling
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed flex items-start gap-4">
              <span className="text-brand-primary font-serif text-xl">→</span>
              The brand reached launch readiness without rework or dilution
            </li>
            <li className="text-lg text-muted-foreground font-light leading-relaxed flex items-start gap-4">
              <span className="text-brand-primary font-serif text-xl">→</span>
              Loopo emerged with a foundation designed to scale beyond Kickstarter
            </li>
          </ul>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Testimonial */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <blockquote className="space-y-6">
            <p className="font-serif text-2xl md:text-3xl text-foreground font-normal leading-relaxed italic">
              "Rick is an exceptional Brand and GTM strategist. Having worked with several branding professionals for startups, I can confidently say Rick operates on a different level.
            </p>
            <p className="font-serif text-2xl md:text-3xl text-foreground font-normal leading-relaxed italic">
              He has a deep understanding of consumer psychology and how the individual elements of a brand come together to stand out and perform. He rapidly ideates, pressure-tests ideas, and gives clear, actionable guidance—while communicating frequently and effectively.
            </p>
            <p className="font-serif text-2xl md:text-3xl text-foreground font-normal leading-relaxed italic">
              Rick thrives in fast-moving, ambiguous startup environments and consistently drives progress without heavy direction. His work materially increased our confidence heading into launch and gave us a brand foundation we can scale for years."
            </p>
            <footer className="pt-8 flex items-center gap-4">
              <img 
                src="/lovable-uploads/dial-devaney-headshot.png" 
                alt="Dial Devaney, Founder of Loopo"
                className="w-16 h-16 rounded-full object-cover"
              />
              <p className="text-foreground font-light">
                Dial Devaney<br />
                <span className="text-muted-foreground text-sm">Founder, Loopo</span>
              </p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-8 tracking-tight leading-[1.1]">
            Why this engagement <span className="italic font-light">matters</span>
          </h2>
          
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              This project reflects how QV Brands operates at its best: principal-led strategy, rapid synthesis, and decisive execution—especially in ambiguous, high-stakes environments where momentum matters more than polish.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              This was not a logo project. It was a brand system designed to carry a company through launch and into its next phase of growth.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-6 tracking-tight leading-[1.1]">
            Facing a <span className="italic font-light">similar moment?</span>
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            If you're preparing for launch or repositioning and need clarity before committing resources, a Signal Call is the fastest way to diagnose what matters next.
          </p>
          
          <Button
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-8 rounded-none"
          >
            <a 
              href="https://calendar.app.google/sXUh3xXCDNCKir8u6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book a Signal Call
            </a>
          </Button>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="py-12" />
    </div>
  );
};

export default CaseStudyLoopo;
