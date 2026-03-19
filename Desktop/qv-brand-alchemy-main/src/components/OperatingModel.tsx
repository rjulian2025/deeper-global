const OperatingModel = () => {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          Our Approach
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-12 tracking-tight leading-[1.1]">
          A different kind of
          <span className="italic font-light"> brand partner</span>
        </h2>
        
        <div className="space-y-8">
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            QV Brands operates on a principal-led orchestration model. Strategy and direction are led directly by Rick Julian, while execution is delivered through a trusted global bench of senior specialists—strategists, designers, writers, technologists, and operators—assembled based on the needs of each engagement.
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            Scale is applied deliberately—up to 40+ contributors for global launches and complex brand systems—only when it adds value. This model enables speed, focus, and depth without the overhead or creative dilution of traditional agencies.
          </p>
          
          <p className="text-base text-muted-foreground/70 font-light italic mt-12 border-l-2 border-brand-primary pl-6">
            AI is used to accelerate exploration and execution—never to replace judgment, strategy, or creative leadership.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OperatingModel;
