import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const OUT_DIR = 'reports/gsc-indexing/2026-05-05/p1-enrichment';
const TOP_SLUGS_PATH = 'reports/gsc-indexing/2026-05-05/priority/priority-top-50-slugs.txt';
const ENV_PATH = '.vercel/.env.production.local';
const LIMIT = Number(process.env.P1_LIMIT ?? 25);

function parseEnv(path) {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((line) => !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index);
        let value = line.slice(index + 1);
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        return [key, value];
      })
  );
}

function truncate(value, max = 1800) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}...`;
}

function jsonForPrompt(question) {
  return {
    id: question.id,
    slug: question.slug,
    original_question: question.question,
    category: question.category ?? question.raw_category,
    short_answer: truncate(question.short_answer, 800),
    answer: truncate(question.answer, 2200),
    existing_enriched_title: question.improved_title ?? null,
    existing_meta_description: question.improved_meta_description ?? null,
    existing_summary: question.improved_summary ?? null,
    existing_review_status: question.review_status ?? null,
  };
}

const env = parseEnv(ENV_PATH);
const slugs = readFileSync(TOP_SLUGS_PATH, 'utf8').trim().split(/\r?\n/).filter(Boolean).slice(0, LIMIT);

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  throw new Error(`Missing SUPABASE_URL or SUPABASE_ANON_KEY in ${ENV_PATH}`);
}

const client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const { data, error } = await client
  .from('questions_master')
  .select(
    'id, slug, question, category, raw_category, short_answer, answer, improved_title, improved_meta_description, improved_summary, review_status'
  )
  .in('slug', slugs);

if (error) throw error;

const bySlug = new Map((data ?? []).map((question) => [question.slug, question]));
const missing = slugs.filter((slug) => !bySlug.has(slug));
const ordered = slugs.map((slug) => bySlug.get(slug)).filter(Boolean);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/source-questions.json`, `${JSON.stringify(ordered.map(jsonForPrompt), null, 2)}\n`);
writeFileSync(`${OUT_DIR}/missing-slugs.txt`, `${missing.join('\n')}${missing.length ? '\n' : ''}`);
writeFileSync(
  `${OUT_DIR}/generation-brief.md`,
  `# P1 Enrichment Generation Brief\n\nGenerated: ${new Date().toISOString()}\n\nSource count: ${ordered.length}\nMissing slugs: ${missing.length}\n\nUse \`source-questions.json\` as the source material for draft-only enrichment. Do not publish directly. Keep all generated rows in \`answer_enrichment_drafts\` with \`enrichment_status = 'draft'\` and \`quality_passed = false\` until editorial review.\n\n## Rules\n\n- Do not diagnose the reader.\n- Preserve the original question intent.\n- Make every answer distinct; do not reuse body templates.\n- Make summaries answer the question in the first 1-2 sentences.\n- Include key takeaways, structured sections, calm care notes, related questions, schema question/answer, primary theme, related themes, citation notes, source refs, and primary entities.\n- Add citation gaps where source support is missing.\n\n## Input Slugs\n\n${slugs.map((slug, index) => `${index + 1}. ${slug}`).join('\n')}\n`
);

console.log(
  JSON.stringify(
    {
      requested: slugs.length,
      fetched: ordered.length,
      missing: missing.length,
      outDir: OUT_DIR,
    },
    null,
    2
  )
);
