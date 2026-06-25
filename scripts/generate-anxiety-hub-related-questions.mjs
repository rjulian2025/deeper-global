#!/usr/bin/env node
/**
 * Generate in-graph related_questions for the 36-answer Anxiety hub rabbit-hole graph.
 *
 *   node scripts/generate-anxiety-hub-related-questions.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'reports/anxiety-hub');
const OUT_PATH = join(OUT_DIR, 'related-questions-batch.json');
const PRIORITY_QUEUE_PATH = join(ROOT, 'reports/enrichment-corpus/priority-queue.json');

/** Slug -> slug[] follow-up graph (hub-internal only). */
const ANXIETY_HUB_RELATED_GRAPH = {
  'my-chest-tightens-whenever-someone-texts-me-unexpectedly': [
    'how-do-i-know-if-im-having-a-panic-attack-184730-067',
    'why-does-my-chest-feel-tight-when-im-anx-181083-001',
    'can-anxiety-make-me-feel-like-i-cant-bre-181083-011',
    'what-should-i-do-during-a-panic-attack',
    'what-is-grounding-and-how-can-it-help-with-anxiety',
  ],
  'why-does-my-chest-feel-tight-when-im-anx-181083-001': [
    'my-chest-tightens-whenever-someone-texts-me-unexpectedly',
    'can-anxiety-make-me-feel-like-i-cant-bre-181083-011',
    'why-does-my-heart-race-even-when-im-just-181083-005',
    'how-do-i-know-if-im-having-a-panic-attack-184730-067',
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
  ],
  'how-do-i-know-if-im-having-a-panic-attack-184730-067': [
    'what-should-i-do-during-a-panic-attack',
    'why-does-my-chest-feel-tight-when-im-anx-181083-001',
    'can-anxiety-make-me-feel-like-i-cant-bre-181083-011',
    'how-do-i-know-if-i-need-professional-help-for-my-anxiety',
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
  ],
  'what-should-i-do-during-a-panic-attack': [
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
    'what-is-grounding-and-how-can-it-help-with-anxiety',
    'how-do-i-know-if-im-having-a-panic-attack-184730-067',
    'why-does-my-chest-feel-tight-when-im-anx-181083-001',
    'how-do-i-know-if-i-need-professional-help-for-my-anxiety',
  ],
  'can-anxiety-make-me-feel-like-i-cant-bre-181083-011': [
    'why-does-my-chest-feel-tight-when-im-anx-181083-001',
    'why-does-my-heart-race-even-when-im-just-181083-005',
    'what-should-i-do-during-a-panic-attack',
    'what-is-grounding-and-how-can-it-help-with-anxiety',
    'how-do-i-know-if-im-having-a-panic-attack-184730-067',
  ],
  'why-does-my-heart-race-even-when-im-just-181083-005': [
    'why-does-my-chest-feel-tight-when-im-anx-181083-001',
    'can-anxiety-make-me-feel-like-i-cant-bre-181083-011',
    'why-do-i-feel-anxious-for-no-reason',
    'why-does-my-anxiety-get-worse-at-night',
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
  ],
  'why-do-i-overthink-every-conversation-after-it-happens': [
    'how-do-i-stop-overthinking-everything-i-say-and-184730-036',
    'i-rehearse-conversations-in-my-head-for-hours-before-they-happen',
    'what-is-social-anxiety-and-how-do-i-overcome-it',
    'how-do-i-cope-with-the-fear-of-being-judged-by-others-w5x6y7',
    'why-do-i-feel-awkward-in-social-situatio-181083-074',
  ],
  'how-do-i-stop-overthinking-everything-i-say-and-184730-036': [
    'why-do-i-overthink-every-conversation-after-it-happens',
    'i-rehearse-conversations-in-my-head-for-hours-before-they-happen',
    'what-is-social-anxiety-and-how-do-i-overcome-it',
    'how-do-i-cope-with-the-fear-of-being-judged-by-others-w5x6y7',
    'what-is-grounding-and-how-can-it-help-with-anxiety',
  ],
  'what-is-social-anxiety-and-how-do-i-overcome-it': [
    'why-do-i-feel-awkward-in-social-situatio-181083-074',
    'how-do-i-cope-with-the-fear-of-being-judged-by-others-w5x6y7',
    'i-rehearse-conversations-in-my-head-for-hours-before-they-happen',
    'how-do-i-deal-with-social-anxiety-at-wor-191368-004',
    'why-do-i-overthink-every-conversation-after-it-happens',
  ],
  'how-do-i-cope-with-the-fear-of-being-judged-by-others-w5x6y7': [
    'what-is-social-anxiety-and-how-do-i-overcome-it',
    'why-do-i-feel-awkward-in-social-situatio-181083-074',
    'i-rehearse-conversations-in-my-head-for-hours-before-they-happen',
    'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed',
    'how-do-i-deal-with-social-anxiety-at-wor-191368-004',
  ],
  'why-do-i-feel-awkward-in-social-situatio-181083-074': [
    'what-is-social-anxiety-and-how-do-i-overcome-it',
    'how-do-i-cope-with-the-fear-of-being-judged-by-others-w5x6y7',
    'i-rehearse-conversations-in-my-head-for-hours-before-they-happen',
    'why-do-i-overthink-every-conversation-after-it-happens',
    'how-do-i-deal-with-social-anxiety-at-wor-191368-004',
  ],
  'i-rehearse-conversations-in-my-head-for-hours-before-they-happen': [
    'why-do-i-overthink-every-conversation-after-it-happens',
    'how-do-i-stop-overthinking-everything-i-say-and-184730-036',
    'what-is-social-anxiety-and-how-do-i-overcome-it',
    'how-do-i-cope-with-the-fear-of-being-judged-by-others-w5x6y7',
    'why-do-i-feel-anxious-for-no-reason',
  ],
  'why-do-i-feel-anxious-for-no-reason': [
    'what-to-do-when-anxious-for-no-clear-reason',
    'why-do-i-feel-like-im-always-waiting-for-the-r8s3t6',
    'why-do-i-worry-about-things-that-havent-181288-006',
    'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed',
    'what-is-grounding-and-how-can-it-help-with-anxiety',
  ],
  'what-to-do-when-anxious-for-no-clear-reason': [
    'why-do-i-feel-anxious-for-no-reason',
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
    'what-is-grounding-and-how-can-it-help-with-anxiety',
    'how-do-i-know-if-my-anxiety-is-normal-or-184730-038',
    'how-can-i-manage-my-anxiety-without-medication',
  ],
  'why-do-i-worry-about-things-that-havent-181288-006': [
    'why-do-i-feel-like-im-always-waiting-for-the-r8s3t6',
    'how-do-i-stop-catastrophizing-every-smal-190219-005',
    'how-do-i-deal-with-anxiety-about-the-future',
    'why-do-i-feel-anxious-for-no-reason',
    'why-does-my-anxiety-get-worse-at-night',
  ],
  'why-do-i-feel-like-im-always-waiting-for-the-r8s3t6': [
    'why-do-i-worry-about-things-that-havent-181288-006',
    'how-do-i-stop-catastrophizing-every-smal-190219-005',
    'how-do-i-deal-with-anxiety-about-the-future',
    'why-do-i-feel-anxious-for-no-reason',
    'why-does-my-anxiety-get-worse-at-night',
  ],
  'how-do-i-stop-catastrophizing-every-smal-190219-005': [
    'why-do-i-worry-about-things-that-havent-181288-006',
    'why-do-i-feel-like-im-always-waiting-for-the-r8s3t6',
    'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed',
    'how-do-i-deal-with-the-anxiety-of-making-the-wrong-decision-m4n5o6',
    'how-do-i-deal-with-anxiety-about-the-future',
  ],
  'how-do-i-deal-with-anxiety-about-the-future': [
    'why-do-i-worry-about-things-that-havent-181288-006',
    'why-do-i-feel-like-im-always-waiting-for-the-r8s3t6',
    'how-do-i-stop-catastrophizing-every-smal-190219-005',
    'why-do-i-feel-anxious-when-i-check-my-ba-181083-027',
    'how-do-i-deal-with-sunday-night-anxiety-181083-050',
  ],
  'how-do-i-deal-with-sunday-night-anxiety-181083-050': [
    'how-do-i-deal-with-social-anxiety-at-wor-191368-004',
    'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed',
    'why-do-i-feel-anxious-when-i-check-my-ba-181083-027',
    'is-it-normal-to-lose-sleep-over-money-wo-181083-022',
    'how-do-i-deal-with-the-anxiety-of-making-the-wrong-decision-m4n5o6',
  ],
  'how-do-i-deal-with-social-anxiety-at-wor-191368-004': [
    'what-is-social-anxiety-and-how-do-i-overcome-it',
    'how-do-i-cope-with-the-fear-of-being-judged-by-others-w5x6y7',
    'how-do-i-deal-with-sunday-night-anxiety-181083-050',
    'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed',
    'why-do-i-feel-awkward-in-social-situatio-181083-074',
  ],
  'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed': [
    'how-do-i-deal-with-the-anxiety-of-making-the-wrong-decision-m4n5o6',
    'how-do-i-stop-catastrophizing-every-smal-190219-005',
    'how-do-i-cope-with-the-fear-of-being-judged-by-others-w5x6y7',
    'how-do-i-deal-with-sunday-night-anxiety-181083-050',
    'how-do-i-deal-with-social-anxiety-at-wor-191368-004',
  ],
  'how-do-i-deal-with-the-anxiety-of-making-the-wrong-decision-m4n5o6': [
    'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed',
    'how-do-i-stop-catastrophizing-every-smal-190219-005',
    'why-do-i-feel-anxious-when-i-check-my-ba-181083-027',
    'how-do-i-deal-with-anxiety-about-the-future',
    'how-do-i-deal-with-sunday-night-anxiety-181083-050',
  ],
  'why-do-i-feel-anxious-when-i-check-my-ba-181083-027': [
    'is-it-normal-to-lose-sleep-over-money-wo-181083-022',
    'how-do-i-deal-with-sunday-night-anxiety-181083-050',
    'how-do-i-deal-with-anxiety-about-the-future',
    'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed',
    'why-does-my-anxiety-get-worse-at-night',
  ],
  'is-it-normal-to-lose-sleep-over-money-wo-181083-022': [
    'why-do-i-feel-anxious-when-i-check-my-ba-181083-027',
    'how-do-i-deal-with-sunday-night-anxiety-181083-050',
    'why-does-my-anxiety-get-worse-at-night',
    'how-do-i-stop-my-mind-from-racing-when-i-181083-044',
    'how-do-i-deal-with-anxiety-about-the-future',
  ],
  'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed': [
    'whats-the-difference-between-stress-and-anxiety',
    'how-do-i-know-if-my-anxiety-is-normal-or-184730-038',
    'why-do-i-feel-anxious-for-no-reason',
    'how-do-i-know-if-i-need-professional-help-for-my-anxiety',
    'how-can-i-manage-my-anxiety-without-medication',
  ],
  'how-do-i-know-if-my-anxiety-is-normal-or-184730-038': [
    'how-do-i-know-if-i-need-professional-help-for-my-anxiety',
    'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed',
    'what-do-i-do-when-my-anxiety-is-so-bad-i-177940-004',
    'how-can-i-manage-my-anxiety-without-medication',
    'whats-the-difference-between-stress-and-anxiety',
  ],
  'how-do-i-know-if-i-need-professional-help-for-my-anxiety': [
    'how-do-i-know-if-my-anxiety-is-normal-or-184730-038',
    'what-do-i-do-when-my-anxiety-is-so-bad-i-177940-004',
    'how-can-i-manage-my-anxiety-without-medication',
    'is-it-normal-to-be-scared-of-starting-ps-181083-066',
    'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed',
  ],
  'how-can-i-manage-my-anxiety-without-medication': [
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
    'what-is-grounding-and-how-can-it-help-with-anxiety',
    'how-does-meditation-help-with-anxiety',
    'is-it-normal-to-be-scared-of-starting-ps-181083-066',
    'how-do-i-know-if-i-need-professional-help-for-my-anxiety',
  ],
  'is-it-normal-to-be-scared-of-starting-ps-181083-066': [
    'how-can-i-manage-my-anxiety-without-medication',
    'how-do-i-know-if-i-need-professional-help-for-my-anxiety',
    'how-do-i-know-if-my-anxiety-is-normal-or-184730-038',
    'whats-the-difference-between-stress-and-anxiety',
    'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed',
  ],
  'whats-the-difference-between-stress-and-anxiety': [
    'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed',
    'how-do-i-know-if-my-anxiety-is-normal-or-184730-038',
    'why-do-i-feel-anxious-for-no-reason',
    'how-can-i-manage-my-anxiety-without-medication',
    'how-do-i-deal-with-sunday-night-anxiety-181083-050',
  ],
  'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment': [
    'what-is-grounding-and-how-can-it-help-with-anxiety',
    'what-should-i-do-during-a-panic-attack',
    'why-does-my-chest-feel-tight-when-im-anx-181083-001',
    'why-does-my-anxiety-get-worse-at-night',
    'how-do-i-know-if-i-need-professional-help-for-my-anxiety',
  ],
  'what-is-grounding-and-how-can-it-help-with-anxiety': [
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
    'how-does-meditation-help-with-anxiety',
    'what-to-do-when-anxious-for-no-clear-reason',
    'why-do-i-feel-anxious-for-no-reason',
    'what-should-i-do-during-a-panic-attack',
  ],
  'how-does-meditation-help-with-anxiety': [
    'what-is-grounding-and-how-can-it-help-with-anxiety',
    'how-can-i-manage-my-anxiety-without-medication',
    'how-do-i-stop-my-mind-from-racing-when-i-181083-044',
    'why-does-my-anxiety-get-worse-at-night',
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
  ],
  'what-do-i-do-when-my-anxiety-is-so-bad-i-177940-004': [
    'how-do-i-know-if-i-need-professional-help-for-my-anxiety',
    'how-do-i-know-if-my-anxiety-is-normal-or-184730-038',
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
    'what-is-grounding-and-how-can-it-help-with-anxiety',
    'what-should-i-do-during-a-panic-attack',
  ],
  'why-does-my-anxiety-get-worse-at-night': [
    'how-do-i-stop-my-mind-from-racing-when-i-181083-044',
    'why-do-i-worry-about-things-that-havent-181288-006',
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
    'is-it-normal-to-lose-sleep-over-money-wo-181083-022',
    'why-do-i-feel-anxious-for-no-reason',
  ],
  'how-do-i-stop-my-mind-from-racing-when-i-181083-044': [
    'why-does-my-anxiety-get-worse-at-night',
    'what-is-grounding-and-how-can-it-help-with-anxiety',
    'how-does-meditation-help-with-anxiety',
    'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
    'is-it-normal-to-lose-sleep-over-money-wo-181083-022',
  ],
};

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function displayTitle(row) {
  return cleanText(row?.improved_title) || cleanText(row?.question);
}

function normalizeMatchText(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[?.,!]/g, '');
}

function buildQuestionTextIndex(questions) {
  const index = new Map();
  for (const question of questions) {
    for (const text of [question.question, question.improved_title]) {
      const normalized = normalizeMatchText(text);
      if (normalized && !index.has(normalized)) {
        index.set(normalized, question);
      }
    }
  }
  return index;
}

function resolveFollowUpText(text, questions, index) {
  const normalized = normalizeMatchText(text);
  const direct = questions.find((question) => {
    const qText = normalizeMatchText(question.question);
    const qTitle = normalizeMatchText(question.improved_title);
    return qText === normalized || qTitle === normalized;
  });
  if (direct) return direct;
  return index.get(normalized) ?? null;
}

function main() {
  const priorityQueue = JSON.parse(readFileSync(PRIORITY_QUEUE_PATH, 'utf8'));
  const hubSlugs = Object.keys(ANXIETY_HUB_RELATED_GRAPH);
  const hubSlugSet = new Set(hubSlugs);
  const hubQuestions = priorityQueue.filter((row) => hubSlugSet.has(row.slug));
  const bySlug = new Map(hubQuestions.map((row) => [row.slug, row]));
  const index = buildQuestionTextIndex(priorityQueue);

  if (hubQuestions.length !== hubSlugs.length) {
    const missing = hubSlugs.filter((slug) => !bySlug.has(slug));
    throw new Error(`Missing hub slugs in priority queue: ${missing.join(', ')}`);
  }

  const batch = [];
  let totalFollowUps = 0;
  let matchedFollowUps = 0;

  for (const slug of hubSlugs) {
    const source = bySlug.get(slug);
    const targetSlugs = ANXIETY_HUB_RELATED_GRAPH[slug];
    const relatedQuestions = targetSlugs.map((targetSlug) => displayTitle(bySlug.get(targetSlug)));
    const resolution = targetSlugs.map((targetSlug) => {
      const label = displayTitle(bySlug.get(targetSlug));
      const match = resolveFollowUpText(label, priorityQueue, index);
      const matched = Boolean(match && match.slug === targetSlug);
      totalFollowUps += 1;
      if (matched) matchedFollowUps += 1;
      return { targetSlug, label, matched };
    });

    batch.push({
      slug,
      question: displayTitle(source),
      related_questions: relatedQuestions,
      related_target_slugs: targetSlugs,
      resolution,
    });
  }

  const resolutionRate = totalFollowUps ? matchedFollowUps / totalFollowUps : 0;
  const report = {
    version: 'anxiety-hub-related-questions-v1',
    generated_at: new Date().toISOString(),
    prompt_version: 'deeper-anxiety-hub-v1',
    hub_slug_count: hubSlugs.length,
    follow_up_count: totalFollowUps,
    in_graph_resolution_rate: Number(resolutionRate.toFixed(4)),
    batch,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        path: OUT_PATH,
        hub_slugs: hubSlugs.length,
        follow_ups: totalFollowUps,
        in_graph_resolution_rate: report.in_graph_resolution_rate,
      },
      null,
      2
    )
  );

  if (resolutionRate < 0.75) {
    throw new Error(`In-graph resolution rate ${resolutionRate.toFixed(2)} is below 0.75 target.`);
  }
}

main();
