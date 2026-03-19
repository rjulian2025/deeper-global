import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
const W9Download = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-32">
        <div className="max-w-xl mx-auto px-6 text-center space-y-8">
          <h1 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
            W-9 Form
          </h1>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p className="font-medium text-foreground">The QUO VADIS Agency, LLC</p>
            <p>126 Third Avenue, Decatur, Georgia 30030</p>
            <p>EIN: 41-4824539</p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 px-10 py-6 text-base rounded-none"
          >
            <a href="/documents/QV_W-9_2026.pdf" download="QV_W-9_2026.pdf">
              <FileDown className="mr-2 h-5 w-5" />
              Download W-9 (PDF)
            </a>
          </Button>
          <p className="text-xs text-muted-foreground">
            Current tax year · Pre-filled IRS Form W-9
          </p>
        </div>
      </section>
    </div>
  );
};

export default W9Download;
