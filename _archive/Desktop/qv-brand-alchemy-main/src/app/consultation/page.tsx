import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import CTAFooter from "@/components/CTAFooter";

export const metadata: Metadata = {
  title: "Brand Clarity Session | QV BRANDS",
  description:
    "A focused strategic session to diagnose positioning gaps, sharpen direction, and identify your strongest next move.",
  alternates: { canonical: "https://www.qvbrands.com/consultation" },
};

export default function ConsultationPage() {
  const sessionOptions = [
    {
      duration: "30-Minute Session",
      investment: "$175",
      description:
        "A focused diagnostic for a single core question or decision.",
    },
    {
      duration: "60-Minute Session",
      investment: "$350",
      description:
        "A deeper working session covering multiple dimensions and next-step mapping.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 font-medium">
            Strategic Consultation
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-foreground mb-8 tracking-tight leading-[1.1]">
            Brand Clarity
            <span className="block italic font-light">Session</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto font-light leading-relaxed">
            A focused strategic session to diagnose positioning gaps, sharpen
            direction, and identify your strongest next move.
          </p>
          <p className="text-lg text-muted-foreground/70 mb-10 font-light italic">
            This is not a sales call. It&apos;s a working session designed to
            create clarity fast.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-lg rounded-none"
          >
            <a
              href="https://calendar.app.google/sXUh3xXCDNCKir8u6"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Session
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Who It&apos;s For
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8 leading-[1.1]">
            What This Session <span className="italic font-light">Is For</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-light">
            This session is designed for founders and leadership teams who are:
          </p>
          <ul className="space-y-4">
            {[
              "Preparing for launch or repositioning",
              "Experiencing messaging or positioning confusion",
              "Unsure which brand investment is actually needed",
              "Looking for senior-level perspective before committing resources",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-muted-foreground">
                <span className="text-brand-primary font-serif text-xl">
                  0{index + 1}
                </span>
                <span className="text-lg font-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            The Agenda
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8 leading-[1.1]">
            What We&apos;ll <span className="italic font-light">Cover</span>
          </h2>
          <ul className="space-y-4">
            {[
              "Positioning and differentiation assessment",
              "Narrative and messaging alignment",
              "Go-to-market friction points",
              "Brand architecture or scope clarity",
              "Recommendation on next steps",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-muted-foreground">
                <span className="text-brand-primary font-serif text-xl">→</span>
                <span className="text-lg font-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
              Choose Your Session
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground leading-[1.1]">
              Session <span className="italic font-light">Options</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {sessionOptions.map((option, index) => (
              <Card
                key={index}
                className="border border-border bg-card hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-8 text-center flex flex-col h-full">
                  <h3 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-2 italic">
                    {option.duration}
                  </h3>
                  <p className="text-2xl font-medium text-brand-primary mb-6">
                    {option.investment}
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-grow font-light">
                    {option.description}
                  </p>
                  <Button
                    asChild
                    className="bg-foreground text-background hover:bg-foreground/90 w-full rounded-none"
                  >
                    <a
                      href="https://calendar.app.google/sXUh3xXCDNCKir8u6"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            The Outcome
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-8 leading-[1.1]">
            What You <span className="italic font-light">Leave With</span>
          </h2>
          <ul className="space-y-4 mb-10">
            {[
              "Clear articulation of the core issue",
              "Strategic recommendation on what to do next",
              "Confidence to move forward—or pause—with intention",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-muted-foreground">
                <span className="text-brand-primary font-serif text-xl">→</span>
                <span className="text-lg font-light">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground italic border-l-2 border-brand-primary pl-6 font-light">
            If a Brand System engagement is the right next step, the
            consultation fee is credited toward your project.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-serif text-lg md:text-xl text-foreground leading-relaxed font-normal italic">
            This session is best suited for teams facing real decisions—not
            exploratory brainstorming or surface-level feedback.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Button
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-10 py-6 text-lg mb-6 rounded-none"
          >
            <a
              href="https://calendar.app.google/sXUh3xXCDNCKir8u6"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Brand Clarity Session
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          <div>
            <Link
              href="/packages"
              className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors font-light"
            >
              Explore Brand Systems →
            </Link>
          </div>
        </div>
      </section>

      <CTAFooter />
    </div>
  );
}
