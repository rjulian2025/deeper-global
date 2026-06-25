#!/usr/bin/env node
/**
 * Apply geo_cache table + map_density_geojson RPC migrations.
 *
 *   npm run db:apply-geo-cache
 *
 * Requires one of:
 *   - SUPABASE_ACCESS_TOKEN (or `supabase login`)
 *   - SUPABASE_DB_PASSWORD + supabase/.temp/pooler-url
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import pg from 'pg';

const { Client } = pg;
const MIGRATION_FILES = [
  'supabase/migrations/20260625000000_map_density_geojson_rpc.sql',
  'supabase/migrations/20260625000001_geo_cache_table.sql',
];
const POOLER_URL_FILE = 'supabase/.temp/pooler-url';
const PROJECT_REF = 'ldizjhrfnxaacedmbujt';

function readAccessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
    return process.env.SUPABASE_ACCESS_TOKEN.trim();
  }

  for (const path of [
    join(homedir(), '.config', 'supabase', 'access-token'),
    join(homedir(), '.supabase', 'access-token'),
  ]) {
    if (existsSync(path)) {
      return readFileSync(path, 'utf8').trim();
    }
  }

  try {
    return execSync('security find-generic-password -s "Supabase CLI" -w', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

async function applyViaManagementApi(sql, name) {
  const token = readAccessToken();
  if (!token) {
    throw new Error('Missing Supabase access token. Run `supabase login` or set SUPABASE_ACCESS_TOKEN.');
  }

  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Management API query failed for ${name} (${response.status}): ${body.slice(0, 500)}`);
  }

  return body;
}

async function applyViaPostgres(sql) {
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!password) {
    throw new Error('Missing SUPABASE_DB_PASSWORD for direct Postgres apply.');
  }

  const connectionString = readFileSync(POOLER_URL_FILE, 'utf8').trim().replace(
    /\/\/postgres:[^@]*@/,
    `//postgres:${encodeURIComponent(password)}@`
  );

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query(sql);
  await client.end();
}

async function verifyGeoCache() {
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  const token = readAccessToken();

  if (password) {
    const connectionString = readFileSync(POOLER_URL_FILE, 'utf8').trim().replace(
      /\/\/postgres:[^@]*@/,
      `//postgres:${encodeURIComponent(password)}@`
    );
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const result = await client.query(`
      select exists (
        select 1 from information_schema.tables
        where table_schema = 'public' and table_name = 'geo_cache'
      ) as geo_cache_exists;
    `);
    await client.end();
    return result.rows[0]?.geo_cache_exists ?? false;
  }

  if (token) {
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `select exists (
          select 1 from information_schema.tables
          where table_schema = 'public' and table_name = 'geo_cache'
        ) as geo_cache_exists;`,
      }),
    });
    const payload = await response.json();
    return payload?.[0]?.geo_cache_exists ?? false;
  }

  return null;
}

async function main() {
  const combinedSql = MIGRATION_FILES.map((file) => readFileSync(file, 'utf8')).join('\n\n');

  if (process.env.SUPABASE_DB_PASSWORD?.trim()) {
    await applyViaPostgres(combinedSql);
    console.log('Applied via Postgres.');
  } else {
    for (const file of MIGRATION_FILES) {
      const sql = readFileSync(file, 'utf8');
      const name = file.split('/').pop();
      await applyViaManagementApi(sql, name);
      console.log(`Applied ${name} via Supabase Management API.`);
    }
  }

  const exists = await verifyGeoCache();
  if (exists === true) {
    console.log('Verified: public.geo_cache exists.');
  } else if (exists === false) {
    console.warn('Warning: geo_cache table not found after apply.');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
