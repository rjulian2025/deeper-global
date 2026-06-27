import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { runAnswerRewrite, loadRewriteSlugsFromPayload } from './answer-rewrite-runner.mjs';
import { loadDraftsFromPaths, publishPhase1bDrafts } from './publish-phase-1b.mjs';
import { resolveSupabaseConfig } from './supabase-env.mjs';

export const VISIT_PRIORITY_MANIFEST = {
  version: 'visit-priority-pipeline-v1',
  campaign: 'visit-priority',
  draftsPath: 'reports/phase-1b/visit-priority/batch-25-drafts.json',
  rewriteSlugsPath: 'reports/gsc-weekly/rewrite-batch-priority-4.json',
};

export function loadVisitPriorityManifest(manifest = VISIT_PRIORITY_MANIFEST) {
  const drafts = loadDraftsFromPaths([manifest.draftsPath]);
  const rewritePayload = JSON.parse(readFileSync(manifest.rewriteSlugsPath, 'utf8'));
  const rewriteSlugs = loadRewriteSlugsFromPayload(rewritePayload);

  return {
    manifest,
    drafts,
    rewriteSlugs,
  };
}

export async function runVisitPriorityPipeline({
  apply = false,
  rootDir = process.cwd(),
  manifest = VISIT_PRIORITY_MANIFEST,
  rewriteOnlyUnstaged = false,
}) {
  const resolvedManifest = {
    ...manifest,
    draftsPath: join(rootDir, manifest.draftsPath),
    rewriteSlugsPath: join(rootDir, manifest.rewriteSlugsPath),
  };

  const { drafts, rewriteSlugs } = loadVisitPriorityManifest({
    ...manifest,
    draftsPath: resolvedManifest.draftsPath,
    rewriteSlugsPath: resolvedManifest.rewriteSlugsPath,
  });

  const { url, key } = resolveSupabaseConfig({ requireWrite: apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const publishReport = await publishPhase1bDrafts({
    supabase,
    drafts,
    campaign: manifest.campaign,
    apply,
    skipExisting: true,
  });

  const rewriteReport = await runAnswerRewrite({
    supabase,
    slugs: rewriteSlugs,
    apply,
    onlyUnstaged: !rewriteOnlyUnstaged,
  });

  return {
    version: manifest.version,
    generated_at: new Date().toISOString(),
    mode: apply ? 'apply' : 'dry-run',
    publish: publishReport,
    rewrite: rewriteReport,
    net_new_target: drafts.length,
    net_new_inserted: publishReport.inserted ?? 0,
    rewrite_target: rewriteSlugs.length,
    rewrite_processed: rewriteReport.processed ?? 0,
  };
}
