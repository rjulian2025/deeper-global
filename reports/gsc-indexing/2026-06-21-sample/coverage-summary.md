# GSC Index Coverage Summary

Generated: 2026-06-21T13:28:30.830Z

Ingest GSC **Page indexing** CSV exports weekly before hygiene or sitemap policy changes.

## Totals

- URLs parsed: **3**
- Source files: **1**
- Reason buckets: **1**

## By indexing reason

| Reason | Count | Sample |
|---|---:|---|
| crawled_not_indexed | 3 | /answers/example-answer-slug/ |

## By site section

| Section | Total | Top reason |
|---|---:|---|
| Answer pages | 1 | crawled_not_indexed |
| Design prototypes | 1 | crawled_not_indexed |
| Category hubs | 1 | crawled_not_indexed |

## Hygiene notes

- **INFO** — 1 design-evolution or random-answer URLs appear in GSC indexing exports. These are noindex and now excluded from sitemap.xml.
- **ACTION** — 1 answer URLs are crawled but not indexed. Prioritize reviewed answers with enrichment before changing URL structure.

## Source files

- `reports/gsc-indexing/2026-06-21-sample/crawled-not-indexed/Table.csv` (crawled_not_indexed)

## Next step

Run `npm run seo:priority` after exports are in place to rank answer URLs for enrichment.

