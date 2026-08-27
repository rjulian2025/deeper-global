#!/usr/bin/env node
/**
 * Read a single key from .vercel/.env.production.local (CI only).
 * Usage: node .github/scripts/read-vercel-env.mjs CRON_SECRET
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseEnvFile } from '../../scripts/lib/supabase-env.mjs';

const key = process.argv[2];
if (!key) {
  console.error('Usage: read-vercel-env.mjs <KEY>');
  process.exit(1);
}

const envPath = join(process.cwd(), '.vercel', '.env.production.local');
if (!existsSync(envPath)) {
  console.error(`Missing ${envPath}. Run pull-vercel-production-env.sh first.`);
  process.exit(1);
}

const value = parseEnvFile(envPath)[key]?.trim() ?? '';
if (!value) {
  console.error(`::error::${key} is missing or empty in Vercel production env.`);
  process.exit(1);
}

process.stdout.write(value);
