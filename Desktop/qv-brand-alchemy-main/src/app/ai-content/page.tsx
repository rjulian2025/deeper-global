import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Zap, Target, Brain } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI-Powered Brand Content | QV BRANDS",
  description:
    "How QV BRANDS uses AI to accelerate brand strategy and content systems without losing human judgment.",
};

export default function AIContentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-subtle via-brand-subtle-light to-black">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-subtle to-transparent opacity-60"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge className="mb-8 bg-brand-primary/20 text-brand-primary-light border-brand-primary/30 px-6 py-2 text-sm font-semibold tracking-wide">
            The Future of Content is Here
          </Badge>
          <h1 className="text-6xl md:text-8xl font-light text-brand-hero mb-10 tracking-tight leading-[0.9] max-w-5xl mx-auto">
            Be the Source AI Points To.
          </h1>
          <p className="text-xl md:text-2xl text-brand-text-light mb-16 max-w-4xl mx-auto font-light leading-relaxed opacity-90">
            We build AI-optimized content grids that LLMs quote and voice
            assistants read aloud. Zero-click visibility for experts who refuse
            to be invisible.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-brand-primary text-white hover:bg-brand-primary-light transition-all duration-300 hover:scale-105 hover:shadow-2xl px-14 py-6 text-lg font-bold rounded-2xl shadow-lg border border-brand-primary/20"
            >
              <Link href="/contact">Book a Signal Call</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-brand-text-medium/30 text-brand-text-light hover:bg-brand-text-medium/10 hover:border-brand-text-medium/50 px-14 py-6 text-lg font-bold rounded-2xl backdrop-blur-sm"
            >
              Get the 2025 AI Visibility Brief
            </Button>
          </div>
          <p className="text-sm text-brand-text-muted font-medium mt-6 opacity-80">
            No pitch. Pure signal. Results in weeks, not quarters.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-brand-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-brand-hero mb-8 leading-tight">
              You don't need more content.
              <br />
              <span className="text-brand-primary-light">You need findability.</span>
            </h2>
            <p className="text-xl md:text-2xl text-brand-text-light max-w-4xl mx-auto leading-relaxed opacity-90">
              We replace the broken "blog" model with an intent-aligned answer
              architecture that drives leads—even if nobody clicks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-brand-subtle-light to-brand-subtle border border-brand-text-medium/20 hover:border-brand-primary/40 transition-all duration-500 hover:transform hover:scale-105 group">
              <CardContent className="p-10">
                <div className="bg-brand-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-primary/30 transition-colors">
                  <Brain className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-brand-hero">
                  AI-Optimized Content Grids
                </h3>
                <p className="text-brand-text-light leading-relaxed opacity-90">
                  100+ atomic answers structured for LLM ingestion. Every piece
                  built to be quoted by ChatGPT, Perplexity, and Gemini.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-brand-subtle-light to-brand-subtle border border-brand-text-medium/20 hover:border-brand-primary/40 transition-all duration-500 hover:transform hover:scale-105 group">
              <CardContent className="p-10">
                <div className="bg-brand-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-primary/30 transition-colors">
                  <Target className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-brand-hero">
                  Schema & Metadata Mastery
                </h3>
                <p className="text-brand-text-light leading-relaxed opacity-90">
                  Advanced formatting that makes you the source, not just another
                  indexed page. Voice-ready, LLM-optimized.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-brand-subtle-light to-brand-subtle border border-brand-text-medium/20 hover:border-brand-primary/40 transition-all duration-500 hover:transform hover:scale-105 group">
              <CardContent className="p-10">
                <div className="bg-brand-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-primary/30 transition-colors">
                  <Zap className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-brand-hero">
                  Zero-Click Visibility
                </h3>
                <p className="text-brand-text-light leading-relaxed opacity-90">
                  Structured knowledge that gets featured, quoted, and
                  referenced—driving authority and leads without requiring
                  clicks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Shift */}
      <section className="py-24 px-6 bg-gradient-to-b from-brand-subtle to-brand-subtle-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-light text-brand-hero mb-12 leading-tight">
                The end of blogging.
                <br />
                <span className="text-brand-primary-light">
                  The beginning of visibility.
                </span>
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-8 h-8 rounded-full bg-brand-error/20 flex items-center justify-center mt-2 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-brand-error"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-brand-hero">
                      Traditional Content Fails
                    </h3>
                    <p className="text-brand-text-light leading-relaxed opacity-90">
                      Click-based, gated, fragmented. Built for humans who are
                      increasingly relying on AI for answers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <CheckCircle className="w-8 h-8 text-brand-success mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-brand-hero">
                      AI Search Pulls Structured Answers
                    </h3>
                    <p className="text-brand-text-light leading-relaxed opacity-90">
                      LLMs don't read keyword fluff. They extract, synthesize,
                      and quote authoritative sources with proper structure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <CheckCircle className="w-8 h-8 text-brand-success mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-brand-hero">
                      Voice Assistants Read You Aloud
                    </h3>
                    <p className="text-brand-text-light leading-relaxed opacity-90">
                      When someone asks Alexa or Siri about your expertise, they
                      quote our optimized content architecture.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-hero to-brand-text-light p-10 rounded-3xl shadow-2xl border border-brand-text-medium/20">
              <h3 className="text-3xl font-bold mb-4 text-center text-black">
                The GPS Case Study
              </h3>
              <p className="text-lg text-black/70 mb-10 text-center leading-relaxed">
                "We out-ranked billion-dollar companies in 60 days using this
                framework."
              </p>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="bg-black/5 p-6 rounded-2xl border border-black/10">
                  <div className="text-4xl font-bold text-brand-primary mb-2">
                    60
                  </div>
                  <div className="text-sm text-black/70 font-semibold">
                    Days to Dominance
                  </div>
                </div>
                <div className="bg-black/5 p-6 rounded-2xl border border-black/10">
                  <div className="text-4xl font-bold text-brand-primary mb-2">
                    95+
                  </div>
                  <div className="text-sm text-black/70 font-semibold">
                    SEO Score
                  </div>
                </div>
                <div className="bg-black/5 p-6 rounded-2xl border border-black/10">
                  <div className="text-4xl font-bold text-brand-primary mb-2">
                    100+
                  </div>
                  <div className="text-sm text-black/70 font-semibold">
                    Atomic Answers
                  </div>
                </div>
                <div className="bg-black/5 p-6 rounded-2xl border border-black/10">
                  <div className="text-4xl font-bold text-brand-primary mb-2">
                    #1
                  </div>
                  <div className="text-sm text-black/70 font-semibold">
                    AI Citations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-24 px-6 bg-gradient-to-b from-brand-subtle-light to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-light text-brand-hero mb-8 leading-tight">
            When AI speaks,
            <br />
            <span className="text-brand-primary-light">
              it quotes our clients.
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-brand-text-light mb-16 opacity-90 leading-relaxed">
            Built for smart, skeptical founders who sense the search landscape
            shifting but don't know how to respond.
          </p>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="text-left space-y-6 bg-gradient-to-br from-brand-subtle-light to-brand-subtle p-10 rounded-3xl border border-brand-text-medium/20">
              <h3 className="text-3xl font-bold mb-8 text-brand-hero">
                Perfect For:
              </h3>
              <div className="space-y-5">
                {[
                  "Platform builders with deep expertise",
                  "Consultants selling productized services",
                  "Agency founders with proprietary frameworks",
                  "Thought leaders building authority",
                  "Brands with knowledge but low visibility",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-brand-success mt-1 flex-shrink-0" />
                    <span className="text-brand-text-light text-lg leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-left space-y-6 bg-gradient-to-br from-brand-subtle-light to-brand-subtle p-10 rounded-3xl border border-brand-text-medium/20">
              <h3 className="text-3xl font-bold mb-8 text-brand-hero">
                You Know:
              </h3>
              <div className="space-y-5">
                {[
                  "Traditional SEO feels outdated",
                  "Content marketing isn't converting",
                  "AI is changing how people search",
                  "You need to be where the answers are",
                  "Speed to market matters more than ever",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <ArrowRight className="w-6 h-6 text-brand-primary mt-1 flex-shrink-0" />
                    <span className="text-brand-text-light text-lg leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gradient-to-br from-brand-primary via-brand-primary-light to-brand-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-light text-white mb-10 leading-tight">
            The future is already here.
            <br />
            <span className="opacity-90">Most are asleep at the wheel.</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed">
            We build these systems in weeks, not quarters. You're not too
            late—but the window is closing.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-brand-primary hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl px-14 py-6 text-lg font-bold rounded-2xl shadow-lg border border-white/20"
            >
              <Link href="/contact">Book Your Signal Call</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-white/80 hover:text-white transition-colors border-2 border-white/30 hover:border-white/50 hover:bg-white/10 px-14 py-6 text-lg font-bold rounded-2xl backdrop-blur-sm"
            >
              <a
                href="https://calendar.app.google/sXUh3xXCDNCKir8u6"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download AI Visibility Blueprint
              </a>
            </Button>
          </div>

          <p className="text-white/70 text-sm mt-10 font-medium">
            Qualified conversations only. We work with 12 clients per quarter.
          </p>
        </div>
      </section>
    </div>
  );
}
