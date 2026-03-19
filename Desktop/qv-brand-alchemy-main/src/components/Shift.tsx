import Link from "@/components/Link";

const Shift = () => {
  const columns = [
    {
      title: "Clarity",
      text: "Everyone understands what the company stands for and why it wins.",
    },
    {
      title: "Alignment",
      text: "Strategy, product, and marketing move in the same direction.",
    },
    {
      title: "Momentum",
      text: "Execution accelerates because decisions are grounded in shared truth.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          The Shift
        </p>
        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
          When narrative, positioning, and systems align, growth stops feeling fragile.
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-16 tracking-tight leading-[1.1]">
          Installed Leadership
          <span className="italic font-light"> Changes Everything</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-4 italic">
                {col.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {col.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            This isn't branding.<br />
            And it isn't operations.
          </p>
          <p className="text-xl md:text-2xl text-foreground font-light italic mt-4">
            It's leadership.
          </p>
          <p className="text-base text-muted-foreground font-light mt-6">
            Explore the thinking behind this approach in{" "}
            <Link href="/strategic-answers" className="text-foreground hover:text-accent transition-colors font-medium">
              Strategic Answers for Founders
            </Link>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Shift;
