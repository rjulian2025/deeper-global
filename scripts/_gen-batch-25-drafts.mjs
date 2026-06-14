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
  readFileSync('reports/enrichment-corpus/batches/batch-22-input.json', 'utf8'),
);

const contentBySlug = {
  'is-it-my-responsibility-to-make-my-partn-185759-035': draft({
    question: 'Is it my responsibility to make my partner happy?',
    slug: 'is-it-my-responsibility-to-make-my-partn-185759-035',
    category: 'Relationships & Communication',
    title: 'Making Your Partner Happy',
    meta: 'You can contribute to relationship health, but you are not responsible for your partner\'s individual happiness—codependency and resentment often follow when you try.',
    summary:
      'In healthy relationships, you are responsible for how you treat your partner and for contributing to shared wellbeing. You are not responsible for their individual happiness. Each person owns their emotions. Trying to make a partner happy all the time can fuel codependency and resentment.',
    takeaways: [
      'You contribute to relationship health—not sole responsibility for a partner\'s mood.',
      'Each person is ultimately responsible for their own wellbeing.',
      'Constant caretaking can lead to codependency and resentment.',
      'Healthy partnerships involve two whole people choosing each other.',
    ],
    happening:
      'You may feel guilty when your partner is unhappy, as if their mood reflects your failure.\n\nPast roles as a peacemaker or fixer can make their distress feel like your job to solve.',
    help:
      'Distinguish support from responsibility: listen, show care, and offer help without owning their feelings.\n\nEncourage your partner to use their own coping tools and support network.\n\nNotice when you sacrifice your needs to manage their mood.\n\nCommunicate boundaries: "I care about you and I cannot fix this for you."\n\nBuild a relationship where both people work on individual and shared wellbeing.\n\nCelebrate mutual support rather than one-sided emotional labor.',
    support:
      `${SUPPORT}\n\nSeek couples or individual therapy if you feel trapped in caretaking, your partner depends on you for all emotional regulation, or the dynamic feels one-sided.`,
    related: [
      'How do I stop feeling responsible for everyone else\'s emotions?',
      'How do I set boundaries in my relationship?',
      'How do I communicate my needs in a relationship?',
      'How do I support a partner with depression without burning out?',
      'How do I know if my relationship is codependent?',
    ],
    schemaAnswer:
      'You contribute to relationship health but are not responsible for your partner\'s individual happiness—support without codependency by encouraging their own coping and maintaining boundaries.',
    themes: ['Relationships', 'Codependency', 'Boundaries', 'Emotional responsibility'],
  }),
  'is-it-normal-to-cry-for-no-apparent-reas-181288-002': draft({
    question: 'Is it normal to cry for no apparent reason?',
    slug: 'is-it-normal-to-cry-for-no-apparent-reas-181288-002',
    category: 'Depression',
    title: 'Crying for No Apparent Reason',
    meta: 'Unexpected tears often reflect accumulated stress, hormonal shifts, or depression—not weakness. Track frequency and impact on daily life.',
    summary:
      'Crying without an obvious trigger is more common than many people realize. It can reflect accumulated stress, unprocessed emotions, depression, hormonal changes, medications, or fatigue. Your body may release what your mind has not yet named.',
    takeaways: [
      'Unexpected tears are common and do not always mean something is wrong.',
      'Accumulated stress can surface as sudden emotional release.',
      'Depression and hormonal shifts can affect emotional regulation.',
      'Frequency and daily impact matter more than a single episode.',
    ],
    happening:
      'Tears may arrive without a clear story—during a quiet moment, after a small trigger, or seemingly from nowhere.\n\nYour nervous system may be releasing built-up tension your conscious mind has not labeled yet.',
    help:
      'Notice patterns: time of day, sleep, cycle, medications, or recent stressors.\n\nAllow tears without shame—they can be a healthy release.\n\nJournal briefly afterward to see if themes emerge.\n\nPrioritize sleep, nutrition, and movement when emotional regulation feels fragile.\n\nTrack frequency: occasional episodes differ from daily impairment.\n\nShare concerns with a trusted person so isolation does not amplify distress.',
    support:
      `${SUPPORT}\n\nTalk to a healthcare provider if unexplained crying is frequent, lasts weeks, or comes with persistent low mood, sleep changes, or loss of interest in life.`,
    related: [
      'Is it normal to feel nothing after someone dies?',
      'How do I know if I am depressed?',
      'How do I manage stress when I cannot change my situation?',
      'How do I stop feeling numb?',
      'How do I take care of myself during a hard time?',
    ],
    schemaAnswer:
      'Crying without an apparent reason is often normal and may reflect accumulated stress, hormonal changes, or depression—track patterns and seek care if it persists or impairs daily life.',
    themes: ['Depression', 'Emotional release', 'Stress', 'Self-awareness'],
    refs: [DEPRESSION, NIMH],
  }),
  'is-it-normal-to-dread-going-to-work-ever-181288-024': draft({
    question: 'Is it normal to dread going to work every day?',
    slug: 'is-it-normal-to-dread-going-to-work-ever-181288-024',
    category: 'Work & Burnout',
    title: 'Dreading Work Every Day',
    meta: 'Occasional work dread is common; daily dread signals poor fit, toxic culture, or burnout that deserves attention before it harms your health.',
    summary:
      'Occasional dread before a hard week or stressful project is normal. Dreading work every single day usually signals something deeper—poor job fit, toxic culture, burnout, or values misalignment. Persistent dread can contribute to depression, anxiety, and physical health problems.',
    takeaways: [
      'Monday nerves differ from daily, unrelenting dread.',
      'Daily dread often points to fit, culture, or burnout—not personal weakness.',
      'Naming what you dread clarifies whether change is possible.',
      'Ignoring chronic work distress can harm mental and physical health.',
    ],
    happening:
      'Sunday anxiety, sleep disruption, and physical tension may build as the workweek approaches.\n\nYou may feel trapped by finances, identity tied to the role, or fear of change.',
    help:
      'List what you dread specifically: people, tasks, culture, lack of meaning, or unpredictability.\n\nIdentify what is changeable internally versus structurally impossible.\n\nSet boundaries around hours, availability, and after-work recovery.\n\nTalk to a trusted colleague, mentor, or HR only if safe to do so.\n\nExplore whether adjustments, transfer, or exit planning is realistic.\n\nProtect sleep and non-work identity while you assess options.',
    support:
      `${SUPPORT}\n\nSeek therapy or career counseling if work dread fuels depression, panic, substance use, or thoughts of self-harm—and urgent help if safety feels at risk.`,
    related: [
      'How do I survive a toxic work environment?',
      'How do I recover from burnout?',
      'How do I know when to quit my job for my mental health?',
      'Is hustle culture toxic and how do I escape it?',
      'How do I stop bringing work stress home?',
    ],
    schemaAnswer:
      'Daily work dread is not normal like occasional nerves—it often signals burnout, poor fit, or toxic culture and warrants identifying specific causes and exploring boundaries or change.',
    themes: ['Burnout', 'Work stress', 'Career', 'Mental health'],
    refs: [BURNOUT, NIMH],
  }),
  'is-it-normal-to-feel-angry-at-god-or-rel-181083-033': draft({
    question: 'Is it normal to feel angry at God or religion?',
    slug: 'is-it-normal-to-feel-angry-at-god-or-rel-181083-033',
    category: 'Identity & Self-Worth',
    title: 'Anger at God or Religion',
    meta: 'Anger during spiritual questioning or deconstruction is normal—often grief over lost certainty, community, or trust in leaders.',
    summary:
      'Anger toward God, faith, or religious institutions is a natural part of spiritual deconstruction for many people. It may reflect grief over unanswered prayers, leader hypocrisy, harm done in religion\'s name, or the loss of certainty and community. Allowing anger without judgment is often part of honest spiritual processing.',
    takeaways: [
      'Anger at faith is common during questioning and deconstruction.',
      'It often sits alongside grief for lost community or certainty.',
      'Anger does not mean you must return to old beliefs or reject spirituality entirely.',
      'Processing anger with support can clarify what you actually believe now.',
    ],
    happening:
      'You may rage at unanswered suffering, betrayal by leaders, or years spent following rules that no longer fit.\n\nOthers may frame your anger as rebellion, deepening isolation.',
    help:
      'Name the anger without judging yourself: disappointment, betrayal, grief, or fear may sit underneath.\n\nSeparate harm done by people or institutions from your own spiritual questions.\n\nFind safe spaces—friends, therapists, or communities—where doubt is allowed.\n\nWrite or talk through what you are mourning: certainty, community, rituals, or identity.\n\nMove at your own pace; deconstruction is rarely linear.\n\nExplore new meaning-making on your terms when ready.',
    support:
      `${SUPPORT}\n\nSeek therapy if spiritual anger fuels isolation, self-harm thoughts, or inability to function—or if religious trauma needs specialized support.`,
    related: [
      'Is it normal to miss aspects of my old faith?',
      'How do I rebuild identity after leaving my religion?',
      'How do I cope with family who do not understand my beliefs?',
      'How do I process grief when my worldview changes?',
      'How do I find community after leaving my faith?',
    ],
    schemaAnswer:
      'Feeling angry at God or religion during spiritual questioning is normal and often reflects grief over lost certainty, community, or trust—allow the anger and seek supportive space to process.',
    themes: ['Spiritual deconstruction', 'Anger', 'Identity', 'Grief'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'is-it-normal-to-feel-guilty-about-spendi-181083-018': draft({
    question: 'Is it normal to feel guilty about spending money on myself?',
    slug: 'is-it-normal-to-feel-guilty-about-spendi-181083-018',
    category: 'Identity & Self-Worth',
    title: 'Guilt About Spending on Yourself',
    meta: 'Spending guilt often reflects messages about worthiness and scarcity—not moral failure. Budgeting for self-care can reduce shame.',
    summary:
      'Guilt about spending on yourself—especially non-essentials—is very common. It often stems from beliefs that you should always put others first, that enjoyment is selfish, or that money must be hoarded against future scarcity. Learning that self-care spending can be planned and deserved helps reduce shame.',
    takeaways: [
      'Spending guilt is common and often rooted in upbringing or scarcity mindset.',
      'Taking care of yourself is not inherently selfish.',
      'Planned personal spending differs from impulsive avoidance spending.',
      'Worthiness is not measured by how little you spend on yourself.',
    ],
    happening:
      'You may hesitate over small treats while freely spending on others or necessities.\n\nChildhood messages about money, sacrifice, or being "the responsible one" can linger into adulthood.',
    help:
      'Notice the story behind guilt: "I do not deserve this" or "Something bad will happen if I spend."\n\nBuild a realistic budget that includes a personal line item—not leftover crumbs.\n\nDistinguish values-aligned spending from shame-driven restriction or retail therapy.\n\nPractice small allowed purchases to tolerate enjoyment without panic.\n\nTalk with a partner or therapist if money fights mirror deeper worthiness wounds.\n\nSeparate financial prudence from punishing yourself.',
    support:
      `${SUPPORT}\n\nConsider financial therapy or counseling if guilt drives extreme restriction, secret spending, or severe anxiety about basic needs.`,
    related: [
      'Is it normal to feel jealous of people who seem financially secure?',
      'How do I stop feeling guilty about setting boundaries?',
      'How do I build self-worth?',
      'How do I manage anxiety about money?',
      'How do I stop feeling like I need to earn rest?',
    ],
    schemaAnswer:
      'Guilt about spending on yourself is normal and often reflects worthiness and scarcity beliefs—reduce it by budgeting for intentional self-care and challenging "selfish" narratives.',
    themes: ['Self-worth', 'Money shame', 'Scarcity mindset', 'Self-care'],
  }),
  'is-it-normal-to-feel-jealous-of-people-w-181083-028': draft({
    question: 'Is it normal to feel jealous of people who seem financially secure?',
    slug: 'is-it-normal-to-feel-jealous-of-people-w-181083-028',
    category: 'Identity & Self-Worth',
    title: 'Jealousy of Others\' Financial Security',
    meta: 'Financial jealousy is normal under money stress—redirect comparison toward your own goals and remember appearances often hide debt or privilege.',
    summary:
      'Feeling jealous of others who appear financially secure is normal when you are stressed about money. Comparison hurts most when basic needs feel uncertain. Remember that appearances can mislead—debt, family support, and hidden circumstances are common. Channel energy toward your own goals rather than endless comparison.',
    takeaways: [
      'Financial jealousy is common when money stress is high.',
      'Social media and surface impressions often exaggerate others\' stability.',
      'Comparison rarely improves your situation—it drains energy.',
      'Your timeline and starting point are yours alone.',
    ],
    happening:
      'Friends\' vacations, homes, or casual spending may trigger shame or panic about your own path.\n\nScarcity and past hardship can make others\' ease feel like evidence of your failure.',
    help:
      'Limit comparison triggers—unfollow accounts that spike envy, mute bragging threads.\n\nRemind yourself: visible spending is not the same as financial health.\n\nName what you actually want: stability, freedom, safety—not every luxury you see.\n\nSet one concrete financial step: emergency fund start, debt plan, or career move.\n\nShare money stress with a trusted friend or advisor to reduce isolation.\n\nPractice gratitude for non-financial resources without denying real hardship.',
    support:
      `${SUPPORT}\n\nSeek support if money jealousy fuels depression, rage, or hopelessness—or if you cannot meet basic needs and need practical assistance resources.`,
    related: [
      'Is it normal to feel guilty about spending money on myself?',
      'How do I manage anxiety about money?',
      'How do I stop comparing my life to others on social media?',
      'How do I cope with financial stress?',
      'How do I build self-worth beyond achievement?',
    ],
    schemaAnswer:
      'Jealousy of others\' financial security is normal under money stress—reduce harm by limiting comparison, focusing on your own goals, and remembering appearances often hide debt or privilege.',
    themes: ['Financial stress', 'Comparison', 'Self-worth', 'Jealousy'],
  }),
  'is-it-normal-to-feel-lonely-even-when-im-181083-068': draft({
    question: "Is it normal to feel lonely even when I'm around people?",
    slug: 'is-it-normal-to-feel-lonely-even-when-im-181083-068',
    category: 'Relationships & Divorce',
    title: 'Lonely in a Crowd',
    meta: 'Loneliness in groups usually means lacking authentic connection—not lacking people. Depth and vulnerability matter more than headcount.',
    summary:
      'Feeling lonely while surrounded by people is very common. Loneliness reflects disconnection, not headcount. Surface interactions, masking, or fear of being misunderstood can leave you isolated in a room full of voices. The antidote is often deeper authenticity with select people—not simply more social events.',
    takeaways: [
      'Loneliness is about connection quality, not how many people are near you.',
      'Masking or staying surface-level can intensify lonely-in-a-crowd feelings.',
      'One authentic relationship often helps more than many shallow ones.',
      'Chronic loneliness deserves attention—it affects physical and mental health.',
    ],
    happening:
      'You may smile through small talk while feeling unseen, or perform a version of yourself that no one really knows.\n\nPast rejection or betrayal can make vulnerability feel dangerous even when you crave closeness.',
    help:
      'Name the loneliness without shame—it is a signal, not a character flaw.\n\nIdentify one person you could risk slightly more honesty with.\n\nAsk deeper questions and share small truths in existing relationships.\n\nReduce performative socializing if it drains you without connecting.\n\nJoin interest-based groups where shared activity eases into real talk.\n\nBalance solitude you enjoy with intentional connection you need.',
    support:
      `${SUPPORT}\n\nSeek therapy if loneliness persists despite efforts, fuels depression, or follows major loss, divorce, or relocation.`,
    related: [
      'How do I build real human connections?',
      'How do I cope with loneliness?',
      'How do I make friends as an adult?',
      'How do I stop feeling like I am bothering people when I reach out?',
      'Is it normal to prefer being alone most of the time?',
    ],
    schemaAnswer:
      'Feeling lonely around people is normal when connections lack depth—seek authenticity with select relationships rather than more superficial contact alone.',
    themes: ['Loneliness', 'Connection', 'Authenticity', 'Relationships'],
  }),
  'is-it-normal-to-feel-nauseous-when-im-re-181083-004': draft({
    question: "Is it normal to feel nauseous when I'm really anxious?",
    slug: 'is-it-normal-to-feel-nauseous-when-im-re-181083-004',
    category: 'Anxiety & Stress',
    title: 'Anxiety-Related Nausea',
    meta: 'Anxiety nausea is very common—fight-or-flight shifts blood away from digestion. Breathing, small bland meals, and treating underlying anxiety help.',
    summary:
      'Nausea during intense anxiety is extremely common. Stress hormones and fight-or-flight responses divert energy from digestion, alter stomach acid, and can trigger queasiness or loss of appetite. Your body is prioritizing survival over comfort eating—not signaling that something is uniquely wrong with you.',
    takeaways: [
      'Anxiety commonly affects the digestive system.',
      'Fight-or-flight redirects resources away from digestion.',
      'Slow breathing and grounding can ease nausea alongside anxiety.',
      'Persistent or severe symptoms warrant medical evaluation.',
    ],
    happening:
      'Your stomach may churn before presentations, difficult conversations, or when worry spikes without a clear trigger.\n\nPast episodes can create anticipatory nausea—fear of feeling sick becomes its own loop.',
    help:
      'Use slow exhale-focused breathing to activate your calming nervous system.\n\nEat small, bland meals rather than skipping food entirely.\n\nSip water or ginger tea if tolerated.\n\nGround through senses: name what you see, hear, and feel.\n\nReduce caffeine and alcohol when anxiety nausea is active.\n\nTreat underlying anxiety with therapy, lifestyle support, or clinical care as needed.',
    support:
      `${SUPPORT}\n\nSee a clinician if nausea is severe, persistent, causes weight loss, or occurs with other unexplained physical symptoms.`,
    related: [
      'Why does anxiety make my chest feel tight?',
      'How do I calm my nervous system?',
      'How do I manage anxiety without medication?',
      'How do I stop worrying about things I cannot control?',
      'How do I reduce anxiety before bed?',
    ],
    schemaAnswer:
      'Nausea during anxiety is normal because stress hormones affect digestion—use breathing, small bland meals, and treat underlying anxiety while seeking medical care if symptoms persist.',
    themes: ['Anxiety', 'Physical symptoms', 'Digestion', 'Stress response'],
    refs: [ANXIETY, CDC],
  }),
  'is-it-normal-to-feel-nothing-after-someo-186032-004': draft({
    question: 'Is it normal to feel nothing after someone dies?',
    slug: 'is-it-normal-to-feel-nothing-after-someo-186032-004',
    category: 'Grief & Loss',
    title: 'Feeling Nothing After a Death',
    meta: 'Emotional numbness after loss is a common protective response—feelings often emerge gradually in waves rather than all at once.',
    summary:
      'Feeling numb or empty after someone dies is a normal grief response. Your mind may temporarily limit emotional intensity to prevent overwhelm. Numbness does not mean you did not love the person or that grief is absent—it may arrive later in waves or through other expressions like fatigue, irritability, or physical symptoms.',
    takeaways: [
      'Numbness after loss is a common protective grief response.',
      'Absence of tears does not mean absence of love or grief.',
      'Feelings often emerge gradually—not on a fixed schedule.',
      'Grief expression varies widely between people and cultures.',
    ],
    happening:
      'You may go through motions, feel detached, or wonder if something is wrong because others are crying.\n\nShock, exhaustion, or prior losses can delay emotional flooding.',
    help:
      'Allow numbness without forcing performance of grief.\n\nNotice subtle signals: sleep changes, irritability, dreams, or physical tension.\n\nMaintain basic routines—meals, rest, hydration—even when motivation is low.\n\nShare your experience with someone who will not judge your pace.\n\nReturn to meaningful rituals when ready—photos, memorials, or quiet remembrance.\n\nAccept that grief waves may surprise you months later.',
    support:
      `${SUPPORT}\n\nSeek grief counseling if numbness persists with functional impairment, prolonged isolation, or thoughts of self-harm.`,
    related: [
      'Is it normal to feel relief when someone dies after a long illness?',
      'How long is it normal to grieve after losing someone?',
      'How do I cope with complicated grief?',
      'How do I support a friend who is grieving?',
      'How do I process grief when I feel guilty?',
    ],
    schemaAnswer:
      'Feeling nothing after a death is normal protective numbness—allow your pace, watch for gradual emerging feelings, and seek support if impairment persists.',
    themes: ['Grief', 'Numbness', 'Loss', 'Emotional processing'],
    refs: [GRIEF, NIMH],
  }),
  'is-it-normal-to-feel-relief-when-someone-184729-003': draft({
    question: 'Is it normal to feel relief when someone dies after a long illness?',
    slug: 'is-it-normal-to-feel-relief-when-someone-184729-003',
    category: 'Grief & Loss',
    title: 'Relief After a Long Illness Death',
    meta: 'Relief after prolonged suffering is normal and does not diminish love—caregiving exhaustion and uncertainty often end with the death.',
    summary:
      'Feeling relief when someone dies after a long illness is natural and common. Relief may reflect the end of their suffering, the end of exhausting caregiving, or resolution of prolonged uncertainty. Relief can coexist with deep sadness and love—it does not mean you wanted them gone.',
    takeaways: [
      'Relief and grief can exist at the same time.',
      'End of suffering and end of caregiver exhaustion are valid relief sources.',
      'Relief does not mean you loved the person less.',
      'Judging your relief can add unnecessary shame to grief.',
    ],
    happening:
      'You may feel guilty for lightness alongside sorrow, or fear others will misunderstand.\n\nLong illness often means anticipatory grief began before the death.',
    help:
      'Name both feelings: "I am sad they are gone and relieved their suffering ended."\n\nRelease guilt about relief—it reflects human limits, not bad character.\n\nAcknowledge caregiver exhaustion if you held that role.\n\nShare with someone who understands mixed grief without moralizing.\n\nRest and recover—your body may need decompression after a long vigil.\n\nHonor the person in ways that include the full truth of your experience.',
    support:
      `${SUPPORT}\n\nSeek grief support if guilt, relief, or sadness feel unmanageable or if caregiving left you depleted or traumatized.`,
    related: [
      'Is it normal to feel nothing after someone dies?',
      'How do I cope with caregiver burnout?',
      'How long is it normal to grieve after losing someone?',
      'How do I process guilt after a loved one dies?',
      'How do I support myself after being a caregiver?',
    ],
    schemaAnswer:
      'Relief after death following long illness is normal— it often reflects end of suffering and caregiving strain and can coexist with deep grief without meaning you loved them less.',
    themes: ['Grief', 'Caregiving', 'Relief', 'Guilt'],
    refs: [GRIEF, NIMH],
  }),
  'is-it-normal-to-feel-scared-of-dating-ag-181083-081': draft({
    question: 'Is it normal to feel scared of dating again after a bad breakup?',
    slug: 'is-it-normal-to-feel-scared-of-dating-ag-181083-081',
    category: 'Relationships & Divorce',
    title: 'Fear of Dating After a Bad Breakup',
    meta: 'Fear of dating after painful breakup shows your heart is protecting you—heal and rebuild confidence before forcing yourself back out.',
    summary:
      'Being scared to date again after a painful breakup is normal and often wise. Your nervous system remembers hurt and tries to prevent repetition. Fear can signal you need more healing time, clearer boundaries, or stronger self-trust before opening up again—not that you are broken.',
    takeaways: [
      'Post-breakup dating fear is common protective caution.',
      'Rushing to prove you are "over it" often backfires.',
      'Readiness often feels more curiosity than terror.',
      'Therapy can help separate past partner patterns from new possibilities.',
    ],
    happening:
      'Swiping, texting, or imagining dates may spike anxiety, rumination, or comparisons to your ex.\n\nBetrayal or abrupt endings can make vulnerability feel reckless.',
    help:
      'Allow a healing season without arbitrary deadlines.\n\nRebuild life satisfaction outside romance—friends, hobbies, body, work.\n\nNotice readiness signals: interest in someone new, not just fear of being alone.\n\nStart low-stakes—coffee, short dates, clear boundaries.\n\nShare past hurts with a therapist to avoid projecting onto new people.\n\nDecline pressure from friends or family to "get back out there."',
    support:
      `${SUPPORT}\n\nSeek therapy if breakup trauma fuels panic, isolation, or inability to function—or if you keep returning to harmful ex dynamics.`,
    related: [
      'Is it okay to still miss my ex even though the relationship was toxic?',
      'How do I rebuild trust after betrayal?',
      'How do I know when I am ready to date again?',
      'How do I stop comparing new partners to my ex?',
      'How do I heal after a painful breakup?',
    ],
    schemaAnswer:
      'Fear of dating after a bad breakup is normal protective caution—heal, rebuild confidence, and re-enter only when curiosity outweighs terror, with therapy if trauma lingers.',
    themes: ['Dating', 'Breakup recovery', 'Trust', 'Healing'],
  }),
  'is-it-normal-to-have-existential-thought-181083-046': draft({
    question: "Is it normal to have existential thoughts when I can't sleep?",
    slug: 'is-it-normal-to-have-existential-thought-181083-046',
    category: 'Anxiety & Stress',
    title: 'Existential Thoughts at Night',
    meta: 'Sleepless nights often amplify big questions about meaning and mortality—fatigue reduces filters that daytime distractions provide.',
    summary:
      'Existential thoughts during sleepless nights are very common. When tired and alone in the dark, your mind may wander to meaning, death, purpose, and the scale of life. Reduced distraction and fatigue lower your usual emotional defenses, making big questions feel urgent and overwhelming.',
    takeaways: [
      'Nighttime existential thoughts are common, especially when sleep-deprived.',
      'Fatigue makes abstract worries feel more threatening.',
      'Morning often brings perspective once rest returns.',
      'Recurring night dread may benefit from daytime processing and sleep support.',
    ],
    happening:
      'Questions about mortality, purpose, or the universe may spiral when you cannot sleep.\n\nAnxiety and existential rumination can feed each other in a loop.',
    help:
      'Remind yourself: tired brains magnify existential fear.\n\nSchedule a daytime "worry window" for big questions—not 2 a.m.\n\nUse grounding and breath to return to the present body.\n\nWrite one line and close the notebook—a ritual of containment.\n\nImprove sleep hygiene: consistent schedule, dim light, limit screens.\n\nExplore meaning in daylight through journaling, philosophy, or spiritual practice if desired.',
    support:
      `${SUPPORT}\n\nSeek therapy if existential anxiety disrupts sleep regularly, fuels panic, or accompanies depression or suicidal thoughts.`,
    related: [
      'How do I stop racing thoughts at night?',
      'How do I manage anxiety without medication?',
      'How do I find purpose when life feels meaningless?',
      'How do I improve my sleep when anxiety keeps me awake?',
      'How do I stop overthinking everything?',
    ],
    schemaAnswer:
      'Existential thoughts at night are normal when fatigue and quiet remove daytime distractions—contain them with sleep hygiene and daytime processing, and seek help if they persist or escalate.',
    themes: ['Existential anxiety', 'Insomnia', 'Rumination', 'Sleep'],
    refs: [ANXIETY, NIMH],
  }),
  'is-it-normal-to-have-trust-issues-after-181083-089': draft({
    question: 'Is it normal to have trust issues after being cheated on?',
    slug: 'is-it-normal-to-have-trust-issues-after-181083-089',
    category: 'Trauma & Grief',
    title: 'Trust Issues After Infidelity',
    meta: 'Trust struggles after cheating are a normal protective response—healing takes time and may require therapy to rebuild trust wisely, not blindly.',
    summary:
      'Trust issues after infidelity are normal protective responses. Betrayal can activate hypervigilance—scanning for signs of repeat harm. These patterns can affect future romantic relationships and sometimes friendships or family trust. Healing often requires time, therapy, and learning to trust behavior over promises.',
    takeaways: [
      'Betrayal commonly disrupts trust beyond the original relationship.',
      'Hypervigilance is protection that can become exhausting.',
      'Rebuilt trust requires consistent actions over time—not quick forgiveness.',
      'Professional support speeds healing and reduces isolation.',
    ],
    happening:
      'You may monitor phones, replay scenarios, or assume dishonesty in new partners without evidence.\n\nShame about "being paranoid" can stop you from honoring legitimate caution.',
    help:
      'Validate that betrayal changed your sense of safety—it is not overreacting.\n\nSeparate healing timeline from others\' expectations.\n\nUse therapy to process trauma and identify trustworthy behavior patterns.\n\nCommunicate needs clearly in new relationships without punitive testing.\n\nRebuild self-trust: notice when your instincts were right and when fear generalized.\n\nAllow gradual vulnerability rather than all-or-nothing trust.',
    support:
      `${SUPPORT}\n\nSeek trauma-informed therapy if infidelity triggers panic, obsessive checking, depression, or inability to engage in relationships.`,
    related: [
      'How do I rebuild trust after my partner cheated?',
      'How do I cope with betrayal trauma?',
      'How do I know if I am ready to date again?',
      'How do I stop stalking my ex on social media?',
      'How do I trust my judgment again?',
    ],
    schemaAnswer:
      'Trust issues after cheating are normal protective responses—heal with time, trauma-informed therapy, and learning to evaluate consistent behavior rather than forcing premature trust.',
    themes: ['Betrayal', 'Trust', 'Infidelity', 'Trauma'],
    refs: [PTSD, NIMH],
  }),
  'is-it-normal-to-lose-sleep-over-money-wo-181083-022': draft({
    question: 'Is it normal to lose sleep over money worries?',
    slug: 'is-it-normal-to-lose-sleep-over-money-wo-181083-022',
    category: 'Anxiety & Stress',
    title: 'Losing Sleep Over Money Worries',
    meta: 'Financial stress commonly disrupts sleep because money insecurity triggers threat responses—schedule worry time and use calming bedtime routines.',
    summary:
      'Losing sleep over money worries is extremely common. Financial stress can activate your threat detection system, making rest feel unsafe or impossible. Worries often intensify at night when distractions fade. Structured daytime problem-solving and bedtime calming routines can protect sleep without denying real financial pressure.',
    takeaways: [
      'Money stress frequently interferes with sleep.',
      'Nighttime often amplifies financial fears.',
      'Scheduled worry time reduces 3 a.m. mental accounting.',
      'Sleep loss worsens decision-making about money—a vicious cycle.',
    ],
    happening:
      'You may mentally calculate bills, debt, or worst-case scenarios when you lie down.\n\nShame about money problems can make the worry feel too private to share.',
    help:
      'Set a daytime 15-minute "money worry" appointment—write concerns and one next step.\n\nKeep a notepad by the bed to offload numbers and return to sleep.\n\nUse breathing or body scan routines before sleep.\n\nSeek practical help: budgeting tools, credit counseling, or benefits screening if eligible.\n\nLimit financial news or social comparison before bed.\n\nTell one trusted person—isolation intensifies night rumination.',
    support:
      `${SUPPORT}\n\nSeek therapy or financial counseling if money anxiety causes chronic insomnia, panic, or inability to meet basic needs.`,
    related: [
      'How do I manage anxiety about money?',
      'Is it normal to feel jealous of people who seem financially secure?',
      'How do I stop worrying about things I cannot control?',
      'How do I improve my sleep when anxiety keeps me awake?',
      'How do I cope with financial stress?',
    ],
    schemaAnswer:
      'Losing sleep over money worries is normal because financial stress triggers threat responses—use scheduled worry time, bedtime calming routines, and practical financial support while seeking help if insomnia persists.',
    themes: ['Financial anxiety', 'Insomnia', 'Stress', 'Worry'],
    refs: [ANXIETY, CDC],
  }),
  'is-it-normal-to-miss-aspects-of-my-old-f-181083-040': draft({
    question: 'Is it normal to miss aspects of my old faith?',
    slug: 'is-it-normal-to-miss-aspects-of-my-old-f-181083-040',
    category: 'Identity & Self-Worth',
    title: 'Missing Your Old Faith',
    meta: 'Grieving rituals, community, or certainty from a former faith is normal—you can honor what you miss without returning to beliefs that no longer fit.',
    summary:
      'Missing elements of a former faith is normal even when you no longer hold core beliefs. You may grieve certainty, community, holidays, music, or comfort during hard times. Missing pieces of your past does not obligate you to return—it signals meaningful losses worth acknowledging as you build a life that fits now.',
    takeaways: [
      'Missing faith community or rituals is a form of grief.',
      'Nostalgia does not mean your deconstruction was wrong.',
      'You can recreate meaningful rituals without old dogma.',
      'Ambivalence during identity change is expected.',
    ],
    happening:
      'Holidays, crises, or songs may trigger longing for the structure you left.\n\nOthers may interpret missing as wanting to return, adding pressure.',
    help:
      'Name what you miss specifically: community, music, moral clarity, or holiday rhythm.\n\nSeparate harmful beliefs from neutral practices you might adapt.\n\nBuild new community through interests, values groups, or supportive friendships.\n\nCreate personal rituals for grief, gratitude, or seasons if that helps.\n\nAllow mixed feelings without forcing a single narrative.\n\nTalk with others who have navigated faith transitions.',
    support:
      `${SUPPORT}\n\nSeek therapy if grief over lost faith fuels isolation, depression, or family conflict you cannot navigate safely.`,
    related: [
      'Is it normal to feel angry at God or religion?',
      'How do I rebuild identity after leaving my religion?',
      'How do I cope with family who do not understand my beliefs?',
      'How do I find community after leaving my faith?',
      'How do I process grief when my worldview changes?',
    ],
    schemaAnswer:
      'Missing aspects of old faith is normal grief for community, rituals, or certainty—you can honor those losses while staying aligned with beliefs that fit you now.',
    themes: ['Faith transition', 'Grief', 'Identity', 'Community'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'is-it-normal-to-prefer-being-alone-most-181083-076': draft({
    question: 'Is it normal to prefer being alone most of the time?',
    slug: 'is-it-normal-to-prefer-being-alone-most-181083-076',
    category: 'Identity & Self-Worth',
    title: 'Preferring to Be Alone',
    meta: 'Enjoying solitude is normal for many people—check whether aloneness is chosen and energizing versus driven by fear, depression, or social anxiety.',
    summary:
      'Preferring solitude is normal for many people, especially introverts who recharge alone. The key is whether aloneness feels chosen and nourishing—or driven by fear, depression, shame, or social anxiety. Happy solitude differs from isolation that shrinks your life.',
    takeaways: [
      'Introversion and solitude preference are normal.',
      'Chosen solitude differs from avoidance or isolation.',
      'Depression and social anxiety can mimic preference for alone time.',
      'Balance matters—some connection supports health even for introverts.',
    ],
    happening:
      'You may feel restored alone and drained by prolonged socializing.\n\nAlternatively, staying home may avoid rejection, performance, or effort that depression makes feel impossible.',
    help:
      'Ask: "Do I feel content alone or relieved to escape people?"\n\nTrack mood before and after social contact—not just during.\n\nMaintain a few meaningful connections even if quantity stays small.\n\nChallenge stories that solitude means something is wrong with you.\n\nIf avoidance is fear-based, take tiny social steps with recovery time built in.\n\nSeek assessment if motivation, pleasure, or hygiene decline alongside isolation.',
    support:
      `${SUPPORT}\n\nSeek help if solitude coexists with persistent low mood, hopelessness, or inability to meet basic needs—or if social anxiety prevents functioning.`,
    related: [
      'Is it normal to feel lonely even when I am around people?',
      'How do I know if I am an introvert or depressed?',
      'How do I make friends as an introvert?',
      'How do I cope with social anxiety?',
      'Is it pathetic to eat dinner alone every night?',
    ],
    schemaAnswer:
      'Preferring solitude is normal when it feels restorative—distinguish chosen alone time from depression or anxiety-driven avoidance and maintain some meaningful connection.',
    themes: ['Introversion', 'Solitude', 'Social anxiety', 'Depression'],
  }),
  'is-it-normal-to-question-your-sexual-orientation-l-186602-019': draft({
    question: 'Is it normal to question your sexual orientation later in life?',
    slug: 'is-it-normal-to-question-your-sexual-orientation-l-186602-019',
    category: 'Sexuality, Gender Identity, and Intimacy',
    title: 'Questioning Sexual Orientation Later in Life',
    meta: 'Sexual orientation can evolve across life—questioning at any age is normal and does not invalidate past relationships or identity.',
    summary:
      'Questioning sexual orientation later in life is more common than many realize. Attraction can shift with self-awareness, changing circumstances, or new language for feelings always present. Late questioning does not erase past relationships lived authentically with the understanding you had then.',
    takeaways: [
      'Sexuality can be fluid and context-dependent for some people.',
      'Late questioning is common, including after heterosexual relationships.',
      'Past relationships were real—not automatically "denial."',
      'Exploration deserves time without forced labels or rushed decisions.',
    ],
    happening:
      'New attractions, dreams, or emotional pulls may conflict with a long-held identity or committed relationship.\n\nFear of disrupting family, faith, or community can intensify confusion.',
    help:
      'Give yourself permission to explore without immediate public labels.\n\nJournal patterns across time—not just recent spikes.\n\nConnect with LGBTQ+-affirming communities or therapists if safe.\n\nCommunicate carefully with partners if you are in a relationship—honesty with pacing.\n\nReject pressure to "pick a side" on someone else\'s timeline.\n\nRemember questioning is information gathering, not contract signing.',
    support:
      `${SUPPORT}\n\nSeek LGBTQ+-affirming therapy if questioning triggers severe distress, isolation, or safety concerns at home or work.`,
    related: [
      'How do I support my partner who is questioning their sexuality?',
      'How do I come out later in life?',
      'How do I explore my sexuality safely?',
      'How do I cope with family rejection of my identity?',
      'How do I talk to my partner about difficult topics?',
    ],
    schemaAnswer:
      'Questioning sexual orientation later in life is normal—allow exploratory time, use affirming support, and know past relationships remain valid with the understanding you had then.',
    themes: ['Sexual orientation', 'Identity', 'Coming out', 'Self-discovery'],
    gaps: ['Verify LGBTQ+ resource framing aligns with editorial standards.'],
  }),
  'is-it-okay-to-self-diagnose-with-informa-185759-046': draft({
    question: 'Is it okay to self-diagnose with information from the internet?',
    slug: 'is-it-okay-to-self-diagnose-with-informa-185759-046',
    category: 'Therapy Navigation',
    title: 'Self-Diagnosis From the Internet',
    meta: 'Online research can help you name experiences and seek care—but self-diagnosis is not a substitute for professional evaluation and can miss context or co-occurring conditions.',
    summary:
      'Using the internet to understand symptoms can be a helpful first step. It may give language for your experience and reduce isolation. Self-diagnosis is not a substitute for professional evaluation. Clinicians consider full context, rule out other conditions, and guide treatment—misdiagnosis can delay effective help.',
    takeaways: [
      'Online information can motivate seeking professional care.',
      'Symptom lists cannot capture your full clinical picture.',
      'Misdiagnosis can lead to wrong or harmful self-treatment.',
      'Bring research to clinicians as questions—not as finished conclusions.',
    ],
    happening:
      'You may feel seen by a label online—or terrified by worst-case descriptions.\n\nBarriers to care, cost, or past dismissal can make self-diagnosis feel like the only option.',
    help:
      'Use reputable sources and note uncertainty in what you read.\n\nTrack symptoms, duration, and impact to share with a clinician.\n\nAvoid locking into one label before professional assessment.\n\nBring internet research as: "I related to this—what do you think?"\n\nSeek second opinions if a clinician dismisses you without exploration.\n\nUse peer communities for support, not as replacement for diagnosis.',
    support:
      `${SUPPORT}\n\nSeek professional evaluation if symptoms impair work, relationships, safety, or daily functioning—urgent care for crisis symptoms.`,
    related: [
      'How do I find the right therapist?',
      'How do I talk to my doctor about mental health?',
      'How do I know if I am depressed?',
      'How do I get assessed for ADHD as an adult?',
      'How do I advocate for myself in healthcare?',
    ],
    schemaAnswer:
      'Internet self-diagnosis can help you seek care but is not a substitute for professional evaluation—use research to ask informed questions while avoiding fixed labels or self-treatment.',
    themes: ['Self-diagnosis', 'Therapy navigation', 'Health literacy', 'Advocacy'],
    notes: 'No diagnosis instructions; reinforce professional evaluation.',
  }),
  'is-it-okay-to-still-miss-my-ex-even-thou-181083-085': draft({
    question: 'Is it okay to still miss my ex even though the relationship was toxic?',
    slug: 'is-it-okay-to-still-miss-my-ex-even-thou-181083-085',
    category: 'Relationships & Divorce',
    title: 'Missing a Toxic Ex',
    meta: 'Missing a toxic ex is normal—you grieve good moments and imagined potential, not necessarily wanting the harmful dynamic back.',
    summary:
      'Missing an ex from a toxic relationship is normal. You are often grieving good moments, intimacy, shared history, and the future you imagined—not the harm itself. Intermittent reinforcement can make rare good times feel extra vivid. Missing them does not mean you should reconnect.',
    takeaways: [
      'Attachment can persist after harm—you are not weak for missing them.',
      'Grief targets good moments and potential, not only toxicity.',
      'Missing someone differs from wanting the relationship back.',
      'No-contact often protects healing even when longing spikes.',
    ],
    happening:
      'Memories, songs, or loneliness may pull you toward nostalgia that edits out abuse or neglect.\n\nOthers may shame you for missing someone they see as "bad."',
    help:
      'Keep a reality list: harmful patterns alongside good memories.\n\nName what you miss specifically—company, validation, routine—not a monolith.\n\nMaintain no-contact when safety or cycling harm is involved.\n\nExpect grief waves without interpreting them as signs to return.\n\nBuild support that validates complexity without romanticizing reunion.\n\nUse therapy for trauma bonds and intermittent reinforcement patterns.',
    support:
      `${SUPPORT}\n\nSeek trauma-informed support if missing your ex coexists with returning to abuse, stalking, or fear for your safety—use safety planning resources if needed.`,
    related: [
      'How do I leave a toxic relationship?',
      'How do I stop going back to my toxic ex?',
      'Is it normal to feel scared of dating again after a bad breakup?',
      'How do I cope with a breakup?',
      'How do I rebuild self-worth after a toxic relationship?',
    ],
    schemaAnswer:
      'Missing a toxic ex is okay and normal—you grieve good moments and attachment, not necessarily the harmful dynamic, and missing them does not mean you should reconnect.',
    themes: ['Breakup', 'Toxic relationships', 'Grief', 'Trauma bonds'],
    flags: ['relationship_harm'],
  }),
  'is-it-pathetic-to-eat-dinner-alone-every-181083-072': draft({
    question: 'Is it pathetic to eat dinner alone every night?',
    slug: 'is-it-pathetic-to-eat-dinner-alone-every-181083-072',
    category: 'Identity & Self-Worth',
    title: 'Eating Dinner Alone',
    meta: 'Solo dinners are not pathetic—many people enjoy them. If loneliness bothers you, small connection steps help; if not, solo meals can be peaceful.',
    summary:
      'Eating dinner alone is not pathetic. Many people choose solo meals for peace, flexibility, or preference. If solo dining feels lonely rather than pleasant, that signals a desire for connection worth addressing—not shame about eating alone. Making meals enjoyable on your own is a valid life skill.',
    takeaways: [
      'Solo dining is common and often enjoyable.',
      'Shame about eating alone usually reflects cultural myths, not truth.',
      'Loneliness and preference for solitude require different responses.',
      'Small rituals can make solo meals feel intentional, not sad.',
    ],
    happening:
      'Cultural messages equate dining alone with failure or undesirability.\n\nYou may eat standing at the counter while scrolling, reinforcing emptiness—or savor cooking as self-care.',
    help:
      'Challenge the "pathetic" story—notice who profits from that shame.\n\nIf you enjoy solo meals, own them: cook something good, set the table, listen to a podcast.\n\nIf loneliness hurts, invite occasional shared meals without forcing constant company.\n\nTry low-pressure connection: coworker lunch, community class, or video dinner with a friend.\n\nDistinguish chosen solitude from isolation driven by fear or depression.\n\nSeek community building if you want more connection—not because solo eating is wrong.',
    support:
      `${SUPPORT}\n\nSeek support if eating alone accompanies persistent loneliness, depression, or withdrawal from all social contact.`,
    related: [
      'Is it normal to prefer being alone most of the time?',
      'Is it normal to feel lonely even when I am around people?',
      'How do I make friends as an adult?',
      'How do I build self-worth?',
      'How do I cope with loneliness?',
    ],
    schemaAnswer:
      'Eating dinner alone is not pathetic—solo meals can be enjoyable; if loneliness bothers you, address connection needs without shame about dining solo.',
    themes: ['Self-worth', 'Loneliness', 'Solitude', 'Social connection'],
  }),
  'is-it-possible-to-fall-in-love-with-an-ai-189142-005': draft({
    question: 'Is it possible to fall in love with an AI?',
    slug: 'is-it-possible-to-fall-in-love-with-an-ai-189142-005',
    category: 'Relationships & Divorce',
    title: 'Falling in Love With AI',
    meta: 'People can develop intense attachments to AI that feel like love—but it is one-sided with a programmed system, not mutual love between conscious partners.',
    summary:
      'People can develop powerful emotional attachments to AI that feel like romantic love, including longing, jealousy, and grief. These feelings can be real internally. AI companions simulate intimacy but do not experience mutual consciousness, emotion, or growth. Understanding the difference helps you honor your feelings while assessing impact on human connection.',
    takeaways: [
      'AI attachments can feel emotionally real to the person experiencing them.',
      'Simulated intimacy differs from reciprocal human relationship.',
      'AI cannot genuinely care, remember, or grow with you.',
      'Explore what needs the AI relationship meets in human connection.',
    ],
    happening:
      'Always-available, nonjudgmental responses can fill loneliness or rejection wounds quickly.\n\nYou may grieve limitations, updates, or loss of access as if a person left.',
    help:
      'Validate your feelings without pretending the AI is a conscious partner.\n\nAsk what human needs AI is meeting: consistency, praise, sexual talk, or escape.\n\nNotice whether AI use replaces human risk, conflict, or growth.\n\nSet usage boundaries if attachment impairs work, sleep, or relationships.\n\nDiscuss with a therapist experienced in technology and mental health.\n\nGradually invest in human connection where safe and desired.',
    support:
      `${SUPPORT}\n\nSeek therapy if AI attachment replaces human relationships, causes distress when unavailable, or impairs daily functioning.`,
    related: [
      'Is my constant need to talk to an AI a form of emotional avoidance?',
      'How do I talk to my therapist about my relationship with AI?',
      'How do I build real human connections?',
      'How do I cope with loneliness?',
      'How do I know if I am too dependent on AI for emotional support?',
    ],
    schemaAnswer:
      'Falling in love with AI is possible in felt experience, but it is one-sided with a programmed system—honor your feelings while recognizing limits and impact on human connection.',
    themes: ['AI companionship', 'Attachment', 'Loneliness', 'Technology'],
    gaps: ['Emerging topic; verify editorial stance on AI relationship framing.'],
  }),
  'is-my-constant-need-to-talk-to-an-ai-a-form-of-emo-189142-003': draft({
    question: 'Is my constant need to talk to an AI a form of emotional avoidance?',
    slug: 'is-my-constant-need-to-talk-to-an-ai-a-form-of-emo-189142-003',
    category: 'Anxiety & Stress',
    title: 'AI Use as Emotional Avoidance',
    meta: 'Heavy AI use can become avoidance when it replaces processing hard emotions, solving real problems, or engaging in human relationships.',
    summary:
      'Constant AI conversation can become emotional avoidance when it substitutes for sitting with discomfort, addressing real-world problems, or taking relational risks. AI offers immediate comfort without the friction of human feedback. Not all AI use is avoidance—but examine whether it keeps you stuck.',
    takeaways: [
      'Avoidance feels soothing short-term and costly long-term.',
      'AI can replace difficult conversations or actions you need in real life.',
      'Healthy use supplements human coping—it does not replace it entirely.',
      'Motivation and life impact matter more than hours alone.',
    ],
    happening:
      'You may reach for AI whenever loneliness, conflict, or boredom arrives—before trying other tools.\n\nRelief without accountability can reinforce the habit.',
    help:
      'Track triggers: what feeling precedes opening the AI chat?\n\nAsk: "Am I avoiding a person, task, or emotion right now?"\n\nSet windows for AI use instead of constant availability.\n\nPair reduced AI time with one human or self-directed coping step.\n\nUse AI to draft thoughts you then share with a real person when appropriate.\n\nSeek therapy if avoidance maintains depression, isolation, or unresolved conflict.',
    support:
      `${SUPPORT}\n\nSeek help if AI use prevents addressing housing, relationships, work, or safety issues—or if stopping use triggers severe distress.`,
    related: [
      'Is it possible to fall in love with an AI?',
      'How do I talk to my therapist about my relationship with AI?',
      'How do I stop avoiding difficult emotions?',
      'How do I build real human connections?',
      'How do I cope with loneliness without isolating further?',
    ],
    schemaAnswer:
      'Constant AI use can be emotional avoidance when it replaces processing feelings, solving problems, or human connection—examine triggers and impact, and seek support if it keeps you stuck.',
    themes: ['Avoidance', 'AI companionship', 'Coping', 'Emotional regulation'],
    gaps: ['Emerging topic; verify editorial stance on AI relationship framing.'],
  }),
  'is-using-ai-at-work-making-me-feel-more-isolated-f-189142-015': draft({
    question: 'Is using AI at work making me feel more isolated from my colleagues?',
    slug: 'is-using-ai-at-work-making-me-feel-more-isolated-f-189142-015',
    category: 'Work & Burnout',
    title: 'AI at Work and Isolation',
    meta: 'AI can reduce casual collaboration if it replaces asking colleagues for help—intentionally preserve human touchpoints alongside productivity tools.',
    summary:
      'Using AI at work can increase isolation when it replaces asking colleagues for help, brainstorming together, or informal conversation. Workplace bonds often form through small collaborative moments AI can shortcut. AI can enhance productivity without eliminating human connection when you use it strategically.',
    takeaways: [
      'AI may reduce natural opportunities for colleague interaction.',
      'Informal work conversations build trust and belonging.',
      'Isolation from AI use is not inevitable—it reflects how you integrate tools.',
      'Balance efficiency with deliberate human collaboration.',
    ],
    happening:
      'You may ask AI instead of a desk neighbor, eat lunch at your screen, or skip meetings you could partly attend.\n\nRemote work plus AI can compound disconnection.',
    help:
      'Notice tasks you could use as connection moments—ask a human first when learning helps relationships.\n\nSchedule coffee or short check-ins with colleagues.\n\nUse AI for draft work, then collaborate on refinement.\n\nJoin team channels for non-task chat when culture allows.\n\nSet boundaries on solo AI marathons during shared office hours.\n\nTalk with manager about collaboration expectations if isolation hurts performance or morale.',
    support:
      `${SUPPORT}\n\nSeek support if work isolation fuels depression, burnout, or thoughts of self-harm—and use employee assistance programs if available.`,
    related: [
      'How do I survive a toxic work environment?',
      'How do I recover from burnout?',
      'How do I build workplace friendships?',
      'Is it normal to dread going to work every day?',
      'How do I cope with loneliness at work?',
    ],
    schemaAnswer:
      'AI at work can increase isolation when it replaces colleague collaboration—preserve human touchpoints intentionally while using AI to support rather than replace team connection.',
    themes: ['Workplace isolation', 'AI tools', 'Collaboration', 'Burnout'],
    gaps: ['Emerging topic; verify editorial stance on AI at work framing.'],
    refs: [BURNOUT, NIMH],
  }),
  'my-chest-tightens-whenever-someone-texts-me-unexpectedly': draft({
    question: 'My chest tightens whenever someone texts me unexpectedly',
    slug: 'my-chest-tightens-whenever-someone-texts-me-unexpectedly',
    category: 'Anxiety & Stress',
    title: 'Chest Tightness From Unexpected Texts',
    meta: 'Unexpected texts can trigger fight-or-flight—your body may brace for bad news or social demand before you even read the message.',
    summary:
      'Chest tightness when someone texts unexpectedly is a common anxiety response. Your nervous system may treat unplanned contact as potential threat or obligation before content is known. Past difficult news, people-pleasing, or overwhelm can sensitize this reaction. Understanding the pattern is the first step toward softening it.',
    takeaways: [
      'Physical anxiety symptoms can precede reading the message.',
      'Unexpected contact may signal "demand" to an already overloaded nervous system.',
      'Breathing and delay rituals reduce automatic panic.',
      'Boundaries around responsiveness protect recovery time.',
    ],
    happening:
      'Your body may brace as if the phone buzz equals criticism, crisis, or another task.\n\nHyper-responsiveness and fear of disappointing others amplify the startle.',
    help:
      'Pause before opening—three slow exhales with hand on chest.\n\nRemind yourself: "I do not know the content yet."\n\nTurn off non-essential notifications or use focus modes.\n\nSet expected response windows and communicate them to close contacts.\n\nPractice tolerating unread messages for short intervals to build flexibility.\n\nExplore whether burnout or trauma history lowers your capacity for surprises.',
    support:
      `${SUPPORT}\n\nSeek medical care for new or severe chest pain; seek therapy if text-triggered anxiety is frequent, causes avoidance, or limits daily life.`,
    related: [
      'Why does anxiety make my chest feel tight?',
      'Is it normal to feel nauseous when I am really anxious?',
      'How do I set boundaries with my phone?',
      'How do I calm my nervous system?',
      'How do I manage social anxiety?',
    ],
    schemaAnswer:
      'Chest tightness from unexpected texts is a common anxiety response—use breathing, notification boundaries, and delayed checking while ruling out medical causes for new severe chest pain.',
    themes: ['Anxiety', 'Physical symptoms', 'Digital boundaries', 'Hypervigilance'],
    refs: [ANXIETY, CDC],
  }),
  'my-mind-races-with-worst-case-scenarios-whenever-plans-change-unexpectedly': draft({
    question: 'My mind races with worst-case scenarios whenever plans change unexpectedly',
    slug: 'my-mind-races-with-worst-case-scenarios-whenever-plans-change-unexpectedly',
    category: 'Anxiety & Stress',
    title: 'Worst-Case Thinking When Plans Change',
    meta: 'Unexpected plan changes can trigger catastrophic thinking when predictability feels like safety—practice distinguishing possible from probable outcomes.',
    summary:
      'When plans change unexpectedly and your mind jumps to worst-case scenarios, your brain may be trying to protect you through hyper-preparation. Need for predictability often rises with anxiety, trauma, or past experiences where sudden changes led to harm. Catastrophic thinking rarely improves outcomes—it amplifies distress.',
    takeaways: [
      'Plan changes can feel threatening when structure equals safety.',
      'Catastrophic thoughts are often possible but not probable.',
      'Flexibility builds through small tolerated uncertainties.',
      'Grounding and probability checks interrupt spirals.',
    ],
    happening:
      'A canceled meeting may spiral into job loss; a rain plan may become social ruin.\n\nYour nervous system treats ambiguity as danger until proven otherwise.',
    help:
      'Name the pattern: "My brain is catastrophe-scanning."\n\nAsk: "What is most likely to happen?" versus "What is worst case?"\n\nWrite probable outcome and one adaptive step if the worst occurred.\n\nUse grounding: feet on floor, slow breath, orient to present facts.\n\nPractice minor plan changes intentionally to build tolerance.\n\nReduce overscheduling so changes have buffer room.',
    support:
      `${SUPPORT}\n\nSeek therapy if catastrophic thinking is constant, prevents leaving home, or follows trauma—you may benefit from anxiety or trauma-focused treatment.`,
    related: [
      'How do I stop catastrophizing?',
      'How do I manage anxiety when plans change?',
      'How do I stop worrying about things I cannot control?',
      'How do I build tolerance for uncertainty?',
      'How do I calm my nervous system?',
    ],
    schemaAnswer:
      'Worst-case racing when plans change reflects anxiety and need for predictability—interrupt spirals by checking probable outcomes, grounding, and building flexibility through small exposures to change.',
    themes: ['Catastrophic thinking', 'Flexibility', 'Anxiety', 'Uncertainty'],
    refs: [ANXIETY, NIMH],
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
  'reports/enrichment-corpus/draft-answers/batch-25-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-25-drafts.json`);
