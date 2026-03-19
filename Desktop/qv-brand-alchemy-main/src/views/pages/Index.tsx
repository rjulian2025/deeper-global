import React from "react";
import Hero from "@/components/Hero";
import ServiceArchitecture from "@/components/ServiceArchitecture";
import StrategicGrowthExplained from "@/components/StrategicGrowthExplained";
import Problem from "@/components/Problem";
import Shift from "@/components/Shift";
import HowIWork from "@/components/HowIWork";
import Partnership from "@/components/Partnership";
import Engagements from "@/components/Engagements";
import Proof from "@/components/Proof";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import CommonQuestions from "@/components/CommonQuestions";
import FinalCTA from "@/components/FinalCTA";
import SEOFramework from "@/components/SEOFramework";
import { useSEO } from "@/hooks/useSEO";
const Index = () => {
  const seoConfig = useSEO({
    title: "Rick Julian — Fractional Chief Branding Officer & Growth Architect | QV Brands",
    description: "Fractional Chief Branding Officer and growth architect for founder-led companies at critical growth stages. Brand strategy, positioning, narrative systems, and scalable growth architecture.",
    keywords: ["fractional chief branding officer", "growth architect", "brand strategy for founders", "fractional CMO", "strategic growth systems", "installed marketing leadership", "go-to-market architecture", "founder-led companies"],
    image: "https://www.qvbrands.com/images/rick-hero.jpg"
  });

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "QV BRANDS",
    "url": "https://www.qvbrands.com",
    "description": "Fractional Chief Branding Officer and growth architecture for founder-led companies. Brand strategy, positioning, narrative systems, and scalable growth architecture.",
    "founder": {
      "@type": "Person",
      "name": "Rick Julian"
    },
    "foundingDate": "2003-01-01",
    "areaServed": "Global",
    "sameAs": [
      "https://linkedin.com/company/qvbrands",
      "https://instagram.com/qvbrands",
      "https://twitter.com/qvbrands"
    ],
    "logo": "https://www.qvbrands.com/images/logo.png"
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rick Julian",
    "url": "https://www.qvbrands.com/rick-julian",
    "jobTitle": "Fractional Chief Branding Officer & Growth Architect",
    "worksFor": {
      "@type": "Organization",
      "name": "QV BRANDS",
      "url": "https://www.qvbrands.com"
    },
    "sameAs": [
      "https://linkedin.com/in/rickjulian",
      "https://twitter.com/rickjulian"
    ],
    "description": "Fractional Chief Branding Officer and growth architect who combines narrative strategy, creative direction, and growth systems to install strategic clarity for founder-led companies at critical growth stages.",
    "image": "https://www.qvbrands.com/images/rick-hero.jpg",
    "hasOccupation": [
      { "@type": "Occupation", "name": "Fractional Chief Branding Officer" },
      { "@type": "Occupation", "name": "Brand Strategist" },
      { "@type": "Occupation", "name": "Creative Director" },
      { "@type": "Occupation", "name": "Growth Architect" }
    ],
    "knowsAbout": [
      "Brand Architecture",
      "Narrative Strategy",
      "Category Positioning",
      "Market Optics",
      "Brand Psychology",
      "Go-to-Market Strategy",
      "Growth Systems",
      "Demand Generation",
      "Revenue Operations",
      "SaaS Growth Strategy",
      "Leadership Alignment",
      "Creative Direction",
      "Fractional CMO",
      "Fractional Chief Branding Officer",
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does a fractional CMO cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fractional CMO engagements typically range from $5,000 to $15,000 per month depending on scope, stage, and complexity. This is a fraction of the cost of a full-time CMO hire while delivering the same level of strategic leadership."
        }
      },
      {
        "@type": "Question",
        "name": "What does a fractional CMO do?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A fractional CMO is an experienced chief marketing officer who provides executive-level leadership on a part-time basis. Unlike agencies, a fractional CMO operates inside the business—guiding strategy, systems, and execution directly alongside the leadership team."
        }
      },
      {
        "@type": "Question",
        "name": "How many hours per week does a fractional CMO work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Engagements are structured around outcomes, not hours. Most partnerships involve weekly executive working sessions, asynchronous strategic direction, and direct involvement in key decisions—typically equivalent to 10–20 hours per week."
        }
      },
      {
        "@type": "Question",
        "name": "What makes QV BRANDS different from a marketing agency?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "QV BRANDS operates on a principal-led model where all strategy and direction come directly from Rick Julian. Agencies execute tasks. A fractional CMO architects strategic growth systems and leads decisions—operating inside the company, not outside it."
        }
      },
      {
        "@type": "Question",
        "name": "How long are fractional CMO engagements?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fractional CMO partnerships run 6–12 months. Growth Architecture Sprints are 90 days. Strategic Diagnostics deliver clarity in two weeks. The right format depends on the constraint."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEOFramework {...seoConfig} />
      <Hero />
      <ServiceArchitecture />
      <StrategicGrowthExplained />
      <Problem />
      <Shift />
      <HowIWork />
      <Partnership />
      <Engagements />
      <Proof />
      <WhoThisIsFor />
      <CommonQuestions />
      <FinalCTA />
    </div>
  );
};

export default Index;
