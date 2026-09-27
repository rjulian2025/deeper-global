#!/usr/bin/env node
/**
 * Expand critical issues into per-record occurrences using anon key.
 * Reads the audit JSON to identify critical slugs, then queries Supabase
 * to enumerate exact row ids.
 * Produces: reports/data-integrity/critical-expanded-YYYY-MM-DD.json
 */
import { mkdirSync, writeFileSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { cleanText, resolveSupabaseConfig } from './lib/content-enrichment-utils.mjs';

const OUT_DIR = 'reports/data-integrity';
const AUDIT_JSON = join(OUT_DIR, 'audit-2026-06-14.json');

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

async function fetchBySlug(client, slug) {
  const { data, error } = await client.from('questions_master').select('id,slug,content_enriched_at').eq('slug', slug);
  if (error) throw error;
  return data ?? [];
}

async function main() {
  const { url, key } = resolveSupabaseConfig();
  const client = createClient(url, key, { auth: { persistSession: false } });
  if (!existsSync(AUDIT_JSON)) {
    console.log(`Audit JSON not found at ${AUDIT_JSON}; nothing to expand`);
    return;
  }
  const audit = JSON.parse(readFileSync(AUDIT_JSON, 'utf8'));
  const crits = Array.isArray(audit.critical_instances) ? audit.critical_instances : [];
  const duplicateSlugs = Array.from(
    new Set(
      crits
        .filter((c) => c.issue_id === 'duplicate_slug' && cleanText(c.slug))
        .map((c) => cleanText(c.slug))
    )
  );
  const missingPromote = crits
    .filter((c) => c.issue_id === 'promote_slug_missing_in_db' && cleanText(c.slug))
    .map((c) => cleanText(c.slug));

  const promoteReports = loadPromoteReports();

  const expanded = [];

  for (const slug of duplicateSlugs) {
    const rows = await fetchBySlug(client, slug);
    for (const row of rows) {
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
      if (missingPromote.includes(slug)) {
        expanded.push({
          issue_id: 'promote_slug_missing_in_db',
          table: 'questions_master',
          id: null,
          slug,
          field: 'slug',
          value: slug,
          explanation: `Promote report ${report.path} lists a slug that does not exist in the DB.`,
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

