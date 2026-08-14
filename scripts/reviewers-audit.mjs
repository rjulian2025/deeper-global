#!/usr/bin/env node
/**
 * Read-only reviewer/contributor audit (no DB writes).
 *   npm run reviewers:audit
 */
import { runAssignment } from './lib/reviewers/assignment-engine.mjs';
import { writeCrosswalkJson } from './lib/reviewers/export-crosswalk-json.mjs';

async function main() {
  writeCrosswalkJson();
  const result = await runAssignment({ includeMedium: false });
  const byReviewer = {};
  for (const a of result.answers) {
    byReviewer[a.reviewed_by || '(null)'] = (byReviewer[a.reviewed_by || '(null)'] || 0) + 1;
  }
  console.log(
    JSON.stringify(
      {
        mode: 'audit',
        total_answers: result.meta.total_answers,
        live_reviewed_by: byReviewer,
        ken_legacy_ids: {
          'david-k-gore-phd': byReviewer['david-k-gore-phd'] || 0,
          'kenneth-w-christian-phd': byReviewer['kenneth-w-christian-phd'] || 0,
        },
        peachtree_contributors: result.contributors.length,
        publishable_contributors: result.contributors.filter((c) => c.publishable).length,
        incomplete_contributors: result.contributors.filter((c) => c.profileStatus === 'incomplete').map((c) => c.id),
        protected: {
          'alex-crenshaw-phd': byReviewer['alex-crenshaw-phd'] || 0,
          'michelle-morris-lpc': byReviewer['michelle-morris-lpc'] || 0,
          'rick-julian': byReviewer['rick-julian'] || 0,
        },
        dry_run_high_only_preview: result.counts,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
