# Typography Round — Assessment

**Date:** June 2026  
**Scope:** Typography only — layouts unchanged  
**Page:** `/design-evolution/typography-round/`  
**Target reference:** New York Times + Mayo Clinic + modern research institute

---

## Systems tested

| ID | Headline | Body / UI | Layout shell |
|----|----------|-----------|--------------|
| Baseline | Cormorant Garamond 600 | Jost 400 | Direction A |
| A1 | Noto Serif Display 600 | Inter 400 | Direction A |
| A2 | Noto Serif Display 600 | Inter 400 (18px body, 42rem measure) | Direction A spacious |
| B1 | Noto Serif Display 600 / h2 500 | Inter 400 | Direction B |
| **D ★** | Noto Serif Display 600 / h2 500 | Inter 400 | Hybrid A + B landscape |
| NR-A1 | Newsreader 600 / h2 500 | Inter 400 | Direction A |
| NR-A2 | Newsreader 600 | Inter 400 spacious | Direction A |
| NR-B1 | Newsreader | Inter | Direction B |
| NR-D | Newsreader | Inter | Hybrid |

---

## Comparative assessment

### Cormorant Garamond + Jost (current)

**Strengths**
- Warm, human, already in DESIGN.md
- Cormorant at display sizes feels literary and memorable
- Reasonable long-form comfort when Georgia overrides are removed

**Weaknesses**
- Warmth can read as **therapy blog** or **luxury wellness** rather than clinical institution
- Jost’s geometric personality competes with Cormorant — two distinct voices
- Implementation drift (Georgia fallbacks, weight 900 eyebrows) undermines premium intent
- Less aligned with Mayo/NYT institutional neutral tone

**Best for:** Brand warmth if clinical credibility is secondary.

---

### Noto Serif Display + Inter

**Strengths**
- **Trust & clinical credibility:** Noto Display is restrained, public-sector, patient-education adjacent — reads “hospital system content” not “influencer”
- **Inter neutrality:** UI and body disappear; metadata feels factual, not marketed
- **Calm confidence:** Medium weights (500–600), generous line height — no shouty display
- **Long-form:** Inter at 16–18px with 1.72–1.78 line height matches research PDF comfort
- **Pairs with Direction D hybrid:** Institutional structure + subtle contour atmosphere

**Weaknesses**
- Lower **distinctiveness** — closer to generic premium knowledge sites (Notion-adjacent sans)
- Can feel cooler than Deeper’s “warm authority” principle without paper tokens and brass accents
- Noto Display less “newspaper” than Newsreader for pure editorial romance

**Best for:** Primary recommendation — trusted mental health knowledge repository.

---

### Newsreader + Inter

**Strengths**
- **Editorial quality:** Strongest NYT alignment — designed for news reading at optical sizes
- **Intellectual depth:** Serif texture signals seriousness without ornament
- **Trust:** Newspaper lineage implies editorial standards and review
- **Long-form:** Excellent screen readability at 6–72 opsz axis

**Weaknesses**
- Slightly more **magazine/newsletter** than **clinical** — may need tighter metadata treatment to avoid “Substack”
- Less ownable than Noto + contour landscape system
- Italic lede must still be avoided (would feel editorial opinion, not clinical summary)

**Best for:** Alternate if editorial voice is prioritized over clinical institution tone.

---

## Scores (1–5)

| Criterion | Cormorant + Jost | Noto Display + Inter | Newsreader + Inter |
|-----------|:----------------:|:--------------------:|:------------------:|
| Trust | 3.5 | **4.5** | **4.5** |
| Readability | 4.0 | **4.5** | **4.5** |
| Clinical credibility | 3.5 | **4.5** | **4.5** |
| Editorial quality | 4.0 | 4.5 | **5.0** |
| Distinctiveness | **4.0** | 3.5 | 4.0 |
| Long-form comfort | 4.0 | **4.5** | **4.5** |
| **Average** | **3.8** | **4.3** | **4.3** |

---

## Variant-specific notes

### A1 (Noto + Inter, standard scale)
Baseline Noto test. Confirms Inter metadata is quieter than Jost pills/labels would suggest. Headlines need 1.22+ line height — Noto Display benefits from breathing room.

### A2 (Noto + Inter, spacious)
**Recommended type scale for answer pages.** Larger h1 (2.75rem), 17–18px body, 42rem measure, increased section margins. Feels Mayo patient guide / NEJM lay summary — not startup blog.

### B1 (Noto + Inter, Direction B)
Topographic dividers work with Noto — landscape motif does not fight institutional serif. h2 at weight 500 prevents section titles from overpowering contour lines.

### D (Hybrid — leading layout candidate)
Noto + Inter on A structure with B contour background and ridge h2 markers. Best synthesis: **institutional typography + ownable landscape atmosphere**. Primary candidate for Phase 1 implementation.

### Newsreader parallels (NR-A1, NR-A2, NR-B1, NR-D)
Newsreader wins side-by-side on headline beauty. NR-D vs D: prefer **D (Noto)** for clinical trust; **NR-D** if stakeholder review favors NYT editorial over Mayo clinical.

---

## Recommendation

### Winner: **Noto Serif Display + Inter** on **Variant D** with **A2 type scale**

1. **Headlines:** Noto Serif Display 600 (h1), 500 (h2–h3)  
2. **Body / UI:** Inter 400 — 18px answer body, 16px UI, 14px metadata, 12px labels  
3. **Line height:** h1 1.24 · body 1.78 · metadata 1.5  
4. **Measure:** lede 40rem · body 42rem  
5. **Layout (separate decision):** Hybrid D when layout phase begins  

**Runner-up:** Newsreader + Inter (NR-D) — choose if editorial/newspaper identity outweighs clinical institution.

**Retire for answer surfaces:** Cormorant + Jost — warm but wrong institution class for “world’s most trusted MH knowledge repository.”

---

## Next steps (typography only)

1. Stakeholder review at `/design-evolution/typography-round/`
2. If approved: update DESIGN.md §3 typefaces (Noto Display + Inter)
3. Load fonts in BaseLayout (swap Google Fonts link)
4. Apply A2 tokens to answer page CSS — **no layout refactor yet**
5. Re-test grayscale hierarchy and WCAG pairs for new sizes

---

*Layouts unchanged in this round. See `DESIGN_REFACTOR_PLAN.md` for subsequent layout evolution.*
