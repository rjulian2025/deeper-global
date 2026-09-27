#!/usr/bin/env node
/**
 * Detect retired_duplicate rows missing vercel.json redirects and propose keeper mappings.
 * - Reads with anon key.
 * - Writes a report JSON under reports/data-integrity/.
 * - When run with --apply-files, updates vercel.json and scripts/lib/redirect-sources.mjs with certain pairs.
 *
 * Certainty rule: keeper is the sole publishable row whose normalized question text equals the retired row's.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';
import { cleanText } from './lib/content-enrichment-utils.mjs';
import { REDIRECT_SOURCE_SLUGS as REDIRECT_SOURCE_SLUGS_ARRAY } from './lib/redirect-sources.mjs';

const OUT_DIR = 'reports/data-integrity';

function normalize(text) {
  return String(text ?? '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

function parseArgs(argv) {
  return { applyFiles: argv.includes('--apply-files') };
}

function buildPublishableIndex(rows) {
  const index = new Map();
  for (const row of rows) {
    const key = normalize(row.question);
    if (!key) continue;
    const list = index.get(key) ?? [];
    list.push(row);
    index.set(key, list);
  }
  return index;
}

function readVercelRedirectSources() {
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const redirects = Array.isArray(vercel.redirects) ? vercel.redirects : [];
  const answerSources = new Set(
    redirects
      .filter((r) => typeof r.source === 'string' && r.source.startsWith('/answers/'))
      .map((r) => r.source.replace(/^\/answers\//, '').replace(/\/?$/, ''))
  );
  return { vercel, answerSources };
}

function addRedirect(vercel, sourceSlug, destSlug) {
  vercel.redirects = vercel.redirects || [];
  // Avoid duplicates
  const exists = vercel.redirects.some(
    (r) => r.source === `/answers/${sourceSlug}` && r.destination === `/answers/${destSlug}/`
  );
  if (!exists) {
    vercel.redirects.push({
      source: `/answers/${sourceSlug}`,
      destination: `/answers/${destSlug}/`,
      permanent: true,
    });
  }
}

function writeRedirectSourcesFile(slugs) {
  const content = `// Single source of truth for redirect-source slugs.\n` +
    `// These slugs permanently redirect to canonical answers via vercel.json.\n` +
    `// Import this module wherever redirect sources are needed (site indexing, audits, tests).\n` +
    `export const REDIRECT_SOURCE_SLUGS = ${JSON.stringify(slugs, null, 2)};\n`;
  writeFileSync('scripts/lib/redirect-sources.mjs', content);
}

async function main() {
  const { applyFiles } = parseArgs(process.argv.slice(2));
  const { url, key } = resolveSupabaseConfig({ requireWrite: false });
  const client = createClient(url, key, { auth: { persistSession: false } });

  const PAGE = 1000;
  async function fetchWhere(where) {
    const rows = [];
    for (let from = 0; ; from += PAGE) {
      const to = from + PAGE - 1;
      const { data, error } = await client
        .from('questions_master')
        .select('id,slug,question,review_status,created_at')
        .order('created_at', { ascending: false })
        .order('id', { ascending: true })
        .range(from, to)
        .or(where);
      if (error) throw error;
      const page = data ?? [];
      rows.push(...page);
      if (page.length < PAGE) break;
    }
    return rows;
  }

  const retired = await fetchWhere(`review_status.eq.retired_duplicate`);
  const allNonRetired = await fetchWhere(`review_status.is.null,review_status.in.(reviewed,approved,published)`);

  const { vercel, answerSources } = readVercelRedirectSources();
  const publishableIndex = buildPublishableIndex(allNonRetired);
  const currentRedirectSources = new Set(REDIRECT_SOURCE_SLUGS_ARRAY);
  const pairs = [];
  const uncertain = [];
  const missing = [];

  for (const row of retired) {
    if (answerSources.has(row.slug)) continue; // already redirected
    missing.push(row.slug);
    const list = publishableIndex.get(normalize(row.question)) ?? [];
    const candidates = list.map((r) => r.slug).filter((s) => s !== row.slug);
    if (candidates.length === 1) {
      pairs.push({ source: row.slug, keeper: candidates[0] });
    } else {
      uncertain.push({ source: row.slug, candidates });
    }
  }

  // Write report
  mkdirSync(OUT_DIR, { recursive: true });
  const report = {
    generated_at: new Date().toISOString(),
    retired_total: retired.length,
    missing_redirects_count: missing.length,
    pairs,
    uncertain,
  };
  const outFile = `${OUT_DIR}/retired-redirects-report-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(outFile, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ wrote: outFile, retired_total: retired.length, missing: missing.length, pairs: pairs.length, uncertain: uncertain.length }, null, 2));

  if (applyFiles && pairs.length) {
    // Update vercel.json and redirect-sources list
    for (const { source, keeper } of pairs) {
      addRedirect(vercel, source, keeper);
      currentRedirectSources.add(source);
    }
    writeFileSync('vercel.json', `${JSON.stringify(vercel, null, 2)}\n`);
    writeRedirectSourcesFile([...currentRedirectSources].sort());
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

