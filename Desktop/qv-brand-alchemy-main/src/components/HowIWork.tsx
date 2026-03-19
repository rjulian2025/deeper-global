const steps = [
  { label: "Diagnose", text: "We identify what the market is actually responding to—and where signal is breaking." },
  { label: "Architect", text: "I design the positioning, narrative, and growth systems that restore coherence." },
  { label: "Install", text: "We embed those systems into teams, workflows, and decisions." },
  { label: "Steward", text: "I guide execution, adaptation, and leadership alignment." },
  { label: "Transition", text: "When the system is stable, I help internal leaders own it." },
];

const HowIWork = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          Process
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-16 tracking-tight leading-[1.1]">
          How I Work
          <span className="italic font-light"> With Founders</span>
        </h2>
        
        <ul className="space-y-10">
          {steps.map((step, i) => (
            <li key={step.label} className="flex items-start gap-6">
              <span className="text-accent font-serif text-2xl leading-none mt-1 min-w-[2rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl md:text-2xl font-medium text-foreground mb-1">
                  {step.label}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* What Clients Can Expect */}
        <div className="mt-20 pt-16 border-t border-border">
          <h3 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-8 tracking-tight">
            What Clients Can Expect
          </h3>
          <ul className="space-y-4 text-lg text-muted-foreground font-light">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-sm">—</span>
              <span>Direct access to Rick Julian</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-sm">—</span>
              <span>Weekly executive working sessions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-sm">—</span>
              <span>Narrative and positioning leadership</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-sm">—</span>
              <span>Go-to-market architecture</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-sm">—</span>
              <span>Strategic dashboards and scorecards</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-sm">—</span>
              <span>Leadership alignment support</span>
            </li>
          </ul>
          <p className="text-foreground font-light mt-8">
            No layers.<br />
            No handoffs.<br />
            No translation loss.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
