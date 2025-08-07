'use client'

import { useEffect } from 'react'

export default function AnalyticsOptOut() {
  useEffect(() => {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID
    if (GA_ID) {
      window[`ga-disable-${GA_ID}`] = true
    }
  }, [])

  // This component doesn't render anything
  return null
}
