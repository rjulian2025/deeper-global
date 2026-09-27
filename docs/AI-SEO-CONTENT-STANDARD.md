# AI Search + SEO Content Standard

Applies to every page and post written or published for: qvbrands.com, deeperwebsites.com, deeper.global, rickjulian.com (and any Deeper client site built from these repos). Owner: Rick Julian. Adopted Sep 27, 2026.

Every piece of content ships optimized for BOTH traditional search (Google/Bing) and AI answer engines (Google AI Overviews/AI Mode, ChatGPT search, Perplexity, Claude, Copilot, Gemini). This is the default, not an add-on. A post that fails the checklist below is not ready to publish.

## 1. Structured data (JSON-LD, server-rendered in the HTML)
Site-wide (every page):
- `Organization` (or `ProfessionalService`/`LocalBusiness` where a GBP exists) with a stable `@id` (e.g. `https://www.example.com/#organization`), `name`, `url`, `logo`, `sameAs` (GBP Maps link, LinkedIn, X, etc.), `telephone` only if public (QV/Deeper use (404) 688-0088; never Rick's personal cell), `address`/`areaServed` matching the GBP.
    10|- `WebSite` with `@id`, `name`, `url`, `publisher` referencing the Organization `@id`.
- `Person` for Rick Julian with a stable `@id` (e.g. `https://www.rickjulian.com/#person`), `name`, `jobTitle`, `url`, `sameAs` (rickjulian.com, LinkedIn), `worksFor` the relevant Organization. Reuse the same `@id` across all four sites so engines connect the entity.

Every article/post/essay/answer page:
- `BlogPosting` (blog posts) or `Article` (essays, guides, answer pages) with: `@id`, `headline` (≤110 chars), `description`, `url`, `mainEntityOfPage`, `datePublished` and `dateModified` (ISO 8601 with offset; for scheduled posts `datePublished` = the publishAt instant), `author` (Person `@id` + name + url), `publisher` (Organization `@id`), `image` (absolute URL, ≥1200px wide), `inLanguage`, `wordCount`, `articleSection`, `keywords`, and `about`/`mentions` (topics/entities as `Thing` or `DefinedTerm`, with `sameAs` to Wikipedia/Wikidata where a clear match exists).
- `BreadcrumbList` matching the visible breadcrumb/URL path.
- `FAQPage` only when the page shows the same Q&A visibly on the page. Never mark up hidden content.
- Optional where it truly fits: `HowTo` (visible steps), `DefinedTermSet` (glossaries), `Service`/`Offer` on service pages, `speakable` on the summary block.
- All JSON-LD must validate (schema.org validator, Google Rich Results Test) and must match visible content. No invented ratings, reviews, stats or prices.

    20|## 2. Page content shape (what AI engines extract and cite)
- One clear H1; descriptive, question-style H2/H3s that mirror how people ask.
- Answer-first: a 40–70 word direct answer or "Key takeaways" block right under the H1, restating the question's answer in plain words.
- Short, self-contained paragraphs and sections that make sense if quoted alone; use lists and tables for comparisons, steps and specs.
- Define terms explicitly ("X is ..."). Use specific, verifiable facts; cite and link sources for any claim, number or quote. Never fabricate data, clients, results or testimonials. Only name approved clients (currently Kellie Reich, Peachtree Psychology, Michel Bordeau, Loopo).
- Visible byline (Rick Julian, linked to his author/about page), visible published and updated dates, and an author bio block showing relevant experience (E-E-A-T).
- Internal links to 2–5 related published pages plus the primary conversion page; descriptive anchor text. Never link to unpublished/scheduled pages.
- Consistent entity naming (business names, NAP, service names) matching GBP and schema.

## 3. Traditional SEO meta (still required)
    30|- Unique `<title>` (≤60 chars) and meta description (140–160 chars).
- Self-referencing canonical URL; one canonical host (www vs apex) per site.
- Open Graph + Twitter card tags with absolute image URLs; `og:type=article`, `article:published_time`, `article:modified_time`, `article:author`.
- `lang` attribute, descriptive image `alt` text, fast, mobile-friendly pages (Core Web Vitals green).

## 4. AI indexing and discovery
- Content is server-rendered/static HTML; nothing important depends on client-side JS.
- `/llms.txt` (curated index: site summary + every published page/post with one-line description) and `/llms-full.txt` (full plain-text/markdown of published posts), both generated at build from the same published-content list. Optionally serve a `.md` version of each post.
- `robots.txt` explicitly allows search and answer crawlers: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot, Perplexity-User, ClaudeBot, Claude-SearchBot, Claude-User, Google-Extended, Applebot, Applebot-Extended, DuckDuckBot. References the sitemap. No accidental `noindex`, and no blocking of these bots at the firewall/CDN level.
- XML sitemap with accurate `lastmod`; RSS/Atom feed for posts.
    40|- On deploy, ping IndexNow (Bing/Copilot/ChatGPT search use Bing's index) with new or changed URLs where the site supports it; keep Google Search Console and Bing Webmaster Tools verified.

## 5. Scheduled content
- Scheduled posts carry `publishAt` with an explicit ET offset. Every consumer (pages, index, related links, sitemap, feed, llms.txt, llms-full.txt, JSON-LD lists) uses the single published-only list. Nothing future leaks.

## 6. Enforcement
- Each repo keeps an automated test that builds the site and asserts, for every published post: BlogPosting/Article JSON-LD present and parseable with the required fields in §1, BreadcrumbList present, canonical + OG tags present, the URL is in the sitemap and llms.txt, and no scheduled/future URL appears anywhere.
- Drafts (GBP posts, blog posts, essays, landing pages) are written to §2 before they are reviewed; code changes that add a new content type must add its schema and llms entries in the same PR.
- This file lives at `docs/AI-SEO-CONTENT-STANDARD.md` in every site repo and is referenced from the repo README / AGENTS.md so coding agents apply it automatically.

