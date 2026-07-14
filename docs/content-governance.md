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
Rewrite → Sanitize → Repair → QA (full) → Promote (dry-run) → Promote (--apply) → Deploy → Git commit
```

| Step | Command | Notes |
|------|---------|-------|
| Rewrite | `npm run content:rewrite-answers-claude` | Writes staging fields only |
| Full batch | `npm run content:rewrite-answers-claude:all` | `--apply --all` |
| Reset failed slug | `npm run content:reset-staging-rewrite -- --slug <slug> --apply` | Clears staging so rewrite can retry |
| Em-dash sanitize | `npm run content:sanitize-staging-emdash -- --apply` | Fixes em-dash in canonical/lede (run after batches that predated in-process sanitizer) |
| Repair blocked rows | `npm run content:repair-staging-rewrite -- --apply` | Lede sync, canonical trim, YMYL append, word-count trim |
| QA (latest CSV) | `npm run content:qa-answer-rewrite` | Batch-scoped; FAIL blocks promote |
| QA (full corpus) | `npm run content:qa-answer-rewrite:all` | All staged rows; JSON report in `reports/answer-rewrite/qa-full-*.json` |
| Promote dry-run | `npm run content:promote-answer-rewrite -- --all --allow-warn` | No DB writes; JSON report in `promote-updates/` |
| Promote apply | `npm run content:promote-answer-rewrite -- --apply --all --allow-warn` | Copies staging → live columns |
| GSC weekly plan | `npm run content:gsc-weekly-plan` | Writes `reports/gsc-weekly/content-plan-{date}.*` and `rewrite-batch.json` |
| GSC-targeted rewrite | `npm run content:rewrite-answers-claude -- --apply --slugs-file reports/gsc-weekly/rewrite-batch.json` | Rewrites only approved/GSC-prioritized slugs |
| Deploy | `npm run deploy:prod` | After promote apply; push to `production/astro` also auto-deploys via GitHub Actions |
| Post-rewrite watcher | `./scripts/post-rewrite-pipeline.sh` | Waits for rewrite, runs QA + promote dry-run |

Single slug:

```bash
npm run content:promote-answer-rewrite -- --slug my-answer-slug
npm run content:promote-answer-rewrite -- --apply --slug my-answer-slug --allow-warn
npm run content:repair-staging-rewrite -- --apply --slug my-answer-slug
```

## Batch completion checklist

Run after every rewrite batch (especially when adding new corpus slices):

1. **Rewrite finishes** — confirm `pending_records: 0`, retry failures via reset + rewrite
2. **Sanitize** — `npm run content:sanitize-staging-emdash -- --apply` if em-dash FAILs appear
3. **Repair** — `npm run content:repair-staging-rewrite -- --apply` for remaining QA FAILs
4. **QA full** — `npm run content:qa-answer-rewrite:all` (target: 0 FAIL before promote)
5. **Promote dry-run** — review `promotable` vs `blocked` counts
6. **Promote apply** — `--apply --all --allow-warn`
7. **Deploy** — `npm run deploy:prod` (or merge to `production/astro` and let CI deploy)
8. **Git commit** — commit tooling changes (see below)

## Git commit protocol

**Always commit** when a batch changes governance tooling or docs. This keeps multi-batch work reproducible.

### Commit these (source)

- `scripts/sanitize-staging-emdash.mjs`
- `scripts/repair-staging-rewrite.mjs`
- `scripts/reset-staging-rewrite.mjs`
- `scripts/qa-answer-rewrite-batch.mjs`
- `scripts/promote-answer-rewrite.mjs`
- `scripts/lib/answer-rewrite-qa.mjs`
- `scripts/lib/answer-rewrite-utils.mjs`
- `scripts/post-rewrite-pipeline.sh`
- `package.json` (npm script entries)
- `docs/content-governance.md`
- `.cursor/rules/content-governance.mdc`

### Do not commit (artifacts)

- `reports/answer-rewrite/*.csv`
- `reports/answer-rewrite/*.log`
- `reports/answer-rewrite/qa-full-*.json`
- `reports/answer-rewrite/promote-updates/`
- `reports/answer-rewrite/blocked-slugs.json`

### Commit message pattern

```
Add batch repair tooling and document post-promote git protocol.

Captures sanitize/repair/reset scripts and full-corpus QA so future
batches follow the same rewrite → repair → promote workflow.
```

If only docs changed after a batch with no script edits:

```
Document batch N promote completion in content governance protocol.
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

## Reviewer assignment (content-type axis)

Hub category and reviewer assignment are **independent**. A page can live in Spirituality & Meaning sub-tags while retaining a clinical reviewer if the content requires clinical expertise.

### Rick Julian (`rick-julian`) — philosophical / meaning content

Assign when the answer is primarily about faith transitions, meaning-making, purpose, identity, or philosophical inquiry **without** a clinical centerpiece. Examples: faith deconstruction, partner or family disclosure about belief change, building a personal practice, midlife questioning, existentialism as a framework, social dynamics after leaving a community.

Display title: **Editorial Reviewer** (not "Clinical Reviewer"). Set `reviewAttributionPrefix: 'Editorially reviewed by'` on the profile in `src/data/reviewers.ts`.

### Clinical reviewers (e.g. Kenneth W. Christian, PhD)

Keep (or assign) when content touches **any** of:

- Anxiety or existential anxiety as a presenting concern
- Trauma (including religious or spiritual trauma as a clinical construct)
- Grief framed as clinical symptom or bereavement process
- Depression-adjacency or hopelessness/despair as primary frame
- Mortality fear as acute presenting distress (death anxiety, hell fear)
- Professional-help triage / differential ("do I need a therapist?")
- Crisis-safety centerpiece (988, self-harm risk, escalation thresholds)

Standard optional therapist mention or 988 footer in `when_to_reach_out` **alone** does not automatically require a clinical reviewer.

### Batch workflow

Before promote: classify each draft `(a)` philosophical/meaning or `(b)` clinical-adjacent; set `reviewed_by` accordingly. Do not bulk-assign Rick Julian to an entire hub category.

## QA scores

- **PASS** — eligible for promote
- **WARN** — promote only with `--allow-warn`
- **FAIL** — blocked (common: em-dash in canonical/lede, word-count >750, lede ≠ canonical)

Word-count FAIL threshold: combined body **<280 or >750** words. Target range 350–550 is WARN.

## Legacy paths

`content:apply-enrichment` and `content:promote-enrichment` seed legacy drafts only. New or updated answers must use rewrite → QA → promote.
