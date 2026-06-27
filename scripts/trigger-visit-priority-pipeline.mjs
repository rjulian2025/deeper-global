#!/usr/bin/env node
/**
 * Trigger the durable GitHub Actions pipeline executor.
 * Cloud agents do not need Supabase or Anthropic keys; only gh CLI auth to the repo.
 *
 *   node scripts/trigger-visit-priority-pipeline.mjs
 *   node scripts/trigger-visit-priority-pipeline.mjs --apply
 */
import { spawnSync } from 'node:child_process';

function parseArgs(argv) {
  return {
    apply: argv.includes('--apply'),
    rewriteOnlyUnstaged: argv.includes('--rewrite-only-unstaged'),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const ghArgs = [
    'workflow',
    'run',
    'visit-priority-pipeline.yml',
    '-f',
    `apply=${args.apply}`,
    '-f',
    `rewrite_only_unstaged=${args.rewriteOnlyUnstaged}`,
  ];

  const result = spawnSync('gh', ghArgs, { encoding: 'utf8', stdio: 'inherit' });

  if (result.status !== 0) {
    console.error(`
Failed to trigger GitHub Actions workflow.

Prerequisites (one-time):
  1. VERCEL_TOKEN in GitHub → Settings → Secrets → Actions
  2. gh CLI authenticated: gh auth login

After setup, merging *-drafts.json to production/astro auto-applies.
Manual trigger is only needed for dry-runs or overrides.
`);
    process.exit(result.status ?? 1);
  }

  console.error('Workflow triggered. Track progress in GitHub Actions.');
}

main();
