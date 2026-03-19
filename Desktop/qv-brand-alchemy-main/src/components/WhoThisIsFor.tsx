const forItems = [
  "Founder-led companies",
  "$2M–$50M revenue stage",
  "Serious growth ambitions",
  "Leadership teams who value clarity",
];

const notForItems = [
  "Early experiments",
  "Price shoppers",
  "Consensus-driven cultures",
  '"Just run ads" thinking',
];

const WhoThisIsFor = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          Fit
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-16 tracking-tight leading-[1.1]">
          Who This Is
          <span className="italic font-light"> For</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-16">
          {/* For */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-6 tracking-wide uppercase text-sm">
              This work is built for
            </h3>
            <ul className="space-y-4">
              {forItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-foreground font-light">
                  <span className="text-accent mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Not For */}
          <div>
            <h3 className="text-lg font-medium text-muted-foreground mb-6 tracking-wide uppercase text-sm">
              Not the right fit for
            </h3>
            <ul className="space-y-4">
              {notForItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-muted-foreground font-light">
                  <span className="mt-1">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoThisIsFor;
