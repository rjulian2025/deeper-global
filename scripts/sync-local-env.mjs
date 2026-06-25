#!/usr/bin/env node
/**
 * Sync local env files for Deeper Global content scripts.
 *
 *   npm run env:sync
 */
import { existsSync, writeFileSync } from 'node:fs';
import { ENV_PATHS, envStatus } from './lib/supabase-env.mjs';
import { runEnvSyncCore } from './lib/bootstrap-local-env.mjs';

const PROJECT_EXAMPLE = '.env.example';

function main() {
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

  const sync = runEnvSyncCore();
  const status = envStatus();

  console.log(
    JSON.stringify(
      {
        vercel_pull: sync.vercel_pull,
        vercel_pull_message: sync.vercel_pull_message,
        files: {
          userSecrets: ENV_PATHS.userSecrets,
          projectLocal: ENV_PATHS.projectLocal,
          vercelProduction: ENV_PATHS.vercelProduction,
        },
        status,
        next_steps: status.ready_for_write || status.ready_for_remote_apply
          ? ['Local credentials are ready. Content apply scripts will reuse stored env automatically.']
          : [
              'Run this command once from the repo root after linking Vercel: npm run env:sync',
              'Credentials persist in ~/.config/deeper-global/secrets.env',
            ],
      },
      null,
      2
    )
  );

  if (!status.ready_for_write && !status.ready_for_remote_apply) {
    process.exitCode = 1;
  }
}

main();
