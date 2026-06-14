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
  readFileSync('reports/enrichment-corpus/batches/batch-16-input.json', 'utf8'),
);

const contentBySlug = {
  'how-do-i-know-if-im-gay-straight-or-some-186032-013': draft({
    question: 'How do I know if I\'m gay, straight, or something else?',
    slug: 'how-do-i-know-if-im-gay-straight-or-some-186032-013',
    category: 'Teens & Identity',
    title: 'Understanding Your Sexual Orientation',
    meta: 'Sexual orientation can take time to understand. There is no rush to label yourself—exploring feelings at your own pace is valid.',
    summary:
      'Figuring out sexual orientation is personal and often unfolds over time. You might feel attraction to one gender, multiple genders, or notice shifts as you grow. Labels can help some people feel seen and confuse others—and both responses are normal.',
    takeaways: [
      'There is no deadline for understanding your orientation.',
      'Attraction, identity, and labels do not always align immediately.',
      'Sexuality can be fluid; what you discover about yourself is valid.',
      'Trusted adults, counselors, or LGBTQ+ communities can offer support.',
    ],
    happening:
      'You may feel confused by attractions that do not match what you expected.\n\nPressure to pick a label—or fear of being wrong later—can make exploration feel stressful.',
    help:
      'Notice attractions and feelings without judging them as right or wrong.\n\nTake your time; you do not owe anyone a fixed answer today.\n\nTalk with a trusted adult, school counselor, or LGBTQ+ support group if safe.\n\nRemember that questioning itself is healthy, not a problem to fix.\n\nUse language that feels comfortable now, knowing it can evolve.',
    support:
      `${SUPPORT}\n\nSeek affirming counseling if orientation questions cause severe distress, isolation, or safety concerns at home.`,
    related: [
      'How do I know if I\'m transgender or just going through a phase?',
      'How do I come out to my family?',
      'How do I deal with bullying at school?',
      'How do I build self-esteem as a teen?',
      'How do I find LGBTQ+ affirming support?',
    ],
    schemaAnswer:
      'Understand orientation by noticing attractions without pressure, taking time before labeling, seeking affirming support, and accepting that identity can evolve.',
    themes: ['Sexual orientation', 'Identity exploration', 'LGBTQ+ teens', 'Self-discovery'],
    notes: 'Affirming tone; no pathologizing; avoid prescribing labels.',
  }),
  'how-do-i-know-if-im-having-a-panic-attack-184730-067': draft({
    question: 'How do I know if I\'m having a panic attack or just anxiety?',
    slug: 'how-do-i-know-if-im-having-a-panic-attack-184730-067',
    category: 'Anxiety & Stress',
    title: 'Panic Attack vs General Anxiety',
    meta: 'Panic attacks peak quickly with intense physical symptoms; general anxiety is often milder but more persistent. Both are treatable.',
    summary:
      'Panic attacks and general anxiety share overlap but feel different in intensity and timing. Panic often arrives suddenly, peaks within minutes, and can include racing heart, shortness of breath, or fear of losing control. General anxiety tends to build more gradually and linger.',
    takeaways: [
      'Panic attacks usually peak within minutes then subside.',
      'General anxiety is often less intense but more persistent.',
      'Both can include physical symptoms; panic feels more sudden and severe.',
      'Tracking symptoms helps clinicians choose effective treatment.',
    ],
    happening:
      'Sudden intense fear with physical symptoms may feel like a medical emergency.\n\nOngoing worry, tension, or restlessness may feel like your baseline rather than an acute episode.',
    help:
      'During panic: slow breathing, grounding (name five things you see), remind yourself symptoms will pass.\n\nTrack when symptoms start, how long they last, and possible triggers.\n\nLearn the difference so you can describe experiences accurately to a clinician.\n\nReduce caffeine and sleep debt when anxiety is high.\n\nAvoid self-diagnosis—describe symptoms to a professional.',
    support:
      `${SUPPORT}\n\nSeek urgent care for chest pain you have not evaluated, or panic that prevents daily functioning.`,
    related: [
      'How do I know if my anxiety is normal or if I need help?',
      'How do I calm down during a panic attack?',
      'How do I manage anxiety without medication?',
      'How do I know if I have anxiety or if I\'m just stressed?',
      'How do I find a therapist for anxiety?',
    ],
    schemaAnswer:
      'Distinguish panic attacks (sudden, intense, short peaks) from general anxiety (more persistent, milder) and seek professional help when symptoms impair daily life.',
    themes: ['Panic attacks', 'Anxiety', 'Physical symptoms', 'Coping skills'],
    refs: [ANXIETY, NIMH],
    notes: 'No medication advice; note ER for unexplained chest pain.',
  }),
  'how-do-i-know-if-im-in-a-codependent-relationship': draft({
    question: 'How do I know if I\'m in a codependent relationship?',
    slug: 'how-do-i-know-if-im-in-a-codependent-relationship',
    category: 'Relationships & Communication',
    title: 'Signs of a Codependent Relationship',
    meta: 'Codependency means over-focusing on another person\'s needs while losing your own boundaries, identity, and well-being.',
    summary:
      'Codependent patterns often feel like love or loyalty but leave you responsible for another person\'s emotions, choices, or chaos. Your mood may rise and fall with theirs, and saying no may feel impossible even when you are exhausted.',
    takeaways: [
      'Your identity and mood may feel fused with your partner\'s state.',
      'Excessive caretaking can look like love but erases your needs.',
      'People-pleasing and fear of conflict often keep the pattern going.',
      'Recovery involves boundaries, self-focus, and often therapy or support groups.',
    ],
    happening:
      'You may feel responsible for fixing their problems or managing their emotions.\n\nResentment builds while you struggle to prioritize your own needs.',
    help:
      'Notice when you lose yourself in their crisis or mood.\n\nPractice small nos and tolerating their discomfort without rescuing.\n\nRebuild hobbies, friendships, and decisions that reflect your values.\n\nStop covering consequences that belong to them.\n\nConsider therapy or Al-Anon-style support if addiction or chaos is involved.',
    support:
      `${SUPPORT}\n\nSeek therapy if codependency coexists with abuse, addiction, or severe depression.`,
    related: [
      'How do I set boundaries in relationships?',
      'How do I know if my relationship is toxic?',
      'How do I stop people-pleasing?',
      'How do I rebuild my identity after a relationship?',
      'How do I find a couples therapist?',
    ],
    schemaAnswer:
      'Recognize codependency through fused moods, over-caretaking, and people-pleasing; rebuild boundaries, separate responsibilities, and seek therapy or support groups.',
    themes: ['Codependency', 'Boundaries', 'Caretaking', 'Relationship patterns'],
    notes: 'Avoid stigmatizing language; link to support groups without endorsing one program.',
  }),
  'how-do-i-know-if-im-in-a-toxic-relations-190219-007': draft({
    question: 'How do I know if I\'m in a toxic relationship or just going through a rough patch?',
    slug: 'how-do-i-know-if-im-in-a-toxic-relations-190219-007',
    category: 'Relationships & Divorce',
    title: 'Toxic Relationship vs a Rough Patch',
    meta: 'Rough patches are temporary with underlying respect; toxic patterns involve consistent harm, control, or disrespect.',
    summary:
      'Most relationships hit stressful seasons. Rough patches usually include mutual effort, accountability, and respect underneath the conflict. Toxic dynamics show repeating harm—control, contempt, manipulation, or fear—even when things look calm on the surface.',
    takeaways: [
      'Look at patterns over time, not one bad week.',
      'Rough patches improve with mutual effort; toxicity often worsens or cycles.',
      'Walking on eggshells or losing yourself are serious warning signs.',
      'Trust your body\'s signals about safety and self-worth.',
    ],
    happening:
      'You may hope stress explains everything while dreading time together.\n\nFriends may express concern about changes in your mood or isolation.',
    help:
      'List recurring behaviors: respect, accountability, and repair vs blame and harm.\n\nNotice whether problems resolve or repeat in the same shape.\n\nTalk with a therapist or trusted friend for outside perspective.\n\nSeparate love from tolerating consistent disrespect.\n\nPrioritize safety if control, threats, or violence appear.',
    support:
      `${SUPPORT}\n\nIf you feel unsafe, contact the National Domestic Violence Hotline (1-800-799-7233) or local emergency services.`,
    related: [
      'How do I know if my relationship is toxic?',
      'How do I know when it\'s time to end a relationship?',
      'How do I know if my relationship is worth fighting for?',
      'How do I rebuild after leaving a toxic relationship?',
      'How do I find a therapist for relationship issues?',
    ],
    schemaAnswer:
      'Compare rough patches (temporary stress with respect and repair) to toxic patterns (ongoing harm, control, or fear) and prioritize safety when abuse is present.',
    themes: ['Toxic relationships', 'Rough patches', 'Relationship safety', 'Patterns'],
    flags: ['relationship-safety'],
    notes: 'Include DV hotline for safety; no legal advice.',
  }),
  'how-do-i-know-if-im-in-a-toxic-relationship-184730-020': draft({
    question: 'How do I know if I\'m in a toxic relationship?',
    slug: 'how-do-i-know-if-im-in-a-toxic-relationship-184730-020',
    category: 'Relationships & Divorce',
    title: 'How to Recognize a Toxic Relationship',
    meta: 'Toxic relationships involve consistent disrespect, manipulation, control, or emotional harm—not just occasional conflict.',
    summary:
      'Toxic dynamics often develop slowly and get mixed with good moments, which makes them hard to name. Consistent criticism, control, gaslighting, isolation, or fear are signs the relationship may be harming you—not just struggling.',
    takeaways: [
      'Occasional conflict differs from ongoing contempt or control.',
      'Gaslighting and isolation are common toxic tactics.',
      'You may feel worse about yourself over time, not better.',
      'Love alone does not justify consistent harm.',
    ],
    happening:
      'Positive moments may keep you hoping while harmful patterns repeat.\n\nYou might minimize behavior because others see a charming partner.',
    help:
      'Track patterns: criticism, control, jealousy, boundary violations.\n\nNotice if you edit yourself to avoid anger or punishment.\n\nBelieve concerned friends who see changes in you.\n\nDocument incidents if safety planning becomes necessary.\n\nConsult a therapist experienced in relationship abuse dynamics.',
    support:
      `${SUPPORT}\n\nContact 1-800-799-7233 (National Domestic Violence Hotline) if you fear for your safety.`,
    related: [
      'How do I know if I\'m in a toxic relationship or just going through a rough patch?',
      'How do I know when it\'s time to end a relationship?',
      'How do I leave an abusive relationship safely?',
      'How do I rebuild self-esteem after toxic love?',
      'How do I trust again after a bad relationship?',
    ],
    schemaAnswer:
      'Identify toxic relationships through patterns of disrespect, control, gaslighting, and isolation; prioritize safety and professional support when harm is present.',
    themes: ['Toxic relationships', 'Emotional abuse', 'Gaslighting', 'Safety'],
    flags: ['relationship-safety'],
    notes: 'DV hotline included; distinguish conflict from abuse patterns.',
  }),
  'how-do-i-know-if-im-ready-to-date-again-181083-088': draft({
    question: 'How do I know if I\'m ready to date again?',
    slug: 'how-do-i-know-if-im-ready-to-date-again-181083-088',
    category: 'Relationships & Divorce',
    title: 'Knowing When You\'re Ready to Date Again',
    meta: 'Readiness often means curiosity about new people—not filling a void, proving you\'re over your ex, or avoiding being alone.',
    summary:
      'Dating too soon can mean using new connections to numb grief or provoke an ex. Readiness often looks like genuine interest in meeting someone new, relative peace with being single, and the ability to mention your ex without being hijacked by intense emotion.',
    takeaways: [
      'Excitement about new people beats dating to fill emptiness.',
      'Processing major breakup emotions first protects new partners.',
      'Talking about your ex calmly is one sign of readiness.',
      'Rebound motives—jealousy, loneliness, revenge—signal more healing time.',
    ],
    happening:
      'You may feel pressure from friends or apps to "get back out there."\n\nLoneliness can mimic readiness when the wound is still fresh.',
    help:
      'Ask whether you want connection or distraction from pain.\n\nNotice if you compare every date to your ex.\n\nRebuild routines, friendships, and identity outside romance first.\n\nDate slowly; you do not owe anyone instant commitment.\n\nConsider therapy if grief or divorce feels stuck.',
    support:
      `${SUPPORT}\n\nSeek therapy if breakup grief prevents functioning for many months.`,
    related: [
      'How do I get over a breakup when I still love them?',
      'How do I know when I am ready to date again after divorce?',
      'How do I stop thinking about my ex?',
      'How do I rebuild my life after divorce?',
      'How do I set healthy boundaries while dating?',
    ],
    schemaAnswer:
      'Gauge dating readiness by genuine interest in new people, processed grief, comfort being single, and dating motives that are not rebound-driven.',
    themes: ['Dating after breakup', 'Readiness', 'Grief', 'Rebounds'],
    notes: 'Avoid prescribing timeline; no "you should wait X months."',
  }),
  'how-do-i-know-if-im-ready-to-reduce-my-social-q6r9s4': draft({
    question: 'How do I know if I\'m ready to reduce my social media use?',
    slug: 'how-do-i-know-if-im-ready-to-reduce-my-social-q6r9s4',
    category: 'Anxiety & Stress',
    title: 'Ready to Reduce Social Media Use?',
    meta: 'Readiness often shows up as consistent negative impact, motivation for change, and alternatives that fill the gap social media currently fills.',
    summary:
      'Trying to cut back before you are ready often backfires. Signs of readiness include regularly feeling worse after scrolling, noticing social media crowding out sleep or relationships, and wanting change for your own reasons—not only because others said you should.',
    takeaways: [
      'Consistent worse-after-scrolling feelings suggest change may help.',
      'Internal motivation predicts sustainable change better than shame.',
      'Alternatives for boredom or connection make reduction easier.',
      'Small experiments beat abrupt cold-turkey when readiness is shaky.',
    ],
    happening:
      'You may know social media drains you but reach for it automatically.\n\nFear of missing out can conflict with desire for more offline life.',
    help:
      'Track mood before and after sessions for a week.\n\nName what social media gives you (connection, escape) and plan substitutes.\n\nStart with one boundary: no phone in bed, app time limits, or delete one app.\n\nTell a friend your goal for accountability.\n\nAdjust pace—reduction works best as experiment, not punishment.',
    support:
      `${SUPPORT}\n\nSeek help if social media use coexists with severe depression, self-harm urges, or eating-disorder triggers.`,
    related: [
      'How do I take a social media break for my mental health?',
      'How do I stop comparing myself to others online?',
      'How do I manage FOMO?',
      'How do I improve my sleep hygiene?',
      'How do I build real-life friendships?',
    ],
    schemaAnswer:
      'Assess readiness by tracking negative impacts, building internal motivation, planning offline alternatives, and starting with small sustainable boundaries.',
    themes: ['Social media', 'Digital wellness', 'Behavior change', 'Self-awareness'],
    notes: 'No detox cure claims; flag ED trigger overlap in support section.',
  }),
  'how-do-i-know-if-im-transgender-or-just--184729-007': draft({
    question: 'How do I know if I\'m transgender or just going through a phase?',
    slug: 'how-do-i-know-if-im-transgender-or-just--184729-007',
    category: 'Teens & Identity',
    title: 'Gender Questioning: Transgender or a Phase?',
    meta: 'Gender exploration is normal. Persistent mismatch between assigned gender and inner sense of self deserves affirming support—not rush or dismissal.',
    summary:
      'Questioning gender is part of development for many teens. If your assigned gender consistently feels wrong and causes distress, you may be transgender—but labels can wait. Exploration is not harmful; shame and isolation often are.',
    takeaways: [
      'There is no deadline to declare a gender identity.',
      'Persistent gender dysphoria differs from temporary curiosity.',
      'Trusted adults and affirming counselors can help you explore safely.',
      'Your journey is valid whether it leads to transition or not.',
    ],
    happening:
      'You may fear being "wrong later" or that adults will dismiss your feelings as a phase.\n\nDistress about body, pronouns, or expectations may feel constant rather than fleeting.',
    help:
      'Notice whether discomfort is persistent and tied to gender expectations.\n\nJournal feelings without forcing a permanent label.\n\nSeek affirming therapy or LGBTQ+ youth groups when safe.\n\nLearn about gender diversity beyond binary options.\n\nPrioritize safety if home is not affirming—school counselors or hotlines can help plan.',
    support:
      `${SUPPORT}\n\nContact The Trevor Project (1-866-488-7386) if you need LGBTQ+ youth crisis support.`,
    related: [
      'How do I know if I\'m gay, straight, or something else?',
      'How do I talk to my parents about my gender identity?',
      'How do I deal with dysphoria as a teen?',
      'How do I find gender-affirming therapy?',
      'How do I stay safe if my family rejects me?',
    ],
    schemaAnswer:
      'Explore gender by noticing persistent vs fleeting feelings, seeking affirming support, taking time before labeling, and prioritizing safety when home is not accepting.',
    themes: ['Gender identity', 'Transgender youth', 'Dysphoria', 'Affirming care'],
    flags: ['lgbtq-youth-safety'],
    notes: 'Affirming; include Trevor Project; no medical transition instructions.',
  }),
  'how-do-i-know-if-im-truly-healing-or-just-getting-better-at-hiding-my-pain-final-1000': draft({
    question: 'How do I know if I\'m truly healing or just getting better at hiding my pain?',
    slug: 'how-do-i-know-if-im-truly-healing-or-just-getting-better-at-hiding-my-pain-final-1000',
    category: 'Identity & Self-Worth',
    title: 'True Healing vs Hiding Pain',
    meta: 'Real healing usually expands emotional range and connection; hiding pain often looks functional but feels hollow or disconnected.',
    summary:
      'Asking this question shows courage. Healing tends to increase your capacity to feel and express emotions safely, deepen relationships, and bring steadier self-compassion—not just a polished mask that performs okayness while pain stays untouched.',
    takeaways: [
      'Healing often widens emotional range; suppression narrows it.',
      'Authentic relationships deepen when healing is real.',
      'Performing "fine" can exhaust you even when life looks stable.',
      'Therapy helps distinguish coping from integration.',
    ],
    happening:
      'Outsiders may praise your strength while you feel empty inside.\n\nHard emotions may only surface alone, or not at all.',
    help:
      'Notice whether you can feel sadness, anger, or fear without shutting down.\n\nCheck if friends know the real you—not just the composed version.\n\nTrack whether coping skills soothe or mainly conceal.\n\nAllow small honest conversations about struggle.\n\nDiscuss this question openly with a therapist.',
    support:
      `${SUPPORT}\n\nSeek therapy if emotional numbness, dissociation, or hidden pain fuels self-harm or isolation.`,
    related: [
      'How do I know if therapy is working?',
      'How do I stop suppressing my emotions?',
      'How do I build emotional awareness?',
      'How do I practice self-compassion?',
      'How do I find a therapist who feels safe?',
    ],
    schemaAnswer:
      'Tell healing from hiding by checking emotional authenticity, relationship depth, sustainable self-compassion, and whether coping integrates pain rather than only concealing it.',
    themes: ['Healing', 'Emotional suppression', 'Self-awareness', 'Therapy progress'],
    notes: 'Validate the question; avoid toxic positivity.',
  }),
  'how-do-i-know-if-my-anxiety-is-normal-or-184730-038': draft({
    question: 'How do I know if my anxiety is normal or if I need help?',
    slug: 'how-do-i-know-if-my-anxiety-is-normal-or-184730-038',
    category: 'Anxiety & Stress',
    title: 'Normal Anxiety vs Needing Help',
    meta: 'Normal anxiety is proportionate and temporary; seek help when worry persists, feels disproportionate, or blocks daily life.',
    summary:
      'Anxiety before exams or during stress is common. It may be time for professional support when worry persists for weeks, feels much bigger than the situation, or stops you from working, connecting, or caring for yourself.',
    takeaways: [
      'Duration, intensity, and daily impact matter more than having anxiety at all.',
      'Avoidance and physical symptoms can signal a treatable disorder.',
      'Wondering if you need help often means support would help.',
      'Anxiety disorders are common and respond well to treatment.',
    ],
    happening:
      'You may tell yourself everyone worries while secretly avoiding more each week.\n\nSleep, digestion, or concentration may suffer alongside mental strain.',
    help:
      'Rate anxiety 1–10 daily for two weeks to see patterns.\n\nList activities you avoid because of fear or worry.\n\nTry basic coping: sleep, movement, limited caffeine, grounding.\n\nDescribe symptoms to a primary care clinician or therapist.\n\nTreat seeking help as self-awareness, not weakness.',
    support:
      `${SUPPORT}\n\nSeek evaluation if anxiety includes panic attacks, obsessive loops, or suicidal thoughts.`,
    related: [
      'How do I know if I have anxiety or if I\'m just stressed?',
      'How do I find a therapist for anxiety?',
      'How do I manage worry without avoiding life?',
      'How do I know if I\'m having a panic attack or just anxiety?',
      'How do I talk to my doctor about mental health?',
    ],
    schemaAnswer:
      'Normal anxiety is situational and manageable; seek help when symptoms are persistent, disproportionate, or impair work, relationships, or self-care.',
    themes: ['Anxiety', 'When to seek help', 'Avoidance', 'Treatment'],
    refs: [ANXIETY, NIMH],
    notes: 'No medication recommendations; encourage professional evaluation.',
  }),
  'how-do-i-know-if-my-marriage-is-worth-saving': draft({
    question: 'How do I know if my marriage is worth saving?',
    slug: 'how-do-i-know-if-my-marriage-is-worth-saving',
    category: 'Relationships & Communication',
    title: 'Is Your Marriage Worth Saving?',
    meta: 'Saving a marriage usually requires mutual commitment, addressable problems, and safety—not just love or history alone.',
    summary:
      'This decision is deeply personal. Marriages with mutual willingness to change, underlying respect, and no ongoing abuse have better odds than those where one partner is checked out or harm is normalized. Your safety always comes first.',
    takeaways: [
      'Both partners\' willingness to work matters for repair.',
      'Abuse, untreated addiction, or contempt change the calculus.',
      'Love and history alone do not guarantee a healthy future.',
      'Couples therapy helps clarify options—not force reconciliation.',
    ],
    happening:
      'You may swing between hope and exhaustion after repeated cycles.\n\nChildren, finances, or faith may complicate an already unclear picture.',
    help:
      'Assess safety first—physical, emotional, financial, sexual.\n\nAsk whether core issues are changeable with effort and skilled help.\n\nNotice contempt vs conflict that still includes respect.\n\nTry discernment counseling if one partner is unsure.\n\nSeparate guilt from clarity about what you need long term.',
    support:
      `${SUPPORT}\n\nIf abuse is present, prioritize safety planning with a domestic violence advocate before couples work.`,
    related: [
      'How do I know if my relationship is worth fighting for?',
      'How do I know when it\'s time to end a relationship?',
      'How do I find a marriage counselor?',
      'How do I rebuild trust after infidelity?',
      'How do I coparent during separation?',
    ],
    schemaAnswer:
      'Evaluate a marriage by mutual commitment, safety, respect, and whether problems are addressable—with professional guidance and safety planning when abuse is present.',
    themes: ['Marriage', 'Discernment', 'Couples therapy', 'Safety'],
    flags: ['relationship-safety'],
    notes: 'No couples therapy recommendation when abuse present; safety first.',
  }),
  'how-do-i-know-if-my-relationship-is-emotional-177941-005': draft({
    question: 'How do I know if my relationship is emotionally healthy?',
    slug: 'how-do-i-know-if-my-relationship-is-emotional-177941-005',
    category: 'Relationships',
    title: 'Signs of an Emotionally Healthy Relationship',
    meta: 'Healthy love includes respect, honest communication, boundaries, and room to grow as individuals—not fear or constant self-editing.',
    summary:
      'Emotional health in a relationship feels like safety to be yourself, disagree without punishment, and pursue your life outside the partnership. You should not need to hide parts of who you are to keep peace.',
    takeaways: [
      'Mutual respect beats constant harmony performed through silence.',
      'Boundaries should be honored, not punished.',
      'Individual growth and friendships remain encouraged.',
      'Intimacy requires consent and emotional safety.',
    ],
    happening:
      'You may confuse intensity with closeness or mistake anxiety for passion.\n\nApologizing for normal needs can signal an unhealthy balance.',
    help:
      'Check: Can you say no without retaliation?\n\nNotice whether conflicts lead to repair or recurring contempt.\n\nMaintain friendships and interests outside the relationship.\n\nShare appreciation and needs directly, not only through hints.\n\nCompare how you feel about yourself solo vs in the relationship.',
    support:
      `${SUPPORT}\n\nSeek couples or individual therapy if fear, control, or emotional abuse appear.`,
    related: [
      'How do I know if my relationship is healthy?',
      'How do I improve communication with my partner?',
      'How do I set boundaries in relationships?',
      'How do I know if my relationship is toxic?',
      'How do I rebuild trust after betrayal?',
    ],
    schemaAnswer:
      'Emotionally healthy relationships feature respect, honest communication, honored boundaries, individual growth, and safety to disagree without fear.',
    themes: ['Emotional health', 'Boundaries', 'Communication', 'Respect'],
    notes: 'Category preserved as Relationships from input.',
  }),
  'how-do-i-know-if-my-relationship-is-heal-186032-029': draft({
    question: 'How do I know if my relationship is healthy?',
    slug: 'how-do-i-know-if-my-relationship-is-heal-186032-029',
    category: 'Relationships & Communication',
    title: 'How to Tell If a Relationship Is Healthy',
    meta: 'Healthy relationships combine trust, respect, honest communication, and support for each person\'s growth.',
    summary:
      'Healthy love is not conflict-free—it is conflict-safe. You should feel valued, able to express needs, and free to maintain friendships and goals. Constant criticism, control, or walking on eggshells are red flags.',
    takeaways: [
      'Trust and respect underpin healthy conflict.',
      'Both partners should feel safe expressing needs.',
      'Isolation from friends or family is a warning sign.',
      'Violence or threats require immediate safety planning.',
    ],
    happening:
      'Good moments may mask patterns of criticism or control.\n\nYou might feel responsible for your partner\'s moods or choices.',
    help:
      'List how disagreements are handled—repair vs punishment.\n\nNotice whether you retain outside support systems.\n\nCheck for reciprocity in effort and care.\n\nTrust gut feelings of dread before seeing them.\n\nUse relationship check-ins: Are we growing or shrinking?',
    support:
      `${SUPPORT}\n\nContact 1-800-799-7233 if threats, violence, or coercive control are present.`,
    related: [
      'How do I know if my relationship is emotionally healthy?',
      'How do I know if my relationship is toxic?',
      'How do I improve communication with my partner?',
      'How do I set boundaries without starting a fight?',
      'How do I find couples counseling?',
    ],
    schemaAnswer:
      'Healthy relationships show trust, respectful communication, supported individuality, and constructive conflict—without control, isolation, or fear.',
    themes: ['Healthy relationships', 'Trust', 'Communication', 'Red flags'],
    flags: ['relationship-safety'],
    notes: 'Overlap with emotional-health slug; cross-link in review.',
  }),
  'how-do-i-know-if-my-relationship-is-toxic': draft({
    question: 'How do I know if my relationship is toxic?',
    slug: 'how-do-i-know-if-my-relationship-is-toxic',
    category: 'Relationships & Communication',
    title: 'Is My Relationship Toxic?',
    meta: 'Toxic patterns include chronic criticism, control, gaslighting, and boundary violations—not just one hard argument.',
    summary:
      'Toxicity is about patterns: put-downs, manipulation, jealousy that isolates you, or ignoring your no. When the relationship consistently erodes self-esteem and safety, the label matters less than protecting your well-being.',
    takeaways: [
      'Patterns over time reveal toxicity more than single fights.',
      'Gaslighting makes you doubt your own perception.',
      'Extreme jealousy and isolation are serious warning signs.',
      'Leaving or getting help is strength, not failure.',
    ],
    happening:
      'You may make excuses because the person is not "all bad."\n\nShame can keep you silent while symptoms worsen.',
    help:
      'Write recurring behaviors without minimizing.\n\nAsk trusted friends what they have observed.\n\nLearn names for tactics: gaslighting, love-bombing, stonewalling.\n\nCreate a safety plan if threats or violence exist.\n\nWork with a therapist on exit or boundary plans.',
    support:
      `${SUPPORT}\n\nNational Domestic Violence Hotline: 1-800-799-7233 (call/chat) for safety planning.`,
    related: [
      'How do I know if I\'m in a toxic relationship?',
      'How do I leave a relationship safely?',
      'How do I rebuild self-esteem after toxic love?',
      'How do I know when it\'s time to end a relationship?',
      'How do I trust my judgment again?',
    ],
    schemaAnswer:
      'Identify toxicity through chronic criticism, control, gaslighting, and boundary violations; prioritize safety and support when harm is ongoing.',
    themes: ['Toxic relationships', 'Gaslighting', 'Boundaries', 'Safety'],
    flags: ['relationship-safety'],
    notes: 'Near-duplicate slugs in corpus; ensure cross-linking at publish.',
  }),
  'how-do-i-know-if-my-relationship-is-wort-181288-011': draft({
    question: 'How do I know if my relationship is worth fighting for?',
    slug: 'how-do-i-know-if-my-relationship-is-wort-181288-011',
    category: 'Relationships & Divorce',
    title: 'When a Relationship Is Worth Fighting For',
    meta: 'Fight for relationships with mutual effort, respect, and shared values—not when abuse or one-sided work dominates.',
    summary:
      'A relationship may be worth fighting for when both people commit to repair, respect remains in conflict, and core values align enough to build on. It is likely not when abuse, chronic contempt, or refusal to address serious issues persists.',
    takeaways: [
      'Mutual commitment to change is essential for repair.',
      'Respect during conflict signals remaining foundation.',
      'Abuse or one-sided effort are reasons to pause fighting for it.',
      'Discernment counseling can clarify next steps.',
    ],
    happening:
      'Hope and sunk cost may keep you trying after your partner has stopped.\n\nFriends may urge you to leave or stay without seeing the full picture.',
    help:
      'List problems and whether both partners own their part.\n\nAssess respect: Is contempt replacing care?\n\nCompare shared goals for lifestyle, fidelity, family, money.\n\nTry structured therapy before major decisions when safe.\n\nHonor limits on how long you will try without change.',
    support:
      `${SUPPORT}\n\nDo not pursue couples therapy when abuse is active—seek individual safety support first.`,
    related: [
      'How do I know if my marriage is worth saving?',
      'How do I know when it\'s time to end a relationship?',
      'How do I find discernment counseling?',
      'How do I rebuild after repeated breakups?',
      'How do I communicate needs without ultimatums?',
    ],
    schemaAnswer:
      'A relationship is worth fighting for with mutual effort, respect, aligned values, and safety—not when abuse or one-sided work defines the bond.',
    themes: ['Relationship repair', 'Commitment', 'Values', 'Discernment'],
    flags: ['relationship-safety'],
    notes: 'Distinguish from marriage-worth-saving slug; couples therapy caveat for abuse.',
  }),
  'how-do-i-know-if-my-spiritual-experiences-are-p5q9r3': draft({
    question: 'How do I know if my spiritual experiences are genuine or just wishful thinking?',
    slug: 'how-do-i-know-if-my-spiritual-experiences-are-p5q9r3',
    category: 'Identity & Self-Worth',
    title: 'Discerning Genuine Spiritual Experiences',
    meta: 'Look at lasting impact, integration, and whether experiences increase compassion and grounded living—not just ego comfort.',
    summary:
      'Healthy discernment honors both mystery and reality-testing. Experiences that deepen compassion, ethical behavior, and integration into daily life may be genuinely transformative; those that mainly flatter ego or bypass pain warrant caution.',
    takeaways: [
      'Fruits over time matter more than intensity in the moment.',
      'Genuine experiences often increase connection and service.',
      'Wishful thinking may avoid hard truths or inflate specialness.',
      'Community and mentors can help ground interpretation.',
    ],
    happening:
      'Culture may swing between cynicism and spiritual hype.\n\nYou may fear being naive or dismiss something meaningful.',
    help:
      'Ask: Did this experience change how I treat myself and others?\n\nNotice whether insights hold up in ordinary life, not just retreats.\n\nStay curious with teachers or communities that allow questions.\n\nBeware leaders who demand uncritical belief or isolate you.\n\nJournal experiences and revisit after time passes.',
    support:
      `${SUPPORT}\n\nSeek therapy if spiritual obsession, mania, or psychosis symptoms appear—urgent evaluation may be needed.`,
    related: [
      'How do I integrate spiritual experiences into daily life?',
      'How do I find healthy spiritual community?',
      'How do I know if I\'m experiencing spiritual bypassing?',
      'How do I balance faith and mental health care?',
      'How do I set boundaries with spiritual leaders?',
    ],
    schemaAnswer:
      'Discern spiritual experiences by their lasting impact on compassion, ethics, and daily integration—and seek grounded community and mental health support when needed.',
    themes: ['Spirituality', 'Discernment', 'Integration', 'Community'],
    gaps: ['Limited peer-reviewed sources on subjective spiritual experience; grounded on general mental health integration principles.'],
    notes: 'Respect diverse beliefs; flag mania/psychosis overlap; no endorsement of specific traditions.',
  }),
  'how-do-i-know-if-my-stress-levels-are-unhealthy': draft({
    question: 'How do I know if my stress levels are unhealthy?',
    slug: 'how-do-i-know-if-my-stress-levels-are-unhealthy',
    category: 'Anxiety & Stress',
    title: 'When Stress Becomes Unhealthy',
    meta: 'Short-term stress is normal; chronic overwhelm with body, mood, and behavior changes signals unhealthy levels.',
    summary:
      'Some stress motivates action. Unhealthy stress persists, feels unmanageable, and shows up in headaches, sleep loss, irritability, withdrawal, or reliance on alcohol or other coping that harms you.',
    takeaways: [
      'Duration and intensity distinguish helpful from harmful stress.',
      'Physical symptoms often appear before you name overwhelm.',
      'Behavior changes—withdrawal, substance use—are warning signs.',
      'Early support prevents burnout and health crises.',
    ],
    happening:
      'You may normalize running on empty because others seem fine.\n\nMinor tasks feel huge when your nervous system is overloaded.',
    help:
      'Track stress triggers and body signals for two weeks.\n\nAudit sleep, nutrition, movement, and downtime honestly.\n\nSay no to one nonessential commitment this week.\n\nUse brief resets: walks, breathing, boundaries on after-hours work.\n\nTell a clinician if symptoms persist despite self-care.',
    support:
      `${SUPPORT}\n\nSeek urgent care for chest pain, suicidal thoughts, or stress-related health emergencies.`,
    related: [
      'How do I know if I\'m experiencing burnout?',
      'How do I manage stress at work?',
      'How do I set boundaries when overwhelmed?',
      'How do I improve sleep when stressed?',
      'How do I recover from chronic stress?',
    ],
    schemaAnswer:
      'Unhealthy stress is chronic, impairing, and shows in body, mood, and behavior—seek support when self-care does not restore functioning.',
    themes: ['Stress', 'Burnout', 'Physical health', 'Boundaries'],
    notes: 'No substance prescribing; encourage medical eval for chest pain.',
  }),
  'how-do-i-know-if-my-therapist-is-right-for-me-s5t9u1': draft({
    question: 'How do I know if my therapist is right for me?',
    slug: 'how-do-i-know-if-my-therapist-is-right-for-me-s5t9u1',
    category: 'Identity & Self-Worth',
    title: 'Is Your Therapist the Right Fit?',
    meta: 'Good fit feels safe, collaborative, and respectful—even when therapy is hard. It is okay to switch if you are not progressing or feel judged.',
    summary:
      'Therapeutic fit affects outcomes as much as method. You should feel heard, not shamed; trust should grow enough to be honest. Stagnation after honest effort may mean a different therapist or approach could help.',
    takeaways: [
      'Safety and respect are non-negotiable in therapy.',
      'Progress is often gradual and non-linear—but not absent forever.',
      'Cultural and identity fit matter for marginalized clients.',
      'Switching therapists is normal, not rude.',
    ],
    happening:
      'You may worry about offending them or starting over.\n\nSessions might feel performative if you hide key details.',
    help:
      'Ask: Do I feel judged when I share hard truths?\n\nNotice whether goals are clear and revisited.\n\nRaise fit concerns directly—skilled therapists welcome feedback.\n\nGive new approaches several sessions before deciding.\n\nInterview other providers if respect or progress is lacking.',
    support:
      `${SUPPORT}\n\nReport boundary violations or abuse by a provider to their licensing board and seek a new clinician immediately.`,
    related: [
      'How do I know if therapy is working?',
      'How do I find a therapist who understands trauma?',
      'How do I find an LGBTQ+ affirming therapist?',
      'How do I prepare for my first therapy session?',
      'How do I switch therapists without guilt?',
    ],
    schemaAnswer:
      'Evaluate therapist fit by safety, feeling heard, cultural competence, collaborative goals, and gradual progress—it is okay to change providers when fit is poor.',
    themes: ['Therapist fit', 'Therapy navigation', 'Trust', 'Cultural competence'],
    notes: 'Include reporting boundary violations; no provider endorsement.',
  }),
  'how-do-i-know-if-therapy-is-working-186032-042': draft({
    question: 'How do I know if therapy is working?',
    slug: 'how-do-i-know-if-therapy-is-working-186032-042',
    category: 'Therapy Navigation',
    title: 'Signs Therapy Is Working',
    meta: 'Progress includes insight, coping skills, and gradual change in target areas—often non-linear, sometimes feeling worse before better.',
    summary:
      'Therapy working rarely means constant happiness. Look for new understanding of patterns, better tools for stress, improved communication, and slow movement toward your goals—even with setbacks along the way.',
    takeaways: [
      'Insight and skill-building are early signs of progress.',
      'Setbacks can occur while overall direction improves.',
      'Discuss stalled progress openly with your therapist.',
      'Wrong modality or fit can mimic "therapy doesn\'t work."',
    ],
    happening:
      'You may expect weekly breakthroughs and feel discouraged by plateaus.\n\nDigging into trauma can temporarily increase distress.',
    help:
      'Define 2–3 goals with your therapist and review quarterly.\n\nTrack coping: Are reactions less destructive over time?\n\nNotice relationships or work functioning shifting slightly.\n\nAsk what progress should look like for your issue.\n\nConsider a different approach or clinician if nothing shifts after honest effort.',
    support:
      `${SUPPORT}\n\nSeek crisis support if therapy surfaces suicidal ideation without a safety plan in place.`,
    related: [
      'How do I know if my therapist is right for me?',
      'How long does therapy take to work?',
      'How do I get the most out of therapy?',
      'How do I know if I need a different type of therapy?',
      'How do I talk to my therapist when I feel stuck?',
    ],
    schemaAnswer:
      'Therapy is working when you gain insight, coping skills, and gradual improvement toward goals—discuss fit and modality if progress stalls after sustained effort.',
    themes: ['Therapy progress', 'Goals', 'Coping skills', 'Expectations'],
    notes: 'Normalize non-linear progress; no guaranteed timelines.',
  }),
  'how-do-i-know-when-its-time-to-end-a-fri-186032-035': draft({
    question: 'How do I know when it\'s time to end a friendship?',
    slug: 'how-do-i-know-when-its-time-to-end-a-fri-186032-035',
    category: 'Relationships & Communication',
    title: 'When to End a Friendship',
    meta: 'Consider ending friendships that consistently drain you, violate trust, or leave you feeling worse—not every drift requires a dramatic exit.',
    summary:
      'Friendships can fade naturally as lives diverge. Ending actively makes sense when contact feels one-sided, boundaries are ignored, betrayal repeats, or you consistently feel smaller after time together.',
    takeaways: [
      'Natural drift and active ending are both valid outcomes.',
      'One-sided or exploitative patterns harm self-worth over time.',
      'You do not owe endless access to people who hurt you.',
      'Gradual distance or honest conversation both work.',
    ],
    happening:
      'Guilt may conflict with relief when you imagine stepping back.\n\nShared history can mask current disrespect or envy.',
    help:
      'Track how you feel before and after contact.\n\nName whether issues were raised and nothing changed.\n\nTry gradual distance before a formal conversation if safer.\n\nUse direct but kind words if clarity is needed.\n\nInvest energy in reciprocal friendships instead.',
    support:
      `${SUPPORT}\n\nSeek support if friendship loss triggers severe depression or isolation.`,
    related: [
      'How do I set boundaries with friends?',
      'How do I deal with a friend who only takes?',
      'How do I cope with loneliness after losing friends?',
      'How do I make new friends as an adult?',
      'How do I forgive a friend who hurt me?',
    ],
    schemaAnswer:
      'End friendships when patterns are draining, disrespectful, or betraying—using gradual distance or honest talks while investing in reciprocal connections.',
    themes: ['Friendship boundaries', 'Letting go', 'Reciprocity', 'Adult friendships'],
    notes: 'Avoid prescribing one breakup script; validate gradual fade.',
  }),
  'how-do-i-know-when-its-time-to-end-a-relationship': draft({
    question: 'How do I know when it\'s time to end a relationship?',
    slug: 'how-do-i-know-when-its-time-to-end-a-relationship',
    category: 'Relationships & Communication',
    title: 'When to End a Relationship',
    meta: 'Consider ending when core needs stay unmet, respect erodes, or you cannot be yourself—even if love remains.',
    summary:
      'Staying because you care is understandable; staying when the relationship consistently harms you is costly. Signs it may be time include unmet fundamental needs despite effort, fear-based staying, or loss of mutual kindness.',
    takeaways: [
      'Unmet core needs despite repair attempts matter.',
      'Fear of alone should not be the main reason to stay.',
      'Authenticity and safety beat performing a role.',
      'Professional guidance helps clarify high-stakes choices.',
    ],
    happening:
      'You may hope the next conversation or trip will fix a years-long pattern.\n\nShared assets, kids, or identity as a couple complicate clarity.',
    help:
      'List non-negotiable needs and whether they are met.\n\nNotice if you like who you are inside the relationship.\n\nDistinguish temporary stress from structural incompatibility.\n\nUse therapy to rehearse conversations and grief.\n\nPlan logistics and support before abrupt exits when possible.',
    support:
      `${SUPPORT}\n\nIf abuse is present, work with a domestic violence advocate on safety planning before leaving.`,
    related: [
      'How do I know if my relationship is toxic?',
      'How do I know if my relationship is worth fighting for?',
      'How do I leave a relationship kindly?',
      'How do I cope with grief after a breakup?',
      'How do I rebuild my life after divorce?',
    ],
    schemaAnswer:
      'End a relationship when core needs stay unmet, respect fades, authenticity is lost, or safety is compromised—often with therapeutic and safety support.',
    themes: ['Breakups', 'Relationship decisions', 'Needs', 'Safety'],
    flags: ['relationship-safety'],
    notes: 'Safety planning for abuse; no legal/financial advice depth.',
  }),
  'how-do-i-know-when-its-time-to-make-a-major-life-c-187459-022': draft({
    question: 'How do I know when it\'s time to make a major life change?',
    slug: 'how-do-i-know-when-its-time-to-make-a-major-life-c-187459-022',
    category: 'Life Transitions',
    title: 'Timing a Major Life Change',
    meta: 'Persistent misalignment, values conflict, and cost of staying often signal readiness—perfect certainty rarely arrives first.',
    summary:
      'Major changes—career, city, relationship status—carry risk and possibility. Chronic restlessness after honest attempts to improve your situation, plus alignment with values, often means change deserves serious planning, not endless waiting for guaranteed outcomes.',
    takeaways: [
      'Persistent dissatisfaction after real fixes is meaningful data.',
      'Weigh cost of staying against risk of changing.',
      'Fear and obligation differ from genuine satisfaction.',
      'Support helps separate impulse from values-based choice.',
    ],
    happening:
      'Others may call you ungrateful for wanting more.\n\nWaiting for zero doubt can keep you stuck for years.',
    help:
      'Journal what you would regret not trying in five years.\n\nTest small experiments before irreversible leaps when possible.\n\nReview finances, support, and health basics—not perfection.\n\nTalk with a therapist or coach about values and fear.\n\nBuild a transition plan with milestones, not just a fantasy exit.',
    support:
      `${SUPPORT}\n\nSeek support if indecision fuels depression or if change involves leaving an unsafe home.`,
    related: [
      'How do I cope with big life transitions?',
      'How do I manage fear of the unknown?',
      'How do I know if I should quit my job?',
      'How do I rebuild identity after a life change?',
      'How do I make decisions when I feel stuck?',
    ],
    schemaAnswer:
      'Time major life changes by tracking persistent misalignment, values fit, cost of staying, planned support, and accepting that certainty comes after action—not before.',
    themes: ['Life transitions', 'Decision-making', 'Values', 'Risk'],
    notes: 'No career/legal advice; encourage planning not impulsive exits when safety allows.',
  }),
  'how-do-i-maintain-cultural-identity-while-i9j4k7': draft({
    question: 'How do I maintain cultural identity while adapting to a new country?',
    slug: 'how-do-i-maintain-cultural-identity-while-i9j4k7',
    category: 'Identity & Self-Worth',
    title: 'Keeping Cultural Identity While Adapting Abroad',
    meta: 'Integration beats either/or: keep what matters most, adapt practices that fit, and find community in both worlds.',
    summary:
      'Immigration asks you to balance heritage and new norms. Maintaining identity is not rejecting your new home—it is choosing which traditions, language, and values stay central while you learn skills to thrive locally.',
    takeaways: [
      'Prioritize which cultural elements feel non-negotiable.',
      'Diaspora communities offer connection and practical support.',
      'Adaptation and preservation can coexist.',
      'Identity stress is normal; isolation worsens it.',
    ],
    happening:
      'You may feel too foreign here and too changed for family back home.\n\nPressure to assimilate quickly can erase parts you cherish.',
    help:
      'Name core values and practices to keep vs flex.\n\nSeek cultural organizations, faith communities, or food traditions locally.\n\nShare heritage with children in age-appropriate ways.\n\nLearn new customs without shaming your origin culture.\n\nProcess grief of loss and change with supportive peers or therapy.',
    support:
      `${SUPPORT}\n\nSeek culturally responsive therapy if immigration stress causes severe depression or isolation.`,
    related: [
      'How do I cope with culture shock?',
      'How do I help my kids maintain bilingual heritage?',
      'How do I deal with discrimination as an immigrant?',
      'How do I build community in a new city?',
      'How do I manage homesickness?',
    ],
    schemaAnswer:
      'Maintain cultural identity abroad by prioritizing key traditions, finding diaspora community, adapting flexibly, and seeking support for immigration stress.',
    themes: ['Immigration', 'Cultural identity', 'Acculturation', 'Community'],
    gaps: ['Specific cultural practices vary widely; content stays general integration guidance.'],
    notes: 'Avoid assimilationist framing; respect diverse immigration contexts.',
  }),
  'how-do-i-maintain-friendships-when-im-depressed': draft({
    question: 'How do I maintain friendships when I\'m depressed?',
    slug: 'how-do-i-maintain-friendships-when-im-depressed',
    category: 'Loneliness & Isolation',
    title: 'Maintaining Friendships During Depression',
    meta: 'Depression pulls you inward when connection helps most—low-energy contact and honest updates beat disappearing silently.',
    summary:
      'Depression often whispers that friends are better off without you. Maintaining connection does not mean performing wellness—it means choosing a few safe friendships, communicating limits, and accepting small moments of contact.',
    takeaways: [
      'Isolation worsens depression; connection is treatment-adjacent.',
      'Low-energy plans beat canceling everything.',
      'Honest updates reduce friends guessing or taking distance personally.',
      'Professional treatment supports your capacity to connect.',
    ],
    happening:
      'You may cancel repeatedly then feel ashamed and hide more.\n\nFriends might not know whether to push or give space.',
    help:
      'Tell one or two trusted friends you are struggling—not every detail required.\n\nSuggest manageable hangs: short walks, texts, parallel quiet time.\n\nUse brief check-ins when in-person feels impossible.\n\nRelease guilt for not being the "fun" friend temporarily.\n\nTreat depression with a clinician so social energy can return.',
    support:
      `${SUPPORT}\n\nSeek urgent help for suicidal thoughts; depression treatment is primary when functioning is severely impaired.`,
    related: [
      'How do I tell friends I have depression?',
      'How do I stop isolating when depressed?',
      'How do I support a friend with depression?',
      'How do I know if I need therapy for depression?',
      'How do I rebuild social life after depression?',
    ],
    schemaAnswer:
      'Maintain friendships during depression with honest communication, low-energy contact, selective prioritization, and professional treatment for underlying symptoms.',
    themes: ['Depression', 'Friendship', 'Isolation', 'Social support'],
    notes: 'No guilt-tripping about reaching out; prioritize treatment.',
  }),
  'how-do-i-maintain-my-sense-of-identity-during-reti-187459-024': draft({
    question: 'How do I maintain my sense of identity during retirement or empty nest phase?',
    slug: 'how-do-i-maintain-my-sense-of-identity-during-reti-187459-024',
    category: 'Life Transitions',
    title: 'Identity After Retirement or Empty Nest',
    meta: 'Roles shift; you remain. Rediscover interests, relationships, and meaning beyond worker or active parent identities.',
    summary:
      'When careers slow or children leave, the roles that organized decades can feel like they vanished. That grief is normal—and this phase can also reopen curiosities postponed for duty.',
    takeaways: [
      'Identity loss after role change is common, not personal failure.',
      'Exploration beats rushing a new single-purpose identity.',
      'Social connection prevents isolation during transitions.',
      'Therapy helps when adjustment triggers depression.',
    ],
    happening:
      'Mornings may feel empty without former routines.\n\nYou might wonder "who am I besides parent or employee?"',
    help:
      'List values and activities you deferred during busy years.\n\nTry classes, volunteering, mentorship, or creative projects.\n\nRebuild couple and friend time intentionally.\n\nGrieve the ending while naming what you keep—wisdom, skills, love.\n\nSet gentle structure so days have rhythm without over-scheduling.',
    support:
      `${SUPPORT}\n\nSeek therapy if emptiness, hopelessness, or identity confusion persist beyond expected adjustment.`,
    related: [
      'How do I cope with empty nest syndrome?',
      'How do I find purpose after retirement?',
      'How do I manage depression in older adulthood?',
      'How do I rebuild my marriage after kids leave?',
      'How do I make friends later in life?',
    ],
    schemaAnswer:
      'Maintain identity after retirement or empty nest by grieving role shifts, exploring deferred interests, strengthening relationships, and seeking support if adjustment stalls.',
    themes: ['Retirement', 'Empty nest', 'Identity', 'Life purpose'],
    notes: 'Include older-adult depression signal; avoid ageist tropes.',
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
  'reports/enrichment-corpus/draft-answers/batch-19-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-19-drafts.json`);
