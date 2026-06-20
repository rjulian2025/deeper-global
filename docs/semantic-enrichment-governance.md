# Semantic Enrichment Governance

**Version:** 1.0  
**Applies to:** `semantic_enrichment_v1` and all enrichment generation workflows

---

## North star

People arrive with confusion and uncertainty. Deeper should help them leave with **clarity, hope, and a potential solution**.

The **human question** is Deeper’s primary semantic object. Everything else — conditions, symptoms, hubs, reviewers, referrals — is connected metadata around that question.

---

## Core rules

### 1. The human question is primary

- `canonical_question` must reflect how a person actually asks, not clinical jargon alone
- Alternate and emotional phrasings exist to honor real speech, not to manipulate SEO

### 2. No diagnosis of the reader

Deeper does **not** tell users what they have.

| Do | Don't |
|----|-------|
| "Related concerns may include…" | "You have ADHD" |
| "May overlap with…" | "This means you are depressed" |
| "Worth exploring with a clinician" | "Diagnosis: anxiety disorder" |

### 3. Possible interpretations are not diagnoses

`possible_interpretations` frame **meaning**, not labels for the reader. They describe patterns people explore, not conclusions.

### 4. Differential considerations require careful wording

- Use only for educational overlap context
- Prefer "may overlap with," "could be connected to," "worth discussing with a professional"
- Default consumer UI omits this field in V1
- API consumers must respect `clinical_boundary` and `safety_disclaimer`

### 5. Clinician review before `clinically_reviewed`

Status progression:

```
not_started → ai_generated → needs_review → human_reviewed → clinically_reviewed
```

- `ai_generated` enrichment is never presented as clinically verified
- `clinically_reviewed` requires a named `reviewer_id` and documented review

### 6. AI-generated enrichment labeling

All machine-generated enrichment must ship as `ai_generated` or `needs_review` until a human approves.

### 7. Emotional phrasing must be humane

- Reflect real distress without sensationalism
- No shame baiting, no clickbait framing of suffering
- Profanity in emotional phrasings is allowed only when it mirrors common search speech and serves matching — not shock value

### 8. Crisis-related queries

If content involves suicide, self-harm, psychosis, violence, or immediate danger:

- Set `intended_next_step` to `crisis_support`
- Ensure answer page crisis banner remains visible
- Do not route crisis queries to generic self-help only

---

## Review checklist (human)

Before promoting enrichment to production:

- [ ] `canonical_question` is clear and human
- [ ] No forbidden diagnostic language (see validation helper)
- [ ] `safety_disclaimer` present and accurate
- [ ] `intended_next_step` matches content severity
- [ ] `differential_considerations` use overlap language only
- [ ] Emotional phrasings are respectful
- [ ] Hub links are correct
- [ ] Status reflects review level honestly

---

## Forbidden language (automated scan)

Flag for manual review if enrichment contains:

- "you have"
- "you are diagnosed"
- "this means you"
- "diagnosis engine"
- "definitely"
- "confirmed [condition]"

---

## Roles

| Role | Responsibility |
|------|----------------|
| Content ops | Pilot selection, batch QA, status workflow |
| Editorial | Human review of phrasing and tone |
| Clinical reviewer | `clinically_reviewed` approval for YMYL overlap fields |
| Engineering | Validation, API exposure, no auto-promote without approval |

---

## Promotion policy

- Pilot and batch outputs go to `reports/semantic-enrichment/` first
- **No automatic production DB writes** without explicit approve/promote command
- Bulk corpus enrichment requires governance sign-off per batch
