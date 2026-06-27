#!/usr/bin/env node
/**
 * Publish approved new-question drafts into questions_master.
 *
 * Uses direct Supabase write when credentials are available, otherwise the
 * secured production admin API (CRON_SECRET).
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { bootstrapCloudEnv } from './lib/cloud-env.mjs';
import { loadDraftsFromPaths, publishPhase1bDrafts, resolveCampaignConfig } from './lib/publish-phase-1b.mjs';
import { postAdminApply } from './lib/remote-admin-request.mjs';
import { resolveSupabaseConfig } from './lib/supabase-env.mjs';

const DEFAULT_REMOTE_URL = 'https://www.deeper.global/api/admin/publish-phase-1b-drafts';

function parseArgs(argv) {
  let campaign = 'phase-1b';
  const paths = [];
  let apply = false;
  let skipExisting = true;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--apply') {
      apply = true;
      continue;
    }

    if (arg === '--fail-on-existing') {
      skipExisting = false;
      continue;
    }

    if (arg === '--campaign') {
      campaign = argv[index + 1] ?? '';
      index += 1;
      continue;
    }

    if (arg.startsWith('--campaign=')) {
      campaign = arg.slice('--campaign='.length);
      continue;
    }

    paths.push(arg);
  }

  resolveCampaignConfig(campaign);
  return { apply, campaign, paths, skipExisting };
}

async function publishRemotely({ apply, campaign, paths, skipExisting, remoteUrl }) {
  const drafts = loadDraftsFromPaths(paths);
  return postAdminApply({
    url: remoteUrl,
    body: { apply, campaign, skipExisting, drafts },
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const remoteUrl = process.env.DGP_PUBLISH_PHASE_1B_URL ?? DEFAULT_REMOTE_URL;

  if (!args.paths.length) {
    throw new Error('Pass one or more draft JSON files.');
  }

  bootstrapCloudEnv();

  let report;
  try {
    const drafts = loadDraftsFromPaths(args.paths);
    const { url, key } = resolveSupabaseConfig({ requireWrite: args.apply });
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    report = await publishPhase1bDrafts({
      supabase,
      drafts,
      campaign: args.campaign,
      apply: args.apply,
      skipExisting: args.skipExisting,
    });
    report.apply_path = 'direct_write';
  } catch (error) {
    if (
      !args.apply ||
      !/Missing Supabase credentials|SUPABASE_SERVICE_ROLE_KEY|Write access requires/i.test(error.message ?? '')
    ) {
      throw error;
    }

    report = await publishRemotely({ ...args, remoteUrl });
    report.apply_path = 'remote_admin';
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
