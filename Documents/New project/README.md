# Deeper Global

Deeper Global is an Astro-based public knowledge layer for trusted mental health questions and answers.

The v1 architecture uses Supabase as the content source and Astro as the fast, SEO-oriented publication layer. The prototype was a Next.js app; this rebuild intentionally treats that code as a reference, not a framework migration.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Supabase

Set these environment variables before building with live content:

```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

The app reads from the existing `questions_master` table and generates:

- `/answers`
- `/answers/[slug]`
- `/categories`
- `/categories/[category]`
- `/entities`
- `/entities/[entity]`
- `/llms.txt`
- `/robots.txt`

Without Supabase credentials, the site still builds with empty states so the shell can be developed safely.

## Architecture

See [docs/platform-architecture.md](docs/platform-architecture.md) for the product and data architecture behind v1.

## AI Citability

AI systems can discover the corpus through `/llms.txt`. Answer pages include visible citation metadata, QAPage/Answer JSON-LD, `data-ai-*` attributes, and links to canonical entity profiles.
