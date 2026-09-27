#!/usr/bin/env node
/**
 * Expand critical issues into per-record occurrences using anon key.
 * Produces: reports/data-integrity/critical-expanded-YYYY-MM-DD.json
 */
import { mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { cleanText, resolveSupabaseConfig } from './lib/content-enrichment-utils.mjs';

const OUT_DIR = 'reports/data-integrity';
const PAGE_SIZE = 1000;

function loadPromoteReports() {
  const dirs = ['reports/enrichment-corpus/promote-updates', 'reports/enrichment-addiction/promote-updates'];
  const reports = [];
  for (const dir of dirs) {
    try {
      for (const name of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
        try {
          const parsed = JSON.parse(readFileSync(join(dir, name), 'utf8'));
          reports.push({ path: join(dir, name), ...parsed });
        } catch {}
      }
    } catch {}
  }
  return reports;
}

async function fetchAll(client) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await client
      .from('questions_master')
      .select('id,slug,content_enriched_at')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

function duplicates(rows) {
  const bySlug = new Map();
  for (const row of rows) {
    const key = cleanText(row.slug);
    const list = bySlug.get(key) ?? [];
    list.push(row);
    bySlug.set(key, list);
  }
  return [...bySlug.entries()].filter(([, list]) => list.length > 1);
}

async function main() {
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });
  const rows = await fetchAll(client);

  const duplicateGroups = duplicates(rows);
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  const promoteReports = loadPromoteReports();

  const expanded = [];

  for (const [slug, list] of duplicateGroups) {
    for (const row of list) {
      expanded.push({
        issue_id: 'duplicate_slug',
        table: 'questions_master',
        id: row.id,
        slug,
        field: 'slug',
        value: slug,
        explanation: 'Multiple rows share the same slug. This breaks getQuestionBySlug and page builds.',
      });
    }
  }

  for (const report of promoteReports) {
    for (const slug of report.slugs ?? []) {
      const row = bySlug.get(slug);
      if (!row) {
        expanded.push({
          issue_id: 'promote_slug_missing_in_db',
          table: 'questions_master',
          id: null,
          slug,
          field: 'slug',
          value: slug,
          explanation: `Promote report ${report.path} lists a slug that does not exist in the DB.`,
        });
      } else if (!cleanText(row.content_enriched_at)) {
        expanded.push({
          issue_id: 'promote_not_enriched_in_db',
          table: 'questions_master',
          id: row.id,
          slug,
          field: 'content_enriched_at',
          value: null,
          explanation: `Promote report ${report.path} lists this slug, but it lacks content_enriched_at in DB.`,
        });
      }
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const path = `${OUT_DIR}/critical-expanded-${new Date().toISOString().slice(0, 10)}.json`;
  writeFileSync(path, `${JSON.stringify({ generated_at: new Date().toISOString(), expanded }, null, 2)}\n`);
  console.log(`Wrote ${path}`);
  console.log(`Expanded critical count: ${expanded.length}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

