#!/usr/bin/env node
/**
 * Replace em-dashes in staging canonical_answer and lede (QA FAIL fields).
 *
 *   node scripts/sanitize-staging-emdash.mjs
 *   node scripts/sanitize-staging-emdash.mjs --apply
 */
import { createClient } from '@supabase/supabase-js';
import { ANSWER_REWRITE_PROMPT_VERSION } from './lib/answer-rewrite-system-prompt.mjs';
import { sanitizeRewritePayload } from './lib/answer-rewrite-utils.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const SELECT = 'id,slug,staging_canonical_answer,staging_lede';

function hasEmDash(text) {
  return /[—–]/.test(String(text ?? ''));
}

function needsSanitize(row) {
  const update = buildUpdate(row);
  return (
    update.staging_canonical_answer !== String(row.staging_canonical_answer ?? '').trim() ||
    update.staging_lede !== String(row.staging_lede ?? '').trim()
  );
}

function buildUpdate(row) {
  const oldCanonical = String(row.staging_canonical_answer ?? '').trim();
  const oldLede = String(row.staging_lede ?? '').trim();
  const newCanonical = sanitizeRewritePayload({ canonical_answer: oldCanonical }).canonical_answer;
  const newLede = oldLede.startsWith(oldCanonical)
    ? `${newCanonical}${oldLede.slice(oldCanonical.length)}`
    : sanitizeRewritePayload({ lede: oldLede }).lede;

  return {
    staging_canonical_answer: newCanonical,
    staging_lede: newLede,
  };
}

async function fetchStagedRows(supabase) {
  const pageSize = 200;
  const rows = [];

  for (let offset = 0; offset < 10000; offset += pageSize) {
    const { data, error } = await supabase
      .from('questions_master')
      .select(SELECT)
      .not('staging_rewrite_at', 'is', null)
      .is('staging_rewrite_error', null)
      .eq('staging_rewrite_prompt_version', ANSWER_REWRITE_PROMPT_VERSION)
      .order('slug', { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw new Error(error.message);
    const page = data ?? [];
    rows.push(...page);
    if (page.length < pageSize) break;
  }

  return rows;
}

async function main() {
  const apply = process.argv.includes('--apply');
  const { url, key } = resolveSupabaseConfig({ requireWrite: apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const rows = await fetchStagedRows(supabase);
  const targets = rows.filter(needsSanitize);

  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        staged_rows: rows.length,
        emdash_rows: targets.length,
      },
      null,
      2
    )
  );

  if (!targets.length) return;

  for (const row of targets.slice(0, 10)) {
    console.log(`[${apply ? 'fix' : 'would-fix'}] ${row.slug}`);
  }
  if (targets.length > 10) console.log(`...and ${targets.length - 10} more`);

  if (!apply) return;

  let updated = 0;
  for (const row of targets) {
    const update = buildUpdate(row);
    const { error } = await supabase.from('questions_master').update(update).eq('id', row.id);
    if (error) throw new Error(`Failed to update ${row.slug}: ${error.message}`);
    updated += 1;
  }

  console.log(JSON.stringify({ updated }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
