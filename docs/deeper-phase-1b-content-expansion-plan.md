# Deeper Phase 1B content expansion plan

**Goal:** grow Deeper Global from ~1,000 to ~2,000 mental health questions without weakening Phase 1A trust posture, taxonomy discipline, or indexation safety.

## Strategic frame

Deeper Global can support the broader Deeper Websites strategy, but it should not behave like a link farm or thin referral directory. Its primary job is to become a large, trusted, structured repository of vetted mental health questions. Practitioner/referral value should emerge from authority, topical coverage, and useful bridges, not from bulk reciprocal linking.

Backlinks between Deeper Global and therapist/practitioner sites may help discovery, but the durable asset is the corpus: clean questions, stable URLs, honest trust signals, and a taxonomy that can become a knowledge graph over time.

## Current baseline

From `docs/deeper-authority-data-audit.md`:

- Total answers: 1,005.
- Likely v2 answers: 6.
- Indexable by current `shouldIndexQuestion` logic: 6.
- `review_status`: 999 `draft`, 6 `reviewed`.
- `source_refs` coverage: 6 answers.
- `reviewed_by` coverage: 6 answers.
- Crisis-sensitive by current heuristic: 11.
- Sitemap: 1,031 URLs after Phase 1A.

Phase 1A makes the site safer to scale because draft answers can render with neutral trust language while remaining `noindex,follow`.

## Expansion principle

Add content in two different states:

1. **Corpus expansion:** new answers may be created as `review_status = draft`. These can exist on the site but remain `noindex,follow`.
2. **Authority expansion:** only source-backed, reviewed, v2-quality answers should move to `reviewed`, `approved`, or `published`.

The milestone should not be “2,000 URLs exist.” The milestone should be “2,000 clean, categorized questions exist, with a growing reviewed/indexable subset.”

## Division of labor

| Lane | Owner | Responsibilities |
| --- | --- | --- |
| Candidate generation | Codex | Generate question candidates, candidate slugs, category suggestions, source candidates, duplicate notes, and safety flags. |
| Repo/tooling/QA | Cursor | Maintain scripts, audits, docs, build checks, sitemap/llms checks, trust rendering, preview/production QA, and Git-governed deploys. |
| Editorial judgment | Human | Approve topic clusters, decide category fit, resolve duplicates, verify sources, and decide when a row can become reviewed/indexable. |

Do not ask Codex to directly mutate Supabase or flip review statuses. Use it for candidate generation and structured drafts.

## Batch workflow

1. **Choose a theme batch.** Start with 100 candidates across 5-8 existing categories.
2. **Generate candidates.** Codex produces JSON only; no database writes.
3. **Run candidate audit.**

   ```bash
   npm run content:audit-candidates -- reports/phase-1b/candidates.json
   ```

4. **Human review.** Remove duplicates, merge overlap, correct categories, and mark crisis-sensitive items for extra care.
5. **Draft answers.** Produce v2 drafts with source candidates, but keep `review_status = draft`.
6. **Insert/stage only after approval.** Supabase mutation is a separate explicit step, not part of candidate generation.
7. **Promote selectively.** Only answers with source refs, editorial review, and safe clinical posture should become indexable.
8. **Run QA after each batch.** `npm run audit:authority`, `npm run build`, `npm run check`, sitemap count, llms structure, sampled answer QA.

## Category guardrails

Every new `category` value creates category and entity hub pressure. For Phase 1B, prefer existing labels:

- Addiction & Recovery
- Anxiety & Stress
- Communication & Conflict
- Depression
- Family & Parenting
- General Mental Health
- Grief & Loss
- Identity & Self-Worth
- Loneliness & Isolation
- Parenting
- Relationships & Communication
- Relationships & Divorce
- Teen-Specific Questions
- Teens & Identity
- Therapy & Mental Health
- Therapy Navigation
- Trauma & Grief
- Work & Burnout
- Work & Life Balance
- Work, Stress & Burnout

Avoid creating new category labels during the first 100-question pilot unless there is a strong editorial reason.

## Slug guardrails

- Use stable, readable slugs.
- Do not use numeric/hash suffixes unless needed for collision resolution.
- Do not rename existing slugs without a redirect plan.
- Avoid generating many variants of the current high-duplication patterns:
  - `why-do-i-feel-like`
  - `how-do-i-deal-with-feeling-like`
  - `how-do-i-stop-feeling-like`
  - `what-should-i-do-if`
  - `what-if`
  - `how-do-i-know-if`

## Trust and indexation guardrails

- New rows default to `review_status = draft`.
- Draft pages must not show invented reviewers or sources.
- Source refs should be real source candidates, not decorative citations.
- Use “reviewed” only when a real editorial review pass happened.
- Do not say “medically reviewed” unless a qualified clinician reviewed the answer.
- Crisis-sensitive content gets extra review before any indexation.
- Keep category/entity hubs `noindex,follow`.
- Keep `llms.txt` structure intact.

## Referral and backlink posture

Deeper Websites links should remain contextual and sparse:

- Use practitioner callouts only where they are genuinely relevant.
- Do not add commercial bridges to every answer.
- Avoid reciprocal-link footprints that look mechanical.
- Prioritize user usefulness: a practitioner link should answer “why is this relevant here?”

The near-term referral strategy should be attribution and trust-building, not aggressive monetization.

## Exit criteria for the 100-question pilot

- Candidate audit has zero BLOCK items.
- Category warnings are manually resolved.
- Crisis-sensitive candidates are identified.
- No exact duplicate slugs or questions.
- Build/check passes after staging.
- Sitemap count increases only by the intended number of answer URLs.
- Draft pages remain `noindex,follow`.
- `llms.txt` structure remains stable.
- Reviewed/indexable subset is promoted only after source and review criteria are met.
