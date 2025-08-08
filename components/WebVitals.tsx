'use client'

import { useEffect } from 'react'

export default function WebVitals() {
  useEffect(() => {
    const sendToGA = (metric: any) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        })
      }
    }

    const loadWebVitals = async () => {
      try {
        const { onCLS, onINP, onLCP } = await import('web-vitals')
        
        onCLS(sendToGA)
        onINP(sendToGA)
        onLCP(sendToGA)
      } catch (error) {
        console.warn('Failed to load web-vitals:', error)
      }
    }

    // Defer web-vitals loading to idle time
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadWebVitals())
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => loadWebVitals(), 1000)
      }
    }
  }, [])

  return null
}
