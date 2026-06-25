#!/usr/bin/env node
/**
 * Minimal local API stub for map preview without `vercel dev`.
 * Serves seed map signals and a placeholder insights response.
 *
 *   node scripts/serve-map-api.mjs
 */
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.MAP_API_PORT ?? 3001);
const SEED_FILE = join(dirname(fileURLToPath(import.meta.url)), '../src/data/map-signals-seed.json');

const seedSignals = JSON.parse(readFileSync(SEED_FILE, 'utf8'));

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`);

  if (url.pathname === '/api/map-signals') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(seedSignals));
    return;
  }

  if (url.pathname === '/api/insights') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      insights: [
        'Anxiety & Stress signals remain elevated across major US metros in seed data.',
        'Grief & Loss clusters appear in the Northeast and Pacific Northwest.',
        'Local preview uses seed data; production pulls live SerpAPI trend sync.',
      ],
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`map api stub listening on http://127.0.0.1:${PORT}`);
});
