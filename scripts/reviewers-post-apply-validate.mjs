#!/usr/bin/env node
/**
 * Post-apply validation for clinical attribution migration.
 * When Supabase credentials exist, verifies live counts. Otherwise reports package readiness only.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { bootstrapCloudEnv, credentialMode } from './lib/cloud-env.mjs';
import { resolveSupabaseConfig, envStatus } from './lib/supabase-env.mjs';
import { loadApplyPackages, verifyApply } from './lib/reviewers/apply-clinical-attribution.mjs';

const APPLY = 'reports/reviewer-migration/apply-package';
const OUT = 'reports/reviewer-migration';

async function main() {
  const ready =
    existsSync(join(APPLY, 'clinical-contributor-backfill-all-high.json')) &&
    existsSync(join(APPLY, 'editorial-transition-145.json')) &&
    existsSync(join(APPLY, 'rollback-mapping.json'));

  if (!ready) {
    console.log(JSON.stringify({ ok: false, error: 'package_not_ready' }, null, 2));
    process.exitCode = 1;
    return;
  }

  const packages = loadApplyPackages();
  const status = bootstrapCloudEnv({ quiet: true });
  const mode = credentialMode(status);

  if (mode !== 'direct_write') {
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: 'post-apply-validate-package-only',
          production_query_executed: false,
          package_ready: true,
          high_package_count: packages.high.count,
          editorial_package_count: packages.editorial.count,
          credential_mode: mode,
          note: 'Set SUPABASE_SERVICE_ROLE_KEY to verify live DB counts.',
        },
        null,
        2
      )
    );
    return;
  }

  const config = resolveSupabaseConfig({ requireWrite: true });
  const supabase = createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false },
  });

  const highIds = packages.high.rows.map((r) => r.answer_id);
  const editorialIds = packages.editorial.rows.map((r) => r.answer_id);
  const verification = await verifyApply(supabase, { highIds, editorialIds });

  const report = {
    ok: verification.ok,
    mode: 'post-apply-validate-live',
    production_query_executed: true,
    package_ready: true,
    high_package_count: packages.high.count,
    editorial_package_count: packages.editorial.count,
    verification,
    env: envStatus(),
  };

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'post-apply-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (!verification.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
