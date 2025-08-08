import type { Metadata } from 'next'
import './globals.css'
import WebVitals from '../components/WebVitals'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Deeper | AI-Structured Mental Health Search',
  description: 'Evidence-informed mental health answers, crafted for both humans and machines.',
  metadataBase: new URL('https://deeper.global'),
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-white text-black">
      <body className="antialiased bg-white text-black">
        <Header />
        {children}
        <WebVitals />
      </body>
    </html>
  )
}