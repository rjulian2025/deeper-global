import { Button } from "@/components/ui/button";
import Link from "@/components/Link";
import AuthorPageSchema from "@/components/AuthorPageSchema";

const MeetTheStrategist = () => {
    return (
    <div className="min-h-screen font-sans">
      {/* AEO-native ProfilePage + Breadcrumb schema */}
      <AuthorPageSchema />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src="/lovable-uploads/815c4eff-40e7-498b-ae1e-31f4da66f7b8.png" alt="QV BRANDS" className="h-8" />
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-brand-accent text-brand-text-light"
            >
              Home
            </Link>
            
            <Link 
              href="/contact" 
              className="text-sm font-medium transition-colors hover:text-brand-accent text-brand-text-light"
            >
              Contact
            </Link>
            
            <Button 
              asChild
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white hover:text-black"
            >
              <Link href="/contact">Start Project</Link>
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Migration Notice */}
      <div className="fixed top-[73px] left-0 right-0 z-40 bg-accent/10 border-b border-border py-3 text-center">
        <p className="text-sm text-foreground">
          This page has moved.{" "}
          <Link href="/rick-julian" className="font-medium underline hover:text-accent transition-colors">
            Visit Rick Julian's profile
          </Link>
        </p>
      </div>

      {/* Hero Section - Full-bleed Portrait */}
      <section className="relative min-h-screen flex items-end bg-brand-neutral">
        {/* Background overlay with reduced opacity */}
        <div className="absolute inset-0 bg-black/45 z-10"></div>
        
        {/* Portrait Image */}
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/39805efc-faff-433d-92ef-9412222c4d45.png" 
            alt="Rick Julian Portrait" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* Content Overlay - Centered */}
        <div className="relative z-20 max-w-[800px] mx-auto px-8 py-[120px] text-center">
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold text-white mb-4 tracking-tight">
              Rick Julian
            </h1>
            <p className="text-lg text-[#CCCCCC] font-light leading-relaxed mt-4 mb-8">
              Creative Strategist. Brand Architect. Founder, QV BRANDS.
            </p>
            <Button 
              asChild
              size="lg" 
              className="mt-8 bg-brand-primary text-white hover:bg-brand-accent transition-all duration-300 px-8 py-4 text-lg font-medium tracking-wide hover:scale-105"
            >
              <Link href="/contact">Start the Conversation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Intro Statement */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="max-w-4xl">
            <blockquote className="mb-20 animate-text-reveal">
              <p className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-brand-neutral mb-16 leading-tight italic">
                "I don't sell services. I forge signals."
              </p>
            </blockquote>
            
            <div className="prose prose-xl max-w-none space-y-6">
              <p className="font-sans text-xl md:text-2xl text-black font-light leading-relaxed">
                For over 30 years, Rick Julian has been the quiet architect behind brands that resonate at scale. From Coca-Cola, McKinsey & Co., and SAP to the United States Marine Corps and Marriott, his strategic fingerprints can be found across global corporations, national campaigns, cultural movements, and founder-led ventures.
              </p>
              
              <p className="font-sans text-xl md:text-2xl text-black font-light leading-relaxed">
                His work has helped launch startups, reposition legacy institutions, and distill complex missions into symbols that move people. Whether it's a billion-dollar rollout or a founder's first signal to the world, every project is shaped by the same core principle:
              </p>
              
              <p className="font-sans text-xl md:text-2xl text-black font-medium leading-relaxed">
                Clarity is a competitive edge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-32 bg-brand-subtle">
        <div className="max-w-6xl mx-auto px-8">
          <div className="max-w-4xl">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-20 leading-tight">
              What Are You Really Building?
            </h2>
            
            <div className="space-y-16 mb-20">
              <div className="animate-text-reveal">
                <p className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-brand-primary italic leading-tight">
                  What are you really here to do?
                </p>
              </div>
              
              <div className="animate-text-reveal" style={{animationDelay: '0.3s'}}>
                <p className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-brand-primary italic leading-tight">
                  And how does the world need to hear it?
                </p>
              </div>
            </div>
            
            <div className="max-w-3xl">
              <p className="font-sans text-xl md:text-2xl text-brand-accent font-light leading-relaxed">
                In an era where AI democratizes creation, strategic thinking becomes the ultimate differentiator. Brand clarity isn't decoration—it's navigation. A compass for decisions, a filter for opportunities, a foundation for everything that follows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Rick Works */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="max-w-4xl">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-brand-neutral mb-20 leading-tight">
              What It's Like to Work Together
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left Column */}
              <div className="space-y-8">
                <p className="font-sans text-xl text-black font-light leading-relaxed">
                  Projects begin with deep-dive strategic sessions that map your vision, voice, and architectural foundations. This isn't consulting—it's co-creation at the highest level.
                </p>
                
                <p className="font-sans text-xl text-black font-light leading-relaxed">
                  From there, we define what needs building: naming systems, messaging frameworks, brand architectures, or something entirely unprecedented. Every engagement is bespoke, intimate, and transformative.
                </p>
                
                <p className="font-sans text-xl text-black font-light leading-relaxed">
                  This is strategic partnership for visionaries who understand that exceptional outcomes require exceptional commitment.
                </p>
              </div>
              
              {/* Right Column - Pull Quote */}
              <div className="lg:pl-12">
                <div className="border-l-4 border-brand-primary pl-8 py-8">
                  <blockquote className="font-serif text-2xl md:text-3xl text-brand-neutral font-light leading-relaxed italic">
                    "I take on a limited number of clients per quarter. If we work together, expect rigor, resonance, and results."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-brand-primary">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-16 leading-tight">
              Let's see what you're really building.
            </h2>
            
            <Button 
              asChild
              size="lg" 
              className="bg-white text-brand-primary hover:bg-brand-accent transition-all duration-300 px-12 py-6 text-lg font-medium tracking-wide hover:scale-105 shadow-2xl"
            >
              <Link href="/contact">Start the Conversation</Link>
            </Button>
            
            {/* Signature Element */}
            <div className="mt-16 pt-16 border-t border-white/20">
              <p className="font-serif text-xl text-white/80 italic">
                — Rick Julian
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeetTheStrategist;