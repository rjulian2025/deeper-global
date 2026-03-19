import { Button } from "@/components/ui/button";
import Link from "@/components/Link";

/**
 * DESIGN DIRECTION: The Elemental Void (Reductionist)
 * 
 * Visual Logic: Intense minimalism—vast negative space and visual silence to create tension.
 * Removes all noise, presenting the consultancy as a clarifying force.
 * Feels almost clinical, like a surgical theatre.
 * 
 * Typography: Single, refined sans-serif. Authority through perfect kerning and excessive leading.
 * Color: Deepest blacks, charcoals, crisp whites. Cold metallic silver for interactivity.
 * Emotional Signal: "Silence. Focus. We are the signal in the noise. The final word."
 */

const HomepageElementalVoid = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation - Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/design-exploration" className="text-xs tracking-[0.4em] uppercase text-white/40 hover:text-white/60 transition-colors">
            ← Back to Exploration
          </Link>
          <span className="text-xs tracking-[0.5em] uppercase text-white/60">QV</span>
          <a 
            href="https://calendar.app.google/sXUh3xXCDNCKir8u6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Hero - The Void */}
      <section className="min-h-screen flex items-center justify-center relative">
        {/* Subtle ambient element - slow moving gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-white/[0.02] to-transparent blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-light tracking-[-0.02em] leading-[1.2] mb-8" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            The signal.<br />
            <span className="text-white/40">Not the noise.</span>
          </h1>
          
          <p className="text-white/30 text-sm tracking-[0.15em] uppercase mt-16">
            Strategic Brand Consultancy
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* Statement Section - Maximum negative space */}
      <section className="py-48 px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl font-light leading-[2] tracking-wide text-white/70" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            Brands fail not from lack of creativity, but from lack of clarity. We remove the noise that prevents decisive action.
          </p>
        </div>
      </section>

      {/* Outcomes - Sparse, clinical */}
      <section className="py-32 px-8 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-24">
            What Changes
          </p>
          
          <div className="space-y-24">
            <div>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Clarity
              </h3>
              <p className="text-white/40 text-lg leading-relaxed max-w-xl">
                Positioning sharpens. Decisions accelerate. Teams stop debating and start executing.
              </p>
            </div>
            
            <div>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Alignment
              </h3>
              <p className="text-white/40 text-lg leading-relaxed max-w-xl">
                Strategy, narrative, and execution lock together. One direction. One velocity.
              </p>
            </div>
            
            <div>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Signal
              </h3>
              <p className="text-white/40 text-lg leading-relaxed max-w-xl">
                The brand communicates with precision. Markets understand. Customers decide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Model - Minimal text blocks */}
      <section className="py-32 px-8 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-16">
            The Model
          </p>
          
          <div className="space-y-12">
            <p className="text-xl text-white/60 leading-relaxed font-light" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
              Principal-led. Strategy direct from source. Execution through a curated network of senior specialists.
            </p>
            
            <p className="text-xl text-white/60 leading-relaxed font-light" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
              Scale applied deliberately—up to 40+ contributors—only when it adds value.
            </p>
            
            <p className="text-sm text-white/30 pt-8 border-t border-white/10">
              AI accelerates exploration. Never replaces judgment.
            </p>
          </div>
        </div>
      </section>

      {/* Process - Numbered, clinical */}
      <section className="py-32 px-8 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-24">
            The Process
          </p>
          
          <div className="space-y-16">
            <div className="flex items-baseline gap-8">
              <span className="text-white/20 text-sm font-mono">01</span>
              <p className="text-xl text-white/70 font-light">Diagnose the core constraint</p>
            </div>
            
            <div className="flex items-baseline gap-8">
              <span className="text-white/20 text-sm font-mono">02</span>
              <p className="text-xl text-white/70 font-light">Recommend the right engagement level</p>
            </div>
            
            <div className="flex items-baseline gap-8">
              <span className="text-white/20 text-sm font-mono">03</span>
              <p className="text-xl text-white/70 font-light">Leave with a clear next move</p>
            </div>
          </div>
          
          <p className="text-sm text-white/30 mt-24">
            A working session. Not a pitch.
          </p>
        </div>
      </section>

      {/* Qualification - Stark contrast */}
      <section className="py-48 px-8 bg-white text-[#0a0a0a]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-light leading-relaxed" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            Not for teams seeking surface-level design, endless options, or consensus-driven process.
          </p>
          <p className="text-lg text-black/50 mt-8">
            This work favors clarity, decisiveness, and leadership alignment.
          </p>
        </div>
      </section>

      {/* Clients - Barely visible */}
      <section className="py-24 px-8 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/20 mb-12">
            Trusted by
          </p>
          <p className="text-sm text-white/30 tracking-wide">
            Coca-Cola · IBM · US Marine Corps · McKinsey · SAP · Marriott
          </p>
        </div>
      </section>

      {/* CTA - The void with a single point of light */}
      <section className="py-48 px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#111]" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <Button 
            asChild
            className="bg-white text-[#0a0a0a] hover:bg-white/90 px-16 py-8 text-sm tracking-[0.2em] uppercase font-normal rounded-none transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
          >
            <a href="https://calendar.app.google/sXUh3xXCDNCKir8u6" target="_blank" rel="noopener noreferrer">
              Begin
            </a>
          </Button>
        </div>
      </section>

      {/* Footer - Absolute minimum */}
      <footer className="py-12 px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-xs text-white/20">QV BRANDS</span>
          <span className="text-xs text-white/20">© 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default HomepageElementalVoid;
