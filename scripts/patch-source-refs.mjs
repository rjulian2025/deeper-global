#!/usr/bin/env node
/**
 * Add a second source_ref to answers stuck at completeness 94.
 *
 * Dry run:  npm run content:patch-source-refs
 * Apply:    npm run content:patch-source-refs -- --apply
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { completenessScore } from './lib/content-enrichment-utils.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = 'reports/enrichment-corpus';
const SELECT_FIELDS =
  'id,slug,question,category,source_refs,improved_title,improved_meta_description,improved_summary,answer_sections,key_takeaways,care_note,related_questions,suggested_schema_question,suggested_schema_answer,primary_theme,related_themes,content_enriched_at';

const REFS = {
  nimhCaring: {
    title: 'Caring for Your Mental Health',
    url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
    publisher: 'NIMH',
    note: 'Supports self-care and when to seek professional help.',
  },
  cdcAbout: {
    title: 'About Mental Health',
    url: 'https://www.cdc.gov/mental-health/about/index.html',
    publisher: 'CDC',
    note: 'Supports mental health as a public health concern.',
  },
  cdcStress: {
    title: 'Coping with Stress',
    url: 'https://www.cdc.gov/mental-health/caring-for-yourself/coping-with-stress/index.html',
    publisher: 'CDC',
    note: 'Supports stress management and when to seek help.',
  },
  nimhAnxiety: {
    title: 'Anxiety Disorders',
    url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
    publisher: 'NIMH',
    note: 'Supports understanding anxiety symptoms and treatment options.',
  },
  nimhDepression: {
    title: 'Depression',
    url: 'https://www.nimh.nih.gov/health/topics/depression',
    publisher: 'NIMH',
    note: 'Supports understanding depression symptoms and treatment options.',
  },
  nimhGrief: {
    title: 'Coping with Grief and Loss',
    url: 'https://www.nimh.nih.gov/health/publications/coping-with-grief-and-loss',
    publisher: 'NIMH',
    note: 'Supports understanding grief as a personal, non-linear process.',
  },
  samhsaHelpline: {
    title: 'SAMHSA National Helpline',
    url: 'https://www.samhsa.gov/find-help/helplines/national-helpline',
    publisher: 'SAMHSA',
    note: 'Supports finding treatment and recovery resources for substance use.',
  },
  samhsaRecovery: {
    title: 'Recovery and Recovery Support',
    url: 'https://www.samhsa.gov/find-help/recovery',
    publisher: 'SAMHSA',
    note: 'Supports general recovery concepts and help-seeking.',
  },
  apaAi: {
    title: 'AI chatbots and digital companions are reshaping emotional connection',
    url: 'https://www.apa.org/monitor/2026/01-02/trends-digital-ai-relationships-emotional-connection',
    publisher: 'American Psychological Association',
    note: 'Supports need for guardrails around AI emotional support.',
  },
  medlineMental: {
    title: 'Mental Health',
    url: 'https://medlineplus.gov/mentalhealth.html',
    publisher: 'MedlinePlus',
    note: 'Supports general mental health education and help-seeking.',
  },
};

function parseArgs(argv) {
  return { apply: argv.includes('--apply'), minScore: 94, maxScore: 94 };
}

function existingUrls(question) {
  if (!Array.isArray(question.source_refs)) return new Set();
  return new Set(
    question.source_refs
      .map((item) => (item?.url || '').trim().toLowerCase())
      .filter(Boolean)
  );
}

function pickSecondRef(question) {
  const haystack = `${question.slug} ${question.question || ''} ${question.category || ''}`.toLowerCase();
  const used = existingUrls(question);

  let candidates = [REFS.cdcAbout, REFS.nimhCaring];

  if (/\b(ai|chatbot|deepfake|digital companion)\b/.test(haystack)) {
    candidates = [REFS.apaAi, REFS.cdcAbout, REFS.nimhCaring, REFS.medlineMental];
  } else if (/\b(addiction|recovery|sober|relapse|substance)\b/.test(haystack)) {
    candidates = [REFS.samhsaHelpline, REFS.samhsaRecovery, REFS.nimhCaring];
  } else if (/\b(grief|dies|bereav|loss)\b/.test(haystack)) {
    candidates = [REFS.nimhGrief, REFS.nimhCaring, REFS.cdcAbout];
  } else if (/\b(anxiety|stress|worried|panic)\b/.test(haystack)) {
    candidates = [REFS.cdcStress, REFS.cdcAbout, REFS.nimhAnxiety, REFS.nimhCaring];
  } else if (/\b(depress|numb|exhausted)\b/.test(haystack)) {
    candidates = [REFS.nimhDepression, REFS.cdcAbout, REFS.nimhCaring];
  } else if (/\b(parent|child|teen|co-parent|sibling)\b/.test(haystack)) {
    candidates = [REFS.nimhCaring, REFS.cdcAbout, REFS.medlineMental];
  } else if (/\b(conflict|boundary|apolog|communic|trust|defensive|fight)\b/.test(haystack)) {
    candidates = [REFS.medlineMental, REFS.cdcAbout, REFS.nimhCaring];
  } else if (/\b(therapy|therapist|professional help)\b/.test(haystack)) {
    candidates = [REFS.nimhCaring, REFS.medlineMental, REFS.cdcAbout];
  } else if (/\b(work|burnout|manager|job)\b/.test(haystack)) {
    candidates = [REFS.cdcStress, REFS.cdcAbout, REFS.nimhCaring];
  }

  return candidates.find((ref) => !used.has(ref.url.toLowerCase())) || null;
}

async function fetchAllQuestions(client) {
  const rows = [];
  let from = 0;

  while (true) {
    const { data, error } = await client.from('questions_master').select(SELECT_FIELDS).range(from, from + 999);
    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }

  return rows;
}

function scoreDistribution(questions) {
  const buckets = { 100: 0, 94: 0, other: 0 };
  for (const question of questions) {
    const score = completenessScore(question);
    if (score >= 100) buckets[100] += 1;
    else if (score === 94) buckets[94] += 1;
    else buckets.other += 1;
  }
  return buckets;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { url, key, serviceRoleKey } = resolveSupabaseConfig({ requireWrite: args.apply });
  const client = createClient(url, args.apply ? serviceRoleKey : key, { auth: { persistSession: false } });

  const questions = await fetchAllQuestions(client);
  const before = scoreDistribution(questions);

  const targets = questions.filter((question) => {
    const score = completenessScore(question);
    return score >= args.minScore && score <= args.maxScore && score < 100;
  });

  const patches = [];
  const skipped = [];

  for (const question of targets) {
    const secondRef = pickSecondRef(question);
    if (!secondRef) {
      skipped.push({ slug: question.slug, reason: 'no suitable second ref found' });
      continue;
    }

    const source_refs = [...(question.source_refs || []), secondRef];
    const preview = { ...question, source_refs };
    patches.push({
      id: question.id,
      slug: question.slug,
      question: question.question,
      category: question.category,
      before_score: completenessScore(question),
      after_score: completenessScore(preview),
      added_ref: secondRef,
      source_refs,
    });
  }

  let applied = 0;
  if (args.apply) {
    for (const patch of patches) {
      const { data, error } = await client
        .from('questions_master')
        .update({ source_refs: patch.source_refs })
        .eq('id', patch.id)
        .select('id');
      if (error) throw error;
      if (data?.length) applied += 1;
    }
  }

  const afterQuestions = args.apply ? await fetchAllQuestions(client) : questions.map((question) => {
    const patch = patches.find((item) => item.id === question.id);
    return patch ? { ...question, source_refs: patch.source_refs } : question;
  });
  const after = scoreDistribution(afterQuestions);

  const report = {
    generated_at: new Date().toISOString(),
    mode: args.apply ? 'applied' : 'dry-run',
    target_score: 94,
    targets_found: targets.length,
    patches_prepared: patches.length,
    applied_count: applied,
    skipped,
    before,
    after,
    patches: patches.map(({ id, slug, question, category, before_score, after_score, added_ref }) => ({
      id,
      slug,
      question,
      category,
      before_score,
      after_score,
      added_ref,
    })),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(`${OUT_DIR}/source-ref-patch-report.json`, `${JSON.stringify(report, null, 2)}\n`);

  const md = `# Source ref patch report

Generated: ${report.generated_at}
Mode: **${report.mode}**

## Summary

| Metric | Before | After |
| --- | ---: | ---: |
| Completeness 100 | ${before[100]} | ${after[100]} |
| Completeness 94 | ${before[94]} | ${after[94]} |
| Other | ${before.other} | ${after.other} |
| **Total answers** | **${questions.length}** | **${questions.length}** |

- Targets at 94: ${targets.length}
- Patches prepared: ${patches.length}
- Applied: ${applied}
- Skipped: ${skipped.length}

## Patched slugs

${patches.map((patch) => `- \`${patch.slug}\` → ${patch.added_ref.publisher}: ${patch.added_ref.title}`).join('\n')}
`;

  writeFileSync(`${OUT_DIR}/source-ref-patch-report.md`, md);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
