const engagements = [
  {
    title: "Fractional CMO Partnership",
    duration: "6–12 month leadership engagement",
    description: "Ongoing executive marketing leadership for growth-stage companies. Strategy, systems, and execution oversight.",
  },
  {
    title: "Growth Architecture Sprint",
    duration: "90-day positioning + GTM build",
    description: "Go-to-market architecture and positioning for companies entering scale.",
  },
  {
    title: "Strategic Diagnostic",
    duration: "One-time executive review",
    description: "Executive-level business and growth review. Clarity in two weeks.",
  },
];

const Engagements = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          Engagement Options
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-16 tracking-tight leading-[1.1]">
          Ways to Work
          <span className="italic font-light"> Together</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {engagements.map((eng) => (
            <div
              key={eng.title}
              className="bg-card border border-border p-8 flex flex-col"
            >
              <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground mb-2">
                {eng.title}
              </h3>
              <p className="text-sm text-accent font-medium tracking-wide mb-4">
                {eng.duration}
              </p>
              <p className="text-muted-foreground font-light leading-relaxed">
                {eng.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Engagements;
