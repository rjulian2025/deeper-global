# GSC Index Coverage Summary

Generated: 2026-06-23T13:45:59.505Z

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

- **INFO**: Only 3 URLs parsed. Treat this as a sample; do not make URL, redirect, canonical, or sitemap policy changes until full Page indexing exports are ingested.
- **INFO**: 1 design-evolution or random-answer URL found in GSC indexing exports. These remain intentionally sitemap-excluded; monitor them but do not add them back to sitemap.xml.
- **WATCH**: 2 URLs found in GSC exports while excluded from sitemap.xml by policy. This is acceptable for prototype, random, and hub surfaces; investigate only if these become indexed or accrue meaningful impressions.
- **ACTION**: 1 answer URL crawled but not indexed. Corrective action: enrich reviewed answer content, QA and promote the rewrite, then watch the next GSC cycle before changing URL structure.

## Source files

- `reports/gsc-indexing/2026-06-21-sample/crawled-not-indexed/Table.csv` (crawled_not_indexed)

## Corrective action queue

1. For answer URLs crawled but not indexed, enrich reviewed answers first: run `npm run content:gsc-weekly-plan`, approve slugs, rewrite with `npm run content:rewrite-answers-claude -- --apply --slugs-file reports/gsc-weekly/rewrite-batch.json`, then run QA and promote.
2. Keep prototype, random-answer, category, entity, and theme URLs out of sitemap.xml unless indexation policy is intentionally changed.
3. Do not change URLs, redirects, canonicals, or sitemap policy from small samples. Ingest full Page indexing exports before structural SEO decisions.
4. After exports are in place, run `npm run seo:priority` to rank answer URLs for enrichment.

