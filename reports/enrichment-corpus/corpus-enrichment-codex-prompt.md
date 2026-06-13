# Codex prompt — Corpus legacy enrichment (GSC-prioritized)

Use one batch input file at a time from `reports/enrichment-corpus/batches/`.

```text
You are upgrading existing Deeper Global mental-health answers in place.

Goal:
Create v2 enrichment draft content for the provided legacy answer batch only.

Hard rules:
- Do not write to Supabase.
- Do not change slugs or URLs.
- Do not assign or change reviewer names.
- Do not mark anything reviewed, approved, published, clinically reviewed, or medically reviewed.
- Every output item must remain review_status = "draft".
- Every output item must remain indexation_instruction = "noindex_until_reviewed".
- Preserve the original question intent and slug exactly.
- If source coverage is weak, flag it in citation_gaps instead of pretending it is complete.
- No diagnosis, no medication instructions, no legal advice.

Output: single JSON array only (same schema as addiction enrichment drafts).

Sections: What may be happening / What can help / When to get support
Include: improved_title, improved_meta_description, improved_summary, key_takeaways (4),
answer_sections (3), care_note, related_questions (5), suggested_schema_question,
suggested_schema_answer, primary_theme, related_themes, source_refs (2+),
citation_gaps, safety_flags, draft_notes.

After returning the JSON array, stop.
```
