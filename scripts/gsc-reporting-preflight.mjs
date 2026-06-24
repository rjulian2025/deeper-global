#!/usr/bin/env node
import { envStatus, ENV_PATHS } from './lib/supabase-env.mjs';

const REQUIRED_FOR_REFRESH = [
  {
    key: 'supabase_url',
    label: 'SUPABASE_URL',
    action: 'Add SUPABASE_URL to .env.local, Vercel production env, or ~/.config/deeper-global/secrets.env.',
  },
  {
    key: 'supabase_anon_key',
    label: 'SUPABASE_ANON_KEY',
    action: 'Add SUPABASE_ANON_KEY or PUBLIC_SUPABASE_ANON_KEY so the report can read answer rows.',
  },
  {
    key: 'gsc_credentials',
    label: 'GSC credentials',
    action: 'Configure GSC_PROXY_URL and GSC_PROXY_SECRET, or approved GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY credentials.',
  },
];

function missingChecks(status) {
  return REQUIRED_FOR_REFRESH.filter((item) => !status[item.key]).map(({ label, action }) => ({ label, action }));
}

const status = envStatus();
const missing = missingChecks(status);
const ready = status.ready_for_gsc_content_ops;

console.log(
  JSON.stringify(
    {
      ok: ready,
      ready_for_gsc_content_ops: ready,
      env_files: ENV_PATHS,
      sources_present: status.sources,
      checks: {
        supabase_url: status.supabase_url,
        supabase_anon_key: status.supabase_anon_key,
        gsc_proxy_credentials: status.gsc_proxy_credentials,
        gsc_key_credentials: status.gsc_key_credentials,
        gsc_credentials: status.gsc_credentials,
      },
      missing,
      next_command: ready ? 'npm run content:gsc-weekly-plan' : null,
    },
    null,
    2
  )
);

if (!ready) {
  process.exitCode = 1;
}
