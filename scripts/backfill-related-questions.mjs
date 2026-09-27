#!/usr/bin/env node
/**
 * Deterministic related_questions backfill (dry-run).
 * Reads with anon key, writes a plan JSON to reports/data-integrity/.
 * No DB writes in this CLI.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';
import { buildBackfillPlan } from './lib/related-questions-backfill.mjs';

const OUT_DIR = 'reports/data-integrity';
const SELECT =
  'id,slug,question,category,raw_category,primary_theme,related_themes,related_questions,review_status,content_enriched_at,improved_title,created_at,updated_at';
const PAGE_SIZE = 500;

async function fetchAllQuestions(client) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await client.from('questions_master').select(SELECT).order('created_at', { ascending: false }).order('id', { ascending: true }).range(from, to);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

function summarizeByHub(plan, bySlug) {
  const counts = { ADHD: 0, Imago: 0, SpiritualityMeaning: 0, Other: 0, total: 0 };
  for (const slug of Object.keys(plan)) {
    const q = bySlug.get(slug);
    counts.total += 1;
    const theme = (q?.primary_theme || '').toLowerCase();
    const cat = (q?.category || q?.raw_category || '').toLowerCase();
    if (cat.includes('neurodivergence') || theme.includes('adhd')) counts.ADHD += 1;
    else if (theme.includes('imago')) counts.Imago += 1;
    else if (cat.includes('spiritual') || theme.includes('spiritual') || theme.includes('faith')) counts.SpiritualityMeaning += 1;
    else counts.Other += 1;
  }
  return counts;
}

async function main() {
  const { url, key } = resolveSupabaseConfig({ requireWrite: false });
  const client = createClient(url, key, { auth: { persistSession: false } });
  const questions = await fetchAllQuestions(client);
  const bySlug = new Map(questions.map((q) => [q.slug, q]));
  const plan = buildBackfillPlan(questions);
  const file = `${OUT_DIR}/related-backfill-plan-${new Date().toISOString().slice(0, 10)}.json`;
  mkdirSync(OUT_DIR, { recursive: true });
  const summary = summarizeByHub(plan, bySlug);
  const out = { generated_at: new Date().toISOString(), summary, count: Object.keys(plan).length, plan };
  writeFileSync(file, `${JSON.stringify(out, null, 2)}\n`);
  console.log(JSON.stringify({ wrote: file, count: out.count, summary: out.summary }, null, 2));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

