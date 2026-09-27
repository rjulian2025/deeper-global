*** Begin Verbatim Replacement ***
# AI Search + SEO + Conversion Content Standard

Applies to every page and post written or published for: qvbrands.com, deeperwebsites.com, deeper.global, rickjulian.com (and any Deeper client site built from these repos). Owner: Rick Julian. Adopted Sep 27, 2026; conversion section added the same day.

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

## 6. Conversion and revenue (required on every page)
Every page and post is built to turn visits into a measurable `book_call` (or the site's equivalent primary conversion).
- **Attribution:** every link we control that points to a site carries UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` naming the specific post or placement), e.g. GBP posts `utm_source=google_business_profile&utm_medium=post&utm_campaign=<site>_gbp_posts&utm_content=<post-slug>`, GBP listing `utm_medium=listing&utm_campaign=<site>_gbp_listing`, social `utm_source=<network>&utm_medium=social`, email `utm_medium=email`. On-site, pass the landing page and UTM source into booking and lead events (GA4 `book_call` / `generate_lead` with `source`, `medium`, `campaign`, `content`, `page_path`) so each booking traces back to the post, GBP query or social mention that drove it. Internal links do not get UTMs.
- **Lead magnet before the call:** each site offers at least one short, genuinely useful diagnostic, checklist or template in exchange for an email (e.g. Deeper's AI-ready therapist website checklist or readiness audit). It sits as the secondary action on posts and service pages, fires a `generate_lead` event, and adds the contact to a nurture/retargeting list (Resend audience, sending from the verified domain). It never competes visually with the primary CTA.
- **Reviews and testimonials:** service pages show real client testimonials (named with permission, approved clients only) near the CTA, marked up with `Review` (author, reviewBody, itemReviewed = the Service/Organization) and `AggregateRating` only when backed by real, verifiable reviews (e.g. counts and ratings mirrored from the Google Business Profile). Never invent, paraphrase into new claims, or inflate reviews or ratings. Note: Google does not show star rich results for a business's reviews of itself, but the markup still helps AI engines understand and cite social proof, so keep it accurate.
    50|- **Core Web Vitals are a release requirement:** at the 75th percentile on mobile, LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1; Lighthouse mobile Performance ≥ 90 on key templates. Optimize images (modern formats, explicit sizes, lazy-load below the fold), minimize third-party scripts (load booking widgets and analytics without blocking render), and treat a CWV regression as a bug that blocks deploy.
- **One primary CTA per page:** each page has exactly one primary call to action (e.g. "Book a free 20-minute strategy call"), visually unmistakable (highest-contrast button, above the fold and repeated at the end), with the same label and destination throughout the page. Everything else (lead magnet, related reading) is visibly secondary. Each page's success is measured against its primary CTA conversion rate in GA4.
- **Phone number on every Deeper and QV post (required, hard rule):** every post and article published for Deeper (deeperwebsites.com, deeper.global) or QV (qvbrands.com), and any rickjulian.com post about Deeper or QV, shows the real shared line **(404) 688-0088** as a tap-to-call link (`<a href="tel:+14046880088">(404) 688-0088</a>`) in a contact line directly beside or beneath the primary CTA (e.g. "Prefer to talk? Call (404) 688-0088, by appointment, Mon–Fri 9–5."), and again in the closing CTA block. It is rendered by the shared post layout/CTA component so no post can ship without it, and the post's JSON-LD publisher/Organization carries `telephone: "+1-404-688-0088"`. Use only this number: never Rick's personal cell, never an invented or tracking number. The call link fires a GA4 `click_to_call` event with the page's UTM context. Exception: Google Business Profile post text (Google may reject posts with phone numbers in the body), where the profile's Call button carries the number instead.

## 7. Enforcement
- Each repo keeps an automated test that builds the site and asserts, for every published post: BlogPosting/Article JSON-LD present and parseable with the required fields in §1, BreadcrumbList present, canonical + OG tags present, the URL is in the sitemap and llms.txt, and no scheduled/future URL appears anywhere; and, for every page, at least one element marked as the primary CTA (e.g. `data-cta="primary"`) with all such elements sharing one label and one destination, and that outbound links to our own properties in GBP/social/email templates carry UTMs. Every Deeper and QV post (and Deeper/QV-related rickjulian.com posts) must also contain a `tel:+14046880088` link showing (404) 688-0088 near the primary CTA; the build fails otherwise.
- Drafts (GBP posts, blog posts, essays, landing pages) are written to §2 and §6 before they are reviewed; code changes that add a new content type must add its schema and llms entries in the same PR. Run Lighthouse (mobile) on changed templates before merging.
- This file lives at `docs/AI-SEO-CONTENT-STANDARD.md` in every site repo and is referenced from the repo README / AGENTS.md so coding agents apply it automatically.
*** End Verbatim Replacement ***

