import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much does a fractional CMO cost?",
    answer:
      "Fractional CMO engagements typically range from $5,000 to $15,000 per month depending on scope, stage, and complexity. This is a fraction of the cost of a full-time CMO hire while delivering the same level of strategic leadership.",
  },
  {
    question: "How many hours per week do you work?",
    answer:
      "Engagements are structured around outcomes, not hours. Most partnerships involve weekly executive working sessions, asynchronous strategic direction, and direct involvement in key decisions—typically equivalent to 10–20 hours per week.",
  },
  {
    question: "Do you replace internal teams?",
    answer:
      "No. I lead and align existing teams. The goal is to install strategic growth systems that make internal teams more effective, not to replace them.",
  },
  {
    question: "Do you work with early-stage startups?",
    answer:
      "This work is designed for companies with established revenue—typically $2M to $50M—facing growth inflection points. Pre-revenue companies are generally better served by other resources.",
  },
  {
    question: "How long are engagements?",
    answer:
      "Fractional CMO partnerships run 6–12 months. Growth Architecture Sprints are 90 days. Strategic Diagnostics deliver clarity in two weeks. The right format depends on the constraint.",
  },
];

const CommonQuestions = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
          FAQ
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-12 tracking-tight leading-[1.1]">
          Common
          <span className="italic font-light"> Questions</span>
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-lg font-light text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground font-light leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default CommonQuestions;
