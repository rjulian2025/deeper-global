import { spawnSync } from 'node:child_process';

const DEFAULT_PROJECT_REF = 'ldizjhrfnxaacedmbujt';

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
  const result = spawnSync('vercel', ['env', 'add', name, environment], {
    encoding: 'utf8',
    input: `${value}\n`,
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
