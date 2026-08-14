#!/usr/bin/env node
/**
 * Phase C apply: additive attribution schema + clinical contributor backfill.
 *
 * Dry run:
 *   npm run reviewers:apply
 *
 * Apply:
 *   npm run reviewers:apply -- --apply
 *
 * Uses local SUPABASE_SERVICE_ROLE_KEY when available; otherwise falls back to
 * production admin API with CRON_SECRET (after C0 deploy of the admin endpoint).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { bootstrapCloudEnv, assertPipelineCredentials, credentialMode } from './lib/cloud-env.mjs';
import { postAdminApply } from './lib/remote-admin-request.mjs';
import { envStatus, resolveSupabaseConfig } from './lib/supabase-env.mjs';
import {
  loadApplyPackages,
  runClinicalAttributionApply,
} from './lib/reviewers/apply-clinical-attribution.mjs';

const DEFAULT_REMOTE_URL = 'https://www.deeper.global/api/admin/apply-clinical-attribution';
const OUT_DIR = 'reports/reviewer-migration';

function parseArgs(argv) {
  const args = {
    apply: false,
    remoteUrl: process.env.DGP_APPLY_CLINICAL_ATTRIBUTION_URL ?? DEFAULT_REMOTE_URL,
    forceRemote: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') args.apply = true;
    if (arg === '--force-remote') args.forceRemote = true;
    if (arg === '--remote') {
      args.remoteUrl = argv[i + 1] ?? DEFAULT_REMOTE_URL;
      i += 1;
    }
    if (arg.startsWith('--remote=')) args.remoteUrl = arg.slice('--remote='.length);
  }
  return args;
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function applyLocally({ apply }) {
  const config = resolveSupabaseConfig({ requireWrite: true });
  const supabase = createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false },
  });
  const report = await runClinicalAttributionApply({ supabase, apply, root: process.cwd() });
  return { ...report, apply_path: 'local_service_role' };
}

async function applyRemotely({ apply, remoteUrl }) {
  const packages = loadApplyPackages();
  const migrationPath = 'supabase/migrations/20260716210000_clinical_attribution_model.sql';
  const migrationSql = existsSync(migrationPath)
    ? readFileSync(migrationPath, 'utf8')
    : undefined;
  const payload = await postAdminApply({
    url: remoteUrl,
    body: {
      apply,
      high: packages.high,
      editorial: packages.editorial,
      migration_sql: migrationSql,
    },
  });
  return { ...payload, apply_path: payload.apply_path || 'remote_admin' };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const status = bootstrapCloudEnv();
  assertPipelineCredentials(status);

  let report;
  const mode = credentialMode(status);

  if (!args.forceRemote && mode === 'direct_write') {
    report = await applyLocally({ apply: args.apply });
  } else if (mode === 'remote_admin' || args.forceRemote) {
    console.error('Using CRON_SECRET → production admin API for clinical attribution apply.');
    report = await applyRemotely({ apply: args.apply, remoteUrl: args.remoteUrl });
  } else {
    // direct_write unavailable; try local then remote fallback message
    try {
      report = await applyLocally({ apply: args.apply });
    } catch (error) {
      if (!status.ready_for_remote_apply) throw error;
      console.error(`Local apply failed (${error.message}); falling back to remote admin API.`);
      report = await applyRemotely({ apply: args.apply, remoteUrl: args.remoteUrl });
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/phase-c-apply-${stamp()}.json`;
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: report.mode,
        apply_path: report.apply_path,
        schema: report.schema,
        counts: report.counts,
        applied: report.applied,
        verification: report.verification,
        report: reportPath,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  const status = envStatus();
  console.error(error.message ?? error);
  if (!status.ready_for_write && !status.ready_for_remote_apply) {
    console.error(
      'Need SUPABASE_SERVICE_ROLE_KEY (preferred) or CRON_SECRET for remote admin apply after C0 deploy.'
    );
  }
  process.exit(1);
});
