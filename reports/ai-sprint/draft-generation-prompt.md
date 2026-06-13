# Codex prompt — Deeper AI concerns sprint draft generation

Use this prompt with one batch file at a time, starting with `reports/ai-sprint/draft-batches/batch-01.json`.

```text
You are drafting Deeper Global answer content for the AI mental health concerns sprint.

Goal:
Create v2 draft answer content for the provided candidate JSON batch only.

Hard rules:
- Do not write to Supabase.
- Do not change app code.
- Do not create redirects.
- Do not change URLs.
- Do not make indexation decisions.
- Do not publish content.
- Do not mark anything reviewed, approved, published, clinically reviewed, or medically reviewed.
- Every output item must remain review_status = "draft".
- Every output item must remain indexation_instruction = "noindex_until_reviewed".
- Do not invent reviewer names.
- Do not invent citations beyond the provided source candidates.
- If source coverage is weak, flag it in citation_gaps instead of pretending it is complete.

AI-specific safety rules:
- Do not present "AI psychosis" as a formal diagnosis.
- Do not claim AI causes psychosis.
- Use language like "may amplify," "may reinforce," "may sustain," or "can intensify for some people."
- For delusions, hallucinations, mania, suicidal thoughts, violence, not sleeping, or acting on chatbot instructions, include urgent real-world support guidance.
- Do not validate delusional beliefs or suggest ways to test them with AI.
- For minors, abuse, deepfakes, or crisis-sensitive items, include careful support and safety language without giving legal or medical instructions.

Input:
I will provide a JSON array of draft-eligible candidates. Each candidate includes question, slug, category, intent, safety_flags, duplicate_risk, priority_pair, source_refs, and notes.

Output:
Return a single JSON array only. Do not include Markdown outside the JSON.

For each candidate, return:
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
  "care_note": "calm support note; include urgent/crisis guidance where relevant",
  "related_questions": ["3-6 natural follow-up questions"],
  "suggested_schema_question": "schema-safe question",
  "suggested_schema_answer": "brief schema-safe answer, non-diagnostic",
  "primary_theme": "category or refined theme",
  "related_themes": ["2-5 related themes"],
  "source_refs": [
    {
      "title": "source title from input",
      "url": "source URL",
      "publisher": "publisher",
      "note": "what this source supports"
    }
  ],
  "citation_gaps": ["list missing/weak source areas, or [] if source support is adequate"],
  "safety_flags": ["same approved flags as input unless a stricter approved flag is clearly needed"],
  "draft_notes": "anything a human editor must check before insertion or review"
}

Writing rules:
- Consumer-facing, calm, plain-English.
- No diagnosis: use may/can/often/for some people.
- Do not provide medication instructions.
- Do not provide legal advice.
- Preserve the user's real question intent.
- Prefer specific, useful explanation over generic mental health advice.
- Do not imply source_refs are final clinical citations; they are source candidates until reviewed.

After returning the JSON array, stop.
```
