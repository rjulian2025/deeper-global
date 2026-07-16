#!/usr/bin/env node
/**
 * Rollback design for clinical-contributor migration.
 *
 * Phase A–B: no live mutation occurred, so rollback is a no-op that documents
 * the restore procedure for a future apply phase.
 *
 *   npm run reviewers:rollback
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = 'reports/reviewer-migration';

function main() {
  const summaryPath = join(OUT_DIR, 'assignment-summary.json');
  const summary = existsSync(summaryPath)
    ? JSON.parse(readFileSync(summaryPath, 'utf8'))
    : null;

  console.log(
    JSON.stringify(
      {
        mode: 'rollback-design',
        live_mutation_performed: false,
        status: 'noop',
        message:
          'No production reviewer assignments were changed in Phase A–B. Rollback is unnecessary for this dry-run.',
        future_apply_rollback_plan: {
          prerequisite: 'Keep pre-apply snapshot CSV of questions_master.id,slug,reviewed_by,reviewed_at,review_status',
          restore_sql_pattern:
            'UPDATE questions_master AS t SET reviewed_by = s.reviewed_by, reviewed_at = s.reviewed_at FROM rollback_snapshot s WHERE t.id = s.id',
          never_delete_reviewed_at_during_rollback: true,
          preserve_protected_ids: ['alex-crenshaw-phd', 'michelle-morris-lpc', 'rick-julian'],
          reports_to_keep: [
            'assignment-detail.csv',
            'high-confidence-assignments.csv',
            'ken-attribution-remaining.csv',
          ],
        },
        last_dry_run: summary
          ? {
              generated_at: summary.generated_at,
              ken_evaluated: summary.counts?.ken_evaluated ?? summary.ken_evaluated,
              high_confidence_proposed: summary.counts?.high_confidence_proposed,
            }
          : null,
      },
      null,
      2
    )
  );
}

main();
