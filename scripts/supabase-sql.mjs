import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PROJECT_REF = 'ldizjhrfnxaacedmbujt';

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1];
}

function getAccessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;

  try {
    return execFileSync('security', ['find-generic-password', '-s', 'Supabase CLI', '-a', 'access-token', '-w'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    throw new Error('Missing SUPABASE_ACCESS_TOKEN. Set it before running Supabase SQL from this environment.');
  }
}

const file = getArg('--file');
const inlineQuery = getArg('--query');
const query = file ? readFileSync(file, 'utf8') : inlineQuery;

if (!query) {
  console.error('Usage: node scripts/supabase-sql.mjs --file path.sql');
  console.error('   or: node scripts/supabase-sql.mjs --query "select 1"');
  process.exit(1);
}

let accessToken;
try {
  accessToken = getAccessToken();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query,
  }),
});

const text = await response.text();

if (!response.ok) {
  console.error(text);
  process.exit(1);
}

try {
  const json = JSON.parse(text);
  console.log(JSON.stringify(json, null, 2));
} catch {
  console.log(text);
}
