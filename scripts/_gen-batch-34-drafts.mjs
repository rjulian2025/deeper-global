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
  readFileSync('reports/enrichment-corpus/batches/batch-31-input.json', 'utf8'),
);

const contentBySlug = {
  'why-do-i-feel-like-i-need-everyone-to-like-184730-019': draft({
    question: 'Why do I feel like I need everyone to like me?',
    slug: 'why-do-i-feel-like-i-need-everyone-to-like-184730-019',
    category: 'Identity & Self-Worth',
    title: 'Need Everyone to Like Me',
    meta: 'The need for universal approval often stems from fear of rejection and low self-worth—authentic connections matter more than pleasing everyone.',
    summary:
      'Needing everyone to like you often reflects deep fears of rejection, abandonment, or not being good enough—especially if love felt conditional on being pleasing or perfect. Universal approval is impossible and exhausting; the goal is genuine connection with people who appreciate your authentic self.',
    takeaways: [
      'Universal approval is impossible and not a realistic relationship goal.',
      'People-pleasing creates a performed self that blocks real intimacy.',
      'Conflict and disapproval feel dangerous when you learned they threatened belonging.',
      'Authenticity attracts the right people even if it repels some others.',
    ],
    happening:
      'You may monitor others\' reactions constantly and adjust your behavior to avoid disapproval.\n\nSaying yes when you mean no or suppressing opinions may feel safer than risking rejection.',
    help:
      'Practice small acts of authenticity—express a preference, say no to a low-stakes request.\n\nNotice that most reasonable people respect honesty more than constant agreeability.\n\nSeparate being liked from being respected; they are not the same.\n\nExamine childhood messages about when love felt conditional on compliance.\n\nReduce social media comparison that fuels approval-seeking.\n\nBuild self-worth through values and actions you choose, not others\' reactions.',
    support:
      `${SUPPORT}\n\nSeek therapy if approval-seeking drives chronic anxiety, identity loss, or one-sided relationships.`,
    related: [
      'Why do I feel like I need constant validation from others?',
      'How do I stop people-pleasing?',
      'How do I build self-confidence?',
      'Why do I feel like I have to earn love and affection?',
      'How do I set boundaries without guilt?',
    ],
    schemaAnswer:
      'Needing everyone to like you often stems from fear of rejection and conditional love—focus on authentic connections over universal approval.',
    themes: ['People-pleasing', 'Self-worth', 'Rejection fear', 'Authenticity'],
  }),
  'why-do-i-feel-like-i-need-to-constantly-prove-y2z6a1': draft({
    question: 'Why do I feel like I need to constantly prove my spiritual authenticity?',
    slug: 'why-do-i-feel-like-i-need-to-constantly-prove-y2z6a1',
    category: 'Identity & Self-Worth',
    title: 'Proving Spiritual Authenticity',
    meta: 'Pressure to prove spiritual authenticity often stems from insecurity or community comparison—genuine spirituality is personal and does not require external validation.',
    summary:
      'Feeling compelled to prove your spiritual authenticity often reflects insecurity about your path, pressure from spiritual communities, or comparison with others who seem more advanced. When practice becomes performance, it can block genuine growth and connection.',
    takeaways: [
      'Seeking external validation for internal experiences creates performance anxiety.',
      'Spiritual communities sometimes impose practices that may not fit your path.',
      'Comparing your inner life to others\' public presentations is misleading.',
      'Authentic spirituality develops through personal meaning, not visible credentials.',
    ],
    happening:
      'You may feel you must meditate longer, use specific language, or display certain experiences to be accepted.\n\nImposter feelings about your spiritual life may intensify around teachers or communities.',
    help:
      'Return focus to what practices genuinely nourish you, not what impresses others.\n\nLimit comparison on social media and in spiritual circles.\n\nName community pressure without abandoning communities that otherwise support you.\n\nAllow private, imperfect practice without public proof.\n\nExplore whether perfectionism about spirituality mirrors other life areas.\n\nSeek mentors who emphasize process over performance.',
    support:
      `${SUPPORT}\n\nSeek therapy if spiritual performance anxiety drives shame, isolation, or identity distress.`,
    related: [
      'Why do I feel like I do not fit into any spiritual community?',
      'How do I build a sense of identity?',
      'How do I stop comparing myself to others?',
      'How do I overcome imposter syndrome?',
      'How do I practice self-compassion?',
    ],
    schemaAnswer:
      'Pressure to prove spiritual authenticity often reflects insecurity and comparison—genuine spirituality is personal and does not require constant external validation.',
    themes: ['Spirituality', 'Imposter syndrome', 'Comparison', 'Identity'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-like-i-need-to-earn-love-and-184730-064': draft({
    question: 'Why do I feel like I need to earn love and acceptance?',
    slug: 'why-do-i-feel-like-i-need-to-earn-love-and-184730-064',
    category: 'Identity & Self-Worth',
    title: 'Need to Earn Love',
    meta: 'Conditional love experiences teach that acceptance must be earned—healthy love is given freely based on your inherent worth.',
    summary:
      'Feeling you must earn love and acceptance typically stems from early experiences where affection felt conditional on behavior, achievement, or meeting others\' needs. Perfectionism and people-pleasing often develop as strategies to secure love—but healthy relationships offer care based on who you are, not what you do.',
    takeaways: [
      'Conditional affection in childhood teaches that love must be worked for.',
      'Perfectionism and overgiving are common strategies to avoid abandonment.',
      'Healthy love includes mutual effort but not constant proof of worthiness.',
      'You deserve basic care and acceptance without performing for it.',
    ],
    happening:
      'You may overgive, avoid conflict, or suppress needs to maintain others\' approval.\n\nMistakes or boundaries may trigger fear that love will be withdrawn.',
    help:
      'Notice when you are performing versus connecting authentically.\n\nPractice receiving care without immediately reciprocating or apologizing.\n\nExamine which relationships make love feel conditional versus freely given.\n\nBuild self-compassion that does not depend on others\' moods.\n\nSet small boundaries and observe whether secure relationships survive them.\n\nExplore attachment patterns with a therapist to rebuild internal safety.',
    support:
      `${SUPPORT}\n\nSeek therapy if fear of losing love drives chronic anxiety, abusive dynamics, or inability to express needs.`,
    related: [
      'Why do I feel like I have to earn love and affection?',
      'Why do I feel like I need constant validation from others?',
      'How do I stop people-pleasing?',
      'How do I build self-esteem?',
      'How do I recognize unhealthy relationship patterns?',
    ],
    schemaAnswer:
      'Needing to earn love often reflects conditional affection in childhood—healthy love is given freely based on inherent worth, not constant performance.',
    themes: ['Conditional love', 'Attachment', 'Self-worth', 'People-pleasing'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-like-i-need-to-fix-everyones-184730-037': draft({
    question: "Why do I feel like I need to fix everyone's problems?",
    slug: 'why-do-i-feel-like-i-need-to-fix-everyones-184730-037',
    category: 'Communication & Conflict',
    title: 'Need to Fix Everyone',
    meta: 'The urge to fix others often stems from codependency or learning that your worth depends on being helpful—support without taking responsibility for their choices.',
    summary:
      'The compulsion to fix everyone\'s problems often develops when your value came from being helpful, solving problems, or keeping others happy—sometimes from childhood caretaker roles. Codependency ties your worth to others\' functioning, making their distress feel like your failure to solve.',
    takeaways: [
      'Fixing others can prevent them from developing their own resilience.',
      'Codependency links your worth to others\' happiness and outcomes.',
      'Control beliefs—if I fix everything, chaos won\'t happen—often drive the urge.',
      'Empathy differs from carrying responsibility for others\' lives.',
    ],
    happening:
      'Others\' struggles may trigger anxiety or guilt even when problems are not yours.\n\nYou may offer unsolicited advice or feel uncomfortable simply listening.',
    help:
      'Ask "Do you want advice or just someone to listen?" before problem-solving.\n\nPractice sitting with others\' discomfort without rushing to rescue.\n\nSeparate your worth from how well others manage their lives.\n\nNotice when fixing is about controlling outcomes or avoiding your own feelings.\n\nSet limits on emotional labor you can sustainably offer.\n\nRedirect energy toward your own goals and wellbeing.',
    support:
      `${SUPPORT}\n\nSeek therapy if compulsive fixing drives burnout, resentment, or one-sided relationships.`,
    related: [
      'How do I stop being a people-pleaser?',
      'How do I set boundaries with family?',
      'Why do I feel responsible for others\' emotions?',
      'How do I support someone without fixing them?',
      'How do I recover from burnout?',
    ],
    schemaAnswer:
      'The need to fix everyone\'s problems often reflects codependency and learned caretaker roles—offer support without taking responsibility for others\' choices.',
    themes: ['Codependency', 'Boundaries', 'People-pleasing', 'Control'],
  }),
  'why-do-i-feel-like-ill-never-find-love-a-181083-083': draft({
    question: "Why do I feel like I'll never find love again?",
    slug: 'why-do-i-feel-like-ill-never-find-love-a-181083-083',
    category: 'Relationships & Divorce',
    title: 'Never Find Love Again',
    meta: 'Feeling you will never find love again is common after heartbreak—current pain often distorts future possibilities, and healing opens new connections.',
    summary:
      'The fear that you will never find love again is incredibly common after a breakup, especially after long relationships or later in life. This feeling usually reflects current heartbreak more than future reality. Healing, building a life you value, and remaining open to connection often precede new love.',
    takeaways: [
      'Post-breakup hopelessness is usually temporary, not a permanent forecast.',
      'Heartbreak narrows imagination—it is hard to picture feeling differently while grieving.',
      'People find meaningful love at many ages and after multiple endings.',
      'Building a fulfilling life independently can attract healthier relationships.',
    ],
    happening:
      'Memories of the relationship may make new connection feel impossible or pointless.\n\nYou may compare every potential partner unfavorably to what you lost.',
    help:
      'Allow grief without treating despair as prophecy about your future.\n\nReduce contact or reminders that keep wounds fresh if needed.\n\nInvest in friendships, interests, and routines that rebuild identity outside the relationship.\n\nChallenge absolute language: "never" and "always" rarely hold over time.\n\nMove at your own pace—readiness for dating is personal, not timed.\n\nConsider therapy to process the breakup and relationship patterns.',
    support:
      `${SUPPORT}\n\nSeek help if hopelessness persists, includes self-harm thoughts, or prevents daily functioning for weeks.`,
    related: [
      'How do I cope with a breakup?',
      'How do I rebuild trust after heartbreak?',
      'How do I know when I am ready to date again?',
      'How do I stop idealizing my ex?',
      'How do I cope with loneliness after divorce?',
    ],
    schemaAnswer:
      'Feeling you will never find love again is common after heartbreak—current pain often distorts the future, and healing can open new connections over time.',
    themes: ['Breakup', 'Grief', 'Hopelessness', 'Relationships'],
    refs: [GRIEF, NIMH],
  }),
  'why-do-i-feel-like-im-always-apologizing-for-184730-058': draft({
    question: "Why do I feel like I'm always apologizing for everything?",
    slug: 'why-do-i-feel-like-im-always-apologizing-for-184730-058',
    category: 'Communication & Conflict',
    title: 'Always Apologizing',
    meta: 'Excessive apologizing often stems from people-pleasing and low self-worth—reserve apologies for when you have genuinely caused harm.',
    summary:
      'Constantly apologizing for everything often signals people-pleasing, low self-worth, or fear of conflict. You may apologize for normal needs, others\' mistakes, or circumstances outside your control—diminishing the impact of genuine apologies and signaling less confidence.',
    takeaways: [
      'Preemptive apologies often trace to beliefs that your presence is burdensome.',
      'Apologizing for things outside your control does not prevent conflict.',
      'Excessive sorry can frustrate others who must constantly reassure you.',
      'Replacing sorry with thanks can reframe interactions more confidently.',
    ],
    happening:
      'Sorry may slip out automatically—for asking questions, taking up space, or weather you did not cause.\n\nYou may apologize before others can react, trying to preempt criticism.',
    help:
      'Track when you apologize and ask whether you actually caused harm.\n\nTry "Thank you for waiting" instead of "Sorry I am late" when appropriate.\n\nPractice pausing before apologizing to check if it is warranted.\n\nExamine childhood environments where expressing yourself led to punishment.\n\nBuild self-worth so normal human needs do not feel like offenses.\n\nSave apologies for specific harm you caused and can repair.',
    support:
      `${SUPPORT}\n\nSeek therapy if compulsive apologizing drives chronic shame or difficulty asserting needs.`,
    related: [
      'Why do I feel like I am always apologizing for who I am?',
      'How do I stop people-pleasing?',
      'How do I build self-confidence?',
      'How do I set boundaries without guilt?',
      'How do I communicate needs without conflict?',
    ],
    schemaAnswer:
      'Excessive apologizing often reflects people-pleasing and low self-worth—reserve apologies for when you have genuinely caused harm.',
    themes: ['People-pleasing', 'Self-worth', 'Communication', 'Shame'],
  }),
  'why-do-i-feel-like-im-always-apologizing-for-who-184730-094': draft({
    question: "Why do I feel like I'm always apologizing for who I am?",
    slug: 'why-do-i-feel-like-im-always-apologizing-for-who-184730-094',
    category: 'Identity & Self-Worth',
    title: 'Apologizing for Who I Am',
    meta: 'Apologizing for your identity often stems from shame and rejection experiences—you deserve to exist authentically without constant apology.',
    summary:
      'Feeling you must apologize for who you are suggests deep shame about your personality, emotions, interests, or identity—often from rejection or criticism for expressing your authentic self. You deserve to exist without constantly making yourself smaller or more palatable.',
    takeaways: [
      'Identity shame often develops when love felt conditional on being different.',
      'Marginalized identities may face stigma that intensifies internalized shame.',
      'Apologizing for yourself prevents authentic connection with the right people.',
      'Your natural way of being is valid even when it does not match every expectation.',
    ],
    happening:
      'You may apologize for being too sensitive, too quiet, too emotional, or for interests others mocked.\n\nIdentity aspects you cannot change may feel like flaws requiring constant excuse.',
    help:
      'Catch automatic apologies for normal traits and replace them with neutral statements.\n\nSeek communities where your authentic self is welcomed, not tolerated.\n\nProcess rejection experiences with therapy, especially if tied to family or trauma.\n\nPractice self-advocacy in small safe relationships before wider contexts.\n\nSeparate others\' discomfort from evidence that you are wrong to exist as you are.\n\nBuild identity anchors in values, creativity, and chosen community.',
    support:
      `${SUPPORT}\n\nSeek affirming therapy if identity shame drives isolation, self-harm thoughts, or chronic self-erasure.`,
    related: [
      'Why do I feel like I cannot be myself around others?',
      'How do I build self-esteem when others reject me?',
      'How do I explore my identity safely?',
      'How do I stop people-pleasing?',
      'How do I practice self-compassion?',
    ],
    schemaAnswer:
      'Apologizing for who you are often reflects shame from rejection—you deserve to exist authentically without constant apology.',
    themes: ['Identity shame', 'Authenticity', 'Rejection', 'Self-worth'],
    gaps: ['No dedicated cultural-identity clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-like-im-always-explaining-myself-184730-082': draft({
    question: "Why do I feel like I'm always explaining myself to others?",
    slug: 'why-do-i-feel-like-im-always-explaining-myself-184730-082',
    category: 'Communication & Conflict',
    title: 'Always Explaining Myself',
    meta: 'Constant self-explanation often stems from people-pleasing and fear of judgment—you do not owe others justification for reasonable personal choices.',
    summary:
      'Always explaining yourself often reflects people-pleasing and fear of being misunderstood or rejected. You may over-defend emotions, decisions, or preferences because you learned your choices need external approval to be valid—exhausting and often inviting more scrutiny.',
    takeaways: [
      'Over-explaining often tries to preempt criticism that may never come.',
      'Low confidence in your judgment drives lengthy justifications.',
      'Most personal choices do not require defense to people unaffected by them.',
      'Shorter confident responses often reduce unwanted questioning.',
    ],
    happening:
      'Simple decisions may trigger paragraphs of justification to prove they are reasonable.\n\nYou may feel others will disapprove unless you explain every angle.',
    help:
      'Practice brief responses: "That is what I decided" or "It works for me."\n\nNotice when explaining is about anxiety, not genuine need for clarity.\n\nDistinguish contexts that warrant explanation from personal preference choices.\n\nBuild tolerance for others\' disagreement without reversing decisions.\n\nExamine environments where your feelings were frequently questioned or dismissed.\n\nSeek relationships that respect autonomy without demanding constant rationale.',
    support:
      `${SUPPORT}\n\nSeek therapy if compulsive explaining drives social anxiety or inability to hold boundaries.`,
    related: [
      'Why do I feel like I am always apologizing for everything?',
      'How do I stop people-pleasing?',
      'How do I set boundaries without over-explaining?',
      'How do I build self-confidence?',
      'How do I handle criticism without shutting down?',
    ],
    schemaAnswer:
      'Constant self-explanation often reflects people-pleasing and fear of judgment—you do not owe others justification for reasonable personal choices.',
    themes: ['People-pleasing', 'Communication', 'Self-confidence', 'Boundaries'],
  }),
  'why-do-i-feel-like-im-always-one-step-behind-184730-092': draft({
    question: "Why do I feel like I'm always one step behind everyone else?",
    slug: 'why-do-i-feel-like-im-always-one-step-behind-184730-092',
    category: 'Identity & Self-Worth',
    title: 'Always One Step Behind',
    meta: 'Feeling behind often comes from comparison and perfectionism—everyone moves at their own pace with different starting points and obstacles.',
    summary:
      'Feeling one step behind everyone else often stems from comparison, perfectionism, and social media exposure to others\' milestones while you know your own struggles intimately. Different circumstances, obstacles, and timelines make linear comparison misleading.',
    takeaways: [
      'You compare your full reality to others\' curated highlights.',
      'Perfectionism magnifies areas where you struggle and dismisses where you excel.',
      'Real advantages and obstacles vary widely between people.',
      'Being "behind" may mean you are on a different path, not a worse one.',
    ],
    happening:
      'Peers\' promotions, relationships, or purchases may trigger shame about your pace.\n\nSetbacks may feel like proof you will never catch up.',
    help:
      'Limit comparison triggers on social media and in competitive environments.\n\nTrack your own progress over months, not against others\' timelines.\n\nName obstacles others may not face—health, family, finances, learning differences.\n\nCelebrate small wins you would dismiss if judging a friend harshly.\n\nRedefine success through your values rather than external milestones.\n\nSeek mentorship focused on your goals, not others\' paths.',
    support:
      `${SUPPORT}\n\nSeek therapy if chronic "behind" feelings drive depression, paralysis, or self-harm thoughts.`,
    related: [
      'Why do I feel like I am behind everyone else my age?',
      'Why do I feel like I am behind everyone else financially?',
      'How do I stop comparing my life to social media?',
      'How do I overcome imposter syndrome?',
      'How do I build tolerance for uncertainty?',
    ],
    schemaAnswer:
      'Feeling one step behind often reflects comparison and perfectionism—everyone moves at their own pace with different circumstances and obstacles.',
    themes: ['Comparison', 'Perfectionism', 'Timeline anxiety', 'Self-worth'],
  }),
  'why-do-i-feel-like-im-always-performing-instead-184730-102': draft({
    question: "Why do I feel like I'm always performing instead of just being?",
    slug: 'why-do-i-feel-like-im-always-performing-instead-184730-102',
    category: 'Identity & Self-Worth',
    title: 'Always Performing',
    meta: 'Constant performing often stems from conditional love experiences—practice authentic self-expression in safe relationships.',
    summary:
      'Feeling you are always performing instead of being suggests disconnection from your authentic self—often from childhood where love felt conditional on being a certain way. Monitoring how you are perceived and adjusting personas is exhausting and blocks real intimacy.',
    takeaways: [
      'Performing often developed when your natural self felt unsafe to express.',
      'Different personas in different contexts can blur who you really are.',
      'Performance prevents others from knowing and loving the real you.',
      'Authenticity in safe spaces rebuilds connection and reduces exhaustion.',
    ],
    happening:
      'You may monitor reactions and adjust personality to match what others seem to want.\n\nRelaxing into genuine emotion may feel risky even with people you know.',
    help:
      'Identify safe people where you can share unfiltered thoughts in small doses.\n\nNotice physical exhaustion after social situations as a performance signal.\n\nJournal privately to reconnect with preferences and opinions you suppress.\n\nReduce curated self-presentation on social media.\n\nExplore childhood messages about which parts of you were acceptable.\n\nPractice "good enough" authenticity rather than perfect vulnerability overnight.',
    support:
      `${SUPPORT}\n\nSeek therapy if performance feels mandatory for survival or drives identity confusion.`,
    related: [
      'Why do I feel like I am always pretending to be okay?',
      'Why do I feel like I cannot be myself around others?',
      'How do I build authentic relationships?',
      'How do I overcome imposter syndrome?',
      'How do I practice self-compassion?',
    ],
    schemaAnswer:
      'Constant performing often reflects conditional love experiences—authentic self-expression in safe relationships reduces exhaustion and enables real connection.',
    themes: ['Authenticity', 'Performance', 'Conditional love', 'Identity'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-like-im-always-pretending-to-be-x2y5z8': draft({
    question: "Why do I feel like I'm always pretending to be okay?",
    slug: 'why-do-i-feel-like-im-always-pretending-to-be-x2y5z8',
    category: 'Identity & Self-Worth',
    title: 'Pretending to Be Okay',
    meta: 'Pretending to be okay often stems from fear of burdening others or past invalidation—authentic vulnerability can lead to deeper connection.',
    summary:
      'Feeling you must pretend to be okay reflects a gap between internal experience and what feels safe to express—often because vulnerability was dismissed, punished, or labeled burdensome. Constant facades prevent support and deepen isolation.',
    takeaways: [
      'Past invalidation teaches that struggle must be hidden to stay acceptable.',
      'Caretaker roles may require appearing strong even when you are not.',
      'Pretending blocks others from offering genuine support.',
      'Small authentic disclosures often strengthen rather than damage relationships.',
    ],
    happening:
      'You may smile through pain or deflect with "I am fine" when you are not.\n\nShowing stress may feel like failing others who depend on you.',
    help:
      'Share minor struggles with one trusted person and notice their response.\n\nReplace "I am fine" with graded honesty: "It has been a rough week."\n\nSeparate being a burden from having normal human needs.\n\nSchedule private time to process emotions you cannot share yet.\n\nExamine whether your role as the strong one is sustainable.\n\nBuild support before crisis so you do not have to perform through collapse.',
    support:
      `${SUPPORT}\n\nSeek urgent help if pretending masks suicidal thoughts or severe depression; call or text 988 in the U.S.`,
    related: [
      'Why do I feel like I am always performing instead of just being?',
      'How do I ask for help when I struggle?',
      'How do I cope with emotional numbness?',
      'How do I practice self-compassion?',
      'How do I know if I have depression?',
    ],
    schemaAnswer:
      'Pretending to be okay often reflects fear of burdening others or past invalidation—authentic vulnerability can enable deeper connection and support.',
    themes: ['Emotional masking', 'Vulnerability', 'Invalidation', 'Depression'],
    refs: [DEPRESSION, NIMH],
  }),
  'why-do-i-feel-like-im-always-the-one-reachin-177941-030': draft({
    question: "Why do I feel like I'm always the one reaching out?",
    slug: 'why-do-i-feel-like-im-always-the-one-reachin-177941-030',
    category: 'Relationship Balance',
    title: 'Always the One Reaching Out',
    meta: 'One-sided relationship effort can reflect mismatched styles or unbalanced dynamics—assess reciprocity over time, not single instances.',
    summary:
      'Feeling you always initiate contact or plans is exhausting and can make you question whether people want you around. Different communication styles exist, but chronic one-sided effort may signal unbalanced dynamics where others take your outreach for granted.',
    takeaways: [
      'Some people are natural initiators; others are responsive but still care.',
      'Chronic one-sided effort often breeds resentment and self-doubt.',
      'Pulling back briefly can reveal who invests without your constant push.',
      'Quality reciprocal relationships matter more than quantity of contacts.',
    ],
    happening:
      'You may text first, suggest plans, and maintain connections while others rarely initiate.\n\nSilence from others may feel like proof you are unwanted.',
    help:
      'Track patterns over months—not every friendship requires equal initiation.\n\nExperiment with stepping back to see who reaches out without prompting.\n\nHave direct conversations with close friends about wanting mutual effort.\n\nInvest more in relationships that feel reciprocal in actions, not just words.\n\nNotice whether you initiate from anxiety about abandonment versus genuine desire.\n\nAccept that some connections naturally fade when effort is unequal.',
    support:
      `${SUPPORT}\n\nSeek therapy if rejection sensitivity or attachment anxiety drives compulsive outreach and distress.`,
    related: [
      'Why do I feel like I am always the one reaching out to friends?',
      'Why do I feel like I am always the one who has to initiate plans?',
      'How do I know when to end a friendship?',
      'How do I cope with loneliness?',
      'How do I set boundaries in friendships?',
    ],
    schemaAnswer:
      'Always being the one reaching out can reflect different communication styles or unbalanced dynamics—assess reciprocity over time and invest where effort is mutual.',
    themes: ['Reciprocity', 'Friendship', 'Initiation', 'Relationship balance'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-like-im-always-the-one-reaching-184730-052': draft({
    question: "Why do I feel like I'm always the one reaching out to friends?",
    slug: 'why-do-i-feel-like-im-always-the-one-reaching-184730-052',
    category: 'Relationships & Divorce',
    title: 'Always Reaching Out to Friends',
    meta: 'Being the initiator in friendships can feel one-sided but often reflects different communication styles—distinguish appreciation from exploitation.',
    summary:
      'Always reaching out to friends is frustrating and can feel like proof you are too needy. Some friends are passive initiators but genuinely value you; others may enjoy your company without investing equally. Distinguishing these patterns protects your energy.',
    takeaways: [
      'Passive friends may assume you enjoy organizing and appreciate your lead.',
      'Unequal effort over long periods may signal friendships worth reassessing.',
      'Higher social needs are valid—not a character flaw.',
      'Direct requests for mutual initiation can clarify intentions.',
    ],
    happening:
      'Cancelled plans or slow replies may confirm fears that friendships depend entirely on you.\n\nYou may worry friendships would vanish if you stopped texting first.',
    help:
      'Pause initiation briefly with non-urgent friends and observe who contacts you.\n\nTell close friends you would appreciate them reaching out sometimes.\n\nNotice friends who show care through other actions—remembering details, showing up in crisis.\n\nRelease friendships that consistently feel one-sided after honest conversation.\n\nBuild new connections with people who match your social energy.\n\nSeparate loneliness from evidence that no one likes you.',
    support:
      `${SUPPORT}\n\nSeek therapy if friendship anxiety drives isolation, compulsive texting, or chronic rejection sensitivity.`,
    related: [
      'Why do I feel like I am always the one reaching out?',
      'Why do I feel like I am always the one who has to initiate plans?',
      'How do I make friends as an adult?',
      'How do I cope with loneliness?',
      'How do I know when to end a friendship?',
    ],
    schemaAnswer:
      'Always reaching out to friends can reflect different communication styles—distinguish friends who appreciate your initiative from those who exploit unequal effort.',
    themes: ['Friendship', 'Initiation', 'Reciprocity', 'Loneliness'],
  }),
  'why-do-i-feel-like-im-always-the-one-who-cares-184730-078': draft({
    question: "Why do I feel like I'm always the one who cares more in relationships?",
    slug: 'why-do-i-feel-like-im-always-the-one-who-cares-184730-078',
    category: 'Relationships & Divorce',
    title: 'Always Care More',
    meta: 'Feeling you care more often reflects different attachment styles and love languages—focus on whether your needs are met, not just who initiates affection.',
    summary:
      'Feeling you always care more is painful and may reflect genuine imbalance, different attachment styles, or mismatched love languages. Anxious attachment can amplify need for reassurance while avoidant partners pull back—creating a cycle that feels like unequal caring.',
    takeaways: [
      'Care can be expressed differently—words, time, acts—not always equally visible.',
      'Anxious-avoidant dynamics often feel like one person cares more.',
      'Hypervigilance about signs of disinterest can distort neutral behavior.',
      'Sometimes the feeling accurately reflects partners who are less committed.',
    ],
    happening:
      'You may initiate affection, remember details, or invest emotionally while partners seem distant.\n\nTheir different style may register as indifference even when they do care.',
    help:
      'Name your needs clearly and observe whether partners try to meet them over time.\n\nLearn about attachment styles to interpret patterns without personalizing everything.\n\nTrack actions, not just words or grand gestures.\n\nConsider whether you choose unavailable partners who confirm old fears.\n\nDiscuss love languages and ask how they show care.\n\nEvaluate whether the relationship meets your minimum needs for reciprocity.',
    support:
      `${SUPPORT}\n\nSeek couples or individual therapy if chronic imbalance drives anxiety, resentment, or staying in harmful dynamics.`,
    related: [
      'Why do I feel anxious when my partner needs space?',
      'How do I communicate needs in relationships?',
      'How do I recognize unhealthy relationship patterns?',
      'How do I cope with an emotionally unavailable partner?',
      'How do I build secure attachment?',
    ],
    schemaAnswer:
      'Feeling you always care more may reflect attachment differences or genuine imbalance—focus on whether your needs are met, not just who shows affection first.',
    themes: ['Attachment', 'Reciprocity', 'Love languages', 'Relationships'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-like-im-always-the-one-who-has-184730-096': draft({
    question: "Why do I feel like I'm always the one who has to initiate plans?",
    slug: 'why-do-i-feel-like-im-always-the-one-who-has-184730-096',
    category: 'Relationships & Divorce',
    title: 'Always Initiating Plans',
    meta: 'Being the social initiator often reflects personality differences rather than lack of care—some people prefer to follow rather than lead.',
    summary:
      'Always initiating plans can feel like proof others do not want to spend time with you. Some people are natural organizers while others are happy responders. Chronic imbalance, however, may mean certain friendships rely on your effort without reciprocating.',
    takeaways: [
      'Initiators and responders can both value the friendship differently.',
      'Assuming others enjoy your planning role may hide your unmet needs.',
      'Testing reduced initiation reveals who makes effort without prompting.',
      'Quality friendships with mutual respect beat many one-sided connections.',
    ],
    happening:
      'Group chats may go quiet until you propose something.\n\nYou may feel like the social glue holding friendships together alone.',
    help:
      'Ask specific friends to take a turn planning something they enjoy.\n\nStep back from initiating for a few weeks with lower-priority connections.\n\nExpress that you want shared responsibility for maintaining contact.\n\nNotice who responds enthusiastically versus who rarely follows through.\n\nAccept different friendship tiers—not everyone will be equally active.\n\nInvest planning energy where reciprocity feels fair.',
    support:
      `${SUPPORT}\n\nSeek therapy if social initiation anxiety drives burnout or chronic fear of abandonment.`,
    related: [
      'Why do I feel like I am always the one reaching out to friends?',
      'Why do I feel like I am always the one reaching out?',
      'How do I make friends as an adult?',
      'How do I cope with loneliness?',
      'How do I set boundaries in friendships?',
    ],
    schemaAnswer:
      'Always initiating plans often reflects personality differences—distinguish responsive friends from those who take your effort for granted.',
    themes: ['Friendship', 'Initiation', 'Social planning', 'Reciprocity'],
  }),
  'why-do-i-feel-like-im-always-the-problem-in-184730-033': draft({
    question: "Why do I feel like I'm always the problem in relationships?",
    slug: 'why-do-i-feel-like-im-always-the-problem-in-184730-033',
    category: 'Relationships & Divorce',
    title: 'Always the Problem',
    meta: 'Feeling like the problem often stems from excessive responsibility and past blame—relationship issues are usually mutual, not one-sided.',
    summary:
      'Feeling you are always the problem in relationships often reflects taking excessive responsibility for others\' emotions—usually from childhood blame or criticism. People-pleasing and over-analyzing your behavior while excusing others\' contributions creates an unbalanced view of conflict.',
    takeaways: [
      'Childhood environments that blamed you for family problems reinforce this pattern.',
      'Manipulative partners may exploit your tendency to accept all fault.',
      'Healthy conflict involves mutual responsibility, not one person as perpetual cause.',
      'Self-awareness about your part differs from carrying all blame.',
    ],
    happening:
      'After disagreements you may replay every word you said while minimizing others\' actions.\n\nApologizing first may feel mandatory even when harm was mutual.',
    help:
      'Ask what evidence supports you being "always" the problem versus sometimes contributing.\n\nNotice when partners deflect accountability onto you.\n\nPractice naming others\' roles in conflicts without attacking.\n\nSeek feedback from trusted friends outside the relationship dynamic.\n\nWork with a therapist on blame internalization and abuse recognition.\n\nRemember that concerned self-reflection differs from being the sole problem.',
    support:
      `${SUPPORT}\n\nSeek urgent help if a partner uses blame to control you or if you fear for your safety.`,
    related: [
      'How do I recognize unhealthy relationship patterns?',
      'Why do I feel guilty when I set boundaries with family?',
      'How do I stop people-pleasing?',
      'How do I rebuild trust after emotional abuse?',
      'How do I communicate needs without conflict?',
    ],
    schemaAnswer:
      'Feeling you are always the problem often reflects excessive responsibility and past blame—healthy relationships involve mutual accountability, not one-sided fault.',
    themes: ['Blame', 'Relationships', 'People-pleasing', 'Accountability'],
  }),
  'why-do-i-feel-like-im-always-waiting-for-184730-090': draft({
    question: "Why do I feel like I'm always waiting for permission to live my life?",
    slug: 'why-do-i-feel-like-im-always-waiting-for-184730-090',
    category: 'Identity & Self-Worth',
    title: 'Waiting for Permission',
    meta: 'Waiting for permission often stems from people-pleasing and fear of disapproval—you have authority to make your own life choices as an adult.',
    summary:
      'Feeling you must wait for permission to live your life often reflects people-pleasing and beliefs that others\' approval is required before pursuing goals, expressing needs, or making changes. Childhood environments that restricted autonomy or made love conditional on compliance can leave adults seeking external green lights.',
    takeaways: [
      'Permission-seeking often protects against criticism you learned was dangerous.',
      'Adults can seek advice without needing approval for personal decisions.',
      'Waiting for consensus can indefinitely delay choices only you can make.',
      'Disapproval from others does not automatically mean your choice is wrong.',
    ],
    happening:
      'Career, relationship, or lifestyle decisions may stall until parents, partners, or friends validate them.\n\nYou may ask repeatedly for reassurance instead of trusting your judgment.',
    help:
      'Identify decisions that affect only you versus those that affect others jointly.\n\nPractice small autonomous choices without announcing or defending them.\n\nSeparate fear of disappointing others from actual harm your choice would cause.\n\nBuild confidence through action and learning from outcomes, not endless polling.\n\nUse therapy to unpack childhood messages about whose authority mattered most.\n\nAccept that some people will disagree—and you can still move forward.',
    support:
      `${SUPPORT}\n\nSeek therapy if inability to act without permission drives chronic stagnation or dependence.`,
    related: [
      'Why do I feel like I am always waiting for my real life to begin?',
      'How do I stop people-pleasing?',
      'How do I build self-confidence?',
      'How do I set boundaries with family?',
      'How do I make decisions when I am anxious?',
    ],
    schemaAnswer:
      'Waiting for permission to live often reflects people-pleasing and fear of disapproval—as an adult, you have authority to make your own choices.',
    themes: ['Autonomy', 'People-pleasing', 'Decision-making', 'Self-worth'],
  }),
  'why-do-i-feel-like-im-always-waiting-for-189668-015': draft({
    question: "Why do I feel like I'm always waiting for my real life to begin?",
    slug: 'why-do-i-feel-like-im-always-waiting-for-189668-015',
    category: 'Identity & Self-Worth',
    title: 'Waiting for Real Life',
    meta: 'Feeling life has not started often stems from perfectionism or believing happiness requires specific conditions—your real life is happening now.',
    summary:
      'Feeling you are waiting for your real life to begin often reflects beliefs that life starts only after certain milestones—the right job, relationship, body, or income. This conditional happiness keeps you focused on the future while treating the present as a rehearsal that does not count.',
    takeaways: [
      'Milestone thinking postpones engagement with the life you already have.',
      'Social comparison makes current circumstances feel temporary or insufficient.',
      'Depression and trauma can make presence and meaning feel unreachable.',
      'Small daily choices accumulate into the life you are actually living.',
    ],
    happening:
      'You may tell yourself you will travel, connect, or pursue dreams once conditions are perfect.\n\nPresent days may feel like placeholders until the "real" chapter arrives.',
    help:
      'Name what you are waiting for and whether those conditions are necessary or idealized.\n\nIdentify one meaningful action available in your current circumstances.\n\nReduce social media that showcases others\' highlight reels as normal life.\n\nPractice presence—notice sensory details in ordinary moments.\n\nSeek evaluation for depression if numbness or hopelessness blocks engagement.\n\nRedefine success as participation in your life now, not only future achievement.',
    support:
      `${SUPPORT}\n\nSeek help if waiting-for-life feelings include persistent hopelessness or self-harm thoughts.`,
    related: [
      'Why do I feel like I am always waiting for permission to live my life?',
      'Why do I feel empty even when my life looks good?',
      'How do I stop comparing my life to social media?',
      'How do I find meaning when I feel stuck?',
      'How do I know if I have depression?',
    ],
    schemaAnswer:
      'Feeling you are waiting for real life to begin often reflects perfectionism or conditional happiness—your life is happening now, not only after future milestones.',
    themes: ['Conditional happiness', 'Perfectionism', 'Presence', 'Depression'],
    refs: [DEPRESSION, NIMH],
  }),
  'why-do-i-feel-like-im-behind-everyone-el-181083-024': draft({
    question: "Why do I feel like I'm behind everyone else financially?",
    slug: 'why-do-i-feel-like-im-behind-everyone-el-181083-024',
    category: 'Identity & Self-Worth',
    title: 'Financially Behind Others',
    meta: 'Feeling financially behind is common but often based on incomplete comparisons—everyone\'s timeline and circumstances differ.',
    summary:
      'Feeling financially behind often comes from comparing your internal reality to others\' external appearances. Social media and cultural milestones make it seem everyone else has finances figured out—but starting points, debt, family support, and setbacks vary enormously.',
    takeaways: [
      'Visible spending does not reveal savings, debt, or family help.',
      'Economic conditions and job markets differ by region and generation.',
      'Shame about money often prevents seeking practical financial guidance.',
      'Progress measured against your past self matters more than peer timelines.',
    ],
    happening:
      'Peers buying homes or traveling may trigger shame about your bank account.\n\nYou may hide financial stress while assuming others have none.',
    help:
      'Limit comparison triggers and remember curated displays hide struggle.\n\nTrack your own financial progress month over month.\n\nSeek nonjudgmental financial education or counseling for concrete next steps.\n\nName systemic factors—wages, healthcare costs, student debt—not just personal failure.\n\nBuild small emergency savings or debt payments as evidence of forward motion.\n\nSeparate net worth from human worth.',
    support:
      `${SUPPORT}\n\nSeek financial counseling or therapy if money shame drives severe anxiety or avoidance of basic needs.`,
    related: [
      'Why do I feel like I am behind everyone else my age?',
      'Why do I feel like I do not deserve financial success?',
      'How do I cope with financial stress?',
      'How do I stop comparing my life to social media?',
      'How do I manage anxiety about money?',
    ],
    schemaAnswer:
      'Feeling financially behind often reflects misleading comparison—everyone\'s financial journey differs based on circumstances, setbacks, and starting points.',
    themes: ['Financial stress', 'Comparison', 'Shame', 'Self-worth'],
    gaps: ['No dedicated financial counseling source cited; verify framing stays general.'],
  }),
  'why-do-i-feel-like-im-behind-everyone-el-189668-017': draft({
    question: "Why do I feel like I'm behind everyone else my age?",
    slug: 'why-do-i-feel-like-im-behind-everyone-el-189668-017',
    category: 'Identity & Self-Worth',
    title: 'Behind Others My Age',
    meta: 'Feeling behind often stems from societal timelines that ignore individual paths—life is not a race with one correct schedule.',
    summary:
      'Feeling behind everyone your age reflects pressure from societal timelines for marriage, career, homeownership, and parenthood—amplified by social media that hides struggle. You compare your full internal experience to others\' external milestones.',
    takeaways: [
      'Societal timelines ignore health, opportunity, values, and setbacks.',
      'What looks like being ahead may not bring the fulfillment you imagine.',
      'Non-linear paths include detours that are necessary, not failures.',
      'There is no expiration date on growth, love, or success.',
    ],
    happening:
      'Reunions or feeds may highlight peers\' marriages, promotions, or children while you feel stuck.\n\nSetbacks may feel like permanent proof you missed your window.',
    help:
      'Define success through your values, not arbitrary age benchmarks.\n\nLimit comparison on social media and at status-focused gatherings.\n\nAcknowledge obstacles others may not face—caregiving, illness, discrimination.\n\nCelebrate progress invisible to outsiders—therapy, sobriety, skill-building.\n\nConnect with others on non-traditional timelines for normalized perspective.\n\nFocus on next meaningful step rather than catching up to a phantom schedule.',
    support:
      `${SUPPORT}\n\nSeek therapy if timeline anxiety drives chronic depression or paralysis.`,
    related: [
      'Why do I feel like I am always one step behind everyone else?',
      'Why do I feel like I am behind everyone else financially?',
      'How do I stop comparing my life to social media?',
      'How do I build tolerance for uncertainty?',
      'How do I find meaning when I feel stuck?',
    ],
    schemaAnswer:
      'Feeling behind your age group often reflects societal timelines and comparison—individual paths differ and there is no single correct schedule for life.',
    themes: ['Timeline anxiety', 'Comparison', 'Social pressure', 'Self-worth'],
  }),
  'why-do-i-feel-like-im-betraying-my-family-by-p5q8r2': draft({
    question: 'Why do I feel like I\'m betraying my family by going to therapy?',
    slug: 'why-do-i-feel-like-im-betraying-my-family-by-p5q8r2',
    category: 'Identity & Self-Worth',
    title: 'Betraying Family by Therapy',
    meta: 'Therapy guilt often stems from loyalty conflicts and cultural stigma—healing yourself can ultimately strengthen relationships.',
    summary:
      'Feeling you betray your family by going to therapy often reflects loyalty conflicts, cultural stigma around mental health, or fear that processing family dynamics will create distance. Seeking help is self-care, not disloyalty—and healing can improve your capacity for healthy relationships.',
    takeaways: [
      'Many families treat outside help as airing dirty laundry or weakness.',
      'Cultural stigma can frame therapy as shameful or disloyal.',
      'Therapy can improve boundaries and communication, not only criticize family.',
      'You can love your family and still need support they cannot provide.',
    ],
    happening:
      'Family members may express hurt that you talk to a stranger about private matters.\n\nYou may worry therapy will make you angry or distant from relatives.',
    help:
      'Reframe therapy as building skills to relate more sustainably, not attacking family.\n\nSet boundaries about what you share from sessions if privacy reduces conflict.\n\nExplore cultural and generational beliefs about mental health without shame.\n\nNotice when guilt serves family systems that avoid accountability.\n\nSeek culturally informed therapists when identity and family dynamics intersect.\n\nRemember that your wellbeing enables healthier participation in relationships.',
    support:
      `${SUPPORT}\n\nSeek therapy if guilt about getting help blocks treatment you need or worsens distress.`,
    related: [
      'How do I set boundaries with toxic family?',
      'Why do I feel guilty when I put myself first?',
      'How do I find a therapist who understands my background?',
      'How do I cope with family who reject my choices?',
      'How do I heal from childhood trauma?',
    ],
    schemaAnswer:
      'Feeling therapy betrays family often reflects loyalty conflicts and stigma—healing yourself supports healthier relationships and is not disloyalty.',
    themes: ['Therapy stigma', 'Family loyalty', 'Cultural identity', 'Boundaries'],
    gaps: ['No dedicated cultural-identity clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-like-im-constantly-disappointing-people-184730-045': draft({
    question: "Why do I feel like I'm constantly disappointing people?",
    slug: 'why-do-i-feel-like-im-constantly-disappointing-people-184730-045',
    category: 'Identity & Self-Worth',
    title: 'Constantly Disappointing People',
    meta: 'Feeling you disappoint others often stems from perfectionism and people-pleasing—meeting everyone\'s expectations all the time is impossible.',
    summary:
      'Feeling you constantly disappoint people often reflects perfectionism and beliefs that your worth depends on others\' approval. You may hypersensitive to neutral reactions or project your high standards onto others, assuming disappointment that is not actually expressed.',
    takeaways: [
      'Impossible standards guarantee feeling like a failure.',
      'People-pleasing makes any boundary or mistake feel like betrayal.',
      'Disappointment is normal in healthy relationships—it is not always your fault.',
      'Evidence of general satisfaction may be overlooked while you fixate on one critique.',
    ],
    happening:
      'A neutral text reply or delayed response may register as proof you failed someone.\n\nSaying no or setting limits may feel like letting everyone down.',
    help:
      'Ask directly when unsure rather than assuming disappointment.\n\nCollect evidence of times people expressed appreciation or returned despite limits.\n\nSet realistic expectations—you cannot meet everyone\'s needs simultaneously.\n\nPractice tolerating others\' mild disappointment without reversing boundaries.\n\nExamine whether you take responsibility for emotions you did not cause.\n\nChallenge perfectionism with "good enough" standards.',
    support:
      `${SUPPORT}\n\nSeek therapy if chronic disappointment fears drive anxiety, overwork, or abusive dynamics.`,
    related: [
      'Why do I feel like I need everyone to like me?',
      'How do I stop people-pleasing?',
      'How do I set boundaries without guilt?',
      'How do I overcome perfectionism?',
      'How do I build self-esteem?',
    ],
    schemaAnswer:
      'Feeling you constantly disappoint others often reflects perfectionism and people-pleasing—meeting everyone\'s expectations all the time is impossible.',
    themes: ['Perfectionism', 'People-pleasing', 'Approval-seeking', 'Self-worth'],
  }),
  'why-do-i-feel-like-im-failing-as-a-parent-177941-006': draft({
    question: "Why do I feel like I'm failing as a parent?",
    slug: 'why-do-i-feel-like-im-failing-as-a-parent-177941-006',
    category: 'Parenting',
    title: 'Failing as a Parent',
    meta: 'Parenting guilt is nearly universal and often reflects high standards—not actual failure; connection matters more than perfection.',
    summary:
      'Feeling you are failing as a parent is one of the most common painful experiences in parenthood, often fueled by unrealistic expectations, social media comparisons, and normal child challenges misread as parenting failures. Children need present, loving parents—not perfect ones.',
    takeaways: [
      'Normal child behavior—tantrums, rebellion, struggle—is not proof of bad parenting.',
      'Social media showcases curated moments, not daily parenting reality.',
      'Apologizing and repairing after mistakes models healthy relationships.',
      'Your wellbeing affects your parenting—self-care supports your child too.',
    ],
    happening:
      'You may compare yourself to idealized parents online or in your community.\n\nExhaustion and guilt may compound until every interaction feels like evidence of failure.',
    help:
      'Lower standards temporarily and celebrate small connection moments.\n\nSeparate your child\'s behavior from your worth as a person.\n\nAsk for practical support from partners, family, or community when overwhelmed.\n\nRepair after yelling or mistakes—children benefit from seeing accountability.\n\nLimit parenting content that triggers comparison shame.\n\nSeek parenting support groups or therapy when guilt is persistent and isolating.',
    support:
      `${SUPPORT}\n\nSeek urgent help if you have thoughts of harming yourself or your child; call or text 988 in the U.S.`,
    related: [
      'How do I cope with parental burnout?',
      'How do I manage anger toward my children?',
      'How do I practice self-compassion as a parent?',
      'How do I ask for help when overwhelmed?',
      'How do I repair after yelling at my child?',
    ],
    schemaAnswer:
      'Feeling you are failing as a parent is common and often reflects unrealistic standards—connection and repair matter more than perfection.',
    themes: ['Parenting guilt', 'Self-compassion', 'Perfectionism', 'Burnout'],
    refs: [NIMH, CDC],
    notes: 'Include crisis language if parental distress escalates; verify tone is validating not dismissive.',
  }),
  'why-do-i-feel-like-im-failing-at-everyth-177940-030': draft({
    question: "Why do I feel like I'm failing at everything?",
    slug: 'why-do-i-feel-like-im-failing-at-everyth-177940-030',
    category: 'Self-Worth',
    title: 'Failing at Everything',
    meta: 'This feeling often reflects depression, perfectionism, or mental filtering—not an accurate assessment of your performance.',
    summary:
      'Feeling you are failing at everything is usually a symptom of depression, anxiety, or perfectionist thinking rather than an accurate summary of your life. Mental filtering highlights mistakes while dismissing successes; depression makes ordinary tasks feel impossible.',
    takeaways: [
      'Mental filtering magnifies failures and minimizes achievements.',
      'Depression distorts perception—feeling like a failure is not the same as being one.',
      'Perfectionism sets standards that guarantee falling short.',
      'Small completed tasks are evidence against "everything" failing.',
    ],
    happening:
      'One setback may collapse into global "I fail at everything" thinking.\n\nPositive feedback may be dismissed as luck or pity.',
    help:
      'List three things you handled recently, however small.\n\nAsk what you would tell a friend being this harsh on themselves.\n\nLower expectations temporarily during hard periods.\n\nTrack cognitive distortions—always, never, everything, nothing.\n\nSeek professional evaluation for depression or anxiety if this persists.\n\nCelebrate progress over perfection in one domain at a time.',
    support:
      `${SUPPORT}\n\nSeek urgent help if failure feelings include suicidal thoughts; call or text 988 in the U.S.`,
    related: [
      'Why do I feel like I am failing at everything?',
      'How do I know if I have depression?',
      'How do I stop being so hard on myself?',
      'How do I overcome perfectionism?',
      'How do I practice self-compassion?',
    ],
    schemaAnswer:
      'Feeling you fail at everything often reflects depression or mental filtering—not an accurate assessment; challenge these thoughts with evidence and seek help when needed.',
    themes: ['Depression', 'Mental filtering', 'Perfectionism', 'Self-worth'],
    refs: [DEPRESSION, NIMH],
  }),
  'why-do-i-feel-like-im-failing-at-everything-b2c3d4': draft({
    question: "Why do I feel like I'm failing at everything?",
    slug: 'why-do-i-feel-like-im-failing-at-everything-b2c3d4',
    category: 'Identity & Self-Worth',
    title: 'Failing at Everything',
    meta: 'Feeling you fail at everything often reflects perfectionism and negative thinking—focus on progress over impossible standards.',
    summary:
      'The feeling that you are failing at everything is heavy and often stems from perfectionism, unrealistic expectations, or focusing on what goes wrong while ignoring what goes right. This distorted perception can be challenged—and often improves with self-compassion and professional support.',
    takeaways: [
      'Impossible standards make success feel unreachable.',
      'Social comparison pits your reality against others\' highlight reels.',
      'Progress in one area counts against global failure narratives.',
      'Self-compassion enables action; harsh self-judgment often paralyzes.',
    ],
    happening:
      'Setbacks in work, relationships, or health may merge into one story of total failure.\n\nYou may struggle to name anything you are doing adequately.',
    help:
      'Separate domains—failing at one task is not failing at your entire life.\n\nSet achievable goals and notice completion, not only gaps.\n\nPractice speaking to yourself as you would a struggling friend.\n\nFocus energy on what you can influence today.\n\nReduce comparison triggers that reinforce inadequacy.\n\nSeek therapy if global failure feelings persist or worsen.',
    support:
      `${SUPPORT}\n\nSeek urgent help if failure feelings include self-harm thoughts; call or text 988 in the U.S.`,
    related: [
      'Why do I feel like I am failing at everything?',
      'How do I stop being so hard on myself?',
      'How do I overcome perfectionism?',
      'How do I practice self-compassion?',
      'How do I know if I have depression?',
    ],
    schemaAnswer:
      'Feeling you fail at everything often reflects perfectionism and negative thinking—focus on progress over impossible standards and seek support when needed.',
    themes: ['Perfectionism', 'Negative thinking', 'Self-compassion', 'Self-worth'],
    refs: [DEPRESSION, NIMH],
    notes: 'Duplicate question variant with different slug/category; cross-link Self-Worth slug.',
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
  'reports/enrichment-corpus/draft-answers/batch-34-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-34-drafts.json`);
