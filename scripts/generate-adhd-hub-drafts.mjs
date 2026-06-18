#!/usr/bin/env node
/**
 * Generate ADHD hub seed drafts for publish → rewrite → promote workflow.
 *
 *   node scripts/generate-adhd-hub-drafts.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '../reports/adhd-hub/draft-answers/batch-01-drafts.json');

const CDC_ADULT = {
  title: 'ADHD in Adults',
  url: 'https://www.cdc.gov/adhd/adults/index.html',
  publisher: 'CDC',
  note: 'Overview of adult ADHD symptoms, diagnosis, and treatment options.',
};

const NIMH_ADHD = {
  title: 'Attention-Deficit/Hyperactivity Disorder',
  url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd',
  publisher: 'NIMH',
  note: 'National Institute of Mental Health overview of ADHD.',
};

function seed({
  question,
  slug,
  theme,
  summary,
  takeaways,
  experiencing,
  help,
  reach,
  related,
  careNote = 'This information is educational and not a substitute for diagnosis or treatment. A psychiatrist, psychologist, or other licensed clinician can help determine whether ADHD or another condition explains your symptoms.',
}) {
  return {
    question,
    slug,
    category: 'Neurodivergence & Attention',
    review_status: 'draft',
    indexation_instruction: 'noindex_until_reviewed',
    improved_title: question.endsWith('?') ? question.slice(0, -1) : question,
    improved_meta_description: summary.slice(0, 155),
    improved_summary: summary,
    key_takeaways: takeaways,
    answer_sections: [
      { type: 'section', heading: 'What you might be experiencing', body: experiencing },
      { type: 'section', heading: 'What can help', body: help },
      { type: 'section', heading: 'When to reach out', body: reach },
    ],
    care_note: careNote,
    related_questions: related,
    suggested_schema_question: question,
    suggested_schema_answer: summary,
    primary_theme: theme,
    related_themes: [theme, 'ADHD', 'Executive function', 'Neurodivergence'],
    source_refs: [CDC_ADULT, NIMH_ADHD],
    citation_gaps: [],
    safety_flags: [],
    draft_notes: 'ADHD hub seed draft. Run content:rewrite-answers-claude before promote.',
  };
}

const drafts = [
  seed({
    question: 'What is ADHD and how is it different from just being distracted?',
    slug: 'what-is-adhd-and-how-is-it-different-from-just-being-distracted',
    theme: 'ADHD basics',
    summary:
      'ADHD is a neurodevelopmental condition that affects attention regulation, impulse control, and executive function—not simply occasional distraction. Everyone loses focus sometimes; ADHD involves persistent patterns that affect daily life across settings.',
    takeaways: [
      'ADHD is a recognized neurodevelopmental condition, not a character flaw or lack of effort.',
      'Core difficulties often include attention regulation, impulse control, and executive function.',
      'Symptoms usually appear in childhood and can persist or become clearer in adulthood.',
      'Occasional distraction is normal; ADHD involves patterns that impair work, relationships, or self-care.',
      'Accurate diagnosis requires a qualified clinician who rules out other explanations.',
    ],
    experiencing:
      'You may notice that distraction is not occasional—it shows up when you are trying to start tasks, finish projects, listen in conversations, or keep track of time. You might rely heavily on urgency, shame, or external pressure to get moving.\n\nMany people describe a gap between knowing what to do and being able to do it consistently, especially with boring, complex, or open-ended tasks.',
    help:
      'Learning how ADHD affects your brain can reduce self-blame and help you choose supports that fit. External structure—timers, lists, body doubling, shorter work blocks—often works better than willpower alone.\n\nIf patterns are persistent, a formal evaluation can clarify whether ADHD, anxiety, sleep problems, trauma, or another condition is driving the experience.',
    reach:
      'Consider professional evaluation if attention problems persist across months, affect multiple areas of life, or leave you feeling stuck despite real effort. A psychiatrist, psychologist, or other licensed clinician can assess symptoms and discuss treatment options.',
    related: [
      'How do I know if I have ADHD as an adult?',
      'How do I get tested for ADHD as an adult?',
      'What is executive dysfunction and how does it affect daily life?',
    ],
  }),
  seed({
    question: 'How do I get tested for ADHD as an adult?',
    slug: 'how-do-i-get-tested-for-adhd-as-an-adult',
    theme: 'ADHD assessment',
    summary:
      'Adult ADHD assessment usually involves a clinical interview, standardized questionnaires, developmental history, and ruling out other conditions. Start with your primary care clinician or a psychiatrist or psychologist experienced in adult ADHD.',
    takeaways: [
      'Adult ADHD evaluation typically includes interviews, rating scales, and childhood history.',
      'Clinicians also screen for anxiety, depression, sleep disorders, trauma, and substance use.',
      'There is no single blood test or scan that diagnoses ADHD on its own.',
      'Bring examples of how symptoms affect work, relationships, finances, or daily routines.',
      'A clear diagnosis can open the door to treatment, accommodations, and targeted coping strategies.',
    ],
    experiencing:
      'You may have wondered for years whether your struggles with focus, follow-through, or emotional intensity have a name. Maybe teachers or family missed signs in childhood, or you compensated until adult responsibilities made the gaps harder to hide.\n\nSeeking testing can feel vulnerable if you worry about being dismissed or labeled.',
    help:
      'Ask your primary care clinician for a referral to psychiatry or psychology, or search for providers who list adult ADHD assessment. Before the visit, write concrete examples from the last month.\n\nGather school records or a parent or sibling who can describe childhood patterns if possible. Honest reporting matters more than trying to perform well in the appointment.',
    reach:
      'Book an evaluation if symptoms significantly affect functioning and have been present across much of your life. If waiting lists are long, ask about interim supports such as therapy for executive function or anxiety while you wait.',
    related: [
      'How do I know if I have ADHD as an adult?',
      'What are the signs of ADHD in women?',
      'Can trauma look like ADHD?',
    ],
  }),
  seed({
    question: 'What are the signs of ADHD in women?',
    slug: 'what-are-the-signs-of-adhd-in-women',
    theme: 'ADHD in women',
    summary:
      'ADHD in women and girls is often missed because symptoms may show up as daydreaming, emotional overwhelm, perfectionism, or internal restlessness rather than obvious hyperactivity. Late diagnosis is common.',
    takeaways: [
      'Inattentive presentation is especially common in girls and women and is easier to overlook.',
      'Signs may include chronic overwhelm, shame, rejection sensitivity, and difficulty finishing tasks.',
      'Hormonal changes, parenting demands, and masking can intensify symptoms in adulthood.',
      'Many women are diagnosed after a child’s evaluation or during a mental health crisis.',
      'Accurate assessment should consider both childhood history and current functional impact.',
    ],
    experiencing:
      'You might look composed on the outside while your mind races, or you may feel exhausted from compensating all day. Tasks pile up, emotional reactions feel bigger than the moment warrants, and you may blame yourself for not being organized like other people seem to be.\n\nSocial expectations for women to manage households, emotions, and careers simultaneously can make ADHD harder to spot.',
    help:
      'Track patterns across settings—work, home, relationships—and note when symptoms began or worsened. Share both struggles and coping strategies with a clinician; masking can hide the full picture.\n\nConnect with providers who understand gender differences in ADHD presentation, and consider whether anxiety or hormonal shifts are layering on top of attention difficulties.',
    reach:
      'Seek evaluation if you see a long-standing pattern of overwhelm, disorganization, or emotional flooding that therapy alone has not fully explained. You deserve assessment that takes women’s presentations seriously.',
    related: [
      'How do I know if I have ADHD as an adult?',
      'What is rejection sensitive dysphoria and ADHD?',
      'Why do I get so emotionally overwhelmed with ADHD?',
    ],
  }),
  seed({
    question: 'Can ADHD cause anxiety and depression?',
    slug: 'can-adhd-cause-anxiety-and-depression',
    theme: 'ADHD and mood',
    summary:
      'ADHD does not automatically cause anxiety or depression, but living with untreated ADHD—missed deadlines, chronic overwhelm, rejection sensitivity—can increase risk for both. They can also coexist as separate conditions that need distinct treatment.',
    takeaways: [
      'ADHD, anxiety, and depression frequently overlap but are not the same condition.',
      'Years of underperformance and criticism can contribute to low mood and worry.',
      'Stimulant and non-stimulant ADHD treatments may help mood indirectly by improving function.',
      'Some anxiety symptoms mimic ADHD, so careful assessment matters.',
      'Treating only one condition may leave significant symptoms unresolved.',
    ],
    experiencing:
      'You may feel anxious because you are always behind, or depressed because you cannot trust yourself to follow through. The emotional weight of repeated disappointment can look like a mood disorder even when ADHD is the underlying driver.\n\nAt the same time, true anxiety or depression may exist alongside ADHD and require their own treatment plan.',
    help:
      'Tell clinicians about the full timeline: which symptoms came first, and what improves with structure versus what persists. Therapy that targets shame, avoidance, and executive function can help even before medication decisions.\n\nDo not assume one diagnosis explains everything; integrated treatment often works best.',
    reach:
      'Reach out promptly if you have persistent low mood, panic, hopelessness, or suicidal thoughts. A clinician can evaluate ADHD, anxiety, and depression together and build a coordinated plan.',
    related: [
      'How do I know if I have ADHD as an adult?',
      'How do I manage ADHD without medication?',
      'Why do I get so emotionally overwhelmed with ADHD?',
    ],
  }),
  seed({
    question: 'How do I cope with ADHD time blindness?',
    slug: 'how-do-i-cope-with-adhd-time-blindness',
    theme: 'ADHD time blindness',
    summary:
      'ADHD time blindness is difficulty sensing how long tasks take and how much time has passed. External timers, visible clocks, time estimates, and transition warnings usually help more than trying to feel time internally.',
    takeaways: [
      'Time blindness reflects brain-based difficulty tracking duration, not laziness.',
      'Visible timers and alarms reduce reliance on internal time sense.',
      'Building in transition buffers lowers the shock of switching tasks.',
      'Over-scheduling often fails; realistic estimates and fewer commitments work better.',
      'Body-based cues like hunger or fatigue can substitute when clocks are missed.',
    ],
    experiencing:
      'You may sit down for a quick task and emerge hours later, or consistently underestimate how long getting ready will take. Deadlines feel abstract until they are immediate, and transitions between activities can feel jarring or impossible.\n\nThis can strain relationships when others interpret lateness as disrespect.',
    help:
      'Use timers you can see, not just hear. Practice estimating task length, then compare estimates to actual time for a week. Schedule buffer zones before appointments.\n\nPair unpleasant tasks with a clear start cue and a defined endpoint so your brain knows the suffering is bounded.',
    reach:
      'If time blindness is derailing work, parenting, or health routines, an ADHD-informed therapist or coach can help design systems. Medication may also improve time awareness for some people.',
    related: [
      'What is executive dysfunction and how does it affect daily life?',
      'How do I build routines with ADHD?',
      'How do I stop forgetting things with ADHD?',
    ],
  }),
  seed({
    question: 'What is rejection sensitive dysphoria and is it related to ADHD?',
    slug: 'what-is-rejection-sensitive-dysphoria-and-adhd',
    theme: 'Rejection sensitive dysphoria',
    summary:
      'Rejection sensitive dysphoria (RSD) describes intense emotional pain in response to perceived rejection or criticism. It is not an official diagnosis, but many people with ADHD report this pattern and benefit from skills, therapy, and sometimes medication.',
    takeaways: [
      'RSD is a descriptive term for severe emotional pain after perceived rejection or failure.',
      'It is commonly reported among people with ADHD but is not a formal standalone diagnosis.',
      'The pain can be sudden, disproportionate, and followed by shame or withdrawal.',
      'Therapy, emotional regulation skills, and ADHD treatment may reduce intensity.',
      'Distinguishing RSD from depression or social anxiety helps target the right support.',
    ],
    experiencing:
      'A small correction at work or a delayed text reply might flood you with shame, anger, or the urge to disappear. You may replay interactions for days or avoid situations where criticism is possible, even when you want connection.\n\nThe feeling can be so intense that it seems like proof you are fundamentally flawed.',
    help:
      'Name the pattern when it happens: intense rejection pain may be RSD, not an accurate measure of your worth. Pause before reacting, and ask a trusted person how they interpreted the situation.\n\nTherapy approaches such as CBT, DBT skills, or ADHD-informed coaching can build tolerance for feedback without collapse.',
    reach:
      'Seek professional support if rejection pain leads to self-harm thoughts, relationship ruptures, or avoidance that limits your life. A clinician can assess ADHD, mood disorders, and trauma responses together.',
    related: [
      'Why do I get so emotionally overwhelmed with ADHD?',
      'How do I manage ADHD in relationships?',
      'What should I tell my partner about ADHD?',
    ],
  }),
  seed({
    question: 'How do I build routines with ADHD?',
    slug: 'how-do-i-build-routines-with-adhd',
    theme: 'ADHD routines',
    summary:
      'ADHD-friendly routines are short, visible, and forgiving—not perfect streaks. Anchor one habit to an existing cue, reduce steps, and rebuild after missed days without shame.',
    takeaways: [
      'Routines fail when they are too ambitious or depend on motivation alone.',
      'Habit stacking—linking a new action to an existing cue—increases follow-through.',
      'Visual checklists and environmental setup reduce decision fatigue.',
      'Missing a day is normal; restarting without punishment keeps momentum.',
      'Medication, therapy, or coaching can make routine-building more realistic.',
    ],
    experiencing:
      'You may create elaborate morning or evening plans that collapse by day three. Novelty helps you start, but maintenance feels impossible once boredom arrives. Without routines, basic self-care and household tasks become unpredictable.\n\nShame after failed attempts can make you avoid trying again.',
    help:
      'Pick one tiny routine—two minutes of dishes, laying out clothes, or a walk after coffee—and tie it to something you already do daily. Put supplies in sight and remove extra decisions.\n\nTrack completion with a simple checkbox, not a streak app that punishes misses. Celebrate partial success.',
    reach:
      'If inability to maintain routines is threatening health, housing, or employment, professional support can help you design ADHD-compatible systems instead of copying neurotypical advice.',
    related: [
      'What is executive dysfunction and how does it affect daily life?',
      'How do I cope with ADHD time blindness?',
      'How do I manage ADHD burnout?',
    ],
  }),
  seed({
    question: 'How do I stay focused at work with ADHD?',
    slug: 'how-do-i-stay-focused-at-work-with-adhd',
    theme: 'ADHD at work',
    summary:
      'Staying focused at work with ADHD usually requires environmental changes—fewer interruptions, clearer priorities, timed work blocks—and may include medication or workplace accommodations.',
    takeaways: [
      'Open offices, email pings, and vague tasks are especially hard with ADHD.',
      'Short focused sprints with timed breaks often outperform long unstructured blocks.',
      'Writing priorities the night before reduces morning decision paralysis.',
      'Noise-canceling tools, privacy, or flexible scheduling can be legitimate accommodations.',
      'Untreated ADHD at work often shows up as missed details, lateness, or conflict—not laziness.',
    ],
    experiencing:
      'You might hyperfocus on interesting work while urgent boring tasks stall, or you may constantly switch between tabs and conversations. Meetings drain you, and by afternoon your brain feels like static.\n\nPerformance reviews may mention potential you are not consistently reaching.',
    help:
      'Block focus time on your calendar and communicate boundaries kindly. Break projects into visible next actions. Use a single capture system for tasks so ideas stop hijacking attention.\n\nIf disclosure feels safe, discuss accommodations with HR or your manager using specific functional needs rather than labels alone.',
    reach:
      'Consider clinical evaluation if work performance is at risk despite sincere effort. Occupational stress plus untreated ADHD can worsen anxiety and burnout quickly.',
    related: [
      'How do I explain ADHD to my employer?',
      'What workplace accommodations help adults with ADHD?',
      'How do I manage ADHD burnout?',
    ],
  }),
  seed({
    question: 'How do I manage ADHD in relationships?',
    slug: 'how-do-i-manage-adhd-in-relationships',
    theme: 'ADHD and relationships',
    summary:
      'ADHD can affect relationships through forgotten plans, emotional reactivity, distraction during conversations, and uneven task sharing. Clear agreements, repair after conflict, and shared education about ADHD reduce resentment on both sides.',
    takeaways: [
      'Partners may misread ADHD symptoms as lack of care or respect.',
      'Shared calendars, explicit task ownership, and check-in rituals reduce friction.',
      'Emotional intensity and rejection sensitivity can escalate small disagreements.',
      'Couples therapy with ADHD awareness helps translate patterns into workable agreements.',
      'Treatment for ADHD often improves reliability and emotional regulation over time.',
    ],
    experiencing:
      'You might forget commitments, tune out mid-conversation, or explode over minor feedback. Your partner may feel like they carry the mental load while you handle crises only when urgency hits.\n\nOver time both people can feel lonely and misunderstood.',
    help:
      'Talk about ADHD as a brain-based pattern, not an excuse. Agree on who owns which tasks and how reminders will work without nagging. Schedule weekly connection time without screens.\n\nPractice repair scripts after conflict so shame does not freeze the relationship.',
    reach:
      'Seek couples therapy if the same fights repeat without resolution, or if ADHD symptoms are eroding trust. Individual ADHD treatment can also relieve pressure on the relationship.',
    related: [
      'What should I tell my partner about ADHD?',
      'What is rejection sensitive dysphoria and ADHD?',
      'Why do I get so emotionally overwhelmed with ADHD?',
    ],
  }),
  seed({
    question: 'What should I tell my partner about ADHD?',
    slug: 'what-should-i-tell-my-partner-about-adhd',
    theme: 'Disclosing ADHD',
    summary:
      'Tell your partner what ADHD means for you specifically—which tasks are hard, what helps, and what you are working on—rather than offering a textbook definition alone.',
    takeaways: [
      'Focus on lived impact: forgetfulness, time blindness, emotional intensity, or task initiation.',
      'Share what support helps and what feels patronizing.',
      'ADHD explains patterns; it does not remove responsibility for repair and follow-through.',
      'Invite questions and offer resources if your partner wants to learn more.',
      'Ongoing conversations work better than one overwhelming disclosure.',
    ],
    experiencing:
      'You may worry that explaining ADHD will sound like making excuses, or that your partner will lose patience if they already feel burdened. Timing matters—mid-argument disclosures rarely land well.\n\nYou might also fear being seen as less capable or lovable.',
    help:
      'Choose a calm moment and use concrete examples: "When I miss texts, it is not because I do not care—I lose track when my brain is overloaded." Ask for specific accommodations you both can try for a month.\n\nOffer to revisit the conversation after they have had time to process.',
    reach:
      'If disclosure leads to ridicule or refusal to engage, that is important relationship information. Couples therapy can mediate when partners disagree about ADHD’s role in conflicts.',
    related: [
      'How do I manage ADHD in relationships?',
      'What is rejection sensitive dysphoria and ADHD?',
      'How do I know if I have ADHD as an adult?',
    ],
  }),
  seed({
    question: 'How do I study with ADHD?',
    slug: 'how-do-i-study-with-adhd',
    theme: 'ADHD and learning',
    summary:
      'Studying with ADHD works best in short sessions, active formats, and low-distraction environments—with movement, timers, and frequent retrieval practice instead of passive rereading.',
    takeaways: [
      'Passive reading often fails; active recall and practice questions work better.',
      'Twenty-five-minute focus blocks with breaks match many ADHD brains better than marathon sessions.',
      'Studying in the same distraction-minimized spot builds a cue for focus.',
      'Medication timing, sleep, and protein-rich meals affect study capacity.',
      'Disability services may provide extended time, quiet rooms, or note supports.',
    ],
    experiencing:
      'You may highlight pages for hours without remembering content, or procrastinate until panic fuels an all-nighter. Group study can help or derail depending on social energy.\n\nOnline courses with unlimited flexibility sometimes make starting hardest.',
    help:
      'Use practice tests, flashcards, or teaching the material aloud. Put your phone in another room and use a visible timer. Start with an easy five-minute warm-up task to lower activation energy.\n\nRegister with disability services early if you are eligible for accommodations.',
    reach:
      'If academic failure is threatening your program or mental health, meet with a counselor and an ADHD-informed clinician. You may need formal supports beyond study hacks alone.',
    related: [
      'How do I stay focused at work with ADHD?',
      'What is executive dysfunction and how does it affect daily life?',
      'How do I build routines with ADHD?',
    ],
  }),
  seed({
    question: 'How do ADHD medications work?',
    slug: 'how-do-adhd-medications-work',
    theme: 'ADHD medication',
    summary:
      'ADHD medications—often stimulants or non-stimulants—aim to improve signaling in brain networks involved in attention and impulse control. They help many people but require medical supervision, monitoring, and realistic expectations.',
    takeaways: [
      'Stimulant medications are first-line for many adults with ADHD and are effective for a substantial share of patients.',
      'Non-stimulant options exist when stimulants are not tolerated or preferred.',
      'Medication does not fix environment problems or teach skills on its own.',
      'Heart history, sleep, anxiety, and substance use should be reviewed before starting.',
      'Finding the right dose is iterative and should involve follow-up with a prescriber.',
    ],
    experiencing:
      'You may hope medication will be a miracle or fear it will change your personality. Others in your life may have strong opinions about stimulants that do not match your lived experience.\n\nTrial periods can feel uncertain when benefits are subtle at first.',
    help:
      'Work with a psychiatrist or knowledgeable prescriber who monitors response and side effects. Combine medication with skills training, therapy, or coaching when possible.\n\nTrack sleep, appetite, mood, and focus in a simple log for follow-up visits.',
    reach:
      'Contact your prescriber promptly for chest pain, severe insomnia, agitation, or mood worsening. If you have active substance use disorder, discuss risk-benefit openly before starting stimulants.',
    related: [
      'How do I manage ADHD without medication?',
      'How do I know if I have ADHD as an adult?',
      'Can ADHD cause anxiety and depression?',
    ],
  }),
  seed({
    question: 'What is the difference between ADHD and bipolar disorder?',
    slug: 'what-is-the-difference-between-adhd-and-bipolar-disorder',
    theme: 'ADHD differential diagnosis',
    summary:
      'ADHD involves chronic attention and impulse patterns from childhood, while bipolar disorder involves episodic mood elevations and depressions. They can coexist and require careful psychiatric assessment.',
    takeaways: [
      'ADHD symptoms are typically persistent across years; bipolar mood episodes come and go.',
      'Hyperactivity in ADHD differs from manic energy, which may include decreased need for sleep and risky behavior.',
      'Both conditions can involve impulsivity and racing thoughts during some phases.',
      'Stimulants without mood stabilization can worsen bipolar symptoms in some people.',
      'Accurate diagnosis guides safe medication and therapy choices.',
    ],
    experiencing:
      'You may have been told you are moody and scattered, leaving you unsure which label fits. Periods of high productivity might be ADHD hyperfocus or hypomania depending on sleep, judgment, and duration.\n\nMisdiagnosis can lead to treatments that help one condition and harm another.',
    help:
      'Track mood, sleep, energy, and impulsivity daily for several weeks before specialist appointments. Note whether attention problems persist even when mood is stable.\n\nAsk evaluators how they distinguish episodic mood change from chronic executive function difficulties.',
    reach:
      'Seek urgent help for mania with reckless behavior, psychosis, or suicidal thoughts. Routine psychiatric evaluation is appropriate when mood swings and attention problems both significantly affect life.',
    related: [
      'How do I know if I have ADHD as an adult?',
      'Can ADHD cause anxiety and depression?',
      'How do ADHD medications work?',
    ],
  }),
  seed({
    question: 'Can trauma look like ADHD?',
    slug: 'can-trauma-look-like-adhd',
    theme: 'Trauma and ADHD',
    summary:
      'Trauma can cause concentration problems, restlessness, dissociation, and emotional flooding that resemble ADHD. Clinicians should consider both trauma history and neurodevelopmental ADHD, which can also coexist.',
    takeaways: [
      'Hypervigilance and dissociation after trauma can mimic inattention.',
      'Sleep disruption and anxiety after trauma impair focus similarly to ADHD.',
      'ADHD and PTSD can coexist and require integrated treatment.',
      'Timeline and triggers help distinguish trauma reactions from lifelong ADHD patterns.',
      'Trauma-informed therapy remains important even when ADHD is also present.',
    ],
    experiencing:
      'After difficult experiences, you may struggle to read, sit still, or finish tasks. You might wonder whether you always had ADHD or whether your brain changed because of what happened.\n\nShame can make it hard to disclose trauma during an ADHD evaluation.',
    help:
      'Share trauma history with evaluators in a safe, paced way. Notice whether focus problems worsen with reminders of danger versus showing up steadily across calm periods.\n\nTrauma therapy and ADHD treatment are not mutually exclusive; sequencing and provider coordination matter.',
    reach:
      'Seek trauma-informed care if flashbacks, nightmares, or dissociation are active. If you are unsure which condition fits, ask for a clinician experienced in both trauma and neurodevelopmental assessment.',
    related: [
      'How do I get tested for ADHD as an adult?',
      'How do I know if I have ADHD as an adult?',
      'Can ADHD cause anxiety and depression?',
    ],
  }),
  seed({
    question: 'How do I manage ADHD burnout?',
    slug: 'how-do-i-manage-adhd-burnout',
    theme: 'ADHD burnout',
    summary:
      'ADHD burnout often follows years of masking, overcompensating, and running on urgency until the nervous system collapses. Recovery requires reduced load, rest, treatment review, and systems that do not depend on constant adrenaline.',
    takeaways: [
      'ADHD burnout is exhaustion from chronic overextension and masking, not simple tiredness.',
      'Symptoms may worsen during burnout, which can look like depression or failure.',
      'Reducing commitments temporarily is treatment, not giving up.',
      'Reassessing medication, sleep, and support is often necessary during recovery.',
      'Sustainable pacing prevents repeating the boom-and-bust cycle.',
    ],
    experiencing:
      'You may have pushed through with caffeine, panic, or perfectionism until even small emails feel impossible. Rest does not feel restorative, and you may lose confidence in abilities you once relied on.\n\nBurnout can arrive after major life transitions or long periods without accommodation.',
    help:
      'Cancel or postpone nonessential obligations openly where possible. Lower sensory load and rebuild one anchor routine. Ask your clinician whether ADHD treatment needs adjustment.\n\nTherapy can address shame that drives overwork and help you negotiate boundaries at work or home.',
    reach:
      'Get professional support if burnout includes hopelessness, inability to function, or suicidal thoughts. Occupational leave or medical support may be appropriate in severe cases.',
    related: [
      'How do I build routines with ADHD?',
      'How do I stay focused at work with ADHD?',
      'Can ADHD cause anxiety and depression?',
    ],
  }),
  seed({
    question: 'How do I stop forgetting things with ADHD?',
    slug: 'how-do-i-stop-forgetting-things-with-adhd',
    theme: 'ADHD memory supports',
    summary:
      'Forgetting with ADHD is often a problem of attention and encoding, not true memory loss. External capture systems—one inbox, visible landing zones, and phone reminders—usually outperform trying to remember harder.',
    takeaways: [
      'If information is not attended to, it often is not stored—this is an ADHD pattern, not carelessness alone.',
      'One trusted capture system beats multiple half-used apps.',
      'Landing zones for keys, wallets, and mail reduce daily losses.',
      'Location-based phone reminders help for recurring items.',
      'Medication and sleep improvements can sharpen encoding for some people.',
    ],
    experiencing:
      'You walk into rooms without knowing why, miss appointments despite caring, and find cups of cold coffee you forgot you made. Others may interpret forgetfulness as disrespect.\n\nRepeated losses can make you anxious about being unreliable.',
    help:
      'Choose one inbox for tasks and ideas. Photograph whiteboards or receipts immediately. Put essentials in the same visible place every day.\n\nSay out loud what you are doing when you set something down to strengthen encoding.',
    reach:
      'If forgetfulness threatens safety—medications, children’s pickup, driving—or accompanies significant confusion, tell a clinician promptly to rule out other medical issues.',
    related: [
      'What is executive dysfunction and how does it affect daily life?',
      'How do I cope with ADHD time blindness?',
      'How do I build routines with ADHD?',
    ],
  }),
  seed({
    question: 'Is hyperfocus a symptom of ADHD?',
    slug: 'is-hyperfocus-a-symptom-of-adhd',
    theme: 'ADHD hyperfocus',
    summary:
      'Hyperfocus—intense absorption in interesting tasks—is common in ADHD even though the condition is defined by attention regulation difficulties. It can help productivity but also cause neglect of time, people, and basic needs.',
    takeaways: [
      'Hyperfocus is not listed as a formal diagnostic criterion but is widely reported in ADHD.',
      'Interesting or novel tasks can trigger deep absorption while boring tasks stall.',
      'Hyperfocus can damage relationships and health when meals, sleep, or messages are ignored.',
      'Timers and transition rituals help end hyperfocus without shame.',
      'Channeling hyperfocus toward valued projects is a common ADHD strength strategy.',
    ],
    experiencing:
      'You may lose hours to games, research, creative work, or conversations while laundry, bills, and relationships wait. The depth of focus feels like proof you can concentrate—just not on the right things at the right times.\n\nOthers may envy your productivity in one area and resent your absence in another.',
    help:
      'Schedule hyperfocus for projects that matter and set external stop cues—alarms, accountability partners, or physical movement breaks. Keep snacks and water nearby so basic needs are not skipped.\n\nDiscuss with a clinician how medication affects both initiation and hyperfocus patterns.',
    reach:
      'If hyperfocus accompanies mania-like decreased sleep and risky behavior, seek mood evaluation. Otherwise, coaching or therapy can help balance passion projects with maintenance tasks.',
    related: [
      'What is ADHD and how is it different from just being distracted?',
      'How do I stay focused at work with ADHD?',
      'How do I cope with ADHD time blindness?',
    ],
  }),
  seed({
    question: 'How do I explain ADHD to my employer?',
    slug: 'how-do-i-explain-adhd-to-my-employer',
    theme: 'ADHD disclosure at work',
    summary:
      'You can explain ADHD to an employer by focusing on functional needs—fewer interruptions, written instructions, flexible deadlines—without oversharing clinical detail if you prefer accommodations under disability protections where applicable.',
    takeaways: [
      'Disclosure is a personal choice; accommodations can sometimes be requested functionally.',
      'Describe specific work impacts and proposed solutions, not just the diagnosis label.',
      'Documentation from a clinician may support formal accommodation requests.',
      'HR conversations should stay separate from casual disclosure to coworkers in many cases.',
      'Retaliation for disability accommodation requests is prohibited in many jurisdictions.',
    ],
    experiencing:
      'You may fear stigma, lost promotions, or being seen as less competent if you mention ADHD. At the same time, hiding struggles can make performance reviews feel unfair.\n\nYou might not know how much detail is necessary.',
    help:
      'Prepare examples: missed details because of open-office noise, or need for written follow-ups after verbal meetings. Propose tools—noise-canceling headphones, quiet hours, project management software.\n\nConsult HR policies and, if needed, an employment attorney or disability rights resource in your region.',
    reach:
      'If discrimination or unsafe performance expectations follow disclosure, document conversations and seek legal or union support. Occupational health or your clinician can write functional capacity letters when appropriate.',
    related: [
      'What workplace accommodations help adults with ADHD?',
      'How do I stay focused at work with ADHD?',
      'How do I get tested for ADHD as an adult?',
    ],
  }),
  seed({
    question: 'What workplace accommodations help adults with ADHD?',
    slug: 'what-workplace-accommodations-help-adults-with-adhd',
    theme: 'ADHD accommodations',
    summary:
      'Common workplace accommodations for adult ADHD include flexible scheduling, quiet workspace options, written task lists, meeting summaries, and assistive technology—tailored to the specific job demands.',
    takeaways: [
      'Accommodations should target functional barriers, not generic ADHD stereotypes.',
      'Quiet space, flexible hours, and break flexibility are frequent requests.',
      'Written instructions and recorded meetings reduce working-memory load.',
      'Task management tools and checklists can be reasonable accommodations.',
      'Interactive process with HR and manager revisions is normal and expected.',
    ],
    experiencing:
      'Standard office design—open plans, constant Slack pings, ambiguous priorities—may make your ADHD symptoms far worse than the job itself requires. You might excel when conditions fit and struggle dramatically when they do not.\n\nAsking for help can feel like admitting incompetence.',
    help:
      'List job tasks and identify where breakdowns happen: initiation, memory, noise, time estimation, or emotional regulation after criticism. Match each barrier to a specific accommodation.\n\nStart with low-cost tools before requesting structural changes when possible.',
    reach:
      'If accommodation requests are denied without interactive discussion, escalate through HR or external disability resources. Clinical documentation can support formal ADA or equivalent processes in applicable settings.',
    related: [
      'How do I explain ADHD to my employer?',
      'How do I stay focused at work with ADHD?',
      'How do I get tested for ADHD as an adult?',
    ],
  }),
];

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, `${JSON.stringify(drafts, null, 2)}\n`);
console.log(JSON.stringify({ path: OUT_PATH, drafts: drafts.length, slugs: drafts.map((draft) => draft.slug) }, null, 2));
