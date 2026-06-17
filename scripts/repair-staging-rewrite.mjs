#!/usr/bin/env node
/**
 * Repair staging rewrite rows that fail QA before promote.
 *
 *   node scripts/repair-staging-rewrite.mjs
 *   node scripts/repair-staging-rewrite.mjs --apply
 *   node scripts/repair-staging-rewrite.mjs --apply --slug my-answer-slug
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { ANSWER_REWRITE_PROMPT_VERSION } from './lib/answer-rewrite-system-prompt.mjs';
import { evaluateStagingRewrite, wordCount } from './lib/answer-rewrite-qa.mjs';
import {
  hasCompleteStaging,
  isUnpromotedStaging,
  sanitizeRewritePayload,
} from './lib/answer-rewrite-utils.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const MAX_CANONICAL_WORDS = 50;
const MAX_COMBINED_WORDS = 745;
const PROFESSIONAL_APPEND =
  ' A therapist, psychiatrist, or other mental health professional can help you decide whether formal evaluation or treatment is appropriate for your situation.';
const CRISIS_APPEND =
  ' If you are in the US and need immediate support, call or text 988 (Suicide & Crisis Lifeline).';

const YMYL_TERMS = [
  'suicide', 'suicidal', 'self-harm', 'self harm', 'eating disorder', 'anorexia', 'bulimia',
  'psychosis', 'psychotic', 'dissociation', 'dissociative', 'substance', 'withdrawal',
  'medication', 'antidepressant', 'ssri', 'postpartum', 'pediatric', 'adolescent', 'teen',
];

function isYmyl(question) {
  const q = String(question ?? '').toLowerCase();
  return YMYL_TERMS.some((term) => q.includes(term));
}

const STAGING_SELECT =
  'id,slug,question,content_prompt_version,staging_rewrite_at,staging_rewrite_error,staging_rewrite_prompt_version,staging_primary_term,staging_canonical_answer,staging_lede,staging_key_takeaways,staging_what_you_might_be_experiencing,staging_what_can_help,staging_when_to_reach_out';

function parseArgs(argv) {
  const args = { apply: false, slugs: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      args.apply = true;
      continue;
    }
    if (arg === '--slug') {
      args.slugs.push(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith('--slug=')) args.slugs.push(arg.slice('--slug='.length));
  }
  return args;
}

function longestCommonPrefix(a, b) {
  let index = 0;
  while (index < a.length && index < b.length && a[index] === b[index]) index += 1;
  return index;
}

function truncateCanonical(text, maxWords = MAX_CANONICAL_WORDS) {
  const trimmed = String(text ?? '').trim();
  if (wordCount(trimmed) <= maxWords) return trimmed;

  const sentences = trimmed.match(/[^.!?]+[.!?]+/g) ?? [trimmed];
  let result = '';
  for (const sentence of sentences) {
    const candidate = `${result}${sentence}`.trim();
    if (wordCount(candidate) > maxWords) break;
    result = candidate;
  }

  if (result) return result;

  return trimmed.split(/\s+/).slice(0, maxWords).join(' ').replace(/[,;:]?$/, '.');
}

function repairLede(canonical, lede) {
  const cleanCanonical = String(canonical ?? '').trim();
  const cleanLede = String(lede ?? '').trim();
  if (!cleanCanonical) return cleanLede;
  if (cleanLede.startsWith(cleanCanonical)) return cleanLede;

  const prefixLength = longestCommonPrefix(cleanCanonical, cleanLede);
  if (prefixLength >= 24) {
    return `${cleanCanonical}${cleanLede.slice(prefixLength)}`.trim();
  }

  const tail = cleanLede.replace(/^[^.!?]+[.!?]\s*/, '').trim();
  return tail ? `${cleanCanonical} ${tail}` : cleanCanonical;
}

function repairYmylReachOut(text, question) {
  let reach = String(text ?? '').trim();
  if (!reach) return reach;

  if (isYmyl(question) && !reach.includes('988 (Suicide & Crisis Lifeline)')) {
    reach = `${reach}${CRISIS_APPEND}`;
  }

  if (!/\b(professional|therapist|clinician|doctor|psychiatrist|counselor|evaluation|provider)\b/i.test(reach)) {
    reach = `${reach}${PROFESSIONAL_APPEND}`;
  }

  return reach;
}

function trimSectionParagraphs(text, wordsToRemove, { preserveCrisis = false } = {}) {
  let remaining = wordsToRemove;
  let section = String(text ?? '').trim();
  const paragraphs = section.split(/\n\n+/);
  const isProtected = (paragraph) =>
    preserveCrisis && /\b(988|crisis|emergency|911|Suicide & Crisis Lifeline)\b/i.test(paragraph);

  const trimmable = paragraphs.filter((paragraph) => !isProtected(paragraph));
  const protectedParagraphs = paragraphs.filter((paragraph) => isProtected(paragraph));

  while (remaining > 0 && trimmable.length > 1) {
    const removed = trimmable.pop() ?? '';
    remaining -= wordCount(removed);
  }

  if (remaining > 0 && trimmable.length === 1) {
    const words = trimmable[0].split(/\s+/);
    const keep = Math.max(40, words.length - remaining);
    trimmable[0] = words.slice(0, keep).join(' ').replace(/[,;:]?$/, '.');
    remaining = 0;
  }

  return [...trimmable, ...protectedParagraphs].join('\n\n').trim();
}

function combinedBodyWords(row) {
  return wordCount(
    [
      row.staging_lede,
      row.staging_what_you_might_be_experiencing,
      row.staging_what_can_help,
      row.staging_when_to_reach_out,
    ].join(' ')
  );
}

function stripRhetoricalOpening(text) {
  const trimmed = String(text ?? '').trim();
  const match = trimmed.match(/^[^.?!]*\?\s*/);
  if (!match) return trimmed;
  return trimmed.slice(match[0].length).trim();
}

function repairKeyTakeaways(takeaways) {
  if (!Array.isArray(takeaways)) return takeaways;

  return takeaways.map((takeaway) => {
    const trimmed = String(takeaway ?? '').trim();
    if (!/^[^.?!]*\?\s*$/.test(trimmed)) return trimmed;
    return trimmed.replace(/\?\s*$/, '.');
  });
}

function buildRepair(row) {
  const changes = [];
  const update = {};

  let canonical = String(row.staging_canonical_answer ?? '').trim();
  let lede = String(row.staging_lede ?? '').trim();
  let reach = String(row.staging_when_to_reach_out ?? '').trim();
  let help = String(row.staging_what_can_help ?? '').trim();
  let experiencing = String(row.staging_what_you_might_be_experiencing ?? '').trim();
  let takeaways = row.staging_key_takeaways;

  const repairedTakeaways = repairKeyTakeaways(takeaways);
  if (JSON.stringify(repairedTakeaways) !== JSON.stringify(takeaways)) {
    takeaways = repairedTakeaways;
    changes.push('takeaways_rhetorical');
  }

  const sanitized = sanitizeRewritePayload({ canonical_answer: canonical, lede });
  if (sanitized.canonical_answer !== canonical) {
    canonical = sanitized.canonical_answer;
    changes.push('canonical_emdash');
  }

  if (wordCount(canonical) > MAX_CANONICAL_WORDS) {
    canonical = truncateCanonical(canonical);
    changes.push('canonical_length');
  }

  const strippedCanonical = stripRhetoricalOpening(canonical);
  if (strippedCanonical !== canonical) {
    canonical = strippedCanonical;
    changes.push('canonical_rhetorical');
  }

  const repairedLede = repairLede(canonical, lede);
  if (repairedLede !== lede) {
    lede = repairedLede;
    changes.push('lede_prefix');
  }

  if (!lede.startsWith(canonical)) {
    lede = repairLede(canonical, lede);
    changes.push('lede_prefix_retry');
  }

  const strippedLede = stripRhetoricalOpening(lede);
  if (strippedLede !== lede) {
    lede = strippedLede.startsWith(canonical) ? strippedLede : repairLede(canonical, strippedLede);
    changes.push('lede_rhetorical');
  }

  const repairedReach = repairYmylReachOut(reach, row.question);
  if (repairedReach !== reach) {
    reach = repairedReach;
    changes.push('ymyl_professional');
  }

  let combined = wordCount([lede, experiencing, help, reach].join(' '));
  if (combined > MAX_COMBINED_WORDS) {
    let wordsToRemove = combined - MAX_COMBINED_WORDS;
    const trimmedHelp = trimSectionParagraphs(help, wordsToRemove);
    wordsToRemove -= wordCount(help) - wordCount(trimmedHelp);
    help = trimmedHelp;

    if (wordsToRemove > 0) {
      const trimmedExperiencing = trimSectionParagraphs(experiencing, wordsToRemove);
      wordsToRemove -= wordCount(experiencing) - wordCount(trimmedExperiencing);
      experiencing = trimmedExperiencing;
    }

    if (wordsToRemove > 0) {
      reach = trimSectionParagraphs(reach, wordsToRemove, { preserveCrisis: true });
    }

    changes.push('word_count_trim');
  }

  if (experiencing !== row.staging_what_you_might_be_experiencing) {
    update.staging_what_you_might_be_experiencing = experiencing;
  }

  if (canonical !== row.staging_canonical_answer) update.staging_canonical_answer = canonical;
  if (lede !== row.staging_lede) update.staging_lede = lede;
  if (reach !== row.staging_when_to_reach_out) update.staging_when_to_reach_out = reach;
  if (help !== row.staging_what_can_help) update.staging_what_can_help = help;
  if (JSON.stringify(takeaways) !== JSON.stringify(row.staging_key_takeaways)) {
    update.staging_key_takeaways = takeaways;
  }

  return { update, changes };
}

async function fetchTargets(supabase, slugs) {
  if (slugs.length) {
    const { data, error } = await supabase.from('questions_master').select(STAGING_SELECT).in('slug', slugs);
    if (error) throw new Error(error.message);
    return data ?? [];
  }

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
    rows.push(...page.filter((row) => hasCompleteStaging(row) && isUnpromotedStaging(row)));
    if (page.length < pageSize) break;
  }

  return rows;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const blockedSlugs = (() => {
    try {
      return JSON.parse(readFileSync('reports/answer-rewrite/blocked-slugs.json', 'utf8')).map((row) => row.slug);
    } catch {
      return [];
    }
  })();

  const { url, key } = resolveSupabaseConfig({ requireWrite: args.apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const slugScope = args.slugs.length ? args.slugs : blockedSlugs;
  const rows = await fetchTargets(supabase, slugScope);

  const planned = rows
    .map((row) => {
      const before = evaluateStagingRewrite(row);
      const { update, changes } = buildRepair(row);
      const afterRow = { ...row, ...update };
      const after = Object.keys(update).length ? evaluateStagingRewrite(afterRow) : before;
      return { row, before, after, update, changes };
    })
    .filter((item) => item.changes.length > 0);

  const repairable = planned.filter((item) => item.after.score !== 'FAIL');
  const stillFail = planned.filter((item) => item.after.score === 'FAIL');

  console.log(
    JSON.stringify(
      {
        mode: args.apply ? 'apply' : 'dry-run',
        targets: rows.length,
        with_repairs: planned.length,
        repairable_after: repairable.length,
        still_fail_after_repair: stillFail.length,
      },
      null,
      2
    )
  );

  for (const item of planned.slice(0, 12)) {
    console.log(
      `[${args.apply ? 'fix' : 'would-fix'}] ${item.row.slug} — ${item.before.score} -> ${item.after.score} (${item.changes.join(', ')})`
    );
  }
  if (planned.length > 12) console.log(`...and ${planned.length - 12} more`);

  if (stillFail.length) {
    console.log('─── STILL FAIL AFTER REPAIR ───');
    for (const item of stillFail.slice(0, 10)) {
      const fails = item.after.issues.filter((issue) => issue.severity === 'FAIL');
      console.log(`${item.row.slug}: ${fails.map((issue) => `${issue.field}: ${issue.issue}`).join(' | ')}`);
    }
    if (stillFail.length > 10) console.log(`...and ${stillFail.length - 10} more`);
  }

  if (!args.apply || !planned.length) return;

  let updated = 0;
  for (const item of planned) {
    const { error } = await supabase.from('questions_master').update(item.update).eq('id', item.row.id);
    if (error) throw new Error(`Failed to update ${item.row.slug}: ${error.message}`);
    updated += 1;
  }

  console.log(JSON.stringify({ updated }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
