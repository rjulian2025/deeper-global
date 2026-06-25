import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ENV_PATHS, envStatus, loadLocalEnv, parseEnvFile } from './supabase-env.mjs';
import { ensureVercelEnv, fetchSupabaseServiceRoleKey } from './fetch-supabase-service-role.mjs';

const USER_DIR = join(homedir(), '.config', 'deeper-global');
const USER_EXAMPLE = join(USER_DIR, 'secrets.env.example');

function mergeEnvFiles(...paths) {
  const merged = new Map();

  for (const path of paths) {
    for (const [key, value] of Object.entries(parseEnvFile(path))) {
      if (typeof value === 'string' && value.trim()) {
        merged.set(key, value.trim());
      }
    }
  }

  return merged;
}

function writeEnvFile(path, envMap) {
  const lines = ['# Managed by npm run env:sync', ''];
  for (const [key, value] of envMap.entries()) {
    lines.push(`${key}="${value.replace(/"/g, '\\"')}"`);
  }
  writeFileSync(path, `${lines.join('\n')}\n`);
}

function ensureExamples() {
  mkdirSync(USER_DIR, { recursive: true });

  if (!existsSync(USER_EXAMPLE)) {
    writeFileSync(
      USER_EXAMPLE,
      `# Copy to ${ENV_PATHS.userSecrets}
SUPABASE_SERVICE_ROLE_KEY=""
CRON_SECRET=""
`
    );
  }
}

function tryVercelPull() {
  const result = spawnSync(
    'vercel',
    ['env', 'pull', ENV_PATHS.projectLocal, '--environment=production', '--yes'],
    { encoding: 'utf8' }
  );

  return {
    ok: result.status === 0,
    stdout: result.stdout?.trim() ?? '',
    stderr: result.stderr?.trim() ?? '',
  };
}

export function runEnvSyncCore() {
  ensureExamples();

  const vercelPull = tryVercelPull();
  let merged = mergeEnvFiles(ENV_PATHS.vercelProduction, ENV_PATHS.projectLocal, ENV_PATHS.userSecrets);

  if (!merged.get('SUPABASE_SERVICE_ROLE_KEY')) {
    const fetched = fetchSupabaseServiceRoleKey();
    if (fetched.ok) {
      merged.set('SUPABASE_SERVICE_ROLE_KEY', fetched.key);
      ensureVercelEnv('SUPABASE_SERVICE_ROLE_KEY', fetched.key, 'production');
    }
  }

  if (merged.size > 0) {
    writeEnvFile(ENV_PATHS.userSecrets, merged);
    writeEnvFile(ENV_PATHS.projectLocal, merged);
  }

  loadLocalEnv({ force: true });

  return {
    vercel_pull: vercelPull.ok ? 'ok' : 'skipped_or_failed',
    vercel_pull_message: vercelPull.ok ? vercelPull.stdout : vercelPull.stderr,
    status: envStatus(),
  };
}

export function bootstrapLocalEnv({ quiet = false } = {}) {
  loadLocalEnv({ force: true });
  let status = envStatus();

  if (status.ready_for_read || status.ready_for_remote_apply) {
    return status;
  }

  if (!quiet) {
    console.error('Refreshing local credentials from stored env files and Vercel production...');
  }

  runEnvSyncCore();
  return envStatus();
}
