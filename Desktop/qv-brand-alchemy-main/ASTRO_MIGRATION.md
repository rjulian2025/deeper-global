# Astro Migration Guide

This project has been converted from **Vite + React Router** to **Astro** (with React islands).  
**Note:** Lovable ships both Vue and React projects — this codebase is **React (`.tsx`)**, not Vue.

## Structure

| Location | Role |
|----------|------|
| `src/pages/*.astro` | File-based routes |
| `src/views/pages/**` | Legacy page components (formerly `src/pages/*.tsx`) |
| `src/components/islands/` | Wrappers that need special hydration (e.g. `ContactIsland`) |
| `src/components/Navigation.astro` | Static primary nav |
| `scripts/generate-astro-routes.mjs` | Regenerates `.astro` wrappers from the route manifest |

See **`docs/ISLAND_STRATEGY.md`** for static vs `client:load` / `client:visible` / `client:only` decisions.

**Contact form / Resend:** unchanged pipeline (`submitContactForm` → Edge Function `contact-form` → Resend). Details: **`docs/CONTACT_FORM_AND_RESEND.md`**.

## What's Done

- **Astro config** with React integration and Tailwind
- **Static output** for fast, cacheable builds
- **BaseLayout.astro** – shared layout with meta, fonts, and JSON-LD
- **Navigation.astro** – static nav (no JS)
- **index.astro** – homepage using React islands
- **about.astro** – fully static About page
- **Link component** – framework-agnostic (`@/components/Link`) for Astro compatibility

## Commands

```bash
npm run dev    # Start dev server (http://localhost:4321)
npm run build  # Static build → dist/
npm run preview # Preview production build
```

## Vercel Deployment

1. Connect the repo to Vercel
2. Use default settings – `vercel.json` is configured for the `dist` output
3. No serverless functions required; the site is fully static

## Migrating Remaining Pages

Legacy React pages live in `src/pages/*.tsx`. To migrate:

1. **Static content** (e.g. blog, answers) → Create `.astro` files and copy the HTML
2. **Interactive pages** (forms, Contact) → Create `.astro` that imports the React component with `client:load` or `client:visible`

### Example: Static page

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';

---
<BaseLayout title="Page Title" description="...">
  <Navigation pathname={Astro.url.pathname} />
  <main>...</main>
</BaseLayout>
```

### Example: React island page

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navigation from '../components/Navigation.astro';
import ContactForm from '../components/ContactForm';
---
<BaseLayout title="Contact" description="...">
  <Navigation pathname={Astro.url.pathname} />
  <ContactForm client:load />
</BaseLayout>
```

## Performance Benefits

- **Zero JS by default** – Only interactive parts load React
- **Static HTML** – Faster first load and better indexing
- **Compressed output** – `compressHTML: true` in config
