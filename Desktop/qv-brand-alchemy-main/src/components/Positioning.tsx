const Positioning = () => {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Smooth transition from hero */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/10 to-black"></div>
      <div className="max-w-7xl mx-auto px-6">
        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Visual identity */}
           <div className="relative">
             <img 
               src="/lovable-uploads/68be3d3d-d202-4be4-9d6f-de9f7522a7db.png" 
               alt="QV Brands identity" 
               className="w-full max-w-lg h-auto animate-fade-in"
             />
           </div>

          {/* Right column - Content */}
          <div className="space-y-12">
            {/* Main statement */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-light leading-tight">
                25 years of branding intelligence meets next generation 
                <span className="block text-brand-primary font-medium text-4xl md:text-5xl lg:text-6xl">AI fluency</span>
              </h2>
            </div>

            {/* Key points */}
            <div className="grid gap-8">
              <div className="border-l-2 border-brand-accent/30 pl-6">
                <h3 className="text-white font-medium mb-2 tracking-wide">For Founders</h3>
                <p className="text-white/70 leading-relaxed">
                  Build clarity and distinction into your brand foundation
                </p>
              </div>
              
              <div className="border-l-2 border-brand-accent/30 pl-6">
                <h3 className="text-white font-medium mb-2 tracking-wide">For Startups</h3>
                <p className="text-white/70 leading-relaxed">
                  Create cultural resonance that scales with your growth
                </p>
              </div>
              
              <div className="border-l-2 border-brand-accent/30 pl-6">
                <h3 className="text-white font-medium mb-2 tracking-wide">For Creatives</h3>
                <p className="text-white/70 leading-relaxed">
                  Amplify your vision with intelligent brand systems
                </p>
              </div>
            </div>

            {/* Bottom statement */}
            <div className="pt-8 border-t border-white/10">
              <p className="text-brand-text-light text-xl font-medium tracking-wide">
                Timeless strategy. Next-gen tools. Built to endure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Positioning;