# Deeper Post-Recovery Authority Audit

**Date:** 2026-06-11  
**Auditor:** Fable (Claude browser)  
**Scope:** Live production output of deeper.global (rendered source of truth for `production/astro`). Audit only — no code edited, nothing deployed.  
**Method:** External crawl of homepage, `/protocol/`, `/llms.txt`, answer pages (legacy + v2 format), homepage hub links, full answer index via llms.txt. Items not verifiable from outside (meta robots, raw JSON-LD, env vars, Vercel config) are marked **VERIFY-IN-REPO**.

**Reconciled by:** Cursor (2026-06-11) — see `docs/deeper-phase-0-authority-plan.md` Section C.

---

## Executive summary

The recovery is solid and the architecture is genuinely differentiated. llms.txt is best-in-class — a full entity map with aliases plus an answer index with extracts, which is exactly what AI retrieval systems want and almost no one ships. The new (May 2026) answer template — key takeaways, structured sections, "How to cite this answer," care disclaimer, "Questions people ask next" — is a strong citability format.

The three problems that matter most:

1. **The entity taxonomy is fragmented.** ~68 entities, of which ~35 have 1–2 answers, with heavy semantic overlap (five anxiety entities, five relationship entities, four work/burnout entities, two teen entities, Self-Worth duplicating Identity & Self-Worth). The system currently reads as a tag cloud, not a knowledge graph. This is the single highest-leverage fix.
2. **The corpus is two-tier.** A small set of answers use the v2 format; the bulk are legacy 2025 batch content with advice-column voice, formulaic metaphor openers, near-duplicate questions, and pipeline-artifact slugs (`-184730-102`, `-l2m3n4`, `-final-1000`). The site's authority ceiling is set by its worst indexed page.
3. **"Evidence-informed" is asserted but not shown.** The Protocol promises a "source set" per answer; rendered answer pages show no sources, no named author, no named reviewer. For YMYL mental health content, this is the gap between a good site and a citable one.

Conversion is currently "authority only" — there is no bridge of any kind to the Deeper business. That's defensible short-term but is leaving the brand-entity benefit (and the deeperwebsites.com collision mitigation) on the table.

---

## What is working

- **llms.txt**: entity map with aliases + per-answer summaries and extracts + crisis boundary + AI-use statement. Keep the format frozen; it is an asset.
- **v2 answer template**: short answer up top, Key Takeaways, What may be happening / Why it feels hard to stop / What can help / When to get support, citation block with canonical URL and update date, "Not a substitute for care," related questions, "Questions people ask next" (pre-seeds follow-up query coverage). This is the right shape for both featured snippets and LLM extraction.
- **IA skeleton**: Home → Answers / Topics / Themes / Protocol / About is coherent; breadcrumbs render on answers; every page footer links protocol + llms.txt + privacy.
- **Protocol page**: risk classification, human editorial accountability, privacy-safe intelligence posture. Rare and on-brand. It promises more than the answer pages currently deliver — close that gap rather than softening the promise.
- **Canonical + OG hygiene**: canonicals consistent on www host; og:type article on answers, website on hubs; descriptions present.
- **Honest scale claims**: homepage stats (1,005 vetted answers, 68 topic areas) match the llms.txt index.

---

## Top 10 risks / opportunities

1. **Entity fragmentation (highest leverage).** Anxiety & Stress / Anxiety & Worry / Anxiety Management / Generalized Anxiety / Social Anxiety; Trauma & Grief / Grief & Loss / Trauma & Triggers; Work & Burnout / Work & Life Balance / Work, Stress & Burnout / Workplace Mental Health / Workplace; Relationships ×5; Parenting ×3; Teens ×2; Self-Worth vs Identity & Self-Worth. Consolidate to ~22–25 canonical entities; everything else becomes an alias (llms.txt already supports aliases). 301 merged entity URLs. Thin hubs (<3 answers) should not be indexable until merged.

2. **Categories vs Entities duplication.** `/categories/anxiety-and-stress/` and `/entities/anxiety-and-stress/` carry the same labels. Answer pages breadcrumb and "Related theme" both point to `/categories/` — suggesting `/entities/` is currently vestigial. Two parallel hubs with identical names risk duplicate-content competition and confuse the graph. Decide: either entities become true concept pages (definition, symptoms-adjacent framing, related entities, linked answers — the canonical node) and categories remain browse indexes, or fold entities into categories and redirect. Do not keep both as-is.

3. **Legacy content tier.** Batch-generated 2025 answers share identical timestamps in clusters (dozens at 23:56:16, 23:42:25, etc.), formulaic openers ("X is like being trapped in quicksand"), prescriptive summaries, and confirmed near-duplicates ("waiting for the other shoe to drop" vs "waiting for something bad to happen"; "too much for other people" ×2; "don't deserve good things" ×2). Duplicates split internal authority and read as programmatic to quality raters. Merge each dupe pair: keep the better URL, 301 the other, rewrite to v2.

4. **No visible sources, author, or reviewer (YMYL).** "Deeper review signal" is anonymous; "Evidence-informed" has no references rendered. Add: 2–4 reputable citations per answer (the Protocol's "source set" field, surfaced); a named clinical reviewer with credentials on risk-classed and top-traffic answers; an editorial-policy page linked from every answer. Do not overclaim — "Reviewed for accuracy by [name], LPC" is enough. This is the trust unlock for both Google and AI systems.

5. **Indexation strategy is likely inverted.** Stated current behavior: hubs indexable, answers possibly noindex,follow. For an answer engine, the answers are the product — long-tail question pages are where search and AI citation demand lives. Recommended model: **graduated indexation tied to review state** (the field already exists per Protocol): v2/reviewed answers → index; legacy/unreviewed → noindex,follow until upgraded; entity hubs with <3 answers → noindex until consolidated; category hubs → index. **VERIFY-IN-REPO:** confirm actual noindex logic and current Search Console indexed counts before flipping anything.

6. **Slug debt.** Hash and pipeline suffixes (`-l2m3n4`, `-184730-102`, `-final-1000`) leak machinery, waste keyword signal, and look low-trust in citations. Policy: never mass-migrate; fix slug only when an answer is upgraded to v2 (with 301), and enforce clean slugs for all new content.

7. **Entity misclassification.** Psychedelic-therapy answers, "how do I find a therapist," "what to expect in first session," etc. are filed under Identity & Self-Worth. Therapy/treatment-navigation content is Deeper's most strategically valuable cluster (closest to care intent and to the business) and it's currently scattered. Create/strengthen a canonical "Therapy & Treatment" entity and re-home these.

8. **Crisis handling is thinner on-page than in llms.txt.** llms.txt carries the 988 boundary; the answer page shows only a generic "Not a substitute for care" note. Per Protocol §2, risk-classed answers require visible crisis support. Recommend a crisis-resources component (988 + international pointer) rendered on all risk-classed answers, and audit which answers are actually risk-classed (e.g., the psychedelics/medication-adjacent answers). **VERIFY-IN-REPO:** risk_class field coverage in Supabase.

9. **Freshness signals look batch-generated.** Mass-identical `updated` timestamps undermine lastmod credibility in the sitemap (Google discounts unreliable lastmod). Only bump updated dates on real content changes; carry accurate lastmod into sitemap.xml. **VERIFY-IN-REPO:** sitemap lastmod source.

10. **Build dependency on Supabase is a single point of failure.** The recovery incident proves the failure mode. Recommend: read-only key for builds; a committed or cached content snapshot as fallback; and a CI assertion that fails the build if generated answer count drops below a threshold (e.g., <95% of expected) so partial fetches can never silently ship a gutted site. Deployment hygiene: branch protection on production/astro, PR-only merges, preview deploys, prohibit CLI deploys. **VERIFY-IN-REPO:** env var handling, build script behavior on fetch failure.

---

## 80/20 recommended roadmap

The 20% that produces 80% of the gain, in order:

1. **Entity consolidation map** (taxonomy doc, no code): 68 → ~24 canonical entities with alias lists and redirect table. Everything downstream depends on this.
2. **Top-150 answer upgrade**: rank answers by (GSC impressions + AI-citation likelihood + risk class), rewrite to v2 format with sources + reviewer, clean slug + 301, flip to index. This set becomes the citable core.
3. **Trust layer**: editorial policy page, named reviewer program, surfaced source sets, crisis component. One sprint, site-wide effect.
4. **Graduated indexation**: wire index/noindex to review state. Quality becomes a publishing gate, not an aspiration.
5. **Dedupe pass**: merge the ~15–25 near-duplicate pairs identifiable from the answer index alone.

Everything else (full legacy rewrite, entities-as-concept-pages buildout, API product) sequences behind these.

---

## Quick wins (days, not weeks)

- Re-home the miscategorized therapy/psychedelic answers to a Therapy & Treatment entity.
- Merge the 3 confirmed duplicate pairs (other-shoe/something-bad; too-much ×2; deserve-good-things ×2) with 301s.
- Add the crisis-resources component to risk-classed answers.
- Add Organization + WebSite JSON-LD with founder/about linkage, and a real About page establishing who is behind Deeper (entity disambiguation — also helps the "Deeper" namespace collision documented in the deeperwebsites.com audit).
- Stop bumping `updated` timestamps in batches; make lastmod truthful.
- CI build assertion on answer count (cheap insurance against a repeat incident).

---

## Do-not-touch list

- llms.txt structure and format — extend, don't redesign.
- v2 answer template — it's correct; apply it, don't iterate it yet.
- URLs of any answer currently earning impressions or citations (check GSC first); no mass slug migration.
- production/astro governance model — keep Git as sole deploy path.
- Supabase content (out of scope per rules; all content changes go through the normal pipeline later).
- The "Not a substitute for care" footer line — required posture, keep verbatim everywhere.

---

## Suggested Phase 1 implementation plan (post-approval, ~2–3 weeks)

1. **Week 0 (no code):** Pull GSC + any AI-referral data. Confirm actual indexation state per page type. Produce the entity consolidation map and the top-150 answer list. Decide the `/entities/` vs `/categories/` question.
2. **Week 1:** Trust layer — editorial policy page, reviewer block component, source-set rendering, crisis component, Organization/About schema. CI answer-count assertion. Branch protections verified.
3. **Week 2:** Entity consolidation — merge thin/duplicate entities, 301s, alias updates in llms.txt, re-home misfiled answers. Graduated indexation logic keyed to review state.
4. **Week 3:** First 50 of the top-150 answer upgrades (v2 rewrite, sources, reviewer, clean slug, index on). Establish weekly cadence thereafter (~25/week).
5. **Gate:** nothing in steps 2–4 ships without the Week 0 GSC baseline, so impact is measurable.

---

## Open questions for Rick

1. Do we have Search Console + analytics access showing which answer pages are currently indexed and earning impressions/citations? (Determines the top-150 list and whether the noindex flip is safe.)
2. What is `/entities/` supposed to be — the canonical concept layer, or is it vestigial and foldable into `/categories/`?
3. Is there a credentialed clinician available (or budget for one) to serve as named reviewer? Even one name covering the top-150 changes the trust math.
4. Conversion timing: how long do you want the pure-authority runway before adding (a) Deeper brand attribution, (b) a find-a-therapist bridge (GPS heritage), or (c) email capture? Recommendation is (a) immediately, (b)/(c) only after the trust layer ships, and never on risk-classed pages.
5. Disclosure posture on the legacy corpus: the Protocol says AI-assisted drafting with human accountability — should the editorial policy page state that explicitly? (Recommended: yes; it's defensible and increasingly expected.)
6. Confirm in-repo: meta robots logic per page type, sitemap lastmod source, Supabase env/key handling, and build behavior on partial fetch — the four VERIFY-IN-REPO items above.

---

## Cursor reconciliation notes (2026-06-11)

| Fable item | Repo/live finding |
|------------|-------------------|
| JSON-LD verify | **Present live** on answer pages |
| Indexation | Answers use `review_status` gate; category/entity hubs always noindex |
| Crisis | Keyword heuristic renders 988 banner on matched pages |
| Rick direction (post-audit) | **Entities → concept nodes; categories → browse** — recorded in Phase 0 plan |

**Implementation plan:** `docs/deeper-phase-0-authority-plan.md`

---

*End of audit. Nothing implemented by Fable. Preserved in-repo 2026-06-11.*
