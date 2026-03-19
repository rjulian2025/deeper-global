import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

const LeadMagnet = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Full bleed image with improved background */}
      <div className="relative h-[600px] md:h-[700px] bg-gradient-to-br from-gray-100 to-white">
        <img 
          src="/lovable-uploads/e76ad5b6-f8eb-49cb-8196-3257e66e2a41.png" 
          alt="Business professional and AI robot competing for position"
          className="w-full h-full object-cover"
        />
        
        {/* Improved gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/70"></div>
        
        {/* Content overlay - positioned on the right side to avoid subject overlap */}
        <div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-12 lg:pr-20">
          <div className="max-w-lg text-left">
            {/* Brand indicator with icon instead of emoji */}
            <div className="flex justify-start mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold shadow-lg">
                <Target className="w-4 h-4" />
                <span>AI Survival Guide for CMOs</span>
              </div>
            </div>
            
            {/* H1 - Main headline with dramatic typography */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-[0.9] tracking-tight">
              <span className="block text-red-600 drop-shadow-sm">Irreplaceable</span>
            </h1>
            
            {/* H2 - Benefit-forward subheadline */}
            <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-bold mb-6 leading-tight drop-shadow-sm">
              Staying Relevant in the Age of Automation
            </h2>

            {/* Body copy with typographic contrast */}
            <div className="mb-10 space-y-2">
              <p className="text-lg md:text-xl text-gray-700 font-medium drop-shadow-sm">
                Automation is coming for your job.
              </p>
              <p className="text-lg md:text-xl text-gray-900 font-bold drop-shadow-sm">
                Unless you get there first.
              </p>
            </div>
            
            {/* CTA Button with enhanced tactile design and animation */}
            <div className="mb-6">
              <Button 
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-xl font-bold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 hover:animate-pulse border-2 border-red-500/20"
              >
                <a 
                  href="https://subscribepage.io/haY9lp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  📥 Download the Free Playbook
                </a>
              </Button>
            </div>
            
            {/* Enhanced privacy text with better contrast */}
            <p className="text-sm text-gray-600 font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
              🔒 No spam. Just sharp insight, straight to your inbox.
            </p>
          </div>
        </div>
      </div>
      
      {/* Content section below image with enhanced design */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              This isn&apos;t another AI hype doc. It&apos;s a <span className="font-bold text-gray-900">no-BS field manual</span> for marketing leaders who plan to outlast the automation wave and come out smarter, stronger, and even more indispensable.
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-3">
                📖 Inside this free 12-page playbook
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">AI-Proof Skills</h4>
                    <p className="text-gray-600 text-sm">What AI can&apos;t replace and how to double down</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">The New 80/20 Rule</h4>
                    <p className="text-gray-600 text-sm">For surviving and thriving in the AI era</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Strategic AI Tools</h4>
                    <p className="text-gray-600 text-sm">5 tools that scale leadership, not just content</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Brand Protection</h4>
                    <p className="text-gray-600 text-sm">Use AI to protect your brand, not dilute it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;