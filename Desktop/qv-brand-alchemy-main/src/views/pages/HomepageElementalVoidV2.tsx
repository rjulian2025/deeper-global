import { Button } from "@/components/ui/button";
import Link from "@/components/Link";

/**
 * DESIGN DIRECTION: The Elemental Void V2 — "Light in the Vacuum"
 * 
 * Lateral exploration adding atmospheric tension through a single
 * ethereal light form—like smoke or a beam cutting through absolute darkness.
 * 
 * Key differences from V1:
 * - Dramatic diagonal light streak as visual signature
 * - Bolder, all-caps headline treatment
 * - Deeper contrast between void and signal
 * - More cinematic, less clinical
 */

const HomepageElementalVoidV2 = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Navigation - Absolute minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link 
            href="/design-exploration" 
            className="text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-white/50 transition-colors"
          >
            ← Exploration
          </Link>
          <div className="flex items-center gap-12">
            <a href="#approach" className="text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white/70 transition-colors">
              Our Approach
            </a>
            <a href="#work" className="text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white/70 transition-colors">
              Case Studies
            </a>
            <a 
              href="https://calendar.app.google/sXUh3xXCDNCKir8u6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white/70 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero - The Void with Light Beam */}
      <section className="min-h-screen flex items-center justify-center relative">
        {/* Ethereal light beam - diagonal streak */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary light beam */}
          <div 
            className="absolute w-[200%] h-[1px] opacity-[0.15]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 70%, transparent 100%)',
              top: '45%',
              left: '-50%',
              transform: 'rotate(-15deg)',
              boxShadow: '0 0 80px 40px rgba(255,255,255,0.1), 0 0 120px 60px rgba(255,255,255,0.05)'
            }}
          />
          
          {/* Glow aura around beam */}
          <div 
            className="absolute w-[150%] h-[300px] opacity-[0.03]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
              top: '35%',
              left: '-25%',
              transform: 'rotate(-15deg)',
              filter: 'blur(60px)'
            }}
          />
          
          {/* Subtle secondary streak */}
          <div 
            className="absolute w-[120%] h-[1px] opacity-[0.05]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 40%, transparent 100%)',
              top: '52%',
              left: '-10%',
              transform: 'rotate(-12deg)',
            }}
          />
        </div>
        
        {/* Headline */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
          <h1 
            className="text-[clamp(1.8rem,4.5vw,4rem)] font-normal tracking-[0.25em] leading-[1.4] mb-6"
            style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
          >
            SILENCE. FOCUS. THE FINAL WORD.
          </h1>
          
          <p className="text-white/20 text-xs tracking-[0.4em] uppercase mt-20">
            QV Brands
          </p>
        </div>

        {/* Scroll indicator - subtle pulse */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-white/10 to-transparent animate-pulse" />
        </div>
      </section>

      {/* The Method Section */}
      <section id="approach" className="py-32 px-8 relative">
        {/* Subtle continuation of atmospheric element */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.02]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        
        <div className="max-w-2xl mx-auto relative z-10">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-12">
            The Method
          </p>
          
          <div className="space-y-12 text-lg leading-[2] text-white/50" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            <p>
              We work exclusively with high-stakes brand situations where clarity determines outcome. 
              Not refinement. Not exploration. <span className="text-white/80">Resolution.</span>
            </p>
            
            <p>
              We understand that the true constraint is rarely creative—it's decisional. 
              When the strategic question remains unanswered, execution fragments regardless of quality.
            </p>
            
            <p>
              We deliver the answer. <span className="text-white/80">Then we build from certainty.</span>
            </p>
          </div>
        </div>
      </section>

      {/* What Changes - Stark contrast section */}
      <section className="py-32 px-8 bg-white text-[#050505]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-black/30 mb-16">
            What Changes
          </p>
          
          <div className="space-y-20">
            <div>
              <h3 className="text-4xl md:text-5xl font-light tracking-tight mb-6" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Clarity
              </h3>
              <p className="text-lg text-black/50 leading-relaxed max-w-xl">
                Positioning sharpens. Decisions accelerate. Teams stop debating fundamentals and execute with conviction.
              </p>
            </div>
            
            <div>
              <h3 className="text-4xl md:text-5xl font-light tracking-tight mb-6" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Alignment
              </h3>
              <p className="text-lg text-black/50 leading-relaxed max-w-xl">
                Strategy, narrative, and execution lock together. Marketing, product, and leadership move as one.
              </p>
            </div>
            
            <div>
              <h3 className="text-4xl md:text-5xl font-light tracking-tight mb-6" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Signal
              </h3>
              <p className="text-lg text-black/50 leading-relaxed max-w-xl">
                The brand communicates with precision. The market understands. Customers decide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Model - Return to void */}
      <section className="py-32 px-8 bg-[#050505] relative">
        {/* Atmospheric element - mirrored */}
        <div 
          className="absolute bottom-0 left-0 w-[800px] h-[400px] opacity-[0.02]"
          style={{
            background: 'radial-gradient(ellipse at bottom left, rgba(255,255,255,0.3) 0%, transparent 60%)',
            filter: 'blur(60px)'
          }}
        />
        
        <div className="max-w-2xl mx-auto relative z-10">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-12">
            The Model
          </p>
          
          <div className="space-y-10">
            <p className="text-xl text-white/60 leading-relaxed" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
              Principal-led. Strategy direct from source. Execution through a curated network of senior specialists—assembled for the specific problem, not the general engagement.
            </p>
            
            <p className="text-xl text-white/60 leading-relaxed" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
              Scale applied deliberately. Up to 40+ contributors when the situation demands. Lean when it doesn't.
            </p>
            
            <div className="pt-10 border-t border-white/10">
              <p className="text-sm text-white/25" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                AI accelerates exploration. It never replaces judgment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process - Numbered, absolute minimal */}
      <section className="py-32 px-8 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-20">
            The Process
          </p>
          
          <div className="space-y-12">
            <div className="flex items-baseline gap-10">
              <span className="text-white/10 text-sm font-mono w-8">01</span>
              <p className="text-xl text-white/60" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Diagnose the core constraint
              </p>
            </div>
            
            <div className="flex items-baseline gap-10">
              <span className="text-white/10 text-sm font-mono w-8">02</span>
              <p className="text-xl text-white/60" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Determine the correct engagement level
              </p>
            </div>
            
            <div className="flex items-baseline gap-10">
              <span className="text-white/10 text-sm font-mono w-8">03</span>
              <p className="text-xl text-white/60" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Leave with a clear next move
              </p>
            </div>
          </div>
          
          <p className="text-sm text-white/20 mt-20" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            A working session. Not a pitch.
          </p>
        </div>
      </section>

      {/* Qualification - Stark white interruption */}
      <section className="py-32 px-8 bg-white text-[#050505]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-light leading-relaxed" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            Not for teams seeking surface-level design,<br />
            endless options, or consensus-driven process.
          </p>
          <p className="text-base text-black/40 mt-10" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            This work favors clarity, decisiveness, and leadership alignment.
          </p>
        </div>
      </section>

      {/* Clients - Barely there */}
      <section className="py-20 px-8 bg-[#050505]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/15 mb-10">
            Trusted By
          </p>
          <p className="text-xs text-white/20 tracking-[0.15em]">
            Coca-Cola · IBM · US Marine Corps · McKinsey · SAP · Marriott
          </p>
        </div>
      </section>

      {/* CTA - Return to the beam */}
      <section className="py-48 px-8 relative">
        {/* Light beam echo */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-[200%] h-[1px] opacity-[0.08]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 60%, transparent 100%)',
              top: '40%',
              left: '-50%',
              transform: 'rotate(10deg)',
              boxShadow: '0 0 60px 30px rgba(255,255,255,0.05)'
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <Button 
            asChild
            className="bg-white text-[#050505] hover:bg-white/90 px-20 py-8 text-[10px] tracking-[0.4em] uppercase font-normal rounded-none transition-all duration-700 hover:shadow-[0_0_100px_rgba(255,255,255,0.15)]"
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
          <span className="text-[10px] tracking-[0.3em] text-white/15">QV BRANDS</span>
          <span className="text-[10px] text-white/15">The QUO VADIS Agency, LLC © 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default HomepageElementalVoidV2;
