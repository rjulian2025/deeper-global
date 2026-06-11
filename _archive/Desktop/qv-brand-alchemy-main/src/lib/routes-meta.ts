/**
 * Route metadata for static HTML shell generation and internal linking.
 * Used by the prerender plugin to generate per-route HTML files at build time,
 * giving Google indexable content without requiring client-side JS execution.
 */

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}

export const publicRoutes: RouteMeta[] = [
  // Core Pages
  { path: "/", title: "Rick Julian — Fractional Chief Branding Officer & Growth Architect | QV Brands", description: "Fractional Chief Branding Officer and growth architect for founder-led companies at critical growth stages. Brand strategy, positioning, narrative systems, and scalable growth architecture." },
  { path: "/about", title: "About QV BRANDS | Strategic Brand Consultancy", description: "QV BRANDS is a principal-led brand strategy and growth architecture firm for founder-led companies at critical growth stages." },
  { path: "/contact", title: "Contact QV BRANDS | Start a Strategic Conversation", description: "Reach out to discuss brand strategy, fractional CMO leadership, or growth architecture for your company." },
  { path: "/rick-julian", title: "Rick Julian — Fractional Chief Branding Officer | QV BRANDS", description: "Rick Julian is a fractional Chief Branding Officer and growth architect with 30+ years leading brand strategy for Fortune 100s and founder-led ventures." },
  { path: "/packages", title: "Strategic Engagement Packages | QV BRANDS", description: "Brand strategy and growth architecture packages designed for founder-led companies. From diagnostic sprints to installed leadership." },
  { path: "/consultation", title: "Brand Clarity Session | QV BRANDS", description: "A focused strategic working session to diagnose your growth constraint and determine the right strategic move." },
  { path: "/clients", title: "Client Portfolio | QV BRANDS", description: "Selected client work spanning Fortune 100 brands, high-growth startups, and founder-led companies." },
  { path: "/ai-content", title: "AI-Powered Brand Content | QV BRANDS", description: "How QV BRANDS uses AI to accelerate brand strategy and content systems without losing human judgment." },
  { path: "/atlanta-brand-strategy", title: "Atlanta Brand Strategy Consultant | QV BRANDS", description: "Atlanta-based brand strategy and fractional CMO services for founder-led companies. Local expertise, global strategic frameworks." },

  // Case Studies
  { path: "/case-study/loopo", title: "Loopo Case Study | Brand Strategy & Identity | QV BRANDS", description: "How QV BRANDS built the brand strategy, identity system, and go-to-market architecture for Loopo." },

  // Strategic Answers Hub
  { path: "/strategic-answers", title: "Strategic Growth Answers for Founders | QV BRANDS", description: "Authoritative answers on fractional CMO leadership, growth architecture, and strategic systems for founder-led companies." },
  { path: "/strategic-answers/fractional-cmo-cost", title: "How Much Does a Fractional CMO Cost? | QV BRANDS", description: "Fractional CMO costs typically range from $5K–$15K per month depending on scope, stage, and strategic depth." },
  { path: "/strategic-answers/fractional-cmo-vs-agency", title: "Fractional CMO vs Agency | QV BRANDS", description: "When embedded leadership outperforms outsourced execution. A comparison of fractional CMO and agency models." },
  { path: "/strategic-answers/when-to-hire-fractional-cmo", title: "When to Hire a Fractional CMO | QV BRANDS", description: "The signals that indicate your company needs strategic leadership, not more tactics." },
  { path: "/strategic-answers/is-fractional-cmo-worth-it", title: "Is a Fractional CMO Worth It? | QV BRANDS", description: "How to evaluate ROI on installed executive marketing leadership for founder-led companies." },
  { path: "/strategic-answers/fractional-cmo-saas-guide", title: "Fractional CMO for SaaS Companies | QV BRANDS", description: "How fractional CMO engagement works for SaaS companies at growth stage." },
  { path: "/strategic-answers/why-growth-stalls", title: "Why Growth Stalls | QV BRANDS", description: "The structural reasons companies plateau after initial traction." },
  { path: "/strategic-answers/why-rebrands-fail", title: "Why Rebrands Fail | QV BRANDS", description: "Why most brand overhauls fail to change market position and what to do instead." },
  { path: "/strategic-answers/align-sales-and-marketing", title: "How to Align Sales and Marketing | QV BRANDS", description: "The strategic architecture that makes alignment operational, not aspirational." },
  { path: "/strategic-answers/gtm-system-not-campaign", title: "GTM Is a System, Not a Campaign | QV BRANDS", description: "Why campaigns without a system underneath them produce diminishing returns." },
  { path: "/strategic-answers/installed-leadership-model", title: "The Installed Leadership Model | QV BRANDS", description: "What it means to install strategic leadership vs. advise from the outside." },
  { path: "/strategic-answers/what-does-a-cbo-do", title: "What Does a Chief Brand Officer Do? | QV BRANDS", description: "The executive role that owns positioning, narrative, and brand-led growth strategy." },
  { path: "/strategic-answers/brand-strategy-fails-without-leadership", title: "Brand Strategy Fails Without Leadership | QV BRANDS", description: "Why strategy documents fail without a senior leader to install and govern them." },
  { path: "/strategic-answers/brand-positioning-vs-brand-marketing", title: "Brand Positioning vs Brand Marketing | QV BRANDS", description: "The sequencing error that causes marketing spend to underperform." },

  // Answers Knowledge Base
  { path: "/answers", title: "Brand Strategy Knowledge Base | Authoritative Answers", description: "Definitive explanations of brand strategy, creative direction, positioning, and the decisions that determine whether companies succeed or fade." },
  { path: "/answers/branding-vs-marketing", title: "Branding vs Marketing | Brand Knowledge Base", description: "Branding is what you are. Marketing is how you promote it. Confusing them leads to expensive campaigns that build nothing lasting." },
  { path: "/answers/brand-strategy-vs-brand-identity", title: "Brand Strategy vs Brand Identity | Brand Knowledge Base", description: "Strategy is the decision architecture. Identity is the visual expression. One must precede the other." },
  { path: "/answers/creative-direction-vs-design", title: "Creative Direction vs Design | Brand Knowledge Base", description: "Design executes. Creative direction decides what gets executed and why." },
  { path: "/answers/founder-led-vs-committee-led", title: "Founder-Led vs Committee-Led Brands | Brand Knowledge Base", description: "Why brands led by a single decisive voice outperform those built by consensus." },
  { path: "/answers/hired-agency-nothing-changed", title: "We Hired an Agency and Nothing Changed | Brand Knowledge Base", description: "Why agency engagements often fail to produce strategic change — and what actually works." },
  { path: "/answers/how-to-tell-if-brand-is-problem", title: "How to Tell If Your Brand Is the Problem | Brand Knowledge Base", description: "Diagnostic signals that your brand — not your marketing — is the constraint on growth." },
  { path: "/answers/polished-but-weak", title: "Why Your Company Looks Polished but Feels Weak | Brand Knowledge Base", description: "When surface-level brand quality masks deeper strategic problems." },
  { path: "/answers/rebrand-vs-refresh", title: "Rebrand vs Refresh | Brand Knowledge Base", description: "When you need a complete repositioning vs. a visual update — and how to know the difference." },
  { path: "/answers/what-brand-strategy-actually-is", title: "What Brand Strategy Actually Is | Brand Knowledge Base", description: "Brand strategy is the decision architecture that determines how a company is perceived, positioned, and remembered." },
  { path: "/answers/what-breaks-when-brands-scale", title: "What Breaks When Brands Scale | Brand Knowledge Base", description: "The structural failures that occur when growing companies outpace their brand architecture." },
  { path: "/answers/what-creative-direction-controls", title: "What Creative Direction Controls | Brand Knowledge Base", description: "Creative direction governs the aesthetic, emotional, and narrative coherence of everything a brand produces." },
  { path: "/answers/when-rebrand-is-wrong", title: "When a Rebrand Is the Wrong Move | Brand Knowledge Base", description: "The situations where rebranding will waste resources and damage existing equity." },
  { path: "/answers/ai-branding-vs-human-judgment", title: "AI Branding vs Human Judgment | Brand Knowledge Base", description: "Where AI accelerates brand building and where human judgment remains irreplaceable." },

  // Blog
  { path: "/blog", title: "Blog — Strategic Clarity for Modern Brands | QV BRANDS", description: "Insights on brand strategy, clarity systems, and building identity that endures in the AI era." },
  { path: "/blog/brand-strategy-in-synthetic-era", title: "Brand Strategy in the Synthetic Content Era | QV BRANDS", description: "As AI generates infinite noise, clarity becomes a brand's only shield." },
  { path: "/blog/brand-archetypes-ai-era", title: "The 4 Brand Archetypes That Will Survive the AI Wave | QV BRANDS", description: "In the coming algorithmic collapse, only a few brand types will endure." },
  { path: "/blog/clarity-in-the-age-of-ai", title: "Why Clarity Is the Last True Advantage in the Age of AI | QV BRANDS", description: "In the AI era, clarity is the ultimate differentiator for modern brand strategy." },
  { path: "/blog/clarity-operating-system", title: "The Clarity Operating System | QV BRANDS", description: "In a world drowning in noise, clarity is the new power move." },
  { path: "/blog/mad-buddha", title: "Mad Men Are Dead. Meet the Mad Buddha. | QV BRANDS", description: "A new archetype is rising — one who blends creative swagger with spiritual precision." },
  { path: "/blog/scale-without-losing-soul", title: "How Founders Can Build Brands That Scale Without Losing Soul | QV BRANDS", description: "Scaling doesn't require dilution. How to grow without compromising identity." },
  { path: "/blog/second-brain-architecture", title: "Brand Architecture for the Second Brain Era | QV BRANDS", description: "Your audience is outsourcing memory and meaning to digital systems. Here's how to build a brand they can actually remember." },
  { path: "/blog/strategy-is-the-new-logo", title: "The Death of the Logo: Why Strategy Is the New Signal | QV BRANDS", description: "In the AI era, design alone won't save you. Clarity architecture and narrative systems now outrank visual identity." },
  { path: "/blog/what-is-a-clarity-system", title: "What Is a Clarity System? | QV BRANDS", description: "A new operating model for modern brands — how to transform identity into operational power." },
];

// Internal linking maps — which pages should link to which
export const answerRelatedLinks: Record<string, { title: string; path: string }[]> = {
  "branding-vs-marketing": [
    { title: "What Brand Strategy Actually Is", path: "/answers/what-brand-strategy-actually-is" },
    { title: "Brand Strategy vs Brand Identity", path: "/answers/brand-strategy-vs-brand-identity" },
    { title: "Brand Positioning vs Brand Marketing", path: "/strategic-answers/brand-positioning-vs-brand-marketing" },
  ],
  "brand-strategy-vs-brand-identity": [
    { title: "Branding vs Marketing", path: "/answers/branding-vs-marketing" },
    { title: "What Creative Direction Controls", path: "/answers/what-creative-direction-controls" },
    { title: "Why Rebrands Fail", path: "/strategic-answers/why-rebrands-fail" },
  ],
  "creative-direction-vs-design": [
    { title: "What Creative Direction Controls", path: "/answers/what-creative-direction-controls" },
    { title: "Brand Strategy vs Brand Identity", path: "/answers/brand-strategy-vs-brand-identity" },
    { title: "What Does a CBO Do?", path: "/strategic-answers/what-does-a-cbo-do" },
  ],
  "founder-led-vs-committee-led": [
    { title: "What Breaks When Brands Scale", path: "/answers/what-breaks-when-brands-scale" },
    { title: "Brand Strategy Fails Without Leadership", path: "/strategic-answers/brand-strategy-fails-without-leadership" },
    { title: "Installed Leadership Model", path: "/strategic-answers/installed-leadership-model" },
  ],
  "hired-agency-nothing-changed": [
    { title: "Fractional CMO vs Agency", path: "/strategic-answers/fractional-cmo-vs-agency" },
    { title: "How to Tell If Your Brand Is the Problem", path: "/answers/how-to-tell-if-brand-is-problem" },
    { title: "Why Growth Stalls", path: "/strategic-answers/why-growth-stalls" },
  ],
  "how-to-tell-if-brand-is-problem": [
    { title: "Polished but Weak", path: "/answers/polished-but-weak" },
    { title: "What Breaks When Brands Scale", path: "/answers/what-breaks-when-brands-scale" },
    { title: "When to Hire a Fractional CMO", path: "/strategic-answers/when-to-hire-fractional-cmo" },
  ],
  "polished-but-weak": [
    { title: "How to Tell If Your Brand Is the Problem", path: "/answers/how-to-tell-if-brand-is-problem" },
    { title: "We Hired an Agency and Nothing Changed", path: "/answers/hired-agency-nothing-changed" },
    { title: "Why Rebrands Fail", path: "/strategic-answers/why-rebrands-fail" },
  ],
  "rebrand-vs-refresh": [
    { title: "When a Rebrand Is the Wrong Move", path: "/answers/when-rebrand-is-wrong" },
    { title: "Why Rebrands Fail", path: "/strategic-answers/why-rebrands-fail" },
    { title: "Brand Strategy vs Brand Identity", path: "/answers/brand-strategy-vs-brand-identity" },
  ],
  "what-brand-strategy-actually-is": [
    { title: "Branding vs Marketing", path: "/answers/branding-vs-marketing" },
    { title: "Brand Strategy vs Brand Identity", path: "/answers/brand-strategy-vs-brand-identity" },
    { title: "What Does a CBO Do?", path: "/strategic-answers/what-does-a-cbo-do" },
  ],
  "what-breaks-when-brands-scale": [
    { title: "Founder-Led vs Committee-Led Brands", path: "/answers/founder-led-vs-committee-led" },
    { title: "Why Growth Stalls", path: "/strategic-answers/why-growth-stalls" },
    { title: "Align Sales and Marketing", path: "/strategic-answers/align-sales-and-marketing" },
  ],
  "what-creative-direction-controls": [
    { title: "Creative Direction vs Design", path: "/answers/creative-direction-vs-design" },
    { title: "What Does a CBO Do?", path: "/strategic-answers/what-does-a-cbo-do" },
    { title: "Polished but Weak", path: "/answers/polished-but-weak" },
  ],
  "when-rebrand-is-wrong": [
    { title: "Rebrand vs Refresh", path: "/answers/rebrand-vs-refresh" },
    { title: "Why Rebrands Fail", path: "/strategic-answers/why-rebrands-fail" },
    { title: "How to Tell If Your Brand Is the Problem", path: "/answers/how-to-tell-if-brand-is-problem" },
  ],
  "ai-branding-vs-human-judgment": [
    { title: "Brand Strategy in the Synthetic Era", path: "/blog/brand-strategy-in-synthetic-era" },
    { title: "What Brand Strategy Actually Is", path: "/answers/what-brand-strategy-actually-is" },
    { title: "The 4 Brand Archetypes That Will Survive AI", path: "/blog/brand-archetypes-ai-era" },
  ],
};
