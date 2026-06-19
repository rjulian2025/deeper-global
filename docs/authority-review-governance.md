# Authority Review Governance — Follow-Up Spec

Status: **Planning note only — not implemented.**  
Audience: Deeper product, editorial, and client review (Alex Crenshaw / Peachtree Psychology).

This document captures governance rules to apply **before production promotion** of the Clinical Authority Network pilot. It does not change current behavior until explicitly implemented.

---

## Alex Crenshaw positioning

- Position Dr. Alex Crenshaw, PhD specifically as **Clinical Authority for Adult ADHD Testing & Psychological Evaluation** — not as the default owner of all ADHD content on Deeper.
- His authority profile, ADHD hub feature block, and Peachtree referral paths should emphasize **adult testing, diagnostic clarity, and evaluation pathways** (Roswell in-person, self-pay).
- Do not imply that Alex is the prescriber, pediatric specialist, or general ADHD therapist for every ADHD topic.

---

## Reviewer assignment rules

- **Do not assign Alex as reviewer to every ADHD answer by default.**
- ADHD answers should support multiple authority / reviewer types aligned to content intent:

| Subdomain | Example reviewer focus |
|-----------|------------------------|
| Testing / evaluation | Psychologist conducting formal assessment (e.g., Alex) |
| Therapy / skills | Licensed therapist, CBT/ACT/DBT clinician |
| ADHD in women | Clinician with women's ADHD / late diagnosis expertise |
| Executive function | Coach or clinician focused on EF strategies |
| Teen / child ADHD | Developmental or pediatric specialist |
| Medication / prescriber | Psychiatrist or prescribing clinician |

- Each answer should map to **one primary reviewer type** at assignment time, even if the final byline is editorial-only.

---

## Answer review states (target model)

Every answer should eventually expose **one of three states**:

1. **Clinically reviewed by named authority** — Named clinician with credentials; links to authority profile where applicable.
2. **Pending clinical review** — Published or staged content awaiting assigned reviewer sign-off.
3. **Editorially reviewed only** — Meets Deeper editorial standards; no named clinical reviewer attributed.

Implementation should avoid mixing states (e.g., do not show “clinically reviewed” without a named reviewer).

---

## Peachtree and future authorities

- Future Peachtree ADHD specialists (therapists, other evaluators) may be added as **separate authority profiles or reviewers** — not merged into Alex's profile.
- Cross-links from Peachtree therapist pages remain supporting-only unless a full authority profile is approved.

---

## ADHD hub architecture (future)

- The ADHD hub should eventually support **multiple featured authorities by subdomain** (testing, therapy, women, medication, etc.) — not one broad “ADHD owner.”
- Hub modules should rotate or segment by intent (e.g., “Seeking evaluation” vs “Managing daily life”) with matching authority CTAs.

---

## Pre-production audit required

**Current Alex reviewed-answer assignments must be audited before production merge.**

Audit checklist:

- [ ] Confirm each slug in `reviewedContentGroups` (Alex data) is appropriate for **testing/evaluation** scope — not general coping, medication, or pediatric content unless explicitly approved.
- [ ] Confirm no answer implies online testing, Marietta location, autism assessment, insurance billing, or guaranteed diagnosis/referral.
- [ ] Confirm duplicate slugs across groups (e.g., testing + ADHD overlap) are intentional for UX, not accidental over-attribution.
- [ ] Confirm trust layer / `reviewed_by` fields in Supabase match registry assignments.
- [ ] Confirm ADHD hub block copy does not position Alex as reviewer for all hub answers.
- [ ] Client sign-off from Alex (and Peachtree leadership as needed) on reviewed-answer list and profile copy.

---

## Related files (pilot)

| Area | Path |
|------|------|
| Alex profile data | `src/data/authorities/alex-crenshaw-phd.ts` |
| Authority types / registry | `src/lib/authorities.ts` |
| Trust / answer attribution | `src/lib/trust.ts` |
| ADHD hub block | `src/pages/adhd.astro` |
| Peachtree cross-links | Peachtree repo `feature/alex-authority-network` (hold until client approval) |

---

## Implementation trigger

Do **not** implement these governance rules in code or content until:

1. Client review of Alex authority profile + reviewed-answer list is complete.
2. Product approves the three-state review model and reviewer taxonomy.
3. A separate implementation task is opened (registry, Supabase fields, hub multi-authority UI).
