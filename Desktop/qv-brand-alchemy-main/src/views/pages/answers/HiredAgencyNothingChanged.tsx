import { useEffect } from "react";
import CTAFooter from "@/components/CTAFooter";
import AnswerPageSchema from "@/components/AnswerPageSchema";
import RelatedContent from "@/components/RelatedContent";
import { answerRelatedLinks } from "@/lib/routes-meta";

const HiredAgencyNothingChanged = () => {
    return (
    <div className="min-h-screen font-sans bg-background">
      <AnswerPageSchema
        slug="hired-agency-nothing-changed"
        headline="We Hired an Agency and Nothing Changed"
        description="Agency engagements fail for predictable reasons. Understanding these patterns helps avoid repeating them and positions the next engagement for success."
      />
      <article className="pt-40 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <header className="mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 font-medium">
              Diagnostic
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-8 tracking-tight leading-[1.1]">
              We Hired an Agency and Nothing Changed
            </h1>
          </header>

          <div className="mb-16 border-l-2 border-brand-primary pl-6 space-y-6">
            <p className="text-xl text-foreground font-light leading-relaxed">
              <strong className="font-medium">Definition:</strong> When companies hire agencies and see no meaningful change, the failure is rarely execution. It is authority. Without someone empowered to decide what matters, even excellent work lands softly and disappears.
            </p>
            <p className="text-xl text-foreground font-light leading-relaxed">
              <strong className="font-medium">Consequence:</strong> Beyond the wasted investment, the failure breeds cynicism. Leadership becomes skeptical of all brand work. The organization concludes that branding does not work—when the actual issue was how the engagement was structured.
            </p>
            <p className="text-xl text-foreground font-light leading-relaxed">
              <strong className="font-medium">Misconception:</strong> Companies assume the agency was incompetent. Sometimes true, but more often the failure was systemic—wrong scope, wrong problem, or wrong process.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-6 tracking-tight">
              Why This Happens
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              Agency engagements fail for reasons that are predictable but often invisible until afterward. Understanding the patterns helps prevent repetition.
            </p>

            <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground mb-4 tracking-tight">
              Failure Mode 1: Wrong Diagnosis
            </h3>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              The company assumed the brand was the problem when it was not. The agency was hired to solve a brand issue when the actual constraint was product, pricing, distribution, or operations. The brand work was executed well but addressed the wrong problem.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              <em>Symptom:</em> The new brand materials are well-received internally but do not change customer behavior or business outcomes.
            </p>

            <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground mb-4 tracking-tight">
              Failure Mode 2: Surface Treatment
            </h3>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              The agency delivered visual identity but not brand strategy. New logos, new colors, new typography—but no new positioning, no clearer audience definition, no sharpened promise. The brand looks different but means the same thing.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              <em>Symptom:</em> Employees cannot explain what the rebrand was for, beyond "modernization."
            </p>

            <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground mb-4 tracking-tight">
              Failure Mode 3: Implementation Collapse
            </h3>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              The strategy was sound. The creative was excellent. But the company never implemented it. The brand guidelines sit in a folder. The website was never updated. Sales still uses the old deck. The brand exists in documentation but not in practice.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              <em>Symptom:</em> Leadership can describe the new brand vision but customers experience the old one.
            </p>

            <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground mb-4 tracking-tight">
              Failure Mode 4: Consensus Dilution
            </h3>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              The agency proposed bold, distinctive work. The review process softened it. Each stakeholder removed something uncomfortable. By approval, the brand was safe, generic, and indistinguishable from competitors.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              <em>Symptom:</em> The final deliverables bear little resemblance to the initial concepts everyone loved.
            </p>

            <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground mb-4 tracking-tight">
              Failure Mode 5: Scope Mismatch
            </h3>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              The engagement was too narrow. The company hired an agency to design a logo when they needed positioning. Or they hired a campaign agency when they needed a brand foundation. The agency delivered what was scoped. The scope was wrong.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
              <em>Symptom:</em> The deliverables are excellent but do not address the underlying problem.
            </p>

            <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-6 tracking-tight mt-16">
              What Actually Fixes It
            </h2>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-4">
              Before engaging another agency:
            </p>
            <ul className="space-y-4 text-lg text-muted-foreground font-light mb-8">
              <li><strong className="font-medium">Diagnose first.</strong> Confirm the brand is the actual constraint before investing in brand work. If the problem is product or operations, fix that first.</li>
              <li><strong className="font-medium">Define success concretely.</strong> What will change if this engagement succeeds? Not "better brand" but measurable outcomes: pricing power, recognition, consideration, or conversion.</li>
              <li><strong className="font-medium">Scope to the problem.</strong> If the issue is positioning, do not hire for design. If the issue is awareness, do not hire for strategy. Match the scope to the diagnosis.</li>
              <li><strong className="font-medium">Designate authority.</strong> Ensure one person can approve without committee dilution. If five stakeholders must agree, the work will be compromised.</li>
              <li><strong className="font-medium">Plan implementation.</strong> Before the creative work begins, determine how it will be deployed. If there is no implementation plan, there is no point in creating assets.</li>
              <li><strong className="font-medium">Protect the edge.</strong> Distinctive work makes stakeholders uncomfortable. That discomfort is the signal that the work is differentiated. Do not sand it away.</li>
            </ul>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Agency failure is rarely about agency capability alone. It is about engagement design—how the problem was framed, how the scope was set, how decisions were made, and how the work was deployed. Fix the structure and the outcomes change.
            </p>
          </div>
        </div>
      </article>

      <RelatedContent links={answerRelatedLinks["hired-agency-nothing-changed"] || []} />
      <CTAFooter />
    </div>
  );
};

export default HiredAgencyNothingChanged;
