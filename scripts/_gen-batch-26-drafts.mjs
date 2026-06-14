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
  readFileSync('reports/enrichment-corpus/batches/batch-23-input.json', 'utf8'),
);

const contentBySlug = {
  'should-i-tell-my-employer-about-going-to-treatment': draft({
    question: 'Should I tell my employer about going to treatment?',
    slug: 'should-i-tell-my-employer-about-going-to-treatment',
    category: 'Therapy & Mental Health',
    title: 'Telling Your Employer About Treatment',
    meta: 'Disclosing treatment to an employer is a personal choice—FMLA and ADA may protect leave without revealing specifics, but workplace culture and legal advice matter.',
    summary:
      'Whether to tell your employer about treatment depends on your workplace culture, relationship with your supervisor, and legal protections. You are not required to disclose the specific reason for medical leave. FMLA and ADA may protect your job when you meet eligibility requirements.',
    takeaways: [
      'Disclosure is personal—not legally required for medical leave.',
      'FMLA and ADA may protect eligible employees during treatment.',
      'You can request leave for "a health condition" without details.',
      'Workplace culture and potential discrimination risks deserve careful weighing.',
    ],
    happening:
      'You may fear job loss, stigma, or damaged relationships if you disclose.\n\nSome employers offer supportive EAP benefits; others may react poorly despite legal protections.',
    help:
      'Learn your rights: FMLA eligibility, ADA accommodations, and state leave laws.\n\nConsult HR or an employment attorney before deciding what to share.\n\nIf disclosing, focus on functional needs and leave timing—not clinical details.\n\nIf not disclosing, provide medical documentation for "a health condition requiring treatment."\n\nCoordinate paperwork with your treatment provider and facility.\n\nDocument conversations and keep copies of submitted forms.',
    support:
      `${SUPPORT}\n\nConsult an employment attorney or qualified HR advisor about your specific situation before making disclosure decisions.`,
    related: [
      'How do I take time off work for mental health?',
      'How do I find a therapist?',
      'How do I manage anxiety about returning to work after treatment?',
      'How do I set boundaries at work for my mental health?',
      'How do I know if my workplace is toxic?',
    ],
    schemaAnswer:
      'Telling your employer about treatment is optional—FMLA and ADA may protect eligible leave without requiring specific disclosure; weigh workplace culture and consult HR or legal advice.',
    themes: ['Workplace', 'Treatment', 'Legal rights', 'Disclosure'],
    refs: [SAMHSA, NIMH],
    gaps: ['No employer-specific legal advice; verify leave framing stays general.'],
    notes: 'No employer-specific legal advice; verify leave framing stays general.',
  }),
  'should-i-tell-my-therapist-everything-186032-046': draft({
    question: 'Should I tell my therapist everything?',
    slug: 'should-i-tell-my-therapist-everything-186032-046',
    category: 'Therapy Navigation',
    title: 'What to Share in Therapy',
    meta: 'Honesty helps therapy work, but you can share at your own pace—therapists keep confidentiality except for safety-related exceptions explained upfront.',
    summary:
      'Honesty generally leads to better therapy outcomes because your therapist can only help with what they know. You do not need to share everything in the first session—trust builds over time. Therapists maintain confidentiality with limited safety exceptions explained at intake.',
    takeaways: [
      'Honesty improves outcomes, but pacing is allowed.',
      'You do not owe your full history in session one.',
      'Confidentiality has safety exceptions your therapist should explain.',
      'If trust feels broken, discuss it directly or consider a new fit.',
    ],
    happening:
      'You may hold back from shame, fear of judgment, or not knowing what matters.\n\nPast experiences of punishment for honesty can make full disclosure feel dangerous.',
    help:
      'Share what feels relevant to your current goals—even partial honesty helps.\n\nAsk your therapist to explain confidentiality limits at the start.\n\nTell them when you are holding back and why; that itself is useful data.\n\nBuild trust gradually rather than forcing a full disclosure dump.\n\nUse writing or worksheets between sessions if speaking feels hard.\n\nSwitch therapists if you consistently feel unsafe being honest.',
    support:
      `${SUPPORT}\n\nIf you are in immediate danger or planning harm, tell your therapist or call 988—they must act to protect safety.`,
    related: [
      'How do I know if my therapist is a good fit?',
      'How do I prepare for my first therapy session?',
      'How do I open up in therapy when I feel guarded?',
      'What should I expect from therapy?',
      'How do I switch therapists without feeling guilty?',
    ],
    schemaAnswer:
      'Tell your therapist what feels relevant at your own pace—honesty helps outcomes, and confidentiality has safety exceptions your therapist should explain upfront.',
    themes: ['Therapy', 'Confidentiality', 'Trust', 'Honesty'],
  }),
  'what-are-body-scan-meditations-and-how-do-they-help': draft({
    question: 'What are body scan meditations and how do they help?',
    slug: 'what-are-body-scan-meditations-and-how-do-they-help',
    category: 'General Mental Health',
    title: 'Body Scan Meditation',
    meta: 'Body scan meditation systematically directs attention through the body to release tension, build awareness, and activate the relaxation response.',
    summary:
      'Body scan meditation is a mindfulness practice that moves attention through the body—often from toes to head—noticing sensations without judgment. It builds body awareness, releases stored tension, and activates the parasympathetic nervous system for relaxation and stress relief.',
    takeaways: [
      'Body scans build awareness of tension you may not notice daily.',
      'Systematic attention helps release physical stress held in muscles.',
      'The practice activates rest-and-digest nervous system responses.',
      'Even brief scans can reduce anxiety and improve sleep quality.',
    ],
    happening:
      'Many people live disconnected from subtle body signals until pain or anxiety spikes.\n\nStress accumulates as muscle tension your mind has not yet labeled.',
    help:
      'Lie down or sit comfortably; close eyes or soften gaze.\n\nMove attention slowly: toes, feet, legs, torso, arms, neck, head.\n\nNotice warmth, tingling, tension, or numbness without fixing.\n\nBreathe into areas of tightness and allow softening.\n\nStart with 5–10 minutes and extend as comfort grows.\n\nUse guided recordings if self-direction feels difficult.',
    support:
      `${SUPPORT}\n\nSeek care if body-focused anxiety becomes obsessive, triggers panic, or prevents daily functioning—health anxiety may need specialized treatment.`,
    related: [
      'What are some simple relaxation techniques I can do anywhere?',
      'How do I start a meditation practice?',
      'How do I calm my nervous system?',
      'How do I manage stress when I cannot change my situation?',
      'How do I improve my sleep quality?',
    ],
    schemaAnswer:
      'Body scan meditation moves attention through the body to build awareness, release tension, and activate relaxation—practice slowly from toes to head with non-judgmental noticing.',
    themes: ['Mindfulness', 'Meditation', 'Stress relief', 'Body awareness'],
  }),
  'what-are-healthy-ways-to-cope-with-stress': draft({
    question: 'What are healthy ways to cope with stress?',
    slug: 'what-are-healthy-ways-to-cope-with-stress',
    category: 'Anxiety & Stress',
    title: 'Healthy Stress Coping Strategies',
    meta: 'Effective stress management combines immediate calming tools with long-term habits—movement, sleep, connection, and boundaries build resilience over time.',
    summary:
      'Healthy stress coping includes both in-the-moment techniques and long-term lifestyle practices. Exercise, sleep, social connection, mindfulness, and time management reduce cortisol and build resilience. Avoiding substances, isolation, or endless rumination prevents stress from compounding.',
    takeaways: [
      'Combine immediate tools with long-term resilience habits.',
      'Movement, sleep, and connection are among the strongest buffers.',
      'Avoidance and substances often worsen stress over time.',
      'Boundaries and realistic planning reduce overwhelm at the source.',
    ],
    happening:
      'Chronic stress may leave you wired, exhausted, or reaching for quick escapes.\n\nWithout healthy outlets, tension accumulates in body and mind.',
    help:
      'Move regularly—even short walks reduce stress hormones.\n\nPrioritize 7–9 hours of sleep and consistent routines.\n\nUse breathing, grounding, or brief meditation when stress spikes.\n\nConnect with trusted people instead of isolating.\n\nSet boundaries on hours, commitments, and news consumption.\n\nPlan and break tasks into steps to reduce overwhelm.',
    support:
      `${SUPPORT}\n\nSeek therapy if stress drives chronic insomnia, panic, substance use, or inability to function at work or home.`,
    related: [
      'What are some quick techniques to calm anxiety in the moment?',
      'How do I recover from burnout?',
      'How do I set boundaries when I feel guilty?',
      'How do I stop bringing work stress home?',
      'How do I manage stress when I cannot change my situation?',
    ],
    schemaAnswer:
      'Cope with stress through movement, sleep, connection, mindfulness, and boundaries—combine immediate calming tools with long-term habits that build resilience.',
    themes: ['Stress management', 'Coping skills', 'Resilience', 'Self-care'],
    refs: [BURNOUT, NIMH],
  }),
  'what-are-signs-that-my-parenting-style-might-be-too-strict-or-too-permissive': draft({
    question: 'What are signs that my parenting style might be too strict or too permissive?',
    slug: 'what-are-signs-that-my-parenting-style-might-be-too-strict-or-too-permissive',
    category: 'Family & Parenting',
    title: 'Strict vs. Permissive Parenting Signs',
    meta: 'Overly strict parenting can produce fear and compliance; overly permissive parenting can leave kids without limits—balance warmth with consistent, age-appropriate expectations.',
    summary:
      'Parenting balance is ongoing. Overly strict styles may show up as fearful, anxious, or secretly rebellious children. Overly permissive styles may show up as difficulty with rules, entitlement, or poor self-regulation. Self-reflection on your reactions and your child\'s responses guides adjustment.',
    takeaways: [
      'Strict parenting can produce fear, hiding, or anxiety about mistakes.',
      'Permissive parenting can leave children struggling with limits and self-control.',
      'Age-appropriate expectations matter more than rigid labels.',
      'Your emotional reactions to child behavior are useful data.',
    ],
    happening:
      'You may swing between extremes when stressed, guilty, or reacting to your own upbringing.\n\nChildren\'s behavior in school and with other adults reveals patterns you miss at home.',
    help:
      'Notice if children seem fearful of mistakes or rarely express opinions—possible strictness.\n\nNotice if children resist all rules or struggle with authority—possible permissiveness.\n\nCheck whether expectations match developmental stage.\n\nAim for warmth plus consistent, explainable limits.\n\nRepair after overreactions: apologize and reset expectations.\n\nRead parenting resources or consult a family therapist for tailored guidance.',
    support:
      `${SUPPORT}\n\nSeek family therapy if parenting conflict escalates, children show significant anxiety or behavioral problems, or home feels consistently unsafe.`,
    related: [
      'How do I stop yelling at my kids?',
      'How do I set boundaries with my teenager?',
      'How do I repair my relationship with my child after conflict?',
      'How do I manage parenting stress?',
      'How do I co-parent when we disagree on discipline?',
    ],
    schemaAnswer:
      'Signs of overly strict parenting include fear of mistakes and hidden rebellion; permissive parenting shows as poor rule-following and self-regulation—balance warmth with consistent, age-appropriate limits.',
    themes: ['Parenting', 'Discipline', 'Boundaries', 'Child development'],
  }),
  'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment': draft({
    question: 'What are some quick techniques to calm anxiety in the moment?',
    slug: 'what-are-some-quick-techniques-to-calm-anxiety-in-the-moment',
    category: 'Anxiety & Stress',
    title: 'Quick Anxiety Calming Techniques',
    meta: '4-7-8 breathing, 5-4-3-2-1 grounding, and cold water on the face can rapidly reduce acute anxiety by shifting your nervous system.',
    summary:
      'When anxiety spikes suddenly, quick techniques can restore a sense of control. Breathing exercises, grounding, progressive muscle relaxation, cold stimulation, and reassuring self-talk activate the parasympathetic nervous system and interrupt catastrophic thinking.',
    takeaways: [
      'Breathing techniques like 4-7-8 and box breathing slow heart rate quickly.',
      '5-4-3-2-1 grounding returns attention to the present moment.',
      'Cold water or ice can interrupt the acute anxiety response.',
      'Prepared calming phrases reduce panic about panic.',
    ],
    happening:
      'Acute anxiety floods the body with adrenaline—racing heart, tight chest, and urgent thoughts.\n\nWithout tools, the spiral can feel endless and frightening.',
    help:
      'Try 4-7-8 breathing: inhale 4, hold 7, exhale 8—repeat three cycles.\n\nUse 5-4-3-2-1 grounding: see, touch, hear, smell, taste.\n\nTense and release major muscle groups for 5 seconds each.\n\nSplash cold water or hold ice to stimulate the vagus nerve.\n\nRepeat a calming phrase: "This will pass" or "I am safe right now."\n\nMove—walk, shake out hands, or change rooms to break the loop.',
    support:
      `${SUPPORT}\n\nSeek evaluation if panic attacks are frequent, cause avoidance of daily life, or include chest pain you have not had medically cleared.`,
    related: [
      'What are some simple relaxation techniques I can do anywhere?',
      'Why does anxiety make my chest feel tight?',
      'How do I stop a panic attack?',
      'How do I calm my nervous system?',
      'How do I manage anxiety without medication?',
    ],
    schemaAnswer:
      'Calm acute anxiety with 4-7-8 breathing, 5-4-3-2-1 grounding, muscle relaxation, cold water, and reassuring self-talk to shift your nervous system in the moment.',
    themes: ['Anxiety', 'Panic', 'Grounding', 'Breathing'],
    refs: [ANXIETY, NIMH],
  }),
  'what-are-some-simple-relaxation-techniques-i-can-do-anywhere': draft({
    question: 'What are some simple relaxation techniques I can do anywhere?',
    slug: 'what-are-some-simple-relaxation-techniques-i-can-do-anywhere',
    category: 'General Mental Health',
    title: 'Relaxation Techniques Anywhere',
    meta: 'Discreet tools like box breathing, progressive muscle relaxation, and brief visualization reduce stress without special equipment or privacy.',
    summary:
      'Portable relaxation techniques help manage stress in daily life. Deep breathing, progressive muscle relaxation, grounding, visualization, and gentle movement can be done at a desk, in a car, or in public with minimal visibility.',
    takeaways: [
      'Breathing techniques work discreetly almost anywhere.',
      'Progressive muscle relaxation can be done subtly in a chair.',
      'Grounding redirects attention from internal stress to the environment.',
      'Brief visualization provides mental escape without leaving your seat.',
    ],
    happening:
      'Stress often hits in meetings, commutes, or crowded spaces where you cannot lie down or leave easily.\n\nWithout portable tools, tension accumulates until you crash at home.',
    help:
      'Use box breathing: inhale 4, hold 4, exhale 4, hold 4.\n\nTense and release toes, shoulders, or jaw discreetly.\n\nRun 5-4-3-2-1 grounding with eyes open.\n\nVisualize a calm place for 60 seconds.\n\nRoll shoulders and neck gently at your desk.\n\nRepeat a short calming mantra under your breath.',
    support:
      `${SUPPORT}\n\nSeek therapy if stress feels constant, drives physical symptoms daily, or you cannot use any technique without escalating panic.`,
    related: [
      'What are some quick techniques to calm anxiety in the moment?',
      'What are body scan meditations and how do they help?',
      'How do I manage stress at work?',
      'How do I calm my nervous system?',
      'How do I build a daily mindfulness habit?',
    ],
    schemaAnswer:
      'Relax anywhere with box breathing, subtle muscle relaxation, 5-4-3-2-1 grounding, brief visualization, and gentle movement—no special equipment required.',
    themes: ['Relaxation', 'Stress relief', 'Mindfulness', 'Coping skills'],
    refs: [BURNOUT, NIMH],
  }),
  'what-are-the-signs-of-burnout-and-how-do-i-recover': draft({
    question: 'What are the signs of burnout and how do I recover?',
    slug: 'what-are-the-signs-of-burnout-and-how-do-i-recover',
    category: 'Work & Life Balance',
    title: 'Burnout Signs and Recovery',
    meta: 'Burnout shows as exhaustion, cynicism, and reduced effectiveness—recovery requires rest, boundary-setting, and often structural changes, not just pushing through.',
    summary:
      'Burnout is physical, emotional, and mental exhaustion from prolonged stress—often work or caregiving related. Signs include chronic fatigue, cynicism, irritability, reduced performance, and detachment. Recovery starts with acknowledging burnout, reducing demands, and rebuilding rest and meaning.',
    takeaways: [
      'Burnout differs from ordinary tiredness—it persists despite rest.',
      'Cynicism, detachment, and reduced effectiveness are core signs.',
      'Pushing through usually deepens burnout rather than fixing it.',
      'Recovery requires rest, boundaries, and often role or workload changes.',
    ],
    happening:
      'You may feel depleted even after weekends, dread responsibilities, or notice your work quality slipping.\n\nCaregiving or high-demand roles without recovery time accelerate burnout.',
    help:
      'Acknowledge burnout as real—not a personal failure.\n\nTake leave or reduce commitments where possible.\n\nProtect sleep, nutrition, and gentle movement.\n\nSet boundaries on availability and overtime.\n\nReconnect with activities and people outside work identity.\n\nDelegate, ask for help, and reassess unsustainable workloads.',
    support:
      `${SUPPORT}\n\nSeek therapy or medical evaluation if burnout drives depression, substance use, or thoughts of self-harm—and urgent help if safety feels at risk.`,
    related: [
      'How do I recover from burnout?',
      'How do I know when to quit my job for my mental health?',
      'How do I set boundaries at work?',
      'Is it normal to dread going to work every day?',
      'How do I stop bringing work stress home?',
    ],
    schemaAnswer:
      'Burnout signs include chronic exhaustion, cynicism, and reduced effectiveness—recover by acknowledging it, resting, setting boundaries, and changing unsustainable demands.',
    themes: ['Burnout', 'Work stress', 'Recovery', 'Boundaries'],
    refs: [BURNOUT, NIMH],
  }),
  'what-are-the-signs-of-emotional-abuse-in-185759-032': draft({
    question: 'What are the signs of emotional abuse in a relationship?',
    slug: 'what-are-the-signs-of-emotional-abuse-in-185759-032',
    category: 'Relationships & Communication',
    title: 'Signs of Emotional Abuse',
    meta: 'Emotional abuse includes criticism, control, gaslighting, and isolation—patterns that erode self-worth and create constant fear or walking on eggshells.',
    summary:
      'Emotional abuse involves patterns of control, manipulation, and degradation rather than isolated conflicts. Signs include constant criticism, gaslighting, isolation from support, monitoring, threats, and feeling you must walk on eggshells. Trust your gut if you feel consistently anxious or devalued.',
    takeaways: [
      'Emotional abuse is a pattern—not a single harsh argument.',
      'Gaslighting, isolation, and control are common tactics.',
      'Walking on eggshells and chronic self-doubt are warning signs.',
      'Abuse is never your fault; support and safety planning help.',
    ],
    happening:
      'Abuse often starts subtly and escalates, making it hard to name.\n\nYou may minimize behavior, blame yourself, or hope change is around the corner.',
    help:
      'Learn signs: criticism, control, gaslighting, isolation, threats, humiliation.\n\nTrack patterns in a private journal—not just isolated incidents.\n\nTrust persistent anxiety and feeling diminished around your partner.\n\nMaintain or rebuild connections outside the relationship.\n\nCreate a safety plan if you fear escalation.\n\nContact the National Domestic Violence Hotline (1-800-799-7233) for confidential support.',
    support:
      `${SUPPORT}\n\nIf you feel unsafe, contact the National Domestic Violence Hotline at 1-800-799-7233 or seek local domestic violence services immediately.`,
    related: [
      'What is gaslighting and how do I recognize it?',
      'How do I know if my relationship is toxic?',
      'How do I safely leave an abusive relationship?',
      'How do I rebuild self-esteem after emotional abuse?',
      'How do I set boundaries in my relationship?',
    ],
    schemaAnswer:
      'Emotional abuse signs include constant criticism, gaslighting, isolation, control, and walking on eggshells—trust your gut and seek support from domestic violence resources if needed.',
    themes: ['Emotional abuse', 'Safety', 'Relationships', 'Gaslighting'],
    flags: ['relationship-safety'],
    notes: 'Include crisis resources for safety planning; verify tone is validating not dismissive.',
  }),
  'what-do-i-do-if-i-think-my-child-is-questioning-th-187459-002': draft({
    question: 'What do I do if I think my child is questioning their gender identity?',
    slug: 'what-do-i-do-if-i-think-my-child-is-questioning-th-187459-002',
    category: 'Teen-Specific Questions',
    title: 'Supporting a Gender-Questioning Child',
    meta: 'Listen without judgment, use their preferred name and pronouns, educate yourself independently, and follow their lead—affirmation protects mental health.',
    summary:
      'If your child may be questioning their gender identity, prioritize safety, love, and acceptance. Listen without judgment, use preferred name and pronouns, educate yourself from reputable sources, and follow their lead. Affirming support is a major protective factor for youth mental health.',
    takeaways: [
      'Unconditional love and listening matter most.',
      'Use preferred name and pronouns even while they explore.',
      'Educate yourself—do not burden your child with teaching you everything.',
      'Affirmation reduces risk of depression and suicidality in LGBTQ+ youth.',
    ],
    happening:
      'Your child may test reactions with clothing, language, or questions before full disclosure.\n\nFear of rejection can make them hide exploration from you.',
    help:
      'Create space: "I love you no matter what you discover about yourself."\n\nUse their preferred name and pronouns when asked.\n\nLearn from PFLAG, The Trevor Project, and other reputable resources.\n\nFollow their pace on social transition and disclosure to others.\n\nFind a gender-affirming therapist if distress or dysphoria appears.\n\nAdvocate at school and in extended family for respectful treatment.',
    support:
      `${SUPPORT}\n\nIf your child expresses thoughts of self-harm, connect with crisis support (988) and a gender-affirming mental health provider promptly.`,
    related: [
      'How do I talk to my teenager about mental health?',
      'How do I support my LGBTQ+ child?',
      'How do I find a therapist for my teen?',
      'How do I handle family who reject my child\'s identity?',
      'How do I know if my teen needs therapy?',
    ],
    schemaAnswer:
      'Support a gender-questioning child by listening without judgment, using preferred name and pronouns, educating yourself independently, and following their lead with affirming care.',
    themes: ['Gender identity', 'Parenting', 'LGBTQ+ youth', 'Affirmation'],
    gaps: ['No dedicated LGBTQ+ youth clinical source cited; verify framing with editorial standards.'],
  }),
  'what-do-i-do-when-i-cant-forgive-someone-177941-016': draft({
    question: "What do I do when I can't forgive someone?",
    slug: 'what-do-i-do-when-i-cant-forgive-someone-177941-016',
    category: 'Forgiveness',
    title: "When You Can't Forgive",
    meta: 'Forgiveness is a process, not an obligation—focus on healing yourself and releasing resentment for your peace, not excusing harm.',
    summary:
      'Struggling to forgive deep hurt is understandable and does not make you a bad person. Forgiveness is not excusing behavior, forgetting, or reconciling. It can mean releasing resentment for your own wellbeing—and you can maintain boundaries while you process.',
    takeaways: [
      'Forgiveness cannot be forced or rushed.',
      'Not forgiving does not mean you are bitter or wrong.',
      'Forgiveness is for your peace—not excusing their actions.',
      'Boundaries and no contact are compatible with eventual forgiveness.',
    ],
    happening:
      'Pressure to forgive quickly can silence legitimate anger and grief.\n\nDeep betrayal may require years before forgiveness feels possible—or never.',
    help:
      'Acknowledge the full extent of the harm without minimizing it.\n\nAllow anger, sadness, and betrayal without self-judgment.\n\nSeparate forgiveness from reconciliation—you can forgive and still stay away.\n\nFocus on what releases resentment for you, not what others expect.\n\nWrite unsent letters or use therapy to process stuck feelings.\n\nDefine success as healing yourself, not performing forgiveness.',
    support:
      `${SUPPORT}\n\nSeek therapy if inability to forgive fuels chronic rage, depression, or obsessive rumination that impairs daily life.`,
    related: [
      'How do I practice self-forgiveness?',
      'How do I let go of resentment?',
      'How do I set boundaries with someone who hurt me?',
      'How do I heal after betrayal?',
      'How do I stop ruminating about past mistakes?',
    ],
    schemaAnswer:
      'When you cannot forgive, allow the process without forcing it—forgiveness means releasing resentment for your peace, not excusing harm or requiring reconciliation.',
    themes: ['Forgiveness', 'Resentment', 'Healing', 'Boundaries'],
  }),
  'what-do-i-do-when-i-feel-disconnected-from-m-177941-020': draft({
    question: 'What do I do when I feel disconnected from my partner?',
    slug: 'what-do-i-do-when-i-feel-disconnected-from-m-177941-020',
    category: 'Relationships',
    title: 'Feeling Disconnected From Your Partner',
    meta: 'Relationship disconnection is common and often fixable—honest conversation, quality time, and addressing underlying resentment rebuild intimacy.',
    summary:
      'Feeling disconnected from your partner is lonely and common. It often develops gradually through busy schedules, unresolved conflict, or life stress. Both partners may feel the same way without saying it. Intentional communication, quality time, and physical affection can rebuild closeness.',
    takeaways: [
      'Disconnection often develops slowly—not from one event.',
      'Both partners may feel distant without discussing it.',
      'Honest, non-blaming conversation is a first step.',
      'Quality time and physical affection rebuild intimacy over time.',
    ],
    happening:
      'You may live parallel lives—handling logistics without emotional contact.\n\nMajor transitions like parenting or job stress can shrink your shared inner world.',
    help:
      'Name the disconnection gently: "I miss feeling close to you."\n\nAsk how your partner experiences the relationship lately.\n\nSchedule phone-free time together—even short daily check-ins.\n\nReintroduce non-sexual touch: hugs, hand-holding, sitting close.\n\nAddress resentment or unmet needs rather than only scheduling dates.\n\nConsider couples therapy if you feel stuck or unable to communicate safely.',
    support:
      `${SUPPORT}\n\nSeek couples or individual therapy if disconnection coexists with contempt, emotional abuse, or thoughts of leaving without safe planning.`,
    related: [
      'How do I communicate my needs in a relationship?',
      'How do I rebuild trust after betrayal?',
      'How do I know if my relationship is worth saving?',
      'How do I stop feeling lonely in my marriage?',
      'How do I reconnect with my partner after having kids?',
    ],
    schemaAnswer:
      'When disconnected from your partner, share feelings honestly, schedule quality time, reintroduce affection, and address underlying resentment—couples therapy helps if you feel stuck.',
    themes: ['Relationships', 'Intimacy', 'Communication', 'Connection'],
  }),
  'what-do-i-do-when-i-feel-like-everyone-h-177940-024': draft({
    question: 'What do I do when I feel like everyone hates me?',
    slug: 'what-do-i-do-when-i-feel-like-everyone-h-177940-024',
    category: 'Social Anxiety',
    title: 'Feeling Like Everyone Hates You',
    meta: 'This feeling often reflects depression or social anxiety distortions—challenge mind-reading and look for evidence of people who care.',
    summary:
      'Feeling like everyone hates you usually reflects depression, social anxiety, or low self-esteem rather than reality. Mind-reading and negativity bias filter out kindness and amplify neutral cues. Challenge assumptions with evidence and consider professional support if the feeling persists.',
    takeaways: [
      'This feeling is often a symptom—not an accurate social read.',
      'Mind-reading assumes others\' thoughts without evidence.',
      'Depression and anxiety distort neutral interactions as rejection.',
      'Evidence of care from even a few people contradicts "everyone."',
    ],
    happening:
      'Neutral faces may feel like disapproval; silence may feel like rejection.\n\nSocial withdrawal can reduce positive feedback, reinforcing the belief.',
    help:
      'Label the thought: "I am mind-reading, not knowing."\n\nList people who have shown kindness recently—even small gestures.\n\nConsider alternative explanations for others\' behavior: stress, distraction, shyness.\n\nLimit isolation that removes corrective social data.\n\nReduce social media comparison that fuels rejection feelings.\n\nPractice one low-stakes social interaction and notice actual responses.',
    support:
      `${SUPPORT}\n\nSeek therapy if this belief is persistent, drives isolation, or accompanies depression or suicidal thoughts.`,
    related: [
      'How do I stop caring so much about what others think?',
      'How do I manage social anxiety?',
      'How do I know if I am depressed?',
      'How do I stop overthinking every conversation?',
      'How do I build self-esteem?',
    ],
    schemaAnswer:
      'When you feel everyone hates you, recognize mind-reading and negativity bias—look for evidence of care and seek therapy if depression or social anxiety drives persistent rejection beliefs.',
    themes: ['Social anxiety', 'Depression', 'Mind-reading', 'Self-esteem'],
    refs: [ANXIETY, DEPRESSION],
  }),
  'what-do-i-do-when-i-feel-like-giving-up-on-m-177941-012': draft({
    question: 'What do I do when I feel like giving up on my dreams?',
    slug: 'what-do-i-do-when-i-feel-like-giving-up-on-m-177941-012',
    category: 'Life Purpose',
    title: 'Giving Up on Your Dreams',
    meta: 'Dream fatigue after setbacks is normal—reconnect with why the dream mattered, break goals into steps, or allow dreams to evolve rather than abandon them in despair.',
    summary:
      'Wanting to give up on dreams often follows obstacles, rejection, or slow progress—not proof the dream is wrong. Distinguish temporary discouragement from genuine misalignment. Reconnect with underlying motivation, adjust approach, or evolve the dream as you grow.',
    takeaways: [
      'Setbacks and slow progress commonly trigger dream fatigue.',
      'Discouragement differs from realizing a dream no longer fits.',
      'Smaller steps rebuild momentum better than all-or-nothing thinking.',
      'Dreams can evolve—you do not owe your past self a fixed path.',
    ],
    happening:
      'The gap between vision and reality may feel impossibly wide.\n\nComparison to others\' timelines can make your progress feel like failure.',
    help:
      'Ask: Does this dream still align with my values and joy?\n\nReconnect with why it mattered before obstacles piled up.\n\nBreak the dream into one next step you can take this week.\n\nAllow seasons of rest or pivot without calling it quitting forever.\n\nSeparate your worth from achievement outcomes.\n\nTalk with a mentor or therapist if perfectionism blocks all action.',
    support:
      `${SUPPORT}\n\nSeek support if giving up on dreams coincides with depression, hopelessness, or thoughts of self-harm.`,
    related: [
      'How do I find my purpose in life?',
      'How do I stop comparing my life to others?',
      'How do I overcome fear of failure?',
      'How do I stay motivated when progress is slow?',
      'How do I deal with feeling like a failure?',
    ],
    schemaAnswer:
      'When you want to give up on dreams, distinguish discouragement from misalignment—reconnect with motivation, take small steps, and allow dreams to evolve rather than abandoning them in despair.',
    themes: ['Life purpose', 'Motivation', 'Perseverance', 'Self-worth'],
  }),
  'what-do-i-do-when-i-feel-like-i-dont-fit-in-177941-024': draft({
    question: "What do I do when I feel like I don't fit in anywhere?",
    slug: 'what-do-i-do-when-i-feel-like-i-dont-fit-in-177941-024',
    category: 'Social Belonging',
    title: "When You Don't Fit In",
    meta: 'Not fitting in often reflects authenticity or environment mismatch—seek communities aligned with your values rather than shrinking yourself to belong.',
    summary:
      'Feeling you do not fit in anywhere is painful and common—especially for sensitive, creative, or neurodivergent people. It often means you have not found your people yet, not that something is wrong with you. Authenticity and targeted community search work better than forcing conformity.',
    takeaways: [
      'Not fitting in everywhere is not a personal defect.',
      'Authenticity matters more than universal acceptance.',
      'Your people often share specific interests or values—not every group.',
      'A few genuine connections beat many superficial ones.',
    ],
    happening:
      'You may code-switch constantly or feel like an outsider in every room.\n\nPast rejection or moving frequently can deepen the outsider story.',
    help:
      'Stop trying to fit groups that require hiding core parts of yourself.\n\nJoin communities around hobbies, causes, or identities you hold.\n\nExplore online spaces if local options feel limited.\n\nPractice self-compassion: fitting in is not the same as belonging.\n\nInvest in one or two deepening friendships rather than chasing popularity.\n\nConsider therapy if rejection sensitivity or trauma blocks connection attempts.',
    support:
      `${SUPPORT}\n\nSeek therapy if isolation fuels depression, self-harm thoughts, or complete withdrawal from all social contact.`,
    related: [
      'How do I make friends as an adult?',
      'How do I stop feeling lonely?',
      'How do I build confidence in social situations?',
      'How do I find my community?',
      'Is it normal to prefer being alone most of the time?',
    ],
    schemaAnswer:
      'When you do not fit in, seek communities aligned with your values and interests rather than changing yourself—authentic belonging beats forced conformity.',
    themes: ['Belonging', 'Authenticity', 'Loneliness', 'Community'],
  }),
  'what-do-i-do-when-i-feel-like-i-have-no-real-identity-of-my-own-d4e5f6': draft({
    question: 'What do I do when I feel like I have no real identity of my own?',
    slug: 'what-do-i-do-when-i-feel-like-i-have-no-real-identity-of-my-own-d4e5f6',
    category: 'Identity & Self-Worth',
    title: 'No Sense of Identity',
    meta: 'Weak identity often follows people-pleasing or invalidating upbringing—explore values, interests, and boundaries to build a stronger self-concept over time.',
    summary:
      'Feeling you have no real identity can follow people-pleasing, invalidating environments, or never having space to explore who you are. Building identity is gradual: notice interests, practice small boundaries, and gather data about what feels authentically yours.',
    takeaways: [
      'Identity builds through exploration—not a single revelation.',
      'People-pleasing can leave you mirroring others instead of knowing yourself.',
      'Small boundaries help differentiate you from others\' expectations.',
      'Patience and self-compassion are part of the process.',
    ],
    happening:
      'You may feel like a chameleon—different with every group and hollow alone.\n\nRoles as caretaker or peacemaker may have crowded out self-discovery.',
    help:
      'Journal: What do I value? What activities absorb me? What angers me on others\' behalf?\n\nTry new experiences to gather data—not to find one perfect passion.\n\nPractice small "no"s and differing opinions to feel your edges.\n\nLimit time with people who only accept a performed version of you.\n\nNotice sparks of curiosity—they are clues to authentic self.\n\nWork with a therapist if identity confusion feels overwhelming or chronic.',
    support:
      `${SUPPORT}\n\nSeek therapy if identity emptiness drives dissociation, self-harm, or inability to function in daily roles.`,
    related: [
      'How do I stop being a people pleaser?',
      'How do I build self-esteem?',
      'How do I figure out who I am?',
      'How do I set boundaries with family?',
      'How do I stop seeking validation from others?',
    ],
    schemaAnswer:
      'Build identity by exploring values and interests, practicing boundaries, and noticing what feels authentically yours—identity develops gradually, not overnight.',
    themes: ['Identity', 'Self-discovery', 'People-pleasing', 'Boundaries'],
  }),
  'what-do-i-do-when-i-feel-like-im-losing-myse-177941-032': draft({
    question: "What do I do when I feel like I'm losing myself in my relationship?",
    slug: 'what-do-i-do-when-i-feel-like-im-losing-myse-177941-032',
    category: 'Relationship Identity',
    title: 'Losing Yourself in a Relationship',
    meta: 'Losing yourself often follows constant compromise and people-pleasing—reconnect with solo interests, friendships, and preferences to restore individual identity.',
    summary:
      'Losing yourself in a relationship happens gradually through compromise, people-pleasing, or fear of conflict. Healthy relationships need two whole people—not merger into one. Reclaim solo time, hobbies, friendships, and the ability to express your own preferences.',
    takeaways: [
      'Identity erosion in relationships is often gradual and unnoticed.',
      'Love does not require abandoning individual interests and friendships.',
      'Solo time and separate friendships protect sense of self.',
      'A partner who resists your individuality may signal control issues.',
    ],
    happening:
      'You may realize you cannot name your preferences without referencing your partner.\n\nHobbies, friends, and opinions may have been sacrificed to keep peace.',
    help:
      'Schedule regular solo time for activities you used to enjoy.\n\nReconnect with friends outside the relationship.\n\nPractice stating preferences: music, food, plans—even small ones.\n\nNotice when you automatically defer to avoid conflict.\n\nDiscuss with your partner that individual identity strengthens the relationship.\n\nSeek therapy if reclaiming self triggers partner anger or control.',
    support:
      `${SUPPORT}\n\nSeek individual or couples therapy if losing yourself coexists with control, isolation, or fear of expressing independence.`,
    related: [
      'How do I maintain my independence in a relationship?',
      'How do I set boundaries in my relationship?',
      'How do I stop being a people pleaser?',
      'How do I know if my relationship is codependent?',
      'How do I communicate my needs in a relationship?',
    ],
    schemaAnswer:
      'When losing yourself in a relationship, reclaim solo interests, friendships, and preferences—healthy love requires two whole people, not merger into one.',
    themes: ['Relationship identity', 'Codependency', 'Boundaries', 'Independence'],
  }),
  'what-do-i-do-when-i-feel-like-im-not-living-177941-028': draft({
    question: "What do I do when I feel like I'm not living up to my potential?",
    slug: 'what-do-i-do-when-i-feel-like-im-not-living-177941-028',
    category: 'Self-Actualization',
    title: 'Not Living Up to Potential',
    meta: 'Potential anxiety often reflects perfectionism and comparison—define success by your values and focus on progress over an idealized version of yourself.',
    summary:
      'Feeling you are not living up to potential often stems from perfectionism, comparison, or external definitions of success. Potential is subjective and affected by circumstances others cannot see. Progress and values-aligned action matter more than matching an imagined ideal timeline.',
    takeaways: [
      'Potential is subjective—not a fixed measure of worth.',
      'Comparison ignores different starting points and obstacles.',
      'Perfectionism makes any achievement feel insufficient.',
      'Define success by your values, not others\' expectations.',
    ],
    happening:
      'You may see peers "ahead" while discounting your own constraints and wins.\n\nFamily or cultural messages may tie love to achievement.',
    help:
      'Ask whose definition of potential you are using—yours or someone else\'s?\n\nList obstacles others may not see: health, caregiving, finances, trauma.\n\nCelebrate progress, not just peak outcomes.\n\nSet one values-aligned goal instead of chasing every metric.\n\nLimit comparison triggers on social media.\n\nTherapy helps when shame about "wasted potential" is paralyzing.',
    support:
      `${SUPPORT}\n\nSeek therapy if potential anxiety drives depression, self-harm thoughts, or chronic paralysis in work and life.`,
    related: [
      'How do I stop being so hard on myself?',
      'How do I stop comparing my life to others?',
      'How do I overcome perfectionism?',
      'How do I build self-worth beyond achievement?',
      'How do I deal with feeling like a failure?',
    ],
    schemaAnswer:
      'When not living up to potential, challenge perfectionism and comparison—define success by your values and focus on progress rather than an idealized timeline.',
    themes: ['Self-actualization', 'Perfectionism', 'Comparison', 'Self-worth'],
  }),
  'what-do-i-do-when-im-losing-faith-in-everything-i--186602-023': draft({
    question: "What do I do when I'm losing faith in everything I used to believe?",
    slug: 'what-do-i-do-when-im-losing-faith-in-everything-i--186602-023',
    category: 'Spiritual Struggle / Existential Crisis',
    title: 'Losing Faith in Old Beliefs',
    meta: 'Faith deconstruction is a normal developmental process—allow questioning, grieve lost certainty, and seek community with others on similar journeys.',
    summary:
      'Losing faith in beliefs that once anchored you can feel like losing identity and foundation. Deconstruction is a normal part of spiritual and psychological growth, though it can trigger grief, anger, and isolation. Allow questioning without rushing to new answers.',
    takeaways: [
      'Deconstruction is common—not moral failure.',
      'Grief for lost certainty and community is normal.',
      'Questioning does not require immediate replacement beliefs.',
      'Support from others on similar journeys reduces isolation.',
    ],
    happening:
      'Trauma, new information, or personal growth may unravel old worldviews.\n\nFormer communities may reject you, deepening loneliness.',
    help:
      'Allow doubt without forcing quick resolution.\n\nName what you are grieving: certainty, community, rituals, identity.\n\nSeek online or local communities open to questioning.\n\nExplore values that remain even when doctrines fall away.\n\nConsider therapy for religious trauma if harm was involved.\n\nMove at your own pace—reconstruction is optional and personal.',
    support:
      `${SUPPORT}\n\nSeek therapy if deconstruction fuels isolation, self-harm thoughts, or inability to function—and specialized support for religious trauma when needed.`,
    related: [
      'Is it normal to feel angry at God or religion?',
      'How do I rebuild identity after leaving my religion?',
      'What do I do when prayer or meditation no longer brings me peace?',
      'How do I cope with family who reject my beliefs?',
      'How do I find meaning after losing my faith?',
    ],
    schemaAnswer:
      'When losing faith in old beliefs, allow deconstruction without rushing—grieve lost certainty, seek supportive community, and explore meaning on your own timeline.',
    themes: ['Faith deconstruction', 'Existential crisis', 'Identity', 'Grief'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'what-do-i-do-when-my-anxiety-is-so-bad-i-177940-004': draft({
    question: "What do I do when my anxiety is so bad I can't leave the house?",
    slug: 'what-do-i-do-when-my-anxiety-is-so-bad-i-177940-004',
    category: 'Anxiety & Stress',
    title: 'Anxiety So Bad You Cannot Leave Home',
    meta: 'Severe house-bound anxiety often reflects agoraphobia—start with tiny exposures, build coping skills, and work with a professional for systematic treatment.',
    summary:
      'When anxiety prevents leaving home, you may be experiencing agoraphobia—fear of situations where escape feels difficult. Isolation often worsens the cycle. Recovery requires gradual exposure, professional support, and sometimes medication to reduce symptom intensity enough to begin.',
    takeaways: [
      'House-bound anxiety is treatable—not a permanent life sentence.',
      'Agoraphobia often grows when avoidance shrinks your safe zone.',
      'Tiny exposures beat forcing yourself into overwhelming situations.',
      'Professional treatment significantly improves outcomes.',
    ],
    happening:
      'Avoidance may have started with one panic episode and expanded over time.\n\nStaying home feels safer but reinforces fear of the outside world.',
    help:
      'Start micro-exposures: stand in doorway, step outside briefly, increase gradually.\n\nPractice grounding and breathing before and during exposures.\n\nDo not jump to full outings—systematic steps prevent backlash.\n\nMaintain connection by phone or video if in-person feels impossible yet.\n\nWork with a therapist trained in anxiety and exposure therapy.\n\nDiscuss medication with a prescriber if symptoms block all progress.',
    support:
      `${SUPPORT}\n\nSeek urgent care if anxiety includes suicidal thoughts; contact a mental health professional specializing in agoraphobia for structured treatment.`,
    related: [
      'How do I stop a panic attack?',
      'How do I manage agoraphobia?',
      'How do I find a therapist for anxiety?',
      'What are some quick techniques to calm anxiety in the moment?',
      'How do I gradually face my fears?',
    ],
    schemaAnswer:
      'When anxiety prevents leaving home, treat likely agoraphobia with tiny gradual exposures, coping skills, and professional support—avoidance worsens the cycle over time.',
    themes: ['Agoraphobia', 'Panic', 'Exposure', 'Anxiety'],
    refs: [ANXIETY, NIMH],
  }),
  'what-do-i-do-when-my-family-rejects-me-f-181083-032': draft({
    question: 'What do I do when my family rejects me for questioning religion?',
    slug: 'what-do-i-do-when-my-family-rejects-me-f-181083-032',
    category: 'Relationships & Divorce',
    title: 'Family Rejection Over Faith Questions',
    meta: 'Religious family rejection is deeply painful—build chosen family, set boundaries, and process grief with support while honoring your spiritual journey.',
    summary:
      'Family rejection for questioning faith is profoundly painful. Your spiritual journey is personal, and you deserve dignity even when relatives disagree. Build supportive community elsewhere, process grief in therapy, and set boundaries around harmful conversations.',
    takeaways: [
      'Rejection for questioning faith is painful—not proof you are wrong.',
      'You cannot control relatives\' reactions—only your boundaries.',
      'Chosen community and therapy help process religious loss.',
      'Low or no contact may be necessary for your wellbeing.',
    ],
    happening:
      'Holiday gatherings, parenting, and daily contact may become battlegrounds.\n\nGrief for the family you hoped for may sit alongside anger.',
    help:
      'Allow grief for lost closeness and imagined acceptance.\n\nFind communities of others who left or questioned similar faiths.\n\nSet boundaries: topics off-limits, visit length, or paused contact.\n\nAvoid debates meant to convert you back—protect your energy.\n\nWork with a therapist familiar with religious trauma and family estrangement.\n\nDefine family broadly—friends and mentors can provide belonging.',
    support:
      `${SUPPORT}\n\nSeek therapy if rejection drives depression, self-harm thoughts, or complete isolation without any support network.`,
    related: [
      'How do I set boundaries with religious family?',
      'How do I cope with family estrangement?',
      'What do I do when I\'m losing faith in everything I used to believe?',
      'How do I rebuild identity after leaving my religion?',
      'How do I handle guilt about distancing from family?',
    ],
    schemaAnswer:
      'When family rejects you for questioning religion, process grief, build chosen community, set boundaries, and seek therapy—your spiritual journey deserves respect.',
    themes: ['Religious trauma', 'Family rejection', 'Boundaries', 'Grief'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'what-do-i-do-when-prayer-or-meditation-no-longer-b-186602-027': draft({
    question: 'What do I do when prayer or meditation no longer brings me peace?',
    slug: 'what-do-i-do-when-prayer-or-meditation-no-longer-b-186602-027',
    category: 'Spiritual Struggle / Existential Crisis',
    title: 'When Prayer or Meditation Stops Working',
    meta: 'Spiritual practices can stop soothing when beliefs shift or expectations tighten—experiment with new forms or take a break without abandoning inner peace altogether.',
    summary:
      'When prayer or meditation no longer brings peace, your spiritual needs may have evolved. Practices that fit one life stage may not fit another. Forcing old forms can increase agitation. Experiment with new approaches or secular mindfulness while honoring your changing inner life.',
    takeaways: [
      'Spiritual practices naturally evolve across life stages.',
      'Forcing old rituals can create pressure and emptiness.',
      'New forms—walking meditation, nature, creativity—may fit better now.',
      'A break from formal practice is allowed while you explore.',
    ],
    happening:
      'Deconstruction, trauma, or burnout may hollow out practices that once comforted you.\n\nExpecting instant peace can turn meditation into another performance.',
    help:
      'Release pressure to feel a specific way during practice.\n\nTry contemplative walking, gratitude lists, or silent time in nature.\n\nExplore different traditions or secular mindfulness approaches.\n\nNotice whether boredom, anger, or grief sits underneath—address that directly.\n\nTake an intentional break without shame if practice feels forced.\n\nTherapy can help separate spiritual questions from mental health symptoms.',
    support:
      `${SUPPORT}\n\nSeek therapy if loss of spiritual coping coincides with depression, hopelessness, or thoughts of self-harm.`,
    related: [
      'What do I do when I\'m losing faith in everything I used to believe?',
      'How do I start meditating when my mind will not stop?',
      'How do I find meaning after losing my faith?',
      'Is it normal to feel angry at God or religion?',
      'How do I calm my nervous system?',
    ],
    schemaAnswer:
      'When prayer or meditation no longer brings peace, release forced practice—experiment with new forms, take breaks, and explore what connection means for you now.',
    themes: ['Spiritual practice', 'Meditation', 'Deconstruction', 'Inner peace'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'what-does-it-mean-if-i-feel-more-at-peace-in-g7h1i4': draft({
    question: 'What does it mean if I feel more at peace in solitude than in community?',
    slug: 'what-does-it-mean-if-i-feel-more-at-peace-in-g7h1i4',
    category: 'Identity & Self-Worth',
    title: 'More Peace in Solitude Than Community',
    meta: 'Preferring solitude often reflects introversion or overstimulation—not antisocial pathology—balance alone time with selective meaningful connection.',
    summary:
      'Feeling more at peace alone than in groups is common and often reflects introversion, high sensitivity, or need for restoration after stimulating environments. It does not mean something is wrong. Balance solitude with intentional connection to protect long-term wellbeing.',
    takeaways: [
      'Preferring solitude is often temperament—not a flaw.',
      'Introverts recharge alone; social time can feel draining even when enjoyable.',
      'High sensitivity makes group settings overstimulating.',
      'Selective deep connection matters more than constant community.',
    ],
    happening:
      'After social events you may need long recovery time.\n\nPast social pain can make solitude feel safer than vulnerability in groups.',
    help:
      'Honor your need for alone time without labeling yourself broken.\n\nSchedule recovery after necessary social obligations.\n\nInvest in a few deep one-on-one relationships rather than large groups.\n\nNotice if isolation is restorative or avoidant—avoidance may need attention.\n\nCommunicate needs to partners and friends who misread solitude as rejection.\n\nSeek therapy if solitude is total withdrawal driven by fear or depression.',
    support:
      `${SUPPORT}\n\nSeek support if solitude becomes complete isolation accompanied by depression or inability to maintain any relationships.`,
    related: [
      'Is it normal to prefer being alone most of the time?',
      'How do I explain my need for alone time to my partner?',
      'How do I make friends as an introvert?',
      'How do I stop feeling lonely when I am alone?',
      'How do I balance solitude and connection?',
    ],
    schemaAnswer:
      'Feeling more at peace in solitude often reflects introversion or sensitivity—honor alone time while maintaining selective meaningful connections for long-term wellbeing.',
    themes: ['Introversion', 'Solitude', 'Sensitivity', 'Self-understanding'],
  }),
  'what-does-it-mean-if-i-feel-more-connected-to-t7u3v9': draft({
    question: 'What does it mean if I feel more connected to nature than to people?',
    slug: 'what-does-it-mean-if-i-feel-more-connected-to-t7u3v9',
    category: 'Identity & Self-Worth',
    title: 'More Connected to Nature Than People',
    meta: 'Strong nature connection often reflects temperament, values, or past relationship wounds—nature and human connection both support wellbeing.',
    summary:
      'Feeling more connected to nature than people is not uncommon. Nature offers unconditional presence without social complexity. Introverts, highly sensitive people, and those with relationship trauma may find restoration outdoors. Human connection still matters for long-term health.',
    takeaways: [
      'Nature connection is valid—not antisocial by definition.',
      'Natural settings often feel safer and less demanding than social ones.',
      'Relationship wounds can make human connection feel risky.',
      'Balance nature time with selective human relationships when possible.',
    ],
    happening:
      'Forests, water, or open sky may feel more regulating than conversation.\n\nYou may not have found humans who share your depth or pace yet.',
    help:
      'Accept nature as a legitimate source of meaning and calm.\n\nUse outdoor time intentionally for restoration—not only escape.\n\nExplore whether past relationship hurt drives preference for solitude in nature.\n\nSeek small human connections aligned with your values—hiking groups, environmental causes.\n\nNotice if total human withdrawal accompanies depression.\n\nTherapy helps when nature is the only place you feel alive.',
    support:
      `${SUPPORT}\n\nSeek therapy if nature is your only refuge and human avoidance fuels depression or isolation.`,
    related: [
      'What does it mean if I feel more at peace in solitude than in community?',
      'How do I heal from relationship trauma?',
      'How do I make friends as an adult?',
      'How do I manage social anxiety?',
      'How do I find my community?',
    ],
    schemaAnswer:
      'Feeling more connected to nature than people often reflects temperament or past wounds—honor nature as restorative while maintaining selective human connection when possible.',
    themes: ['Nature connection', 'Introversion', 'Relationships', 'Healing'],
  }),
  'what-does-it-mean-if-i-feel-more-connected-to-z5a2b7': draft({
    question: 'What does it mean if I feel more connected to my ancestors than to living people?',
    slug: 'what-does-it-mean-if-i-feel-more-connected-to-z5a2b7',
    category: 'Identity & Self-Worth',
    title: 'More Connected to Ancestors Than Living People',
    meta: 'Ancestral connection can reflect cultural tradition or spiritual meaning—explore whether idealization or current relationship wounds also play a role.',
    summary:
      'Feeling more connected to ancestors than living people can reflect cultural spiritual practice, appreciation for family history, or difficulty with contemporary relationships. Ancestral bonds can provide identity and meaning. Explore whether idealization or unresolved hurt with living people contributes.',
    takeaways: [
      'Ancestral connection is meaningful in many cultural traditions.',
      'Ancestors may feel safer than complicated living relationships.',
      'Idealized memory can omit the conflicts living people present.',
      'Balancing heritage honor with present relationships supports wholeness.',
    ],
    happening:
      'Rituals, genealogy, or spiritual practice may feel more grounding than family dinners.\n\nLiving relatives may carry active conflict ancestors no longer can.',
    help:
      'Honor ancestral connection as valid cultural and personal meaning.\n\nLearn family history with curiosity—not only idealized narratives.\n\nAsk whether living relationship pain drives preference for ancestral bonds.\n\nSeek community that shares ancestral or cultural practices if isolating.\n\nWork on one present relationship if withdrawal feels protective but lonely.\n\nTherapy helps if ancestral focus avoids grief or conflict with living family.',
    support:
      `${SUPPORT}\n\nSeek therapy if ancestral preoccupation replaces all living connection or accompanies depression and isolation.`,
    related: [
      'How do I cope with family estrangement?',
      'How do I heal from family trauma?',
      'What does it mean if I feel more connected to nature than to people?',
      'How do I find meaning in my cultural heritage?',
      'How do I set boundaries with family?',
    ],
    schemaAnswer:
      'Feeling more connected to ancestors than living people can reflect cultural tradition or relationship wounds—honor ancestral meaning while exploring present-day connection needs.',
    themes: ['Ancestral connection', 'Identity', 'Family', 'Spirituality'],
    gaps: ['No dedicated cultural-spiritual clinical source cited; verify framing with editorial standards.'],
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
  'reports/enrichment-corpus/draft-answers/batch-26-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-26-drafts.json`);
