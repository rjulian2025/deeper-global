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
  readFileSync('reports/enrichment-corpus/batches/batch-29-input.json', 'utf8'),
);

const contentBySlug = {
  'why-do-i-feel-guilty-about-adapting-my-cultural-u4v7w1': draft({
    question: 'Why do I feel guilty about adapting my cultural traditions?',
    slug: 'why-do-i-feel-guilty-about-adapting-my-cultural-u4v7w1',
    category: 'Identity & Self-Worth',
    title: 'Guilty About Adapting Traditions',
    meta: 'Guilt about adapting cultural traditions often reflects loyalty conflicts—cultural evolution is natural and can honor heritage while meeting current needs.',
    summary:
      'Feeling guilty about adapting your cultural traditions reflects the deep connection between cultural practices and identity, family loyalty, and community belonging. Changing traditions can feel like betraying ancestors or disappointing family—but cultural adaptation has occurred throughout history and can strengthen rather than weaken your connection.',
    takeaways: [
      'Adaptation guilt often stems from loyalty to family and community expectations.',
      'Cultures naturally evolve; your changes are part of ongoing cultural expression.',
      'Practical constraints like time and geography often drive thoughtful adaptations.',
      'Honoring heritage while making it relevant can deepen rather than weaken connection.',
    ],
    happening:
      'Family comments about losing your roots may intensify shame about changes you made for practical reasons.\n\nYou may feel caught between preserving tradition and making culture livable in your current circumstances.',
    help:
      'Recognize that previous generations also adapted practices as circumstances changed.\n\nName what you are preserving versus what you are modifying—and why.\n\nDiscuss adaptations with family when possible, framing them as evolution not abandonment.\n\nSeparate guilt from facts: adaptation does not erase your cultural identity.\n\nConnect with others navigating similar bicultural or diaspora experiences.\n\nCelebrate the elements you keep while allowing practical flexibility.',
    support:
      `${SUPPORT}\n\nSeek therapy if cultural guilt causes chronic shame, family estrangement distress, or identity confusion.`,
    related: [
      'Why do I feel disconnected from my cultural heritage?',
      'Why do I feel ashamed of my cultural accent?',
      'How do I build a sense of identity?',
      'How do I set boundaries with family?',
      'How do I cope with feeling like I do not belong?',
    ],
    schemaAnswer:
      'Guilt about adapting cultural traditions reflects loyalty conflicts—cultural evolution is natural and thoughtful adaptation can honor heritage while meeting current needs.',
    themes: ['Cultural identity', 'Guilt', 'Family loyalty', 'Adaptation'],
    gaps: ['No dedicated cultural-identity clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-guilty-about-being-depress-190219-003': draft({
    question: 'Why do I feel guilty about being depressed when others have it worse?',
    slug: 'why-do-i-feel-guilty-about-being-depress-190219-003',
    category: 'Depression',
    title: 'Guilty About Depression',
    meta: 'Depression guilt from comparing yourself to others reflects a misconception—mental illness is not a hierarchy and your pain is valid regardless of circumstances.',
    summary:
      'Feeling guilty about being depressed when others seem to have worse circumstances is incredibly common. Depression is a medical condition that can affect anyone regardless of external privileges. Comparing your internal experience to others\' external circumstances is misleading—and the guilt itself can worsen depression.',
    takeaways: [
      'Depression does not require the worst life circumstances to be valid.',
      'You cannot see others\' full mental health struggles from the outside.',
      'Suffering is not a competition where only the worst case deserves help.',
      'Guilt about depression adds shame to an already difficult experience.',
    ],
    happening:
      'You may minimize your symptoms because your life looks fine on paper.\n\nComparison can prevent you from seeking treatment you genuinely need.',
    help:
      'Treat depression like any medical condition—it needs care regardless of circumstances.\n\nStop ranking your pain against others\' visible struggles.\n\nNotice when guilt becomes another voice attacking you.\n\nSeek professional evaluation instead of debating whether you deserve help.\n\nPractice self-compassion: your suffering is real even if others suffer too.\n\nRemember that getting help enables you to contribute more, not less.',
    support:
      `${SUPPORT}\n\nSeek urgent help if depression includes suicidal thoughts; call or text 988 in the U.S.`,
    related: [
      'Why do I feel guilty for having anxiety when others have it worse?',
      'How do I know if I have depression?',
      'How do I talk to my doctor about mental health?',
      'How do I practice self-compassion?',
      'Why do I feel empty even when my life looks good?',
    ],
    schemaAnswer:
      'Depression guilt from comparing yourself to others is based on a misconception—mental illness is valid regardless of circumstances and deserves treatment.',
    themes: ['Depression', 'Guilt', 'Comparison', 'Self-compassion'],
    refs: [DEPRESSION, NIMH],
  }),
  'why-do-i-feel-guilty-about-being-happy-when-184730-041': draft({
    question: 'Why do I feel guilty about being happy when others are suffering?',
    slug: 'why-do-i-feel-guilty-about-being-happy-when-184730-041',
    category: 'Identity & Self-Worth',
    title: 'Guilty About Being Happy',
    meta: 'Survivor\'s guilt about happiness is common but misguided—your joy does not diminish others\' experiences or take away from their healing.',
    summary:
      'Feeling guilty about your happiness when others are suffering is a form of survivor\'s guilt. The misconception that happiness is a finite resource—that your joy takes something from others—is not true. Emotions are not zero-sum, and suppressing your happiness does not alleviate anyone else\'s pain.',
    takeaways: [
      'Your happiness does not cause or worsen others\' suffering.',
      'Joy and compassion for others can coexist without canceling each other out.',
      'Suppressing happiness wastes precious positive experiences.',
      'Your stability can be a source of hope for people who are struggling.',
    ],
    happening:
      'Good news may feel dangerous to share when people you care about are hurting.\n\nYou may have learned that expressing joy is insensitive or selfish.',
    help:
      'Separate compassion from self-punishment—caring about others does not require misery.\n\nUse your happiness thoughtfully: offer presence, practical help, or encouragement.\n\nAllow yourself to enjoy good moments without earning them through suffering.\n\nNotice when guilt is based on old family rules about who deserves joy.\n\nPractice holding both: "I care about their pain, and I can also feel glad today."\n\nSeek therapy if happiness guilt prevents you from engaging with life.',
    support:
      `${SUPPORT}\n\nSeek help if guilt about happiness drives withdrawal, self-punishment, or chronic low mood.`,
    related: [
      'Why do I feel guilty for being happy after someone died?',
      'How do I practice self-compassion?',
      'How do I set boundaries without guilt?',
      'Why do I feel guilty when I put myself first?',
      'How do I cope with survivor guilt?',
    ],
    schemaAnswer:
      'Guilt about being happy when others suffer reflects survivor\'s guilt—your joy does not diminish others and can coexist with compassion.',
    themes: ['Survivor guilt', 'Happiness', 'Self-compassion', 'Boundaries'],
  }),
  'why-do-i-feel-guilty-about-losing-my-native-d9e4f7': draft({
    question: 'Why do I feel guilty about losing my native language?',
    slug: 'why-do-i-feel-guilty-about-losing-my-native-d9e4f7',
    category: 'Identity & Self-Worth',
    title: 'Guilty About Losing Native Language',
    meta: 'Language loss guilt among immigrants and their children reflects grief for cultural connection—not personal failure or abandonment of heritage.',
    summary:
      'Feeling guilty about losing your native language reflects the deep connection between language and identity, culture, and belonging. Language loss often happens gradually through immigration, schooling, and practical pressures—not through neglect. The grief is valid, but guilt often exceeds your actual responsibility.',
    takeaways: [
      'Language loss often results from circumstances outside your control.',
      'Losing fluency does not erase your cultural identity or worth.',
      'Family disappointment can intensify shame beyond the practical loss.',
      'Reconnecting with language is possible at any stage of life.',
    ],
    happening:
      'You may feel cut off from grandparents, literature, or cultural jokes that require fluency.\n\nComments about forgetting your roots can make gradual attrition feel like betrayal.',
    help:
      'Separate grief from guilt—mourning the loss is healthy; blaming yourself is not.\n\nExplore language classes, apps, or family conversation practice at your own pace.\n\nAcknowledge systemic factors: dominant-language schooling and geographic distance.\n\nConnect with others experiencing heritage language loss.\n\nHonor culture through food, stories, and community even while rebuilding language.\n\nSet boundaries with shaming comments about language ability.',
    support:
      `${SUPPORT}\n\nSeek therapy if language guilt drives chronic shame, family conflict, or identity distress.`,
    related: [
      'Why do I feel guilty about not speaking my heritage language fluently?',
      'Why do I feel disconnected from my cultural heritage?',
      'How do I build a sense of identity?',
      'How do I cope with feeling like I do not belong?',
      'How do I set boundaries with family?',
    ],
    schemaAnswer:
      'Guilt about losing a native language reflects grief for cultural connection—language attrition is often circumstantial, not a personal failure.',
    themes: ['Language loss', 'Cultural identity', 'Grief', 'Immigration'],
    gaps: ['No dedicated cultural-identity clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-guilty-about-my-privilege-as-a-passing-member-of-the-lgbtq-community': draft({
    question: 'Why do I feel guilty about my privilege as a passing member of the LGBTQ+ community?',
    slug: 'why-do-i-feel-guilty-about-my-privilege-as-a-passing-member-of-the-lgbtq-community',
    category: 'Gender & Sexuality',
    title: 'Guilty About LGBTQ+ Privilege',
    meta: 'Privilege guilt within the LGBTQ+ community is common—awareness matters, but guilt alone does not help; use advantages to support others while honoring your own experience.',
    summary:
      'Feeling guilty about having privilege within the LGBTQ+ community—whether from passing, a different-gender relationship, or facing less discrimination—is common. Awareness of relative safety is important, but guilt without action is unproductive. Your experience remains valid even when others face greater harm.',
    takeaways: [
      'Privilege awareness is healthy; guilt without action is not.',
      'Having relative safety does not erase your own struggles or identity.',
      'Amplifying marginalized voices is more useful than self-punishment.',
      'Community solidarity includes both accountability and self-compassion.',
    ],
    happening:
      'You may downplay your own discrimination because others have it worse.\n\nPassing can create isolation from both LGBTQ+ and straight communities.',
    help:
      'Channel awareness into advocacy: support organizations, amplify voices, volunteer.\n\nDo not minimize your own mental health needs because of relative privilege.\n\nLearn about intersectionality without using it to invalidate yourself.\n\nFind community spaces where your full identity is welcomed.\n\nPractice gratitude for safety alongside commitment to collective liberation.\n\nSeek LGBTQ+-affirming therapy if guilt drives shame or hiding.',
    support:
      `${SUPPORT}\n\nSeek LGBTQ+-affirming support if privilege guilt causes isolation, shame, or identity suppression.`,
    related: [
      'How do I come out when I am scared?',
      'How do I find LGBTQ+ community?',
      'How do I cope with internalized shame?',
      'How do I practice self-compassion?',
      'How do I support LGBTQ+ friends?',
    ],
    schemaAnswer:
      'Guilt about LGBTQ+ privilege is common—use relative safety to support others while honoring that your own identity and struggles remain valid.',
    themes: ['LGBTQ+ identity', 'Privilege', 'Guilt', 'Community'],
    gaps: ['No dedicated LGBTQ+ clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-guilty-about-my-trauma-when-it-wasnt-my-fault': draft({
    question: "Why do I feel guilty about my trauma when it wasn't my fault?",
    slug: 'why-do-i-feel-guilty-about-my-trauma-when-it-wasnt-my-fault',
    category: 'Trauma & Triggers',
    title: 'Guilty About Trauma',
    meta: 'Trauma guilt often develops as a way to feel control over uncontrollable events—your mind would rather blame you than accept powerlessness.',
    summary:
      'Feeling guilty about trauma that was not your fault is one of the most common aspects of trauma recovery. Your brain may blame you to create an illusion of control—if you caused it, you could prevent it next time. Survivor guilt, shame about your response, and believing you deserved harm are painful but treatable patterns.',
    takeaways: [
      'Self-blame is a common trauma response, not evidence of fault.',
      'The brain prefers guilt over accepting complete powerlessness.',
      'Survivor guilt can arise even when you could not have changed outcomes.',
      'Healing separates what you feel from what actually occurred.',
    ],
    happening:
      'You may replay events wondering what you could have done differently.\n\nSurvivor guilt can surface when others were hurt more or when you escaped.',
    help:
      'Name the trauma response: guilt after harm is common, not proof of responsibility.\n\nWork with a trauma-informed therapist to process blame and shame.\n\nPractice extending the compassion you would offer another survivor to yourself.\n\nChallenge "if only" thoughts with what was actually in your control.\n\nUse grounding when guilt spikes feel overwhelming.\n\nAllow anger at perpetrators or circumstances—not only at yourself.',
    support:
      `${SUPPORT}\n\nSeek trauma-informed therapy; call or text 988 if guilt fuels self-harm thoughts.`,
    related: [
      'How do I know if I have PTSD?',
      'How do I cope with survivor guilt?',
      'How do I stop blaming myself?',
      'How do I find a trauma-informed therapist?',
      'How do I ground myself when overwhelmed?',
    ],
    schemaAnswer:
      'Trauma guilt when harm was not your fault often reflects the mind seeking control—trauma-informed therapy helps separate feelings from facts.',
    themes: ['Trauma', 'Survivor guilt', 'Self-blame', 'Healing'],
    refs: [PTSD, NIMH],
  }),
  'why-do-i-feel-guilty-about-not-speaking-my-p7q1r4': draft({
    question: 'Why do I feel guilty about not speaking my heritage language fluently?',
    slug: 'why-do-i-feel-guilty-about-not-speaking-my-p7q1r4',
    category: 'Identity & Self-Worth',
    title: 'Guilty About Heritage Language',
    meta: 'Heritage language guilt reflects cultural loyalty conflicts—fluency loss is common and does not diminish your cultural identity or worth.',
    summary:
      'Feeling guilty about not speaking your heritage language fluently reflects the connection between language and cultural identity, family relationships, and belonging. Language loss typically occurs through immigration, schooling, and family language decisions—not personal neglect. The guilt often exceeds your actual responsibility.',
    takeaways: [
      'Heritage language attrition is common in immigrant families.',
      'Parents sometimes prioritize the dominant language for children\'s success.',
      'Fluency loss does not make you inauthentically connected to culture.',
      'Language reconnection is possible without erasing your current identity.',
    ],
    happening:
      'You may feel excluded from family conversations or cultural references requiring fluency.\n\nCommunity disappointment can turn practical language gaps into shame.',
    help:
      'Separate grief from guilt—honor the loss without attacking yourself.\n\nExplore classes, apps, or family practice at a sustainable pace.\n\nAcknowledge structural factors: schooling, geography, and time demands.\n\nMaintain cultural connection through other channels while rebuilding language.\n\nSet boundaries with shaming comments about fluency.\n\nConnect with others navigating bicultural identity.',
    support:
      `${SUPPORT}\n\nSeek therapy if language guilt causes chronic shame or family estrangement distress.`,
    related: [
      'Why do I feel guilty about losing my native language?',
      'Why do I feel disconnected from my cultural heritage?',
      'How do I build a sense of identity?',
      'How do I cope with feeling like I do not belong?',
      'How do I set boundaries with family?',
    ],
    schemaAnswer:
      'Heritage language guilt reflects loyalty conflicts—fluency loss is often circumstantial and does not diminish cultural identity or worth.',
    themes: ['Heritage language', 'Cultural identity', 'Guilt', 'Belonging'],
    gaps: ['No dedicated cultural-identity clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-guilty-about-setting-bound-190219-013': draft({
    question: 'Why do I feel guilty about setting boundaries at work?',
    slug: 'why-do-i-feel-guilty-about-setting-bound-190219-013',
    category: 'Work & Burnout',
    title: 'Guilty About Work Boundaries',
    meta: 'Work boundary guilt often stems from people-pleasing, fear of job security, or cultures that normalize overwork—boundaries protect sustainable performance.',
    summary:
      'Feeling guilty about setting boundaries at work is extremely common. People-pleasing, fear of being seen as uncommitted, and workplace cultures that normalize overwork all fuel the guilt. Yet boundaries are necessary for sustainable performance, wellbeing, and work quality—not selfish luxuries.',
    takeaways: [
      'Work guilt often reflects internalized messages that good employees never say no.',
      'Boundaries prevent burnout that ultimately hurts you and your output.',
      'Consistent professional limits are more effective than reactive explosions.',
      'Workplaces that punish reasonable boundaries may be the real problem.',
    ],
    happening:
      'Saying no to after-hours requests may trigger fear of being replaced or judged.\n\nYou may equate availability with worth or loyalty.',
    help:
      'Start with small boundaries: lunch breaks, email cutoff times, realistic deadlines.\n\nCommunicate limits professionally and consistently—not emotionally or reactively.\n\nReframe boundaries as protecting quality work, not avoiding work.\n\nTrack whether guilt exceeds actual consequences from setting limits.\n\nModel healthy boundaries for colleagues when possible.\n\nEvaluate whether chronic overwork culture is a reason to seek new employment.',
    support:
      `${SUPPORT}\n\nSeek therapy or career counseling if work guilt drives burnout, panic, or inability to rest.`,
    related: [
      'How do I recover from burnout?',
      'How do I say no without guilt?',
      'How do I set boundaries at work?',
      'Why do I feel exhausted all the time?',
      'How do I cope with a toxic workplace?',
    ],
    schemaAnswer:
      'Guilt about work boundaries often reflects people-pleasing and overwork culture—professional consistent limits protect sustainable performance and wellbeing.',
    themes: ['Work boundaries', 'Burnout', 'People-pleasing', 'Guilt'],
    refs: [BURNOUT, CDC],
  }),
  'why-do-i-feel-guilty-about-setting-boundarie-177941-026': draft({
    question: 'Why do I feel guilty about setting boundaries with family?',
    slug: 'why-do-i-feel-guilty-about-setting-boundarie-177941-026',
    category: 'Family Boundaries',
    title: 'Guilty About Family Boundaries',
    meta: 'Family boundary guilt is common due to loyalty expectations—healthy boundaries improve relationships by preventing resentment and burnout.',
    summary:
      'Feeling guilty about setting boundaries with family is common because many people are taught that family should come first and that saying no is disloyal. Family members may use guilt, obligation, or manipulation to maintain control. Healthy boundaries actually protect relationships by preventing resentment.',
    takeaways: [
      'Family guilt often reflects conditioning that self-protection equals selfishness.',
      'Manipulation through loyalty language does not obligate you to accept harm.',
      'Boundaries can coexist with love—they prevent explosive resentment.',
      'Family members who respect you will adjust; those who punish boundaries reveal priorities.',
    ],
    happening:
      'Guilt may spike when you limit visits, refuse money requests, or leave uncomfortable situations.\n\nYou may fear being labeled the difficult or ungrateful family member.',
    help:
      'Practice clear, calm boundary statements without over-explaining or apologizing.\n\nExpect pushback initially—consistency matters more than one perfect conversation.\n\nSeparate love from unlimited access: you can care and still protect yourself.\n\nSeek therapy to process family-of-origin patterns driving guilt.\n\nBuild support outside the family system so isolation does not force compliance.\n\nDocument patterns if boundaries involve safety concerns.',
    support:
      `${SUPPORT}\n\nSeek help if family boundary-setting triggers threats, stalking, or fear for your safety.`,
    related: [
      'How do I set boundaries with toxic family?',
      'How do I say no without guilt?',
      'How do I deal with guilt trips?',
      'How do I stop people-pleasing?',
      'How do I go low contact with family?',
    ],
    schemaAnswer:
      'Guilt about family boundaries reflects loyalty conditioning—healthy limits prevent resentment and can coexist with love.',
    themes: ['Family boundaries', 'Guilt', 'Manipulation', 'Self-protection'],
  }),
  'why-do-i-feel-guilty-about-spending-money-on-177941-014': draft({
    question: 'Why do I feel guilty about spending money on myself?',
    slug: 'why-do-i-feel-guilty-about-spending-money-on-177941-014',
    category: 'Money & Self-Worth',
    title: 'Guilty About Spending on Yourself',
    meta: 'Money guilt often stems from scarcity mindset or beliefs about self-worth—reasonable self-care purchases are investments in wellbeing, not selfishness.',
    summary:
      'Feeling guilty about spending money on yourself often reflects deeper beliefs about whether you deserve good things. Scarcity upbringing, cultural messages about self-denial, or awareness that others have less can all fuel the guilt. Intentional self-care spending supports mental health and your ability to contribute.',
    takeaways: [
      'Self-care spending is not the same as reckless or compulsive spending.',
      'Believing your needs come last often traces to childhood or cultural messaging.',
      'A reasonable personal budget reduces guilt while allowing joy.',
      'Investing in wellbeing improves your capacity to care for others.',
    ],
    happening:
      'A massage, hobby, or clothing purchase may trigger shame even when affordable.\n\nYou may scrutinize every personal expense while freely spending on others.',
    help:
      'Distinguish intentional self-care from impulsive or avoidant spending.\n\nSet a defined monthly personal budget so enjoyment does not require justification each time.\n\nReframe purchases as maintenance: rest, health, and confidence support functioning.\n\nNotice scarcity trauma if past hardship makes any spending feel dangerous.\n\nPractice saying "I deserve reasonable care" without debating your worth.\n\nSeek financial therapy or counseling if money guilt drives deprivation or panic.',
    support:
      `${SUPPORT}\n\nSeek help if money guilt causes severe restriction of basic needs or suicidal thoughts related to finances.`,
    related: [
      'How do I manage financial anxiety?',
      'Why do I feel guilty when I put myself first?',
      'How do I practice self-compassion?',
      'How do I build a budget when overwhelmed?',
      'How do I cope with money stress?',
    ],
    schemaAnswer:
      'Guilt about spending on yourself often reflects scarcity mindset or low self-worth—intentional self-care purchases are investments in wellbeing.',
    themes: ['Money guilt', 'Self-worth', 'Self-care', 'Scarcity mindset'],
    gaps: ['No dedicated financial counseling source cited; verify framing stays general.'],
  }),
  'why-do-i-feel-guilty-about-taking-sick-d-177940-026': draft({
    question: 'Why do I feel guilty about taking sick days for mental health?',
    slug: 'why-do-i-feel-guilty-about-taking-sick-d-177940-026',
    category: 'Workplace Mental Health',
    title: 'Guilty About Mental Health Days',
    meta: 'Mental health sick-day guilt reflects stigma—psychological wellbeing is as legitimate as physical health and rest prevents worse outcomes.',
    summary:
      'Feeling guilty about taking sick days for mental health reflects stigma that still treats psychological struggles as less legitimate than physical illness. Mental health directly affects cognition, productivity, and physical health. Rest when struggling is responsible—not lazy or weak.',
    takeaways: [
      'Mental health conditions are real medical issues requiring care.',
      'Working through severe symptoms often worsens and prolongs them.',
      'Many employers now recognize mental health days as legitimate.',
      'Guilt often reflects workplace culture problems, not personal failure.',
    ],
    happening:
      'You may use physical excuses because mental health feels less valid.\n\nFear of being seen as unreliable can override genuine need for rest.',
    help:
      'Treat mental health sick days like flu days—recovery enables better return.\n\nUse earned leave without over-explaining or justifying to colleagues.\n\nPlan rest activities that actually reduce symptoms, not just screen time.\n\nDocument patterns if workplace consistently punishes legitimate sick leave.\n\nAdvocate for mental health policies if you have influence.\n\nReframe rest as protecting long-term performance, not avoiding work.',
    support:
      `${SUPPORT}\n\nSeek clinical care if mental health symptoms require more than a day or two of rest.`,
    related: [
      'How do I talk to my boss about mental health?',
      'How do I recover from burnout?',
      'How do I set boundaries at work?',
      'How do I know if I need therapy?',
      'Why do I feel guilty for taking time off when sick?',
    ],
    schemaAnswer:
      'Guilt about mental health sick days reflects stigma—psychological wellbeing deserves the same rest and care as physical illness.',
    themes: ['Workplace mental health', 'Stigma', 'Self-care', 'Burnout'],
    refs: [BURNOUT, NIMH],
  }),
  'why-do-i-feel-guilty-every-time-i-get-angry-186602-005': draft({
    question: 'Why do I feel guilty every time I get angry?',
    slug: 'why-do-i-feel-guilty-every-time-i-get-angry-186602-005',
    category: 'Anger & Emotional Regulation',
    title: 'Guilty Every Time You Get Angry',
    meta: 'Anger guilt often stems from childhood messages that anger is dangerous or bad—or fear of becoming someone who hurt you.',
    summary:
      'Guilt about anger typically develops from early messages that anger is dangerous, selfish, or unacceptable. If you witnessed explosive anger or grew up where anger was forbidden, any anger may feel like moral failure. Anger itself is neutral information—what matters is how you express it.',
    takeaways: [
      'Anger is a normal emotion signaling boundary violations or unmet needs.',
      'Childhood exposure to explosive or suppressed anger shapes guilt patterns.',
      'Cultural and gender norms often shame anger, especially in women.',
      'Healthy expression of anger can strengthen relationships and self-respect.',
    ],
    happening:
      'A flash of irritation may immediately trigger shame or self-attack.\n\nYou may fear becoming like an angry parent or partner who caused harm.',
    help:
      'Name anger as information: what boundary or need is signaling?\n\nSeparate feeling anger from harmful expression—yelling is not the only option.\n\nPractice assertive communication: "I felt angry when..." without attack.\n\nChallenge old rules: "Angry people are bad" is not accurate.\n\nUse physical release—walk, journal, exercise—before difficult conversations.\n\nSeek therapy if anger guilt leads to suppression then explosive outbursts.',
    support:
      `${SUPPORT}\n\nSeek help if anger feels uncontrollable, leads to violence, or fuels self-harm.`,
    related: [
      'How do I manage anger in healthy ways?',
      'How do I set boundaries without exploding?',
      'How do I stop people-pleasing?',
      'How do I express needs without guilt?',
      'How do I break cycles of emotional suppression?',
    ],
    schemaAnswer:
      'Anger guilt often comes from childhood messages that anger is bad—anger is neutral information; healthy expression communicates needs and boundaries.',
    themes: ['Anger', 'Emotional regulation', 'Guilt', 'Childhood conditioning'],
  }),
  'why-do-i-feel-guilty-for-being-excited-about-chang-187459-021': draft({
    question: 'Why do I feel guilty for being excited about changes that hurt other people?',
    slug: 'why-do-i-feel-guilty-for-being-excited-about-chang-187459-021',
    category: 'Life Transitions',
    title: 'Guilty About Exciting Changes',
    meta: 'Mixed emotions about life changes are normal—you can feel excited about your future while also caring about others\' pain.',
    summary:
      'Feeling guilty about being excited for changes that cause others pain reflects empathy—but it can also keep you stuck in situations that are not right for you. Complex emotions coexist: you can be sad for coworkers and thrilled about a new job, or relieved about a breakup and sorry for your partner\'s hurt.',
    takeaways: [
      'Excitement and empathy can coexist without canceling each other out.',
      'Your gain causing someone\'s loss does not make your happiness wrong.',
      'Staying in wrong situations to avoid others\' discomfort breeds resentment.',
      'Communicating care while honoring your needs is the balanced path.',
    ],
    happening:
      'A new opportunity may feel tainted by knowing others will struggle with your departure.\n\nYou may hide excitement to appear appropriately somber.',
    help:
      'Hold both truths: "I care about their difficulty, and I am glad for this change."\n\nCommunicate transitions with honesty and kindness—not false regret for valid choices.\n\nAvoid staying stuck to manage others\' emotions—that helps no one long-term.\n\nAllow celebration privately if public joy feels too complicated initially.\n\nSeek therapy if guilt prevents necessary life transitions repeatedly.\n\nRemember that modeling healthy change can ultimately inspire others.',
    support:
      `${SUPPORT}\n\nSeek support if guilt about positive changes drives chronic indecision or self-sabotage.`,
    related: [
      'How do I make a big life change?',
      'How do I cope with guilt?',
      'How do I end a relationship kindly?',
      'How do I set boundaries without guilt?',
      'How do I navigate career transitions?',
    ],
    schemaAnswer:
      'Guilt about being excited for changes that hurt others is normal—mixed emotions coexist and honoring your growth does not require suppressing all joy.',
    themes: ['Life transitions', 'Mixed emotions', 'Guilt', 'Empathy'],
  }),
  'why-do-i-feel-guilty-for-being-happy-aft-181083-087': draft({
    question: 'Why do I feel guilty for being happy after my breakup?',
    slug: 'why-do-i-feel-guilty-for-being-happy-aft-181083-087',
    category: 'Relationships & Divorce',
    title: 'Guilty About Post-Breakup Happiness',
    meta: 'Feeling guilty for happiness after a breakup is common but unnecessary—you deserve joy and it does not mean you did not care.',
    summary:
      'Feeling guilty for being happy after a breakup is common, especially if you initiated the split or your ex is struggling. Happiness does not mean you did not love them or that you are insensitive. Relief, joy, and excitement about your future are valid parts of healing.',
    takeaways: [
      'Post-breakup happiness does not invalidate the relationship you shared.',
      'Relief often signals the relationship was not sustainable—not that you are cruel.',
      'Your ex\'s healing is their responsibility, not yours to manage through misery.',
      'Moving forward is healthy, not a betrayal of what you had together.',
    ],
    happening:
      'Good days may feel like evidence you never cared—even when grief and joy alternate.\n\nSocial media glimpses of your ex\'s pain can reignite guilt about your progress.',
    help:
      'Allow both grief and happiness without ranking which is more legitimate.\n\nLimit checking on your ex if it fuels guilt-driven monitoring.\n\nRemind yourself that ending an unhealthy relationship can be an act of care.\n\nAvoid performing sadness to meet others\' expectations about how breakups should look.\n\nSeek therapy if guilt keeps you entangled or prevents closure.\n\nFocus on building a life aligned with your values rather than your ex\'s reactions.',
    support:
      `${SUPPORT}\n\nSeek therapy if breakup guilt drives reconciliation with harmful dynamics or chronic rumination.`,
    related: [
      'How do I heal after a breakup?',
      'How do I stop feeling guilty?',
      'How do I know if I made the right decision to leave?',
      'How do I set boundaries with an ex?',
      'How do I practice self-compassion?',
    ],
    schemaAnswer:
      'Guilt about happiness after a breakup is common but unnecessary—joy and relief are valid parts of healing and do not mean you did not care.',
    themes: ['Breakup', 'Guilt', 'Healing', 'Self-compassion'],
  }),
  'why-do-i-feel-guilty-for-being-happy-aft-190219-010': draft({
    question: 'Why do I feel guilty for being happy after losing someone I loved?',
    slug: 'why-do-i-feel-guilty-for-being-happy-aft-190219-010',
    category: 'Trauma & Grief',
    title: 'Guilty About Happiness After Loss',
    meta: 'Survivor guilt and happiness guilt after loss are normal grief responses—they do not dishonor your loved one\'s memory.',
    summary:
      'Feeling guilty for experiencing happiness after losing someone you loved is a common part of grief. You may worry that joy dishonors their memory or means you are moving on too fast. Grief and happiness can coexist—many loved ones would want you to find light again.',
    takeaways: [
      'Happiness after loss does not mean forgetting or loving them less.',
      'Grief has no prescribed timeline or correct emotional sequence.',
      'Continuing bonds—honoring memory while living—are healthy.',
      'Survivor guilt reflects love\'s depth, not callousness.',
    ],
    happening:
      'A laugh or good day may trigger immediate self-reproach.\n\nOthers\' comments about how you should grieve can compound the guilt.',
    help:
      'Allow joy as a tribute—living fully can honor what they wanted for you.\n\nInclude your loved one in happy moments through memory, ritual, or conversation.\n\nChallenge "grief should look like constant sadness" myths.\n\nSeek grief counseling if guilt prevents engaging with life.\n\nNotice when happiness coexists with missing them—that is normal.\n\nSet boundaries with people who judge your healing pace.',
    support:
      `${SUPPORT}\n\nSeek grief counseling if survivor guilt becomes overwhelming or prevents daily functioning.`,
    related: [
      'Why do I feel guilty for being happy after someone died?',
      'How do I cope with grief?',
      'How do I handle survivor guilt?',
      'Is it normal to laugh while grieving?',
      'How do I find a grief counselor?',
    ],
    schemaAnswer:
      'Guilt about happiness after losing someone is a normal grief response—joy does not dishonor their memory and can coexist with love and mourning.',
    themes: ['Grief', 'Survivor guilt', 'Happiness', 'Continuing bonds'],
    refs: [GRIEF, NIMH],
  }),
  'why-do-i-feel-guilty-for-being-happy-aft-190974-002': draft({
    question: 'Why do I feel guilty for being happy after someone died?',
    slug: 'why-do-i-feel-guilty-for-being-happy-aft-190974-002',
    category: 'Trauma & Grief',
    title: 'Guilty for Happiness After Death',
    meta: 'Survivor guilt after loss is normal—happiness does not dishonor the deceased and healing does not mean forgetting or loving them less.',
    summary:
      'Feeling guilty about experiencing happiness after someone dies is incredibly common—often called survivor guilt. You may worry that laughing, achieving milestones, or simply continuing to live betrays their memory. Healing and joy are natural human experiences that can honor love rather than diminish it.',
    takeaways: [
      'Survivor guilt reflects the significance of your loss, not insensitivity.',
      'Experiencing joy does not mean you have stopped grieving properly.',
      'Many deceased loved ones would want you to find happiness again.',
      'Grief is non-linear—good days and hard days both belong.',
    ],
    happening:
      'Milestones they will never reach may make your achievements feel guilty.\n\nBrief moments of forgetting can trigger panic that you are leaving them behind.',
    help:
      'Practice "both-and": "I miss them deeply, and I can enjoy today."\n\nShare good news with their memory—talk to them, visit meaningful places.\n\nReject arbitrary timelines others impose on your grief.\n\nSeek grief therapy if guilt blocks participation in life for months.\n\nAllow laughter without treating it as evidence of insufficient love.\n\nConnect with bereavement support groups for normalized perspective.',
    support:
      `${SUPPORT}\n\nSeek grief counseling if survivor guilt is overwhelming or you feel unable to engage with life.`,
    related: [
      'Why do I feel guilty for moving on after someone died?',
      'How do I cope with grief?',
      'Is it normal to feel relief after a death?',
      'How do I handle survivor guilt?',
      'How do I find a grief counselor?',
    ],
    schemaAnswer:
      'Survivor guilt about happiness after a death is normal—healing and joy honor love without meaning you have forgotten or stopped caring.',
    themes: ['Survivor guilt', 'Grief', 'Healing', 'Happiness'],
    refs: [GRIEF, NIMH],
  }),
  'why-do-i-feel-guilty-for-doubting-my-fai-181083-035': draft({
    question: 'Why do I feel guilty for doubting my faith?',
    slug: 'why-do-i-feel-guilty-for-doubting-my-fai-181083-035',
    category: 'Identity & Self-Worth',
    title: 'Guilty About Doubting Faith',
    meta: 'Faith guilt is common because questioning can feel like betraying community and family—but doubt is often part of spiritual growth.',
    summary:
      'Guilt about doubting faith is common because religious communities often discourage questioning and frame doubt as moral failure. You may feel you are betraying family, community, or God. Honest questioning is often a sign of intellectual and spiritual maturity—not weakness.',
    takeaways: [
      'Many people experience doubt without abandoning all positive aspects of faith.',
      'Religious communities sometimes equate questioning with sin or rebellion.',
      'Working through doubt can lead to more authentic spiritual life.',
      'Guilt often reflects fear of losing belonging, not actual moral failure.',
    ],
    happening:
      'Questions you cannot voice may fester into shame and isolation.\n\nFamily expectations may make doubt feel like familial betrayal.',
    help:
      'Seek safe spaces—therapists, online communities, trusted friends—for honest exploration.\n\nSeparate guilt from curiosity: questions are not attacks on goodness.\n\nHonor positive aspects of your upbringing while exploring current truth.\n\nRead perspectives from people who navigated similar faith journeys.\n\nSet boundaries with people who punish doubt with shame or threats.\n\nAllow your beliefs to evolve without requiring immediate certainty.',
    support:
      `${SUPPORT}\n\nSeek faith-sensitive or secular therapy if religious guilt causes severe distress or isolation.`,
    related: [
      'Why do I feel guilty for questioning my religious upbringing?',
      'How do I cope with spiritual crisis?',
      'How do I set boundaries with religious family?',
      'How do I find community after leaving religion?',
      'How do I build identity outside faith?',
    ],
    schemaAnswer:
      'Guilt about doubting faith often reflects fear of betraying community—honest questioning is a normal part of spiritual and intellectual growth.',
    themes: ['Faith doubt', 'Spiritual struggle', 'Guilt', 'Identity'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-guilty-for-having-anxiety-when-others-have-it-worse': draft({
    question: 'Why do I feel guilty for having anxiety when others have it worse?',
    slug: 'why-do-i-feel-guilty-for-having-anxiety-when-others-have-it-worse',
    category: 'Anxiety & Worry',
    title: 'Guilty About Your Anxiety',
    meta: 'Comparing your struggles to others\' does not diminish your pain—anxiety is valid regardless of what anyone else is experiencing.',
    summary:
      'Guilt about having anxiety when others have it worse is based on a flawed premise that suffering is a competition. Your anxiety is real and deserving of attention regardless of others\' circumstances. Pain is not zero-sum—someone else\'s struggles do not cancel yours.',
    takeaways: [
      'Anxiety validity does not depend on having the worst problems.',
      'Comparison prevents you from getting support you need.',
      'Taking care of your mental health helps you support others better.',
      'Minimizing your anxiety does not actually help anyone else.',
    ],
    happening:
      'You may hide symptoms or avoid treatment because others "have real problems."\n\nSocial media highlights of others\' hardship can intensify unworthy feelings.',
    help:
      'Use the broken-leg test: would you deny care because someone has cancer?\n\nStop ranking pain—your nervous system does not consult a suffering leaderboard.\n\nSeek treatment; functioning better helps you contribute positively.\n\nPractice self-compassion statements when comparison guilt arises.\n\nLimit doomscrolling that fuels unworthy comparisons.\n\nDiscuss anxiety with a clinician rather than debating whether you deserve help.',
    support:
      `${SUPPORT}\n\nSeek evaluation if anxiety is frequent, causes panic, or impairs daily life.`,
    related: [
      'Why do I feel guilty about being depressed when others have it worse?',
      'How do I know if I have an anxiety disorder?',
      'How do I practice self-compassion?',
      'How do I stop comparing myself to others?',
      'How do I talk to my doctor about mental health?',
    ],
    schemaAnswer:
      'Guilt about anxiety when others have it worse is based on a false hierarchy—your anxiety is valid and deserves care regardless of others\' struggles.',
    themes: ['Anxiety', 'Comparison', 'Guilt', 'Self-compassion'],
    refs: [ANXIETY, NIMH],
  }),
  'why-do-i-feel-guilty-for-having-moments--184729-005': draft({
    question: 'Why do I feel guilty for having moments of happiness after someone died?',
    slug: 'why-do-i-feel-guilty-for-having-moments--184729-005',
    category: 'Grief & Loss',
    title: 'Guilty About Grief Happiness',
    meta: 'Survivor\'s guilt in grief is common—moments of happiness do not dishonor the deceased; they are part of healing.',
    summary:
      'Feeling guilty for experiencing happiness after a loss is a form of survivor\'s guilt. You may feel that being happy means forgetting them or not caring enough. The person you lost would likely want you to find moments of joy—and lightness can coexist with deep grief.',
    takeaways: [
      'Brief happiness does not erase love or the significance of loss.',
      'Grief includes varied emotions, not only sadness.',
      'Joy can be a sign of resilience and continuing connection.',
      'Guilt about happiness often reflects love\'s depth, not cruelty.',
    ],
    happening:
      'A pleasant afternoon may end with sudden shame about enjoying yourself.\n\nYou may hide good moments from others who expect constant mourning.',
    help:
      'Welcome joy when it arrives without interrogating whether you deserve it.\n\nTell yourself: "Loving them includes living, not only grieving."\n\nShare memories during happy moments to integrate loss and life.\n\nSeek grief support if guilt blocks all positive experience for months.\n\nReject external timelines about when happiness becomes acceptable.\n\nNotice that grief waves continue even alongside good days.',
    support:
      `${SUPPORT}\n\nSeek grief counseling if guilt about happiness prevents engaging with daily life.`,
    related: [
      'Why do I feel guilty for laughing after they died?',
      'How do I cope with grief?',
      'Is it normal to feel okay while grieving?',
      'How do I handle survivor guilt?',
      'How do I find a grief counselor?',
    ],
    schemaAnswer:
      'Guilt about moments of happiness after a death is common survivor\'s guilt—joy does not dishonor the deceased and is part of healing.',
    themes: ['Grief', 'Survivor guilt', 'Happiness', 'Healing'],
    refs: [GRIEF, NIMH],
  }),
  'why-do-i-feel-guilty-for-laughing-or-hav-186032-010': draft({
    question: 'Why do I feel guilty for laughing or having fun after they died?',
    slug: 'why-do-i-feel-guilty-for-laughing-or-hav-186032-010',
    category: 'Grief & Loss',
    title: 'Guilty About Laughing After Loss',
    meta: 'Guilt about laughing after a death is common in grief—moments of joy honor your loved one\'s wish for you to live fully.',
    summary:
      'Feeling guilty for laughing or enjoying yourself after a loss is very common. You may feel happiness is disrespectful to their memory. Your loved one would likely want you to experience joy. Moments of laughter are signs of healing and resilience—not proof you have stopped caring.',
    takeaways: [
      'Laughter during grief is normal, not disrespectful.',
      'Joy and mourning can alternate within the same day or hour.',
      'Living fully can be a tribute to the love you shared.',
      'Guilt about fun often reflects how much they meant to you.',
    ],
    happening:
      'A joke or social outing may trigger immediate shame afterward.\n\nYou may avoid situations where laughter feels possible.',
    help:
      'Allow laughter without treating it as betrayal—grief is not monotone.\n\nInclude them in joyful moments through memory or ritual if helpful.\n\nExplain to trusted friends that joy and grief coexist.\n\nSeek bereavement support if guilt isolates you from all pleasure.\n\nChallenge beliefs that constant sadness is the only valid tribute.\n\nNotice that avoiding joy does not bring them back or honor them more.',
    support:
      `${SUPPORT}\n\nSeek grief counseling if guilt about laughing prevents social connection or daily functioning.`,
    related: [
      'Why do I feel guilty for having moments of happiness after someone died?',
      'How do I cope with grief?',
      'Is it okay to enjoy life while grieving?',
      'How do I handle survivor guilt?',
      'How do I find a grief counselor?',
    ],
    schemaAnswer:
      'Guilt about laughing after a death is common in grief—moments of joy honor love and show healing, not disrespect.',
    themes: ['Grief', 'Laughter', 'Survivor guilt', 'Healing'],
    refs: [GRIEF, NIMH],
  }),
  'why-do-i-feel-guilty-for-moving-on-after-someone-died': draft({
    question: 'Why do I feel guilty for moving on after someone died?',
    slug: 'why-do-i-feel-guilty-for-moving-on-after-someone-died',
    category: 'Grief & Loss',
    title: 'Guilty About Moving On After Death',
    meta: 'Survivor\'s guilt and loyalty to the deceased can make moving forward feel like betrayal—but healing can honor their memory.',
    summary:
      'Feeling guilty about moving on after losing someone important is one of the most painful aspects of grief. Pursuing new relationships, achieving goals, or finding joy can feel like betrayal. Moving forward does not mean forgetting—it means integrating their love into a life that continues to grow.',
    takeaways: [
      'Moving on is not the same as moving past or forgetting.',
      'Ongoing sadness is not the only way to show love.',
      'Living fully can be one of the most beautiful tributes.',
      'Healing transforms love into something that coexists with hope.',
    ],
    happening:
      'A new relationship or major achievement may feel stolen from the deceased.\n\nYou may believe loyalty requires staying frozen in grief.',
    help:
      'Redefine honoring memory: carrying love forward while living openly.\n\nInclude them in milestones through ritual, donation, or private acknowledgment.\n\nSeek grief therapy if guilt blocks all forward movement for many months.\n\nDistinguish healthy continuing bonds from harmful self-punishment.\n\nAllow new joy without requiring permission from others\' grief timelines.\n\nNotice that isolation in grief rarely serves the person you lost.',
    support:
      `${SUPPORT}\n\nSeek grief counseling if inability to move forward impairs relationships, work, or daily life for extended periods.`,
    related: [
      'Why do I feel guilty for being happy after someone died?',
      'How do I cope with grief?',
      'How do I date after losing a spouse?',
      'How do I handle survivor guilt?',
      'How do I find a grief counselor?',
    ],
    schemaAnswer:
      'Guilt about moving on after a death reflects survivor\'s guilt—healing and living fully can honor memory without forgetting or loving less.',
    themes: ['Grief', 'Moving on', 'Survivor guilt', 'Continuing bonds'],
    refs: [GRIEF, NIMH],
  }),
  'why-do-i-feel-guilty-for-questioning-my-religious--186602-025': draft({
    question: 'Why do I feel guilty for questioning my religious upbringing?',
    slug: 'why-do-i-feel-guilty-for-questioning-my-religious--186602-025',
    category: 'Spiritual Struggle / Existential Crisis',
    title: 'Guilty About Questioning Religion',
    meta: 'Guilt about questioning religion often stems from fear of disappointing family, losing community, or betraying deeply held beliefs.',
    summary:
      'Feeling guilty about questioning your religious upbringing is understandable—religion often forms family identity and community belonging. Fear of disappointing parents, losing support, or divine punishment can make doubt feel sinful. Questioning is a natural part of intellectual and spiritual development.',
    takeaways: [
      'Religious guilt often reflects fear of exile from family and community.',
      'Communities that label doubt as sin increase shame unnecessarily.',
      'You can honor positive upbringing while exploring current authenticity.',
      'Many thinkers and believers have navigated periods of questioning.',
    ],
    happening:
      'Forbidden questions may create secret shame and cognitive dissonance.\n\nThreats of hell, exile, or disappointing parents can silence exploration.',
    help:
      'Find communities—online or in person—for faith deconstruction support.\n\nJournal questions without requiring immediate answers.\n\nSet boundaries with people who weaponize guilt against your exploration.\n\nSeek therapists familiar with religious trauma or spiritual crisis.\n\nMove at your own pace; deconstruction is not always total rejection.\n\nIdentify values you want to keep regardless of belief changes.',
    support:
      `${SUPPORT}\n\nSeek specialized support if religious guilt causes severe isolation, self-harm thoughts, or family estrangement crisis.`,
    related: [
      'Why do I feel guilty for doubting my faith?',
      'How do I cope with spiritual crisis?',
      'How do I set boundaries with religious family?',
      'How do I find community after leaving religion?',
      'How do I rebuild identity after faith changes?',
    ],
    schemaAnswer:
      'Guilt about questioning religious upbringing stems from loyalty and community fears—doubt is a natural part of spiritual development, not moral failure.',
    themes: ['Faith deconstruction', 'Spiritual crisis', 'Guilt', 'Family'],
    gaps: ['No dedicated faith-deconstruction clinical source cited; verify framing with editorial standards.'],
  }),
  'why-do-i-feel-guilty-for-taking-care-of-184730-001': draft({
    question: 'Why do I feel guilty for taking care of myself?',
    slug: 'why-do-i-feel-guilty-for-taking-care-of-184730-001',
    category: 'Identity & Self-Worth',
    title: 'Guilty About Self-Care',
    meta: 'Self-care guilt often stems from beliefs that your needs do not matter or that caring for yourself is selfish.',
    summary:
      'Self-care guilt is common and usually rooted in beliefs that putting others first is virtuous while attending to your own needs is selfish. Culture glorifies self-sacrifice, making rest, saying no, or spending on yourself trigger intense guilt—even when you are depleted.',
    takeaways: [
      'Self-care is maintenance, not indulgence—you cannot pour from an empty cup.',
      'Caretaker roles in childhood often teach that your needs come last.',
      'Guilt during self-care is a signal to practice anyway, not to stop.',
      'Meeting your needs improves your presence for others.',
    ],
    happening:
      'Resting may feel stolen from responsibilities or loved ones.\n\nSaying no can trigger immediate shame even when yes would harm you.',
    help:
      'Start small: five-minute breaks, one boundary, one nourishing meal.\n\nReframe self-care as responsibility to your future self and relationships.\n\nNotice guilt without obeying it—practice care despite discomfort.\n\nChallenge "selfish" labels with evidence of your ongoing care for others.\n\nSchedule self-care like appointments so it is not negotiable each time.\n\nSeek therapy if guilt makes basic needs feel permanently forbidden.',
    support:
      `${SUPPORT}\n\nSeek help if self-care guilt drives exhaustion, resentment, or health neglect.`,
    related: [
      'Why do I feel guilty when I put myself first?',
      'How do I practice self-compassion?',
      'How do I set boundaries without guilt?',
      'How do I stop people-pleasing?',
      'How do I recover from burnout?',
    ],
    schemaAnswer:
      'Self-care guilt reflects beliefs that your needs do not matter—caring for yourself is necessary, not selfish, and supports your wellbeing and relationships.',
    themes: ['Self-care', 'Guilt', 'Self-worth', 'Boundaries'],
  }),
  'why-do-i-feel-guilty-for-taking-time-off-189668-007': draft({
    question: 'Why do I feel guilty for taking time off when I\'m sick?',
    slug: 'why-do-i-feel-guilty-for-taking-time-off-189668-007',
    category: 'Work & Burnout',
    title: 'Guilty About Sick Time',
    meta: 'Sick-day guilt often stems from productivity culture and workplace pressure—rest when ill is responsible, not lazy.',
    summary:
      'Feeling guilty for taking time off when sick reflects how productivity culture ties worth to output. Understaffing, guilt-tripping, and fear of being replaceable reinforce the shame. Working while ill prolongs recovery, reduces effectiveness, and can spread illness.',
    takeaways: [
      'Sick rest is an investment in faster recovery and better performance.',
      'Workplace cultures that punish sick leave reflect systemic problems.',
      'Childhood messages about pushing through discomfort fuel adult guilt.',
      'Using earned sick leave is a right, not a moral failing.',
    ],
    happening:
      'You may work through fever, migraines, or infections to avoid judgment.\n\nColleagues\' coverage burdens may feel heavier than your own health needs.',
    help:
      'Use sick leave as earned benefit—no performance of suffering required.\n\nCommunicate briefly and professionally without excessive apology.\n\nRest actively: sleep, fluids, medication—not laptop in bed.\n\nTrack whether guilt exceeds actual workplace consequences.\n\nAdvocate for healthier team norms if you have influence.\n\nEvaluate employers that consistently punish legitimate sick time.',
    support:
      `${SUPPORT}\n\nSeek medical care if illness persists beyond expected recovery or worsens despite rest.`,
    related: [
      'Why do I feel guilty about taking sick days for mental health?',
      'How do I recover from burnout?',
      'How do I set boundaries at work?',
      'How do I cope with a toxic workplace?',
      'Why do I feel exhausted all the time?',
    ],
    schemaAnswer:
      'Guilt about sick time reflects productivity culture—rest when ill is responsible self-care that protects health and long-term performance.',
    themes: ['Sick leave', 'Work culture', 'Guilt', 'Burnout'],
    refs: [BURNOUT, CDC],
  }),
  'why-do-i-feel-guilty-when-i-put-myself-first': draft({
    question: 'Why do I feel guilty when I put myself first?',
    slug: 'why-do-i-feel-guilty-when-i-put-myself-first',
    category: 'General Mental Health',
    title: 'Guilty When Putting Yourself First',
    meta: 'Guilt about prioritizing your needs is common—especially if you learned self-care is selfish or your worth comes from caring for others.',
    summary:
      'Feeling guilty when you put yourself first is common, especially for people raised to believe self-care is selfish or who derive worth from caretaking. The guilt often reflects fear of disappointing others, being seen as selfish, or losing relationships—not evidence that prioritizing yourself is wrong.',
    takeaways: [
      'Putting yourself first enables sustainable care for others.',
      'Guilt often traces to childhood roles as family peacemaker or caretaker.',
      'You would likely want loved ones to care for themselves—extend the same grace.',
      'Small boundary experiments build tolerance for prioritization discomfort.',
    ],
    happening:
      'Choosing your needs may trigger immediate fear of rejection or conflict.\n\nOthers\' disappointment can feel like proof you were wrong to prioritize yourself.',
    help:
      'Start with low-stakes self-prioritization: one no, one rest block, one personal purchase.\n\nExamine childhood messages about whose needs mattered most.\n\nReframe self-first as necessary maintenance, not selfish indulgence.\n\nPractice tolerating others\' disappointment without automatic reversal.\n\nNotice resentment as a signal you have over-given.\n\nSeek therapy if guilt makes self-neglect chronic or relationships one-sided.',
    support:
      `${SUPPORT}\n\nSeek help if inability to prioritize yourself drives burnout, resentment, or health decline.`,
    related: [
      'Why do I feel guilty for taking care of myself?',
      'How do I set boundaries without guilt?',
      'How do I stop people-pleasing?',
      'How do I practice self-compassion?',
      'How do I recover from burnout?',
    ],
    schemaAnswer:
      'Guilt about putting yourself first often reflects learned beliefs that self-care is selfish—prioritizing your needs is necessary for wellbeing and sustainable relationships.',
    themes: ['Self-prioritization', 'Guilt', 'Boundaries', 'People-pleasing'],
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
  'reports/enrichment-corpus/draft-answers/batch-32-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-32-drafts.json`);
