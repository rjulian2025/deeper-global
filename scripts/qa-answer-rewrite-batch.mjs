#!/usr/bin/env node
/**
 * QA answer-rewrite staging content in Supabase.
 *
 *   npm run content:qa-answer-rewrite
 *   npm run content:qa-answer-rewrite -- --all
 */
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { ANSWER_REWRITE_PROMPT_VERSION } from './lib/answer-rewrite-system-prompt.mjs';
import { evaluateStagingRewrite } from './lib/answer-rewrite-qa.mjs';
import { hasCompleteStaging } from './lib/answer-rewrite-utils.mjs';
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

const STAGING_SELECT =
  'id,slug,question,staging_rewrite_at,staging_rewrite_error,staging_rewrite_prompt_version,staging_primary_term,staging_canonical_answer,staging_lede,staging_key_takeaways,staging_what_you_might_be_experiencing,staging_what_can_help,staging_when_to_reach_out';

async function fetchAllStagedRows(supabase) {
  const pageSize = 200;
  const rows = [];

  for (let offset = 0; offset < 10000; offset += pageSize) {
    const { data, error } = await supabase
      .from('questions_master')
      .select(STAGING_SELECT)
      .not('staging_rewrite_at', 'is', null)
      .is('staging_rewrite_error', null)
      .eq('staging_rewrite_prompt_version', ANSWER_REWRITE_PROMPT_VERSION)
      .order('slug', { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw new Error(error.message);
    const page = data ?? [];
    rows.push(...page.filter((row) => hasCompleteStaging(row)));
    if (page.length < pageSize) break;
  }

  return rows;
}

function printReport({ scope, runTimestamp, results }) {

  const pass = results.filter((r) => r.score === 'PASS').length;
  const warn = results.filter((r) => r.score === 'WARN').length;
  const fail = results.filter((r) => r.score === 'FAIL').length;

  console.log('BATCH QA REPORT');
  console.log(`Scope: ${scope}`);
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

  return { pass, warn, fail, results };
}

async function main() {
  const all = process.argv.includes('--all');
  const { url, key } = resolveSupabaseConfig();
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  let results;
  let runTimestamp;
  let scope;

  if (all) {
    scope = 'full-corpus';
    runTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rows = await fetchAllStagedRows(supabase);
    results = rows.map((row) => ({ id: row.id, row, ...evaluateStagingRewrite(row) }));
  } else {
    scope = 'latest-csv';
    const csvPath = latestCsvPath();
    runTimestamp = csvPath.split('/').pop().replace('rewrite-run-', '').replace('.csv', '');
    const csvRows = parseCsv(readFileSync(csvPath, 'utf8'));
    const ids = csvRows.filter((r) => r.status === 'success').map((r) => r.record_id);
    if (!ids.length) throw new Error('No successful rows in CSV.');

    const { data, error } = await supabase.from('questions_master').select(STAGING_SELECT).in('id', ids);
    if (error) throw new Error(error.message);

    const byId = new Map((data ?? []).map((row) => [String(row.id), row]));
    results = ids.map((id) => ({ id, row: byId.get(String(id)), ...evaluateStagingRewrite(byId.get(String(id)) ?? {}) }));
  }

  const summary = printReport({ scope, runTimestamp, results });

  if (all) {
    mkdirSync(OUT_DIR, { recursive: true });
    const reportPath = join(OUT_DIR, `qa-full-${runTimestamp}.json`);
    writeFileSync(
      reportPath,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          scope,
          pass: summary.pass,
          warn: summary.warn,
          fail: summary.fail,
          rows: summary.results.map(({ id, row, score, issues }) => ({
            id,
            slug: row?.slug,
            score,
            issues,
          })),
        },
        null,
        2
      )
    );
    console.log(`Report: ${reportPath}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
