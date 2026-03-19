import Link from "@/components/Link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import CTAFooter from "@/components/CTAFooter";
import AuthorPageSchema from "@/components/AuthorPageSchema";

const RickJulian = () => {
    return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      <AuthorPageSchema />
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end">
        <div className="absolute inset-0 bg-foreground/50 z-10" />
        <div className="absolute inset-0">
          <img
            src="/lovable-uploads/39805efc-faff-433d-92ef-9412222c4d45.png"
            alt="Rick Julian"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="relative z-20 max-w-3xl mx-auto px-8 py-24 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-background mb-4 tracking-tight">
            Rick Julian
          </h1>
          <p className="text-lg text-background/80 font-light leading-relaxed">
            Fractional CMO. Brand Growth Architect. Creative Director.
          </p>
        </div>
      </section>

      {/* Flagship Proof Vignette — Fathom */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-8">
          <div className="border-l-4 border-accent pl-8">
            <p className="font-serif text-xl md:text-2xl text-foreground font-light leading-relaxed italic mb-6">
              "A cruise line had the ship. They didn't have the signal."
            </p>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-4">
              When Fathom launched as the first social-impact cruise brand, the category didn't exist yet. Julian architected the brand narrative, creative direction, and go-to-market system that positioned a new category within Carnival Corporation's portfolio — translating a complex social mission into a market signal that moved bookings before the ship ever sailed.
            </p>
            <p className="text-base text-muted-foreground font-light">
              Brand architecture. Narrative strategy. Growth system. One engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Overview */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12 tracking-tight">
            Experience Overview
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-foreground font-light leading-relaxed">
              Thirty years of brand architecture, narrative strategy, and growth leadership across global enterprises and founder-led companies. The work spans category creation, market repositioning, and growth system installation for organizations ranging from Fortune 100 corporations to venture-backed startups.
            </p>
            <p className="text-lg text-foreground font-light leading-relaxed">
              The through-line is consistent: install strategic clarity that compounds. Build brand systems that survive contact with the market. Ensure every growth lever connects back to a coherent narrative.
            </p>
          </div>
        </div>
      </section>

      {/* Operating Philosophy */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12 tracking-tight">
            Operating Philosophy
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Principal-led.</h3>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                No account managers. No junior strategists interpreting your vision. Direct access to 30 years of pattern recognition and strategic judgment.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Narrative first.</h3>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                Every system, campaign, and growth lever is anchored to a narrative architecture that gives the brand coherence under pressure. Tactics without narrative are noise.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">Systems that compound.</h3>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                Growth isn't a campaign cycle. It's an installed operating system — demand generation, positioning, and market optics working as a single mechanism.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-2">AI accelerates. Judgment decides.</h3>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                AI is integrated into every workflow — research, content velocity, market analysis. But strategic judgment is never delegated to a model. The machine accelerates; the strategist decides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Method */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12 tracking-tight">
            Strategic Method
          </h2>
          <div className="space-y-10">
            {[
              { step: "01", title: "Diagnose", description: "Map the real constraint. Most companies misidentify their growth blocker. The first move is always accurate diagnosis — market position, narrative gaps, operational friction." },
              { step: "02", title: "Architect", description: "Design the strategic system. Brand architecture, messaging framework, growth model, and go-to-market blueprint — built as an integrated structure, not a collection of deliverables." },
              { step: "03", title: "Install", description: "Embed the system into the organization. Strategy that lives in a deck is decoration. Installation means the team operates from the new architecture daily." },
              { step: "04", title: "Steward", description: "Protect the signal under pressure. Markets shift, teams turn over, competitors respond. Stewarding the brand means maintaining strategic coherence through turbulence." },
              { step: "05", title: "Transition", description: "Build internal capacity. The goal is a self-sustaining strategic operation — not permanent dependency on an external advisor." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <span className="text-sm font-medium text-accent mt-1 shrink-0">{item.step}</span>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-base text-muted-foreground font-light leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Outcomes */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12 tracking-tight">
            Selected Outcomes
          </h2>
          <div className="space-y-8">
            {[
              "Architected brand and GTM system for a new cruise category within a $35B portfolio — from concept to market before the ship sailed.",
              "Installed growth architecture for a sustainability platform that repositioned from regional vendor to category-defining brand.",
              "Led strategic rebrand and messaging overhaul for a global technology company, aligning five business units under a single narrative.",
              "Built and installed a fractional CMO operating system for a founder-led SaaS company, tripling pipeline velocity in two quarters.",
            ].map((outcome, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-accent mt-1.5 shrink-0">—</span>
                <p className="text-base text-foreground font-light leading-relaxed">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Model */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12 tracking-tight">
            Leadership Model
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-foreground font-light leading-relaxed">
              Direct access. No layers. No handoffs. Every engagement is led by Rick Julian — not delegated to a team that needs to "get up to speed."
            </p>
            <p className="text-lg text-foreground font-light leading-relaxed">
              Execution is delivered through a trusted global network of senior specialists — designers, developers, media strategists, content architects — assembled per engagement based on what the project demands. No bench. No overhead. No dilution.
            </p>
          </div>
        </div>
      </section>

      {/* Long-Form Perspective */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-12 tracking-tight">
            On Clarity as Infrastructure
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-foreground font-light leading-relaxed">
              Most growth problems are clarity problems in disguise. The pipeline isn't broken — the signal is. The team isn't misaligned — the narrative is. The market isn't ignoring you — it can't find you.
            </p>
            <p className="text-lg text-foreground font-light leading-relaxed">
              Clarity isn't a tagline exercise. It's infrastructure. When a company knows exactly what it is, who it serves, and why its position is defensible, every downstream decision — hiring, pricing, partnerships, product — becomes faster and more precise.
            </p>
            <p className="text-lg text-foreground font-light leading-relaxed">
              That's what gets installed. Not a brand book. Not a campaign. A strategic operating system that the organization runs on.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-8 tracking-tight">
            Apply for Strategic Review
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed mb-10 max-w-xl mx-auto">
            A focused working session to diagnose your growth constraint and determine whether a strategic engagement is the right move.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 group px-10 py-6 text-lg rounded-none"
          >
            <a
              href="https://calendar.app.google/sXUh3xXCDNCKir8u6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book a Call
            </a>
          </Button>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-16 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <nav className="flex flex-wrap gap-x-8 gap-y-3 justify-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/strategic-answers" className="hover:text-foreground transition-colors">Strategic Answers</Link>
            <Link href="/answers" className="hover:text-foreground transition-colors">Knowledge Base</Link>
            <Link href="/packages" className="hover:text-foreground transition-colors">Packages</Link>
            <Link href="/clients" className="hover:text-foreground transition-colors">Clients</Link>
          </nav>
        </div>
      </section>

      <CTAFooter />
    </div>
  );
};

export default RickJulian;
