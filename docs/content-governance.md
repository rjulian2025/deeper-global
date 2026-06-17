# Answer content governance

Mental-health answers follow a single copy contract, automated QA, and a gated promote step before live fields change.

## Contract

Prompt: `deeper-health-copywriter-v1` (`scripts/lib/answer-rewrite-system-prompt.mjs`)

Staging fields (7):

| Field | Purpose |
|-------|---------|
| `staging_primary_term` | SEO/AEO primary term |
| `staging_canonical_answer` | Schema / featured snippet answer |
| `staging_lede` | Page summary (italic lede on answer page) |
| `staging_key_takeaways` | Exactly 5 bullets |
| `staging_what_you_might_be_experiencing` | Body section 1 |
| `staging_what_can_help` | Body section 2 |
| `staging_when_to_reach_out` | Body section 3 |

Visual rules: `DESIGN.md`

## Pipeline

```
Rewrite → QA → Promote (dry-run) → Promote (--apply) → Publish
```

| Step | Command | Notes |
|------|---------|-------|
| Rewrite | `npm run content:rewrite-answers-claude` | Writes staging fields only |
| Full batch | `npm run content:rewrite-answers-claude:all` | `--apply --all` |
| QA | `npm run content:qa-answer-rewrite` | FAIL blocks promote; report in `reports/answer-rewrite/` |
| Promote dry-run | `npm run content:promote-answer-rewrite -- --all` | No DB writes; JSON report in `promote-updates/` |
| Promote apply | `npm run content:promote-answer-rewrite -- --apply --all --allow-warn` | Copies staging → live columns |
| QA + apply | `npm run content:promote-answer-rewrite:safe` | Runs QA then promote with `--apply --allow-warn` |

Single slug:

```bash
npm run content:promote-answer-rewrite -- --slug my-answer-slug
npm run content:promote-answer-rewrite -- --apply --slug my-answer-slug
```

## Promote mapping

| Staging | Live |
|---------|------|
| `staging_lede` | `short_answer`, `improved_summary` |
| `staging_canonical_answer` | `suggested_schema_answer` |
| `staging_key_takeaways` | `key_takeaways` |
| Body sections | `answer_sections` |
| `staging_primary_term` | `primary_theme` |
| `content_prompt_version` | `staging_rewrite_prompt_version` |

## Site display

Answer pages prefer staging when present (`src/lib/content.ts`):

- `getDisplayLede`
- `getDisplayKeyTakeaways`
- `getDisplayAnswerHtml`

After promote, live fields and staging align; preview and production stay consistent.

## QA scores

- **PASS** — eligible for promote
- **WARN** — promote only with `--allow-warn`
- **FAIL** — blocked (common: em-dash in canonical/lede, word-count drift)

## Legacy paths

`content:apply-enrichment` and `content:promote-enrichment` seed legacy drafts only. New or updated answers must use rewrite → QA → promote.
