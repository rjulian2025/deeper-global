# Mental Landscape Exploration

**Version:** 1.0  
**Date:** June 2026  
**Purpose:** Define a visual territory unique to Deeper — scientific, human, calm, memorable — without fantasy art, spiritual symbolism, or generic wellness stock.

---

## Executive summary

Deeper already gestures toward this territory with the **Psychology Weather Map** (`/weather-map/`): aggregate mental health question demand as geographic “weather,” not individual tracking. That concept — **mapping inner life with the seriousness of cartography and meteorology** — is the seed of a ownable visual language.

The goal is not decoration on top of a knowledge site. It is a **mental model made visible**: depth, pressure, fronts, pathways, contours, climate. People navigating hard questions need orientation, not inspiration posters.

Three constraints govern everything below:

1. **Scientific** — could appear in a public health briefing or research institute annual report  
2. **Human** — warm paper tones, readable type, no cold data-viz brutalism  
3. **Calm** — motionless or barely moving; never gamified, never alarming  

---

## Part 1 — Why landscape, not people

### Clichés to avoid

| Category | Examples | Why they fail |
|----------|----------|---------------|
| Stock therapy | Smiling couples, windows, coffee cups | Empty emotional shorthand |
| Meditation apps | Gradients, lotus, breathing circles | Wellness consumer product |
| AI products | Purple gradients, sparkle icons, chat bubbles | Instant “generated” read |
| Clinical cold | Blue-white hospital UI, icon grids | Alienating in vulnerable moments |
| Spiritual | Mandalas, chakras, celestial motifs | Wrong frame for evidence-based MH |

### What landscape offers

- **Metaphor without diagnosis** — “pressure front” not “you have disorder X”  
- **Scale and depth** — matches brand name *Deeper* literally  
- **Navigation metaphor** — maps help people who feel lost  
- **Aggregate ethics** — weather/climate = population patterns, not individual surveillance  
- **Timelessness** — cartography and contour maps age well; UI trends do not  

---

## Part 2 — Concept territories (six explorations)

### 2.1 Psychological weather systems ★ (existing anchor)

**Idea:** Mental health topics behave like weather patterns — fronts, pressure, seasonal shifts, calm periods, storms.

**Already in product:** Psychology Weather Map, category swatches, state-level aggregation.

**Visual vocabulary:**
- Isobar-like lines (thin, low contrast)
- Soft pressure gradients (not rainbow data-viz)
- Category “fronts” as labeled bands, not pills
- Legend as typographic key, not colorful widget panel

**Use on site:**
- Homepage hero alternative: abstract pressure map (no faces)
- Topic hub headers: “Current conditions in Anxiety” as editorial copy + subtle map fragment
- Seasonal editorial series: “This week in American mental health”

**Risks:** Too literal weather icons (sun/cloud emoji). Stay cartographic.

---

### 2.2 Emotional topography / depth contours ★★ (strongest ownable mark)

**Idea:** Emotions and concerns exist at different “elevations” and densities — contour lines express complexity without chart junk.

**Visual vocabulary:**
- Topographic contour lines at 3–5% opacity on `--paper`
- Elevation not labeled as mood scores — no “you are at 7/10”
- Ridge lines as section dividers instead of borders
- “Depth” as vertical rhythm (deeper sections = more whitespace + smaller type in sidebar)

**Use on site:**
- Answer page background: faint contour field (Direction B prototype)
- Section breaks: contour fragment between h2 blocks
- Brand mark evolution: contour ring around wordmark (optional, long-term)

**References (tone, not copy):**
- USGS topographic maps (scientific linework)
- James Turrell horizon works (atmospheric, not figurative)
- Field guides and geological survey publications

**Risks:** Contours too dense → moiré / visual noise. Use large-scale curves only.

---

### 2.3 Healing pathways / trail maps

**Idea:** Care-seeking as route-finding — forks, markers, distance, not steps in a funnel.

**Visual vocabulary:**
- Dotted path lines (single stroke, `--stone` at 40% opacity)
- Waypoints as small ticks, not numbered gamified steps
- “You are here” as editorial breadcrumb language, not map pin icon

**Use on site:**
- “Questions people ask next” as trail continuation
- Topic hub reading paths (ordered link lists)
- Modality guides: “paths to care” without funnel diagrams

**Risks:** Feels like onboarding wizard. Keep static, textual, optional.

---

### 2.4 Emotional climate (long-cycle)

**Idea:** Distinct from daily weather — climate = sustained patterns (grief season, chronic stress, recurring anxiety).

**Visual vocabulary:**
- Wider gradient bands (decade-scale editorial, not live data)
- Muted banding on `--paper-deep`
- Copy-first: “patterns over months” not animated climate sim

**Use on site:**
- Editorial series, annual reports, research briefs
- Not for crisis pages

**Risks:** Confusion with weather map. Use climate language only in long-form editorial.

---

### 2.5 Mental health navigation systems

**Idea:** Compass rose, graticule, chart margins — instruments of orientation.

**Visual vocabulary:**
- Thin crosshairs in hero corners (1px `--line`)
- Margin ticks on long-form articles (NYT print tradition)
- Coordinates as decorative metadata (“Topic grid ref: Anxiety / Workplace”) — optional Easter egg for power users

**Use on site:**
- Direction A (Editorial Institution) accent
- Citation blocks styled like chart annotations

**Risks:** Nautical clichés (anchors, ships). Use instrument details only.

---

### 2.6 Ecosystems (restrained)

**Idea:** Interconnected systems — soil, water, canopy — as metaphor for comorbidity and context.

**Visual vocabulary:**
- Layered horizontal strata (very abstract)
- Network graphs only in research/API docs, not consumer UI

**Use on site:** Limited. Prefer for B2B intelligence layer later.

**Risks:** Nature stock photography trap. Must stay diagrammatic.

---

## Part 3 — Scalable design system elements

### 3.1 Motif library (production-ready)

| Token / asset | Description | Max usage |
|---------------|-------------|-----------|
| `--contour-opacity: 0.04` | SVG contour tile on `--paper` | Page background, hero |
| `.divider-contour` | 120px-wide contour fragment between sections | 1× per major section |
| `.meta-coordinates` | Optional topic coordinate string in metadata | 0–1 per page |
| `.pressure-band` | Horizontal 2-stop gradient `--mist` → transparent | Hub headers only |
| `.path-continue` | Dotted left border on “next questions” list | Sidebar lists |

### 3.2 Color relationship to existing tokens

Do **not** introduce a parallel palette. Map landscape to current system:

| Landscape role | Deeper token |
|----------------|--------------|
| Land / paper ground | `--paper`, `--paper-deep` |
| Water / depth | `--navy`, `--deep` |
| Sky / openness | `--white`, `--mist` |
| Warm human signal | `--brass` (sparingly, lines only) |
| Care / urgency (warm) | `--clay`, `--clay-soft` |
| Interactive | `--ocean` (links only in editorial mode) |

Weather map category swatches should **converge toward Deeper tokens** over time — current bright hex legend is the most “dashboard-like” element on the site.

### 3.3 Motion

- **Default:** none  
- **Allowed:** slow opacity fade on map load; respect `prefers-reduced-motion`  
- **Forbidden:** parallax, floating particles, pulsing badges, typing cursors  

### 3.4 Photography policy

| Allowed | Not allowed |
|---------|-------------|
| Abstract aerial terrain (no faces) | People in distress or smiling therapy sessions |
| Empty landscapes, fog, horizon | Meditation poses |
| Archival institutional photography (buildings, libraries) | AI-generated humans |
| None (type-only) — valid default | Stock “person at laptop” |

**Homepage hero recommendation:** Replace reader stock with **contour field + typographic hero** OR archival library/reading room if photography required.

### 3.5 Iconography

- No chat icons, sparkles, robots, hearts, brains with lightning  
- Allowed: minimal line icons for search, external link, citation — stroke 1.5px, `--stone`  
- Prefer text labels over icons in navigation  

---

## Part 4 — Opportunities unique to Deeper

1. **Named territory:** “Psychology Weather” and “Depth contours” are already on-brand and hard to copy without feeling derivative if executed in Deeper’s warm paper system.

2. **Ethical aggregate viz:** Weather map proves Deeper can visualize demand without exploiting individuals — extend to editorial “pressure reports,” not user dashboards.

3. **Question-as-primary-object:** Landscape maps **questions**, not diagnoses — contour density = question clustering, not symptom severity scores.

4. **Cross-product thread:** Deeper Websites / referrals / therapist profiles share “navigation” language without SaaS cards.

5. **AI citation surface:** Machine-readable structure stays; human surface loses “AI summary box” — landscape motif replaces “generated content” chrome.

---

## Part 5 — Application matrix

| Surface | Weather | Contours | Pathways | Navigation graticule |
|---------|---------|----------|----------|----------------------|
| Homepage hero | ●● | ●●● | ○ | ● |
| Answer page | ○ | ●●● | ● | ●● |
| Topic hub | ●●● | ●● | ●● | ○ |
| Search | ○ | ○ | ○ | ● |
| Reviewer profile | ○ | ○ | ○ | ●●● |
| Weather map | ●●● | ● | ○ | ●● |
| Crisis / YMYL | ○ | ○ | ○ | ○ |

●●● = primary motif · ●● = secondary · ● = accent · ○ = avoid

---

## Part 6 — Three visual directions (summary)

Full coded prototypes: **`/design-evolution/answer-directions/`**

### Direction A — Editorial Institution

**References:** New York Times, Mayo Clinic  
**Landscape role:** Navigation graticule, margin ticks, chart-style citation  
**Strength:** Maximum credibility, fastest path from current content  
**Weakness:** Less visually distinctive unless contour accent added lightly  

### Direction B — Mental Landscape

**References:** USGS maps, field guides, Psychology Weather Map  
**Landscape role:** Contour backgrounds, ridge dividers, pressure language in copy  
**Strength:** Most ownable; aligns with “Deeper” name  
**Weakness:** Requires discipline to avoid decorative noise  

### Direction C — Premium Knowledge Platform

**References:** Notion, Linear, research institute PDFs  
**Landscape role:** Minimal — whitespace as “depth”; optional coordinate metadata  
**Strength:** Clearest IA; best for power users and citation  
**Weakness:** Could feel cold without warm paper tokens  

**Recommendation:** Hybrid long-term — **Direction A typography + Direction B contour at 4% opacity + Direction C sidebar IA**. Prototypes are split for decision clarity.

---

## Part 7 — Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Contour moiré on mobile | Large-radius curves; disable below 360px if needed |
| Weather metaphor trivializes MH | Always pair with clinical review metadata; never animate storms on crisis content |
| Looks like climate change politics | Use “pressure” and “conditions” language, not political weather memes |
| Mapbox dependency feels tech-heavy | Static SVG fallback for core pages; map only on `/weather-map/` |
| Fantasy cartography | No illustrated maps; line art only |
| Spiritual reading of “energy” or “vibration” | Ban those words in design copy; use scientific meteorology / geology terms |
| Reintroducing pills as “legend chips” | Legends = typographic lists only |

---

## Part 8 — Production roadmap (visual territory)

| Step | Deliverable |
|------|-------------|
| 1 | Pick direction from prototype page (stakeholder review) |
| 2 | SVG contour tile asset (single seamless pattern, optimized) |
| 3 | Replace homepage hero image |
| 4 | Align weather map legend to Deeper tokens |
| 5 | Answer page background + divider motifs |
| 6 | Favicon / OG image with contour mark |
| 7 | DESIGN.md §12 Mental Landscape tokens |

---

## Appendix — Inspiration references (study, do not copy)

- **Mayo Clinic patient education** — typographic hierarchy, calm white, earned trust lines  
- **NYT Well / Science Times** — measure, section rules, metadata bylines  
- **USGS topo maps** — contour grammar, restraint  
- **Notion gallery templates (academic)** — sidebar TOC, quiet grays  
- **Linear docs** — spacing rhythm, single accent  
- **Edward Tufte** — data-ink ratio; delete chrome  
- **Psychology Weather Map (internal)** — ethical aggregate visualization precedent  

---

*Paired document: `DESIGN_REFACTOR_PLAN.md` · Prototypes: `/design-evolution/answer-directions/`*
