#!/usr/bin/env node
/**
 * Local preview for the Psychology Weather Map.
 *
 *   npm run dev:map
 *
 * Requires PUBLIC_MAPBOX_TOKEN in .env.local (client-side public token).
 * Map data comes from src/data/map-signals-seed.json via a local API stub.
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const api = spawn(process.execPath, ['scripts/serve-map-api.mjs'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});

const astro = spawn('npm', ['run', 'dev', '--', '--host', '0.0.0.0'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

function shutdown(code = 0) {
  api.kill('SIGTERM');
  astro.kill('SIGTERM');
  setTimeout(() => process.exit(code), 250);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

api.on('exit', (code) => {
  if (code && code !== 0) shutdown(code);
});

astro.on('exit', (code) => {
  shutdown(code ?? 0);
});
