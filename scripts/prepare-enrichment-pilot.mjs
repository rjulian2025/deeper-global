import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const PROMPT_VERSION = 'deeper-answer-enrichment-v1';
const OUT_DIR = 'reports/enrichment-pilot';
const MODEL = 'codex-gpt-5-assisted-curated-draft';

const pilotSlugs = [
  'my-mind-races-with-worst-case-scenarios-whenever-plans-change-unexpectedly',
  'i-cannot-stop-checking-if-i-locked-the-door-before-leaving',
  'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed',
  'i-rehearse-conversations-in-my-head-for-hours-before-they-happen',
  'my-chest-tightens-whenever-someone-texts-me-unexpectedly',
  'how-do-i-deal-with-the-anxiety-of-making-the-wrong-decision-m4n5o6',
  'how-do-i-stop-my-mind-from-racing-when-i-181083-044',
  'can-lack-of-sleep-make-my-anxiety-worse-181083-049',
  'how-do-i-stop-checking-my-phone-when-i-c-181083-047',
  'how-do-i-know-if-im-having-a-panic-attack-184730-067',
  'how-do-i-deal-with-intrusive-sexual-thou-177940-031',
  'how-do-i-find-motivation-when-im-depressed-z8a9b1',
  'why-do-i-feel-like-im-living-in-a-fog-all-the-time-t8u1v4',
  'why-does-everything-feel-pointless-when-190648-012',
  'why-do-i-feel-empty-even-when-my-life-lo-191368-007',
  'is-it-normal-to-cry-for-no-apparent-reas-181288-002',
  'how-do-i-know-if-my-relationship-is-heal-186032-029',
  'what-is-gaslighting-and-how-do-i-recogni-186032-030',
  'why-do-my-partner-and-i-have-the-same-fi-185759-033',
  'how-do-i-stop-being-so-jealous-in-my-rel-185759-034',
  'why-do-i-feel-like-im-losing-myself-in-184730-046',
  'how-do-i-know-if-im-in-a-toxic-relationship-184730-020',
  'how-do-i-know-if-im-burned-out-or-just-s-190219-012',
  'how-do-i-deal-with-a-toxic-boss-190648-013',
  'why-do-i-feel-guilty-about-setting-bound-190219-013',
  'how-do-i-deal-with-imposter-syndrome-in-my-career-n5o6p7',
  'how-do-i-know-if-i-need-therapy',
  'what-should-i-expect-from-my-first-therapy-session-b8c4d7',
  'what-should-i-do-if-therapy-isnt-helping-l7m1n6',
  'what-if-i-cant-afford-treatment-or-therapy',
  'is-it-okay-to-self-diagnose-with-informa-185759-046',
  'how-do-i-stop-feeling-like-im-always-in-survival-184730-099',
  'how-do-i-know-if-i-have-trauma-from-my-c-190974-001',
  'how-do-i-deal-with-trauma-triggers-in-ev-190219-011',
  'how-do-i-deal-with-feeling-disconnected-from-my-o9p4q2',
  'what-should-i-do-if-i-think-my-friend-is-186032-033',
  'why-do-i-constantly-compare-myself-to-others',
  'what-should-i-do-when-i-feel-like-im-not-good-enough',
  'what-should-i-do-when-i-feel-like-i-dont-know-who-i-am-anymore',
  'why-do-i-get-so-emotionally-overwhelmed-with-adhd',
];

const copyOverrides = {
  'my-mind-races-with-worst-case-scenarios-whenever-plans-change-unexpectedly': {
    title: 'Why Plans Changing Can Make Your Brain Race to the Worst Case',
    meta: 'When plans change and your mind jumps to disaster, the issue may be uncertainty, not weakness. Here is why that spiral starts.',
  },
  'i-cannot-stop-checking-if-i-locked-the-door-before-leaving': {
    title: 'Why Checking the Door Again Still Does Not Make You Feel Sure',
    meta: 'If you keep checking but never feel certain, the problem may not be memory. It may be doubt. Here is why that loop happens.',
  },
  'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed': {
    title: 'Why One Small Mistake Can Feel Like Proof Something Is Wrong With You',
    meta: 'When small mistakes feel like character evidence, shame may be doing the interpreting. Here is how that pattern works.',
  },
  'i-rehearse-conversations-in-my-head-for-hours-before-they-happen': {
    title: 'Why Rehearsing Conversations Can Feel Safer Than Having Them',
    meta: 'Mental rehearsal can feel like preparation, but it may also keep your nervous system stuck in social threat mode.',
  },
  'my-chest-tightens-whenever-someone-texts-me-unexpectedly': {
    title: 'Why an Unexpected Text Can Make Your Chest Tighten',
    meta: 'A sudden text can feel urgent before you know what it says. Here is why your body may react first and think later.',
  },
  'how-do-i-deal-with-the-anxiety-of-making-the-wrong-decision-m4n5o6': {
    title: 'Why the Fear of Making the Wrong Decision Can Freeze You',
    meta: 'Decision anxiety often grows when certainty becomes the goal. Here is how to choose without needing a perfect guarantee.',
  },
  'how-do-i-stop-my-mind-from-racing-when-i-181083-044': {
    title: 'Why Your Mind Gets Louder Right When You Try to Sleep',
    meta: 'Racing thoughts at night can feel random, but quiet often gives worry more room. Here is what can help your brain downshift.',
  },
  'can-lack-of-sleep-make-my-anxiety-worse-181083-049': {
    title: 'How Poor Sleep Can Make Anxiety Feel Bigger the Next Day',
    meta: 'Lack of sleep can make ordinary stress feel sharper and harder to regulate. Here is the sleep-anxiety loop in plain language.',
  },
  'how-do-i-stop-checking-my-phone-when-i-c-181083-047': {
    title: 'Why Checking Your Phone at Night Makes Sleep Feel Further Away',
    meta: 'Phone checking can promise relief, then restart alertness. Here is why the habit can keep your brain waiting for something.',
  },
  'how-do-i-know-if-im-having-a-panic-attack-184730-067': {
    title: 'How to Tell When Anxiety Has Turned Into a Panic Surge',
    meta: 'Panic can feel dangerous even when it is your alarm system misfiring. Here are signs to notice and when to get support.',
  },
  'how-do-i-deal-with-intrusive-sexual-thou-177940-031': {
    title: 'Why Intrusive Sexual Thoughts Can Feel So Disturbing',
    meta: 'Intrusive thoughts can feel alarming because they clash with your values. Having one does not mean you want it or chose it.',
  },
  'how-do-i-find-motivation-when-im-depressed-z8a9b1': {
    title: 'Why Motivation Can Disappear When You Are Depressed',
    meta: 'Depression can make action feel pointless before you even start. The first step is often smaller than motivation itself.',
  },
  'why-do-i-feel-like-im-living-in-a-fog-all-the-time-t8u1v4': {
    title: 'Why Depression Can Make Life Feel Like You Are Moving Through Fog',
    meta: 'Brain fog can make even simple choices feel far away. Here is why numbness and low energy can change how clear life feels.',
  },
  'why-does-everything-feel-pointless-when-190648-012': {
    title: 'Why Everything Can Feel Pointless When You Are Depressed',
    meta: 'When depression drains meaning, your brain may read effort as useless. That feeling is real, but it may not be the full truth.',
  },
  'why-do-i-feel-empty-even-when-my-life-lo-191368-007': {
    title: 'Why Life Can Look Good and Still Feel Empty Inside',
    meta: 'Feeling empty despite a good-looking life can be confusing. The gap may be about connection, meaning, or emotional access.',
  },
  'is-it-normal-to-cry-for-no-apparent-reas-181288-002': {
    title: 'Why You Might Cry Even When You Cannot Name a Reason',
    meta: 'Crying without a clear reason can be your system releasing pressure, not proof that something is wrong with you.',
  },
  'how-do-i-know-if-my-relationship-is-heal-186032-029': {
    title: 'How to Tell Whether a Relationship Feels Safe, Not Just Familiar',
    meta: 'A healthy relationship is not just low conflict. It usually includes repair, respect, and room to be honest.',
  },
  'what-is-gaslighting-and-how-do-i-recogni-186032-030': {
    title: 'How Gaslighting Makes You Doubt Your Own Reality',
    meta: 'Gaslighting is not just disagreement. It is a pattern that can make you question your memory, judgment, or right to object.',
  },
  'why-do-my-partner-and-i-have-the-same-fi-185759-033': {
    title: 'Why You and Your Partner Keep Having the Same Fight',
    meta: 'Repeating the same fight often means the real issue is underneath the topic. Here is what the loop may be protecting.',
  },
  'how-do-i-stop-being-so-jealous-in-my-rel-185759-034': {
    title: 'Why Jealousy Can Feel Like Protection Even When It Hurts',
    meta: 'Jealousy often asks for certainty, but relationships cannot provide perfect certainty. Here is how to work with the feeling.',
  },
  'why-do-i-feel-like-im-losing-myself-in-184730-046': {
    title: 'Why a Relationship Can Start to Feel Like You Are Losing Yourself',
    meta: 'If love costs you your voice, preferences, or friendships, the issue may be self-abandonment, not commitment.',
  },
  'how-do-i-know-if-im-in-a-toxic-relationship-184730-020': {
    title: 'How to Tell If a Relationship Is Draining You More Than Supporting You',
    meta: 'Toxic patterns can feel normal when they repeat long enough. Here are signs to notice without rushing to label everything.',
  },
  'how-do-i-know-if-im-burned-out-or-just-s-190219-012': {
    title: 'How to Tell Burnout From Ordinary Stress',
    meta: 'Stress usually still has a finish line. Burnout can make even recovery feel hard. Here is the difference to look for.',
  },
  'how-do-i-deal-with-a-toxic-boss-190648-013': {
    title: 'How to Stay Grounded When Your Boss Feels Toxic',
    meta: 'A toxic boss can make work feel personally unsafe. The first step is separating your worth from their behavior.',
  },
  'why-do-i-feel-guilty-about-setting-bound-190219-013': {
    title: 'Why Setting Work Boundaries Can Make You Feel Guilty',
    meta: 'Work guilt often appears when your nervous system treats limits like danger. Boundaries can feel wrong before they help.',
  },
  'how-do-i-deal-with-imposter-syndrome-in-my-career-n5o6p7': {
    title: 'Why Imposter Syndrome Makes Evidence of Success Hard to Believe',
    meta: 'Imposter thoughts can dismiss every win as luck. The work is not proving yourself harder, but reading evidence more fairly.',
  },
  'how-do-i-know-if-i-need-therapy': {
    title: 'How to Know If Therapy Might Actually Help Right Now',
    meta: 'You do not need to be in crisis to consider therapy. It may help when coping alone is costing more than it is giving back.',
  },
  'what-should-i-expect-from-my-first-therapy-session-b8c4d7': {
    title: 'What a First Therapy Session Is Actually For',
    meta: 'A first therapy session is not a test you have to pass. It is a starting conversation about what hurts and what you need.',
  },
  'what-should-i-do-if-therapy-isnt-helping-l7m1n6': {
    title: 'What to Do When Therapy Does Not Feel Like It Is Helping',
    meta: 'Therapy can stall for many reasons. Before quitting, it may help to name what feels stuck and what kind of support is missing.',
  },
  'what-if-i-cant-afford-treatment-or-therapy': {
    title: 'What to Do When Therapy Feels Financially Out of Reach',
    meta: 'Cost can be a real barrier to care. Here are lower-cost paths to consider without blaming yourself for needing options.',
  },
  'is-it-okay-to-self-diagnose-with-informa-185759-046': {
    title: 'Why Self-Diagnosis Can Feel Clarifying and Still Need Care',
    meta: 'Self-diagnosis can offer language, but it can also narrow the picture. Here is how to use information without trapping yourself.',
  },
  'how-do-i-stop-feeling-like-im-always-in-survival-184730-099': {
    title: 'Why You May Feel Stuck in Survival Mode Even When Things Are Calm',
    meta: 'Survival mode can linger after danger has passed. Your body may need repeated safety, not criticism, to stand down.',
  },
  'how-do-i-know-if-i-have-trauma-from-my-c-190974-001': {
    title: 'How Childhood Experiences Can Still Shape Your Reactions Now',
    meta: 'Childhood trauma is not only about what happened. It can also show up in how your body expects relationships to feel.',
  },
  'how-do-i-deal-with-trauma-triggers-in-ev-190219-011': {
    title: 'Why Trauma Triggers Can Make the Present Feel Like the Past',
    meta: 'Triggers can pull old danger into the present moment. The goal is not to shame the reaction, but to help your system reorient.',
  },
  'how-do-i-deal-with-feeling-disconnected-from-my-o9p4q2': {
    title: 'Why You Might Feel Disconnected From Your Body',
    meta: 'Body disconnection can be a protective response, not a personal failure. Here is how reconnection can start gently.',
  },
  'what-should-i-do-if-i-think-my-friend-is-186032-033': {
    title: 'What to Do If You Think a Friend May Be in an Abusive Relationship',
    meta: 'Helping a friend in possible abuse takes care and patience. Pressure can backfire, but steady support can matter.',
  },
  'why-do-i-constantly-compare-myself-to-others': {
    title: 'Why Comparing Yourself to Others Can Become So Automatic',
    meta: 'Comparison can feel like self-improvement, but often turns into self-surveillance. Here is how the loop keeps pulling you in.',
  },
  'what-should-i-do-when-i-feel-like-im-not-good-enough': {
    title: 'Why Not Feeling Good Enough Can Survive So Much Evidence',
    meta: 'Feeling not good enough is often a lens, not a fact. The work is learning when shame is narrating the evidence.',
  },
  'what-should-i-do-when-i-feel-like-i-dont-know-who-i-am-anymore': {
    title: 'What to Do When You Feel Like You Do Not Know Who You Are Anymore',
    meta: 'Losing your sense of self can happen after stress, change, or people-pleasing. Identity can be rebuilt in small signals.',
  },
  'why-do-i-get-so-emotionally-overwhelmed-with-adhd': {
    title: 'Why ADHD Can Make Emotions Feel Too Big Too Fast',
    meta: 'Emotional overwhelm with ADHD can be about regulation, not immaturity. Here is why feelings may arrive with extra force.',
  },
};

const entryGuidance = {
  'my-mind-races-with-worst-case-scenarios-whenever-plans-change-unexpectedly': {
    summary:
      'When plans change suddenly, your brain may treat the loss of predictability as a problem that has to be solved immediately. The racing is often an attempt to get ahead of uncertainty, even when it leaves you more tense.',
    what:
      'A changed plan can remove the mental map you were using to feel prepared. If planning is one of the ways you stay calm, even a small change can feel larger than it looks from the outside.',
    why:
      'Worst-case thinking can feel useful because it gives your mind a task: prepare for every possible outcome. The cost is that the task never really ends, because uncertainty can always produce one more scenario.',
    help:
      'Try separating what is possible from what is likely. Then choose one next action that fits the likely situation instead of answering every imagined emergency.',
    support:
      'If changes in plans regularly lead to panic, avoidance, conflict, or hours of rumination, therapy can help you build tolerance for uncertainty without needing to control every detail first.',
  },
  'i-cannot-stop-checking-if-i-locked-the-door-before-leaving': {
    summary:
      'Repeated door-checking usually is not about forgetting how locks work. It is often about doubt returning after reassurance fades, so each check buys a short moment of relief without creating lasting certainty.',
    what:
      'Your first check may register that the door is locked, but anxiety can quickly question whether you were focused enough. That doubt can feel like a safety problem rather than a feeling.',
    why:
      'Checking again lowers anxiety for a moment, which teaches your brain that relief came from the extra check. The next time doubt appears, the urge can feel even more convincing.',
    help:
      'Make one deliberate check and name the sensory evidence: the click, the handle resistance, the visual confirmation. Then practice leaving with the discomfort present instead of restarting the loop.',
    support:
      'If checking takes significant time, makes you late, or spreads to other routines, a therapist familiar with anxiety, OCD, or exposure and response prevention can help.',
  },
  'every-small-mistake-feels-like-evidence-that-i-am-fundamentally-flawed': {
    summary:
      'If small mistakes feel like proof that something is wrong with you, shame may be interpreting the mistake before you can. The issue is not the size of the error, but the meaning your mind attaches to it.',
    what:
      'A minor mistake can become emotionally loaded when it connects to an older fear of being disappointing, careless, or not enough. The mistake becomes evidence in a case against yourself.',
    why:
      'Harsh self-criticism can feel like accountability because it promises to prevent future failure. In reality, it often keeps your attention on shame instead of repair.',
    help:
      'Ask what the mistake actually requires: an apology, a correction, a note for next time, or nothing. Keeping the response proportional helps separate responsibility from self-attack.',
    support:
      'If mistakes trigger spirals of shame, avoidance, or self-punishment, therapy can help you challenge the belief that being imperfect means being defective.',
  },
  'i-rehearse-conversations-in-my-head-for-hours-before-they-happen': {
    summary:
      'Rehearsing conversations can feel like preparation, but it may also be your mind trying to control connection before it happens. The more you rehearse, the more the conversation can start to feel dangerous.',
    what:
      'Your mind may be scanning for the right words, the wrong tone, or every possible reaction. That scan can come from wanting to be understood and avoid regret.',
    why:
      'The rehearsal never fully satisfies anxiety because real conversations include another person. You can script your part, but you cannot script their mood, timing, or interpretation.',
    help:
      'Choose one clear intention for the conversation instead of a full script. For example: be honest, ask one question, or name one need. A flexible anchor usually works better than memorized lines.',
    support:
      'If social rehearsal steals hours, disrupts sleep, or keeps you from having needed conversations, professional support can help you work with social anxiety and uncertainty.',
  },
  'my-chest-tightens-whenever-someone-texts-me-unexpectedly': {
    summary:
      'An unexpected text can make your body react before you know what the message says. That tightness may be an alarm response to uncertainty, past conflict, or the feeling that you are suddenly required to respond.',
    what:
      'A notification can interrupt your sense of control. If messages have sometimes meant criticism, obligation, conflict, or urgency, your body may brace first and interpret later.',
    why:
      'The phone creates a tiny suspense gap: something happened, but you do not know what yet. Anxiety often fills that gap with threat because it is trying to prepare you quickly.',
    help:
      'Before opening the message, pause long enough to feel your feet, unclench your jaw, and remind yourself that a notification is information, not a command.',
    support:
      'If messages routinely trigger intense physical anxiety, avoidance, or conflict in relationships, support can help you understand the pattern and set healthier communication boundaries.',
  },
  'how-do-i-deal-with-the-anxiety-of-making-the-wrong-decision-m4n5o6': {
    summary:
      'Decision anxiety often grows when your mind treats one choice as a test of your entire future. The goal is not perfect certainty, but choosing with enough information and room to adjust.',
    what:
      'The fear of the wrong decision can turn ordinary tradeoffs into moral or life-defining stakes. That pressure makes every option feel risky.',
    why:
      'Researching, asking others, or replaying options can feel productive, but it may become reassurance-seeking when no answer is allowed to be good enough.',
    help:
      'Define what a good-enough decision requires: your values, the practical constraints, and the next reversible step. Then set a decision point rather than waiting until anxiety disappears.',
    support:
      'If decision anxiety keeps you stuck in daily choices or major life moves, therapy can help you build trust in your judgment without demanding certainty first.',
  },
  'how-do-i-stop-my-mind-from-racing-when-i-181083-044': {
    summary:
      'Racing thoughts at bedtime often show up because the day has finally gone quiet. Your mind may be trying to process, predict, or prevent problems at the exact moment your body needs less stimulation.',
    what:
      'When there are fewer distractions, unfinished worries can become louder. The bed then starts to feel like the place where thinking intensifies instead of where rest begins.',
    why:
      'Trying to force thoughts away can make them feel more important. The struggle itself can keep your brain alert.',
    help:
      'Move problem-solving out of bed when possible. Write a short worry list earlier, choose one next step for tomorrow, and use a boring wind-down cue that does not require decisions.',
    support:
      'If racing thoughts frequently keep you awake or create dread around sleep, a clinician can help address both anxiety patterns and sleep habits.',
  },
  'can-lack-of-sleep-make-my-anxiety-worse-181083-049': {
    summary:
      'Yes, lack of sleep can make anxiety feel stronger. Poor sleep can lower your emotional buffer, making normal stressors feel sharper and harder to put in perspective.',
    what:
      'When you are under-slept, your body may be quicker to interpret uncertainty, noise, conflict, or pressure as threat. That does not mean the fears are all accurate.',
    why:
      'Anxiety can then make sleep harder, creating a loop: poor sleep increases sensitivity, and increased sensitivity makes it harder to settle at night.',
    help:
      'Focus on one stabilizing sleep routine rather than trying to fix everything at once: consistent wake time, lower evening stimulation, and a plan for nighttime worry.',
    support:
      'If anxiety and sleep problems are feeding each other for weeks, professional support can help identify whether anxiety, insomnia, health issues, or life stress need attention.',
  },
  'how-do-i-stop-checking-my-phone-when-i-c-181083-047': {
    summary:
      'Checking your phone when you cannot sleep can feel calming for a minute, but it often teaches your brain to stay alert. The screen becomes both distraction and signal that something might need your attention.',
    what:
      'The urge usually is not just about the phone. It can be about boredom, loneliness, unfinished tasks, fear of missing something, or wanting a quick hit of control.',
    why:
      'Each check refreshes the possibility of new information. That keeps the brain in a waiting mode, which is the opposite of sleep mode.',
    help:
      'Put friction between you and the phone: charge it across the room, use a separate alarm, and choose a low-stimulation replacement for the first ten minutes of wakefulness.',
    support:
      'If nighttime phone checking is tied to anxiety, work pressure, compulsive checking, or chronic insomnia, support can help you break the loop without relying on willpower alone.',
  },
  'how-do-i-know-if-im-having-a-panic-attack-184730-067': {
    summary:
      'A panic attack is often a sudden surge of fear plus intense body symptoms, such as a racing heart, chest tightness, shaking, dizziness, or feeling unreal. It can feel dangerous even when it is not the same as medical danger.',
    what:
      'Panic can make the body alarm feel like the emergency itself. The sensations are real, and they can be frightening, even if they are part of a stress response.',
    why:
      'The fear of the sensations can intensify the sensations. For example, noticing a racing heart can lead to fear, which can make the heart race more.',
    help:
      'Try orienting to the present: name where you are, lengthen your exhale, loosen your shoulders, and remind yourself that the surge usually peaks and passes.',
    support:
      'Seek urgent medical help for new, severe, or unusual chest pain or symptoms you are unsure about. If panic attacks recur, a clinician can help you reduce fear of the sensations.',
  },
  'how-do-i-deal-with-intrusive-sexual-thou-177940-031': {
    summary:
      'Intrusive sexual thoughts can feel disturbing because they are unwanted and clash with your values. The distress does not mean you chose the thought or secretly want it.',
    what:
      'An intrusive thought is a mental event that grabs attention because it feels unacceptable, frightening, or out of character. The content can feel louder precisely because you do not want it there.',
    why:
      'Trying to prove you would never think it again can keep the thought on trial. Checking your reaction can become part of the loop.',
    help:
      'Practice labeling it as an intrusive thought rather than a message. You can let the thought be present without analyzing what it says about your identity or morality.',
    support:
      'If intrusive thoughts become repetitive, highly distressing, or lead to avoidance or compulsive reassurance, seek support from a clinician familiar with anxiety and OCD-related patterns.',
  },
  'how-do-i-find-motivation-when-im-depressed-z8a9b1': {
    summary:
      'When you are depressed, motivation may not arrive before action. Depression can make effort feel unrewarding, so the first useful step is often very small and chosen before you feel ready.',
    what:
      'Low motivation is not simply laziness. It can reflect low energy, reduced reward, hopelessness, or the sense that nothing will matter enough to be worth starting.',
    why:
      'Waiting to feel motivated can become a trap because depression often blocks the feeling you are waiting for. That makes tiny, structured actions more realistic than big inspirational ones.',
    help:
      'Pick an action so small it almost feels insufficient: sit up, drink water, step outside for two minutes, send one text. The goal is motion, not a full life reset.',
    support:
      'If depression is persistent, worsening, or making basic care feel impossible, professional support can help you build a plan that does not depend on willpower alone.',
  },
  'why-do-i-feel-like-im-living-in-a-fog-all-the-time-t8u1v4': {
    summary:
      'A constant foggy feeling may point to depression, stress, sleep problems, or overwhelm reducing your sense of clarity. It may feel like life is distant, slowed down, or hard to access.',
    what:
      'Fog can show up as trouble concentrating, low emotional range, memory slips, or feeling detached from the day. It is often a sign that your system is overloaded or under-resourced.',
    why:
      'Pushing harder can sometimes thicken the fog because it adds pressure without restoring energy. The mind needs recovery, not just more self-command.',
    help:
      'Start with stabilizers that affect clarity: sleep consistency, food, hydration, movement, light, and reducing decision overload. Track when the fog is better or worse.',
    support:
      'If fog is constant, new, severe, or paired with major mood changes, talk with a healthcare or mental health professional to rule out medical and emotional contributors.',
  },
  'why-does-everything-feel-pointless-when-190648-012': {
    summary:
      'When you are depressed, the brain can stop delivering a felt sense of meaning or reward. Things may seem pointless not because they are, but because depression is changing how value feels.',
    what:
      'Pointlessness can make ordinary tasks feel absurdly heavy. Even things you used to care about may feel flat or far away.',
    why:
      'The mind may use the feeling of pointlessness as evidence that nothing matters. But in depression, feelings can become unreliable witnesses.',
    help:
      'Do not start by proving life is meaningful. Start by reducing isolation and doing one maintenance action that keeps tomorrow slightly more workable.',
    support:
      'If pointlessness becomes hopelessness, or if you have thoughts of not wanting to live, reach out immediately to a crisis line, emergency service, or trusted person.',
  },
  'why-do-i-feel-empty-even-when-my-life-lo-191368-007': {
    summary:
      'Feeling empty when life looks good can be especially confusing because the outside story does not match the inside experience. The emptiness may point to disconnection, exhaustion, unmet needs, or emotions you have learned to mute.',
    what:
      'A life can be functional and still not feel nourishing. You may be meeting expectations without feeling connected to desire, meaning, grief, anger, or rest.',
    why:
      'When you compare your inner emptiness to your outer stability, guilt can appear. That guilt can make it even harder to take the emptiness seriously.',
    help:
      'Ask what feels absent rather than what looks wrong. Connection, play, agency, purpose, honest emotion, or recovery time may need attention.',
    support:
      'If emptiness persists, deepens, or comes with numbness, hopelessness, or withdrawal, a therapist can help you explore it without dismissing your life circumstances.',
  },
  'is-it-normal-to-cry-for-no-apparent-reas-181288-002': {
    summary:
      'Crying without a clear reason may be emotion reaching the surface before your mind can label it. It does not automatically mean something is wrong, but it is worth noticing the pattern.',
    what:
      'Tears can be delayed stress, grief, exhaustion, relief, hormonal shifts, or overwhelm finally finding an exit. The reason may not be obvious in the moment.',
    why:
      'If you judge the crying immediately, you may miss the information underneath it. The body may be communicating before the story is clear.',
    help:
      'After the wave passes, gently ask what has been heavy lately, what you have been holding in, and what your body needed before the tears started.',
    support:
      'If crying feels uncontrollable, frequent, confusing, or paired with depression symptoms, consider talking with a mental health or medical professional.',
  },
  'how-do-i-know-if-my-relationship-is-heal-186032-029': {
    summary:
      'A healthy relationship is not defined by never having conflict. It is more about whether both people can be honest, respectful, accountable, and able to repair after tension.',
    what:
      'Look at how the relationship feels over time, not just during good moments. Safety, respect, consistency, and room for individuality matter.',
    why:
      'Unhealthy patterns can feel normal if they are familiar. Chemistry, history, or fear of being alone can make it harder to evaluate the relationship clearly.',
    help:
      'Notice whether you can say no, raise concerns, keep friendships, make choices, and recover after disagreement without being punished or dismissed.',
    support:
      'If you feel afraid to be honest, constantly diminished, or unsure whether your reactions are reasonable, outside support can help you sort the pattern safely.',
  },
  'what-is-gaslighting-and-how-do-i-recogni-186032-030': {
    summary:
      'Gaslighting is a pattern where someone repeatedly distorts, denies, or reframes reality in a way that makes you doubt your memory, judgment, or right to object.',
    what:
      'It is different from ordinary disagreement. The issue is the repeated effect: you become less sure of what happened and more dependent on the other person to define reality.',
    why:
      'Gaslighting can be hard to recognize because it often includes partial truths, charm, blame-shifting, or claims that you are too sensitive.',
    help:
      'Keep private notes of incidents, talk to someone outside the dynamic, and pay attention to whether conversations lead to clarity or deeper confusion.',
    support:
      'If gaslighting is part of a controlling or frightening relationship, consider confidential support from a therapist, advocate, or domestic violence resource.',
  },
  'why-do-my-partner-and-i-have-the-same-fi-185759-033': {
    summary:
      'Repeating the same fight usually means the topic is not the whole issue. The argument may be carrying a recurring need for respect, closeness, autonomy, fairness, or reassurance.',
    what:
      'Couples often fight about chores, tone, money, sex, or timing while the deeper question is, Do I matter to you? Can I trust you? Will I be heard?',
    why:
      'If the deeper need never gets named, each new version of the fight feels like evidence that nothing changes.',
    help:
      'After things cool down, ask what each person was protecting in the argument. Then agree on one observable repair, not a vague promise to communicate better.',
    support:
      'If fights escalate, become contemptuous, or leave one person afraid to speak, couples or individual therapy can help clarify what is safe and workable.',
  },
  'how-do-i-stop-being-so-jealous-in-my-rel-185759-034': {
    summary:
      'Jealousy often feels like protection, but it can start asking for more certainty than a relationship can realistically provide. The work is to understand the fear without letting it run the relationship.',
    what:
      'Jealousy may point to insecurity, past betrayal, unclear agreements, low self-trust, or real relationship concerns. The source matters.',
    why:
      'Checking, questioning, or comparing can calm jealousy briefly, then make the next wave stronger because your mind learns to seek proof again.',
    help:
      'Name the fear underneath the jealousy, clarify relationship agreements, and choose one response that builds trust rather than surveillance.',
    support:
      'If jealousy leads to controlling behavior, panic, repeated accusations, or major distress, therapy can help you work with the fear more safely.',
  },
  'why-do-i-feel-like-im-losing-myself-in-184730-046': {
    summary:
      'Losing yourself in a relationship often starts quietly, as connection slowly costs you preferences, boundaries, friendships, or private inner life.',
    what:
      "You may notice that you defer automatically, avoid disagreement, stop doing things you liked, or measure your mood by the other person's approval.",
    why:
      'Self-abandonment can feel like love when you are afraid that having needs will create distance. Over time, the relationship may feel safe only when you disappear a little.',
    help:
      'Rebuild small points of self-contact: choose something without asking permission, reconnect with a friend, name one preference, or set one low-stakes boundary.',
    support:
      'If reclaiming yourself feels unsafe or leads to punishment, control, or fear, seek outside support before making major relationship decisions.',
  },
  'how-do-i-know-if-im-in-a-toxic-relationship-184730-020': {
    summary:
      'A toxic relationship is usually less about one bad argument and more about a pattern that repeatedly leaves you smaller, more anxious, less free, or less trusting of yourself.',
    what:
      "Warning signs can include chronic criticism, control, manipulation, fear of honesty, isolation, repeated boundary violations, or feeling responsible for the other person's reactions.",
    why:
      'Toxic patterns can be confusing because they may alternate with affection, apologies, or good periods. That cycle can keep you hoping the painful part is not the real pattern.',
    help:
      'Write down what happens, how often, and how you feel afterward. Patterns are easier to see when you track behavior rather than promises.',
    support:
      'If there is intimidation, threats, coercion, or fear for your safety, prioritize confidential support and safety planning over trying to fix the relationship alone.',
  },
  'how-do-i-know-if-im-burned-out-or-just-s-190219-012': {
    summary:
      'Stress often eases when the pressure lets up. Burnout is deeper: you may feel depleted, detached, cynical, or unable to recover even when you finally get a break.',
    what:
      'Burnout can show up as emotional exhaustion, dread, reduced capacity, irritability, brain fog, or losing the sense that your work matters.',
    why:
      'You may keep treating burnout like a time-management problem when the real issue is prolonged demand without enough recovery, agency, or support.',
    help:
      'Look for what needs to change structurally, not just personally: workload, boundaries, role clarity, recovery time, expectations, or support.',
    support:
      'If burnout is affecting health, sleep, relationships, or functioning, talk with a clinician, supervisor, or trusted advisor about practical changes.',
  },
  'how-do-i-deal-with-a-toxic-boss-190648-013': {
    summary:
      'A toxic boss can make work feel personally unsafe, even when the job itself is manageable. The first step is separating their behavior from your worth and getting clearer about your options.',
    what:
      'Toxic leadership may include unpredictability, humiliation, favoritism, blame-shifting, impossible expectations, or punishment for reasonable boundaries.',
    why:
      'Because your boss has power over your schedule, reputation, or income, your nervous system may stay on alert even outside work.',
    help:
      'Document patterns, keep communication clear, avoid over-explaining, and identify allies or formal channels before you confront anything directly.',
    support:
      'If the situation is harming your health or feels retaliatory or discriminatory, consider HR, legal guidance, career support, or therapy while you plan next steps.',
  },
  'why-do-i-feel-guilty-about-setting-bound-190219-013': {
    summary:
      'Work boundaries can trigger guilt when your nervous system has learned to equate availability with safety, value, or being a good person.',
    what:
      'You may know a limit is reasonable and still feel like you are disappointing someone, risking your reputation, or becoming selfish.',
    why:
      'If over-functioning has been rewarded, rest or limits can feel like rule-breaking. The guilt may be a withdrawal symptom from constant availability.',
    help:
      'Use clear, boring boundaries: name what you can do, what you cannot do, and when you will respond. Avoid turning every limit into a courtroom defense.',
    support:
      'If boundary guilt keeps you overworking or ignoring health needs, therapy or coaching can help you practice limits without treating guilt as a stop sign.',
  },
  'how-do-i-deal-with-imposter-syndrome-in-my-career-n5o6p7': {
    summary:
      'Imposter syndrome can make success feel like luck and mistakes feel like exposure. The issue is not a lack of evidence, but how quickly your mind disqualifies the evidence you already have.',
    what:
      'You may keep raising the bar for what would count as proof that you belong. Each achievement expires, while each flaw feels permanent.',
    why:
      'Over-preparing, hiding uncertainty, or avoiding visibility can reduce fear short term while keeping the belief alive that you only survived by overcompensating.',
    help:
      'Track evidence in a less biased way: skills used, problems solved, feedback received, and growth over time. Let competence include learning, not just flawless performance.',
    support:
      'If imposter fears limit opportunities, create chronic anxiety, or make work feel unsafe, support can help you untangle self-worth from performance.',
  },
  'how-do-i-know-if-i-need-therapy': {
    summary:
      'You do not need to be in crisis to need therapy. Therapy may be worth considering when coping alone is taking too much energy, your patterns keep repeating, or your life is getting smaller around the problem.',
    what:
      'Signs can include persistent distress, avoidance, relationship strain, sleep changes, grief, anxiety, low mood, trauma reactions, or simply wanting a private place to think clearly.',
    why:
      'Many people wait until things feel unbearable because they imagine therapy is only for severe problems. Earlier support can sometimes prevent patterns from hardening.',
    help:
      'Ask what you want help with in plain language. You do not need the perfect diagnosis before booking a first conversation.',
    support:
      'If you feel unsafe, might harm yourself, or cannot manage basic daily needs, seek urgent support. Otherwise, a consultation can help determine the right level of care.',
  },
  'what-should-i-expect-from-my-first-therapy-session-b8c4d7': {
    summary:
      'A first therapy session is usually a starting conversation, not a performance. You can expect questions about what brings you in, what has been hard, and what you hope will change.',
    what:
      'The therapist may ask about symptoms, history, relationships, safety, goals, and current stressors. You can share at a pace that feels manageable.',
    why:
      'First sessions can feel awkward because you are telling a stranger personal things while also deciding whether they feel trustworthy.',
    help:
      "Bring a few notes: what feels hardest, what you have tried, what you want help understanding, and any questions about the therapist's approach.",
    support:
      'If the first therapist does not feel like a fit, that does not mean therapy cannot help. Fit, style, cost, and specialty all matter.',
  },
  'what-should-i-do-if-therapy-isnt-helping-l7m1n6': {
    summary:
      'If therapy is not helping, it does not automatically mean you failed or therapy cannot work. It may mean the goals, method, pace, fit, or level of care need to be revisited.',
    what:
      'Therapy can stall when sessions stay too vague, the relationship does not feel safe, the approach does not match the problem, or important topics are being avoided.',
    why:
      'Many people hesitate to tell a therapist that therapy is not helping because they worry about offending them. But that conversation is often clinically useful.',
    help:
      'Name what feels stuck and ask for a clearer plan: goals, methods, between-session practice, progress markers, or whether a different modality might fit better.',
    support:
      'If symptoms are worsening or safety concerns are present, ask about a higher level of support or additional resources rather than waiting silently.',
  },
  'what-if-i-cant-afford-treatment-or-therapy': {
    summary:
      'Not being able to afford therapy is a real access barrier, not a personal failure. There may still be lower-cost paths, but they often require persistence and practical sorting.',
    what:
      'Options can include sliding-scale therapists, community clinics, training clinics, group therapy, nonprofit programs, support groups, insurance appeals, or shorter-term focused care.',
    why:
      'Cost stress can make seeking help feel humiliating or hopeless. That emotional weight is part of the barrier, not a reason to give up.',
    help:
      'Make the search concrete: decide your maximum fee, preferred format, insurance status, and whether group or short-term care could meet the immediate need.',
    support:
      'If you are in crisis or unsafe, use emergency or crisis resources even if ongoing therapy is financially difficult.',
  },
  'is-it-okay-to-self-diagnose-with-informa-185759-046': {
    summary:
      'Self-diagnosis can give you language for your experience, but it should stay a starting point rather than a final verdict. A label can help, but it can also narrow what you notice.',
    what:
      'Online information may help you recognize patterns, prepare for care, or feel less alone. It cannot see your full context the way a careful assessment can.',
    why:
      'A label can feel relieving because it organizes confusion. The risk is that you may start filtering every feeling through that label.',
    help:
      'Use self-diagnosis as a hypothesis: write down symptoms, examples, duration, and impact. Bring that information to a professional if you can.',
    support:
      'If the label leads to fear, compulsive checking, or treatment decisions, professional guidance is especially important.',
  },
  'how-do-i-stop-feeling-like-im-always-in-survival-184730-099': {
    summary:
      'Feeling stuck in survival mode can mean your body is still preparing for threat even when life looks calmer now. You may need repeated experiences of safety before your system trusts that it can stand down.',
    what:
      'Survival mode can look like scanning, irritability, shutdown, overworking, people-pleasing, numbness, or feeling unable to rest without guilt.',
    why:
      'If your body learned that relaxing was risky, calm can feel unfamiliar rather than safe. That can make rest feel agitating at first.',
    help:
      'Start with body-level signals of safety: predictable routines, slower exhales, orienting to the room, warm food, steady relationships, and fewer unnecessary alarms.',
    support:
      'If survival mode is tied to trauma, ongoing stress, or unsafe relationships, trauma-informed support can help you move slowly without overwhelming your system.',
  },
  'how-do-i-know-if-i-have-trauma-from-my-c-190974-001': {
    summary:
      'Childhood trauma is not only about whether something was bad enough on paper. It is also about how early experiences shaped your sense of safety, trust, emotion, and self-worth.',
    what:
      'Possible signs can include strong reactions to conflict, fear of abandonment, numbness, shame, people-pleasing, difficulty trusting, or feeling younger than your age in certain moments.',
    why:
      'Children adapt to the environments they have. Those adaptations can become confusing later when adult life requires different responses.',
    help:
      'Look for patterns rather than forcing a verdict. What situations make you feel small, trapped, responsible, or unsafe in a way that feels older than the moment?',
    support:
      'A trauma-informed therapist can help you explore childhood patterns without needing to prove that your pain was severe enough.',
  },
  'how-do-i-deal-with-trauma-triggers-in-ev-190219-011': {
    summary:
      'Trauma triggers can make the present feel like the past because your nervous system recognizes a cue before your thinking brain has context. The reaction can be real even when the current situation is different.',
    what:
      'A sound, smell, place, tone, date, or body sensation can activate old alarm. You may feel panic, anger, numbness, shame, or an urge to escape.',
    why:
      'Triggers bypass ordinary reasoning. Telling yourself to calm down may not work until your body has enough evidence that the present is safe.',
    help:
      'Orient first, analyze later. Name the date, the room, the people present, and one difference between now and then. Use grounding that brings you back to current sensory detail.',
    support:
      'If triggers are frequent, intense, or disrupting daily life, trauma-informed therapy can help reduce their power over time.',
  },
  'how-do-i-deal-with-feeling-disconnected-from-my-o9p4q2': {
    summary:
      'Feeling disconnected from your body can be a protective response when sensation, emotion, or stress feels like too much. Reconnection usually works best when it is gentle, not forced.',
    what:
      'You might feel numb, unreal, far away, clumsy, blank, or like your body is something you manage rather than inhabit.',
    why:
      'Disconnecting can reduce overwhelm in the short term. The problem is that it can also make safety, pleasure, hunger, fatigue, and emotion harder to notice.',
    help:
      'Start with neutral sensations rather than intense emotional work: feet on the floor, warm water, stretching, texture, temperature, or naming five things you can see.',
    support:
      'If body disconnection is frequent, frightening, or trauma-related, a trauma-informed therapist or somatic clinician can help you reconnect at a tolerable pace.',
  },
  'what-should-i-do-if-i-think-my-friend-is-186032-033': {
    summary:
      'If you think a friend may be in an abusive relationship, steady support is often more helpful than pressure. The goal is to increase safety and connection without taking away their agency.',
    what:
      'You may notice fear, isolation, monitoring, excuses for the partner, sudden changes in confidence, or your friend seeming less free to make ordinary choices.',
    why:
      'Leaving or naming abuse can be complicated and risky. Pressure can make someone feel judged or more isolated, especially if their partner is controlling.',
    help:
      'Say what you notice, affirm that you care, avoid ultimatums, and offer practical support. If safety is a concern, encourage confidential help from a domestic violence resource.',
    support:
      "If there is immediate danger, call emergency services. Otherwise, prioritize privacy, safety planning, and your friend's pace.",
  },
  'why-do-i-constantly-compare-myself-to-others': {
    summary:
      'Constant comparison can feel like a way to improve yourself, but it often becomes self-surveillance. Your mind keeps checking where you stand and then uses the result to judge your worth.',
    what:
      'Comparison may attach to appearance, success, relationships, money, talent, productivity, or happiness. The target changes, but the feeling of being behind stays.',
    why:
      'Comparison promises orientation: if you know where you rank, maybe you can feel safe. But ranking rarely creates peace because there is always someone else to measure against.',
    help:
      'Notice the specific question comparison is asking: Am I enough? Am I safe? Am I lovable? Then answer that need more directly instead of continuing the ranking exercise.',
    support:
      'If comparison drives shame, avoidance, social media spirals, or body image distress, therapy can help you rebuild self-worth from less punishing evidence.',
  },
  'what-should-i-do-when-i-feel-like-im-not-good-enough': {
    summary:
      'Feeling not good enough is often a painful lens, not a fact. It can survive compliments and achievements because it filters evidence before you get to feel it.',
    what:
      'The belief may show up as over-apologizing, perfectionism, hiding needs, dismissing praise, or assuming other people are tolerating you.',
    why:
      'If your mind learned to use self-criticism as protection, kindness can feel suspicious and standards can keep moving.',
    help:
      'Look for the rule underneath the feeling: I must be useful, perfect, easy, attractive, successful, or needed to be acceptable. Then question that rule directly.',
    support:
      'If not-good-enough thoughts are persistent or tied to depression, trauma, relationships, or self-harm urges, professional support can help you work with them safely.',
  },
  'what-should-i-do-when-i-feel-like-i-dont-know-who-i-am-anymore': {
    summary:
      'Not knowing who you are anymore can happen after stress, loss, burnout, trauma, caregiving, people-pleasing, or major change. Identity often returns through small signals, not one dramatic answer.',
    what:
      'You may feel detached from old interests, unsure what you want, overly shaped by others, or unable to recognize the person you used to be.',
    why:
      'When life has required adaptation for a long time, your preferences can get quiet. Survival, approval, or responsibility may have taken up the space where self-contact used to be.',
    help:
      'Start with low-pressure questions: What drains me? What gives me a small yes? What do I miss? What do I do only to avoid disappointing someone?',
    support:
      'If the loss of identity feels frightening, persistent, or connected to trauma, depression, or relationship control, therapy can help you rebuild self-trust.',
  },
  'why-do-i-get-so-emotionally-overwhelmed-with-adhd': {
    summary:
      'With ADHD, emotions can arrive fast and intensely because regulation, attention, and nervous system activation are closely connected. The feeling is not immaturity; it may be a regulation load issue.',
    what:
      'You may go from fine to flooded quickly, struggle to pause before reacting, or feel unable to shift attention away from the emotion once it hits.',
    why:
      'ADHD can make it harder to filter, prioritize, and transition. When emotion enters that system, it can take over the whole dashboard.',
    help:
      'Use external supports before the peak: visual reminders, scripts, timers, body movement, reduced stimulation, and a plan for stepping away without abandoning the conversation.',
    support:
      'If emotional overwhelm is damaging relationships, work, or self-trust, ADHD-informed therapy, coaching, or medical support can help build regulation tools.',
  },
};

function readEnv() {
  return Object.fromEntries(
    readFileSync('/Users/rickjulian/.env', 'utf8')
      .split(/\n/)
      .map((line) => line.match(/^\s*([^#=]+)=(.*)$/))
      .filter(Boolean)
      .map((match) => [match[1].trim(), match[2].trim().replace(/^['"]|['"]$/g, '')])
  );
}

function plainText(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, max = 158) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).replace(/\s+\S*$/, '')}...`;
}

function categoryOf(question) {
  return question.category || question.raw_category || 'General Mental Health';
}

function classify(question) {
  const text = `${question.question} ${question.slug} ${categoryOf(question)}`.toLowerCase();
  if (/abusive|gaslighting|toxic relationship/.test(text)) return 'relationship-safety';
  if (/trauma|trigger|survival|disconnected from my body|childhood/.test(text)) return 'trauma';
  if (/therapy|treatment|self-diagnose|therapist/.test(text)) return 'therapy';
  if (/burnout|boss|work|career|imposter|job/.test(text)) return 'work';
  if (/sleep|night|phone/.test(text)) return 'sleep';
  if (/depress|pointless|empty|cry|fog/.test(text)) return 'depression';
  if (/relationship|partner|jealous|friend|trust|love/.test(text)) return 'relationships';
  if (/intrusive/.test(text)) return 'intrusive-thoughts';
  if (/checking|locked|rehearse|worst-case|panic|chest|decision|mistake|anxious|anxiety/.test(text)) return 'anxiety';
  return 'self-understanding';
}

const themeMap = {
  anxiety: ['Anxiety & Stress', ['Uncertainty', 'Nervous system responses', 'Reassurance-seeking']],
  sleep: ['Sleep & Anxiety', ['Racing thoughts', 'Nighttime anxiety', 'Stress regulation']],
  'intrusive-thoughts': ['Intrusive Thoughts', ['Anxiety & Stress', 'Shame', 'Thought-action fusion']],
  depression: ['Depression & Mood', ['Motivation', 'Emotional numbness', 'Self-compassion']],
  relationships: ['Relationships', ['Communication', 'Attachment', 'Trust']],
  'relationship-safety': ['Relationship Safety', ['Emotional abuse', 'Boundaries', 'Support planning']],
  work: ['Stress & Burnout', ['Workplace mental health', 'Boundaries', 'Self-worth']],
  therapy: ['Therapy & Professional Support', ['Care navigation', 'Readiness for therapy', 'Treatment fit']],
  trauma: ['Trauma & Safety', ['Triggers', 'Dissociation', 'Nervous system safety']],
  'self-understanding': ['Emotional Self-Understanding', ['Identity', 'Self-worth', 'Emotional regulation']],
};

const sourceRefLibrary = {
  anxiety: [
    {
      title: 'Anxiety Disorders',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
    },
    {
      title: 'Stress effects on the body',
      publisher: 'American Psychological Association',
      url: 'https://www.apa.org/topics/stress/body',
    },
  ],
  sleep: [
    {
      title: 'About Sleep',
      publisher: 'Centers for Disease Control and Prevention',
      url: 'https://www.cdc.gov/sleep/about/index.html',
    },
    {
      title: 'Caring for Your Mental Health',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
    },
  ],
  'intrusive-thoughts': [
    {
      title: 'Obsessive-Compulsive Disorder (OCD)',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/topics/obsessive-compulsive-disorder-ocd',
    },
    {
      title: 'Obsessive-Compulsive Disorder: When Unwanted Thoughts or Repetitive Behaviors Take Over',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/publications/obsessive-compulsive-disorder-when-unwanted-thoughts-or-repetitive-behaviors-take-over',
    },
  ],
  depression: [
    {
      title: 'Depression',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/topics/depression',
    },
    {
      title: '988 Suicide & Crisis Lifeline',
      publisher: 'Substance Abuse and Mental Health Services Administration',
      url: 'https://www.samhsa.gov/mental-health/988',
    },
  ],
  relationships: [
    {
      title: 'Healthy relationships',
      publisher: 'love is respect',
      url: 'https://www.loveisrespect.org/everyone-deserves-a-healthy-relationship/',
    },
    {
      title: 'Conflict resolution',
      publisher: 'love is respect',
      url: 'https://www.loveisrespect.org/resources/conflict-resolution/',
    },
  ],
  'relationship-safety': [
    {
      title: 'Warning Signs of Abuse',
      publisher: 'The National Domestic Violence Hotline',
      url: 'https://www.thehotline.org/identify-abuse/domestic-abuse-warning-signs/',
    },
    {
      title: 'Relationship spectrum',
      publisher: 'love is respect',
      url: 'https://www.loveisrespect.org/everyone-deserves-a-healthy-relationship/relationship-spectrum/',
    },
  ],
  work: [
    {
      title: 'Burn-out an occupational phenomenon',
      publisher: 'World Health Organization',
      url: 'https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon',
    },
    {
      title: 'Stress effects on the body',
      publisher: 'American Psychological Association',
      url: 'https://www.apa.org/topics/stress/body',
    },
  ],
  therapy: [
    {
      title: 'Psychotherapies',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/topics/psychotherapies',
    },
    {
      title: 'Find Help and Treatment for Mental Health, Drug, Alcohol Issues',
      publisher: 'Substance Abuse and Mental Health Services Administration',
      url: 'https://www.samhsa.gov/find-help',
    },
  ],
  trauma: [
    {
      title: 'Traumatic Events and Post-Traumatic Stress Disorder (PTSD)',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd',
    },
    {
      title: 'Post-Traumatic Stress Disorder',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/publications/post-traumatic-stress-disorder-ptsd',
    },
  ],
  'self-understanding': [
    {
      title: 'Caring for Your Mental Health',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
    },
    {
      title: 'My Mental Health: Do I Need Help?',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/publications/my-mental-health-do-i-need-help',
    },
  ],
  adhd: [
    {
      title: 'Attention-Deficit/Hyperactivity Disorder (ADHD)',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd',
    },
    {
      title: 'ADHD in Adults: 4 Things to Know',
      publisher: 'National Institute of Mental Health',
      url: 'https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know',
    },
  ],
};

const primaryEntityMap = {
  anxiety: ['Anxiety', 'Uncertainty', 'Reassurance-seeking'],
  sleep: ['Sleep', 'Nighttime anxiety', 'Stress regulation'],
  'intrusive-thoughts': ['Intrusive thoughts', 'Obsessions', 'Anxiety'],
  depression: ['Depression', 'Low mood', 'Emotional numbness'],
  relationships: ['Relationship health', 'Communication', 'Boundaries'],
  'relationship-safety': ['Relationship safety', 'Emotional abuse', 'Power and control'],
  work: ['Burnout', 'Work stress', 'Boundaries'],
  therapy: ['Psychotherapy', 'Care navigation', 'Mental health support'],
  trauma: ['Trauma', 'Triggers', 'Nervous system safety'],
  'self-understanding': ['Self-worth', 'Identity', 'Emotional regulation'],
};

const slugEntityOverrides = {
  'i-cannot-stop-checking-if-i-locked-the-door-before-leaving': ['Compulsions', 'Checking', 'Obsessive-compulsive patterns'],
  'how-do-i-stop-checking-my-phone-when-i-c-181083-047': ['Phone checking', 'Sleep disruption', 'Reassurance-seeking'],
  'how-do-i-know-if-im-having-a-panic-attack-184730-067': ['Panic attack', 'Anxiety', 'Body alarm response'],
  'how-do-i-deal-with-intrusive-sexual-thou-177940-031': ['Intrusive thoughts', 'Sexual intrusive thoughts', 'Thought-action fusion'],
  'what-is-gaslighting-and-how-do-i-recogni-186032-030': ['Gaslighting', 'Reality-doubting', 'Emotional abuse'],
  'how-do-i-know-if-im-in-a-toxic-relationship-184730-020': ['Toxic relationship', 'Relationship safety', 'Boundaries'],
  'what-should-i-do-if-i-think-my-friend-is-186032-033': ['Abusive relationship', 'Safety planning', 'Friend support'],
  'why-do-i-get-so-emotionally-overwhelmed-with-adhd': ['ADHD', 'Emotional regulation', 'Executive function'],
};

function entitySlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function entityFor(name, type = 'MentalHealthConcept') {
  return {
    name,
    slug: entitySlug(name),
    type,
    mapping_status: 'draft_mapped',
    needs_editorial_review: true,
  };
}

function sourceRefsFor(kind, question) {
  const existing = Array.isArray(question.source_refs) ? question.source_refs.filter(Boolean) : [];
  if (existing.length) return existing;

  const libraryKey = question.slug === 'why-do-i-get-so-emotionally-overwhelmed-with-adhd' ? 'adhd' : kind;
  return (sourceRefLibrary[libraryKey] ?? sourceRefLibrary['self-understanding']).map((source) => ({
    ...source,
    mapping_status: 'theme_level_mapped',
    needs_editorial_review: true,
  }));
}

function primaryEntitiesFor(kind, question) {
  const existing = Array.isArray(question.primary_entities) ? question.primary_entities.filter(Boolean) : [];
  if (existing.length) return existing;

  const names = slugEntityOverrides[question.slug] ?? primaryEntityMap[kind] ?? primaryEntityMap['self-understanding'];
  return names.map((name) => entityFor(name));
}

function relatedEntitiesFor(relatedThemes) {
  return relatedThemes.map((name) => entityFor(name, 'RelatedTheme'));
}

function mechanismFor(kind) {
  return {
    anxiety: 'your brain may be trying to reduce uncertainty quickly, even if the strategy keeps the alarm system active',
    sleep: 'your brain may be scanning for unfinished worries right when the world gets quiet',
    'intrusive-thoughts': 'the distress may come from how unwanted the thought feels, not from what the thought says about you',
    depression: 'your system may be conserving energy and filtering out meaning, which can make effort feel unrewarding',
    relationships: 'the visible conflict may be carrying a deeper need for safety, honesty, repair, or reassurance',
    'relationship-safety': 'the pattern may be affecting your sense of reality, safety, or freedom to make choices',
    work: 'your body may be treating work pressure as a constant demand rather than a challenge with a finish line',
    therapy: 'the question may be less about having the perfect label and more about finding the right level of support',
    trauma: 'your nervous system may be reacting to old danger cues even when part of you knows the present is different',
    'self-understanding': 'the feeling may be a signal that your self-story needs more care, not proof that you are broken',
  }[kind];
}

function supportLine(kind) {
  if (kind === 'relationship-safety') {
    return 'If you feel unsafe, controlled, threatened, or isolated, consider speaking with a trusted person or a domestic violence support service before making big moves alone.';
  }
  if (kind === 'trauma') {
    return 'If these reactions feel intense, frequent, or hard to come back from, trauma-informed professional support can help you work with them at a safer pace.';
  }
  if (kind === 'depression') {
    return 'If low mood, emptiness, or hopelessness is persistent or affecting daily life, consider reaching out to a licensed professional or a trusted support person.';
  }
  if (kind === 'intrusive-thoughts') {
    return 'If intrusive thoughts are frequent, distressing, or changing your behavior, a mental health professional can help without judging the content of the thoughts.';
  }
  return 'If this pattern is interfering with daily life, sleep, work, relationships, or your sense of safety, consider talking with a licensed mental health professional.';
}

function takeawaysFor(kind, question) {
  const guidance = entryGuidance[question.slug];

  if (guidance) {
    return [
      guidance.what,
      guidance.why,
      guidance.help,
      guidance.support,
    ].map((value) => truncate(value, 170));
  }

  const q = question.question.toLowerCase();
  const base = {
    anxiety: [
      'The problem is often not danger itself, but how urgently your brain wants certainty.',
      'Relief strategies can help briefly while training the alarm to return faster.',
      'Naming the body response can make it easier to choose a next step.',
      'Small experiments with uncertainty can be more useful than trying to feel perfectly calm first.',
    ],
    sleep: [
      'Sleep can make anxiety easier to regulate, and anxiety can make sleep harder to reach.',
      'Nighttime checking often restarts alertness instead of resolving worry.',
      'A wind-down plan works best when it lowers stimulation and reduces decision-making.',
      'If sleep disruption is frequent, support may need to address both stress and sleep habits.',
    ],
    'intrusive-thoughts': [
      'An intrusive thought is unwanted; distress about it does not mean you want it.',
      'Trying to prove the thought false can sometimes keep it more active.',
      'The goal is often changing your relationship to the thought, not arguing with every thought.',
      'Support can help if thoughts become repetitive, frightening, or behavior-shaping.',
    ],
    depression: [
      'Depression can change motivation, energy, and the way meaning feels available.',
      'Waiting to feel motivated can keep you stuck; tiny actions may come first.',
      'Emptiness or fog is a signal to pay attention, not a character flaw.',
      'Support matters when low mood starts narrowing your life or choices.',
    ],
    relationships: [
      'A relationship can feel familiar without feeling emotionally safe.',
      'Repeated conflict often points to an unmet need beneath the topic.',
      'Repair, respect, and freedom to be honest matter more than never fighting.',
      'Support can help you sort patterns without rushing into a label.',
    ],
    'relationship-safety': [
      'Safety concerns deserve careful pacing, not pressure or blame.',
      'Control, fear, isolation, and reality-doubting are more important signals than a single argument.',
      "Support is often most helpful when it preserves the person's agency.",
      'If there is immediate danger, urgent local help may be needed.',
    ],
    work: [
      'Burnout often shows up as depletion, cynicism, and reduced capacity to recover.',
      'Work guilt can make reasonable limits feel like personal failure.',
      'A toxic environment can distort your sense of competence and worth.',
      'Practical boundaries usually work better when paired with support and documentation.',
    ],
    therapy: [
      'You do not have to be in crisis to deserve support.',
      'Therapy fit matters; a stalled process does not automatically mean you failed.',
      'Good care should help you name patterns, choices, and next steps more clearly.',
      'Cost, access, and trust are real barriers that deserve practical options.',
    ],
    trauma: [
      'Trauma responses can show up as body alarms, shutdown, numbness, or old fear in new situations.',
      'The reaction may be protective even when it is no longer well matched to the present.',
      'Gentle grounding can help before deeper processing.',
      'Trauma-informed support can help you move at a pace your system can tolerate.',
    ],
    'self-understanding': [
      'The feeling may be real without being the final truth about you.',
      'Patterns like comparison or self-doubt often get stronger when you treat them as facts.',
      'Small signals of preference, need, and value can rebuild self-trust.',
      'Support can help when the same self-story keeps shrinking your life.',
    ],
  }[kind];

  if (q.includes('checking') || q.includes('locked')) {
    return [
      'Checking can briefly lower anxiety while teaching your brain that certainty requires another check.',
      'The doubt often returns because the issue is tolerance of uncertainty, not memory alone.',
      'A single intentional check plus response prevention can be more useful than repeated reassurance.',
      'If checking consumes time or changes your routines, professional support can help.',
    ];
  }

  return base;
}

function relatedFor(kind, question) {
  const q = question.question.toLowerCase();
  if (q.includes('checking') || q.includes('locked')) {
    return [
      'Why do I still feel unsure after checking?',
      'Is repeated checking always OCD?',
      'How can I stop reassurance-seeking?',
      'What is exposure and response prevention?',
      'Why does certainty never last?',
    ];
  }

  return {
    anxiety: [
      'Why does anxiety make small things feel urgent?',
      'How can I tell the difference between caution and avoidance?',
      'What helps when reassurance only works for a minute?',
      'How do I calm my body before solving the problem?',
    ],
    sleep: [
      'Why does my mind race when I try to sleep?',
      'Can anxiety cause insomnia?',
      'How do I stop checking my phone at night?',
      'What should I do when I wake up anxious?',
    ],
    'intrusive-thoughts': [
      'Why do intrusive thoughts feel so real?',
      'Do intrusive thoughts mean I want them?',
      'How do I stop checking whether a thought is true?',
      'When should I get help for intrusive thoughts?',
    ],
    depression: [
      'Why does depression make everything feel pointless?',
      'How do I take action when I have no motivation?',
      'Is emotional numbness part of depression?',
      'When should I talk to someone about low mood?',
    ],
    relationships: [
      'How do I know if a relationship is emotionally safe?',
      'Why do we keep having the same argument?',
      'How do I set a boundary without escalating conflict?',
      'What does healthy repair look like?',
    ],
    'relationship-safety': [
      'What are signs of emotional abuse?',
      'How can I support a friend without pressuring them?',
      'What should I do if I feel unsafe in a relationship?',
      'How do I make a safety plan quietly?',
    ],
    work: [
      'How do I know if I am burned out?',
      'How do I set boundaries at work?',
      'Why do I tie my worth to productivity?',
      'What helps when work stress follows me home?',
    ],
    therapy: [
      'How do I know if therapy is working?',
      'What should I ask a new therapist?',
      'What if I cannot afford therapy?',
      'How do I know what kind of support I need?',
    ],
    trauma: [
      'Why do harmless things trigger me?',
      'How can I ground myself after a trauma trigger?',
      'What does trauma-informed therapy mean?',
      'Why do I feel disconnected from my body?',
    ],
    'self-understanding': [
      'Why do I compare myself to others so much?',
      'How do I rebuild self-trust?',
      'What helps when I do not know who I am?',
      'How do I stop treating feelings like facts?',
    ],
  }[kind];
}

function bodyFor(kind, question) {
  const guidance = entryGuidance[question.slug];

  if (!guidance) {
    throw new Error(`Missing entry-specific guidance for ${question.slug}`);
  }

  return [
    {
      type: 'what_may_be_happening',
      heading: 'What may be happening?',
      body: guidance.what,
    },
    {
      type: 'why_it_feels_hard_to_stop',
      heading: 'Why can it feel hard to stop?',
      body: guidance.why,
    },
    {
      type: 'what_can_help',
      heading: 'What can help?',
      body: guidance.help,
    },
    {
      type: 'when_to_get_support',
      heading: 'When should you get support?',
      body: guidance.support,
    },
  ];
}

function draftFor(question) {
  const kind = classify(question);
  const [primaryTheme, relatedThemes] = themeMap[kind];
  const guidance = entryGuidance[question.slug];
  if (!guidance) throw new Error(`Missing entry-specific guidance for ${question.slug}`);

  const copy = copyOverrides[question.slug] ?? {
    title: question.question,
    meta: truncate(`${question.question.replace(/\?$/, '')} may be more about ${mechanismFor(kind)}. Here is a clearer way to understand the pattern.`, 156),
  };
  const body = bodyFor(kind, question);
  const answerText = `${guidance.summary} ${body[2].body}`;
  const existingSourceRefs = Array.isArray(question.source_refs) ? question.source_refs.filter(Boolean) : [];
  const existingPrimaryEntities = Array.isArray(question.primary_entities) ? question.primary_entities.filter(Boolean) : [];
  const sourceRefs = sourceRefsFor(kind, question);
  const primaryEntities = primaryEntitiesFor(kind, question);
  const relatedEntities = relatedEntitiesFor(relatedThemes);
  const safetyFlags = [];

  if (['relationship-safety', 'trauma', 'intrusive-thoughts', 'depression'].includes(kind)) {
    safetyFlags.push(kind);
  }

  if (/suicide|self-harm|kill myself|unsafe|abusive|abuse|panic|trauma/i.test(`${question.question} ${question.answer}`)) {
    safetyFlags.push('tone-and-safety-review');
  }

  const citationGaps = [];
  if (!sourceRefs.length) citationGaps.push('No source_refs present on source row.');
  if (!primaryEntities.length) citationGaps.push('No primary_entities present on source row.');
  const refsWereMapped = !existingSourceRefs.length;
  const entitiesWereMapped = !existingPrimaryEntities.length;

  return {
    question_id: String(question.id),
    question_slug: question.slug,
    original_title: question.question,
    original_category: categoryOf(question),
    prompt_version: PROMPT_VERSION,
    model: MODEL,
    enriched_title: copy.title,
    enriched_meta_description: truncate(copy.meta, 158),
    enriched_summary: guidance.summary,
    key_takeaways: takeawaysFor(kind, question),
    enriched_answer_body: body,
    enriched_care_note: guidance.support,
    related_questions: relatedFor(kind, question),
    schema_question: question.question,
    schema_answer: truncate(answerText, 700),
    primary_theme: primaryTheme,
    related_themes: relatedThemes,
    source_refs: sourceRefs,
    primary_entities: primaryEntities,
    related_entities: relatedEntities,
    citation_notes: citationGaps.length
      ? 'Draft uses source-row answer text only; add reviewed source_refs before publication where evidence-sensitive.'
      : refsWereMapped || entitiesWereMapped
        ? 'Theme-level source_refs and primary_entities were mapped for draft review; verify source fit before publication.'
        : 'Source refs/entities were present on the source row; verify citation fit before publication.',
    safety_flags: [...new Set(safetyFlags)],
    citation_gaps: citationGaps,
    enrichment_status: 'draft',
    quality_passed: false,
    should_not_publish_yet: true,
  };
}

function sqlString(value) {
  if (value === null || value === undefined) return 'null';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function buildInsertSql(drafts) {
  const columns = [
    'question_id',
    'question_slug',
    'original_title',
    'original_category',
    'prompt_version',
    'model',
    'enriched_title',
    'enriched_meta_description',
    'enriched_summary',
    'key_takeaways',
    'enriched_answer_body',
    'enriched_care_note',
    'related_questions',
    'schema_question',
    'schema_answer',
    'primary_theme',
    'related_themes',
    'source_refs',
    'primary_entities',
    'related_entities',
    'citation_notes',
    'safety_flags',
    'citation_gaps',
    'enrichment_status',
    'quality_passed',
  ];

  const values = drafts.map((draft) => {
    const row = [
      sqlString(draft.question_id),
      sqlString(draft.question_slug),
      sqlString(draft.original_title),
      sqlString(draft.original_category),
      sqlString(draft.prompt_version),
      sqlString(draft.model),
      sqlString(draft.enriched_title),
      sqlString(draft.enriched_meta_description),
      sqlString(draft.enriched_summary),
      sqlJson(draft.key_takeaways),
      sqlJson(draft.enriched_answer_body),
      sqlString(draft.enriched_care_note),
      sqlJson(draft.related_questions),
      sqlString(draft.schema_question),
      sqlString(draft.schema_answer),
      sqlString(draft.primary_theme),
      sqlJson(draft.related_themes),
      sqlJson(draft.source_refs),
      sqlJson(draft.primary_entities),
      sqlJson(draft.related_entities),
      sqlString(draft.citation_notes),
      sqlJson(draft.safety_flags),
      sqlJson(draft.citation_gaps),
      sqlString(draft.enrichment_status),
      draft.quality_passed ? 'true' : 'false',
    ];

    return `  (${row.join(', ')})`;
  });

  return `insert into public.answer_enrichment_drafts (${columns.join(', ')})\nvalues\n${values.join(',\n')}\non conflict (question_id, prompt_version) do update set\n  question_slug = excluded.question_slug,\n  original_title = excluded.original_title,\n  original_category = excluded.original_category,\n  model = excluded.model,\n  enriched_title = excluded.enriched_title,\n  enriched_meta_description = excluded.enriched_meta_description,\n  enriched_summary = excluded.enriched_summary,\n  key_takeaways = excluded.key_takeaways,\n  enriched_answer_body = excluded.enriched_answer_body,\n  enriched_care_note = excluded.enriched_care_note,\n  related_questions = excluded.related_questions,\n  schema_question = excluded.schema_question,\n  schema_answer = excluded.schema_answer,\n  primary_theme = excluded.primary_theme,\n  related_themes = excluded.related_themes,\n  source_refs = excluded.source_refs,\n  primary_entities = excluded.primary_entities,\n  related_entities = excluded.related_entities,\n  citation_notes = excluded.citation_notes,\n  safety_flags = excluded.safety_flags,\n  citation_gaps = excluded.citation_gaps,\n  enrichment_status = 'draft',\n  quality_passed = false,\n  reviewed_at = null,\n  reviewed_by = null,\n  promoted_at = null;\n`;
}

function markdownReport(drafts) {
  const lines = [
    '# Deeper Global Enrichment Pilot Review',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Prompt version: ${PROMPT_VERSION}`,
    `Draft count: ${drafts.length}`,
    '',
    'No entries are approved for publication yet. All rows are draft-only and require manual editorial review.',
    '',
    '| Slug | Original title | Enriched title | Meta description | Primary theme | Related themes | Source refs | Primary entities | Status | Safety flags | Citation gaps | Publish? |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|',
  ];

  for (const draft of drafts) {
    lines.push(
      [
        draft.question_slug,
        draft.original_title,
        draft.enriched_title,
        draft.enriched_meta_description,
        draft.primary_theme,
        draft.related_themes.join(', '),
        String(draft.source_refs.length),
        draft.primary_entities.map((entity) => entity.name ?? entity).join(', '),
        draft.enrichment_status,
        draft.safety_flags.join(', ') || 'none',
        draft.citation_gaps.join('; ') || 'none',
        'do not publish yet',
      ]
        .map((cell) => String(cell).replace(/\|/g, '\\|'))
        .join(' | ')
        .replace(/^/, '| ')
        .replace(/$/, ' |')
    );
  }

  lines.push('', '## Entries That Should Not Be Published Yet', '');
  for (const draft of drafts) {
    lines.push(`- ${draft.question_slug}: requires editorial review${draft.safety_flags.length ? `; safety flags: ${draft.safety_flags.join(', ')}` : ''}${draft.citation_gaps.length ? `; citation gaps: ${draft.citation_gaps.join('; ')}` : ''}.`);
  }

  return `${lines.join('\n')}\n`;
}

async function fetchQuestions() {
  const env = readEnv();
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  const pages = [];

  for (let from = 0; ; from += 1000) {
    const { data, error } = await client
      .from('questions_master')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + 999);

    if (error) throw error;
    pages.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }

  return pages;
}

async function loadQuestions() {
  try {
    return {
      questions: await fetchQuestions(),
      sourceMode: 'supabase',
      fetchError: null,
    };
  } catch (error) {
    if (process.env.ALLOW_STALE_PILOT_SOURCE !== '1') throw error;

    const existingDrafts = JSON.parse(readFileSync(`${OUT_DIR}/pilot-drafts.json`, 'utf8'));
    return {
      questions: existingDrafts.map((draft) => ({
        id: draft.question_id,
        slug: draft.question_slug,
        question: draft.original_title,
        category: draft.original_category,
        raw_category: draft.original_category,
        short_answer: '',
        answer: '',
        answer_html: '',
        source_refs: [],
        primary_entities: [],
      })),
      sourceMode: 'stale_pilot_snapshot',
      fetchError: error?.message ?? String(error),
    };
  }
}

const { questions, sourceMode, fetchError } = await loadQuestions();
const bySlug = new Map(questions.map((question) => [question.slug, question]));
const missing = pilotSlugs.filter((slug) => !bySlug.has(slug));

if (missing.length) {
  throw new Error(`Missing pilot slugs: ${missing.join(', ')}`);
}

const oldContentHash = createHash('sha256')
  .update(
    JSON.stringify(
      questions
        .map((question) => ({
          id: question.id,
          slug: question.slug,
          question: question.question,
          short_answer: question.short_answer,
          answer: question.answer,
          answer_html: question.answer_html,
          category: question.category,
          raw_category: question.raw_category,
        }))
        .sort((a, b) => String(a.id).localeCompare(String(b.id)))
    )
  )
  .digest('hex');

const drafts = pilotSlugs.map((slug) => draftFor(bySlug.get(slug)));

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(`${OUT_DIR}/pilot-drafts.json`, `${JSON.stringify(drafts, null, 2)}\n`);
writeFileSync(`${OUT_DIR}/pilot-insert.sql`, buildInsertSql(drafts));
writeFileSync(`${OUT_DIR}/review-report.md`, markdownReport(drafts));
writeFileSync(
  `${OUT_DIR}/source-content-hash-before.json`,
  `${JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      source_table: 'questions_master',
      source_mode: sourceMode,
      fetch_error: fetchError,
      row_count: questions.length,
      hash_fields: ['id', 'slug', 'question', 'short_answer', 'answer', 'answer_html', 'category', 'raw_category'],
      sha256: oldContentHash,
      selected_count: drafts.length,
    },
    null,
    2
  )}\n`
);

console.log(`Generated ${drafts.length} pilot drafts in ${OUT_DIR}`);
console.log(`Source content hash: ${oldContentHash}`);
console.log(`Source mode: ${sourceMode}`);
