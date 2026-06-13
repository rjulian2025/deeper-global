#!/usr/bin/env node
import { envStatus, ENV_PATHS } from './lib/supabase-env.mjs';

const status = envStatus();

console.log(
  JSON.stringify(
    {
      files: ENV_PATHS,
      status,
    },
    null,
    2
  )
);

if (!status.ready_for_read) {
  process.exitCode = 1;
}
