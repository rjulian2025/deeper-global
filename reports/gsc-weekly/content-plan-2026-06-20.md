# Weekly GSC content ops plan

Generated: 2026-06-20T14:17:37.939Z
Mode: **recommend** (scope: upgrade_existing_only)
Window: **28 days** (lag: 3 days)
Primary success metric: **gsc_clicks**

## GSC status

| Field | Value |
| --- | --- |
| Available | yes |
| Current window | 2026-05-20 → 2026-06-17 |
| Prior window | 2026-04-21 → 2026-05-19 |
| Answer pages with signal | 30 |
| Total clicks (current / prior / delta) | 0 / 0 / +0 |

## Public API citation usage

| Field | Value |
| --- | --- |
| Available | yes |
| Window | last 28 days (since 2026-05-23) |
| Total API events | 0 |
| Answer fetches | 0 |
| List/search requests | 0 |
| Unique answers fetched | 0 |

_No API citation events yet. Traffic is logged in Vercel; persist events with docs/supabase-api-citation-events.sql._

## Summary

| Metric | Count |
| --- | ---: |
| Recommended rewrite candidates | 25 |
| Confidence-qualified | 0 |
| Auto-stage eligible (recommend) | 0 |

## Recommended batch (upgrade existing only)

| # | Slug | Type | Clicks | Δ clicks | Impr. | Position | Confident | Score |
| ---: | --- | --- | ---: | ---: | ---: | ---: | --- | ---: |
| 1 | why-do-i-feel-guilty-for-taking-time-off-189668-007 | MOMENTUM | 0 | +0 | 56 | 73.5 | yes | -845 |
| 2 | how-do-i-cope-with-the-emotional-pain-of-divorce | RECOMMENDED | 0 | +0 | 18 | 82.3 | no | -889 |
| 3 | how-do-i-apologize-effectively-when-ive-hurt-someone | RECOMMENDED | 0 | +0 | 7 | 76.1 | no | -890 |
| 4 | what-are-the-signs-of-borderline-personality-disorder | RECOMMENDED | 0 | +0 | 7 | 64.1 | no | -890 |
| 5 | why-do-i-feel-lonely-in-my-relationship-191368-010 | RECOMMENDED | 0 | +0 | 7 | 91.6 | no | -890 |
| 6 | how-can-i-tell-if-someone-is-manipulating-me | RECOMMENDED | 0 | +0 | 1 | 27.0 | no | -891 |
| 7 | how-do-i-deal-with-depression-when-im-unemployed | RECOMMENDED | 0 | +0 | 1 | 88.0 | no | -891 |
| 8 | how-do-i-deal-with-fear-of-hell-after-le-181083-036 | RECOMMENDED | 0 | +0 | 3 | 57.0 | no | -891 |
| 9 | how-do-i-deal-with-having-no-one-to-shar-181083-077 | RECOMMENDED | 0 | +0 | 1 | 10.0 | no | -891 |
| 10 | how-do-i-function-when-anxiety-makes-everything-feel-overwhelming | RECOMMENDED | 0 | +0 | 1 | 88.0 | no | -891 |
| 11 | how-do-i-handle-work-stress-without-using-substances | RECOMMENDED | 0 | +0 | 1 | 2.0 | no | -891 |
| 12 | how-do-i-know-if-im-gay-straight-or-some-186032-013 | RECOMMENDED | 0 | +0 | 1 | 94.0 | no | -891 |
| 13 | how-do-i-manage-adhd-without-medication | RECOMMENDED | 0 | +0 | 1 | 11.0 | no | -891 |
| 14 | how-do-i-rebuild-intimacy-after-infidelity-or-betrayal | RECOMMENDED | 0 | +0 | 1 | 93.0 | no | -891 |
| 15 | how-do-i-rebuild-trust-after-being-cheat-190648-010 | RECOMMENDED | 0 | +0 | 2 | 86.0 | no | -891 |
| 16 | how-do-i-stop-feeling-like-everyone-else-has-177941-031 | RECOMMENDED | 0 | +0 | 1 | 2.0 | no | -891 |
| 17 | how-do-i-stop-feeling-like-everyone-will-181083-092 | RECOMMENDED | 0 | +0 | 1 | 34.0 | no | -891 |
| 18 | how-do-i-tell-my-friends-im-sober-withou-185759-026 | RECOMMENDED | 0 | +0 | 1 | 94.0 | no | -891 |
| 19 | my-chest-tightens-whenever-someone-texts-me-unexpectedly | RECOMMENDED | 0 | +0 | 2 | 8.0 | no | -891 |
| 20 | what-do-i-do-when-i-cant-afford-therapy-177940-020 | RECOMMENDED | 0 | +0 | 1 | 6.0 | no | -891 |
| 21 | what-if-im-having-second-thoughts-about-getting-divorced | RECOMMENDED | 0 | +0 | 2 | 70.5 | no | -891 |
| 22 | what-should-i-do-if-i-think-my-friend-is-186032-033 | RECOMMENDED | 0 | +0 | 1 | 9.0 | no | -891 |
| 23 | what-should-i-do-if-my-teenager-is-experimenting-w-187459-006 | RECOMMENDED | 0 | +0 | 1 | 7.0 | no | -891 |
| 24 | whats-the-difference-between-cbt-and-other-types-of-therapy-for-depression | RECOMMENDED | 0 | +0 | 1 | 2.0 | no | -891 |
| 25 | whats-the-difference-between-physical-and-psychological-addiction | RECOMMENDED | 0 | +0 | 3 | 8.3 | no | -891 |

_Auto-staging is disabled for the first cycles. Approve slugs manually, then run the rewrite pipeline._

## Next steps

1. Review recommended slugs above.
2. Rewrite: `npm run content:rewrite-answers-claude -- --apply --slugs-file reports/gsc-weekly/rewrite-batch.json`
3. Run QA + promote dry-run via `docs/content-governance.md`.
4. Promote and deploy manually after review.

