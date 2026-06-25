import { resolveCronSecret } from './supabase-env.mjs';

export function resolveRemoteAdminSecret() {
  const secret = resolveCronSecret();
  if (!secret) {
    throw new Error(
      'Remote apply requires CRON_SECRET. Run `npm run env:sync` once from the repo root; credentials persist in ~/.config/deeper-global/secrets.env.'
    );
  }
  return secret;
}

export async function postAdminApply({ url, body }) {
  const cronSecret = resolveRemoteAdminSecret();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cronSecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? `Remote apply failed with status ${response.status}.`);
  }

  return payload;
}
