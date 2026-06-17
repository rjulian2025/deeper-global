#!/usr/bin/env node
/**
 * Clear staging rewrite fields so a record can be reprocessed.
 *
 *   node scripts/reset-staging-rewrite.mjs --slug my-answer-slug --apply
 */
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const RESET_FIELDS = {
  staging_rewrite_at: null,
  staging_rewrite_error: null,
  staging_rewrite_model: null,
  staging_rewrite_prompt_version: null,
  staging_primary_term: null,
  staging_canonical_answer: null,
  staging_lede: null,
  staging_key_takeaways: null,
  staging_what_you_might_be_experiencing: null,
  staging_what_can_help: null,
  staging_when_to_reach_out: null,
};

function parseArgs(argv) {
  const args = { slugs: [], apply: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      args.apply = true;
      continue;
    }
    if (arg === '--slug') {
      const value = argv[index + 1];
      if (!value) throw new Error('--slug requires a value.');
      args.slugs.push(value);
      index += 1;
      continue;
    }
    if (arg.startsWith('--slug=')) {
      args.slugs.push(arg.slice('--slug='.length));
    }
  }
  if (!args.slugs.length) throw new Error('Provide at least one --slug.');
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { url, key } = resolveSupabaseConfig({ requireWrite: args.apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data, error } = await supabase
    .from('questions_master')
    .select('id,slug,staging_rewrite_at,staging_rewrite_error')
    .in('slug', args.slugs);

  if (error) throw new Error(error.message);

  const found = new Map((data ?? []).map((row) => [row.slug, row]));
  const missing = args.slugs.filter((slug) => !found.has(slug));
  if (missing.length) throw new Error(`Slugs not found: ${missing.join(', ')}`);

  console.log(
    JSON.stringify(
      {
        mode: args.apply ? 'apply' : 'dry-run',
        slugs: args.slugs.map((slug) => ({
          slug,
          had_error: Boolean(found.get(slug)?.staging_rewrite_error),
          had_staging: Boolean(found.get(slug)?.staging_rewrite_at),
        })),
      },
      null,
      2
    )
  );

  if (!args.apply) return;

  for (const slug of args.slugs) {
    const row = found.get(slug);
    const { error: updateError } = await supabase.from('questions_master').update(RESET_FIELDS).eq('id', row.id);
    if (updateError) throw new Error(`Failed to reset ${slug}: ${updateError.message}`);
    console.log(`[reset] ${slug}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
