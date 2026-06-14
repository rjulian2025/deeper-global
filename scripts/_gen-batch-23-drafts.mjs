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
const PTSD = {
  title: 'Post-Traumatic Stress Disorder',
  url: 'https://www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd',
  publisher: 'NIMH',
  note: 'Supports understanding trauma responses and treatment.',
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
  readFileSync('reports/enrichment-corpus/batches/batch-20-input.json', 'utf8'),
);

const contentBySlug = {
  'how-do-i-stop-feeling-like-im-bothering-181083-069': draft({
    question: "How do I stop feeling like I'm bothering people when I reach out?",
    slug: 'how-do-i-stop-feeling-like-im-bothering-181083-069',
    category: 'Identity & Self-Worth',
    title: 'Feeling Like a Burden When Reaching Out',
    meta: 'Fear of bothering others often reflects low self-worth—not reality. Most people welcome genuine connection; start with low-pressure outreach.',
    summary:
      'When every text or invitation feels like an imposition, loneliness and isolation grow. This fear often comes from past rejection or messages that your needs were too much. Most people appreciate thoughtful outreach—and consistent silence from others says more about them than your worth.',
    takeaways: [
      'Fear of bothering others often stems from low self-worth, not actual rejection.',
      'Many people are lonely and welcome genuine connection.',
      'Low-pressure outreach builds confidence before deeper asks.',
      'Repeated non-response is information—not proof you are unlovable.',
    ],
    happening:
      'You may hesitate to text, invite someone out, or share struggles because you assume you are too much.\n\nPast experiences of being ignored or criticized for having needs can wire outreach as dangerous.',
    help:
      'Start with brief, low-pressure contact: a check-in text, comment, or shared article.\n\nRemind yourself most people appreciate being thought of.\n\nNotice when you mind-read rejection before any response arrives.\n\nInvest in reciprocal relationships where effort flows both ways.\n\nPractice tolerating awkwardness—connection requires some risk.',
    support:
      `${SUPPORT}\n\nSeek therapy if fear of reaching out drives severe isolation, depression, or panic about social contact.`,
    related: [
      'How do I stop feeling like I am a burden to others?',
      'How do I ask for help when I struggle to reach out?',
      'How do I make friends as an adult?',
      'How do I cope with loneliness?',
      'How do I build self-esteem?',
    ],
    schemaAnswer:
      'Stop feeling like you bother people by starting low-pressure outreach, challenging mind-reading, investing in reciprocal relationships, and remembering most people welcome genuine connection.',
    themes: ['Reaching out', 'Self-worth', 'Loneliness', 'Social anxiety'],
  }),
  'how-do-i-stop-feeling-like-im-in-danger-when-im-actually-safe': draft({
    question: "How do I stop feeling like I'm in danger when I'm actually safe?",
    slug: 'how-do-i-stop-feeling-like-im-in-danger-when-im-actually-safe',
    category: 'Trauma & Triggers',
    title: 'Feeling Unsafe When You Are Safe',
    meta: 'Trauma can leave your nervous system stuck in survival mode—grounding, safety cues, and trauma-informed therapy help your body learn the threat has passed.',
    summary:
      'Hypervigilance after trauma makes ordinary spaces feel threatening even when danger has passed. Your alarm system learned to protect you—and may not have switched off. Healing involves gradually teaching your body that present-moment safety is real, often with professional support.',
    takeaways: [
      'Hypervigilance after trauma reflects a nervous system stuck in protection mode.',
      'Feeling unsafe does not mean you are currently in danger.',
      'Grounding and predictable routines signal safety to the body.',
      'Trauma-informed therapy helps rewire chronic threat responses.',
    ],
    happening:
      'You may scan rooms for exits, startle easily, or feel dread in crowds despite objective safety.\n\nPast trauma taught your body that relaxing could be dangerous.',
    help:
      'Use grounding: name five things you see, four you feel, three you hear.\n\nBuild predictable routines that signal safety—regular sleep, familiar spaces.\n\nPractice brief relaxation only in environments you have assessed as safe.\n\nLimit triggers when possible while gradually expanding tolerance with support.\n\nTrack small moments when your body eventually settled—evidence safety is possible.',
    support:
      `${SUPPORT}\n\nSeek trauma-informed therapy if hypervigilance impairs daily life, sleep, or relationships; call 988 if you feel unsafe with yourself.`,
    related: [
      'How do I manage trauma triggers in everyday life?',
      'How do I calm my nervous system after trauma?',
      'How do I cope with hypervigilance?',
      'How do I feel safe in my body again?',
      'How do I manage anxiety without medication?',
    ],
    schemaAnswer:
      'Reduce feeling in danger when safe through grounding, predictable routines, gradual exposure with support, and trauma-informed therapy to help your nervous system learn the threat has passed.',
    themes: ['Hypervigilance', 'Trauma', 'Safety', 'Grounding'],
    refs: [PTSD, NIMH],
    gaps: ['Verify somatic therapy references align with editorial standards.'],
  }),
  'how-do-i-stop-feeling-like-im-not-allowed-to-184730-091': draft({
    question: "How do I stop feeling like I'm not allowed to take up space?",
    slug: 'how-do-i-stop-feeling-like-im-not-allowed-to-184730-091',
    category: 'Identity & Self-Worth',
    title: 'Feeling You Cannot Take Up Space',
    meta: 'Messages that you are too much can shrink your presence—practice speaking up, occupying space, and honoring needs without apology.',
    summary:
      'Feeling you are not allowed to take up space often develops when childhood taught you to be small, quiet, or invisible to stay safe or acceptable. Your presence, opinions, and needs are valid. Gradually expanding how you show up rebuilds the right to exist fully.',
    takeaways: [
      'Feeling too much often reflects old conditioning—not moral truth.',
      'Taking up space includes physical presence, voice, and emotional needs.',
      'Small acts of visibility build tolerance for being seen.',
      'Healthy relationships make room for your full self.',
    ],
    happening:
      'You may speak quietly, apologize for existing, or shrink in groups.\n\nTrauma or harsh upbringing can make visibility feel dangerous.',
    help:
      'Practice one small expansion: share an opinion, sit comfortably, ask for what you need.\n\nNotice when you preemptively minimize yourself—and pause the apology reflex.\n\nSurround yourself with people who welcome your presence.\n\nSeparate being considerate from erasing yourself.\n\nCelebrate moments you showed up without shrinking.',
    support:
      `${SUPPORT}\n\nSeek therapy if invisibility patterns stem from trauma, abuse history, or severe social anxiety.`,
    related: [
      'How do I build self-esteem?',
      'How do I stop feeling like I am a burden to others?',
      'How do I set boundaries without feeling guilty?',
      'How do I stop being a people pleaser?',
      'How do I heal from childhood emotional neglect?',
    ],
    schemaAnswer:
      'Stop feeling you cannot take up space by practicing small visibility, releasing automatic apologies, choosing supportive relationships, and separating kindness from self-erasure.',
    themes: ['Self-worth', 'Visibility', 'Childhood conditioning', 'Boundaries'],
  }),
  'how-do-i-stop-feeling-like-im-not-doing-enough-184730-103': draft({
    question: "How do I stop feeling like I'm not doing enough with my life?",
    slug: 'how-do-i-stop-feeling-like-im-not-doing-enough-184730-103',
    category: 'Identity & Self-Worth',
    title: 'Not Doing Enough With Your Life',
    meta: 'Enough anxiety often comes from productivity culture and comparison—define success by your values, not endless achievement benchmarks.',
    summary:
      'Feeling you are not doing enough with your life often reflects cultural glorification of busyness and comparison to curated highlight reels. Ordinary life—rest, relationships, maintenance—counts. Defining enough through your values rather than external milestones reduces chronic inadequacy.',
    takeaways: [
      'Enough is often defined by culture—not your actual values.',
      'Comparison to social media distorts what normal life looks like.',
      'Rest, relationships, and health are legitimate life activities.',
      'Depression can filter out recognition of what you already contribute.',
    ],
    happening:
      'You may feel guilty during downtime or dismiss caregiving and maintenance as not counting.\n\nPerfectionism makes every day feel like evidence of falling short.',
    help:
      'List what you value—not what looks impressive—and align one small action weekly.\n\nLimit comparison triggers when vulnerability is high.\n\nTrack contributions others benefit from, including emotional support.\n\nPractice rest without earning it through productivity.\n\nQuestion whose timeline you are measuring yourself against.',
    support:
      `${SUPPORT}\n\nSeek therapy if not-enough feelings drive depression, burnout, or hopelessness about your future.`,
    related: [
      'How do I stop feeling like I am wasting my life?',
      'How do I stop comparing my life to social media?',
      'How do I recover from burnout at work?',
      'How do I find purpose when life feels meaningless?',
      'How do I practice self-compassion?',
    ],
    schemaAnswer:
      'Reduce not-doing-enough anxiety by defining success through personal values, limiting comparison, honoring rest and relationships, and tracking real contributions—not highlight reels.',
    themes: ['Productivity guilt', 'Life comparison', 'Values', 'Self-worth'],
    refs: [DEPRESSION, NIMH],
  }),
  'how-do-i-stop-feeling-like-im-not-enough-184730-065': draft({
    question: "How do I stop feeling like I'm not enough?",
    slug: 'how-do-i-stop-feeling-like-im-not-enough-184730-065',
    category: 'Identity & Self-Worth',
    title: 'Feeling Not Enough',
    meta: 'Not-enough beliefs tie worth to achievement and approval—practice self-compassion and recognize inherent value beyond performance.',
    summary:
      'Feeling fundamentally not enough often develops when love or acceptance felt conditional on performance. No achievement permanently satisfies this belief because the problem is the equation—not your output. Self-compassion and internal validation loosen the grip of chronic inadequacy.',
    takeaways: [
      'Not-enough feelings often stem from conditional acceptance in childhood.',
      'External achievements rarely cure internal worthlessness.',
      'Self-compassion supports change better than self-attack.',
      'You are enough as a person—not as a performance score.',
    ],
    happening:
      'You may chase accomplishments, approval, or perfection and still feel hollow.\n\nSocial comparison and trauma can reinforce a core belief of being flawed.',
    help:
      'Notice not-enough thoughts as patterns—not facts.\n\nPractice speaking to yourself as you would a struggling friend.\n\nSeparate identity from outcomes: struggling does not mean worthless.\n\nBuild worth through values and relationships—not only achievements.\n\nLimit feeds and people who trigger harsh self-comparison.',
    support:
      `${SUPPORT}\n\nSeek therapy if not-enough beliefs drive depression, eating disorders, or suicidal thoughts.`,
    related: [
      'How do I build self-esteem?',
      'How do I practice self-compassion?',
      'How do I stop being so hard on myself?',
      'How do I stop feeling like I need to prove myself constantly?',
      'How do I overcome perfectionism?',
    ],
    schemaAnswer:
      'Stop feeling not enough by challenging conditional-worth beliefs, practicing self-compassion, separating identity from achievement, and building internal validation.',
    themes: ['Self-worth', 'Conditional love', 'Perfectionism', 'Self-compassion'],
    refs: [DEPRESSION, NIMH],
  }),
  'how-do-i-stop-feeling-like-im-not-living-up-184730-032': draft({
    question: "How do I stop feeling like I'm not living up to my potential?",
    slug: 'how-do-i-stop-feeling-like-im-not-living-up-184730-032',
    category: 'Identity & Self-Worth',
    title: 'Not Living Up to Your Potential',
    meta: 'Potential pressure often reflects others\' expectations—not your values. Focus on meaningful contribution on your timeline, not abstract wasted talent.',
    summary:
      'Pressure to live up to potential often comes from being labeled gifted or destined for greatness—and measuring your life against others\' definitions of success. Potential evolves throughout life; detours, rest, and non-linear paths are normal. Meaningful living matters more than maximizing abstract talent.',
    takeaways: [
      'Potential is often defined externally—not by your fulfillment.',
      'Non-linear paths and late starts are common and valid.',
      'Feeling empty despite success may signal misaligned goals.',
      'Contribution takes many forms beyond conventional achievement.',
    ],
    happening:
      'You may feel you are disappointing people who believed in you—or wasting abilities.\n\nComparison to peers who seem further ahead intensifies shame.',
    help:
      'Ask whose definition of potential you are using—and whether it matches your values.\n\nDocument skills and impact in forms that do not show on LinkedIn.\n\nAllow exploration periods that look unproductive but support long-term growth.\n\nSeek mentors with non-linear stories to normalize detours.\n\nSeparate being talented from owing the world a specific outcome.',
    support:
      `${SUPPORT}\n\nSeek career counseling or therapy if potential anxiety drives burnout, depression, or paralysis.`,
    related: [
      'How do I stop feeling like I am wasting my potential?',
      'How do I overcome imposter syndrome?',
      'How do I separate my self-worth from my job title?',
      'How do I stop feeling professionally behind?',
      'How do I find purpose when life feels meaningless?',
    ],
    schemaAnswer:
      'Reduce potential pressure by defining success through personal values, accepting non-linear paths, documenting real impact, and releasing others\' expectations as the measure of your life.',
    themes: ['Potential anxiety', 'Gifted pressure', 'Career comparison', 'Self-worth'],
    notes: 'Distinct from own-expectations slug; emphasize external potential labels.',
  }),
  'how-do-i-stop-feeling-like-im-not-living-up-a3b6c9': draft({
    question: "How do I stop feeling like I'm not living up to my own expectations?",
    slug: 'how-do-i-stop-feeling-like-im-not-living-up-a3b6c9',
    category: 'Identity & Self-Worth',
    title: 'Not Living Up to Your Own Expectations',
    meta: 'Self-disappointment often reflects perfectionist standards—adjust expectations with compassion and measure progress, not flawless outcomes.',
    summary:
      'Disappointing your own expectations hurts deeply because the judge and judged are the same person. Perfectionist timelines and idealized self-images ignore real constraints, mental health, and the non-linear nature of growth. Compassionate standards and progress tracking reduce internal punishment.',
    takeaways: [
      'Self-expectations are often harsher than any external standard.',
      'Perfectionism ignores real-life complexity and setbacks.',
      'Progress over time matters more than gap-to-ideal comparisons.',
      'Adjusting standards is wisdom—not giving up.',
    ],
    happening:
      'You may feel frustrated that old struggles persist or that you are not where you imagined by now.\n\nDepression can erase recognition of growth you have made.',
    help:
      'Write expectations down—and ask if you would apply them to a friend.\n\nTrack evidence of progress over months, not just current gaps.\n\nSeparate identity from performance: setbacks are events, not verdicts.\n\nBuild in rest and recovery as part of growth, not failure.\n\nRevise timelines when life circumstances change.',
    support:
      `${SUPPORT}\n\nSeek therapy if self-disappointment fuels depression, self-harm, or chronic paralysis.`,
    related: [
      'How do I stop feeling like I am a disappointment to myself?',
      'How do I overcome perfectionism?',
      'How do I stop being so hard on myself?',
      'How do I practice self-compassion?',
      'How do I stop feeling like I am not living up to my potential?',
    ],
    schemaAnswer:
      'Stop disappointing your own expectations by revising perfectionist standards, tracking genuine progress, practicing self-compassion, and treating setbacks as normal—not identity-defining.',
    themes: ['Self-expectations', 'Perfectionism', 'Inner critic', 'Self-compassion'],
    notes: 'Distinct from external-potential slug; emphasize internal standards and perfectionism.',
  }),
  'how-do-i-stop-feeling-like-im-wasting-my-184730-002': draft({
    question: "How do I stop feeling like I'm wasting my life?",
    slug: 'how-do-i-stop-feeling-like-im-wasting-my-184730-002',
    category: 'Identity & Self-Worth',
    title: 'Feeling Like You Are Wasting Your Life',
    meta: 'Life-wasting anxiety often comes from comparison and rigid timelines—small value-aligned actions and rest are not wasted time.',
    summary:
      'Feeling you are wasting your life is existential anxiety amplified by achievement culture and social comparison. There is no universal timeline for meaning. Rest, relationships, and ordinary days are part of a full life—not evidence of failure.',
    takeaways: [
      'Life-wasting feelings often reflect comparison—not objective failure.',
      'There is no single correct timeline for a meaningful life.',
      'Small consistent actions toward values matter more than dramatic overhauls.',
      'Rest and connection are essential—not wasted hours.',
    ],
    happening:
      'You may feel behind on milestones or ashamed of quiet seasons.\n\nPerfectionism treats ordinary life as insufficient compared to highlight reels.',
    help:
      'Identify two or three values and one small weekly action for each.\n\nLimit social comparison when vulnerability is high.\n\nName what is working—not only what is missing.\n\nAccept that meaning builds gradually, not all at once.\n\nSeparate productivity from human worth.',
    support:
      `${SUPPORT}\n\nSeek therapy if life-wasting thoughts drive depression, suicidal ideation, or inability to function.`,
    related: [
      'How do I stop feeling like I am not doing enough with my life?',
      'How do I find purpose when life feels meaningless?',
      'How do I stop comparing my life to social media?',
      'How do I cope with feeling like a failure?',
      'How do I practice self-compassion?',
    ],
    schemaAnswer:
      'Reduce life-wasting anxiety by acting on personal values in small steps, limiting comparison, honoring rest and relationships, and rejecting universal timelines for meaning.',
    themes: ['Existential anxiety', 'Life purpose', 'Comparison', 'Values'],
    refs: [DEPRESSION, NIMH],
  }),
  'how-do-i-stop-feeling-like-im-wasting-my-potential-d4e8f1': draft({
    question: "How do I stop feeling like I'm wasting my potential?",
    slug: 'how-do-i-stop-feeling-like-im-wasting-my-potential-d4e8f1',
    category: 'Identity & Self-Worth',
    title: 'Feeling You Are Wasting Your Potential',
    meta: 'Potential guilt often reflects external labels and comparison—redefine success through values and allow non-linear paths.',
    summary:
      'Feeling you waste potential often follows being called gifted or high-achieving—and measuring life against abstract greatness. Choosing balance, family, creativity, or slower paths is not waste. Potential expressed through values-aligned living counts even when it does not look impressive.',
    takeaways: [
      'Potential guilt often comes from others\' labels—not your choices.',
      'Fulfillment and conventional success are not the same.',
      'Exploration and rest periods can be necessary for growth.',
      'Redefining potential through values reduces chronic guilt.',
    ],
    happening:
      'You may feel guilty for not pursuing visible achievements or disappointing mentors.\n\nPerfectionism treats any non-optimized moment as failure.',
    help:
      'List ways you already use strengths—in work, relationships, creativity, caregiving.\n\nAsk whether current choices align with your values even if they look modest externally.\n\nRelease others\' investment in your trajectory as separate from your wellbeing.\n\nAllow seasons of rest without labeling them permanent waste.\n\nFocus on one concrete growth step rather than panicking about the whole ladder.',
    support:
      `${SUPPORT}\n\nSeek therapy if potential guilt drives burnout, depression, or relentless overwork.`,
    related: [
      'How do I stop feeling like I am not living up to my potential?',
      'How do I separate my self-worth from my job title?',
      'How do I recover from burnout at work?',
      'How do I stop feeling professionally behind?',
      'How do I overcome imposter syndrome?',
    ],
    schemaAnswer:
      'Stop wasting-potential guilt by redefining success through values, recognizing non-linear paths, honoring rest seasons, and focusing on concrete growth—not abstract greatness.',
    themes: ['Potential guilt', 'Gifted identity', 'Values', 'Burnout'],
    notes: 'Distinct from wasting-life slug; emphasize talent labels and external expectations.',
  }),
  'how-do-i-stop-feeling-like-im-wasting-time-when-184730-061': draft({
    question: "How do I stop feeling like I'm wasting time when I'm not being productive?",
    slug: 'how-do-i-stop-feeling-like-im-wasting-time-when-184730-061',
    category: 'Identity & Self-Worth',
    title: 'Guilt When Not Being Productive',
    meta: 'Productivity guilt equates worth with output—rest, play, and leisure restore energy and are essential, not wasted time.',
    summary:
      'Feeling you waste time whenever you are not producing reflects cultural messages that human worth equals output. Rest, hobbies, and unstructured time support mental health, creativity, and relationships. Guilt-free downtime is an investment—not laziness.',
    takeaways: [
      'Productivity guilt often reflects cultural conditioning—not moral truth.',
      'Rest restores capacity; constant output leads to burnout.',
      'Joy and connection rarely appear on to-do lists but matter deeply.',
      'Your worth is not your hourly output.',
    ],
    happening:
      'You may feel anxious watching a show, napping, or spending time with friends.\n\nPerfectionism and economic anxiety can make every non-work minute feel dangerous.',
    help:
      'Schedule guilt-free rest blocks as seriously as work tasks.\n\nReframe leisure as maintenance for brain and body.\n\nStart with short breaks and notice you survive them.\n\nSeparate urgent tasks from the belief that every moment must optimize.\n\nTrack mood and effectiveness after real rest—often they improve.',
    support:
      `${SUPPORT}\n\nSeek therapy if productivity guilt drives burnout, insomnia, or inability to enjoy anything.`,
    related: [
      'How do I recover from burnout at work?',
      'How do I stop feeling like I am not doing enough with my life?',
      'How do I set boundaries between work and personal life?',
      'How do I practice self-compassion?',
      'How do I manage stress when I cannot change my situation?',
    ],
    schemaAnswer:
      'Reduce productivity guilt by scheduling intentional rest, reframing leisure as essential maintenance, starting with small guilt-free breaks, and separating worth from output.',
    themes: ['Productivity guilt', 'Rest', 'Burnout', 'Self-worth'],
    refs: [BURNOUT, NIMH],
  }),
  'how-do-i-stop-feeling-overwhelmed-by-everything': draft({
    question: 'How do I stop feeling overwhelmed by everything?',
    slug: 'how-do-i-stop-feeling-overwhelmed-by-everything',
    category: 'General Mental Health',
    title: 'Feeling Overwhelmed by Everything',
    meta: 'Overwhelm signals too much load—brain dumps, prioritization, one-task focus, and saying no help you regain manageable steps.',
    summary:
      'Feeling overwhelmed by everything happens when demands exceed your perceived capacity to cope. It is a signal to simplify—not a character flaw. Externalizing tasks, prioritizing ruthlessly, and protecting energy with boundaries restore a sense of control.',
    takeaways: [
      'Overwhelm means load exceeds capacity—not that you are failing.',
      'Brain dumps reduce mental clutter before prioritizing.',
      'One task at a time beats multitasking for clarity.',
      'Saying no protects energy for what truly matters.',
    ],
    happening:
      'Everything may feel equally urgent, paralyzing action.\n\nStress, depression, or life transitions can shrink your coping bandwidth.',
    help:
      'Write everything down in a brain dump—no sorting yet.\n\nPick one small next step; completion builds momentum.\n\nUse urgency-importance sorting to defer or drop low-value tasks.\n\nWork in focused blocks with short breaks.\n\nPractice saying no to new commitments until load lightens.',
    support:
      `${SUPPORT}\n\nSeek help if overwhelm persists despite simplification, or if you have thoughts of self-harm; call 988 in the U.S.`,
    related: [
      'How do I manage stress when everything feels urgent?',
      'How do I set boundaries to reduce stress?',
      'How do I cope with depression when daily tasks feel impossible?',
      'How do I stop overthinking everything?',
      'How do I recover from burnout at work?',
    ],
    schemaAnswer:
      'Reduce overwhelm with brain dumps, one small next step, prioritization, focused work blocks, and boundaries on new commitments until load is manageable.',
    themes: ['Overwhelm', 'Stress management', 'Prioritization', 'Boundaries'],
    refs: [BURNOUT, CDC],
  }),
  'how-do-i-stop-feeling-overwhelmed-by-fin-181083-023': draft({
    question: 'How do I stop feeling overwhelmed by financial decisions?',
    slug: 'how-do-i-stop-feeling-overwhelmed-by-fin-181083-023',
    category: 'Work & Burnout',
    title: 'Overwhelmed by Financial Decisions',
    meta: 'Financial overwhelm eases when you break decisions into steps, learn gradually, and remember most choices can be adjusted over time.',
    summary:
      'Financial decisions feel overwhelming because they involve uncertainty and long-term stakes. Trying to learn everything at once increases paralysis. Small steps, trusted guidance, and accepting that most choices are revisable reduce anxiety without requiring instant expertise.',
    takeaways: [
      'Financial overwhelm often comes from trying to decide everything at once.',
      'Most financial choices can be adjusted as circumstances change.',
      'One decision at a time beats total-information paralysis.',
      'Professional guidance can clarify major choices without shame.',
    ],
    happening:
      'Bills, retirement, debt, and major purchases may blur into one impossible pile.\n\nShame about past choices can make any new decision feel high-stakes.',
    help:
      'List decisions separately—not as one undifferentiated crisis.\n\nTackle one category or question per week with focused research.\n\nUse checklists for routine tasks: bills, savings, insurance reviews.\n\nConsider a certified financial counselor for major moves—not moral judgment.\n\nPause before irreversible choices; sleep on medium-stakes decisions.',
    support:
      `${SUPPORT}\n\nSeek financial counseling or therapy if money anxiety drives panic, avoidance, or depression; this is general guidance, not financial advice.`,
    related: [
      'How do I stop feeling ashamed of my debt?',
      'How do I stop money from controlling my mood?',
      'How do I manage stress about money?',
      'How do I stop feeling overwhelmed by everything?',
      'How do I set boundaries around financial stress?',
    ],
    schemaAnswer:
      'Reduce financial decision overwhelm by separating choices, tackling one step at a time, using checklists, seeking qualified guidance for major decisions, and remembering most choices can be revised.',
    themes: ['Financial stress', 'Decision paralysis', 'Overwhelm', 'Anxiety'],
    notes: 'No specific investment or tax advice; encourage qualified financial counseling.',
  }),
  'how-do-i-stop-feeling-responsible-for-everyo-177941-023': draft({
    question: "How do I stop feeling responsible for everyone else's emotions?",
    slug: 'how-do-i-stop-feeling-responsible-for-everyo-177941-023',
    category: 'Codependency',
    title: 'Responsible for Others\' Emotions',
    meta: 'You cannot manage others\' feelings for them—support without absorbing emotional responsibility protects both you and them.',
    summary:
      'Feeling responsible for everyone else\'s emotions often develops when you learned to manage moods at home to stay safe or loved. Others\' feelings belong to them. Supportive presence differs from carrying, fixing, or preventing every upset.',
    takeaways: [
      'Others\' emotions are theirs to feel and regulate—not yours to control.',
      'Childhood peacekeeper roles wire over-responsibility for moods.',
      'Fixing feelings can block others from developing coping skills.',
      'Boundaries on emotional labor prevent resentment and burnout.',
    ],
    happening:
      'You may feel guilty when someone is upset—even when you did nothing wrong.\n\nWalking on eggshells and constant fixing exhaust you and enable dependency.',
    help:
      'Notice when you are absorbing feelings that are not yours.\n\nOffer empathy without immediate fixes: "That sounds hard."\n\nRelease responsibility for reactions you cannot control.\n\nSet limits on how much emotional labor you provide.\n\nRedirect energy toward your own regulation and needs.',
    support:
      `${SUPPORT}\n\nSeek therapy if codependency, people-pleasing, or fear of conflict prevents basic boundaries.`,
    related: [
      'How do I stop feeling like I need to fix everyone\'s problems?',
      'How do I stop being a people pleaser?',
      'How do I set boundaries with family members?',
      'How do I manage codependency in relationships?',
      'How do I stop feeling guilty about setting boundaries?',
    ],
    schemaAnswer:
      'Stop feeling responsible for others\' emotions by offering empathy without fixing, releasing control over their reactions, setting emotional-labor boundaries, and prioritizing your own regulation.',
    themes: ['Codependency', 'Emotional labor', 'Boundaries', 'People-pleasing'],
  }),
  'how-do-i-stop-feeling-so-ashamed-of-my-d-181083-016': draft({
    question: 'How do I stop feeling so ashamed of my debt?',
    slug: 'how-do-i-stop-feeling-so-ashamed-of-my-d-181083-016',
    category: 'Work & Burnout',
    title: 'Shame About Debt',
    meta: 'Debt shame is common but counterproductive—treat debt as a solvable circumstance, not a moral failing, and build a clear plan with support.',
    summary:
      'Shame about debt thrives in secrecy and makes problems harder to solve. Debt reflects circumstances—medical bills, education, job loss—not character. Breaking silence, building a concrete plan, and focusing on progress reduce shame more than hiding.',
    takeaways: [
      'Debt is a circumstance—not proof you are irresponsible or bad.',
      'Shame grows in secrecy; talking reduces isolation.',
      'Millions carry debt for reasons beyond personal failure.',
      'A clear plan restores agency better than self-punishment.',
    ],
    happening:
      'You may hide bills, avoid opening mail, or feel unworthy of help.\n\nCultural messages tie net worth to moral worth intensify shame.',
    help:
      'Share with one trusted person or a nonprofit credit counselor—break the secrecy.\n\nList debts factually without moral labels.\n\nBuild a realistic budget and repayment sequence; celebrate small progress.\n\nSeparate past choices from current action—you can change direction now.\n\nLimit comparison to others\' visible spending.',
    support:
      `${SUPPORT}\n\nSeek financial counseling or therapy if debt shame drives depression, panic, or suicidal thoughts; this is general guidance, not financial advice.`,
    related: [
      'How do I stop feeling overwhelmed by financial decisions?',
      'How do I stop money from controlling my mood?',
      'How do I move on from shame?',
      'How do I practice self-compassion?',
      'How do I manage stress about money?',
    ],
    schemaAnswer:
      'Reduce debt shame by breaking secrecy, treating debt as a solvable problem, building a concrete plan with qualified support, and separating worth from financial circumstances.',
    themes: ['Debt shame', 'Financial stress', 'Self-worth', 'Help-seeking'],
    notes: 'No specific repayment or legal advice; encourage nonprofit credit counseling.',
  }),
  'how-do-i-stop-losing-myself-in-romantic-relationsh-186602-015': draft({
    question: 'How do I stop losing myself in romantic relationships?',
    slug: 'how-do-i-stop-losing-myself-in-romantic-relationsh-186602-015',
    category: 'Attachment Styles & Relationship Dynamics',
    title: 'Losing Yourself in Relationships',
    meta: 'Healthy love needs two whole people—maintain friendships, interests, and boundaries while building interdependence, not fusion.',
    summary:
      'Losing yourself in relationships often means abandoning friends, hobbies, and opinions to merge with a partner. Fusion feels like closeness but breeds resentment and loss of attraction. Interdependence—loving deeply while staying yourself—sustains healthier bonds.',
    takeaways: [
      'Losing yourself often reflects fear that love requires merging.',
      'Maintaining individual identity strengthens—not threatens—relationships.',
      'Healthy conflict and difference keep both people present.',
      'Codependence and fusion differ from genuine intimacy.',
    ],
    happening:
      'You may stop seeing friends, adopt all partner preferences, or silence your needs.\n\nEarly relationship intensity can mask gradual self-abandonment.',
    help:
      'Schedule regular time for friends and solo interests without guilt.\n\nPractice expressing authentic opinions even when they differ.\n\nNotice when you perform happiness or agreement to avoid friction.\n\nBuild self-knowledge through journaling or therapy outside the relationship.\n\nTreat maintaining your center as relationship maintenance—not selfishness.',
    support:
      `${SUPPORT}\n\nSeek couples or individual therapy if you repeatedly disappear in relationships or feel trapped in fusion dynamics.`,
    related: [
      'How do I maintain my identity in a relationship?',
      'How do I set boundaries in romantic relationships?',
      'How do I stop being so clingy in relationships?',
      'How do I manage attachment anxiety in relationships?',
      'How do I know if my relationship is healthy?',
    ],
    schemaAnswer:
      'Stop losing yourself in relationships by maintaining friendships and interests, expressing authentic needs, practicing healthy difference, and building interdependence instead of fusion.',
    themes: ['Identity in relationships', 'Codependency', 'Boundaries', 'Attachment'],
    flags: ['relationship_conflict'],
  }),
  'how-do-i-stop-money-from-controlling-my-181083-029': draft({
    question: 'How do I stop money from controlling my mood?',
    slug: 'how-do-i-stop-money-from-controlling-my-181083-029',
    category: 'Identity & Self-Worth',
    title: 'When Money Controls Your Mood',
    meta: 'Money swings mood because it signals security—create boundaries around checking accounts, separate worth from wealth, and address practical stress.',
    summary:
      'Money affects mood because it represents safety, freedom, and status. When finances are tight, anxiety and shame are understandable—but constant checking and catastrophizing amplify suffering. Separating self-worth from net worth and setting financial boundaries protects emotional stability.',
    takeaways: [
      'Money mood swings often reflect real security concerns—not weakness.',
      'Constant account checking can spike anxiety without solving problems.',
      'Self-worth and net worth are separate—confusing them hurts both.',
      'Practical steps plus emotional boundaries reduce mood hijacking.',
    ],
    happening:
      'A low balance or unexpected expense may ruin your day.\n\nChildhood scarcity or shame about money can wire finances to identity.',
    help:
      'Limit how often you check balances—scheduled reviews beat compulsive scrolling.\n\nSeparate practical tasks (budget, bills) from rumination spirals.\n\nPractice gratitude for non-financial sources of meaning and connection.\n\nAddress concrete financial stress with plans, not only worry.\n\nChallenge thoughts that equate bank balance with personal value.',
    support:
      `${SUPPORT}\n\nSeek therapy or financial counseling if money mood swings drive panic, depression, or relationship damage; this is general guidance, not financial advice.`,
    related: [
      'How do I stop feeling ashamed of my debt?',
      'How do I stop feeling overwhelmed by financial decisions?',
      'How do I separate my self-worth from my job title?',
      'How do I manage stress about money?',
      'How do I build self-esteem?',
    ],
    schemaAnswer:
      'Reduce money\'s control over mood by limiting compulsive checking, separating worth from wealth, addressing practical stress with plans, and building meaning beyond finances.',
    themes: ['Financial anxiety', 'Self-worth', 'Mood regulation', 'Scarcity mindset'],
  }),
  'how-do-i-stop-my-mind-from-racing-when-i-181083-044': draft({
    question: 'How do I stop my mind from racing when I try to sleep?',
    slug: 'how-do-i-stop-my-mind-from-racing-when-i-181083-044',
    category: 'Anxiety & Stress',
    title: 'Racing Mind at Bedtime',
    meta: 'Bedtime racing thoughts need an outlet—brain dumps, relaxation techniques, and wind-down routines signal your brain it is safe to rest.',
    summary:
      'A racing mind at bedtime often appears because quiet finally gives worries room to run. Without daytime distractions, tomorrow\'s tasks and today\'s regrets flood in. Externalizing thoughts, relaxing the body, and consistent wind-down rituals help signal sleep time.',
    takeaways: [
      'Racing thoughts at night often reflect unprocessed daytime stress.',
      'Brain dumps before bed reduce mental replay loops.',
      'Body relaxation helps the mind follow toward rest.',
      'Consistent sleep routines train the brain when to wind down.',
    ],
    happening:
      'You may lie awake replaying conversations or planning tomorrow endlessly.\n\nAnxiety and caffeine can keep the mind alert when the body needs rest.',
    help:
      'Spend ten minutes writing worries and tomorrow\'s top tasks before bed.\n\nTry progressive muscle relaxation or slow breathing.\n\nUse neutral audio—guided sleep meditation or calm podcasts.\n\nKeep a consistent bedtime and reduce evening caffeine and screens.\n\nIf awake long, get up briefly for a quiet activity rather than forcing sleep.',
    support:
      `${SUPPORT}\n\nSeek medical or mental health evaluation if insomnia persists most nights or affects daily functioning.`,
    related: [
      'How do I improve my sleep when anxiety keeps me awake?',
      'How do I reduce anxiety before bed?',
      'How do I stop ruminating at night?',
      'How do I stop checking my phone when I cannot sleep?',
      'How do I stop overthinking everything?',
    ],
    schemaAnswer:
      'Quiet a racing mind at bedtime with brain dumps, relaxation techniques, calming audio, consistent wind-down routines, and reduced evening stimulation.',
    themes: ['Insomnia', 'Rumination', 'Sleep hygiene', 'Anxiety'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-stop-my-perfectionism-from-ruining-my-lif-187459-011': draft({
    question: 'How do I stop my perfectionism from ruining my life and relationships?',
    slug: 'how-do-i-stop-my-perfectionism-from-ruining-my-lif-187459-011',
    category: 'Perfectionism & Control Issues',
    title: 'Perfectionism Ruining Life and Relationships',
    meta: 'Perfectionism driven by fear of failure damages work and love—practice good enough, self-compassion, and honest communication about standards.',
    summary:
      'Perfectionism often protects against judgment and rejection—but paralyzes action, fuels anxiety, and damages relationships through impossible standards. Shifting from flawless outcomes to progress, self-compassion, and realistic expectations loosens its grip on your life and connections.',
    takeaways: [
      'Perfectionism usually fears failure or rejection—not pursues excellence.',
      'Good enough often achieves more than paralysis waiting for perfect.',
      'Harsh standards toward yourself often spill onto partners and colleagues.',
      'Self-compassion supports change better than self-attack.',
    ],
    happening:
      'You may delay starting, overwork details, or criticize others when they fall short.\n\nRelationships suffer when love feels conditional on flawless performance.',
    help:
      'Challenge all-or-nothing thinking—mistakes are normal, not identity verdicts.\n\nPractice intentional imperfection in low-stakes tasks.\n\nCommunicate fears with partners instead of criticizing from anxiety.\n\nCelebrate progress and completion, not only flawless results.\n\nSet time limits on tasks to prevent endless polishing.',
    support:
      `${SUPPORT}\n\nSeek therapy if perfectionism drives burnout, relationship breakdown, or severe anxiety.`,
    related: [
      'How do I overcome perfectionism?',
      'How do I stop being so hard on myself?',
      'How do I practice self-compassion?',
      'How do I stop feeling like I need to prove myself constantly?',
      'How do I improve communication with my partner?',
    ],
    schemaAnswer:
      'Reduce perfectionism\'s damage by practicing good-enough output, self-compassion, intentional imperfection, honest communication in relationships, and progress over flawless outcomes.',
    themes: ['Perfectionism', 'Relationships', 'Self-compassion', 'Fear of failure'],
  }),
  'how-do-i-stop-myself-from-saying-hurtful-things-wh-186602-002': draft({
    question: "How do I stop myself from saying hurtful things when I'm angry?",
    slug: 'how-do-i-stop-myself-from-saying-hurtful-things-wh-186602-002',
    category: 'Anger & Emotional Regulation',
    title: 'Hurtful Words When Angry',
    meta: 'Pause before speaking when angry—create space between feeling and words, use I-statements, and repair quickly when you slip.',
    summary:
      'Anger can hijack rational speech, making hurtful words feel urgent in the moment and regrettable afterward. Creating pause, expressing underlying needs with I-statements, and repairing damage quickly build healthier conflict patterns over time.',
    takeaways: [
      'Anger is information about needs and boundaries—not a command to attack.',
      'Pause space between feeling and speaking prevents many regrets.',
      'I-statements express hurt without character attacks.',
      'Repair after slip-ups matters as much as prevention.',
    ],
    happening:
      'You may snap, sarcasm, or say things you cannot take back when activated.\n\nPast environments where anger was unsafe or modeled harshly can intensify reactions.',
    help:
      'Practice counting, breathing, or leaving the room before responding.\n\nUse a 24-hour rule for important conversations when still heated.\n\nExpress needs: "I feel unheard when..." instead of "You always..."\n\nWhen you slip, apologize specifically for words—not for feeling angry.\n\nIdentify triggers and underlying needs beneath the sharp comments.',
    support:
      `${SUPPORT}\n\nSeek therapy if anger drives relationship damage, violence, or you fear losing control; call 988 if you feel unsafe.`,
    related: [
      'How do I manage anger in healthy ways?',
      'How do I stop being afraid of conflict in relationships?',
      'How do I communicate my needs in a relationship?',
      'How do I repair trust after hurting someone?',
      'How do I regulate my emotions during arguments?',
    ],
    schemaAnswer:
      'Stop saying hurtful things when angry by pausing before speaking, using I-statements, taking breaks during heated moments, and repairing specifically when you slip.',
    themes: ['Anger management', 'Emotional regulation', 'Communication', 'Conflict'],
    flags: ['relationship_conflict'],
  }),
  'how-do-i-stop-obsessing-over-health-symptoms': draft({
    question: 'How do I stop obsessing over health symptoms?',
    slug: 'how-do-i-stop-obsessing-over-health-symptoms',
    category: 'Anxiety & Stress',
    title: 'Obsessing Over Health Symptoms',
    meta: 'Health anxiety turns normal sensations into catastrophe—limit reassurance seeking and Dr. Google, and seek appropriate care without compulsive checking.',
    summary:
      'Health anxiety interprets ordinary bodily sensations as proof of serious illness. Reassurance seeking and internet searching briefly calm fear but reinforce the cycle. Appropriate medical care paired with anxiety treatment—not endless checking—helps you regain balance.',
    takeaways: [
      'Health anxiety misreads normal sensations as dangerous signals.',
      'Reassurance seeking provides short relief but strengthens the cycle.',
      'Internet searching often worsens fear with worst-case scenarios.',
      'Appropriate medical evaluation plus anxiety treatment helps most.',
    ],
    happening:
      'You may scan your body constantly, seek repeated tests, or panic over minor changes.\n\nEach check temporarily soothes then spikes anxiety when doubt returns.',
    help:
      'Limit body scanning and scheduled worry time instead of all-day monitoring.\n\nAvoid symptom Googling—use trusted sources only with clinician guidance.\n\nGet appropriate medical evaluation once, then follow clinician advice.\n\nChallenge catastrophic thoughts with evidence and alternative explanations.\n\nEngage in activities that absorb attention away from symptom focus.',
    support:
      `${SUPPORT}\n\nSeek therapy for health anxiety if obsessions impair daily life; get urgent care for genuine emergency symptoms—not as reassurance ritual.`,
    related: [
      'How do I cope with health anxiety?',
      'How do I stop catastrophizing every small problem?',
      'How do I manage anxiety without medication?',
      'How do I stop overthinking everything?',
      'How do I reduce reassurance-seeking behaviors?',
    ],
    schemaAnswer:
      'Reduce health symptom obsession by limiting scanning and Googling, getting appropriate medical evaluation without repeated reassurance rituals, challenging catastrophic thoughts, and seeking anxiety treatment.',
    themes: ['Health anxiety', 'Reassurance seeking', 'Catastrophizing', 'Body scanning'],
    refs: [ANXIETY, NIMH],
    notes: 'No self-diagnosis; encourage appropriate medical care without reinforcing compulsive checking.',
  }),
  'how-do-i-stop-overthinking-every-conversation-i-have': draft({
    question: 'How do I stop overthinking every conversation I have?',
    slug: 'how-do-i-stop-overthinking-every-conversation-i-have',
    category: 'Anxiety & Worry',
    title: 'Overthinking Every Conversation',
    meta: 'Post-conversation replay often reflects social anxiety—remember the spotlight effect and redirect rumination with self-compassion.',
    summary:
      'Replaying every word and expression after conversations exhausts you and rarely produces useful insights. Social anxiety and fear of judgment drive the loop. Most people forget your awkward moments quickly—redirecting attention and practicing self-compassion breaks the cycle.',
    takeaways: [
      'Post-conversation replay rarely improves future interactions.',
      'The spotlight effect overestimates how much others notice you.',
      'Social anxiety drives hyper-analysis of neutral cues.',
      'Redirecting attention beats arguing with every replay thought.',
    ],
    happening:
      'You may analyze tone, word choice, and facial expressions for hours after talking.\n\nEarly experiences where social errors had high stakes can wire hypervigilance.',
    help:
      'Label overthinking when it starts—"I am replaying, not problem-solving."\n\nAsk whether this thought is helpful or just anxious habit.\n\nUse the 24-hour rule: if it still matters tomorrow, address it then.\n\nPractice self-compassion—perfect communication does not exist.\n\nEngage in absorbing activities to interrupt rumination loops.',
    support:
      `${SUPPORT}\n\nSeek therapy for social anxiety if replay prevents sleep, work, or social participation.`,
    related: [
      'How do I stop overthinking everything I say and do?',
      'How do I manage social anxiety?',
      'How do I stop feeling like everyone is judging me?',
      'How do I stop caring so much about what others think of me?',
      'How do I challenge negative thought patterns?',
    ],
    schemaAnswer:
      'Stop overthinking conversations by labeling rumination, applying the spotlight effect, using the 24-hour rule, practicing self-compassion, and redirecting to absorbing activities.',
    themes: ['Social anxiety', 'Rumination', 'Spotlight effect', 'Self-compassion'],
    refs: [ANXIETY, NIMH],
    notes: 'Anxiety & Worry category slug; distinct framing from stress-category duplicate.',
  }),
  'how-do-i-stop-overthinking-every-conversation-i-have-e5f6g7': draft({
    question: 'How do I stop overthinking every conversation I have?',
    slug: 'how-do-i-stop-overthinking-every-conversation-i-have-e5f6g7',
    category: 'Anxiety & Stress',
    title: 'Breaking the Conversation Overthinking Loop',
    meta: 'Conversation overthinking feeds on social fear—catch the loop early, challenge assumptions, and accept normal social imperfection.',
    summary:
      'Overthinking conversations traps you in endless replay of words, pauses, and imagined judgments. The loop feeds social anxiety and perfectionism. Catching the habit early, questioning assumptions about what others think, and accepting normal social clumsiness frees mental energy.',
    takeaways: [
      'Overthinking conversations is a habit—not accurate social analysis.',
      'Most people are focused on themselves, not auditing your words.',
      'Mindfulness redirects attention from replay to the present.',
      'Accepting minor awkwardness reduces future overthinking fuel.',
    ],
    happening:
      'A brief pause or awkward phrase may launch hours of mental review.\n\nPerfectionism makes every interaction feel like a performance test.',
    help:
      'Catch yourself replaying and ask: "Is this solving anything?"\n\nChallenge assumptions—what evidence shows they are upset or judging?\n\nPractice mindfulness to return attention to current activity.\n\nAccept that awkward moments happen to everyone and are usually forgotten.\n\nLimit post-social debrief spirals with a timed worry window.',
    support:
      `${SUPPORT}\n\nSeek therapy if conversation overthinking drives isolation, insomnia, or severe social avoidance.`,
    related: [
      'How do I stop overthinking every conversation I have?',
      'How do I stop overthinking everything?',
      'How do I build confidence in social situations?',
      'How do I stop being so sensitive to criticism?',
      'How do I manage anxiety without medication?',
    ],
    schemaAnswer:
      'Break conversation overthinking by catching the loop early, challenging assumptions about others\' thoughts, practicing mindfulness, accepting normal awkwardness, and limiting rumination time.',
    themes: ['Overthinking', 'Social anxiety', 'Mindfulness', 'Perfectionism'],
    refs: [ANXIETY, NIMH],
    notes: 'Anxiety & Stress category duplicate slug; emphasize loop-breaking and mindfulness framing.',
  }),
  'how-do-i-stop-overthinking-everything': draft({
    question: 'How do I stop overthinking everything?',
    slug: 'how-do-i-stop-overthinking-everything',
    category: 'General Mental Health',
    title: 'Overthinking Everything',
    meta: 'Chronic overthinking fuels anxiety and paralysis—worry windows, grounding, and action limits break the rumination cycle.',
    summary:
      'Overthinking everything—decisions, conversations, futures—consumes energy without producing clarity. Rumination feels like problem-solving but rarely resolves anything. Structured worry time, grounding, and action limits redirect mental energy toward the present and what you can control.',
    takeaways: [
      'Overthinking mimics problem-solving but rarely reaches resolution.',
      'Scheduled worry time contains rumination instead of all-day spirals.',
      'Grounding techniques interrupt mental loops.',
      'Action limits on decisions prevent endless analysis.',
    ],
    happening:
      'You may analyze every angle without deciding, imagine worst cases repeatedly, or feel mentally exhausted from constant replay.\n\nAnxiety and depression both amplify rumination.',
    help:
      'Set a daily 15-minute worry window; redirect outside it.\n\nUse 5-4-3-2-1 grounding when spiraling.\n\nApply the two-minute rule: act on what takes under two minutes.\n\nAsk: Is this thought helpful? Can I control this?\n\nEngage in flow activities—exercise, music, cooking—that demand full attention.',
    support:
      `${SUPPORT}\n\nSeek therapy if overthinking drives panic, depression, insomnia, or inability to make basic decisions.`,
    related: [
      'How do I stop overthinking everything I say and do?',
      'How do I stop overthinking every conversation I have?',
      'How do I manage anxiety without medication?',
      'How do I challenge negative thought patterns?',
      'How do I stop catastrophizing every small problem?',
    ],
    schemaAnswer:
      'Stop overthinking everything with scheduled worry time, grounding techniques, action on small decisions, helpfulness checks on thoughts, and absorbing activities that break rumination.',
    themes: ['Rumination', 'Anxiety', 'Decision paralysis', 'Grounding'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-stop-overthinking-everything-i-say-and-184730-036': draft({
    question: 'How do I stop overthinking everything I say and do?',
    slug: 'how-do-i-stop-overthinking-everything-i-say-and-184730-036',
    category: 'Anxiety & Stress',
    title: 'Overthinking Everything You Say and Do',
    meta: 'Self-monitoring every word and action reflects social anxiety and perfectionism—stay present, accept imperfection, and limit post-event replay.',
    summary:
      'Overthinking everything you say and do keeps you performing instead of connecting. Social anxiety and perfectionism drive hypervigilant self-monitoring that makes interactions harder. Presence, acceptance of imperfection, and limits on replay reduce the exhausting inner critic.',
    takeaways: [
      'Hyper self-monitoring makes you appear more awkward, not less.',
      'Authentic connection beats flawless performance in relationships.',
      'Perfectionism treats every social moment as a test.',
      'Present-moment focus reduces post-event rumination.',
    ],
    happening:
      'You may replay emails, texts, and conversations searching for mistakes.\n\nFear of judgment keeps you editing yourself in real time.',
    help:
      'Focus on listening during conversations instead of monitoring yourself.\n\nPractice delivering good-enough responses without post-editing.\n\nUse the 24-hour rule before revisiting minor social concerns.\n\nChallenge thoughts that others analyze you as closely as you do.\n\nBuild tolerance for imperfection through small intentional mistakes.',
    support:
      `${SUPPORT}\n\nSeek therapy for social anxiety if self-monitoring prevents authentic connection or daily functioning.`,
    related: [
      'How do I stop overthinking every conversation I have?',
      'How do I stop feeling like everyone is judging me?',
      'How do I overcome perfectionism?',
      'How do I build confidence in social situations?',
      'How do I stop caring so much about what others think of me?',
    ],
    schemaAnswer:
      'Reduce overthinking what you say and do by staying present in conversations, accepting good-enough responses, limiting replay with the 24-hour rule, and building tolerance for social imperfection.',
    themes: ['Social anxiety', 'Self-monitoring', 'Perfectionism', 'Presence'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-stop-people-pleasing-177941-007': draft({
    question: 'How do I stop people-pleasing?',
    slug: 'how-do-i-stop-people-pleasing-177941-007',
    category: 'Relationships',
    title: 'Stopping People-Pleasing',
    meta: 'People-pleasing sacrifices your needs for approval—practice brief nos, tolerate disappointment, and build worth beyond others\' reactions.',
    summary:
      'People-pleasing prioritizes others\' comfort over your own until resentment and exhaustion take over. It often developed when love felt conditional on being helpful or agreeable. Authentic relationships require boundaries, honest nos, and self-worth that does not depend on universal approval.',
    takeaways: [
      'People-pleasing often stems from fear of rejection—not genuine kindness.',
      'You cannot control whether everyone likes you—and trying exhausts you.',
      'Brief nos without over-explaining are complete sentences.',
      'Healthy relationships survive mutual disappointment.',
    ],
    happening:
      'You may say yes when you mean no, avoid conflict, or constantly monitor others\' moods.\n\nResentment builds when your needs stay permanently last.',
    help:
      'Practice saying no to small requests to build tolerance.\n\nUse warm but firm language without lengthy justification.\n\nTolerate others\' disappointment without rushing to fix their feelings.\n\nDistinguish chosen kindness from fear-driven compliance.\n\nInvest in relationships where reciprocity and authenticity matter.',
    support:
      `${SUPPORT}\n\nSeek therapy if people-pleasing stems from trauma, abuse history, or prevents basic self-protection.`,
    related: [
      'How do I stop being a people pleaser?',
      'How do I set boundaries without feeling guilty?',
      'How do I stop feeling like I need everyone to like me?',
      'How do I stop feeling guilty about setting boundaries?',
      'How do I communicate my needs in a relationship?',
    ],
    schemaAnswer:
      'Stop people-pleasing by practicing brief nos, tolerating disappointment, distinguishing kindness from fear, and building self-worth independent of others\' approval.',
    themes: ['People-pleasing', 'Boundaries', 'Approval seeking', 'Relationships'],
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
  'reports/enrichment-corpus/draft-answers/batch-23-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-23-drafts.json`);
