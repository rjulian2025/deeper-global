const Problem = () => {
  return (
    <section className="py-24 md:py-32 bg-brand-hero">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase text-primary-foreground/50 mb-4 font-medium">
          The Problem
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-primary-foreground mb-12 tracking-tight leading-[1.1]">
          When Growth Gets Complex,
          <span className="block italic font-light">Signal Gets Lost</span>
        </h2>
        
        <div className="space-y-10">
          <p className="text-lg md:text-xl text-primary-foreground/80 font-light leading-relaxed">
            Most companies don't stall because they lack tactics.<br />
            They stall because their story fractures.
          </p>
          
          <div className="space-y-3 text-lg md:text-xl text-primary-foreground/70 font-light">
            <p>Messaging drifts.</p>
            <p>Marketing becomes noisy.</p>
            <p>Teams stop trusting the signal.</p>
            <p>Decisions slow.</p>
            <p>Spend rises.</p>
            <p>Momentum fades.</p>
          </div>
          
          <div className="pt-6 border-t border-primary-foreground/10">
            <p className="text-xl md:text-2xl text-primary-foreground font-light leading-relaxed">
              What looks like a "performance problem" is usually a perception problem first.
            </p>
            <p className="text-lg text-primary-foreground/60 font-light italic mt-4">
              And perception compounds—good or bad.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
