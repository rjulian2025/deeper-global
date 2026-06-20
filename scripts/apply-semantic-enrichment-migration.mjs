#!/usr/bin/env node
/**
 * Apply semantic_enrichment_v1 JSONB column migration.
 *
 *   npm run db:apply-semantic-enrichment
 *
 * Requires `supabase login` or SUPABASE_ACCESS_TOKEN, or SUPABASE_DB_PASSWORD.
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import pg from 'pg';

const { Client } = pg;
const MIGRATION_FILE = 'docs/supabase-semantic-enrichment-v1.sql';
const POOLER_URL_FILE = 'supabase/.temp/pooler-url';
const PROJECT_REF = 'ldizjhrfnxaacedmbujt';

function readAccessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
    return process.env.SUPABASE_ACCESS_TOKEN.trim();
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

async function applyViaManagementApi(sql) {
  const token = readAccessToken();
  if (!token) {
    throw new Error('Missing Supabase access token. Run `supabase login` or set SUPABASE_ACCESS_TOKEN.');
  }

  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/migrations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'semantic_enrichment_v1_column',
      query: sql,
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Management API query failed (${response.status}): ${body.slice(0, 500)}`);
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

  const verification = await client.query(`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'questions_master'
      and column_name = 'semantic_enrichment_v1';
  `);

  await client.end();
  return verification.rows;
}

async function main() {
  const sql = readFileSync(MIGRATION_FILE, 'utf8');

  if (process.env.SUPABASE_DB_PASSWORD?.trim()) {
    const rows = await applyViaPostgres(sql);
    console.log('Applied via Postgres. Column present:', rows.length > 0);
    return;
  }

  const result = await applyViaManagementApi(sql);
  console.log('Applied via Supabase Management API.');
  console.log(result.slice(0, 300));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
