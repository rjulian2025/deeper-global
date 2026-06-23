import { spawnSync } from 'node:child_process';

const DEFAULT_PROJECT_REF = 'ldizjhrfnxaacedmbujt';

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

function extractJson(stdout) {
  const text = stdout.trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  return JSON.parse(text.slice(start, end + 1));
}

export function fetchSupabaseServiceRoleKey(projectRef = DEFAULT_PROJECT_REF) {
  const result = spawnSync('npx', ['supabase', 'projects', 'api-keys', '--project-ref', projectRef], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    return {
      ok: false,
      error: result.stderr?.trim() || result.stdout?.trim() || 'Supabase CLI api-keys command failed.',
    };
  }

  const payload = extractJson(result.stdout ?? '');
  const serviceRole = payload?.keys?.find((key) => key.name === 'service_role' || key.id === 'service_role');

  if (!serviceRole?.api_key?.trim()) {
    return { ok: false, error: 'Supabase CLI returned no service_role key.' };
  }

  return { ok: true, key: serviceRole.api_key.trim(), projectRef };
}

export function ensureVercelEnv(name, value, environment = 'production') {
  const cli = vercelCliCommand();
  if (!cli) {
    return {
      ok: false,
      error: 'Vercel CLI is not installed and VERCEL_TOKEN is not set. Cannot update Vercel env non-interactively.',
    };
  }

  const args = [...cli.baseArgs, 'env', 'add', name, environment];
  if (process.env.VERCEL_TOKEN?.trim()) {
    args.push('--token', process.env.VERCEL_TOKEN.trim());
  }

  const result = spawnSync(cli.command, args, {
    encoding: 'utf8',
    input: `${value}\n`,
    env: { ...process.env, CI: '1' },
  });

  if (result.status === 0) {
    return { ok: true, action: 'added' };
  }

  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.toLowerCase();
  if (output.includes('already exists') || output.includes('existing')) {
    return { ok: true, action: 'exists' };
  }

  return {
    ok: false,
    error: result.stderr?.trim() || result.stdout?.trim() || `Failed to add ${name} to Vercel.`,
  };
}
