interface SEOAuditResult {
  score: number;
  issues: string[];
  recommendations: string[];
  details: {
    title: AuditItem;
    description: AuditItem;
    keywords: AuditItem;
    canonical: AuditItem;
    openGraph: AuditItem;
    twitterCard: AuditItem;
    schema: AuditItem;
    images: AuditItem;
    performance: AuditItem;
    accessibility: AuditItem;
  };
}

interface AuditItem {
  status: 'pass' | 'warning' | 'fail';
  score: number;
  message: string;
  details?: string[];
}

export const auditSEO = async (): Promise<SEOAuditResult> => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let totalScore = 0;
  const maxScore = 100;

  // Title audit
  const titleAudit = auditTitle();
  totalScore += titleAudit.score;

  // Description audit
  const descriptionAudit = auditMetaDescription();
  totalScore += descriptionAudit.score;

  // Keywords audit
  const keywordsAudit = auditKeywords();
  totalScore += keywordsAudit.score;

  // Canonical audit
  const canonicalAudit = auditCanonical();
  totalScore += canonicalAudit.score;

  // Open Graph audit
  const openGraphAudit = auditOpenGraph();
  totalScore += openGraphAudit.score;

  // Twitter Card audit
  const twitterCardAudit = auditTwitterCard();
  totalScore += twitterCardAudit.score;

  // Schema audit
  const schemaAudit = await auditSchema();
  totalScore += schemaAudit.score;

  // Images audit
  const imagesAudit = auditImages();
  totalScore += imagesAudit.score;

  // Performance audit
  const performanceAudit = await auditPerformance();
  totalScore += performanceAudit.score;

  // Accessibility audit
  const accessibilityAudit = auditAccessibility();
  totalScore += accessibilityAudit.score;

  // Collect issues and recommendations
  const allAudits = [
    titleAudit, descriptionAudit, keywordsAudit, canonicalAudit,
    openGraphAudit, twitterCardAudit, schemaAudit, imagesAudit,
    performanceAudit, accessibilityAudit
  ];

  allAudits.forEach(audit => {
    if (audit.status === 'fail') {
      issues.push(audit.message);
    } else if (audit.status === 'warning') {
      recommendations.push(audit.message);
    }
  });

  const finalScore = Math.round((totalScore / allAudits.length));

  return {
    score: finalScore,
    issues,
    recommendations,
    details: {
      title: titleAudit,
      description: descriptionAudit,
      keywords: keywordsAudit,
      canonical: canonicalAudit,
      openGraph: openGraphAudit,
      twitterCard: twitterCardAudit,
      schema: schemaAudit,
      images: imagesAudit,
      performance: performanceAudit,
      accessibility: accessibilityAudit
    }
  };
};

const auditTitle = (): AuditItem => {
  const title = document.title;
  
  if (!title) {
    return {
      status: 'fail',
      score: 0,
      message: 'Missing page title'
    };
  }

  if (title.length < 30) {
    return {
      status: 'warning',
      score: 7,
      message: 'Title is too short (recommended: 30-60 characters)',
      details: [`Current length: ${title.length} characters`]
    };
  }

  if (title.length > 60) {
    return {
      status: 'warning',
      score: 8,
      message: 'Title is too long (recommended: 30-60 characters)',
      details: [`Current length: ${title.length} characters`]
    };
  }

  return {
    status: 'pass',
    score: 10,
    message: 'Title length is optimal'
  };
};

const auditMetaDescription = (): AuditItem => {
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
  
  if (!description) {
    return {
      status: 'fail',
      score: 0,
      message: 'Missing meta description'
    };
  }

  if (description.length < 120) {
    return {
      status: 'warning',
      score: 7,
      message: 'Meta description is too short (recommended: 120-160 characters)',
      details: [`Current length: ${description.length} characters`]
    };
  }

  if (description.length > 160) {
    return {
      status: 'warning',
      score: 8,
      message: 'Meta description is too long (recommended: 120-160 characters)',
      details: [`Current length: ${description.length} characters`]
    };
  }

  return {
    status: 'pass',
    score: 10,
    message: 'Meta description length is optimal'
  };
};

const auditKeywords = (): AuditItem => {
  const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
  
  if (!keywords) {
    return {
      status: 'warning',
      score: 7,
      message: 'No meta keywords found (optional but recommended for internal tracking)'
    };
  }

  const keywordArray = keywords.split(',').map(k => k.trim());
  
  if (keywordArray.length > 10) {
    return {
      status: 'warning',
      score: 8,
      message: 'Too many keywords (recommended: 5-10 focused keywords)',
      details: [`Current count: ${keywordArray.length} keywords`]
    };
  }

  return {
    status: 'pass',
    score: 10,
    message: 'Keywords are well-structured'
  };
};

const auditCanonical = (): AuditItem => {
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  
  if (!canonical) {
    return {
      status: 'fail',
      score: 0,
      message: 'Missing canonical URL'
    };
  }

  try {
    const canonicalUrl = new URL(canonical);
    const currentUrl = new URL(window.location.href);
    
    if (canonicalUrl.hostname !== currentUrl.hostname) {
      return {
        status: 'warning',
        score: 7,
        message: 'Canonical URL points to different domain',
        details: [`Canonical: ${canonicalUrl.hostname}`, `Current: ${currentUrl.hostname}`]
      };
    }

    return {
      status: 'pass',
      score: 10,
      message: 'Canonical URL is properly set'
    };
  } catch (error) {
    return {
      status: 'fail',
      score: 3,
      message: 'Invalid canonical URL format'
    };
  }
};

const auditOpenGraph = (): AuditItem => {
  const ogTags = {
    title: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    description: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    image: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    type: document.querySelector('meta[property="og:type"]')?.getAttribute('content'),
    url: document.querySelector('meta[property="og:url"]')?.getAttribute('content')
  };

  const missingTags = Object.entries(ogTags)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  if (missingTags.length > 2) {
    return {
      status: 'fail',
      score: 2,
      message: 'Multiple Open Graph tags missing',
      details: [`Missing: ${missingTags.join(', ')}`]
    };
  }

  if (missingTags.length > 0) {
    return {
      status: 'warning',
      score: 7,
      message: 'Some Open Graph tags missing',
      details: [`Missing: ${missingTags.join(', ')}`]
    };
  }

  return {
    status: 'pass',
    score: 10,
    message: 'Open Graph tags are complete'
  };
};

const auditTwitterCard = (): AuditItem => {
  const twitterTags = {
    card: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
    title: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
    description: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content'),
    image: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')
  };

  const missingTags = Object.entries(twitterTags)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  if (missingTags.length > 2) {
    return {
      status: 'warning',
      score: 5,
      message: 'Multiple Twitter Card tags missing',
      details: [`Missing: ${missingTags.join(', ')}`]
    };
  }

  if (missingTags.length > 0) {
    return {
      status: 'warning',
      score: 8,
      message: 'Some Twitter Card tags missing',
      details: [`Missing: ${missingTags.join(', ')}`]
    };
  }

  return {
    status: 'pass',
    score: 10,
    message: 'Twitter Card tags are complete'
  };
};

const auditSchema = async (): Promise<AuditItem> => {
  const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
  
  if (schemaScripts.length === 0) {
    return {
      status: 'fail',
      score: 0,
      message: 'No structured data found'
    };
  }

  const schemas: any[] = [];
  const validSchemas: string[] = [];
  const invalidSchemas: string[] = [];

  schemaScripts.forEach((script, index) => {
    try {
      const schema = JSON.parse(script.textContent || '');
      schemas.push(schema);
      validSchemas.push(schema['@type'] || `Schema ${index + 1}`);
    } catch (error) {
      invalidSchemas.push(`Schema ${index + 1}`);
    }
  });

  if (invalidSchemas.length > 0) {
    return {
      status: 'warning',
      score: 6,
      message: 'Some structured data has invalid JSON',
      details: [`Invalid: ${invalidSchemas.join(', ')}`, `Valid: ${validSchemas.join(', ')}`]
    };
  }

  // Check for required schema types
  const requiredTypes = ['Organization', 'ProfessionalService', 'Website'];
  const foundTypes = schemas.map(s => s['@type']).filter(Boolean);
  const missingRequired = requiredTypes.filter(type => !foundTypes.includes(type));

  if (missingRequired.length > 0) {
    return {
      status: 'warning',
      score: 7,
      message: 'Missing recommended schema types',
      details: [`Missing: ${missingRequired.join(', ')}`, `Found: ${foundTypes.join(', ')}`]
    };
  }

  return {
    status: 'pass',
    score: 10,
    message: 'Structured data is properly implemented',
    details: [`Schema types: ${validSchemas.join(', ')}`]
  };
};

const auditImages = (): AuditItem => {
  const images = document.querySelectorAll('img');
  const issues: string[] = [];
  
  images.forEach((img, index) => {
    if (!img.alt) {
      issues.push(`Image ${index + 1}: Missing alt attribute`);
    }
    if (!img.loading && !img.hasAttribute('loading')) {
      issues.push(`Image ${index + 1}: Missing loading attribute for lazy loading`);
    }
  });

  if (issues.length > images.length * 0.5) {
    return {
      status: 'fail',
      score: 3,
      message: 'Multiple image optimization issues found',
      details: issues.slice(0, 5)
    };
  }

  if (issues.length > 0) {
    return {
      status: 'warning',
      score: 7,
      message: 'Some image optimization opportunities',
      details: issues.slice(0, 3)
    };
  }

  return {
    status: 'pass',
    score: 10,
    message: 'Images are well optimized'
  };
};

const auditPerformance = async (): Promise<AuditItem> => {
  try {
    // Get Core Web Vitals if available
    const { getCoreWebVitals } = await import('@/hooks/useSEO');
    const vitals = await getCoreWebVitals();
    
    const issues: string[] = [];
    
    if (vitals.LCP && vitals.LCP > 2500) {
      issues.push(`LCP too slow: ${vitals.LCP}ms (should be < 2500ms)`);
    }
    
    if (vitals.INP && vitals.INP > 200) {
      issues.push(`INP too high: ${vitals.INP}ms (should be < 200ms)`);
    }
    
    if (vitals.CLS && vitals.CLS > 0.1) {
      issues.push(`CLS too high: ${vitals.CLS} (should be < 0.1)`);
    }

    if (issues.length > 1) {
      return {
        status: 'warning',
        score: 5,
        message: 'Multiple Core Web Vitals issues',
        details: issues
      };
    }

    if (issues.length === 1) {
      return {
        status: 'warning',
        score: 7,
        message: 'One Core Web Vitals issue',
        details: issues
      };
    }

    return {
      status: 'pass',
      score: 10,
      message: 'Core Web Vitals are good'
    };
  } catch (error) {
    return {
      status: 'warning',
      score: 8,
      message: 'Unable to measure Core Web Vitals'
    };
  }
};

const auditAccessibility = (): AuditItem => {
  const issues: string[] = [];
  
  // Check for missing alt texts
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} images missing alt text`);
  }

  // Check for proper heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const h1Count = document.querySelectorAll('h1').length;
  
  if (h1Count === 0) {
    issues.push('No H1 heading found');
  } else if (h1Count > 1) {
    issues.push('Multiple H1 headings found');
  }

  // Check for form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  const inputsWithoutLabels = Array.from(inputs).filter(input => {
    const id = input.id;
    return !id || !document.querySelector(`label[for="${id}"]`);
  });
  
  if (inputsWithoutLabels.length > 0) {
    issues.push(`${inputsWithoutLabels.length} form inputs missing labels`);
  }

  if (issues.length > 2) {
    return {
      status: 'fail',
      score: 4,
      message: 'Multiple accessibility issues',
      details: issues
    };
  }

  if (issues.length > 0) {
    return {
      status: 'warning',
      score: 7,
      message: 'Some accessibility improvements needed',
      details: issues
    };
  }

  return {
    status: 'pass',
    score: 10,
    message: 'Good accessibility practices'
  };
};

export const runAuditReport = async () => {
  console.log('🔍 Running SEO Audit...');
  
  const result = await auditSEO();
  
  console.log(`\n📊 SEO AUDIT RESULTS`);
  console.log(`Overall Score: ${result.score}/100`);
  
  if (result.score >= 95) {
    console.log('🎉 Excellent! Your SEO implementation is outstanding.');
  } else if (result.score >= 80) {
    console.log('✅ Good! Minor improvements needed.');
  } else if (result.score >= 60) {
    console.log('⚠️ Fair. Several issues need attention.');
  } else {
    console.log('❌ Poor. Significant SEO improvements required.');
  }

  if (result.issues.length > 0) {
    console.log('\n🚨 Critical Issues:');
    result.issues.forEach(issue => console.log(`  • ${issue}`));
  }

  if (result.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    result.recommendations.forEach(rec => console.log(`  • ${rec}`));
  }

  console.log('\n📋 Detailed Breakdown:');
  Object.entries(result.details).forEach(([key, audit]) => {
    const emoji = audit.status === 'pass' ? '✅' : audit.status === 'warning' ? '⚠️' : '❌';
    console.log(`  ${emoji} ${key}: ${audit.score}/10 - ${audit.message}`);
    if (audit.details) {
      audit.details.forEach(detail => console.log(`    ${detail}`));
    }
  });

  return result;
};