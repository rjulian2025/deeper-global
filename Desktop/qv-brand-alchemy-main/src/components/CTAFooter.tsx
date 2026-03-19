import { Button } from "@/components/ui/button";
import Link from "@/components/Link";

const CTAFooter = () => {
  return (
    <footer className="bg-foreground relative">
      {/* Main CTA Section */}
      <div className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Button 
            asChild
            size="lg" 
            className="bg-background text-foreground hover:bg-background/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl px-12 py-8 text-xl font-semibold rounded-none"
          >
            <a href="https://calendar.app.google/sXUh3xXCDNCKir8u6" target="_blank" rel="noopener noreferrer">
              Book a Call
            </a>
          </Button>
        </div>
      </div>

      {/* Final Closing Statement */}
      <div className="py-16 border-t border-background/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-lg text-background/80 font-light leading-relaxed mb-4">
            QV Brands exists to bring clarity, momentum, and executional precision to moments that matter.
          </p>
          <p className="text-lg text-background font-medium">
            One strategic voice.<br />
            One coherent direction.<br />
            Built to scale.
          </p>
        </div>
      </div>

      {/* Footer Links */}
      <div className="py-8 border-t border-background/20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-4">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-background/60">
            <Link href="/strategic-answers" className="hover:text-background transition-colors">Strategic Answers</Link>
            <Link href="/answers" className="hover:text-background transition-colors">Knowledge Base</Link>
            <Link href="/blog" className="hover:text-background transition-colors">Blog</Link>
            <Link href="/rick-julian" className="hover:text-background transition-colors">Rick Julian</Link>
            <Link href="/packages" className="hover:text-background transition-colors">Packages</Link>
            <Link href="/clients" className="hover:text-background transition-colors">Clients</Link>
            <Link href="/atlanta-brand-strategy" className="hover:text-background transition-colors">Atlanta</Link>
            <Link href="/case-study/loopo" className="hover:text-background transition-colors">Case Study</Link>
            <Link href="/consultation" className="hover:text-background transition-colors">Consultation</Link>
            <Link href="/w9" className="hover:text-background transition-colors">W-9</Link>
          </nav>
          <p className="text-background/60 text-sm tracking-wide">
            The QUO VADIS Agency, LLC © 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CTAFooter;
