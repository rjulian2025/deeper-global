import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  SEOConfig, 
  businessInfo, 
  generateLocalBusinessSchema, 
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  formatMetaTitle 
} from '@/lib/seo';

interface CoreWebVitals {
  LCP?: number;
  INP?: number;
  CLS?: number;
}

interface UseSEOOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  schema?: any[];
}

export const useSEO = (options: UseSEOOptions): SEOConfig => {
  const location = useLocation();
  const [vitals, setVitals] = useState<CoreWebVitals>({});

  // Track Core Web Vitals
  useEffect(() => {
    const trackVitals = async () => {
      try {
        const { onCLS, onINP, onLCP } = await import('web-vitals');
        
        onCLS((metric) => {
          setVitals(prev => ({ ...prev, CLS: metric.value }));
          // Send to GA4
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              metric_name: 'CLS',
              metric_value: metric.value,
              metric_id: metric.id
            });
          }
        });

        onINP((metric) => {
          setVitals(prev => ({ ...prev, INP: metric.value }));
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              metric_name: 'INP',
              metric_value: metric.value,
              metric_id: metric.id
            });
          }
        });

        onLCP((metric) => {
          setVitals(prev => ({ ...prev, LCP: metric.value }));
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              metric_name: 'LCP',
              metric_value: metric.value,
              metric_id: metric.id
            });
          }
        });
      } catch (error) {
        console.warn('Web Vitals library not available:', error);
      }
    };

    trackVitals();
  }, []);

  // Track page views
  useEffect(() => {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search,
        page_title: options.title
      });
    }
  }, [location, options.title]);

  const canonical = `${businessInfo.url}${location.pathname}`;
  
  // Generate default schemas
  const defaultSchemas: any[] = [
    generateLocalBusinessSchema(businessInfo),
    generateWebsiteSchema()
  ];

  // Add breadcrumb schema if breadcrumbs provided
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    defaultSchemas.push(generateBreadcrumbSchema(options.breadcrumbs));
  }

  // Combine with any additional schemas
  const allSchemas = [...defaultSchemas, ...(options.schema || [])];

  return {
    title: formatMetaTitle(options.title),
    description: options.description,
    keywords: options.keywords,
    canonical,
    openGraph: {
      title: options.title,
      description: options.description,
      image: options.image,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      image: options.image
    },
    schema: allSchemas
  };
};

// Global gtag function declaration
declare global {
  function gtag(...args: any[]): void;
}

export const usePageView = (title: string) => {
  const location = useLocation();

  useEffect(() => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: location.pathname + location.search
      });
    }
  }, [location, title]);
};

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }
};

export const getCoreWebVitals = () => {
  return new Promise<CoreWebVitals>((resolve) => {
    const vitals: CoreWebVitals = {};
    
    const checkVitals = async () => {
      try {
        const { onCLS, onINP, onLCP } = await import('web-vitals');
        
        let count = 0;
        const expectedMetrics = 3;

        const checkComplete = () => {
          count++;
          if (count >= expectedMetrics) {
            resolve(vitals);
          }
        };

        onCLS((metric) => {
          vitals.CLS = metric.value;
          checkComplete();
        });

        onINP((metric) => {
          vitals.INP = metric.value;
          checkComplete();
        });

        onLCP((metric) => {
          vitals.LCP = metric.value;
          checkComplete();
        });

        // Fallback timeout
        setTimeout(() => resolve(vitals), 5000);
      } catch (error) {
        resolve(vitals);
      }
    };

    checkVitals();
  });
};