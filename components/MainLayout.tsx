import Link from 'next/link'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold text-gray-900">deeper</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/answers" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Browse Answers
              </Link>
              <Link 
                href="/protocol" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Protocol
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
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
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="text-xl font-bold text-gray-900">deeper</span>
              </div>
              <p className="text-gray-600 max-w-md">
                Evidence-informed mental health answers, crafted for both humans and machines.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Navigate</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/answers" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Browse Answers
                  </Link>
                </li>
                <li>
                  <Link href="/protocol" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Protocol
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Information</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/protocol" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Curation Process
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 Deeper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
