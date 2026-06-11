export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  schema?: any[];
}

export interface BusinessInfo {
  name: string;
  description: string;
  url: string;
  logo: string;
  founder: {
    name: string;
    jobTitle: string;
  };
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  contactPoint: {
    telephone: string;
    email: string;
    contactType: string;
  };
  sameAs: string[];
  foundingDate: string;
  areaServed: string;
  serviceType: string[];
}

export const businessInfo: BusinessInfo = {
  name: "QV BRANDS",
  description: "Fractional CMO and brand growth architecture for founder-led companies at critical growth stages. Installed executive leadership combining narrative strategy, creative direction, and scalable growth systems.",
  url: "https://www.qvbrands.com",
  logo: "https://www.qvbrands.com/images/logo.png",
  founder: {
    name: "Rick Julian",
    jobTitle: "Fractional CMO & Brand Growth Architect"
  },
  address: {
    streetAddress: "1234 Brand Street",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    postalCode: "30309",
    addressCountry: "US"
  },
  geo: {
    latitude: 33.7490,
    longitude: -84.3880
  },
  contactPoint: {
    telephone: "+1-555-QV-BRAND",
    email: "hello@qvbrands.com",
    contactType: "customer service"
  },
  sameAs: [
    "https://linkedin.com/company/qvbrands",
    "https://instagram.com/qvbrands",
    "https://twitter.com/qvbrands"
  ],
  foundingDate: "2003-01-01",
  areaServed: "Global",
  serviceType: [
    "Fractional CMO",
    "Brand Architecture", 
    "Growth Systems",
    "Go-to-Market Strategy",
    "Narrative Strategy",
    "Creative Direction"
  ]
};

export const generateLocalBusinessSchema = (businessData: BusinessInfo) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${businessData.url}/#organization`,
  "name": businessData.name,
  "url": businessData.url,
  "description": businessData.description,
  "logo": {
    "@type": "ImageObject",
    "url": businessData.logo
  },
  "founder": {
    "@type": "Person",
    "name": businessData.founder.name,
    "jobTitle": businessData.founder.jobTitle
  },
  "foundingDate": businessData.foundingDate,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": businessData.address.streetAddress,
    "addressLocality": businessData.address.addressLocality,
    "addressRegion": businessData.address.addressRegion,
    "postalCode": businessData.address.postalCode,
    "addressCountry": businessData.address.addressCountry
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": businessData.geo.latitude,
    "longitude": businessData.geo.longitude
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": businessData.contactPoint.telephone,
    "email": businessData.contactPoint.email,
    "contactType": businessData.contactPoint.contactType
  },
  "sameAs": businessData.sameAs,
  "areaServed": businessData.areaServed,
  "serviceType": businessData.serviceType,
  "priceRange": "$$$$"
});

export const generateArticleSchema = (article: {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.headline,
  "description": article.description,
  "author": {
    "@type": "Person",
    "name": article.author,
    "url": `${businessInfo.url}/rick-julian`
  },
  "publisher": {
    "@type": "Organization",
    "name": businessInfo.name,
    "url": businessInfo.url,
    "logo": {
      "@type": "ImageObject",
      "url": businessInfo.logo
    }
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  },
  "image": article.image ? {
    "@type": "ImageObject",
    "url": article.image
  } : undefined
});

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Website",
  "@id": `${businessInfo.url}/#website`,
  "url": businessInfo.url,
  "name": businessInfo.name,
  "description": businessInfo.description,
  "publisher": {
    "@id": `${businessInfo.url}/#organization`
  },
  "potentialAction": [
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${businessInfo.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  ]
});

export const generatePersonSchema = (person: {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  sameAs?: string[];
  knowsAbout?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": person.name,
  "jobTitle": person.jobTitle,
  "description": person.description,
  "image": person.image,
  "url": `${businessInfo.url}/rick-julian`,
  "worksFor": {
    "@id": `${businessInfo.url}/#organization`
  },
  "sameAs": person.sameAs || [],
  "knowsAbout": person.knowsAbout || []
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateSitemap = (pages: Array<{
  url: string;
  lastModified?: string;
  changeFrequency?: string;
  priority?: number;
}>) => {
  const baseUrl = businessInfo.url;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changeFrequency || 'weekly'}</changefreq>
    <priority>${page.priority || 0.8}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export const defaultPages = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' },
  { url: '/contact', priority: 0.9, changeFrequency: 'monthly' },
  { url: '/meet-the-strategist', priority: 0.9, changeFrequency: 'monthly' },
  { url: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/packages', priority: 0.9, changeFrequency: 'monthly' },
  { url: '/consultation', priority: 0.9, changeFrequency: 'monthly' },
  { url: '/clients', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/ai-content', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/case-study/loopo', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/blog', priority: 0.8, changeFrequency: 'daily' },
  { url: '/blog/brand-strategy-in-synthetic-era', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/blog/brand-archetypes-ai-era', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/blog/clarity-in-the-age-of-ai', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/blog/clarity-operating-system', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/blog/mad-buddha', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/blog/scale-without-losing-soul', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/blog/second-brain-architecture', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/blog/strategy-is-the-new-logo', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/blog/what-is-a-clarity-system', priority: 0.7, changeFrequency: 'monthly' }
];

export const formatMetaTitle = (title: string, includeBusinessName = true) => {
  if (includeBusinessName && !title.includes(businessInfo.name)) {
    return `${title} | ${businessInfo.name}`;
  }
  return title;
};

export const truncateDescription = (description: string, maxLength = 160) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
};

export const generateMetaTags = (config: SEOConfig) => {
  const tags = [
    { name: 'description', content: truncateDescription(config.description) },
    { name: 'keywords', content: config.keywords?.join(', ') || '' },
    { property: 'og:title', content: config.openGraph?.title || config.title },
    { property: 'og:description', content: config.openGraph?.description || config.description },
    { property: 'og:type', content: config.openGraph?.type || 'website' },
    { property: 'og:url', content: config.canonical || window.location.href },
    { property: 'og:site_name', content: businessInfo.name },
    { name: 'twitter:card', content: config.twitter?.card || 'summary_large_image' },
    { name: 'twitter:title', content: config.twitter?.title || config.title },
    { name: 'twitter:description', content: config.twitter?.description || config.description },
  ];

  if (config.openGraph?.image) {
    tags.push({ property: 'og:image', content: config.openGraph.image });
  }

  if (config.twitter?.image) {
    tags.push({ name: 'twitter:image', content: config.twitter.image });
  }

  return tags.filter(tag => tag.content);
};