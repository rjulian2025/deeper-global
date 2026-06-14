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
const AUTISM = {
  title: 'Autism Spectrum Disorder',
  url: 'https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders-asd',
  publisher: 'NIMH',
  note: 'Supports understanding autism across the lifespan.',
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
  readFileSync('reports/enrichment-corpus/batches/batch-24-input.json', 'utf8'),
);

const contentBySlug = {
  'what-does-it-mean-if-i-feel-more-spiritual-in-n2o5p8': draft({
    question: 'What does it mean if I feel more spiritual in nature than in religious buildings?',
    slug: 'what-does-it-mean-if-i-feel-more-spiritual-in-n2o5p8',
    category: 'Identity & Self-Worth',
    title: 'More Spiritual in Nature Than Buildings',
    meta: 'Feeling sacred connection outdoors often reflects personal spiritual style—not failure of faith, but finding transcendence through nature without institutional pressure.',
    summary:
      'Feeling more spiritual in nature than in religious buildings is common and reflects a personal style that finds the sacred in natural environments. Nature offers awe, sensory richness, and freedom from doctrinal expectations. This preference does not mean something is wrong with your spirituality.',
    takeaways: [
      'Nature spirituality is valid across many traditions and personal paths.',
      'Religious buildings carry social and doctrinal expectations nature may not.',
      'Sensory engagement outdoors can deepen presence and awe.',
      'Your spiritual style can evolve without requiring a single label.',
    ],
    happening:
      'You may feel pressured to perform belief in institutional settings while forests, water, or open sky feel genuinely sacred.\n\nPast negative church experiences or deconstruction can make nature feel safer for spiritual exploration.',
    help:
      'Honor nature as a legitimate spiritual home without forcing yourself into buildings that feel hollow.\n\nExplore what specifically moves you: vastness, cycles, silence, or interconnectedness.\n\nCreate personal rituals outdoors—walking meditation, gratitude, or quiet reflection.\n\nSeparate harm from helpful practices you might adapt without old dogma.\n\nConnect with communities that blend spirituality and nature if isolation feels heavy.\n\nAllow mixed feelings if you miss aspects of institutional community.',
    support:
      `${SUPPORT}\n\nSeek therapy if spiritual searching fuels isolation, family conflict, or depression you cannot navigate alone.`,
    related: [
      'What does it mean if I feel more connected to nature than to people?',
      'Is it normal to feel angry at God or religion?',
      'What do I do when prayer or meditation no longer brings me peace?',
      'How do I find meaning after losing my faith?',
      'What does it mean if I feel more at peace in solitude than in community?',
    ],
    schemaAnswer:
      'Feeling more spiritual in nature than religious buildings reflects a valid personal style—nature offers awe and freedom from institutional pressure without invalidating your spiritual path.',
    themes: ['Spirituality', 'Nature', 'Identity', 'Faith exploration'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'what-does-it-mean-to-be-autistic-as-an-adult': draft({
    question: 'What does it mean to be autistic as an adult?',
    slug: 'what-does-it-mean-to-be-autistic-as-an-adult',
    category: 'General Mental Health',
    title: 'Being Autistic as an Adult',
    meta: 'Adult autism is a lifelong neurodevelopmental difference affecting sensory processing, communication, and social interaction—often masked until later diagnosis.',
    summary:
      'Being autistic as an adult means living with a lifelong neurodevelopmental difference that shapes sensory processing, communication, and social interaction. Many adults receive diagnoses later, especially women and people who learned to mask. Autism is not a defect—it is a different neurological operating system.',
    takeaways: [
      'Autism is lifelong; adult presentation often differs from childhood stereotypes.',
      'Masking can hide traits at significant personal cost.',
      'Sensory differences and social communication patterns affect daily life.',
      'Accommodations and self-understanding improve wellbeing after diagnosis.',
    ],
    happening:
      'You may feel exhausted after socializing, struggle with unwritten social rules, or experience intense sensory overwhelm.\n\nYears of masking can leave you unsure who you are beneath performance.',
    help:
      'Learn about autistic traits beyond stereotypes—sensory needs, special interests, routines, and communication style.\n\nReduce masking where safe to conserve energy.\n\nRequest workplace and home accommodations: lighting, noise, flexible schedules.\n\nBuild routines that support regulation and recovery after stimulation.\n\nConnect with autistic communities for shared language and validation.\n\nPursue formal assessment if clarity would help access support or self-understanding.',
    support:
      `${SUPPORT}\n\nSeek evaluation from a clinician experienced in adult autism if traits significantly impair work, relationships, or daily functioning.`,
    related: [
      'What is executive dysfunction and how does it affect daily life?',
      'How do I know if I am autistic?',
      'How do I explain my needs to my employer?',
      'Is it normal to prefer being alone most of the time?',
      'How do I stop masking my true self?',
    ],
    schemaAnswer:
      'Being autistic as an adult means lifelong differences in sensory processing, communication, and social interaction—self-understanding, accommodations, and community support improve wellbeing.',
    themes: ['Autism', 'Neurodiversity', 'Masking', 'Self-understanding'],
    refs: [AUTISM, NIMH],
    notes: 'No self-diagnosis; encourage professional evaluation when appropriate.',
  }),
  'what-does-it-mean-to-grieve-a-relationsh-179301-002': draft({
    question: 'What does it mean to grieve a relationship that never happened?',
    slug: 'what-does-it-mean-to-grieve-a-relationsh-179301-002',
    category: 'Grief & Loss',
    title: 'Grieving a Relationship That Never Happened',
    meta: 'Mourning an unfulfilled relationship is real grief—you are grieving potential, hope, and the future you imagined, not just a formal breakup.',
    summary:
      'Grieving a relationship that never officially began is valid and painful. You mourn the potential, hopes, and imagined future—not just a person. This anticipatory or unrealized-loss grief deserves acknowledgment like any other loss.',
    takeaways: [
      'Unrealized relationship grief is real—not overdramatic or silly.',
      'You may mourn potential and identity tied to the imagined future.',
      'Ambiguous endings lack closure rituals that formal breakups sometimes offer.',
      'Naming the loss helps processing even without a shared history.',
    ],
    happening:
      'Situationships, near-misses, or one-sided longing can leave a void without social permission to grieve.\n\nOthers may minimize it because "you were not even together."',
    help:
      'Name the loss explicitly: "I am grieving what could have been."\n\nAllow sadness, anger, and relief without ranking your grief against others\'.\n\nJournal what you imagined and what specifically hurts now.\n\nCreate personal closure rituals—letters you do not send, symbolic release.\n\nLimit contact that reopens the wound if they remain in your life peripherally.\n\nInvest energy in present relationships and goals rather than only the phantom future.',
    support:
      `${SUPPORT}\n\nSeek therapy if grief persists with functional impairment, obsessive rumination, or depression.`,
    related: [
      'What is disenfranchised grief?',
      'How do I cope with unrequited love?',
      'How long is it normal to grieve after losing someone?',
      'How do I stop ruminating about someone I cannot have?',
      'Is it normal to feel nothing after someone dies?',
    ],
    schemaAnswer:
      'Grieving a relationship that never happened is valid—you mourn potential and imagined future, and deserve acknowledgment and processing like any significant loss.',
    themes: ['Grief', 'Unrequited love', 'Loss', 'Closure'],
    refs: [GRIEF, NIMH],
  }),
  'what-if-antidepressants-change-who-i-am-181083-056': draft({
    question: 'What if antidepressants change who I am?',
    slug: 'what-if-antidepressants-change-who-i-am-181083-056',
    category: 'Depression',
    title: 'Fear Antidepressants Will Change You',
    meta: 'Antidepressants aim to lift depression fog so you can access yourself—not erase personality; report numbness or flatness to your prescriber promptly.',
    summary:
      'Fearing antidepressants will change who you are is common. Medication typically reduces depression symptoms so you can feel more like yourself—not replace your personality. Some people notice emotional blunting or activation; those are signals to discuss with your prescriber, not proof you should suffer in silence.',
    takeaways: [
      'The goal is symptom relief, not personality replacement.',
      'Many people report feeling more like themselves once depression lifts.',
      'Emotional numbness or agitation warrants prescriber conversation.',
      'Medication decisions are collaborative—you can adjust or stop with medical guidance.',
    ],
    happening:
      'Depression itself can feel like losing your core self—making any change frightening.\n\nStories about medication horror or identity loss may amplify hesitation.',
    help:
      'Discuss fears openly with your prescriber before and during treatment.\n\nTrack specific changes: energy, sleep, motivation, emotional range—not vague "different."\n\nGive adequate trial time while monitoring side effects weekly early on.\n\nCombine medication with therapy when possible for fuller recovery.\n\nNever stop abruptly without medical guidance—taper plans reduce withdrawal risk.\n\nRemember trying medication is information; you can revise the plan.',
    support:
      `${SUPPORT}\n\nContact your prescriber urgently for suicidal thoughts, severe agitation, or manic symptoms; seek emergency care for immediate safety concerns.`,
    related: [
      'What if psychiatric medication does not work for me?',
      'How do I know if I am depressed?',
      'How do I talk to my doctor about mental health?',
      'How do I manage anxiety about taking medication?',
      'What are the signs that therapy is working?',
    ],
    schemaAnswer:
      'Antidepressants typically reduce depression so you can access yourself rather than erase personality—report numbness or unwanted changes to your prescriber promptly.',
    themes: ['Antidepressants', 'Depression', 'Medication', 'Identity'],
    refs: [DEPRESSION, NIMH],
    notes: 'No prescribing advice; reinforce prescriber collaboration.',
  }),
  'what-if-i-cant-afford-treatment-or-therapy': draft({
    question: "What if I can't afford treatment or therapy?",
    slug: 'what-if-i-cant-afford-treatment-or-therapy',
    category: 'Therapy & Mental Health',
    title: 'Cannot Afford Treatment or Therapy',
    meta: 'Cost barriers are common—sliding-scale clinics, community health centers, Medicaid, EAP benefits, and support groups can make mental health care more accessible.',
    summary:
      'Not affording treatment or therapy is a real barrier—but options exist. Community health centers, sliding-scale therapists, Medicaid, employee assistance programs, university clinics, and peer support groups can reduce cost. Do not assume care is impossible without asking about financial assistance.',
    takeaways: [
      'Financial barriers are systemic—not personal failure to prioritize health.',
      'Sliding-scale and public programs exist in most regions.',
      'Insurance, Medicaid, and EAP benefits may cover more than you expect.',
      'Peer support complements but rarely replaces care for severe symptoms.',
    ],
    happening:
      'Sticker shock, denied claims, or past medical debt may make you avoid even searching.\n\nRural or high-cost areas can make affordable providers feel nonexistent.',
    help:
      'Search community mental health centers and federally qualified health centers locally.\n\nUse SAMHSA\'s treatment locator and Open Path Collective for reduced-fee therapists.\n\nCheck Medicaid eligibility and ACA marketplace plans with mental health coverage.\n\nAsk employers about EAP—often free short-term sessions.\n\nContact university training clinics for supervised low-cost therapy.\n\nExplore support groups (DBSA, NAMI, grief groups) while pursuing professional care.',
    support:
      `${SUPPORT}\n\nSeek urgent or crisis services if symptoms include self-harm thoughts—988 and local crisis centers can help regardless of ability to pay.`,
    related: [
      'How do I find an affordable therapist?',
      'How do I find a therapist near me?',
      'How do I talk to my doctor about mental health?',
      'What if I do not like my therapist?',
      'How do I advocate for myself in healthcare?',
    ],
    schemaAnswer:
      'If you cannot afford therapy, explore sliding-scale clinics, community health centers, Medicaid, EAP benefits, and support groups—cost should not permanently block care for significant symptoms.',
    themes: ['Access to care', 'Affordability', 'Therapy navigation', 'Resources'],
    refs: [SAMHSA, NIMH],
  }),
  'what-if-i-dont-feel-like-i-fit-in-at-support-group-meetings': draft({
    question: "What if I don't feel like I fit in at support group meetings?",
    slug: 'what-if-i-dont-feel-like-i-fit-in-at-support-group-meetings',
    category: 'General Mental Health',
    title: 'Not Fitting In at Support Groups',
    meta: 'Not fitting in at one meeting often means wrong group fit—not that support groups fail you; try formats, demographics, and alternatives before giving up.',
    summary:
      'Not fitting in at support group meetings is common, especially early on. Groups vary widely in tone, demographics, and format. One mismatch does not mean support groups are wrong for you—it may mean you have not found the right meeting yet.',
    takeaways: [
      'Each meeting has its own culture and personality.',
      'Try multiple groups before concluding support groups do not work.',
      'Demographic or topic-specific meetings may fit better.',
      'Listening without sharing still counts as participation.',
    ],
    happening:
      'You may feel too young, too different, or too guarded for the room you tried.\n\nVulnerability discomfort can masquerade as "these people are not for me."',
    help:
      'Attend three different meetings before deciding—online and in-person.\n\nLook for groups aligned with your identity, profession, or specific struggle.\n\nArrive early to chat; staying after helps relationships form.\n\nParticipate at your pace—listening is valid.\n\nExplore alternatives: SMART Recovery, Refuge Recovery, DBSA, or moderated online communities.\n\nDiscuss fit with a therapist who can recommend structured options.',
    support:
      `${SUPPORT}\n\nSeek professional care if isolation persists despite trying groups, or if symptoms impair safety and daily functioning.`,
    related: [
      'How do I find a support group?',
      'How do I open up in group settings?',
      'How do I cope with loneliness?',
      'How do I know if I need therapy?',
      'How do I build real human connections?',
    ],
    schemaAnswer:
      'Not fitting in at one support group usually means wrong fit—try different meetings, formats, and demographics before concluding peer support is not for you.',
    themes: ['Support groups', 'Belonging', 'Recovery', 'Community'],
    refs: [SAMHSA, NIMH],
  }),
  'what-if-i-dont-like-my-therapist-185759-047': draft({
    question: "What if I don't like my therapist?",
    slug: 'what-if-i-dont-like-my-therapist-185759-047',
    category: 'Therapy Navigation',
    title: 'When You Do Not Like Your Therapist',
    meta: 'Therapeutic fit matters enormously—you can discuss concerns or switch therapists without justification; healing requires feeling safe and respected.',
    summary:
      'Not liking your therapist is valid information. The therapeutic relationship strongly predicts outcomes. If you feel unheard, judged, or uncomfortable, progress stalls. You can raise concerns directly or switch providers—you owe no lengthy justification.',
    takeaways: [
      'Fit is one of the strongest predictors of therapy success.',
      'Discomfort, disrespect, or chronic mismatch warrant a change.',
      'One direct conversation can clarify fixable issues versus poor fit.',
      'Switching therapists is normal—not failure.',
    ],
    happening:
      'You may dread sessions, withhold honesty, or feel worse after appointments.\n\nGuilt about "wasting their time" can keep you in a bad fit too long.',
    help:
      'Name what feels off: pace, style, boundaries, cultural understanding, or safety.\n\nTry one direct conversation: "I am not feeling understood when…"\n\nGive fixable issues one honest attempt—then switch if unchanged.\n\nUse your insurer or Psychology Today to find alternatives promptly.\n\nBrief exit: "I do not think we are the right fit" is sufficient.\n\nNotice green flags in the next search: curiosity, respect, collaborative planning.',
    support:
      `${SUPPORT}\n\nSeek urgent help if a provider crosses ethical boundaries, and report misconduct to licensing boards when appropriate.`,
    related: [
      'How do I know if my therapist is a good fit?',
      'How do I find the right therapist?',
      'How do I switch therapists without feeling guilty?',
      'What should I expect from therapy?',
      'How do I advocate for myself in therapy?',
    ],
    schemaAnswer:
      'If you do not like your therapist, fit may be wrong—discuss concerns once, then switch without guilt; feeling safe and respected is essential for therapy to work.',
    themes: ['Therapy navigation', 'Therapeutic fit', 'Advocacy', 'Boundaries'],
  }),
  'what-if-im-bored-and-that-makes-me-want-to-use': draft({
    question: "What if I'm bored and that makes me want to use?",
    slug: 'what-if-im-bored-and-that-makes-me-want-to-use',
    category: 'General Mental Health',
    title: 'Boredom as a Use Trigger',
    meta: 'Boredom is a powerful early-recovery trigger when the brain craves stimulation—build structure, engaging activities, and tolerance for quiet without substances.',
    summary:
      'Boredom commonly triggers urges to use, especially early in recovery when substances filled time and provided intense stimulation. Your reward system needs time to rebalance. Building structure, engaging activities, and skills to tolerate quiet reduces relapse risk.',
    takeaways: [
      'Boredom in recovery is common as brain reward systems recalibrate.',
      'What feels like boredom may be anxiety, loneliness, or restlessness.',
      'Structure and planned activities prevent idle trigger windows.',
      'Learning to sit with stillness is a skill that develops with practice.',
    ],
    happening:
      'Empty hours that substances once occupied can feel unbearable.\n\nNormal activities may feel dull compared to past highs—a temporary contrast.',
    help:
      'Create daily structure: meetings, work blocks, exercise, meals, sleep.\n\nKeep a ready list of short and long sober activities.\n\nCheck whether "boredom" masks anxiety or depression—address the root emotion.\n\nTry new hobbies recovery made space for—creative, physical, social, or learning.\n\nPractice brief mindfulness to build comfort with quiet moments.\n\nConnect with sober social networks that plan activities together.',
    support:
      `${SUPPORT}\n\nSeek addiction treatment or therapy if boredom-driven urges escalate to relapse or if you cannot stay safe—SAMHSA\'s helpline is 1-800-662-4357.`,
    related: [
      'How do I cope with cravings?',
      'How do I build a life in recovery?',
      'How do I find hobbies I enjoy?',
      'How do I manage boredom without substances?',
      'What if I cannot afford treatment or therapy?',
    ],
    schemaAnswer:
      'Boredom often triggers use in early recovery—build structure, engaging sober activities, and skills to tolerate quiet while your brain\'s reward system recalibrates.',
    themes: ['Recovery', 'Boredom', 'Triggers', 'Relapse prevention'],
    refs: [SAMHSA, NIMH],
  }),
  'what-if-im-having-second-thoughts-about-getting-divorced': draft({
    question: "What if I'm having second thoughts about getting divorced?",
    slug: 'what-if-im-having-second-thoughts-about-getting-divorced',
    category: 'General Mental Health',
    title: 'Second Thoughts About Divorce',
    meta: 'Doubts before divorce are normal—distinguish fear of change from genuine hope for repair, and evaluate whether problems are solvable with mutual effort.',
    summary:
      'Second thoughts about divorce are normal for such a major decision. Distinguish fear of the unknown from genuine belief the marriage can heal. Evaluate whether core problems are solvable with mutual commitment—not just your hope alone.',
    takeaways: [
      'Uncertainty does not automatically mean divorce is wrong—or right.',
      'Fear of change, finances, and children can mimic desire to reconcile.',
      'Reconciliation requires evidence of change, not promises alone.',
      'Couples therapy before finalizing can clarify salvageability.',
    ],
    happening:
      'Grief, guilt, and nostalgia may surge as paperwork or separation nears.\n\nMoments of connection with your spouse can reopen doubt even after serious harm.',
    help:
      'Ask: Are doubts about the relationship or about an unknown future?\n\nList deal-breakers versus solvable issues honestly.\n\nLook for sustained behavior change—not temporary crisis apologies.\n\nConsider structured couples therapy even if you tried before.\n\nTalk with a therapist individually to separate fear from clarity.\n\nAvoid rushing reversal or finalization until you understand your motives.',
    support:
      `${SUPPORT}\n\nSeek help immediately if divorce conflict involves abuse, threats, or safety concerns—contact local domestic violence resources or 988 for crisis support.`,
    related: [
      'How do I know if my marriage is worth saving?',
      'How do I cope with divorce?',
      'How do I know if my relationship is toxic?',
      'How do I communicate with my spouse about divorce?',
      'How do I handle guilt about leaving my marriage?',
    ],
    schemaAnswer:
      'Second thoughts about divorce are normal—distinguish fear of change from repairable hope, evaluate mutual commitment to change, and consider couples therapy before finalizing.',
    themes: ['Divorce', 'Relationships', 'Decision-making', 'Ambivalence'],
    flags: ['relationship-safety'],
  }),
  'what-if-my-partner-and-i-have-different-communication-styles': draft({
    question: 'What if my partner and I have different communication styles?',
    slug: 'what-if-my-partner-and-i-have-different-communication-styles',
    category: 'Relationships & Communication',
    title: 'Different Communication Styles',
    meta: 'Different communication styles are common and can complement each other—learn each other\'s needs, adapt without erasing yourself, and agree on conflict rules.',
    summary:
      'Different communication styles in relationships are extremely common. Direct versus indirect, fast versus slow processors, detail-oriented versus big-picture thinkers can clash—or complement when understood. Success requires learning each other\'s needs and creating shared rules for hard conversations.',
    takeaways: [
      'Style differences are not moral failures—they are habits and temperaments.',
      'Adaptation works best when both partners adjust somewhat.',
      'Processing time and directness are frequent flashpoints.',
      'Shared vocabulary for needs reduces repeated misunderstandings.',
    ],
    happening:
      'You may feel dismissed when they need silence, or flooded when they want immediate resolution.\n\nCultural and family-of-origin patterns shape what "good communication" looks like.',
    help:
      'Map your styles: pace, directness, emotional expression, and conflict tolerance.\n\nAsk what each person needs to feel heard—timing, tone, or format.\n\nAgree on pauses: "I need an hour before we continue."\n\nPractice reflecting back before rebutting.\n\nAvoid interpreting difference as lack of care.\n\nUse couples therapy to build a shared communication contract.',
    support:
      `${SUPPORT}\n\nSeek couples therapy if communication escalates to contempt, stonewalling, or fear—and individual safety resources if abuse is present.`,
    related: [
      'How do I communicate my needs in a relationship?',
      'What if my partner and I keep having the same fights over and over?',
      'How do I stop arguing about the same things?',
      'How do I listen without getting defensive?',
      'How do I know if couples therapy would help?',
    ],
    schemaAnswer:
      'Different communication styles can work when partners learn each other\'s needs, adapt thoughtfully, and agree on rules for hard conversations—consider couples therapy if stuck.',
    themes: ['Communication', 'Relationships', 'Conflict', 'Understanding'],
  }),
  'what-if-my-partner-and-i-keep-having-the-same-fights-over-and-over': draft({
    question: 'What if my partner and I keep having the same fights over and over?',
    slug: 'what-if-my-partner-and-i-keep-having-the-same-fights-over-and-over',
    category: 'Relationships & Communication',
    title: 'Same Fights on Repeat',
    meta: 'Repetitive arguments usually signal unmet needs beneath the surface topic—change the pattern with listening, breaks, and couples therapy before exhaustion wins.',
    summary:
      'Having the same fights repeatedly usually means deeper unmet needs are not being addressed. Dishes may symbolize appreciation; money may reflect security values. Until underlying needs surface, content changes but the cycle continues.',
    takeaways: [
      'Surface topics often mask deeper needs or fears.',
      'Predictable escalation patterns can be mapped and interrupted.',
      'Winning arguments rarely fixes recurring conflicts.',
      'Couples therapy helps when DIY communication stalls.',
    ],
    happening:
      'You both know the script before anyone speaks—roles feel fixed.\n\nExhaustion and resentment grow faster than resolution.',
    help:
      'Ask: "What do I really need underneath this fight?"\n\nMap the cycle: trigger, escalation, withdrawal, stalemate.\n\nUse timed breaks when flooding hits; return with calmer brains.\n\nPractice reflective listening before defending.\n\nShift from blame to problem-solving: "How do we both win something?"\n\nSeek couples therapy when patterns persist despite genuine effort.',
    support:
      `${SUPPORT}\n\nSeek help if fights include intimidation, coercion, or violence—safety planning precedes relationship repair.`,
    related: [
      'How do I stop having the same argument?',
      'What if my partner and I have different communication styles?',
      'How do I repair after a big fight?',
      'How do I know if my relationship is worth saving?',
      'What is gaslighting and how do I recognize it?',
    ],
    schemaAnswer:
      'Repeating fights usually hide unmet needs—interrupt patterns with reflective listening, timed breaks, and couples therapy to address root issues beneath surface topics.',
    themes: ['Conflict', 'Relationships', 'Communication', 'Patterns'],
  }),
  'what-if-my-partner-doesnt-want-to-have-sex-as-much-as-i-do': draft({
    question: "What if my partner doesn't want to have sex as much as I do?",
    slug: 'what-if-my-partner-doesnt-want-to-have-sex-as-much-as-i-do',
    category: 'Relationships & Communication',
    title: 'Mismatched Sexual Desire',
    meta: 'Libido differences are common—avoid taking rejection personally, explore contributing factors together, and negotiate intimacy without pressure or guilt.',
    summary:
      'Mismatched sexual desire is common in long-term relationships. Libido varies with stress, health, hormones, medications, and life stage. It is usually not about your worth. Open, non-pressuring conversation and creative compromise help more than blame.',
    takeaways: [
      'Desire gaps are common—not proof the relationship is doomed.',
      'Lower libido often reflects stress, health, or emotional disconnection.',
      'Pressure and guilt typically reduce desire further.',
      'Intimacy includes many forms of connection beyond intercourse.',
    ],
    happening:
      'Rejection may feel like personal failure even when your partner is depleted or disconnected.\n\nResentment can build on both sides—pursuer and withdrawer roles may crystallize.',
    help:
      'Discuss feelings without accusing: "I miss closeness" versus "You never…"\n\nExplore factors: sleep, stress, hormones, meds, unresolved conflict.\n\nPrioritize non-sexual affection and emotional intimacy.\n\nNegotiate compromises: scheduled intimacy, expanded definitions of sex, solo outlets.\n\nAvoid coercion, guilt trips, or scorekeeping.\n\nConsider sex therapy or couples counseling for persistent distress.',
    support:
      `${SUPPORT}\n\nSeek therapy if mismatch drives chronic contempt, coercion, or relationship-threatening distress.`,
    related: [
      'How do I talk to my partner about sex?',
      'How do I cope with a sexless marriage?',
      'How do I rebuild intimacy in my relationship?',
      'How do I communicate my needs without nagging?',
      'How do I know if my relationship is worth saving?',
    ],
    schemaAnswer:
      'When partners want sex at different frequencies, avoid personalizing it—discuss contributing factors, reduce pressure, expand intimacy, and seek sex therapy if stuck.',
    themes: ['Intimacy', 'Libido', 'Relationships', 'Communication'],
  }),
  'what-if-my-partners-family-doesnt-accept-me': draft({
    question: "What if my partner's family doesn't accept me?",
    slug: 'what-if-my-partners-family-doesnt-accept-me',
    category: 'Relationships & Communication',
    title: "Partner's Family Does Not Accept You",
    meta: 'Family rejection hurts deeply—set limits on disrespect, ask your partner to advocate for you, and build belonging without erasing who you are.',
    summary:
      'When your partner\'s family does not accept you, the pain is real and can strain your relationship. Acceptance sometimes grows with time, but you should not tolerate ongoing hostility. Your partner\'s advocacy and clear boundaries protect both you and the relationship.',
    takeaways: [
      'Initial resistance sometimes softens; ongoing abuse should not be tolerated.',
      'Rejection often reflects their limits—not your worth.',
      'Your partner must actively defend you to the family.',
      'Authenticity beats performing approval you cannot sustain.',
    ],
    happening:
      'Holidays, comments, and exclusion can make you feel like an outsider in your own relationship.\n\nPressure to charm them may exhaust you while changing nothing.',
    help:
      'Set limits on disrespectful treatment—you need not endure abuse for harmony.\n\nAsk your partner for clear advocacy: "When they say X, I need you to respond."\n\nBuild individual relationships with kinder family members when possible.\n\nReduce exposure to hostile members rather than endless proving.\n\nProcess grief for the welcoming family you hoped for.\n\nConsider couples therapy to align on boundaries and loyalty.',
    support:
      `${SUPPORT}\n\nSeek therapy if rejection fuels depression, isolation, or relationship-threatening conflict—and reassess relationships where your partner will not protect you.`,
    related: [
      'How do I set boundaries with my in-laws?',
      'How do I cope with family who disapprove of my relationship?',
      'How do I handle holidays with difficult in-laws?',
      'How do I know if my partner is on my side?',
      'How do I build self-worth when others reject me?',
    ],
    schemaAnswer:
      'When a partner\'s family rejects you, set boundaries on disrespect, seek your partner\'s advocacy, and protect your wellbeing without erasing who you are to win approval.',
    themes: ['In-laws', 'Rejection', 'Boundaries', 'Relationships'],
  }),
  'what-if-psychiatric-medication-doesnt-wo-181083-060': draft({
    question: "What if psychiatric medication doesn't work for me?",
    slug: 'what-if-psychiatric-medication-doesnt-wo-181083-060',
    category: 'Depression',
    title: 'When Psychiatric Medication Does Not Work',
    meta: 'First-try medication often misses the mark—many options, doses, combinations, and therapy approaches exist; persistence with a skilled prescriber improves odds.',
    summary:
      'When psychiatric medication does not work, you are not alone—the first trial often misses. Different classes, doses, combinations, and adjunct therapies exist. Honest tracking and a collaborative prescriber relationship improve the search for effective treatment.',
    takeaways: [
      'Non-response to one medication is common—not treatment failure forever.',
      'Genetics, diagnosis accuracy, and adherence all affect outcomes.',
      'Therapy plus medication often outperforms medication alone.',
      'Treatment-resistant depression has specialized options to discuss.',
    ],
    happening:
      'Frustration and hopelessness may mount after weeks without relief.\n\nSide effects without benefits can feel like proof nothing will help.',
    help:
      'Track symptoms weekly with specific metrics: sleep, mood, energy, anxiety.\n\nAllow adequate trial duration unless severe side effects emerge.\n\nReview diagnosis with your prescriber—ADHD, bipolarity, or trauma may need different approaches.\n\nDiscuss switches, augmentation, or referral to a psychiatrist specialist.\n\nCombine with evidence-based therapy (CBT, IPT, trauma-focused) when possible.\n\nAsk about treatment-resistant protocols if multiple trials fail.',
    support:
      `${SUPPORT}\n\nSeek urgent care for suicidal thoughts or severe side effects; do not stop medication abruptly without medical guidance.`,
    related: [
      'What if antidepressants change who I am?',
      'How do I know if I am depressed?',
      'How do I talk to my doctor about mental health?',
      'How do I find a psychiatrist?',
      'How do I know if therapy is working?',
    ],
    schemaAnswer:
      'If psychiatric medication does not work, try other classes, doses, combinations, and therapy with a collaborative prescriber—first-try miss is common, not the end of options.',
    themes: ['Medication', 'Depression', 'Treatment-resistant', 'Advocacy'],
    refs: [DEPRESSION, NIMH],
    notes: 'No prescribing advice; reinforce prescriber collaboration.',
  }),
  'what-is-anticipatory-grief-and-how-do-i--185387-007': draft({
    question: 'What is anticipatory grief and how do I handle it?',
    slug: 'what-is-anticipatory-grief-and-how-do-i--185387-007',
    category: 'Grief & Loss',
    title: 'Anticipatory Grief',
    meta: 'Anticipatory grief mourns a loss before it happens—common with terminal illness; allow mixed feelings and use remaining time meaningfully without guilt.',
    summary:
      'Anticipatory grief is mourning that begins before a death—often when a loved one has a terminal illness. Sadness, anger, fear, and even relief can coexist. It is normal and does not mean you love them less.',
    takeaways: [
      'Grieving before death is common with terminal or progressive illness.',
      'Mixed emotions—including relief about suffering ending—are normal.',
      'Anticipatory grief does not replace grief after the death.',
      'Meaningful time together can coexist with sorrow.',
    ],
    happening:
      'You may cry while they are still present and feel guilty for "giving up."\n\nCaregiver exhaustion and uncertainty amplify emotional waves.',
    help:
      'Name anticipatory grief without shame—it is love meeting inevitability.\n\nAllow anger, fear, sadness, and relief without ranking feelings.\n\nCreate meaningful rituals, conversations, and memory-making when possible.\n\nSay important words even if imperfect—regret weighs heavily later.\n\nAccept practical and emotional support for caregiver strain.\n\nKnow post-death grief may still arrive in new forms.',
    support:
      `${SUPPORT}\n\nSeek grief counseling or hospice support if anticipatory grief impairs functioning or caregiver burnout threatens your health.`,
    related: [
      'Is it normal to feel relief when someone dies after a long illness?',
      'How do I support a loved one who is dying?',
      'How do I cope with caregiver burnout?',
      'How long is it normal to grieve after losing someone?',
      'What is disenfranchised grief?',
    ],
    schemaAnswer:
      'Anticipatory grief mourns expected loss before death—allow mixed feelings, use remaining time meaningfully, and seek support for caregiver strain without guilt.',
    themes: ['Anticipatory grief', 'Terminal illness', 'Caregiving', 'Loss'],
    refs: [GRIEF, NIMH],
  }),
  'what-is-attachment-theory-and-how-does-i-184729-012': draft({
    question: 'What is attachment theory and how does it affect my relationships?',
    slug: 'what-is-attachment-theory-and-how-does-i-184729-012',
    category: 'Relationships & Communication',
    title: 'Attachment Theory and Relationships',
    meta: 'Attachment theory describes how early caregiving patterns influence adult closeness—secure, anxious, avoidant, or disorganized styles can shift with awareness and work.',
    summary:
      'Attachment theory explains how early bonds with caregivers shape adult expectations in relationships. Secure attachment supports balanced intimacy; insecure patterns—anxious, avoidant, or disorganized—can drive pursuit, withdrawal, or confusion. Awareness and therapy can move you toward earned security.',
    takeaways: [
      'Early caregiving creates relational templates—not unchangeable destiny.',
      'Anxious attachment fears abandonment; avoidant fears engulfment.',
      'Recognizing your pattern helps interrupt automatic reactions.',
      'Earned security is possible through consistent safe relationships and therapy.',
    ],
    happening:
      'You may chase reassurance, shut down when close, or swing between both.\n\nPast partners reenact childhood dynamics until you see the pattern.',
    help:
      'Learn your dominant style and its triggers in conflict or distance.\n\nNotice body signals when attachment threat activates—tight chest, urge to text or flee.\n\nPractice direct requests instead of protest behaviors or silent withdrawal.\n\nSeek partners willing to repair and communicate—not only chemistry.\n\nUse therapy to reparent internal responses and build secure skills.\n\nAvoid using labels to excuse harm—awareness supports responsibility.',
    support:
      `${SUPPORT}\n\nSeek therapy if attachment patterns drive chronic relationship distress, abuse cycles, or inability to trust safely.`,
    related: [
      'How do I know if I have anxious attachment?',
      'How do I stop being clingy in relationships?',
      'How do I communicate my needs in a relationship?',
      'How do I heal attachment wounds?',
      'How do I know if my relationship is codependent?',
    ],
    schemaAnswer:
      'Attachment theory links early caregiving to adult intimacy patterns—recognize anxious, avoidant, or secure tendencies and work toward earned security through awareness and therapy.',
    themes: ['Attachment theory', 'Relationships', 'Security', 'Patterns'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'what-is-compassion-fatigue-and-how-do-i--185759-040': draft({
    question: 'What is compassion fatigue and how do I prevent it in a helping profession?',
    slug: 'what-is-compassion-fatigue-and-how-do-i--185759-040',
    category: 'Work, Stress & Burnout',
    title: 'Compassion Fatigue Prevention',
    meta: 'Compassion fatigue is emotional exhaustion from absorbing others\' suffering—common in caregiving professions; boundaries, supervision, and self-care are essential.',
    summary:
      'Compassion fatigue is secondary stress from continuous exposure to others\' pain—common in healthcare, therapy, social work, and caregiving. Symptoms include numbness, cynicism, and reduced empathy. Prevention requires boundaries, supervision, rest, and treating your wellbeing as professional infrastructure.',
    takeaways: [
      'Compassion fatigue differs from ordinary tiredness—it dulls empathy over time.',
      'Helpers cannot pour from empty cups—self-care is professional duty.',
      'Boundaries and caseload limits protect longevity in helping roles.',
      'Supervision and peer support process vicarious trauma.',
    ],
    happening:
      'You may feel detached from clients you once cared deeply about.\n\nCynicism, irritability, and dread before work can creep in unnoticed.',
    help:
      'Monitor early signs: nightmares, hypervigilance, emotional numbing, irritability.\n\nSet firm work-home boundaries—rituals that end the workday mentally.\n\nUse supervision, consultation, or peer debriefing regularly.\n\nLimit caseload intensity mix—balance heavy and lighter work when possible.\n\nPrioritize sleep, movement, and non-work identity.\n\nTake leave or reduce hours before collapse forces the issue.',
    support:
      `${SUPPORT}\n\nSeek therapy if compassion fatigue drives depression, substance use, or inability to perform safely at work.`,
    related: [
      'What are the signs of burnout and how do I recover?',
      'How do I recover from burnout?',
      'How do I set boundaries at work?',
      'How do I cope with vicarious trauma?',
      'How do I prevent caregiver burnout?',
    ],
    schemaAnswer:
      'Compassion fatigue is exhaustion from others\' suffering—prevent it with boundaries, supervision, rest, and self-care treated as essential to sustainable helping work.',
    themes: ['Compassion fatigue', 'Burnout', 'Caregiving', 'Boundaries'],
    refs: [BURNOUT, NIMH],
  }),
  'what-is-dependent-personality-disorder-and-how-is-it-different-from-being-needy': draft({
    question: 'What is dependent personality disorder and how is it different from being needy?',
    slug: 'what-is-dependent-personality-disorder-and-how-is-it-different-from-being-needy',
    category: 'General Mental Health',
    title: 'Dependent Personality Disorder vs. Neediness',
    meta: 'Dependent personality disorder involves pervasive submissiveness and fear of separation impairing functioning—occasional neediness in stress differs in scope and persistence.',
    summary:
      'Dependent personality disorder (DPD) is a persistent pattern of excessive reliance on others for decision-making and care, with fear of abandonment, beginning by early adulthood and impairing functioning across contexts. Occasional neediness during stress is different in scope, flexibility, and life impact.',
    takeaways: [
      'DPD is pervasive across relationships and decisions—not situational neediness.',
      'Difficulty making everyday decisions without reassurance is a core feature.',
      'Fear of abandonment may lead to tolerating harmful relationships.',
      'Professional evaluation distinguishes traits from disorder-level impairment.',
    ],
    happening:
      'You may defer major life choices entirely, agree to avoid conflict, or panic at independence.\n\nOthers may label you "needy" without seeing the underlying terror of self-reliance.',
    help:
      'Notice patterns: decision paralysis, clinging, inability to disagree, fear of solitude.\n\nBuild micro-independence—small choices without immediate reassurance.\n\nWork with a therapist on self-trust and assertiveness skills.\n\nAvoid confusing care with control—seek relationships that encourage growth.\n\nTreat co-occurring anxiety or depression that amplifies dependence.\n\nSeek formal evaluation if patterns significantly impair work, relationships, or self-direction.',
    support:
      `${SUPPORT}\n\nSeek professional evaluation if dependence prevents functioning, sustains abuse, or causes severe distress—therapy is the primary treatment approach.`,
    related: [
      'How do I become more independent?',
      'How do I stop being a people pleaser?',
      'How do I know if my relationship is codependent?',
      'How do I build self-confidence?',
      'How do I set boundaries with others?',
    ],
    schemaAnswer:
      'Dependent personality disorder is pervasive reliance and fear of separation impairing functioning—unlike situational neediness; professional evaluation and therapy support greater independence.',
    themes: ['Personality patterns', 'Dependence', 'Autonomy', 'Relationships'],
    notes: 'No self-diagnosis; describe disorder generally and encourage professional evaluation.',
  }),
  'what-is-disenfranchised-grief-186032-008': draft({
    question: 'What is disenfranchised grief?',
    slug: 'what-is-disenfranchised-grief-186032-008',
    category: 'Grief & Loss',
    title: 'Disenfranchised Grief',
    meta: 'Disenfranchised grief occurs when society does not validate your loss—miscarriage, pet death, ex-partner loss, or job loss still deserve mourning and support.',
    summary:
      'Disenfranchised grief happens when your loss is not socially recognized or supported. Examples include death of an ex, estranged relative, pet, secret relationship, miscarriage, or non-death losses like infertility or job identity. Your grief remains valid even without public acknowledgment.',
    takeaways: [
      'Lack of social recognition does not make grief less real.',
      'Hidden or stigmatized relationships complicate mourning.',
      'Non-death losses—jobs, health, dreams—can be deeply grieving.',
      'Finding validating support matters more than performing "acceptable" grief.',
    ],
    happening:
      'Others may offer platitudes or silence because they do not see your loss as "counting."\n\nYou may hide grief to avoid judgment, intensifying isolation.',
    help:
      'Name your loss and grant yourself permission to mourn.\n\nSeek communities that understand your specific grief—pet loss groups, miscarriage support, job transition circles.\n\nRituals without audience still matter: letters, memorials, symbolic acts.\n\nEducate safe friends on what acknowledgment you need.\n\nReject comparisons that rank grief hierarchies.\n\nWork with a grief-informed therapist when isolation deepens.',
    support:
      `${SUPPORT}\n\nSeek grief counseling if disenfranchised grief impairs functioning or fuels depression and hopelessness.`,
    related: [
      'What does it mean to grieve a relationship that never happened?',
      'Is it normal to feel nothing after someone dies?',
      'How do I cope with miscarriage grief?',
      'How long is it normal to grieve after losing someone?',
      'How do I support a friend who is grieving?',
    ],
    schemaAnswer:
      'Disenfranchised grief is mourning without social validation—your loss still deserves acknowledgment, rituals, and support from understanding people or professionals.',
    themes: ['Disenfranchised grief', 'Loss', 'Validation', 'Mourning'],
    refs: [GRIEF, NIMH],
  }),
  'what-is-executive-dysfunction-and-how-does-it-affect-daily-life': draft({
    question: 'What is executive dysfunction and how does it affect daily life?',
    slug: 'what-is-executive-dysfunction-and-how-does-it-affect-daily-life',
    category: 'Work & Life Balance',
    title: 'Executive Dysfunction in Daily Life',
    meta: 'Executive dysfunction affects planning, focus, task-switching, and impulse control—common in ADHD, autism, depression, and trauma; external structure and accommodations help.',
    summary:
      'Executive dysfunction refers to difficulty with mental skills like planning, working memory, flexible thinking, and self-control—often linked to ADHD, autism, depression, anxiety, or brain injury. Daily life impact includes missed deadlines, unfinished tasks, time blindness, and overwhelm.',
    takeaways: [
      'Executive skills live largely in the prefrontal cortex and can be strained by many conditions.',
      'Time blindness and task initiation problems are common daily frustrations.',
      'External structure often works better than willpower alone.',
      'Treatment and accommodations target the underlying condition when identified.',
    ],
    happening:
      'You may know what to do but cannot start, or lose track mid-task repeatedly.\n\nShame about "laziness" often masks neurological or mental health strain.',
    help:
      'Break tasks into tiny first steps—open the doc, fill one line.\n\nUse timers, visual schedules, and body-doubling for accountability.\n\nReduce friction: prepare environments the night before.\n\nLimit multitasking; batch similar tasks.\n\nRequest workplace accommodations when ADHD or related conditions apply.\n\nTreat co-occurring depression, anxiety, or sleep deprivation that worsen executive function.',
    support:
      `${SUPPORT}\n\nSeek evaluation if executive dysfunction significantly impairs work, education, or self-care—ADHD, autism, and mood disorders have effective supports.`,
    related: [
      'What does it mean to be autistic as an adult?',
      'How do I get assessed for ADHD as an adult?',
      'How do I stop procrastinating?',
      'How do I manage time when I have ADHD?',
      'How do I explain my needs to my employer?',
    ],
    schemaAnswer:
      'Executive dysfunction impairs planning, focus, and task-switching—use external structure, accommodations, and treat underlying conditions like ADHD or depression for daily life relief.',
    themes: ['Executive function', 'ADHD', 'Productivity', 'Neurodiversity'],
    refs: [AUTISM, NIMH],
    notes: 'No self-diagnosis; encourage evaluation when impairment is significant.',
  }),
  'what-is-gaslighting-and-how-do-i-recogni-186032-030': draft({
    question: 'What is gaslighting and how do I recognize it?',
    slug: 'what-is-gaslighting-and-how-do-i-recogni-186032-030',
    category: 'Relationships & Communication',
    title: 'Gaslighting: Recognition and Response',
    meta: 'Gaslighting makes you doubt your memory and perception through denial, minimization, and blame-shifting—trust your gut and document patterns.',
    summary:
      'Gaslighting is psychological manipulation that makes you question your memory, perception, or sanity. Tactics include denying events, calling you too sensitive, rewriting history, and isolating you from reality checks. Recognition starts with trusting your gut and tracking patterns.',
    takeaways: [
      'Gaslighting is a pattern—not a single disagreement about facts.',
      'Denial of your lived experience is the core tactic.',
      'Constant self-doubt and apologizing are warning signs.',
      'External records and trusted allies restore reality testing.',
    ],
    happening:
      'You may apologize for raising valid concerns or feel confused after conversations that "did not happen."\n\nIsolation from friends who might validate you intensifies the effect.',
    help:
      'Learn tactics: denial, minimization, diversion, stereotyping you as crazy or emotional.\n\nKeep a private journal of events, dates, and exact quotes.\n\nTrust bodily alarm signals—chronic anxiety around someone matters.\n\nMaintain connections outside the relationship for perspective.\n\nUse clear language: "I know what I experienced."\n\nPlan safely if confronting a gaslighter escalates risk.',
    support:
      `${SUPPORT}\n\nSeek therapy or domestic violence resources if gaslighting coexists with control, threats, or fear—the National Domestic Violence Hotline is 1-800-799-7233.`,
    related: [
      'What are the signs of emotional abuse in a relationship?',
      'How do I know if my relationship is toxic?',
      'How do I rebuild trust in my own perceptions?',
      'How do I safely leave an abusive relationship?',
      'How do I set boundaries with a manipulative person?',
    ],
    schemaAnswer:
      'Gaslighting manipulates you to doubt your reality through denial and blame-shifting—recognize patterns, document events, trust your gut, and seek support if safety is at risk.',
    themes: ['Gaslighting', 'Manipulation', 'Emotional abuse', 'Safety'],
    flags: ['relationship-safety'],
  }),
  'what-is-grounding-and-how-can-it-help-with-anxiety': draft({
    question: 'What is grounding and how can it help with anxiety?',
    slug: 'what-is-grounding-and-how-can-it-help-with-anxiety',
    category: 'Anxiety & Stress',
    title: 'Grounding for Anxiety',
    meta: 'Grounding reconnects you to the present through senses and body—5-4-3-2-1, cold water, and physical anchors interrupt anxiety and dissociation spirals.',
    summary:
      'Grounding techniques redirect attention from anxious thoughts to present-moment sensory experience. They help during panic, dissociation, and overwhelm by activating the calming nervous system. The 5-4-3-2-1 exercise and physical anchors are widely used tools.',
    takeaways: [
      'Grounding interrupts anxiety spirals by engaging the senses.',
      '5-4-3-2-1 naming (see, touch, hear, smell, taste) is a core technique.',
      'Physical anchors—cold water, feet on floor—signal safety to the body.',
      'Regular practice makes tools accessible during acute distress.',
    ],
    happening:
      'Anxiety pulls you into future catastrophes or past loops, disconnecting from the room you are in.\n\nDissociation can make the world feel unreal or far away.',
    help:
      'Try 5-4-3-2-1: name 5 seen, 4 touched, 3 heard, 2 smelled, 1 tasted.\n\nPress feet into the floor; name the surface beneath you.\n\nHold ice or splash cold water to stimulate the vagus nerve.\n\nDescribe your environment aloud in concrete detail.\n\nUse paced breathing with longer exhales.\n\nPractice when calm so skills are familiar during spikes.',
    support:
      `${SUPPORT}\n\nSeek therapy if anxiety or dissociation is frequent, causes avoidance, or includes panic you cannot manage alone.`,
    related: [
      'What are some quick techniques to calm anxiety in the moment?',
      'How do I stop a panic attack?',
      'How do I calm my nervous system?',
      'What is progressive muscle relaxation and how do I do it?',
      'How do I manage anxiety without medication?',
    ],
    schemaAnswer:
      'Grounding helps anxiety by reconnecting you to the present through senses and body—use 5-4-3-2-1, physical anchors, and breathing to interrupt spirals.',
    themes: ['Grounding', 'Anxiety', 'Panic', 'Coping skills'],
    refs: [ANXIETY, NIMH],
  }),
  'what-is-histrionic-personality-disorder-and-how-is-it-treated': draft({
    question: 'What is histrionic personality disorder and how is it treated?',
    slug: 'what-is-histrionic-personality-disorder-and-how-is-it-treated',
    category: 'General Mental Health',
    title: 'Histrionic Personality Disorder',
    meta: 'Histrionic personality disorder involves pervasive attention-seeking and dramatic emotionality—therapy focuses on emotion regulation, self-worth, and relationship patterns.',
    summary:
      'Histrionic personality disorder (HPD) is a persistent pattern of excessive emotionality and attention-seeking across contexts, beginning by early adulthood. Treatment is primarily psychotherapy focusing on emotion regulation, underlying self-worth needs, and healthier relationship patterns.',
    takeaways: [
      'HPD features discomfort when not the center of attention and theatrical expression.',
      'Shifting shallow emotions can strain relationships over time.',
      'Therapy—not medication—is the primary treatment approach.',
      'Professional diagnosis requires pattern across contexts, not single traits.',
    ],
    happening:
      'You or someone you know may escalate dramatic behavior when attention shifts elsewhere.\n\nRelationships may feel intense but lack depth or consistency.',
    help:
      'Seek evaluation from a mental health professional rather than self-labeling.\n\nTherapy modalities may include psychodynamic or CBT approaches for pattern awareness.\n\nBuild self-worth not dependent on audience reactions.\n\nPractice tolerating others receiving attention without escalating.\n\nDevelop emotional vocabulary beyond performance.\n\nAddress co-occurring depression or anxiety if present.',
    support:
      `${SUPPORT}\n\nSeek professional evaluation if attention-seeking patterns impair relationships, work, or self-respect—therapy is the main treatment pathway.`,
    related: [
      'What is dependent personality disorder and how is it different from being needy?',
      'What is paranoid personality disorder and how does it affect relationships?',
      'How do I build self-worth beyond external validation?',
      'How do I stop seeking validation from others?',
      'How do I find the right therapist?',
    ],
    schemaAnswer:
      'Histrionic personality disorder involves pervasive attention-seeking and dramatic emotionality—therapy targeting emotion regulation and self-worth is the primary treatment.',
    themes: ['Personality patterns', 'Attention-seeking', 'Therapy', 'Emotion regulation'],
    notes: 'No self-diagnosis; describe disorder generally and encourage professional evaluation.',
  }),
  'what-is-paranoid-personality-disorder-and-how-does-it-affect-relationships': draft({
    question: 'What is paranoid personality disorder and how does it affect relationships?',
    slug: 'what-is-paranoid-personality-disorder-and-how-does-it-affect-relationships',
    category: 'Relationships & Communication',
    title: 'Paranoid Personality Disorder and Relationships',
    meta: 'Paranoid personality disorder involves pervasive distrust and suspicion—relationships suffer from withheld confiding, grudges, and interpreting benign acts as threats.',
    summary:
      'Paranoid personality disorder (PPD) is a pervasive pattern of distrust and suspicion of others\' motives, beginning by early adulthood. Relationships are strained by reluctance to confide, reading hidden threats into neutral events, and persistent grudges.',
    takeaways: [
      'PPD involves unjustified suspicion—not healthy caution after betrayal.',
      'Reluctance to confide prevents intimacy from developing.',
      'Benign remarks may be interpreted as insults or threats.',
      'Therapy is challenging but can help when someone is motivated to engage.',
    ],
    happening:
      'Partners may feel constantly accused or unable to earn trust.\n\nThe person with PPD may isolate to avoid perceived exploitation.',
    help:
      'If you recognize these patterns in yourself, seek professional evaluation without self-diagnosing.\n\nTherapy focuses on trust-building skills and reality testing over time.\n\nIf a partner has PPD, set boundaries on accusations and seek couples support cautiously.\n\nAvoid escalating debates about loyalty—consistent trustworthy behavior matters.\n\nProtect your own mental health if suspicion becomes controlling.\n\nKnow that treatment engagement is often gradual and trust-dependent.',
    support:
      `${SUPPORT}\n\nSeek therapy individually if relationship distrust impairs your life, or safety resources if paranoia escalates to threats or control.`,
    related: [
      'What is gaslighting and how do I recognize it?',
      'How do I rebuild trust in a relationship?',
      'How do I know if my partner is overly jealous?',
      'How do I set boundaries with a suspicious partner?',
      'How do I find the right therapist?',
    ],
    schemaAnswer:
      'Paranoid personality disorder drives pervasive distrust that damages relationships through suspicion and grudges—professional therapy helps when someone is willing to engage.',
    themes: ['Paranoia', 'Trust', 'Relationships', 'Personality patterns'],
    notes: 'No self-diagnosis; describe disorder generally and encourage professional evaluation.',
  }),
  'what-is-progressive-muscle-relaxation-and-how-do-i-do-it': draft({
    question: 'What is progressive muscle relaxation and how do I do it?',
    slug: 'what-is-progressive-muscle-relaxation-and-how-do-i-do-it',
    category: 'General Mental Health',
    title: 'Progressive Muscle Relaxation',
    meta: 'PMR systematically tenses then releases muscle groups to teach your body the difference between tension and relaxation—effective for stress, anxiety, and sleep.',
    summary:
      'Progressive muscle relaxation (PMR) tenses then releases muscle groups from toes to head, teaching awareness of tension versus relaxation. Developed by Edmund Jacobson, it reduces stress, anxiety, and physical tension by activating the parasympathetic nervous system.',
    takeaways: [
      'PMR contrasts tension and release to train body awareness.',
      'Systematic progression—feet to face—is the standard approach.',
      '5–10 seconds of tension followed by release is typical timing.',
      'Regular practice improves sleep and daily tension recognition.',
    ],
    happening:
      'Chronic stress may leave muscles tight without conscious notice.\n\nAnxiety often lives in the body as jaw, shoulder, or stomach clenching.',
    help:
      'Find a quiet spot; sit or lie comfortably.\n\nStart with feet: tense 5–10 seconds, release, notice the difference 10–20 seconds.\n\nMove up: calves, thighs, glutes, abdomen, hands, arms, shoulders, face.\n\nBreathe normally; do not hold breath during tension.\n\nPractice 10–20 minutes daily or before sleep.\n\nUse abbreviated versions (shoulders and jaw only) at your desk when needed.',
    support:
      `${SUPPORT}\n\nSeek medical care for unexplained persistent pain; seek therapy if anxiety remains severe despite regular practice.`,
    related: [
      'What are some simple relaxation techniques I can do anywhere?',
      'What is grounding and how can it help with anxiety?',
      'How do I improve my sleep quality?',
      'How do I calm my nervous system?',
      'What are body scan meditations and how do they help?',
    ],
    schemaAnswer:
      'Progressive muscle relaxation tenses then releases muscle groups systematically to reduce stress and teach tension awareness—practice from feet to face for 10–20 minutes.',
    themes: ['Relaxation', 'Stress relief', 'Anxiety', 'Body awareness'],
    refs: [ANXIETY, CDC],
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
  'reports/enrichment-corpus/draft-answers/batch-27-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-27-drafts.json`);
