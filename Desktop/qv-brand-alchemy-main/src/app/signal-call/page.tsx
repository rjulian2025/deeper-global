import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CTAFooter from "@/components/CTAFooter";

export const metadata: Metadata = {
  title: "Signal Call | QV BRANDS",
  description:
    "A focused working session to identify the core constraint holding your brand back. Not exploratory. Not a pitch.",
  alternates: { canonical: "https://www.qvbrands.com/signal-call" },
};

export default function SignalCallPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-foreground mb-8 tracking-tight leading-[1.1]">
            Your brand isn&apos;t unclear.
            <span className="block italic font-light">It&apos;s undecided.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Growth introduces tradeoffs. When those decisions aren&apos;t
            resolved cleanly, execution fragments and momentum slows.
          </p>
          <div className="space-y-3">
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 px-10 py-6 text-lg rounded-none"
            >
              <a
                href="https://calendar.app.google/sXUh3xXCDNCKir8u6"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a Signal Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground/70 font-light italic">
              A working session. Not a pitch.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground mb-12 font-light leading-relaxed">
            When strategic decisions stay unresolved, the damage is rarely
            dramatic—but it compounds.
          </p>
          <ul className="space-y-6">
            {[
              "Leadership alignment slows as scale increases",
              "Teams execute loudly but inconsistently",
              "Creative output rises while confidence drops",
              "Decisions are revisited instead of resolved",
            ].map((item, index) => (
              <li
                key={index}
                className="text-lg text-foreground font-light flex items-start gap-4"
              >
                <span className="text-muted-foreground/50">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            The Pattern
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-12 leading-[1.1]">
            Why the usual fixes{" "}
            <span className="italic font-light">don&apos;t work</span>
          </h2>
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              More design does not resolve unclear positioning. It accelerates
              the confusion already present.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Workshops generate options without authority. They create the
              appearance of progress while deferring the actual decision.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Agencies fail without mandate, not talent. The work stalls because
              strategic ambiguity was never resolved upstream.
            </p>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              Rebrands disguise strategic problems they don&apos;t confront. New
              visuals applied to old confusion produce expensive disappointment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            The Session
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8 leading-[1.1]">
            What the Signal Call{" "}
            <span className="italic font-light">is</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 font-light leading-relaxed">
            The Signal Call is a focused working session designed to identify the
            core constraint holding the brand back. It is not exploratory. It
            does not generate options without resolution.
          </p>
          <ul className="space-y-4">
            {[
              "60–90 minute live session",
              "Diagnose the core strategic constraint",
              "Determine the correct next move—or confirm none is needed",
              "Leave with clarity and conviction",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-foreground">
                <span className="text-brand-primary font-serif text-xl">→</span>
                <span className="text-lg font-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 font-medium">
                This is for
              </p>
              <ul className="space-y-4">
                {[
                  "Founder-led and principal-driven companies",
                  "Leadership teams navigating real tradeoffs",
                  "Brands at inflection points, not ignition",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="text-lg text-foreground font-light flex items-start gap-4"
                  >
                    <span className="text-brand-primary">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 font-medium">
                This is not for
              </p>
              <ul className="space-y-4">
                {[
                  "Consensus-driven organizations",
                  "Surface-level feedback or brainstorming",
                  "Teams seeking validation rather than clarity",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="text-lg text-muted-foreground font-light flex items-start gap-4"
                  >
                    <span className="text-muted-foreground/50">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-8 font-light tracking-wide">
            Trusted by leadership teams operating at global scale.
          </p>
          <img
            src="/lovable-uploads/qv-clients-black-on-white.avif"
            alt="Trusted by Carnival, Coca-Cola, SAP, McKinsey & Company, AT&T"
            className="h-auto w-full max-w-3xl opacity-60 mx-auto"
            loading="lazy"
          />
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-10 leading-[1.1]">
            If the decision matters,
            <span className="block italic font-light">
              this is where it starts.
            </span>
          </h2>
          <Button
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-10 py-6 mb-4 rounded-none"
          >
            <a
              href="https://calendar.app.google/sXUh3xXCDNCKir8u6"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Signal Call
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          <p className="text-sm text-muted-foreground/70 font-light">
            This is a working session. No deck. No pitch. No follow-up funnel.
          </p>
        </div>
      </section>

      <CTAFooter />
    </div>
  );
}
