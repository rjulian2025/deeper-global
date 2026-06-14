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
const BURNOUT = {
  title: 'Coping with Stress',
  url: 'https://www.cdc.gov/mental-health/caring-for-yourself/coping-with-stress/index.html',
  publisher: 'CDC',
  note: 'Supports stress management and burnout recovery strategies.',
};
const DEPRESSION = {
  title: 'Depression',
  url: 'https://www.nimh.nih.gov/health/topics/depression',
  publisher: 'NIMH',
  note: 'Supports understanding depression symptoms and treatment.',
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
  readFileSync('reports/enrichment-corpus/batches/batch-19-input.json', 'utf8'),
);

const contentBySlug = {
  'how-do-i-stop-bringing-work-stress-home-181288-023': draft({
    question: 'How do I stop bringing work stress home?',
    slug: 'how-do-i-stop-bringing-work-stress-home-181288-023',
    category: 'Work & Burnout',
    title: 'Leaving Work Stress at Work',
    meta: 'Stop carrying work stress home with transition rituals, physical boundaries, and addressing root causes—not just venting until bedtime.',
    summary:
      'When work tension follows you through the door, evenings and relationships pay the price. Separating work from home usually requires deliberate shutdown rituals, physical cues that signal "off duty," and sometimes fixing the workload or culture that keeps you activated.',
    takeaways: [
      'Transition rituals help your nervous system shift out of work mode.',
      'Physical separation—closing laptop, changing clothes—signals the day ended.',
      'Venting without resolution can keep stress circulating at home.',
      'Chronic spillover may mean the job itself needs boundary or role changes.',
    ],
    happening:
      'You may replay meetings, check email at dinner, or snap at family while still mentally at the office.\n\nRemote work can erase the commute that once buffered home from work stress.',
    help:
      'Create a shutdown ritual: list tomorrow\'s top tasks, close apps, say "work is done."\n\nUse a brief transition—walk, shower, music—before engaging at home.\n\nKeep work devices out of bedrooms and meals when possible.\n\nAddress recurring stressors at work: unrealistic deadlines, conflict, or role clarity.\n\nDecompress with movement or quiet time before heavy conversations at home.',
    support:
      `${SUPPORT}\n\nSeek therapy or career coaching if work stress drives burnout, insomnia, or relationship damage you cannot reverse alone.`,
    related: [
      'How do I set boundaries between work and personal life?',
      'How do I recover from burnout at work?',
      'How do I manage stress at work?',
      'How do I stop thinking about work on my days off?',
      'How do I manage stress when I cannot change my situation?',
    ],
    schemaAnswer:
      'Stop bringing work stress home with shutdown rituals, transition activities, physical separation from work devices, and addressing root work stressors—not endless after-hours venting.',
    themes: ['Work stress', 'Boundaries', 'Transition rituals', 'Burnout'],
    refs: [BURNOUT, NIMH],
    notes: 'No employer-specific legal advice; verify leave framing stays general.',
  }),
  'how-do-i-stop-caring-so-much-about-what-others-think-of-me-l2m3n4': draft({
    question: 'How do I stop caring so much about what others think of me?',
    slug: 'how-do-i-stop-caring-so-much-about-what-others-think-of-me-l2m3n4',
    category: 'Identity & Self-Worth',
    title: 'Caring Less About Others\' Opinions',
    meta: 'Reduce obsession with others\' opinions by building internal self-worth, remembering the spotlight effect, and practicing authentic small steps.',
    summary:
      'Worrying constantly about how you appear to others drains energy and blocks authenticity. Most people are focused on themselves—not scrutinizing your every move. Building self-worth from values and close relationships, not universal approval, loosens the grip of external judgment.',
    takeaways: [
      'The spotlight effect overestimates how much others notice you.',
      'Self-worth built internally reduces dependence on approval.',
      'Authenticity attracts better-fit relationships than performance does.',
      'Some disapproval is inevitable—and survivable.',
    ],
    happening:
      'You may edit yourself constantly, replay social moments, or avoid situations where judgment feels possible.\n\nEarly experiences of harsh criticism or conditional acceptance can wire approval-seeking as safety.',
    help:
      'Name whose opinions actually matter—usually a small inner circle, not everyone.\n\nPractice small authentic acts: sharing a real preference, wearing what you like.\n\nRemind yourself most people forget your awkward moments quickly.\n\nBuild identity through values, skills, and relationships—not performance scores.\n\nLimit feeds that trigger comparison and imagined audience judgment.',
    support:
      `${SUPPORT}\n\nSeek therapy if approval-seeking drives social avoidance, panic, or depression.`,
    related: [
      'How do I stop being a people pleaser?',
      'How do I build self-esteem?',
      'How do I stop feeling like everyone is judging me?',
      'How do I stop comparing my life to what I see on social media?',
      'How do I stop being so sensitive to criticism?',
    ],
    schemaAnswer:
      'Care less about others\' opinions by building internal self-worth, practicing authenticity in low-stakes settings, remembering the spotlight effect, and limiting comparison triggers.',
    themes: ['Self-worth', 'Approval seeking', 'Authenticity', 'Social anxiety'],
  }),
  'how-do-i-stop-catastrophizing-every-smal-190219-005': draft({
    question: 'How do I stop catastrophizing every small problem?',
    slug: 'how-do-i-stop-catastrophizing-every-smal-190219-005',
    category: 'Anxiety & Stress',
    title: 'Stopping Catastrophic Thinking',
    meta: 'Catastrophizing turns minor setbacks into imagined disasters—reality-check thoughts, grounding, and alternative explanations interrupt the spiral.',
    summary:
      'Catastrophizing jumps from a small problem to the worst possible outcome, flooding you with anxiety as if disaster were already happening. It often developed as a misguided attempt to prepare for harm. Learning to pause, ground, and generate alternative explanations reduces the spiral.',
    takeaways: [
      'Catastrophizing is a thinking pattern—not accurate prediction.',
      'Grounding brings attention back to the present moment.',
      'Alternative explanations usually exist for ambiguous situations.',
      'Most worries never materialize; the habit still costs energy.',
    ],
    happening:
      'A late reply becomes proof of rejection; a work mistake feels like certain termination.\n\nPast unpredictability or trauma can make worst-case planning feel necessary.',
    help:
      'Label catastrophizing when it starts—"I am jumping to worst case."\n\nAsk: What evidence supports this outcome? What else could explain it?\n\nUse 5-4-3-2-1 grounding: name things you see, hear, feel, smell, taste.\n\nPractice "so what"—if the worst happened, what would you actually do?\n\nLimit rumination time; schedule a brief worry window then redirect.',
    support:
      `${SUPPORT}\n\nSeek therapy if catastrophizing fuels panic attacks, insomnia, or inability to function.`,
    related: [
      'How do I manage anxiety without medication?',
      'How do I stop overthinking everything?',
      'How do I manage the anxiety of uncertainty?',
      'How do I challenge negative thought patterns?',
      'How do I cope with health anxiety?',
    ],
    schemaAnswer:
      'Stop catastrophizing by labeling the pattern, reality-checking evidence, using grounding techniques, generating alternative explanations, and limiting rumination time.',
    themes: ['Catastrophizing', 'Anxiety', 'Cognitive patterns', 'Grounding'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-stop-checking-my-phone-when-i-c-181083-047': draft({
    question: 'How do I stop checking my phone when I can\'t sleep?',
    slug: 'how-do-i-stop-checking-my-phone-when-i-c-181083-047',
    category: 'Anxiety & Stress',
    title: 'Phone Checking During Insomnia',
    meta: 'Phone use when you cannot sleep worsens insomnia—create physical distance, alternative wind-down activities, and tolerate restlessness without scrolling.',
    summary:
      'Reaching for your phone during sleepless nights feels soothing but often backfires. Blue light and stimulating content delay sleep further while anxiety feeds more checking. Physical distance, offline alternatives, and tolerating wakefulness without screens support better rest.',
    takeaways: [
      'Phone checking during insomnia usually prolongs wakefulness.',
      'Blue light and stimulating content interfere with sleep hormones.',
      'Physical distance from the phone removes the easiest trigger.',
      'Resting quietly without sleep still helps more than scrolling.',
    ],
    happening:
      'You may lie awake, feel restless, and reach for news or social feeds to fill the void.\n\nEach scroll can spike alertness and anxiety, making sleep harder when you try again.',
    help:
      'Charge the phone outside the bedroom; use a traditional alarm clock.\n\nIf the phone must stay nearby, enable airplane mode and night filters.\n\nPrepare offline options: paper book, gentle stretching, calming audio.\n\nPractice accepting wakefulness—resting in bed without sleep still restores somewhat.\n\nAddress daytime stress and caffeine that may drive middle-of-night waking.',
    support:
      `${SUPPORT}\n\nSeek medical or mental health evaluation if insomnia persists most nights or affects daily functioning.`,
    related: [
      'How do I improve my sleep when anxiety keeps me awake?',
      'How do I reduce anxiety before bed?',
      'How do I manage screen time at night?',
      'How do I stop ruminating at night?',
      'How do I cope with insomnia without relying on my phone?',
    ],
    schemaAnswer:
      'Stop phone checking during insomnia by keeping devices out of the bedroom, using offline wind-down activities, and tolerating wakefulness without stimulating screens.',
    themes: ['Insomnia', 'Phone habits', 'Sleep hygiene', 'Anxiety'],
    refs: [ANXIETY, NIMH],
    notes: 'No sleep medication advice; encourage clinical evaluation for chronic insomnia.',
  }),
  'how-do-i-stop-comparing-everyone-i-meet-181083-082': draft({
    question: 'How do I stop comparing everyone I meet to my ex?',
    slug: 'how-do-i-stop-comparing-everyone-i-meet-181083-082',
    category: 'Relationships & Divorce',
    title: 'Comparing New People to Your Ex',
    meta: 'Post-breakup comparison to an ex is common during healing—notice the pattern, grieve the relationship, and meet people on their own terms.',
    summary:
      'After a significant relationship, your brain may automatically measure new people against your ex—what you loved, what hurt, what you miss. This is normal early in healing. Comparison usually fades as you process the breakup and allow new connections to exist on their own merits.',
    takeaways: [
      'Comparison after breakup reflects unfinished processing—not failure to move on.',
      'Your ex becomes a reference point whether the relationship was good or bad.',
      'New people deserve to be known for who they are—not as ex replacements.',
      'Healing time and distance reduce automatic comparison.',
    ],
    happening:
      'You may notice traits, humor, or chemistry that remind you of your ex on every date.\n\nIdealizing or vilifying the ex can both distort how you evaluate new people.',
    help:
      'Name when comparison happens without judging yourself harshly.\n\nAllow grief for what the relationship was and what you hoped it would be.\n\nList what you want now—not just what your ex had or lacked.\n\nGive new people several interactions before deciding they fall short.\n\nLimit contact or social media stalking that keeps the ex mentally present.',
    support:
      `${SUPPORT}\n\nSeek therapy if comparison prevents dating for months, fuels obsession with your ex, or triggers depression.`,
    related: [
      'How do I start dating again after divorce?',
      'How do I get over a breakup when I still love them?',
      'How do I stop idealizing my ex?',
      'How do I know if I am ready to date again?',
      'How do I heal from a painful breakup?',
    ],
    schemaAnswer:
      'Stop comparing new people to your ex by naming the pattern, grieving the relationship, clarifying current values, and giving new connections time to stand on their own.',
    themes: ['Breakup recovery', 'Dating', 'Comparison', 'Grief'],
  }),
  'how-do-i-stop-comparing-my-life-to-what-189668-006': draft({
    question: 'How do I stop comparing my life to what I see on social media?',
    slug: 'how-do-i-stop-comparing-my-life-to-what-189668-006',
    category: 'Identity & Self-Worth',
    title: 'Life Comparison on Social Media',
    meta: 'Social media shows highlight reels—not full lives. Curate feeds, practice gratitude, and reconnect with your own values to reduce comparison pain.',
    summary:
      'Comparing your everyday reality to others\' curated posts creates a distorted benchmark. You see celebrations, travel, and milestones—not struggles, boredom, or debt. Intentional consumption, feed curation, and values-based goals reduce the inadequacy spiral.',
    takeaways: [
      'Social media is edited performance—not documentary reality.',
      'Comparison steals attention from your own goals and joys.',
      'Curating or limiting feeds is self-protection, not weakness.',
      'Gratitude and values clarify what actually matters to you.',
    ],
    happening:
      'Scrolling can trigger envy, FOMO, or shame about your job, body, or relationships.\n\nAlgorithms often surface content designed to provoke strong emotional reactions.',
    help:
      'Unfollow or mute accounts that consistently trigger inadequacy.\n\nFollow content aligned with learning, humor, or inspiration—not envy.\n\nSet time limits; notice mood before and after scrolling.\n\nPractice gratitude for small daily wins unrelated to posts.\n\nDefine success by your values—not by strangers\' timelines.',
    support:
      `${SUPPORT}\n\nSeek help if social comparison fuels depression, disordered eating, or suicidal thoughts.`,
    related: [
      'How do I stop comparing myself to others on social media?',
      'How do I reduce anxiety from social media?',
      'How do I manage the fear of missing out?',
      'How do I build self-esteem?',
      'How do I stop caring so much about what others think of me?',
    ],
    schemaAnswer:
      'Reduce social media life comparison by curating feeds, limiting scroll time, practicing gratitude, and defining success through personal values—not highlight reels.',
    themes: ['Social media', 'Comparison', 'Self-worth', 'FOMO'],
  }),
  'how-do-i-stop-comparing-my-relationship-177940-029': draft({
    question: 'How do I stop comparing my relationship to others on social media?',
    slug: 'how-do-i-stop-comparing-my-relationship-177940-029',
    category: 'Relationship Comparison',
    title: 'Relationship Comparison on Social Media',
    meta: 'Couple posts show staged highlights—not daily reality. Focus on your relationship\'s strengths and communicate needs instead of chasing Instagram romance.',
    summary:
      'Relationship posts showcase grand gestures and perfect photos—not arguments, dull Tuesdays, or mismatched libidos. Comparing your partnership to these images breeds dissatisfaction that may have little to do with your actual relationship quality.',
    takeaways: [
      'Public couple content is curated—not representative of daily life.',
      'Comparison can mask unmet needs worth discussing with your partner.',
      'Every relationship has unique strengths and friction points.',
      'Less scrolling often improves relationship satisfaction more than more gestures.',
    ],
    happening:
      'You may feel your relationship lacks romance, adventure, or visible passion.\n\nPosts can trigger insecurity about commitment, attractiveness, or effort.',
    help:
      'Limit couple-content accounts that trigger envy or criticism of your partner.\n\nDiscuss feelings with your partner using "I" language—not accusations.\n\nName what you appreciate in your relationship, not only what posts suggest you lack.\n\nTake social media breaks during vulnerable periods.\n\nInvest in offline connection: dates, conversations, shared projects.',
    support:
      `${SUPPORT}\n\nSeek couples therapy if comparison drives contempt, constant conflict, or thoughts of leaving without addressing real issues.`,
    related: [
      'How do I stop comparing my life to what I see on social media?',
      'How do I improve communication with my partner?',
      'How do I rebuild intimacy in a long-term relationship?',
      'How do I know if my relationship is healthy?',
      'How do I manage jealousy in my relationship?',
    ],
    schemaAnswer:
      'Stop comparing your relationship to social media by limiting triggering content, communicating needs with your partner, appreciating real strengths, and investing in offline connection.',
    themes: ['Relationship comparison', 'Social media', 'Intimacy', 'Communication'],
    flags: ['relationship_conflict'],
  }),
  'how-do-i-stop-comparing-myself-to-others-on-177941-011': draft({
    question: 'How do I stop comparing myself to others on social media?',
    slug: 'how-do-i-stop-comparing-myself-to-others-on-177941-011',
    category: 'Social Media',
    title: 'Self-Comparison on Social Media',
    meta: 'You are comparing your inner life to others\' outer presentation—curate feeds, take breaks, and anchor identity outside likes and posts.',
    summary:
      'Social comparison on feeds is unfair by design: your full self—including doubt and struggle—against someone else\'s selected best moments. Reducing harm means changing consumption habits and strengthening identity beyond online metrics.',
    takeaways: [
      'Highlight reels hide the ordinary and painful parts of life.',
      'Passive scrolling increases comparison more than active engagement.',
      'Identity anchored offline survives feed fluctuations.',
      'Breaks from social media often clarify what you actually want.',
    ],
    happening:
      'You may feel behind on career, fitness, travel, or happiness after short scroll sessions.\n\nLikes and follower counts can feel like report cards on your worth.',
    help:
      'Audit which accounts reliably worsen mood; unfollow without guilt.\n\nReplace some scroll time with hobbies, movement, or in-person connection.\n\nFollow accounts that teach, entertain, or reflect diverse real lives.\n\nUse app timers; remove social apps from home screen friction points.\n\nCelebrate your progress without posting—validation does not require an audience.',
    support:
      `${SUPPORT}\n\nSeek therapy if comparison drives body image distress, depression, or compulsive posting for validation.`,
    related: [
      'How do I stop comparing my life to what I see on social media?',
      'How do I reduce anxiety from social media?',
      'How do I build self-esteem?',
      'How do I manage screen time without feeling disconnected?',
      'How do I stop caring so much about what others think of me?',
    ],
    schemaAnswer:
      'Stop social media self-comparison by curating feeds, taking breaks, limiting passive scrolling, and building identity through offline values and relationships.',
    themes: ['Social media', 'Self-comparison', 'Digital wellness', 'Self-esteem'],
  }),
  'how-do-i-stop-feeling-guilty-about-my-past-mistakes-184730-053': draft({
    question: 'How do I stop feeling guilty about my past mistakes?',
    slug: 'how-do-i-stop-feeling-guilty-about-my-past-mistakes-184730-053',
    category: 'Identity & Self-Worth',
    title: 'Guilt About Past Mistakes',
    meta: 'Persistent guilt after learning and amends often becomes self-punishment—practice self-forgiveness and focus on who you are now.',
    summary:
      'Guilt can motivate repair when you have harmed someone. But guilt that lingers long after amends or lessons learned often reflects shame—not remorse. Self-forgiveness and present-moment integrity free energy for growth instead of endless self-punishment.',
    takeaways: [
      'Healthy guilt motivates repair; chronic guilt often becomes shame.',
      'Amends plus behavior change may be enough—endless punishment helps no one.',
      'Mistakes reflect being human—not permanent identity flaws.',
      'Present choices matter more than replaying the past.',
    ],
    happening:
      'You may ruminate on errors years later despite apologies or changed behavior.\n\nPerfectionism and harsh upbringing can make forgiveness feel undeserved.',
    help:
      'Distinguish guilt (I did something wrong) from shame (I am wrong).\n\nMake amends where still possible; accept limits when others will not reconcile.\n\nWrite what you learned and how you act differently now.\n\nPractice self-compassion—you would not condemn a friend this harshly.\n\nRedirect energy toward current values instead of mental replay loops.',
    support:
      `${SUPPORT}\n\nSeek therapy if guilt drives depression, self-harm urges, or inability to function in daily life.`,
    related: [
      'How do I forgive myself for past mistakes?',
      'How do I stop being so hard on myself?',
      'How do I practice self-compassion?',
      'How do I move on from shame?',
      'How do I stop ruminating about the past?',
    ],
    schemaAnswer:
      'Release guilt about past mistakes by making amends where possible, separating guilt from shame, practicing self-forgiveness, and investing in present integrity.',
    themes: ['Guilt', 'Self-forgiveness', 'Shame', 'Personal growth'],
  }),
  'how-do-i-stop-feeling-guilty-about-outgr-189668-014': draft({
    question: 'How do I stop feeling guilty about outgrowing old friendships?',
    slug: 'how-do-i-stop-feeling-guilty-about-outgr-189668-014',
    category: 'Relationships & Divorce',
    title: 'Guilt About Outgrowing Friendships',
    meta: 'Outgrowing friendships is normal growth—not betrayal. Honor shared history while allowing distance or evolution that fits who you are now.',
    summary:
      'People change. Interests, values, and life stages shift—and friendships that once felt central may fade. Guilt often reflects loyalty and fear of hurting others, but forcing connections out of obligation breeds resentment on both sides.',
    takeaways: [
      'Outgrowing friendships is common—not a moral failure.',
      'Guilt often reflects care, not proof you should stay close.',
      'Relationships can evolve to lighter contact without dramatic endings.',
      'New connections often need space old ones occupied.',
    ],
    happening:
      'You may dread texts from old friends or feel performative during visits.\n\nFear of being seen as selfish can keep you in draining dynamics.',
    help:
      'Name what changed: values, interests, geography, or emotional capacity.\n\nAllow gradual distance—shorter replies, less frequent plans—without ghosting cruelly.\n\nExpress appreciation for shared history if honest closure helps.\n\nRelease guilt by recognizing mutual growth sometimes diverges.\n\nInvest energy in friendships aligned with your current life.',
    support:
      `${SUPPORT}\n\nSeek therapy if guilt, people-pleasing, or fear of abandonment prevents any boundary-setting in relationships.`,
    related: [
      'How do I set boundaries with friends?',
      'How do I stop being a people pleaser?',
      'How do I make friends as an adult?',
      'How do I handle a friendship that feels one-sided?',
      'How do I cope with loneliness after losing friends?',
    ],
    schemaAnswer:
      'Reduce guilt about outgrowing friendships by honoring shared history, allowing gradual distance, releasing obligation-based closeness, and investing in current-aligned connections.',
    themes: ['Friendship transitions', 'Guilt', 'Personal growth', 'Boundaries'],
  }),
  'how-do-i-stop-feeling-guilty-about-setti-177940-013': draft({
    question: 'How do I stop feeling guilty about setting boundaries?',
    slug: 'how-do-i-stop-feeling-guilty-about-setti-177940-013',
    category: 'Relationships',
    title: 'Boundary Guilt in Relationships',
    meta: 'Boundary guilt is common but misplaced—limits protect relationships from resentment and protect you from burnout.',
    summary:
      'Many people equate love with unlimited availability. Guilt after saying no usually reflects old conditioning—not evidence you did wrong. Boundaries clarify what you can offer sustainably so relationships stay honest instead of resentful.',
    takeaways: [
      'Guilt after boundaries often signals upbringing—not moral failure.',
      'Resentment grows when limits are absent—boundaries prevent bigger ruptures.',
      'You can be caring and still say no.',
      'Consistency teaches others what to expect over time.',
    ],
    happening:
      'You may apologize excessively after declining requests or feel selfish for protecting rest.\n\nPartners or friends may push back when new limits disrupt old patterns.',
    help:
      'Reframe boundaries as relationship maintenance—not rejection.\n\nUse brief, warm nos without over-justifying.\n\nTolerate others\' disappointment without rushing to fix their feelings.\n\nStart with small limits to build tolerance for guilt waves.\n\nNotice when guilt is loudest with specific people—that reveals conditioning.',
    support:
      `${SUPPORT}\n\nSeek therapy if guilt, people-pleasing, or fear of conflict prevents basic self-protection or fuels burnout.`,
    related: [
      'How do I set boundaries without feeling guilty?',
      'How do I stop being a people pleaser?',
      'How do I set boundaries in romantic relationships?',
      'How do I communicate my needs in a relationship?',
      'How do I stop feeling guilty about setting boundaries?',
    ],
    schemaAnswer:
      'Reduce boundary guilt by reframing limits as relationship protection, using brief nos, tolerating disappointment, and practicing small consistent boundaries.',
    themes: ['Boundary guilt', 'Relationships', 'People-pleasing', 'Communication'],
  }),
  'how-do-i-stop-feeling-guilty-about-setting-boundaries-q8r9s1': draft({
    question: 'How do I stop feeling guilty about setting boundaries?',
    slug: 'how-do-i-stop-feeling-guilty-about-setting-boundaries-q8r9s1',
    category: 'Communication & Conflict',
    title: 'Overcoming Guilt When Setting Boundaries',
    meta: 'Boundary guilt fades with practice—remember limits protect wellbeing and make you more genuinely available to others.',
    summary:
      'Feeling guilty when setting boundaries is one of the most common obstacles to healthier dynamics. The guilt often stems from beliefs that good people accommodate everyone. In reality, boundaries create clarity that helps relationships function without silent resentment.',
    takeaways: [
      'Boundaries are gates with hinges—not walls against connection.',
      'Others\' reactions to your limits are not your responsibility to manage.',
      'Healthy people respect boundaries; pushback may signal imbalanced dynamics.',
      'Self-care enables sustainable generosity—not selfishness.',
    ],
    happening:
      'You may feel rude, mean, or disloyal when declining or limiting access.\n\nPeople accustomed to your over-giving may test new limits hard at first.',
    help:
      'Separate guilt feelings from moral truth—feelings are not commands.\n\nCommunicate limits with compassion and firmness; skip lengthy apologies.\n\nPrepare scripts for common requests you struggle to decline.\n\nCelebrate small wins when boundaries hold without catastrophe.\n\nReduce commitments that exist only to avoid disappointing someone.',
    support:
      `${SUPPORT}\n\nSeek therapy if guilt stems from trauma, abuse history, or severe anxiety about abandonment.`,
    related: [
      'How do I set boundaries without feeling guilty?',
      'How do I stop being a people pleaser?',
      'How do I set boundaries with family members?',
      'How do I stop being afraid of conflict in relationships?',
      'How do I set boundaries to reduce stress?',
    ],
    schemaAnswer:
      'Stop feeling guilty about boundaries by reframing limits as healthy clarity, using firm compassionate language, preparing scripts, and releasing responsibility for others\' reactions.',
    themes: ['Boundary guilt', 'Communication', 'Self-care', 'Conflict'],
    notes: 'Distinct from relationships-category boundary guilt slug; emphasize communication/conflict framing.',
  }),
  'how-do-i-stop-feeling-jealous-of-people-181083-073': draft({
    question: 'How do I stop feeling jealous of people who seem to have lots of friends?',
    slug: 'how-do-i-stop-feeling-jealous-of-people-181083-073',
    category: 'Identity & Self-Worth',
    title: 'Jealousy of Others\' Friend Groups',
    meta: 'Friend jealousy often reflects loneliness and incomplete information—focus on building the connections you want rather than comparing headcounts.',
    summary:
      'Seeing large friend groups can sting when you feel lonely—but headcount rarely equals depth. Many popular-looking people have acquaintances, not confidants. Redirecting energy toward quality connection beats measuring yourself against incomplete social snapshots.',
    takeaways: [
      'Visible friend groups may hide loneliness or superficial ties.',
      'Quality connections matter more than quantity for most people.',
      'Jealousy often signals unmet belonging needs—not character flaws.',
      'Building friendships takes intentional effort at any age.',
    ],
    happening:
      'Social posts and group photos can amplify fear that everyone else belongs except you.\n\nIntroversion or life transitions may have shrunk your circle temporarily.',
    help:
      'Remind yourself you see highlights—not full social reality.\n\nIdentify what you want: deeper ties, more casual fun, or community belonging.\n\nTake small steps: classes, volunteering, reconnecting with one old friend.\n\nLimit content that triggers envy; curate toward inspiration not comparison.\n\nPractice self-compassion—loneliness is painful, not shameful.',
    support:
      `${SUPPORT}\n\nSeek therapy if jealousy fuels depression, social withdrawal, or persistent self-hatred.`,
    related: [
      'How do I make friends as an adult?',
      'How do I cope with loneliness?',
      'How do I stop comparing my life to social media?',
      'How do I build self-esteem?',
      'How do I overcome social anxiety when meeting new people?',
    ],
    schemaAnswer:
      'Reduce friend jealousy by focusing on quality over quantity, taking small connection steps, limiting comparison triggers, and addressing loneliness with self-compassion.',
    themes: ['Friend jealousy', 'Loneliness', 'Social comparison', 'Belonging'],
  }),
  'how-do-i-stop-feeling-like-everyone-else-has-177941-031': draft({
    question: 'How do I stop feeling like everyone else has it figured out?',
    slug: 'how-do-i-stop-feeling-like-everyone-else-has-177941-031',
    category: 'Life Comparison',
    title: 'When Everyone Else Seems to Have It Figured Out',
    meta: 'The "figured out" illusion comes from comparing your inner confusion to others\' outer confidence—everyone is still learning.',
    summary:
      'Feeling like you alone are lost while others navigate life effortlessly is a painful illusion. You see others\' polished presentations—not their doubts at 2 a.m. Most adults are improvising, revising, and learning as they go.',
    takeaways: [
      'Confidence often masks uncertainty—everyone improvises.',
      'Social media and small talk hide struggle and confusion.',
      'Asking trusted people about their doubts often reveals shared experience.',
      'Progress is personal—not a universal timeline.',
    ],
    happening:
      'Career, relationships, and adult responsibilities may feel like tests you are failing secretly.\n\nComparison to peers who seem ahead can shrink your sense of competence.',
    help:
      'Talk honestly with friends or mentors about doubts—they usually relate.\n\nLimit highlight-reel consumption that distorts normal struggle.\n\nTrack your own growth over years, not days.\n\nSeparate "I do not know yet" from "I am failing."\n\nSeek communities where learning and mistakes are normalized.',
    support:
      `${SUPPORT}\n\nSeek therapy if inadequacy feelings drive depression, paralysis, or suicidal thoughts.`,
    related: [
      'How do I stop feeling like I am behind everyone professionally?',
      'How do I overcome imposter syndrome?',
      'How do I build self-esteem?',
      'How do I stop comparing my life to social media?',
      'How do I find purpose when life feels meaningless?',
    ],
    schemaAnswer:
      'Stop feeling everyone else has it figured out by recognizing the illusion, sharing doubts with trusted people, limiting comparison triggers, and tracking personal progress—not others\' timelines.',
    themes: ['Life comparison', 'Imposter feelings', 'Adulting', 'Self-doubt'],
  }),
  'how-do-i-stop-feeling-like-everyone-is-judgi-177941-015': draft({
    question: 'How do I stop feeling like everyone is judging me?',
    slug: 'how-do-i-stop-feeling-like-everyone-is-judgi-177941-015',
    category: 'Social Anxiety',
    title: 'Feeling Constantly Judged by Others',
    meta: 'Fear of judgment often reflects social anxiety and the spotlight effect—most people are focused on themselves, not scrutinizing you.',
    summary:
      'Feeling watched and judged in ordinary situations is exhausting. The spotlight effect makes us overestimate how much attention others pay to our appearance and behavior. Often the harshest critic is internal—and projects outward as fear of others\' disapproval.',
    takeaways: [
      'The spotlight effect overestimates how much others notice you.',
      'Social anxiety and past criticism can wire hypervigilance to judgment.',
      'Most people are preoccupied with their own concerns—not yours.',
      'Self-compassion reduces both inner and projected criticism.',
    ],
    happening:
      'Grocery stores, meetings, or social events may feel like performance reviews.\n\nPast bullying or harsh environments can make neutral faces feel hostile.',
    help:
      'Challenge thoughts: What evidence shows people are judging right now?\n\nPractice exposure in low-stakes settings to build tolerance.\n\nReduce self-criticism—harsh inner voices often assume others think the same.\n\nFocus outward with curiosity about others instead of monitoring yourself.\n\nLimit rumination after social events; most observers have moved on.',
    support:
      `${SUPPORT}\n\nSeek therapy for social anxiety if judgment fears cause avoidance, panic, or isolation.`,
    related: [
      'How do I manage social anxiety?',
      'How do I stop caring so much about what others think of me?',
      'How do I overcome fear of public speaking?',
      'How do I build confidence in social situations?',
      'How do I stop being so sensitive to criticism?',
    ],
    schemaAnswer:
      'Reduce feeling judged by challenging spotlight-effect thoughts, practicing gradual exposure, softening self-criticism, and focusing outward with curiosity in social settings.',
    themes: ['Social anxiety', 'Spotlight effect', 'Self-consciousness', 'Judgment fear'],
    refs: [ANXIETY, NIMH],
  }),
  'how-do-i-stop-feeling-like-everyone-will-181083-092': draft({
    question: 'How do I stop feeling like everyone will eventually leave me?',
    slug: 'how-do-i-stop-feeling-like-everyone-will-181083-092',
    category: 'Trauma & Grief',
    title: 'Fear That Everyone Will Leave',
    meta: 'Abandonment fear often stems from early loss or inconsistency—build secure connections and challenge catastrophic predictions with evidence.',
    summary:
      'Expecting everyone to leave can develop after abandonment, inconsistent caregiving, or significant losses. Your nervous system learned that closeness ends in pain. Healing involves tolerating uncertainty, gathering evidence of reliable people, and therapy when fear drives sabotaging behaviors.',
    takeaways: [
      'Abandonment fear often reflects past experience—not present reality.',
      'Not everyone leaves—some people stay through difficulty.',
      'Testing or clinging can push people away, confirming the fear.',
      'Attachment-focused therapy helps rewire deep patterns.',
    ],
    happening:
      'You may preemptively withdraw, pick fights, or monitor partners and friends for signs of departure.\n\nMinor delays in replies can feel like proof the end is coming.',
    help:
      'Name the fear without acting on every urge to test or flee.\n\nTrack evidence of people who have stayed—not only those who left.\n\nCommunicate needs directly instead of assuming impending abandonment.\n\nPractice tolerating uncertainty in small doses.\n\nBuild self-soothing skills for when anxiety spikes.',
    support:
      `${SUPPORT}\n\nSeek attachment-focused or trauma-informed therapy if abandonment fear drives relationship destruction or severe distress.`,
    related: [
      'How do I manage attachment anxiety in relationships?',
      'How do I stop being so clingy in relationships?',
      'How do I heal from childhood emotional neglect?',
      'How do I rebuild trust after loss?',
      'How do I cope with fear of rejection?',
    ],
    schemaAnswer:
      'Reduce fear that everyone will leave by naming abandonment patterns, gathering evidence of reliable relationships, communicating needs, and seeking attachment-focused therapy when needed.',
    themes: ['Abandonment fear', 'Attachment', 'Trauma', 'Relationships'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'how-do-i-stop-feeling-like-i-need-everyone-t-177941-035': draft({
    question: 'How do I stop feeling like I need everyone to like me?',
    slug: 'how-do-i-stop-feeling-like-i-need-everyone-t-177941-035',
    category: 'People Pleasing',
    title: 'Needing Everyone to Like You',
    meta: 'Universal approval is impossible—build authentic connections with people who appreciate your real self instead of performing for the crowd.',
    summary:
      'Needing everyone to like you drives exhausting self-monitoring and people-pleasing. It often developed when love felt conditional on being agreeable. Authentic relationships require tolerating that some people will not connect with you—and that is normal.',
    takeaways: [
      'Universal likability is impossible and unnecessary.',
      'Performing likability hides the real you from genuine connection.',
      'Disapproval from some people does not mean you are unlovable.',
      'Values-based living attracts better-fit relationships.',
    ],
    happening:
      'You may agree, laugh, or hide opinions to avoid any friction.\n\nOne cold interaction can ruin your day while ten warm ones barely register.',
    help:
      'Identify core values and let them guide behavior more than imagined audience reactions.\n\nPractice expressing mild disagreement in safe settings.\n\nNotice when you perform happiness or interest—experiment with honesty.\n\nAccept that some people will not like you; focus on mutual respect instead.\n\nReduce energy spent on acquaintances who drain you.',
    support:
      `${SUPPORT}\n\nSeek therapy if approval-seeking stems from trauma, abuse, or severe social anxiety.`,
    related: [
      'How do I stop being a people pleaser?',
      'How do I stop caring so much about what others think of me?',
      'How do I set boundaries without feeling guilty?',
      'How do I build self-esteem?',
      'How do I stop being afraid of conflict in relationships?',
    ],
    schemaAnswer:
      'Stop needing everyone to like you by living from values, practicing authentic expression, accepting normal disapproval, and investing in reciprocal relationships.',
    themes: ['People-pleasing', 'Approval seeking', 'Authenticity', 'Self-worth'],
  }),
  'how-do-i-stop-feeling-like-i-need-to-ear-189668-010': draft({
    question: 'How do I stop feeling like I need to earn love through achievement?',
    slug: 'how-do-i-stop-feeling-like-i-need-to-ear-189668-010',
    category: 'Identity & Self-Worth',
    title: 'Earning Love Through Achievement',
    meta: 'Love tied to achievement is exhausting—your worth is inherent, not a scoreboard of accomplishments.',
    summary:
      'When affection felt conditional on grades, behavior, or success, you may learn that love must be earned through performance. This creates relentless striving and relationships that feel transactional. Separating worth from output is slow work—but rest and connection without proving are possible.',
    takeaways: [
      'Conditional love in childhood often drives achievement-based self-worth.',
      'Rest without earning feels dangerous but is necessary for health.',
      'People who love you want your wellbeing—not constant proving.',
      'Therapy helps untangle worth from productivity.',
    ],
    happening:
      'You may panic when not accomplishing something or feel empty between achievements.\n\nCompliments about who you are—not what you do—may feel unfamiliar or undeserved.',
    help:
      'Notice when you perform for approval versus express authentic self.\n\nPractice receiving care without immediately reciprocating through achievement.\n\nSchedule rest and play with the same seriousness as work goals.\n\nAsk trusted people if they love you for being—not only doing.\n\nChallenge beliefs that idle time makes you unworthy of love.',
    support:
      `${SUPPORT}\n\nSeek therapy if achievement addiction drives burnout, depression, or eating disorders.`,
    related: [
      'How do I separate my self-worth from my job title?',
      'How do I stop feeling like I need to prove myself constantly?',
      'How do I overcome perfectionism?',
      'How do I practice self-compassion?',
      'How do I recover from burnout at work?',
    ],
    schemaAnswer:
      'Stop earning love through achievement by recognizing conditional-love patterns, practicing rest without proving, receiving care openly, and separating inherent worth from productivity.',
    themes: ['Conditional love', 'Achievement', 'Self-worth', 'Perfectionism'],
  }),
  'how-do-i-stop-feeling-like-i-need-to-earn-184730-095': draft({
    question: 'How do I stop feeling like I need to earn my place everywhere?',
    slug: 'how-do-i-stop-feeling-like-i-need-to-earn-184730-095',
    category: 'Identity & Self-Worth',
    title: 'Earning Your Place Everywhere',
    meta: 'Belonging is not something you prove constantly—healthy groups offer acceptance beyond performance and usefulness.',
    summary:
      'Feeling you must earn your seat at every table—work, family, friendships—often comes from environments where belonging felt precarious. Constant proving exhausts you and prevents relaxing into connection. You belong as a person, not only as a performer or helper.',
    takeaways: [
      'Precarious belonging in childhood drives constant proving.',
      'Healthy communities include people without endless performance.',
      'Over-giving to earn place breeds resentment and burnout.',
      'Rest and receiving are part of belonging—not threats to it.',
    ],
    happening:
      'You may overwork, overhelp, or avoid conflict to keep your spot secure.\n\nMinor criticism can feel like proof you will be cast out.',
    help:
      'Identify where you perform for belonging versus show up authentically.\n\nExperiment with showing up without extra proving in one safe relationship.\n\nNotice groups where you feel accepted at rest—not only when useful.\n\nSet limits on over-giving that masks fear of rejection.\n\nSeparate feedback on behavior from threat to belonging.',
    support:
      `${SUPPORT}\n\nSeek therapy if earning-place anxiety drives chronic overwork, people-pleasing, or depression.`,
    related: [
      'How do I stop feeling like I need to prove myself constantly?',
      'How do I stop being a people pleaser?',
      'How do I build self-esteem?',
      'How do I set boundaries without feeling guilty?',
      'How do I cope with imposter syndrome at work?',
    ],
    schemaAnswer:
      'Stop earning your place everywhere by recognizing precarious-belonging patterns, showing up authentically in safe relationships, limiting over-giving, and accepting rest as part of connection.',
    themes: ['Belonging', 'Self-worth', 'People-pleasing', 'Performance anxiety'],
    notes: 'Distinct from achievement-for-love slug; emphasize belonging/place framing.',
  }),
  'how-do-i-stop-feeling-like-i-need-to-fix-189668-018': draft({
    question: 'How do I stop feeling like I need to fix everyone\'s problems?',
    slug: 'how-do-i-stop-feeling-like-i-need-to-fix-189668-018',
    category: 'Communication & Conflict',
    title: 'Urge to Fix Everyone\'s Problems',
    meta: 'Fixing others often reflects anxiety or codependency—support without taking ownership of outcomes they must handle themselves.',
    summary:
      'Jumping in to solve others\' problems can feel caring but often reflects discomfort with their struggle, a need to feel useful, or codependent patterns. Real support listens and respects autonomy—fixing denies others the growth that comes from handling their own challenges.',
    takeaways: [
      'Fixing and helping are different—help asks what support looks like.',
      'You cannot control others\' outcomes no matter how much you intervene.',
      'Constant fixing breeds dependency and your own resentment.',
      'Tolerating others\' discomfort is a skill worth building.',
    ],
    happening:
      'You may offer unsolicited advice, take over tasks, or feel anxious when loved ones struggle.\n\nChildhood roles as family mediator or caretaker can wire fixing as identity.',
    help:
      'Ask "Do you want advice or just someone to listen?" before solving.\n\nPause when fix-it urges rise; breathe through discomfort.\n\nDistinguish emergencies requiring action from growth opportunities for others.\n\nRedirect energy toward your own goals and healing.\n\nCelebrate others\' problem-solving instead of rushing to rescue.',
    support:
      `${SUPPORT}\n\nSeek therapy if fixing compulsions stem from codependency, trauma, or inability to tolerate others\' distress.`,
    related: [
      'How do I stop feeling like I need to fix everyone around me?',
      'How do I set boundaries with family members?',
      'How do I support someone without enabling them?',
      'How do I stop being a people pleaser?',
      'How do I manage codependency in relationships?',
    ],
    schemaAnswer:
      'Stop fixing everyone\'s problems by asking what support they want, tolerating their discomfort, distinguishing emergencies from growth, and redirecting energy to your own life.',
    themes: ['Codependency', 'Fixing', 'Support vs rescue', 'Boundaries'],
  }),
  'how-do-i-stop-feeling-like-i-need-to-fix-everyone-184730-075': draft({
    question: 'How do I stop feeling like I need to fix everyone around me?',
    slug: 'how-do-i-stop-feeling-like-i-need-to-fix-everyone-184730-075',
    category: 'Communication & Conflict',
    title: 'Needing to Fix Everyone Around You',
    meta: 'The fixer role often starts in childhood—learn empathy without absorbing responsibility for others\' choices and emotions.',
    summary:
      'Feeling responsible for fixing everyone around you often begins when you learned that your value came from managing others\' emotions or crises. This caretaker role feels noble but leads to burnout and prevents others from developing their own resilience.',
    takeaways: [
      'The fixer role often developed as childhood survival strategy.',
      'Empathy does not require taking ownership of others\' problems.',
      'Fixing can block others from learning to cope independently.',
      'Your healing matters as much as others\' struggles.',
    ],
    happening:
      'You may feel restless or guilty when people you care about are upset and you are not fixing it.\n\nRelationships may revolve around your advice-giving and their crises.',
    help:
      'Notice fixer impulses as they arise; pause before intervening.\n\nPractice saying "That sounds hard" instead of immediate solutions.\n\nSet time limits on support conversations to prevent emotional absorption.\n\nInvest in your own therapy or hobbies instead of only others\' problems.\n\nAccept that some people may repeat patterns you cannot change.',
    support:
      `${SUPPORT}\n\nSeek therapy if fixing compulsions drive burnout, resentment, or neglect of your own needs and safety.`,
    related: [
      'How do I stop feeling like I need to fix everyone\'s problems?',
      'How do I set boundaries with family members?',
      'How do I recover from caregiver burnout?',
      'How do I manage codependency?',
      'How do I stop being a people pleaser?',
    ],
    schemaAnswer:
      'Stop needing to fix everyone by pausing fixer impulses, offering empathy without solutions, setting support limits, and prioritizing your own healing and boundaries.',
    themes: ['Fixer role', 'Codependency', 'Caretaking', 'Burnout'],
    notes: 'Distinct from general fix-everyone slug; emphasize fixer identity and caretaker burnout.',
  }),
  'how-do-i-stop-feeling-like-i-need-to-prove-myself-q2r5s9': draft({
    question: 'How do I stop feeling like I need to prove myself constantly?',
    slug: 'how-do-i-stop-feeling-like-i-need-to-prove-myself-q2r5s9',
    category: 'Identity & Self-Worth',
    title: 'Constantly Needing to Prove Yourself',
    meta: 'Nonstop proving often masks fear of rejection—your worth exists before the next achievement or applause.',
    summary:
      'Constant proving—overworking, over-explaining, perfectionism—often protects against fear of being seen as inadequate. When worth feels conditional, rest triggers anxiety. Building confidence in inherent value loosens the grip of endless demonstration.',
    takeaways: [
      'Constant proving often protects against fear of rejection.',
      'Imposter feelings drive over-preparation and overwork.',
      'Rest and "good enough" threaten the proving cycle—but are necessary.',
      'Therapy helps address roots in conditional acceptance.',
    ],
    happening:
      'You may feel empty between accomplishments or panic when not visibly productive.\n\nNew roles or relationships can spike proving until you feel secure.',
    help:
      'Notice proving behaviors: over-preparing, name-dropping, excessive detail in emails.\n\nPractice delivering "good enough" work in low-stakes tasks.\n\nAllow silence after contributions without filling space to impress.\n\nCelebrate being, not only doing—in relationships and alone time.\n\nTrack whether proving actually increases acceptance—or mainly exhaustion.',
    support:
      `${SUPPORT}\n\nSeek therapy if proving drives burnout, anxiety disorders, or suicidal thoughts during setbacks.`,
    related: [
      'How do I overcome imposter syndrome?',
      'How do I stop feeling like I need to earn love through achievement?',
      'How do I separate my self-worth from my job title?',
      'How do I stop being so hard on myself?',
      'How do I recover from burnout at work?',
    ],
    schemaAnswer:
      'Stop constantly proving yourself by noticing proving behaviors, practicing good-enough output, tolerating rest, and building worth independent of performance.',
    themes: ['Proving', 'Imposter syndrome', 'Self-worth', 'Perfectionism'],
  }),
  'how-do-i-stop-feeling-like-im-a-burden-to-184730-049': draft({
    question: 'How do I stop feeling like I\'m a burden to others?',
    slug: 'how-do-i-stop-feeling-like-im-a-burden-to-184730-049',
    category: 'Identity & Self-Worth',
    title: 'Feeling Like a Burden to Others',
    meta: 'Burden beliefs often reflect low self-worth—not reality. Healthy relationships include mutual support and needing help sometimes.',
    summary:
      'Feeling like a burden makes you hide struggles, refuse help, and apologize for existing. This often develops when needs were treated as inconvenient growing up, or when depression distorts how you interpret others\' responses. Interdependence is human—not proof you are too much.',
    takeaways: [
      'Burden feelings often stem from old messages—not current facts.',
      'Depression can filter interactions toward confirming unworthiness.',
      'Healthy relationships include giving and receiving support.',
      'Asking for help is not the same as being too much.',
    ],
    happening:
      'You may minimize problems, isolate during hard times, or over-apologize for basic needs.\n\nPast rejection of your emotions can make every request feel dangerous.',
    help:
      'Challenge thoughts: Would I call a friend a burden for this need?\n\nPractice small asks and notice actual responses—not feared ones.\n\nAllow people who care about you to choose whether to help.\n\nSeparate depression\'s voice from evidence-based conclusions.\n\nBuild reciprocal relationships where support flows both directions.',
    support:
      `${SUPPORT}\n\nSeek therapy if burden beliefs drive isolation, depression, or suicidal ideation; call 988 if you feel unsafe.`,
    related: [
      'How do I ask for help when I struggle to reach out?',
      'How do I cope with depression?',
      'How do I build self-esteem?',
      'How do I stop isolating when I feel low?',
      'How do I practice self-compassion?',
    ],
    schemaAnswer:
      'Stop feeling like a burden by challenging distorted beliefs, practicing small help requests, accepting mutual support as normal, and seeking treatment for depression when needed.',
    themes: ['Burden beliefs', 'Self-worth', 'Depression', 'Help-seeking'],
    refs: [DEPRESSION, NIMH],
    flags: ['self_harm_risk'],
    notes: 'Include crisis language for severe isolation; verify tone is validating not dismissive.',
  }),
  'how-do-i-stop-feeling-like-im-a-disappointment-to-184730-079': draft({
    question: 'How do I stop feeling like I\'m a disappointment to myself?',
    slug: 'how-do-i-stop-feeling-like-im-a-disappointment-to-184730-079',
    category: 'Identity & Self-Worth',
    title: 'Disappointment in Yourself',
    meta: 'Self-disappointment often comes from unrealistic standards—adjust expectations and practice self-compassion while honoring real growth.',
    summary:
      'Feeling disappointed in yourself hurts deeply—especially when you compare your life to an idealized version of who you "should" be by now. Perfectionism and harsh inner voices turn normal setbacks into verdicts on your character. Self-compassion and revised standards make room for being human.',
    takeaways: [
      'Self-disappointment often reflects unrealistic or inherited standards.',
      'Comparing current self to an ideal ignores real progress made.',
      'Mistakes are events—not definitions of your whole identity.',
      'Self-compassion supports change better than self-attack.',
    ],
    happening:
      'Missed goals, relationship struggles, or career plateaus may feel like personal failure.\n\nDepression can intensify the gap between who you are and who you think you should be.',
    help:
      'Write evidence of growth over the past year—not only gaps.\n\nAsk whether standards would be fair applied to a friend.\n\nSeparate identity from outcomes: struggling does not mean worthless.\n\nAdjust timelines and goals to match reality and values.\n\nPair accountability with kindness—not cruelty—as motivation.',
    support:
      `${SUPPORT}\n\nSeek therapy if self-disappointment fuels depression, self-harm, or chronic inability to function.`,
    related: [
      'How do I stop being so hard on myself?',
      'How do I practice self-compassion?',
      'How do I overcome perfectionism?',
      'How do I cope with feeling like a failure?',
      'How do I rebuild confidence after a major setback?',
    ],
    schemaAnswer:
      'Reduce self-disappointment by revising unrealistic standards, tracking genuine progress, separating mistakes from identity, and practicing self-compassion instead of self-attack.',
    themes: ['Self-disappointment', 'Perfectionism', 'Self-compassion', 'Inner critic'],
    refs: [DEPRESSION, NIMH],
  }),
  'how-do-i-stop-feeling-like-im-behind-everyone-184730-071': draft({
    question: 'How do I stop feeling like I\'m behind everyone else professionally?',
    slug: 'how-do-i-stop-feeling-like-im-behind-everyone-184730-071',
    category: 'Work & Burnout',
    title: 'Feeling Behind Professionally',
    meta: 'Career timelines vary wildly—social media highlights distort progress; focus on your path, skills, and values instead of others\' milestones.',
    summary:
      'Professional comparison thrives on LinkedIn promotions and peer milestones you see without context. Economic shifts, caregiving, health, and late-start paths make universal timelines fiction. Your career is a long arc—not a race measured against curated posts.',
    takeaways: [
      'There is no single correct career timeline.',
      'Social and professional feeds show highlights—not setbacks or pivots.',
      'Many successful paths include detours, gaps, and reinvention.',
      'Skill-building and values alignment matter more than speed.',
    ],
    happening:
      'Peers\' titles and salaries can trigger shame about your own pace.\n\nFamily or cultural expectations may add pressure beyond social comparison.',
    help:
      'Limit career-comparison scrolling when vulnerability is high.\n\nDocument skills gained and problems solved—not only titles earned.\n\nDefine success by your values: stability, impact, flexibility, creativity.\n\nSeek mentors with non-linear paths to normalize detours.\n\nInvest in one concrete growth step rather than panicking about the whole ladder.',
    support:
      `${SUPPORT}\n\nSeek career counseling or therapy if professional comparison drives burnout, depression, or hopelessness about your future.`,
    related: [
      'How do I overcome imposter syndrome at work?',
      'How do I separate my self-worth from my job title?',
      'How do I stop comparing my life to social media?',
      'How do I change careers when I feel stuck?',
      'How do I recover from burnout at work?',
    ],
    schemaAnswer:
      'Stop feeling professionally behind by limiting comparison triggers, defining success through personal values, tracking skill growth, and accepting non-linear career paths as normal.',
    themes: ['Career comparison', 'Imposter syndrome', 'Work stress', 'Timeline anxiety'],
    refs: [BURNOUT, NIMH],
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
  'reports/enrichment-corpus/draft-answers/batch-22-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-22-drafts.json`);
