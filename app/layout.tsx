import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deeper | AI-Structured Mental Health Search',
  description: 'Evidence-informed mental health answers, crafted for both humans and machines.',
  metadataBase: new URL('https://deeper.global'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-white text-black">
      <body className={`${inter.className} bg-white text-black`}>
        {children}
      </body>
    </html>
  )
}