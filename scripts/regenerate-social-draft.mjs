#!/usr/bin/env node
/**
 * Generate one click-through social draft (local operator script).
 * Uses stored Supabase + Anthropic credentials; no CRON_SECRET required.
 *
 *   node scripts/regenerate-social-draft.mjs
 *   node scripts/regenerate-social-draft.mjs --question-id <uuid>
 *   node scripts/regenerate-social-draft.mjs --dry-run
 */
import { generateAndMaybeSaveSocialDrafts } from '../api/cron/generate-drafts.js';
import { loadLocalEnv } from './lib/supabase-env.mjs';

function parseArgs(argv) {
  const dryRun = argv.includes('--dry-run');
  const questionIdIndex = argv.indexOf('--question-id');
  const questionId = questionIdIndex === -1 ? undefined : argv[questionIdIndex + 1];
  return { dryRun, questionId };
}

async function main() {
  loadLocalEnv({ force: true });

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!anthropicApiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY. Run `npm run env:sync` once.');
  }

  const { dryRun, questionId } = parseArgs(process.argv.slice(2));
  const result = await generateAndMaybeSaveSocialDrafts({
    anthropicApiKey,
    questionId,
    writeDrafts: !dryRun,
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun,
        strategy: result.strategy,
        question_id: result.question.id,
        slug: result.question.slug,
        question_only_path: result.questionOnlyPath,
        drafts_generated: result.drafts.length,
        drafts_written: result.written,
        draft_formats: result.drafts.map((draft) => draft.format),
        draft_preview: result.drafts[0]?.body ?? null,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
