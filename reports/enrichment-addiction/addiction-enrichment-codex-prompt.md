# Codex prompt — Addiction legacy enrichment

Use this prompt with one batch input file at a time, starting with `reports/enrichment-addiction/batches/batch-01-input.json`.

```text
You are upgrading existing Deeper Global addiction & recovery answers in place.

Goal:
Create v2 enrichment draft content for the provided legacy addiction answer batch only.

Hard rules:
- Do not write to Supabase.
- Do not change app code.
- Do not create redirects.
- Do not change slugs or URLs.
- Do not make indexation decisions.
- Do not publish content.
- Do not assign or change reviewer names.
- Do not mark anything reviewed, approved, published, clinically reviewed, or medically reviewed.
- Every output item must remain review_status = "draft".
- Every output item must remain indexation_instruction = "noindex_until_reviewed".
- Preserve the original question intent and slug exactly.
- If source coverage is weak, flag it in citation_gaps instead of pretending it is complete.

Input:
I will provide a JSON array of existing addiction answers. Each item includes slug, question, category, legacy short_answer/answer, current enriched fields (if any), completeness_score, missing_fields, and crisis_sensitive flags.

Output:
Return a single JSON array only. Do not include Markdown outside the JSON.

For each input item, return:
{
  "question": "original question",
  "slug": "same slug as input",
  "category": "same category as input",
  "review_status": "draft",
  "indexation_instruction": "noindex_until_reviewed",
  "improved_title": "clear, human, search-aligned title",
  "improved_meta_description": "under 160 characters when possible",
  "improved_summary": "2-3 sentence direct answer summary",
  "key_takeaways": ["3-5 concise takeaways"],
  "answer_sections": [
    { "type": "section", "heading": "What may be happening", "body": "short paragraphs" },
    { "type": "section", "heading": "What can help", "body": "short paragraphs" },
    { "type": "section", "heading": "When to get support", "body": "short paragraphs" }
  ],
  "care_note": "calm support note; include urgent/crisis guidance only where relevant",
  "related_questions": ["3-6 natural follow-up questions"],
  "suggested_schema_question": "schema-safe question",
  "suggested_schema_answer": "brief schema-safe answer, non-diagnostic",
  "primary_theme": "Addiction & Recovery or refined theme",
  "related_themes": ["2-5 related themes"],
  "source_refs": [
    {
      "title": "source title",
      "url": "source URL",
      "publisher": "publisher",
      "note": "what this source supports"
    }
  ],
  "citation_gaps": ["list missing/weak source areas, or [] if source support is adequate"],
  "safety_flags": ["crisis-sensitive when appropriate, else none"],
  "draft_notes": "anything a human editor must check before promotion"
}

Writing rules:
- Consumer-facing, calm, plain-English.
- No diagnosis: use may/can/often/for some people.
- Do not provide medication instructions.
- Do not provide legal advice.
- For crisis-sensitive addiction topics (relapse, overdose, withdrawal, detox, pregnancy + use), include appropriate escalation language without making the whole answer alarmist.
- Prefer specific, useful explanation over generic recovery advice.
- Do not imply source_refs are final clinical citations; they are source candidates until reviewed.

After returning the JSON array, stop.
```
