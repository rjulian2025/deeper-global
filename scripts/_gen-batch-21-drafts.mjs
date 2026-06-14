import { readFileSync, writeFileSync } from 'node:fs';

const CARE =
  'This information is general guidance, not a substitute for care from a licensed mental health professional. If distress becomes overwhelming, call or text 988 in the U.S. or seek emergency care.';
const SUPPORT =
  'Consider professional support if symptoms persistently interfere with daily life, relationships, or safety. Seek urgent help if you are having thoughts of self-harm or feel unable to stay safe; in the U.S., call or text 988.';
const NIMH = {
  title: 'Caring for Your Mental Health',
  url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
  publisher: 'NIMH',
  note: 'Supports self-care and when to seek professional help.',
};
const CDC = {
  title: 'About Mental Health',
  url: 'https://www.cdc.gov/mental-health/about/index.html',
  publisher: 'CDC',
  note: 'Supports mental health as a public health concern.',
};
const ANXIETY = {
  title: 'Anxiety Disorders',
  url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
  publisher: 'NIMH',
  note: 'Supports understanding anxiety symptoms and treatment.',
};
const DEPRESSION = {
  title: 'Depression',
  url: 'https://www.nimh.nih.gov/health/topics/depression',
  publisher: 'NIMH',
  note: 'Supports understanding depression symptoms and treatment.',
};
const BURNOUT = {
  title: 'Coping with Stress',
  url: 'https://www.cdc.gov/mental-health/caring-for-yourself/coping-with-stress/index.html',
  publisher: 'CDC',
  note: 'Supports stress management and burnout recovery strategies.',
};

function draft({
  question,
  slug,
  category,
  title,
  meta,
  summary,
  takeaways,
  happening,
  help,
  support,
  related,
  schemaAnswer,
  theme,
  themes,
  refs = [NIMH, CDC],
  gaps = [],
  flags = [],
  notes = '',
}) {
  return {
    question,
    slug,
    category,
    review_status: 'draft',
    indexation_instruction: 'noindex_until_reviewed',
    improved_title: title,
    improved_meta_description: meta,
    improved_summary: summary,
    key_takeaways: takeaways,
    answer_sections: [
      { type: 'section', heading: 'What may be happening', body: happening },
      { type: 'section', heading: 'What can help', body: help },
      { type: 'section', heading: 'When to get support', body: support || SUPPORT },
    ],
    care_note: CARE,
    related_questions: related,
    suggested_schema_faq: question,
    suggested_schema_answer: schemaAnswer,
    primary_theme: theme || category,
    related_themes: themes,
    source_refs: refs,
    citation_gaps: gaps,
    safety_flags: flags,
    draft_notes: notes,
  };
}

const input = JSON.parse(
  readFileSync('reports/enrichment-corpus/batches/batch-18-input.json', 'utf8'),
);

const contentBySlug = {
  'how-do-i-reconnect-with-my-cultural-heritage-after-y8z1a4': draft({
    question:
      'How do I reconnect with my cultural heritage after years of assimilation?',
    slug: 'how-do-i-reconnect-with-my-cultural-heritage-after-y8z1a4',
    category: 'Identity & Self-Worth',
    title: 'Reconnecting With Cultural Heritage',
    meta: 'Heritage reconnection after assimilation is gradual—learn family stories, explore traditions at your pace, and integrate culture into who you are now.',
    summary:
      'Assimilation often happened for practical reasons—safety, opportunity, survival—not because heritage stopped mattering. Reconnecting can feel exciting and awkward at once, especially if you worry you are not "authentic enough." Gentle exploration, elder conversations, and community involvement can rebuild connection without erasing your present identity.',
    takeaways: [
      'Assimilation was often protective; disconnection is not your fault.',
      'Reconnection can be gradual—language, food, stories, or community each count.',
      'Feeling like an outsider to your own heritage is common and not disqualifying.',
      'You can blend heritage with your current life rather than choosing one identity.',
    ],
    happening:
      'You may feel grief for traditions never learned or shame for not speaking a family language.\n\nMajor life transitions, discrimination, or a sense that something is missing can spark the urge to reconnect.',
    help:
      'Ask elders or relatives about immigration stories, celebrations, and practices they remember.\n\nExplore language, cuisine, music, or faith communities at a beginner-friendly pace.\n\nResearch history and culture through books, documentaries, or cultural centers.\n\nJoin heritage groups where learning together reduces pressure to perform identity.\n\nIntegrate small practices—recipes, holidays, phrases—into daily life rather than demanding instant fluency.',
    support:
      `${SUPPORT}\n\nSeek culturally informed therapy if reconnection stirs identity confusion, family conflict, or discrimination-related distress.`,
    related: [
      'How do I build a stronger sense of identity?',
      'How do I cope with feeling like I do not belong?',
      'How do I navigate family expectations about my identity?',
      'How do I deal with discrimination and its impact on mental health?',
      'How do I rebuild confidence after a major life change?',
    ],
    schemaAnswer:
      'Reconnect with cultural heritage through family stories, gradual language or tradition learning, community involvement, and integrating practices into your current identity without rushing.',
    themes: ['Cultural identity', 'Assimilation', 'Belonging', 'Heritage'],
    gaps: ['No dedicated SAMHSA or cultural-identity clinical source cited; verify community resource framing.'],
    notes: 'Avoid prescribing specific religious or political identity paths; keep assimilation framing non-blaming.',
  }),
  'how-do-i-recover-from-burnout-at-work': draft({
    question: 'How do I recover from burnout at work?',
    slug: 'how-do-i-recover-from-burnout-at-work',
    category: 'Work & Life Balance',
    title: 'Recovering From Work Burnout',
    meta: 'Burnout recovery needs rest, boundary resets, workload changes, and professional support—not just pushing through exhaustion.',
    summary:
      'Burnout is more than being tired: it is chronic depletion from sustained emotional and cognitive overload at work. Recovery usually requires acknowledging severity, restoring sleep and nervous-system calm, resetting boundaries, and sometimes changing roles or environments that keep draining you.',
    takeaways: [
      'Burnout is a legitimate health condition—not a personal weakness.',
      'Rest alone rarely fixes burnout if workload and boundaries stay the same.',
      'Sleep, stress reduction, and protected off-hours are foundational recovery steps.',
      'Sustained burnout may require job changes, leave, or clinical treatment.',
    ],
    happening:
      'You may feel numb, cynical, or unable to care about work you once valued.\n\nPushing through symptoms often deepens exhaustion and prolongs recovery.',
    help:
      'Name burnout honestly and prioritize recovery as a health need, not a luxury.\n\nProtect sleep with consistent routines and address persistent insomnia with a clinician.\n\nPractice brief daily stress reduction: breathing, walks, mindfulness, or muscle relaxation.\n\nSet hard limits on after-hours email, overtime, and unpaid emotional labor.\n\nDelegate, renegotiate deadlines, or reduce scope where possible.\n\nRebuild energy through movement, social support, and activities unrelated to performance.',
    support:
      `${SUPPORT}\n\nSeek therapy or medical evaluation if burnout includes depression, panic, or inability to function; explore workplace leave or job change when the environment stays harmful.`,
    related: [
      'How do I manage stress at work?',
      'How do I set boundaries between work and personal life?',
      'How do I know if I am experiencing burnout?',
      'How do I separate my self-worth from my job title or career success?',
      'How do I recover from burnout?',
    ],
    schemaAnswer:
      'Recover from work burnout by acknowledging severity, restoring sleep, practicing stress reduction, setting firm work boundaries, adjusting workload, and seeking professional help or job changes when needed.',
    themes: ['Burnout', 'Work recovery', 'Boundaries', 'Stress'],
    refs: [BURNOUT, NIMH],
    notes: 'Confirm no employer-specific legal advice; verify leave framing stays general.',
  }),
  'how-do-i-reinvent-myself-after-a-major-life-change-187459-020': draft({
    question:
      'How do I reinvent myself after a major life change like divorce or job loss?',
    slug: 'how-do-i-reinvent-myself-after-a-major-life-change-187459-020',
    category: 'Life Transitions',
    title: 'Reinventing After Major Life Change',
    meta: 'Identity after divorce or job loss rebuilds through small experiments, reconnecting with forgotten values, and patience—not instant reinvention.',
    summary:
      'Major losses can shatter the story you told about yourself. Reinvention is less about becoming someone entirely new and more about rediscovering parts of you that were sidelined, testing small directions, and tolerating uncertainty while a coherent next chapter forms.',
    takeaways: [
      'Identity shifts are normal after divorce, job loss, or other ruptures.',
      'Small experiments beat dramatic reinvention plans that collapse under pressure.',
      'Grief and excitement can coexist during life transitions.',
      'A next chapter often emerges gradually—not on a fixed timeline.',
    ],
    happening:
      'You may feel unmoored without the roles that organized your days.\n\nPressure to "bounce back" quickly can hide legitimate mourning for the life you expected.',
    help:
      'Allow grief for what ended before forcing a polished new narrative.\n\nList values, skills, and interests that predate the lost role.\n\nRun low-stakes experiments: classes, volunteering, networking coffees, creative projects.\n\nUpdate routines—sleep, movement, social contact—to stabilize your baseline.\n\nSeparate who you are from the title, marriage, or job you lost.\n\nBuild support through friends, groups, or coaching while major decisions settle.',
    support:
      `${SUPPORT}\n\nSeek therapy if transitions trigger depression, hopelessness, or prolonged inability to function.`,
    related: [
      'How do I rebuild my confidence after a major failure?',
      'How do I cope with grief after a major loss?',
      'How do I start dating again after divorce?',
      'How do I separate my self-worth from my job title or career success?',
      'How do I find purpose when life feels meaningless?',
    ],
    schemaAnswer:
      'Reinvent yourself after major life change by grieving losses, exploring values, running small experiments, updating routines, and building support while identity reforms gradually.',
    themes: ['Life transitions', 'Identity', 'Grief', 'Reinvention'],
    notes: 'Avoid implying divorce or job loss always leads to positive outcomes on a set timeline.',
  }),
  'how-do-i-separate-my-self-worth-from-my--184729-013': draft({
    question: 'How do I separate my self-worth from my job title or career success?',
    slug: 'how-do-i-separate-my-self-worth-from-my--184729-013',
    category: 'Work, Stress & Burnout',
    title: 'Self-Worth Beyond Your Job Title',
    meta: 'When career defines your worth, setbacks feel catastrophic—cultivate identity through relationships, values, and life outside performance metrics.',
    summary:
      'Many people tie self-esteem to promotions, productivity, or professional reputation. When work dominates identity, layoffs, criticism, or plateaus can feel like personal failure. Separating worth from title means nurturing roles and values that exist whether or not your résumé impresses anyone.',
    takeaways: [
      'Career success can be meaningful without equaling your whole identity.',
      'Self-worth tied to performance makes every setback feel existential.',
      'Relationships, values, and non-work interests anchor identity.',
      'Therapy helps when achievement addiction drives burnout or depression.',
    ],
    happening:
      'You may panic over a bad review or feel worthless between jobs.\n\nPraise and titles may feel like oxygen—withdrawal from achievement can trigger shame or emptiness.',
    help:
      'Name parts of you that exist outside work: friend, parent, artist, neighbor, learner.\n\nSchedule non-negotiable off-hours for people and activities with no performance score.\n\nPractice self-talk that separates effort from inherent worth.\n\nLimit comparison on professional social feeds that distort success norms.\n\nReflect on values—integrity, care, curiosity—that outlast any employer.\n\nCelebrate competence without requiring constant upward motion.',
    support:
      `${SUPPORT}\n\nSeek therapy if career-linked self-worth drives depression, burnout, or suicidal thoughts after setbacks.`,
    related: [
      'How do I overcome imposter syndrome?',
      'How do I recover from burnout at work?',
      'How do I rebuild my confidence after a major failure?',
      'How do I manage stress at work?',
      'How do I stop being so hard on myself?',
    ],
    schemaAnswer:
      'Separate self-worth from career by cultivating identity outside work, limiting achievement-based self-talk, investing in relationships and values, and seeking support when job setbacks feel catastrophic.',
    themes: ['Self-worth', 'Career identity', 'Burnout', 'Perfectionism'],
    notes: 'Category preserved from input (Work, Stress & Burnout).',
  }),
  'how-do-i-set-boundaries-between-work-and-186032-037': draft({
    question: 'How do I set boundaries between work and personal life?',
    slug: 'how-do-i-set-boundaries-between-work-and-186032-037',
    category: 'Work, Stress & Burnout',
    title: 'Work-Life Boundaries That Hold',
    meta: 'Separate work from personal life with clear hours, physical cues, communicated availability, and recovery time that actually sticks.',
    summary:
      'Blurred work-life lines—especially with remote work and always-on messaging—erode rest and relationships. Effective boundaries combine time limits, physical separation, explicit communication about availability, and habits that signal when work mode ends.',
    takeaways: [
      'Boundaries need clear start/stop times—not vague intentions.',
      'Physical cues help brains switch between work and personal modes.',
      'Communicating availability reduces guilt and sets colleague expectations.',
      'Recovery time is protective, not selfish.',
    ],
    happening:
      'You may answer emails at dinner or feel "on call" even during days off.\n\nFear of seeming uncommitted can make every boundary feel career-threatening.',
    help:
      'Set consistent work start and end times; use calendar blocks for focus and shutdown.\n\nCreate a commute ritual—even a short walk—between work and home modes.\n\nTurn off non-urgent notifications after hours; define what counts as urgent.\n\nTell managers and teammates when you are reachable and when you are not.\n\nKeep a dedicated workspace when possible; close the laptop at day\'s end.\n\nProtect sleep, meals, and relationships as non-negotiable personal time.',
    support:
      `${SUPPORT}\n\nSeek therapy or career coaching if boundary-setting triggers severe anxiety, burnout, or workplace conflict you cannot navigate alone.`,
    related: [
      'How do I set boundaries with work technology without hurting my career?',
      'How do I recover from burnout at work?',
      'How do I manage stress at work?',
      'How do I set boundaries without feeling guilty?',
      'How do I manage screen time when my job requires constant connectivity?',
    ],
    schemaAnswer:
      'Set work-life boundaries with defined hours, physical separation, notification limits, clear availability communication, and protected recovery time.',
    themes: ['Work-life balance', 'Boundaries', 'Remote work', 'Burnout prevention'],
    notes: 'Category preserved from input (Work, Stress & Burnout).',
  }),
  'how-do-i-set-boundaries-to-reduce-stress': draft({
    question: 'How do I set boundaries to reduce stress?',
    slug: 'how-do-i-set-boundaries-to-reduce-stress',
    category: 'General Mental Health',
    title: 'Boundaries for Stress Relief',
    meta: 'Healthy boundaries limit overcommitment, protect energy, and reduce resentment—clear limits are a stress-management tool, not selfishness.',
    summary:
      'Stress often grows when you say yes by default—to extra tasks, emotional labor, or intrusions on rest. Boundaries clarify what you will and will not do, reducing overload and the quiet resentment that fuels chronic tension.',
    takeaways: [
      'Boundaries reduce stress by limiting overcommitment and emotional drain.',
      'Clear limits protect energy for priorities that actually matter.',
      'Guilt about saying no is common—and does not mean the boundary is wrong.',
      'Consistency matters more than perfect wording.',
    ],
    happening:
      'You may feel stretched thin, irritable, or resentful while still agreeing to more.\n\nFear of disappointing others can make every no feel dangerous.',
    help:
      'Audit where time and emotional energy leak—work, family, social media, volunteering.\n\nPractice short, kind nos without over-explaining.\n\nSet limits on availability: response windows, visit length, topic boundaries.\n\nUse "let me check my calendar" to avoid automatic yeses.\n\nCommunicate limits early before resentment builds.\n\nPair boundaries with stress basics: sleep, movement, and brief daily decompression.',
    support:
      `${SUPPORT}\n\nSeek therapy if inability to set boundaries drives chronic anxiety, burnout, or relationship patterns that feel unsafe.`,
    related: [
      'How do I set boundaries without feeling guilty?',
      'How do I stop being a people pleaser?',
      'How do I manage stress when I cannot change my situation?',
      'How do I set boundaries with family members?',
      'How do I recover from burnout at work?',
    ],
    schemaAnswer:
      'Reduce stress with boundaries by auditing overcommitment, practicing clear nos, limiting availability, communicating limits early, and protecting basic recovery habits.',
    themes: ['Boundaries', 'Stress management', 'People-pleasing', 'Self-care'],
  }),
  'how-do-i-set-boundaries-with-family-members': draft({
    question: 'How do I set boundaries with family members?',
    slug: 'how-do-i-set-boundaries-with-family-members',
    category: 'Family & Parenting',
    title: 'Boundaries With Family Members',
    meta: 'Family boundaries are hard because of history and loyalty—clear limits, calm repetition, and accepting discomfort protect relationships long-term.',
    summary:
      'Family ties carry decades of expectations, guilt, and unspoken rules. Setting boundaries does not mean cutting people off—it means defining what you will participate in, how you want to be treated, and what topics or behaviors are off limits.',
    takeaways: [
      'Family boundaries challenge loyalty myths and old role patterns.',
      'Limits protect relationships from resentment—not just you.',
      'You may need to repeat boundaries; one conversation rarely rewires history.',
      'Some family members will push back; consistency matters more than approval.',
    ],
    happening:
      'You may feel selfish for limiting visits, money requests, or unsolicited advice.\n\nHoliday dynamics and "we have always done it this way" pressure can override your needs.',
    help:
      'Identify specific behaviors to limit—not vague wishes for "more respect."\n\nUse calm, brief statements: "I am not available for that" or "I will not discuss this topic."\n\nPrepare for pushback without debating your right to limits.\n\nOffer alternatives when you can: shorter visits, different topics, structured calls.\n\nEnlist a partner or sibling ally when group settings are harder.\n\nAccept that some relatives may not change; boundaries still protect you.',
    support:
      `${SUPPORT}\n\nSeek family therapy or individual counseling if boundaries trigger abuse, threats, or severe emotional distress.`,
    related: [
      'How do I set healthy boundaries with family members?',
      'How do I set boundaries without feeling guilty?',
      'How do I set boundaries with my own family about my relationship?',
      'How do I handle toxic family dynamics?',
      'How do I stop being a people pleaser?',
    ],
    schemaAnswer:
      'Set family boundaries with specific limits, calm repetition, alternatives when possible, and consistency despite pushback—protecting both you and the relationship.',
    themes: ['Family boundaries', 'Guilt', 'Communication', 'Relationships'],
    flags: ['family_conflict'],
    notes: 'Verify abuse/safety language stays general; no legal advice on estrangement.',
  }),
  'how-do-i-set-boundaries-with-family-members-who-k8l3m7': draft({
    question:
      "How do I set boundaries with family members who don't respect my therapy journey?",
    slug: 'how-do-i-set-boundaries-with-family-members-who-k8l3m7',
    category: 'Communication & Conflict',
    title: 'Boundaries When Family Dismisses Therapy',
    meta: 'When family mocks or undermines therapy, limit what you share, hold firm on treatment choices, and accept you cannot convince everyone.',
    summary:
      'Not every relative will understand why you are in therapy or respect the changes you are making. Boundaries may mean less disclosure, refusing debates about your healing, and limiting contact with people who sabotage your progress.',
    takeaways: [
      'You do not owe family full access to your therapy process.',
      'Dismissive relatives may feel threatened by your changes—not just skeptical.',
      'Limiting information is a valid boundary, not secrecy or shame.',
      'Your healing can continue even if some family members never approve.',
    ],
    happening:
      'Relatives may joke about therapy, demand details, or criticize your therapist or insights.\n\nOld family roles can resurface when you start asserting needs they are unused to.',
    help:
      'Decide what is private: session content, diagnoses, relationship work, trauma history.\n\nUse scripts: "I am not discussing my therapy" or "I am handling this with my clinician."\n\nRedirect invasive questions; end conversations that become argumentative.\n\nAvoid trying to educate skeptics if debate drains you.\n\nLean on friends, partners, or support groups who respect your process.\n\nKeep attending therapy even when family pressure spikes—consistency reinforces change.',
    support:
      `${SUPPORT}\n\nSeek therapist guidance if family interference threatens safety, housing, or treatment adherence.`,
    related: [
      'How do I set boundaries with family members?',
      'How do I set boundaries without feeling guilty?',
      'How do I deal with family who do not believe in mental health treatment?',
      'How do I stop being a people pleaser?',
      'How do I prepare for my first therapy session?',
    ],
    schemaAnswer:
      'Protect your therapy journey with limited disclosure, firm refusal to debate treatment, conversation exits when dismissed, and support from people who respect your healing.',
    themes: ['Therapy stigma', 'Family boundaries', 'Privacy', 'Healing'],
    notes: 'Confirm no pressure to cut off family universally; focus on boundary options.',
  }),
  'how-do-i-set-boundaries-with-my-own-family-about-my-relationship': draft({
    question:
      'How do I set boundaries with my own family about my relationship?',
    slug: 'how-do-i-set-boundaries-with-my-own-family-about-my-relationship',
    category: 'Relationships & Communication',
    title: 'Family Boundaries About Your Relationship',
    meta: 'Shield your partnership from family interference with united front-setting, limited topic sharing, and clear limits on criticism or involvement.',
    summary:
      'When family opinions spill into your relationship—unwanted advice, criticism of your partner, or involvement in conflicts—couple boundaries with family boundaries protect intimacy. You and your partner decide what family gets access to.',
    takeaways: [
      'You and your partner define how much family participates in your relationship.',
      'Criticism of your partner often lands as criticism of your choices.',
      'A united front reduces split loyalties and hidden alliances.',
      'Some information stays between partners—not every conflict needs a family audience.',
    ],
    happening:
      'Parents or siblings may criticize your partner, compare exes, or insert themselves in disagreements.\n\nGuilt about disappointing family can weaken couple privacy.',
    help:
      'Align with your partner on what is shared and what stays private.\n\nTell family directly: "We are not discussing our relationship conflicts with you."\n\nLimit venting to relatives who escalate rather than support.\n\nSchedule family time that does not center relationship interrogation.\n\nAddress disrespect toward your partner immediately—do not laugh it off.\n\nUse couples therapy if family interference becomes a recurring stressor.',
    support:
      `${SUPPORT}\n\nSeek couples or family therapy if boundary-setting triggers abuse, coercion, or unsafe family dynamics.`,
    related: [
      'How do I set boundaries with family members?',
      'How do I deal with in-laws who interfere in my marriage?',
      'How do I set boundaries without feeling guilty?',
      'How do I stop being afraid of conflict in relationships?',
      'How do I rebuild trust after betrayal in a relationship?',
    ],
    schemaAnswer:
      'Set family boundaries about your relationship by aligning with your partner, limiting shared conflict details, refusing partner criticism, and enforcing united limits on interference.',
    themes: ['Couple boundaries', 'Family interference', 'Communication', 'Privacy'],
    flags: ['family_conflict'],
  }),
  'how-do-i-set-boundaries-with-technology-without-q4r8s1': draft({
    question:
      "How do I set boundaries with technology without feeling like I'm missing out?",
    slug: 'how-do-i-set-boundaries-with-technology-without-q4r8s1',
    category: 'Anxiety & Stress',
    title: 'Tech Boundaries Without FOMO',
    meta: 'Digital limits reduce anxiety when you focus on what disconnection gives you—sleep, presence, calm—not just what you might miss online.',
    summary:
      'Fear of missing out makes phone limits feel like social exile. Reframing boundaries around gains—better sleep, deeper conversations, less comparison—helps tolerating offline time. Intentional use beats all-or-nothing deprivation.',
    takeaways: [
      'FOMO is a feeling, not proof that you must stay constantly connected.',
      'Boundaries work better when tied to values—not punishment.',
      'Curated check-in windows beat endless scrolling for most people.',
      'Missing some online updates is normal and rarely catastrophic.',
    ],
    happening:
      'You may refresh feeds compulsively or feel anxious when notifications are off.\n\nSocial media highlights others\' lives, amplifying the sense that you are falling behind.',
    help:
      'Name what you gain offline: rest, hobbies, in-person connection, focus.\n\nSchedule specific check-in times instead of constant access.\n\nRemove apps from home screens or use focus modes during meals and sleep.\n\nMute non-essential groups; curate feeds toward supportive content.\n\nPlan enjoyable offline activities so disconnection feels rewarding, not empty.\n\nPractice tolerating brief FOMO waves—they usually peak and pass.',
    support:
      `${SUPPORT}\n\nSeek help if technology use feels compulsive, fuels severe anxiety, or interferes with sleep and daily functioning.`,
    related: [
      'How do I manage the fear of missing out on social events?',
      'How do I manage screen time without feeling disconnected?',
      'How do I reduce anxiety from social media?',
      'How do I start practicing mindfulness?',
      'How do I set boundaries with work technology without hurting my career?',
    ],
    schemaAnswer:
      'Set technology boundaries without FOMO by scheduling check-ins, using focus tools, curating feeds, planning offline rewards, and reframing disconnection as gain rather than loss.',
    themes: ['Digital wellness', 'FOMO', 'Anxiety', 'Screen boundaries'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-set-boundaries-with-work-technology-o7p1q4': draft({
    question:
      'How do I set boundaries with work technology without hurting my career?',
    slug: 'how-do-i-set-boundaries-with-work-technology-o7p1q4',
    category: 'Work & Burnout',
    title: 'Work Tech Boundaries That Protect Your Career',
    meta: 'Professional tech limits work when you communicate clearly, deliver focused results, and model sustainable norms—not heroic always-on availability.',
    summary:
      'Always-on email and chat culture can make boundaries feel career-suicidal. Strategic limits—defined response windows, protected focus time, and proactive communication—often improve output while signaling professionalism rather than disengagement.',
    takeaways: [
      'Boundaries can coexist with strong performance when communicated well.',
      'Focused work often beats constant reactive availability.',
      'Managers respect clarity about when you are reachable.',
      'Burnout from tech overload eventually hurts career sustainability.',
    ],
    happening:
      'You may reply instantly to avoid seeming lazy or replaceable.\n\nRemote work blurs home and office, making every ping feel mandatory.',
    help:
      'Set expected response times and share them with your team.\n\nBlock focus hours on your calendar; use status messages during deep work.\n\nBatch email and chat checks instead of continuous monitoring.\n\nDocument deliverables so visibility comes from results, not midnight replies.\n\nDiscuss sustainable norms with managers—many prefer predictability over chaos.\n\nProtect sleep by charging devices outside the bedroom when possible.',
    support:
      `${SUPPORT}\n\nSeek coaching or therapy if fear of career retaliation makes every tech boundary feel impossible.`,
    related: [
      'How do I set boundaries between work and personal life?',
      'How do I manage screen time when my job requires constant connectivity?',
      'How do I recover from burnout at work?',
      'How do I manage stress at work?',
      'How do I overcome imposter syndrome?',
    ],
    schemaAnswer:
      'Set work technology boundaries by defining response windows, blocking focus time, batching messages, communicating availability, and prioritizing deliverables over always-on presence.',
    themes: ['Work technology', 'Career boundaries', 'Burnout', 'Productivity'],
    notes: 'Confirm no employer-specific legal advice.',
  }),
  'how-do-i-set-boundaries-without-feeling-181288-013': draft({
    question: 'How do I set boundaries without feeling guilty?',
    slug: 'how-do-i-set-boundaries-without-feeling-181288-013',
    category: 'Communication & Conflict',
    title: 'Setting Boundaries Without Guilt',
    meta: 'Boundary guilt is common but often misplaced—limits protect relationships from resentment and you from burnout.',
    summary:
      'Many people were taught that good people accommodate everyone. Guilt after saying no usually signals old conditioning—not evidence that you did something wrong. Reframing boundaries as care for both parties helps tolerate short-term discomfort.',
    takeaways: [
      'Guilt after boundaries often reflects upbringing, not moral failure.',
      'Resentment grows when limits are absent—boundaries prevent bigger ruptures.',
      'You can be kind and still say no.',
      'Guilt fades with practice; avoidance of boundaries does not.',
    ],
    happening:
      'You may replay conversations, apologizing internally for protecting your time or feelings.\n\nPeople-pleasing habits equate self-sacrifice with being lovable.',
    help:
      'Name the guilt without obeying it—feelings are not commands.\n\nRemind yourself: boundaries protect long-term connection, not selfishness.\n\nUse brief, warm nos without over-justifying.\n\nTolerate others\' disappointment without rushing to fix their feelings.\n\nPractice small boundaries first to build tolerance for discomfort.\n\nNotice when guilt is louder with specific people—that is data about conditioning.',
    support:
      `${SUPPORT}\n\nSeek therapy if guilt, people-pleasing, or fear of conflict prevents basic self-protection or fuels burnout.`,
    related: [
      'How do I stop being a people pleaser?',
      'How do I set boundaries to reduce stress?',
      'How do I stop being afraid of conflict in relationships?',
      'How do I set boundaries with family members?',
      'How do I stop being so hard on myself?',
    ],
    schemaAnswer:
      'Reduce boundary guilt by reframing limits as relationship protection, using brief nos, tolerating disappointment, practicing small limits, and separating guilt feelings from moral truth.',
    themes: ['Boundary guilt', 'People-pleasing', 'Self-worth', 'Communication'],
  }),
  'how-do-i-set-healthy-boundaries-with-family-members': draft({
    question: 'How do I set healthy boundaries with family members?',
    slug: 'how-do-i-set-healthy-boundaries-with-family-members',
    category: 'Family & Parenting',
    title: 'Healthy Family Boundaries',
    meta: 'Healthy family boundaries balance connection and limits—clear expectations, respectful communication, and consistency over perfection.',
    summary:
      'Healthy boundaries are not walls—they are agreements about respect, time, money, parenting input, and emotional labor. They allow closeness without enmeshment and reduce the cycles of overgiving and resentment common in long-term family ties.',
    takeaways: [
      'Healthy boundaries allow connection with limits—not isolation.',
      'Respect goes both ways; your limits deserve the same weight as theirs.',
      'Consistency teaches family what to expect over time.',
      'Boundaries can evolve as relationships and life stages change.',
    ],
    happening:
      'You may confuse love with unlimited access—feeling rude when you decline requests.\n\nGenerational patterns around money, childcare, or holidays can feel non-negotiable until you test limits.',
    help:
      'Clarify your non-negotiables: sleep, finances, parenting decisions, visit frequency.\n\nCommunicate expectations before conflicts peak—holiday plans, loan requests, drop-ins.\n\nUse "I" statements focused on your capacity, not character attacks.\n\nOffer compromises when appropriate without abandoning core limits.\n\nModel respect by honoring others\' boundaries too.\n\nRevisit agreements as children age or family circumstances shift.',
    support:
      `${SUPPORT}\n\nSeek family therapy if boundary work surfaces abuse, coercion, or unsafe dynamics.`,
    related: [
      'How do I set boundaries with family members?',
      'How do I set healthy boundaries with my children?',
      'How do I set boundaries without feeling guilty?',
      'How do I set boundaries with my own family about my relationship?',
      'How do I handle difficult family holidays?',
    ],
    schemaAnswer:
      'Set healthy family boundaries with clear expectations, proactive communication, mutual respect, consistent limits, and revisions as life circumstances change.',
    themes: ['Family health', 'Boundaries', 'Enmeshment', 'Communication'],
    notes: 'Distinct from general family-boundaries slug; emphasize healthy vs unhealthy dynamic framing.',
  }),
  'how-do-i-set-healthy-boundaries-with-my-children': draft({
    question: 'How do I set healthy boundaries with my children?',
    slug: 'how-do-i-set-healthy-boundaries-with-my-children',
    category: 'Family & Parenting',
    title: 'Healthy Boundaries With Children',
    meta: 'Parent-child boundaries teach safety, respect, and emotional regulation—clear limits with warmth help kids thrive without harsh control.',
    summary:
      'Children need predictable limits on behavior, screen time, privacy as they age, and emotional expression. Healthy boundaries protect their development and your capacity—balancing authority with empathy rather than permissiveness or harsh punishment.',
    takeaways: [
      'Boundaries teach safety and respect—not just obedience.',
      'Warmth plus consistency works better than fear-based control.',
      'Your limits model how children will later set their own.',
      'Parental burnout often signals missing boundaries on your time and energy.',
    ],
    happening:
      'You may swing between over-accommodating and explosive reactions when limits are tested.\n\nGuilt about disappointing children can make every rule feel cruel.',
    help:
      'Set age-appropriate rules on sleep, screens, chores, and respectful language.\n\nExplain the why briefly—safety, health, family functioning—without long lectures.\n\nFollow through calmly; empty threats erode trust in limits.\n\nAllow feelings while holding the line: "You can be mad; the answer is still no."\n\nProtect your own downtime so parenting limits do not come from depletion.\n\nAdjust boundaries as children mature—more privacy, more negotiated rules.',
    support:
      `${SUPPORT}\n\nSeek parenting support or family therapy if boundary struggles include violence, severe defiance, or parental overwhelm affecting safety.`,
    related: [
      'How do I set healthy boundaries with family members?',
      'How do I discipline my child without damaging our relationship?',
      'How do I manage parental burnout?',
      'How do I talk to my teenager about mental health?',
      'How do I protect my children from my own mental health struggles?',
    ],
    schemaAnswer:
      'Set healthy boundaries with children through age-appropriate rules, calm consistency, brief explanations, allowing feelings while holding limits, and protecting parental capacity.',
    themes: ['Parenting', 'Child boundaries', 'Discipline', 'Emotional regulation'],
    notes: 'Avoid corporal punishment recommendations; keep discipline framing non-violent.',
  }),
  'how-do-i-start-dating-again-after-divorce': draft({
    question: 'How do I start dating again after divorce?',
    slug: 'how-do-i-start-dating-again-after-divorce',
    category: 'Relationships & Communication',
    title: 'Dating Again After Divorce',
    meta: 'Post-divorce dating works best when you have grieved, know your values, move slowly, and prioritize safety and emotional readiness over rebound pressure.',
    summary:
      'Dating after divorce can stir excitement, fear, and guilt—sometimes all at once. There is no universal timeline. Readiness usually means processing the marriage ending, understanding patterns you want to change, and re-entering at a pace that protects you and any children involved.',
    takeaways: [
      'There is no fixed timeline for dating after divorce.',
      'Grief and curiosity can coexist—rushing often fuels rebound pain.',
      'Clarify values and red flags before swiping or accepting setups.',
      'Children and co-parenting add layers—discretion and stability matter.',
    ],
    happening:
      'You may feel rusty, compare every date to your ex, or fear repeating old mistakes.\n\nLoneliness or friends\' encouragement can push you before you feel ready.',
    help:
      'Check emotional readiness: can you talk about the divorce without spiraling?\n\nName what you want now—companionship, partnership, casual dating—and what is off limits.\n\nStart low-pressure: coffee dates, group settings, apps with clear intentions.\n\nGo slowly with physical intimacy and introductions to children.\n\nWatch for red flags: pressure, contempt toward exes, inconsistency, boundary violations.\n\nMaintain friendships and hobbies so dating is not your only emotional outlet.',
    support:
      `${SUPPORT}\n\nSeek therapy if dating triggers severe anxiety, trauma responses, or if past relationship abuse affects trust and safety.`,
    related: [
      'How do I reinvent myself after a major life change?',
      'How do I rebuild trust after betrayal in a relationship?',
      'How do I know if I am ready for a new relationship?',
      'How do I co-parent peacefully after divorce?',
      'How do I stop being afraid of conflict in relationships?',
    ],
    schemaAnswer:
      'Start dating after divorce by grieving the marriage, clarifying values, moving slowly, watching red flags, protecting children\'s stability, and dating at your own pace.',
    themes: ['Divorce recovery', 'Dating', 'Readiness', 'Relationships'],
    notes: 'No legal advice on custody or dating clauses in agreements.',
  }),
  'how-do-i-start-practicing-mindfulness': draft({
    question: 'How do I start practicing mindfulness?',
    slug: 'how-do-i-start-practicing-mindfulness',
    category: 'General Mental Health',
    title: 'Starting a Mindfulness Practice',
    meta: 'Mindfulness starts small—brief daily attention to breath or sensation beats ambitious meditation goals you cannot sustain.',
    summary:
      'Mindfulness is paying attention to the present moment with curiosity rather than judgment. You do not need special gear or hour-long retreats. Short, consistent practice—noticing breath, body, or everyday activities—builds the skill over time.',
    takeaways: [
      'Mindfulness is a skill built through repetition, not a one-time insight.',
      'Brief daily practice beats occasional long sessions for most beginners.',
      'Wandering attention is normal—the practice is gently returning.',
      'Mindfulness complements therapy; it does not replace treatment for clinical conditions.',
    ],
    happening:
      'You may expect instant calm and feel like a failure when thoughts race.\n\nBusy schedules make "sit and breathe" sound unrealistic or self-indulgent.',
    help:
      'Start with two to five minutes: notice breath, sounds, or feet on the floor.\n\nUse guided apps or audio if solo silence feels daunting.\n\nPractice informal mindfulness during routine tasks—washing dishes, walking, brushing teeth.\n\nWhen mind wanders, label it gently and return without self-criticism.\n\nPick a consistent time—morning, lunch, before bed—to anchor the habit.\n\nIncrease duration slowly only if shorter practice feels sustainable.',
    support:
      `${SUPPORT}\n\nSeek clinical care if meditation intensifies trauma flashbacks, panic, or dissociation—trauma-informed approaches may be needed.`,
    related: [
      'How do I manage anxiety without medication?',
      'How do I reduce stress when I cannot change my situation?',
      'How do I practice self-compassion?',
      'How do I stop being so hard on myself?',
      'How do I manage the anxiety of being constantly busy?',
    ],
    schemaAnswer:
      'Start mindfulness with brief daily practice, guided support if helpful, informal attention during routines, gentle return when distracted, and slow habit building.',
    themes: ['Mindfulness', 'Meditation', 'Stress reduction', 'Present moment'],
    gaps: ['No dedicated MBSR or clinical mindfulness program source cited.'],
  }),
  'how-do-i-stop-being-a-people-pleaser': draft({
    question: 'How do I stop being a people pleaser?',
    slug: 'how-do-i-stop-being-a-people-pleaser',
    category: 'General Mental Health',
    title: 'Stopping People-Pleasing Patterns',
    meta: 'People-pleasing often protected you once—breaking it means tolerating disappointment, naming your needs, and risking authentic connection.',
    summary:
      'People-pleasing is saying yes, smoothing conflict, and hiding needs to keep others comfortable. It often developed as a survival strategy. Change involves small nos, clearer priorities, and tolerating the discomfort of not being everyone\'s favorite.',
    takeaways: [
      'People-pleasing usually started as protection—not a character flaw.',
      'Authentic relationships require some disappointment tolerance.',
      'Small nos build muscle for bigger boundaries later.',
      'Anger and resentment signal neglected needs—not proof you are unkind.',
    ],
    happening:
      'You may agree to plans you dread or apologize when you did nothing wrong.\n\nFear of rejection can make your mood depend on others\' approval.',
    help:
      'Pause before automatic yeses—"let me check and get back to you."\n\nIdentify top priorities; say no to what conflicts with them.\n\nPractice disappointing people in low-stakes situations first.\n\nNotice body signals of resentment or exhaustion as boundary data.\n\nExpress preferences directly instead of hinting or over-explaining.\n\nSeek relationships where honesty is welcomed, not punished.',
    support:
      `${SUPPORT}\n\nSeek therapy if people-pleasing stems from trauma, abuse history, or severe anxiety about abandonment.`,
    related: [
      'How do I set boundaries without feeling guilty?',
      'How do I stop being a people-pleaser and start putting my own needs first?',
      'How do I stop being a people pleaser in relationships?',
      'How do I stop being afraid of conflict in relationships?',
      'How do I build self-esteem?',
    ],
    schemaAnswer:
      'Stop people-pleasing by pausing before yeses, practicing small nos, naming priorities, tolerating disappointment, and seeking relationships that welcome honesty.',
    themes: ['People-pleasing', 'Boundaries', 'Authenticity', 'Self-worth'],
  }),
  'how-do-i-stop-being-a-people-pleaser-and-start-putting-my-own-needs-first-s1t2u3': draft({
    question:
      'How do I stop being a people-pleaser and start putting my own needs first?',
    slug: 'how-do-i-stop-being-a-people-pleaser-and-start-putting-my-own-needs-first-s1t2u3',
    category: 'Identity & Self-Worth',
    title: 'Putting Your Needs First',
    meta: 'Moving from people-pleasing to self-prioritization starts with naming needs, tolerating guilt, and accepting that balance—not selfishness—is the goal.',
    summary:
      'Putting your needs first does not mean ignoring everyone else—it means stopping the automatic sacrifice that leaves you depleted. Identity strengthens when your calendar and emotional energy reflect your values, not just others\' expectations.',
    takeaways: [
      'Needs-first is balance, not narcissism.',
      'You cannot pour from an empty cup—depletion helps no one long-term.',
      'Naming needs aloud is a skill that improves with practice.',
      'Guilt often peaks right when change begins—then often eases.',
    ],
    happening:
      'You may feel invisible in your own life—always organizing, accommodating, fixing.\n\nEquating self-care with selfishness can block basic rest and medical care.',
    help:
      'List non-negotiable needs: sleep, meals, medical appointments, solitude, creative time.\n\nSchedule needs before optional requests from others.\n\nUse "I need" statements without over-apologizing.\n\nTrack resentment as a signal that sacrifice has gone too far.\n\nReduce commitments that exist only to avoid disappointing someone.\n\nCelebrate small wins when you choose yourself without catastrophe.',
    support:
      `${SUPPORT}\n\nSeek therapy if self-neglect ties to low self-worth, trauma, or depression.`,
    related: [
      'How do I stop being a people pleaser?',
      'How do I build a stronger sense of identity?',
      'How do I set boundaries without feeling guilty?',
      'How do I stop being so hard on myself?',
      'How do I recover from burnout at work?',
    ],
    schemaAnswer:
      'Put your needs first by listing non-negotiables, scheduling self-care before optional requests, using direct statements, reading resentment as data, and tolerating initial guilt.',
    themes: ['Self-prioritization', 'Identity', 'People-pleasing', 'Self-worth'],
    notes: 'Distinct from general people-pleaser slug; emphasize needs-first identity framing.',
  }),
  'how-do-i-stop-being-a-people-pleaser-in-190219-009': draft({
    question: 'How do I stop being a people pleaser in relationships?',
    slug: 'how-do-i-stop-being-a-people-pleaser-in-190219-009',
    category: 'Communication & Conflict',
    title: 'People-Pleasing in Relationships',
    meta: 'Relationship people-pleasing hides your real preferences—honest communication and tolerating partner disappointment rebuild intimacy.',
    summary:
      'In relationships, people-pleasing looks like always deferring, avoiding conflict, or performing happiness to keep peace. Over time partners may not know the real you. Healthier connection requires expressing needs, tolerating disagreement, and risking authentic visibility.',
    takeaways: [
      'Partners cannot love a version of you that hides real preferences.',
      'Conflict avoidance often creates distance, not closeness.',
      'Honest needs invite deeper intimacy—even when uncomfortable.',
      'Secure relationships survive disappointment and repair.',
    ],
    happening:
      'You may agree to plans, sex, or decisions you resent later.\n\nFear that authenticity will end the relationship keeps you performing agreeableness.',
    help:
      'Share preferences before resentment hardens—restaurants, weekends, finances, affection.\n\nUse calm "I" statements instead of passive agreement followed by withdrawal.\n\nPractice tolerating partner disappointment without rushing to fix it.\n\nNotice when you monitor their mood to decide your own—that is a signal.\n\nInvite reciprocal honesty; relationships thrive on mutual visibility.\n\nConsider couples therapy if people-pleasing masks long-standing imbalance.',
    support:
      `${SUPPORT}\n\nSeek individual or couples therapy if people-pleasing coexists with abuse, coercion, or fear of leaving.`,
    related: [
      'How do I stop being a people pleaser?',
      'How do I stop being afraid of conflict in relationships?',
      'How do I set boundaries without feeling guilty?',
      'How do I communicate my needs in a relationship?',
      'How do I know if my relationship is one-sided?',
    ],
    schemaAnswer:
      'Stop people-pleasing in relationships by expressing preferences early, using honest communication, tolerating disappointment, and seeking therapy when imbalance or fear dominates.',
    themes: ['Relationship patterns', 'People-pleasing', 'Communication', 'Authenticity'],
    flags: ['relationship_conflict'],
  }),
  'how-do-i-stop-being-afraid-of-conflict-i-181083-100': draft({
    question: 'How do I stop being afraid of conflict in relationships?',
    slug: 'how-do-i-stop-being-afraid-of-conflict-i-181083-100',
    category: 'Communication & Conflict',
    title: 'Overcoming Fear of Relationship Conflict',
    meta: 'Conflict fear often comes from past harm—learning repair skills and tolerating disagreement can strengthen bonds instead of ending them.',
    summary:
      'If conflict once meant yelling, silence, or abandonment, avoidance makes sense. Healthy relationships still include disagreement. Building tolerance for regulated conflict—staying present, naming issues, repairing afterward—can reduce the terror that every fight means the end.',
    takeaways: [
      'Fear of conflict often reflects past experiences—not present reality.',
      'Avoided conflict usually resurfaces as resentment or distance.',
      'Regulated disagreement can deepen trust when repair follows.',
      'You can learn conflict skills like any other relationship tool.',
    ],
    happening:
      'You may freeze, appease, or flee at the first sign of tension.\n\nChildhood or past relationships where conflict meant danger can wire avoidance as safety.',
    help:
      'Start with low-stakes disagreements—preferences, schedules—to build tolerance.\n\nUse "I" statements and focus on one issue at a time.\n\nAgree on ground rules: no name-calling, timeouts, return to repair.\n\nPractice staying physically present—breathing, feet on floor—during tension.\n\nDebrief after conflicts: what worked, what hurt, how to try differently.\n\nDistinguish unsafe conflict (threats, contempt) from uncomfortable but repairable friction.',
    support:
      `${SUPPORT}\n\nSeek therapy immediately if conflict includes violence, threats, or coercive control; call 988 or emergency services if you feel unsafe.`,
    related: [
      'How do I communicate better with my partner during disagreements?',
      'How do I set boundaries without feeling guilty?',
      'How do I stop being a people pleaser in relationships?',
      'How do I rebuild trust after betrayal?',
      'How do I know if conflict in my relationship is unhealthy?',
    ],
    schemaAnswer:
      'Reduce fear of relationship conflict by practicing low-stakes disagreement, using ground rules, staying present, repairing afterward, and distinguishing unsafe dynamics from normal friction.',
    themes: ['Conflict avoidance', 'Communication', 'Repair', 'Attachment'],
    flags: ['relationship_conflict'],
    notes: 'Verify crisis/safety language for abusive dynamics; no minimization of violence.',
  }),
  'how-do-i-stop-being-so-clingy-and-needy-in-relatio-186602-011': draft({
    question: 'How do I stop being so clingy and needy in relationships?',
    slug: 'how-do-i-stop-being-so-clingy-and-needy-in-relatio-186602-011',
    category: 'Attachment Styles & Relationship Dynamics',
    title: 'Reducing Clinginess in Relationships',
    meta: 'Clinginess often signals attachment anxiety—build self-soothing, independent interests, and direct reassurance requests instead of surveillance behaviors.',
    summary:
      'Clingy behaviors—constant texting, jealousy checks, panic when partners need space—usually reflect fear of abandonment more than love intensity. Reducing them involves self-soothing skills, strengthening identity outside the relationship, and negotiating reassurance explicitly.',
    takeaways: [
      'Clinginess is often anxiety-driven—not proof you love "too much."',
      'Self-soothing reduces the urge to monitor or merge with partners.',
      'Independent interests make space feel safer for both people.',
      'Direct reassurance requests work better than testing or punishing distance.',
    ],
    happening:
      'You may spiral when texts go unanswered or interpret alone time as rejection.\n\nPast losses or inconsistent caregiving can wire proximity-seeking as survival.',
    help:
      'Name abandonment fears without acting on every urge to check in.\n\nBuild a self-soothe toolkit: breath work, walks, journaling, friend calls.\n\nMaintain friendships, work, and hobbies that do not revolve around your partner.\n\nAsk for reassurance directly: "I feel insecure—can we talk tonight?"\n\nTolerate brief separations as practice; anxiety often peaks then decreases.\n\nExplore attachment patterns in therapy to address roots, not just symptoms.',
    support:
      `${SUPPORT}\n\nSeek therapy if clinginess drives controlling behavior, stalking impulses, or relationship-threatening panic.`,
    related: [
      'How do I manage attachment anxiety in relationships?',
      'How do I stop being so jealous in my relationship?',
      'How do I build self-esteem in relationships?',
      'How do I give my partner space without feeling abandoned?',
      'How do I communicate my needs without being needy?',
    ],
    schemaAnswer:
      'Reduce clinginess by self-soothing attachment anxiety, maintaining independent interests, requesting reassurance directly, practicing tolerating space, and exploring attachment patterns in therapy.',
    themes: ['Attachment anxiety', 'Clinginess', 'Self-soothing', 'Relationships'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'how-do-i-stop-being-so-critical-of-myself-and-othe-187459-015': draft({
    question: 'How do I stop being so critical of myself and others?',
    slug: 'how-do-i-stop-being-so-critical-of-myself-and-othe-187459-015',
    category: 'Perfectionism & Control Issues',
    title: 'Softening Self-Criticism and Criticism of Others',
    meta: 'Harsh criticism of self and others often masks fear of not measuring up—self-compassion and curiosity interrupt the reflex to judge.',
    summary:
      'A critical inner voice and sharp judgments toward others often share one root: high standards driven by anxiety about failure or chaos. Noticing the fear beneath criticism, practicing self-compassion, and choosing curiosity over verdicts can soften the pattern.',
    takeaways: [
      'Self-criticism and criticizing others often share perfectionism roots.',
      'Harsh judgment frequently protects against feeling inadequate or out of control.',
      'Self-compassion is a skill—not letting yourself off the hook.',
      'Curiosity about mistakes beats condemnation for growth.',
    ],
    happening:
      'You may replay errors relentlessly or notice flaws in others before acknowledging your own.\n\nStress and shame can turn criticism into a default lens on yourself and the world.',
    help:
      'Catch the inner critic—label it, do not obey it automatically.\n\nAsk what fear sits under the criticism: failure, rejection, disorder?\n\nPractice self-compassion phrases you would offer a friend in the same situation.\n\nWhen judging others, pause: is this about their behavior or your anxiety?\n\nSet "good enough" standards for low-stakes tasks to reduce perfection pressure.\n\nApologize and repair when criticism harms relationships.',
    support:
      `${SUPPORT}\n\nSeek therapy if self-criticism fuels depression, rage, or relationship damage you cannot reverse alone.`,
    related: [
      'How do I stop being so hard on myself?',
      'How do I overcome perfectionism at work?',
      'How do I practice self-compassion?',
      'How do I manage anger without hurting relationships?',
      'How do I stop being so sensitive to criticism?',
    ],
    schemaAnswer:
      'Reduce criticism of self and others by naming perfectionism fears, practicing self-compassion, using curiosity, setting good-enough standards, and repairing relationship harm.',
    themes: ['Self-criticism', 'Perfectionism', 'Judgment', 'Self-compassion'],
  }),
  'how-do-i-stop-being-so-hard-on-myself-177941-019': draft({
    question: 'How do I stop being so hard on myself?',
    slug: 'how-do-i-stop-being-so-hard-on-myself-177941-019',
    category: 'Self-Compassion',
    title: 'Being Less Hard on Yourself',
    meta: 'Self-criticism often echoes early perfectionism—treat yourself with the kindness you would offer a struggling friend, not a failing employee.',
    summary:
      'Being hard on yourself might have once pushed you to achieve or avoid disapproval. Over time it fuels anxiety, shame, and burnout. Self-compassion—acknowledging struggle without abandoning standards—interrupts the habit of internal punishment.',
    takeaways: [
      'Self-criticism often learned early as a motivation or protection strategy.',
      'Harsh self-talk increases anxiety without improving performance long-term.',
      'Self-compassion supports resilience—not excuses for harmful behavior.',
      'Small language shifts ("I am learning") reduce shame spirals.',
    ],
    happening:
      'You may berate yourself for normal mistakes or compare your insides to others\' highlights.\n\nPerfectionism makes rest, play, or asking for help feel like moral failure.',
    help:
      'Notice self-critical thoughts; write them down to see patterns.\n\nAsk: would I say this to a friend? If not, revise the tone.\n\nUse compassionate phrases: "This is hard; many people struggle here."\n\nSeparate behavior from identity—messing up does not make you a mess.\n\nCelebrate effort and learning, not only flawless outcomes.\n\nPair self-compassion practice with therapy if shame runs deep.',
    support:
      `${SUPPORT}\n\nSeek therapy if self-criticism accompanies depression, eating disorders, or suicidal thoughts.`,
    related: [
      'How do I practice self-compassion?',
      'How do I stop being so critical of myself and others?',
      'How do I overcome imposter syndrome?',
      'How do I stop being so sensitive to criticism?',
      'How do I build self-esteem?',
    ],
    schemaAnswer:
      'Stop being hard on yourself by noticing critical thoughts, using friend-level kindness, separating mistakes from identity, celebrating effort, and practicing self-compassion skills.',
    themes: ['Self-compassion', 'Inner critic', 'Shame', 'Perfectionism'],
  }),
  'how-do-i-stop-being-so-jealous-in-my-rel-185759-034': draft({
    question: 'How do I stop being so jealous in my relationship?',
    slug: 'how-do-i-stop-being-so-jealous-in-my-rel-185759-034',
    category: 'Relationships & Communication',
    title: 'Managing Jealousy in Relationships',
    meta: 'Jealousy often signals insecurity or past betrayal—name the fear, communicate openly, and build trust through behavior—not surveillance.',
    summary:
      'Jealousy is a painful alarm—not always proof of wrongdoing. It often reflects insecurity, past betrayal, or unmet reassurance needs. Managing it means understanding triggers, communicating without accusations, and building trust through consistent actions rather than controlling partners.',
    takeaways: [
      'Jealousy is a feeling to understand—not always a fact about your partner.',
      'Past betrayal can sensitize you to innocent cues.',
      'Open communication beats surveillance or testing.',
      'Trust rebuilds through consistent behavior over time.',
    ],
    happening:
      'You may scan phones, compare yourself to others, or panic over harmless interactions.\n\nInsecurity or previous cheating—by you or a partner—can amplify normal relationship uncertainty.',
    help:
      'Name jealousy triggers: specific situations, people, or stories you tell yourself.\n\nShare feelings with "I" language before they become accusations.\n\nAsk for reassurance you need—clarity about plans, affection, commitment.\n\nBuild self-worth independent of relationship status.\n\nAgree on transparency norms both partners can live with—without coercion.\n\nSeek couples therapy if jealousy drives control, isolation, or repeated ruptures.',
    support:
      `${SUPPORT}\n\nSeek help immediately if jealousy fuels threats, violence, or coercive monitoring; call 988 or emergency services if you feel unsafe.`,
    related: [
      'How do I rebuild trust after my partner cheated?',
      'How do I stop being so clingy and needy in relationships?',
      'How do I communicate insecurities without pushing my partner away?',
      'How do I know if jealousy is normal or a red flag?',
      'How do I build trust in a new relationship?',
    ],
    schemaAnswer:
      'Manage relationship jealousy by naming triggers, communicating with I-statements, requesting reassurance, building independent self-worth, and seeking therapy when control or violence appears.',
    themes: ['Jealousy', 'Trust', 'Insecurity', 'Communication'],
    flags: ['relationship_conflict'],
    notes: 'No surveillance or phone-checking endorsed as solutions; verify safety language.',
  }),
  'how-do-i-stop-being-so-sensitive-to-criticism-184730-006': draft({
    question: 'How do I stop being so sensitive to criticism?',
    slug: 'how-do-i-stop-being-so-sensitive-to-criticism-184730-006',
    category: 'Identity & Self-Worth',
    title: 'Handling Criticism Without Crumbling',
    meta: 'Criticism sensitivity often ties to low self-worth and rejection fear—separate feedback from identity and build resilience with self-compassion.',
    summary:
      'Feeling flattened by criticism does not mean you are weak—it often means feedback hits a shame wound or fear of rejection. Building resilience involves separating behavior from worth, evaluating feedback for usefulness, and regulating your nervous system before responding.',
    takeaways: [
      'Sensitivity to criticism often reflects self-worth wounds—not fragility.',
      'Not all criticism is accurate or fair—discernment matters.',
      'Pausing before reacting prevents shame spirals and regretted replies.',
      'Self-compassion and therapy strengthen long-term resilience.',
    ],
    happening:
      'You may ruminate for days over a mild comment or avoid situations where evaluation is possible.\n\nEarly experiences of harsh judgment or bullying can wire criticism as existential threat.',
    help:
      'Pause physically—breathe, walk—before interpreting feedback.\n\nAsk: is this about my behavior or my worth? Useful or unfair?\n\nExtract one actionable piece if any; release the rest.\n\nPractice self-compassion after stings instead of instant self-attack.\n\nSeek roles that gradually expose you to low-stakes feedback to build tolerance.\n\nLimit exposure to chronically harsh critics when change is unlikely.',
    support:
      `${SUPPORT}\n\nSeek therapy if criticism sensitivity drives social avoidance, depression, or rage that harms relationships.`,
    related: [
      'How do I stop being so hard on myself?',
      'How do I build self-esteem?',
      'How do I handle workplace criticism without shutting down?',
      'How do I stop being so critical of myself and others?',
      'How do I overcome imposter syndrome?',
    ],
    schemaAnswer:
      'Reduce criticism sensitivity by pausing before reacting, separating feedback from worth, extracting useful points, practicing self-compassion, and building gradual exposure with therapy when needed.',
    themes: ['Criticism sensitivity', 'Self-worth', 'Resilience', 'Rejection fear'],
  }),
};

const drafts = input.map((row) => {
  const item = contentBySlug[row.slug];
  if (!item) throw new Error(`Missing draft content for slug: ${row.slug}`);
  if (item.question !== row.question) {
    throw new Error(`Question mismatch for ${row.slug}`);
  }
  if (item.category !== row.category) {
    throw new Error(`Category mismatch for ${row.slug}: ${item.category} vs ${row.category}`);
  }
  return item;
});

writeFileSync(
  'reports/enrichment-corpus/draft-answers/batch-21-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-21-drafts.json`);
