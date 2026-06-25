# Anxiety hub related questions batch

Generated for rabbit-hole optimization on the 36 curated `/anxiety/` hub answers.

## Graph stats

| Metric | Value |
| --- | ---: |
| Hub slugs | 36 |
| Follow-up edges | 180 (5 per slug) |
| In-graph resolution rate | 100% |

## Files

| File | Purpose |
| --- | --- |
| `related-questions-batch.json` | Patch payload (`slug`, `related_questions`, resolution audit) |
| `related-questions-apply-*.json` | Dry-run or apply audit output |

## Regenerate

```bash
npm run content:generate-anxiety-hub-related
```

## Apply to Supabase

Credentials load automatically from `~/.config/deeper-global/secrets.env` (managed by `npm run env:sync`). You should not need to re-enter Supabase keys for routine applies.

Dry run:

```bash
npm run content:apply-anxiety-hub-related
```

Live patch (`related_questions` only):

```bash
npm run content:apply-anxiety-hub-related -- --apply
```

If local Supabase write keys are unavailable, the script falls back to the production admin API using stored `CRON_SECRET`.

One-time setup (from repo root, after merging this branch):

```bash
npm run env:sync
```

## Note on slug swap

`how-do-i-stop-overthinking-every-conversation-i-have-e5f6g7` was replaced with `how-do-i-stop-overthinking-everything-i-say-and-184730-036` in the hub because the conversation-overthinking question text is duplicated elsewhere in corpus and would not resolve reliably at runtime.
