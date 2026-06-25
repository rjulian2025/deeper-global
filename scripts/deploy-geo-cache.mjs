#!/usr/bin/env node
/**
 * Full geo_cache deploy: apply migrations, then run geocode backfill.
 *
 *   npm run deploy:geo-cache
 *   npm run deploy:geo-cache -- --dry-run
 *
 * Prerequisites (via npm run env:sync or ~/.config/deeper-global/secrets.env):
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - SUPABASE_ACCESS_TOKEN or SUPABASE_DB_PASSWORD (for migration apply)
 *   - PUBLIC_MAPBOX_TOKEN
 */
import { spawnSync } from 'node:child_process';
import { loadLocalEnv, envStatus } from './lib/supabase-env.mjs';

function run(label, args) {
  console.log(`\n→ ${label}`);
  const result = spawnSync('node', args, { stdio: 'inherit', encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`${label} failed (exit ${result.status})`);
  }
}

function main() {
  loadLocalEnv({ force: true });
  const status = envStatus();
  const extraArgs = process.argv.slice(2);

  console.log(JSON.stringify({ step: 'preflight', status }, null, 2));

  if (!status.ready_for_write) {
    console.error('\nMissing write credentials. Run: npm run env:sync');
    console.error('Or add SUPABASE_SERVICE_ROLE_KEY to ~/.config/deeper-global/secrets.env');
    process.exit(1);
  }

  const dryRun = extraArgs.includes('--dry-run');

  run('Apply geo_cache migrations', ['scripts/apply-geo-cache-migration.mjs']);

  if (dryRun) {
    run('Dry-run geocode backfill', ['scripts/run-geocode-backfill.mjs', '--dry-run']);
  } else {
    run('Geocode backfill', ['scripts/run-geocode-backfill.mjs', ...extraArgs.filter((a) => a !== '--dry-run')]);
  }

  console.log('\n✓ geo_cache deploy complete.');
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
