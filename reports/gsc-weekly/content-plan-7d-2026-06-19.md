# Weekly GSC content ops plan

Generated: 2026-06-19T23:13:42.117Z
Mode: **recommend** (scope: upgrade_existing_only)
Window: **7 days** (lag: 3 days)
Primary success metric: **gsc_clicks**

## GSC status

| Field | Value |
| --- | --- |
| Available | yes |
| Current window | 2026-06-09 → 2026-06-16 |
| Prior window | 2026-06-01 → 2026-06-08 |
| Answer pages with signal | 11 |
| Total clicks (current / prior / delta) | 0 / 0 / +0 |

## Summary

| Metric | Count |
| --- | ---: |
| Recommended rewrite candidates | 11 |
| Confidence-qualified | 0 |
| Auto-stage eligible (recommend) | 0 |

## Recommended batch (upgrade existing only)

| # | Slug | Type | Clicks | Δ clicks | Impr. | Position | Confident | Score |
| ---: | --- | --- | ---: | ---: | ---: | ---: | --- | ---: |
| 1 | why-do-i-feel-guilty-for-taking-time-off-189668-007 | RECOMMENDED | 0 | +0 | 18 | 74.4 | no | -889 |
| 2 | how-do-i-deal-with-having-no-one-to-shar-181083-077 | RECOMMENDED | 0 | +0 | 1 | 10.0 | no | -891 |
| 3 | how-do-i-handle-work-stress-without-using-substances | RECOMMENDED | 0 | +0 | 1 | 2.0 | no | -891 |
| 4 | how-do-i-stop-feeling-like-everyone-else-has-177941-031 | RECOMMENDED | 0 | +0 | 1 | 2.0 | no | -891 |
| 5 | what-do-i-do-when-i-cant-afford-therapy-177940-020 | RECOMMENDED | 0 | +0 | 1 | 6.0 | no | -891 |
| 6 | what-should-i-do-if-i-think-my-friend-is-186032-033 | RECOMMENDED | 0 | +0 | 1 | 9.0 | no | -891 |
| 7 | whats-the-difference-between-cbt-and-other-types-of-therapy-for-depression | RECOMMENDED | 0 | +0 | 1 | 2.0 | no | -891 |
| 8 | whats-the-difference-between-physical-and-psychological-addiction | RECOMMENDED | 0 | +0 | 1 | 7.0 | no | -891 |
| 9 | why-do-i-feel-like-im-always-waiting-for-184730-090 | RECOMMENDED | 0 | +0 | 1 | 8.0 | no | -891 |
| 10 | why-do-i-feel-like-im-losing-my-native-language-i8j2k5 | RECOMMENDED | 0 | +0 | 2 | 8.0 | no | -891 |
| 11 | why-do-i-feel-stuck-in-a-job-thats-slowly-killing-my-soul | RECOMMENDED | 0 | +0 | 4 | 1.3 | no | -891 |

_Auto-staging is disabled for the first cycles. Approve slugs manually, then run the rewrite pipeline._

## Next steps

1. Review recommended slugs above.
2. Rewrite: `npm run content:rewrite-answers-claude -- --apply --slugs-file reports/gsc-weekly/rewrite-batch.json`
3. Run QA + promote dry-run via `docs/content-governance.md`.
4. Promote and deploy manually after review.

