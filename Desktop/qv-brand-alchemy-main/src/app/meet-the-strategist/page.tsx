import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AuthorPageSchema from "@/components/AuthorPageSchema";

export const metadata: Metadata = {
  title: "Rick Julian - Brand Strategist & Founder | QV BRANDS",
  description:
    "Rick Julian is a brand strategist and creative director with 30 years of experience shaping high-impact brand systems for Coca-Cola, McKinsey & Co., SAP, US Marine Corps, and Marriott. Founder of QV BRANDS.",
  keywords:
    "Rick Julian, brand strategist, brand architect, QV BRANDS founder, Coca-Cola branding, Fortune 500 brand consultant",
  alternates: { canonical: "https://www.qvbrands.com/meet-the-strategist" },
  openGraph: {
    title: "Rick Julian - Brand Strategist & Founder | QV BRANDS",
    description:
      "Brand strategist and creative director with 30 years of experience shaping high-impact brand systems for Fortune 500 companies and founder-led ventures.",
    url: "https://www.qvbrands.com/meet-the-strategist",
    type: "profile",
    images: [
      "https://www.qvbrands.com/lovable-uploads/39805efc-faff-433d-92ef-9412222c4d45.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rick Julian - Brand Strategist & Founder | QV BRANDS",
    description:
      "Brand strategist and creative director with 30 years of experience shaping high-impact brand systems for Fortune 500 companies.",
    images: [
      "https://www.qvbrands.com/lovable-uploads/39805efc-faff-433d-92ef-9412222c4d45.png",
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is brand strategy in the AI age?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brand strategy in the AI age is about designing clarity systems that help humans stay distinct in a world dominated by automation, noise, and synthetic content.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Rick Julian?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rick Julian is a brand architect and founder of QV BRANDS, known for his high-impact work with global companies, cultural institutions, and high-performing founders.",
      },
    },
    {
      "@type": "Question",
      name: "What makes QV BRANDS different from other branding agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QV BRANDS combines timeless strategic depth with AI fluency to create brands that are not only memorable but architected to endure.",
      },
    },
  ],
};

export default function MeetTheStrategistPage() {
  return (
    <div className="min-h-screen font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AuthorPageSchema />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="/lovable-uploads/815c4eff-40e7-498b-ae1e-31f4da66f7b8.png"
              alt="QV BRANDS"
              className="h-8"
            />
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-brand-accent text-brand-text-light"
            >
              Home
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-brand-accent text-brand-text-light"
            >
              Contact
            </Link>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white hover:text-black"
            >
              <Link href="/contact">Start Project</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="fixed top-[73px] left-0 right-0 z-40 bg-accent/10 border-b border-border py-3 text-center">
        <p className="text-sm text-foreground">
          This page has moved.{" "}
          <Link
            href="/rick-julian"
            className="font-medium underline hover:text-accent transition-colors"
          >
            Visit Rick Julian&apos;s profile
          </Link>
        </p>
      </div>

      <section className="relative min-h-screen flex items-end bg-brand-neutral">
        <div className="absolute inset-0 bg-black/45 z-10"></div>

        <div className="absolute inset-0">
          <img
            src="/lovable-uploads/39805efc-faff-433d-92ef-9412222c4d45.png"
            alt="Rick Julian Portrait"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-20 max-w-[800px] mx-auto px-8 py-[120px] text-center">
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold text-white mb-4 tracking-tight">
              Rick Julian
            </h1>
            <p className="text-lg text-[#CCCCCC] font-light leading-relaxed mt-4 mb-8">
              Creative Strategist. Brand Architect. Founder, QV BRANDS.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-brand-primary text-white hover:bg-brand-accent transition-all duration-300 px-8 py-4 text-lg font-medium tracking-wide hover:scale-105"
            >
              <Link href="/contact">Start the Conversation</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="max-w-4xl">
            <blockquote className="mb-20 animate-text-reveal">
              <p className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-brand-neutral mb-16 leading-tight italic">
                &quot;I don&apos;t sell services. I forge signals.&quot;
              </p>
            </blockquote>

            <div className="prose prose-xl max-w-none space-y-6">
              <p className="font-sans text-xl md:text-2xl text-black font-light leading-relaxed">
                For over 30 years, Rick Julian has been the quiet architect
                behind brands that resonate at scale. From Coca-Cola, McKinsey
                &amp; Co., and SAP to the United States Marine Corps and
                Marriott, his strategic fingerprints can be found across global
                corporations, national campaigns, cultural movements, and
                founder-led ventures.
              </p>

              <p className="font-sans text-xl md:text-2xl text-black font-light leading-relaxed">
                His work has helped launch startups, reposition legacy
                institutions, and distill complex missions into symbols that
                move people. Whether it&apos;s a billion-dollar rollout or a
                founder&apos;s first signal to the world, every project is
                shaped by the same core principle:
              </p>

              <p className="font-sans text-xl md:text-2xl text-black font-medium leading-relaxed">
                Clarity is a competitive edge.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-brand-subtle">
        <div className="max-w-6xl mx-auto px-8">
          <div className="max-w-4xl">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-20 leading-tight">
              What Are You Really Building?
            </h2>

            <div className="space-y-16 mb-20">
              <div className="animate-text-reveal">
                <p className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-brand-primary italic leading-tight">
                  What are you really here to do?
                </p>
              </div>

              <div className="animate-text-reveal" style={{ animationDelay: "0.3s" }}>
                <p className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-brand-primary italic leading-tight">
                  And how does the world need to hear it?
                </p>
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="font-sans text-xl md:text-2xl text-brand-accent font-light leading-relaxed">
                In an era where AI democratizes creation, strategic thinking
                becomes the ultimate differentiator. Brand clarity isn&apos;t
                decoration—it&apos;s navigation. A compass for decisions, a
                filter for opportunities, a foundation for everything that
                follows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="max-w-4xl">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-brand-neutral mb-20 leading-tight">
              What It&apos;s Like to Work Together
            </h2>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-8">
                <p className="font-sans text-xl text-black font-light leading-relaxed">
                  Projects begin with deep-dive strategic sessions that map your
                  vision, voice, and architectural foundations. This
                  isn&apos;t consulting—it&apos;s co-creation at the highest
                  level.
                </p>

                <p className="font-sans text-xl text-black font-light leading-relaxed">
                  From there, we define what needs building: naming systems,
                  messaging frameworks, brand architectures, or something
                  entirely unprecedented. Every engagement is bespoke, intimate,
                  and transformative.
                </p>

                <p className="font-sans text-xl text-black font-light leading-relaxed">
                  This is strategic partnership for visionaries who understand
                  that exceptional outcomes require exceptional commitment.
                </p>
              </div>

              <div className="lg:pl-12">
                <div className="border-l-4 border-brand-primary pl-8 py-8">
                  <blockquote className="font-serif text-2xl md:text-3xl text-brand-neutral font-light leading-relaxed italic">
                    &quot;I take on a limited number of clients per quarter. If
                    we work together, expect rigor, resonance, and
                    results.&quot;
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-brand-primary">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-16 leading-tight">
              Let&apos;s see what you&apos;re really building.
            </h2>

            <Button
              asChild
              size="lg"
              className="bg-white text-brand-primary hover:bg-brand-accent transition-all duration-300 px-12 py-6 text-lg font-medium tracking-wide hover:scale-105 shadow-2xl"
            >
              <Link href="/contact">Start the Conversation</Link>
            </Button>

            <div className="mt-16 pt-16 border-t border-white/20">
              <p className="font-serif text-xl text-white/80 italic">
                — Rick Julian
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
