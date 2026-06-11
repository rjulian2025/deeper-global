import { Button } from "@/components/ui/button";
import Link from "@/components/Link";

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Dark charcoal text panel */}
      <div className="lg:w-1/2 bg-brand-hero flex items-center justify-center px-8 md:px-16 lg:px-20 py-24 lg:py-0 order-1">
        <div className="max-w-xl">
          <p className="text-sm tracking-[0.3em] uppercase text-primary-foreground/60 mb-8 font-medium">
            Fractional Chief Branding Officer + Growth Architect
          </p>

          <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl font-normal text-primary-foreground mb-8 tracking-tight leading-[1.1]">
            I make brands make sense
            <span className="block italic font-light mt-2">—then scale.</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 mb-4 font-light leading-relaxed">
            When positioning, story, and systems drift apart, growth stalls. I realign them so the business scales with clarity.
          </p>

          <p className="text-base text-primary-foreground/80 mb-6 font-light leading-relaxed">
            For founders who've outgrown guesswork.
          </p>

          <p className="text-sm text-primary-foreground/60 mb-12 font-light">
            20+ years. $500M+ in launches. Clients include Coca-Cola, SAP, and The CDC.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 px-10 py-7 text-lg font-medium rounded-none"
            >
              <Link href="/contact">Apply for Strategic Review</Link>
            </Button>
            <Link
              href="/clients"
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-base font-light inline-flex items-center gap-2 py-3"
            >
              View Case Work <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Edge-to-edge hero image */}
      <div className="lg:w-1/2 min-h-[400px] lg:min-h-screen order-2">
        <img
          src="/images/rick-hero.jpg"
          alt="Rick Julian — Fractional Chief Branding Officer and Growth Architect"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  );
};

export default Hero;
