const caseSnippets = [
  "Repositioned multi-location healthcare practice → 3× inbound leads in 60 days",
  "Architected SaaS GTM system → $2.4M pipeline in first quarter",
  "Unified 40-person launch team → global rollout in under four months",
  "Built category narrative for consumer brand → billions of impressions",
];

const Proof = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          Track Record
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-16 tracking-tight leading-[1.1]">
          Selected
          <span className="italic font-light"> Impact</span>
        </h2>
        
        {/* Client logos */}
        <div className="mb-16">
          <img 
            src="/lovable-uploads/qv-clients-black-on-white.avif" 
            alt="Client logos including Coca-Cola, IBM, US Marine Corps, McKinsey, SAP, and Marriott" 
            className="h-auto w-full max-w-3xl"
            loading="lazy"
          />
        </div>
        
        {/* Outcome snippets */}
        <div className="space-y-6">
          {caseSnippets.map((snippet, i) => (
            <div key={i} className="flex items-start gap-4 py-4 border-b border-border last:border-b-0">
              <span className="text-accent font-serif text-lg leading-none mt-0.5">✦</span>
              <p className="text-lg md:text-xl text-foreground font-light">
                {snippet}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Proof;
