"use client";

import { ReactNode, useEffect } from "react";
import Link from "@/components/Link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CTAFooter from "@/components/CTAFooter";
import {
  generateStrategicAnswerArticleSchema,
  generateStrategicAnswerFAQSchema,
  generateStrategicAnswerBreadcrumb,
} from "@/lib/schema-entities";

interface StrategicAnswerSection {
  title: string;
  content: ReactNode;
}

interface StrategicAnswerFAQ {
  question: string;
  answer: string;
}

interface StrategicAnswerLink {
  title: string;
  url: string;
}

interface StrategicAnswerTemplateProps {
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  topics: string[];
  intent: string;
  summaryText: string;
  sections: StrategicAnswerSection[];
  faqItems: StrategicAnswerFAQ[];
  relatedLinks: StrategicAnswerLink[];
}

const StrategicAnswerTemplate = ({
  slug,
  headline,
  description,
  datePublished,
  dateModified,
  summaryText,
  sections,
  faqItems,
  relatedLinks,
}: StrategicAnswerTemplateProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const articleSchema = generateStrategicAnswerArticleSchema({
    slug,
    headline,
    description,
    datePublished,
    dateModified,
  });

  const faqSchema = faqItems.length > 0
    ? generateStrategicAnswerFAQSchema(faqItems)
    : null;

  const breadcrumbSchema = generateStrategicAnswerBreadcrumb(headline, slug);

  const canonicalUrl = `https://www.qvbrands.com/strategic-answers/${slug}`;

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Executive Summary */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-3xl mx-auto px-8">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-8 tracking-tight leading-tight">
            {headline}
          </h1>
          <div className="border-l-4 border-accent pl-6 py-2">
            <p className="text-lg text-foreground font-light leading-relaxed">
              {summaryText}
            </p>
          </div>
        </div>
      </section>

      {/* Structured Sections */}
      {sections.map((section, index) => (
        <section key={index} className="py-16 md:py-20 border-t border-border">
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-8 tracking-tight">
              {section.title}
            </h2>
            <div className="prose prose-lg max-w-none text-foreground font-light leading-relaxed">
              {section.content}
            </div>
          </div>
        </section>
      ))}

      {/* FAQ Accordion */}
      {faqItems.length > 0 && (
        <section className="py-16 md:py-20 border-t border-border">
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-8 tracking-tight">
              Common Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-base font-medium text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground font-light leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Author Attribution */}
      <section className="py-12 border-t border-border">
        <div className="max-w-3xl mx-auto px-8">
          <p className="text-sm text-muted-foreground">
            Written by{" "}
            <Link href="/rick-julian" className="text-foreground hover:text-accent transition-colors font-medium">
              Rick Julian
            </Link>
            , Fractional CMO & Brand Growth Architect
          </p>
        </div>
      </section>

      {/* Related Links */}
      {relatedLinks.length > 0 && (
        <section className="py-12 border-t border-border">
          <div className="max-w-3xl mx-auto px-8">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Related</h3>
            <nav className="flex flex-wrap gap-x-8 gap-y-2">
              {relatedLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-sm text-foreground hover:text-accent transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-6 tracking-tight">
            Ready for Strategic Clarity?
          </h2>
          <p className="text-base text-muted-foreground font-light mb-8 max-w-lg mx-auto">
            A focused working session to diagnose your growth constraint and determine the right strategic move.
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
              Apply for Strategic Review
            </a>
          </Button>
        </div>
      </section>

      <CTAFooter />
    </div>
  );
};

export default StrategicAnswerTemplate;
