import Link from 'next/link'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-black">deeper</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/answers" 
                className="text-black hover:underline"
              >
                Browse Answers
              </Link>
              <Link 
                href="/protocol" 
                className="text-black hover:underline"
              >
                Protocol
              </Link>
              <Link 
                href="/about" 
                className="text-black hover:underline"
              >
                About
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-300 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-black">
            <p>&copy; 2024 Deeper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
