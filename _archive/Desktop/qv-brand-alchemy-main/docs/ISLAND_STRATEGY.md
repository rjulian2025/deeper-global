# Static vs interactive (Astro islands)

This repo’s **Lovable export is React (`.tsx`), not Vue.** Astro uses `@astrojs/react` so those components run as islands.

## What is always static (no React)

- **`Navigation.astro`** — Site chrome, active state from `Astro.url.pathname`
- **`BaseLayout.astro`** — `<title>`, meta, fonts, global JSON-LD
- **`about.astro`** — Fully static HTML (optional pattern for other marketing pages)

## Island directives used

| Directive | When | Routes |
|-----------|------|--------|
| **`client:only="react"`** | Must not run on server (browser-only APIs at import time) | `/contact` — Supabase client touches `localStorage`. **Email still goes Edge Function → Resend** (see `docs/CONTACT_FORM_AND_RESEND.md`). |
| **`client:load`** | Hydrate immediately; FAQ accordions, heavy interactivity | All `/strategic-answers/*` (Radix **Accordion** in `StrategicAnswerTemplate`), `/case-study/loopo` |
| **`client:visible`** | Hydrate when near viewport; mostly links + prose | Blog posts, `/answers/*`, hubs, packages, clients, etc. |
| **`client:load`** (home) | Homepage sections use Radix **Accordion**, **Button**, **Toaster** | `/` via `HomePageContent` |

## Page sources

- **Routes:** `src/pages/**/*.astro` (generated / hand-maintained)
- **Legacy React “pages”:** `src/views/pages/**` (moved from `src/pages/*.tsx`)
- **Regenerate wrappers:** `node scripts/generate-astro-routes.mjs` (after editing `scripts/generate-astro-routes.mjs`)

## Further optimization (optional)

1. Convert article-style `/answers/*` and blog posts to **`.astro` + Markdown** and keep only **ShareButtons** / **CTAFooter** as tiny islands.
2. Split `StrategicAnswerTemplate`: static article in Astro + **FAQ** as `client:visible` island only.
3. Lazy-init Supabase in `src/integrations/supabase/client.ts` so `/contact` can use `client:load` and still SSR a shell.
