# Deeper Phase 1A — trust layer foundation

**Status:** Implemented (controlled sprint)  
**Branch target:** `production/astro`  
**Scope:** Trust signals + data audit only. No indexation flips, no entity consolidation, no URL/routing changes.

## Goals

1. Surface existing Supabase trust fields on answer pages when present.
2. Add editorial policy page and neutral trust copy when fields are absent.
3. Preserve crisis support (988) and improve international guidance.
4. Add build-time answer-count floor.
5. Produce read-only authority data audit for Phase 1B+ decisions.

## Out of scope (explicit)

- Entity consolidation (`/entities/` as canonical concept nodes).
- Broad `noindex` / index flips.
- Supabase content mutations.
- Redirects or URL changes.
- Rewriting answers.
- Changes to `llms.txt` structure.
- Production deploy or push without approval.

## Implementation summary

### Trust rendering

| Field | Behavior |
| --- | --- |
| `reviewed_by` | Shown in sidebar trust panel when non-empty. Never invented. |
| `source_refs` | Rendered as linked sources when refs include title and/or URL. |
| Neither | Neutral editorial statement + links to `/editorial-policy/` and `/protocol/`. |
| `review_status` | Shown only when present and `reviewed_by` is empty (informational, not a clinical claim). |

**Component:** `src/components/AnswerTrustPanel.astro`  
**Page:** `src/pages/editorial-policy.astro`  
**Footer:** Editorial policy link added in `BaseLayout.astro`.

### Crisis support

`CrisisBanner.astro` keeps U.S. 988 behavior and adds a line for international/local crisis resources.

### JSON-LD

When data exists only:

- `reviewedBy` on `MedicalWebPage` and `Article` nodes.
- `citation` URL array from `source_refs`.

No schema claims when fields are empty.

### Build safety

```typescript
// src/lib/supabase.ts
export const MIN_ANSWER_COUNT = 950;
```

Build fails if Supabase returns fewer than 950 questions when credentials are configured. Threshold chosen conservatively below the current ~1,000+ answer corpus.

### Data audit

```bash
npm run audit:authority
```

Writes `docs/deeper-authority-data-audit.md` (read-only).

## Verification checklist

- [ ] `npm run build` passes with Supabase env
- [ ] Preview deploy (`vercel`, not `--prod`)
- [ ] Homepage, `/answers/`, sample answer, crisis answer load
- [ ] `/llms.txt` unchanged in structure
- [ ] `/sitemap-0.xml` still ~1,030 URLs
- [ ] Trust block shows reviewer/sources only when DB fields exist
- [ ] No false clinical review claims

## Next phase (not this sprint)

- Validate entity/category strategy against GSC + audit.
- Controlled indexation pilot on approved/reviewed subset.
- Source and reviewer enrichment in Supabase (content ops, not Astro-only).
