import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';
import pg from 'pg';

const { Client } = pg;
const POOLER_URL_FILE = 'supabase/.temp/pooler-url';
const PROMPT_VERSION = 'deeper-answer-enrichment-v1-gsc-duplicate-canonical';
const REVIEWER = 'codex-seo-review';

const sourceRefsBySlug = {
  'how-do-i-know-if-i-need-professional-help-for-u9v2w5': [
    {
      title: 'Psychotherapies',
      url: 'https://www.nimh.nih.gov/health/topics/psychotherapies',
      publisher: 'National Institute of Mental Health',
      note: 'Supports psychotherapy, professional support, and reasons people seek care.',
    },
    {
      title: 'Find Help & Support',
      url: 'https://www.samhsa.gov/find-help',
      publisher: 'SAMHSA',
      note: 'Supports treatment locator and support pathway language.',
    },
    {
      title: 'Get Help',
      url: 'https://988lifeline.org/get-help/',
      publisher: '988 Suicide & Crisis Lifeline',
      note: 'Supports crisis-care language and 988 availability.',
    },
  ],
  'how-do-i-manage-anxiety-about-ai-taking-over-my-job': [
    {
      title: 'Workplace Stress - Understanding the Problem',
      url: 'https://www.osha.gov/workplace-stress/understanding-the-problem',
      publisher: 'Occupational Safety and Health Administration',
      note: 'Supports workplace stress, job security, and changing-work demands.',
    },
    {
      title: 'About Stress at Work',
      url: 'https://www.cdc.gov/niosh/stress/about/index.html',
      publisher: 'CDC / NIOSH',
      note: 'Supports job stress framing when requirements and resources do not match.',
    },
    {
      title: 'Worries about artificial intelligence, surveillance at work may be connected to poor mental health',
      url: 'https://www.newswise.com/articles/worries-about-artificial-intelligence-surveillance-at-work-may-be-connected-to-poor-mental-health/',
      publisher: 'American Psychological Association via Newswise',
      note: 'Supports AI-obsolescence worry and workplace stress context.',
    },
  ],
  'how-do-i-stop-comparing-my-financial-sit-181083-019': [
    {
      title: 'Stress in America 2023',
      url: 'https://www.apa.org/news/press/releases/stress/2023/collective-trauma-recovery',
      publisher: 'American Psychological Association',
      note: 'Supports money and economic stress as significant mental-health stressors.',
    },
    {
      title: 'Fact Sheet: Health Disparities and Stress',
      url: 'https://www.apa.org/topics/health-disparities/fact-sheet-stress',
      publisher: 'American Psychological Association',
      note: 'Supports chronic stress and health-impact framing.',
    },
  ],
  'i-cannot-stop-checking-if-i-locked-the-door-before-leaving': [
    {
      title: 'Obsessive-Compulsive Disorder: When Unwanted Thoughts or Repetitive Behaviors Take Over',
      url: 'https://www.nimh.nih.gov/health/publications/obsessive-compulsive-disorder-when-unwanted-thoughts-or-repetitive-behaviors-take-over',
      publisher: 'National Institute of Mental Health',
      note: 'Supports checking behavior, compulsions, OCD caution, and ERP treatment context.',
    },
    {
      title: 'Exposure and Response Prevention',
      url: 'https://iocdf.org/about-ocd/treatment/erp/',
      publisher: 'International OCD Foundation',
      note: 'Supports ERP as a specialized therapy approach for compulsive patterns.',
    },
  ],
  'why-do-i-always-spiral-at-2am-181083-043': [
    {
      title: 'Generalized Anxiety Disorder: What You Need to Know',
      url: 'https://www.nimh.nih.gov/health/publications/generalized-anxiety-disorder-gad',
      publisher: 'National Institute of Mental Health',
      note: 'Supports excessive worry, trouble sleeping, and anxiety treatment framing.',
    },
    {
      title: 'Brain Basics: Understanding Sleep',
      url: 'https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-understanding-sleep',
      publisher: 'National Institute of Neurological Disorders and Stroke',
      note: 'Supports sleep importance and cognitive functioning language.',
    },
  ],
  'why-do-i-feel-anxious-about-good-things-happening-184730-023': [
    {
      title: 'Anxiety Disorders',
      url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders/index.shtml',
      publisher: 'National Institute of Mental Health',
      note: 'Supports anxiety symptoms, daily interference, and treatment framing.',
    },
    {
      title: 'Psychotherapies',
      url: 'https://www.nimh.nih.gov/health/topics/psychotherapies',
      publisher: 'National Institute of Mental Health',
      note: 'Supports CBT, exposure, coping, and professional support framing.',
    },
  ],
};

async function readPassword() {
  if (process.env.SUPABASE_DB_PASSWORD) return process.env.SUPABASE_DB_PASSWORD;

  return new Promise((resolve) => {
    let value = '';
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk) => {
      value += chunk;
    });
    stdin.on('end', () => resolve(value.trim()));
  });
}

function connectionStringWithPassword(password) {
  const url = new URL(readFileSync(POOLER_URL_FILE, 'utf8').trim());
  url.password = password;
  return url.toString();
}

const password = await readPassword();

if (!password) {
  throw new Error('Missing Supabase database password on stdin or SUPABASE_DB_PASSWORD.');
}

const client = new Client({
  connectionString: connectionStringWithPassword(password),
  ssl: {
    rejectUnauthorized: false,
  },
});

await client.connect();

try {
  await client.query('begin');

  for (const [slug, sourceRefs] of Object.entries(sourceRefsBySlug)) {
    const result = await client.query(
      `
        update public.answer_enrichment_drafts
        set
          source_refs = $1::jsonb,
          citation_gaps = '[]'::jsonb,
          safety_flags = coalesce(safety_flags, '[]'::jsonb),
          quality_passed = true,
          reviewed_at = now(),
          reviewed_by = $2,
          enrichment_status = 'reviewed'
        where question_slug = $3
          and prompt_version = $4
        returning question_slug
      `,
      [JSON.stringify(sourceRefs), REVIEWER, slug, PROMPT_VERSION]
    );

    if (result.rowCount !== 1) {
      throw new Error(`Expected 1 reviewed draft for ${slug}, got ${result.rowCount}.`);
    }
  }

  const promotion = await client.query(
    `
      update public.questions_master q
      set
        improved_title = d.enriched_title,
        improved_meta_description = d.enriched_meta_description,
        improved_summary = d.enriched_summary,
        answer_sections = d.enriched_answer_body,
        key_takeaways = d.key_takeaways,
        care_note = d.enriched_care_note,
        related_questions = d.related_questions,
        suggested_schema_question = d.schema_question,
        suggested_schema_answer = d.schema_answer,
        primary_theme = d.primary_theme,
        related_themes = d.related_themes,
        citation_notes = d.citation_notes,
        content_prompt_version = d.prompt_version,
        content_enriched_at = now(),
        review_status = 'reviewed',
        reviewed_by = $2,
        source_refs = d.source_refs,
        primary_entities = d.primary_entities,
        related_entities = d.related_entities,
        updated_at = now()
      from public.answer_enrichment_drafts d
      where q.id::text = d.question_id
        and d.prompt_version = $1
        and d.quality_passed is true
        and jsonb_array_length(d.citation_gaps) = 0
      returning q.slug
    `,
    [PROMPT_VERSION, REVIEWER]
  );

  await client.query(
    `
      update public.answer_enrichment_drafts
      set promoted_at = now(),
          enrichment_status = 'promoted'
      where prompt_version = $1
        and quality_passed is true
        and jsonb_array_length(citation_gaps) = 0
    `,
    [PROMPT_VERSION]
  );

  await client.query('commit');

  const verification = await client.query(
    `
      select
        q.slug,
        q.review_status,
        q.improved_title is not null as has_title,
        q.answer_sections is not null as has_sections,
        jsonb_array_length(coalesce(q.source_refs, '[]'::jsonb)) as source_ref_count,
        d.enrichment_status,
        d.quality_passed,
        d.promoted_at is not null as promoted
      from public.questions_master q
      join public.answer_enrichment_drafts d on d.question_id = q.id::text
      where d.prompt_version = $1
      order by q.slug
    `,
    [PROMPT_VERSION]
  );

  console.log(
    JSON.stringify(
      {
        promotedCount: promotion.rowCount,
        rows: verification.rows,
      },
      null,
      2
    )
  );
} catch (error) {
  await client.query('rollback');
  throw error;
} finally {
  await client.end();
}
