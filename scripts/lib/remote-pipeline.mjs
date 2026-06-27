import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { postAdminApply } from './remote-admin-request.mjs';
import { bootstrapCloudEnv, assertPipelineCredentials, credentialMode } from './cloud-env.mjs';
import { resolveSupabaseConfig } from './supabase-env.mjs';
import { runVisitPriorityPipeline } from './visit-priority-pipeline.mjs';

const DEFAULT_REMOTE_URL = 'https://www.deeper.global/api/admin/run-visit-priority-pipeline';

export async function runVisitPriorityPipelineWithFallback({
  apply = false,
  remoteUrl = process.env.DGP_RUN_VISIT_PRIORITY_PIPELINE_URL ?? DEFAULT_REMOTE_URL,
  reportPath = `reports/phase-1b/visit-priority/pipeline-run-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  rewriteOnlyUnstaged = false,
} = {}) {
  const status = bootstrapCloudEnv();
  const mode = assertPipelineCredentials(status);

  let report;
  if (mode === 'direct_write') {
    report = await runVisitPriorityPipeline({ apply, rewriteOnlyUnstaged });
    report.apply_path = 'direct_write';
  } else {
    report = await postAdminApply({
      url: remoteUrl,
      body: { apply, rewriteOnlyUnstaged },
    });
    report.apply_path = 'remote_admin';
  }

  mkdirSync('reports/phase-1b/visit-priority', { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify({ ...report, report_path: reportPath }, null, 2)}\n`);
  return { ...report, report_path: reportPath };
}

export async function getQuestionsMasterCount() {
  const { url, key } = resolveSupabaseConfig({ requireWrite: false });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { count, error } = await supabase.from('questions_master').select('id', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}
