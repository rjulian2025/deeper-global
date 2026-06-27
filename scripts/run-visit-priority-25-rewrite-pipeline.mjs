#!/usr/bin/env node
/**
 * Visit-priority 25: same pipeline as docs/content-governance.md (June 1099-page rewrite).
 *
 *   Rewrite → Sanitize → Repair → QA → Promote (dry-run) → Promote (--apply)
 *
 * Dry run (rewrite preview only):
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
        contract: 'docs/content-governance.md',
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
  run('1/6 Claude rewrite → staging_* fields', 'node', rewriteArgs);

  if (!args.apply) {
    console.log('\nDry run complete. Re-run with --apply for sanitize → repair → QA → promote.');
    return;
  }

  run('2/6 Sanitize em-dashes in staging', 'node', ['scripts/sanitize-staging-emdash.mjs', '--apply']);

  run('3/6 Repair staging QA issues (25 slugs)', 'node', [
    'scripts/repair-staging-rewrite.mjs',
    '--apply',
    ...slugArgs(slugs),
  ]);

  run('4/6 QA (latest rewrite CSV batch)', 'node', ['scripts/qa-answer-rewrite-batch.mjs']);

  run('5/6 Promote dry-run', 'node', [
    'scripts/promote-answer-rewrite.mjs',
    '--allow-warn',
    ...slugArgs(slugs),
  ]);

  run('6/6 Promote apply → live answer fields', 'node', [
    'scripts/promote-answer-rewrite.mjs',
    '--apply',
    '--allow-warn',
    ...slugArgs(slugs),
  ]);

  console.log('\n✓ Visit-priority 25 rewrite pipeline complete.');
  console.log('  Next: npm run deploy:prod (rebuilds static pages with promoted copy).');
}

try {
  main();
} catch (error) {
  console.error(`\nPipeline failed: ${error.message || error}`);
  process.exit(1);
}
