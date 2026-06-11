import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';
import pg from 'pg';

const { Client } = pg;
const MIGRATION_FILE = 'supabase/migrations/20260430150000_structured_content.sql';
const POOLER_URL_FILE = 'supabase/.temp/pooler-url';

async function readPassword() {
  if (process.env.SUPABASE_DB_PASSWORD) return process.env.SUPABASE_DB_PASSWORD;

  return new Promise((resolve) => {
    let value = '';
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk) => {
      value += chunk;
    });
    stdin.on('end', () => resolve(value.trim()));
  });
}

function connectionStringWithPassword(password) {
  const url = new URL(readFileSync(POOLER_URL_FILE, 'utf8').trim());
  url.password = password;
  return url.toString();
}

const password = await readPassword();

if (!password) {
  throw new Error('Missing Supabase database password on stdin or SUPABASE_DB_PASSWORD.');
}

const client = new Client({
  connectionString: connectionStringWithPassword(password),
  ssl: {
    rejectUnauthorized: false,
  },
});

await client.connect();
await client.query(readFileSync(MIGRATION_FILE, 'utf8'));

const verification = await client.query(`
  select
    exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = 'answer_enrichment_drafts'
    ) as has_draft_table,
    count(*) filter (
      where column_name in (
        'improved_title',
        'improved_meta_description',
        'improved_summary',
        'answer_sections',
        'key_takeaways',
        'care_note',
        'related_questions',
        'suggested_schema_question',
        'suggested_schema_answer',
        'primary_theme',
        'related_themes',
        'citation_notes',
        'content_prompt_version',
        'content_enriched_at',
        'review_status',
        'reviewed_by',
        'source_refs',
        'primary_entities',
        'related_entities'
      )
    ) as structured_question_columns
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'questions_master';
`);

console.log(JSON.stringify(verification.rows[0], null, 2));

await client.end();
