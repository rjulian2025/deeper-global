import { readFileSync } from 'node:fs';

export const ENV_PATH = '.vercel/.env.production.local';

export function parseEnv(path) {
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

export function firstPresent(...values) {
  return values.find((value) => typeof value === 'string' && value.trim());
}

export function resolveSupabaseConfig({ requireWrite = false } = {}) {
  const fileEnv = (() => {
    try {
      return parseEnv(ENV_PATH);
    } catch {
      return {};
    }
  })();

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
    throw new Error('Applying enrichment updates requires SUPABASE_SERVICE_ROLE_KEY.');
  }

  return { url, key, serviceRoleKey };
}

export function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

export function truncate(value, max = 1800) {
  const text = cleanText(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}...`;
}

export function hasSourceRefs(question, minimum = 1) {
  if (!Array.isArray(question.source_refs)) return false;
  const count = question.source_refs.filter((item) => {
    if (!item || typeof item !== 'object') return false;
    return Boolean(cleanText(item.title) || cleanText(item.url));
  }).length;
  return count >= minimum;
}

export function isV2Answer(question) {
  if (question.content_enriched_at) return true;
  return Array.isArray(question.answer_sections) && question.answer_sections.length > 0;
}

export function sectionCount(question) {
  return Array.isArray(question.answer_sections) ? question.answer_sections.length : 0;
}

export function takeawayCount(question) {
  return Array.isArray(question.key_takeaways) ? question.key_takeaways.length : 0;
}

export function relatedQuestionCount(question) {
  return Array.isArray(question.related_questions) ? question.related_questions.length : 0;
}

const CRISIS_TERMS = [
  'suicide',
  'suicidal',
  'self-harm',
  'self harm',
  'overdose',
  'withdrawal',
  'relapse',
  'detox',
  'crisis',
  '988',
];

export function isCrisisSensitive(question) {
  const text = [
    question.question,
    question.improved_title,
    question.short_answer,
    question.improved_summary,
    question.answer,
    question.care_note,
  ]
    .map(cleanText)
    .join(' ')
    .toLowerCase();

  return CRISIS_TERMS.some((term) => text.includes(term));
}

export function missingFields(question) {
  const missing = [];

  if (!cleanText(question.improved_title)) missing.push('improved_title');
  if (!cleanText(question.improved_meta_description)) missing.push('improved_meta_description');
  if (!cleanText(question.improved_summary)) missing.push('improved_summary');
  if (sectionCount(question) < 1) missing.push('answer_sections');
  if (sectionCount(question) < 3) missing.push('answer_sections>=3');
  if (takeawayCount(question) < 1) missing.push('key_takeaways');
  if (takeawayCount(question) < 3) missing.push('key_takeaways>=3');
  if (!cleanText(question.care_note)) missing.push('care_note');
  if (relatedQuestionCount(question) < 3) missing.push('related_questions>=3');
  if (!cleanText(question.suggested_schema_question)) missing.push('suggested_schema_question');
  if (!cleanText(question.suggested_schema_answer)) missing.push('suggested_schema_answer');
  if (!cleanText(question.primary_theme)) missing.push('primary_theme');
  if (!Array.isArray(question.related_themes) || question.related_themes.length === 0) missing.push('related_themes');
  if (!hasSourceRefs(question, 1)) missing.push('source_refs');
  if (!hasSourceRefs(question, 2)) missing.push('source_refs>=2');
  if (!isV2Answer(question)) missing.push('content_enriched_at|answer_sections');

  return missing;
}

export function completenessScore(question) {
  const checks = [
    Boolean(cleanText(question.improved_title)),
    Boolean(cleanText(question.improved_meta_description)),
    Boolean(cleanText(question.improved_summary)),
    sectionCount(question) >= 1,
    sectionCount(question) >= 3,
    takeawayCount(question) >= 1,
    takeawayCount(question) >= 3,
    Boolean(cleanText(question.care_note)),
    relatedQuestionCount(question) >= 3,
    Boolean(cleanText(question.suggested_schema_question)),
    Boolean(cleanText(question.suggested_schema_answer)),
    Boolean(cleanText(question.primary_theme)),
    Array.isArray(question.related_themes) && question.related_themes.length > 0,
    hasSourceRefs(question, 1),
    hasSourceRefs(question, 2),
    isV2Answer(question),
  ];

  const earned = checks.filter(Boolean).length;
  return Math.round((earned / checks.length) * 100);
}

export function tierForScore(score) {
  if (score >= 90) return 'complete';
  if (score >= 60) return 'partial';
  if (score >= 30) return 'legacy-thin';
  return 'legacy-blob';
}

export function normalizeSafetyFlags(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanText(item)).filter(Boolean);
}

export function requireArray(value, label, draft) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${draft.slug}: missing required array ${label}.`);
  }
  return value;
}

export function answerTextFromSections(sections) {
  return sections
    .map((section) => {
      const heading = cleanText(section.heading);
      const body = cleanText(section.body);
      return heading ? `## ${heading}\n\n${body}` : body;
    })
    .filter(Boolean)
    .join('\n\n');
}

export function wordCount(value) {
  return cleanText(value).split(/\s+/).filter(Boolean).length;
}

export function sourceRefsForDraft(value, draft) {
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

export function entitiesFromDraft(draft) {
  const names = [draft.primary_theme, draft.category, ...(Array.isArray(draft.related_themes) ? draft.related_themes : [])]
    .map((name) => cleanText(name))
    .filter(Boolean);

  return Array.from(new Set(names)).map((name) => ({ name, type: 'Topic' }));
}

export function citationNotesFromDraft(draft, notePrefix) {
  const notes = [
    notePrefix,
    cleanText(draft.draft_notes) && `Draft notes: ${cleanText(draft.draft_notes)}`,
    normalizeSafetyFlags(draft.safety_flags).length && `Safety flags: ${normalizeSafetyFlags(draft.safety_flags).join(', ')}`,
    Array.isArray(draft.citation_gaps) &&
      draft.citation_gaps.length &&
      `Citation follow-ups: ${draft.citation_gaps.map((gap) => cleanText(gap)).filter(Boolean).join(' ')}`,
  ].filter(Boolean);

  return notes.join('\n');
}

export function rowFromEnrichmentDraft(draft, { promptVersion, citationNote }) {
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
    question,
    answer,
    word_count: wordCount(answer),
    short_answer: cleanText(draft.improved_summary || draft.suggested_schema_answer),
    raw_category: category,
    category,
    slug,
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
    citation_notes: citationNotesFromDraft(draft, citationNote),
    content_prompt_version: promptVersion,
    content_enriched_at: new Date().toISOString(),
    source_refs: sourceRefsForDraft(draft.source_refs, draft),
    primary_entities: entitiesFromDraft(draft).slice(0, 3),
    related_entities: entitiesFromDraft(draft),
  };
}

export function sourceQuestionForPrompt(question, { completeness, missing, crisisSensitive }) {
  return {
    id: question.id,
    slug: question.slug,
    question: question.question,
    category: question.category ?? question.raw_category,
    short_answer: truncate(question.short_answer, 800),
    answer: truncate(question.answer, 2200),
    improved_title: question.improved_title ?? null,
    improved_meta_description: question.improved_meta_description ?? null,
    improved_summary: question.improved_summary ?? null,
    answer_sections: question.answer_sections ?? null,
    key_takeaways: question.key_takeaways ?? null,
    care_note: question.care_note ?? null,
    related_questions: question.related_questions ?? null,
    review_status: question.review_status ?? null,
    reviewed_by: question.reviewed_by ?? null,
    reviewed_at: question.reviewed_at ?? null,
    source_refs: question.source_refs ?? null,
    completeness_score: completeness,
    missing_fields: missing,
    crisis_sensitive: crisisSensitive,
    upgrade_priority: crisisSensitive ? 'high' : completeness < 30 ? 'high' : completeness < 60 ? 'medium' : 'low',
  };
}
