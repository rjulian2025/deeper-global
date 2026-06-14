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
const ADHD = {
  title: 'Attention-Deficit/Hyperactivity Disorder',
  url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd',
  publisher: 'NIMH',
  note: 'Supports understanding ADHD and treatment options.',
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
  readFileSync('reports/enrichment-corpus/batches/batch-17-input.json', 'utf8'),
);

const contentBySlug = {
  'how-do-i-make-friends-as-an-adult-when-it-feels-impossible': draft({
    question: 'How do I make friends as an adult when it feels impossible?',
    slug: 'how-do-i-make-friends-as-an-adult-when-it-feels-impossible',
    category: 'Loneliness & Isolation',
    title: 'Making Friends as an Adult',
    meta: 'Adult friendships need intentional effort—shared activities, consistency, and patience beat waiting for instant best-friend chemistry.',
    summary:
      'Childhood friendships often formed through proximity and unstructured time. As an adult, connection usually requires showing up repeatedly in shared spaces, tolerating slow trust-building, and accepting that not every acquaintance becomes a close friend.',
    takeaways: [
      'Adult friendship takes more intention than childhood proximity allowed.',
      'Consistency in one setting beats one-off networking events.',
      'Acquaintances can deepen over months—not every hang needs to be deep.',
      'Rejection and awkwardness feel bigger without built-in social safety nets.',
    ],
    happening:
      'You may compare adult friendship to effortless school-era bonds and feel defective when it does not happen quickly.\n\nBusy schedules, established friend groups, and fear of rejection can make every invitation feel high-stakes.',
    help:
      'Choose recurring activities: classes, volunteering, hobby groups, faith communities, or sports leagues.\n\nShow up consistently so people recognize you before depth develops.\n\nLead with curiosity—ask questions, remember details, follow up lightly.\n\nAccept casual friendships as valid while some connections deepen slowly.\n\nPractice small risks: one coffee invite, one text check-in, without expecting instant closeness.',
    support:
      `${SUPPORT}\n\nSeek therapy if loneliness fuels depression, social avoidance, or severe self-criticism.`,
    related: [
      'How do I cope with loneliness as an adult?',
      'How do I maintain friendships when I am depressed?',
      'How do I build community in a new city?',
      'How do I overcome social anxiety when meeting new people?',
      'How do I know if my friendships are one-sided?',
    ],
    schemaAnswer:
      'Make adult friends through recurring shared activities, consistent showing up, patient trust-building, and small social risks without expecting instant deep bonds.',
    themes: ['Adult friendships', 'Loneliness', 'Social connection', 'Consistency'],
    notes: 'Avoid implying friendship is easy with the right mindset; validate structural barriers.',
  }),
  'how-do-i-manage-adhd-without-medication': draft({
    question: 'How do I manage ADHD without medication?',
    slug: 'how-do-i-manage-adhd-without-medication',
    category: 'General Mental Health',
    title: 'Managing ADHD Without Medication',
    meta: 'Non-medication ADHD support includes routines, environment design, exercise, sleep, and coaching—discuss all options with a qualified clinician.',
    summary:
      'Some people manage ADHD without medication by combining structure, external reminders, movement, sleep hygiene, and behavioral strategies. These approaches can help symptoms but do not replace professional evaluation—especially to rule out look-alike conditions and discuss whether medication might help.',
    takeaways: [
      'Routines and external systems compensate for executive function gaps.',
      'Exercise, sleep, and nutrition strongly affect focus and impulse control.',
      'Simple organization beats elaborate systems you cannot maintain.',
      'Professional evaluation clarifies ADHD vs anxiety, trauma, or sleep issues.',
    ],
    happening:
      'You may prefer to avoid medication because of side effects, access, stigma, or personal values.\n\nWithout support, procrastination, disorganization, and emotional overwhelm can feel like character flaws rather than brain-based patterns.',
    help:
      'Build predictable daily routines with visual schedules and alarms.\n\nBreak tasks into small steps; use timers (e.g., focused work blocks with breaks).\n\nKeep organization simple: designated spots for keys, one inbox for papers.\n\nPrioritize regular exercise and consistent sleep—both affect attention significantly.\n\nConsider ADHD coaching or therapy for skills; discuss all treatment options with a clinician.',
    support:
      `${SUPPORT}\n\nSeek evaluation if symptoms severely impair work, relationships, or safety—medication may be one option to discuss with a prescriber.`,
    related: [
      'How do I know if I have ADHD as an adult?',
      'Why do I get so emotionally overwhelmed with ADHD?',
      'How do I stop procrastinating when I have ADHD?',
      'How do I manage time when I always underestimate tasks?',
      'How do I find an ADHD-informed therapist?',
    ],
    schemaAnswer:
      'Manage ADHD without medication through routines, external reminders, exercise, sleep hygiene, simple organization, and professional coaching—while staying open to clinical evaluation and all treatment options.',
    themes: ['ADHD', 'Executive function', 'Behavioral strategies', 'Non-medication approaches'],
    refs: [ADHD, NIMH],
    notes: 'No medication dosing or prescribing; encourage professional evaluation.',
  }),
  'how-do-i-manage-depression-while-working-a-demanding-job': draft({
    question: 'How do I manage depression while working a demanding job?',
    slug: 'how-do-i-manage-depression-while-working-a-demanding-job',
    category: 'Depression',
    title: 'Depression While Working a Demanding Job',
    meta: 'High-pressure work with depression needs treatment, realistic pacing, boundaries, and workplace accommodations when possible—not just pushing through.',
    summary:
      'Depression at a demanding job creates a painful loop: work drains the energy you need to recover, while falling behind increases shame. Managing both usually requires professional treatment, honest pacing, and boundaries—not heroic overwork disguised as coping.',
    takeaways: [
      'Depression is a health condition, not a productivity failure.',
      'Treatment (therapy and/or clinical care) supports functioning at work.',
      'Micro-rest and boundaries protect capacity better than constant grinding.',
      'Accommodations or temporary workload shifts may be appropriate.',
    ],
    happening:
      'You may hide symptoms, work longer to compensate, and collapse at home.\n\nFear of stigma or job loss can delay asking for help until crisis.',
    help:
      'Prioritize depression treatment with a clinician—functioning often improves with care.\n\nBreak work into smallest viable tasks; celebrate completion, not perfection.\n\nSchedule brief movement, meals, and daylight even on heavy days.\n\nCommunicate limits where safe: deadlines, scope, or flexible hours.\n\nReduce optional commitments outside work until baseline stabilizes.',
    support:
      `${SUPPORT}\n\nSeek urgent help for suicidal thoughts; consider medical leave or disability resources if you cannot function safely.`,
    related: [
      'How do I know if I need therapy for depression?',
      'How do I manage burnout at work?',
      'How do I talk to my boss about mental health?',
      'How do I motivate myself when everything feels pointless?',
      'How do I set boundaries when overwhelmed at work?',
    ],
    schemaAnswer:
      'Manage work-related depression with professional treatment, task breakdown, basic self-care, honest boundaries, and workplace accommodations when possible—not silent overwork.',
    themes: ['Depression', 'Work stress', 'Boundaries', 'Treatment'],
    refs: [DEPRESSION, NIMH],
    notes: 'No disability/legal advice depth; encourage clinical care and safety.',
  }),
  'how-do-i-manage-screen-time-when-my-job-requires-b4c8d3': draft({
    question: 'How do I manage screen time when my job requires constant computer use?',
    slug: 'how-do-i-manage-screen-time-when-my-job-requires-b4c8d3',
    category: 'Work & Burnout',
    title: 'Screen Time When Work Requires a Screen',
    meta: 'When your job demands screens, protect eyes, posture, and mental energy with breaks, offline rituals, and boundaries on non-work scrolling.',
    summary:
      'You cannot eliminate screens when work depends on them—but you can reduce cumulative strain. Strategic breaks, ergonomic setup, offline recovery time, and separating work screens from recreational scrolling help prevent burnout and digital fatigue.',
    takeaways: [
      'Separate required work screen time from optional recreational scrolling.',
      'Micro-breaks and movement reduce eye strain and mental depletion.',
      'Offline rituals bookend the workday so screens do not fill all waking hours.',
      'Sleep and evening boundaries matter as much as daytime ergonomics.',
    ],
    happening:
      'After eight or more hours of work screens, your eyes, neck, and attention may feel fried—yet you still reach for your phone.\n\nGuilt about "too much screen time" ignores that much of it is non-optional.',
    help:
      'Use the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds.\n\nStand, stretch, or walk briefly between meetings and tasks.\n\nKeep phones out of bed; stop work email at a set time when possible.\n\nReplace some evening scrolling with audio, movement, or in-person connection.\n\nAdjust monitor height, lighting, and font size to reduce physical strain.',
    support:
      `${SUPPORT}\n\nSeek help if screen-related insomnia, headaches, or anxiety persist despite adjustments.`,
    related: [
      'How do I manage screen time without feeling like I am missing work opportunities?',
      'How do I recover from digital burnout?',
      'How do I improve sleep when I work on screens all day?',
      'How do I manage stress at work?',
      'How do I set boundaries with after-hours work messages?',
    ],
    schemaAnswer:
      'Manage required work screen time with breaks, ergonomics, offline recovery rituals, and boundaries on non-essential scrolling—especially before sleep.',
    themes: ['Digital fatigue', 'Work ergonomics', 'Screen boundaries', 'Burnout prevention'],
    notes: 'Acknowledge non-optional work screens; avoid shaming total screen hours.',
  }),
  'how-do-i-manage-screen-time-without-feeling-like-m4n7o1': draft({
    question: 'How do I manage screen time without feeling like I\'m missing out on work opportunities?',
    slug: 'how-do-i-manage-screen-time-without-feeling-like-m4n7o1',
    category: 'Work & Burnout',
    title: 'Cutting Screen Time Without FOMO at Work',
    meta: 'Boundaries on always-on connectivity protect focus and health—urgent work can be handled with clear channels, not constant availability.',
    summary:
      'Fear of missing a message, trend, or opportunity keeps many people tethered to screens around the clock. Sustainable boundaries usually require clarifying what truly requires immediacy, using focused work blocks, and trusting that rest improves performance—not weakens it.',
    takeaways: [
      'Not every notification is urgent—clarify true escalation paths with your team.',
      'Focused offline blocks often increase output more than constant monitoring.',
      'FOMO at work often reflects culture, not personal failure.',
      'Rest and boundaries are performance tools, not laziness.',
    ],
    happening:
      'You may feel that stepping away means falling behind peers who never disconnect.\n\nAlways-on habits blur work and personal life until both feel unsatisfying.',
    help:
      'Define core hours for responsiveness and auto-reply or status messages outside them.\n\nBatch email and chat checks instead of continuous monitoring.\n\nDiscuss expectations with managers: what requires immediate response?\n\nUse do-not-disturb during deep work; note when you will reply.\n\nTrack whether constant connectivity actually prevents problems—or mainly increases anxiety.',
    support:
      `${SUPPORT}\n\nSeek support if work FOMO drives insomnia, panic, or inability to disconnect despite clear boundaries.`,
    related: [
      'How do I manage the anxiety of being constantly reachable?',
      'How do I manage screen time when my job requires constant computer use?',
      'How do I set boundaries with after-hours work messages?',
      'How do I manage stress at work?',
      'How do I recover from burnout?',
    ],
    schemaAnswer:
      'Reduce work screen FOMO by clarifying urgency rules, batching communication, using focused offline blocks, and negotiating realistic availability with your team.',
    themes: ['Work FOMO', 'Digital boundaries', 'Always-on culture', 'Focus'],
    notes: 'No prescriptive employer policies; validate structural pressure.',
  }),
  'how-do-i-manage-stress-at-work': draft({
    question: 'How do I manage stress at work?',
    slug: 'how-do-i-manage-stress-at-work',
    category: 'Work & Life Balance',
    title: 'Managing Stress at Work',
    meta: 'Work stress responds to boundaries, realistic pacing, support, and sometimes job or role changes—not willpower alone.',
    summary:
      'Work stress is common, but chronic overwhelm erodes health and performance. Managing it usually combines practical boundaries, communication about workload, basic recovery habits, and knowing when the environment—not just your coping—is the problem.',
    takeaways: [
      'Short-term stress differs from chronic unsustainable overload.',
      'Boundaries and workload conversations are skills, not selfishness.',
      'Sleep, movement, and breaks support nervous system recovery.',
      'Sometimes the job or culture needs changing, not just you.',
    ],
    happening:
      'You may normalize running on adrenaline until exhaustion or health symptoms appear.\n\nUnclear expectations, understaffing, or conflict can keep stress high regardless of personal effort.',
    help:
      'Identify top stressors: volume, ambiguity, conflict, or lack of control.\n\nUse brief resets: walks, breathing, lunch away from desk.\n\nClarify priorities with managers; push back on unmanageable loads when safe.\n\nProtect sleep and off-hours recovery.\n\nBuild peer support—venting with trusted colleagues can reduce isolation.',
    support:
      `${SUPPORT}\n\nSeek therapy or occupational health resources if stress causes panic, depression, substance reliance, or physical health decline.`,
    related: [
      'How do I manage stress when I cannot change my situation?',
      'How do I know if I am experiencing burnout?',
      'How do I set boundaries at work?',
      'How do I talk to my boss about mental health?',
      'How do I recover from chronic work stress?',
    ],
    schemaAnswer:
      'Manage work stress with boundary-setting, workload clarity, recovery habits, peer support, and professional help—or job changes when the environment stays harmful.',
    themes: ['Work stress', 'Boundaries', 'Burnout', 'Workload'],
    notes: 'Avoid blaming individual for toxic workplaces.',
  }),
  'how-do-i-manage-stress-when-i-cant-change-my-situation': draft({
    question: 'How do I manage stress when I can\'t change my situation?',
    slug: 'how-do-i-manage-stress-when-i-cant-change-my-situation',
    category: 'General Mental Health',
    title: 'Stress When You Cannot Change the Situation',
    meta: 'When circumstances are fixed for now, focus on what you can influence: body regulation, support, meaning, and small choices within constraints.',
    summary:
      'Caregiving, financial pressure, illness, or unsafe environments sometimes cannot change quickly. Stress management then shifts from fixing the external problem to stabilizing your nervous system, finding support, and protecting small pockets of agency until larger change becomes possible.',
    takeaways: [
      'Acceptance of current limits is not the same as giving up forever.',
      'Body-based regulation helps when problems cannot be solved immediately.',
      'Support networks reduce the isolation that amplifies stress.',
      'Planning exit or change timelines can restore hope when stuck.',
    ],
    happening:
      'Advice to "just leave" or "change your mindset" may feel invalidating when options are constrained.\n\nChronic stress without exit can lead to hopelessness, irritability, or numbness.',
    help:
      'Name what is fixed vs what still has wiggle room—even tiny choices count.\n\nUse grounding: breathing, movement, cold water, music—whatever reliably calms your body.\n\nConnect with one trusted person regularly; isolation worsens stuck stress.\n\nLimit secondary stressors you can control: news, overcommitment, sleep debt.\n\nWork with a therapist on survival-mode coping and long-term planning.',
    support:
      `${SUPPORT}\n\nSeek urgent help if stress involves abuse, suicidal thoughts, or you cannot keep yourself safe—safety planning may come first.`,
    related: [
      'How do I manage stress at work?',
      'How do I cope when I feel trapped in my life?',
      'How do I find hope when nothing seems to change?',
      'How do I manage anxiety about things I cannot control?',
      'How do I build resilience during hard seasons?',
    ],
    schemaAnswer:
      'When situations cannot change yet, manage stress through body regulation, support, small agency choices, reduced secondary load, and therapy for survival coping and future planning.',
    themes: ['Unchangeable stress', 'Acceptance', 'Regulation', 'Agency'],
    notes: 'Validate constraints; flag abuse/safety; avoid toxic positivity.',
    flags: ['relationship-safety'],
  }),
  'how-do-i-manage-the-anxiety-of-being-constantly-r2s5t8': draft({
    question: 'How do I manage the anxiety of being constantly reachable?',
    slug: 'how-do-i-manage-the-anxiety-of-being-constantly-r2s5t8',
    category: 'Anxiety & Stress',
    title: 'Anxiety From Being Constantly Reachable',
    meta: 'Always-on connectivity trains hypervigilance—notification boundaries and nervous-system resets help reclaim calm.',
    summary:
      'Smartphones and remote work make constant reachability feel mandatory. That state keeps your nervous system on alert, amplifying anxiety about missing messages, disappointing others, or falling behind. Structured offline time and clear response norms reduce the dread of being "on" indefinitely.',
    takeaways: [
      'Constant availability keeps the nervous system in low-grade fight-or-flight.',
      'Notification boundaries are health tools, not rudeness.',
      'Anxiety often overestimates the cost of delayed replies.',
      'Culture change may require team agreements, not solo heroics.',
    ],
    happening:
      'You may feel a jolt of panic when your phone buzzes—or when it does not.\n\nSleep, meals, and relationships suffer when you never fully disconnect.',
    help:
      'Turn off non-essential notifications; check messages on a schedule.\n\nUse status messages or auto-replies for focused or offline time.\n\nPractice tolerating delayed responses—most messages are not emergencies.\n\nCreate phone-free zones: meals, bedroom, first hour of morning.\n\nDiscuss team norms for after-hours contact if work drives the pressure.',
    support:
      `${SUPPORT}\n\nSeek help if reachability anxiety causes panic attacks, insomnia, or compulsive checking you cannot stop.`,
    related: [
      'How do I manage screen time without feeling like I am missing work opportunities?',
      'How do I set boundaries with after-hours work messages?',
      'How do I manage the fear of missing out on digital trends?',
      'How do I improve sleep when my mind will not stop?',
      'How do I manage stress at work?',
    ],
    schemaAnswer:
      'Ease always-on anxiety with notification boundaries, scheduled check-ins, phone-free zones, tolerance practice for delayed replies, and team agreements on after-hours contact.',
    themes: ['Digital anxiety', 'Hypervigilance', 'Boundaries', 'Notifications'],
    refs: [ANXIETY, NIMH],
    notes: 'Workplace cultural factors acknowledged.',
  }),
  'how-do-i-manage-the-fear-of-missing-out-on-x4y7z1': draft({
    question: 'How do I manage the fear of missing out on digital trends and updates?',
    slug: 'how-do-i-manage-the-fear-of-missing-out-on-x4y7z1',
    category: 'Anxiety & Stress',
    title: 'FOMO on Digital Trends and Updates',
    meta: 'Digital FOMO feeds on infinite feeds—curate inputs, set consumption limits, and remember most trends matter less than rest and real life.',
    summary:
      'Social platforms and news cycles are designed to make you feel behind. Fear of missing trends, memes, or industry updates can keep you scrolling compulsively even when it adds stress, not value. Curating what you follow and scheduling check-ins often helps more than trying to consume everything.',
    takeaways: [
      'Platforms profit from making you feel perpetually behind.',
      'Most trends have little impact on your daily life or goals.',
      'Scheduled consumption beats endless background scrolling.',
      'Offline connection and rest often matter more than staying current.',
    ],
    happening:
      'You may open apps "just for a minute" and lose an hour to comparison or anxiety.\n\nProfessional FOMO can mix with social FOMO, doubling the pressure to stay plugged in.',
    help:
      'Unfollow or mute accounts that trigger inadequacy or urgency.\n\nSet two or three check-in windows daily instead of continuous monitoring.\n\nAsk whether each trend affects your actual responsibilities or values.\n\nReplace some scroll time with learning one skill deeply rather than skimming many.\n\nUse app timers and leave devices in another room during rest.',
    support:
      `${SUPPORT}\n\nSeek help if FOMO drives compulsive use, eating-disorder triggers, or severe anxiety despite limits.`,
    related: [
      'How do I stop comparing myself to others online?',
      'How do I take a social media break for my mental health?',
      'How do I manage the anxiety of being constantly reachable?',
      'How do I know if I am ready to reduce my social media use?',
      'How do I build real-life friendships?',
    ],
    schemaAnswer:
      'Manage digital trend FOMO by curating feeds, scheduling check-ins, questioning relevance to your life, and prioritizing offline rest and connection.',
    themes: ['FOMO', 'Social media', 'Digital consumption', 'Comparison'],
    refs: [ANXIETY, CDC],
    notes: 'Flag ED trigger overlap in support section.',
  }),
  'how-do-i-motivate-myself-when-everything-181288-003': draft({
    question: 'How do I motivate myself when everything feels pointless?',
    slug: 'how-do-i-motivate-myself-when-everything-181288-003',
    category: 'Depression',
    title: 'Motivation When Everything Feels Pointless',
    meta: 'Persistent pointlessness and low motivation often signal depression—not laziness. Small actions and professional care matter more than forcing inspiration.',
    summary:
      'When everything feels pointless, motivation rarely returns through pep talks alone. That hollow feeling often accompanies depression, grief, or burnout. Tiny workable steps, connection, and clinical support address the underlying drain—not just the symptom of "no drive."',
    takeaways: [
      'Pointlessness and low motivation are common depression symptoms.',
      'Action can precede motivation—tiny steps count.',
      'Isolation and shame make the void feel deeper.',
      'Professional treatment often restores energy and meaning over time.',
    ],
    happening:
      'You may judge yourself for not caring about things that used to matter.\n\nOthers may call it laziness when your nervous system is depleted.',
    help:
      'Lower the bar: one small task (shower, walk, one email) is enough for today.\n\nConnect with one person, even briefly—Isolation worsens anhedonia.\n\nLimit self-criticism; treat yourself as someone recovering, not failing.\n\nTrack sleep, substance use, and stress—they affect motivation heavily.\n\nSeek depression evaluation if pointlessness persists weeks or includes suicidal thoughts.',
    support:
      `${SUPPORT}\n\nSeek urgent help for suicidal thoughts, self-harm urges, or inability to care for basic needs.`,
    related: [
      'How do I manage depression while working a demanding job?',
      'How do I know if I need therapy for depression?',
      'How do I find meaning when life feels empty?',
      'How do I get out of bed when depressed?',
      'How do I stop isolating when depressed?',
    ],
    schemaAnswer:
      'When everything feels pointless, treat it as a possible depression signal—use tiny actions, connection, reduced self-blame, and professional care rather than waiting for motivation to return first.',
    themes: ['Depression', 'Anhedonia', 'Motivation', 'Meaning'],
    refs: [DEPRESSION, NIMH],
    flags: ['suicide-risk'],
    notes: '988 in support; no toxic productivity framing.',
  }),
  'how-do-i-overcome-imposter-syndrome': draft({
    question: 'How do I overcome imposter syndrome?',
    slug: 'how-do-i-overcome-imposter-syndrome',
    category: 'General Mental Health',
    title: 'Overcoming Imposter Syndrome',
    meta: 'Imposter feelings are common—especially among high achievers and marginalized groups. Evidence, support, and reframing help more than chasing perfect confidence.',
    summary:
      'Imposter syndrome is the persistent belief that your success is luck or fraud despite evidence of competence. It thrives in competitive environments and among people who face bias or extra scrutiny. Managing it involves collecting proof of capability, sharing feelings safely, and separating self-worth from flawless performance.',
    takeaways: [
      'Feeling like an imposter is common—not proof you are one.',
      'Bias and exclusion can fuel imposter feelings in marginalized groups.',
      'Document accomplishments and positive feedback to counter distortion.',
      'Mentorship and peer support normalize the experience.',
    ],
    happening:
      'You may dismiss praise, attribute wins to luck, and fear being "found out."\n\nOverpreparing and perfectionism may exhaust you while reinforcing the fraud narrative.',
    help:
      'Keep a running list of completed projects, skills learned, and kind feedback.\n\nShare imposter feelings with trusted peers—many relate.\n\nDefine "good enough" standards instead of impossible perfection.\n\nNotice when comparison to curated highlights drives inadequacy.\n\nConsider therapy if imposter thoughts block opportunities or fuel chronic anxiety.',
    support:
      `${SUPPORT}\n\nSeek therapy if imposter beliefs drive burnout, panic, or avoidance of growth opportunities you want.`,
    related: [
      'How do I overcome perfectionism at work?',
      'How do I rebuild confidence after a major failure?',
      'How do I manage anxiety at work?',
      'How do I stop comparing myself to coworkers?',
      'How do I advocate for myself professionally?',
    ],
    schemaAnswer:
      'Overcome imposter syndrome by documenting evidence of competence, sharing feelings with peers, setting realistic standards, and seeking therapy when fraud beliefs limit your life.',
    themes: ['Imposter syndrome', 'Self-doubt', 'Perfectionism', 'Workplace confidence'],
    notes: 'Acknowledge systemic bias; avoid implying syndrome is only internal.',
  }),
  'how-do-i-overcome-perfectionism-at-work-186032-040': draft({
    question: 'How do I overcome perfectionism at work?',
    slug: 'how-do-i-overcome-perfectionism-at-work-186032-040',
    category: 'Work, Stress & Burnout',
    title: 'Overcoming Perfectionism at Work',
    meta: 'Work perfectionism looks like high standards but often costs time, health, and relationships—"good enough" and deadlines are skills worth building.',
    summary:
      'Perfectionism at work can produce excellent output while secretly driving procrastination, burnout, and fear of feedback. Recovery usually means defining criteria for "done," tolerating imperfection on low-stakes tasks, and separating self-worth from flawless delivery.',
    takeaways: [
      'Perfectionism often masquerades as professionalism.',
      'Clear "done" criteria beat endless polishing.',
      'Fear of criticism fuels overwork and avoidance alike.',
      'Good-enough delivery protects sustainability and creativity.',
    ],
    happening:
      'You may re-read emails ten times, miss deadlines polishing details, or avoid starting because nothing feels ready.\n\nColleagues may not see the anxiety behind your polished exterior.',
    help:
      'Define minimum viable quality before starting; stop when criteria are met.\n\nTime-box tasks; use timers to limit revision rounds.\n\nPractice submitting B+ work on low-risk items to build tolerance.\n\nAsk for early feedback instead of guessing what "perfect" means.\n\nExplore therapy if perfectionism ties to shame or childhood expectations.',
    support:
      `${SUPPORT}\n\nSeek help if perfectionism drives insomnia, panic, or inability to submit work on time.`,
    related: [
      'How do I overcome imposter syndrome?',
      'How do I manage stress at work?',
      'How do I stop procrastinating?',
      'How do I set boundaries when overwhelmed at work?',
      'How do I recover from burnout?',
    ],
    schemaAnswer:
      'Overcome work perfectionism with clear done criteria, time-boxing, tolerance practice on low-stakes tasks, early feedback, and therapy when shame drives overwork.',
    themes: ['Perfectionism', 'Work habits', 'Procrastination', 'Burnout'],
    notes: 'Category preserved from input (Work, Stress & Burnout).',
  }),
  'how-do-i-overcome-sexual-anxiety-and-performance-pressure': draft({
    question: 'How do I overcome sexual anxiety and performance pressure?',
    slug: 'how-do-i-overcome-sexual-anxiety-and-performance-pressure',
    category: 'Anxiety & Stress',
    title: 'Overcoming Sexual Anxiety and Performance Pressure',
    meta: 'Performance focus often worsens sexual anxiety—connection, communication, pacing, and professional help when needed beat monitoring and pressure.',
    summary:
      'Sexual anxiety and performance pressure create a feedback loop: worry about function or satisfaction increases tension, which makes relaxed intimacy harder. Shifting focus toward connection, communication, and sensory presence—rather than a scorecard—often helps more than self-monitoring.',
    takeaways: [
      'Performance anxiety often worsens the outcomes you fear.',
      'Connection and communication matter as much as physical function.',
      'Medical and psychological factors both deserve professional assessment.',
      'Shame and silence keep anxiety cycling alone.',
    ],
    happening:
      'You may replay past experiences, avoid intimacy, or treat sex as a test to pass.\n\nPartner pressure—or assumed pressure—can intensify worry even when unspoken.',
    help:
      'Talk with your partner about anxiety without blaming either person.\n\nExpand intimacy beyond intercourse: touch, kissing, mutual pleasure without goals.\n\nPractice mindfulness on sensation rather than outcome monitoring.\n\nLimit porn or comparisons that fuel unrealistic standards.\n\nConsult a clinician or sex therapist for persistent anxiety or physical symptoms.',
    support:
      `${SUPPORT}\n\nSeek medical evaluation for persistent pain or dysfunction; sex therapists help when anxiety blocks intimacy.`,
    related: [
      'How do I talk to my partner about sexual concerns?',
      'How do I manage anxiety in intimate relationships?',
      'How do I rebuild intimacy in my relationship?',
      'How do I overcome body image issues affecting intimacy?',
      'How do I find a sex therapist?',
    ],
    schemaAnswer:
      'Reduce sexual anxiety by focusing on connection over performance, communicating with partners, practicing mindful presence, and seeking clinical or sex therapy when symptoms persist.',
    themes: ['Sexual anxiety', 'Performance pressure', 'Intimacy', 'Communication'],
    refs: [ANXIETY, NIMH],
    notes: 'No explicit sexual technique instructions; encourage sex therapy/medical eval.',
  }),
  'how-do-i-practice-mindful-eating': draft({
    question: 'How do I practice mindful eating?',
    slug: 'how-do-i-practice-mindful-eating',
    category: 'Identity & Self-Worth',
    title: 'Practicing Mindful Eating',
    meta: 'Mindful eating means noticing hunger, fullness, and experience without judgment—not a diet rule or weight-loss trick.',
    summary:
      'Mindful eating invites attention to hunger cues, flavors, and fullness without moralizing food. It can support a healthier relationship with eating for some people—but it is not a substitute for eating-disorder treatment when restriction, bingeing, or body distress dominates.',
    takeaways: [
      'Mindful eating focuses on awareness, not restriction or weight goals.',
      'Removing distractions at some meals helps notice cues.',
      'Judgment about "good" or "bad" foods undermines the practice.',
      'Eating disorders require specialized care beyond mindfulness alone.',
    ],
    happening:
      'You may eat on autopilot while scrolling, or swing between rigid rules and guilt.\n\nWellness culture sometimes sells mindful eating as another performance standard.',
    help:
      'Before eating, pause: Am I physically hungry, emotionally hungry, or habit eating?\n\nEat without screens sometimes; notice texture, temperature, and pace.\n\nChew slowly enough to taste—not as a rigid rule, but as an experiment.\n\nCheck mid-meal: still hungry, satisfied, or full?\n\nPractice self-compassion when mindfulness is hard; it is a skill, not a virtue test.',
    support:
      `${SUPPORT}\n\nSeek eating-disorder specialist care if you restrict, binge, purge, or obsess over weight or food.`,
    related: [
      'How do I improve my relationship with food?',
      'How do I stop emotional eating?',
      'How do I know if I have an eating disorder?',
      'How do I practice self-compassion?',
      'How do I manage body image distress?',
    ],
    schemaAnswer:
      'Practice mindful eating by noticing hunger and fullness, reducing distractions at meals, eating without moralizing food, and seeking specialized care if disordered eating patterns appear.',
    themes: ['Mindful eating', 'Body relationship', 'Hunger cues', 'Self-compassion'],
    gaps: ['Mindful eating research is mixed; content stays general awareness-based guidance.'],
    notes: 'Flag ED; no weight-loss framing; NEDA-style referral in support.',
  }),
  'how-do-i-prepare-for-my-first-psychedelic-f4g7h1': draft({
    question: 'How do I prepare for my first psychedelic therapy session?',
    slug: 'how-do-i-prepare-for-my-first-psychedelic-f4g7h1',
    category: 'Identity & Self-Worth',
    title: 'Preparing for Psychedelic-Assisted Therapy',
    meta: 'Licensed psychedelic-assisted therapy involves medical screening, preparation sessions, supervised dosing, and integration—not DIY use.',
    summary:
      'Psychedelic-assisted therapy in legal clinical settings includes thorough medical and psychological screening, preparation with trained providers, supervised sessions, and integration afterward. Preparation means honest disclosure about health history, setting intentions with your team, and planning rest and support around the experience.',
    takeaways: [
      'Legal psychedelic therapy occurs only in approved clinical settings with trained staff.',
      'Medical and psychiatric screening is essential—not optional.',
      'Preparation sessions clarify intentions, fears, and support plans.',
      'Integration afterward helps apply insights safely to daily life.',
    ],
    happening:
      'You may feel hopeful, nervous, or uncertain about what a session involves.\n\nOnline hype can oversimplify risks and the importance of clinical oversight.',
    help:
      'Complete all screening honestly—medications, heart conditions, and psychosis history matter.\n\nAttend preparation sessions; ask every question you have.\n\nArrange a trusted person for post-session support and rest.\n\nAvoid DIY or recreational use as a substitute for clinical protocols.\n\nPlan integration follow-ups to process emotions and behavioral changes gradually.',
    support:
      `${SUPPORT}\n\nSeek urgent psychiatric care if you have mania, psychosis symptoms, or feel destabilized—psychedelic therapy is not appropriate for everyone.`,
    related: [
      'How do I integrate psychedelic experiences into daily life?',
      'How do I prepare for my first therapy session?',
      'How do I find a therapist who feels safe?',
      'How do I manage anxiety before medical procedures?',
      'How do I know if therapy is working?',
    ],
    schemaAnswer:
      'Prepare for psychedelic-assisted therapy with full clinical screening, preparation sessions, supervised care, post-session support, and planned integration—not unsupervised use.',
    themes: ['Psychedelic therapy', 'Clinical preparation', 'Integration', 'Safety'],
    gaps: ['U.S. public health guidance on psychedelic therapy is evolving; content reflects general clinical safety principles.'],
    notes: 'No substance sourcing or dosing; clinical-only framing; psychosis/mania flag.',
  }),
  'how-do-i-prepare-for-my-first-therapy-se-186032-047': draft({
    question: 'How do I prepare for my first therapy session?',
    slug: 'how-do-i-prepare-for-my-first-therapy-se-186032-047',
    category: 'Therapy Navigation',
    title: 'Preparing for Your First Therapy Session',
    meta: 'First sessions are for rapport, logistics, and sharing what brought you in—you do not need a polished story or all the answers.',
    summary:
      'The first therapy session can feel intimidating, but its main job is establishing fit, reviewing confidentiality and logistics, and giving your therapist a starting picture of what you need. You do not have to perform or unpack your entire history in hour one.',
    takeaways: [
      'First sessions focus on fit, goals, and logistics—not instant fixes.',
      'You can bring notes or simply describe what feels most pressing.',
      'Ask about approach, confidentiality, and session structure.',
      'It is okay if the first therapist is not the final fit.',
    ],
    happening:
      'You may worry about being judged, crying, or not knowing what to say.\n\nInsurance, cost, and scheduling questions can add stress before you even arrive.',
    help:
      'Write a few bullet points: why now, main symptoms, what you hope for.\n\nList medications and prior therapy—helpful but not required day one.\n\nPrepare questions: their approach, experience with your issue, cancellation policy.\n\nPlan buffer time before/after so you are not rushed.\n\nRemember awkward first sessions happen; give it two or three tries before deciding on fit.',
    support:
      `${SUPPORT}\n\nSwitch providers if you feel unsafe, disrespected, or repeatedly unheard.`,
    related: [
      'How do I find a therapist who feels safe?',
      'How do I know if my therapist is right for me?',
      'How do I get the most out of therapy?',
      'How do I talk to my therapist when I feel stuck?',
      'How do I afford therapy without insurance?',
    ],
    schemaAnswer:
      'Prepare for a first therapy session with brief notes on why you are seeking help, questions about approach and logistics, and openness to evaluating fit over a few sessions.',
    themes: ['Therapy navigation', 'First session', 'Therapist fit', 'Preparation'],
    notes: 'No insurance/legal depth; encourage fit evaluation.',
  }),
  'how-do-i-protect-my-children-from-my-own-mental-health-struggles': draft({
    question: 'How do I protect my children from my own mental health struggles?',
    slug: 'how-do-i-protect-my-children-from-my-own-mental-health-struggles',
    category: 'Inner Child & Parenting',
    title: 'Parenting While Managing Your Mental Health',
    meta: 'You cannot shield children from all stress—but treatment, repair, and age-appropriate honesty protect them better than perfect performance.',
    summary:
      'Parents often fear their depression, anxiety, or other struggles will harm their children. Treatment, supportive co-parenting or family help, and age-appropriate honesty usually protect kids better than hiding everything or striving for flawless composure. Repair after hard moments matters deeply.',
    takeaways: [
      'Getting treatment is one of the best ways to protect your children.',
      'Kids benefit from honest, age-appropriate explanations—not scary details.',
      'Repair after yelling, withdrawal, or tears teaches resilience.',
      'You do not have to parent alone—support systems help the whole family.',
    ],
    happening:
      'Guilt may tell you that struggling makes you a bad parent.\n\nChildren may sense tension even when you try to hide every symptom.',
    help:
      'Prioritize your treatment plan—therapy, psychiatry, support groups as recommended.\n\nUse simple language with kids: "Mom is working with a doctor on big feelings."\n\nBuild reliable routines where possible; predictability helps children feel safe.\n\nApologize and reconnect after hard moments; name what you will do differently.\n\nEnlist trusted adults so children have other stable attachments.',
    support:
      `${SUPPORT}\n\nSeek urgent help for suicidal thoughts or inability to keep children safe; child protective resources if neglect or abuse is a concern.`,
    related: [
      'How do I talk to my kids about mental illness?',
      'How do I manage parenting with depression?',
      'How do I repair with my child after I lost my temper?',
      'How do I find affordable therapy as a parent?',
      'How do I cope with parental guilt?',
    ],
    schemaAnswer:
      'Protect children while struggling by pursuing treatment, using age-appropriate honesty, maintaining routines, repairing after hard moments, and building family support.',
    themes: ['Parenting', 'Mental health', 'Repair', 'Family communication'],
    notes: 'Avoid implying children cause parent illness; CPS mention only for safety context.',
  }),
  'how-do-i-rebuild-emotional-intimacy-after-a-betrayal': draft({
    question: 'How do I rebuild emotional intimacy after a betrayal?',
    slug: 'how-do-i-rebuild-emotional-intimacy-after-a-betrayal',
    category: 'General Mental Health',
    title: 'Rebuilding Emotional Intimacy After Betrayal',
    meta: 'Emotional intimacy after betrayal rebuilds slowly through safety, honest repair, and often professional guidance—not rushed forgiveness.',
    summary:
      'Betrayal shatters trust and the felt safety that emotional intimacy requires. Rebuilding means understanding what happened, establishing new transparency, tolerating grief and anger, and deciding together—often with therapy—whether the relationship can hold honest vulnerability again.',
    takeaways: [
      'Emotional intimacy requires safety; betrayal removes it abruptly.',
      'The betrayed partner sets the pace for reopening vulnerability.',
      'Repair includes specific accountability, not vague apologies.',
      'Some relationships rebuild; others end—both can be valid outcomes.',
    ],
    happening:
      'You may swing between longing for closeness and guarding your heart.\n\nSuperficial harmony without processed hurt can feel lonelier than conflict.',
    help:
      'Name the betrayal clearly; avoid minimizing or rushing "moving on."\n\nThe responsible party offers consistent transparency and patience with triggers.\n\nUse couples therapy focused on affair recovery or betrayal trauma when both commit.\n\nPractice small bids for connection—check-ins, shared time—without forcing deep talks early.\n\nIndividual therapy supports each person\'s grief and boundaries.',
    support:
      `${SUPPORT}\n\nSeek individual support if betrayal involves coercion, abuse, or you fear for your safety.`,
    related: [
      'How do I rebuild trust after someone betrayed me?',
      'How do I rebuild intimacy after infidelity or betrayal?',
      'How do I know if my relationship is worth fighting for?',
      'How do I cope with betrayal trauma?',
      'How do I find a couples therapist after infidelity?',
    ],
    schemaAnswer:
      'Rebuild emotional intimacy after betrayal through accountable repair, betrayed-partner pacing, professional support, and gradual honest connection—not forced forgiveness.',
    themes: ['Betrayal', 'Emotional intimacy', 'Trust repair', 'Couples therapy'],
    notes: 'No guarantee of reconciliation; abuse caveat.',
  }),
  'how-do-i-rebuild-intimacy-after-infidelity-or-betrayal': draft({
    question: 'How do I rebuild intimacy after infidelity or betrayal?',
    slug: 'how-do-i-rebuild-intimacy-after-infidelity-or-betrayal',
    category: 'General Mental Health',
    title: 'Rebuilding Intimacy After Infidelity',
    meta: 'Physical and emotional intimacy return slowly after infidelity—transparency, grief, and therapy support repair better than pressure or secrecy.',
    summary:
      'Infidelity breaks trust in ways that affect both emotional and physical closeness. Rebuilding intimacy usually requires ending the affair fully, transparent accountability, space for the hurt partner\'s grief, and often structured couples therapy—not skipping straight to normal sex to prove things are fine.',
    takeaways: [
      'Intimacy cannot be rushed after infidelity; trust precedes closeness.',
      'Full disclosure and ending contact with affair partners are baseline steps.',
      'The hurt partner controls the pace of physical reconnection.',
      'Couples therapy specialized in infidelity supports structured repair.',
    ],
    happening:
      'You may want to prove love through sex while your partner still feels unsafe.\n\nTriggers—places, phones, anniversaries—can flare long after discovery.',
    help:
      'Ensure the affair has fully ended with verifiable transparency.\n\nAllow grief, anger, and questions without defensiveness from the unfaithful partner.\n\nRebuild non-sexual affection first: time, conversation, reliability.\n\nDiscuss boundaries around devices, contact, and disclosure with therapist support.\n\nReintroduce physical intimacy gradually when the hurt partner feels ready—not before.',
    support:
      `${SUPPORT}\n\nSeek individual therapy if infidelity coexists with abuse, coercion, or unsafe home dynamics.`,
    related: [
      'How do I rebuild trust after my partner cheated?',
      'How do I rebuild emotional intimacy after a betrayal?',
      'How do I know if my marriage is worth saving?',
      'How do I cope with triggers after infidelity?',
      'How do I find affair-recovery counseling?',
    ],
    schemaAnswer:
      'Rebuild intimacy after infidelity by ending the affair, practicing transparent accountability, grieving at the hurt partner\'s pace, and using specialized couples therapy before rushing physical closeness.',
    themes: ['Infidelity', 'Intimacy repair', 'Trust', 'Couples therapy'],
    notes: 'Near-duplicate slugs in corpus; cross-link at publish.',
  }),
  'how-do-i-rebuild-intimacy-in-my-relationship': draft({
    question: 'How do I rebuild intimacy in my relationship?',
    slug: 'how-do-i-rebuild-intimacy-in-my-relationship',
    category: 'Relationships & Communication',
    title: 'Rebuilding Intimacy in Your Relationship',
    meta: 'Intimacy fades for many reasons—stress, resentment, life stages. Rebuild with communication, quality time, and addressing underlying disconnection.',
    summary:
      'Intimacy often erodes gradually through busy schedules, unresolved conflict, parenting stress, or emotional distance—not always betrayal. Rebuilding usually means naming the drift, prioritizing undistracted connection, and addressing resentment or unmet needs that block closeness.',
    takeaways: [
      'Intimacy includes emotional, physical, and everyday closeness.',
      'Unresolved conflict and resentment block connection silently.',
      'Small consistent rituals beat occasional grand gestures.',
      'Professional help speeds repair when you feel stuck.',
    ],
    happening:
      'You may feel like roommates—polite but distant.\n\nOne partner may want more closeness while the other feels pressured or exhausted.',
    help:
      'Talk openly about feeling distant without blame attacks.\n\nSchedule regular time together without phones or kids when possible.\n\nShare appreciations and bids for affection daily.\n\nAddress specific resentments in therapy or structured conversations.\n\nExplore whether health, depression, or stress affects libido or connection—medical checkups can help.',
    support:
      `${SUPPORT}\n\nSeek couples therapy if distance persists despite effort, or if control or fear appear.`,
    related: [
      'How do I improve communication with my partner?',
      'How do I rebuild emotional intimacy after a betrayal?',
      'How do I reconnect with my partner after having kids?',
      'How do I overcome sexual anxiety and performance pressure?',
      'How do I find couples counseling?',
    ],
    schemaAnswer:
      'Rebuild relationship intimacy by naming disconnection, creating phone-free time together, sharing daily appreciations, resolving resentment, and seeking couples therapy when stuck.',
    themes: ['Intimacy', 'Connection', 'Communication', 'Relationship repair'],
    notes: 'General intimacy—not infidelity-specific; cross-link betrayal slugs.',
  }),
  'how-do-i-rebuild-my-confidence-after-a-major-failure': draft({
    question: 'How do I rebuild my confidence after a major failure?',
    slug: 'how-do-i-rebuild-my-confidence-after-a-major-failure',
    category: 'Identity & Self-Worth',
    title: 'Confidence After a Major Failure',
    meta: 'Failure hurts self-trust—rebuild with honest review, self-compassion, small wins, and support rather than harsh self-punishment.',
    summary:
      'A major failure—job loss, business collapse, public mistake—can shake identity and confidence. Recovery usually blends grieving the loss, extracting lessons without excessive self-blame, taking small forward steps, and reconnecting with people who reflect your worth beyond one outcome.',
    takeaways: [
      'Failure is an event, not a permanent identity—though it can feel that way.',
      'Self-compassion supports learning better than harsh self-criticism.',
      'Small completed actions rebuild self-trust incrementally.',
      'Support and perspective from others counter isolation and shame.',
    ],
    happening:
      'You may replay the failure obsessively or avoid anything that risks another miss.\n\nImposter feelings and shame can generalize from one domain to your whole self.',
    help:
      'Allow grief and disappointment before forcing silver linings.\n\nWrite what was in vs out of your control; focus lessons on what you can change.\n\nSet one small achievable goal this week to rebuild momentum.\n\nLimit rumination with scheduled "worry time" then redirect.\n\nWork with a therapist if failure triggers depression or paralysis.',
    support:
      `${SUPPORT}\n\nSeek help if failure leads to suicidal thoughts, substance escalation, or months of inability to function.`,
    related: [
      'How do I overcome imposter syndrome?',
      'How do I rebuild confidence after a relationship that made me feel small?',
      'How do I cope with shame?',
      'How do I practice self-compassion?',
      'How do I find motivation after a setback?',
    ],
    schemaAnswer:
      'Rebuild confidence after failure by grieving the loss, learning without excessive blame, taking small forward steps, seeking support, and using therapy if shame becomes debilitating.',
    themes: ['Failure', 'Self-confidence', 'Self-compassion', 'Resilience'],
    notes: 'Avoid toxic positivity; validate real losses.',
  }),
  'how-do-i-rebuild-my-confidence-after-a-r-181083-086': draft({
    question: 'How do I rebuild my confidence after a relationship that made me feel small?',
    slug: 'how-do-i-rebuild-my-confidence-after-a-r-181083-086',
    category: 'Identity & Self-Worth',
    title: 'Confidence After a Diminishing Relationship',
    meta: 'Relationships that criticize, control, or shrink you erode self-worth—rebuild with distance, truth-telling, and supportive connections.',
    summary:
      'Partners who belittle, compare, or control can leave you doubting your judgment and value long after the relationship ends. Rebuilding confidence often requires physical and emotional distance, challenging internalized criticism, and surrounding yourself with people who reflect your strengths accurately.',
    takeaways: [
      'Chronic criticism in relationships can feel like truth—it often is not.',
      'Distance from the diminishing partner aids clarity and healing.',
      'Reconnecting with pre-relationship strengths helps restore identity.',
      'Therapy supports untangling trauma bonds and self-blame.',
    ],
    happening:
      'You may hear their voice in your head long after leaving.\n\nApologizing for existing or shrinking yourself may feel automatic.',
    help:
      'Limit contact with ex-partners who reopen wounds when possible.\n\nList qualities you had before them and strengths others still see.\n\nChallenge thoughts: Would I say this to a friend?\n\nRebuild activities and friendships that remind you who you are.\n\nConsider therapy for emotional abuse recovery or trauma bonding patterns.',
    support:
      `${SUPPORT}\n\nSeek support if the relationship involved abuse, stalking, or you fear returning—safety planning comes first.`,
    related: [
      'How do I rebuild self-esteem after toxic love?',
      'How do I know if my relationship was emotionally abusive?',
      'How do I trust my judgment again?',
      'How do I stop people-pleasing?',
      'How do I find a therapist for relationship trauma?',
    ],
    schemaAnswer:
      'Rebuild confidence after a diminishing relationship with distance, challenging internalized criticism, supportive connections, identity-rebuilding activities, and therapy for abuse recovery when needed.',
    themes: ['Self-worth', 'Emotional abuse', 'Recovery', 'Identity'],
    flags: ['relationship-safety'],
    notes: 'Abuse/safety caveat; overlap with toxic relationship content.',
  }),
  'how-do-i-rebuild-trust-after-being-cheat-190648-010': draft({
    question: 'How do I rebuild trust after being cheated on?',
    slug: 'how-do-i-rebuild-trust-after-being-cheat-190648-010',
    category: 'Relationships & Divorce',
    title: 'Rebuilding Trust After Being Cheated On',
    meta: 'Trust after infidelity rebuilds slowly through full accountability, transparency, and the hurt partner\'s timeline—not quick promises.',
    summary:
      'Being cheated on can shatter self-worth and your model of the relationship. Rebuilding trust—if you choose to stay—requires the unfaithful partner\'s sustained accountability, verifiable transparency, and patience with your triggers. Leaving is also a valid choice if trust cannot return.',
    takeaways: [
      'Being cheated on is not your fault; trust broke on their side.',
      'Rebuilding requires ending the affair and consistent honesty.',
      'You set the pace; triggers can last months or longer.',
      'Staying or leaving both deserve support without judgment.',
    ],
    happening:
      'You may obsess over details, compare yourself to the affair partner, or numb out.\n\nPromises to "never again" without changed behavior reopen wounds.',
    help:
      'Allow anger and grief without rushing forgiveness.\n\nRequire full disclosure and no ongoing contact with affair partners.\n\nAsk for transparency that feels sufficient to you—phones, schedules, therapy.\n\nUse individual therapy for betrayal trauma; couples therapy if both commit to repair.\n\nEvaluate whether behavior matches words over months, not days.',
    support:
      `${SUPPORT}\n\nSeek support if infidelity occurs with abuse, financial control, or fear for safety.`,
    related: [
      'How do I rebuild trust after my partner cheated?',
      'How do I rebuild intimacy after infidelity or betrayal?',
      'How do I know if my marriage is worth saving?',
      'How do I cope with obsessive thoughts after infidelity?',
      'How do I leave a relationship after cheating?',
    ],
    schemaAnswer:
      'Rebuild trust after being cheated on through ending the affair, sustained accountability, hurt-partner pacing, transparency, and therapy—or choose to leave if trust cannot be restored.',
    themes: ['Infidelity', 'Betrayal trauma', 'Trust', 'Accountability'],
    notes: 'Category preserved (Relationships & Divorce); cross-link duplicate trust slugs.',
  }),
  'how-do-i-rebuild-trust-after-my-partner-cheated': draft({
    question: 'How do I rebuild trust after my partner cheated?',
    slug: 'how-do-i-rebuild-trust-after-my-partner-cheated',
    category: 'Relationships & Communication',
    title: 'Trust After Your Partner Cheated',
    meta: 'Trust repair after cheating needs ending the affair, honest accountability, and time—promises alone rarely restore safety.',
    summary:
      'Cheating destroys the predictability trust requires. Whether you stay or go, healing starts with facing what happened honestly. If you attempt repair, the unfaithful partner must demonstrate change through actions—transparency, therapy, and respect for your timeline—not pressure to "get over it."',
    takeaways: [
      'Trust is rebuilt in small consistent actions over time.',
      'The unfaithful partner must carry the labor of repair early on.',
      'Forgiveness is optional and separate from deciding to stay.',
      'Professional support helps both partners navigate repair or separation.',
    ],
    happening:
      'You may test trust constantly or feel numb to protect from more pain.\n\nFamily or friends may push reconciliation or exit faster than you want.',
    help:
      'Confirm the affair has fully ended; ask what accountability looks like to you.\n\nSet boundaries on contact, devices, and disclosure with therapist guidance.\n\nTrack whether apologies match changed behavior over weeks and months.\n\nProtect yourself from details that fuel obsession if they harm more than help.\n\nConsider discernment counseling if you are unsure about staying.',
    support:
      `${SUPPORT}\n\nSeek individual therapy for betrayal trauma; prioritize safety if coercion or violence is present.`,
    related: [
      'How do I rebuild trust after being cheated on?',
      'How do I rebuild trust after someone betrayed me?',
      'How do I know when it is time to end a relationship?',
      'How do I find affair-recovery therapy?',
      'How do I manage triggers after discovering infidelity?',
    ],
    schemaAnswer:
      'Rebuild trust after a partner cheats by verifying the affair ended, requiring accountable actions, setting transparency boundaries, and using therapy—while honoring your timeline and option to leave.',
    themes: ['Infidelity', 'Trust repair', 'Accountability', 'Betrayal trauma'],
    notes: 'Near-duplicate of cheated-on slug; ensure cross-linking.',
  }),
  'how-do-i-rebuild-trust-after-someone-bet-186032-034': draft({
    question: 'How do I rebuild trust after someone betrayed me?',
    slug: 'how-do-i-rebuild-trust-after-someone-bet-186032-034',
    category: 'Relationships & Communication',
    title: 'Rebuilding Trust After Betrayal',
    meta: 'Trust after betrayal—affair, lie, or broken confidence—returns slowly through accountability and consistent behavior, if you choose to reconnect at all.',
    summary:
      'Betrayal teaches your nervous system that this person—or people like them—may not be safe. Rebuilding trust, when you want to, requires understanding what happened, clear accountability from the betrayer, and changed behavior over time. You may also choose distance instead of repair—and that is valid.',
    takeaways: [
      'Betrayal changes trust at a nervous-system level—not just logically.',
      'Repair requires specific accountability, not generic apologies.',
      'You decide whether reconciliation is worth attempting.',
      'Trust in yourself can rebuild even when trust in them does not.',
    ],
    happening:
      'You may hypervigilantly scan for lies or withdraw from everyone.\n\nPressure to forgive quickly can silence legitimate anger and boundary-setting.',
    help:
      'Name the betrayal and what you need for safety—clarity, space, transparency.\n\nWatch for changed behavior over time, not eloquent remorse alone.\n\nRebuild self-trust: note when your instincts were right and honor them.\n\nUse therapy to process betrayal trauma regardless of staying or leaving.\n\nAccept that some relationships end—and trust can redirect toward healthier bonds.',
    support:
      `${SUPPORT}\n\nSeek support if betrayal involves abuse, stalking, or ongoing harm—safety may require ending contact.`,
    related: [
      'How do I rebuild trust after my partner cheated?',
      'How do I rebuild emotional intimacy after a betrayal?',
      'How do I cope with betrayal trauma?',
      'How do I know when to end a friendship?',
      'How do I trust my judgment again?',
    ],
    schemaAnswer:
      'Rebuild trust after betrayal with clear accountability, observed behavior change over time, self-trust repair, and therapy—while accepting that ending the relationship may be the healthiest choice.',
    themes: ['Betrayal', 'Trust', 'Accountability', 'Boundaries'],
    notes: 'Broader than infidelity-only slugs; cross-link specialized articles.',
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
  'reports/enrichment-corpus/draft-answers/batch-20-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-20-drafts.json`);
