/**
 * Shared logic for maintaining the @deeperglobal social post queue.
 * Used by the refill cron and publish-approved auto-recovery.
 */
import {
  createDraftPost,
  generateSocialDraftSet,
  getFeaturedQuestions,
  getQuestionForSocialPost,
} from '../../api/cron/generate-drafts.js';
import { validateSocialPostForPublish } from '../../api/lib/social-publish-validation.mjs';

export const SOCIAL_QUEUE_MIN_APPROVED = 7;
export const SOCIAL_QUEUE_TARGET_APPROVED = 28;
export const HOURS_BETWEEN_POSTS = 6;
export const SAME_QUESTION_COOLDOWN_HOURS = 48;

function scheduleForIndex(index, start) {
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

export async function getSocialQueueStats(supabase) {
  const now = new Date().toISOString();

  const [approvedRes, failedRes, dueRes, lastScheduledRes] = await Promise.all([
    supabase
      .from('social_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .is('x_post_id', null),
    supabase
      .from('social_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'failed')
      .is('x_post_id', null),
    supabase
      .from('social_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .is('x_post_id', null)
      .or(`scheduled_for.is.null,scheduled_for.lte.${now}`),
    supabase
      .from('social_posts')
      .select('scheduled_for')
      .eq('status', 'approved')
      .is('x_post_id', null)
      .not('scheduled_for', 'is', null)
      .order('scheduled_for', { ascending: false })
      .limit(1),
  ]);

  if (approvedRes.error) throw approvedRes.error;
  if (failedRes.error) throw failedRes.error;
  if (dueRes.error) throw dueRes.error;
  if (lastScheduledRes.error) throw lastScheduledRes.error;

  return {
    approvedCount: approvedRes.count ?? 0,
    failedCount: failedRes.count ?? 0,
    dueCount: dueRes.count ?? 0,
    lastScheduledFor: lastScheduledRes.data?.[0]?.scheduled_for ?? null,
  };
}

export async function requeueFailedSocialPosts(supabase, limit = 100) {
  const normalizedLimit = Math.max(1, Math.min(limit, 100));
  const { data, error } = await supabase
    .from('social_posts')
    .update({ status: 'approved' })
    .eq('status', 'failed')
    .is('x_post_id', null)
    .order('id', { ascending: true })
    .limit(normalizedLimit)
    .select('id,format,body');

  if (error) throw error;
  return data ?? [];
}

async function getScheduleAnchor(supabase) {
  const stats = await getSocialQueueStats(supabase);
  if (stats.lastScheduledFor) {
    return { start: new Date(stats.lastScheduledFor), nextIndex: 1 };
  }
  return { start: new Date(), nextIndex: 0 };
}

export async function refillSocialQueue({
  supabase,
  anthropicApiKey,
  targetCount = SOCIAL_QUEUE_TARGET_APPROVED,
  minThreshold = SOCIAL_QUEUE_MIN_APPROVED,
  dryRun = false,
  force = false,
  logger = console,
}) {
  const stats = await getSocialQueueStats(supabase);
  const needsRefill = force || stats.approvedCount < minThreshold;

  let requeued = [];
  if (!dryRun && stats.failedCount > 0 && (needsRefill || stats.dueCount === 0)) {
    requeued = await requeueFailedSocialPosts(supabase, Math.max(targetCount - stats.approvedCount, 10));
    if (requeued.length > 0) {
      logger.log('social_queue_requeued_failed', { count: requeued.length });
    }
  }

  const refreshedStats = dryRun ? stats : await getSocialQueueStats(supabase);
  const generateCount = Math.max(0, targetCount - refreshedStats.approvedCount);

  if (!needsRefill && generateCount === 0) {
    return {
      ok: true,
      action: 'skipped',
      reason: 'queue_healthy',
      stats: refreshedStats,
      requeued: requeued.length,
      generated: 0,
      results: [],
    };
  }

  if (generateCount === 0) {
    return {
      ok: requeued.length > 0,
      action: 'requeued_only',
      stats: refreshedStats,
      requeued: requeued.length,
      generated: 0,
      results: requeued.map((post) => ({ post_id: post.id, status: 'requeued' })),
    };
  }

  const blocked = await loadBlockedQuestionIds(supabase);
  const candidates = (await loadCandidateQuestionIds(generateCount * 3)).filter((id) => !blocked.has(id));
  const scheduleAnchor = await getScheduleAnchor(supabase);
  const results = [];
  let generated = 0;

  for (const questionId of candidates) {
    if (generated >= generateCount) break;

    const question = await getQuestionForSocialPost(questionId);
    if (!question) {
      results.push({ question_id: questionId, status: 'skipped', error: 'question_not_found' });
      continue;
    }

    try {
      const draftSet = await generateSocialDraftSet(question, anthropicApiKey, logger);
      const draft = draftSet.drafts[0];
      if (!draft) throw new Error('no_draft_generated');

      const validationError = validateSocialPostForPublish(draft.body, question.slug);
      if (validationError) throw new Error(validationError);

      const scheduledFor = scheduleForIndex(scheduleAnchor.nextIndex + generated, scheduleAnchor.start);

      if (dryRun) {
        generated += 1;
        results.push({
          question_id: question.id,
          slug: question.slug,
          status: 'dry_run',
          scheduled_for: scheduledFor,
          body_preview: draft.body.slice(0, 160),
        });
        continue;
      }

      const created = await createDraftPost(question.id, draft.format, draft.body, null);
      if (!created?.id) throw new Error('draft_insert_failed');

      const { error: approveError } = await supabase
        .from('social_posts')
        .update({
          status: 'approved',
          scheduled_for: scheduledFor,
        })
        .eq('id', created.id);
      if (approveError) throw approveError;

      generated += 1;
      results.push({
        post_id: created.id,
        question_id: question.id,
        slug: question.slug,
        status: 'approved',
        scheduled_for: scheduledFor,
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

  const finalStats = dryRun ? refreshedStats : await getSocialQueueStats(supabase);

  return {
    ok: generated > 0 || requeued.length > 0,
    action: generated > 0 ? 'refilled' : requeued.length > 0 ? 'requeued_only' : 'no_candidates',
    stats: finalStats,
    requeued: requeued.length,
    generated,
    requested: generateCount,
    results,
  };
}
