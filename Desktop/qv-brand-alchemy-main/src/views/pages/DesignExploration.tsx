import { useState } from "react";
import Link from "@/components/Link";
const directions = [
  {
    id: 1,
    name: "The New Editorial Standard",
    tagline: "We set the agenda.",
    emotionalSignal: "Read this and understand the reality of your situation.",
    heroHeadline: "The age of brand ambiguity is over.",
    heroSubline: "QV BRANDS — Strategic Clarity for the Decisive",
    typography: {
      headline: "Tiempos / Chronicle style serif",
      body: "Neue Haas Grotesk / Swiss sans-serif"
    },
    colors: {
      primary: "hsl(0 0% 8%)",
      background: "hsl(40 20% 96%)", // bone/alabaster
      accent: "hsl(0 45% 25%)", // oxblood
      muted: "hsl(0 0% 45%)"
    },
    useCase: "Thought leadership, white papers, homepage intellectual dominance",
    visualLogic: "Borrows credibility of FT, Monocle, old WSJ. Intelligence, not content. Rigid typographic hierarchy. Images rare—sparse B&W photojournalism as punctuation."
  },
  {
    id: 2,
    name: "Structural Brutalism",
    tagline: "Our decisions are load-bearing.",
    emotionalSignal: "We build the foundation your company rests upon.",
    heroHeadline: "Strategy built to bear weight.",
    heroSubline: "Frameworks that survive anything.",
    typography: {
      headline: "Bold blocky sans-serif (cast in concrete)",
      body: "Industrial mono-spaced for labels"
    },
    colors: {
      primary: "hsl(0 0% 35%)", // concrete
      background: "hsl(220 10% 15%)", // slate
      accent: "hsl(25 70% 45%)", // rusted orange
      muted: "hsl(200 15% 25%)" // metallic charcoal
    },
    useCase: "Methodology sections, approach pages, durability emphasis",
    visualLogic: "Brutalist architecture language. Heavy, permanent. Raw materials—concrete, weathered steel. Anti-decorative. Form follows function aggressively."
  },
  {
    id: 3,
    name: "The Elemental Void",
    tagline: "Silence. Focus.",
    emotionalSignal: "We are the signal in the noise. The final word.",
    heroHeadline: "Clarity.",
    heroSubline: "",
    typography: {
      headline: "Single refined sans-serif (Helvetica Neue / Univers)",
      body: "Perfect kerning, excessive leading"
    },
    colors: {
      primary: "hsl(0 0% 100%)",
      background: "hsl(0 0% 5%)", // deepest black
      accent: "hsl(0 0% 65%)", // cold metallic silver
      muted: "hsl(0 0% 25%)"
    },
    useCase: "Homepage entry, high-stakes contact pages, commitment moments",
    visualLogic: "Intense minimalism. Vast negative space. Visual silence creates tension. Clinical. A clarifying force. Surgical theatre aesthetic."
  },
  {
    id: 4,
    name: "Decision Gravity",
    tagline: "The forces are immense.",
    emotionalSignal: "We understand the physics of this pressure.",
    heroHeadline: "Pressure. Convergence. Inevitability.",
    heroSubline: "The forces acting on your business demand precision.",
    typography: {
      headline: "Modern geometric sans-serif",
      body: "Precise, mathematical feel"
    },
    colors: {
      primary: "hsl(25 40% 20%)", // deep umber
      background: "hsl(30 25% 12%)", // shadow
      accent: "hsl(25 65% 45%)", // burnt orange
      muted: "hsl(140 25% 25%)" // dense moss
    },
    useCase: "Case studies, problem visualization, gravity of work",
    visualLogic: "Abstract physics—pressure, convergence, momentum. Heavy sphere compressing plane. Massive shapes near collision. Dramatic directional lighting."
  },
  {
    id: 5,
    name: "The Arbiter",
    tagline: "You are hiring this judgment.",
    emotionalSignal: "Look me in the eye and tell me your problem.",
    heroHeadline: "Principal-led.",
    heroSubline: "Accountability lives here.",
    typography: {
      headline: "Classic elegant serif for name/title",
      body: "Clean understated sans"
    },
    colors: {
      primary: "hsl(0 0% 100%)",
      background: "hsl(0 0% 8%)",
      accent: "hsl(0 0% 50%)",
      muted: "hsl(0 0% 30%)"
    },
    useCase: "Principal page, bold homepage if reputation is stellar",
    visualLogic: "Human presence stripped of warmth. Accountability and intense focus. Unconventional framing—tight crop at eyes, hands clasped. Rembrandt lighting. Not smiling."
  }
];

const DesignExploration = () => {
  const [activeDirection, setActiveDirection] = useState(1);
  const current = directions.find(d => d.id === activeDirection)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-32 pb-12 px-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Internal Design Exploration
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight mb-4">
            Visual Direction Concepts
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Five distinct approaches to signal strategic authority and creative capability. 
            Each direction represents a different emotional contract with the visitor.
          </p>
        </div>
      </div>

      {/* Direction Selector */}
      <div className="sticky top-20 z-40 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-1 py-4 -mx-6 px-6">
            {directions.map((dir) => (
              <button
                key={dir.id}
                onClick={() => setActiveDirection(dir.id)}
                className={`
                  flex-shrink-0 px-4 py-2 text-sm font-medium transition-all
                  ${activeDirection === dir.id 
                    ? 'bg-foreground text-background' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                `}
              >
                {dir.id}. {dir.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Direction Detail */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Title Block */}
        <div className="mb-16">
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Direction {current.id}
          </span>
          <h2 className="font-serif text-5xl md:text-6xl font-normal tracking-tight mt-2 mb-4">
            {current.name}
          </h2>
          <p className="text-xl text-muted-foreground italic">
            "{current.emotionalSignal}"
          </p>
        </div>

        {/* Hero Mockup */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Hero Concept Mockup
          </p>
          <div 
            className="aspect-[16/9] flex flex-col items-center justify-center p-12 md:p-24"
            style={{ 
              backgroundColor: current.colors.background,
              color: current.colors.primary
            }}
          >
            {current.id === 1 && (
              <div className="text-center max-w-4xl">
                <h3 
                  className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight mb-6"
                  style={{ color: current.colors.primary }}
                >
                  {current.heroHeadline}
                </h3>
                <p 
                  className="text-sm tracking-[0.2em] uppercase"
                  style={{ color: current.colors.muted }}
                >
                  {current.heroSubline}
                </p>
              </div>
            )}

            {current.id === 2 && (
              <div className="relative w-full h-full flex items-end">
                {/* Abstract brutalist shapes */}
                <div 
                  className="absolute top-8 left-8 w-32 h-64 opacity-30"
                  style={{ backgroundColor: current.colors.accent }}
                />
                <div 
                  className="absolute top-16 left-24 w-48 h-48 opacity-20"
                  style={{ backgroundColor: current.colors.muted }}
                />
                <div className="relative z-10 p-8">
                  <h3 
                    className="font-mono text-3xl md:text-5xl font-bold tracking-tight mb-4 uppercase"
                    style={{ color: current.colors.primary }}
                  >
                    {current.heroHeadline}
                  </h3>
                  <p 
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: current.colors.accent }}
                  >
                    {current.heroSubline}
                  </p>
                </div>
              </div>
            )}

            {current.id === 3 && (
              <div className="text-center relative">
                {/* Subtle animated element suggestion */}
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-10"
                >
                  <div 
                    className="w-px h-48 animate-pulse"
                    style={{ backgroundColor: current.colors.accent }}
                  />
                </div>
                <h3 
                  className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.2em]"
                  style={{ color: current.colors.primary }}
                >
                  {current.heroHeadline}
                </h3>
              </div>
            )}

            {current.id === 4 && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Abstract physics shapes */}
                <div 
                  className="absolute w-64 h-64 rounded-full opacity-40"
                  style={{ 
                    backgroundColor: current.colors.accent,
                    boxShadow: `0 40px 80px -20px ${current.colors.accent}`
                  }}
                />
                <div 
                  className="absolute w-full h-px"
                  style={{ backgroundColor: current.colors.muted }}
                />
                <div className="relative z-10 text-center">
                  <h3 
                    className="text-3xl md:text-5xl font-light tracking-wider mb-4"
                    style={{ color: current.colors.primary }}
                  >
                    {current.heroHeadline}
                  </h3>
                  <p 
                    className="text-sm tracking-widest"
                    style={{ color: current.colors.muted }}
                  >
                    {current.heroSubline}
                  </p>
                </div>
              </div>
            )}

            {current.id === 5 && (
              <div className="flex items-center gap-12 md:gap-24">
                {/* Portrait placeholder */}
                <div 
                  className="w-32 h-40 md:w-48 md:h-60 flex items-center justify-center"
                  style={{ backgroundColor: current.colors.muted }}
                >
                  <span className="text-xs uppercase tracking-widest opacity-50" style={{ color: current.colors.primary }}>
                    Portrait
                  </span>
                </div>
                <div>
                  <h3 
                    className="font-serif text-4xl md:text-6xl font-normal tracking-tight mb-2"
                    style={{ color: current.colors.primary }}
                  >
                    {current.heroHeadline}
                  </h3>
                  <p 
                    className="text-sm tracking-widest uppercase"
                    style={{ color: current.colors.accent }}
                  >
                    {current.heroSubline}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          
          {/* Visual Logic */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Visual Logic
            </p>
            <p className="text-foreground leading-relaxed">
              {current.visualLogic}
            </p>
          </div>

          {/* Use Case */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Recommended Use
            </p>
            <p className="text-foreground leading-relaxed">
              {current.useCase}
            </p>
          </div>

          {/* Typography */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Typography System
            </p>
            <div className="space-y-2">
              <p className="text-foreground">
                <span className="text-muted-foreground">Headlines:</span> {current.typography.headline}
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Body:</span> {current.typography.body}
              </p>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Color System
            </p>
            <div className="flex gap-2">
              {Object.entries(current.colors).map(([name, color]) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div 
                    className="w-12 h-12 border border-border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emotional Contract */}
        <div className="border-t border-border pt-12">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Emotional Contract with Visitor
          </p>
          <blockquote className="font-serif text-3xl md:text-4xl font-normal italic text-foreground">
            "{current.tagline} {current.emotionalSignal}"
          </blockquote>
        </div>

      </div>

      {/* Comparison Matrix */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">
            Direction Comparison Matrix
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 pr-4 font-medium text-muted-foreground">Direction</th>
                  <th className="text-left py-4 px-4 font-medium text-muted-foreground">Core Signal</th>
                  <th className="text-left py-4 px-4 font-medium text-muted-foreground">Visual Metaphor</th>
                  <th className="text-left py-4 pl-4 font-medium text-muted-foreground">Best For</th>
                </tr>
              </thead>
              <tbody>
                {directions.map((dir) => (
                  <tr 
                    key={dir.id} 
                    className={`border-b border-border/50 cursor-pointer transition-colors ${activeDirection === dir.id ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
                    onClick={() => setActiveDirection(dir.id)}
                  >
                    <td className="py-4 pr-4 font-medium">{dir.name}</td>
                    <td className="py-4 px-4 text-muted-foreground">{dir.tagline}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {dir.id === 1 && "Journalism / Intelligence"}
                      {dir.id === 2 && "Architecture / Structure"}
                      {dir.id === 3 && "Void / Silence"}
                      {dir.id === 4 && "Physics / Forces"}
                      {dir.id === 5 && "Portraiture / Judgment"}
                    </td>
                    <td className="py-4 pl-4 text-muted-foreground">{dir.useCase.split(',')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Full Homepage Mockups */}
      <div className="border-t border-border bg-muted/50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-8">
            Full Homepage Mockups
          </p>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Complete homepage treatments applying the direction concepts to actual site content. 
            Use these to evaluate how each direction feels at full scale.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Elemental Void V1 */}
            <Link 
              href="/design-exploration/elemental-void"
              className="group block p-8 bg-[#0a0a0a] text-white hover:bg-[#111] transition-colors"
            >
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Direction 3</p>
              <h3 className="text-xl font-light tracking-tight mb-2" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                The Elemental Void
              </h3>
              <p className="text-xs text-white/50 mb-6">
                Clinical minimalism. Visual silence.
              </p>
              <span className="text-xs uppercase tracking-wide text-white/30 group-hover:text-white/60 transition-colors">
                View V1 →
              </span>
            </Link>
            
            {/* Elemental Void V2 - Light Beam */}
            <Link 
              href="/design-exploration/elemental-void-v2"
              className="group block p-8 text-white hover:bg-[#0a0a0a] transition-colors relative overflow-hidden"
              style={{ backgroundColor: '#050505' }}
            >
              {/* Light streak preview */}
              <div 
                className="absolute w-[200%] h-[1px] opacity-20"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                  top: '40%',
                  left: '-50%',
                  transform: 'rotate(-15deg)',
                }}
              />
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4 relative z-10">Direction 3 V2</p>
              <h3 className="text-xl font-light tracking-tight mb-2 relative z-10" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
                Light in the Vacuum
              </h3>
              <p className="text-xs text-white/50 mb-6 relative z-10">
                Atmospheric drama. Ethereal light beam.
              </p>
              <span className="text-xs uppercase tracking-wide text-white/30 group-hover:text-white/60 transition-colors relative z-10">
                View V2 →
              </span>
            </Link>
            
            {/* Editorial Mockup */}
            <Link 
              href="/design-exploration/editorial"
              className="group block p-8 border border-black/10 hover:bg-black/[0.02] transition-colors"
              style={{ backgroundColor: '#FAF9F6' }}
            >
              <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-4" style={{ color: '#8B2635' }}>Direction 1</p>
              <h3 className="text-xl font-normal tracking-tight mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                The New Editorial Standard
              </h3>
              <p className="text-xs text-black/50 mb-6">
                Journalistic authority. Intelligence.
              </p>
              <span className="text-xs uppercase tracking-wide text-black/30 group-hover:text-black/60 transition-colors">
                View Editorial →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-xs text-muted-foreground">
            Internal document. These directions are not mutually exclusive—elements can be hybridized. 
            The goal is to identify which emotional contract best serves the brand's positioning needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesignExploration;