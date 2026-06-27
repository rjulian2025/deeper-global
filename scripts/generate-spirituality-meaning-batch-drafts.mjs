#!/usr/bin/env node
/**
 * Generate Part C Spirituality & Meaning batch files (15 candidates).
 *
 *   node scripts/generate-spirituality-meaning-batch-drafts.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { CANDIDATES } from './lib/spirituality-meaning-candidates.mjs';

const OUT_DIR = 'reports/phase-1b/spirituality-meaning';
const CARE =
  'This information is general guidance, not a substitute for care from a licensed mental health professional. If distress becomes overwhelming, call or text 988 in the U.S. or seek emergency care.';
const SUPPORT =
  'Consider professional support if symptoms persistently interfere with daily life, relationships, or safety. Seek urgent help if you are having thoughts of self-harm or feel unable to stay safe; in the U.S., call or text 988.';
const CRISIS_SUPPORT = `${SUPPORT}\n\nIf you are having thoughts of self-harm or feel unable to stay safe, call or text 988 in the U.S. or seek emergency care now.`;

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
const GRIEF = {
  title: 'Coping with Grief and Loss',
  url: 'https://www.nimh.nih.gov/health/publications/coping-with-grief-and-loss',
  publisher: 'NIMH',
  note: 'Supports understanding grief as a personal, non-linear process.',
};

function draft(candidate, content) {
  const flags = candidate.crisis_safety_flag ? ['crisis-sensitive', 'mortality-or-suffering'] : ['none'];
  const refs = candidate.reviewer_class === 'b' ? [NIMH, CDC, GRIEF] : [NIMH, CDC];
  return {
    question: candidate.question,
    slug: candidate.slug,
    category: candidate.category,
    review_status: 'draft',
    indexation_instruction: 'noindex_until_reviewed',
    improved_title: content.title,
    improved_meta_description: content.meta,
    improved_summary: content.summary,
    key_takeaways: content.takeaways,
    answer_sections: [
      { type: 'section', heading: 'What may be happening', body: content.happening },
      { type: 'section', heading: 'What can help', body: content.help },
      {
        type: 'section',
        heading: 'When to get support',
        body: content.support || (candidate.crisis_safety_flag ? CRISIS_SUPPORT : SUPPORT),
      },
    ],
    care_note: CARE,
    related_questions: content.related,
    suggested_schema_question: candidate.question,
    suggested_schema_answer: content.schemaAnswer,
    primary_theme: candidate.category,
    related_themes: content.themes,
    source_refs: refs,
    citation_gaps: [],
    safety_flags: flags,
    draft_notes: `Part C gap #${candidate.gap_id}. Reviewer class ${candidate.reviewer_class} → target ${candidate.target_reviewed_by} after human review. Run rewrite pipeline before promote.`,
    gap_id: candidate.gap_id,
    reviewer_class: candidate.reviewer_class,
    target_reviewed_by: candidate.target_reviewed_by,
    crisis_safety_flag: candidate.crisis_safety_flag,
  };
}

const CONTENT = {
  'how-do-i-tell-my-partner-im-no-longer-religious': {
    title: 'Tell Your Partner You Are No Longer Religious',
    meta: 'Disclosing a faith change to your partner takes timing, honesty, and room for their reaction. Plan the conversation with care.',
    summary:
      'Telling your partner you are no longer religious can feel high-stakes because belief often shapes holidays, parenting, and identity. A clear, compassionate conversation can reduce secrecy and help you both decide what comes next.',
    takeaways: [
      'Choose a calm time; avoid ambushing your partner during conflict or a holiday.',
      'Lead with honesty about your experience, not a debate about who is right.',
      'Expect mixed emotions; their reaction is not fully within your control.',
      'Discuss practical implications: rituals, children, extended family, and shared values.',
      'Repeated conversations are normal; one talk rarely settles everything.',
    ],
    happening:
      'You may have been hiding doubt for months, or the shift may have happened quickly after a loss or moral disagreement. Secrecy can create distance even when you still love your partner.\n\nYou might fear they will feel betrayed, worry about the relationship ending, or assume you must pretend for peace. Those fears are understandable, and they do not mean you should stay silent forever.',
    help:
      'Name what changed for you: beliefs, practices, or sense of belonging. Use "I" statements and specific examples rather than sweeping labels.\n\nAsk what they need to feel respected while you live authentically. Listen without trying to win.\n\nIf you share children, agree on interim boundaries for rituals and language before larger decisions.\n\nConsider couples counseling with someone neutral about belief if conversations stall or turn hostile.',
    related: [
      'How do I explain my spiritual journey to family who still believe?',
      'What do I do when my family rejects me for changing my beliefs?',
      'How do I respect my family\'s faith while I no longer believe?',
    ],
    schemaAnswer:
      'Tell your partner during a calm, private moment, describe your experience honestly, and make space for their feelings while discussing practical next steps together.',
    themes: ['Faith transitions', 'Relationships', 'Disclosure', 'Spiritual Doubt'],
  },
  'is-it-normal-to-grieve-the-loss-of-my-faith-like-a-death': {
    title: 'Grieving the Loss of Faith Can Feel Like a Death',
    meta: 'Faith loss can trigger real grief: community, certainty, and identity may feel gone. That response is common and worth taking seriously.',
    summary:
      'Losing faith can resemble bereavement because you may lose community, rituals, moral certainty, and a story about who you are. Grief after faith loss is a normal human response, not a sign that you are broken.',
    takeaways: [
      'Faith loss can end relationships, routines, and a sense of cosmic belonging.',
      'Grief waves, anger, and numbness are common; timelines vary widely.',
      'Naming the loss as grief can reduce shame and confusion.',
      'Support groups or therapy can help when grief impairs daily life.',
      'Healing does not require returning to former beliefs.',
    ],
    happening:
      'You might miss prayer, worship, or the feeling that someone is watching over you. Holidays can feel hollow. Friends from your old community may pull away.\n\nBecause faith loss is not always socially recognized, people may tell you to "just move on." That can make the grief lonelier.',
    help:
      'Treat the transition as a loss: allow sadness, anger, and nostalgia without rushing to replace everything.\n\nWrite down what you miss most (community, certainty, music, service) and explore secular or new-spiritual substitutes where possible.\n\nStay connected to one or two trusted people who can witness the grief without fixing it.\n\nIf sleep, appetite, or mood stay impaired for weeks, seek professional support to rule out depression overlapping with grief.',
    related: [
      'How do I cope with losing my faith?',
      'Is it normal to miss aspects of my old faith?',
      'How do I find meaning after leaving organized religion?',
    ],
    schemaAnswer:
      'Yes, grieving faith loss like a death is common because you may lose community, identity, and meaning structures, and that deserves compassionate acknowledgment.',
    themes: ['Faith transitions', 'Grief', 'Spiritual Doubt'],
  },
  'what-is-faith-deconstruction-and-how-is-it-different-from-a-crisis-of-faith': {
    title: 'Faith Deconstruction vs. Crisis of Faith',
    meta: 'Faith deconstruction is often gradual questioning; a crisis of faith is acute destabilization. Both are valid, but they feel different.',
    summary:
      'Faith deconstruction usually describes a gradual re-examination of beliefs, institutions, and inherited theology. A crisis of faith is often sudden, emotionally intense, and can feel like the ground disappearing. Knowing the difference can reduce self-blame.',
    takeaways: [
      'Deconstruction tends to be iterative; crisis tends to feel urgent and disorienting.',
      'Both can coexist: a slow drift can erupt into acute panic.',
      'Neither requires an immediate final answer about belief.',
      'Community and skilled support help in both patterns.',
      'Leaving or staying is not the only outcome; many people rebuild hybrid beliefs.',
    ],
    happening:
      'In deconstruction you might read, debate, and revise beliefs over years. In crisis you might lose sleep, fear moral collapse, or feel unable to function until the question is "settled."\n\nCrisis can follow trauma, betrayal by leaders, or a single insight that reframes everything.',
    help:
      'If you are deconstructing, pace yourself: not every doubt needs a public announcement.\n\nIf you are in crisis, prioritize stabilization: sleep, safety, and one trusted listener before big life decisions.\n\nJournal what you still value even when doctrines fall away.\n\nSeek therapy if anxiety, panic, or hopelessness dominate daily life.',
    related: [
      'What do I do when I\'m losing faith in everything I was taught?',
      'Why am I questioning all my beliefs in midlife?',
      'How do I find meaning when I no longer believe what I was taught?',
    ],
    schemaAnswer:
      'Faith deconstruction is usually gradual belief review; a crisis of faith is acute destabilization. Both are valid paths that benefit from support and time.',
    themes: ['Faith deconstruction', 'Spiritual Doubt', 'Meaning'],
  },
  'how-do-i-live-with-knowing-everyone-i-love-will-die-someday': {
    title: 'Living With the Knowledge That Everyone You Love Will Die',
    meta: 'Mortality awareness can bring dread or deeper presence. Learn to hold the truth without constant panic.',
    summary:
      'Knowing that everyone you love will die someday is an unavoidable part of being human. For some people that truth brings panic; for others it sharpens gratitude and priorities. Both reactions can coexist over time.',
    takeaways: [
      'Mortality awareness is not a disorder by itself; intensity and impairment matter.',
      'Avoidance and compulsive reassurance often increase anxiety over time.',
      'Meaningful presence with loved ones can transform dread into connection.',
      'Professional help helps when fear dominates sleep, mood, or daily function.',
      'Crisis support is available if thoughts turn toward self-harm.',
    ],
    happening:
      'The thought may arrive at night, after a health scare, or when someone close ages. You might scan for danger constantly or feel guilty for enjoying ordinary moments.\n\nWithout a comforting afterlife narrative, the fear can feel sharper. That does not mean you are failing spiritually or emotionally.',
    help:
      'Practice grounding when spirals start: name five things you see, four you feel, three you hear.\n\nChannel awareness into intentional time with people you love rather than endless "what if" loops.\n\nLimit doom-scrolling and late-night rumination triggers.\n\nExplore philosophy or spiritual traditions that address impermanence without promising false certainty.',
    related: [
      'How do I cope with the fear that death means complete annihilation?',
      'How do I deal with existential anxiety about meaning and mortality?',
      'How do I find meaning in life when everything feels pointless?',
    ],
    schemaAnswer:
      'Living with mortality means learning to hold the truth without constant panic: grounding practices, meaningful connection, and professional support when fear impairs daily life.',
    themes: ['Mortality', 'Existential anxiety', 'Spiritual Struggle'],
  },
  'how-do-i-talk-to-my-children-about-death-without-an-afterlife': {
    title: 'Talk to Children About Death Without an Afterlife Belief',
    meta: 'Honest, age-appropriate language about death helps children feel safe. You can be truthful without every detail.',
    summary:
      'Children notice death early. If you no longer believe in an afterlife, you can still offer honesty, reassurance, and room for questions without promising certainties you do not hold.',
    takeaways: [
      'Match language to age; younger children need simple, concrete words.',
      'It is okay to say "I don\'t know" about ultimate mysteries.',
      'Emphasize love, memory, and how we care for one another while alive.',
      'Watch for persistent fear, sleep problems, or withdrawal after hard conversations.',
      'Seek child-focused support if anxiety about death persists.',
    ],
    happening:
      'You may worry you will frighten your child or contradict relatives who teach afterlife beliefs. You might also be processing your own mortality questions while trying to sound steady.',
    help:
      'Use clear words ("die," "body stops working") rather than euphemisms that confuse young children.\n\nShare what you do believe: love lasts in memory, we honor people by how we live, we can talk anytime.\n\nInvite questions and revisit the topic; one conversation is rarely enough.\n\nCoordinate with co-parents or grandparents when possible to reduce mixed messages.\n\nIf a pet or relative dies, allow rituals that fit your family without doctrinal claims.',
    related: [
      'How do I live with knowing everyone I love will die someday?',
      'How do I cope with the fear that death means complete annihilation?',
      'How do I respect my family\'s faith while I no longer believe?',
    ],
    schemaAnswer:
      'Use age-appropriate honesty, emphasize love and memory, allow questions, and seek support if a child\'s death anxiety persists or impairs sleep and mood.',
    themes: ['Parenting', 'Mortality', 'Secular framing'],
  },
  'why-does-achieving-my-goals-leave-me-feeling-empty': {
    title: 'Why Achieving Goals Can Still Feel Empty',
    meta: 'Success without fulfillment often signals a values gap, not failure. Reconnect with what actually matters to you.',
    summary:
      'Reaching a goal you worked hard for and still feeling empty can be disorienting. Often the achievement satisfied external expectations while neglecting deeper values, connection, or meaning.',
    takeaways: [
      'Hollow success is common after milestone-focused living.',
      'The goal may have been someone else\'s definition of winning.',
      'Rest and integration time after achievement are normal.',
      'Values clarification can redirect energy toward fulfilling aims.',
      'Persistent emptiness across domains may warrant professional support.',
    ],
    happening:
      'You might have chased promotion, marriage, fitness, or financial targets assuming fulfillment would follow. When it does not, shame can add a second layer: "I should be grateful."\n\nSometimes the emptiness appears because the goal avoided a harder question about purpose or belonging.',
    help:
      'List what you hoped the goal would give you (security, respect, freedom) and ask whether other paths could provide it.\n\nSchedule unstructured time before launching the next target.\n\nTalk with someone you trust about whether your ladder was leaning against the right wall.\n\nExperiment with contribution, creativity, or service sized to your current capacity.',
    related: [
      'Why do I feel spiritually empty despite having everything I wanted?',
      'Why do I feel like life has no meaning or purpose?',
      'Is it okay if I never find a single life purpose?',
    ],
    schemaAnswer:
      'Post-achievement emptiness often reflects a values or meaning gap rather than personal failure; reconnect with what matters beyond external milestones.',
    themes: ['Meaning', 'Success', 'Existential emptiness'],
  },
  'is-it-okay-if-i-never-find-a-single-life-purpose': {
    title: 'You Do Not Need One Fixed Life Purpose',
    meta: 'A single grand purpose is a cultural story, not a requirement. Meaning can be built in seasons and small commitments.',
    summary:
      'It is okay if you never find one fixed life purpose. Many people live meaningful lives through evolving roles, relationships, and values rather than a single destiny narrative.',
    takeaways: [
      'The "one true purpose" idea is culturally loaded, not biologically required.',
      'Meaning often comes from contribution, connection, and aligned action.',
      'Purpose can change by life stage; that is normal.',
      'Comparison to others\' highlight reels distorts what purpose feels like day to day.',
      'Hopelessness about the future is different from philosophical uncertainty about purpose.',
    ],
    happening:
      'You might feel behind peers who announce a calling, or assume something is wrong because your interests scatter. Spiritual or existential language about "calling" can intensify the pressure.',
    help:
      'Replace "find my purpose" with "what matters this season?" and act on small experiments.\n\nNotice when you feel most alive or useful; collect data rather than forcing a slogan.\n\nAllow multiple interests to coexist without ranking them into a single brand.\n\nIf emptiness includes persistent hopelessness or self-harm thoughts, seek professional support.',
    related: [
      'How do I find my purpose when nothing feels meaningful anymore?',
      'What do I do when I feel like giving up on my dreams?',
      'What is existentialism and can it help when life feels meaningless?',
    ],
    schemaAnswer:
      'Yes, it is okay not to have one fixed life purpose; meaning can be built through values, relationships, and evolving commitments over time.',
    themes: ['Life Purpose', 'Meaning', 'Identity'],
  },
  'how-do-i-build-a-personal-spiritual-practice-outside-organized-religion': {
    title: 'Build a Personal Spiritual Practice Outside Organized Religion',
    meta: 'Spiritual practice without a church can include ritual, reflection, community, and nature. Start small and stay honest.',
    summary:
      'Building a personal spiritual practice outside organized religion means choosing regular activities that connect you to meaning, presence, or values without requiring institutional belief.',
    takeaways: [
      'Practice is built by repetition, not by finding the perfect system first.',
      'Mix reflection, body-based ritual, community, and service if helpful.',
      'Borrow elements respectfully; credit traditions and avoid appropriation.',
      'Consistency beats intensity; five minutes daily can matter.',
      'Therapy can complement practice when trauma or grief is active.',
    ],
    happening:
      'Without a weekly service structure, days can blur. You might miss music, liturgy, or shared silence while rejecting doctrines.\n\nCreating your own path can feel illegitimate until you define spirituality on your terms.',
    help:
      'Pick one anchor: morning journaling, evening walk, weekly gratitude meal, or monthly volunteer shift.\n\nCreate simple rituals for hard transitions (grief, conflict, new chapters).\n\nExplore meditation, poetry, interfaith groups, or nature-based practices.\n\nReassess every few months; practices can evolve as you do.',
    related: [
      'Can I still be spiritual without being religious?',
      'How do I find meaning in life when traditional religion no longer fits?',
      'What does it mean to have a spiritual awakening?',
    ],
    themes: ['Spiritual practice', 'Secular spirituality', 'Ritual'],
  },
  'how-do-i-make-new-friends-after-leaving-my-church': {
    title: 'Make New Friends After Leaving Church',
    meta: 'Leaving church can shrink your social world overnight. Rebuilding friendship takes intention and patience.',
    summary:
      'Leaving a church or religious community often removes your main social network. Making new friends afterward is slow but possible through shared interests, values-based groups, and one-on-one reach-outs.',
    takeaways: [
      'Social loss after faith exit is real; loneliness is not a personal flaw.',
      'Repeated low-stakes contact builds friendship faster than one big event.',
      'Secular, hobby, volunteer, and ex-vangelical groups can help.',
      'Old friends may return if boundaries around belief are clear.',
      'Therapy can help if isolation feeds depression or anxiety.',
    ],
    happening:
      'You may have lost not only Sunday mornings but small groups, holidays, and casual check-ins. Starting over in adulthood feels awkward, especially if you were taught outsiders are dangerous.',
    help:
      'List activities you already enjoy and join one recurring group (climbing gym, book club, mutual aid).\n\nSay yes to invitations even when you feel rusty.\n\nPractice short reach-outs: coffee, a walk, a shared project.\n\nLook for post-religion or interfaith deconstruction communities online and locally.\n\nGive it seasons, not weeks; friendship compounds slowly.',
    related: [
      'Why do I feel lost without religious community?',
      'How do I find meaning after leaving organized religion?',
      'What do I do when my family rejects me for changing my beliefs?',
    ],
    schemaAnswer:
      'Rebuild friendship through recurring shared activities, patient reach-outs, and communities aligned with your values after church exit.',
    themes: ['Community', 'Belonging', 'Faith transitions'],
  },
  'how-do-believers-make-sense-of-suffering-if-god-is-loving': {
    title: 'How Believers Reconcile Suffering With a Loving God',
    meta: 'Theodicy questions why pain exists if God is loving. Believers hold many frameworks; distress about suffering is valid.',
    summary:
      'Many believers wrestle with how suffering fits a loving God. Traditions offer varied frameworks (free will, soul-making, mystery, liberation), and personal pain can make abstract answers feel inadequate.',
    takeaways: [
      'Theodicy is a long-standing question, not a faith failure.',
      'Intellectual answers may not immediately soothe emotional pain.',
      'Lament and anger toward God appear in many sacred texts.',
      'Community and pastoral care matter when suffering is personal.',
      'Professional support helps when distress impairs safety or daily life.',
    ],
    happening:
      'After illness, abuse, or injustice, tidy explanations can feel insulting. You might hide doubt to avoid disappointing your community.\n\nOthers may offer platitudes that deepen isolation.',
    help:
      'Allow honest questions without forcing resolution.\n\nSeek leaders or friends who tolerate lament rather than quick fixes.\n\nDistinguish philosophical theodicy from immediate grief work; both may be needed.\n\nIf suffering triggers hopelessness or self-harm thoughts, prioritize safety and professional care alongside spiritual support.',
    related: [
      'Why do bad things happen to good people?',
      'Is it normal to feel angry at God or religion?',
      'Can religious trauma be real even if nothing "bad" happened?',
    ],
    schemaAnswer:
      'Believers reconcile suffering and divine love through varied theological frameworks, honest lament, community support, and professional help when distress is severe.',
    themes: ['Theodicy', 'Suffering', 'Faith struggle'],
  },
  'why-do-bad-things-happen-to-good-people': {
    title: 'Why Bad Things Happen to Good People',
    meta: 'This ancient question has no single satisfying answer. Your distress about unfair suffering is understandable.',
    summary:
      'Asking why bad things happen to good people is a human response to unfair pain. Religious, philosophical, and secular frameworks offer partial answers; none remove the need for compassion and support.',
    takeaways: [
      'The question often intensifies after personal loss or injustice.',
      'Simple karma or punishment narratives can increase shame.',
      'Meaning-making after tragedy takes time and cannot be rushed.',
      'Community care matters more than perfect explanations.',
      'Seek help if despair, guilt, or self-harm thoughts persist.',
    ],
    happening:
      'You might scan for reasons ("what did they do to deserve this?") or lose trust in fairness altogether. Witnessing innocent suffering can shake moral foundations.',
    help:
      'Start with practical support for whoever is hurting, including yourself.\n\nHold space for anger at injustice without forcing silver linings.\n\nExplore frameworks (theological, philosophical, humanist) that allow mystery and protest.\n\nLimit isolation; suffering feels heavier alone.\n\nUse crisis resources if thoughts turn toward not wanting to live.',
    related: [
      'How do believers make sense of suffering if God is loving?',
      'How do I find meaning after losing someone?',
      'How do I deal with existential anxiety about meaning and mortality?',
    ],
    schemaAnswer:
      'There is no single answer; distress about unfair suffering is valid, and support, time, and professional care matter more than perfect explanations.',
    themes: ['Theodicy', 'Suffering', 'Justice'],
  },
  'can-life-be-meaningful-without-believing-in-god': {
    title: 'Meaningful Life Without Belief in God',
    meta: 'Meaning does not require theism. Connection, contribution, beauty, and values can anchor a life without God-belief.',
    summary:
      'Life can be meaningful without believing in God. Many non-theistic philosophies and spiritual paths ground meaning in relationships, creativity, justice, and finite presence rather than divine command.',
    takeaways: [
      'Meaning and God-belief are related for many people but not logically required.',
      'Mortality can increase urgency to live aligned with values.',
      'Community and service often provide durable meaning.',
      'Grief over lost certainty is separate from the possibility of new meaning.',
      'Persistent hopelessness may need clinical support, not only philosophy.',
    ],
    happening:
      'You might mourn the loss of cosmic guarantee while wondering if ethics or awe remain without God. Relatives may insist meaning collapses without faith, which can feel shaming.',
    help:
      'Name values you still hold (care, honesty, beauty, justice) and act on them weekly.\n\nExplore humanist, Buddhist, Stoic, or eclectic spiritual resources.\n\nBuild rituals that mark gratitude and grief without doctrinal claims.\n\nFind community that shares your framework to reduce isolation.',
    related: [
      'How do I find meaning in life when traditional religion no longer fits?',
      'Can I still be spiritual without being religious?',
      'What is existentialism and can it help when life feels meaningless?',
    ],
    schemaAnswer:
      'Yes, life can be meaningful without God-belief through values, relationships, contribution, and practices that honor finitude and connection.',
    themes: ['Secular meaning', 'Spiritual Doubt', 'Ethics'],
  },
  'what-is-existentialism-and-can-it-help-when-life-feels-meaningless': {
    title: 'Existentialism When Life Feels Meaningless',
    meta: 'Existentialism explores freedom, responsibility, and meaning-making in a world without guaranteed answers.',
    summary:
      'Existentialism is a philosophical tradition emphasizing freedom, choice, and the human task of creating meaning in a world that does not hand us ready-made answers. It can help normalize meaninglessness without denying responsibility.',
    takeaways: [
      'Existentialism is diverse; not all existentialists say the same thing.',
      'Meaning is often created through chosen commitment, not discovered once.',
      'Anxiety about freedom is a theme, not necessarily a disorder.',
      'Existential ideas complement therapy; they do not replace it.',
      'If meaninglessness includes self-harm thoughts, seek urgent support.',
    ],
    happening:
      'You might feel adrift after losing religious or cultural scripts. Existential language can name the void without calling it pathology.\n\nSome ideas (radical freedom) feel liberating; others feel heavy.',
    help:
      'Start with accessible authors (de Beauvoir, Camus, Frankl) and notice which ideas resonate.\n\nAsk what you are willing to stand behind with your time and attention.\n\nPair reading with action: small commitments that express your values.\n\nDiscuss existential themes with a therapist if anxiety or despair dominates.',
    related: [
      'Is it normal to have existential thoughts?',
      'Why do I feel like life has no meaning or purpose?',
      'How do I find meaning in life when everything feels pointless?',
    ],
    schemaAnswer:
      'Existentialism examines freedom and meaning-making in an uncertain world; it can help frame meaninglessness as a human task rather than a personal defect.',
    themes: ['Existentialism', 'Philosophy', 'Meaning'],
  },
  'why-am-i-questioning-all-my-beliefs-in-midlife': {
    title: 'Questioning Your Beliefs in Midlife',
    meta: 'Midlife belief questioning is common after enough life experience to test old certainties. It is not automatically a crisis.',
    summary:
      'Questioning core beliefs in midlife often follows accumulated experiences: loss, success that felt empty, or watching institutions fail. It can be a healthy recalibration rather than a breakdown.',
    takeaways: [
      'Midlife review often revisits beliefs chosen in youth or inherited from family.',
      'Mortality awareness can sharpen what feels non-negotiable.',
      'Questioning does not require abandoning everything at once.',
      'Trusted conversation partners reduce isolation.',
      'Sudden panic, insomnia, or hopelessness may need professional support.',
    ],
    happening:
      'You might notice church language landing differently, or politics and theology diverging. Peers may be doubling down while you soften or shift.\n\nThe disorientation can feel like adolescence again, without the social permission to experiment.',
    help:
      'Journal beliefs you inherited versus beliefs you would choose today.\n\nMove slowly on public declarations until you understand your own direction.\n\nSeek mentors who have navigated midlife faith or worldview shifts.\n\nBalance solitude with community so questioning does not become isolation.',
    related: [
      'What is faith deconstruction and how is it different from a crisis of faith?',
      'How do I find meaning when I no longer believe what I was taught?',
      'How do I respect my family\'s faith while I no longer believe?',
    ],
    schemaAnswer:
      'Midlife belief questioning is common when life experience tests old certainties; it can be a thoughtful recalibration rather than a failure.',
    themes: ['Midlife', 'Faith transitions', 'Identity'],
  },
  'how-do-i-respect-my-familys-faith-while-i-no-longer-believe': {
    title: 'Respect Family Faith When You No Longer Believe',
    meta: 'You can honor relatives\' beliefs and your own integrity with clear boundaries, not performative agreement.',
    summary:
      'Respecting your family\'s faith while you no longer believe is about boundaries: showing care for people without pretending to share doctrines you reject. Mutual respect is possible but not always symmetrical.',
    takeaways: [
      'Respect for people and agreement with beliefs are different.',
      'You may need limits on debates, prayers, or proselytizing.',
      'Holidays and life events require advance planning.',
      'Children\'s upbringing deserves explicit co-parent conversations.',
      'Emotional abuse masked as faith concern is not acceptable.',
    ],
    happening:
      'Family gatherings may include language that erases your path. You might feel pressure to pray along or hide partners and values.\n\nSome relatives interpret boundary-setting as rejection.',
    help:
      'State what you can participate in honestly ("I will attend dinner but not prayer").\n\nAvoid contempt; focus on your experience rather than insulting their faith.\n\nPrepare one-sentence responses to recurring debates.\n\nReduce contact or seek mediation if respect is consistently one-sided.\n\nUse therapy if family conflict drives chronic anxiety or depression.',
    related: [
      'How do I handle family rejection after changing my beliefs?',
      'How do I handle religious holidays after leaving faith?',
      'How do I tell my partner I\'m no longer religious?',
    ],
    schemaAnswer:
      'Respect family faith without faking belief by setting clear boundaries, planning shared events, and protecting your integrity with compassionate but firm communication.',
    themes: ['Family dynamics', 'Boundaries', 'Faith transitions'],
  },
};

const drafts = CANDIDATES.map((candidate) => {
  const content = CONTENT[candidate.slug];
  if (!content) throw new Error(`Missing draft content for ${candidate.slug}`);
  return draft(candidate, content);
});

const candidates = CANDIDATES.map((candidate) => ({
  gap_id: candidate.gap_id,
  question: candidate.question,
  slug: candidate.slug,
  category: candidate.category,
  intent: candidate.intent,
  reviewer_class: candidate.reviewer_class,
  target_reviewed_by: candidate.target_reviewed_by,
  crisis_safety_flag: candidate.crisis_safety_flag,
  safety_flags: candidate.crisis_safety_flag ? ['crisis-sensitive', 'mortality-or-suffering'] : ['none'],
  duplicate_risk: 'low',
  why_this_adds_coverage: candidate.intent,
  phase_1b_status: 'draft_eligible_human_approved',
  review_status: 'draft',
  indexation_instruction: 'noindex_until_reviewed',
  source_batch: 'spirituality-meaning-part-c',
  source_refs: candidate.reviewer_class === 'b' ? [NIMH, CDC, GRIEF] : [NIMH, CDC],
  notes: `Gap #${candidate.gap_id}. Reviewer class ${candidate.reviewer_class}.`,
}));

const slugsPayload = {
  generated_at: new Date().toISOString(),
  mode: 'spirituality-meaning-part-c',
  count: drafts.length,
  slugs: drafts.map((row) => row.slug),
};

const summaryLines = [
  '# Spirituality & Meaning Part C batch (15 candidates)',
  '',
  `Generated: ${slugsPayload.generated_at}`,
  '',
  'Approved Step 5 classification. Inserts use `review_status: draft`; `reviewed_by` set only after human review.',
  '',
  '| # | Class | Crisis | Category | Question | Slug | Target reviewer |',
  '|---:|---|---|---|---|---|---|',
];

for (const candidate of CANDIDATES) {
  summaryLines.push(
    `| ${candidate.gap_id} | ${candidate.reviewer_class} | ${candidate.crisis_safety_flag ? 'yes' : 'no'} | ${candidate.category} | ${candidate.question.replace(/\|/g, '\\|')} | \`${candidate.slug}\` | ${candidate.target_reviewed_by} |`
  );
}

summaryLines.push(
  '',
  '## Crisis-safety flagged (#6, #8, #20, #21, plus #2 grief-as-death)',
  '',
  'Rewrite pipeline adds 988/escalation language in reach-out sections where appropriate. Do not promote until reviewer assignment is approved.',
  '',
  '## Commands',
  '',
  '```bash',
  'node scripts/check-spirituality-meaning-overlap.mjs',
  'npm run content:publish-spirituality-meaning-15',
  'npm run content:publish-spirituality-meaning-15 -- --apply',
  'npm run content:run-spirituality-meaning-rewrite-pipeline -- --apply',
  '```',
);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/batch-15-candidates.json`, `${JSON.stringify(candidates, null, 2)}\n`);
writeFileSync(`${OUT_DIR}/batch-15-drafts.json`, `${JSON.stringify(drafts, null, 2)}\n`);
writeFileSync(`${OUT_DIR}/batch-15-slugs.json`, `${JSON.stringify(slugsPayload, null, 2)}\n`);
writeFileSync(`${OUT_DIR}/batch-15-summary.md`, `${summaryLines.join('\n')}\n`);

console.log(`Wrote ${drafts.length} drafts to ${OUT_DIR}/`);
console.log('  batch-15-candidates.json');
console.log('  batch-15-drafts.json');
console.log('  batch-15-slugs.json');
console.log('  batch-15-summary.md');
