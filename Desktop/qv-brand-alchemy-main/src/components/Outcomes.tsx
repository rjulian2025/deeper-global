const Outcomes = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header with varied typography */}
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          The Impact
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-16 tracking-tight leading-[1.1]">
          How this work
          <span className="italic font-light"> actually shows up</span>
        </h2>
        
        <div className="space-y-16">
          <div className="group">
            <h3 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-4 italic">
              Clarity
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
              Brand positioning sharpens. Decisions get easier. Teams stop debating fundamentals and start executing with confidence.
            </p>
          </div>
          
          <div className="group">
            <h3 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-4 italic">
              Alignment
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
              Strategy, narrative, and execution lock together. Marketing, product, and leadership move in the same direction—faster.
            </p>
          </div>
          
          <div className="group">
            <h3 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-4 italic">
              Signal
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
              The brand communicates clearly in-market. Customers understand who it's for, why it matters, and why to choose it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Outcomes;
