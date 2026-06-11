# Deeper Global Parity Recovery Log

**Date:** 2026-06-11  
**Task:** Asset recovery + dirty deploy source discovery (no deploy)  
**Recovered tree:** `Documents/New project/` in `deeper-global-production`  
**Live reference:** `https://www.deeper.global`

---

## ⚠️ NO-DEPLOY WARNING

**Do not deploy, push, hoist, or change Vercel settings based on this log.**

This session recovered static assets and located the live production source. UI/CSS source files were **not** copied into the repo yet — only documented for a planned merge step.

---

## 1. Assets found and recovered

All assets referenced by live homepage HTML and OG/Twitter tags were downloaded into:

```
Documents/New project/public/
├── favicon.ico
├── favicon.svg
└── images/
    ├── deeper-hero-reader.png
    ├── deeper-hero-reader-720.avif
    ├── deeper-hero-reader-1200.avif
    ├── deeper-hero-reader-1774.avif
    ├── deeper-hero-reader-720.webp
    ├── deeper-hero-reader-1200.webp
    └── deeper-hero-reader-1774.webp
```

| Asset | HTTP | Size | Source |
|-------|------|------|--------|
| `favicon.ico` | 200 | 997 B | `https://www.deeper.global/favicon.ico` |
| `favicon.svg` | 200 | 288 B | `https://www.deeper.global/favicon.svg` |
| `images/deeper-hero-reader.png` | 200 | 1.59 MB | Live production |
| `images/deeper-hero-reader-720.avif` | 200 | 7.1 KB | Live production |
| `images/deeper-hero-reader-1200.avif` | 200 | 13.1 KB | Live production |
| `images/deeper-hero-reader-1774.avif` | 200 | 20.8 KB | Live production |
| `images/deeper-hero-reader-720.webp` | 200 | 10.8 KB | Live production |
| `images/deeper-hero-reader-1200.webp` | 200 | 21.3 KB | Live production |
| `images/deeper-hero-reader-1774.webp` | 200 | 37.1 KB | Live production |

**Total:** 9 files, ~1.72 MB.

Live CSS bundle (`/_astro/BaseLayout.DHHP_8JI.css`) contains **no** additional `url(...)` asset references — no further static files required for current live styling.

---

## 2. Assets still missing

**None** for known live production references.

All nine expected assets are present under `Documents/New project/public/`.

**Note:** Recovered assets are currently **untracked** in git (`?? Documents/New project/public/`). They are on disk but not committed.

---

## 3. Asset provenance and verification

Each recovered file was SHA-256 checked against the Codex worktree copy (see §5). All nine match exactly.

Sample verification:

| File | Recovered = Worktree = Live source |
|------|-----------------------------------|
| `favicon.ico` | ✅ MATCH |
| `favicon.svg` | ✅ MATCH |
| `deeper-hero-reader.png` | ✅ MATCH |
| `deeper-hero-reader-1200.webp` | ✅ MATCH |
| *(all 9 assets)* | ✅ MATCH |

Worktree public assets dated 2026-04-30; live downloads dated 2026-06-11 — identical bytes.

---

## 4. Dirty deploy / source folders searched

| Location | Result |
|----------|--------|
| `deeper-global-production/Documents/New project/` | Committed recovery scaffold only (no live UI deltas) |
| `deeper-global-production/deeper2/deeper-global/` | Next.js prototype — not live Astro source |
| `deeper-global-production/Desktop/qv-brand-alchemy-main/` | Unrelated QV Brands project |
| `/Users/rickjulian/Documents/New project/` | Parent folder for other client sites — no deeper-global Astro app |
| `/Users/rickjulian/deeper2/deeper-global/` | Next.js prototype + `.vercel` (not h65m) |
| Git branches (`main`, `production/astro-v1-recovered`, `origin/codex/deeper-global-astro-v1`) | No `shouldIndexQuestion`, `hero-search`, or `answer-layout` in history |
| `~/.codex/worktrees/` | **One worktree: `bb3b`** |
| Cursor local history (`~/Library/Application Support/Cursor/User/History/`) | Fragmentary `.astro` snapshots — not a complete deploy tree |
| Live CSS fetch | `BaseLayout.DHHP_8JI.css` hash matches worktree `dist/` |

---

## 5. Full dirty deploy source — FOUND ✅

**Primary candidate (high confidence — this is live production source):**

```
/Users/rickjulian/.codex/worktrees/bb3b/rickjulian/Documents/New project/
```

| Evidence | Detail |
|----------|--------|
| Vercel link | `.vercel/project.json` → **`deeper-global-h65m`** (`prj_oqoU0c7xWi8QB7VxChkLzsvuUoRL`) — same project serving `www.deeper.global` |
| CSS bundle hash | `dist/_astro/BaseLayout.DHHP_8JI.css` SHA-256 **`f7b89a8a...`** — **identical to live** |
| Live UI classes | `hero-search`, `answer-layout`, `rabbit-grid`, `brand-word`, `nav-cta` in `src/styles/global.css` (1,089 lines vs 370 in recovered) |
| SEO config | `astro.config.mjs`: `site: 'https://www.deeper.global'`, `trailingSlash: 'always'`, sitemap filter excluding `/entities/` and `/categories/` |
| noindex support | `BaseLayout.astro` `noindex` prop; category/entity/answer pages wired |
| Indexation helper | `shouldIndexQuestion()` in `src/lib/content.ts` (uses `review_status` field) |
| Site URL helper | `src/lib/site.ts` (new file vs recovered) |
| `public/` | Same 9 assets (already recovered into repo tree) |
| `scripts/` | 7 maintenance scripts including SEO/indexation tooling |
| `pg` dependency | In `package.json`; used by **scripts only** (`apply-structured-content-migration.mjs`, etc.) — not Astro runtime |
| Prebuilt output | `.vercel/output/` present (CLI deploy artifact) |
| Env snapshot | `.vercel/.env.production.local` present (**do not commit or expose**) |
| Git state | Clean working tree; commit `d0fd7f2` "Initial Deeper Global Astro rebuild" — **not** the same as git `4ef2a69` on `production/astro-v1-recovered` |
| Last modified | Directory activity through 2026-05-22; `dist/` built 2026-05-05 |

---

## 6. Candidate files for live-only UI/CSS (worktree vs recovered)

**Not copied yet** — inventory for next merge step:

### New files (worktree only)

| File | Purpose |
|------|---------|
| `src/lib/site.ts` | `SITE_URL`, `siteUrl()`, trailing-slash normalization, org/website IDs |
| `src/pages/answers/page/[page].astro` | Paginated answer index (48 per page) |

### Modified files (differ from recovered)

| File | Live delta summary |
|------|-------------------|
| `astro.config.mjs` | `www` site URL, trailing slashes, sitemap filter |
| `package.json` | `pg` + SEO script commands |
| `src/layouts/BaseLayout.astro` | OG image, favicons, noindex, org JSON-LD, brand wordmark, nav CTA, preconnect |
| `src/styles/global.css` | +719 lines — full live design system |
| `src/pages/index.astro` | Hero image, search, trending, stats, question grid |
| `src/pages/answers/[slug].astro` | Two-column layout, MedicalWebPage JSON-LD, breadcrumbs, sidebar, rabbit-grid |
| `src/pages/answers/index.astro` | Live list/search UX |
| `src/pages/entities/index.astro` | "Themes" naming, noindex |
| `src/pages/entities/[entity].astro` | Theme naming, noindex, updated JSON-LD |
| `src/pages/categories/index.astro` | noindex |
| `src/pages/categories/[category].astro` | noindex, CollectionPage JSON-LD |
| `src/lib/content.ts` | `shouldIndexQuestion`, meta description helpers, expanded entity logic |
| `src/lib/supabase.ts` | Extended `Question` type (`review_status`, etc.) |
| `src/pages/llms.txt.ts` | `www` URLs, updated citation guidance text |
| `src/pages/robots.txt.ts` | `www` sitemap URL |
| `src/components/AnswerCard.astro` | Live card markup |
| `src/pages/about.astro` | Minor live copy/layout |

### Scripts (worktree only — not runtime)

```
scripts/
├── apply-structured-content-migration.mjs   (uses pg)
├── generate-indexation-priority.mjs
├── insert-duplicate-canonical-drafts.mjs  (uses pg)
├── prepare-enrichment-pilot.mjs
├── prepare-p1-enrichment-sources.mjs
├── promote-duplicate-canonical-drafts.mjs (uses pg)
└── supabase-sql.mjs
```

### Also in worktree (reference only)

- `dist/` — full production build output
- `.vercel/output/` — prebuilt CLI deploy bundle
- `supabase/` — SQL/migration files
- `reports/` — SEO/indexation reports
- `vercel.json` — 8.6 KB (vs 91 B in recovered) — review before any deploy config merge

---

## 7. Was a full dirty deploy source found?

**Yes.**

The Codex worktree at `/Users/rickjulian/.codex/worktrees/bb3b/rickjulian/Documents/New project/` is the live production Astro source:

- Linked to **`deeper-global-h65m`**
- Produces the **exact CSS bundle** served on `www.deeper.global`
- Contains all documented parity gaps (UI, SEO, noindex, sitemap filter, `www` canonicals)
- Explains the **`pg` package.json entry** — dev/SEO scripts, not the web app

The git commit on `production/astro-v1-recovered` (`4ef2a69`) is an **earlier scaffold** that was never updated with these deltas. Production was deployed from this worktree via Vercel CLI (`gitDirty: 1` / `source: cli`).

---

## 8. Recommended next step

**Merge worktree source into `Documents/New project/` (still no deploy):**

1. **Diff and copy** worktree `src/`, `astro.config.mjs`, `package.json`, `vercel.json`, and `scripts/` into `Documents/New project/` — treat worktree as source of truth for live parity
2. **Keep** the already-recovered `public/` (byte-identical to worktree — no re-copy needed)
3. **Do not copy** `.vercel/.env.production.local`, `node_modules/`, or `dist/` into the repo
4. **Run local build** with Supabase env vars (requires explicit approval for `npm ci`) and compare preview to live
5. **Only then** consider hoist to repo root — not before parity merge validates

Alternative if worktree path is unstable: archive it first:

```bash
# Example — run manually when ready, not part of this task
tar -czf ~/Desktop/deeper-global-live-source-2026-06-11.tar.gz \
  -C "/Users/rickjulian/.codex/worktrees/bb3b/rickjulian/Documents" "New project" \
  --exclude node_modules --exclude dist --exclude .vercel/.env.production.local
```

---

## 9. Session summary

| Item | Status |
|------|--------|
| Public assets recovered | ✅ 9/9 into `Documents/New project/public/` |
| Assets missing | ✅ None known |
| Dirty deploy source found | ✅ Codex worktree `bb3b` |
| UI/CSS copied to repo | ❌ Intentionally not done (discovery only) |
| Deploy / hoist / push | ❌ Not performed |

---

## Related documents

- [`docs/deeper-production-parity-gap-report.md`](./deeper-production-parity-gap-report.md)
- [`docs/deeper-production-recovery-notes.md`](./deeper-production-recovery-notes.md)

---

**Reminder: NO DEPLOY until worktree source is merged and preview QA passes.**
