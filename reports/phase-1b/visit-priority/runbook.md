# Visit-priority content runbook

Goal: **net +25 new Q&A pairs** in Supabase, prioritized by user interest (first-party visits + GSC momentum), plus **rewrite 4 existing high-impression pages**.

## Data basis

- `map_signals` answer views (Jun 14–18, 2026): identity/self-worth, loneliness, relationships, work stress
- GSC 28-day plan (`reports/gsc-weekly/content-plan-2026-06-20.json`): impression momentum on existing slugs
- Phase 1B candidate audit: 67 undrafted candidates in batches 04–10

## Artifacts

| File | Purpose |
| --- | --- |
| `batch-25-candidates.json` | Ranked 25 candidates with visit_priority_score |
| `batch-25-summary.md` | Human-readable priority table |
| `batch-25-drafts.json` | Generated v2 draft answers (publish input) |
| `../../gsc-weekly/rewrite-batch-priority-4.json` | Top 4 existing pages for Claude rewrite |

## Lane A: 25 new pairs (net corpus increase)

```bash
# 1. Regenerate drafts (if candidates change)
node scripts/generate-visit-priority-batch-25-drafts.mjs

# 2. Dry-run publish (checks slug collisions + row shape)
npm run content:publish-visit-priority-25

# 3. Insert into questions_master (requires SUPABASE_SERVICE_ROLE_KEY)
npm run content:publish-visit-priority-25 -- --apply

# 4. Optional: Claude rewrite pass on new rows before human review
npm run content:rewrite-answers-claude -- --apply --slugs-file reports/phase-1b/visit-priority/batch-25-slugs.json
```

Expected outcome: `questions_master` count increases by **25**. All rows remain `review_status = reviewed` per publish script defaults; human editor should downgrade to `draft` if not ready for indexation.

## Lane B: Rewrite 4 existing pages (GSC harvest)

Run in parallel with Lane A:

```bash
npm run content:rewrite-answers-claude -- --apply --slugs-file reports/gsc-weekly/rewrite-batch-priority-4.json
npm run content:qa-answer-rewrite-batch -- --slugs-file reports/gsc-weekly/rewrite-batch-priority-4.json
npm run content:promote-answer-rewrite -- --dry-run --slugs-file reports/gsc-weekly/rewrite-batch-priority-4.json
# After human review:
npm run content:promote-answer-rewrite -- --apply --slugs-file reports/gsc-weekly/rewrite-batch-priority-4.json
```

Priority slugs:

1. `why-do-i-feel-guilty-for-taking-time-off-189668-007` (56 impressions, +600% momentum)
2. `how-do-i-cope-with-the-emotional-pain-of-divorce` (18 impressions)
3. `why-do-i-feel-lonely-in-my-relationship-191368-010` (7 impressions, aligns with visit themes)
4. `how-do-i-apologize-effectively-when-ive-hurt-someone` (7 impressions)

## Prerequisites

```bash
npm run env:sync   # once per machine
npm run env:check  # ready_for_write + ANTHROPIC_API_KEY for rewrites
```

## Safety review queue

Flagged items in the 25-pair batch requiring human review before indexation promotion:

- Crisis/self-harm: `what-to-do-if-i-have-no-one-to-talk-to`, `when-to-get-help-for-grief`, `what-to-do-if-my-teen-says-they-hate-themselves`, `support-someone-grieving-a-traumatic-death`
- Abuse: `why-do-i-miss-someone-who-treated-me-badly`, `partner-refuses-to-talk-about-problems`
- Minor: teen identity/social media/confidence items
