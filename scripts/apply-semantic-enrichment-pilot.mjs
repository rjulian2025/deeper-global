#!/usr/bin/env node
/**
 * Promote reviewed semantic enrichment pilot JSON to questions_master.semantic_enrichment_v1.
 *
 *   npm run content:apply-semantic-enrichment-pilot
 *   npm run content:apply-semantic-enrichment-pilot -- --apply
 *   npm run content:apply-semantic-enrichment-pilot -- --apply --slug how-do-i-know-if-i-have-adhd-as-an-adult
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { validateSemanticEnrichmentV1 } from '../api/lib/semantic-enrichment.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const DEFAULT_PILOT_PATH = 'reports/semantic-enrichment/adhd-pilot-v1.json';
const OUT_DIR = 'reports/semantic-enrichment/promote-updates';

function parseArgs(argv) {
  const args = {
    apply: false,
    path: DEFAULT_PILOT_PATH,
    slugs: [],
    status: 'ai_generated',
  };

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
      continue;
    }
    if (arg === '--path') {
      args.path = argv[index + 1] ?? DEFAULT_PILOT_PATH;
      index += 1;
      continue;
    }
    if (arg.startsWith('--path=')) {
      args.path = arg.slice('--path='.length);
      continue;
    }
    if (arg === '--status') {
      args.status = argv[index + 1] ?? 'ai_generated';
      index += 1;
      continue;
    }
    if (arg.startsWith('--status=')) {
      args.status = arg.slice('--status='.length);
      continue;
    }
  }

  return args;
}

function loadPilot(path) {
  const payload = JSON.parse(readFileSync(path, 'utf8'));
  return Array.isArray(payload.items) ? payload.items : [];
}

function buildUpdates(items, { slugs, status }) {
  const scoped = slugs.length ? items.filter((item) => slugs.includes(item.slug)) : items;
  const updates = [];
  const skipped = [];

  for (const item of scoped) {
    const validation = validateSemanticEnrichmentV1(item.semantic_enrichment_v1);
    if (!validation.enrichment || validation.errors.length || validation.warnings.length) {
      skipped.push({
        slug: item.slug,
        errors: validation.errors,
        warnings: validation.warnings,
      });
      continue;
    }

    updates.push({
      slug: item.slug,
      semantic_enrichment_v1: {
        ...validation.enrichment,
        enrichment_status: status,
        enrichment_updated_at: new Date().toISOString(),
      },
    });
  }

  return { updates, skipped };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const items = loadPilot(args.path);
  const { updates, skipped } = buildUpdates(items, args);

  const report = {
    generated_at: new Date().toISOString(),
    apply: args.apply,
    source: args.path,
    update_count: updates.length,
    skipped_count: skipped.length,
    slugs: updates.map((item) => item.slug),
    skipped,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = `${OUT_DIR}/promote-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify(report, null, 2));
  console.log(`Report: ${reportPath}`);

  if (!updates.length) {
    console.log('No eligible updates.');
    process.exit(skipped.length ? 1 : 0);
  }

  if (!args.apply) {
    console.log('Dry run only. Re-run with --apply to write to Supabase.');
    return;
  }

  const { url, key } = resolveSupabaseConfig({ requireWrite: true });
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  for (const update of updates) {
    const { error } = await supabase
      .from('questions_master')
      .update({ semantic_enrichment_v1: update.semantic_enrichment_v1 })
      .eq('slug', update.slug);

    if (error) {
      throw new Error(`Failed to promote ${update.slug}: ${error.message}`);
    }

    console.log(`[promoted] ${update.slug}`);
  }

  console.log(`Promoted ${updates.length} semantic enrichment rows.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
