const ProcessSteps = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          Next Steps
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-12 tracking-tight leading-[1.1]">
          What happens after
          <span className="italic font-light"> the Signal Call</span>
        </h2>
        
        <ul className="space-y-6 text-lg md:text-xl text-muted-foreground mb-10">
          <li className="flex items-start group">
            <span className="text-brand-primary font-serif text-2xl mr-4 leading-none">01</span>
            <span className="font-light">We diagnose the core constraint holding the brand back</span>
          </li>
          <li className="flex items-start group">
            <span className="text-brand-primary font-serif text-2xl mr-4 leading-none">02</span>
            <span className="font-light">We recommend the right level of engagement (or none)</span>
          </li>
          <li className="flex items-start group">
            <span className="text-brand-primary font-serif text-2xl mr-4 leading-none">03</span>
            <span className="font-light">You leave with a clear, confident next move</span>
          </li>
        </ul>
        
        <p className="text-muted-foreground/70 text-base italic font-light">
          This is a working session—not a sales pitch.
        </p>
      </div>
    </section>
  );
};

export default ProcessSteps;
