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
  readFileSync('reports/enrichment-corpus/batches/batch-34-input.json', 'utf8'),
);

const contentBySlug = {
  'why-do-i-keep-thinking-about-my-ex-even-181083-080': draft({
    question: 'Why do I keep thinking about my ex even though I know they were wrong for me?',
    slug: 'why-do-i-keep-thinking-about-my-ex-even-181083-080',
    category: 'Relationships & Divorce',
    title: 'Thinking About My Ex',
    meta: 'Your brain processes breakup loss regardless of whether the relationship was healthy—thoughts fade with time and healing.',
    summary:
      'Thinking about an ex despite knowing they were wrong for you is normal. Your brain processes attachment loss, shared habits, and imagined futures—not logical assessments of compatibility. Intermittent reinforcement from on-off dynamics can intensify lingering thoughts.',
    takeaways: [
      'The brain grieves attachment, not just good relationships.',
      'Intermittent highs and lows create stronger memory bonds.',
      'Logical knowing and emotional processing happen on different timelines.',
      'Thoughts become less frequent with time and intentional healing.',
    ],
    happening:
      'Memories, songs, or places may trigger sudden ex thoughts.\n\nYou may mentally replay arguments or good moments despite knowing it ended for reasons.',
    help:
      'Limit contact and social media stalking that resets healing.\n\nRemind yourself why the relationship ended when nostalgia hits.\n\nBuild new routines that do not center the past relationship.\n\nProcess grief with a therapist rather than only ruminating alone.\n\nBe patient—intrusive thoughts are common early in breakup recovery.\n\nRedirect energy toward activities that rebuild identity outside the relationship.',
    support:
      `${SUPPORT}\n\nSeek help if ex fixation prevents functioning, involves harassment, or coexists with abuse trauma.`,
    related: [
      'How do I get over a breakup?',
      'Why do I miss my ex even though they hurt me?',
      'How do I stop checking my ex on social media?',
      'How do I rebuild identity after a breakup?',
      'How do I know if I am ready to date again?',
    ],
    schemaAnswer:
      'Thinking about an ex despite knowing they were wrong reflects normal grief processing—limit contact, process loss, and allow time for thoughts to fade.',
    themes: ['Breakup', 'Grief', 'Attachment', 'Recovery'],
  }),
  'why-do-i-lose-myself-in-romantic-relatio-181288-012': draft({
    question: 'Why do I lose myself in romantic relationships?',
    slug: 'why-do-i-lose-myself-in-romantic-relatio-181288-012',
    category: 'Relationships & Divorce',
    title: 'Losing Myself in Relationships',
    meta: 'Losing yourself in romance often reflects codependency, low self-worth, or fear of abandonment—not healthy merging.',
    summary:
      'Losing yourself in romantic relationships often stems from codependency, low self-worth, or fear of abandonment. You may prioritize your partner\'s needs, opinions, and interests to maintain connection—especially if love felt conditional in childhood.',
    takeaways: [
      'Codependency merges identity with partner approval.',
      'Fear of abandonment makes authenticity feel dangerous.',
      'Healthy relationships require two whole individuals.',
      'Selfhood outside romance must be actively maintained.',
    ],
    happening:
      'Hobbies, friendships, or goals may fade when a relationship intensifies.\n\nYou may struggle to name preferences separate from your partner\'s.',
    help:
      'Maintain friendships and interests before and during relationships.\n\nPractice expressing differing opinions in safe moments.\n\nSchedule regular solo time without guilt.\n\nNotice when you suppress needs to avoid conflict.\n\nExplore childhood patterns linking love to self-abandonment.\n\nConsider therapy if identity loss repeats across relationships.',
    support:
      `${SUPPORT}\n\nSeek help if relationships feel controlling or you cannot reclaim identity despite efforts.`,
    related: [
      'Why do I feel like I am losing myself in my relationship?',
      'How do I know if my relationship is codependent?',
      'How do I stop people-pleasing?',
      'How do I set boundaries in relationships?',
      'How do I rebuild identity after a breakup?',
    ],
    schemaAnswer:
      'Losing yourself in relationships often reflects codependency or fear of abandonment—maintain identity through hobbies, boundaries, and therapy.',
    themes: ['Codependency', 'Relationships', 'Identity', 'Self-worth'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-parent-the-way-i-was-parented-even-when-i-swore-i-wouldnt': draft({
    question: "Why do I parent the way I was parented even when I swore I wouldn't?",
    slug: 'why-do-i-parent-the-way-i-was-parented-even-when-i-swore-i-wouldnt',
    category: 'Inner Child & Parenting',
    title: 'Repeating Parenting Patterns',
    meta: 'Parenting patterns stored deep in the nervous system often emerge under stress—awareness and practice help break cycles.',
    summary:
      'Repeating parenting patterns you swore to avoid is common because those responses are wired into your brain and nervous system from childhood. Under stress, fatigue, and overwhelm, your brain defaults to the most familiar reactions—even when they conflict with your values.',
    takeaways: [
      'Childhood parenting patterns run on autopilot under stress.',
      'Awareness alone is insufficient without new skill practice.',
      'Noticing repetition is a sign of growth, not failure.',
      'Rewiring requires self-compassion and often professional support.',
    ],
    happening:
      'Your parent\'s words may escape your mouth despite your intentions.\n\nOverwhelm may trigger reactions you consciously reject.',
    help:
      'Pause before reacting— even three breaths create choice.\n\nApologize and repair with your child when you miss the mark.\n\nLearn new communication and regulation skills through classes or therapy.\n\nProcess your own childhood so it has less power over reactions.\n\nBuild support so you are not parenting depleted and alone.\n\nCelebrate each time you catch the pattern and choose differently.',
    support:
      `${SUPPORT}\n\nSeek parenting support or therapy if patterns include violence, severe shame, or inability to regulate.`,
    related: [
      'How do I break generational trauma cycles?',
      'How do I repair with my child after yelling?',
      'How do I manage anger as a parent?',
      'How do I heal from my own childhood wounds?',
      'How do I practice gentle parenting when triggered?',
    ],
    schemaAnswer:
      'Repeating inherited parenting patterns under stress is common—build new skills, repair with children, and seek support to break cycles.',
    themes: ['Parenting', 'Generational patterns', 'Inner child', 'Emotional regulation'],
  }),
  'why-do-i-push-people-away-when-they-get-181083-091': draft({
    question: 'Why do I push people away when they get too close?',
    slug: 'why-do-i-push-people-away-when-they-get-181083-091',
    category: 'Relationships & Divorce',
    title: 'Pushing People Away When Close',
    meta: 'Pushing people away when they get close is often a protective strategy from past abandonment or hurt—therapy helps you stay present.',
    summary:
      'Pushing people away when intimacy increases often reflects a protective strategy learned from past abandonment, neglect, or emotional hurt. Creating distance before others leave feels safer than risking rejection—but prevents the deep connection you may crave.',
    takeaways: [
      'Self-sabotage can preempt feared abandonment.',
      'Past hurt taught that closeness leads to pain.',
      'Protection that once helped now blocks intimacy.',
      'Staying present despite fear is learnable with support.',
    ],
    happening:
      'You may pick fights, go cold, or ghost when someone gets closer.\n\nIntimacy may trigger urge to flee before being left.',
    help:
      'Name the fear when closeness rises—I want to run because I am scared.\n\nCommunicate the pattern to trusted partners or friends.\n\nStay with discomfort in small doses instead of creating distance.\n\nExplore attachment history with a therapist.\n\nNotice relationships where you feel safe enough to practice staying.\n\nDistinguish genuine incompatibility from fear-driven withdrawal.',
    support:
      `${SUPPORT}\n\nSeek therapy if push-pull patterns destroy relationships or drive chronic isolation.`,
    related: [
      'Why do I have such a hard time trusting that people actually like me?',
      'How do I overcome fear of abandonment?',
      'How do I build secure attachment?',
      'How do I stop sabotaging good relationships?',
      'How do I set boundaries without pushing people away?',
    ],
    schemaAnswer:
      'Pushing people away when close often protects against past abandonment—recognize the pattern and practice staying present with therapeutic support.',
    themes: ['Attachment', 'Abandonment', 'Self-sabotage', 'Relationships'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-wake-up-at-3am-with-anxiety-eve-181083-045': draft({
    question: 'Why do I wake up at 3am with anxiety every night?',
    slug: 'why-do-i-wake-up-at-3am-with-anxiety-eve-181083-045',
    category: 'Anxiety & Stress',
    title: 'Waking at 3am With Anxiety',
    meta: '3am anxiety often relates to sleep cycles and circadian dips—consistent sleep habits and daytime stress management help.',
    summary:
      'Waking at the same time nightly with anxiety often relates to natural sleep cycle shifts. Around 3–4am your body experiences temperature and hormone changes that can trigger wakefulness. If you are already stressed, waking in an anxious state becomes a learned pattern.',
    takeaways: [
      'Circadian dips around 3–4am naturally increase wakefulness.',
      'Learned anxiety at wake time can become self-reinforcing.',
      'Daytime stress management reduces nighttime activation.',
      'A middle-of-the-night plan reduces dread about waking.',
    ],
    happening:
      'You may wake with racing thoughts at roughly the same time.\n\nAnxiety about not sleeping may worsen the pattern.',
    help:
      'Keep consistent sleep and wake times—even after bad nights.\n\nHave a calm plan for wake episodes: dim light, breathing, no clock-checking.\n\nLimit caffeine and screens in the evening.\n\nAddress daytime stress so less carries into sleep.\n\nGet out of bed briefly if awake more than 20 minutes, then return.\n\nDiscuss persistent patterns with a healthcare provider.',
    support:
      `${SUPPORT}\n\nSeek evaluation if 3am waking causes severe sleep deprivation or panic attacks.`,
    related: [
      'Why does my anxiety get worse at night?',
      'How do I improve sleep when anxiety keeps me awake?',
      'Why do small problems feel huge at night?',
      'How do I manage nighttime panic?',
      'How do I create a bedtime routine for anxiety?',
    ],
    schemaAnswer:
      '3am anxiety often reflects sleep cycle shifts and stress—maintain sleep habits, manage daytime stress, and use a calm plan for middle-of-night wakeups.',
    themes: ['Sleep', 'Anxiety', 'Circadian rhythm', 'Insomnia'],
    refs: [ANXIETY, NIMH],
  }),
  'why-do-i-worry-about-things-that-havent-181288-006': draft({
    question: "Why do I worry about things that haven't happened yet?",
    slug: 'why-do-i-worry-about-things-that-havent-181288-006',
    category: 'Anxiety & Stress',
    title: 'Worrying About the Future',
    meta: 'Anticipatory anxiety is your brain preparing for threats—but imagined worst cases often cause more distress than reality.',
    summary:
      'Worrying about things that have not happened—anticipatory anxiety—is your brain trying to prepare for potential threats by imagining worst-case scenarios. Your nervous system responds to imagined threats similarly to real ones, creating suffering before anything occurs.',
    takeaways: [
      'The brain cannot fully distinguish real from imagined threats.',
      'Anticipatory worry rarely prevents bad outcomes.',
      'Future focus steals peace from the present moment.',
      'Challenging catastrophic thoughts reduces anticipatory anxiety.',
    ],
    happening:
      'Your mind may run disaster scenarios about work, health, or relationships.\n\nPhysical tension may build while nothing has actually gone wrong.',
    help:
      'Ask what evidence supports the worst case versus likely outcomes.\n\nSchedule a brief daily worry time instead of all-day rumination.\n\nPractice grounding in present-moment sensory experience.\n\nLimit news or triggers that fuel catastrophic thinking.\n\nWrite actionable steps for concerns you can influence.\n\nSeek therapy for generalized anxiety if future worry dominates life.',
    support:
      `${SUPPORT}\n\nSeek help if anticipatory anxiety prevents sleep, decisions, or daily functioning.`,
    related: [
      'Why do I get anxious when good things happen?',
      'How do I stop catastrophizing?',
      'How do I manage anxiety about things I cannot control?',
      'How do I practice mindfulness when my mind races?',
      'How do I know if I have an anxiety disorder?',
    ],
    schemaAnswer:
      'Worry about future events is anticipatory anxiety—challenge catastrophic thoughts, stay present, and seek therapy when worry dominates daily life.',
    themes: ['Anticipatory anxiety', 'Worry', 'Catastrophic thinking', 'Mindfulness'],
    refs: [ANXIETY, NIMH],
  }),
  'why-do-my-partner-and-i-have-the-same-fi-185759-033': draft({
    question: 'Why do my partner and I have the same fight over and over?',
    slug: 'why-do-my-partner-and-i-have-the-same-fi-185759-033',
    category: 'Relationships & Communication',
    title: 'Same Fight Over and Over',
    meta: 'Recurring fights usually mask deeper unmet needs—dishes and timing arguments often stand in for feeling disrespected or unloved.',
    summary:
      'Having the same fight repeatedly signals you are not addressing the real issue. Surface conflicts about chores, money, or lateness often represent deeper needs—to feel respected, heard, loved, or safe. Until underlying needs are named, the cycle repeats.',
    takeaways: [
      'Surface topics rarely explain the emotional intensity.',
      'Unmet attachment needs fuel repetitive conflict.',
      'Old wounds get reactivated in familiar argument patterns.',
      'Couples therapy helps identify and address root issues.',
    ],
    happening:
      'Arguments may follow a predictable script with the same triggers.\n\nNeither partner feels resolved after the fight ends.',
    help:
      'Ask what you are really feeling beneath the surface topic.\n\nName needs—I need to feel respected—instead of only blaming.\n\nListen for your partner\'s underlying fear or hurt too.\n\nTake breaks before escalation and return to repair.\n\nConsider couples counseling to map recurring patterns.\n\nChange one small behavior that addresses the deeper need.',
    support:
      `${SUPPORT}\n\nSeek help if recurring fights include contempt, threats, or physical harm.`,
    related: [
      'How do I improve communication in my relationship?',
      'How do I know if my relationship is healthy?',
      'How do I repair after a fight with my partner?',
      'Why do I feel lonely in my relationship?',
      'How do I set boundaries in relationships?',
    ],
    schemaAnswer:
      'Recurring fights often mask unmet emotional needs—identify what you really need beneath surface conflicts and consider couples therapy.',
    themes: ['Conflict', 'Communication', 'Relationships', 'Attachment'],
    gaps: ['No dedicated couples-therapy clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-small-problems-feel-huge-at-night-181083-048': draft({
    question: 'Why do small problems feel huge at night?',
    slug: 'why-do-small-problems-feel-huge-at-night-181083-048',
    category: 'Anxiety & Stress',
    title: 'Small Problems Feel Huge at Night',
    meta: 'Problems magnify at night because fatigue impairs emotional regulation and perspective—morning often brings clearer thinking.',
    summary:
      'Small problems feel huge at night because your tired brain has reduced capacity for emotional regulation and rational perspective. The prefrontal cortex functions less well when sleep-deprived, while darkness and quiet can increase isolation and vulnerability.',
    takeaways: [
      'Fatigue impairs the brain\'s emotional regulation systems.',
      'Nighttime isolation amplifies worries without daytime distractions.',
      'Things often look more manageable after rest.',
      'Avoid major decisions during nighttime distress peaks.',
    ],
    happening:
      'Minor concerns may spiral into catastrophe after dark.\n\nYou may replay problems without the perspective daytime provides.',
    help:
      'Postpone problem-solving until morning when possible.\n\nWrite worries down and promise to revisit tomorrow.\n\nUse a brief calming routine instead of rumination.\n\nImprove sleep hygiene to reduce baseline fatigue.\n\nRemind yourself that night brain distorts scale.\n\nSeek help if nighttime distress chronically disrupts sleep.',
    support:
      `${SUPPORT}\n\nSeek evaluation if nighttime rumination causes severe insomnia or panic.`,
    related: [
      'Why does my anxiety get worse at night?',
      'Why do I wake up at 3am with anxiety every night?',
      'How do I stop ruminating at bedtime?',
      'How do I improve sleep when anxiety keeps me awake?',
      'How do I manage anxiety without avoiding life?',
    ],
    schemaAnswer:
      'Problems feel bigger at night because fatigue impairs perspective—postpone decisions, write worries down, and revisit with rested thinking.',
    themes: ['Sleep', 'Rumination', 'Anxiety', 'Emotional regulation'],
    refs: [ANXIETY, NIMH],
  }),
  'why-does-everyone-else-seem-to-have-their-career-figured-out': draft({
    question: 'Why does everyone else seem to have their career figured out?',
    slug: 'why-does-everyone-else-seem-to-have-their-career-figured-out',
    category: 'Career & Purpose',
    title: 'Everyone Else Has Careers Figured Out',
    meta: 'Career clarity is often an illusion—most people improvise, pivot, and hide uncertainty while presenting confidence.',
    summary:
      'The belief that everyone else has their career figured out is a persistent myth. Most people improvise, pivot, and carry private doubts while presenting linear success narratives. Social media amplifies highlight reels and hides rejections, imposter feelings, and direction changes.',
    takeaways: [
      'Confidence presentation masks private uncertainty for many.',
      'Career development is lifelong, not a one-time decision.',
      'Comparison uses others\' outsides against your insides.',
      'Next-step clarity matters more than having it all mapped.',
    ],
    happening:
      'Peers\' promotions and titles may trigger inadequacy about your path.\n\nYou may assume others have a plan you lack.',
    help:
      'Talk honestly with trusted peers about career doubts—you will find shared uncertainty.\n\nFocus on the next meaningful step rather than a perfect life plan.\n\nReduce comparison triggers on professional social media.\n\nValue non-linear paths including pivots and late discoveries.\n\nExplore interests through small experiments instead of pressure for certainty.\n\nSeek career counseling if paralysis or distress is chronic.',
    support:
      `${SUPPORT}\n\nSeek help if career anxiety drives depression, burnout, or self-harm thoughts.`,
    related: [
      'Why do I feel stuck in a job that is slowly killing my soul?',
      'How do I overcome imposter syndrome at work?',
      'How do I find purpose when I feel stuck?',
      'How do I stop comparing myself to others?',
      'How do I manage anxiety about changing careers?',
    ],
    schemaAnswer:
      'Career clarity in others is often an illusion—focus on your next step, reduce comparison, and accept that most paths unfold non-linearly.',
    themes: ['Career', 'Comparison', 'Imposter syndrome', 'Purpose'],
    refs: [BURNOUT, NIMH],
  }),
  'why-does-everyone-else-seem-to-move-on-w-186032-006': draft({
    question: "Why does everyone else seem to move on while I'm still grieving?",
    slug: 'why-does-everyone-else-seem-to-move-on-w-186032-006',
    category: 'Grief & Loss',
    title: 'Others Move On While I Grieve',
    meta: 'Grief timelines differ—others may process differently, hide pain, or had different relationships; your pace is valid.',
    summary:
      'Feeling left behind in grief while others seem to move on is painful. People grieve differently, hide pain, had different relationships with the deceased, or face social pressure to appear recovered. Your timeline is valid whether it takes months or years.',
    takeaways: [
      'Visible recovery often hides ongoing private grief.',
      'Relationship depth affects grief duration and intensity.',
      'Society pressures premature closure on grief.',
      'Deep love deserves time and space to mourn.',
    ],
    happening:
      'Others may return to routines while you still feel raw.\n\nYou may feel judged for grieving longer than expected.',
    help:
      'Avoid comparing your inner experience to others\' outward appearance.\n\nSeek grief communities where your pace is normalized.\n\nHonor your relationship rather than rushing to match others.\n\nAllow grief waves without treating them as failure.\n\nCommunicate needs to people who pressure you to move on.\n\nConsult a grief counselor if isolation or stuckness persists.',
    support:
      `${SUPPORT}\n\nSeek grief support if mourning includes self-harm thoughts or inability to function.`,
    related: [
      'Why does grief feel like it is never going to end?',
      'Why do I keep having dreams about the person who died?',
      'How do I cope with grief anniversaries?',
      'How do I process complicated grief?',
      'Is it normal to feel angry during grief?',
    ],
    schemaAnswer:
      'Others seeming to move on faster reflects different grief styles and hidden pain—honor your timeline and seek support without comparison.',
    themes: ['Grief', 'Comparison', 'Loss', 'Timeline'],
    refs: [GRIEF, NIMH],
  }),
  'why-does-everything-feel-pointless-when-190648-012': draft({
    question: "Why does everything feel pointless when I'm depressed?",
    slug: 'why-does-everything-feel-pointless-when-190648-012',
    category: 'Depression',
    title: 'Everything Feels Pointless When Depressed',
    meta: 'Meaninglessness is a depression symptom affecting brain chemistry and hope—not an accurate verdict on your life\'s value.',
    summary:
      'Feeling that everything is pointless is a distressing depression symptom reflecting altered neurotransmitter function, anhedonia, hopelessness, and cognitive distortions—not an accurate assessment of your life\'s meaning. Depression makes it hard to imagine improvement or connect actions to positive outcomes.',
    takeaways: [
      'Anhedonia blocks pleasure and interest in meaningful activities.',
      'Hopelessness distorts perception of future possibilities.',
      'Exhaustion makes effort feel not worth the cost.',
      'Meaning often returns as depression improves with treatment.',
    ],
    happening:
      'Activities that once mattered may feel empty or futile.\n\nYou may struggle to see why any effort would help.',
    help:
      'Treat pointlessness as a symptom, not truth about your life.\n\nEngage in small value-aligned actions even without felt meaning.\n\nSeek evaluation for depression—therapy and medication help many.\n\nReduce all-or-nothing thinking about purpose and productivity.\n\nStay connected to one person rather than isolating completely.\n\nAvoid major irreversible decisions during severe depressive episodes.',
    support:
      `${SUPPORT}\n\nSeek urgent help if pointlessness includes self-harm or suicidal thoughts; call or text 988 in the U.S.`,
    related: [
      'Why do I feel emotionally numb?',
      'How do I know if I have depression?',
      'Why do I feel worse after good days when I have depression?',
      'How do I find motivation when depressed?',
      'How do I cope with suicidal thoughts?',
    ],
    schemaAnswer:
      'Pointlessness with depression is a symptom of altered mood and cognition—seek treatment and take small value-aligned actions even when meaning feels absent.',
    themes: ['Depression', 'Anhedonia', 'Hopelessness', 'Meaning'],
    refs: [DEPRESSION, NIMH],
  }),
  'why-does-grief-feel-like-its-never-going-to-end': draft({
    question: "Why does grief feel like it's never going to end?",
    slug: 'why-does-grief-feel-like-its-never-going-to-end',
    category: 'Grief & Loss',
    title: 'Grief Feels Never-Ending',
    meta: 'Grief transforms rather than disappears—the acute pain lessens over time while love and connection remain.',
    summary:
      'In deep grief it can feel like pain will never lessen. Acute overwhelming sadness does gradually soften for most people, but grief does not end—it transforms. You do not stop missing someone; missing becomes a tender spot rather than an open wound.',
    takeaways: [
      'Acute grief intensity usually decreases over time.',
      'Grief waves can return without meaning you failed.',
      'Transformation differs from forgetting or moving on.',
      'Carrying grief while living fully is possible.',
    ],
    happening:
      'Good days may be followed by crushing returns of sorrow.\n\nYou may fear feeling this way forever.',
    help:
      'Accept grief waves without interpreting them as permanent regression.\n\nBuild small moments of life alongside mourning, not instead of it.\n\nConnect with others who understand non-linear grief.\n\nAvoid timelines imposed by others about when you should feel better.\n\nSeek grief counseling when stuckness feels total.\n\nHonor the person who died through rituals or memory practices.',
    support:
      `${SUPPORT}\n\nSeek urgent help if grief includes self-harm thoughts or inability to meet basic needs.`,
    related: [
      'Why does everyone else seem to move on while I am still grieving?',
      'Why does grief feel physical?',
      'Why do I keep having dreams about the person who died?',
      'How do I process complicated grief?',
      'Can AI griefbots make grief harder to process?',
    ],
    schemaAnswer:
      'Grief feels never-ending in acute phases but transforms over time—honor your pace and seek support when pain feels stuck or unsafe.',
    themes: ['Grief', 'Loss', 'Healing', 'Timeline'],
    refs: [GRIEF, NIMH],
  }),
  'why-does-grief-feel-physical-185387-009': draft({
    question: 'Why does grief feel physical?',
    slug: 'why-does-grief-feel-physical-185387-009',
    category: 'Grief & Loss',
    title: 'Grief Feels Physical',
    meta: 'Grief activates the same brain regions as physical pain—chest tightness, fatigue, and aches are normal body responses to loss.',
    summary:
      'Grief hurts physically because emotional pain activates neural pathways overlapping with physical pain. Chest tightness, fatigue, headaches, nausea, and muscle aches reflect your body\'s stress response to loss. Broken heart syndrome has scientific basis in intense grief.',
    takeaways: [
      'Emotional and physical pain share brain circuitry.',
      'Stress hormones during grief affect heart and immune function.',
      'Body symptoms are normal and usually temporary.',
      'Physical self-care supports grief processing.',
    ],
    happening:
      'Your chest may feel heavy or your body exhausted without illness.\n\nAppetite, sleep, and energy may shift dramatically after loss.',
    help:
      'Eat regularly, hydrate, and rest even when appetite is low.\n\nTry gentle movement like walking when energy allows.\n\nAccept physical symptoms as part of mourning, not weakness.\n\nAvoid isolating completely when body grief feels overwhelming.\n\nConsult a healthcare provider if symptoms persist or worsen.\n\nSeek grief counseling alongside physical self-care.',
    support:
      `${SUPPORT}\n\nSeek urgent medical care for severe chest pain, fainting, or symptoms suggesting cardiac events.`,
    related: [
      'Why does grief feel like it is never going to end?',
      'Why do I keep having dreams about the person who died?',
      'How do I cope with grief exhaustion?',
      'How do I take care of my body while grieving?',
      'How do I know if I need grief counseling?',
    ],
    schemaAnswer:
      'Physical grief symptoms are normal—emotional pain activates bodily stress responses; prioritize basic self-care and seek medical help for severe symptoms.',
    themes: ['Grief', 'Physical symptoms', 'Stress response', 'Loss'],
    refs: [GRIEF, NIMH],
  }),
  'why-does-my-anxiety-get-worse-at-night': draft({
    question: 'Why does my anxiety get worse at night?',
    slug: 'why-does-my-anxiety-get-worse-at-night',
    category: 'Anxiety & Stress',
    title: 'Anxiety Worse at Night',
    meta: 'Nighttime anxiety intensifies when distractions fade, fatigue impairs regulation, and worry about sleep itself creates a cycle.',
    summary:
      'Nighttime anxiety is common because daytime distractions disappear, fatigue reduces emotional regulation, circadian hormone shifts occur, and anticipatory fear about sleep can create its own anxiety cycle. Evening reflection can turn into rumination.',
    takeaways: [
      'Quiet and darkness remove daytime distraction from worries.',
      'Fatigue weakens coping capacity for anxious thoughts.',
      'Fear of insomnia can trigger anxiety about bedtime itself.',
      'Evening rumination about tomorrow amplifies night distress.',
    ],
    happening:
      'Worries may flood in when you lie down to sleep.\n\nHeart rate and tension may rise despite a physically safe environment.',
    help:
      'Establish a consistent wind-down routine without screens.\n\nSchedule brief evening worry time before bed.\n\nUse grounding or guided relaxation if mind races.\n\nLimit caffeine and heavy meals in the afternoon and evening.\n\nGet out of bed briefly if unable to sleep rather than fighting in place.\n\nSeek therapy for chronic nighttime anxiety or insomnia.',
    support:
      `${SUPPORT}\n\nSeek help if nighttime anxiety causes panic attacks or severe sleep deprivation.`,
    related: [
      'Why do I wake up at 3am with anxiety every night?',
      'Why do small problems feel huge at night?',
      'Why do I feel more anxious when I try to relax?',
      'How do I improve sleep when anxiety keeps me awake?',
      'How do I manage panic symptoms at night?',
    ],
    schemaAnswer:
      'Nighttime anxiety worsens when distractions fade and fatigue impairs regulation—use wind-down routines, limit evening rumination, and seek help for chronic insomnia.',
    themes: ['Night anxiety', 'Sleep', 'Rumination', 'Insomnia'],
    refs: [ANXIETY, NIMH],
  }),
  'why-does-my-anxiety-get-worse-when-i-try-190219-004': draft({
    question: 'Why does my anxiety get worse when I try to relax?',
    slug: 'why-does-my-anxiety-get-worse-when-i-try-190219-004',
    category: 'Anxiety & Stress',
    title: 'Anxious When Trying to Relax',
    meta: 'Relaxation-induced anxiety is common—stillness lets suppressed worry surface and can feel unsafe to hypervigilant nervous systems.',
    summary:
      'Anxiety increasing when you try to relax—relaxation-induced anxiety—is paradoxical but common. Slowing down allows suppressed emotions to surface, hypervigilant systems may interpret calm as unsafe, and busyness may have masked worries that rush forward in stillness.',
    takeaways: [
      'Constant activity can suppress worries until rest allows surfacing.',
      'Hypervigilance associates vigilance with safety.',
      'Unfamiliar calm sensations may trigger alarm initially.',
      'Gradual active calm builds tolerance better than forced stillness.',
    ],
    happening:
      'Rest may flood you with to-do lists or future fears.\n\nPassive lying still may feel worse than gentle movement.',
    help:
      'Start with brief relaxation and increase gradually.\n\nTry active calm—walking meditation, gentle yoga, creative flow.\n\nAccept rising feelings during rest without judging failure.\n\nSchedule daytime worry time so night rest is less crowded.\n\nPractice grounding if body sensations during relaxation alarm you.\n\nSeek therapy for trauma or chronic anxiety if rest consistently triggers panic.',
    support:
      `${SUPPORT}\n\nSeek help if relaxation attempts trigger panic attacks or inability to recover from stress.`,
    related: [
      'Why do I feel more anxious when I try to relax?',
      'Why does my anxiety get worse at night?',
      'How do I practice mindfulness when my mind races?',
      'How do I recover from burnout?',
      'How do I manage trauma-related hypervigilance?',
    ],
    schemaAnswer:
      'Anxiety when relaxing often reflects relaxation-induced anxiety—start with brief active calm and seek therapy if hypervigilance blocks rest.',
    themes: ['Relaxation anxiety', 'Hypervigilance', 'Trauma', 'Stress'],
    refs: [ANXIETY, NIMH],
    notes: 'Duplicate question variant; cross-link 191368-003 slug.',
  }),
  'why-does-my-chest-feel-tight-when-im-anx-181083-001': draft({
    question: "Why does my chest feel tight when I'm anxious?",
    slug: 'why-does-my-chest-feel-tight-when-im-anx-181083-001',
    category: 'Anxiety & Stress',
    title: 'Chest Tightness When Anxious',
    meta: 'Anxiety chest tightness is a fight-or-flight muscle response—usually harmless but worth medical evaluation if concerning.',
    summary:
      'Chest tightness during anxiety results from stress hormones tensing chest and surrounding muscles as part of fight-or-flight. While frightening and sometimes mimicking heart symptoms, anxiety-related tightness is typically benign. Medical evaluation provides peace of mind when symptoms are new or severe.',
    takeaways: [
      'Stress hormones cause muscle tension in the chest wall.',
      'Anxiety symptoms can mimic heart concerns frighteningly.',
      'Slow breathing helps activate the calming nervous system.',
      'New or severe chest symptoms warrant medical evaluation.',
    ],
    happening:
      'Tightness may accompany rapid heartbeat, shallow breathing, or dread.\n\nFear about heart problems may intensify the anxiety cycle.',
    help:
      'Practice slow diaphragmatic breathing to reduce muscle tension.\n\nUse grounding techniques during acute episodes.\n\nLimit caffeine if it worsens physical anxiety symptoms.\n\nLearn to recognize anxiety patterns versus new cardiac symptoms.\n\nSeek medical evaluation for new, severe, or persistent chest pain.\n\nConsider therapy for panic or health anxiety if cycles are frequent.',
    support:
      `${SUPPORT}\n\nSeek emergency care for chest pain with shortness of breath, arm pain, or fainting—do not assume anxiety without evaluation.`,
    related: [
      'Why does my heart race even when I am just sitting still?',
      'Why does my throat feel tight when I am stressed?',
      'How do I manage panic attacks?',
      'How do I tell anxiety from a medical emergency?',
      'How do I cope with health anxiety?',
    ],
    schemaAnswer:
      'Chest tightness with anxiety reflects fight-or-flight muscle tension—use breathing and grounding; seek emergency care for severe or uncertain cardiac symptoms.',
    themes: ['Physical anxiety', 'Panic', 'Fight-or-flight', 'Somatiization'],
    refs: [ANXIETY, CDC],
  }),
  'why-does-my-face-feel-hot-and-flushed-wh-181083-012': draft({
    question: "Why does my face feel hot and flushed when I'm embarrassed?",
    slug: 'why-does-my-face-feel-hot-and-flushed-wh-181083-012',
    category: 'Anxiety & Stress',
    title: 'Face Flushes When Embarrassed',
    meta: 'Embarrassment flushing is normal—blood vessels dilate from adrenaline and social emotional arousal.',
    summary:
      'Facial flushing when embarrassed is a normal physiological response. Blood vessels in your face dilate due to emotional arousal and adrenaline release from your sympathetic nervous system. Blushing can signal social awareness, though it often feels mortifying to the person experiencing it.',
    takeaways: [
      'Adrenaline dilates facial blood vessels during embarrassment.',
      'Blushing is a universal social signal, not a character flaw.',
      'Others usually notice less than you fear they do.',
      'Acceptance reduces shame that intensifies flushing.',
    ],
    happening:
      'Heat and redness may spread across cheeks, neck, or ears.\n\nAwareness of blushing may trigger more embarrassment.',
    help:
      'Remind yourself blushing is temporary and human.\n\nReduce spotlight anxiety by focusing outward on the conversation.\n\nPractice self-compassion instead of harsh inner commentary.\n\nExpose yourself gradually to mildly embarrassing situations to build tolerance.\n\nSeek therapy for social anxiety if flushing prevents participation in life.\n\nAvoid excessive heat, alcohol, or triggers if they worsen flushing.',
    support:
      `${SUPPORT}\n\nSeek evaluation if flushing is severe, constant, or unrelated to emotional triggers.`,
    related: [
      'How do I cope with social anxiety?',
      'Why do I get trembling hands when I am nervous?',
      'How do I stop caring what others think?',
      'How do I build confidence in social situations?',
      'How do I manage embarrassment after the moment passes?',
    ],
    schemaAnswer:
      'Facial flushing when embarrassed is normal adrenaline response—others notice less than you think; therapy helps if social anxiety is severe.',
    themes: ['Embarrassment', 'Social anxiety', 'Blushing', 'Physical symptoms'],
    refs: [ANXIETY, NIMH],
  }),
  'why-does-my-heart-race-even-when-im-just-181083-005': draft({
    question: "Why does my heart race even when I'm just sitting still?",
    slug: 'why-does-my-heart-race-even-when-im-just-181083-005',
    category: 'Anxiety & Stress',
    title: 'Heart Races While Sitting Still',
    meta: 'Resting heart racing often reflects anxiety, caffeine, dehydration, or heightened alertness—not always cardiac disease.',
    summary:
      'Heart racing while physically still often reflects your nervous system responding to internal stress or anxiety. Your brain may perceive non-physical threats, triggering fight-or-flight. Caffeine, dehydration, poor sleep, and anxiety disorders are common contributors.',
    takeaways: [
      'Internal stress can activate fight-or-flight at rest.',
      'Caffeine and sleep deprivation amplify resting heart rate.',
      'Awareness of racing heart can worsen anxiety cycles.',
      'Medical evaluation rules out causes when symptoms are frequent.',
    ],
    happening:
      'Palpitations may occur without obvious external triggers.\n\nYou may monitor heartbeat obsessively, increasing distress.',
    help:
      'Reduce caffeine and check hydration and sleep quality.\n\nPractice slow breathing when you notice racing heart.\n\nLimit pulse-checking that fuels health anxiety spirals.\n\nTrack triggers—stress, meals, time of day.\n\nDiscuss frequent palpitations with a healthcare provider.\n\nSeek therapy for anxiety or panic if racing heart dominates daily life.',
    support:
      `${SUPPORT}\n\nSeek emergency care for racing heart with chest pain, fainting, or severe shortness of breath.`,
    related: [
      'Why does my chest feel tight when I am anxious?',
      'How do I manage panic attacks?',
      'How do I cope with health anxiety?',
      'How do I reduce caffeine without withdrawal misery?',
      'How do I know if I have an anxiety disorder?',
    ],
    schemaAnswer:
      'Heart racing at rest often reflects anxiety or lifestyle factors—address triggers and seek medical evaluation for frequent or concerning palpitations.',
    themes: ['Palpitations', 'Anxiety', 'Panic', 'Physical symptoms'],
    refs: [ANXIETY, CDC],
  }),
  'why-does-my-throat-feel-tight-when-im-st-181083-008': draft({
    question: "Why does my throat feel tight when I'm stressed?",
    slug: 'why-does-my-throat-feel-tight-when-im-st-181083-008',
    category: 'Anxiety & Stress',
    title: 'Throat Tightness When Stressed',
    meta: 'Stress throat tightness—globus sensation—comes from muscle tension in the neck and throat; it is usually harmless.',
    summary:
      'Throat tightness during stress—globus sensation—results from involuntary muscle tension in the neck and throat area. Stress contracts these muscles, creating a lump-in-throat or hard-to-swallow feeling that is distressing but typically harmless.',
    takeaways: [
      'Stress tenses neck and throat muscles automatically.',
      'Globus sensation is common and usually not structural blockage.',
      'Anxiety about swallowing can intensify the sensation.',
      'Relaxation and gentle stretches often ease tension.',
    ],
    happening:
      'You may feel a lump or constriction without actual obstruction.\n\nSwallowing may feel effortful during high-stress periods.',
    help:
      'Try gentle neck and shoulder stretches and warm liquids.\n\nPractice slow breathing to reduce overall muscle tension.\n\nAvoid repeatedly testing swallowing, which can worsen focus on sensation.\n\nAddress underlying stressors and anxiety patterns.\n\nSeek medical evaluation if tightness is new, severe, or affects breathing.\n\nConsider therapy for anxiety if globus is frequent.',
    support:
      `${SUPPORT}\n\nSeek urgent care if throat tightness affects breathing or follows allergic reaction.`,
    related: [
      'Why does my chest feel tight when I am anxious?',
      'Why do I get headaches when I am stressed?',
      'How do I manage stress-related physical symptoms?',
      'How do I reduce jaw clenching from anxiety?',
      'How do I cope with health anxiety?',
    ],
    schemaAnswer:
      'Throat tightness when stressed is usually globus from muscle tension—use relaxation and stretches; seek care if breathing is affected.',
    themes: ['Globus sensation', 'Stress', 'Physical anxiety', 'Muscle tension'],
    refs: [ANXIETY, NIMH],
  }),
  'why-does-talking-to-ai-feel-easier-than-talking-to-189142-017': draft({
    question: 'Why does talking to AI feel easier than talking to my therapist?',
    slug: 'why-does-talking-to-ai-feel-easier-than-talking-to-189142-017',
    category: 'Depression',
    title: 'AI Easier Than Therapist',
    meta: 'AI feels easier with no judgment, cost, or scheduling—but therapy offers professional expertise and healing human relationship.',
    summary:
      'AI can feel easier than therapy because it is available anytime, costs less, carries no judgment fear, and never challenges you uncomfortably. However, therapists bring training, pattern recognition, accountability, and the healing power of being truly known by another human.',
    takeaways: [
      'AI removes scheduling, cost, and interpersonal risk barriers.',
      'Therapists challenge thinking in ways that promote growth.',
      'The therapeutic relationship itself is part of healing.',
      'AI works best as supplement, not replacement, for therapy.',
    ],
    happening:
      'You may share freely with AI but hold back in sessions.\n\nFear of disappointing a therapist may inhibit openness.',
    help:
      'Name topics you share with AI but not your therapist—and bring one to session.\n\nDiscuss AI use openly with your therapist without shame.\n\nUse AI for reflection between sessions, not instead of them.\n\nAsk whether a different therapeutic style would feel safer.\n\nRemember discomfort in therapy often signals important work.\n\nSeek a new provider if the fit genuinely blocks progress.',
    support:
      `${SUPPORT}\n\nSeek help if AI replaces all therapeutic work while symptoms worsen.`,
    related: [
      'Why do I feel more seen and understood by AI than by real people?',
      'Why do I feel worse after therapy sessions?',
      'Can AI give bad mental health advice?',
      'How do I find the right therapist?',
      'How do I know if therapy is working?',
    ],
    schemaAnswer:
      'AI feels easier than therapy due to lower barriers—but human therapy offers expertise, challenge, and relational healing AI cannot replicate.',
    themes: ['AI companionship', 'Therapy', 'Help-seeking', 'Depression'],
    refs: [APA, DEPRESSION],
    gaps: ['Emerging topic; verify editorial stance on AI vs therapy framing.'],
  }),
  'why-dont-i-feel-anything-anymore-even-about-things-i-used-to-care-about': draft({
    question: "Why don't I feel anything anymore, even about things I used to care about?",
    slug: 'why-dont-i-feel-anything-anymore-even-about-things-i-used-to-care-about',
    category: 'Depression & Numbness',
    title: 'Feel Nothing Anymore',
    meta: 'Emotional numbness often protects an overwhelmed system—connection can return with treatment and gradual re-engagement.',
    summary:
      'Not feeling anything about things you once cared about—emotional numbness—often develops when your system has been overwhelmed by prolonged stress, depression, or trauma. Protection from further pain can block positive emotions too, leaving life feeling flat and disconnected.',
    takeaways: [
      'Numbness is often protective shutdown, not permanent loss of feeling.',
      'Anhedonia in depression dulls interest and pleasure.',
      'Watching life from outside is common with emotional flatness.',
      'Feelings can return gradually with treatment and safety.',
    ],
    happening:
      'Joy, sadness, and excitement may all feel muted or absent.\n\nYou may go through motions without genuine engagement.',
    help:
      'Treat numbness as information about overload, not character failure.\n\nEngage in small activities aligned with past values without demanding feeling.\n\nReduce isolation even when connection feels hollow.\n\nSeek evaluation for depression or trauma responses.\n\nAllow subtle emotions without pressuring big breakthroughs.\n\nWork with a therapist to reconnect with emotional life safely.',
    support:
      `${SUPPORT}\n\nSeek urgent help if numbness coexists with self-harm thoughts or complete inability to function.`,
    related: [
      'Why do I feel emotionally numb?',
      'Why does everything feel pointless when I am depressed?',
      'How do I know if I have depression?',
      'How do I reconnect with myself after trauma?',
      'How do I find motivation when depressed?',
    ],
    schemaAnswer:
      'Emotional numbness often reflects protective shutdown from overwhelm—seek treatment and re-engage gently; feelings can return over time.',
    themes: ['Numbness', 'Depression', 'Anhedonia', 'Trauma'],
    refs: [DEPRESSION, NIMH],
  }),
  'why-is-it-so-hard-to-make-friends-as-an-181083-067': draft({
    question: 'Why is it so hard to make friends as an adult?',
    slug: 'why-is-it-so-hard-to-make-friends-as-an-181083-067',
    category: 'Relationships & Divorce',
    title: 'Hard to Make Friends as Adult',
    meta: 'Adult friendship lacks school-era proximity and free time—intentional effort and shared interests replace automatic connection.',
    summary:
      'Making friends as an adult is genuinely difficult because you lack built-in proximity of school, spontaneous free time, and repeated unplanned contact. Adult friendships require intentional effort, vulnerability, and patience—and quality matters more than quantity.',
    takeaways: [
      'School provided daily proximity adult life rarely offers.',
      'Competing responsibilities reduce time for friendship building.',
      'Repeated contact and vulnerability are required for depth.',
      'One or two close friends can be deeply fulfilling.',
    ],
    happening:
      'Acquaintances may not deepen without deliberate follow-through.\n\nYou may feel awkward initiating plans after childhood ease.',
    help:
      'Join groups centered on genuine interests for repeated contact.\n\nInitiate follow-ups—a walk, coffee, class—after meeting someone you like.\n\nAccept that adult friendship builds slowly over months.\n\nBe slightly vulnerable to move beyond surface acquaintance.\n\nPrioritize consistency over trying to collect many friends.\n\nSeek therapy for social anxiety if fear blocks initiation entirely.',
    support:
      `${SUPPORT}\n\nSeek help if loneliness and failed friendship efforts drive depression or isolation.`,
    related: [
      'How do I make friends as an adult?',
      'Why do I feel so lonely even when I am surrounded by people?',
      'How do I cope with social anxiety?',
      'How do I build deeper friendships?',
      'How do I find community after a move?',
    ],
    schemaAnswer:
      'Adult friendship is hard without built-in proximity—seek repeated contact through shared interests and initiate follow-through patiently.',
    themes: ['Friendship', 'Loneliness', 'Adulthood', 'Social connection'],
  }),
  'why-is-my-teenager-so-angry-and-hostile-toward-me--187459-004': draft({
    question: 'Why is my teenager so angry and hostile toward me all the time?',
    slug: 'why-is-my-teenager-so-angry-and-hostile-toward-me--187459-004',
    category: 'Teen-Specific Questions',
    title: 'Teen Angry and Hostile',
    meta: 'Teen anger often masks hurt and developmental need for independence—stay calm, set boundaries, and seek help if severe.',
    summary:
      'Constant teen anger and hostility often reflects developmental upheaval more than personal attack. Adolescence brings intense changes, and anger may express hurt, frustration, or need for independence. Developing brains have limited impulse control, increasing reactivity.',
    takeaways: [
      'Teen anger often covers fear, hurt, or feeling controlled.',
      'Identity separation can manifest as rejection of parents.',
      'Brain development affects emotional regulation capacity.',
      'Calm boundaries plus curiosity about underlying feelings help.',
    ],
    happening:
      'Hostility may spike over rules, privacy, or perceived criticism.\n\nYou may feel like the target regardless of your intentions.',
    help:
      'Stay calm and avoid escalating by matching their intensity.\n\nSet clear consistent boundaries without lecturing in heat of moment.\n\nLook for emotions beneath anger—overwhelm, shame, exclusion.\n\nGive appropriate independence and choices where safe.\n\nRepair after conflicts to model healthy relationship skills.\n\nSeek adolescent-focused therapy if anger includes violence or severe family disruption.',
    support:
      `${SUPPORT}\n\nSeek urgent help if teen hostility includes threats, violence, or self-harm; call or text 988 in the U.S. for youth crisis support.`,
    related: [
      'How do I communicate with my angry teenager?',
      'How do I set boundaries with my teen?',
      'Why does my teen isolate in their room?',
      'How do I know if my teen needs therapy?',
      'How do I repair my relationship with my teenager?',
    ],
    schemaAnswer:
      'Teen hostility often reflects development and unspoken hurt—stay calm, maintain boundaries, and seek professional help if anger is severe or violent.',
    themes: ['Parenting teens', 'Anger', 'Adolescence', 'Family communication'],
  }),
  'can-ai-give-bad-mental-health-advice': draft({
    question: 'Can AI give bad mental health advice?',
    slug: 'can-ai-give-bad-mental-health-advice',
    category: 'Therapy & Mental Health',
    title: 'Can AI Give Bad Mental Health Advice?',
    meta: 'AI can give incomplete, overconfident, or unsafe mental health advice—especially in crises or complex situations.',
    summary:
      'Yes, AI can give bad mental health advice. It may sound confident while missing context, misunderstanding risk, offering generic suggestions, or failing to respond safely to crisis, psychosis, mania, abuse, or medical concerns.',
    takeaways: [
      'AI is not a substitute for licensed mental health care.',
      'It can be overconfident, incomplete, or wrong.',
      'Risk is higher in crisis, abuse, psychosis-like, manic, or safety-sensitive situations.',
      'Use real-world support for urgent or complex mental health needs.',
    ],
    happening:
      'AI may generate supportive text without knowing your history or risks.\n\nDangerous suggestions can sound plausible because of confident tone.',
    help:
      'Use caution with advice to stop medication, confront unsafe people, isolate, or ignore crisis symptoms.\n\nDo not rely on AI alone for diagnosis, treatment, or safety planning.\n\nCompare AI suggestions with values and professional guidance.\n\nTreat AI as reflection tool for lower-risk topics only.\n\nKeep crisis numbers accessible instead of depending on AI in emergencies.',
    support:
      'Talk to a real person if the issue involves self-harm, violence, abuse, hallucinations, delusions, mania, not sleeping, substance relapse, or feeling unable to function. If danger is immediate, contact emergency services.',
    related: [
      'When should I stop using AI and talk to a real person?',
      'Can AI therapy apps replace a licensed therapist?',
      'How do I know if AI is helping my therapy or replacing it?',
      'Should I tell my therapist how much I use AI for emotional support?',
      'Why does talking to AI feel easier than talking to my therapist?',
    ],
    schemaAnswer:
      'AI can give bad mental health advice—use human professionals for crisis, complex, or safety-sensitive situations.',
    theme: 'Therapy & Mental Health',
    themes: ['AI safety', 'Mental health', 'Crisis', 'Professional care'],
    refs: [APA, NIMH],
    gaps: ['Only one clinical-adjacent source cited; verify second source with editorial standards.'],
    flags: ['crisis_sensitive'],
    notes: 'Input item was v2/reviewed; regenerated as draft per enrichment workflow.',
  }),
  'can-ai-griefbots-make-grief-harder-to-process': draft({
    question: 'Can AI griefbots make grief harder to process?',
    slug: 'can-ai-griefbots-make-grief-harder-to-process',
    category: 'Grief & Loss',
    title: 'Can AI Griefbots Complicate Grief?',
    meta: 'AI griefbots may comfort some but can complicate mourning if they prevent acceptance or replace human support.',
    summary:
      'AI griefbots may offer comfort for some people, but they can also make grief harder if they keep the loss feeling unresolved, intensify longing, or replace support from living people. Using one is not automatically wrong, but it deserves careful boundaries.',
    takeaways: [
      'Wanting connection with someone who died is normal in grief.',
      'AI recreations can feel comforting and destabilizing simultaneously.',
      'Risk rises when griefbots prevent rest, support, or acceptance.',
      'Human grief support matters if the experience feels consuming.',
    ],
    happening:
      'Simulated responses may blur remembering from trying to keep the relationship active.\n\nYou may feel soothed temporarily then more distressed afterward.',
    help:
      'Set clear limits on when and how you use a griefbot.\n\nNotice whether it leaves you calmer or more unable to stop.\n\nBalance AI use with human grief support, rituals, and rest.\n\nHonor the bond without getting trapped in simulation.\n\nDiscuss use with a grief counselor if unsure about impact.\n\nGround yourself after sessions that feel intense.',
    support:
      'Seek grief support if the griefbot makes it hard to sleep, function, accept the death, or connect with living people. If grief includes thoughts of self-harm or wanting to die, reach urgent support now.',
    related: [
      'Is it okay to use AI to talk to someone who died?',
      'Can AI companions reduce loneliness or make it worse?',
      'When should I stop using AI and talk to a real person?',
      'Can AI give bad mental health advice?',
      'Why do I keep having dreams about the person who died?',
    ],
    schemaAnswer:
      'AI griefbots can complicate grief if they prevent acceptance or replace human support—use careful boundaries and seek grief counseling if impact feels consuming.',
    theme: 'Grief & Loss',
    themes: ['Grief', 'AI companionship', 'Boundaries', 'Bereavement'],
    refs: [APA, GRIEF],
    gaps: ['Only one clinical-adjacent source cited; verify second source with editorial standards.'],
    flags: ['crisis_sensitive'],
    notes: 'Input item was v2/reviewed; regenerated as draft per enrichment workflow.',
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
  'reports/enrichment-corpus/draft-answers/batch-37-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-37-drafts.json`);
