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
const GRIEF = {
  title: 'Coping with Grief and Loss',
  url: 'https://www.nimh.nih.gov/health/publications/coping-with-grief-and-loss',
  publisher: 'NIMH',
  note: 'Supports understanding grief as a personal, non-linear process.',
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
  readFileSync('reports/enrichment-corpus/batches/batch-21-input.json', 'utf8'),
);

const contentBySlug = {
  'how-do-i-stop-procrastinating-when-im-afraid-of-no-187459-013': draft({
    question: "How do I stop procrastinating when I'm afraid of not doing something perfectly?",
    slug: 'how-do-i-stop-procrastinating-when-im-afraid-of-no-187459-013',
    category: 'Perfectionism & Control Issues',
    title: 'Perfectionist Procrastination',
    meta: 'Fear of imperfection can block starting entirely—set "good enough" standards, break tasks into steps, and focus on beginning rather than finishing perfectly.',
    summary:
      'Perfectionist procrastination creates a painful loop: fear of not doing something perfectly prevents starting, which leads to rushed last-minute work and reinforces the belief you cannot do things well. Breaking the cycle means changing your relationship with both perfection and productivity.',
    takeaways: [
      'Perfectionist procrastination often produces worse outcomes than "good enough" work.',
      'Not every task requires masterpiece-level effort.',
      'Starting for 15 minutes often overcomes initial resistance.',
      'Done is usually better than endlessly polished and never finished.',
    ],
    happening:
      'You may delay starting because the imagined result must meet an impossible standard.\n\nPast criticism or high expectations can wire mistakes as evidence of failure rather than learning.',
    help:
      'Define "good enough" standards by task type—not everything needs your best.\n\nBreak projects into small, manageable steps that feel less intimidating.\n\nCommit to 15 minutes of work; continuing often follows once you begin.\n\nUse time limits to prevent endless tweaking and revision.\n\nReframe "It has to be perfect" as "It has to serve its purpose."\n\nShip a first draft knowing you can improve after completion.',
    support:
      `${SUPPORT}\n\nSeek therapy if perfectionism drives chronic avoidance, academic or job failure, or severe anxiety about performance.`,
    related: [
      'How do I stop my perfectionism from ruining my life?',
      'How do I manage anxiety about making mistakes?',
      'How do I stop overthinking everything?',
      'How do I stop feeling like I am not doing enough?',
      'How do I manage stress when I cannot change my situation?',
    ],
    schemaAnswer:
      'Stop perfectionist procrastination by setting good-enough standards, breaking tasks into steps, focusing on starting with time limits, and accepting that done beats endlessly perfect.',
    themes: ['Perfectionism', 'Procrastination', 'Productivity', 'Anxiety'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-stop-replaying-arguments-and-angry-moment-186602-008': draft({
    question: 'How do I stop replaying arguments and angry moments in my head?',
    slug: 'how-do-i-stop-replaying-arguments-and-angry-moment-186602-008',
    category: 'Anger & Emotional Regulation',
    title: 'Replaying Arguments in Your Head',
    meta: 'Mental replay of conflicts keeps your nervous system activated—interrupt rumination with grounding, actionable plans, or acceptance when resolution is not possible.',
    summary:
      'Replaying arguments feels like problem-solving but usually reinforces anger and prevents emotional healing. Your brain rehearses different responses while your body stays stuck in fight mode. Recognizing rumination and redirecting attention breaks the cycle.',
    takeaways: [
      'Replaying conflicts rarely leads to resolution—it prolongs distress.',
      'Ask whether the mental replay is helping or torturing you.',
      'Grounding techniques return attention to the present moment.',
      'Actionable next steps give your brain permission to stop rehearsing.',
    ],
    happening:
      'You may loop through what you said, what they said, and better comebacks you wish you had delivered.\n\nYour nervous system stays activated as if the argument were still happening.',
    help:
      'Catch rumination early: "Is this thinking solving anything?"\n\nUse grounding—name five things you see, four you feel, three you hear.\n\nMove your body: walk, stretch, or change rooms to interrupt the loop.\n\nIf action is possible, write one concrete step and schedule it.\n\nFor unresolvable conflicts, practice acceptance and letting go.\n\nJournal briefly to process, then close the notebook as a closure ritual.',
    support:
      `${SUPPORT}\n\nSeek therapy if conflict rumination disrupts sleep, fuels rage, or consumes hours of mental energy daily.`,
    related: [
      'How do I stop myself from saying hurtful things when I am angry?',
      'How do I manage anger in relationships?',
      'How do I stop ruminating about past mistakes?',
      'How do I regulate my emotions during conflict?',
      'How do I stop overthinking every conversation I have?',
    ],
    schemaAnswer:
      'Stop replaying arguments by recognizing rumination, using grounding and movement, scheduling actionable follow-ups when possible, and practicing acceptance for unresolvable conflicts.',
    themes: ['Rumination', 'Anger', 'Conflict', 'Emotional regulation'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-stop-ruminating-about-past-mist-177940-021': draft({
    question: 'How do I stop ruminating about past mistakes?',
    slug: 'how-do-i-stop-ruminating-about-past-mist-177940-021',
    category: 'Mental Health',
    title: 'Ruminating About Past Mistakes',
    meta: 'Rumination traps you in a mental loop that prevents learning—acknowledge the pattern, extract lessons without self-blame, and redirect to present actions.',
    summary:
      'Ruminating about past mistakes replays painful scenarios without resolution. It often stems from perfectionism or the belief that enough thinking could change what happened. The irony is that rumination makes you feel worse and less capable of learning from experience.',
    takeaways: [
      'Rumination feels productive but rarely produces new insight.',
      'Everyone makes mistakes—they are part of being human.',
      'Useful lessons can be extracted without endless self-punishment.',
      'Self-forgiveness frees energy for present-moment action.',
    ],
    happening:
      'You may replay embarrassing or harmful moments on loop, searching for what you should have done differently.\n\nPerfectionism and anxiety can make mistakes feel like permanent evidence of unworthiness.',
    help:
      'Label rumination without judgment: "I notice I am ruminating again."\n\nAsk: "Is this thinking helping me right now?"\n\nExtract one lesson, then consciously redirect attention.\n\nPractice self-forgiveness as you would for a close friend.\n\nUse grounding or mindfulness to return to the present.\n\nTake one small constructive action related to growth—not penance.',
    support:
      `${SUPPORT}\n\nSeek therapy if rumination fuels depression, insomnia, or obsessive guilt that will not resolve.`,
    related: [
      'How do I stop replaying arguments and angry moments in my head?',
      'How do I stop being so hard on myself?',
      'How do I practice self-forgiveness?',
      'How do I stop overthinking everything?',
      'How do I manage anxiety without medication?',
    ],
    schemaAnswer:
      'Stop ruminating about past mistakes by labeling the pattern, extracting one lesson without self-blame, practicing self-forgiveness, and redirecting to present-moment actions.',
    themes: ['Rumination', 'Self-forgiveness', 'Perfectionism', 'Mindfulness'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-stop-seeking-validation-from-others': draft({
    question: 'How do I stop seeking validation from others?',
    slug: 'how-do-i-stop-seeking-validation-from-others',
    category: 'General Mental Health',
    title: 'Seeking Validation From Others',
    meta: 'Excessive need for external approval drains authenticity—build internal validation, tolerate discomfort without immediate affirmation, and align choices with your values.',
    summary:
      'Some external feedback is healthy, but depending on others\' approval for self-worth leaves you anxious and inauthentic. Validation-seeking often stems from conditional acceptance in the past. Building internal recognition of your efforts and tolerating disapproval loosens the grip.',
    takeaways: [
      'Validation-seeking often reflects low self-esteem or fear of rejection.',
      'Internal validation reduces dependence on others\' moods and opinions.',
      'Your own assessment of your worth is equally valid as others\' feedback.',
      'Tolerating discomfort without immediate approval builds independence.',
    ],
    happening:
      'You may constantly check reactions, need praise to feel okay, or change yourself to fit what others seem to want.\n\nConditional love or harsh criticism in the past can wire approval as safety.',
    help:
      'Notice when and why you seek validation—situations, people, and feelings involved.\n\nAcknowledge your own efforts and strengths without waiting for others.\n\nChoose a few trusted people for feedback rather than polling everyone.\n\nMake decisions aligned with your values, not universal approval.\n\nPractice tolerating others\' disappointment without rushing to fix it.\n\nFocus on intrinsic motivation—doing things because they matter to you.',
    support:
      `${SUPPORT}\n\nSeek therapy if validation-seeking drives social avoidance, people-pleasing, or depression.`,
    related: [
      'How do I stop being a people pleaser?',
      'How do I stop caring so much about what others think of me?',
      'How do I build self-esteem?',
      'How do I stop feeling like I need everyone to like me?',
      'How do I stop comparing my life to what I see on social media?',
    ],
    schemaAnswer:
      'Stop seeking validation by building internal recognition of your worth, limiting feedback to trusted people, aligning choices with values, and practicing tolerance for disapproval.',
    themes: ['Validation seeking', 'Self-worth', 'Approval', 'Authenticity'],
  }),
  'how-do-i-stop-stalking-my-ex-on-social-m-181083-090': draft({
    question: 'How do I stop stalking my ex on social media?',
    slug: 'how-do-i-stop-stalking-my-ex-on-social-m-181083-090',
    category: 'Relationships & Divorce',
    title: 'Stopping Social Media Stalking of an Ex',
    meta: 'Checking an ex\'s profiles reopens wounds and delays healing—block or unfollow, remove app triggers, and redirect urges into supportive activities.',
    summary:
      'Social media stalking after a breakup is common but harmful. Each profile check reopens emotional wounds and prevents moving forward. Creating friction between you and their online presence—blocking, unfollowing, or removing apps—protects your healing.',
    takeaways: [
      'Each check of an ex\'s profile delays emotional recovery.',
      'Blocking or unfollowing is self-protection, not pettiness.',
      'Urges to check often pass if you redirect energy elsewhere.',
      'Healing requires distance from constant updates about their life.',
    ],
    happening:
      'You may tell yourself you will just peek once, then spiral through photos, new partners, or posts.\n\nCuriosity and hope for reconciliation can fuel compulsive checking despite the pain it causes.',
    help:
      'Block or unfollow on all platforms—even if it feels dramatic.\n\nRemove social apps from your phone or ask a friend to change passwords temporarily.\n\nWhen urges hit, call someone, exercise, or engage a hobby immediately.\n\nDelete saved photos and old message threads that trigger checking.\n\nSet a "no contact" period including digital contact.\n\nRemind yourself: what you see online is curated, not the full story.',
    support:
      `${SUPPORT}\n\nSeek therapy if stalking behavior persists for months, fuels obsession, or triggers depression or self-harm thoughts.`,
    related: [
      'How do I get over a breakup when I still love them?',
      'How do I stop comparing everyone I meet to my ex?',
      'How long should it take me to get over a breakup?',
      'How do I stop idealizing my ex?',
      'How do I heal from a painful breakup?',
    ],
    schemaAnswer:
      'Stop stalking an ex on social media by blocking or unfollowing, removing app triggers, redirecting urges into supportive activities, and maintaining no-contact including digital contact.',
    themes: ['Breakup recovery', 'Social media', 'No contact', 'Healing'],
  }),
  'how-do-i-stop-worrying-about-things-i-cant-c-177941-027': draft({
    question: "How do I stop worrying about things I can't control?",
    slug: 'how-do-i-stop-worrying-about-things-i-cant-c-177941-027',
    category: 'Anxiety Management',
    title: 'Worrying About What You Cannot Control',
    meta: 'Worry about uncontrollable events wastes mental energy—identify your sphere of influence, take action where you can, and practice acceptance elsewhere.',
    summary:
      'Worrying about things you cannot control creates the illusion of doing something while draining resources for what you can influence. Anxiety, perfectionism, or past helplessness often drive this mental vigilance. Separating controllable from uncontrollable frees energy for effective action.',
    takeaways: [
      'Worry about uncontrollable events rarely prevents bad outcomes.',
      'Mental energy spent worrying reduces capacity for useful action.',
      'Acceptance is not resignation—it is redirecting effort wisely.',
      'Grounding returns attention from hypothetical futures to the present.',
    ],
    happening:
      'You may worry about loved ones\' safety, others\' opinions, global events, or outcomes that depend on factors outside your influence.\n\nPast experiences of helplessness can make mental vigilance feel like the only protection available.',
    help:
      'Draw two columns: what you can control vs. what you cannot.\n\nFor controllable items, make a plan and take one small action.\n\nFor uncontrollable items, practice acceptance and redirect attention.\n\nAsk: "Is this worry helping me or just activating my nervous system?"\n\nUse grounding or mindfulness to anchor in the present moment.\n\nLimit news or social media that fuels uncontrollable worry spirals.',
    support:
      `${SUPPORT}\n\nSeek therapy if uncontrollable worry fuels panic attacks, insomnia, or inability to function daily.`,
    related: [
      'How do I manage the anxiety of uncertainty?',
      'How do I stop catastrophizing every small problem?',
      'How do I manage anxiety without medication?',
      'How do I stop overthinking everything?',
      'How does meditation help with anxiety?',
    ],
    schemaAnswer:
      'Stop worrying about uncontrollable events by separating your sphere of influence from what you cannot change, taking action where possible, and practicing acceptance with grounding for the rest.',
    themes: ['Worry', 'Control', 'Acceptance', 'Anxiety'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-support-a-friend-who-is-grievin-185387-008': draft({
    question: 'How do I support a friend who is grieving?',
    slug: 'how-do-i-support-a-friend-who-is-grievin-185387-008',
    category: 'Grief & Loss',
    title: 'Supporting a Grieving Friend',
    meta: 'Show up consistently, listen without fixing, offer practical help, and remember grief has no timeline—check in long after the funeral.',
    summary:
      'Supporting a grieving friend means presence over platitudes. Avoid minimizing phrases like "they are in a better place." Listen more than you speak, offer specific practical help, and continue checking in weeks and months later when others have moved on.',
    takeaways: [
      'Presence and listening matter more than finding the right words.',
      'Avoid clichés that minimize their pain or rush healing.',
      'Specific offers of help are more useful than "let me know if you need anything."',
      'Grief has no timeline—long-term check-ins show real care.',
    ],
    happening:
      'Your friend may seem fine one day and devastated the next—grief is non-linear.\n\nThey may withdraw, forget tasks, or struggle with anniversaries and holidays long after the loss.',
    help:
      'Say simply: "I am sorry for your loss" and "I am here for you."\n\nListen without trying to fix, compare, or silver-line their pain.\n\nOffer concrete help: meals, errands, childcare, or sitting together quietly.\n\nRemember important dates—birthdays, anniversaries, holidays.\n\nFollow their lead on whether they want to talk about the person who died.\n\nCheck in regularly even months later when support often drops off.',
    support:
      `${SUPPORT}\n\nEncourage your friend to seek grief counseling if they cannot function, express hopelessness, or mention self-harm; call 988 if you are concerned about their immediate safety.`,
    related: [
      'How long is it normal to grieve after losing someone?',
      'What should I say to someone who lost a loved one?',
      'How do I cope with grief after a major loss?',
      'How do I help a friend who is depressed?',
      'How do I support someone through a difficult time?',
    ],
    schemaAnswer:
      'Support a grieving friend by listening without judgment, avoiding minimizing clichés, offering specific practical help, and checking in consistently long after the initial loss.',
    themes: ['Grief support', 'Friendship', 'Listening', 'Bereavement'],
    refs: [GRIEF, NIMH],
  }),
  'how-do-i-support-a-partner-with-depression-without-burning-out': draft({
    question: 'How do I support a partner with depression without burning out?',
    slug: 'how-do-i-support-a-partner-with-depression-without-burning-out',
    category: 'Depression',
    title: 'Supporting a Partner With Depression',
    meta: 'Balance compassion with self-care—you cannot cure their depression. Set boundaries, encourage treatment, maintain your own life, and watch for caregiver burnout.',
    summary:
      'Supporting a partner with depression requires compassion without sacrificing your own wellbeing. You cannot cure their condition, and trying to do so leads to frustration and burnout for both of you. Boundaries, treatment encouragement, and maintaining your own support network protect the relationship.',
    takeaways: [
      'Depression is a medical condition—not a character flaw or choice.',
      'You cannot be their therapist; encourage professional treatment instead.',
      'Boundaries protect both partners from resentment and exhaustion.',
      'Maintaining your own life is necessary, not selfish.',
    ],
    happening:
      'You may take on extra household tasks, monitor their mood, or feel responsible for making them happy.\n\nCaregiver fatigue can build silently until resentment, anxiety, or your own depression emerges.',
    help:
      'Educate yourself about depression to respond with empathy, not frustration.\n\nEncourage professional treatment without forcing or nagging.\n\nSet specific boundaries about what you can and cannot take on.\n\nMaintain friendships, hobbies, and activities that refill your energy.\n\nListen and validate without immediately trying to fix everything.\n\nWatch for your own burnout signs: resentment, exhaustion, constant anxiety about their mood.',
    support:
      `${SUPPORT}\n\nSeek couples or individual therapy if caregiving strains the relationship, or if either partner has thoughts of self-harm.`,
    related: [
      'How do I help a partner who will not seek help for depression?',
      'How do I set boundaries in a relationship?',
      'How do I cope when my partner is depressed?',
      'How do I communicate my needs in a relationship?',
      'How do I recover from caregiver burnout?',
    ],
    schemaAnswer:
      'Support a depressed partner without burning out by encouraging professional treatment, setting clear boundaries, maintaining your own life, and seeking help when caregiver fatigue builds.',
    themes: ['Depression', 'Caregiver burnout', 'Boundaries', 'Relationships'],
    refs: [DEPRESSION, NIMH],
  }),
  'how-do-i-support-my-partner-who-is-questioning-the-186602-022': draft({
    question: 'How do I support my partner who is questioning their gender identity?',
    slug: 'how-do-i-support-my-partner-who-is-questioning-the-186602-022',
    category: 'Sexuality, Gender Identity, and Intimacy',
    title: 'Supporting a Partner Questioning Gender Identity',
    meta: 'Listen without judgment, use their preferred name and pronouns, educate yourself independently, and follow their lead on their journey.',
    summary:
      'When a partner questions their gender identity, patience, love, and willingness to learn matter most. Use their preferred name and pronouns even as they explore. Educate yourself through reputable resources rather than expecting them to teach you everything.',
    takeaways: [
      'Listen without judgment and affirm that you love them through the process.',
      'Use their preferred name and pronouns even if they change over time.',
      'Educate yourself independently—do not rely on your partner as sole teacher.',
      'It is okay to seek your own support while honoring their journey.',
    ],
    happening:
      'Your partner may feel confused, scared, or uncertain—and you may feel unsure how to respond without saying the wrong thing.\n\nChanges in expression, pronouns, or identity exploration can raise questions about your relationship\'s future.',
    help:
      'Tell them you love them and will support their authentic self.\n\nUse whatever name and pronouns they prefer now, adjusting as needed.\n\nRead books, articles, and resources from reputable LGBTQ+ organizations.\n\nFollow their lead on how much they want to share and how fast to explore.\n\nFind your own support through therapy or partner support groups if needed.\n\nAllow time for both of you to process—this is a journey, not a single conversation.',
    support:
      `${SUPPORT}\n\nSeek couples therapy with a gender-affirming provider if the process strains communication or raises relationship questions neither partner can navigate alone.`,
    related: [
      'How do I talk to my partner about difficult topics?',
      'How do I support a loved one coming out?',
      'How do I communicate my needs in a relationship?',
      'How do I cope with relationship changes?',
      'How do I find an LGBTQ-affirming therapist?',
    ],
    schemaAnswer:
      'Support a partner questioning gender identity by listening without judgment, using preferred name and pronouns, educating yourself independently, and following their lead while seeking your own support if needed.',
    themes: ['Gender identity', 'Partner support', 'LGBTQ+', 'Communication'],
    gaps: ['Verify gender-affirming care references align with editorial standards.'],
  }),
  'how-do-i-support-my-teen-through-social-media-dram-187459-005': draft({
    question: 'How do I support my teen through social media drama and cyberbullying?',
    slug: 'how-do-i-support-my-teen-through-social-media-dram-187459-005',
    category: 'Teen-Specific Questions',
    title: 'Supporting Teens Through Social Media Drama',
    meta: 'Take online conflict seriously, help set digital boundaries, teach blocking and reporting, and keep communication open without threatening phone loss.',
    summary:
      'Social media drama and cyberbullying can harm teens deeply because their social world lives online 24/7. Take their experiences seriously without dismissing conflict as trivial. Help them set boundaries, document harassment, and know they can come to you without fear of losing phone privileges.',
    takeaways: [
      'Online conflict can feel as devastating to teens as in-person bullying.',
      'Dismissing drama as "just social media" closes the door to help.',
      'Document evidence before blocking; report serious harassment to school or authorities.',
      'Fear of losing phone access often prevents teens from seeking help.',
    ],
    happening:
      'Your teen may seem withdrawn, anxious, or obsessed with their phone after online conflict.\n\nThey may fear telling you because they worry you will take their phone away—their primary social lifeline.',
    help:
      'Listen without immediately saying "just get off social media."\n\nTake screenshots of cyberbullying before blocking or reporting.\n\nHelp configure privacy settings and blocking features.\n\nInvolve school administrators for persistent bullying; contact law enforcement for threats.\n\nSet phone boundaries around sleep and homework without using phone loss as punishment for seeking help.\n\nMake clear they can come to you with online problems without automatic device confiscation.',
    support:
      `${SUPPORT}\n\nSeek school counseling, pediatric mental health care, or crisis support if cyberbullying causes self-harm thoughts, severe withdrawal, or threats; call 988 for immediate safety concerns.`,
    related: [
      'How do I talk to my teenager about mental health?',
      'How do I help my child cope with bullying?',
      'How do I set healthy screen time limits for teens?',
      'How do I know if my teen is depressed?',
      'How do I support my teen through a difficult time?',
    ],
    schemaAnswer:
      'Support teens through social media drama by taking online conflict seriously, helping with digital boundaries and documentation, reporting serious harassment, and keeping communication open without punishing help-seeking.',
    themes: ['Cyberbullying', 'Teens', 'Social media', 'Parenting'],
    flags: ['teen_safety'],
  }),
  'how-do-i-survive-a-toxic-work-environment': draft({
    question: 'How do I survive a toxic work environment?',
    slug: 'how-do-i-survive-a-toxic-work-environment',
    category: 'Work & Life Balance',
    title: 'Surviving a Toxic Work Environment',
    meta: 'Document incidents, maintain professionalism, set boundaries around time and emotional investment, and protect your mental health while planning your exit if needed.',
    summary:
      'Toxic workplaces—abusive management, hostile colleagues, unrealistic demands—require strategic self-protection. Document incidents, maintain professional behavior, limit emotional investment in drama, and prioritize mental health while you navigate options including eventual departure.',
    takeaways: [
      'Documentation protects you legally and provides evidence if complaints are needed.',
      'Professional behavior preserves your reputation even when others do not reciprocate.',
      'Boundaries around time and emotional energy prevent total burnout.',
      'Survival strategies are temporary; long-term toxicity may require leaving.',
    ],
    happening:
      'You may dread Monday, feel constantly on edge, or absorb blame for systemic problems.\n\nToxic environments often involve gossip, unrealistic expectations, or management that rewards dysfunction.',
    help:
      'Document incidents with dates, witnesses, and specific descriptions.\n\nMaintain professionalism—do not retaliate or become part of the toxicity.\n\nSet boundaries: arrive on time, do your job, leave when the day ends.\n\nBuild cautious alliances with trustworthy colleagues.\n\nInvest in off-work recovery: therapy, exercise, hobbies, social connection.\n\nBegin planning an exit strategy—updated resume, networking, savings—if toxicity is sustained.',
    support:
      `${SUPPORT}\n\nSeek therapy if workplace toxicity drives burnout, depression, or anxiety; consult HR or an employment attorney for harassment or discrimination concerns.`,
    related: [
      'How do I recover from burnout at work?',
      'How do I set boundaries between work and personal life?',
      'How do I manage stress at work?',
      'How do I know when it is time to quit my job?',
      'How do I stop bringing work stress home?',
    ],
    schemaAnswer:
      'Survive a toxic work environment by documenting incidents, maintaining professionalism, setting time and emotional boundaries, protecting mental health, and planning an exit if the environment does not improve.',
    themes: ['Toxic workplace', 'Boundaries', 'Burnout', 'Work stress'],
    refs: [BURNOUT, NIMH],
    notes: 'No employer-specific legal advice; encourage HR or legal consultation for harassment claims.',
  }),
  'how-do-i-talk-to-my-partner-about-difficult-topics': draft({
    question: 'How do I talk to my partner about difficult topics?',
    slug: 'how-do-i-talk-to-my-partner-about-difficult-topics',
    category: 'Relationships & Communication',
    title: 'Talking to Your Partner About Difficult Topics',
    meta: 'Choose the right time, start with care for the relationship, use "I" statements, listen actively, and focus on solutions together—not winning.',
    summary:
      'Difficult conversations require courage, timing, and skill. Choosing a calm private moment, expressing care for the relationship, using "I" statements, and listening before defending creates space for understanding rather than escalation.',
    takeaways: [
      'Timing and setting matter—avoid difficult talks when stressed or rushed.',
      '"I" statements express feelings without accusations.',
      'One topic per conversation prevents overwhelm.',
      'Pausing when emotions escalate beats saying things you will regret.',
    ],
    happening:
      'You may avoid hard topics until resentment builds, or bring them up at the worst possible moment.\n\nFear of conflict, rejection, or making things worse can silence important needs.',
    help:
      'Choose a private, unrushed time when both of you can focus.\n\nStart with care: "I love us and want to talk about something on my mind."\n\nUse "I" statements: "I feel unheard when..." not "You always..."\n\nFocus on one issue per conversation.\n\nListen to understand before defending your position.\n\nAgree to pause and return if emotions become too intense.\n\nAsk collaborative questions: "How can we handle this differently?"',
    support:
      `${SUPPORT}\n\nSeek couples therapy if difficult conversations consistently escalate, shut down, or leave core issues unresolved.`,
    related: [
      'How do I communicate my needs in a relationship?',
      'How do I set boundaries without feeling guilty?',
      'How do I talk to my partner about sexual needs without feeling embarrassed?',
      'How do I repair a relationship after a fight?',
      'How do I stop avoiding conflict in my relationship?',
    ],
    schemaAnswer:
      'Talk to your partner about difficult topics by choosing calm timing, starting with care, using I statements, listening actively, focusing on one issue, and pausing when emotions escalate.',
    themes: ['Communication', 'Conflict', 'Relationships', 'I statements'],
  }),
  'how-do-i-talk-to-my-partner-about-sexual-needs-wit-186602-018': draft({
    question: 'How do I talk to my partner about sexual needs without feeling embarrassed?',
    slug: 'how-do-i-talk-to-my-partner-about-sexual-needs-wit-186602-018',
    category: 'Sexuality, Gender Identity, and Intimacy',
    title: 'Talking About Sexual Needs With Your Partner',
    meta: 'Start conversations outside the bedroom, use "I" statements about what feels good, and remember loving partners want mutual satisfaction—not mind reading.',
    summary:
      'Discussing sexual needs feels vulnerable because of cultural shame and fear of judgment. Starting outside the bedroom, using "I" statements about preferences, and creating a no-judgment space helps partners understand how to support each other\'s satisfaction.',
    takeaways: [
      'Embarrassment often reflects cultural shame—not that your needs are wrong.',
      'Conversations work better outside sexual contexts when both are relaxed.',
      'Loving partners usually want guidance on how to please you.',
      'Either person can say no without explanation—that is healthy consent.',
    ],
    happening:
      'You may avoid the topic entirely, hint indirectly, or worry your needs are too much or weird.\n\nPast shame, trauma, or partners who reacted poorly can make direct conversation feel dangerous.',
    help:
      'Start with smaller topics outside the bedroom when you are both calm.\n\nUse "I" language: "I really enjoy when..." or "I have been curious about..."\n\nShare articles, books, or quizzes if direct talk feels too hard initially.\n\nAgree on a no-judgment zone where both can express and decline.\n\nRemember your partner is not a mind reader—they often welcome clarity.\n\nConsider sex-positive therapy if shame or trauma blocks communication.',
    support:
      `${SUPPORT}\n\nSeek sex-positive therapy if embarrassment stems from trauma, chronic avoidance, or relationship distress around intimacy.`,
    related: [
      'How do I talk to my partner about difficult topics?',
      'How do I rebuild intimacy after a dry spell?',
      'How do I communicate my needs in a relationship?',
      'How do I cope with mismatched libido in a relationship?',
      'How do I heal from sexual shame?',
    ],
    schemaAnswer:
      'Talk about sexual needs without embarrassment by starting conversations outside the bedroom, using I statements, creating no-judgment space, and seeking sex-positive therapy if shame or trauma blocks communication.',
    themes: ['Intimacy', 'Communication', 'Sexual health', 'Vulnerability'],
    gaps: ['Verify sex-positive therapy framing aligns with editorial standards.'],
  }),
  'how-do-i-talk-to-my-therapist-about-my-relationshi-189142-011': draft({
    question: 'How do I talk to my therapist about my relationship with AI?',
    slug: 'how-do-i-talk-to-my-therapist-about-my-relationshi-189142-011',
    category: 'Identity & Self-Worth',
    title: 'Discussing Your AI Relationship With Your Therapist',
    meta: 'Be honest about usage patterns, emotional attachment, and impact on human relationships—therapists increasingly discuss technology without judgment.',
    summary:
      'Discussing AI companionship with your therapist is worth doing openly. Share how often you use AI, what you discuss, what draws you to it, and any changes in human relationships or social comfort. Therapists need this context to understand your overall mental health picture.',
    takeaways: [
      'Honesty about AI usage helps your therapist understand your support needs.',
      'Therapists are increasingly familiar with technology-related mental health topics.',
      'Exploring what needs AI meets can clarify healthier balance with human connection.',
      'The therapeutic relationship itself can practice the vulnerability AI may replace.',
    ],
    happening:
      'You may feel ashamed, worry about judgment, or assume your therapist will not understand.\n\nYou might prefer AI for consistency, lack of judgment, or always-available emotional support.',
    help:
      'Describe usage patterns: frequency, topics, and how interactions make you feel.\n\nShare what draws you to AI—availability, consistency, no judgment, or other factors.\n\nNote changes in human relationships or social comfort since using AI.\n\nMention concerns: dependence, preferring AI to people, increased social anxiety.\n\nAsk for help setting boundaries if usage feels excessive.\n\nIf your therapist seems unfamiliar, offer to share articles or request a referral to someone with technology experience.',
    support:
      `${SUPPORT}\n\nSeek a therapist experienced in technology and mental health if AI use replaces human connection, fuels isolation, or impairs daily functioning.`,
    related: [
      'How do I know if I am too dependent on AI for emotional support?',
      'How do I build real human connections?',
      'How do I talk to my therapist about difficult topics?',
      'How do I cope with loneliness?',
      'How do I reduce social anxiety?',
    ],
    schemaAnswer:
      'Talk to your therapist about AI by sharing usage patterns, emotional attachment, impact on human relationships, and concerns about dependence—most therapists discuss emerging technology without judgment.',
    themes: ['AI companionship', 'Therapy', 'Technology', 'Human connection'],
    gaps: ['Emerging topic; verify editorial stance on AI relationship framing.'],
  }),
  'how-do-i-tell-my-children-about-our-divorce': draft({
    question: 'How do I tell my children about our divorce?',
    slug: 'how-do-i-tell-my-children-about-our-divorce',
    category: 'Family & Parenting',
    title: 'Telling Your Children About Divorce',
    meta: 'Plan together if possible, use age-appropriate language, emphasize it is not their fault, and focus on what will stay the same as well as what will change.',
    summary:
      'Telling children about divorce is one of the hardest conversations parents face. Ideally both parents deliver the news together with age-appropriate honesty, explicit reassurance that the divorce is not the children\'s fault, and concrete information about what comes next.',
    takeaways: [
      'Both parents presenting united front when possible reduces confusion and blame.',
      'Age-appropriate honesty works better than overwhelming detail or secrecy.',
      'Children often blame themselves—say explicitly the divorce is not their fault.',
      'Focus on constants: both parents\' love and ongoing care.',
    ],
    happening:
      'You may dread their reaction, worry about damaging them, or disagree with your co-parent about what to say.\n\nChildren may cry, rage, seem calm, or ask practical questions about where they will live.',
    help:
      'Plan the conversation together with your co-parent when possible.\n\nChoose uninterrupted time—not before school or bedtime on a stressful day.\n\nUse simple language for young children; more detail for teens as appropriate.\n\nSay clearly: "This is an adult decision. You did not cause this."\n\nExplain what will change and what will stay the same.\n\nAllow all emotional reactions—they may cycle through feelings over time.\n\nAvoid blaming the other parent or sharing inappropriate adult details.',
    support:
      `${SUPPORT}\n\nSeek family therapy or child counseling if children show prolonged distress, regression, school problems, or self-harm concerns after the announcement.`,
    related: [
      'How do I co-parent effectively after divorce?',
      'How do I help my children cope with divorce?',
      'How do I manage conflict with my ex for the kids\' sake?',
      'How do I talk to my children about difficult topics?',
      'How do I take care of myself during divorce?',
    ],
    schemaAnswer:
      'Tell children about divorce by planning together if possible, using age-appropriate language, emphasizing it is not their fault, and explaining what will change and stay the same.',
    themes: ['Divorce', 'Parenting', 'Family communication', 'Children'],
    flags: ['family_transition'],
  }),
  'how-do-i-tell-my-family-i-think-im-autistic': draft({
    question: "How do I tell my family I think I'm autistic?",
    slug: 'how-do-i-tell-my-family-i-think-im-autistic',
    category: 'Family & Parenting',
    title: 'Telling Your Family You Think You Are Autistic',
    meta: 'Prepare with accurate information, choose the right setting, share what led you to this conclusion, and allow time for family members to process.',
    summary:
      'Telling family you think you are autistic can be emotionally charged, especially if they hold misconceptions about autism. Preparation, concrete examples from your life, and patience with their processing timeline support a more productive conversation.',
    takeaways: [
      'Family reactions vary from supportive to dismissive—prepare emotionally.',
      'Educating yourself first helps address common misconceptions.',
      'Concrete examples of lifelong differences land better than abstract labels.',
      '"You do not seem autistic" is common—especially for people who mask.',
    ],
    happening:
      'You may fear disbelief, dismissal, or conflict—especially if family members lack understanding of how autism presents in adults.\n\nLate identification often follows years of feeling different without language for the experience.',
    help:
      'Educate yourself about autism in your demographic before the conversation.\n\nChoose private, unrushed time; consider telling one supportive person first.\n\nExplain what led you here: research, assessments, lifelong patterns.\n\nShare specific examples—not just the label.\n\nPrepare for "but you seem fine" and explain masking if relevant.\n\nAllow time for processing; you cannot force immediate acceptance.\n\nConnect with autistic communities for support regardless of family response.',
    support:
      `${SUPPORT}\n\nSeek autism-affirming therapy or assessment professionals if family denial blocks access to support you need, or if the conversation triggers severe distress.`,
    related: [
      'How do I get assessed for autism as an adult?',
      'How do I cope with family who do not understand my mental health?',
      'How do I talk to my family about difficult topics?',
      'How do I manage sensory overload?',
      'How do I build a support network outside my family?',
    ],
    schemaAnswer:
      'Tell family you think you are autistic by preparing with accurate information, sharing specific lifelong examples, choosing the right setting, and allowing time for processing while seeking autistic community support.',
    themes: ['Autism', 'Family communication', 'Neurodiversity', 'Self-discovery'],
    gaps: ['Verify neurodiversity framing aligns with editorial standards.'],
  }),
  'how-do-i-tell-my-family-im-going-to-treatment': draft({
    question: "How do I tell my family I'm going to treatment?",
    slug: 'how-do-i-tell-my-family-im-going-to-treatment',
    category: 'Therapy & Mental Health',
    title: 'Telling Your Family About Going to Treatment',
    meta: 'Choosing treatment is a strength—start with a trusted family member, keep it simple, and ask for specific support you need.',
    summary:
      'Telling family about treatment takes courage. Choosing help shows strength and self-awareness. Start with one trusted person, keep the message simple and forward-looking, and ask for concrete support rather than getting drawn into defending past behavior.',
    takeaways: [
      'Seeking treatment is a positive step—not something to hide in shame.',
      'Start with the most supportive family member if telling everyone at once feels overwhelming.',
      'You control how much detail you share about past behavior.',
      'Specific support requests give family a concrete way to help.',
    ],
    happening:
      'You may fear anger, blame, shock, or having to relive painful history.\n\nFamily reactions range from relief to denial—and may shift as they process the news.',
    help:
      'Start with one trusted person who is likely to be supportive.\n\nKeep it simple: "I need help and I have decided to go to treatment."\n\nFocus on your decision to heal, not exhaustive confession unless you choose that.\n\nSet boundaries: "I am not ready to discuss the past in detail right now."\n\nAsk for specific help: childcare, work coverage, check-ins, or transportation.\n\nPrepare for varied reactions without taking initial responses as final.',
    support:
      `${SUPPORT}\n\nAsk your treatment program about family sessions or guidance if disclosure threatens safety, housing, or your ability to enter care.`,
    related: [
      'Should I tell my employer about going to treatment?',
      'How do I tell my family about my addiction?',
      'How do I ask for help when I struggle to reach out?',
      'How do I set boundaries with family?',
      'How do I prepare for inpatient treatment?',
    ],
    schemaAnswer:
      'Tell family about treatment by starting with a trusted person, keeping the message simple and forward-looking, setting boundaries on detail, and asking for specific practical support.',
    themes: ['Treatment', 'Family disclosure', 'Recovery', 'Support seeking'],
    refs: [SAMHSA, NIMH],
  }),
  'how-does-meditation-help-with-anxiety': draft({
    question: 'How does meditation help with anxiety?',
    slug: 'how-does-meditation-help-with-anxiety',
    category: 'Anxiety & Stress',
    title: 'How Meditation Helps With Anxiety',
    meta: 'Meditation activates calm responses, builds distance from anxious thoughts, and increases tolerance for discomfort—regular practice rewires stress reactivity over time.',
    summary:
      'Meditation helps anxiety by activating the parasympathetic nervous system, teaching you to observe thoughts without immediately reacting, and anchoring attention in the present rather than catastrophic futures. Regular practice can gradually reduce how reactive your brain becomes to stress.',
    takeaways: [
      'Meditation activates the body\'s "rest and digest" response countering fight-or-flight.',
      'Observing thoughts as mental events reduces automatic fusion with anxious thinking.',
      'Present-moment focus loosens anxiety\'s grip on future-oriented worry.',
      'Regular practice increases tolerance for uncomfortable sensations and emotions.',
    ],
    happening:
      'Anxiety often involves mental time travel—worrying about what might happen or replaying what did.\n\nYour nervous system may stay on high alert even when no immediate threat exists.',
    help:
      'Start with brief daily sessions—even five minutes builds the habit.\n\nFocus on breath or body sensations as anchors when thoughts wander.\n\nNotice anxious thoughts without fighting them; gently return attention to the anchor.\n\nPractice response flexibility: pause between trigger and reaction.\n\nUse meditation during calm periods so skills are available during anxious moments.\n\nCombine with therapy for clinical anxiety—meditation complements but does not replace treatment.',
    support:
      `${SUPPORT}\n\nSeek clinical care if meditation intensifies panic, trauma flashbacks, or dissociation—trauma-informed approaches may be needed.`,
    related: [
      'How do I manage anxiety without medication?',
      'How do I stop worrying about things I cannot control?',
      'How do I practice mindfulness when my mind will not stop?',
      'How do I calm my nervous system?',
      'How do I reduce anxiety before bed?',
    ],
    schemaAnswer:
      'Meditation helps anxiety by activating calm nervous system responses, building distance from anxious thoughts, anchoring in the present, and increasing tolerance for discomfort through regular practice.',
    themes: ['Meditation', 'Anxiety', 'Mindfulness', 'Stress reduction'],
    refs: [ANXIETY, NIMH],
  }),
  'how-long-does-therapy-typically-take-186032-044': draft({
    question: 'How long does therapy typically take?',
    slug: 'how-long-does-therapy-typically-take-186032-044',
    category: 'Therapy Navigation',
    title: 'How Long Therapy Typically Takes',
    meta: 'Therapy length varies by goals and issues—some benefit in weeks, others work for years. Discuss goals with your therapist and check progress regularly.',
    summary:
      'There is no single correct timeline for therapy. Short-term work may resolve specific issues in weeks, while complex trauma or chronic conditions may require months or years. Many people use therapy in phases—intensive during hard periods, maintenance when stable.',
    takeaways: [
      'Therapy length depends on goals, issue complexity, and personal progress.',
      'Short-term therapy can help with focused problems like phobias or grief.',
      'Longer work is common for trauma, personality patterns, or chronic conditions.',
      'Regular check-ins with your therapist clarify whether timeline fits your needs.',
    ],
    happening:
      'You may wonder if you are taking too long, not progressing fast enough, or should already be "fixed."\n\nExternal pressure or insurance limits can add urgency that does not match healing pace.',
    help:
      'Discuss goals and expected timeline openly with your therapist at the start.\n\nCheck in periodically: "Are we making progress toward what I came for?"\n\nAccept that some issues resolve quickly and others need sustained work.\n\nTherapy phases are normal—intensive support during crises, lighter maintenance later.\n\nEnding therapy does not mean failure; returning later is also normal.\n\nFocus on functional improvement, not an arbitrary finish line.',
    support:
      `${SUPPORT}\n\nSeek a different therapist or approach if you feel stuck for months with no progress toward stated goals.`,
    related: [
      'How do I know if therapy is working?',
      'How do I find the right therapist?',
      'How do I know when to end therapy?',
      'What is the difference between therapy and coaching?',
      'How do I afford therapy without insurance?',
    ],
    schemaAnswer:
      'Therapy length varies widely—short-term work may help specific issues in weeks while complex concerns may take months or years; discuss goals and progress regularly with your therapist.',
    themes: ['Therapy', 'Treatment timeline', 'Mental health care', 'Progress'],
  }),
  'how-long-is-it-normal-to-grieve-after-lo-184729-001': draft({
    question: 'How long is it normal to grieve after losing someone?',
    slug: 'how-long-is-it-normal-to-grieve-after-lo-184729-001',
    category: 'Grief & Loss',
    title: 'How Long Grief Lasts After a Loss',
    meta: 'Grief has no fixed timeline—it is a lifelong process of learning to live with loss, not getting over it. Intensity changes over time with patience and support.',
    summary:
      'There is no normal timeline for grief. The intense acute phase may last months or years, but grieving someone you love is lifelong—you learn to carry the loss rather than erase it. Pain softens over time, though anniversaries and milestones may reawaken it.',
    takeaways: [
      'Grief has no expiration date—healing is not linear.',
      'You do not "get over" losing someone you love—you learn to live with the loss.',
      'Intense early grief and later waves on anniversaries are both normal.',
      'Self-compassion and support matter more than meeting an imagined timeline.',
    ],
    happening:
      'You may worry you are grieving too long, too intensely, or not enough compared to others.\n\nWell-meaning people may imply you should be "over it" by now, adding shame to pain.',
    help:
      'Release the idea of a correct grief timeline—yours is yours.\n\nAllow all feelings: sadness, anger, numbness, even moments of joy.\n\nAccept that anniversaries, holidays, and milestones may reawaken grief.\n\nStay connected to supportive people who do not rush your process.\n\nHonor the person who died in ways that feel meaningful to you.\n\nNotice gradual shifts—more good days, less constant pain—even if waves continue.',
    support:
      `${SUPPORT}\n\nSeek grief counseling if you cannot function, feel hopeless about the future, or have thoughts of self-harm.`,
    related: [
      'How do I support a friend who is grieving?',
      'How do I cope with grief after a major loss?',
      'What is complicated grief?',
      'How do I handle holidays after losing someone?',
      'How do I find meaning after a devastating loss?',
    ],
    schemaAnswer:
      'Grief has no fixed timeline—it is a lifelong process of learning to live with loss; intensity changes over time with patience, support, and self-compassion.',
    themes: ['Grief', 'Bereavement', 'Loss', 'Healing timeline'],
    refs: [GRIEF, NIMH],
  }),
  'how-long-should-it-take-me-to-get-over-a-181083-079': draft({
    question: 'How long should it take me to get over a breakup?',
    slug: 'how-long-should-it-take-me-to-get-over-a-181083-079',
    category: 'Relationships & Divorce',
    title: 'Healing Timeline After a Breakup',
    meta: 'Breakup recovery has no standard timeline—it depends on relationship length, how it ended, and your support system. Do not rush or compare your healing to others.',
    summary:
      'Healing from a breakup is deeply personal. Duration, intensity, attachment style, and support all shape recovery time. Some feel better in weeks; others need months or years. Healing is not linear, and setbacks are normal parts of the process.',
    takeaways: [
      'No universal timeline exists for breakup recovery.',
      'Relationship length, ending circumstances, and attachment style all influence pace.',
      'Comparing your healing to others\' adds unnecessary pressure.',
      'Setbacks—missing them on a good day—are normal, not failure.',
    ],
    happening:
      'You may feel you should be over it by now, or worry something is wrong because you still hurt months later.\n\nSocial media and friends\' advice can create unrealistic expectations about moving on.',
    help:
      'Stop measuring against arbitrary deadlines or other people\'s timelines.\n\nAllow the full range of emotions without judging yourself for still feeling them.\n\nInvest in rebuilding identity outside the relationship: friends, hobbies, goals.\n\nLimit contact and social media exposure to your ex when possible.\n\nNotice gradual improvement even if progress feels slow or non-linear.\n\nCelebrate small wins: a day with less rumination, a new interest, a genuine laugh.',
    support:
      `${SUPPORT}\n\nSeek therapy if breakup grief persists beyond your ability to function, fuels depression, or includes thoughts of self-harm.`,
    related: [
      'How do I get over a breakup when I still love them?',
      'How do I stop stalking my ex on social media?',
      'How do I stop comparing everyone I meet to my ex?',
      'How do I know if I am ready to date again?',
      'How do I heal from a painful breakup?',
    ],
    schemaAnswer:
      'Breakup recovery has no standard timeline—focus on processing emotions, rebuilding identity, limiting ex contact, and seeking support rather than comparing your pace to others.',
    themes: ['Breakup recovery', 'Grief', 'Healing timeline', 'Relationships'],
  }),
  'i-feel-guilty-for-resting-and-doing-nothing-how-do-i-overcome-this-j1k2l3': draft({
    question: 'I feel guilty for resting and doing nothing. How do I overcome this?',
    slug: 'i-feel-guilty-for-resting-and-doing-nothing-how-do-i-overcome-this-j1k2l3',
    category: 'Anxiety & Stress',
    title: 'Guilt About Resting and Doing Nothing',
    meta: 'Rest is essential, not earned—schedule downtime as non-negotiable, practice mindfulness during rest, and challenge the belief that worth equals productivity.',
    summary:
      'In a culture that glorifies busyness, rest can feel like laziness or wasted time. But rest is a basic human need—not a reward for exhaustion. Scheduling rest, practicing presence during downtime, and challenging productivity-as-worth beliefs help release rest guilt.',
    takeaways: [
      'Rest is a biological need—not a privilege you must earn.',
      'Chronic busyness often reflects internalized worth tied to output.',
      'Scheduling rest signals to your brain that it is a priority.',
      'Mindful rest restores more than guilty half-rest while worrying about to-do lists.',
    ],
    happening:
      'You may feel anxious, lazy, or irresponsible whenever you sit still, nap, or watch something without multitasking.\n\nMessages from work culture, family, or social media can equate stillness with failure.',
    help:
      'Challenge "I must earn rest"—rest supports everything else you do.\n\nSchedule rest blocks like appointments; protect them from creeping tasks.\n\nPractice mindfulness during rest: notice breath, sensations, surroundings.\n\nWhen guilt arises, name it and return attention to the present moment.\n\nList benefits of rest: better focus, creativity, mood, and health.\n\nStart small—a 15-minute guilt-free pause—and expand tolerance gradually.',
    support:
      `${SUPPORT}\n\nSeek therapy if rest guilt ties to burnout, anxiety disorders, or inability to stop working despite exhaustion.`,
    related: [
      'Is hustle culture toxic and how do I escape it?',
      'How do I recover from burnout?',
      'How do I set boundaries between work and personal life?',
      'How do I stop feeling like I am not doing enough?',
      'How do I manage stress when I cannot change my situation?',
    ],
    schemaAnswer:
      'Overcome rest guilt by treating rest as a non-negotiable need, scheduling downtime, practicing mindful presence during rest, and challenging beliefs that tie worth to constant productivity.',
    themes: ['Rest guilt', 'Burnout', 'Productivity culture', 'Self-care'],
    refs: [BURNOUT, NIMH],
  }),
  'i-rehearse-conversations-in-my-head-for-hours-before-they-happen': draft({
    question: 'I rehearse conversations in my head for hours before they happen',
    slug: 'i-rehearse-conversations-in-my-head-for-hours-before-they-happen',
    category: 'Anxiety & Stress',
    title: 'Mental Rehearsal Before Conversations',
    meta: 'Hours of conversation rehearsal often reflects anxiety and desire for control—set preparation limits, write key points, and trust yourself to navigate dialogue spontaneously.',
    summary:
      'Mental rehearsal before important conversations is common, especially for people with social anxiety or high stakes communication needs. Brief preparation helps; hours of scripting often increases anxiety when real dialogue does not follow the plan.',
    takeaways: [
      'Some preparation is normal; excessive rehearsal often fuels anxiety.',
      'Real conversations are collaborative—scripts rarely match what happens.',
      'Time limits on preparation preserve energy for the actual interaction.',
      'Authentic presence often works better than perfect scripting.',
    ],
    happening:
      'You may run through scenarios for hours, crafting responses to imagined objections or awkward moments.\n\nWhen the conversation diverges from the script, frustration or self-criticism can follow.',
    help:
      'Set a 10–15 minute prep limit: clarify main points and desired outcome.\n\nWrite key topics if helpful, but avoid scripting exact words.\n\nRemind yourself conversations are two-way—you cannot control all responses.\n\nPractice tolerating uncertainty; some of the best exchanges are unplanned.\n\nNotice if rehearsal is avoidance of actually having the conversation.\n\nBuild confidence through small successful interactions without extensive prep.',
    support:
      `${SUPPORT}\n\nSeek therapy if rehearsal consumes hours daily, prevents conversations entirely, or drives social anxiety that impairs work or relationships.`,
    related: [
      'How do I stop overthinking every conversation I have?',
      'How do I manage social anxiety?',
      'How do I stop overthinking everything I say?',
      'How do I talk to my partner about difficult topics?',
      'How do I build confidence in social situations?',
    ],
    schemaAnswer:
      'Reduce excessive conversation rehearsal by setting preparation time limits, writing key points instead of full scripts, tolerating uncertainty, and trusting yourself to navigate dialogue spontaneously.',
    themes: ['Social anxiety', 'Overthinking', 'Communication', 'Preparation'],
    refs: [ANXIETY, NIMH],
  }),
  'is-hustle-culture-toxic-and-how-do-i-esc-185387-023': draft({
    question: 'Is hustle culture toxic and how do I escape it?',
    slug: 'is-hustle-culture-toxic-and-how-do-i-esc-185387-023',
    category: 'Work, Stress & Burnout',
    title: 'Hustle Culture and How to Escape It',
    meta: 'Hustle culture glorifies overwork at the cost of health—define success on your terms, set firm boundaries, and treat rest as non-negotiable.',
    summary:
      'Hustle culture treats constant productivity as virtue and rest as weakness. It often leads to burnout, anxiety, and neglected relationships. Escaping requires defining your own version of success that includes health, rest, and connection—not just output.',
    takeaways: [
      'Hustle culture normalizes overwork and undervalues rest and relationships.',
      'Sustainable success is a marathon—burnout ends careers early.',
      'Your health is the foundation everything else depends on.',
      'Saying no to misaligned demands is self-protection, not laziness.',
    ],
    happening:
      'You may feel guilty for weekends off, compare your grind to others\' highlight reels, or measure worth by hours worked.\n\nSocial media, workplace norms, and internalized messages can make slowing down feel like failure.',
    help:
      'Define success including rest, health, relationships—not only income or titles.\n\nSet firm work-hour boundaries and take vacation time you earn.\n\nUnfollow accounts that glorify exhaustion and constant hustle.\n\nPractice saying no to opportunities misaligned with your priorities.\n\nSchedule non-work identity: hobbies, friends, movement, unstructured time.\n\nRemind yourself: busyness is not the same as meaningful progress.',
    support:
      `${SUPPORT}\n\nSeek therapy or medical evaluation if hustle culture drives burnout, insomnia, depression, or physical health decline.`,
    related: [
      'I feel guilty for resting and doing nothing. How do I overcome this?',
      'How do I recover from burnout?',
      'How do I set boundaries between work and personal life?',
      'How do I stop feeling like I am not doing enough?',
      'How do I survive a toxic work environment?',
    ],
    schemaAnswer:
      'Hustle culture can be toxic by promoting burnout and neglecting wellbeing—escape it by defining personal success, setting work boundaries, treating rest as essential, and saying no to misaligned demands.',
    themes: ['Hustle culture', 'Burnout', 'Work-life balance', 'Rest'],
    refs: [BURNOUT, CDC],
  }),
  'is-it-bad-to-take-naps-when-im-depressed-181083-052': draft({
    question: "Is it bad to take naps when I'm depressed?",
    slug: 'is-it-bad-to-take-naps-when-im-depressed-181083-052',
    category: 'Depression',
    title: 'Napping When You Are Depressed',
    meta: 'Short early naps can help depression-related fatigue; long or late naps may disrupt night sleep and become avoidance. Balance rest with gentle activity.',
    summary:
      'Napping during depression is a mixed tool. Brief early-day naps can restore energy when fatigue is overwhelming. Long naps or late-day sleep can worsen nighttime insomnia and become avoidance of responsibilities and activities that support recovery.',
    takeaways: [
      'Short naps (20–30 minutes) early in the day can help depression fatigue.',
      'Long or late naps often disrupt nighttime sleep and worsen depression.',
      'Excessive napping can become avoidance of life and responsibilities.',
      'Maintaining a regular sleep schedule supports depression recovery.',
    ],
    happening:
      'Depression often brings crushing fatigue that makes napping feel like the only option.\n\nSleeping through the afternoon may leave you wired at night and more isolated during the day.',
    help:
      'Limit naps to 20–30 minutes if you need one.\n\nNap before mid-afternoon to protect nighttime sleep.\n\nNotice if napping is rest or avoidance of tasks, people, or feelings.\n\nMaintain consistent wake and bed times even when depression pulls toward irregular sleep.\n\nBalance rest with one small activity afterward—a shower, short walk, or message to a friend.\n\nDiscuss persistent sleep problems with your doctor or therapist.',
    support:
      `${SUPPORT}\n\nSeek medical or mental health evaluation if sleep disruption, fatigue, or avoidance significantly impairs daily functioning or worsens depression.`,
    related: [
      'How do I improve my sleep when depression keeps me in bed?',
      'How do I motivate myself when depressed?',
      'How do I get out of bed when I am depressed?',
      'Is it normal to sleep a lot when depressed?',
      'How do I build a daily routine when depressed?',
    ],
    schemaAnswer:
      'Short early naps can help depression fatigue, but long or late naps may disrupt night sleep and become avoidance—balance rest with gentle activity and consistent sleep schedules.',
    themes: ['Depression', 'Sleep', 'Napping', 'Fatigue'],
    refs: [DEPRESSION, NIMH],
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
  'reports/enrichment-corpus/draft-answers/batch-24-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-24-drafts.json`);
