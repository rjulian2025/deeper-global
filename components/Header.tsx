import Link from "next/link";
import { headers } from "next/headers";

export default function Header() {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";
  
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Black text logo -> always link home */}
        <Link 
          href="/" 
          className="text-lg font-semibold tracking-tight text-black hover:text-gray-700 transition-colors duration-200"
        >
          Deeper
        </Link>

        {/* Right-side minimal nav */}
        <nav className="hidden gap-6 text-sm text-gray-700 md:flex">
          <Link 
            href="/answers" 
            className={`relative px-1 py-2 transition-all duration-200 hover:text-gray-900 ${
              isActive("/answers") 
                ? "text-black font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black after:content-['']" 
                : "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-0.5 hover:after:w-full hover:after:bg-gray-300 hover:after:content-['']"
            }`}
          >
            Browse
          </Link>
          <Link 
            href="/protocol" 
            className={`relative px-1 py-2 transition-all duration-200 hover:text-gray-900 ${
              isActive("/protocol") 
                ? "text-black font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black after:content-['']" 
                : "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-0.5 hover:after:w-full hover:after:bg-gray-300 hover:after:content-['']"
            }`}
          >
            Protocol
          </Link>
          <Link 
            href="/about" 
            className={`relative px-1 py-2 transition-all duration-200 hover:text-gray-900 ${
              isActive("/about") 
                ? "text-black font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black after:content-['']" 
                : "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-0.5 hover:after:w-full hover:after:bg-gray-300 hover:after:content-['']"
            }`}
          >
            About
          </Link>
        </nav>

        {/* Mobile menu placeholder (optional) */}
        <div className="md:hidden">
          {/* (Optional) Later: add a tiny client dropdown for mobile */}
        </div>
      </div>
    </header>
  );
}
