#!/usr/bin/env node
/**
 * Claude rewrite → QA → repair → em-dash sanitize → promote for visit-priority 25.
 *
 * Dry run (rewrite skipped unless --apply):
 *   npm run content:run-visit-priority-25-rewrite-pipeline
 *
 * Full pipeline:
 *   npm run content:run-visit-priority-25-rewrite-pipeline -- --apply
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const SLUGS_FILE = 'reports/phase-1b/visit-priority/batch-25-slugs.json';

function loadSlugs() {
  const payload = JSON.parse(readFileSync(SLUGS_FILE, 'utf8'));
  if (!Array.isArray(payload.slugs) || !payload.slugs.length) {
    throw new Error(`${SLUGS_FILE} must contain a non-empty slugs array.`);
  }
  return payload.slugs;
}

function run(label, command, args) {
  console.log(`\n→ ${label}`);
  const result = spawnSync(command, args, { stdio: 'inherit', encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`${label} failed (exit ${result.status ?? 'unknown'})`);
  }
}

function parseArgs(argv) {
  return {
    apply: argv.includes('--apply'),
    batchSize: (() => {
      const index = argv.indexOf('--batch-size');
      if (index !== -1 && argv[index + 1]) return argv[index + 1];
      const match = argv.find((arg) => arg.startsWith('--batch-size='));
      return match ? match.slice('--batch-size='.length) : '5';
    })(),
  };
}

function slugArgs(slugs) {
  return slugs.flatMap((slug) => ['--slug', slug]);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const slugs = loadSlugs();

  console.log(
    JSON.stringify(
      {
        pipeline: 'visit-priority-25-rewrite',
        mode: args.apply ? 'apply' : 'dry-run',
        slug_count: slugs.length,
        slugs_file: SLUGS_FILE,
        batch_size: args.batchSize,
      },
      null,
      2
    )
  );

  const rewriteArgs = [
    'scripts/rewrite-answers-claude.mjs',
    '--slugs-file',
    SLUGS_FILE,
    '--batch-size',
    args.batchSize,
  ];
  if (args.apply) rewriteArgs.push('--apply');
  run('Claude rewrite → staging_* fields', 'node', rewriteArgs);

  if (!args.apply) {
    console.log('\nDry run complete. Re-run with --apply to QA, repair, sanitize, and promote.');
    return;
  }

  run('QA staging batch (latest rewrite CSV)', 'node', ['scripts/qa-answer-rewrite-batch.mjs']);

  run('Repair QA issues on staging fields', 'node', [
    'scripts/repair-staging-rewrite.mjs',
    '--apply',
    ...slugArgs(slugs),
  ]);

  run('Re-QA after repair', 'node', ['scripts/qa-answer-rewrite-batch.mjs']);

  run('Sanitize em-dashes in staging fields', 'node', ['scripts/sanitize-staging-emdash.mjs', '--apply']);

  run('Promote staging → live answer fields', 'node', [
    'scripts/promote-answer-rewrite.mjs',
    '--apply',
    '--allow-warn',
    ...slugArgs(slugs),
  ]);

  console.log('\n✓ Visit-priority 25 rewrite pipeline complete.');
  console.log('  Next: npm run deploy:prod (or push to production/astro) to rebuild static answer pages.');
}

try {
  main();
} catch (error) {
  console.error(`\nPipeline failed: ${error.message || error}`);
  process.exit(1);
}
