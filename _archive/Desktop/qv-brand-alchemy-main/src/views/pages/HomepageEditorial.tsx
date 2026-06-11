import { Button } from "@/components/ui/button";
import Link from "@/components/Link";

/**
 * DESIGN DIRECTION: The New Editorial Standard
 * 
 * Visual Logic: Borrows the unwavering credibility of top-tier financial and geopolitical journalism.
 * Treats the consultancy's output not as "content," but as "intelligence."
 * Design relies on rigid typographic hierarchy and sophisticated use of white space.
 * 
 * Typography: Classical, authoritative serif for headlines paired with Swiss-style sans-serif for body.
 * Color: Strict monochrome with one muted "power" color (deep oxblood) used sparingly.
 * Emotional Signal: "We set the agenda. Read this and understand the reality of your situation."
 */

const HomepageEditorial = () => {
  // Deep oxblood accent
  const accentColor = '#8B2635';
  const paperBg = '#FAF9F6'; // Alabaster/bone paper
  const inkBlack = '#1a1a1a';
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: paperBg, color: inkBlack }}>
      {/* Navigation - Editorial masthead style */}
      <nav className="border-b border-black/10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/design-exploration" className="text-xs tracking-wide text-black/40 hover:text-black/60 transition-colors" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            ← Back to Exploration
          </Link>
          <div className="text-center">
            <span className="text-2xl tracking-[0.15em] font-semibold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>QV BRANDS</span>
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mt-1" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>Strategic Brand Intelligence</p>
          </div>
          <a 
            href="https://calendar.app.google/sXUh3xXCDNCKir8u6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs tracking-wide uppercase hover:underline"
            style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', color: accentColor }}
          >
            Book Consultation
          </a>
        </div>
      </nav>

      {/* Hero - Stark typographic statement */}
      <section className="py-32 md:py-48 px-8 border-b border-black/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', color: accentColor }}>
            Analysis
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.15] tracking-tight mb-12" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Most brands don't need more creativity.<br />
            <span className="italic">They need a decision.</span>
          </h1>
          
          <p className="text-lg md:text-xl leading-relaxed text-black/60 max-w-2xl" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            QV Brands provides strategic clarity for founder-led companies and global enterprises navigating brand-critical decisions.
          </p>
          
          {/* Editorial-style dateline */}
          <div className="mt-16 pt-8 border-t border-black/10 flex items-center gap-8 text-xs text-black/40" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            <span className="uppercase tracking-wide">Est. 2003</span>
            <span>·</span>
            <span className="uppercase tracking-wide">Atlanta & Global</span>
          </div>
        </div>
      </section>

      {/* Trusted By - Minimal, journalistic */}
      <section className="py-8 px-8 border-b border-black/10 bg-black/[0.02]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-4 text-center" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            Leadership teams include
          </p>
          <p className="text-sm text-black/50 tracking-wide text-center" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            Coca-Cola · IBM · US Marine Corps · McKinsey & Company · SAP · Marriott International
          </p>
        </div>
      </section>

      {/* Two-column editorial layout */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16">
            {/* Left column - Main content */}
            <div className="md:col-span-8">
              <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', color: accentColor }}>
                The Impact
              </p>
              
              <h2 className="text-3xl md:text-4xl font-normal leading-[1.2] tracking-tight mb-12" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                How this work<br />
                <span className="italic">actually shows up</span>
              </h2>
              
              <div className="space-y-12 text-lg leading-relaxed text-black/70" style={{ fontFamily: 'Georgia, serif' }}>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Clarity</h3>
                  <p>Brand positioning sharpens. Decisions get easier. Teams stop debating fundamentals and start executing with confidence.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Alignment</h3>
                  <p>Strategy, narrative, and execution lock together. Marketing, product, and leadership move in the same direction—faster.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>Signal</h3>
                  <p>The brand communicates clearly in-market. Customers understand who it's for, why it matters, and why to choose it.</p>
                </div>
              </div>
            </div>
            
            {/* Right column - Sidebar */}
            <div className="md:col-span-4">
              <div className="sticky top-24 space-y-12">
                <div className="p-6 border border-black/10">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-4" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                    The Model
                  </p>
                  <p className="text-sm leading-relaxed text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
                    Principal-led orchestration. Strategy and direction led directly by Rick Julian. Execution through a trusted global bench of senior specialists.
                  </p>
                </div>
                
                <div className="p-6 border-l-2" style={{ borderColor: accentColor }}>
                  <p className="text-sm italic text-black/50" style={{ fontFamily: 'Georgia, serif' }}>
                    "AI is used to accelerate exploration and execution—never to replace judgment, strategy, or creative leadership."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process - Numbered like an article */}
      <section className="py-24 px-8 border-t border-black/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', color: accentColor }}>
            The Process
          </p>
          
          <h2 className="text-3xl md:text-4xl font-normal leading-[1.2] tracking-tight mb-16" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            What happens after<br />
            <span className="italic">the Signal Call</span>
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-8 items-baseline border-b border-black/10 pb-8">
              <span className="text-4xl font-light" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: accentColor }}>1</span>
              <p className="text-lg" style={{ fontFamily: 'Georgia, serif' }}>We diagnose the core constraint holding the brand back</p>
            </div>
            
            <div className="flex gap-8 items-baseline border-b border-black/10 pb-8">
              <span className="text-4xl font-light" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: accentColor }}>2</span>
              <p className="text-lg" style={{ fontFamily: 'Georgia, serif' }}>We recommend the right level of engagement (or none)</p>
            </div>
            
            <div className="flex gap-8 items-baseline">
              <span className="text-4xl font-light" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: accentColor }}>3</span>
              <p className="text-lg" style={{ fontFamily: 'Georgia, serif' }}>You leave with a clear, confident next move</p>
            </div>
          </div>
          
          <p className="text-sm italic text-black/50 mt-12" style={{ fontFamily: 'Georgia, serif' }}>
            This is a working session—not a sales pitch.
          </p>
        </div>
      </section>

      {/* Qualification - Pull quote style */}
      <section className="py-24 px-8 bg-black/[0.03]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative">
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: accentColor }}>"</span>
            <p className="text-2xl md:text-3xl font-normal leading-relaxed pt-8" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              QV Brands is <em>not</em> for teams seeking surface-level design, endless options, or consensus-driven branding.
            </p>
          </div>
          <p className="text-lg text-black/50 mt-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            This work favors clarity, decisiveness, and leadership alignment.
          </p>
        </div>
      </section>

      {/* CTA - Editorial emphasis */}
      <section className="py-24 px-8 border-t border-black/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', color: accentColor }}>
            Next Step
          </p>
          
          <h2 className="text-3xl md:text-4xl font-normal mb-12" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Book a Signal Call
          </h2>
          
          <Button 
            asChild
            className="text-white hover:opacity-90 px-12 py-6 text-sm tracking-[0.15em] uppercase font-normal rounded-none"
            style={{ backgroundColor: accentColor }}
          >
            <a href="https://calendar.app.google/sXUh3xXCDNCKir8u6" target="_blank" rel="noopener noreferrer">
              Schedule Consultation
            </a>
          </Button>
        </div>
      </section>

      {/* Footer - Newspaper style */}
      <footer className="py-16 px-8 border-t border-black/10 bg-black/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm text-black/70 leading-relaxed max-w-xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              QV Brands exists to bring clarity, momentum, and executional precision to moments that matter—without unnecessary complexity.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs text-black/40 pt-8 border-t border-black/10" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            <span>The QUO VADIS Agency, LLC</span>
            <span>·</span>
            <span>© 2026</span>
            <span>·</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomepageEditorial;
