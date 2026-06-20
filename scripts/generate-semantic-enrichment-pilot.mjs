#!/usr/bin/env node
/**
 * Generate Semantic Enrichment V1 pilot drafts for 25 ADHD hub answers.
 * Writes reviewable JSON only — does NOT write to production Supabase.
 *
 *   node scripts/generate-semantic-enrichment-pilot.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSemanticEnrichmentV1 } from '../api/lib/semantic-enrichment.mjs';
import {
  ADHD_PILOT_SLUGS,
  ADHD_PILOT_TEMPLATES,
} from './lib/semantic-enrichment-adhd-pilot-templates.mjs';
import { loadLocalEnv, resolveSupabaseConfig } from './lib/supabase-env.mjs';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../reports/semantic-enrichment');
const OUT_PATH = join(OUT_DIR, 'adhd-pilot-v1.json');

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function getDisplayTitle(question) {
  return cleanText(question?.improved_title) || cleanText(question?.question) || question?.slug || '';
}

async function fetchPilotQuestions() {
  try {
    loadLocalEnv();
    const { url, key } = resolveSupabaseConfig();
    const slugs = ADHD_PILOT_SLUGS.map((slug) => `"${slug}"`).join(',');
    const endpoint = `${url}/rest/v1/questions_master?slug=in.(${slugs})&select=slug,question,improved_title,primary_theme,category,review_status`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return new Map();
    }

    const rows = await response.json();
    return new Map((Array.isArray(rows) ? rows : []).map((row) => [row.slug, row]));
  } catch {
    return new Map();
  }
}

function buildEnrichment(slug, question) {
  const template = ADHD_PILOT_TEMPLATES[slug];
  if (!template) {
    throw new Error(`Missing pilot template for slug: ${slug}`);
  }

  const now = new Date().toISOString();
  return {
    ...template,
    canonical_question: template.canonical_question || getDisplayTitle(question),
    enrichment_status: 'ai_generated',
    enrichment_updated_at: now,
  };
}

async function main() {
  const questionsBySlug = await fetchPilotQuestions();
  const items = [];
  const errors = [];

  for (const slug of ADHD_PILOT_SLUGS) {
    const question = questionsBySlug.get(slug) ?? { slug };
    const title = getDisplayTitle(question);
    const semantic_enrichment_v1 = buildEnrichment(slug, question);
    const validation = validateSemanticEnrichmentV1(semantic_enrichment_v1);

    const entry = {
      slug,
      title,
      semantic_enrichment_v1: validation.enrichment ?? semantic_enrichment_v1,
      warnings: validation.warnings,
      errors: validation.errors,
      confidence_notes: validation.valid
        ? 'Template-based pilot draft passed validation. Requires human editorial review before promote.'
        : 'Validation failed — fix before review.',
      source_question: cleanText(question?.question) || null,
    };

    if (!validation.valid) {
      errors.push({ slug, errors: validation.errors, warnings: validation.warnings });
    }

    items.push(entry);
  }

  const payload = {
    name: 'Deeper Semantic Enrichment V1 — ADHD Pilot',
    version: '1.0.0',
    generated_at: new Date().toISOString(),
    count: items.length,
    write_policy: 'review_only_no_production_db_write',
    slugs: ADHD_PILOT_SLUGS,
    validation_summary: {
      passed: items.filter((item) => !item.errors.length && !item.warnings.length).length,
      failed: errors.length,
      warning_count: items.reduce((sum, item) => sum + item.warnings.length, 0),
    },
    items,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${items.length} pilot enrichments to ${OUT_PATH}`);
  console.log(`Validation passed: ${payload.validation_summary.passed}/${items.length}`);

  if (errors.length) {
    console.error('Validation failures:', errors);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
