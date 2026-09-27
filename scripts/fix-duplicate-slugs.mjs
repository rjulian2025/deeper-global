#!/usr/bin/env node
/**
 * Fix duplicate slugs in questions_master by demoting non-canonical rows.
 *
 * - Default: dry-run (no writes)
 * - Use --apply to perform updates with SUPABASE_SERVICE_ROLE_KEY
 *
 * Canonical pick policy per duplicate slug group:
 * 1) Prefer indexable review_status ('' | reviewed | approved | published)
 * 2) Prefer content_enriched_at present
 * 3) Oldest created_at wins (stable)
 *
 * Non-canonical rows get:
 *   review_status = 'retired_duplicate'
 *   citation_notes += '\n\nDuplicate of canonical slug <slug>; demoted to retired_duplicate.'
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { cleanText, resolveSupabaseConfig } from './lib/content-enrichment-utils.mjs';

const OUT_DIR = 'reports/data-integrity';
const RETIRED_DUPLICATE = 'retired_duplicate';
const INDEXABLE = new Set(['', 'reviewed', 'approved', 'published']);
const PAGE_SIZE = 1000;

function parseArgs(argv) {
  const apply = argv.includes('--apply');
  return { apply, dryRun: !apply };
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function demoteNote(canonical, existing) {
  const note = `Duplicate of canonical slug ${canonical}; demoted to ${RETIRED_DUPLICATE}.`;
  const prior = cleanText(existing);
  if (!prior) return note;
  if (prior.includes(canonical)) return prior;
  return `${prior}\n\n${note}`;
}

function isIndexableStatus(value) {
  const status = cleanText(value).toLowerCase();
  return INDEXABLE.has(status);
}

function pickCanonical(rows) {
  return rows
    .slice()
    .sort((a, b) => {
      const aIndex = isIndexableStatus(a.review_status) ? 1 : 0;
      const bIndex = isIndexableStatus(b.review_status) ? 1 : 0;
      if (aIndex !== bIndex) return bIndex - aIndex;
      const aEnriched = Boolean(cleanText(a.content_enriched_at));
      const bEnriched = Boolean(cleanText(b.content_enriched_at));
      if (aEnriched !== bEnriched) return bEnriched ? 1 : -1;
      // Oldest created_at wins
      const aTime = Date.parse(a.created_at);
      const bTime = Date.parse(b.created_at);
      return aTime - bTime;
    })[0];
}

async function fetchAllQuestions(client) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await client
      .from('questions_master')
      .select('id,slug,review_status,reviewed_by,reviewed_at,content_enriched_at,created_at,updated_at,citation_notes')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

async function applyUpdates(client, patches) {
  const results = [];
  for (const patch of patches) {
    const { id, ...update } = patch.update;
    const { data, error } = await client.from('questions_master').update(update).eq('id', id).select('id,slug');
    if (error) throw error;
    results.push({ id, slug: patch.slug, applied: Boolean(data?.length) });
  }
  return results;
}

async function main() {
  const { apply } = parseArgs(process.argv.slice(2));
  const { url, key, serviceRoleKey } = resolveSupabaseConfig({ requireWrite: apply });
  const client = createClient(url, apply ? serviceRoleKey : key, { auth: { persistSession: false } });

  const rows = await fetchAllQuestions(client);
  const bySlug = new Map();
  for (const row of rows) {
    const key = cleanText(row.slug);
    // Skip null/blank slugs when grouping duplicates
    if (!key) continue;
    const list = bySlug.get(key) ?? [];
    list.push(row);
    bySlug.set(key, list);
  }

  const duplicates = [...bySlug.entries()].filter(([, list]) => list.length > 1);
  const patches = [];
  const backups = [];

  for (const [slug, list] of duplicates) {
    const canonical = pickCanonical(list);
    const canonicalId = canonical.id;
    for (const row of list) {
      if (row.id === canonical.id) continue;
      backups.push({ ...row });
      const retiredSlug = `${slug}-retired-duplicate-${String(row.id).slice(0, 8)}`.toLowerCase();
      patches.push({
        slug,
        canonical_slug: canonical.slug,
        canonical_id: canonicalId,
        update: {
          id: row.id,
          slug: retiredSlug,
          review_status: RETIRED_DUPLICATE,
          citation_notes: demoteNote(canonical.slug, row.citation_notes),
        },
        previous: {
          slug: row.slug,
          review_status: row.review_status,
          citation_notes: row.citation_notes,
        },
      });
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const backupPath = `${OUT_DIR}/backup-duplicate-slugs-${todayStamp()}.json`;
  const planPath = `${OUT_DIR}/plan-duplicate-slugs-${todayStamp()}.json`;
  const resolutionPath = `${OUT_DIR}/duplicate-resolution-${todayStamp()}.json`;

  writeFileSync(backupPath, `${JSON.stringify({ generated_at: new Date().toISOString(), rows: backups }, null, 2)}\n`);
  const plan = {
    generated_at: new Date().toISOString(),
    mode: apply ? 'apply' : 'dry-run',
    duplicate_slug_groups: duplicates.length,
    duplicate_rows_total: patches.length,
    patches,
  };
  writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);
  const resolution = duplicates.map(([slug, list]) => {
    const canonical = pickCanonical(list);
    return {
      slug,
      canonical_id: canonical.id,
      canonical_slug: canonical.slug,
      retired: list
        .filter((r) => r.id !== canonical.id)
        .map((r) => ({
          id: r.id,
          new_slug: `${slug}-retired-duplicate-${String(r.id).slice(0, 8)}`.toLowerCase(),
        })),
    };
  });
  writeFileSync(resolutionPath, `${JSON.stringify({ generated_at: new Date().toISOString(), resolutions: resolution }, null, 2)}\n`);

  console.log(`Planned duplicate demotions: ${patches.length} across ${duplicates.length} slugs`);
  console.log(`Wrote ${backupPath}`);
  console.log(`Wrote ${planPath}`);
  console.log(`Wrote ${resolutionPath}`);

  if (apply && patches.length) {
    const results = await applyUpdates(client, patches);
    const applied = results.filter((r) => r.applied).length;
    console.log(`Applied updates: ${applied}/${results.length}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

