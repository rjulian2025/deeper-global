import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const ENV_PATHS = {
  projectLocal: '.env.local',
  vercelProduction: '.vercel/.env.production.local',
  userSecrets: join(homedir(), '.config', 'deeper-global', 'secrets.env'),
};

const LOAD_ORDER = [ENV_PATHS.userSecrets, ENV_PATHS.projectLocal, ENV_PATHS.vercelProduction];

let loaded = false;

export function parseEnvFile(path) {
  if (!existsSync(path)) return {};

  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((line) => !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        if (index === -1) return null;
        const key = line.slice(0, index).trim();
        let value = line.slice(index + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        return [key, value];
      })
      .filter(Boolean)
  );
}

export function loadLocalEnv({ force = false } = {}) {
  if (loaded && !force) return;

  for (const path of LOAD_ORDER) {
    const fileEnv = parseEnvFile(path);
    for (const [key, value] of Object.entries(fileEnv)) {
      if (typeof value === 'string' && value.trim() && !process.env[key]?.trim()) {
        process.env[key] = value.trim();
      }
    }
  }

  loaded = true;
}

export function firstPresent(...values) {
  return values.find((value) => typeof value === 'string' && value.trim());
}

export function resolveSupabaseConfig({ requireWrite = false, loadEnv = true } = {}) {
  if (loadEnv) loadLocalEnv();

  const fileEnvs = Object.fromEntries(
    LOAD_ORDER.flatMap((path) => Object.entries(parseEnvFile(path)))
  );

  const serviceRoleKey = firstPresent(process.env.SUPABASE_SERVICE_ROLE_KEY, fileEnvs.SUPABASE_SERVICE_ROLE_KEY);
  const url = firstPresent(
    process.env.SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    fileEnvs.SUPABASE_URL,
    fileEnvs.PUBLIC_SUPABASE_URL,
    fileEnvs.NEXT_PUBLIC_SUPABASE_URL
  );
  const anonKey = firstPresent(
    process.env.SUPABASE_ANON_KEY,
    process.env.PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    fileEnvs.SUPABASE_ANON_KEY,
    fileEnvs.PUBLIC_SUPABASE_ANON_KEY,
    fileEnvs.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const key = firstPresent(serviceRoleKey, anonKey);

  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Run `npm run env:sync`, or add SUPABASE_URL and SUPABASE_ANON_KEY to `.env.local` or ~/.config/deeper-global/secrets.env.'
    );
  }

  if (requireWrite && !serviceRoleKey) {
    throw new Error(
      'Write access requires SUPABASE_SERVICE_ROLE_KEY. Run `npm run env:init` once, then add the service role key to ~/.config/deeper-global/secrets.env or Vercel Production and run `npm run env:sync`.'
    );
  }

  return { url, key, anonKey, serviceRoleKey };
}

export function resolveCronSecret() {
  loadLocalEnv();
  const fileEnvs = Object.fromEntries(
    LOAD_ORDER.flatMap((path) => Object.entries(parseEnvFile(path)))
  );

  return firstPresent(process.env.CRON_SECRET, process.env.REPORT_CRON_SECRET, fileEnvs.CRON_SECRET, fileEnvs.REPORT_CRON_SECRET);
}

export function envStatus() {
  loadLocalEnv({ force: true });

  const checks = {
    supabase_url: Boolean(firstPresent(process.env.SUPABASE_URL)),
    supabase_anon_key: Boolean(firstPresent(process.env.SUPABASE_ANON_KEY, process.env.PUBLIC_SUPABASE_ANON_KEY)),
    supabase_service_role_key: Boolean(firstPresent(process.env.SUPABASE_SERVICE_ROLE_KEY)),
    cron_secret: Boolean(resolveCronSecret()),
    sources: {
      userSecrets: existsSync(ENV_PATHS.userSecrets),
      projectLocal: existsSync(ENV_PATHS.projectLocal),
      vercelProduction: existsSync(ENV_PATHS.vercelProduction),
    },
  };

  checks.ready_for_read = checks.supabase_url && checks.supabase_anon_key;
  checks.ready_for_write = checks.ready_for_read && checks.supabase_service_role_key;
  checks.ready_for_remote_apply = Boolean(checks.cron_secret);

  return checks;
}
