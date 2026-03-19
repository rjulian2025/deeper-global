"use client";

import { useEffect, useState } from "react";
import Link from "@/components/Link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Navigation = () => {
  const [pathname, setPathname] = useState("");
  useEffect(() => setPathname(window.location.pathname), []);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 shadow-sm"
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img src="/lovable-uploads/qv-initials-black.png" alt="QV BRANDS" className="h-10" />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === '/about' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            About
          </Link>
          
          <Link 
            href="/clients" 
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === '/clients' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Clients
          </Link>
          
          <Link 
            href="/case-study/loopo" 
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === '/case-study/loopo' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Case Work
          </Link>
          
          <Link 
            href="/strategic-answers" 
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname?.startsWith('/strategic-answers') ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Strategic Answers
          </Link>
          
          <Link 
            href="/packages"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === '/packages' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Packages
          </Link>
          
          <Link 
            href="/consultation" 
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              pathname === '/consultation' ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Consultation
          </Link>
          
          <Button
            asChild
            variant="default"
            size="sm"
            className="bg-foreground text-background hover:bg-foreground/90 group"
          >
            <a 
              href="https://calendar.app.google/sXUh3xXCDNCKir8u6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Strategic Consult
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
