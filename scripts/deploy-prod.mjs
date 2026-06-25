#!/usr/bin/env node
/**
 * Production deploy for Deeper Global (www.deeper.global).
 *
 *   npm run deploy:prod
 *   npm run deploy:prod -- --skip-build
 *
 * Prerequisites (one-time on your machine):
 *   1. vercel login
 *   2. vercel link --project deeper-global-h65m   (from repo root)
 *   3. npm run env:sync
 *
 * After push to production/astro, GitHub Actions also deploys automatically when
 * VERCEL_TOKEN is set in repository secrets (see .github/workflows/deploy-production.yml).
 */
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const VERCEL_PROJECT_JSON = join(ROOT, '.vercel', 'project.json');

function parseArgs(argv) {
  return {
    skipBuild: argv.includes('--skip-build'),
    skipEnv: argv.includes('--skip-env'),
  };
}

function run(command, args, { label = command } = {}) {
  console.log(`\n→ ${label}`);
  const result = spawnSync(command, args, { stdio: 'inherit', encoding: 'utf8', cwd: ROOT });
  if (result.status !== 0) {
    throw new Error(`${label} failed (exit ${result.status ?? 'unknown'})`);
  }
}

function hasVercelAuth() {
  if (process.env.VERCEL_TOKEN?.trim()) return true;

  const whoami = spawnSync('vercel', ['whoami'], { encoding: 'utf8' });
  return whoami.status === 0;
}

function readLinkedProject() {
  if (!existsSync(VERCEL_PROJECT_JSON)) return null;
  try {
    const parsed = JSON.parse(readFileSync(VERCEL_PROJECT_JSON, 'utf8'));
    return parsed?.projectId ? parsed : null;
  } catch {
    return null;
  }
}

function printSetupHelp() {
  console.error(`
Production deploy needs Vercel CLI auth and a linked project.

One-time setup (from repo root):
  vercel login
  vercel link --project deeper-global-h65m
  npm run env:sync

Then deploy:
  npm run deploy:prod

Or push to production/astro and let GitHub Actions deploy (requires VERCEL_TOKEN secret).
`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const branch = spawnSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).stdout.trim();
  const linked = readLinkedProject();

  console.log(
    JSON.stringify(
      {
        step: 'preflight',
        branch,
        linked_project: linked?.projectId ?? null,
        vercel_auth: hasVercelAuth(),
        skip_build: args.skipBuild,
      },
      null,
      2
    )
  );

  if (!args.skipEnv) {
    const envSync = spawnSync('node', ['scripts/sync-local-env.mjs'], {
      stdio: 'inherit',
      encoding: 'utf8',
      cwd: ROOT,
    });
    if (envSync.status !== 0) {
      console.warn('\n⚠ env:sync did not complete; continuing deploy (Vercel auth is enough for the site).');
    }
  }

  if (!args.skipBuild) {
    run('npm', ['run', 'check'], { label: 'Build check (npm run check)' });
  }

  if (!hasVercelAuth()) {
    printSetupHelp();
    process.exit(1);
  }

  if (!linked && !process.env.VERCEL_PROJECT_ID) {
    console.error('\nNo .vercel/project.json found. Run: vercel link --project deeper-global-h65m');
    printSetupHelp();
    process.exit(1);
  }

  run('vercel', ['deploy', '--prod', '--yes'], { label: 'Deploy to production (vercel deploy --prod)' });

  console.log('\n✓ Production deploy complete.');
  console.log('  Site: https://www.deeper.global');
}

try {
  main();
} catch (error) {
  console.error(`\nDeploy failed: ${error.message || error}`);
  console.error('\nIf the Vercel build failed on CRON_SECRET, see docs/secrets-management.md');
  process.exit(1);
}
