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
const SAMHSA = {
  title: 'Find Treatment',
  url: 'https://www.samhsa.gov/find-treatment',
  publisher: 'SAMHSA',
  note: 'Supports locating substance use and mental health treatment resources.',
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
  readFileSync('reports/enrichment-corpus/batches/batch-25-input.json', 'utf8'),
);

const contentBySlug = {
  'what-is-quiet-quitting-and-is-it-a-bad-t-185759-038': draft({
    question: 'What is quiet quitting and is it a bad thing?',
    slug: 'what-is-quiet-quitting-and-is-it-a-bad-t-185759-038',
    category: 'Work, Stress & Burnout',
    title: 'Quiet Quitting Explained',
    meta: 'Quiet quitting means doing your job as defined without unpaid extra work—often a boundary response to burnout, not laziness or disloyalty.',
    summary:
      'Quiet quitting means fulfilling your job responsibilities without constantly going above and beyond unpaid. It is often a response to burnout and unrealistic expectations. It is not necessarily bad—it can protect wellbeing and signal the need for sustainable workloads.',
    takeaways: [
      'Quiet quitting is about boundaries—not doing the bare minimum on core duties.',
      'It often reflects burnout and unpaid overtime culture.',
      'Employers may mislabel it; workers may be reclaiming work-life balance.',
      'Sustainable performance requires realistic expectations on both sides.',
    ],
    happening:
      'You may feel exhausted by the expectation to always exceed your role without compensation.\n\nBurnout and resentment can build when extra effort is treated as the default.',
    help:
      'Clarify your actual job description versus informal extras you have absorbed.\n\nSet boundaries on after-hours availability and scope creep.\n\nDiscuss workload with your manager using specific examples.\n\nProtect recovery time outside work to prevent deeper burnout.\n\nDistinguish healthy boundaries from disengagement that harms your reputation unfairly.\n\nPlan career moves if the culture requires unsustainable sacrifice.',
    support:
      `${SUPPORT}\n\nSeek therapy or employee assistance if burnout drives depression, substance use, or inability to function at work.`,
    related: [
      'What are the signs of burnout and how do I recover?',
      'How do I set boundaries at work?',
      'Is it normal to dread going to work every day?',
      'How do I know when to quit my job for my mental health?',
      'How do I stop bringing work stress home?',
    ],
    schemaAnswer:
      'Quiet quitting means doing your defined job without unpaid extra work—often a healthy boundary response to burnout, not necessarily a bad thing.',
    themes: ['Quiet quitting', 'Burnout', 'Work boundaries', 'Work-life balance'],
    refs: [BURNOUT, NIMH],
  }),
  'what-is-seasonal-depression-and-how-is-it-treated': draft({
    question: 'What is seasonal depression and how is it treated?',
    slug: 'what-is-seasonal-depression-and-how-is-it-treated',
    category: 'Depression',
    title: 'Seasonal Depression Treatment',
    meta: 'Seasonal affective disorder (SAD) is depression tied to seasons—often winter—with treatment including light therapy, therapy, lifestyle changes, and sometimes medication.',
    summary:
      'Seasonal depression, or seasonal affective disorder (SAD), is depression that follows a seasonal pattern—most often worsening in fall and winter when daylight decreases. Treatment includes light therapy, psychotherapy, lifestyle adjustments, and sometimes antidepressants.',
    takeaways: [
      'SAD typically worsens in darker months and improves in spring or summer.',
      'Light therapy is a first-line treatment for many people with winter-pattern SAD.',
      'Symptoms overlap with major depression: low mood, fatigue, sleep changes.',
      'Professional evaluation distinguishes SAD from other depression causes.',
    ],
    happening:
      'Shorter days may bring persistent low mood, oversleeping, carb cravings, and social withdrawal.\n\nYou may feel fine in summer but dread winter each year.',
    help:
      'Use a 10,000-lux light box for 20–30 minutes each morning per clinical guidance.\n\nMaintain regular sleep and wake times despite shorter days.\n\nGet outdoor daylight even on cloudy days.\n\nStay physically active and connected socially.\n\nTrack symptoms across seasons to confirm the pattern.\n\nDiscuss antidepressants with a prescriber if symptoms are moderate to severe.',
    support:
      `${SUPPORT}\n\nSeek evaluation if seasonal mood changes impair work, relationships, or include suicidal thoughts.`,
    related: [
      'What should I do about seasonal depression?',
      'How do I know if I am depressed?',
      'How do I improve my sleep quality?',
      'How do I manage depression without medication?',
      'How do I find a therapist for depression?',
    ],
    schemaAnswer:
      'Seasonal depression (SAD) is depression linked to seasons—treat with light therapy, therapy, lifestyle changes, and sometimes medication after professional evaluation.',
    themes: ['Seasonal affective disorder', 'Depression', 'Light therapy', 'Winter blues'],
    refs: [DEPRESSION, NIMH],
  }),
  'what-is-social-anxiety-and-how-do-i-overcome-it': draft({
    question: 'What is social anxiety and how do I overcome it?',
    slug: 'what-is-social-anxiety-and-how-do-i-overcome-it',
    category: 'Anxiety & Stress',
    title: 'Social Anxiety and How to Overcome It',
    meta: 'Social anxiety disorder is intense fear of judgment in social situations—overcome it with gradual exposure, cognitive strategies, and often therapy.',
    summary:
      'Social anxiety disorder involves intense fear of being judged, embarrassed, or rejected in social situations. It goes beyond ordinary shyness and can limit work, friendships, and daily activities. Treatment typically includes cognitive behavioral therapy, gradual exposure, and sometimes medication.',
    takeaways: [
      'Social anxiety is more than shyness—it causes significant distress and avoidance.',
      'Fear of negative evaluation drives most social anxiety symptoms.',
      'Gradual exposure and CBT are evidence-based treatments.',
      'Avoidance temporarily relieves anxiety but strengthens it long term.',
    ],
    happening:
      'You may rehearse conversations endlessly, avoid speaking up, or feel physically ill before social events.\n\nPost-event rumination about perceived mistakes can last for days.',
    help:
      'Start small exposures: eye contact, brief greetings, one question in a meeting.\n\nChallenge catastrophic predictions: "Everyone noticed" versus actual evidence.\n\nReduce safety behaviors like hiding behind your phone or over-preparing scripts.\n\nPractice self-compassion after awkward moments—they happen to everyone.\n\nWork with a therapist trained in exposure and CBT for social anxiety.\n\nConsider medication if anxiety blocks daily functioning despite other efforts.',
    support:
      `${SUPPORT}\n\nSeek therapy if social anxiety causes avoidance of school, work, or relationships, or fuels depression and isolation.`,
    related: [
      'How do I manage social anxiety?',
      'How do I stop caring so much about what others think?',
      'How do I build confidence in social situations?',
      'How do I stop overthinking every conversation?',
      'How do I make friends as an adult?',
    ],
    schemaAnswer:
      'Social anxiety is intense fear of judgment in social settings—overcome it with gradual exposure, CBT, self-compassion, and professional therapy when symptoms limit daily life.',
    themes: ['Social anxiety', 'Exposure therapy', 'CBT', 'Avoidance'],
    refs: [ANXIETY, NIMH],
  }),
  'what-is-the-connection-between-depression-and-chronic-pain': draft({
    question: 'What is the connection between depression and chronic pain?',
    slug: 'what-is-the-connection-between-depression-and-chronic-pain',
    category: 'Depression',
    title: 'Depression and Chronic Pain Link',
    meta: 'Depression and chronic pain share brain pathways and worsen each other—treating both together often works better than addressing either alone.',
    summary:
      'Depression and chronic pain are closely linked through shared neurological pathways. Pain can trigger or worsen depression; depression lowers pain tolerance and motivation for treatment. Addressing both conditions together typically improves outcomes more than treating either alone.',
    takeaways: [
      'The pain-depression relationship is bidirectional—not one causing the other only.',
      'Shared brain regions process mood and pain signals.',
      'Untreated depression can make pain feel more intense and hopeless.',
      'Integrated treatment plans target both physical and mental health.',
    ],
    happening:
      'Persistent pain may shrink your world, disrupt sleep, and fuel helplessness.\n\nDepression can reduce activity, which then increases stiffness and pain.',
    help:
      'Tell both your medical and mental health providers about pain and mood symptoms.\n\nPursue appropriate pain management without ignoring emotional health.\n\nUse gentle movement as tolerated—complete rest often worsens both conditions.\n\nPractice pacing: balance activity with recovery to avoid boom-bust cycles.\n\nConsider therapy approaches like CBT for pain and depression together.\n\nBuild small pleasurable activities even when pain limits options.',
    support:
      `${SUPPORT}\n\nSeek urgent care for new severe pain or suicidal thoughts; pursue integrated care when either condition significantly impairs daily life.`,
    related: [
      'How do I know if I am depressed?',
      'How do I cope with chronic illness and mental health?',
      'How do I improve my sleep when in pain?',
      'How do I stay active with chronic pain?',
      'How do I talk to my doctor about mental health?',
    ],
    schemaAnswer:
      'Depression and chronic pain worsen each other through shared brain pathways—treat both together with medical care, therapy, gentle movement, and integrated support.',
    themes: ['Chronic pain', 'Depression', 'Mind-body connection', 'Integrated care'],
    refs: [DEPRESSION, NIMH],
  }),
  'what-is-the-difference-between-mindfulness-and-meditation': draft({
    question: 'What is the difference between mindfulness and meditation?',
    slug: 'what-is-the-difference-between-mindfulness-and-meditation',
    category: 'General Mental Health',
    title: 'Mindfulness vs. Meditation',
    meta: 'Mindfulness is present-moment awareness you can practice anytime; meditation is a structured exercise that often builds mindfulness skills.',
    summary:
      'Mindfulness is the quality of paying attention to the present moment with openness and without judgment. Meditation is a formal practice—often sitting quietly—that cultivates mindfulness. You can be mindful while walking or eating; meditation is usually a dedicated exercise.',
    takeaways: [
      'Mindfulness is a state of awareness; meditation is a practice that builds it.',
      'You can be mindful informally throughout the day.',
      'Many meditation styles exist: breath focus, body scan, loving-kindness.',
      'Both can reduce stress when practiced consistently.',
    ],
    happening:
      'Confusion arises because the terms are often used interchangeably in popular culture.\n\nYou may wonder which approach fits if sitting still feels impossible.',
    help:
      'Start with brief formal meditation: 3–5 minutes focusing on breath.\n\nPractice informal mindfulness during daily routines—eating, showering, walking.\n\nTry guided apps or recordings if self-direction is hard.\n\nNotice when the mind wanders and gently return—that is the practice.\n\nChoose forms that fit your temperament: movement meditation, body scans, or breath work.\n\nBe patient; benefits accumulate with regular short sessions.',
    support:
      `${SUPPORT}\n\nSeek therapy if meditation triggers panic, dissociation, or obsessive rumination rather than calm.`,
    related: [
      'How do I start a meditation practice?',
      'What are body scan meditations and how do they help?',
      'How do I calm my nervous system?',
      'How do I build a daily mindfulness habit?',
      'How do I start meditating when my mind will not stop?',
    ],
    schemaAnswer:
      'Mindfulness is present-moment awareness; meditation is a structured practice that builds mindfulness—both reduce stress with consistent short sessions.',
    themes: ['Mindfulness', 'Meditation', 'Stress relief', 'Self-awareness'],
  }),
  'what-is-treatment-resistant-depression-and-what-are-my-options': draft({
    question: 'What is treatment-resistant depression and what are my options?',
    slug: 'what-is-treatment-resistant-depression-and-what-are-my-options',
    category: 'Depression',
    title: 'Treatment-Resistant Depression Options',
    meta: 'Treatment-resistant depression means inadequate response to multiple antidepressant trials—options include medication changes, therapy, TMS, ECT, and specialized care.',
    summary:
      'Treatment-resistant depression (TRD) is typically diagnosed when depression does not respond adequately to at least two antidepressant trials at therapeutic doses for sufficient duration. Options include medication switches or augmentation, psychotherapy, transcranial magnetic stimulation (TMS), electroconvulsive therapy (ECT), and referral to specialists.',
    takeaways: [
      'TRD is defined by inadequate response to multiple adequate medication trials.',
      'Diagnosis accuracy and adherence should be reviewed before labeling TRD.',
      'Combination therapy and augmentation expand medication options.',
      'TMS and ECT are evidence-based for some treatment-resistant cases.',
    ],
    happening:
      'Repeated failed trials can feel hopeless and make you question whether recovery is possible.\n\nSide effects without benefit may erode trust in treatment altogether.',
    help:
      'Review diagnosis and medication history with a psychiatrist specialist.\n\nEnsure adequate trial length and dosing before switching.\n\nCombine evidence-based therapy (CBT, IPT) with medication.\n\nDiscuss augmentation strategies or different medication classes.\n\nAsk about TMS, ECT, or newer options if standard treatments fail.\n\nTrack symptoms weekly to give your team clear data.',
    support:
      `${SUPPORT}\n\nSeek urgent care for suicidal thoughts; pursue specialist referral if multiple treatments have failed and functioning is severely impaired.`,
    related: [
      'What should I do if antidepressants are not working for me?',
      'What if psychiatric medication does not work for me?',
      'How do I find a psychiatrist?',
      'How do I know if I am depressed?',
      'How do I talk to my doctor about mental health?',
    ],
    schemaAnswer:
      'Treatment-resistant depression means inadequate response to multiple antidepressant trials—options include medication changes, therapy, TMS, ECT, and specialist referral.',
    themes: ['Treatment-resistant depression', 'Medication', 'TMS', 'Specialist care'],
    refs: [DEPRESSION, NIMH],
    notes: 'No prescribing advice; reinforce prescriber collaboration.',
  }),
  'what-is-workplace-anxiety-and-how-do-i-m-186032-041': draft({
    question: 'What is workplace anxiety and how do I manage it?',
    slug: 'what-is-workplace-anxiety-and-how-do-i-m-186032-041',
    category: 'Work, Stress & Burnout',
    title: 'Workplace Anxiety Management',
    meta: 'Workplace anxiety is excessive worry about job performance or situations—manage it with preparation, boundaries, coping skills, and professional support.',
    summary:
      'Workplace anxiety involves persistent worry about performance, meetings, criticism, or job security. It can cause physical symptoms, avoidance, and impaired focus. Management includes preparation, stress reduction techniques, boundary-setting, and therapy when symptoms persist.',
    takeaways: [
      'Workplace anxiety often centers on evaluation, mistakes, or conflict.',
      'Avoidance of meetings or tasks usually worsens anxiety over time.',
      'Preparation and grounding reduce acute spikes before stressful events.',
      'Chronic workplace anxiety may signal burnout or a poor job fit.',
    ],
    happening:
      'Sunday dread, sleepless nights before presentations, or constant fear of being "found out" may dominate your week.\n\nPerfectionism and imposter feelings often fuel workplace anxiety.',
    help:
      'Prepare realistically for meetings—agenda, talking points, not flawless scripts.\n\nUse breathing and grounding before high-anxiety moments.\n\nLimit after-hours rumination with a worry window or written brain dump.\n\nSet boundaries on availability and scope to reduce overload.\n\nChallenge catastrophic predictions with evidence from past performance.\n\nSeek therapy for CBT or exposure if anxiety limits career growth.',
    support:
      `${SUPPORT}\n\nSeek therapy if workplace anxiety drives panic attacks, avoidance of essential duties, or depression—and EAP resources if available.`,
    related: [
      'How do I manage stress at work?',
      'How do I cope with imposter syndrome?',
      'How do I set boundaries at work?',
      'What are the signs of burnout and how do I recover?',
      'How do I stop overthinking at work?',
    ],
    schemaAnswer:
      'Workplace anxiety is excessive job-related worry—manage with preparation, grounding, boundaries, and therapy when symptoms persist or limit performance.',
    themes: ['Workplace anxiety', 'Performance anxiety', 'Burnout', 'Coping skills'],
    refs: [ANXIETY, BURNOUT],
  }),
  'what-role-does-exercise-play-in-treating-depression': draft({
    question: 'What role does exercise play in treating depression?',
    slug: 'what-role-does-exercise-play-in-treating-depression',
    category: 'Depression',
    title: 'Exercise for Depression',
    meta: 'Exercise can reduce depression symptoms through mood-regulating brain effects—often helpful alone for mild cases and as an adjunct to therapy or medication.',
    summary:
      'Exercise plays a meaningful role in treating depression. Physical activity releases endorphins, improves sleep, and reduces inflammation linked to mood. Research shows exercise can be as effective as medication for some people with mild to moderate depression, and it complements therapy and medication for more severe cases.',
    takeaways: [
      'Regular exercise can improve mood through multiple biological pathways.',
      'Even moderate activity—walking 30 minutes most days—shows benefits.',
      'Exercise works best as part of a broader treatment plan for moderate to severe depression.',
      'Start small; consistency matters more than intensity when motivation is low.',
    ],
    happening:
      'Depression often reduces energy and motivation, making exercise feel impossible.\n\nAll-or-nothing thinking may stop you from trying a five-minute walk.',
    help:
      'Start with tiny goals: a 10-minute walk, stretching, or one flight of stairs.\n\nSchedule movement like an appointment—not only when you feel like it.\n\nChoose activities you tolerate: dancing, gardening, swimming, not just gyms.\n\nPair exercise with social connection when isolation worsens mood.\n\nTrack mood before and after to notice patterns.\n\nCombine with therapy or medication rather than replacing care for severe symptoms.',
    support:
      `${SUPPORT}\n\nSeek professional care if depression includes suicidal thoughts, severe functional impairment, or inability to start any self-care despite support.`,
    related: [
      'How do I exercise when I am depressed?',
      'How do I know if I am depressed?',
      'How do I improve my sleep quality?',
      'How do I manage depression without medication?',
      'How do I build healthy habits when motivation is low?',
    ],
    schemaAnswer:
      'Exercise helps treat depression through mood-regulating brain effects—start small, stay consistent, and combine with therapy or medication for moderate to severe symptoms.',
    themes: ['Exercise', 'Depression', 'Self-care', 'Behavioral activation'],
    refs: [DEPRESSION, CDC],
  }),
  'what-should-i-do-about-seasonal-depression': draft({
    question: 'What should I do about seasonal depression?',
    slug: 'what-should-i-do-about-seasonal-depression',
    category: 'Depression',
    title: 'What to Do About Seasonal Depression',
    meta: 'For seasonal depression, try morning light therapy, consistent sleep, outdoor daylight, exercise, and professional help if symptoms are severe.',
    summary:
      'If you experience seasonal depression, start with morning light therapy using a 10,000-lux light box, maintain regular sleep schedules, get outdoor daylight, stay active, and stay connected socially. Seek professional evaluation if symptoms significantly impair daily life or include suicidal thoughts.',
    takeaways: [
      'Light therapy is often the first step for winter-pattern seasonal depression.',
      'Regular sleep and morning light exposure help regulate circadian rhythm.',
      'Social withdrawal worsens seasonal mood—maintain connection intentionally.',
      'Professional treatment may include therapy and antidepressants for moderate to severe SAD.',
    ],
    happening:
      'Each fall you may feel your energy drain, sleep increase, and motivation disappear.\n\nYou might blame yourself for "laziness" when biology and light exposure are involved.',
    help:
      'Begin light box use in early fall before symptoms peak.\n\nWake at a consistent time and get light within an hour of waking.\n\nPlan social and outdoor activities before winter isolation sets in.\n\nReduce alcohol, which worsens sleep and mood.\n\nTrack symptoms to distinguish seasonal patterns from year-round depression.\n\nSee a provider if self-care steps are insufficient.',
    support:
      `${SUPPORT}\n\nSeek evaluation if seasonal depression impairs work or relationships, or if you have thoughts of self-harm.`,
    related: [
      'What is seasonal depression and how is it treated?',
      'How do I know if I am depressed?',
      'How do I improve my sleep quality?',
      'How do I find a therapist for depression?',
      'How do I stay motivated in winter?',
    ],
    schemaAnswer:
      'For seasonal depression, use morning light therapy, consistent sleep, outdoor daylight, exercise, social connection, and professional help if symptoms are severe.',
    themes: ['Seasonal depression', 'Light therapy', 'Self-care', 'Winter blues'],
    refs: [DEPRESSION, NIMH],
  }),
  'what-should-i-do-during-a-panic-attack': draft({
    question: 'What should I do during a panic attack?',
    slug: 'what-should-i-do-during-a-panic-attack',
    category: 'Anxiety & Stress',
    title: 'What to Do During a Panic Attack',
    meta: 'During a panic attack, remember it will pass—slow breathing, grounding, and reassuring self-talk reduce intensity; seek care if symptoms mimic medical emergencies.',
    summary:
      'During a panic attack, remind yourself the episode will pass even though it feels terrifying. Slow your breathing, use 5-4-3-2-1 grounding, loosen tight clothing, and avoid fleeing unless safety requires it. Seek medical evaluation once if chest pain is new or unexplained.',
    takeaways: [
      'Panic attacks peak and subside— they feel endless but are time-limited.',
      'Slow exhales activate the calming nervous system.',
      'Grounding redirects attention from catastrophic thoughts to the present.',
      'Avoidance after attacks can lead to agoraphobia if unchecked.',
    ],
    happening:
      'Racing heart, shortness of breath, dizziness, and fear of dying or losing control may overwhelm you.\n\nThe body\'s alarm system fires as if real danger exists when none is present.',
    help:
      'Say: "This is panic. It is uncomfortable, not dangerous. It will pass."\n\nBreathe slowly: longer exhale than inhale, 4–6 breaths per minute.\n\nGround with 5-4-3-2-1: see, touch, hear, smell, taste.\n\nStay where you are if safe—running away reinforces fear of the situation.\n\nSplash cold water or hold ice to stimulate the vagus nerve.\n\nAfterward, note triggers and consider therapy for recurring attacks.',
    support:
      `${SUPPORT}\n\nCall emergency services if chest pain is new or you cannot tell panic from a medical emergency; seek therapy if panic attacks are frequent or cause avoidance.`,
    related: [
      'How do I stop a panic attack?',
      'What are some quick techniques to calm anxiety in the moment?',
      'How do I manage agoraphobia?',
      'Why does anxiety make my chest feel tight?',
      'How do I find a therapist for anxiety?',
    ],
    schemaAnswer:
      'During a panic attack, remind yourself it will pass, use slow breathing and 5-4-3-2-1 grounding, and seek medical evaluation if chest pain is new or unexplained.',
    themes: ['Panic attacks', 'Grounding', 'Breathing', 'Anxiety'],
    refs: [ANXIETY, NIMH],
  }),
  'what-should-i-do-if-antidepressants-arent-working-for-me': draft({
    question: "What should I do if antidepressants aren't working for me?",
    slug: 'what-should-i-do-if-antidepressants-arent-working-for-me',
    category: 'Depression',
    title: 'When Antidepressants Are Not Working',
    meta: 'If antidepressants are not helping, review dose, duration, and diagnosis with your prescriber—switches, augmentation, and therapy expand options.',
    summary:
      'When antidepressants are not working, do not assume nothing will help. Review whether you had an adequate trial duration and dose, whether the diagnosis is accurate, and whether therapy is part of your plan. Your prescriber can adjust medications, add augmentation, or refer to specialists.',
    takeaways: [
      'Many people need more than one medication trial to find effective treatment.',
      'Adequate trials typically require weeks at therapeutic doses.',
      'Therapy plus medication often outperforms medication alone.',
      'Tracking symptoms weekly gives your prescriber useful data.',
    ],
    happening:
      'Weeks without relief can feel hopeless and make you want to stop trying.\n\nSide effects without benefits may erode trust in psychiatric care.',
    help:
      'Do not stop medication abruptly—talk to your prescriber first.\n\nTrack mood, sleep, energy, and side effects in a simple weekly log.\n\nAsk whether dose, duration, or diagnosis should be reassessed.\n\nDiscuss switching classes or adding augmentation strategies.\n\nAdd evidence-based therapy if you have relied on medication alone.\n\nRequest referral to a psychiatrist if your prescriber is not a specialist.',
    support:
      `${SUPPORT}\n\nSeek urgent care for suicidal thoughts or severe side effects; pursue specialist referral if multiple adequate trials fail.`,
    related: [
      'What if psychiatric medication does not work for me?',
      'What is treatment-resistant depression and what are my options?',
      'What if antidepressants change who I am?',
      'How do I talk to my doctor about mental health?',
      'How do I find a psychiatrist?',
    ],
    schemaAnswer:
      'If antidepressants are not working, review trial adequacy and diagnosis with your prescriber, add therapy, and explore switches, augmentation, or specialist referral.',
    themes: ['Antidepressants', 'Depression', 'Treatment navigation', 'Advocacy'],
    refs: [DEPRESSION, NIMH],
    notes: 'No prescribing advice; reinforce prescriber collaboration.',
  }),
  'what-should-i-do-if-i-cant-afford-regula-186032-043': draft({
    question: "What should I do if I can't afford regular therapy sessions?",
    slug: 'what-should-i-do-if-i-cant-afford-regula-186032-043',
    category: 'Therapy Navigation',
    title: 'Cannot Afford Regular Therapy',
    meta: 'If regular therapy is unaffordable, try sliding-scale providers, group therapy, EAP benefits, training clinics, and spacing sessions with homework between.',
    summary:
      'If you cannot afford regular therapy sessions, explore sliding-scale private therapists, community mental health centers, group therapy, employee assistance programs, university training clinics, and online platforms with reduced fees. Spacing sessions further apart with homework between can stretch limited budgets.',
    takeaways: [
      'Sliding-scale and community clinics exist in most regions.',
      'Group therapy costs less and helps many concerns.',
      'EAP benefits often provide free short-term sessions through employers.',
      'Biweekly sessions with between-session work can maintain progress.',
    ],
    happening:
      'Weekly therapy may feel financially impossible even when you know you need support.\n\nInsurance gaps, high deductibles, or lack of coverage may block access.',
    help:
      'Search Open Path Collective and community mental health centers locally.\n\nAsk therapists about sliding scale or reduced-fee slots.\n\nUse employer EAP benefits for initial sessions and referrals.\n\nTry group therapy for depression, anxiety, grief, or DBSA/NAMI groups.\n\nContact university psychology training clinics for supervised low-cost care.\n\nSpace sessions biweekly and use worksheets or apps between appointments.',
    support:
      `${SUPPORT}\n\nSeek crisis support (988) if symptoms include self-harm thoughts—help is available regardless of ability to pay for ongoing therapy.`,
    related: [
      'What if I cannot afford treatment or therapy?',
      'How do I find an affordable therapist?',
      'How do I find a therapist near me?',
      'How do I know if I need therapy?',
      'How do I make the most of therapy on a limited budget?',
    ],
    schemaAnswer:
      'If you cannot afford regular therapy, use sliding-scale providers, group therapy, EAP benefits, training clinics, and spaced sessions with homework between appointments.',
    themes: ['Affordability', 'Therapy access', 'Sliding scale', 'Resources'],
    refs: [SAMHSA, NIMH],
  }),
  'what-should-i-do-if-i-feel-like-i-cant-keep-up-with-technological-changes-at-work': draft({
    question: "What should I do if I feel like I can't keep up with technological changes at work?",
    slug: 'what-should-i-do-if-i-feel-like-i-cant-keep-up-with-technological-changes-at-work',
    category: 'Work & Life Balance',
    title: 'Keeping Up With Tech at Work',
    meta: 'Feeling behind on workplace technology is common—focus on job-critical skills, ask for training, and challenge shame about learning curves.',
    summary:
      'Feeling unable to keep up with technological changes at work is increasingly common. Focus on skills essential to your role rather than every new tool. Request training, learn incrementally, and separate normal learning curves from shame about not knowing everything.',
    takeaways: [
      'No one masters every new tool—prioritize what your role actually requires.',
      'Employers often provide training if you ask directly.',
      'Incremental learning beats cramming and reduces overwhelm.',
      'Anxiety about tech can worsen performance more than skill gaps alone.',
    ],
    happening:
      'New software rollouts, AI tools, and younger colleagues may make you feel obsolete overnight.\n\nFear of looking incompetent may stop you from asking questions.',
    help:
      'Identify the 2–3 tools most critical to your current role.\n\nRequest formal training or mentorship from IT or skilled colleagues.\n\nLearn in small blocks—one feature per day—not everything at once.\n\nDocument workflows you figure out for future reference.\n\nSeparate "I am learning" from "I am failing."\n\nDiscuss reasonable adaptation timelines with your manager if changes are rapid.',
    support:
      `${SUPPORT}\n\nSeek therapy if tech anxiety drives panic, avoidance of essential duties, or depression about your career future.`,
    related: [
      'What should I do if I feel like my skills are becoming obsolete?',
      'What should I do if I am afraid my job will be automated soon?',
      'How do I manage stress at work?',
      'How do I cope with imposter syndrome?',
      'How do I set boundaries at work?',
    ],
    schemaAnswer:
      'When you cannot keep up with workplace technology, prioritize job-critical skills, request training, learn incrementally, and challenge shame about normal learning curves.',
    themes: ['Technology anxiety', 'Workplace change', 'Upskilling', 'Career stress'],
    refs: [BURNOUT, NIMH],
  }),
  'what-should-i-do-if-i-feel-like-my-skills-are-becoming-obsolete': draft({
    question: 'What should I do if I feel like my skills are becoming obsolete?',
    slug: 'what-should-i-do-if-i-feel-like-my-skills-are-becoming-obsolete',
    category: 'General Mental Health',
    title: 'When Skills Feel Obsolete',
    meta: 'Fear of obsolete skills often reflects rapid industry change—assess transferable strengths, upskill strategically, and separate anxiety from facts.',
    summary:
      'Feeling your skills are becoming obsolete can trigger deep career anxiety. Assess which fears are realistic versus catastrophized. Identify transferable strengths, upskill in high-value areas, and build a network. Anxiety about obsolescence sometimes exceeds actual job risk.',
    takeaways: [
      'Transferable skills—communication, problem-solving—remain valuable across industries.',
      'Strategic upskilling beats panic-learning every trending tool.',
      'Networking reveals opportunities anxiety hides.',
      'Career identity can evolve without starting from zero.',
    ],
    happening:
      'Industry shifts, automation headlines, and layoffs may make your expertise feel worthless.\n\nComparison to younger workers or constant upskilling culture amplifies fear.',
    help:
      'List skills that transfer across roles—not only technical tools.\n\nResearch your field\'s actual demand for your experience level.\n\nChoose one upskilling path aligned with your goals, not every trend.\n\nUpdate your resume and LinkedIn to reflect current strengths.\n\nTalk with mentors or career counselors for grounded perspective.\n\nLimit doom-scrolling about AI and automation that fuels anxiety without action.',
    support:
      `${SUPPORT}\n\nSeek therapy if obsolescence fears drive chronic anxiety, depression, or paralysis in career planning.`,
    related: [
      'What should I do if I am afraid my job will be automated soon?',
      'What should I do if I feel like I cannot keep up with technological changes at work?',
      'How do I cope with career uncertainty?',
      'How do I deal with feeling like a failure?',
      'How do I stop comparing my life to others?',
    ],
    schemaAnswer:
      'When skills feel obsolete, assess transferable strengths, upskill strategically, build your network, and separate realistic industry change from catastrophized anxiety.',
    themes: ['Career anxiety', 'Upskilling', 'Obsolescence fear', 'Transferable skills'],
    refs: [BURNOUT, NIMH],
  }),
  'what-should-i-do-if-i-hate-my-job-but-ca-186032-038': draft({
    question: "What should I do if I hate my job but can't quit?",
    slug: 'what-should-i-do-if-i-hate-my-job-but-ca-186032-038',
    category: 'Work, Stress & Burnout',
    title: 'Hate Your Job but Cannot Quit',
    meta: 'When you cannot leave a hated job, protect mental health with boundaries, small meaning, skill-building, and an exit plan timeline.',
    summary:
      'If you hate your job but cannot quit yet, focus on what you can control: boundaries, small sources of meaning, skill development, and a concrete exit plan. Protect your mental health while you prepare financially and professionally for a transition.',
    takeaways: [
      'Feeling trapped amplifies misery—an exit plan restores agency.',
      'Boundaries prevent the job from consuming all recovery time.',
      'Skill-building during employment improves future options.',
      'Small meaning in daily tasks reduces all-or-nothing despair.',
    ],
    happening:
      'Financial obligations, visa status, or family needs may make quitting impossible right now.\n\nDread each morning can spill into evenings and weekends without boundaries.',
    help:
      'Set a realistic exit timeline with financial milestones.\n\nProtect non-work time fiercely—no unpaid emotional labor after hours.\n\nBuild skills or credentials that transfer to your next role.\n\nFind one small task or relationship at work that is tolerable.\n\nUse EAP or therapy to process burnout without quitting impulsively.\n\nNetwork quietly and update your resume before you are desperate.',
    support:
      `${SUPPORT}\n\nSeek therapy if job hatred drives depression, substance use, or suicidal thoughts—and urgent help if safety feels at risk.`,
    related: [
      'How do I know when to quit my job for my mental health?',
      'Is it normal to dread going to work every day?',
      'What are the signs of burnout and how do I recover?',
      'How do I set boundaries at work?',
      'How do I cope with a toxic workplace?',
    ],
    schemaAnswer:
      'If you hate your job but cannot quit, protect mental health with boundaries, small meaning, skill-building, and a concrete exit plan while you prepare to transition.',
    themes: ['Job dissatisfaction', 'Burnout', 'Exit planning', 'Boundaries'],
    refs: [BURNOUT, NIMH],
  }),
  'what-should-i-do-if-i-think-im-being-bul-185387-017': draft({
    question: "What should I do if I think I'm being bullied?",
    slug: 'what-should-i-do-if-i-think-im-being-bul-185387-017',
    category: 'Teens & Identity',
    title: 'If You Think You Are Being Bullied',
    meta: 'If you are being bullied, tell a trusted adult, document incidents, and know you do not deserve it—schools and workplaces have reporting processes.',
    summary:
      'If you think you are being bullied, tell a trusted adult immediately—parent, teacher, counselor, or supervisor. Document what happened with dates and witnesses. You do not have to handle bullying alone, and it is not your fault. Schools and workplaces have reporting processes.',
    takeaways: [
      'Bullying is repeated harmful behavior—not a single conflict or joke.',
      'Telling a trusted adult is the first step; secrecy helps the bully.',
      'Documentation strengthens reports to school or workplace authorities.',
      'You deserve safety; bullying reflects the bully\'s behavior, not your worth.',
    ],
    happening:
      'Bullying may happen in person, online, or through social exclusion and rumors.\n\nFear of retaliation or not being believed may keep you silent.',
    help:
      'Tell a parent, teacher, counselor, or trusted adult as soon as possible.\n\nSave screenshots, messages, and write down dates and witnesses.\n\nAvoid responding to provocation when safe—bullies often want a reaction.\n\nUse official reporting channels at school or work.\n\nStay connected with supportive friends rather than isolating.\n\nBlock or report online harassment on platforms.',
    support:
      `${SUPPORT}\n\nTell an adult immediately if bullying involves threats, physical harm, or suicidal thoughts—and call 988 or emergency services if you feel unsafe.`,
    related: [
      'How do I cope with cyberbullying?',
      'How do I deal with mean friends?',
      'How do I build self-esteem after being bullied?',
      'How do I report bullying at school?',
      'How do I support a friend who is being bullied?',
    ],
    schemaAnswer:
      'If you are being bullied, tell a trusted adult, document incidents, use official reporting channels, and remember you do not deserve it and are not alone.',
    themes: ['Bullying', 'Teens', 'Safety', 'Advocacy'],
    flags: ['youth-safety'],
  }),
  'what-should-i-do-if-i-think-my-child-has-anxiety': draft({
    question: 'What should I do if I think my child has anxiety?',
    slug: 'what-should-i-do-if-i-think-my-child-has-anxiety',
    category: 'Anxiety & Stress',
    title: 'When Your Child May Have Anxiety',
    meta: 'If your child shows persistent worry, avoidance, or physical symptoms, observe patterns, validate feelings, and seek professional evaluation when needed.',
    summary:
      'If you think your child has anxiety, observe patterns: excessive worry, avoidance of school or activities, sleep trouble, stomachaches, or irritability. Validate their feelings without dismissing fears. Seek a pediatrician or child therapist if symptoms persist and interfere with daily life.',
    takeaways: [
      'Childhood anxiety often shows as physical complaints or avoidance, not only worry.',
      'Validation helps more than "there is nothing to be afraid of."',
      'Gradual exposure with support beats forcing children through fear.',
      'Early professional help prevents anxiety from narrowing their world.',
    ],
    happening:
      'Your child may refuse school, cling excessively, have meltdowns before events, or complain of headaches and stomach pain.\n\nAnxiety can look like defiance when avoidance is actually fear.',
    help:
      'Notice patterns: triggers, frequency, and impact on sleep, school, and friendships.\n\nValidate: "I see you are worried. That makes sense. We will figure this out together."\n\nAvoid excessive reassurance that feeds the anxiety cycle—support without fixing every fear instantly.\n\nMaintain routines for sleep, meals, and predictable transitions.\n\nModel calm coping and name your own strategies.\n\nConsult a pediatrician or child therapist if symptoms persist beyond typical developmental fears.',
    support:
      `${SUPPORT}\n\nSeek prompt professional evaluation if anxiety causes school refusal, severe distress, or any thoughts of self-harm.`,
    related: [
      'How do I help my anxious child?',
      'How do I know if my teen needs therapy?',
      'How do I talk to my child about mental health?',
      'How do I find a therapist for my child?',
      'How do I support my child through a panic attack?',
    ],
    schemaAnswer:
      'If your child may have anxiety, observe persistent worry and avoidance, validate feelings, maintain routines, and seek pediatric or therapy evaluation when symptoms impair daily life.',
    themes: ['Childhood anxiety', 'Parenting', 'Validation', 'Early intervention'],
    refs: [ANXIETY, NIMH],
  }),
  'what-should-i-do-if-i-think-my-friend-is-186032-033': draft({
    question: 'What should I do if I think my friend is in an abusive relationship?',
    slug: 'what-should-i-do-if-i-think-my-friend-is-186032-033',
    category: 'Relationships & Communication',
    title: 'Friend in an Abusive Relationship',
    meta: 'Support a friend in abuse by listening without judgment, sharing resources, avoiding pressure to leave, and maintaining the friendship through their choices.',
    summary:
      'If you think your friend is in an abusive relationship, listen without judgment, express concern using specific observations, share resources like the National Domestic Violence Hotline, and avoid pressuring them to leave before they are ready. Stay connected—isolation helps abusers.',
    takeaways: [
      'Believe your friend and avoid blaming them for staying.',
      'Specific observations work better than labels like "your partner is abusive."',
      'Leaving is a process—pressure often backfires.',
      'Maintain friendship and share resources even if they stay.',
    ],
    happening:
      'Your friend may minimize behavior, defend their partner, or withdraw from you.\n\nAbusers often isolate victims from friends who might notice harm.',
    help:
      'Choose a private moment: "I care about you. I have noticed X and I am worried."\n\nListen without demanding they leave immediately.\n\nShare the National Domestic Violence Hotline: 1-800-799-7233.\n\nOffer practical help: a place to stay, transportation, or sitting with them while they call.\n\nAvoid criticizing their partner in ways that shut down conversation.\n\nTake care of your own limits—supporting someone in abuse is heavy.',
    support:
      `${SUPPORT}\n\nIf your friend is in immediate danger, help them call 911 or local emergency services; contact the hotline yourself for guidance on supporting them safely.`,
    related: [
      'How do I help a friend in a toxic relationship?',
      'What are the signs of emotional abuse in a relationship?',
      'How do I talk to a friend about their partner?',
      'What should I do if I am in a toxic relationship?',
      'How do I safely leave an abusive relationship?',
    ],
    schemaAnswer:
      'Support a friend in an abusive relationship by listening without judgment, sharing resources like 1-800-799-7233, avoiding pressure to leave, and staying connected through their choices.',
    themes: ['Domestic violence', 'Friend support', 'Safety', 'Resources'],
    flags: ['relationship-safety'],
  }),
  'what-should-i-do-if-i-think-my-partner-has-a-personality-disorder': draft({
    question: 'What should I do if I think my partner has a personality disorder?',
    slug: 'what-should-i-do-if-i-think-my-partner-has-a-personality-disorder',
    category: 'Relationships & Communication',
    title: 'Partner May Have Personality Disorder',
    meta: 'If you suspect your partner has a personality disorder, avoid diagnosing them—focus on behavior impact, boundaries, safety, and your own support.',
    summary:
      'Suspecting your partner has a personality disorder can be confusing and frightening. Avoid diagnosing them yourself. Focus on how their behavior affects you, set clear boundaries, prioritize safety, and seek individual therapy. Encourage them to seek professional evaluation only if they are willing.',
    takeaways: [
      'Only qualified professionals diagnose personality disorders.',
      'Focus on behavior patterns and their impact on you—not labels.',
      'Boundaries and safety planning come before trying to fix your partner.',
      'Individual therapy helps you navigate complexity without losing yourself.',
    ],
    happening:
      'Intense mood swings, fear of abandonment, chronic conflict, or controlling behavior may lead you to search for explanations.\n\nYou may feel responsible for managing their emotions or walking on eggshells.',
    help:
      'Document patterns of behavior and how they affect your wellbeing.\n\nSet boundaries on treatment you will and will not accept.\n\nSeek individual therapy—not only couples work if safety is uncertain.\n\nAvoid armchair diagnosis; encourage professional evaluation if they are open.\n\nBuild support outside the relationship so isolation does not trap you.\n\nCreate a safety plan if behavior includes threats, coercion, or violence.',
    support:
      `${SUPPORT}\n\nSeek domestic violence resources if behavior includes control or violence (1-800-799-7233), and therapy for yourself regardless of whether your partner seeks help.`,
    related: [
      'How do I know if my relationship is toxic?',
      'What is gaslighting and how do I recognize it?',
      'How do I set boundaries in my relationship?',
      'How do I know if my relationship is codependent?',
      'What should I do if I am in a toxic relationship?',
    ],
    schemaAnswer:
      'If you suspect your partner has a personality disorder, avoid diagnosing—focus on behavior impact, set boundaries, prioritize safety, and seek individual therapy and support.',
    themes: ['Personality patterns', 'Relationships', 'Boundaries', 'Safety'],
    flags: ['relationship-safety'],
    notes: 'No diagnosing others; encourage professional evaluation when appropriate.',
  }),
  'what-should-i-do-if-im-afraid-my-job-will-be-automated-soon': draft({
    question: "What should I do if I'm afraid my job will be automated soon?",
    slug: 'what-should-i-do-if-im-afraid-my-job-will-be-automated-soon',
    category: 'Work & Life Balance',
    title: 'Afraid Your Job Will Be Automated',
    meta: 'Fear of job automation is valid—assess realistic risk, upskill in human-centric strengths, diversify income options, and manage anxiety with action plans.',
    summary:
      'Fear that your job will be automated can create chronic anxiety. Assess realistic automation risk in your specific role and industry. Upskill in areas that complement technology, build human-centric strengths, and create a financial and career contingency plan. Action reduces helplessness more than rumination.',
    takeaways: [
      'Automation risk varies widely by role—not every job disappears overnight.',
      'Human skills—judgment, empathy, creativity—remain valuable complements to AI.',
      'Contingency planning restores agency more than constant worry.',
      'Anxiety about automation can impair performance more than automation itself.',
    ],
    happening:
      'Headlines about AI may make every task feel replaceable.\n\nUncertainty about timelines can leave you in chronic dread without a plan.',
    help:
      'Research automation trends specific to your role—not generic panic.\n\nIdentify skills AI complements rather than replaces in your field.\n\nBuild a six-month upskilling plan with one concrete credential or project.\n\nGrow your professional network before you need it.\n\nCreate a financial buffer and explore adjacent career paths.\n\nLimit doom-scrolling that fuels anxiety without actionable information.',
    support:
      `${SUPPORT}\n\nSeek therapy if automation fear drives chronic anxiety, insomnia, or depression that impairs daily functioning.`,
    related: [
      'What should I do if I feel like my skills are becoming obsolete?',
      'What should I do if I am struggling financially due to economic changes from AI?',
      'How do I cope with career uncertainty?',
      'How do I manage stress at work?',
      'How do I stop catastrophizing about the future?',
    ],
    schemaAnswer:
      'If you fear job automation, assess realistic risk, upskill in human-centric strengths, build a contingency plan, and channel anxiety into actionable career steps.',
    themes: ['Automation anxiety', 'Career planning', 'AI disruption', 'Upskilling'],
    refs: [BURNOUT, NIMH],
  }),
  'what-should-i-do-if-im-afraid-of-confrontation': draft({
    question: "What should I do if I'm afraid of confrontation?",
    slug: 'what-should-i-do-if-im-afraid-of-confrontation',
    category: 'Work & Life Balance',
    title: 'Afraid of Confrontation',
    meta: 'Fear of confrontation often stems from past conflict trauma—practice assertive communication, start with low-stakes issues, and reframe conflict as problem-solving.',
    summary:
      'Fear of confrontation is common and often stems from past experiences where conflict felt dangerous or shameful. Avoiding all confrontation can build resentment and allow problems to grow. Practice assertive communication on low-stakes issues and reframe conflict as addressing problems, not attacking people.',
    takeaways: [
      'Avoiding confrontation often creates bigger problems over time.',
      'Assertiveness differs from aggression—it states needs respectfully.',
      'Past family or cultural messages may equate conflict with danger.',
      'Small practice builds confidence for harder conversations.',
    ],
    happening:
      'You may agree to things you resent, stay silent when hurt, or feel physically anxious before any disagreement.\n\nPeople-pleasing may have kept peace in the past but now costs your wellbeing.',
    help:
      'Use "I" statements: "I feel X when Y. I need Z."\n\nStart with low-stakes practice: returning a wrong order, asking for a deadline extension.\n\nPrepare one point—not a courtroom case—before difficult talks.\n\nSeparate disagreement from rejection; conflict can coexist with care.\n\nRole-play with a trusted friend or therapist.\n\nNotice when avoidance is protecting you from abuse versus healthy self-expression.',
    support:
      `${SUPPORT}\n\nSeek therapy if fear of confrontation enables abuse, chronic resentment, or inability to advocate for basic needs at work or home.`,
    related: [
      'How do I set boundaries without feeling guilty?',
      'How do I communicate my needs assertively?',
      'How do I stop being a people pleaser?',
      'How do I have difficult conversations?',
      'How do I set boundaries at work?',
    ],
    schemaAnswer:
      'If you fear confrontation, practice assertive "I" statements on low-stakes issues, reframe conflict as problem-solving, and seek therapy if avoidance enables harm or chronic resentment.',
    themes: ['Confrontation fear', 'Assertiveness', 'Boundaries', 'Communication'],
  }),
  'what-should-i-do-if-im-being-pressured-t-186032-014': draft({
    question: "What should I do if I'm being pressured to have sex?",
    slug: 'what-should-i-do-if-im-being-pressured-t-186032-014',
    category: 'Teens & Identity',
    title: 'Being Pressured to Have Sex',
    meta: 'You never owe anyone sex—pressure, guilt, or threats are not consent; say no clearly, leave unsafe situations, and tell a trusted adult.',
    summary:
      'You never owe anyone sex, and pressure to have sex is never acceptable. A caring partner respects "no" without guilt trips, threats, or sulking. Say no clearly, leave unsafe situations, and tell a trusted adult if pressure continues or you feel coerced.',
    takeaways: [
      'Consent must be freely given—pressure invalidates consent.',
      'You can say no at any time, even if you previously said yes.',
      'Guilt, threats, or emotional manipulation are forms of pressure.',
      'A partner who respects you accepts "no" without punishment.',
    ],
    happening:
      'Pressure may come from a partner, peer group, or social expectations.\n\nFear of losing the relationship may make "no" feel impossible to say.',
    help:
      'Practice clear language: "No. I am not ready" or "Stop. I do not want to."\n\nLeave the situation if pressure continues—your safety matters more than politeness.\n\nTell a trusted adult: parent, counselor, teacher, or older sibling.\n\nRecognize guilt trips and "if you loved me" as manipulation—not love.\n\nBlock or distance from anyone who will not respect boundaries.\n\nKnow that worthy partners do not punish you for saying no.',
    support:
      `${SUPPORT}\n\nIf you feel unsafe or have been assaulted, tell a trusted adult immediately and seek medical care; call 988 or emergency services if you are in danger.`,
    related: [
      'How do I set boundaries in dating?',
      'How do I know if my relationship is healthy?',
      'What is consent and how do I communicate it?',
      'How do I leave a relationship that pressures me?',
      'How do I talk to a parent about relationship problems?',
    ],
    schemaAnswer:
      'If you are pressured to have sex, say no clearly, leave unsafe situations, tell a trusted adult, and remember consent must be freely given without guilt or threats.',
    themes: ['Consent', 'Boundaries', 'Teens', 'Safety'],
    flags: ['youth-safety', 'relationship-safety'],
  }),
  'what-should-i-do-if-im-in-a-toxic-relationship': draft({
    question: "What should I do if I'm in a toxic relationship?",
    slug: 'what-should-i-do-if-im-in-a-toxic-relationship',
    category: 'Relationships & Communication',
    title: 'In a Toxic Relationship',
    meta: 'Toxic relationships erode wellbeing through patterns of harm—name the impact, set boundaries, build support, and plan safe exit if change is not possible.',
    summary:
      'Being in a toxic relationship is emotionally devastating, especially when you still care about the person. Name specific harmful patterns, set boundaries, build support outside the relationship, and consider therapy. If abuse is present, prioritize safety planning over trying to fix the relationship.',
    takeaways: [
      'Toxic patterns repeat—occasional good moments do not erase harm.',
      'You cannot fix a toxic dynamic alone; both people must change—or you must leave.',
      'Isolation from friends and family is a common toxic tactic.',
      'Safety planning precedes confrontation when abuse is involved.',
    ],
    happening:
      'You may feel drained, anxious, or smaller than before the relationship.\n\nCycles of tension, explosion, apology, and honeymoon can trap you in hope.',
    help:
      'List specific behaviors that harm you—not vague "toxic" labels alone.\n\nReconnect with friends and family the relationship may have distanced you from.\n\nSet boundaries and notice whether your partner respects them over time.\n\nSeek individual therapy to clarify whether the relationship is salvageable.\n\nCreate a safety plan if there is emotional, physical, or financial abuse.\n\nContact the National Domestic Violence Hotline (1-800-799-7233) for confidential support.',
    support:
      `${SUPPORT}\n\nIf you feel unsafe, contact 1-800-799-7233 or local emergency services; prioritize safety over saving the relationship when abuse is present.`,
    related: [
      'How do I know if my relationship is toxic?',
      'What are the signs of emotional abuse in a relationship?',
      'How do I safely leave an abusive relationship?',
      'What is gaslighting and how do I recognize it?',
      'How do I rebuild self-esteem after a toxic relationship?',
    ],
    schemaAnswer:
      'In a toxic relationship, name harmful patterns, set boundaries, rebuild outside support, seek therapy, and prioritize safety planning—including calling 1-800-799-7233 if abuse is present.',
    themes: ['Toxic relationships', 'Safety', 'Boundaries', 'Exit planning'],
    flags: ['relationship-safety'],
  }),
  'what-should-i-do-if-im-struggling-financially-due-to-economic-changes-from-ai': draft({
    question: "What should I do if I'm struggling financially due to economic changes from AI?",
    slug: 'what-should-i-do-if-im-struggling-financially-due-to-economic-changes-from-ai',
    category: 'Work & Life Balance',
    title: 'Financial Struggle From AI Disruption',
    meta: 'AI-driven economic change can cause real financial hardship—access assistance programs, retrain strategically, and protect mental health while rebuilding stability.',
    summary:
      'Financial hardship from AI-driven economic disruption can feel uniquely destabilizing because changes may be permanent rather than cyclical. Access unemployment benefits, retraining programs, and community assistance. Protect mental health while you rebuild—shame and isolation worsen outcomes.',
    takeaways: [
      'AI disruption is a structural shift—not personal failure to adapt fast enough.',
      'Government and nonprofit retraining programs may help pivot careers.',
      'Financial stress worsens mental health; address both together when possible.',
      'Community assistance exists—applying is pragmatic, not shameful.',
    ],
    happening:
      'Layoffs, reduced hours, or obsolete skills may hit suddenly with little warning.\n\nShame about needing help may delay accessing resources you qualify for.',
    help:
      'Apply for unemployment and any local workforce retraining grants promptly.\n\nContact 211 or community action agencies for food, housing, and utility assistance.\n\nAssess transferable skills and adjacent industries hiring now.\n\nReduce expenses temporarily while rebuilding—avoid shame-driven isolation.\n\nSeek financial counseling through nonprofits for budgeting and debt triage.\n\nProtect sleep and connection; financial crisis is a mental health stressor too.',
    support:
      `${SUPPORT}\n\nSeek therapy or crisis support (988) if financial stress drives hopelessness, substance use, or thoughts of self-harm.`,
    related: [
      'What should I do if I am afraid my job will be automated soon?',
      'What should I do if I feel like my skills are becoming obsolete?',
      'How do I cope with financial stress?',
      'How do I find career counseling?',
      'How do I manage anxiety about the future?',
    ],
    schemaAnswer:
      'If AI economic changes cause financial hardship, access unemployment and retraining programs, community assistance, and mental health support while rebuilding career stability.',
    themes: ['AI disruption', 'Financial stress', 'Retraining', 'Economic anxiety'],
    refs: [BURNOUT, SAMHSA],
  }),
  'what-should-i-do-if-im-struggling-with-my-sexual-identity-or-orientation': draft({
    question: "What should I do if I'm struggling with my sexual identity or orientation?",
    slug: 'what-should-i-do-if-im-struggling-with-my-sexual-identity-or-orientation',
    category: 'Identity & Self-Worth',
    title: 'Struggling With Sexual Identity',
    meta: 'Questioning sexual identity is valid—explore at your own pace, seek affirming support, and know you do not owe anyone a label before you are ready.',
    summary:
      'Struggling with sexual identity or orientation is a valid part of self-discovery for many people. Explore at your own pace without forcing labels. Seek affirming friends, communities, and therapists. You do not owe anyone disclosure before you are ready, and questioning does not require immediate answers.',
    takeaways: [
      'Sexual identity exploration is normal and may evolve over time.',
      'You do not need a fixed label to be valid.',
      'Affirming support protects mental health during questioning.',
      'Rejection from others reflects their limits—not your worth.',
    ],
    happening:
      'Confusion, fear of rejection, or internalized stigma may make exploration feel dangerous.\n\nReligious, family, or cultural messages may conflict with emerging identity.',
    help:
      'Allow questioning without rushing to declare a permanent label.\n\nJournal or talk with trusted affirming people about attractions and feelings.\n\nSeek LGBTQ+-affirming therapy if distress is high.\n\nConnect with communities like PFLAG or The Trevor Project for peer support.\n\nDisclose to others only when you feel safe and ready.\n\nSeparate your worth from others\' acceptance timelines.',
    support:
      `${SUPPORT}\n\nContact The Trevor Project (1-866-488-7386) or 988 if questioning fuels isolation, self-harm thoughts, or crisis—affirming help is available.`,
    related: [
      'How do I come out to my family?',
      'How do I cope with family who reject my identity?',
      'How do I find an LGBTQ+-affirming therapist?',
      'How do I build self-esteem when others reject me?',
      'How do I explore my gender identity safely?',
    ],
    schemaAnswer:
      'If you struggle with sexual identity, explore at your own pace, seek affirming support, and remember you do not owe anyone a label—questioning is valid self-discovery.',
    themes: ['Sexual identity', 'LGBTQ+', 'Self-discovery', 'Affirmation'],
    gaps: ['No dedicated LGBTQ+ youth clinical source cited; verify framing with editorial standards.'],
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
  'reports/enrichment-corpus/draft-answers/batch-28-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-28-drafts.json`);
