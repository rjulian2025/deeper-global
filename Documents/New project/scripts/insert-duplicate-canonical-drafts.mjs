import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';
import pg from 'pg';

const { Client } = pg;
const POOLER_URL_FILE = 'supabase/.temp/pooler-url';
const PROMPT_VERSION = 'deeper-answer-enrichment-v1-gsc-duplicate-canonical';
const MODEL = 'codex-gpt-5-assisted-editorial-draft';

const drafts = [
  {
    slug: 'how-do-i-stop-comparing-my-financial-sit-181083-019',
    title: 'Why Comparing Your Financial Situation Can Feel So Personal',
    meta: 'Financial comparison can make money feel like proof of your worth. Here is why the spiral hits hard and how to loosen it.',
    summary:
      "Comparing your finances to someone else's can feel painful because money is rarely just money. It can get tangled with safety, status, timing, family history, and whether you feel like you are falling behind.",
    takeaways: [
      'Financial comparison often turns incomplete information into a harsh self-judgment.',
      "You may be comparing your private stress to someone else's public outcome.",
      'The useful question is not why you are behind, but what money needs to help you feel safer.',
      'Avoiding your finances can temporarily reduce shame while making the uncertainty worse.',
    ],
    sections: [
      {
        type: 'what_may_be_happening',
        heading: 'What may be happening',
        body: 'Your mind may be using other people’s finances as a scoreboard for your own adequacy. That is especially intense when money represents security, independence, or proof that you are doing life correctly.',
      },
      {
        type: 'why_it_sticks',
        heading: 'Why the comparison loop sticks',
        body: 'Comparison creates a moving target. Even if you catch up to one person, your mind can find another benchmark. The loop is not really asking for numbers; it is asking for reassurance that you are okay.',
      },
      {
        type: 'what_can_help',
        heading: 'What can help',
        body: 'Separate facts from stories. Facts are account balances, debt, income, and expenses. Stories are thoughts like I am failing, I should be further along, or everyone else has figured it out. Work with the facts first.',
      },
      {
        type: 'when_to_get_support',
        heading: 'When to get support',
        body: 'If money anxiety leads to avoidance, panic, relationship conflict, or major life paralysis, a therapist or financial counselor can help you approach the issue without shame.',
      },
    ],
    care:
      'If financial worry is affecting sleep, relationships, work, or your sense of safety, consider support from a licensed therapist, financial counselor, or both.',
    related: [
      'Why do I feel ashamed about money?',
      'How do I stop comparing my life timeline to other people?',
      'Why does checking my bank account make me anxious?',
      'Can money stress affect mental health?',
    ],
    schemaQuestion: 'How do I stop comparing my financial situation to others?',
    schemaAnswer:
      'Financial comparison can feel intense because money often represents safety, worth, timing, and status. It may help to separate financial facts from shame-based stories and seek support if money anxiety affects daily life.',
    primaryTheme: 'Financial anxiety and self-worth',
    relatedThemes: ['comparison', 'money shame', 'self-worth', 'financial stress'],
    entities: ['financial anxiety', 'self-worth', 'comparison', 'shame'],
  },
  {
    slug: 'how-do-i-manage-anxiety-about-ai-taking-over-my-job',
    title: 'Why AI Job Anxiety Feels Different From Ordinary Career Stress',
    meta: 'AI job anxiety is not just fear of change. It can make your skills, future, and identity feel suddenly unstable.',
    summary:
      'Anxiety about AI taking your job can feel so intense because it combines uncertainty, livelihood risk, and identity threat. Your brain is not only asking whether you will have work, but whether what you know will still matter.',
    takeaways: [
      'AI anxiety often blends practical career concern with deeper fears about replaceability.',
      'Constant news-checking can create urgency without giving you a clear plan.',
      'Skill-building helps most when it is specific, not panic-driven.',
      'You do not need total certainty to take useful next steps.',
    ],
    sections: [
      {
        type: 'what_may_be_happening',
        heading: 'What may be happening',
        body: 'AI can make the future feel abstract and immediate at the same time. You may be trying to solve a threat that is real in some ways but still unclear in timing, scope, and impact.',
      },
      {
        type: 'why_it_feels_hard_to_calm_down',
        heading: 'Why it feels hard to calm down',
        body: 'Career anxiety becomes harder to regulate when every article or workplace rumor seems like evidence that the ground is moving. Your nervous system may treat each update as something you must respond to immediately.',
      },
      {
        type: 'what_can_help',
        heading: 'What can help',
        body: 'Convert broad fear into a narrow plan. Identify which parts of your role are repetitive, relational, judgment-based, creative, regulated, or context-heavy. Then choose one practical skill or adaptation to build over the next month.',
      },
      {
        type: 'when_to_get_support',
        heading: 'When to get support',
        body: 'If AI-related worry is causing panic, constant checking, sleep disruption, or despair about the future, professional support can help you separate realistic preparation from anxiety loops.',
      },
    ],
    care:
      'If this worry is interfering with daily functioning or making the future feel unmanageable, consider talking with a licensed mental health professional.',
    related: [
      'How do I deal with career uncertainty?',
      'Why does work anxiety feel so personal?',
      'How can I stop doomscrolling about AI?',
      'What if my job feels tied to my identity?',
    ],
    schemaQuestion: 'How do I manage anxiety about AI taking over my job?',
    schemaAnswer:
      'AI job anxiety can combine practical career uncertainty with fears about identity and replaceability. It may help to narrow the worry into specific skill, role, and planning questions rather than reacting to every news update.',
    primaryTheme: 'AI job anxiety',
    relatedThemes: ['work anxiety', 'job insecurity', 'career identity', 'future uncertainty'],
    entities: ['work anxiety', 'AI anxiety', 'job insecurity', 'career identity'],
  },
  {
    slug: 'how-do-i-know-if-i-need-professional-help-for-u9v2w5',
    title: 'How to Know When a Spiritual Crisis Needs More Support',
    meta: 'A spiritual crisis may need support when it disrupts sleep, safety, relationships, or your ability to function day to day.',
    summary:
      'A spiritual crisis can become a mental health concern when it stops feeling like questioning and starts affecting your safety, sleep, relationships, or ability to function. You do not have to decide whether it is spiritual or psychological before asking for support.',
    takeaways: [
      'Spiritual distress can be meaningful and still deserve professional support.',
      'A key signal is whether the crisis is shrinking your daily life or sense of safety.',
      'Support can include therapy, trusted spiritual counsel, or both.',
      'Urgent help matters if you may hurt yourself or cannot stay safe.',
    ],
    sections: [
      {
        type: 'what_may_be_happening',
        heading: 'What may be happening',
        body: 'Spiritual crisis can bring questions about identity, meaning, belonging, guilt, fear, or reality. For some people, those questions are painful but workable. For others, the distress becomes consuming enough that extra support is needed.',
      },
      {
        type: 'signs_support_may_help',
        heading: 'Signs support may help',
        body: 'Consider professional help if the crisis is disrupting sleep, eating, work, school, relationships, or your ability to feel grounded. Support is also reasonable if you feel trapped, terrified, isolated, or unable to trust your own judgment.',
      },
      {
        type: 'what_can_help',
        heading: 'What can help',
        body: 'You can look for a therapist who respects spiritual questions without forcing a single interpretation. Some people also benefit from talking with a trusted spiritual leader, especially when the person is calm, non-coercive, and supportive of mental health care.',
      },
      {
        type: 'when_to_get_urgent_support',
        heading: 'When to get urgent support',
        body: 'If you might harm yourself or someone else, feel unable to stay safe, or are losing touch with reality in a frightening way, seek urgent support through emergency services, a crisis line, or a trusted local professional.',
      },
    ],
    care:
      'If this crisis is affecting your safety, sleep, functioning, or sense of reality, consider reaching out to a licensed mental health professional. If you may hurt yourself, call or text 988 in the U.S. or contact local emergency services.',
    related: [
      'Can a spiritual crisis affect mental health?',
      'How do I know if I need therapy?',
      'What is spiritual bypassing?',
      'How do I find a therapist who respects my beliefs?',
    ],
    schemaQuestion: 'How do I know if I need professional help for spiritual crisis?',
    schemaAnswer:
      'Professional help may be needed when a spiritual crisis disrupts safety, sleep, functioning, relationships, or your ability to feel grounded. You can seek therapy without having to dismiss the spiritual meaning of what you are experiencing.',
    primaryTheme: 'Spiritual crisis and professional support',
    relatedThemes: ['therapy readiness', 'spiritual distress', 'identity', 'crisis support'],
    entities: ['spiritual crisis', 'professional support', 'mental health symptoms', 'crisis support'],
  },
  {
    slug: 'why-do-i-feel-anxious-about-good-things-happening-184730-023',
    title: 'Why Good Things Can Make You Anxious Instead of Relieved',
    meta: 'Good news can still feel unsafe when your brain expects loss, pressure, or disappointment to follow relief.',
    summary:
      'Feeling anxious when good things happen can occur when your nervous system is used to scanning for what could go wrong. The good event may be real, but so is the fear that it could disappear, create pressure, or make disappointment hurt more later.',
    takeaways: [
      'Anxiety can attach to positive events when uncertainty increases.',
      'Good things may trigger fear of loss, pressure, exposure, or disappointment.',
      'Your reaction does not mean you are ungrateful.',
      'Practicing tolerating good feelings can be part of healing.',
    ],
    sections: [
      {
        type: 'what_may_be_happening',
        heading: 'What may be happening',
        body: 'Positive change can still be change. If your system learned to stay prepared for disappointment, success, closeness, or relief may feel like a moment when you should brace yourself.',
      },
      {
        type: 'why_it_feels_confusing',
        heading: 'Why it feels confusing',
        body: 'People often expect happiness to feel simple. When anxiety shows up instead, you might judge yourself for not enjoying the moment. That judgment can add a second layer of distress.',
      },
      {
        type: 'what_can_help',
        heading: 'What can help',
        body: 'Name the specific fear underneath the good event. Is it fear of losing it, being expected to maintain it, disappointing someone, being seen, or trusting something that might change?',
      },
      {
        type: 'when_to_get_support',
        heading: 'When to get support',
        body: 'If positive experiences reliably trigger panic, numbness, avoidance, or self-sabotage, therapy can help you understand the protective pattern without shaming it.',
      },
    ],
    care:
      'If anxiety around good things keeps you from enjoying relationships, opportunities, or daily life, consider talking with a licensed therapist.',
    related: [
      'Why do I feel scared when things are going well?',
      'Can anxiety cause self-sabotage?',
      'Why do I expect disappointment after good news?',
      'How do I let myself enjoy good things?',
    ],
    schemaQuestion: 'Why do I feel anxious about good things happening?',
    schemaAnswer:
      'Good things can trigger anxiety when your nervous system expects loss, pressure, disappointment, or exposure to follow relief. The reaction does not mean you are ungrateful; it may reflect a learned protective pattern.',
    primaryTheme: 'Anxiety about positive change',
    relatedThemes: ['anticipatory anxiety', 'self-sabotage', 'emotional safety', 'uncertainty'],
    entities: ['anticipatory anxiety', 'self-sabotage', 'nervous system safety', 'emotional regulation'],
  },
  {
    slug: 'why-do-i-always-spiral-at-2am-181083-043',
    title: 'Why Your Thoughts Spiral at 2 AM When Everything Is Quiet',
    meta: 'Night spirals often happen when your brain finally has silence, fewer distractions, and less capacity to regulate worry.',
    summary:
      'Spiraling at 2 AM often happens because fatigue lowers your ability to regulate worry while quiet gives your thoughts more room. The same concern may feel more threatening at night than it does in daylight.',
    takeaways: [
      'Nighttime worry can feel more convincing because your brain is tired.',
      'Quiet removes distractions that helped contain the worry during the day.',
      'Trying to solve your whole life at 2 AM usually keeps the alarm system active.',
      'A repeatable night plan works better than arguing with every thought.',
    ],
    sections: [
      {
        type: 'what_may_be_happening',
        heading: 'What may be happening',
        body: 'Your mind may be using the first quiet moment of the day to process everything it had to postpone. At night, those thoughts arrive when your body has fewer resources to sort them calmly.',
      },
      {
        type: 'why_it_feels_convincing',
        heading: 'Why it feels so convincing',
        body: 'Sleep loss can make ordinary concerns feel urgent and global. A work problem becomes my life is falling apart. A text becomes everything is wrong. The content matters, but the timing amplifies it.',
      },
      {
        type: 'what_can_help',
        heading: 'What can help',
        body: 'Create a night rule: no major life decisions, no conflict analysis, and no problem-solving that requires a spreadsheet after a certain hour. Capture the thought briefly, then return to a sensory cue like breathing, audio, or a low-light routine.',
      },
      {
        type: 'when_to_get_support',
        heading: 'When to get support',
        body: 'If late-night spirals are frequent, severe, or tied to panic, depression, trauma memories, or loss of sleep, professional support can help address the pattern underneath.',
      },
    ],
    care:
      'If nighttime spiraling is disrupting sleep for weeks or affecting your functioning, consider support from a licensed mental health professional or sleep-informed clinician.',
    related: [
      'Why does anxiety get worse at night?',
      'How do I stop racing thoughts before sleep?',
      'Can lack of sleep make anxiety worse?',
      'What should I do when I wake up panicking?',
    ],
    schemaQuestion: 'Why do I always spiral at 2 AM?',
    schemaAnswer:
      'Thoughts often spiral late at night because fatigue reduces emotional regulation while quiet gives worry more room. A simple night plan can work better than trying to solve every fear while exhausted.',
    primaryTheme: 'Nighttime rumination',
    relatedThemes: ['night anxiety', 'rumination', 'sleep disruption', 'worry loops'],
    entities: ['nighttime anxiety', 'rumination', 'sleep disruption', 'worry loops'],
  },
  {
    slug: 'i-cannot-stop-checking-if-i-locked-the-door-before-leaving',
    title: 'Why Checking the Door Again Still Does Not Make You Feel Sure',
    meta: 'If you keep checking but never feel certain, the problem may not be memory. It may be doubt. Here is why that loop happens.',
    summary:
      'Repeatedly checking the door can briefly lower anxiety, but it can also teach your brain that certainty only comes from checking again. Over time, the checking becomes less about the lock and more about trying to quiet doubt.',
    takeaways: [
      'Checking can relieve anxiety for a moment while strengthening the urge long term.',
      'The issue is often intolerance of uncertainty, not poor memory.',
      'A vivid first check can help more than repeated checking.',
      'Professional support can help if checking consumes time or disrupts life.',
    ],
    sections: [
      {
        type: 'what_may_be_happening',
        heading: 'What may be happening',
        body: 'Your brain may be treating a small amount of uncertainty as a safety threat. Even after you check, a doubt appears: what if I did not really notice? That doubt feels urgent enough to send you back.',
      },
      {
        type: 'why_it_feels_hard_to_stop',
        heading: 'Why it feels hard to stop',
        body: 'Each extra check can feel like proof that checking is what kept you safe. The relief is real, but it is temporary, and the next doubt often arrives faster.',
      },
      {
        type: 'what_can_help',
        heading: 'What can help',
        body: 'Make one intentional check. Notice the sound of the lock, the feel of the handle, and the visual cue that it is secure. When doubt returns, practice referring back to that first check instead of starting the loop over.',
      },
      {
        type: 'when_to_get_support',
        heading: 'When to get support',
        body: 'If checking takes significant time, causes lateness, creates distress, or expands into other reassurance behaviors, a therapist familiar with anxiety and compulsive patterns can help.',
      },
    ],
    care:
      'If this pattern is interfering with daily life, consider talking with a licensed mental health professional. You do not need to diagnose yourself to ask for help.',
    related: [
      'Why do I still feel unsure after checking?',
      'Is repeated checking always OCD?',
      'How can I stop reassurance-seeking?',
      'What is exposure and response prevention?',
    ],
    schemaQuestion: 'Why can I not stop checking if I locked the door before leaving?',
    schemaAnswer:
      'Repeated door checking can briefly reduce anxiety while strengthening the checking loop. The problem is often doubt and uncertainty rather than memory, and support can help if checking disrupts daily life.',
    primaryTheme: 'Checking and uncertainty',
    relatedThemes: ['checking behavior', 'compulsive reassurance', 'uncertainty', 'anxiety'],
    entities: ['checking behavior', 'compulsive reassurance', 'uncertainty', 'anxiety'],
  },
];

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

function entities(names) {
  return names.map((name) => ({ name, type: 'Topic' }));
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

const { rows: questions } = await client.query(
  `
    select id::text, slug, question, category, raw_category
    from public.questions_master
    where slug = any($1::text[])
  `,
  [drafts.map((draft) => draft.slug)]
);
const bySlug = new Map(questions.map((question) => [question.slug, question]));

for (const draft of drafts) {
  const question = bySlug.get(draft.slug);

  if (!question) {
    throw new Error(`Missing question for slug: ${draft.slug}`);
  }

  await client.query(
    `
      insert into public.answer_enrichment_drafts (
        question_id,
        question_slug,
        original_title,
        original_category,
        prompt_version,
        model,
        enriched_title,
        enriched_meta_description,
        enriched_summary,
        key_takeaways,
        enriched_answer_body,
        enriched_care_note,
        related_questions,
        schema_question,
        schema_answer,
        primary_theme,
        related_themes,
        source_refs,
        primary_entities,
        related_entities,
        citation_notes,
        safety_flags,
        citation_gaps,
        enrichment_status,
        quality_passed
      )
      values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10::jsonb, $11::jsonb, $12, $13::jsonb, $14, $15, $16, $17::jsonb,
        $18::jsonb, $19::jsonb, $20::jsonb, $21, $22::jsonb, $23::jsonb, 'draft', false
      )
      on conflict (question_id, prompt_version) do update set
        question_slug = excluded.question_slug,
        original_title = excluded.original_title,
        original_category = excluded.original_category,
        model = excluded.model,
        enriched_title = excluded.enriched_title,
        enriched_meta_description = excluded.enriched_meta_description,
        enriched_summary = excluded.enriched_summary,
        key_takeaways = excluded.key_takeaways,
        enriched_answer_body = excluded.enriched_answer_body,
        enriched_care_note = excluded.enriched_care_note,
        related_questions = excluded.related_questions,
        schema_question = excluded.schema_question,
        schema_answer = excluded.schema_answer,
        primary_theme = excluded.primary_theme,
        related_themes = excluded.related_themes,
        source_refs = excluded.source_refs,
        primary_entities = excluded.primary_entities,
        related_entities = excluded.related_entities,
        citation_notes = excluded.citation_notes,
        safety_flags = excluded.safety_flags,
        citation_gaps = excluded.citation_gaps,
        enrichment_status = 'draft',
        quality_passed = false,
        reviewed_at = null,
        reviewed_by = null,
        promoted_at = null
    `,
    [
      question.id,
      draft.slug,
      question.question,
      question.category ?? question.raw_category,
      PROMPT_VERSION,
      MODEL,
      draft.title,
      draft.meta,
      draft.summary,
      JSON.stringify(draft.takeaways),
      JSON.stringify(draft.sections),
      draft.care,
      JSON.stringify(draft.related),
      draft.schemaQuestion,
      draft.schemaAnswer,
      draft.primaryTheme,
      JSON.stringify(draft.relatedThemes),
      JSON.stringify([]),
      JSON.stringify(entities(draft.entities)),
      JSON.stringify(entities(draft.relatedThemes)),
      'Draft generated for GSC duplicate-canonical uniqueness review. Source references must be mapped before promotion.',
      JSON.stringify([]),
      JSON.stringify(['Source references need editorial mapping before promotion.']),
    ]
  );
}

const verification = await client.query(
  `
    select question_slug, enrichment_status, quality_passed, jsonb_array_length(citation_gaps) as citation_gap_count
    from public.answer_enrichment_drafts
    where prompt_version = $1
    order by question_slug
  `,
  [PROMPT_VERSION]
);

console.log(JSON.stringify(verification.rows, null, 2));

await client.end();
