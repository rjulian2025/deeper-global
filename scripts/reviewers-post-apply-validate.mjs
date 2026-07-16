#!/usr/bin/env node
/**
 * Post-apply validation design (DRY).
 * When credentials exist after a future apply, this script will verify:
 * - 923 rows have clinical_contributor_id
 * - 145 rows have editorial_reviewer_id=deeper-editorial and null clinical_contributor_id
 * - legacy reviewed_by/reviewed_at preserved on rollback mapping keys
 * - no clinically_reviewed_at set from migration timestamp
 *
 * Phase C: reports readiness only; does not query or mutate production.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = 'reports/reviewer-migration/apply-package';
const ready =
  existsSync(join(APPLY, 'clinical-contributor-backfill-all-high.json')) &&
  existsSync(join(APPLY, 'editorial-transition-145.json')) &&
  existsSync(join(APPLY, 'rollback-mapping.json'));

console.log(
  JSON.stringify(
    {
      mode: 'post-apply-validate-design',
      production_query_executed: false,
      package_ready: ready,
      checks_planned: [
        'count clinical_contributor_id is not null = 923 (or surviving set after QA)',
        'count editorial_reviewer_id = deeper-editorial among unmatched = 145',
        'count clinically_reviewed_at newly equal to apply timestamp = 0',
        'spot-check legacy reviewed_by still present for rollback keys',
        'public pages: no Reviewed June 19 2026 for Ken bulk rows',
        'schema: contributor not reviewedBy for specialty assignments',
        'sitemap excludes noindex contributor profiles until activation',
      ],
      high_package_count: ready
        ? JSON.parse(readFileSync(join(APPLY, 'clinical-contributor-backfill-all-high.json'), 'utf8')).count
        : null,
    },
    null,
    2
  )
);
