import { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://deeper.global'
const SITE_NAME = 'Deeper'
const SITE_DESCRIPTION = 'Evidence-informed mental health answers, crafted for both humans and machines.'

export interface SEOConfig {
  title: string
  description?: string
  canonical?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export function buildMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    canonical,
    image = `${SITE_URL}/og-image.jpg`,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = SITE_NAME,
  } = config

  const fullTitle = title.includes('|') ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL

  const metadata: Metadata = {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@deeper_global',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  return metadata
}

// Convenience functions for common page types
export function buildHomeMetadata(): Metadata {
  return buildMetadata({
    title: 'Ask Anything. Deeper Listens.',
    description: '1,000+ evidence-informed answers for humans and machines.',
    canonical: '/',
  })
}

export function buildAnswersMetadata(): Metadata {
  return buildMetadata({
    title: 'All Answers',
    description: 'Browse our complete collection of evidence-informed mental health answers.',
    canonical: '/answers',
  })
}

export function buildQuestionMetadata(question: string, shortAnswer: string, slug: string): Metadata {
  return buildMetadata({
    title: question,
    description: shortAnswer,
    canonical: `/answers/${slug}`,
    type: 'article',
    publishedTime: new Date().toISOString(),
  })
}

export function buildClusterMetadata(clusterName: string, questionCount: number): Metadata {
  return buildMetadata({
    title: `${clusterName} Questions`,
    description: `${questionCount} mental health questions and answers in the ${clusterName} category.`,
    canonical: `/clusters/${encodeURIComponent(clusterName)}`,
  })
}
