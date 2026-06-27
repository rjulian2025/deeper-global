#!/usr/bin/env node
/**
 * Generate a batch of click-through social posts and optionally approve for publish.
 *
 *   node scripts/generate-social-draft-batch.mjs
 *   node scripts/generate-social-draft-batch.mjs --count 28 --replace
 *   node scripts/generate-social-draft-batch.mjs --dry-run
 *   node scripts/generate-social-draft-batch.mjs --no-approve
 */
import { createClient } from '@supabase/supabase-js';
import {
  createDraftPost,
  generateSocialDraftSet,
  getFeaturedQuestions,
  getQuestionForSocialPost,
} from '../api/cron/generate-drafts.js';
import { validateSocialPostForPublish } from '../api/lib/social-publish-validation.mjs';
import { loadLocalEnv, resolveSupabaseConfig } from './lib/supabase-env.mjs';

const DEFAULT_COUNT = 28;
const HOURS_BETWEEN_POSTS = 6;
const SAME_QUESTION_COOLDOWN_HOURS = 48;

function parseArgs(argv) {
  const dryRun = argv.includes('--dry-run');
  const replace = argv.includes('--replace');
  const approve = !argv.includes('--no-approve');
  const countIndex = argv.indexOf('--count');
  const countRaw = countIndex === -1 ? DEFAULT_COUNT : Number(argv[countIndex + 1]);
  const count = Number.isFinite(countRaw) ? Math.max(1, Math.min(Math.floor(countRaw), 100)) : DEFAULT_COUNT;
  return { dryRun, replace, approve, count };
}

function scheduleForIndex(index, start = new Date()) {
  return new Date(start.getTime() + index * HOURS_BETWEEN_POSTS * 60 * 60 * 1000).toISOString();
}

async function loadBlockedQuestionIds(supabase) {
  const blocked = new Set();
  const cooldownSince = new Date(Date.now() - SAME_QUESTION_COOLDOWN_HOURS * 60 * 60 * 1000).toISOString();

  const [{ data: pending }, { data: recentPublished }] = await Promise.all([
    supabase
      .from('social_posts')
      .select('question_id')
      .in('status', ['draft', 'approved'])
      .is('x_post_id', null),
    supabase
      .from('social_posts')
      .select('question_id')
      .eq('status', 'published')
      .gte('published_at', cooldownSince),
  ]);

  for (const row of pending ?? []) blocked.add(row.question_id);
  for (const row of recentPublished ?? []) blocked.add(row.question_id);
  return blocked;
}

async function loadCandidateQuestionIds(limit) {
  const featured = await getFeaturedQuestions('top_impressions', Math.max(limit * 2, 100));
  const ids = [];
  const seen = new Set();

  for (const row of featured ?? []) {
    const questionId = row?.question_id;
    if (!questionId || seen.has(questionId)) continue;
    seen.add(questionId);
    ids.push(questionId);
    if (ids.length >= limit) break;
  }

  return ids;
}

async function clearPendingQueue(supabase) {
  const { data, error } = await supabase
    .from('social_posts')
    .delete()
    .in('status', ['draft', 'approved'])
    .is('x_post_id', null)
    .select('id');
  if (error) throw error;
  return data?.length ?? 0;
}

async function main() {
  loadLocalEnv({ force: true });

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!anthropicApiKey) throw new Error('Missing ANTHROPIC_API_KEY. Run `npm run env:sync` once.');

  const { dryRun, replace, approve, count } = parseArgs(process.argv.slice(2));
  const { url, serviceRoleKey } = resolveSupabaseConfig({ requireWrite: !dryRun });
  const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

  let cleared = 0;
  if (replace && !dryRun) {
    cleared = await clearPendingQueue(supabase);
  }

  const blocked = await loadBlockedQuestionIds(supabase);
  const candidates = (await loadCandidateQuestionIds(count * 3)).filter((id) => !blocked.has(id));

  const results = [];
  let generated = 0;

  for (const questionId of candidates) {
    if (generated >= count) break;

    const question = await getQuestionForSocialPost(questionId);
    if (!question) {
      results.push({ question_id: questionId, status: 'skipped', error: 'question_not_found' });
      continue;
    }

    try {
      const draftSet = await generateSocialDraftSet(question, anthropicApiKey, console);
      const draft = draftSet.drafts[0];
      if (!draft) throw new Error('no_draft_generated');

      const validationError = validateSocialPostForPublish(draft.body, question.slug);
      if (validationError) throw new Error(validationError);

      if (dryRun) {
        generated += 1;
        results.push({
          question_id: question.id,
          slug: question.slug,
          status: 'dry_run',
          format: draft.format,
          body_preview: draft.body.slice(0, 160),
        });
        continue;
      }

      const created = await createDraftPost(question.id, draft.format, draft.body, null);
      if (!created?.id) throw new Error('draft_insert_failed');

      let finalStatus = 'draft';
      if (approve) {
        const { error: approveError } = await supabase
          .from('social_posts')
          .update({
            status: 'approved',
            scheduled_for: scheduleForIndex(generated),
          })
          .eq('id', created.id);
        if (approveError) throw approveError;
        finalStatus = 'approved';
      }

      generated += 1;
      results.push({
        post_id: created.id,
        question_id: question.id,
        slug: question.slug,
        status: finalStatus,
        scheduled_for: approve ? scheduleForIndex(generated - 1) : null,
      });
    } catch (error) {
      results.push({
        question_id: questionId,
        slug: question?.slug ?? null,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const summary = {
    ok: generated > 0,
    dryRun,
    replace,
    approve: approve && !dryRun,
    requested: count,
    cleared_pending: cleared,
    generated,
    failed: results.filter((row) => row.status === 'failed').length,
    approved: results.filter((row) => row.status === 'approved').length,
    results,
  };

  console.log(JSON.stringify(summary, null, 2));
  if (generated === 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
