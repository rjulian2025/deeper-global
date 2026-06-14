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
  url: 'https://www.nimh.nih.gov/health/topics/post-traumatic-stress-disorder-ptsd',
  publisher: 'NIMH',
  note: 'Supports understanding trauma responses and treatment.',
};
const SAMHSA = {
  title: 'Find Treatment',
  url: 'https://www.samhsa.gov/find-treatment',
  publisher: 'SAMHSA',
  note: 'Supports locating substance use and mental health treatment resources.',
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
  readFileSync('reports/enrichment-corpus/batches/batch-27-input.json', 'utf8'),
);

const contentBySlug = {
  'whats-the-difference-between-a-psycholog-186032-045': draft({
    question: "What's the difference between a psychologist, psychiatrist, and therapist?",
    slug: 'whats-the-difference-between-a-psycholog-186032-045',
    category: 'Therapy Navigation',
    title: 'Psychologist vs Psychiatrist vs Therapist',
    meta: 'Psychologists hold doctoral degrees and do therapy and testing; psychiatrists are medical doctors who prescribe medication; therapist is a broad licensed-provider term.',
    summary:
      'Psychologists typically hold doctoral degrees and provide therapy, testing, and assessment but usually cannot prescribe medication. Psychiatrists are medical doctors who specialize in mental health and can prescribe medication. Therapist is a general term covering licensed counselors, social workers, and marriage and family therapists—the fit matters more than the title.',
    takeaways: [
      'Psychologists focus on therapy and psychological assessment.',
      'Psychiatrists are physicians who can prescribe psychiatric medication.',
      'Therapist is an umbrella term for many licensed mental health providers.',
      'License, experience with your concerns, and fit matter most when choosing.',
    ],
    happening:
      'Titles and credentials can feel confusing when you are searching for help.\n\nSome providers offer both therapy and medication; others specialize in one role.',
    help:
      'Check credentials: PhD/PsyD (psychologist), MD/DO (psychiatrist), LCSW/LPC/LMFT (therapists).\n\nMatch provider type to your needs—therapy, medication, or both.\n\nMany people see a therapist and psychiatrist together when medication helps.\n\nAsk about specialties: trauma, addiction, couples, anxiety, or depression.\n\nPrioritize feeling safe, heard, and respected over impressive credentials alone.\n\nUse insurer directories, Psychology Today, or primary care referrals to start.',
    support:
      `${SUPPORT}\n\nSeek urgent care for suicidal thoughts or psychiatric emergencies regardless of provider type.`,
    related: [
      'How do I find the right therapist?',
      'How do I know if I need medication for depression?',
      'What should I expect from my first therapy session?',
      'How do I find an affordable therapist?',
      'What is the difference between therapy types like CBT, DBT, and psychodynamic?',
    ],
    schemaAnswer:
      'Psychologists provide therapy and testing; psychiatrists prescribe medication; therapist is a broad term for licensed counselors—choose based on your needs and fit.',
    themes: ['Therapy navigation', 'Credentials', 'Access to care', 'Treatment planning'],
  }),
  'whats-the-difference-between-a-sponsor-and-a-therapist': draft({
    question: "What's the difference between a sponsor and a therapist?",
    slug: 'whats-the-difference-between-a-sponsor-and-a-therapist',
    category: 'Therapy & Mental Health',
    title: 'Sponsor vs Therapist in Recovery',
    meta: 'Sponsors are peer recovery guides through 12-step work; therapists are licensed clinicians treating mental health—many people benefit from both roles.',
    summary:
      'A sponsor is typically a peer in recovery who volunteers to guide you through 12-step work with lived experience and daily availability. A therapist is a licensed clinician who treats mental health conditions with evidence-based methods. Both can support recovery, but they serve different functions and many people use both.',
    takeaways: [
      'Sponsors are peers sharing recovery experience—not paid clinicians.',
      'Therapists address trauma, depression, anxiety, and clinical conditions.',
      'Sponsors offer step work and accountability; therapists offer structured treatment.',
      'Using both is common and often complementary in recovery.',
    ],
    happening:
      'You may wonder whether a sponsor replaces therapy or vice versa.\n\nSome sponsors overstep into clinical advice; some therapists lack addiction specialization.',
    help:
      'Use sponsors for step work, meeting support, and day-to-day recovery navigation.\n\nUse therapists for clinical assessment, trauma processing, and co-occurring disorders.\n\nKeep boundaries clear—sponsors should not diagnose or prescribe.\n\nLook for therapists with addiction or dual-diagnosis experience when needed.\n\nDiscuss both relationships honestly with each provider.\n\nReassess fit if either relationship feels unsafe or overreaching.',
    support:
      `${SUPPORT}\n\nSeek addiction treatment or crisis support if relapse risk or self-harm thoughts escalate—SAMHSA\'s helpline is 1-800-662-4357.`,
    related: [
      'What should I expect from my first AA or NA meeting?',
      'How do I find a therapist who understands addiction?',
      'How do I cope with cravings?',
      'How do I build a life in recovery?',
      'What if I cannot afford treatment or therapy?',
    ],
    schemaAnswer:
      'Sponsors are peer recovery guides for 12-step work; therapists are licensed clinicians for mental health treatment—many people benefit from both in recovery.',
    themes: ['Recovery', 'Sponsorship', 'Therapy', 'Dual support'],
    refs: [SAMHSA, NIMH],
  }),
  'whats-the-difference-between-being-intro-177940-008': draft({
    question: "What's the difference between being introverted and having social anxiety?",
    slug: 'whats-the-difference-between-being-intro-177940-008',
    category: 'Social Anxiety',
    title: 'Introversion vs Social Anxiety',
    meta: 'Introversion is a preference for quieter environments and recharge time; social anxiety involves fear of judgment and distress in social situations.',
    summary:
      'Introversion is a personality trait—you may enjoy people but need solitude to recharge and prefer smaller gatherings. Social anxiety involves fear of negative evaluation, physical distress, and avoidance that interferes with life. You can be introverted without social anxiety, or socially anxious as an extrovert.',
    takeaways: [
      'Introversion is about energy preference—not fear of people.',
      'Social anxiety involves dread, physical symptoms, and avoidance.',
      'Introverts can socialize skillfully; anxious people often want connection but feel paralyzed.',
      'Different approaches help: honoring preferences versus treating anxiety.',
    ],
    happening:
      'You may label yourself shy when fear is actually driving avoidance.\n\nOr assume introversion is a disorder when you simply need more downtime.',
    help:
      'Ask: Do I fear judgment, or do I simply need recovery time after socializing?\n\nHonor introverted needs: smaller groups, advance notice, quiet recharge.\n\nFor anxiety: gradual exposure, cognitive reframing, and therapy (CBT).\n\nNotice physical symptoms—racing heart and dread suggest anxiety beyond preference.\n\nAvoid forcing constant extroversion as a fix for either pattern.\n\nSeek evaluation if social situations cause significant distress or avoidance.',
    support:
      `${SUPPORT}\n\nSeek therapy if social anxiety limits work, school, friendships, or daily functioning.`,
    related: [
      'How do I overcome social anxiety?',
      'Is it normal to prefer being alone most of the time?',
      'How do I make friends as an adult?',
      'How do I stop avoiding social situations?',
      'What is the difference between being shy and avoidant personality disorder?',
    ],
    schemaAnswer:
      'Introversion is an energy preference for quieter settings; social anxiety is fear-based distress about judgment—treatment targets anxiety, not personality.',
    themes: ['Introversion', 'Social anxiety', 'Personality', 'Avoidance'],
    refs: [ANXIETY, NIMH],
  }),
  'whats-the-difference-between-being-shy-and-having-avoidant-personality-disorder': draft({
    question: "What's the difference between being shy and having avoidant personality disorder?",
    slug: 'whats-the-difference-between-being-shy-and-having-avoidant-personality-disorder',
    category: 'General Mental Health',
    title: 'Shyness vs Avoidant Personality Disorder',
    meta: 'Shyness is a common trait with situational discomfort; avoidant personality disorder involves pervasive social inhibition and avoidance that significantly impairs life.',
    summary:
      'Shyness is a common personality trait—discomfort in new social settings that you can often push through when motivated. Avoidant personality disorder (AvPD) is a pervasive pattern of social inhibition, feelings of inadequacy, and hypersensitivity to rejection that significantly impairs work, relationships, and daily life across contexts.',
    takeaways: [
      'Shyness is situational and often manageable when stakes feel high enough.',
      'AvPD involves chronic avoidance across many life domains.',
      'Fear of rejection in AvPD is intense enough to limit opportunities.',
      'Professional evaluation helps when avoidance severely restricts life.',
    ],
    happening:
      'You may decline promotions, friendships, or dating to avoid possible rejection.\n\nShy people often warm up over time; AvPD avoidance tends to be more rigid and costly.',
    help:
      'Notice scope: one context versus nearly all social and occupational settings.\n\nTrack cost: missed jobs, isolation, underachievement, chronic loneliness.\n\nTry gradual exposure with support for shyness that responds to practice.\n\nSeek specialized therapy (CBT, schema therapy) if avoidance is pervasive.\n\nChallenge core beliefs: "If they reject me, I am worthless."\n\nBuild small wins—brief interactions, tolerated discomfort, recovered afterward.',
    support:
      `${SUPPORT}\n\nSeek evaluation from a mental health professional if social avoidance severely limits functioning or causes chronic distress.`,
    related: [
      'What is the difference between being introverted and having social anxiety?',
      'How do I overcome social anxiety?',
      'How do I build confidence in social situations?',
      'How do I stop isolating myself?',
      'How do I know if I need therapy?',
    ],
    schemaAnswer:
      'Shyness is common situational discomfort; avoidant personality disorder is pervasive social inhibition and rejection sensitivity that significantly impairs functioning across life domains.',
    themes: ['Avoidant personality', 'Shyness', 'Social avoidance', 'Self-worth'],
    refs: [ANXIETY, NIMH],
    notes: 'No self-diagnosis; encourage professional evaluation when impairment is significant.',
  }),
  'whats-the-difference-between-bipolar-disorder-and-regular-depression': draft({
    question: "What's the difference between bipolar disorder and regular depression?",
    slug: 'whats-the-difference-between-bipolar-disorder-and-regular-depression',
    category: 'Depression',
    title: 'Bipolar Disorder vs Depression',
    meta: 'Unipolar depression lacks manic or hypomanic episodes; bipolar disorder includes depression plus periods of elevated mood—accurate diagnosis changes treatment.',
    summary:
      'Regular (unipolar) depression involves depressive episodes without mania or hypomania. Bipolar disorder includes depressive episodes plus manic or hypomanic episodes—elevated mood, decreased sleep, racing thoughts, impulsivity, or grandiosity. Because bipolar depression can look identical to unipolar depression, history of elevated episodes is critical for correct treatment.',
    takeaways: [
      'The key difference is presence of manic or hypomanic episodes.',
      'Bipolar depression is often misdiagnosed as unipolar depression initially.',
      'Antidepressants alone can be risky in undiagnosed bipolar disorder.',
      'Accurate diagnosis guides medication and therapy choices.',
    ],
    happening:
      'You may remember energetic, productive, or impulsive periods you once enjoyed.\n\nFamily history of bipolar disorder increases likelihood but is not required.',
    help:
      'Review history with a clinician: any periods of unusually high energy, less sleep, or risky behavior?\n\nBring a trusted person who has observed your mood patterns over years.\n\nTrack mood, sleep, and energy daily to spot cycles.\n\nAsk explicitly about bipolar screening if depression treatments have failed or worsened mood.\n\nFollow treatment plans that may include mood stabilizers—not antidepressants alone when bipolar is present.\n\nUse therapy alongside medication for relapse prevention and lifestyle stability.',
    support:
      `${SUPPORT}\n\nSeek urgent care for manic symptoms with dangerous impulsivity, psychosis, or suicidal thoughts.`,
    related: [
      'How do I know if I am depressed?',
      'What is the difference between sadness and depression?',
      'How do I talk to my doctor about mental health?',
      'What if antidepressants change who I am?',
      'How do I manage mood swings?',
    ],
    schemaAnswer:
      'Unipolar depression lacks manic episodes; bipolar disorder includes depression plus mania or hypomania—accurate diagnosis is essential because treatment approaches differ.',
    themes: ['Bipolar disorder', 'Depression', 'Diagnosis', 'Mood episodes'],
    refs: [DEPRESSION, NIMH],
    notes: 'No prescribing advice; emphasize accurate diagnosis with prescriber.',
  }),
  'whats-the-difference-between-depression-and-burnout': draft({
    question: "What's the difference between depression and burnout?",
    slug: 'whats-the-difference-between-depression-and-burnout',
    category: 'Depression',
    title: 'Depression vs Burnout',
    meta: 'Burnout ties to chronic work stress and often improves with rest and job changes; depression affects all life areas and may need clinical treatment.',
    summary:
      'Burnout is typically linked to chronic workplace or caregiving stress—exhaustion, cynicism, and reduced professional efficacy that may improve with rest, boundaries, or job change. Depression is a broader mental health condition affecting mood, energy, and functioning across work, relationships, and self-care. They overlap and can co-occur.',
    takeaways: [
      'Burnout centers on work-related exhaustion and cynicism.',
      'Depression usually affects multiple life domains, not only work.',
      'Burnout may lift with time off; depression often persists without treatment.',
      'Both deserve attention—neither is weakness or something to push through alone.',
    ],
    happening:
      'You may feel fine on weekends but depleted Monday morning—or low everywhere, always.\n\nVacation might help burnout temporarily while depression symptoms return quickly.',
    help:
      'Map symptoms: work-only versus pervasive across relationships and hobbies.\n\nTry structured rest, boundaries, and workload changes for burnout patterns.\n\nSeek evaluation if low mood, hopelessness, or anhedonia persist beyond job stress.\n\nAddress sleep, movement, and social connection for both conditions.\n\nDiscuss with a clinician when self-care and job changes are insufficient.\n\nAvoid assuming burnout will pass if symptoms worsen or broaden over months.',
    support:
      `${SUPPORT}\n\nSeek urgent help for suicidal thoughts; professional care when symptoms impair daily life for two weeks or more.`,
    related: [
      'How do I recover from burnout at work?',
      'How do I know if I am depressed?',
      'How do I set boundaries at work?',
      'What is the difference between stress and anxiety?',
      'How do I separate my self-worth from my job title?',
    ],
    schemaAnswer:
      'Burnout links to chronic work stress and often improves with rest and job changes; depression affects broader life functioning and typically needs clinical evaluation and treatment.',
    themes: ['Burnout', 'Depression', 'Work stress', 'Self-care'],
    refs: [BURNOUT, DEPRESSION],
  }),
  'whats-the-difference-between-feeling-sad-and-being-clinically-depressed': draft({
    question: "What's the difference between feeling sad and being clinically depressed?",
    slug: 'whats-the-difference-between-feeling-sad-and-being-clinically-depressed',
    category: 'General Mental Health',
    title: 'Sadness vs Clinical Depression',
    meta: 'Sadness is a proportionate, time-limited response to loss; clinical depression is persistent, pervasive low mood that impairs functioning for weeks or more.',
    summary:
      'Sadness is a normal emotion tied to disappointing events—it fluctuates and you can still experience moments of pleasure. Clinical depression (major depressive disorder) involves persistent low mood, loss of interest, and functional impairment for at least two weeks, often without a clear proportional trigger.',
    takeaways: [
      'Sadness has an identifiable cause and usually eases with time.',
      'Depression persists and often dulls pleasure across activities.',
      'Duration, intensity, and functional impact distinguish the two.',
      'Two weeks of significant symptoms warrants professional evaluation.',
    ],
    happening:
      'After loss you may cry daily yet still laugh with friends sometimes.\n\nDepression can feel like a heavy blanket coloring everything gray.',
    help:
      'Track duration: days of grief versus weeks of unrelenting low mood.\n\nNotice pleasure: brief joy possible with sadness; often absent with depression.\n\nMonitor functioning: work, hygiene, relationships, and motivation.\n\nAllow normal grief without rushing it; seek help when impairment persists.\n\nTalk to a doctor or therapist if symptoms meet the two-week threshold.\n\nTreat depression as a health condition—not a character flaw.',
    support:
      `${SUPPORT}\n\nSeek urgent care for suicidal thoughts or inability to care for basic needs.`,
    related: [
      'What is the difference between sadness and depression?',
      'How do I know if I am depressed?',
      'How long is it normal to grieve after losing someone?',
      'How do I talk to my doctor about mental health?',
      'What are the signs that therapy is working?',
    ],
    schemaAnswer:
      'Sadness is a normal, proportionate emotion that eases over time; clinical depression is persistent low mood and functional impairment lasting weeks or more and benefits from evaluation.',
    themes: ['Depression', 'Sadness', 'Grief', 'Symptom recognition'],
    refs: [DEPRESSION, NIMH],
  }),
  'whats-the-difference-between-healthy-and-177940-028': draft({
    question: "What's the difference between healthy and toxic masculinity?",
    slug: 'whats-the-difference-between-healthy-and-177940-028',
    category: 'Gender Identity',
    title: 'Healthy vs Toxic Masculinity',
    meta: 'Healthy masculinity allows strength with vulnerability and respect; toxic masculinity enforces rigid dominance, emotional suppression, and harm to self and others.',
    summary:
      'Healthy masculinity embraces emotional expression, accountability, and respect while honoring positive traits like protection and leadership. Toxic masculinity enforces rigid stereotypes—suppress all feelings except anger, never show weakness, dominate others, and treat vulnerability as shameful—which harms men and people around them.',
    takeaways: [
      'Healthy masculinity includes vulnerability, empathy, and mutual respect.',
      'Toxic masculinity demands dominance and emotional suppression.',
      'Toxic patterns often isolate men and increase aggression risk.',
      'Redefining strength as self-awareness benefits relationships and mental health.',
    ],
    happening:
      'You may hear "man up" when struggling, or feel weak for needing support.\n\nAggression, emotional unavailability, or homophobia may be framed as normal male behavior.',
    help:
      'Name emotions directly instead of converting hurt into anger.\n\nSeek friendships and mentors who model honest, accountable masculinity.\n\nChallenge beliefs that worth requires dominance or stoicism.\n\nPractice asking for help as strength—not failure.\n\nExamine media and family messages that glorify aggression or disconnection.\n\nSupport others\' full humanity regardless of gender expression.',
    support:
      `${SUPPORT}\n\nSeek therapy if rigid masculine norms fuel depression, rage, isolation, or relationship violence.`,
    related: [
      'How do I express emotions in a healthy way?',
      'How do I stop being angry all the time?',
      'How do I build emotional intimacy in relationships?',
      'How do I find male friendship and connection?',
      'How do I challenge internalized shame?',
    ],
    schemaAnswer:
      'Healthy masculinity combines strength with vulnerability and respect; toxic masculinity enforces emotional suppression, dominance, and rigid stereotypes that harm men and others.',
    themes: ['Masculinity', 'Emotional health', 'Gender norms', 'Relationships'],
  }),
  'whats-the-difference-between-inpatient-and-outpatient-treatment': draft({
    question: "What's the difference between inpatient and outpatient treatment?",
    slug: 'whats-the-difference-between-inpatient-and-outpatient-treatment',
    category: 'Therapy & Mental Health',
    title: 'Inpatient vs Outpatient Treatment',
    meta: 'Inpatient treatment provides 24/7 residential care and structure; outpatient lets you live at home while attending scheduled therapy and support sessions.',
    summary:
      'Inpatient (residential) treatment means living at a facility with round-the-clock supervision, intensive therapy, and removal from triggers—often for severe addiction or mental health crises. Outpatient treatment lets you live at home while attending therapy sessions, from weekly appointments to intensive outpatient programs several hours per week.',
    takeaways: [
      'Inpatient offers highest structure and medical monitoring.',
      'Outpatient preserves work, family, and home routines.',
      'Severity, safety, and prior treatment history guide level of care.',
      'Many people step down from inpatient to outpatient for continuity.',
    ],
    happening:
      'You may need detox safety, crisis stabilization, or escape from a triggering environment.\n\nOr you may have obligations and support that make outpatient viable.',
    help:
      'Assess severity: danger to self or others, withdrawal risk, failed outpatient attempts.\n\nDiscuss options with an addiction counselor, psychiatrist, or intake clinician.\n\nCompare program length, therapies offered, and aftercare planning.\n\nCheck insurance coverage and family involvement policies.\n\nPlan step-down care before discharge from inpatient programs.\n\nChoose engagement over prestige—a program you will fully use matters most.',
    support:
      `${SUPPORT}\n\nSeek emergency or inpatient care for active suicidal intent, severe withdrawal, or psychosis—call 988 or go to the nearest emergency department.`,
    related: [
      'How do I know if I need rehab?',
      'What if I cannot afford treatment or therapy?',
      'How do I find a treatment program?',
      'What should I expect from my first therapy session?',
      'How do I support a loved one in treatment?',
    ],
    schemaAnswer:
      'Inpatient treatment is residential with 24/7 care; outpatient treatment lets you live at home while attending scheduled therapy—the right level depends on severity, safety, and support.',
    themes: ['Treatment levels', 'Addiction care', 'Access to care', 'Recovery planning'],
    refs: [SAMHSA, NIMH],
  }),
  'whats-the-difference-between-narcissistic-personality-disorder-and-just-being-self-centered': draft({
    question: "What's the difference between narcissistic personality disorder and just being self-centered?",
    slug: 'whats-the-difference-between-narcissistic-personality-disorder-and-just-being-self-centered',
    category: 'General Mental Health',
    title: 'NPD vs Being Self-Centered',
    meta: 'Self-centeredness can be situational and temporary; narcissistic personality disorder is a pervasive pattern of grandiosity, need for admiration, and lack of empathy that impairs relationships.',
    summary:
      'Everyone can be self-centered during stress or when pursuing goals—that is often temporary and does not erase empathy. Narcissistic personality disorder (NPD) involves a pervasive pattern of grandiosity, constant need for admiration, and significant lack of empathy beginning by early adulthood and impairing relationships and functioning across contexts.',
    takeaways: [
      'Self-centeredness is common and often situational.',
      'NPD involves persistent grandiosity and impaired empathy.',
      'NPD patterns cause significant relationship and occupational harm.',
      'Labeling others requires clinical evaluation—focus on behavior impact on you.',
    ],
    happening:
      'Self-centered friends may still apologize and adjust when confronted.\n\nNPD patterns often include entitlement, exploitation, and rage when admiration is withheld.',
    help:
      'Notice pervasiveness: one context versus lifelong patterns across relationships.\n\nAssess empathy: can they recognize others\' feelings when it costs them?\n\nSet boundaries around disrespect regardless of labels.\n\nAvoid amateur diagnosis—focus on whether behavior is safe and reciprocal.\n\nSeek therapy if you are in a harmful dynamic or repeating attraction patterns.\n\nProtect yourself from manipulation, gaslighting, and emotional exploitation.',
    support:
      `${SUPPORT}\n\nSeek help if a relationship involves coercion, threats, or abuse—contact local domestic violence resources or 988 for crisis support.`,
    related: [
      'How do I recognize gaslighting?',
      'How do I set boundaries with difficult people?',
      'How do I know if my relationship is toxic?',
      'How do I stop attracting narcissistic partners?',
      'How do I heal after a toxic relationship?',
    ],
    schemaAnswer:
      'Self-centeredness is often temporary and situational; narcissistic personality disorder is a pervasive pattern of grandiosity, need for admiration, and lack of empathy that significantly impairs relationships.',
    themes: ['Narcissism', 'Boundaries', 'Relationships', 'Personality patterns'],
    notes: 'Avoid diagnosing others; focus on behavior impact and safety.',
  }),
  'whats-the-difference-between-sadness-and-177940-016': draft({
    question: "What's the difference between sadness and grief?",
    slug: 'whats-the-difference-between-sadness-and-177940-016',
    category: 'Grief & Loss',
    title: 'Sadness vs Grief',
    meta: 'Sadness is a temporary emotion after disappointment; grief is a complex, long-term process of adapting to significant loss that changes you.',
    summary:
      'Sadness is a normal, often short-lived emotion in response to disappointment or minor loss. Grief is a multifaceted process after significant loss—death, divorce, major illness—that involves waves of sadness, anger, guilt, and yearning and reshapes how you live without what was lost.',
    takeaways: [
      'Sadness is usually proportionate and time-limited.',
      'Grief is a process, not a single emotion, with no fixed timeline.',
      'Grief affects body, mind, relationships, and identity.',
      'You integrate loss rather than simply "getting over" it.',
    ],
    happening:
      'Sadness after a bad day lifts when circumstances improve.\n\nGrief may surge months later at anniversaries, smells, or unexpected reminders.',
    help:
      'Allow grief waves without judging yourself for still hurting.\n\nDistinguish disenfranchised grief when others minimize your loss.\n\nMaintain basic routines while accepting reduced capacity temporarily.\n\nConnect with supportive people who tolerate messy grief.\n\nSeek grief counseling if functioning remains severely impaired.\n\nHonor the relationship or life chapter you are adapting to without.',
    support:
      `${SUPPORT}\n\nSeek help if grief includes persistent suicidal thoughts, inability to function, or prolonged numbness that frightens you.`,
    related: [
      'How long is it normal to grieve after losing someone?',
      'What is disenfranchised grief?',
      'Why do I feel angry at the person who died?',
      'How do I cope with grief on holidays?',
      'Is it normal to feel nothing after someone dies?',
    ],
    schemaAnswer:
      'Sadness is a temporary emotion; grief is a complex, ongoing process of adapting to significant loss that changes how you live and who you are.',
    themes: ['Grief', 'Loss', 'Sadness', 'Healing'],
    refs: [GRIEF, NIMH],
  }),
  'whats-the-difference-between-sadness-and-dep-177941-008': draft({
    question: "What's the difference between sadness and depression?",
    slug: 'whats-the-difference-between-sadness-and-dep-177941-008',
    category: 'Depression',
    title: 'Sadness vs Depression',
    meta: 'Sadness connects to specific events and fluctuates; depression is persistent hopelessness and loss of interest that impairs daily life for weeks or more.',
    summary:
      'Sadness is a normal emotional response to loss or disappointment—it comes in waves and you can still find comfort or pleasure sometimes. Depression is a mental health condition with persistent low mood, hopelessness, and loss of interest that impairs work, relationships, and self-care, often lasting weeks or months without treatment.',
    takeaways: [
      'Sadness usually has a clear trigger and eases with support and time.',
      'Depression often feels global and dulls joy across activities.',
      'Physical symptoms—sleep, appetite, energy—more common in depression.',
      'Professional help is appropriate when symptoms persist two weeks or more.',
    ],
    happening:
      'You may still enjoy a meal or movie when sad but feel numb to everything when depressed.\n\nGuilt, worthlessness, and concentration problems point more toward depression.',
    help:
      'Track how long symptoms last and whether pleasure returns intermittently.\n\nNotice sleep, appetite, and energy shifts alongside mood.\n\nAllow normal sadness after hard events without pathologizing grief.\n\nTalk to a healthcare provider when impairment persists beyond two weeks.\n\nCombine therapy, lifestyle changes, and medication discussion when appropriate.\n\nReach out early—waiting for rock bottom is unnecessary.',
    support:
      `${SUPPORT}\n\nSeek urgent care for suicidal thoughts, self-harm urges, or psychotic symptoms.`,
    related: [
      'How do I know if I am depressed?',
      'What is the difference between feeling sad and being clinically depressed?',
      'How do I talk to my doctor about mental health?',
      'What are signs my depression is getting worse?',
      'How do I help a friend who seems depressed?',
    ],
    schemaAnswer:
      'Sadness is a normal, event-linked emotion that fluctuates; depression is persistent low mood and loss of interest impairing daily life for weeks or more and benefits from treatment.',
    themes: ['Depression', 'Sadness', 'Symptom recognition', 'Help-seeking'],
    refs: [DEPRESSION, NIMH],
  }),
  'whats-the-difference-between-stress-and-anxiety': draft({
    question: "What's the difference between stress and anxiety?",
    slug: 'whats-the-difference-between-stress-and-anxiety',
    category: 'Anxiety & Stress',
    title: 'Stress vs Anxiety',
    meta: 'Stress usually responds to identifiable external pressures; anxiety often persists with excessive worry about future threats even when objectively safe.',
    summary:
      'Stress is typically a response to external demands—deadlines, conflict, finances—and often eases when the stressor resolves. Anxiety frequently involves persistent worry about future events, catastrophic thinking, and physical symptoms that continue even without a clear current threat.',
    takeaways: [
      'Stress often has an identifiable external cause.',
      'Anxiety may persist when the stressor is gone or disproportionate.',
      'Both share physical symptoms but anxiety often includes dread of the future.',
      'Different coping tools help: problem-solving for stress, exposure and CBT for anxiety.',
    ],
    happening:
      'Work crunch may spike stress that fades after the project ends.\n\nAnxiety may keep you awake worrying about things unlikely to happen.',
    help:
      'Name the stressor: Can you solve, delegate, or accept this problem?\n\nFor anxiety: challenge catastrophic thoughts and practice gradual exposure.\n\nUse grounding and breathing for acute physical symptoms of both.\n\nReduce caffeine, improve sleep, and limit doomscrolling.\n\nSeek therapy when worry is daily or avoidance limits your life.\n\nTrack whether symptoms track external events or run on their own loop.',
    support:
      `${SUPPORT}\n\nSeek evaluation if anxiety or stress causes panic attacks, avoidance, or functional impairment most days.`,
    related: [
      'How do I manage chronic stress?',
      'How do I stop worrying about things I cannot control?',
      'How do I calm my nervous system?',
      'What is the difference between stress and burnout?',
      'How do I know if I have an anxiety disorder?',
    ],
    schemaAnswer:
      'Stress responds to external pressures and often eases when they resolve; anxiety involves persistent worry and dread about future threats even when objectively safe.',
    themes: ['Stress', 'Anxiety', 'Worry', 'Coping skills'],
    refs: [ANXIETY, BURNOUT],
  }),
  'whats-the-difference-between-therapy-typ-185387-025': draft({
    question: "What's the difference between therapy types like CBT, DBT, and psychodynamic?",
    slug: 'whats-the-difference-between-therapy-typ-185387-025',
    category: 'Therapy Navigation',
    title: 'CBT vs DBT vs Psychodynamic Therapy',
    meta: 'CBT targets thoughts and behaviors; DBT builds emotion regulation and distress tolerance; psychodynamic explores past patterns and unconscious influences—many therapists blend approaches.',
    summary:
      'Cognitive Behavioral Therapy (CBT) is structured and focuses on changing unhelpful thought patterns and behaviors. Dialectical Behavior Therapy (DBT) emphasizes mindfulness, emotion regulation, and distress tolerance—often for intense emotions. Psychodynamic therapy explores how past experiences and unconscious patterns shape present life. Many therapists integrate multiple approaches.',
    takeaways: [
      'CBT is goal-oriented and skills-focused for thoughts and behaviors.',
      'DBT targets emotional intensity, self-harm, and relationship instability.',
      'Psychodynamic therapy explores deeper patterns and history over time.',
      'Best fit depends on your goals, symptoms, and therapist training.',
    ],
    happening:
      'You may hear acronyms without knowing which fits your concerns.\n\nSome problems respond faster to skills training; others need deeper exploratory work.',
    help:
      'Match modality to goals: symptom relief (CBT), emotion crises (DBT), long-standing patterns (psychodynamic).\n\nAsk prospective therapists which approaches they use and why for your situation.\n\nTry a few sessions before judging fit—rapport matters alongside technique.\n\nCombine therapy types over time as needs evolve.\n\nUse CBT skills for panic and depression; DBT for self-harm or borderline traits; psychodynamic for recurring relationship templates.\n\nPrioritize evidence-based care with a licensed provider.',
    support:
      `${SUPPORT}\n\nSeek urgent help for self-harm or suicidal crisis while pursuing appropriate therapy modality.`,
    related: [
      'How do I find the right therapist?',
      'What is EMDR and who is it for?',
      'How do I know if my therapist is a good fit?',
      'What should I expect from my first therapy session?',
      'How long does therapy usually take?',
    ],
    schemaAnswer:
      'CBT changes thoughts and behaviors; DBT builds emotion regulation and distress tolerance; psychodynamic therapy explores past patterns—many therapists blend approaches based on your needs.',
    themes: ['Therapy types', 'CBT', 'DBT', 'Treatment planning'],
  }),
  'why-am-i-losing-faith-in-everything-i-used-to-believe': draft({
    question: 'Why am I losing faith in everything I used to believe?',
    slug: 'why-am-i-losing-faith-in-everything-i-used-to-believe',
    category: 'Spiritual Doubt',
    title: 'Losing Faith in Old Beliefs',
    meta: 'Spiritual deconstruction after trauma, education, or life change can feel like losing your foundation—questioning can be growth, not failure.',
    summary:
      'Losing faith in beliefs that once structured your life—religious, political, or worldview—often follows trauma, loss, education, or seeing complexity you once could not. Deconstruction feels disorienting and lonely but can also reflect honesty and growth rather than moral failure.',
    takeaways: [
      'Deconstruction often follows major life experiences or new information.',
      'Losing community tied to old beliefs amplifies isolation.',
      'Uncertainty can precede a more authentic worldview.',
      'You need not rush to replace old beliefs with new ones.',
    ],
    happening:
      'Prayer, rituals, or former communities may feel hollow or harmful now.\n\nFamily pressure can make doubt feel like betrayal.',
    help:
      'Name what specifically no longer fits—doctrine, community, or identity?\n\nAllow grief for the world you are leaving, not only anger.\n\nSeek safe spaces for honest questioning without debate pressure.\n\nSeparate harm from helpful practices you might keep in new form.\n\nBuild meaning through values, relationships, and service—not only labels.\n\nConsider therapy if deconstruction fuels depression or family rupture you cannot navigate.',
    support:
      `${SUPPORT}\n\nSeek support if spiritual crisis includes suicidal thoughts, severe isolation, or inability to function.`,
    related: [
      'Is it normal to feel angry at God or religion?',
      'How do I find meaning after losing my faith?',
      'What do I do when prayer or meditation no longer brings me peace?',
      'How do I talk to family about my changing beliefs?',
      'How do I cope with spiritual loneliness?',
    ],
    schemaAnswer:
      'Losing faith in former beliefs often follows trauma, growth, or new understanding—deconstruction can be disorienting but also a path toward more authentic meaning.',
    themes: ['Spiritual doubt', 'Deconstruction', 'Identity', 'Meaning'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-certain-places-or-smells-suddenly-make-me-feel-panicked': draft({
    question: 'Why do certain places or smells suddenly make me feel panicked?',
    slug: 'why-do-certain-places-or-smells-suddenly-make-me-feel-panicked',
    category: 'Trauma & Triggers',
    title: 'Sudden Panic From Places or Smells',
    meta: 'Sensory triggers can activate trauma memories stored in the nervous system—your body reacts as if past danger is present even when you are safe now.',
    summary:
      'Sudden panic from a place, smell, sound, or sensation often reflects a trauma trigger—your nervous system linked that sensory cue to past danger. Trauma memories can remain body-based, so you may feel terrified before your conscious mind explains why.',
    takeaways: [
      'Triggers are the nervous system trying to protect you from remembered danger.',
      'Smell and sound are especially powerful trauma memory links.',
      'Panic does not mean you are weak or overreacting.',
      'Grounding and trauma therapy can reduce trigger intensity over time.',
    ],
    happening:
      'A perfume, hallway, or song may flood you with dread, sweating, or urge to flee.\n\nYou might feel crazy because the trigger seems harmless to others.',
    help:
      'Ground in the present: name five things you see, feel your feet, breathe slowly.\n\nRemind yourself: "This is a memory response; I am safer now."\n\nTrack triggers to understand patterns without forcing exposure too fast.\n\nReduce shame—triggers are common after trauma.\n\nConsider EMDR, CPT, or somatic therapies for trauma processing.\n\nBuild gradual tolerance in safe contexts with professional guidance.',
    support:
      `${SUPPORT}\n\nSeek trauma-informed therapy if triggers are frequent or severely impair daily life; call 988 if panic includes self-harm thoughts.`,
    related: [
      'What is a trauma trigger and how do I manage it?',
      'How do I calm down during a panic attack?',
      'How do I know if I have PTSD?',
      'How do I ground myself when overwhelmed?',
      'How do I talk to my therapist about trauma?',
    ],
    schemaAnswer:
      'Places and smells can trigger panic when the nervous system associates them with past trauma—grounding and trauma-informed therapy help reduce their power over time.',
    themes: ['Trauma triggers', 'PTSD', 'Sensory memory', 'Grounding'],
    refs: [PTSD, NIMH],
  }),
  'why-do-i-always-end-up-with-partners-who-are-emoti-186602-012': draft({
    question: 'Why do I always end up with partners who are emotionally unavailable?',
    slug: 'why-do-i-always-end-up-with-partners-who-are-emoti-186602-012',
    category: 'Attachment Styles & Relationship Dynamics',
    title: 'Attracting Emotionally Unavailable Partners',
    meta: 'Repeated attraction to unavailable partners often reflects attachment patterns, familiarity with distance, or beliefs that intense pursuit equals love.',
    summary:
      'Repeatedly choosing emotionally unavailable partners usually reflects deeper patterns—familiarity with distant caregivers, fear of true intimacy, or beliefs that you must earn love through pursuit. Unavailable partners can feel safer because full vulnerability is avoided, even when the relationship leaves you lonely.',
    takeaways: [
      'Unavailable partners often feel familiar if childhood caregivers were distant.',
      'The chase can mimic love through intermittent reinforcement.',
      'Fear of intimacy may unconsciously steer you away from available people.',
      'Noticing green flags early breaks the cycle more than trying harder.',
    ],
    happening:
      'You may confuse hot-and-cold behavior with passion.\n\nAvailable, consistent interest might feel boring compared to uncertainty.',
    help:
      'Map early relationship patterns—who did you pursue and why?\n\nNotice red flags: inconsistency, future-faking, avoidance of hard talks.\n\nPractice tolerating healthy boredom—stability is not absence of chemistry.\n\nExplore childhood attachment stories with a therapist.\n\nSlow down early intensity to see whether effort is reciprocal.\n\nChoose partners who show up emotionally, not only when convenient.',
    support:
      `${SUPPORT}\n\nSeek therapy if relationship patterns cause chronic distress, self-worth collapse, or staying in harmful dynamics.`,
    related: [
      'How do I know if my partner is emotionally unavailable?',
      'What is anxious attachment and how does it affect relationships?',
      'How do I stop chasing unavailable people?',
      'How do I build secure attachment?',
      'How do I know if my relationship is worth saving?',
    ],
    schemaAnswer:
      'Attraction to emotionally unavailable partners often reflects attachment patterns and fear of intimacy—awareness, therapy, and valuing consistency help break the cycle.',
    themes: ['Attachment', 'Emotional unavailability', 'Relationship patterns', 'Intimacy'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-apologize-for-everything-even-w-181083-095': draft({
    question: "Why do I apologize for everything even when it's not my fault?",
    slug: 'why-do-i-apologize-for-everything-even-w-181083-095',
    category: 'Communication & Conflict',
    title: 'Over-Apologizing for Everything',
    meta: 'Excessive apologizing often develops from childhood blame, conflict avoidance, or feeling responsible for others\' emotions—not genuine accountability.',
    summary:
      'Apologizing constantly—even for things outside your control—often stems from learning that taking blame prevented anger or earned approval. You may apologize for your existence, not just your actions, as a strategy to keep peace or avoid rejection.',
    takeaways: [
      'Over-apologizing is often a learned survival strategy, not politeness.',
      'You may have been blamed for adults\' emotions as a child.',
      'Replacing "sorry" with gratitude can reduce automatic apologies.',
      'True apologies require actual harm—not preemptive self-erasure.',
    ],
    happening:
      'You say sorry when someone bumps into you or when you have a need.\n\nApologies may come before you know what you did wrong.',
    help:
      'Track triggers: Who are you with when sorry spills out automatically?\n\nPause before apologizing—ask: Did I cause harm?\n\nTry "Thank you for waiting" instead of "Sorry I am late" when appropriate.\n\nPractice stating needs without apologizing: "I need quiet to focus."\n\nExplore childhood messages about blame and anger in therapy.\n\nNotice when apologizing is really fear of disappointing someone.',
    support:
      `${SUPPORT}\n\nSeek therapy if people-pleasing and over-apologizing severely limit authenticity or keep you in unsafe dynamics.`,
    related: [
      'How do I stop people-pleasing?',
      'How do I set boundaries without feeling guilty?',
      'How do I communicate my needs in a relationship?',
      'How do I stop being so hard on myself?',
      'How do I handle conflict without shutting down?',
    ],
    schemaAnswer:
      'Over-apologizing often comes from childhood blame or conflict avoidance—practice distinguishing real accountability from automatic sorrys that erase your needs.',
    themes: ['People-pleasing', 'Communication', 'Boundaries', 'Self-worth'],
  }),
  'why-do-i-attract-people-who-want-to-fix-me-186602-016': draft({
    question: "Why do I attract people who want to 'fix' me?",
    slug: 'why-do-i-attract-people-who-want-to-fix-me-186602-016',
    category: 'Attachment Styles & Relationship Dynamics',
    title: 'Attracting People Who Want to Fix You',
    meta: 'Fixer dynamics often pair vulnerability performance with partners who need to be needed—creating unequal relationships that block real intimacy.',
    summary:
      'Attracting fixer types often reflects presenting yourself as someone who needs rescue, or choosing partners who feel worthy only when needed. Fixers may see you as a project rather than an equal, creating imbalance that blocks mature partnership.',
    takeaways: [
      'Sharing struggles early can signal "rescue me" unintentionally.',
      'Fixers often struggle with boundaries and equal partnership.',
      'Being fixed keeps you in a one-down position.',
      'Mutual support differs from one-sided repair projects.',
    ],
    happening:
      'Dates may focus on your problems more than your strengths.\n\nYou might feel cared for when someone manages your life—until resentment builds.',
    help:
      'Lead with competence and interests, not only wounds, in new connections.\n\nAsk whether partners celebrate your strengths or mainly discuss your flaws.\n\nBuild independent problem-solving so support is optional, not required.\n\nWatch for advice overload, condescension, or control disguised as help.\n\nSeek therapy to separate healthy support from fixer dynamics.\n\nChoose partners who want peers, not projects.',
    support:
      `${SUPPORT}\n\nSeek help if fixer dynamics slide into control, coercion, or erosion of your autonomy.`,
    related: [
      'How do I stop attracting toxic partners?',
      'How do I build self-worth in relationships?',
      'How do I set boundaries with overbearing partners?',
      'What is codependency and how do I change it?',
      'How do I know if my relationship is healthy?',
    ],
    schemaAnswer:
      'Attracting fixers often reflects vulnerability signaling or choosing partners who need to be needed—build equal partnership by showing strengths and rejecting project dynamics.',
    themes: ['Codependency', 'Attachment', 'Boundaries', 'Relationship dynamics'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-attract-the-same-type-of-proble-190219-008': draft({
    question: 'Why do I attract the same type of problematic partners?',
    slug: 'why-do-i-attract-the-same-type-of-proble-190219-008',
    category: 'Relationships & Divorce',
    title: 'Same Problematic Partners on Repeat',
    meta: 'Repeating relationship patterns often reflect attachment wounds, familiar chaos, or unconscious hopes to heal old hurts through new partners.',
    summary:
      'Attracting the same problematic partner type repeatedly usually reflects attachment patterns, unhealed wounds, and familiarity with unhealthy dynamics—not bad luck. Your nervous system may mistake intensity or unavailability for love because it feels known.',
    takeaways: [
      'Familiar dysfunction can feel like chemistry.',
      'Unhealed wounds may draw you to partners who recreate old pain.',
      'Trying to fix unavailable people can replay childhood hope.',
      'Breaking patterns requires awareness, boundaries, and often therapy.',
    ],
    happening:
      'New partners may look different but behave similarly—jealousy, neglect, or chaos.\n\nFriends might say you have a "type" you cannot see yet.',
    help:
      'List common traits across ex-partners without self-blame.\n\nIdentify what felt "exciting" that was actually anxiety or instability.\n\nHeal wounds that make poor treatment feel normal.\n\nPractice slow dating to spot red flags before attachment deepens.\n\nUse therapy to update your relationship template.\n\nCelebrate calm, reciprocal relationships even when they feel unfamiliar.',
    support:
      `${SUPPORT}\n\nSeek help if patterns include abuse, coercion, or fear—safety planning comes before relationship repair.`,
    related: [
      'Why do I always end up with emotionally unavailable partners?',
      'How do I know if my relationship is toxic?',
      'How do I break trauma bonding?',
      'How do I heal after divorce?',
      'How do I build secure attachment?',
    ],
    schemaAnswer:
      'Repeating problematic partner patterns often reflects attachment wounds and familiar unhealthy dynamics—awareness, boundaries, and therapy help you choose differently.',
    themes: ['Relationship patterns', 'Attachment', 'Trauma bonding', 'Healing'],
    gaps: ['No dedicated attachment-theory clinical source cited; verify framing with editorial standards.'],
    flags: ['relationship-safety'],
  }),
  'why-do-i-constantly-compare-myself-to-others': draft({
    question: 'Why do I constantly compare myself to others?',
    slug: 'why-do-i-constantly-compare-myself-to-others',
    category: 'General Mental Health',
    title: 'Constantly Comparing Yourself to Others',
    meta: 'Social comparison is human but harmful when chronic—often driven by low self-worth, social media, perfectionism, and unclear personal values.',
    summary:
      'Comparing yourself to others is a natural tendency that becomes harmful when constant and distressing. Low self-esteem, fear of falling behind, perfectionism, unclear personal values, and social media highlight reels fuel chronic comparison that erodes satisfaction and self-worth.',
    takeaways: [
      'Comparison helped ancestors assess group standing—modern life amplifies it.',
      'Social media shows curated highlights, not full lives.',
      'Unclear personal goals make others\' paths look like the only measure.',
      'Self-worth built internally reduces comparison\'s emotional punch.',
    ],
    happening:
      'Scrolling can leave you feeling behind within minutes.\n\nAchievements may feel empty if someone else achieved more publicly.',
    help:
      'Limit comparison triggers—mute accounts, set app timers, curate feeds.\n\nDefine your own values-based goals instead of borrowed benchmarks.\n\nPractice gratitude for specific progress, not only outcomes.\n\nRemember you compare your inside to others\' outside.\n\nBuild self-worth through competence, relationships, and integrity—not rankings.\n\nSeek therapy if comparison drives depression, anxiety, or paralysis.',
    support:
      `${SUPPORT}\n\nSeek help if comparison fuels persistent depression, eating disorder behaviors, or suicidal thoughts.`,
    related: [
      'How do I stop comparing my life to social media?',
      'How do I build self-esteem?',
      'How do I overcome imposter syndrome?',
      'How do I stop being so hard on myself?',
      'How do I find my own path in life?',
    ],
    schemaAnswer:
      'Constant comparison often stems from low self-worth, perfectionism, and social media exposure—clarify your values and limit triggers to reduce its harm.',
    themes: ['Social comparison', 'Self-worth', 'Social media', 'Perfectionism'],
  }),
  'why-do-i-feel-angry-all-the-time-lately-177940-006': draft({
    question: 'Why do I feel angry all the time lately?',
    slug: 'why-do-i-feel-angry-all-the-time-lately-177940-006',
    category: 'Emotional Regulation',
    title: 'Feeling Angry All the Time',
    meta: 'Chronic anger often masks hurt, fear, or depression—or signals burnout, unmet needs, and depleted emotional resources.',
    summary:
      'Feeling angry constantly is exhausting and confusing. Anger often covers more vulnerable emotions like hurt, fear, or sadness. Chronic irritability can also signal depression—especially in men—burnout, unmet needs, poor sleep, or hormonal and medical factors.',
    takeaways: [
      'Anger frequently protects softer emotions underneath.',
      'Chronic irritability can be a depression symptom.',
      'Unmet needs and overwhelm fuel persistent anger.',
      'Physical factors like sleep deprivation increase irritability.',
    ],
    happening:
      'Small frustrations may trigger disproportionate rage.\n\nYou might snap at people you care about and regret it afterward.',
    help:
      'Ask what emotion sits under the anger—hurt, fear, shame?\n\nTrack sleep, stress, substances, and health changes.\n\nIdentify unmet needs: respect, rest, fairness, autonomy.\n\nUse timeouts before responding when flooded.\n\nChannel anger into boundary-setting or problem-solving when possible.\n\nSeek evaluation if anger is daily, destructive, or paired with low mood.',
    support:
      `${SUPPORT}\n\nSeek urgent help if anger leads to violence, threats, or self-harm; call 988 for crisis support.`,
    related: [
      'How do I manage anger in healthy ways?',
      'How do I know if I am depressed?',
      'How do I express emotions without exploding?',
      'How do I recover from burnout?',
      'How do I set boundaries when I feel resentful?',
    ],
    schemaAnswer:
      'Persistent anger often masks hurt or fear, or signals depression, burnout, and unmet needs—explore underlying emotions and seek help when anger is chronic or harmful.',
    themes: ['Anger', 'Emotional regulation', 'Depression', 'Burnout'],
    refs: [DEPRESSION, CDC],
  }),
  'why-do-i-feel-angry-at-the-person-who-di-184729-002': draft({
    question: 'Why do I feel angry at the person who died?',
    slug: 'why-do-i-feel-angry-at-the-person-who-di-184729-002',
    category: 'Grief & Loss',
    title: 'Angry at the Person Who Died',
    meta: 'Anger toward someone who died is a normal grief response—abandonment, helplessness, and unfinished business can all fuel it without negating love.',
    summary:
      'Feeling angry at someone who died is a common, confusing part of grief. Anger may reflect abandonment, frustration they left, helplessness about their death, or unfinished conflict. It does not mean you loved them less—it shows how deeply the loss matters.',
    takeaways: [
      'Anger is a recognized stage and flavor of grief—not betrayal.',
      'You may rage at them, illness, God, or unfairness itself.',
      'Unfinished conflict complicates grief after death.',
      'Acknowledging anger helps processing more than suppressing it.',
    ],
    happening:
      'You might feel guilty for anger toward someone you miss terribly.\n\nOthers may expect only sadness, not rage.',
    help:
      'Name the anger without judging it as wrong.\n\nAsk what the anger protects—hurt, fear, loneliness?\n\nWrite unsent letters expressing everything left unsaid.\n\nSeparate the person from the circumstances of their death when helpful.\n\nShare with grief-supportive people who tolerate mixed emotions.\n\nConsider grief counseling if anger blocks healing or relationships.',
    support:
      `${SUPPORT}\n\nSeek help if grief anger turns into self-harm thoughts, isolation, or prolonged functional impairment.`,
    related: [
      'What is disenfranchised grief?',
      'How long is it normal to grieve after losing someone?',
      'What is the difference between sadness and grief?',
      'How do I cope with guilt after someone dies?',
      'How do I find a grief support group?',
    ],
    schemaAnswer:
      'Anger at someone who died is a normal grief response reflecting abandonment, helplessness, or unfinished conflict—it does not diminish love for the person you lost.',
    themes: ['Grief', 'Anger', 'Loss', 'Emotional processing'],
    refs: [GRIEF, NIMH],
  }),
  'why-do-i-feel-anxious-about-good-things-happ-177941-022': draft({
    question: 'Why do I feel anxious about good things happening?',
    slug: 'why-do-i-feel-anxious-about-good-things-happ-177941-022',
    category: 'Anxiety & Stress',
    title: 'Anxious When Good Things Happen',
    meta: 'Anticipatory anxiety about positive events often reflects fear of disappointment, loss, or not deserving good things—staying present helps.',
    summary:
      'Feeling anxious when good things happen—promotions, relationships, trips—often reflects fear that joy will be followed by pain. You may protect yourself by expecting disappointment, believe you do not deserve good outcomes, or feel unsettled because positivity is unfamiliar.',
    takeaways: [
      'Fear of losing good things can steal joy before it arrives.',
      'Past experiences may teach that happiness is temporary or dangerous.',
      'Superstitious thinking can link excitement to "jinxing" outcomes.',
      'Staying present with positive moments builds tolerance over time.',
    ],
    happening:
      'You may catastrophize right after good news lands.\n\nExcitement might feel physically similar to anxiety in your body.',
    help:
      'Name the fear: "I am scared this will be taken away."\n\nPractice savoring small positive moments without forecasting disaster.\n\nChallenge beliefs that suffering is safer than hope.\n\nSeparate excitement from anxiety with grounding and breathing.\n\nShare good news with trusted people who celebrate with you.\n\nConsider therapy if joy always triggers dread or self-sabotage.',
    support:
      `${SUPPORT}\n\nSeek help if anxiety about positive events drives avoidance, panic, or depression.`,
    related: [
      'How do I stop waiting for the other shoe to drop?',
      'How do I enjoy the present moment?',
      'How do I manage anticipatory anxiety?',
      'How do I stop catastrophizing?',
      'How do I build tolerance for uncertainty?',
    ],
    schemaAnswer:
      'Anxiety about good things often reflects fear of disappointment or loss—practice staying present with positive moments and challenge beliefs that hope is dangerous.',
    themes: ['Anticipatory anxiety', 'Joy', 'Catastrophic thinking', 'Self-worth'],
    refs: [ANXIETY, NIMH],
  }),
  'why-do-i-feel-anxious-about-relaxing-or-taking-184730-048': draft({
    question: 'Why do I feel anxious about relaxing or taking breaks?',
    slug: 'why-do-i-feel-anxious-about-relaxing-or-taking-184730-048',
    category: 'Anxiety & Stress',
    title: 'Anxious About Relaxing or Resting',
    meta: 'Relaxation anxiety often ties worth to productivity—guilt, hypervigilance, or fear of losing control can make rest feel threatening rather than restorative.',
    summary:
      'Feeling anxious about relaxing is common in productivity-focused cultures where rest feels lazy or irresponsible. Guilt about downtime, perfectionism, fear of falling behind, or a hypervigilant nervous system after chronic stress can make breaks feel threatening instead of restorative.',
    takeaways: [
      'Worth tied to output makes rest feel morally wrong.',
      'Hypervigilance after chronic stress makes stillness feel unsafe.',
      'Busyness sometimes avoids emotions that surface when you pause.',
      'Rest improves performance—downtime is functional, not indulgent.',
    ],
    happening:
      'Vacations may bring intrusive work thoughts or guilt for not producing.\n\nSitting still can spike heart rate as if danger is near.',
    help:
      'Schedule rest like any important appointment.\n\nStart with short breaks and tolerate discomfort without fleeing to tasks.\n\nChallenge beliefs: "Rest is how humans sustain effort."\n\nNotice what feelings emerge in quiet—anxiety may be covering grief or fear.\n\nPractice passive rest: lying down without optimizing the moment.\n\nSeek therapy if rest anxiety is chronic or paired with burnout or panic.',
    support:
      `${SUPPORT}\n\nSeek help if inability to rest accompanies panic, insomnia, or complete functional collapse.`,
    related: [
      'How do I recover from burnout?',
      'How do I stop feeling guilty for resting?',
      'How do I calm my nervous system?',
      'How do I separate my self-worth from productivity?',
      'How do I manage chronic stress?',
    ],
    schemaAnswer:
      'Anxiety about relaxing often reflects productivity guilt, perfectionism, or hypervigilance—practice short intentional rests and challenge beliefs that worth requires constant output.',
    themes: ['Rest anxiety', 'Burnout', 'Productivity guilt', 'Hypervigilance'],
    refs: [BURNOUT, ANXIETY],
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
  'reports/enrichment-corpus/draft-answers/batch-30-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-30-drafts.json`);
