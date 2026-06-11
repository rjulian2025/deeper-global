const Partnership = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          The Model
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-12 tracking-tight leading-[1.1]">
          A Different Kind of
          <span className="italic font-light"> CMO Partnership</span>
        </h2>
        
        <div className="space-y-8 text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
          <p>
            QV Brands operates on a principal-led model.
          </p>
          <p>
            Strategy and direction come directly from Rick Julian.<br />
            Execution is delivered through a trusted network assembled for each engagement.
          </p>
          <p className="text-foreground">
            No juniors.<br />
            No outsourcing.<br />
            No abstraction.
          </p>
          <p className="text-foreground font-medium">
            Just accountable leadership.
          </p>
          <p className="border-l-2 border-accent pl-6 text-base text-muted-foreground/70 italic mt-12">
            AI is used to accelerate exploration and execution—never to replace judgment, strategy, or creative direction.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
