#!/usr/bin/env node
/**
 * Sync local env files for Deeper Global content scripts.
 *
 *   npm run env:sync
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ENV_PATHS, envStatus, parseEnvFile } from './lib/supabase-env.mjs';
import { ensureVercelEnv, fetchSupabaseServiceRoleKey } from './lib/fetch-supabase-service-role.mjs';

const USER_DIR = join(homedir(), '.config', 'deeper-global');
const USER_EXAMPLE = join(USER_DIR, 'secrets.env.example');
const PROJECT_EXAMPLE = '.env.example';

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

function commandExists(command) {
  return spawnSync('sh', ['-lc', `command -v ${command}`], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).status === 0;
}

function vercelCliCommand() {
  if (commandExists('vercel')) {
    return { command: 'vercel', baseArgs: [] };
  }

  if (process.env.VERCEL_TOKEN?.trim()) {
    return { command: 'npx', baseArgs: ['--yes', 'vercel@latest'] };
  }

  return null;
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

  if (!existsSync(PROJECT_EXAMPLE)) {
    writeFileSync(
      PROJECT_EXAMPLE,
      `# Local project overrides (gitignored via .env*)
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
PUBLIC_SUPABASE_URL=""
PUBLIC_SUPABASE_ANON_KEY=""
`
    );
  }
}

function tryVercelPull() {
  const cli = vercelCliCommand();
  if (!cli) {
    return {
      ok: false,
      stdout: '',
      stderr: 'Vercel CLI is not installed and VERCEL_TOKEN is not set. Install vercel, run vercel login, or set VERCEL_TOKEN for non-interactive env pulls.',
    };
  }

  const args = [...cli.baseArgs, 'env', 'pull', ENV_PATHS.projectLocal, '--environment=production', '--yes'];
  if (process.env.VERCEL_TOKEN?.trim()) {
    args.push('--token', process.env.VERCEL_TOKEN.trim());
  }

  const result = spawnSync(
    cli.command,
    args,
    {
      encoding: 'utf8',
      env: { ...process.env, CI: '1' },
    }
  );

  return {
    ok: result.status === 0,
    stdout: result.stdout?.trim() ?? '',
    stderr: result.stderr?.trim() ?? '',
  };
}

function main() {
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

  const status = envStatus();

  console.log(
    JSON.stringify(
      {
        vercel_pull: vercelPull.ok ? 'ok' : 'skipped_or_failed',
        vercel_pull_message: vercelPull.ok ? vercelPull.stdout : vercelPull.stderr,
        files: {
          userSecrets: ENV_PATHS.userSecrets,
          projectLocal: ENV_PATHS.projectLocal,
          vercelProduction: ENV_PATHS.vercelProduction,
        },
        status,
        next_steps: status.ready_for_write
          ? ['Local write access is ready. Run content promote scripts without inline env vars.']
          : [
              'Add SUPABASE_SERVICE_ROLE_KEY once to ~/.config/deeper-global/secrets.env',
              'Source: https://supabase.com/dashboard/project/ldizjhrfnxaacedmbujt/settings/api',
              'Optional: also add the same key in Vercel Production, then rerun npm run env:sync',
            ],
      },
      null,
      2
    )
  );

  if (!status.ready_for_write) {
    process.exitCode = 1;
  }
}

main();
