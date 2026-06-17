#!/usr/bin/env node
/**
 * QA the latest answer-rewrite batch CSV against staging content in Supabase.
 *
 *   npm run content:qa-answer-rewrite
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { evaluateStagingRewrite } from './lib/answer-rewrite-qa.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/answer-rewrite';

function latestCsvPath() {
  const files = readdirSync(OUT_DIR)
    .filter((name) => name.startsWith('rewrite-run-') && name.endsWith('.csv'))
    .map((name) => ({ name, mtime: statSync(join(OUT_DIR, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  if (!files.length) throw new Error(`No rewrite-run CSV found in ${OUT_DIR}/`);
  return join(OUT_DIR, files[0].name);
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { current += '"'; i += 1; }
        else if (ch === '"') inQuotes = false;
        else current += ch;
      } else if (ch === '"') inQuotes = true;
      else if (ch === ',') { values.push(current); current = ''; }
      else current += ch;
    }
    values.push(current);
    return Object.fromEntries(headers.map((h, idx) => [h, values[idx] ?? '']));
  });
}

function truncate(text, max = 60) {
  const t = String(text ?? '').trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

async function main() {
  const csvPath = latestCsvPath();
  const runTimestamp = csvPath.split('/').pop().replace('rewrite-run-', '').replace('.csv', '');
  const csvRows = parseCsv(readFileSync(csvPath, 'utf8'));
  const ids = csvRows.filter((r) => r.status === 'success').map((r) => r.record_id);

  if (!ids.length) throw new Error('No successful rows in CSV.');

  const { url, key } = resolveSupabaseConfig();
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('questions_master')
    .select('id,slug,question,staging_primary_term,staging_canonical_answer,staging_lede,staging_key_takeaways,staging_what_you_might_be_experiencing,staging_what_can_help,staging_when_to_reach_out,staging_rewrite_error')
    .in('id', ids);

  if (error) throw new Error(error.message);

  const byId = new Map((data ?? []).map((row) => [String(row.id), row]));
  const results = ids.map((id) => ({ id, row: byId.get(String(id)), ...evaluateStagingRewrite(byId.get(String(id)) ?? {}) }));

  const pass = results.filter((r) => r.score === 'PASS').length;
  const warn = results.filter((r) => r.score === 'WARN').length;
  const fail = results.filter((r) => r.score === 'FAIL').length;

  console.log('BATCH QA REPORT');
  console.log(`Run timestamp: ${runTimestamp}`);
  console.log(`Records reviewed: ${results.length}`);
  console.log(`Pass: ${pass} | Warn: ${warn} | Fail: ${fail}`);
  console.log('');

  const failures = results.flatMap((r) => (r.issues ?? []).filter((i) => i.severity === 'FAIL').map((i) => ({ ...r, issue: i })));
  const warnings = results.flatMap((r) => (r.issues ?? []).filter((i) => i.severity === 'WARN').map((i) => ({ ...r, issue: i })));

  console.log('─── FAILURES ───');
  if (!failures.length) console.log('(none)');
  for (const item of failures) {
    console.log(`Row ${item.id} — ${truncate(item.row?.question)}`);
    console.log(`  Field: ${item.issue.field}`);
    console.log(`  Issue: ${item.issue.issue}`);
    console.log('  Severity: FAIL');
    console.log(`  Recommended action: ${item.issue.action}`);
    console.log('');
  }

  console.log('─── WARNINGS ───');
  if (!warnings.length) console.log('(none)');
  for (const item of warnings) {
    console.log(`Row ${item.id} — ${truncate(item.row?.question)}`);
    console.log(`  Field: ${item.issue.field}`);
    console.log(`  Issue: ${item.issue.issue}`);
    console.log('  Severity: WARN');
    console.log('');
  }

  const patterns = new Map();
  for (const item of [...failures, ...warnings]) {
    const key = `${item.issue.field}::${item.issue.issue.split(':')[0]}`;
    patterns.set(key, (patterns.get(key) ?? 0) + 1);
  }
  const recurring = [...patterns.entries()].filter(([, count]) => count >= 3);

  console.log('─── SYSTEM PROMPT OBSERVATIONS ───');
  if (!recurring.length) console.log('(no patterns in 3+ rows)');
  for (const [key, count] of recurring) {
    const [field, issue] = key.split('::');
    console.log(`- ${count} rows: ${field} — ${issue}`);
  }
  console.log('');

  console.log('─── RECOMMENDATION ───');
  if (fail) console.log('HALT — safety or structural failures require human review before any further processing');
  else if (warn) console.log('TUNE — fix system prompt issues noted above, rerun QA batch');
  else console.log('PROCEED — batch quality sufficient, run full volume');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
