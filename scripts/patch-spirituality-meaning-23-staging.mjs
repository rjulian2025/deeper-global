#!/usr/bin/env node
/**
 * Trim #23 existentialism staging lede/opening before promote (Part C editorial pass).
 *
 *   node scripts/patch-spirituality-meaning-23-staging.mjs
 *   node scripts/patch-spirituality-meaning-23-staging.mjs --apply
 */
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const SLUG = 'what-is-existentialism-and-can-it-help-when-life-feels-meaningless';

const STAGING_CANONICAL =
  'Existentialism is a philosophical tradition about freedom, choice, and creating meaning when life offers no ready-made answers.';

const STAGING_LEDE = `${STAGING_CANONICAL} It can help normalize meaninglessness without denying responsibility.`;

const STAGING_EXPERIENCING = `When inherited frameworks stop fitting, life can feel flat: not always sadness, but a sense that what you are supposed to care about no longer lands. Existentialist thinkers treat that as a philosophical question, not a character flaw.

It is also worth knowing that this experience has a range. For some people, existential questioning is uncomfortable but energizing — it opens up genuine curiosity about how to live. For others, especially when it arrives alongside loss, trauma, or depression, the same questions can feel crushing rather than clarifying. Both are common. The difference matters because it affects what kind of support is most useful. Philosophy can carry a lot, but it cannot always carry everything on its own.`;

function parseArgs(argv) {
  return { apply: argv.includes('--apply') };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = resolveSupabaseConfig({ requireWrite: args.apply });
  const supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey);

  const { data: before, error: fetchError } = await supabase
    .from('questions_master')
    .select('slug, staging_canonical_answer, staging_lede, staging_what_you_might_be_experiencing')
    .eq('slug', SLUG)
    .single();
  if (fetchError) throw fetchError;

  console.log(`#23 staging trim (${args.apply ? 'APPLY' : 'dry run'})`);
  console.log(`  slug: ${SLUG}`);
  console.log(`  canonical after (${STAGING_CANONICAL.split(/\s+/).length} words):`);
  console.log(`    ${STAGING_CANONICAL}`);
  console.log(`  lede before (${before.staging_lede?.split(/\s+/).length ?? 0} words):`);
  console.log(`    ${before.staging_lede}`);
  console.log(`  lede after (${STAGING_LEDE.split(/\s+/).length} words):`);
  console.log(`    ${STAGING_LEDE}`);

  if (!args.apply) return;

  const { error: updateError } = await supabase
    .from('questions_master')
    .update({
      staging_canonical_answer: STAGING_CANONICAL,
      staging_lede: STAGING_LEDE,
      staging_what_you_might_be_experiencing: STAGING_EXPERIENCING,
    })
    .eq('slug', SLUG);
  if (updateError) throw updateError;

  console.log('\nApplied staging trim for #23.');
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
