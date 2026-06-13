#!/usr/bin/env node
/**
 * Publish approved new-question drafts into questions_master.
 *
 * Phase 1B dry run:
 *   npm run content:publish-phase-1b -- reports/phase-1b/draft-answers/batch-01-drafts.json
 *
 * Phase 1B apply:
 *   npm run content:publish-phase-1b -- --apply reports/phase-1b/draft-answers/batch-01-drafts.json
 *
 * AI sprint dry run:
 *   npm run content:publish-ai-sprint -- reports/ai-sprint/draft-answers/batch-01-drafts.json
 *
 * AI sprint apply:
 *   npm run content:publish-ai-sprint -- --apply reports/ai-sprint/draft-answers/batch-01-drafts.json
 */
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const ENV_PATH = '.vercel/.env.production.local';
const REVIEWED_BY = 'codex-seo-review';
const CAMPAIGNS = {
  'phase-1b': {
    promptVersion: 'deeper-phase-1b-new-question-v1',
    citationNote: 'Phase 1B new-question batch promotion.',
  },
  'ai-sprint': {
    promptVersion: 'deeper-ai-concerns-sprint-v1',
    citationNote: 'AI mental health concerns sprint promotion.',
  },
};

function parseEnv(path) {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((line) => !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        const key = line.slice(0, index);
        let value = line.slice(index + 1);
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        return [key, value];
      })
  );
}

function resolveSupabaseConfig({ requireWrite = false } = {}) {
  const fileEnv = (() => {
    try {
      return parseEnv(ENV_PATH);
    } catch {
      return {};
    }
  })();

  const firstPresent = (...values) => values.find((value) => typeof value === 'string' && value.trim());
  const serviceRoleKey = firstPresent(process.env.SUPABASE_SERVICE_ROLE_KEY, fileEnv.SUPABASE_SERVICE_ROLE_KEY);
  const url = firstPresent(
    process.env.SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    fileEnv.SUPABASE_URL,
    fileEnv.PUBLIC_SUPABASE_URL,
    fileEnv.NEXT_PUBLIC_SUPABASE_URL
  );
  const key = firstPresent(
    serviceRoleKey,
    process.env.SUPABASE_ANON_KEY,
    process.env.PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    fileEnv.SUPABASE_ANON_KEY,
    fileEnv.PUBLIC_SUPABASE_ANON_KEY,
    fileEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!url || !key) {
    throw new Error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY, or use .vercel/.env.production.local.');
  }

  if (requireWrite && !serviceRoleKey) {
    throw new Error('Publishing requires SUPABASE_SERVICE_ROLE_KEY because questions_master rejects anon-key inserts under RLS.');
  }

  return { url, key };
}

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizeSafetyFlags(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanText(item)).filter(Boolean);
}

function requireArray(value, label, draft) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${draft.slug}: missing required array ${label}.`);
  }
  return value;
}

function answerTextFromSections(sections) {
  return sections
    .map((section) => {
      const heading = cleanText(section.heading);
      const body = cleanText(section.body);
      return heading ? `## ${heading}\n\n${body}` : body;
    })
    .filter(Boolean)
    .join('\n\n');
}

function wordCount(value) {
  return cleanText(value).split(/\s+/).filter(Boolean).length;
}

function sourceRefsForInsert(value, draft) {
  const sourceRefs = requireArray(value, 'source_refs', draft)
    .map((source) => ({
      title: cleanText(source?.title),
      url: cleanText(source?.url),
      publisher: cleanText(source?.publisher),
      note: cleanText(source?.note),
    }))
    .filter((source) => source.title || source.url);

  if (!sourceRefs.length) {
    throw new Error(`${draft.slug}: at least one source reference with title or URL is required.`);
  }

  return sourceRefs;
}

function entitiesFromDraft(draft) {
  const names = [draft.primary_theme, draft.category, ...(Array.isArray(draft.related_themes) ? draft.related_themes : [])]
    .map((name) => cleanText(name))
    .filter(Boolean);

  return Array.from(new Set(names)).map((name) => ({ name, type: 'Topic' }));
}

function parseArgs(argv) {
  let campaign = 'phase-1b';
  const paths = [];
  let apply = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--apply') {
      apply = true;
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

  const campaignConfig = CAMPAIGNS[campaign];
  if (!campaignConfig) {
    throw new Error(`Unknown campaign "${campaign}". Use one of: ${Object.keys(CAMPAIGNS).join(', ')}`);
  }

  return { apply, campaign, campaignConfig, paths };
}

function citationNotesFromDraft(draft, campaignConfig) {
  const notes = [
    campaignConfig.citationNote,
    cleanText(draft.draft_notes) && `Draft notes: ${cleanText(draft.draft_notes)}`,
    normalizeSafetyFlags(draft.safety_flags).length && `Safety flags: ${normalizeSafetyFlags(draft.safety_flags).join(', ')}`,
    Array.isArray(draft.citation_gaps) && draft.citation_gaps.length && `Citation follow-ups: ${draft.citation_gaps.map((gap) => cleanText(gap)).filter(Boolean).join(' ')}`,
  ].filter(Boolean);

  return notes.join('\n');
}

function rowFromDraft(draft, campaignConfig) {
  const question = cleanText(draft.question);
  const slug = cleanText(draft.slug);
  const category = cleanText(draft.category);
  const sections = requireArray(draft.answer_sections, 'answer_sections', draft);
  const answer = answerTextFromSections(sections);

  if (!question) throw new Error(`${slug || 'unknown draft'}: question is required.`);
  if (!slug) throw new Error(`${question}: slug is required.`);
  if (!category) throw new Error(`${slug}: category is required.`);
  if (!answer) throw new Error(`${slug}: answer text is required.`);

  return {
    id: randomUUID(),
    question,
    answer,
    word_count: wordCount(answer),
    short_answer: cleanText(draft.improved_summary || draft.suggested_schema_answer),
    raw_category: category,
    category,
    slug,
    published: true,
    improved_title: cleanText(draft.improved_title),
    improved_meta_description: cleanText(draft.improved_meta_description),
    improved_summary: cleanText(draft.improved_summary),
    answer_sections: sections,
    key_takeaways: requireArray(draft.key_takeaways, 'key_takeaways', draft),
    care_note: cleanText(draft.care_note),
    related_questions: Array.isArray(draft.related_questions) ? draft.related_questions : [],
    suggested_schema_question: cleanText(draft.suggested_schema_question || question),
    suggested_schema_answer: cleanText(draft.suggested_schema_answer || draft.improved_summary),
    primary_theme: cleanText(draft.primary_theme || category),
    related_themes: Array.isArray(draft.related_themes) ? draft.related_themes : [],
    citation_notes: citationNotesFromDraft(draft, campaignConfig),
    content_prompt_version: campaignConfig.promptVersion,
    content_enriched_at: new Date().toISOString(),
    review_status: 'reviewed',
    reviewed_by: REVIEWED_BY,
    source_refs: sourceRefsForInsert(draft.source_refs, draft),
    primary_entities: entitiesFromDraft(draft).slice(0, 3),
    related_entities: entitiesFromDraft(draft),
  };
}

function loadRows(paths, campaignConfig) {
  const drafts = paths.flatMap((path) => {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    if (!Array.isArray(parsed)) {
      throw new Error(`${path} must contain a JSON array.`);
    }
    return parsed;
  });

  const rows = drafts.map((draft) => rowFromDraft(draft, campaignConfig));
  const duplicateInputSlugs = rows
    .map((row) => row.slug)
    .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);

  if (duplicateInputSlugs.length) {
    throw new Error(`Duplicate input slugs: ${Array.from(new Set(duplicateInputSlugs)).join(', ')}`);
  }

  return rows;
}

async function main() {
  const { apply, campaign, campaignConfig, paths } = parseArgs(process.argv.slice(2));

  if (!paths.length) {
    throw new Error('Pass one or more draft JSON files.');
  }

  const rows = loadRows(paths, campaignConfig);
  const { url, key } = resolveSupabaseConfig({ requireWrite: apply });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const slugs = rows.map((row) => row.slug);

  const { data: existingRows, error: existingError } = await supabase
    .from('questions_master')
    .select('slug, review_status')
    .in('slug', slugs);

  if (existingError) throw existingError;
  if (existingRows?.length) {
    throw new Error(`Refusing to publish over existing slugs: ${existingRows.map((row) => row.slug).join(', ')}`);
  }

  const { count: beforeCount, error: beforeCountError } = await supabase
    .from('questions_master')
    .select('id', { count: 'exact', head: true });

  if (beforeCountError) throw beforeCountError;

  if (!apply) {
    console.log(
      JSON.stringify(
        {
          mode: 'dry-run',
          campaign,
          rowsReady: rows.length,
          beforeCount,
          expectedAfterCount: (beforeCount ?? 0) + rows.length,
          slugs,
        },
        null,
        2
      )
    );
    return;
  }

  const { error: insertError } = await supabase.from('questions_master').insert(rows);
  if (insertError) throw insertError;

  const { count: afterCount, error: afterCountError } = await supabase
    .from('questions_master')
    .select('id', { count: 'exact', head: true });

  if (afterCountError) throw afterCountError;

  console.log(
    JSON.stringify(
      {
        mode: 'applied',
        campaign,
        inserted: rows.length,
        beforeCount,
        afterCount,
        expectedAfterCount: (beforeCount ?? 0) + rows.length,
        slugs,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
