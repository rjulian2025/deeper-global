#!/usr/bin/env node
/**
 * Run the visit-priority content pipeline without local-only setup.
 *
 * Dry run (default):
 *   npm run content:run-visit-priority-pipeline
 *
 * Apply to production (direct Supabase write or secured production admin API):
 *   npm run content:run-visit-priority-pipeline -- --apply
 *
 * Credentials resolve automatically from:
 *   1. Injected cloud/CI env vars (Cursor Secrets, GitHub Actions)
 *   2. Stored env files from prior env:sync
 *   3. Vercel production env pull during bootstrap
 *
 * When only CRON_SECRET is available, calls:
 *   https://www.deeper.global/api/admin/run-visit-priority-pipeline
 */
import { bootstrapCloudEnv, credentialMode } from './lib/cloud-env.mjs';
import { runVisitPriorityPipelineWithFallback } from './lib/remote-pipeline.mjs';

function parseArgs(argv) {
  return {
    apply: argv.includes('--apply'),
    rewriteOnlyUnstaged: argv.includes('--rewrite-only-unstaged'),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const status = bootstrapCloudEnv();
  const mode = credentialMode(status);

  console.error(
    JSON.stringify(
      {
        credential_mode: mode,
        ready_for_write: status.ready_for_write,
        ready_for_remote_apply: status.ready_for_remote_apply,
      },
      null,
      2
    )
  );

  const report = await runVisitPriorityPipelineWithFallback({
    apply: args.apply,
    rewriteOnlyUnstaged: args.rewriteOnlyUnstaged,
  });

  console.log(JSON.stringify(report, null, 2));

  if (args.apply && report.net_new_inserted === 0 && report.rewrite_processed === 0) {
    console.error('Pipeline completed with no new inserts and no rewrites processed (likely already applied).');
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
