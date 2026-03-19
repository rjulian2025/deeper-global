import { Button } from "@/components/ui/button";
import Link from "@/components/Link";

const About = () => {
  return (
    <section className="pt-16 pb-24 bg-gradient-to-b from-gray-800 to-gray-900 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Founder headshot */}
          <div className="lg:order-1 flex justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-brand-accent/20 to-brand-primary/20 flex items-center justify-center">
              <div className="w-44 h-44 rounded-full bg-gray-700 flex items-center justify-center text-white text-6xl font-light">
                RJ
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="lg:col-span-2 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-8 leading-tight">
              About QV BRANDS
            </h2>
            <p className="text-lg md:text-xl text-white leading-relaxed mb-8 font-light">
              Founder-led, discreet, bespoke. We work with a select number of clients who value 
              strategic depth over surface aesthetics. Every engagement is a partnership in 
              building something that endures.
            </p>
            <p className="text-sm text-white/90 mb-8 italic">
              — Rick Julian, Founder
            </p>
            <div className="space-y-4">
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white mr-4"
              >
                <Link href="/meet-the-strategist">Meet the Strategist</Link>
              </Button>
              <Button 
                variant="ghost"
                size="lg" 
                className="text-white hover:text-brand-accent"
              >
                Read Our Manifesto
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;