const pillars = [
  {
    title: "Brand Strategy",
    description:
      "Positioning, narrative, and differentiation that give the business a defensible identity and a reason to be chosen.",
  },
  {
    title: "Growth Architecture",
    description:
      "Systems, sequencing, and go-to-market structure that convert brand clarity into scalable revenue.",
  },
  {
    title: "AI-Enabled Execution",
    description:
      "Operational acceleration through AI tooling — applied to content, workflows, and market intelligence. Strategy stays human.",
  },
];

const ServiceArchitecture = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          What I Build
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-foreground mb-16 tracking-tight leading-[1.1]">
          Three pillars.{" "}
          <span className="italic font-light">One system.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-16">
          {pillars.map((pillar) => (
            <div key={pillar.title}>
              <h3 className="font-serif text-xl md:text-2xl font-normal text-foreground mb-3">
                {pillar.title}
              </h3>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceArchitecture;
