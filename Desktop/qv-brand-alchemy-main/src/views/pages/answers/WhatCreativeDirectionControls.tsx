import { useEffect } from "react";
import CTAFooter from "@/components/CTAFooter";
import AnswerPageSchema from "@/components/AnswerPageSchema";
import RelatedContent from "@/components/RelatedContent";
import { answerRelatedLinks } from "@/lib/routes-meta";

const WhatCreativeDirectionControls = () => {
    return (
    <div className="min-h-screen font-sans bg-background">
      <AnswerPageSchema
        slug="what-creative-direction-controls"
        headline="What Creative Direction Really Controls"
        description="Creative direction is the discipline of making strategic decisions visible, coherent, and felt across every brand expression."
      />
      <article className="pt-40 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 font-medium">
              Core Concept
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-8 tracking-tight leading-[1.1]">
              What Creative Direction Really Controls
            </h1>
          </header>

          <div className="mb-16 border-l-2 border-brand-primary pl-6 space-y-6">
            <p className="text-xl text-foreground font-light leading-relaxed">
              <strong className="font-medium">Definition:</strong> Creative direction is the system that determines how strategy becomes visible, emotional, and memorable. It governs whether decisions land as coherent signals or get lost in noise. When creative direction collapses, strategy becomes invisible—even if it's sound.
            </p>
            <p className="text-xl text-foreground font-light leading-relaxed">
              <strong className="font-medium">Consequence:</strong> Without it, design becomes decoration, campaigns become noise, and the brand fragments into unrelated pieces.
            </p>
            <p className="text-xl text-foreground font-light leading-relaxed">
              <strong className="font-medium">Misconception:</strong> Creative direction is often confused with personal taste or aesthetic preference. It is neither.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-6 tracking-tight">
              Why This Exists
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              Strategy is invisible. It lives in documents, in decisions, in the minds of leadership. Creative direction is the translation layer—the discipline that converts strategic intent into sensory experience. It governs what the brand looks like, sounds like, and feels like. It creates the consistency that builds recognition. It creates the distinctiveness that earns attention.
            </p>

            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-6 tracking-tight mt-16">
              What Happens When It Is Missing or Confused
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              Without creative direction, every piece of design is evaluated in isolation. Does this look good? Is this on-trend? Do stakeholders like it?
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              The result is visual drift. The website looks different from the pitch deck. The social content feels disconnected from the packaging. The brand becomes a collection of assets rather than a coherent presence.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              Worse, teams begin optimizing for approval rather than impact. Design becomes a negotiation, not a discipline. The brand loses its edge, its tension, its point of view.
            </p>

            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-6 tracking-tight mt-16">
              How to Recognize the Problem
            </h2>
            <ul className="space-y-3 text-lg text-muted-foreground font-light mb-8">
              <li>Design reviews focus on preference ("I like this one better") rather than fit ("This one expresses our positioning").</li>
              <li>Multiple designers produce visually incompatible work for the same brand.</li>
              <li>Every new campaign feels like a restart instead of an evolution.</li>
              <li>Stakeholders cannot articulate why one direction is right and another is wrong.</li>
              <li>The brand looks professional but generic—polished but forgettable.</li>
            </ul>

            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-6 tracking-tight mt-16">
              What Most Agencies Get Wrong
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              Many agencies treat creative direction as a senior designer's opinion. It is not. Opinion is arbitrary. Creative direction is accountable—to strategy, to positioning, to business outcomes.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              Others reduce it to mood boards and style guides. These are artifacts of creative direction, not the thing itself. The discipline is the ongoing act of judgment: deciding what fits, what doesn't, and why.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              The deepest failure is separating creative direction from strategy. When creative leads don't understand positioning, they optimize for aesthetics. When strategists don't understand craft, they approve work that undermines the strategy. Both must be integrated.
            </p>

            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-6 tracking-tight mt-16">
              What Actually Fixes It
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              Creative direction must be:
            </p>
            <ul className="space-y-3 text-lg text-muted-foreground font-light mb-8">
              <li><strong className="font-medium">Anchored in strategy:</strong> Every visual and verbal choice traces back to a positioning decision.</li>
              <li><strong className="font-medium">Documented in principles, not just examples:</strong> The "why" matters more than the "what."</li>
              <li><strong className="font-medium">Singular in authority:</strong> Someone must have final say. Design by committee produces mediocrity.</li>
              <li><strong className="font-medium">Applied consistently:</strong> Across channels, across teams, across time.</li>
            </ul>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              When creative direction works, it creates recognition. The audience knows the brand before they see the logo. They feel it. That feeling is not accidental. It is directed.
            </p>
          </div>
        </div>
      </article>

      <RelatedContent links={answerRelatedLinks["what-creative-direction-controls"] || []} />
      <CTAFooter />
    </div>
  );
};

export default WhatCreativeDirectionControls;
