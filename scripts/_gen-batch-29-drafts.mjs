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
const BULLYING = {
  title: 'Preventing Bullying',
  url: 'https://www.stopbullying.gov/resources/teens',
  publisher: 'StopBullying.gov',
  note: 'Supports bullying prevention and response strategies.',
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
  readFileSync('reports/enrichment-corpus/batches/batch-26-input.json', 'utf8'),
);

const contentBySlug = {
  'what-should-i-do-if-my-child-doesnt-want-to-visit-their-other-parent': draft({
    question: "What should I do if my child doesn't want to visit their other parent?",
    slug: 'what-should-i-do-if-my-child-doesnt-want-to-visit-their-other-parent',
    category: 'Family & Parenting',
    title: 'When Your Child Refuses Visits',
    meta: 'When a child resists visiting their other parent, listen to their concerns, distinguish normal transition stress from safety issues, and follow court orders while protecting wellbeing.',
    summary:
      'When your child does not want to visit their other parent, listen carefully to understand why—transition anxiety, loyalty conflicts, and legitimate safety concerns look different. Support your child emotionally while honoring legal obligations, and seek professional or legal help when concerns are serious.',
    takeaways: [
      'Listen first—dismissing reluctance can shut down important disclosures.',
      'Normal transition stress differs from fear based on real harm.',
      'Avoid speaking negatively about the other parent in front of your child.',
      'Court orders still apply—work with attorneys or mediators when conflicts arise.',
    ],
    happening:
      'Your child may cry, refuse to get in the car, or give vague reasons like "I just do not want to go."\n\nLoyalty conflicts after divorce can make visits feel like betraying one parent.',
    help:
      'Ask open questions about what specifically feels hard about visits.\n\nValidate feelings without immediately promising they can skip court-ordered time.\n\nDistinguish transition anxiety from reports of harm, neglect, or fear.\n\nKeep your own feelings about your ex separate from your child\'s experience.\n\nEncourage relationship with the other parent when safe—children benefit from both when possible.\n\nConsult a family therapist or attorney if refusal persists or safety is involved.',
    support:
      `${SUPPORT}\n\nContact child protective services or an attorney immediately if your child reports abuse, neglect, or credible fear for their safety.`,
    related: [
      'How do I help my child through divorce?',
      'What should I do if my ex-spouse is turning my children against me?',
      'How do I co-parent with a difficult ex?',
      'How do I talk to my child about difficult topics?',
      'How do I support my child through a custody transition?',
    ],
    schemaAnswer:
      'When your child resists visits, listen to their concerns, separate normal transition stress from safety issues, avoid badmouthing the other parent, and seek legal or therapeutic help when needed.',
    themes: ['Co-parenting', 'Custody', 'Child wellbeing', 'Divorce'],
  }),
  'what-should-i-do-if-my-child-is-being-bullied': draft({
    question: 'What should I do if my child is being bullied?',
    slug: 'what-should-i-do-if-my-child-is-being-bullied',
    category: 'Family & Parenting',
    title: 'If Your Child Is Being Bullied',
    meta: 'If your child is being bullied, listen and validate, document incidents, contact the school, teach assertive responses, and build confidence—not blame.',
    summary:
      'If your child is being bullied, listen without minimizing, document what happened, contact school officials with a clear plan, teach assertive responses, and build their confidence through supportive activities. Your calm, strategic response helps more than an emotional reaction.',
    takeaways: [
      'Believe and validate—"ignore it" often leaves children feeling alone.',
      'Documentation strengthens school reports and follow-up.',
      'Assertive responses work better than fighting back physically.',
      'Building confidence and friendships reduces vulnerability over time.',
    ],
    happening:
      'Your child may become withdrawn, refuse school, have unexplained injuries, or seem anxious about devices and social media.\n\nBullying can be in-person, online, or through social exclusion.',
    help:
      'Listen fully before problem-solving—let them share without blame.\n\nDocument dates, locations, witnesses, and save screenshots of cyberbullying.\n\nContact teachers, counselors, or principals with specific incidents and requested actions.\n\nTeach assertive phrases: "Stop. I do not like that" and reporting to adults.\n\nBuild confidence through activities they enjoy and friendships they choose.\n\nRole-play responses so they feel prepared without encouraging physical retaliation.',
    support:
      `${SUPPORT}\n\nSeek urgent help if bullying involves threats, physical assault, or suicidal thoughts—and contact school authorities and law enforcement when safety is at risk.`,
    related: [
      'What should I do if I think I am being bullied?',
      'How do I help my child cope with cyberbullying?',
      'How do I build my child\'s self-esteem?',
      'How do I talk to my child about mental health?',
      'How do I support my anxious child?',
    ],
    schemaAnswer:
      'If your child is bullied, listen and validate, document incidents, contact school officials, teach assertive responses, and build confidence through supportive activities and friendships.',
    themes: ['Bullying', 'Parenting', 'School safety', 'Child advocacy'],
    refs: [BULLYING, NIMH],
    flags: ['youth-safety'],
  }),
  'what-should-i-do-if-my-ex-is-undermining-my-parenting': draft({
    question: 'What should I do if my ex is undermining my parenting?',
    slug: 'what-should-i-do-if-my-ex-is-undermining-my-parenting',
    category: 'Family & Parenting',
    title: 'Ex Undermining Your Parenting',
    meta: 'When an ex undermines your parenting, document incidents, communicate about impact on children, maintain your own consistency, and use mediation or legal channels when needed.',
    summary:
      'When your ex undermines your parenting—contradicting rules, criticizing you to the children, or refusing to support agreed approaches—it harms children and your authority. Document patterns, communicate about child impact, stay consistent in your home, and use mediation or legal help when direct talks fail.',
    takeaways: [
      'Undermining confuses children and erodes stable boundaries.',
      'Focus on child impact—not winning arguments with your ex.',
      'Consistency in your home matters even when rules differ elsewhere.',
      'Documentation supports mediation and court intervention if needed.',
    ],
    happening:
      'Your ex may tell children your rules do not matter, reward behavior you discipline, or criticize your parenting in front of them.\n\nChildren may play parents against each other or test boundaries more.',
    help:
      'Document specific undermining incidents with dates and details.\n\nUse co-parenting apps or email for factual, child-focused communication.\n\nExplain your house rules calmly without attacking your ex to the children.\n\nMaintain consistent routines and consequences in your home.\n\nRequest mediation or co-parenting counseling for recurring patterns.\n\nConsult your attorney if undermining violates custody agreements.',
    support:
      `${SUPPORT}\n\nSeek family therapy or legal counsel if undermining escalates to parental alienation or puts children in the middle of chronic conflict.`,
    related: [
      'What should I do if my ex-spouse is turning my children against me?',
      'How do I co-parent with a difficult ex?',
      'How do I set boundaries with my ex?',
      'How do I help my child through divorce?',
      'How do I communicate with a high-conflict co-parent?',
    ],
    schemaAnswer:
      'When an ex undermines parenting, document incidents, communicate about child impact, stay consistent at home, and use mediation or legal channels when direct communication fails.',
    themes: ['Co-parenting', 'Boundaries', 'High-conflict divorce', 'Parenting authority'],
  }),
  'what-should-i-do-if-my-ex-spouse-is-turning-my-children-against-me': draft({
    question: 'What should I do if my ex-spouse is turning my children against me?',
    slug: 'what-should-i-do-if-my-ex-spouse-is-turning-my-children-against-me',
    category: 'Family & Parenting',
    title: 'Parental Alienation Concerns',
    meta: 'If an ex turns children against you, document alienating behavior, stay calm and loving, avoid retaliation, and seek legal and therapeutic help for parental alienation.',
    summary:
      'When an ex-spouse turns children against you—parental alienation—it is deeply painful. Document alienating behaviors, stay calm and consistently loving, avoid badmouthing back, and seek legal and therapeutic intervention. Rebuilding trust takes time and professional support.',
    takeaways: [
      'Parental alienation involves systematic rejection encouraged by one parent.',
      'Retaliating with criticism of your ex usually worsens children\'s distress.',
      'Consistent loving contact matters even when children resist.',
      'Documentation and specialists support legal and therapeutic intervention.',
    ],
    happening:
      'Children may suddenly refuse contact, parrot negative statements about you, or show unwarranted fear or anger.\n\nYour ex may interfere with calls, visits, or share adult conflicts with the children.',
    help:
      'Document alienating statements, blocked contact, and changed behavior with dates.\n\nStay calm—respond to false claims factually without attacking your ex.\n\nMaintain scheduled contact and positive experiences when access is allowed.\n\nAvoid putting children in the middle or asking them to choose sides.\n\nSeek a therapist specializing in parental alienation for you and the children.\n\nConsult your attorney about contempt motions or custody modifications when warranted.',
    support:
      `${SUPPORT}\n\nSeek legal and therapeutic intervention promptly if alienation is severe—early response improves outcomes for parent-child relationships.`,
    related: [
      'What should I do if my ex is undermining my parenting?',
      'How do I rebuild my relationship with my child after divorce?',
      'How do I co-parent with a difficult ex?',
      'How do I help my child through divorce?',
      'How do I cope with being rejected by my child?',
    ],
    schemaAnswer:
      'If an ex turns children against you, document alienating behavior, stay calm and loving, avoid retaliatory criticism, and seek legal and therapeutic help for parental alienation.',
    themes: ['Parental alienation', 'Co-parenting', 'Custody', 'Family conflict'],
  }),
  'what-should-i-do-if-my-ex-spouse-isnt-paying-child-support': draft({
    question: "What should I do if my ex-spouse isn't paying child support?",
    slug: 'what-should-i-do-if-my-ex-spouse-isnt-paying-child-support',
    category: 'Family & Parenting',
    title: 'Unpaid Child Support',
    meta: 'When child support goes unpaid, document missed payments, contact your state enforcement agency, and explore wage garnishment—support is a legal obligation owed to your children.',
    summary:
      'When your ex-spouse does not pay court-ordered child support, document every missed payment and contact your state child support enforcement agency. Agencies can garnish wages, intercept tax refunds, and pursue legal remedies. Support is your children\'s right—not a favor.',
    takeaways: [
      'Child support is a legal obligation—non-payment has enforcement tools.',
      'State enforcement agencies provide free or low-cost collection help.',
      'Documentation of missed payments strengthens enforcement actions.',
      'Financial hardship on your end does not remove their legal duty to pay.',
    ],
    happening:
      'Missed or partial payments may create mounting bills, housing stress, and resentment.\n\nYour ex may claim inability to pay while lifestyle suggests otherwise.',
    help:
      'Keep records of every due date, amount owed, and payment received.\n\nContact your state child support enforcement office to open or update a case.\n\nExplore wage garnishment, license suspension, or tax refund interception.\n\nAvoid withholding visitation as retaliation—support and custody are separate legally.\n\nDiscuss modification only through court if their income genuinely changed.\n\nSeek financial counseling if gaps strain your household budget.',
    support:
      `${SUPPORT}\n\nConsult an attorney for contempt proceedings if informal enforcement fails and arrears are substantial.`,
    related: [
      'How do I cope with financial stress after divorce?',
      'How do I co-parent with a difficult ex?',
      'How do I set boundaries with my ex?',
      'How do I help my children through financial hardship?',
      'How do I manage stress during divorce?',
    ],
    schemaAnswer:
      'When child support goes unpaid, document missed payments, contact state enforcement agencies, and pursue wage garnishment and legal remedies—support is a legal obligation owed to your children.',
    themes: ['Child support', 'Divorce', 'Financial stress', 'Legal enforcement'],
  }),
  'what-should-i-do-if-my-loved-one-refuses-treatment': draft({
    question: 'What should I do if my loved one refuses treatment?',
    slug: 'what-should-i-do-if-my-loved-one-refuses-treatment',
    category: 'Therapy & Mental Health',
    title: 'Loved One Refuses Treatment',
    meta: 'When a loved one refuses treatment, you cannot force recovery—set boundaries, stop enabling, offer support for when they are ready, and care for your own wellbeing.',
    summary:
      'When someone you love refuses mental health or addiction treatment, you cannot force their recovery. Express concern clearly, set boundaries around unacceptable behavior, stop enabling, and take care of your own wellbeing. Offer support for when they choose help.',
    takeaways: [
      'Recovery must be their choice—forced treatment often fails long term.',
      'Boundaries protect you without abandoning love.',
      'Enabling makes continued harmful behavior easier.',
      'Your wellbeing matters—support groups and therapy help caregivers too.',
    ],
    happening:
      'You may feel helpless watching someone decline while refusing every offer of help.\n\nFear, anger, and guilt can cycle as you try harder and see no change.',
    help:
      'State concern once clearly: "I am worried. I am here when you are ready."\n\nSet boundaries on behavior you will not accept at home or financially.\n\nStop covering consequences—bailouts and excuses often delay motivation to change.\n\nLearn about intervention options with a trained professional if crisis is severe.\n\nAttend Al-Anon, Nar-Anon, or family support groups for your own stability.\n\nPrepare resources they can access when readiness appears.',
    support:
      `${SUPPORT}\n\nSeek emergency help if your loved one is suicidal, violent, or incapacitated—involuntary hold laws may apply in acute danger.`,
    related: [
      'How do I help someone who is depressed but refuses help?',
      'How do I set boundaries with a family member in addiction?',
      'What is an intervention and when is it appropriate?',
      'How do I cope with a loved one\'s mental illness?',
      'How do I stop enabling someone I love?',
    ],
    schemaAnswer:
      'When a loved one refuses treatment, set boundaries, stop enabling, express concern without nagging, care for your own wellbeing, and offer support for when they choose help.',
    themes: ['Treatment refusal', 'Boundaries', 'Enabling', 'Family support'],
    refs: [SAMHSA, NIMH],
  }),
  'what-should-i-do-if-my-partner-always-takes-their-familys-side': draft({
    question: "What should I do if my partner always takes their family's side?",
    slug: 'what-should-i-do-if-my-partner-always-takes-their-familys-side',
    category: 'Relationships & Communication',
    title: 'Partner Always Sides With Family',
    meta: 'When your partner always sides with their family over you, name the pattern, discuss primary loyalty in partnership, set boundaries with in-laws, and seek couples therapy.',
    summary:
      'When your partner consistently takes their family\'s side against you, it can feel like betrayal. Name the pattern with specific examples, discuss how partnership requires prioritizing your relationship in conflicts, set boundaries with in-laws, and consider couples therapy for entrenched loyalty conflicts.',
    takeaways: [
      'Partnership usually requires shifting primary loyalty from family of origin.',
      'Specific examples work better than "you always" accusations.',
      'Boundaries with in-laws protect the couple—not cut off family entirely.',
      'Couples therapy helps when loyalty conflicts repeat without resolution.',
    ],
    happening:
      'Disagreements with in-laws may end with your partner defending them and dismissing your feelings.\n\nYou may feel like an outsider in your own relationship.',
    help:
      'Use specific examples: "When your mother criticized me, you agreed with her."\n\nDiscuss what feeling supported by your partner looks like in conflicts.\n\nSet couple boundaries on family involvement in private decisions.\n\nAvoid demanding they cut off family—focus on behavior changes you need.\n\nSeek couples therapy to unpack loyalty patterns from upbringing.\n\nBuild your own support network so isolation does not trap you.',
    support:
      `${SUPPORT}\n\nSeek therapy individually if the pattern enables disrespect, financial control, or emotional abuse from your partner\'s family.`,
    related: [
      'How do I set boundaries with in-laws?',
      'How do I communicate my needs in a relationship?',
      'What if my partner\'s family doesn\'t accept me?',
      'How do I know if my relationship is healthy?',
      'How do I handle conflict with my partner\'s family?',
    ],
    schemaAnswer:
      'When your partner always sides with family, name the pattern with examples, discuss partnership loyalty, set in-law boundaries, and seek couples therapy for recurring conflicts.',
    themes: ['In-law conflict', 'Loyalty', 'Couples communication', 'Boundaries'],
  }),
  'what-should-i-do-if-my-partner-and-i-have-different-love-languages': draft({
    question: 'What should I do if my partner and I have different love languages?',
    slug: 'what-should-i-do-if-my-partner-and-i-have-different-love-languages',
    category: 'Relationships & Communication',
    title: 'Different Love Languages',
    meta: 'Different love languages cause disconnect when partners express love in ways the other does not receive—learn each other\'s preferences and practice speaking their language.',
    summary:
      'When partners have different love languages—words, touch, acts of service, gifts, or quality time—both may feel unloved despite trying. Identify each other\'s primary languages, express love in their preferred form, and communicate your own needs clearly. Intentional practice bridges the gap.',
    takeaways: [
      'Love languages describe how people prefer to give and receive love.',
      'Speaking your partner\'s language matters more than your natural style.',
      'Misunderstanding languages creates "I try but you don\'t notice" frustration.',
      'Consistent small gestures in their language beat occasional grand ones in yours.',
    ],
    happening:
      'You may give gifts while they want quality time—or offer praise while they crave physical affection.\n\nBoth partners can feel unappreciated despite genuine effort.',
    help:
      'Discuss which expressions of love feel most meaningful to each of you.\n\nObserve what your partner requests and how they naturally show love.\n\nPractice their language deliberately—even if it feels unfamiliar.\n\nAsk directly: "What makes you feel most loved by me?"\n\nAppreciate their efforts in their natural language while requesting yours.\n\nUse love languages as a tool, not a rigid scorecard for the relationship.',
    support:
      `${SUPPORT}\n\nSeek couples therapy if love-language differences mask deeper emotional disconnection or chronic resentment.`,
    related: [
      'How do I improve communication in my relationship?',
      'How do I express love when my partner and I are different?',
      'How do I reconnect with my partner emotionally?',
      'How do I know if my partner loves me?',
      'How do I communicate my needs in a relationship?',
    ],
    schemaAnswer:
      'When love languages differ, identify each other\'s preferences, express love in their language intentionally, communicate your own needs, and practice consistent small gestures that resonate.',
    themes: ['Love languages', 'Emotional connection', 'Relationships', 'Communication'],
  }),
  'what-should-i-do-if-my-partner-and-i-have-mismatched-libidos': draft({
    question: 'What should I do if my partner and I have mismatched libidos?',
    slug: 'what-should-i-do-if-my-partner-and-i-have-mismatched-libidos',
    category: 'Relationships & Communication',
    title: 'Mismatched Libidos',
    meta: 'Mismatched libidos are common—communicate without blame, expand intimacy beyond sex, compromise on frequency, and address medical or stress factors together.',
    summary:
      'Mismatched libidos—different levels of sexual desire—are common in long-term relationships. Communicate without blame, explore underlying causes like stress or health, expand intimacy beyond intercourse, and find compromise on frequency and connection that honors both partners.',
    takeaways: [
      'Libido differences are normal—not proof the relationship is broken.',
      'Stress, medications, and health issues often affect desire.',
      'Intimacy includes non-sexual closeness that sustains connection.',
      'Compromise means both partners adjust—not only the lower-desire person.',
    ],
    happening:
      'One partner may feel rejected while the other feels pressured or inadequate.\n\nResentment can build when initiation and refusal become a chronic cycle.',
    help:
      'Discuss desire differences without blame—use "I feel" statements.\n\nRule out medical factors: hormones, medications, depression, sleep, stress.\n\nExpand intimacy: cuddling, massage, shared activities without pressure for sex.\n\nNegotiate frequency and initiation styles that reduce pressure.\n\nSchedule intimate time when spontaneous desire is low for either partner.\n\nConsider sex therapy or couples counseling for persistent distress.',
    support:
      `${SUPPORT}\n\nSeek therapy if mismatched libidos fuels contempt, coercion, or emotional withdrawal that harms the relationship.`,
    related: [
      'How do I talk to my partner about sex?',
      'How do I maintain intimacy in a long-term relationship?',
      'What if my partner doesn\'t want to have sex as much as I do?',
      'How do I improve communication in my relationship?',
      'How does depression affect libido?',
    ],
    schemaAnswer:
      'For mismatched libidos, communicate without blame, address health and stress factors, expand non-sexual intimacy, and compromise on frequency with couples or sex therapy when needed.',
    themes: ['Libido mismatch', 'Intimacy', 'Sexual health', 'Couples communication'],
  }),
  'what-should-i-do-if-my-partner-doesnt-listen-to-me': draft({
    question: "What should I do if my partner doesn't listen to me?",
    slug: 'what-should-i-do-if-my-partner-doesnt-listen-to-me',
    category: 'Relationships & Communication',
    title: 'Partner Does Not Listen',
    meta: 'Feeling unheard breeds loneliness—ask for attention before important talks, state what kind of response you need, and address ADHD, stress, or dismissive patterns.',
    summary:
      'Feeling unheard by your partner is lonely and frustrating. Ask for their attention before important conversations, specify whether you need listening or advice, choose better timing, and address whether ADHD, stress, or dismissive habits drive the pattern. Couples therapy helps when it persists.',
    takeaways: [
      'Some people listen differently—silence may not mean ignoring you.',
      'Timing and distraction often block effective listening.',
      'Stating "I need you to listen, not fix" clarifies expectations.',
      'Chronic dismissiveness may signal deeper disrespect needing therapy.',
    ],
    happening:
      'You may repeat yourself, feel invisible during conversations, or stop sharing altogether.\n\nPhone use, TV, or multitasking during talks can amplify feeling unheard.',
    help:
      'Ask: "Is now a good time? I need to share something important."\n\nState what you need: empathy, brainstorming, or just listening.\n\nKeep initial points focused—one topic at a time.\n\nExpress impact: "I feel disconnected when I do not feel heard."\n\nExplore whether ADHD, anxiety, or exhaustion affects their attention.\n\nSeek couples therapy if dismissiveness is chronic or contemptuous.',
    support:
      `${SUPPORT}\n\nSeek therapy if feeling unheard enables emotional neglect or you have stopped advocating for basic needs in the relationship.`,
    related: [
      'How do I communicate my needs in a relationship?',
      'How do I have difficult conversations with my partner?',
      'How do I know if my partner is emotionally unavailable?',
      'How do I improve communication in my relationship?',
      'How do I stop feeling lonely in my relationship?',
    ],
    schemaAnswer:
      'When your partner does not listen, ask for attention before talks, specify the response you need, improve timing, and address ADHD or dismissive patterns with couples therapy if chronic.',
    themes: ['Active listening', 'Communication', 'Emotional connection', 'Relationships'],
  }),
  'what-should-i-do-if-my-partner-has-anger-issues': draft({
    question: 'What should I do if my partner has anger issues?',
    slug: 'what-should-i-do-if-my-partner-has-anger-issues',
    category: 'Relationships & Communication',
    title: 'Partner Has Anger Issues',
    meta: 'A partner with anger issues may yell, intimidate, or explode—prioritize safety, set boundaries, avoid managing their emotions, and encourage professional help.',
    summary:
      'Living with a partner who has anger issues can be frightening. Prioritize your safety, set clear boundaries about unacceptable behavior, avoid trying to manage their emotions for them, and encourage professional help. Physical violence or threats require a safety plan and domestic violence resources.',
    takeaways: [
      'Anger problems differ from occasional frustration—they are frequent and intense.',
      'You cannot fix your partner\'s anger—only they can change with help.',
      'Boundaries include leaving during outbursts when safe to do so.',
      'Violence or threats require safety planning—not couples work first.',
    ],
    happening:
      'Yelling, throwing objects, intimidation, or walking on eggshells may dominate daily life.\n\nYou may minimize behavior because apologies and honeymoon phases follow explosions.',
    help:
      'Prioritize safety—leave or call emergency services if violence or threats occur.\n\nSet boundaries: "I will not continue this conversation while you are yelling."\n\nDocument incidents if behavior escalates or involves threats.\n\nEncourage anger management or therapy without taking responsibility for their progress.\n\nBuild support outside the relationship so isolation does not trap you.\n\nCreate a safety plan with trusted contacts and resources if needed.',
    support:
      `${SUPPORT}\n\nContact the National Domestic Violence Hotline at 1-800-799-7233 if anger includes violence, threats, or control—and seek emergency help when unsafe.`,
    related: [
      'How do I know if my relationship is abusive?',
      'How do I set boundaries in my relationship?',
      'What should I do if I am in a toxic relationship?',
      'How do I safely leave an abusive relationship?',
      'How do I help my partner get anger management?',
    ],
    schemaAnswer:
      'When a partner has anger issues, prioritize safety, set boundaries about yelling and intimidation, encourage professional help, and contact 1-800-799-7233 if violence or threats occur.',
    themes: ['Anger management', 'Relationship safety', 'Boundaries', 'Domestic violence'],
    flags: ['relationship-safety'],
  }),
  'what-should-i-do-if-my-partner-is-emotionally-unavailable': draft({
    question: 'What should I do if my partner is emotionally unavailable?',
    slug: 'what-should-i-do-if-my-partner-is-emotionally-unavailable',
    category: 'Relationships & Communication',
    title: 'Emotionally Unavailable Partner',
    meta: 'An emotionally unavailable partner avoids depth and vulnerability—communicate needs clearly, assess willingness to change, and decide if the gap is bridgeable.',
    summary:
      'An emotionally unavailable partner may avoid deep conversations, struggle with vulnerability, or seem distant even when present. Communicate your needs clearly, assess whether they acknowledge the issue and want to change, and decide if the emotional gap is bridgeable—or if you need to protect your own wellbeing.',
    takeaways: [
      'Emotional unavailability shows as avoidance, deflection, or detachment.',
      'Past trauma or upbringing may explain—but not excuse—chronic distance.',
      'Willingness to work on connection matters more than promises alone.',
      'You cannot love someone into emotional availability.',
    ],
    happening:
      'Serious talks may get deflected with humor, silence, or changing the subject.\n\nYou may feel lonely despite being in a committed relationship.',
    help:
      'Name what you need specifically: "I want us to talk about feelings without you shutting down."\n\nNotice whether they acknowledge the pattern or dismiss your concerns.\n\nGive reasonable time for change if they commit to therapy or couples work.\n\nBuild emotional support outside the relationship through friends and therapy.\n\nAvoid chasing or over-functioning emotionally to compensate for their distance.\n\nEvaluate whether the gap is tolerable long term or a dealbreaker.',
    support:
      `${SUPPORT}\n\nSeek individual therapy to clarify whether staying is healthy—and couples therapy only if both partners engage honestly.`,
    related: [
      'How do I know if my relationship is healthy?',
      'How do I communicate my emotional needs?',
      'What should I do if my partner doesn\'t listen to me?',
      'How do I stop feeling lonely in my relationship?',
      'How do I know when to end a relationship?',
    ],
    schemaAnswer:
      'With an emotionally unavailable partner, communicate needs clearly, assess willingness to change through therapy, build outside support, and decide if the emotional gap is bridgeable.',
    themes: ['Emotional unavailability', 'Intimacy', 'Relationships', 'Vulnerability'],
  }),
  'what-should-i-do-if-talk-therapy-doesnt-seem-to-be-helping-my-depression': draft({
    question: "What should I do if talk therapy doesn't seem to be helping my depression?",
    slug: 'what-should-i-do-if-talk-therapy-doesnt-seem-to-be-helping-my-depression',
    category: 'Depression',
    title: 'When Therapy Is Not Helping Depression',
    meta: 'If talk therapy is not helping depression, allow adequate time, evaluate the therapeutic fit, discuss adjustments with your therapist, and consider medication or a different approach.',
    summary:
      'When talk therapy does not seem to help your depression, consider whether you have had enough sessions, whether the therapeutic relationship fits, and whether you are actively engaging. Discuss concerns with your therapist, try different modalities like CBT, and consider combining therapy with medication.',
    takeaways: [
      'Therapy often needs months—not weeks—to show meaningful change.',
      'Therapeutic fit strongly predicts outcomes.',
      'Active homework and honesty between sessions accelerate progress.',
      'Combined therapy and medication often outperforms either alone.',
    ],
    happening:
      'Sessions may feel repetitive, hopeless, or disconnected from daily improvement.\n\nYou may wonder if therapy works at all—or if you are the problem.',
    help:
      'Give evidence-based therapy at least 12–16 sessions before concluding it fails.\n\nDiscuss fit openly: "I am not feeling progress—can we adjust approach?"\n\nTry a different modality: CBT, IPT, ACT, or behavioral activation.\n\nComplete between-session homework and track mood weekly.\n\nConsider a psychiatrist evaluation for medication alongside therapy.\n\nSwitch therapists if rapport is poor despite honest feedback.',
    support:
      `${SUPPORT}\n\nSeek urgent care for suicidal thoughts—and do not stop therapy abruptly without a transition plan if switching providers.`,
    related: [
      'What should I do if antidepressants aren\'t working for me?',
      'How do I find a therapist for depression?',
      'How do I know if my therapist is a good fit?',
      'How do I know if I am depressed?',
      'What is treatment-resistant depression and what are my options?',
    ],
    schemaAnswer:
      'If talk therapy is not helping depression, allow adequate time, evaluate therapeutic fit, discuss adjustments, try different modalities, and consider combining with medication.',
    themes: ['Therapy fit', 'Depression treatment', 'CBT', 'Treatment navigation'],
    refs: [DEPRESSION, NIMH],
  }),
  'what-should-i-do-immediately-after-experiencing-a-traumatic-event': draft({
    question: 'What should I do immediately after experiencing a traumatic event?',
    slug: 'what-should-i-do-immediately-after-experiencing-a-traumatic-event',
    category: 'Trauma & Grief',
    title: 'Right After a Traumatic Event',
    meta: 'After trauma, ensure safety first, seek medical care for injuries, connect with support people, avoid major decisions, and know acute stress reactions are normal.',
    summary:
      'Immediately after a traumatic event, ensure physical safety, seek medical attention for injuries, reach out to trusted support people, and allow normal acute stress reactions. Avoid alcohol, major decisions, and isolation. Follow up with trauma-informed care if symptoms persist beyond the first weeks.',
    takeaways: [
      'Physical safety comes first—remove yourself from ongoing danger.',
      'Acute shock, numbness, and hypervigilance are normal short-term responses.',
      'Social support in the first hours and days aids recovery.',
      'Persistent symptoms after weeks may signal PTSD needing professional care.',
    ],
    happening:
      'You may feel numb, shaky, disconnected, or unable to stop replaying the event.\n\nSleep, appetite, and concentration may disappear in the first days.',
    help:
      'Get to safety and call emergency services if danger continues.\n\nSeek medical evaluation even for injuries that seem minor.\n\nContact someone you trust to stay with you or check in.\n\nMaintain basics: hydration, food, and rest when possible.\n\nLimit media re-exposure if the trauma was a public event.\n\nAvoid alcohol and drugs—they worsen acute stress and sleep.',
    support:
      `${SUPPORT}\n\nSeek trauma-informed therapy if flashbacks, nightmares, or hypervigilance persist beyond a few weeks—or immediately if you have thoughts of self-harm.`,
    related: [
      'How do I know if I have PTSD?',
      'How do I calm my nervous system after trauma?',
      'How do I cope with flashbacks?',
      'How do I find a trauma therapist?',
      'How do I support a friend after trauma?',
    ],
    schemaAnswer:
      'After trauma, ensure safety, seek medical care, connect with support, maintain basics, avoid substances and major decisions, and seek trauma-informed care if symptoms persist.',
    themes: ['Acute trauma', 'Safety', 'PTSD prevention', 'Crisis response'],
    refs: [PTSD, NIMH],
    flags: ['trauma-sensitive'],
  }),
  'what-should-i-do-when-i-feel-like-i-dont-know-who-i-am-anymore': draft({
    question: "What should I do when I feel like I don't know who I am anymore?",
    slug: 'what-should-i-do-when-i-feel-like-i-dont-know-who-i-am-anymore',
    category: 'General Mental Health',
    title: 'Lost Sense of Identity',
    meta: 'Losing your sense of self often follows major transitions—explore values, try new activities, allow evolution, and seek therapy when identity confusion fuels depression.',
    summary:
      'Feeling like you do not know who you are anymore often follows major life transitions, loss, burnout, or trauma. Explore current values and interests, experiment with new roles, allow identity to evolve, and seek therapy when confusion fuels depression or paralysis.',
    takeaways: [
      'Identity shifts are common during transitions—not proof something is wrong with you.',
      'Values often persist even when roles and interests change.',
      'Small experiments reveal what feels authentic now.',
      'Permission to evolve reduces pressure to return to an old self.',
    ],
    happening:
      'Major changes—divorce, job loss, parenthood, grief—may leave you feeling hollow or unrecognizable.\n\nYou may mourn who you were while unsure who you are becoming.',
    help:
      'Journal what activities, people, and values still feel meaningful.\n\nTry low-stakes experiments: classes, volunteering, creative projects.\n\nSeparate who you were from who you might grow into.\n\nReconnect with body and present moment through movement or mindfulness.\n\nTalk with trusted people about the disorientation—naming it reduces shame.\n\nSeek therapy if identity loss drives depression, anxiety, or withdrawal.',
    support:
      `${SUPPORT}\n\nSeek professional help if identity confusion includes suicidal thoughts, severe depression, or inability to function in daily life.`,
    related: [
      'How do I rebuild my identity after a major life change?',
      'How do I find purpose when I feel lost?',
      'How do I cope with a midlife crisis?',
      'How do I recover from burnout?',
      'How do I explore my values and priorities?',
    ],
    schemaAnswer:
      'When you lose your sense of self, explore current values, try new activities, allow identity to evolve, and seek therapy if confusion fuels depression or daily impairment.',
    themes: ['Identity', 'Life transitions', 'Self-discovery', 'Existential distress'],
  }),
  'what-should-i-do-when-i-feel-like-im-not-good-enough': draft({
    question: "What should I do when I feel like I'm not good enough?",
    slug: 'what-should-i-do-when-i-feel-like-im-not-good-enough',
    category: 'General Mental Health',
    title: 'Feeling Not Good Enough',
    meta: 'Feeling not good enough often reflects harsh inner standards—challenge self-critical thoughts, practice self-compassion, and seek therapy when shame is chronic.',
    summary:
      'Feeling not good enough is painful and common, often rooted in perfectionism, past criticism, or comparison. Challenge the evidence for harsh self-judgments, practice self-compassion, set realistic goals, and seek therapy when chronic inadequacy drives depression or avoidance.',
    takeaways: [
      'Inadequacy feelings rarely match how others see you.',
      'Perfectionism sets standards no one could consistently meet.',
      'Self-compassion is a skill—not weakness or lowering standards.',
      'Small wins build evidence against global "not enough" beliefs.',
    ],
    happening:
      'You may achieve externally yet feel like a fraud waiting to be exposed.\n\nComparison to others on social media or at work amplifies shame.',
    help:
      'Name the thought: "I am having the thought that I am not good enough."\n\nAsk what evidence supports and contradicts the belief.\n\nPractice self-compassion phrases you would offer a friend.\n\nSet achievable goals and notice effort—not only flawless outcomes.\n\nLimit comparison triggers and curate social media intentionally.\n\nSeek therapy for CBT or self-compassion work when shame is entrenched.',
    support:
      `${SUPPORT}\n\nSeek help if inadequacy fuels suicidal thoughts, eating disorders, or complete withdrawal from life activities.`,
    related: [
      'How do I stop being so hard on myself?',
      'How do I build self-esteem?',
      'How do I overcome imposter syndrome?',
      'How do I stop comparing myself to others?',
      'How do I practice self-compassion?',
    ],
    schemaAnswer:
      'When you feel not good enough, challenge harsh self-judgments, practice self-compassion, set realistic goals, limit comparison, and seek therapy when shame is chronic.',
    themes: ['Self-worth', 'Perfectionism', 'Self-compassion', 'Imposter feelings'],
    refs: [DEPRESSION, NIMH],
  }),
  'what-should-i-do-when-someone-is-gaslighting-me': draft({
    question: 'What should I do when someone is gaslighting me?',
    slug: 'what-should-i-do-when-someone-is-gaslighting-me',
    category: 'Relationship Abuse',
    title: 'When Someone Is Gaslighting You',
    meta: 'Gaslighting makes you doubt your reality—trust your perceptions, document incidents, set boundaries, seek outside validation, and prioritize safety in abusive dynamics.',
    summary:
      'When someone is gaslighting you—denying events, calling you crazy, or rewriting history—you may doubt your own memory and sanity. Trust your perceptions, document patterns, set boundaries, seek validation from trusted others, and prioritize safety if gaslighting coexists with control or abuse.',
    takeaways: [
      'Gaslighting is manipulation—not a misunderstanding to debate endlessly.',
      'Documentation protects your confidence in your own perceptions.',
      'Arguing rarely convinces a gaslighter—boundaries and distance help more.',
      'Outside validation from trusted people counters isolation.',
    ],
    happening:
      'You may apologize for things you did not do or stop trusting your memory.\n\nThey may deny conversations, minimize harm, or blame your sensitivity.',
    help:
      'Trust your gut when something felt wrong—even if they deny it.\n\nKeep a private journal or save messages with dates and details.\n\nSet boundaries: end conversations when reality is denied repeatedly.\n\nSeek validation from friends, family, or a therapist outside the dynamic.\n\nAvoid trying to win arguments about what happened.\n\nCreate a safety plan if gaslighting pairs with threats or control.',
    support:
      `${SUPPORT}\n\nContact the National Domestic Violence Hotline at 1-800-799-7233 if gaslighting occurs in a controlling or violent relationship.`,
    related: [
      'What is gaslighting and how do I recognize it?',
      'What are the signs of emotional abuse in a relationship?',
      'How do I know if my relationship is toxic?',
      'How do I rebuild trust in my own judgment?',
      'How do I safely leave an abusive relationship?',
    ],
    schemaAnswer:
      'When someone gaslights you, trust your perceptions, document incidents, set boundaries, seek outside validation, and contact 1-800-799-7233 if control or violence is present.',
    themes: ['Gaslighting', 'Emotional abuse', 'Reality testing', 'Safety'],
    flags: ['relationship-safety'],
  }),
  'what-should-i-expect-during-a-psychedelic-therapy-b9c2d5': draft({
    question: 'What should I expect during a psychedelic therapy session?',
    slug: 'what-should-i-expect-during-a-psychedelic-therapy-b9c2d5',
    category: 'Identity & Self-Worth',
    title: 'Psychedelic Therapy Sessions',
    meta: 'Psychedelic therapy involves preparation, supervised dosing in a clinical setting, and integration afterward—expect intense emotions under professional guidance.',
    summary:
      'Psychedelic-assisted therapy typically includes preparation sessions, a supervised dosing session in a clinical setting with trained facilitators, and integration therapy afterward. Expect intense emotions and altered perceptions under professional monitoring—not a recreational experience.',
    takeaways: [
      'Psychedelic therapy is clinical—not recreational use.',
      'Preparation and integration sessions are essential parts of treatment.',
      'Trained facilitators monitor you throughout the dosing session.',
      'Access is limited to research trials or approved clinical programs in most areas.',
    ],
    happening:
      'You may seek this treatment for depression, PTSD, or existential distress when conventional care has stalled.\n\nMedia portrayals may not match the structured clinical environment.',
    help:
      'Only pursue legally approved clinical trials or licensed programs.\n\nComplete preparation work on intentions, fears, and support systems.\n\nExpect 4–8 hours of supervised experience with eyeshades and music.\n\nPlan integration sessions to process insights into daily life.\n\nDiscuss medical history and medications with clinicians—some combinations are unsafe.\n\nArrange trusted support for the day after the session.',
    support:
      `${SUPPORT}\n\nDo not use psychedelics outside clinical settings—seek emergency care if you experience severe distress, and discuss all treatment options with a licensed provider.`,
    related: [
      'What should I expect from my first therapy session?',
      'How do I find a trauma therapist?',
      'What is treatment-resistant depression and what are my options?',
      'How do I prepare for an intensive therapy experience?',
      'How do I integrate insights from therapy into daily life?',
    ],
    schemaAnswer:
      'Psychedelic therapy includes preparation, supervised clinical dosing with trained facilitators, and integration afterward—expect intense emotions, not a recreational experience.',
    themes: ['Psychedelic therapy', 'Clinical trials', 'PTSD treatment', 'Integration'],
    gaps: ['Verify jurisdictional legality and approved indications with editorial standards.'],
    notes: 'No endorsement of non-clinical psychedelic use; emphasize legal clinical pathways only.',
  }),
  'what-should-i-expect-during-the-divorce-process': draft({
    question: 'What should I expect during the divorce process?',
    slug: 'what-should-i-expect-during-the-divorce-process',
    category: 'General Mental Health',
    title: 'What to Expect During Divorce',
    meta: 'Divorce involves legal filings, financial disclosure, custody decisions, and emotional swings—expect months not weeks, and prioritize mental health support throughout.',
    summary:
      'The divorce process typically includes legal filings, financial disclosure, negotiations on property and custody, and emotional ups and downs over months or longer. Expect stress, grief, and practical complexity—and prioritize therapy, legal counsel, and support networks throughout.',
    takeaways: [
      'Divorce timelines are usually months to over a year—not days.',
      'Financial disclosure and custody planning are major components.',
      'Emotional grief coexists with relief—both are normal.',
      'Professional legal and mental health support reduce costly mistakes.',
    ],
    happening:
      'Paperwork, lawyer meetings, and co-parenting negotiations may consume your energy.\n\nMood swings between anger, sadness, hope, and fear are common.',
    help:
      'Hire qualified legal counsel familiar with your jurisdiction.\n\nOrganize financial documents early—accounts, debts, assets, income.\n\nPrioritize children\'s stability with predictable routines amid change.\n\nUse therapy or support groups to process grief and decision fatigue.\n\nAvoid major impulsive decisions during peak emotional periods.\n\nCommunicate through lawyers or co-parenting apps when direct conflict is high.',
    support:
      `${SUPPORT}\n\nSeek crisis support if divorce stress triggers suicidal thoughts, substance relapse, or inability to care for children.`,
    related: [
      'How do I cope with grief during divorce?',
      'How do I help my children through divorce?',
      'How do I co-parent during separation?',
      'How do I manage financial stress during divorce?',
      'How do I rebuild my life after divorce?',
    ],
    schemaAnswer:
      'During divorce, expect legal filings, financial disclosure, custody negotiations, and emotional swings over months—prioritize legal counsel, therapy, and support networks throughout.',
    themes: ['Divorce', 'Grief', 'Legal process', 'Life transition'],
    refs: [GRIEF, NIMH],
  }),
  'what-should-i-expect-from-my-first-aa-or-na-meeting': draft({
    question: 'What should I expect from my first AA or NA meeting?',
    slug: 'what-should-i-expect-from-my-first-aa-or-na-meeting',
    category: 'General Mental Health',
    title: 'Your First AA or NA Meeting',
    meta: 'First 12-step meetings are welcoming hour-long gatherings—you can listen without sharing, hear recovery stories, and try different meeting styles until one fits.',
    summary:
      'Your first AA or NA meeting is typically an hour-long gathering where people share recovery experiences. You can listen without speaking, arrive early to reduce anxiety, and try different meeting types until you find a fit. Everyone present was once new too.',
    takeaways: [
      'You are not required to share at your first meeting.',
      'Meeting formats vary—speaker, discussion, and step meetings differ.',
      'Saying your first name and "I am new" is enough if you choose to speak.',
      'Trying multiple meetings helps you find a compatible group.',
    ],
    happening:
      'Fear of judgment or not belonging may make the parking lot the hardest step.\n\nUnfamiliar terms like sponsor and higher power can feel confusing initially.',
    help:
      'Arrive a few minutes early and identify yourself as new to a greeter if comfortable.\n\nListen first—sharing is optional.\n\nTry different meetings online or in person for format and culture fit.\n\nStay for coffee afterward if offered—casual connection helps.\n\nGet a meeting list and note which groups feel welcoming.\n\nConsider calling a hotline or treatment locator for additional professional support.',
    support:
      `${SUPPORT}\n\nSeek medical detox or emergency care if withdrawal is severe—12-step meetings complement but do not replace medical treatment for addiction.`,
    related: [
      'How do I know if I have a substance use problem?',
      'What is the difference between AA and professional treatment?',
      'How do I find a sponsor?',
      'How do I support a loved one in recovery?',
      'What should I do if I relapse?',
    ],
    schemaAnswer:
      'At your first AA or NA meeting, expect an hour of shared recovery stories—you can listen without sharing, say your name if comfortable, and try different meetings until one fits.',
    themes: ['12-step programs', 'Recovery', 'Peer support', 'Addiction'],
    refs: [SAMHSA, NIMH],
  }),
  'what-should-i-expect-from-my-first-therapy-session-b8c4d7': draft({
    question: 'What should I expect from my first therapy session?',
    slug: 'what-should-i-expect-from-my-first-therapy-session-b8c4d7',
    category: 'Identity & Self-Worth',
    title: 'Your First Therapy Session',
    meta: 'First therapy sessions cover logistics, confidentiality, and what brought you in—feeling nervous is normal; you do not need your whole story on day one.',
    summary:
      'Your first therapy session usually covers practical matters like confidentiality and scheduling, plus an overview of what brought you in. Feeling nervous is normal. You do not need to share your entire history immediately—therapy builds trust over time.',
    takeaways: [
      'First sessions are often part intake, part introduction.',
      'Confidentiality limits and emergency protocols are explained upfront.',
      'Nervousness and skepticism are common—therapists expect them.',
      'Fit matters—notice whether you feel respected and heard.',
    ],
    happening:
      'You may wonder what to say, fear being judged, or feel awkward discussing personal topics.\n\nAdministrative questions about fees and cancellation may mix with emotional topics.',
    help:
      'Prepare a few sentences on what prompted you to seek therapy now.\n\nAsk about the therapist\'s approach, experience, and what sessions look like.\n\nNote whether you feel comfortable enough to return—that is a key signal.\n\nYou can share gradually; depth builds over weeks.\n\nBring questions about confidentiality, length of treatment, and goals.\n\nGive it 2–3 sessions before judging fit unless you feel unsafe or dismissed.',
    support:
      `${SUPPORT}\n\nSwitch providers if you feel judged or unsafe—and seek crisis support (988) if distress is overwhelming before your next appointment.`,
    related: [
      'How do I find a therapist near me?',
      'How do I know if my therapist is a good fit?',
      'How do I prepare for therapy?',
      'How do I know if I need therapy?',
      'What should I do if I do not like my therapist?',
    ],
    schemaAnswer:
      'Your first therapy session covers logistics and what brought you in—nervousness is normal, share gradually, and assess whether you feel respected and heard.',
    themes: ['Starting therapy', 'Therapeutic alliance', 'Mental health access', 'First session'],
  }),
  'what-should-i-know-about-depression-and-menopause': draft({
    question: 'What should I know about depression and menopause?',
    slug: 'what-should-i-know-about-depression-and-menopause',
    category: 'Depression',
    title: 'Depression and Menopause',
    meta: 'Hormonal changes during perimenopause and menopause increase depression risk—symptoms may include irritability, anxiety, and sleep disruption, not only sadness.',
    summary:
      'Depression risk rises during perimenopause and menopause due to hormonal shifts affecting mood-regulating brain chemistry. Symptoms may include irritability, anxiety, sleep problems, and brain fog—not only sadness. Treatment may include therapy, lifestyle changes, medication, or hormone therapy discussed with providers.',
    takeaways: [
      'Perimenopause carries the highest depression risk for many women.',
      'Menopausal depression may look like irritability or anxiety—not only low mood.',
      'Sleep disruption from hot flashes worsens mood symptoms.',
      'Integrated care addressing hormones and mental health improves outcomes.',
    ],
    happening:
      'Mood swings, rage, or numbness may coincide with irregular periods or hot flashes.\n\nYou may not connect symptoms to hormonal transition at first.',
    help:
      'Track mood alongside cycle changes and physical menopause symptoms.\n\nDiscuss symptoms with both a gynecologist and mental health provider.\n\nPrioritize sleep hygiene and treat night sweats when possible.\n\nStay physically active and maintain social connection.\n\nAsk about therapy, antidepressants, or hormone therapy options with your clinicians.\n\nRule out thyroid and other medical contributors to mood changes.',
    support:
      `${SUPPORT}\n\nSeek urgent care for suicidal thoughts—and evaluation if menopause-related mood changes impair work, relationships, or daily functioning.`,
    related: [
      'How do I know if I am depressed?',
      'How do hormones affect mental health?',
      'How do I improve my sleep during menopause?',
      'How do I find a therapist for depression?',
      'What is the connection between depression and physical health problems?',
    ],
    schemaAnswer:
      'Depression risk rises during perimenopause and menopause from hormonal shifts—symptoms may include irritability and sleep disruption; seek integrated care with medical and mental health providers.',
    themes: ['Menopause', 'Depression', 'Hormones', 'Women\'s health'],
    refs: [DEPRESSION, NIMH],
  }),
  'what-should-i-know-about-introducing-my-children-to-a-new-partner': draft({
    question: 'What should I know about introducing my children to a new partner?',
    slug: 'what-should-i-know-about-introducing-my-children-to-a-new-partner',
    category: 'Relationships & Communication',
    title: 'Introducing Children to a New Partner',
    meta: 'Introduce children to a new partner only when the relationship is stable—start with brief casual meetings, let children set pace, and protect one-on-one time with kids.',
    summary:
      'Introducing children to a new partner requires waiting until the relationship is stable and serious, preparing children age-appropriately, starting with brief casual meetings, and letting children set the pace. Protect one-on-one time with your kids so they do not feel replaced.',
    takeaways: [
      'Wait until the relationship is serious—often six months or more.',
      'Children\'s adjustment to divorce should be considered before introductions.',
      'Brief neutral settings work better than immediate family vacations.',
      'Your children should not feel competing with a new partner for your attention.',
    ],
    happening:
      'Excitement about a new relationship may clash with children\'s loyalty to the other parent or grief about the family changing again.\n\nKids may act out, withdraw, or reject your partner initially.',
    help:
      'Ensure the relationship is committed before any introduction.\n\nTalk to children beforehand in age-appropriate language.\n\nStart with short meetings in public or neutral settings.\n\nLet children warm up at their own pace—no forced affection.\n\nMaintain dedicated one-on-one time with each child.\n\nAvoid having a new partner discipline children early in the relationship.',
    support:
      `${SUPPORT}\n\nSeek family therapy if introductions trigger severe distress, regression, or conflict between households.`,
    related: [
      'How do I help my children through divorce?',
      'How do I co-parent with a new partner involved?',
      'How do I balance dating and parenting?',
      'How do I talk to my child about difficult topics?',
      'How do I set boundaries when blending families?',
    ],
    schemaAnswer:
      'Introduce children to a new partner when the relationship is stable, start with brief casual meetings, let children set pace, and protect one-on-one time so they do not feel replaced.',
    themes: ['Blended families', 'Dating after divorce', 'Parenting', 'Children\'s adjustment'],
  }),
  'whats-the-best-way-to-talk-to-my-child-about-difficult-topics': draft({
    question: "What's the best way to talk to my child about difficult topics?",
    slug: 'whats-the-best-way-to-talk-to-my-child-about-difficult-topics',
    category: 'Family & Parenting',
    title: 'Talking to Kids About Hard Topics',
    meta: 'Discuss difficult topics with honesty, age-appropriate language, and emotional validation—ask what they already know and invite ongoing questions.',
    summary:
      'The best way to talk to your child about difficult topics—death, divorce, violence, or identity—is with honesty, age-appropriate language, and validation of their feelings. Ask what they already know, answer questions simply, and make clear they can return with more questions later.',
    takeaways: [
      'Age-appropriate honesty builds trust more than avoiding hard truths.',
      'Ask what they already know before explaining.',
      'Validate emotions—fear, sadness, and anger are normal responses.',
      'Difficult conversations often happen in pieces over time.',
    ],
    happening:
      'You may fear saying the wrong thing or making things worse by talking.\n\nChildren often know more than parents assume and need accurate information.',
    help:
      'Choose a calm time and private setting without distractions.\n\nAsk: "What have you heard about this?" before explaining.\n\nUse simple honest language matched to their developmental stage.\n\nValidate: "It makes sense you feel scared or sad."\n\nAdmit when you do not know an answer and offer to find out together.\n\nUse books or resources designed for their age when helpful.',
    support:
      `${SUPPORT}\n\nSeek child therapy if difficult topics trigger prolonged distress, regression, or behavioral changes that worry you.`,
    related: [
      'How do I talk to my child about mental health?',
      'How do I help my child through divorce?',
      'How do I explain death to my child?',
      'How do I support my anxious child?',
      'How do I know if my child needs therapy?',
    ],
    schemaAnswer:
      'Talk to children about difficult topics with age-appropriate honesty, ask what they already know, validate feelings, and invite ongoing questions over time.',
    themes: ['Parenting communication', 'Difficult conversations', 'Child development', 'Emotional validation'],
  }),
  'whats-the-connection-between-depression-and-physical-health-problems': draft({
    question: "What's the connection between depression and physical health problems?",
    slug: 'whats-the-connection-between-depression-and-physical-health-problems',
    category: 'Depression',
    title: 'Depression and Physical Health',
    meta: 'Depression and physical health are bidirectionally linked—depression worsens chronic illness outcomes and physical conditions can trigger or deepen depression.',
    summary:
      'Depression and physical health problems are bidirectionally linked. Depression can worsen chronic illness, disrupt sleep and immunity, and reduce treatment adherence. Physical conditions—chronic pain, heart disease, hormonal changes—can trigger or deepen depression. Treating both together improves outcomes.',
    takeaways: [
      'The depression-physical health link runs both directions.',
      'Chronic pain and depression share overlapping brain pathways.',
      'Depression can reduce motivation for medical self-care.',
      'Integrated treatment addressing mind and body works better than either alone.',
    ],
    happening:
      'Fatigue, pain, and low mood may blur together until you cannot tell cause from effect.\n\nMedical providers may treat the body while missing depression—or vice versa.',
    help:
      'Tell both medical and mental health providers about physical and mood symptoms.\n\nTreat sleep, pain, and depression as connected—not separate problems.\n\nStay as active as tolerated—movement helps both mood and physical health.\n\nAdhere to medical plans with support when depression saps motivation.\n\nAsk about combined treatment: therapy, medication, and lifestyle changes.\n\nScreen for depression during major physical health diagnoses.',
    support:
      `${SUPPORT}\n\nSeek urgent care for new severe physical symptoms or suicidal thoughts—and integrated care when either condition significantly impairs daily life.`,
    related: [
      'What is the connection between depression and chronic pain?',
      'How do I talk to my doctor about mental health?',
      'How do I cope with chronic illness and mental health?',
      'How do I know if I am depressed?',
      'What should I know about depression and menopause?',
    ],
    schemaAnswer:
      'Depression and physical health worsen each other bidirectionally—treat both together with integrated medical and mental health care for better outcomes.',
    themes: ['Mind-body connection', 'Chronic illness', 'Depression', 'Integrated care'],
    refs: [DEPRESSION, CDC],
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
  'reports/enrichment-corpus/draft-answers/batch-29-drafts.json',
  `${JSON.stringify(drafts, null, 2)}\n`,
);
console.log(`Wrote ${drafts.length} drafts to batch-29-drafts.json`);
