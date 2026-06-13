# Codex prompt — Deeper Phase 1B candidate generation

Use this prompt to start the Codex generation lane for the first 100-question pilot. Codex should produce candidate data only. It should not write to Supabase, change code, push, deploy, or flip indexation.

```text
You are helping expand Deeper Global, a structured mental health question repository.

Goal:
Generate a 100-question Phase 1B candidate batch for Deeper Global. This is candidate generation only. Do not write to Supabase, do not change app code, do not create redirects, do not change URLs, and do not make indexation decisions.

Strategic context:
- Deeper Global aims to become the world's largest repository of vetted mental health questions.
- Phase 1A shipped an honest trust layer: source refs and reviewer info render only when data exists.
- New content must preserve trust safety. Draft content should remain draft/noindex until reviewed.
- Entities will eventually become canonical concept nodes; categories remain browse/navigation indexes.
- Do not create taxonomy sprawl.

Use only these Phase 1B pilot categories unless a candidate truly cannot fit:
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

Generation requirements:
1. Produce exactly 100 candidates.
2. Prioritize real, natural-language questions people ask before, during, or after mental health care.
3. Avoid near-duplicates of obvious existing patterns:
   - why-do-i-feel-like
   - how-do-i-deal-with-feeling-like
   - how-do-i-stop-feeling-like
   - what-should-i-do-if
   - what-if
   - how-do-i-know-if
4. Use clean, semantic slugs with no numeric/hash suffixes unless necessary.
5. Do not over-diagnose in the question phrasing.
6. Flag crisis-sensitive or YMYL-sensitive questions.
7. Suggest 2-3 reputable source candidates per question when possible:
   - NIMH
   - SAMHSA
   - CDC
   - APA
   - 988 Lifeline
   - IOCDF
   - other reputable public health, academic, or clinical organizations
8. Do not invent named reviewers.
9. Do not claim medical review.
10. Keep all candidates as draft candidates, not publish-ready reviewed content.

Output format:
Return a single JSON array only. Do not include Markdown outside the JSON.

Each object must have:
{
  "question": "Natural-language question",
  "slug": "clean-semantic-slug",
  "category": "One allowed Phase 1B category",
  "intent": "short description of the user's likely intent",
  "safety_flags": ["none"] or ["crisis-sensitive", "medication", "self-harm", "abuse", "diagnosis-risk", "minor"],
  "duplicate_risk": "low" | "medium" | "high",
  "why_this_adds_coverage": "1-2 sentences explaining distinct coverage value",
  "source_refs": [
    {
      "title": "Source title",
      "url": "https://...",
      "publisher": "Publisher",
      "note": "What this source would support"
    }
  ],
  "notes": "Any editorial caution or category rationale"
}

Quality bar:
- A user should recognize their real concern in the question.
- The batch should broaden coverage, not create 100 variants of existing pages.
- Prefer specific care-navigation and lived-experience questions over generic encyclopedia topics.
- If a question is high-risk, flag it. Do not avoid all high-risk content, but do not make it seem ready for indexation.

After generating the JSON, stop.
```

## After Codex returns candidates

Save the JSON to:

```bash
reports/phase-1b/candidates.json
```

Then run:

```bash
npm run content:audit-candidates -- reports/phase-1b/candidates.json
```

Review `reports/phase-1b/content-candidates-audit.md` before drafting or inserting anything.
