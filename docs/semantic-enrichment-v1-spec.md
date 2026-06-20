# Deeper Semantic Enrichment V1 — Specification

**Status:** Draft for implementation  
**Version:** 1.0  
**Date:** 2026-06-20

---

## 1. Product goal

Upgrade Deeper from a static answer library into a **human-question-centered semantic system**.

People do not arrive with diagnoses. They arrive with questions — often emotional, conversational, and AI-era phrasing. Deeper’s primary semantic object is the **human question**. Conditions, symptoms, emotional states, differential considerations, answers, reviewers, hubs, and referrals are **connected metadata surrounding that question**.

Semantic Enrichment V1 enables:

- Matching conversational and emotional query variants to canonical answers
- Surfacing related concerns without implying diagnosis
- Routing readers toward appropriate next steps (self-education → professional evaluation)
- Feeding public API, on-site search, and AEO/AI citation surfaces with structured semantic context

**Not in scope for V1:** automated diagnosis, symptom checkers, or definitive clinical labeling of users.

---

## 2. Ethical boundaries

### Core principle

**Information → Self-understanding → Professional evaluation → Treatment direction**

**Not:** Question → Diagnosis

### Required language posture

Use:

- possible interpretations
- related concerns
- may overlap with
- worth exploring
- could be connected to
- consider professional evaluation

Avoid:

- diagnosis engine
- you have [condition]
- this means [diagnosis]
- definitive clinical conclusions about the reader

### Field-specific rules

| Field | Rule |
|-------|------|
| `possible_interpretations` | Broad meaning frames; never state the user has a condition |
| `differential_considerations` | Clinical overlap language only; API/docs only unless carefully framed; hidden from default consumer UI |
| `emotional_phrasings` | Humane, non-exploitative; reflect how people actually talk |
| `intended_next_step` | Action orientation without prescribing treatment |
| `safety_disclaimer` | Required on every enrichment object |

### Crisis routing

If enrichment touches self-harm, suicidality, psychosis, or immediate danger themes, `intended_next_step` must be `crisis_support` and existing crisis banners remain primary.

---

## 3. Data model

### Storage decision: **A — Supabase JSONB column (recommended)**

`questions_master` is the source of truth for answers. A dedicated JSONB column keeps enrichment versioned, queryable later, and separate from legacy answer body fields.

**Hybrid for V1 pilot:** Pilot drafts live in `reports/semantic-enrichment/adhd-pilot-v1.json` for human review. After approval, rows are applied to `semantic_enrichment_v1` via a separate promote script (not V1 automatic).

### Object shape: `semantic_enrichment_v1`

```json
{
  "canonical_question": "Why can't I get my life together?",
  "alternate_questions": ["Why do I keep falling behind on everything?"],
  "emotional_phrasings": ["Why can't I get my shit together?"],
  "related_symptoms": ["procrastination", "overwhelm"],
  "possible_interpretations": ["executive dysfunction", "burnout"],
  "differential_considerations": ["ADHD", "depression"],
  "user_situations": ["adult struggling with daily tasks"],
  "ai_prompt_variants": ["adult ADHD symptoms checklist"],
  "related_entities": ["executive-function", "adhd"],
  "primary_hub": "/adhd/",
  "secondary_hubs": ["/modalities/"],
  "reviewer_id": null,
  "intended_next_step": "professional_evaluation",
  "safety_disclaimer": "This information supports educational self-understanding only...",
  "enrichment_status": "ai_generated",
  "enrichment_updated_at": "2026-06-20T00:00:00.000Z"
}
```

---

## 4. Field definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `canonical_question` | string | Yes | Primary human question in natural language |
| `alternate_questions` | string[] | No | Paraphrased question variants |
| `emotional_phrasings` | string[] | No | How people emotionally express the question |
| `related_symptoms` | string[] | No | Experiential signals (not diagnostic labels for the user) |
| `possible_interpretations` | string[] | No | Broad meaning frames worth exploring |
| `differential_considerations` | string[] | No | Conditions/topics that may overlap; careful clinical language |
| `user_situations` | string[] | No | Life contexts where this question appears |
| `ai_prompt_variants` | string[] | No | AI-era conversational query forms |
| `related_entities` | string[] | No | Entity/theme slugs for graph linking |
| `primary_hub` | string | No | Main hub path (e.g. `/adhd/`) |
| `secondary_hubs` | string[] | No | Additional hub paths |
| `reviewer_id` | string \| null | No | Reviewer slug when clinically reviewed |
| `intended_next_step` | enum | Yes | Recommended reader orientation |
| `safety_disclaimer` | string | Yes | Non-diagnostic boundary statement |
| `enrichment_status` | enum | Yes | Workflow status |
| `enrichment_updated_at` | string (ISO) | Yes | Last enrichment update timestamp |

### `intended_next_step` enum

- `self_education`
- `self_reflection`
- `professional_evaluation`
- `therapy`
- `crisis_support`
- `medical_consult`
- `relationship_support`
- `no_specific_next_step`

### `enrichment_status` enum

- `not_started`
- `ai_generated`
- `human_reviewed`
- `clinically_reviewed`
- `needs_review`

---

## 5. Example enriched answer

**Slug:** `how-do-i-know-if-i-have-adhd-as-an-adult`

```json
{
  "canonical_question": "How do I know if I have ADHD as an adult?",
  "alternate_questions": [
    "Could my lifelong focus problems actually be ADHD?",
    "What are signs of undiagnosed ADHD in adults?"
  ],
  "emotional_phrasings": [
    "Why am I still this scattered at my age?",
    "Is something wrong with me or is this ADHD?"
  ],
  "related_symptoms": [
    "chronic procrastination",
    "time blindness",
    "emotional overwhelm after small setbacks"
  ],
  "possible_interpretations": [
    "executive dysfunction patterns",
    "longstanding attention regulation difficulties",
    "stress and burnout amplifying focus problems"
  ],
  "differential_considerations": [
    "ADHD",
    "anxiety disorders",
    "depression",
    "sleep deprivation",
    "trauma-related stress"
  ],
  "user_situations": [
    "adult noticing lifelong patterns after a friend's diagnosis",
    "professional struggling despite high effort"
  ],
  "ai_prompt_variants": [
    "adult ADHD symptoms vs anxiety",
    "do I have ADHD or am I just lazy"
  ],
  "related_entities": ["adhd", "executive-function", "neurodivergence"],
  "primary_hub": "/adhd/",
  "secondary_hubs": [],
  "reviewer_id": null,
  "intended_next_step": "professional_evaluation",
  "safety_disclaimer": "This information supports educational self-understanding only. It does not diagnose ADHD or any other condition and is not a substitute for evaluation by a qualified clinician.",
  "enrichment_status": "ai_generated",
  "enrichment_updated_at": "2026-06-20T12:00:00.000Z"
}
```

---

## 6. API exposure plan

### Endpoint: `GET /api/v1/answers/{slug}`

- Include `semantic_enrichment_v1` **only when present and valid**
- OpenAPI schema documents all fields with explicit non-diagnosis boundary
- `differential_considerations` included in API for semantic/AEO consumers; documented as educational overlap, not user diagnosis

### Endpoint: `GET /api/v1/openapi.json`

- Add `SemanticEnrichmentV1` component schema
- Add field to `Answer` schema (nullable, optional)

### List endpoint

- V1: no enrichment on list responses (performance); search uses enrichment internally when column populated

---

## 7. UI exposure plan

### Component: `QuestionContextPanel`

**Title:** “Related ways people ask this question”

**Show (consumer-safe subset):**

- Alternate questions
- Emotional phrasings (labeled sensitively)
- Related concerns (`possible_interpretations` reframed as “related concerns”)
- Next step (`intended_next_step` in plain language)

**Hide from default UI:**

- `differential_considerations` (API/AEO only in V1)
- Raw `ai_prompt_variants` (internal search weighting)

**Placement:** Answer page sidebar, below trust panel, only when enrichment exists.

**Copy patterns:**

- “People often ask this question in different ways.”
- “Related concerns may include…”
- “A next step to consider…”

---

## 8. Search / AEO use cases

### On-site search (`/answers/` index)

Weighting:

| Weight | Fields |
|--------|--------|
| High | `canonical_question`, title, original question |
| Medium | `alternate_questions`, `emotional_phrasings`, `user_situations` |
| Lower | `related_entities`, `possible_interpretations`, `related_symptoms` |

### API / llms surfaces

- Full enrichment available to licensed API consumers
- Supports AI citation matching on conversational queries
- `ai_prompt_variants` improves retrieval for LLM-era phrasing

---

## 9. Batch enrichment plan

### V1 pilot (25 ADHD answers)

**Selection criteria:**

- High intent
- AI-query likely phrasing
- Diagnostic/testing relevance
- Executive dysfunction relevance
- Anxiety overlap
- Women / late diagnosis relevance

**Output:** `reports/semantic-enrichment/adhd-pilot-v1.json`

**Workflow:**

1. `node scripts/generate-semantic-enrichment-pilot.mjs`
2. Human editorial review
3. Clinician review for `clinically_reviewed` status
4. Separate promote script applies approved rows to Supabase (post-V1)

### Full corpus (post-V1)

- Batch by hub (ADHD → AI mental health → modalities → topical)
- Max 50–100 per batch with QA gates
- No bulk auto-write without review approval

---

## 10. Acceptance criteria

- [ ] Spec and governance docs exist
- [ ] TypeScript model + validation utility exists
- [ ] Supabase SQL migration file exists (non-destructive)
- [ ] Pilot script generates 25-answer JSON without DB write
- [ ] API + OpenAPI expose `semantic_enrichment_v1` when present
- [ ] `QuestionContextPanel` renders consumer-safe subset
- [ ] Search index includes enrichment fields when available
- [ ] Build passes
- [ ] No bulk production enrichment
- [ ] No diagnostic overclaiming in generated copy

---

## 11. Risks

| Risk | Mitigation |
|------|------------|
| Enrichment implies diagnosis | Validation + forbidden phrase scan + governance |
| Emotional phrasing feels exploitative | Editorial review; humane tone guidelines |
| Differential fields alarm readers | Omit from default UI; careful API documentation |
| AI-generated errors at scale | Pilot-first; status workflow; clinician review gate |
| Search keyword stuffing | Weighted index only; no visible dumping |
| Schema drift | Versioned object key `semantic_enrichment_v1` |

---

## 12. Future V2 ideas

- Entity graph edges with confidence scores
- Cross-answer semantic clustering and hub auto-suggestions
- GSC query ingestion → enrichment gap detection loop
- Multilingual emotional phrasings
- Clinician review UI with diff workflow
- JSONB GIN indexes on high-traffic semantic fields
- Semantic similarity for related-question ranking
- User-facing “explore related concerns” graph (non-diagnostic)
- Integration with public API analytics for AI citation optimization

---

## Guiding sentence

**People arrive with confusion and uncertainty. Deeper should help them leave with clarity, hope, and a potential solution.**
