import { Button } from "@/components/ui/button";
import Link from "@/components/Link";

const FinalCTA = () => {
  return (
    <section className="py-24 md:py-32 bg-brand-hero">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-primary-foreground mb-6 tracking-tight leading-[1.1]">
          Ready for
          <span className="italic font-light"> Strategic Clarity?</span>
        </h2>
        
        <p className="text-lg md:text-xl text-primary-foreground/70 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
          If you're at a growth inflection point, this work will change how your company operates. The right strategic leadership compounds—every week, every quarter.
        </p>
        
        <Button 
          asChild
          size="lg" 
          className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 px-10 py-7 text-lg font-medium rounded-none"
        >
          <Link href="/contact">Request Strategic Review</Link>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
