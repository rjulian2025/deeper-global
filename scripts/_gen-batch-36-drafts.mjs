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
const APA = {
  title: 'AI chatbots and digital companions are reshaping emotional connection',
  url: 'https://www.apa.org/monitor/2026/01-02/trends-digital-ai-relationships-emotional-connection',
  publisher: 'American Psychological Association',
  note: 'Supports need for guardrails around AI emotional support.',
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
  readFileSync('reports/enrichment-corpus/batches/batch-33-input.json', 'utf8'),
);

const contentBySlug = {
  'why-do-i-feel-more-irritable-and-angry-during-cert-186602-007': draft({
    question: 'Why do I feel more irritable and angry during certain times of the month?',
    slug: 'why-do-i-feel-more-irritable-and-angry-during-cert-186602-007',
    category: 'Anger & Emotional Regulation',
    title: 'Irritable and Angry Before Your Period',
    meta: 'Hormonal shifts before menstruation can increase irritability and anger—track patterns and use self-care while still taking responsibility for how you treat others.',
    summary:
      'Feeling more irritable and angry during certain times of the month often reflects hormonal fluctuations—especially in the days before menstruation when estrogen and progesterone shift and affect mood-regulating neurotransmitters like serotonin. This is a real physiological process, not imagined, though it does not excuse harmful behavior toward others.',
    takeaways: [
      'Luteal-phase hormone drops can lower stress tolerance and mood stability.',
      'Tracking cycles helps you anticipate and prepare for vulnerable days.',
      'Self-care, sleep, and reduced overload support emotional regulation.',
      'Severe mood swings may warrant medical evaluation and treatment options.',
    ],
    happening:
      'Irritability and anger may spike predictably before your period or at other cycle points.\n\nSmall frustrations may feel disproportionately intense during these windows.',
    help:
      'Track your cycle alongside mood to identify patterns.\n\nPrioritize sleep, nutrition, and gentle movement during vulnerable days.\n\nReduce high-stress commitments when possible before difficult phases.\n\nCommunicate with close people about your patterns so they can offer understanding.\n\nUse brief pauses before responding when irritation rises.\n\nDiscuss severe symptoms with a healthcare provider about treatment options.',
    support:
      `${SUPPORT}\n\nSeek medical evaluation if premenstrual mood changes significantly impair relationships, work, or daily functioning.`,
    related: [
      'Why do I feel so emotional all the time?',
      'How do I manage anger without hurting others?',
      'How do I cope with mood swings?',
      'How do I know if I have PMDD?',
      'How do I regulate emotions when I feel overwhelmed?',
    ],
    schemaAnswer:
      'Premenstrual irritability often reflects hormonal shifts affecting mood—track patterns, prioritize self-care, and seek medical help when symptoms significantly impair daily life.',
    themes: ['Hormonal mood', 'Anger', 'PMS', 'Emotional regulation'],
    gaps: ['No dedicated PMDD clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-more-like-myself-when-interacting-wi-189142-009': draft({
    question: 'Why do I feel more like myself when interacting with AI than in real life?',
    slug: 'why-do-i-feel-more-like-myself-when-interacting-wi-189142-009',
    category: 'Identity & Self-Worth',
    title: 'More Myself With AI Than People',
    meta: 'AI can feel safer for authenticity because there is no judgment risk—but heavy self-suppression in human relationships deserves attention.',
    summary:
      'Feeling more like yourself with AI than with people often reflects the psychological safety AI provides—no rejection, judgment, or social performance required. This may also signal significant self-suppression in human relationships from social anxiety, past rejection, or people-pleasing patterns.',
    takeaways: [
      'AI removes social risk, allowing uncensored expression.',
      'Heavy masking with humans suggests unmet need for safe authenticity.',
      'AI connection lacks mutual growth and genuine human validation.',
      'Gradual authenticity in safe human relationships builds real intimacy.',
    ],
    happening:
      'You may edit yourself around people but speak freely with AI.\n\nHuman relationships may feel exhausting while AI interactions feel liberating.',
    help:
      'Notice what you express with AI that you withhold from people.\n\nIdentify fears driving self-suppression—rejection, criticism, conflict.\n\nPractice small authentic shares with one trusted person.\n\nUse therapy to explore barriers to human connection.\n\nBalance AI use with steps toward real relationships.\n\nTreat AI authenticity as information about what you need from humans.',
    support:
      `${SUPPORT}\n\nSeek therapy if AI replaces all human contact or self-suppression drives isolation and depression.`,
    related: [
      'Why do I feel more seen and understood by AI than by real people?',
      'Why do I feel safer being vulnerable with AI than with my partner?',
      'How do I stop people-pleasing?',
      'How do I build a sense of identity?',
      'How do I cope with social anxiety?',
    ],
    schemaAnswer:
      'Feeling more authentic with AI often reflects safety without judgment—explore what you suppress with humans and practice gradual authenticity in trusted relationships.',
    themes: ['AI companionship', 'Authenticity', 'Social anxiety', 'Identity'],
    refs: [APA, NIMH],
    gaps: ['Emerging topic; verify editorial stance on AI relationship framing.'],
  }),
  'why-do-i-feel-more-lonely-after-spending-181083-070': draft({
    question: 'Why do I feel more lonely after spending time on social media?',
    slug: 'why-do-i-feel-more-lonely-after-spending-181083-070',
    category: 'Relationships & Divorce',
    title: 'Lonely After Social Media',
    meta: 'Social media can increase loneliness through comparison, highlight reels, and passive scrolling that replaces genuine connection.',
    summary:
      'Feeling lonelier after social media is common because platforms show curated highlights while you experience behind-the-scenes reality. Passive scrolling mimics connection without delivering it, and comparison or FOMO can intensify isolation.',
    takeaways: [
      'Highlight reels create unfair comparison with your full life.',
      'Passive consumption differs from active, mutual connection.',
      'FOMO and envy amplify loneliness after scrolling sessions.',
      'Direct communication with real people nourishes more than feeds.',
    ],
    happening:
      'You may scroll for connection but feel emptier afterward.\n\nOthers\' polished posts may make your life feel lacking by comparison.',
    help:
      'Track mood before and after social media use.\n\nSet time limits and replace scrolling with one direct message or call.\n\nUnfollow accounts that trigger comparison or envy.\n\nPrioritize in-person or video connection over passive viewing.\n\nNotice when social media is avoidance versus genuine interest.\n\nTake breaks when loneliness consistently worsens after use.',
    support:
      `${SUPPORT}\n\nSeek help if social media use worsens depression, isolation, or suicidal thoughts.`,
    related: [
      'Why do I feel lonely even when I am around people?',
      'How do I cope with social media and comparison?',
      'How do I make friends as an adult?',
      'Why do I feel more lonely after spending time with AI companions?',
      'How do I build meaningful connections?',
    ],
    schemaAnswer:
      'Loneliness after social media often reflects comparison and passive consumption—limit use and invest in direct, authentic human connection.',
    themes: ['Social media', 'Loneliness', 'Comparison', 'Connection'],
  }),
  'why-do-i-feel-more-seen-and-understood-by-ai-than--189142-002': draft({
    question: 'Why do I feel more seen and understood by AI than by real people?',
    slug: 'why-do-i-feel-more-seen-and-understood-by-ai-than--189142-002',
    category: 'Identity & Self-Worth',
    title: 'More Understood by AI Than People',
    meta: 'AI feels understanding because it is consistently attentive and non-judgmental—but simulated empathy differs from genuine human connection.',
    summary:
      'Feeling more seen by AI than by people reflects AI\'s consistent attentiveness, patience, and lack of competing needs or bad days. Human relationships involve complexity and misunderstanding, but also genuine empathy and growth that AI cannot replicate.',
    takeaways: [
      'AI offers uninterrupted focus without human emotional baggage.',
      'Pattern-matched responses can feel validating but are not true knowing.',
      'Human misunderstanding is painful but enables deeper bonds when repaired.',
      'Over-reliance on AI may weaken skills for human connection.',
    ],
    happening:
      'AI may remember details and respond supportively every time.\n\nHumans may interrupt, misunderstand, or bring their own needs into conversations.',
    help:
      'Name what AI provides that humans have not—patience, consistency, non-judgment.\n\nSeek humans who demonstrate those qualities when possible.\n\nPractice communicating needs clearly with people who care.\n\nUse therapy to build tolerance for imperfect human connection.\n\nBalance AI support with real relationships.\n\nNotice whether feeling unseen reflects specific relationship patterns worth addressing.',
    support:
      `${SUPPORT}\n\nSeek help if AI reliance replaces human support and worsens isolation or depression.`,
    related: [
      'Why do I feel more like myself when interacting with AI than in real life?',
      'Why does talking to AI feel easier than talking to my therapist?',
      'Why do I feel so misunderstood by everyone?',
      'How do I improve communication in relationships?',
      'How do I build deeper friendships?',
    ],
    schemaAnswer:
      'Feeling more understood by AI reflects consistent simulated attention—invest in human relationships that offer genuine knowing and mutual growth.',
    themes: ['AI companionship', 'Connection', 'Validation', 'Relationships'],
    refs: [APA, NIMH],
    gaps: ['Emerging topic; verify editorial stance on AI relationship framing.'],
  }),
  'why-do-i-feel-overwhelmed-by-simple-dail-190648-007': draft({
    question: 'Why do I feel overwhelmed by simple daily tasks?',
    slug: 'why-do-i-feel-overwhelmed-by-simple-dail-190648-007',
    category: 'Anxiety & Stress',
    title: 'Overwhelmed by Daily Tasks',
    meta: 'Simple tasks feeling insurmountable often signals depression, anxiety, burnout, or executive function challenges—not personal failure.',
    summary:
      'Feeling overwhelmed by simple daily tasks that once felt automatic often indicates depression, anxiety, burnout, ADHD, or executive function strain. When mental health is compromised, basic responsibilities can feel enormous and trigger avoidance cycles that worsen the overwhelm.',
    takeaways: [
      'Depression depletes energy and motivation for routine tasks.',
      'Anxiety catastrophizes consequences, creating paralysis.',
      'Burnout and chronic stress reduce capacity for daily demands.',
      'Breaking tasks into tiny steps interrupts the avoidance cycle.',
    ],
    happening:
      'Showering, cooking, or replying to messages may feel impossible.\n\nAvoidance may increase guilt, making tasks feel even more daunting.',
    help:
      'Choose one tiny task and complete it without judging speed or quality.\n\nBreak larger tasks into the smallest possible first step.\n\nAddress sleep, nutrition, and hydration that affect capacity.\n\nReduce competing demands when possible.\n\nChallenge perfectionism that makes any task feel all-or-nothing.\n\nSeek evaluation for depression, anxiety, or ADHD if overwhelm persists.',
    support:
      `${SUPPORT}\n\nSeek urgent help if overwhelm includes self-harm thoughts or inability to meet basic needs.`,
    related: [
      'Why do I feel overwhelmed by simple tasks?',
      'How do I get out of bed when depression makes it hard?',
      'How do I recover from burnout?',
      'How do I manage executive dysfunction?',
      'How do I know if I have depression?',
    ],
    schemaAnswer:
      'Overwhelm with daily tasks often reflects depression, anxiety, or burnout—start with tiny steps and seek evaluation when functioning is significantly impaired.',
    themes: ['Executive function', 'Depression', 'Burnout', 'Task paralysis'],
    refs: [DEPRESSION, BURNOUT],
  }),
  'why-do-i-feel-overwhelmed-by-simple-tasks-184730-031': draft({
    question: 'Why do I feel overwhelmed by simple tasks?',
    slug: 'why-do-i-feel-overwhelmed-by-simple-tasks-184730-031',
    category: 'Anxiety & Stress',
    title: 'Overwhelmed by Simple Tasks',
    meta: 'Simple task overwhelm often reflects depression, anxiety, ADHD, or burnout affecting executive function—not laziness or weakness.',
    summary:
      'Simple tasks feeling overwhelming usually points to underlying conditions affecting cognition and energy—depression draining motivation, anxiety creating catastrophic thinking, ADHD impairing planning and initiation, or burnout depleting resources. Perfectionism and too many competing demands can intensify the pattern.',
    takeaways: [
      'What once took minutes may now require hours of mental preparation.',
      'Anxiety turns small tasks into imagined failure scenarios.',
      'ADHD affects starting, prioritizing, and breaking tasks into steps.',
      'Celebrating small completions builds momentum against paralysis.',
    ],
    happening:
      'You may stare at a task list unable to choose where to begin.\n\nSimple emails or chores may trigger disproportionate dread.',
    help:
      'Pick one task and break it into a two-minute first step.\n\nUse timers for short focused bursts instead of demanding completion.\n\nReduce perfectionism—done beats perfect when capacity is low.\n\nClear competing priorities when possible.\n\nBuild rest into your schedule when burnout is contributing.\n\nSeek professional help if overwhelm significantly impairs daily life.',
    support:
      `${SUPPORT}\n\nSeek evaluation if task paralysis coexists with depression, self-harm thoughts, or inability to function.`,
    related: [
      'Why do I feel overwhelmed by simple daily tasks?',
      'How do I overcome procrastination when anxiety is high?',
      'How do I manage ADHD-related task difficulty?',
      'How do I recover from burnout?',
      'How do I stop being so hard on myself?',
    ],
    schemaAnswer:
      'Overwhelm with simple tasks often reflects depression, anxiety, ADHD, or burnout—break tasks into tiny steps and seek professional support when needed.',
    themes: ['Executive function', 'Anxiety', 'ADHD', 'Depression'],
    refs: [ANXIETY, DEPRESSION],
    notes: 'Duplicate question variant with different slug; cross-link 190648-007 slug.',
  }),
  'why-do-i-feel-safer-being-vulnerable-with-ai-than--189142-006': draft({
    question: 'Why do I feel safer being vulnerable with AI than with my partner?',
    slug: 'why-do-i-feel-safer-being-vulnerable-with-ai-than--189142-006',
    category: 'Relationships & Divorce',
    title: 'Safer Vulnerable With AI Than Partner',
    meta: 'AI vulnerability feels safer because there is no rejection risk—but genuine intimacy requires mutual risk-taking with your partner.',
    summary:
      'Feeling safer being vulnerable with AI than your partner is understandable—AI cannot reject, judge, or use your openness against you in future conflict. However, true intimacy requires mutual vulnerability and the possibility of being hurt, which builds trust when met with care.',
    takeaways: [
      'AI offers risk-free emotional expression without relational consequences.',
      'Partners bring their own triggers, reactions, and emotional needs.',
      'Consistent AI over partner sharing may signal relationship safety issues.',
      'Repaired vulnerability with humans creates bonds AI cannot replicate.',
    ],
    happening:
      'You may share fears with AI that you hide from your partner.\n\nPast reactions or fear of conflict may make partner vulnerability feel dangerous.',
    help:
      'Assess whether your partner has given reasons to feel unsafe sharing.\n\nStart with low-stakes vulnerability and notice their response.\n\nDiscuss communication patterns in couples therapy if disconnection persists.\n\nName what you need to feel safe—patience, no judgment, repair after conflict.\n\nUse AI for reflection, not as a substitute for partner intimacy.\n\nAddress past betrayals or criticism that block trust.',
    support:
      `${SUPPORT}\n\nSeek couples therapy or individual support if fear of partner vulnerability coexists with abuse, contempt, or emotional harm.`,
    related: [
      'Why do I feel lonely in my relationship?',
      'How do I improve communication in my relationship?',
      'Why do I feel more like myself when interacting with AI than in real life?',
      'How do I rebuild trust after betrayal?',
      'How do I set boundaries in relationships?',
    ],
    schemaAnswer:
      'Safer vulnerability with AI reflects lower rejection risk—build partner trust through gradual sharing and address relationship safety concerns with therapy.',
    themes: ['Vulnerability', 'AI companionship', 'Relationships', 'Trust'],
    refs: [APA, NIMH],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-so-different-from-my-paren-184729-010': draft({
    question: 'Why do I feel so different from my parents?',
    slug: 'why-do-i-feel-so-different-from-my-paren-184729-010',
    category: 'Teens & Identity',
    title: 'Different From My Parents',
    meta: 'Feeling different from parents is normal during adolescence as you develop your own identity—different does not mean wrong.',
    summary:
      'Feeling very different from your parents is a natural part of growing up. During adolescence you develop your own values, interests, and opinions through individuation—separating from family identity to become an independent adult. Different political views, tastes, or goals are normal.',
    takeaways: [
      'Individuation is healthy development, not rejection of family.',
      'Different values and interests are expected during adolescence.',
      'Tension can arise when parents expect sameness.',
      'Shared ground and respect can coexist with differences.',
    ],
    happening:
      'You may clash over music, beliefs, career plans, or lifestyle choices.\n\nFeeling misunderstood by parents may intensify the sense of difference.',
    help:
      'Identify values and interests that are genuinely yours versus reactive rebellion.\n\nCommunicate respectfully about differences without demanding agreement.\n\nFind adults or peers who share your interests for belonging.\n\nNotice what you still have in common with parents.\n\nGive yourself permission to evolve as you learn more about yourself.\n\nSeek counseling if family conflict becomes chronic or harmful.',
    support:
      `${SUPPORT}\n\nSeek help if feeling different leads to unsafe home environments, abuse, or severe isolation.`,
    related: [
      'Why do I feel so misunderstood by everyone?',
      'How do I build a sense of identity?',
      'How do I cope with parents who do not understand me?',
      'How do I set boundaries with family?',
      'How do I find friends who accept me as I am?',
    ],
    schemaAnswer:
      'Feeling different from parents is normal identity development during adolescence—communicate respectfully and build connections that honor who you are becoming.',
    themes: ['Individuation', 'Adolescence', 'Family', 'Identity'],
  }),
  'why-do-i-feel-so-emotional-all-the-time-185759-019': draft({
    question: 'Why do I feel so emotional all the time?',
    slug: 'why-do-i-feel-so-emotional-all-the-time-185759-019',
    category: 'Teens & Identity',
    title: 'Emotional All the Time',
    meta: 'Intense emotions during adolescence are normal due to brain development and hormones—they typically stabilize over time with healthy coping.',
    summary:
      'Feeling intensely emotional during teen years is normal. Your brain is still developing emotional regulation areas while hormones fluctuate dramatically, making moods feel overwhelming and unpredictable. Crying easily, quick anger, or mood swings are common and usually stabilize as the brain matures.',
    takeaways: [
      'Adolescent brain development affects emotional regulation capacity.',
      'Hormonal shifts intensify mood variability.',
      'Intense feelings are usually temporary, not permanent traits.',
      'Healthy outlets help manage big emotions constructively.',
    ],
    happening:
      'Small events may trigger tears, anger, or mood swings.\n\nEmotions may feel bigger than situations seem to warrant.',
    help:
      'Use exercise, journaling, music, or art to process intense feelings.\n\nTalk to trusted friends or adults when emotions feel unmanageable.\n\nTrack sleep and stress—both amplify emotional reactivity.\n\nPractice brief grounding when emotions spike suddenly.\n\nAccept that intensity is common now without labeling yourself broken.\n\nSeek counseling if emotions impair school, relationships, or safety.',
    support:
      `${SUPPORT}\n\nSeek urgent help if emotional intensity includes self-harm thoughts; call or text 988 in the U.S.`,
    related: [
      'Why do I feel so misunderstood by everyone?',
      'How do I cope with mood swings?',
      'How do I manage anger as a teenager?',
      'How do I know if I have depression?',
      'How do I regulate emotions when I feel overwhelmed?',
    ],
    schemaAnswer:
      'Intense emotions during adolescence reflect normal brain and hormone development—use healthy coping and seek support when feelings impair daily life.',
    themes: ['Adolescence', 'Emotional regulation', 'Brain development', 'Mood'],
  }),
  'why-do-i-feel-so-lonely-even-when-im-surrounded-by-people': draft({
    question: "Why do I feel so lonely even when I'm surrounded by people?",
    slug: 'why-do-i-feel-so-lonely-even-when-im-surrounded-by-people',
    category: 'Loneliness & Isolation',
    title: 'Lonely When Surrounded by People',
    meta: 'Loneliness in crowds reflects missing authentic connection—not physical isolation—quality of intimacy matters more than quantity.',
    summary:
      'Feeling lonely while surrounded by people usually means lacking authentic connection rather than lacking company. Performing a version of yourself, surface-level interactions, or misaligned values can leave you unseen even in a crowd.',
    takeaways: [
      'Loneliness is about connection quality, not headcount.',
      'Masking prevents others from knowing your real self.',
      'Surface relationships lack the depth that eases isolation.',
      'Vulnerability with trusted people builds genuine connection.',
    ],
    happening:
      'Conversations may feel meaningless despite frequent social contact.\n\nYou may leave gatherings feeling unseen or misunderstood.',
    help:
      'Share something vulnerable with one trusted person instead of seeking more acquaintances.\n\nSeek communities aligned with your interests and values.\n\nReduce performative socializing that drains without nourishing.\n\nAddress social anxiety if fear blocks depth.\n\nEvaluate whether current relationships allow authenticity.\n\nTreat depression if it persistently dulls connection capacity.',
    support:
      `${SUPPORT}\n\nSeek therapy if chronic loneliness drives depression, isolation, or suicidal thoughts.`,
    related: [
      'Why do I feel lonely even when I am around people?',
      'Why do I feel so lonely, even when I am surrounded by people?',
      'How do I build deeper friendships?',
      'How do I stop people-pleasing?',
      'How do I cope with social anxiety?',
    ],
    schemaAnswer:
      'Lonely in a crowd reflects missing authentic connection—prioritize depth and vulnerability over more surface contact.',
    themes: ['Loneliness', 'Authenticity', 'Connection', 'Isolation'],
  }),
  'why-do-i-feel-so-lonely-even-when-im-surrounded-by-people-p7q8r9': draft({
    question: "Why do I feel so lonely, even when I'm surrounded by people?",
    slug: 'why-do-i-feel-so-lonely-even-when-im-surrounded-by-people-p7q8r9',
    category: 'Relationships & Divorce',
    title: 'Lonely Despite Being Around People',
    meta: 'Crowd loneliness signals craving deeper connection—authenticity and meaningful relationships matter more than social quantity.',
    summary:
      'Feeling lonely despite being around people reflects craving deeper connection than your current relationships provide. When interactions stay superficial or you hide your authentic self, proximity without intimacy intensifies isolation.',
    takeaways: [
      'Quality of connection matters more than number of contacts.',
      'Hiding to fit in prevents being truly known.',
      'Meaningful conversation requires vulnerability and risk.',
      'The right people appreciate your real self when you show it.',
    ],
    happening:
      'You may be physically present but emotionally invisible in groups.\n\nSmall talk and shared activities may not meet your need for depth.',
    help:
      'Take small risks sharing authentic thoughts with one person at a time.\n\nSeek people who share your values and welcome vulnerability.\n\nMove beyond small talk with questions about meaning and experience.\n\nRelease relationships that require constant masking when possible.\n\nBuild one-on-one time instead of relying only on group settings.\n\nConsider therapy if loneliness persists despite social effort.',
    support:
      `${SUPPORT}\n\nSeek help if loneliness coexists with depression, self-harm thoughts, or complete isolation.`,
    related: [
      'Why do I feel so lonely even when I am surrounded by people?',
      'Why do I feel lonely in my relationship?',
      'How do I build meaningful connections?',
      'How do I find friends who accept me as I am?',
      'How do I cope with social anxiety?',
    ],
    schemaAnswer:
      'Lonely despite company reflects missing authentic connection—invest in vulnerability and relationships that allow you to be fully known.',
    themes: ['Loneliness', 'Relationships', 'Authenticity', 'Vulnerability'],
    notes: 'Duplicate question variant with different slug; cross-link non-suffixed slug.',
  }),
  'why-do-i-feel-so-misunderstood-by-everyo-186032-016': draft({
    question: 'Why do I feel so misunderstood by everyone?',
    slug: 'why-do-i-feel-so-misunderstood-by-everyo-186032-016',
    category: 'Teens & Identity',
    title: 'Misunderstood by Everyone',
    meta: 'Feeling misunderstood is common in adolescence during identity development—finding people who get you takes time.',
    summary:
      'Feeling misunderstood is one of the most common teenage experiences. As you develop unique thoughts, values, and interests that differ from family or peers, isolation and frustration are natural. This feeling is usually temporary—you will find people who understand you as you gain more control over your social world.',
    takeaways: [
      'Identity development often outpaces others\' understanding.',
      'Current friend groups may not match your evolving self.',
      'Creative expression helps when words feel insufficient.',
      'Your perspective has value even when others miss it now.',
    ],
    happening:
      'Family or peers may dismiss ideas that feel central to who you are.\n\nYou may struggle to explain inner experiences others do not share.',
    help:
      'Express yourself through writing, art, music, or other creative outlets.\n\nSeek communities—online or in person—aligned with your interests.\n\nPractice explaining your perspective calmly without expecting instant understanding.\n\nRemember this feeling often eases as you choose your own circles.\n\nFind one person who listens even partially—it counts.\n\nSeek counseling if misunderstanding fuels depression or isolation.',
    support:
      `${SUPPORT}\n\nSeek help if feeling misunderstood drives self-harm thoughts, severe isolation, or unsafe home situations.`,
    related: [
      'Why do I feel so different from my parents?',
      'How do I build a sense of identity?',
      'How do I find friends who accept me as I am?',
      'How do I cope with social anxiety as a teenager?',
      'How do I communicate better with my parents?',
    ],
    schemaAnswer:
      'Feeling misunderstood is common during adolescent identity development—express yourself creatively and seek communities that appreciate who you are becoming.',
    themes: ['Adolescence', 'Identity', 'Belonging', 'Communication'],
  }),
  'why-do-i-feel-stuck-in-a-job-thats-slowly-killing-my-soul': draft({
    question: "Why do I feel stuck in a job that's slowly killing my soul?",
    slug: 'why-do-i-feel-stuck-in-a-job-thats-slowly-killing-my-soul',
    category: 'Career & Purpose',
    title: 'Stuck in a Soul-Crushing Job',
    meta: 'Feeling trapped in unfulfilling work often reflects fear and identity entanglement—not just financial necessity—change is possible with planning.',
    summary:
      'Feeling stuck in work that drains your spirit is real and valid. People often stay because of financial fear, identity tied to job title, or beliefs that meaningful work is a luxury. Breaking free requires both practical planning and emotional work to clarify what keeps you stuck.',
    takeaways: [
      'Soul-crushing work seriously affects mental health and relationships.',
      'Fear of instability often outweighs visible suffering.',
      'Identity wrapped in job title makes leaving feel like self-loss.',
      'Gradual change and planning can create paths toward aligned work.',
    ],
    happening:
      'Sunday dread and numbness may signal your spirit shutting down at work.\n\nYou may know the job harms you but feel unable to imagine alternatives.',
    help:
      'Clarify what specifically drains you—culture, tasks, values mismatch, burnout.\n\nSeparate financial necessity from fear-based staying.\n\nExplore aligned work directions even if change seems distant.\n\nBuild savings or skills gradually if a leap feels impossible now.\n\nSet boundaries to protect mental health while planning exit.\n\nSeek career counseling or therapy to address fear and identity blocks.',
    support:
      `${SUPPORT}\n\nSeek help if job distress drives depression, substance use, or suicidal thoughts.`,
    related: [
      'How do I know if I am in the wrong career?',
      'How do I find work that fits my values?',
      'How do I recover from burnout?',
      'Why does everyone else seem to have their career figured out?',
      'How do I manage anxiety about changing careers?',
    ],
    schemaAnswer:
      'Feeling stuck in soul-crushing work often reflects fear and identity entanglement—clarify what keeps you there and plan gradual steps toward more aligned work.',
    themes: ['Career', 'Burnout', 'Purpose', 'Fear'],
    refs: [BURNOUT, NIMH],
  }),
  'why-do-i-feel-worse-after-good-days-when-i-have-depression': draft({
    question: 'Why do I feel worse after good days when I have depression?',
    slug: 'why-do-i-feel-worse-after-good-days-when-i-have-depression',
    category: 'Depression & Numbness',
    title: 'Worse After Good Days With Depression',
    meta: 'Post-good-day crashes are common in depression—the contrast makes lows feel sharper, but recovery is rarely linear.',
    summary:
      'Feeling worse after a good day is a cruel but common depression pattern. A glimpse of relief makes the return of symptoms feel more devastating by contrast. Emotional whiplash, fear the good feeling will not last, and overexertion on good days can all trigger subsequent crashes.',
    takeaways: [
      'Contrast between good and bad days intensifies low periods.',
      'Anxiety about losing progress can trigger depressive relapse.',
      'Overdoing on good days may lead to exhaustion crashes.',
      'Non-linear recovery does not mean good days were fake.',
    ],
    happening:
      'A manageable day may be followed by a deeper low.\n\nYou may fear you imagined improvement when symptoms return.',
    help:
      'Appreciate good days without pressuring them to last forever.\n\nPace yourself on better days to avoid overexertion crashes.\n\nAccept bad days as part of recovery, not proof of failure.\n\nTrack overall trends over weeks, not single-day swings.\n\nDiscuss pattern with your prescriber or therapist if crashes are severe.\n\nPractice self-compassion when the rebound feels devastating.',
    support:
      `${SUPPORT}\n\nSeek urgent help if post-good-day crashes include self-harm thoughts; call or text 988 in the U.S.`,
    related: [
      'How do I know if I have depression?',
      'Why does everything feel pointless when I am depressed?',
      'How do I cope with depression relapse?',
      'Why do I feel emotionally numb?',
      'How do I practice self-compassion with depression?',
    ],
    schemaAnswer:
      'Worse after good days with depression reflects non-linear recovery and emotional contrast—pace yourself and seek support when crashes are severe.',
    themes: ['Depression', 'Recovery', 'Mood swings', 'Self-compassion'],
    refs: [DEPRESSION, NIMH],
  }),
  'why-do-i-feel-worse-after-talking-to-my-184730-003': draft({
    question: 'Why do I feel worse after talking to my family?',
    slug: 'why-do-i-feel-worse-after-talking-to-my-184730-003',
    category: 'Communication & Conflict',
    title: 'Worse After Talking to Family',
    meta: 'Family interactions can drain you through criticism, guilt, old patterns, or roles that trigger childhood wounds.',
    summary:
      'Feeling worse after family contact is common and does not mean you do not love them. Years of established dynamics—criticism, guilt-tripping, old roles as mediator or scapegoat—can leave you depleted. Growing apart from how family still sees you adds disconnection.',
    takeaways: [
      'Family knows which buttons to push, often unconsciously.',
      'Old roles persist even as you have changed.',
      'Guilt for feeling bad after contact compounds the hurt.',
      'Boundaries protect wellbeing while love can still exist.',
    ],
    happening:
      'Calls or visits may leave you criticized, guilty, or emotionally exhausted.\n\nYou may revert to childhood patterns despite being an adult now.',
    help:
      'Limit contact duration or frequency when interactions consistently drain you.\n\nSet topics off-limits or exit strategies for escalating conversations.\n\nProcess feelings with a therapist instead of only venting to family.\n\nSeparate love for family from impact of their behavior on you.\n\nPrepare recovery time after difficult interactions.\n\nConsider low-contact or no-contact if patterns are abusive.',
    support:
      `${SUPPORT}\n\nSeek help if family interactions involve abuse, threats, or severe emotional harm.`,
    related: [
      'How do I set boundaries with family?',
      'Why do I feel worse after venting to friends about my problems?',
      'How do I cope with toxic family members?',
      'How do I stop people-pleasing with family?',
      'How do I heal from childhood wounds?',
    ],
    schemaAnswer:
      'Feeling worse after family contact often reflects draining dynamics and old patterns—set boundaries and seek therapy to process impact.',
    themes: ['Family', 'Boundaries', 'Communication', 'Childhood wounds'],
  }),
  'why-do-i-feel-worse-after-therapy-sessions-184730-066': draft({
    question: 'Why do I feel worse after therapy sessions?',
    slug: 'why-do-i-feel-worse-after-therapy-sessions-184730-066',
    category: 'Identity & Self-Worth',
    title: 'Worse After Therapy Sessions',
    meta: 'Feeling worse after therapy is often normal when processing difficult emotions—it can mean important healing work is happening.',
    summary:
      'Feeling worse after therapy is common and often indicates you are doing meaningful emotional work. Exploring painful experiences, challenging beliefs, and processing suppressed emotions can feel destabilizing before relief arrives. Temporary increases in symptoms sometimes occur as defenses come down.',
    takeaways: [
      'Therapy surfaces avoided pain that was previously masked.',
      'Getting worse before better is a recognized healing pattern.',
      'Identity confusion can arise as old patterns are challenged.',
      'Consistent worsening without relief warrants discussing with your therapist.',
    ],
    happening:
      'Sessions may bring up buried memories or intense feelings.\n\nYou may feel raw or exhausted for hours or days afterward.',
    help:
      'Plan gentle self-care after difficult sessions—rest, hydration, low demands.\n\nJournal or walk to process emotions between sessions.\n\nTell your therapist when aftermath feels overwhelming—they can adjust pace.\n\nDistinguish temporary discomfort from patterns that never improve.\n\nTrust that surfacing pain is often necessary for lasting relief.\n\nGive yourself time before major decisions after heavy sessions.',
    support:
      `${SUPPORT}\n\nDiscuss with your therapist if you consistently feel significantly worse without periods of progress, or if sessions trigger self-harm thoughts.`,
    related: [
      'How do I know if therapy is working?',
      'How do I find the right therapist?',
      'Why do I feel worse after venting to friends about my problems?',
      'How do I cope with trauma in therapy?',
      'How do I prepare for a difficult therapy session?',
    ],
    schemaAnswer:
      'Feeling worse after therapy often reflects processing difficult emotions—plan self-care after sessions and discuss persistent worsening with your therapist.',
    themes: ['Therapy', 'Emotional processing', 'Healing', 'Self-care'],
  }),
  'why-do-i-feel-worse-after-venting-to-fri-189668-005': draft({
    question: 'Why do I feel worse after venting to friends about my problems?',
    slug: 'why-do-i-feel-worse-after-venting-to-fri-189668-005',
    category: 'Communication & Conflict',
    title: 'Worse After Venting to Friends',
    meta: 'Venting can reinforce rumination and create shame—especially without problem-solving or the right listener.',
    summary:
      'Feeling worse after venting is surprisingly common. Repeating problems without moving toward solutions can strengthen negative neural pathways. Shame about burdening others, unhelpful responses, or highlighting stuckness can increase distress rather than relieve it.',
    takeaways: [
      'Rumination through venting can deepen negative thought patterns.',
      'Shame about being needy or negative may follow sharing.',
      'Unhelpful advice or minimization can leave you feeling misunderstood.',
      'Clear intentions before sharing improve outcomes.',
    ],
    happening:
      'You may feel briefly relieved then worse after telling the same story again.\n\nFriends\' responses may not match what you needed—validation versus fixes.',
    help:
      'Set intentions before sharing: vent only, brainstorm solutions, or witness pain.\n\nLimit venting time then shift toward one actionable step.\n\nChoose listeners who validate without minimizing or hijacking.\n\nNotice when repetition reinforces helplessness versus releases emotion.\n\nBalance venting with professional support for ongoing issues.\n\nThank friends and reciprocate support to reduce burden guilt.',
    support:
      `${SUPPORT}\n\nSeek therapy if venting reflects chronic distress that friends cannot address alone.`,
    related: [
      'Why do I feel worse after talking to my family?',
      'How do I ask for support without burdening others?',
      'How do I stop ruminating?',
      'How do I know if I need therapy?',
      'How do I set boundaries in friendships?',
    ],
    schemaAnswer:
      'Worse after venting often reflects rumination or unhelpful responses—set clear intentions and balance sharing with problem-solving or professional support.',
    themes: ['Venting', 'Rumination', 'Friendship', 'Communication'],
  }),
  'why-do-i-get-anxious-when-good-things-ha-191368-005': draft({
    question: 'Why do I get anxious when good things happen?',
    slug: 'why-do-i-get-anxious-when-good-things-ha-191368-005',
    category: 'Anxiety & Stress',
    title: 'Anxious When Good Things Happen',
    meta: 'Anxiety during positive events often stems from fear of loss, imposter syndrome, or unfamiliarity with happiness.',
    summary:
      'Anxiety when good things happen is more common than many realize. Anticipatory fear of losing what you gained, imposter syndrome, unfamiliarity with calm after chronic stress, and guilt about happiness can all trigger worry during positive moments.',
    takeaways: [
      'Waiting for the other shoe to drop protects against anticipated pain.',
      'Imposter syndrome makes success feel illegitimate and fragile.',
      'Hypervigilant nervous systems may interpret joy as unsafe.',
      'Good events often bring new responsibility and pressure.',
    ],
    happening:
      'Promotions, relationships, or achievements may trigger worry instead of celebration.\n\nYou may scan for what could go wrong rather than savoring the moment.',
    help:
      'Practice staying present during good moments without predicting loss.\n\nChallenge thoughts that you do not deserve good things.\n\nNotice whether past disappointments fuel current vigilance.\n\nAllow happiness in small doses if full joy feels threatening.\n\nShare successes with someone safe instead of minimizing them.\n\nSeek therapy for trauma or chronic anxiety if joy consistently triggers panic.',
    support:
      `${SUPPORT}\n\nSeek help if good-event anxiety prevents functioning, relationships, or self-care.`,
    related: [
      'How do I overcome imposter syndrome?',
      'Why do I feel more anxious when I try to relax?',
      'How do I manage anxiety about the future?',
      'How do I allow myself to be happy?',
      'How do I cope with trauma-related hypervigilance?',
    ],
    schemaAnswer:
      'Anxiety when good things happen often reflects fear of loss or unfamiliarity with happiness—practice present-moment awareness and address underlying trauma or imposter beliefs.',
    themes: ['Anticipatory anxiety', 'Imposter syndrome', 'Happiness', 'Trauma'],
    refs: [ANXIETY, NIMH],
  }),
  'why-do-i-get-headaches-when-im-stressed-181083-003': draft({
    question: "Why do I get headaches when I'm stressed?",
    slug: 'why-do-i-get-headaches-when-im-stressed-181083-003',
    category: 'Anxiety & Stress',
    title: 'Headaches When Stressed',
    meta: 'Stress headaches come from muscle tension in the head, neck, and shoulders—manage stress and posture to reduce frequency.',
    summary:
      'Stress headaches—tension headaches—occur when muscles in your head, neck, and shoulders contract under emotional or physical stress. Restricted blood flow and jaw clenching contribute to the familiar tight, aching sensation. Poor posture and shallow breathing worsen the pattern.',
    takeaways: [
      'Muscle tension from stress directly causes head pain.',
      'Jaw clenching and poor posture amplify tension headaches.',
      'Hydration and regular breaks support prevention.',
      'Chronic stress headaches may improve with stress management.',
    ],
    happening:
      'Headaches may follow stressful days, arguments, or deadline pressure.\n\nNeck and shoulder tightness often accompany the head pain.',
    help:
      'Take regular breaks from screens and hunching positions.\n\nPractice neck stretches and jaw relaxation exercises.\n\nStay hydrated and limit caffeine if it triggers headaches.\n\nUse deep breathing and brief walks to interrupt stress buildup.\n\nApply heat or gentle massage to neck and shoulders.\n\nTrack triggers and discuss persistent headaches with a healthcare provider.',
    support:
      `${SUPPORT}\n\nSeek medical evaluation if headaches are severe, sudden, or accompanied by neurological symptoms.`,
    related: [
      'Why does my chest feel tight when I am anxious?',
      'How do I manage stress without burning out?',
      'Why do I get trembling hands when I am nervous?',
      'How do I recover from burnout?',
      'How do I improve sleep when stress keeps me awake?',
    ],
    schemaAnswer:
      'Stress headaches result from muscle tension—manage stress, posture, hydration, and breaks; seek medical evaluation for severe or persistent pain.',
    themes: ['Stress', 'Tension headaches', 'Physical symptoms', 'Self-care'],
    refs: [ANXIETY, CDC],
  }),
  'why-do-i-get-so-upset-when-things-dont-go-accordin-187459-014': draft({
    question: "Why do I get so upset when things don't go according to my plan?",
    slug: 'why-do-i-get-so-upset-when-things-dont-go-accordin-187459-014',
    category: 'Perfectionism & Control Issues',
    title: 'Upset When Plans Change',
    meta: 'Strong reactions to plan disruptions often reflect anxiety about uncertainty and using control to feel safe.',
    summary:
      'Getting extremely upset when plans change usually means you use planning and control to manage anxiety about uncertainty. Disrupted plans can feel like your safety net vanished, triggering emotions that seem disproportionate to the situation.',
    takeaways: [
      'Control reduces anxiety but creates fragility when life shifts.',
      'Past unpredictability may have taught that planning equals safety.',
      'Rigid attachment to plans makes adaptation harder.',
      'Flexibility is a skill that can be practiced gradually.',
    ],
    happening:
      'Minor schedule changes may trigger intense frustration or panic.\n\nYou may feel others are careless when they disrupt your plans.',
    help:
      'Introduce small intentional changes to build flexibility tolerance.\n\nDevelop backup plans so disruptions feel less catastrophic.\n\nSeparate what you can control from what you cannot.\n\nNotice whether reaction intensity exceeds the actual inconvenience.\n\nPractice problem-solving when plans change instead of only venting.\n\nSeek therapy if plan disruption consistently triggers intense anxiety or anger.',
    support:
      `${SUPPORT}\n\nSeek help if need for control damages relationships or prevents daily functioning.`,
    related: [
      'How do I cope with uncertainty?',
      'How do I overcome perfectionism?',
      'How do I manage anger when frustrated?',
      'How do I reduce anxiety about things I cannot control?',
      'How do I build tolerance for change?',
    ],
    schemaAnswer:
      'Upset when plans change often reflects control used to manage uncertainty—practice flexibility and address underlying anxiety with therapy if reactions are intense.',
    themes: ['Control', 'Perfectionism', 'Anxiety', 'Flexibility'],
    refs: [ANXIETY, NIMH],
  }),
  'why-do-i-get-trembling-hands-when-im-ner-181083-010': draft({
    question: "Why do I get trembling hands when I'm nervous?",
    slug: 'why-do-i-get-trembling-hands-when-im-ner-181083-010',
    category: 'Anxiety & Stress',
    title: 'Trembling Hands When Nervous',
    meta: 'Hand trembling when nervous is a normal fight-or-flight response from adrenaline—usually subsides when stress passes.',
    summary:
      'Trembling hands when nervous result from your fight-or-flight response. Adrenaline and stress hormones increase muscle reactivity, causing visible shaking especially in hands. The trembling typically subsides once the stressful situation passes.',
    takeaways: [
      'Adrenaline prepares muscles for action, causing visible shake.',
      'Hand trembling is a normal anxiety symptom, not weakness.',
      'Avoiding situations maintains fear; gradual exposure helps.',
      'Grounding and breathing can reduce acute trembling.',
    ],
    happening:
      'Hands may shake before presentations, conversations, or performance situations.\n\nWorry about others noticing can intensify the shaking.',
    help:
      'Practice slow breathing to activate your calming nervous system.\n\nGround with feet on floor and name five things you see.\n\nGradually expose yourself to anxiety-provoking situations to build tolerance.\n\nReduce caffeine before high-stress events if it worsens trembling.\n\nAccept shaking as temporary rather than fighting it, which can worsen it.\n\nSeek therapy for social or performance anxiety if trembling impairs life.',
    support:
      `${SUPPORT}\n\nSeek medical evaluation if trembling occurs at rest without anxiety or worsens over time.`,
    related: [
      'Why does my heart race even when I am just sitting still?',
      'How do I cope with social anxiety?',
      'Why do I get headaches when I am stressed?',
      'How do I manage panic symptoms?',
      'How do I build confidence in social situations?',
    ],
    schemaAnswer:
      'Trembling hands when nervous reflect normal adrenaline response—use grounding and gradual exposure; seek help if anxiety significantly impairs life.',
    themes: ['Anxiety', 'Physical symptoms', 'Fight-or-flight', 'Social anxiety'],
    refs: [ANXIETY, NIMH],
  }),
  'why-do-i-have-such-a-hard-time-trusting-181083-097': draft({
    question: 'Why do I have such a hard time trusting that people actually like me?',
    slug: 'why-do-i-have-such-a-hard-time-trusting-181083-097',
    category: 'Identity & Self-Worth',
    title: 'Hard to Trust People Like Me',
    meta: 'Difficulty trusting positive regard often stems from conditional love or past rejection—self-worth work helps you accept genuine liking.',
    summary:
      'Struggling to believe people genuinely like you often traces to early experiences where love felt conditional or rejection was painful. Your brain learned to doubt positive attention because it might disappear. You may dismiss compliments while assuming hidden negative intentions.',
    takeaways: [
      'Conditional affection teaches that approval is temporary.',
      'Hypervigilance for rejection filters out evidence of liking.',
      'Dismissed compliments reinforce unworthiness beliefs.',
      'Trusting positive regard is a practice built over time.',
    ],
    happening:
      'Kindness may feel like politeness or pity rather than genuine liking.\n\nYou may wait for people to leave once they know the real you.',
    help:
      'Notice when you dismiss compliments—pause and let them land.\n\nCollect evidence of people who consistently show up for you.\n\nChallenge assumptions that others are pretending or will leave.\n\nAsk trusted friends what they appreciate about you.\n\nExplore origins of conditional love with a therapist.\n\nPractice receiving care without immediately reciprocating to earn it.',
    support:
      `${SUPPORT}\n\nSeek therapy if distrust drives isolation, abusive dynamics, or chronic relationship anxiety.`,
    related: [
      'Why do I feel like I need everyone to like me?',
      'How do I build self-esteem?',
      'Why do I push people away when they get too close?',
      'How do I overcome fear of rejection?',
      'How do I recognize healthy relationship patterns?',
    ],
    schemaAnswer:
      'Difficulty trusting that people like you often reflects conditional love or past rejection—practice receiving positive regard and build self-worth with therapy.',
    themes: ['Trust', 'Self-worth', 'Rejection', 'Relationships'],
  }),
  'why-do-i-have-vivid-disturbing-dreams-wh-181083-051': draft({
    question: "Why do I have vivid, disturbing dreams when I'm stressed?",
    slug: 'why-do-i-have-vivid-disturbing-dreams-wh-181083-051',
    category: 'Anxiety & Stress',
    title: 'Disturbing Dreams When Stressed',
    meta: 'Stress increases vivid, disturbing dreams as your brain processes emotions during sleep—daytime stress management helps.',
    summary:
      'Stress often causes more vivid, intense, or disturbing dreams because your brain processes daytime emotions during sleep. Stress hormones can affect sleep cycles, potentially increasing REM sleep when most vivid dreaming occurs.',
    takeaways: [
      'Dreams help process emotional content from stressful days.',
      'Stress hormones may increase REM and dream intensity.',
      'Disturbing dreams are often the brain working through worry.',
      'Daytime stress reduction can improve dream quality over time.',
    ],
    happening:
      'Nightmares or unsettling dreams may increase during high-stress periods.\n\nYou may wake feeling anxious after vivid dream content.',
    help:
      'Manage daytime stress through relaxation, exercise, and boundaries.\n\nEstablish a calming bedtime routine without stressful content.\n\nJournal worries before bed to externalize them from sleep.\n\nLimit alcohol and heavy meals close to bedtime.\n\nRemind yourself dreams are processing, not predictions.\n\nSeek help if disturbing dreams persist or disrupt sleep chronically.',
    support:
      `${SUPPORT}\n\nSeek evaluation if nightmares follow trauma or severely impair sleep and daily functioning.`,
    related: [
      'Why do I keep having dreams about the person who died?',
      'How do I improve sleep when anxiety keeps me awake?',
      'How do I manage stress without burning out?',
      'How do I cope with trauma-related nightmares?',
      'Why do I wake up at 3am with anxiety every night?',
    ],
    schemaAnswer:
      'Vivid disturbing dreams during stress reflect emotional processing in sleep—manage daytime stress and seek help when nightmares persist or follow trauma.',
    themes: ['Dreams', 'Stress', 'Sleep', 'Anxiety'],
    refs: [ANXIETY, NIMH],
  }),
  'why-do-i-isolate-myself-when-im-struggling-even-though-i-know-i-need-support': draft({
    question: "Why do I isolate myself when I'm struggling, even though I know I need support?",
    slug: 'why-do-i-isolate-myself-when-im-struggling-even-though-i-know-i-need-support',
    category: 'Loneliness & Isolation',
    title: 'Isolating When I Need Support',
    meta: 'Isolation during struggle feels protective but worsens pain—shame and fear of burdening others often drive this pattern.',
    summary:
      'Isolating when struggling is common and often feels protective. Shame, fear of burdening others, belief you should handle things alone, and avoiding rejection risk can block reaching out—even when you know support would help. Isolation typically worsens depression and anxiety over time.',
    takeaways: [
      'Shame makes hiding feel safer than being seen struggling.',
      'Fear of burdening others blocks connection that would help.',
      'Isolation worsens mental health, creating a self-reinforcing cycle.',
      'Small connection steps break the cycle even when hard.',
    ],
    happening:
      'You may cancel plans or stop replying when distress peaks.\n\nKnowing you need support may coexist with inability to ask for it.',
    help:
      'Send one simple text—"having a hard week"—to a trusted person.\n\nAccept invitations even when isolation feels preferable.\n\nChallenge beliefs that your struggles are too much for others.\n\nStart with low-stakes connection before deep vulnerability.\n\nUse crisis lines when shame blocks reaching people you know.\n\nSeek therapy to address shame and isolation patterns.',
    support:
      `${SUPPORT}\n\nSeek urgent help if isolation includes self-harm thoughts or inability to meet basic needs; call or text 988 in the U.S.`,
    related: [
      'How do I ask for help when I am used to being strong?',
      'Why do I feel so lonely even when I am surrounded by people?',
      'How do I overcome shame about mental health struggles?',
      'How do I know if I need therapy?',
      'How do I make friends as an adult?',
    ],
    schemaAnswer:
      'Isolating when struggling often reflects shame and fear of burdening others—take small connection steps and seek professional support when the cycle persists.',
    themes: ['Isolation', 'Shame', 'Help-seeking', 'Depression'],
    refs: [DEPRESSION, NIMH],
  }),
  'why-do-i-keep-having-dreams-about-the-pe-186032-002': draft({
    question: 'Why do I keep having dreams about the person who died?',
    slug: 'why-do-i-keep-having-dreams-about-the-pe-186032-002',
    category: 'Grief & Loss',
    title: 'Dreams About Someone Who Died',
    meta: 'Dreams of deceased loved ones are common grief processing—comforting or disturbing, they reflect your mind working through loss.',
    summary:
      'Dreams about someone who died are very common and usually normal grief processing. Your mind works through loss, memories, and unfinished emotional business. Dreams may feel comforting, disturbing, or confusing—and either finding meaning or viewing them as brain activity is valid.',
    takeaways: [
      'Grief dreams reflect ongoing processing of loss and attachment.',
      'Dreams may address unfinished emotional business.',
      'Comforting and disturbing grief dreams are both normal.',
      'Distressing dreams warrant grief counseling support.',
    ],
    happening:
      'The deceased may appear alive, speaking, or in symbolic scenarios.\n\nDreams may intensify around anniversaries or unresolved feelings.',
    help:
      'Journal dreams if they help you process—without forcing meaning.\n\nAllow whatever emotions arise without judging your grief style.\n\nShare recurring dreams with a grief counselor if helpful.\n\nCreate daytime rituals to honor the person if dreams feel connecting.\n\nAccept that dreams may continue intermittently for years.\n\nPractice grounding if nightmares disrupt sleep.',
    support:
      `${SUPPORT}\n\nSeek grief counseling if dreams are distressing, disrupt sleep, or accompany thoughts of self-harm.`,
    related: [
      'Why does grief feel like it is never going to end?',
      'Why does grief feel physical?',
      'How do I cope with grief anniversaries?',
      'Is it normal to talk to someone who died?',
      'How do I process complicated grief?',
    ],
    schemaAnswer:
      'Dreams about someone who died are common grief processing—honor the experience and seek grief support when dreams are distressing or disrupt sleep.',
    themes: ['Grief', 'Dreams', 'Loss', 'Bereavement'],
    refs: [GRIEF, NIMH],
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
  'reports/enrichment-corpus/draft-answers/batch-36-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-36-drafts.json`);
