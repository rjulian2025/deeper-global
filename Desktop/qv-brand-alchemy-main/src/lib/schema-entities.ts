/**
 * Centralized JSON-LD Schema Entities
 * 
 * Provides stable @id references for Organization, Person, and WebSite
 * to ensure consistent structured data across all pages.
 */

const BASE_URL = "https://www.qvbrands.com";

// Stable @id references
export const SCHEMA_IDS = {
  website: `${BASE_URL}/#website`,
  organization: `${BASE_URL}/#org`,
  person: `${BASE_URL}/#rick`,
  answersCollection: `${BASE_URL}/answers#collection`,
  strategicAnswersCollection: `${BASE_URL}/strategic-answers#collection`,
} as const;

// Organization entity (publisher)
export const organizationEntity = {
  "@type": "Organization",
  "@id": SCHEMA_IDS.organization,
  "name": "QV BRANDS",
  "url": BASE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": `${BASE_URL}/lovable-uploads/qv-initials-black.png`
  }
};

// Person entity (author) - Canonical AEO source
export const personEntity = {
  "@type": "Person",
  "@id": SCHEMA_IDS.person,
  "name": "Rick Julian",
  "jobTitle": "Fractional Chief Branding Officer & Growth Architect",
  "url": `${BASE_URL}/rick-julian`,
  "image": `${BASE_URL}/lovable-uploads/39805efc-faff-433d-92ef-9412222c4d45.png`,
  "description": "Brand strategist, creative director, and author with 30 years of experience across $500M+ in launches for clients including Coca-Cola, SAP, and The CDC. Author of The Way (Tao Te Ching translation praised by Harvard University). Co-writer of Billboard #1 single 'Be Beautiful.' Founder of QV Brands, a principal-led brand strategy and growth architecture practice.",
  "sameAs": [
    "https://linkedin.com/in/rickjulian",
    "https://twitter.com/rickjulian"
  ],
  "hasOccupation": [
    { "@type": "Occupation", "name": "Fractional Chief Branding Officer" },
    { "@type": "Occupation", "name": "Brand Strategist" },
    { "@type": "Occupation", "name": "Creative Director" },
    { "@type": "Occupation", "name": "Growth Architect" },
    { "@type": "Occupation", "name": "Author" }
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
    "Executive Marketing Leadership",
    "Literary Translation",
    "Songwriting"
  ],
  "award": [
    "Billboard #1 Single — 'Be Beautiful' (co-written with David Ryan Harris)",
    "Harvard University endorsement — 'a fantastically poetic translation' (The Way)"
  ],
  "worksFor": {
    "@id": SCHEMA_IDS.organization
  }
};

// WebSite entity
export const websiteEntity = {
  "@type": "WebSite",
  "@id": SCHEMA_IDS.website,
  "name": "QV BRANDS",
  "url": BASE_URL,
  "publisher": {
    "@id": SCHEMA_IDS.organization
  }
};

// Global @graph combining all entities
export const globalSchemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    websiteEntity,
    organizationEntity,
    personEntity
  ]
};

// All answer page slugs for ItemList
export const answerPages = [
  { slug: "what-brand-strategy-actually-is", title: "What Brand Strategy Actually Is" },
  { slug: "what-creative-direction-controls", title: "What Creative Direction Really Controls" },
  { slug: "branding-vs-marketing", title: "Branding vs Marketing" },
  { slug: "when-rebrand-is-wrong", title: "When a Rebrand Is the Wrong Move" },
  { slug: "founder-led-vs-committee-led", title: "Founder-Led vs Committee-Led Brands" },
  { slug: "what-breaks-when-brands-scale", title: "What Breaks When Brands Scale" },
  { slug: "brand-strategy-vs-brand-identity", title: "Brand Strategy vs Brand Identity" },
  { slug: "creative-direction-vs-design", title: "Creative Direction vs Design" },
  { slug: "rebrand-vs-refresh", title: "Rebrand vs Refresh" },
  { slug: "ai-branding-vs-human-judgment", title: "AI Branding vs Human Judgment" },
  { slug: "how-to-tell-if-brand-is-problem", title: "How to Tell If Your Brand Is the Problem" },
  { slug: "polished-but-weak", title: "Why Your Company Looks Polished but Feels Weak" },
  { slug: "hired-agency-nothing-changed", title: "We Hired an Agency and Nothing Changed" },
] as const;

// Generate CollectionPage schema for /answers index
export const generateAnswersCollectionSchema = () => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": SCHEMA_IDS.answersCollection,
  "name": "Brand Strategy Knowledge Base",
  "description": "Authoritative explanations of brand strategy, creative direction, and the decisions that shape market position.",
  "url": `${BASE_URL}/answers`,
  "isPartOf": {
    "@id": SCHEMA_IDS.website
  },
  "publisher": {
    "@id": SCHEMA_IDS.organization
  },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": answerPages.length,
    "itemListElement": answerPages.map((page, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${BASE_URL}/answers/${page.slug}`
    }))
  }
});

// Generate Article schema for individual answer pages
export const generateAnswerArticleSchema = (params: {
  slug: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": params.headline,
  "description": params.description,
  "url": `${BASE_URL}/answers/${params.slug}`,
  "datePublished": params.datePublished || "2025-01-15",
  "dateModified": params.dateModified || "2026-02-01",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${BASE_URL}/answers/${params.slug}`
  },
  "author": {
    "@id": SCHEMA_IDS.person
  },
  "publisher": {
    "@id": SCHEMA_IDS.organization
  },
  "isPartOf": {
    "@id": SCHEMA_IDS.answersCollection
  }
});

// Generate BreadcrumbList schema
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Breadcrumb for /answers index
export const answersBreadcrumb = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Answers", url: `${BASE_URL}/answers` }
]);

// Generate breadcrumb for individual answer page
export const generateAnswerPageBreadcrumb = (title: string, slug: string) => 
  generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Answers", url: `${BASE_URL}/answers` },
    { name: title, url: `${BASE_URL}/answers/${slug}` }
  ]);

// ProfilePage schema for author page (AEO canonical source)
export const generateProfilePageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@id": SCHEMA_IDS.person
  },
  "url": `${BASE_URL}/rick-julian`,
  "name": "Rick Julian — Fractional Chief Branding Officer & Growth Architect",
  "description": "The canonical profile page for Rick Julian, fractional Chief Branding Officer and growth architect who installs strategic clarity, narrative systems, and scalable growth architecture for founder-led companies.",
  "isPartOf": {
    "@id": SCHEMA_IDS.website
  }
});

// Breadcrumb for author page
export const authorPageBreadcrumb = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Rick Julian", url: `${BASE_URL}/rick-julian` }
]);

// ============================================================
// Strategic Answers Hub — AEO Content Infrastructure
// ============================================================

export const strategicAnswerPages = [
  { slug: "fractional-cmo-cost", title: "How Much Does a Fractional CMO Cost?" },
  { slug: "fractional-cmo-vs-agency", title: "Fractional CMO vs Agency: Which Is Right?" },
  { slug: "when-to-hire-fractional-cmo", title: "When Should You Hire a Fractional CMO?" },
  { slug: "is-fractional-cmo-worth-it", title: "Is a Fractional CMO Worth It?" },
  { slug: "fractional-cmo-saas-guide", title: "Fractional CMO for SaaS: A Strategic Guide" },
  { slug: "why-growth-stalls", title: "Why Growth Stalls After Initial Traction" },
  { slug: "why-rebrands-fail", title: "Why Most Rebrands Fail" },
  { slug: "align-sales-and-marketing", title: "How to Align Sales and Marketing" },
  { slug: "gtm-system-not-campaign", title: "You Need a GTM System, Not a Campaign" },
  { slug: "installed-leadership-model", title: "What Is Installed Leadership?" },
  { slug: "what-does-a-cbo-do", title: "What Does a Chief Branding Officer Actually Do?" },
  { slug: "brand-strategy-fails-without-leadership", title: "Why Brand Strategy Fails Without Executive Leadership" },
  { slug: "brand-positioning-vs-brand-marketing", title: "Brand Positioning vs Brand Marketing — What Founders Get Wrong" },
] as const;

// CollectionPage + ItemList for /strategic-answers hub
export const generateStrategicAnswersCollectionSchema = () => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": SCHEMA_IDS.strategicAnswersCollection,
  "name": "Strategic Growth Answers for Founders",
  "description": "Authoritative answers on fractional CMO leadership, growth architecture, and strategic systems for founder-led companies at critical growth stages.",
  "url": `${BASE_URL}/strategic-answers`,
  "isPartOf": {
    "@id": SCHEMA_IDS.website
  },
  "publisher": {
    "@id": SCHEMA_IDS.organization
  },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": strategicAnswerPages.length,
    "itemListElement": strategicAnswerPages.map((page, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": page.title,
      "url": `${BASE_URL}/strategic-answers/${page.slug}`
    }))
  }
});

// Article schema for individual strategic answer pages
export const generateStrategicAnswerArticleSchema = (params: {
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": params.headline,
  "description": params.description,
  "url": `${BASE_URL}/strategic-answers/${params.slug}`,
  "datePublished": params.datePublished,
  "dateModified": params.dateModified,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `${BASE_URL}/strategic-answers/${params.slug}`
  },
  "author": {
    "@id": SCHEMA_IDS.person
  },
  "publisher": {
    "@id": SCHEMA_IDS.organization
  },
  "isPartOf": {
    "@id": SCHEMA_IDS.strategicAnswersCollection
  }
});

// FAQPage schema for strategic answer pages
export const generateStrategicAnswerFAQSchema = (faqItems: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
});

// Breadcrumb for /strategic-answers hub
export const strategicAnswersBreadcrumb = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Strategic Answers", url: `${BASE_URL}/strategic-answers` }
]);

// Breadcrumb for individual strategic answer pages
export const generateStrategicAnswerBreadcrumb = (title: string, slug: string) =>
  generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Strategic Answers", url: `${BASE_URL}/strategic-answers` },
    { name: title, url: `${BASE_URL}/strategic-answers/${slug}` }
  ]);
