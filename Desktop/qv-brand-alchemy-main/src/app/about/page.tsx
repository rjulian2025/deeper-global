import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import CTAFooter from "@/components/CTAFooter";

export const metadata: Metadata = {
  title: "About | QV BRANDS - Principal-Led Brand Strategy",
  description:
    "QV Brands is a principal-led brand strategy practice led by Rick Julian, a brand strategist and creative director with 30 years of experience shaping brands from early-stage challengers to global enterprises.",
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "QV BRANDS",
  url: "https://www.qvbrands.com",
  description:
    "Principal-led brand strategy and orchestration practice led by Rick Julian.",
  founder: {
    "@type": "Person",
    name: "Rick Julian",
    jobTitle: "Brand Strategist & Creative Director",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <Navigation />

      {/* Hero Section */}
      <section className="pt-40 pb-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-6 font-medium">
            About QV Brands
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-10 tracking-tight leading-[1.1]">
            The short version: I fix brands.
            <span className="block italic font-light">
              The long version is more interesting.
            </span>
          </h1>
        </div>
      </section>

      {/* Principal Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                <img
                  src="/lovable-uploads/rick-headshot.png"
                  alt="Rick Julian, Brand Strategist and Creative Director"
                  className="w-80 h-80 md:w-[400px] md:h-[400px] object-cover shadow-lg"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-8 tracking-tight">
                Rick Julian
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6">
                Thirty years in brand strategy, creative direction, and
                go-to-market orchestration. Consumer and B2B. Early-stage
                challengers and global enterprises. Work that's operated at
                multi-million-dollar scale—and work that started on a napkin.
              </p>
              <p className="text-base text-muted-foreground/70 font-light tracking-wide uppercase">
                Brand Strategist · Creative Director · Fractional CMO
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* The Model Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-12 tracking-tight leading-[1.1]">
            How this <span className="italic font-light">actually works.</span>
          </h2>
          <div className="space-y-8">
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              I run QV Brands on a principal-led model. That means you work with
              me directly—not a junior strategist "getting up to speed" on your
              business. I lead strategy, creative direction, and orchestration.
              When execution requires depth, I assemble senior specialists from
              a trusted global bench: designers, writers, technologists,
              operators. No agency overhead. No creative dilution. No layers
              between your problem and the person solving it.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Some engagements are a focused advisory team of three. Others
              scale to 40+ contributors for global launches. The model flexes.
              The standard doesn't.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Creative Range Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-12 tracking-tight leading-[1.1]">
            Not just <span className="italic font-light">strategy decks.</span>
          </h2>
          <div className="space-y-8">
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              I wrote <em>The Way</em>—a modern translation of the Tao Te Ching.
              Harvard University called it "a fantastically poetic
              translation." It carries a 4.6 on Amazon. I also co-wrote "Be
              Beautiful" with David Ryan Harris, which hit Billboard #1.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              I mention this not to impress, but because it says something about
              how I work. Brand strategy isn't just positioning frameworks and
              market maps. It's language. It's feel. It's the difference between
              a company that explains itself and a company that <em>lands</em>.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Origin Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-12 tracking-tight leading-[1.1]">
            Why <span className="italic font-light">"QV"?</span>
          </h2>
          <div className="space-y-8">
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              QV stands for <em>Quo Vadis</em>—Latin for "Where are you going?"
              It's the only question that matters before you build anything. The
              logo was designed by Natasha Jen at Pentagram, which probably
              tells you something about how seriously I take craft—even in the
              details no one asks about.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy / Close Section */}
      <section className="pt-24 pb-40 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-serif text-xl md:text-2xl text-foreground font-normal leading-relaxed mb-16 italic">
            One strategic voice. No layers. No handoffs. If that sounds like
            what you've been looking for, let's talk.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 px-10 py-6 text-lg font-medium rounded-none"
          >
            <Link href="/contact">Start the Conversation</Link>
          </Button>
        </div>
      </section>

      <CTAFooter />
    </div>
  );
}
