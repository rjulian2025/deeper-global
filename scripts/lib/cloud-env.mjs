import { envStatus, loadLocalEnv } from './supabase-env.mjs';
import { runEnvSyncCore } from './bootstrap-local-env.mjs';

/**
 * Bootstrap credentials for cloud agents and CI.
 * Prefers injected process.env (Cursor Secrets / GitHub Actions), then stored env files, then Vercel pull.
 */
export function bootstrapCloudEnv({ quiet = false, refresh = false } = {}) {
  loadLocalEnv({ force: true });
  let status = envStatus();

  if (!refresh && (status.ready_for_write || status.ready_for_remote_apply)) {
    return status;
  }

  if (!quiet) {
    console.error('Bootstrapping cloud credentials (env vars, stored files, Vercel production pull)...');
  }

  runEnvSyncCore();
  return envStatus();
}

export function credentialMode(status = envStatus()) {
  if (status.ready_for_write) return 'direct_write';
  if (status.ready_for_remote_apply) return 'remote_admin';
  return 'missing';
}

export function assertPipelineCredentials(status = envStatus()) {
  const mode = credentialMode(status);
  if (mode === 'missing') {
    throw new Error(
      [
        'Content pipeline credentials are not configured in this environment.',
        'Add Cursor Cloud Agent secrets (cursor.com/dashboard):',
        '  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (preferred), or CRON_SECRET for remote admin API fallback.',
        'Optional for rewrite lane: ANTHROPIC_API_KEY (direct) or rely on Vercel production admin API.',
      ].join('\n')
    );
  }
  return mode;
}
