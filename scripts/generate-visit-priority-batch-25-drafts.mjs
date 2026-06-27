import { readFileSync, writeFileSync } from 'node:fs';

const CARE =
  'This information is general guidance, not a substitute for care from a licensed mental health professional. If distress becomes overwhelming, call or text 988 in the U.S. or seek emergency care.';
const SUPPORT =
  'Consider professional support if symptoms persistently interfere with daily life, relationships, or safety. Seek urgent help if you are having thoughts of self-harm or feel unable to stay safe; in the U.S., call or text 988.';
const CRISIS_SUPPORT = `${SUPPORT}\n\nIf you are having thoughts of self-harm or feel unable to stay safe, call or text 988 in the U.S. or seek emergency care now.`;
const ABUSE_SUPPORT = `${SUPPORT}\n\nIf you feel unsafe in your relationship, contact the National Domestic Violence Hotline at 1-800-799-7233 for confidential support and safety planning.`;
const TEEN_CRISIS_SUPPORT = `${SUPPORT}\n\nIf school feels unsafe or you are having thoughts of hurting yourself, tell a trusted adult such as a counselor, teacher, or parent. Call or text 988 in the U.S. if you need immediate help.`;
const TEEN_PARENT_CRISIS = `${SUPPORT}\n\nIf your teen may be at risk of self-harm, ask directly about safety and call or text 988 in the U.S. or seek emergency care if there is immediate danger.`;

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
const DEPRESSION = {
  title: 'Depression',
  url: 'https://www.nimh.nih.gov/health/topics/depression',
  publisher: 'NIMH',
  note: 'Supports understanding depression symptoms and treatment.',
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
const BURNOUT = {
  title: 'Coping with Stress',
  url: 'https://www.cdc.gov/mental-health/caring-for-yourself/coping-with-stress/index.html',
  publisher: 'CDC',
  note: 'Supports stress management and recovery strategies.',
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
  careNote = CARE,
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
    care_note: careNote,
    related_questions: related,
    suggested_schema_question: question,
    suggested_schema_answer: schemaAnswer,
    primary_theme: theme || category,
    related_themes: themes,
    source_refs: refs,
    citation_gaps: gaps,
    safety_flags: flags,
    draft_notes: notes,
  };
}

function mergeRefs(draftRefs = [], candidateRefs = []) {
  const seen = new Set();
  const merged = [];
  for (const ref of [...candidateRefs, ...draftRefs]) {
    if (!seen.has(ref.url)) {
      seen.add(ref.url);
      merged.push(ref);
    }
  }
  return merged;
}

const CONTENT = {
  'how-to-stop-comparing-myself-to-everyone-else': draft({
    question: 'How can I stop comparing myself to everyone else?',
    slug: 'how-to-stop-comparing-myself-to-everyone-else',
    category: 'Identity & Self-Worth',
    title: 'Stop Comparing Yourself to Others',
    meta: 'Comparison often reflects social pressure and highlight reels, not reality. Limit triggers, name your values, and practice self-compassion.',
    summary:
      'Comparing yourself to others is common, especially on social media and in competitive settings. It often reflects seeing others\' highlights while knowing your own struggles. Reducing harmful comparison starts with limiting triggers, reconnecting with your values, and practicing self-compassion.',
    takeaways: [
      'Comparison is common; it does not mean something is wrong with you.',
      'Social media and curated success stories distort what "normal" looks like.',
      'Your values and path may differ from what others display.',
      'Self-compassion and fewer comparison triggers can reduce the habit over time.',
    ],
    happening:
      'You may scroll and feel instantly behind: smarter peers, happier couples, more successful careers.\n\nComparison often spikes when you are stressed, lonely, or unsure of your direction. Your brain may treat others\' wins as proof you are falling short, even when you do not know their full story.',
    help:
      'Notice when comparison starts and what triggered it: a post, a conversation, a milestone.\n\nLimit or curate social media feeds that consistently leave you feeling worse.\n\nWrite down three things that matter to you independent of others\' achievements.\n\nPractice "compare and despair" awareness: "I am seeing their highlight, not their whole life."\n\nCelebrate small wins in your own lane rather than ranking yourself against everyone.\n\nSpend time with people who support you without constant competition.',
    support:
      `${SUPPORT}\n\nSeek therapy if comparison drives persistent low mood, avoidance of goals, or thoughts of not wanting to live.`,
    related: [
      'Why does social media make me feel worse about myself?',
      'Why do I feel like I am not good enough?',
      'How can teens build confidence without pretending to be someone else?',
      'How do I figure out who I am outside of what other people expect?',
      'Why do compliments make me uncomfortable?',
    ],
    schemaAnswer:
      'Reduce harmful comparison by limiting triggers, reconnecting with your own values, practicing self-compassion, and remembering that others\' public wins rarely show their full struggles.',
    themes: ['Self-worth', 'Comparison', 'Social media', 'Self-compassion'],
  }),
  'what-to-do-if-i-feel-different-from-everyone-at-school': draft({
    question: 'What should I do if I feel different from everyone at school?',
    slug: 'what-to-do-if-i-feel-different-from-everyone-at-school',
    category: 'Teens & Identity',
    title: 'Feeling Different at School',
    meta: 'Feeling different at school is common. Find safe connections, talk to a trusted adult, and remember difference is not the same as being wrong.',
    summary:
      'Feeling different from classmates is common and painful, especially during adolescence when fitting in can feel urgent. Difference may relate to interests, background, identity, neurodiversity, or simply not clicking with a particular group. It does not mean something is wrong with you.',
    takeaways: [
      'Feeling different at school is common, especially in adolescence.',
      'Difference may reflect interests, identity, or environment mismatch, not a flaw.',
      'One or two genuine connections often matter more than fitting every group.',
      'A trusted adult can help if school feels lonely or unsafe.',
    ],
    happening:
      'You may feel like the only one who thinks, dresses, believes, or experiences life differently.\n\nLunchrooms, group projects, and social media can make difference feel like rejection even when no one says anything directly.',
    help:
      'Start with one safe connection: a classmate, club member, online community, or cousin who gets you.\n\nLook for groups built around interests rather than popularity: art, gaming, sports, activism, faith, or hobbies.\n\nPractice self-talk that separates "different" from "bad" or "broken."\n\nLimit time in spaces where you are mocked or excluded on purpose.\n\nTalk to a school counselor, teacher, coach, or parent if loneliness or bullying is heavy.\n\nExplore identity and values at your own pace without forcing yourself into a mold.',
    support: TEEN_CRISIS_SUPPORT,
    related: [
      'How can teens build confidence without pretending to be someone else?',
      'Why does social media make me feel worse about myself?',
      'Why do I feel lonely even when I am around people?',
      'What should I do if I have no one to talk to?',
      'How do I figure out who I am outside of what other people expect?',
    ],
    schemaAnswer:
      'If you feel different at school, seek safe connections through shared interests, talk to a trusted adult if needed, and remember that being different is not the same as being wrong.',
    themes: ['Teens', 'Belonging', 'Identity', 'School'],
    careNote: `${CARE} If school feels unsafe due to bullying or harassment, tell a trusted adult and seek help promptly.`,
  }),
  'can-low-self-esteem-affect-relationships': draft({
    question: 'Can low self-esteem affect relationships?',
    slug: 'can-low-self-esteem-affect-relationships',
    category: 'Identity & Self-Worth',
    title: 'Low Self-Esteem and Relationships',
    meta: 'Low self-esteem can shape relationships through reassurance seeking, conflict avoidance, or tolerating poor treatment. Support and boundaries help.',
    summary:
      'Low self-esteem can affect relationships in real ways. It may show up as reassurance seeking, jealousy, conflict avoidance, difficulty accepting care, or staying in situations that do not feel good. These patterns are understandable, and they can improve with support, communication, and healthier boundaries.',
    takeaways: [
      'Low self-esteem can influence how you give and receive love.',
      'Reassurance seeking and conflict avoidance are common patterns.',
      'Poor treatment is not caused by low self-esteem; mistreatment is never your fault.',
      'Therapy and clearer boundaries can improve relationship patterns over time.',
    ],
    happening:
      'When you doubt your worth, you may read neutral signals as rejection or cling to reassurance.\n\nYou might avoid hard conversations, apologize excessively, or tolerate behavior that hurts because you fear being alone.',
    help:
      'Notice patterns without blaming yourself: Do I ask for reassurance repeatedly? Do I stay quiet when hurt?\n\nPractice naming needs directly instead of testing whether someone cares.\n\nBuild self-worth outside the relationship: friends, skills, rest, and values-aligned activities.\n\nSet small boundaries and notice which partners respect them.\n\nSeparate "I feel insecure" from "I am being treated poorly."\n\nConsider individual or couples therapy if patterns feel stuck.',
    support:
      `${SUPPORT}\n\nSeek help if low self-esteem keeps you in harmful dynamics or if a partner uses your insecurity to control or belittle you.`,
    related: [
      'How do I ask for reassurance without pushing my partner away?',
      'Why do I feel like I am not good enough?',
      'Why do compliments make me uncomfortable?',
      'How do I tell my partner I feel disconnected?',
      'Why do I miss someone who treated me badly?',
    ],
    schemaAnswer:
      'Low self-esteem can affect relationships through reassurance seeking, conflict avoidance, and difficulty accepting care; therapy and boundaries can help without blaming you for mistreatment.',
    themes: ['Self-esteem', 'Relationships', 'Boundaries', 'Communication'],
  }),
  'why-does-social-media-make-me-feel-worse-about-myself': draft({
    question: 'Why does social media make me feel worse about myself?',
    slug: 'why-does-social-media-make-me-feel-worse-about-myself',
    category: 'Teens & Identity',
    title: 'When Social Media Hurts Self-Esteem',
    meta: 'Social media often shows curated highlights, which can fuel comparison, FOMO, and body image stress. Limits and offline connection can help.',
    summary:
      'Social media can make you feel worse about yourself because it often shows curated highlights, filtered images, and success stories without context. Heavy use may increase comparison, fear of missing out, sleep disruption, and body image stress. These reactions are common, especially for teens and young adults.',
    takeaways: [
      'Most feeds show highlights, not ordinary or hard moments.',
      'Comparison and FOMO are common reactions, not personal failures.',
      'Sleep, scrolling time, and who you follow strongly affect mood.',
      'Offline connection and curated feeds can reduce harm without quitting entirely.',
    ],
    happening:
      'You may scroll and feel suddenly less attractive, less successful, or less included.\n\nAlgorithms often push content that keeps you engaged, including idealized bodies, drama, or conflict that spikes anxiety.',
    help:
      'Track how you feel before and after scrolling for a few days.\n\nUnfollow or mute accounts that consistently leave you feeling worse.\n\nSet time limits, especially before bed.\n\nFollow accounts that reflect realistic diversity, hobbies, or learning rather than only appearance.\n\nReplace some scroll time with in-person or voice connection.\n\nTalk with a trusted adult or counselor if social media is tied to bullying or severe distress.',
    support: TEEN_CRISIS_SUPPORT,
    related: [
      'How can I stop comparing myself to everyone else?',
      'Why do I feel like I am not good enough?',
      'What should I do if I feel different from everyone at school?',
      'How can teens build confidence without pretending to be someone else?',
      'Why do compliments make me uncomfortable?',
    ],
    schemaAnswer:
      'Social media can hurt self-esteem by showing curated highlights that fuel comparison and FOMO; limits, curated follows, sleep protection, and offline connection often help.',
    themes: ['Social media', 'Teens', 'Self-esteem', 'Comparison'],
    careNote: `${CARE} If online harassment or bullying is involved, tell a trusted adult and document harmful messages when safe to do so.`,
  }),
  'what-to-do-if-i-have-no-one-to-talk-to': draft({
    question: 'What should I do if I have no one to talk to?',
    slug: 'what-to-do-if-i-have-no-one-to-talk-to',
    category: 'Loneliness & Isolation',
    title: 'When You Have No One to Talk To',
    meta: 'Having no one to talk to is painful and more common than it seems. Warm lines, crisis support, therapy, and small connection steps can help.',
    summary:
      'Having no one to talk to can feel crushing and shameful, but it is more common than it seems. Isolation may follow moves, breakups, grief, mental health struggles, or simply not having found your people yet. You deserve support even when friends feel far away.',
    takeaways: [
      'Feeling alone with no one to talk to is painful and not a moral failing.',
      'Warm lines and crisis lines offer confidential listening when friends are unavailable.',
      'Therapists and support groups provide steady, nonjudgmental connection.',
      'Small connection steps can rebuild a network over time.',
    ],
    happening:
      'You may wake up and realize there is no one you feel safe calling with hard news or ordinary stress.\n\nIsolation can deepen when shame tells you to hide how bad it feels, which makes reaching out harder.',
    help:
      'Start with low-barrier support: a warm line, crisis text line, or online peer community trained to listen.\n\nConsider therapy or a support group where talking is the purpose, not a favor you are asking.\n\nSend one message to someone from your past: "Thinking of you. How are you?"\n\nJoin a class, volunteer role, or interest group where repeated contact builds familiarity.\n\nWrite feelings in a journal or voice memo if speaking feels impossible today.\n\nKeep a list of three numbers you can call when distress spikes.',
    support: CRISIS_SUPPORT,
    related: [
      'Why do I feel lonely even when I am around people?',
      'Why do I isolate myself when I am struggling?',
      'Can loneliness affect my mental health?',
      'How can I cope with loneliness after a breakup?',
      'When does grief become something I should get help for?',
    ],
    schemaAnswer:
      'If you have no one to talk to, use warm lines or crisis support for immediate listening, consider therapy or groups for steady connection, and take small steps to rebuild relationships over time.',
    themes: ['Loneliness', 'Isolation', 'Crisis support', 'Connection'],
    careNote: `${CARE} If you are thinking about hurting yourself or feel unable to stay safe, call or text 988 in the U.S. or seek emergency care now.`,
  }),
  'why-do-i-feel-lonely-even-around-people': draft({
    question: 'Why do I feel lonely even when I am around people?',
    slug: 'why-do-i-feel-lonely-even-around-people',
    category: 'Loneliness & Isolation',
    title: 'Lonely Even Around People',
    meta: 'Emotional loneliness can happen in a crowd when connection feels shallow or unsafe. Quality, honesty, and fit matter more than headcount.',
    summary:
      'Feeling lonely around people is often emotional loneliness: you are physically present but not feeling seen, understood, or safe to be yourself. It can happen in marriages, friend groups, workplaces, and family gatherings. The issue is usually connection quality, not how many people are nearby.',
    takeaways: [
      'Emotional loneliness differs from being physically alone.',
      'Surface contact without vulnerability can leave you feeling unseen.',
      'Masking your real self may protect you but deepens disconnection.',
      'A few honest relationships often help more than larger shallow circles.',
    ],
    happening:
      'You may laugh in a group and still feel like no one knows what is actually going on inside.\n\nPast rejection, conflict, or depression can make authentic connection feel risky even when people are kind.',
    help:
      'Name the loneliness specifically: "I am around people but not feeling close."\n\nInvest in one or two relationships where you can share something real, even small.\n\nPractice gradual vulnerability instead of performing okayness.\n\nNotice whether you are with people who share your values and pace.\n\nReduce time in groups that require constant masking.\n\nConsider therapy if loneliness persists despite effort or accompanies low mood.',
    support: CRISIS_SUPPORT,
    related: [
      'What should I do if I have no one to talk to?',
      'Can loneliness affect my mental health?',
      'How do I tell my partner I feel disconnected?',
      'Why do I isolate myself when I am struggling?',
      'How can I cope with loneliness after a breakup?',
    ],
    schemaAnswer:
      'Loneliness around people often reflects emotional disconnection rather than lack of company; deeper honesty, better-fit relationships, and support can help.',
    themes: ['Loneliness', 'Connection', 'Relationships', 'Emotional health'],
  }),
  'why-do-compliments-make-me-uncomfortable': draft({
    question: 'Why do compliments make me uncomfortable?',
    slug: 'why-do-compliments-make-me-uncomfortable',
    category: 'Identity & Self-Worth',
    title: 'Why Compliments Feel Uncomfortable',
    meta: 'Compliments can feel awkward when self-esteem is low, praise feels unfamiliar, or you mistrust the person\'s motives. A simple "thank you" is enough.',
    summary:
      'Compliments can feel uncomfortable for many reasons: low self-esteem, unfamiliarity with praise, fear of seeming arrogant, or mistrust of the giver\'s motives. Past criticism or bullying can make positive attention feel suspicious. Discomfort does not mean you are ungrateful or broken.',
    takeaways: [
      'Discomfort with compliments is a common self-worth pattern.',
      'Low self-esteem can make praise feel untrue or threatening.',
      'You do not need a long speech; "thank you" is enough.',
      'Therapy can help if praise consistently triggers shame or panic.',
    ],
    happening:
      'When someone compliments you, your mind may instantly argue: they are being polite, they want something, or they have not seen the real you.\n\nIf praise was rare or paired with criticism growing up, positive attention may feel unsafe rather than soothing.',
    help:
      'Pause before deflecting: try "thank you" even if it feels awkward.\n\nNotice the urge to minimize yourself and whether it protects you from disappointment.\n\nAsk whether the compliment matches something you genuinely value.\n\nPractice receiving small praise in low-stakes settings.\n\nExplore self-compassion exercises that separate worth from achievement.\n\nConsider therapy if compliments trigger intense shame or distrust of all kindness.',
    support:
      `${SUPPORT}\n\nSeek support if discomfort with praise is tied to persistent self-hatred, trauma reactions, or inability to accept any care from others.`,
    related: [
      'Why do I feel like I am not good enough?',
      'Can low self-esteem affect relationships?',
      'How can I stop comparing myself to everyone else?',
      'How do I ask for reassurance without pushing my partner away?',
      'How do I figure out who I am outside of what other people expect?',
    ],
    schemaAnswer:
      'Compliments may feel uncomfortable due to low self-esteem, unfamiliar praise, or mistrust; a simple thank you and gradual self-compassion practice often help.',
    themes: ['Self-worth', 'Self-esteem', 'Shame', 'Interpersonal patterns'],
  }),
  'tell-my-partner-i-feel-disconnected': draft({
    question: 'How do I tell my partner I feel disconnected?',
    slug: 'tell-my-partner-i-feel-disconnected',
    category: 'Relationships & Communication',
    title: 'Tell Your Partner You Feel Disconnected',
    meta: 'Start with a gentle, specific "I" statement, name what you miss, and invite conversation without blame. Small daily check-ins rebuild closeness.',
    summary:
      'Telling your partner you feel disconnected can reopen closeness if you approach the conversation with care. Use "I" statements, name what you miss rather than what they fail to do, and invite collaboration. Disconnection is common during stress, parenting, or long routines.',
    takeaways: [
      'Disconnection is common and often develops gradually.',
      '"I" statements reduce defensiveness compared with blame.',
      'Naming what you miss helps your partner understand concretely.',
      'Small daily check-ins often rebuild closeness better than one big talk.',
    ],
    happening:
      'You may feel like roommates handling logistics while emotional intimacy faded.\n\nYour partner might feel the same distance but assume you are fine, or they may be stressed and withdrawn for their own reasons.',
    help:
      'Choose a calm moment, not mid-argument.\n\nTry: "I miss feeling close to you and want to talk about us."\n\nDescribe specific moments: less eye contact, fewer deep talks, feeling lonely in the same room.\n\nAsk how they have been experiencing the relationship lately.\n\nSuggest one small step: a nightly check-in, a weekly date, or phone-free time.\n\nConsider couples therapy if conversations stall or turn defensive quickly.',
    support:
      `${SUPPORT}\n\nSeek couples or individual therapy if disconnection coexists with contempt, control, or fear of speaking honestly.`,
    related: [
      'What should I do if my partner refuses to talk about problems?',
      'How do I ask for reassurance without pushing my partner away?',
      'How can couples rebuild trust after lying?',
      'Can low self-esteem affect relationships?',
      'Why do I feel lonely even when I am around people?',
    ],
    schemaAnswer:
      'Tell your partner you feel disconnected using gentle "I" statements, name what you miss, invite their perspective, and suggest small daily steps to rebuild closeness.',
    themes: ['Relationships', 'Communication', 'Intimacy', 'Connection'],
  }),
  'cope-with-loneliness-after-breakup': draft({
    question: 'How can I cope with loneliness after a breakup?',
    slug: 'cope-with-loneliness-after-breakup',
    category: 'Relationships & Divorce',
    title: 'Loneliness After a Breakup',
    meta: 'Post-breakup loneliness is normal grief for shared routines and companionship. Structure, support, and limits on contact can help you heal.',
    summary:
      'Loneliness after a breakup is a normal part of grieving the relationship, shared routines, and future you imagined together. The first weeks often feel hardest at night, on weekends, or when something reminds you of your ex. Healing takes time, structure, and support.',
    takeaways: [
      'Post-breakup loneliness is normal grief, not weakness.',
      'Shared routines and future plans disappear along with the person.',
      'Limits on contact and social media often reduce prolonged pain.',
      'Support networks and new structure help the loneliest hours pass.',
    ],
    happening:
      'You may reach for your phone to share news and remember no one is on the other end in that role anymore.\n\nMutual friends, places, and songs can trigger waves of emptiness even when you know the breakup was right.',
    help:
      'Expect loneliness spikes rather than judging yourself for missing the relationship.\n\nRebuild structure: meals, walks, sleep times, and one social plan per week.\n\nLean on friends, family, or a support group without only processing the ex.\n\nLimit contact, checking their social media, and "just one text" if it reopens wounds.\n\nWrite what you lost and what you hope for next without rushing to date.\n\nReturn to hobbies and values that existed before the relationship.',
    support: CRISIS_SUPPORT,
    related: [
      'Why do I miss someone who treated me badly?',
      'What should I do if I have no one to talk to?',
      'Why do I feel lonely even when I am around people?',
      'When does grief become something I should get help for?',
      'Can loneliness affect my mental health?',
    ],
    schemaAnswer:
      'Cope with post-breakup loneliness by grieving normally, rebuilding structure, leaning on support, limiting ex contact, and giving yourself time without rushing into replacement relationships.',
    themes: ['Breakup', 'Loneliness', 'Grief', 'Recovery'],
    careNote: `${CARE} If a breakup involves stalking, threats, or violence, prioritize safety planning and contact the National Domestic Violence Hotline at 1-800-799-7233.`,
  }),
  'how-can-teens-build-confidence-without-pretending': draft({
    question: 'How can teens build confidence without pretending to be someone else?',
    slug: 'how-can-teens-build-confidence-without-pretending',
    category: 'Teens & Identity',
    title: 'Build Teen Confidence Authentically',
    meta: 'Real confidence grows from skills, values, and self-acceptance, not performing a persona. Small brave steps and supportive people help.',
    summary:
      'Authentic confidence grows from knowing your values, building skills, and accepting yourself rather than performing a persona to fit in. Teens often feel pressure to be louder, cooler, or different than they are. Real confidence usually comes from small brave steps and supportive relationships.',
    takeaways: [
      'Confidence is not the same as pretending to be extroverted or perfect.',
      'Skills and values-aligned action build genuine self-trust.',
      'Small brave steps matter more than dramatic image changes.',
      'Supportive people who accept the real you protect authentic growth.',
    ],
    happening:
      'You may feel like everyone else has a personality that works while you are editing yourself constantly.\n\nSocial media and school culture can reward performance over honesty, making authenticity feel risky.',
    help:
      'Identify one value that matters to you: kindness, creativity, loyalty, learning, or fairness.\n\nTake one small action aligned with that value each week.\n\nBuild competence in something you enjoy: music, coding, sports, art, or helping others.\n\nPractice saying what you actually think in low-stakes settings.\n\nSpend time with people who like you without a performance.\n\nNotice when you are copying someone else and ask what feels true for you.',
    support:
      `${SUPPORT}\n\nTalk with a school counselor or trusted adult if pressure to change yourself is tied to bullying, exclusion, or thoughts of self-harm.`,
    related: [
      'What should I do if I feel different from everyone at school?',
      'Why does social media make me feel worse about myself?',
      'Why do I feel like I am not good enough?',
      'How can I stop comparing myself to everyone else?',
      'How do I figure out who I am outside of what other people expect?',
    ],
    schemaAnswer:
      'Teens can build authentic confidence through values-aligned actions, skill-building, small brave steps, and relationships that accept the real you rather than a performed persona.',
    themes: ['Teens', 'Confidence', 'Identity', 'Authenticity'],
    careNote: `${CARE} If pressure to fit in is affecting safety or self-worth severely, tell a trusted adult such as a counselor or parent.`,
  }),
  'why-do-i-feel-like-i-am-not-good-enough': draft({
    question: 'Why do I feel like I am not good enough?',
    slug: 'why-do-i-feel-like-i-am-not-good-enough',
    category: 'Identity & Self-Worth',
    title: 'Feeling Not Good Enough',
    meta: 'Persistent "not good enough" feelings often come from comparison, harsh self-talk, or past criticism. Support and self-compassion can help over time.',
    summary:
      'Feeling not good enough is a painful and common experience. It may come from harsh inner criticism, comparison, past bullying or criticism, perfectionism, or stress that shrinks your sense of capability. These feelings are real, and they do not define your worth.',
    takeaways: [
      '"Not good enough" feelings are common and often reflect learned criticism.',
      'Comparison and perfectionism frequently fuel the sense of falling short.',
      'Your worth is not earned through constant achievement.',
      'Support and self-compassion can soften persistent shame over time.',
    ],
    happening:
      'You may achieve something and still feel like an imposter waiting to be exposed.\n\nOld messages from school, family, or social media may play on repeat even when current evidence suggests you are capable and cared for.',
    help:
      'Name the thought: "This is the not-good-enough story, not a fact."\n\nList evidence against the harshest belief, including small wins.\n\nNotice who or what triggers the feeling: a person, platform, or type of task.\n\nPractice speaking to yourself as you would to a friend in the same situation.\n\nReduce comparison triggers where possible.\n\nConsider therapy if shame is constant or tied to trauma, depression, or anxiety.',
    support: CRISIS_SUPPORT,
    related: [
      'How can I stop comparing myself to everyone else?',
      'Why do compliments make me uncomfortable?',
      'Can low self-esteem affect relationships?',
      'Why do I feel guilty when I rest?',
      'Why do I isolate myself when I am struggling?',
    ],
    schemaAnswer:
      'Feeling not good enough often stems from harsh self-talk, comparison, or past criticism; self-compassion, evidence-checking, and therapy can help without tying worth to achievement.',
    themes: ['Self-worth', 'Shame', 'Perfectionism', 'Self-compassion'],
  }),
  'ask-for-reassurance-without-pushing-partner-away': draft({
    question: 'How do I ask for reassurance without pushing my partner away?',
    slug: 'ask-for-reassurance-without-pushing-partner-away',
    category: 'Relationships & Communication',
    title: 'Ask for Reassurance Without Pushing Away',
    meta: 'Name your fear, ask clearly, and limit repeated checking. Balance reassurance with self-soothing so your partner can support without burning out.',
    summary:
      'Needing reassurance in a relationship is human, especially during stress or insecurity. Problems arise when repeated checking overwhelms your partner. You can ask clearly, name the fear beneath the question, and pair reassurance requests with self-soothing skills.',
    takeaways: [
      'Needing reassurance is normal; frequency and tone matter.',
      'Naming the underlying fear helps your partner respond with care.',
      'Repeated checking can push partners away even when love is real.',
      'Self-soothing skills balance healthy reassurance requests.',
    ],
    happening:
      'Anxiety may whisper that one unanswered text means the relationship is over.\n\nYou might ask the same question several ways, seeking relief that lasts only minutes before doubt returns.',
    help:
      'Before asking, identify the fear: abandonment, not being chosen, being replaced.\n\nTry: "I am feeling insecure and would love some reassurance that we are okay."\n\nAsk once clearly instead of testing repeatedly.\n\nBuild self-soothing tools: breathing, journaling, a walk, or a timed wait before re-asking.\n\nAgree with your partner on helpful reassurance versus unhelpful spirals.\n\nConsider individual therapy if reassurance needs feel constant or tied to past betrayal.',
    support:
      `${SUPPORT}\n\nSeek couples or individual therapy if reassurance cycles cause daily conflict or if a partner withholds reassurance to punish or control.`,
    related: [
      'Can low self-esteem affect relationships?',
      'How do I tell my partner I feel disconnected?',
      'How can couples rebuild trust after lying?',
      'Why do I miss someone who treated me badly?',
      'What should I do if my partner refuses to talk about problems?',
    ],
    schemaAnswer:
      'Ask for reassurance by naming your fear, making one clear request, using self-soothing between asks, and discussing helpful patterns with your partner to avoid overwhelming them.',
    themes: ['Relationships', 'Communication', 'Anxiety', 'Reassurance'],
  }),
  'why-do-i-miss-someone-who-treated-me-badly': draft({
    question: 'Why do I miss someone who treated me badly?',
    slug: 'why-do-i-miss-someone-who-treated-me-badly',
    category: 'Relationships & Divorce',
    title: 'Missing Someone Who Hurt You',
    meta: 'Missing an ex who treated you badly is common: bonds, hope, and withdrawal can outlast mistreatment. Grief does not mean you should go back.',
    summary:
      'Missing someone who treated you badly is confusing and common. Attachment, good memories, hope they will change, and withdrawal from the relationship can all create longing that outlasts mistreatment. Missing them does not mean you were wrong to leave or that going back is safe.',
    takeaways: [
      'Longing after mistreatment is common and does not mean you should return.',
      'Attachment and intermittent kindness can bind you to harmful patterns.',
      'Grief for the relationship is separate from safety in the relationship.',
      'Support and safety planning help when abuse was involved.',
    ],
    happening:
      'Your brain may replay the loving moments while minimizing the harm.\n\nAbusive dynamics often include cycles of tension, harm, and reconciliation that make leaving feel like losing the good version of the person.',
    help:
      'Write two lists: what you miss and what hurt you. Both can be true.\n\nRemind yourself that missing someone is not proof the relationship was good.\n\nAvoid contact that reopens hope during early recovery.\n\nTalk with a therapist or domestic violence advocate if abuse was present.\n\nBuild routines that fill time previously spent on the relationship.\n\nLean on friends who saw the harm and support your safety.',
    support: ABUSE_SUPPORT,
    related: [
      'How can I cope with loneliness after a breakup?',
      'What should I do if my partner refuses to talk about problems?',
      'Can low self-esteem affect relationships?',
      'When does grief become something I should get help for?',
      'How can couples rebuild trust after lying?',
    ],
    schemaAnswer:
      'Missing someone who treated you badly often reflects attachment and grief, not proof you should return; support, safety planning, and no contact often help when abuse was involved.',
    themes: ['Abuse recovery', 'Breakup', 'Attachment', 'Safety'],
    careNote: `${CARE} If you feel unsafe or are considering returning to someone who harmed you, contact the National Domestic Violence Hotline at 1-800-799-7233 for confidential support.`,
  }),
  'can-trauma-affect-grief': draft({
    question: 'Can trauma affect grief?',
    slug: 'can-trauma-affect-grief',
    category: 'Trauma & Grief',
    title: 'How Trauma Can Shape Grief',
    meta: 'Traumatic loss can overlap grief with shock, intrusive memories, and hypervigilance. Both grief support and trauma-informed care may help.',
    summary:
      'Trauma can affect grief when a loss is sudden, violent, preventable, or tied to other frightening events. Grief and trauma reactions may overlap: shock, intrusive memories, guilt, hypervigilance, and difficulty trusting the world. Both need compassionate, often professional support.',
    takeaways: [
      'Traumatic losses can combine grief with trauma reactions.',
      'Sudden or violent deaths may bring shock and intrusive memories.',
      'Guilt and "what if" thoughts are common but not proof you caused the loss.',
      'Trauma-informed grief support can address both pain and safety fears.',
    ],
    happening:
      'You may replay the event, struggle to believe the person is gone, or feel on edge long after the loss.\n\nOrdinary grief tasks like sorting belongings can trigger flashbacks or panic.',
    help:
      'Allow that grief after trauma may feel less linear than expected.\n\nGround yourself when memories spike: breathing, naming five things you see, or stepping outside.\n\nShare your story with someone safe rather than holding it alone.\n\nSeek trauma-informed grief counseling or support groups for sudden or violent loss.\n\nProtect sleep and basic routines when possible.\n\nBe patient with anger, numbness, and fear as part of the process.',
    support:
      `${CRISIS_SUPPORT}\n\nSeek professional evaluation if grief includes persistent flashbacks, panic, inability to function, or thoughts of not wanting to live.`,
    related: [
      'How can I support someone grieving a traumatic death?',
      'When does grief become something I should get help for?',
      'Why do I isolate myself when I am struggling?',
      'Can loneliness affect my mental health?',
      'What should I do if I have no one to talk to?',
    ],
    schemaAnswer:
      'Trauma can shape grief through shock, intrusive memories, and hypervigilance after sudden or violent loss; trauma-informed grief support addresses both mourning and safety fears.',
    themes: ['Trauma', 'Grief', 'Loss', 'Recovery'],
    refs: [PTSD, GRIEF, NIMH],
    gaps: ['Verify trauma-grief framing stays non-diagnostic before review.'],
  }),
  'support-someone-grieving-a-traumatic-death': draft({
    question: 'How can I support someone grieving a traumatic death?',
    slug: 'support-someone-grieving-a-traumatic-death',
    category: 'Trauma & Grief',
    title: 'Support After a Traumatic Death',
    meta: 'After traumatic loss, show up consistently, avoid fixing or comparing grief, and watch for crisis signs. Practical help and patience matter.',
    summary:
      'Supporting someone after a traumatic death means showing up without trying to fix their pain. Sudden or violent losses may bring shock, intrusive images, guilt, and fear alongside grief. Practical help, consistent presence, and patience matter more than perfect words.',
    takeaways: [
      'Traumatic grief may include shock, fear, and intrusive memories.',
      'Presence and practical help often matter more than advice.',
      'Avoid comparing losses or rushing them to feel better.',
      'Watch for crisis signs and connect them to professional help if needed.',
    ],
    happening:
      'They may seem numb one day and overwhelmed the next.\n\nNews stories, anniversaries, or legal processes can re-trigger trauma long after the funeral.',
    help:
      'Say simply: "I am here. You do not have to be okay."\n\nOffer concrete help: meals, childcare, paperwork, rides, or sitting quietly together.\n\nDo not press for details about the death unless they choose to share.\n\nAvoid clichés like "everything happens for a reason."\n\nCheck in regularly for months, not only the first week.\n\nLearn warning signs of severe depression, substance use, or self-harm risk.',
    support:
      `${CRISIS_SUPPORT}\n\nIf the grieving person expresses thoughts of self-harm, harming others, or inability to stay safe, contact 988 or emergency services and stay with them if you can do so safely.`,
    related: [
      'Can trauma affect grief?',
      'When does grief become something I should get help for?',
      'What should I do if I have no one to talk to?',
      'Why do I isolate myself when I am struggling?',
      'Can loneliness affect my mental health?',
    ],
    schemaAnswer:
      'Support someone after traumatic death with consistent presence, practical help, nonjudgmental listening, and attention to crisis signs without trying to fix their grief.',
    themes: ['Grief support', 'Trauma', 'Caregiving', 'Crisis awareness'],
    refs: [GRIEF, NIMH, PTSD],
    careNote: `${CARE} If the person you are supporting may harm themselves or others, call or text 988 in the U.S. or seek emergency help.`,
  }),
  'figure-out-who-i-am-outside-other-peoples-expectations': draft({
    question: 'How do I figure out who I am outside of what other people expect?',
    slug: 'figure-out-who-i-am-outside-other-peoples-expectations',
    category: 'Identity & Self-Worth',
    title: 'Who You Are Beyond Others\' Expectations',
    meta: 'Identity grows by noticing values, curiosity, and boundaries rather than performing roles. Small experiments and honest reflection help over time.',
    summary:
      'Figuring out who you are outside others\' expectations is gradual work. Many people were praised for meeting family, cultural, or social roles rather than exploring personal values. Identity builds through noticing what energizes you, what angers you on others\' behalf, and where you want stronger boundaries.',
    takeaways: [
      'Identity develops through exploration, not one sudden answer.',
      'Others\' expectations may have crowded out self-discovery.',
      'Values, curiosity, and boundaries reveal who you are becoming.',
      'Small experiments teach more than performing a fixed persona.',
    ],
    happening:
      'You may excel at what others want and feel empty when no one is watching.\n\nGuilt can appear when you consider choices that disappoint parents, partners, or community expectations.',
    help:
      'Journal: What do I choose when no one is grading me?\n\nTry low-stakes experiments: a class, volunteer role, creative project, or new routine.\n\nPractice one boundary that protects time for your interests.\n\nNotice who accepts you when you disagree or change direction.\n\nSeparate respect for others from automatic agreement.\n\nWork with a therapist if identity confusion feels overwhelming or tied to trauma.',
    support:
      `${SUPPORT}\n\nSeek therapy if losing old roles triggers panic, depression, or conflict you cannot navigate safely.`,
    related: [
      'Why do I feel guilty when I rest?',
      'How can teens build confidence without pretending to be someone else?',
      'How can I stop comparing myself to everyone else?',
      'Why do I feel like I am not good enough?',
      'How do I make time for myself when everyone needs something from me?',
    ],
    schemaAnswer:
      'Discover who you are outside others\' expectations by exploring values, trying small experiments, setting boundaries, and noticing what feels authentically yours over time.',
    themes: ['Identity', 'Values', 'Boundaries', 'Self-discovery'],
  }),
  'why-do-i-feel-guilty-when-i-rest': draft({
    question: 'Why do I feel guilty when I rest?',
    slug: 'why-do-i-feel-guilty-when-i-rest',
    category: 'Work & Life Balance',
    title: 'Guilt About Rest',
    meta: 'Rest guilt often comes from productivity culture, caregiving overload, or childhood messages that worth equals output. Rest is necessary, not lazy.',
    summary:
      'Feeling guilty when you rest is common in cultures that tie worth to productivity. Caregivers, high achievers, and people from demanding families may feel lazy or selfish when they stop. Rest is a biological need, not a moral test.',
    takeaways: [
      'Rest guilt often reflects learned beliefs, not actual wrongdoing.',
      'Productivity culture treats rest as failure rather than recovery.',
      'Caregiving roles can make personal downtime feel selfish.',
      'Scheduled rest protects health, mood, and long-term performance.',
    ],
    happening:
      'You may sit down and immediately think of unfinished tasks or people who need you.\n\nChildhood praise for being helpful or "low maintenance" can make stillness feel dangerous.',
    help:
      'Name the belief: "Rest is lazy" and ask whether you would say that to a friend.\n\nSchedule rest like an appointment rather than waiting until collapse.\n\nStart with short breaks if full days off feel impossible.\n\nList what rest enables: patience, health, clearer thinking.\n\nShare load with others where possible instead of solo heroics.\n\nConsider therapy if guilt is tied to burnout, anxiety, or trauma.',
    support:
      `${SUPPORT}\n\nSeek support if inability to rest drives exhaustion, health problems, or resentment that affects relationships.`,
    related: [
      'How do I make time for myself when everyone needs something from me?',
      'Why does work stress make me irritable at home?',
      'How do I figure out who I am outside of what other people expect?',
      'Why do I feel like I am not good enough?',
      'Can loneliness affect my mental health?',
    ],
    schemaAnswer:
      'Rest guilt often comes from productivity culture and caregiving overload; treating rest as necessary recovery and scheduling it intentionally can reduce shame over time.',
    themes: ['Rest', 'Burnout', 'Productivity guilt', 'Self-care'],
    refs: [BURNOUT, NIMH],
  }),
  'what-to-do-if-my-teen-says-they-hate-themselves': draft({
    question: 'What should I do if my teen says they hate themselves?',
    slug: 'what-to-do-if-my-teen-says-they-hate-themselves',
    category: 'Teen-Specific Questions',
    title: 'When Your Teen Says They Hate Themselves',
    meta: 'Stay calm, listen without dismissing, ask about safety directly, and seek professional help if self-harm risk is present. Your response matters.',
    summary:
      'If your teen says they hate themselves, take it seriously while staying calm. Listen without minimizing, ask directly about safety and self-harm, and connect them to professional support if needed. Your steady response can reduce shame and open the door to help.',
    takeaways: [
      'Self-hateful statements deserve a calm, serious response.',
      'Listen first; avoid jumping to fixes or dismissing as drama.',
      'Ask directly and clearly about self-harm and safety.',
      'Professional help is appropriate when distress is persistent or unsafe.',
    ],
    happening:
      'Your teen may be overwhelmed by shame, bullying, identity stress, depression, or feeling like a burden.\n\nThey might test whether you will panic, punish, or dismiss them before sharing more.',
    help:
      'Stay regulated: "Thank you for telling me. I am here."\n\nListen more than you lecture; reflect what you hear.\n\nAsk directly: "Are you having thoughts of hurting yourself or not wanting to be alive?"\n\nAvoid shaming language about attention-seeking; take words at face value.\n\nReduce immediate stress where possible: sleep, school pressure, conflict.\n\nSchedule a pediatrician, therapist, or crisis evaluation if safety is unclear.',
    support: TEEN_PARENT_CRISIS,
    related: [
      'How can teens build confidence without pretending to be someone else?',
      'What should I do if I feel different from everyone at school?',
      'Why does social media make me feel worse about myself?',
      'When does grief become something I should get help for?',
      'What should I do if I have no one to talk to?',
    ],
    schemaAnswer:
      'If your teen says they hate themselves, stay calm, listen, ask directly about self-harm and safety, and connect them to professional or crisis support if needed.',
    themes: ['Parenting teens', 'Self-harm risk', 'Crisis response', 'Self-worth'],
    careNote: `${CARE} If your teen may be at risk of self-harm, ask about safety directly and call or text 988 in the U.S. or seek emergency care if there is immediate danger.`,
  }),
  'how-can-couples-rebuild-trust-after-lying': draft({
    question: 'How can couples rebuild trust after lying?',
    slug: 'how-can-couples-rebuild-trust-after-lying',
    category: 'Relationships & Communication',
    title: 'Rebuild Trust After Lying',
    meta: 'Trust repair requires full honesty, accountability, patience, and changed behavior over time. Both partners must want repair; it cannot be rushed.',
    summary:
      'Rebuilding trust after lying is possible for some couples, but it takes time, full honesty, accountability, and consistent changed behavior. The partner who lied must understand the impact, answer questions patiently, and accept that trust returns slowly. Both people must want repair.',
    takeaways: [
      'Trust repair requires honesty, accountability, and time.',
      'The hurt partner needs space for anger and questions.',
      'Changed behavior matters more than promises alone.',
      'Couples therapy can help when repair feels stuck or unsafe.',
    ],
    happening:
      'The betrayed partner may replay discoveries, scan for new deception, or shut down to protect themselves.\n\nThe partner who lied may want forgiveness quickly while the other still feels unsafe.',
    help:
      'The person who lied should take full responsibility without blaming the partner\'s reaction.\n\nOffer complete transparency about what happened and what will change.\n\nExpect repeated questions; patience is part of repair.\n\nAgree on concrete boundaries: phone access, timelines, check-ins, or therapy attendance.\n\nDemonstrate reliability in small daily actions over months.\n\nConsider couples therapy with a trust-repair focus.',
    support:
      `${SUPPORT}\n\nSeek individual or couples therapy if lying involved abuse, coercion, or if either partner feels unsafe continuing the relationship.`,
    related: [
      'How do I ask for reassurance without pushing my partner away?',
      'How do I tell my partner I feel disconnected?',
      'What should I do if my partner refuses to talk about problems?',
      'Why do I miss someone who treated me badly?',
      'Can low self-esteem affect relationships?',
    ],
    schemaAnswer:
      'Couples rebuild trust after lying through full accountability, transparent behavior, patience with the hurt partner\'s process, and often professional support over time.',
    themes: ['Trust', 'Relationships', 'Honesty', 'Repair'],
  }),
  'make-time-for-myself-when-everyone-needs-something': draft({
    question: 'How do I make time for myself when everyone needs something from me?',
    slug: 'make-time-for-myself-when-everyone-needs-something',
    category: 'Work & Life Balance',
    title: 'Make Time for Yourself Amid Demands',
    meta: 'When everyone needs you, small protected blocks, shared load, and clear limits help. You cannot pour from an empty cup indefinitely.',
    summary:
      'When everyone needs something from you, personal time can feel impossible or selfish. Caregivers, parents, and helpers often put themselves last until exhaustion hits. Small protected blocks, clearer limits, and shared load can create breathing room without abandoning responsibilities.',
    takeaways: [
      'Constant availability often leads to burnout, not better care for others.',
      'Small protected time blocks can help even when life is crowded.',
      'Shared load and clearer limits reduce one-person overload.',
      'Rest supports your ability to show up sustainably over time.',
    ],
    happening:
      'You may finish everyone else\'s urgent tasks and collapse with none of your own needs met.\n\nGuilt and fear of disappointing others can make "no" feel dangerous even when you are depleted.',
    help:
      'Identify one nonnegotiable 15 to 30 minute block most days for rest or something you enjoy.\n\nList tasks only you can do versus tasks others could share.\n\nPractice brief scripts: "I cannot take that on today, but I can help tomorrow."\n\nAsk family, coworkers, or friends for specific help rather than vague support.\n\nReduce optional commitments that drain you without aligning with values.\n\nTreat personal time as maintenance, not luxury.',
    support:
      `${SUPPORT}\n\nSeek therapy or caregiver support if depletion drives irritability, health problems, or resentment you cannot manage alone.`,
    related: [
      'Why do I feel guilty when I rest?',
      'Why does work stress make me irritable at home?',
      'How do I figure out who I am outside of what other people expect?',
      'Why do I isolate myself when I am struggling?',
      'Can loneliness affect my mental health?',
    ],
    schemaAnswer:
      'Make time for yourself amid competing demands by protecting small daily blocks, sharing load, setting clear limits, and treating rest as necessary maintenance.',
    themes: ['Caregiving', 'Boundaries', 'Burnout', 'Self-care'],
    refs: [BURNOUT, NIMH],
  }),
  'partner-refuses-to-talk-about-problems': draft({
    question: 'What should I do if my partner refuses to talk about problems?',
    slug: 'partner-refuses-to-talk-about-problems',
    category: 'Relationships & Communication',
    title: 'When Your Partner Won\'t Talk About Problems',
    meta: 'Avoidance may reflect fear, overwhelm, or unhealthy control. Name the pattern calmly, suggest timing and therapy, and prioritize safety if silence is punitive.',
    summary:
      'When a partner refuses to talk about problems, the relationship can feel stuck and lonely. Avoidance may come from conflict fear, overwhelm, poor skills, or unhealthy control. Calm naming of the pattern, structured timing, and therapy can help. Punitive silence or intimidation may signal abuse.',
    takeaways: [
      'Avoidance is common and may come from fear or poor skills.',
      'Calm, timed conversations work better than ambush arguments.',
      'Couples therapy offers a safer structure for hard topics.',
      'Silent treatment used to punish or control may be abusive.',
    ],
    happening:
      'You may raise concerns and hear "not now," shutdown, or days of cold silence.\n\nImportant issues pile up while resentment grows on both sides.',
    help:
      'Choose a specific time: "Can we talk about us Saturday morning for 30 minutes?"\n\nUse "I" statements about impact: "When we do not talk, I feel alone with the problem."\n\nSuggest couples therapy as neutral ground if direct talks fail.\n\nNotice whether refusal includes mockery, threats, or weeks of punishment.\n\nDecide what you can accept long term if patterns never change.\n\nBuild support outside the relationship so isolation does not trap you.',
    support: ABUSE_SUPPORT,
    related: [
      'How do I tell my partner I feel disconnected?',
      'How can couples rebuild trust after lying?',
      'How do I ask for reassurance without pushing my partner away?',
      'Why do I miss someone who treated me badly?',
      'Can low self-esteem affect relationships?',
    ],
    schemaAnswer:
      'If your partner refuses to discuss problems, name the pattern calmly, schedule structured talks, consider couples therapy, and prioritize safety if silence is used to punish or control.',
    themes: ['Communication', 'Avoidance', 'Relationships', 'Safety'],
    careNote: `${CARE} If refusal to talk is paired with intimidation, control, or fear for your safety, contact the National Domestic Violence Hotline at 1-800-799-7233.`,
  }),
  'when-to-get-help-for-grief': draft({
    question: 'When does grief become something I should get help for?',
    slug: 'when-to-get-help-for-grief',
    category: 'Grief & Loss',
    title: 'When to Get Help for Grief',
    meta: 'Grief has no fixed timeline, but seek help if sadness impairs daily life, safety feels at risk, or pain stays intense with no relief over time.',
    summary:
      'Grief has no single correct timeline, but professional support may help when sadness persistently impairs daily life, safety feels at risk, or intense pain shows no moments of relief over many months. Seeking help is strength, not failure to grieve "correctly."',
    takeaways: [
      'Grief varies widely; there is no one right schedule.',
      'Help may be useful when daily life stays impaired for a long time.',
      'Thoughts of self-harm or not wanting to live require urgent support.',
      'Therapists and grief groups offer space without rushing your process.',
    ],
    happening:
      'You may function at work but collapse at home, or stop functioning entirely.\n\nAnniversaries, holidays, and quiet moments can reopen pain that feels as fresh as day one.',
    help:
      'Track whether you can eat, sleep, work, and connect at least minimally.\n\nNotice if guilt, anger, or numbness dominate every day without breaks.\n\nConsider a grief counselor or support group for sudden, traumatic, or isolating losses.\n\nAsk your doctor if physical symptoms or medication questions arise.\n\nTell someone you trust if thoughts of death feel like escape rather than abstract sadness.\n\nGive yourself permission to seek help before hitting rock bottom.',
    support:
      `${CRISIS_SUPPORT}\n\nSeek professional grief support if daily functioning remains severely impaired, if you cannot care for yourself, or if suicidal thoughts appear.`,
    related: [
      'Can trauma affect grief?',
      'How can I support someone grieving a traumatic death?',
      'How can I cope with loneliness after a breakup?',
      'Why do I isolate myself when I am struggling?',
      'What should I do if I have no one to talk to?',
    ],
    schemaAnswer:
      'Consider professional grief help when daily life stays impaired, safety feels at risk, or intense pain persists without relief; grief timelines vary and seeking support is not failure.',
    themes: ['Grief', 'Help-seeking', 'Loss', 'Mental health'],
    refs: [GRIEF, NIMH],
    gaps: ['Avoid naming specific grief disorders; keep language evaluative not diagnostic.'],
  }),
  'why-do-i-isolate-myself-when-struggling': draft({
    question: 'Why do I isolate myself when I am struggling?',
    slug: 'why-do-i-isolate-myself-when-struggling',
    category: 'Loneliness & Isolation',
    title: 'Isolating When You Are Struggling',
    meta: 'Withdrawal during hard times may protect you from judgment, save energy, or reflect depression. Gentle reconnection and support often help.',
    summary:
      'Isolating when struggling is a common protective response. Shame, exhaustion, depression, anxiety, or past rejection may make contact feel costly. Withdrawal can briefly reduce stress but often deepens loneliness and makes recovery harder.',
    takeaways: [
      'Withdrawal during distress is common and often protective at first.',
      'Shame and low energy can make reaching out feel impossible.',
      'Isolation may worsen mood even when solitude felt safer.',
      'Small reconnection steps and professional support can interrupt the cycle.',
    ],
    happening:
      'You may cancel plans, leave messages unread, or tell people you are fine while feeling overwhelmed alone.\n\nYour nervous system may treat people as extra demand when you are already at capacity.',
    help:
      'Name the pull to isolate without judging it: "I am protecting myself right now."\n\nChoose one low-effort connection: a text, voice memo, or short walk with someone safe.\n\nShare a small truth instead of performing wellness.\n\nSet a timer for social contact rather than forcing all-day events.\n\nAddress basics: sleep, food, and movement often reduce withdrawal urges.\n\nSeek therapy if isolation lasts weeks and mood keeps dropping.',
    support:
      `${CRISIS_SUPPORT}\n\nSeek evaluation if withdrawal accompanies persistent low mood, hopelessness, or thoughts of self-harm.`,
    related: [
      'What should I do if I have no one to talk to?',
      'Why do I feel lonely even when I am around people?',
      'Can loneliness affect my mental health?',
      'Why do I feel like I am not good enough?',
      'When does grief become something I should get help for?',
    ],
    schemaAnswer:
      'Isolating when struggling often reflects shame, exhaustion, or mood changes; gentle reconnection, basic self-care, and therapy can help without forcing instant socializing.',
    themes: ['Isolation', 'Depression', 'Coping', 'Connection'],
    refs: [DEPRESSION, NIMH],
    gaps: ['Present multiple explanations; do not assume depression alone.'],
  }),
  'why-work-stress-makes-me-irritable-at-home': draft({
    question: 'Why does work stress make me irritable at home?',
    slug: 'why-work-stress-makes-me-irritable-at-home',
    category: 'Work, Stress & Burnout',
    title: 'Work Stress Spilling Over at Home',
    meta: 'Work stress can drain patience and emotional bandwidth, so home gets the leftover irritability. Transitions, boundaries, and decompression help.',
    summary:
      'Work stress often spills into home life because stress drains emotional bandwidth and self-control. You may use more energy managing professionalism at work, then have less patience for partners, kids, or roommates. This pattern is common and can improve with transitions, boundaries, and recovery time.',
    takeaways: [
      'Stress spillover is common when work demands exceed recovery time.',
      'Self-control used at work may leave little patience at home.',
      'Transition rituals help separate work mode from home mode.',
      'Boundaries and rest reduce irritability over time.',
    ],
    happening:
      'You may sit in traffic replaying emails and walk in the door already tense.\n\nSmall home frustrations can feel enormous when your nervous system is still in work fight-or-flight.',
    help:
      'Build a transition ritual: walk, shower, music, or five minutes alone before engaging family.\n\nName stress out loud: "Work was rough today; I need a minute to decompress."\n\nSet boundaries on after-hours email when possible.\n\nProtect sleep and movement; exhaustion lowers frustration tolerance.\n\nRepair quickly after snapping: apologize and explain stress without excusing harm.\n\nConsider therapy or job changes if stress stays chronic and unsustainable.',
    support:
      `${SUPPORT}\n\nSeek help if irritability becomes yelling, aggression, or if work stress drives substance use or thoughts of self-harm.`,
    related: [
      'Why do I feel guilty when I rest?',
      'How do I make time for myself when everyone needs something from me?',
      'Can loneliness affect my mental health?',
      'Why do I isolate myself when I am struggling?',
      'How do I tell my partner I feel disconnected?',
    ],
    schemaAnswer:
      'Work stress often causes home irritability by draining emotional bandwidth; transition rituals, boundaries, decompression, and rest can reduce spillover over time.',
    themes: ['Work stress', 'Burnout', 'Relationships', 'Emotional regulation'],
    refs: [BURNOUT, NIMH],
  }),
  'can-loneliness-affect-my-mental-health': draft({
    question: 'Can loneliness affect my mental health?',
    slug: 'can-loneliness-affect-my-mental-health',
    category: 'Loneliness & Isolation',
    title: 'Loneliness and Mental Health',
    meta: 'Loneliness can affect sleep, mood, stress, and physical health over time. Connection is a health need; support and small steps can help.',
    summary:
      'Loneliness can affect mental and physical health. Persistent loneliness may worsen sleep, mood, stress levels, and sense of hope. Public health research links social connection to overall wellbeing. Treating loneliness as a health issue, not a personal flaw, opens the door to helpful steps.',
    takeaways: [
      'Loneliness is a common health concern, not a character flaw.',
      'Ongoing loneliness may affect sleep, mood, and stress over time.',
      'Emotional connection matters as much as being around people.',
      'Support groups, therapy, and small social steps can help.',
    ],
    happening:
      'You may feel tired, sad, or on edge even without a clear "reason" besides disconnection.\n\nLoneliness can grow slowly after moves, losses, illness, or long periods of working alone.',
    help:
      'Treat loneliness as worth addressing, like sleep or exercise.\n\nDistinguish being alone from feeling emotionally unseen.\n\nTake repeatable small steps: a class, volunteer shift, faith community, or regular call with one friend.\n\nConsider therapy if loneliness fuels persistent low mood or anxiety.\n\nExplore support groups where shared experience reduces shame.\n\nLimit isolation spirals on days when reaching out feels hardest.',
    support:
      `${SUPPORT}\n\nSeek help if loneliness accompanies persistent depression, anxiety, or thoughts of self-harm.`,
    related: [
      'Why do I feel lonely even when I am around people?',
      'What should I do if I have no one to talk to?',
      'Why do I isolate myself when I am struggling?',
      'How can I cope with loneliness after a breakup?',
      'Can low self-esteem affect relationships?',
    ],
    schemaAnswer:
      'Loneliness can affect mental and physical health over time; treating connection as a health need and taking supported social steps often helps.',
    themes: ['Loneliness', 'Mental health', 'Social connection', 'Wellbeing'],
  }),
};

const candidates = JSON.parse(
  readFileSync('reports/phase-1b/visit-priority/batch-25-candidates.json', 'utf8'),
);

const drafts = candidates.map((row) => {
  const item = CONTENT[row.slug];
  if (!item) throw new Error(`Missing draft content for slug: ${row.slug}`);
  if (item.question !== row.question) {
    throw new Error(`Question mismatch for ${row.slug}`);
  }
  if (item.category !== row.category) {
    throw new Error(`Category mismatch for ${row.slug}: ${item.category} vs ${row.category}`);
  }
  return {
    ...item,
    source_refs: mergeRefs(item.source_refs, row.source_refs),
    safety_flags: row.safety_flags,
    draft_notes: row.notes || item.draft_notes,
  };
});

const outPath = 'reports/phase-1b/visit-priority/batch-25-drafts.json';
writeFileSync(outPath, `${JSON.stringify(drafts, null, 2)}\n`);
console.log(`Wrote ${drafts.length} drafts to ${outPath}`);
