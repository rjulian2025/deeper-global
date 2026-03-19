import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import Link from "@/components/Link";
import CTAFooter from "@/components/CTAFooter";
const Packages = () => {
  const packages = [
    {
      name: "Brand Clarity Sprint",
      investment: "$1,500",
      description: "A focused, high-impact strategic reset for founders who need clarity before committing to a full brand system.",
      descriptionExpanded: "This is a short, fixed-scope strategic sprint designed to diagnose positioning, sharpen direction, and identify the highest-leverage growth opportunities. The fastest, lowest-risk way to experience senior-level strategy.",
      outcomes: [
        "Clear positioning and differentiation",
        "Immediate strategic direction",
        "Reduced decision friction",
        "Confidence to proceed to Foundation or Launch",
        "Practical next-step roadmap"
      ],
      includes: [
        "90-minute strategic deep dive (live session)",
        "Market & positioning teardown",
        "Competitive and category analysis",
        "Opportunity mapping",
        "Three prioritized strategic plays",
        "Custom written summary",
        "Recorded walkthrough and recommendations"
      ],
      delivery: "5 days | Fixed scope",
      cta: "Start with a Sprint",
      badge: "Fast Start",
      microcopy: "Most clients begin here before moving into Foundation or Launch."
    },
    {
      name: "Brand Foundation",
      investment: "$5k–$7.5k",
      description: "For early-stage or evolving brands that need strategic clarity before scaling.",
      outcomes: [
        "Clear positioning and differentiation",
        "Cohesive brand narrative",
        "Faster, more confident decision-making"
      ],
      includes: [
        "Positioning & differentiation framework",
        "Audience and buyer insight synthesis",
        "Brand narrative & messaging spine",
        "Identity direction (visual & verbal)"
      ],
      delivery: "7–10 days | 1 revision",
      cta: "Explore Foundation"
    },
    {
      name: "Brand Launch",
      investment: "$10k–$15k",
      description: "For brands preparing to go to market or reposition with confidence.",
      outcomes: [
        "Market-ready brand system",
        "Aligned messaging across channels",
        "Reduced friction in marketing and sales"
      ],
      includes: [
        "Everything in Foundation",
        "Naming exploration (if required)",
        "Logo & core identity system",
        "Launch-ready website or landing page direction"
      ],
      delivery: "14–21 days | 2 revisions",
      cta: "Explore Launch",
      featured: true
    },
    {
      name: "Brand Signal",
      investment: "$20k+",
      description: "For companies operating at category or cultural scale.",
      outcomes: [
        "Category-level positioning",
        "Executive alignment",
        "Long-term brand leverage"
      ],
      includes: [
        "Everything in Launch",
        "Expanded narrative system",
        "Brand architecture",
        "Investor / pitch narrative support"
      ],
      delivery: "21–30 days | 2 revisions",
      cta: "Explore Signal"
    }
  ];

  const addOns = [
    "Additional naming rounds",
    "Pitch deck narrative",
    "Extended brand guidelines",
    "Campaign or content strategy"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 font-medium">
            Brand Systems
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-foreground mb-8 tracking-tight leading-[1.1]">
            Brand clarity is a
            <span className="block italic font-light">growth accelerator.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            QV Brands builds market-ready brand systems—strategy, narrative, and identity—so your business is understood, chosen, and remembered.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-lg rounded-none"
          >
            <a href="#packages">
              View Brand Systems
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Our Philosophy
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8 leading-[1.1]">
            Branding is <span className="italic font-light">decision-first,</span> not design-first.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed font-light">
            Before we touch visuals, we establish the strategic foundation: who you are, why you matter, and how you differ. Positioning, differentiation, and market signal come before aesthetics. This is how brands that endure are built—from the inside out.
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
              Choose Your Path
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-4 leading-[1.1]">
              Brand <span className="italic font-light">Systems</span>
            </h2>
            <p className="text-lg text-muted-foreground font-light">Strategic packages for every stage of growth</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, index) => (
              <Card
                key={index} 
                className={`border ${pkg.featured ? 'border-foreground shadow-xl' : pkg.badge ? 'border-brand-primary/30' : 'border-border'} bg-card hover:shadow-lg transition-all duration-300 flex flex-col`}
              >
                <CardContent className="p-8 flex flex-col flex-grow">
                  {pkg.featured && (
                    <span className="inline-block text-xs font-medium text-background bg-foreground px-3 py-1 mb-4 w-fit">
                      Most Popular
                    </span>
                  )}
                  {pkg.badge && (
                    <span className="inline-block text-xs font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 mb-4 w-fit">
                      {pkg.badge}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-2 italic">{pkg.name}</h3>
                  <p className="text-lg font-medium text-brand-primary mb-4">{pkg.investment}</p>
                  <p className="text-muted-foreground mb-6 leading-relaxed font-light">{pkg.description}</p>
                  {pkg.descriptionExpanded && (
                    <p className="text-muted-foreground mb-6 leading-relaxed font-light text-sm">{pkg.descriptionExpanded}</p>
                  )}
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground uppercase tracking-[0.15em] mb-3">Outcomes</h4>
                    <ul className="space-y-2">
                      {pkg.outcomes.map((outcome, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <Check className="w-4 h-4 text-brand-primary mt-1 flex-shrink-0" />
                          <span className="text-sm font-light">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6 flex-grow">
                    <h4 className="text-sm font-medium text-foreground uppercase tracking-[0.15em] mb-3">Includes</h4>
                    <ul className="space-y-2">
                      {pkg.includes.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground font-light">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-6 border-t border-border mt-auto">
                    <p className="text-sm text-muted-foreground mb-4 font-light">{pkg.delivery}</p>
                    <Button 
                      asChild
                      className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-none"
                    >
                      <Link href="/contact">
                        {pkg.cta}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                    {pkg.microcopy && (
                      <p className="text-xs text-muted-foreground mt-3 font-light text-center">{pkg.microcopy}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <p className="text-center text-muted-foreground mt-12 text-sm font-light">
            QV Brands engagements typically range from $1,500 to $25k+, depending on scope, complexity, and ambition.
          </p>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8 leading-[1.1]">
            Optional <span className="italic font-light">Add-Ons</span>
          </h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {addOns.map((addon, index) => (
              <li key={index} className="flex items-center gap-3 text-muted-foreground font-light">
                <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                {addon}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Qualification Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-xl md:text-2xl text-foreground mb-10 leading-relaxed font-normal">
            QV Brands is <span className="italic">not</span> for teams seeking surface-level design or consensus-driven branding. This work requires clarity, conviction, and leadership alignment.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-10 py-6 text-lg rounded-none"
          >
            <Link href="/contact">
              Start a Conversation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4 font-light">
            If you're unsure which system fits, we'll help you decide.
          </p>
          <div className="mt-8 pt-6 border-t border-border">
            <Link 
              href="/consultation" 
              className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors font-light"
            >
              Or start with a Brand Clarity Session →
            </Link>
          </div>
        </div>
      </section>

      <CTAFooter />
    </div>
  );
};

export default Packages;
