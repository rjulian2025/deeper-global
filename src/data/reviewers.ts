export type ReviewerVideoStatus = 'coming_soon' | 'live';

export type ReviewerVideoModule = {
  title: string;
  caption: string;
  status: ReviewerVideoStatus;
  statusLabel?: string;
  poster?: string;
  embedUrl?: string;
};

export type ReviewerExpertiseDomain = {
  label: string;
  description: string;
};

export type ReviewerContentGroup = {
  name: string;
  slugs: string[];
  /** Static hub URL (e.g. curated /adhd/). */
  viewAllPath?: string;
  /** Canonical taxonomy slug; resolves to the largest live category hub at build time. */
  viewAllTopicSlug?: string;
};

export type ReviewerServiceOffering = {
  name: string;
  price: string;
  description: string;
  href: string;
};

export type ReviewerHubConnection = {
  /** Static hub URL (e.g. curated /adhd/). */
  hubPath?: string;
  /** Canonical taxonomy slug; resolves to the largest live category hub at build time. */
  hubTopicSlug?: string;
  hubLabel: string;
  summary: string;
};

export type ReviewerReferralLink = {
  label: string;
  href: string;
  description?: string;
};

export type ReviewerProfile = {
  id: string;
  slug: string;
  name: string;
  specialtyLabel: string;
  credentialLine: string;
  bio: string;
  expertiseTags: string[];
  disclaimer: string;
  sameAs: string[];
  url: string;
  displayName?: string;
  designation?: string;
  role?: string;
  academicAffiliation?: string;
  practiceName?: string;
  practiceUrl?: string;
  image?: string;
  imageAlt?: string;
  overviewParagraphs?: string[];
  expertiseDomains?: ReviewerExpertiseDomain[];
  videoModule?: ReviewerVideoModule;
  clinicalPerspective?: string;
  reviewedContentGroups?: ReviewerContentGroup[];
  reviewedKnowledgeTitle?: string;
  reviewedKnowledgeIntro?: string;
  hubConnection?: ReviewerHubConnection;
  affiliations?: string[];
  modalities?: string[];
  serviceOfferings?: ReviewerServiceOffering[];
  serviceOverviewHref?: string;
  referralLinks?: ReviewerReferralLink[];
  practiceNotes?: string[];
  locationLine?: string;
  primaryCta?: { label: string; href: string };
  expertiseSummary?: string;
  /** Sidebar trust label on answer pages (default: Clinical Reviewer). */
  trustRoleLabel?: string;
  /** Trust headline prefix (default: Clinically reviewed by). */
  reviewAttributionPrefix?: string;
};

const PEACHTREE = 'https://peachtreepsychology.com';
const peachtreeReferralUrl = (path: string, content: string) =>
  `${PEACHTREE}${path}?utm_source=deeper_global&utm_medium=referral&utm_campaign=deeper_network&utm_content=${content}`;

export const reviewerProfiles: ReviewerProfile[] = [
  {
    id: 'rick-julian',
    slug: 'rick-julian',
    name: 'Rick Julian',
    displayName: 'Rick Julian',
    specialtyLabel: 'Spirituality & Meaning',
    designation: 'Content reviewer for spirituality, meaning, and philosophical inquiry',
    credentialLine: 'Bestselling Author of The Way | A Modern Tao Te Ching',
    role: 'Author & Philosopher',
    trustRoleLabel: 'Editorial Reviewer',
    reviewAttributionPrefix: 'Editorially reviewed by',
    practiceUrl: 'https://www.rickjulian.com',
    image: '/authorities/rick-julian.png',
    imageAlt: 'Rick Julian — author and philosopher, content reviewer for spirituality and meaning at Deeper Global',
    bio: 'Rick Julian is the author of The Way | A Modern Tao Te Ching, a bestselling reinterpretation of one of the world\'s most enduring philosophical texts. As a philosopher, speaker, and teacher, he brings decades of study in Taoist and Western philosophical traditions to questions of meaning, purpose, faith transitions, and how people navigate existential uncertainty.',
    overviewParagraphs: [
      'Rick\'s work centers on what it means to live well — not as an abstract ideal but as a daily practice. His writing draws from Taoism, Stoicism, and contemporary philosophy to offer grounded language for people wrestling with questions that don\'t resolve neatly.',
      'His role at Deeper Global is to review content at the intersection of spirituality, existential crisis, and meaning-making, ensuring answers honor the depth of these questions without overstepping into clinical territory.',
    ],
    expertiseSummary:
      'His perspective spans Taoist philosophy and the principle of wu wei, Stoic frameworks for equanimity and acceptance, the psychology of belief change and faith transitions, and the existential territory of meaning, purpose, and mortality.',
    expertiseTags: [
      'spirituality',
      'meaning-making',
      'Taoism',
      'Stoicism',
      'existential questions',
      'purpose',
      'faith transitions',
      'philosophy',
      'presence and acceptance',
    ],
    expertiseDomains: [
      {
        label: 'Spirituality & Meaning',
        description: 'Finding or rebuilding a sense of meaning outside or alongside formal religion.',
      },
      {
        label: 'Taoism & Eastern Philosophy',
        description: 'Wu wei, the nature of flow, and living in alignment with what is rather than what should be.',
      },
      {
        label: 'Existential Questions',
        description: 'Mortality, emptiness, the fear of meaninglessness, and what grounds a life.',
      },
      {
        label: 'Stoicism & Western Philosophy',
        description: 'Acceptance, reason, and the practice of responding to circumstances with equanimity.',
      },
      {
        label: 'Faith Transitions',
        description: 'Leaving, questioning, or rebuilding a belief system — and finding footing during the in-between.',
      },
      {
        label: 'Purpose & Direction',
        description: 'What to do when the inherited roadmap stops working and you need to find your own.',
      },
    ],
    clinicalPerspective:
      'Many people arrive at existential questions not through philosophy but through pain — a loss, a collapse of belief, or the unsettling feeling that nothing quite means what it used to.',
    reviewedContentGroups: [
      {
        name: 'Meaning & existential questions',
        viewAllTopicSlug: 'meaning-faith-and-existential-questions',
        slugs: [
          'how-do-i-find-meaning-in-life-when-everything-feel-186602-024',
          'why-do-i-feel-empty-even-when-my-life-looks-177941-018',
          'how-do-i-cope-with-the-fear-that-death-means-compl-186602-026',
          'how-do-i-find-meaning-when-i-no-longer-believe-what-i-was-taught',
        ],
      },
      {
        name: 'Faith transitions & spiritual doubt',
        viewAllTopicSlug: 'meaning-faith-and-existential-questions',
        slugs: [
          'what-do-i-do-when-im-losing-faith-in-everything-i--186602-023',
          'why-am-i-losing-faith-in-everything-i-used-to-believe',
          'why-do-i-feel-guilty-for-questioning-my-religious--186602-025',
          'how-do-i-handle-family-rejection-after-changing-my-186602-028',
          'what-do-i-do-when-prayer-or-meditation-no-longer-b-186602-027',
        ],
      },
    ],
    reviewedKnowledgeTitle: 'Reviewed perspectives on meaning & spirituality',
    reviewedKnowledgeIntro:
      'Content reviewed for philosophical depth, honest framing of uncertainty, and language that holds space for people navigating questions that don\'t have clean answers.',
    hubConnection: {
      hubTopicSlug: 'meaning-faith-and-existential-questions',
      hubLabel: 'Meaning & faith hub',
      summary:
        'Explore answers about existential questions, spiritual doubt, faith transitions, and the search for meaning — reviewed through a philosophical lens.',
    },
    referralLinks: [
      {
        label: 'rickjulian.com',
        href: 'https://www.rickjulian.com',
        description: 'Author website, writing, and speaking',
      },
    ],
    disclaimer: 'Content review reflects philosophical and experiential perspective and does not constitute clinical, therapeutic, or religious guidance.',
    sameAs: [
      'https://www.rickjulian.com',
      'https://www.deeper.global',
      'https://deeperwebsites.com',
      'https://qvbrands.com',
      'https://www.linkedin.com/in/rickjulianqv',
    ],
    url: '/reviewers/rick-julian/',
  },
  {
    id: 'alex-crenshaw-phd',
    slug: 'alex-crenshaw-phd',
    name: 'Dr. Alex Crenshaw, PhD',
    displayName: 'Dr. Alex Crenshaw, PhD',
    specialtyLabel: 'Adult ADHD Testing & Psychological Evaluation',
    designation: 'Clinical reviewer for adult ADHD testing and psychological evaluation',
    credentialLine: 'Licensed psychologist · Peachtree Psychology · Roswell, GA',
    role: 'Licensed Psychologist',
    academicAffiliation: 'Assistant Professor of Psychology, Kennesaw State University',
    practiceName: 'Peachtree Psychology',
    practiceUrl: PEACHTREE,
    locationLine: '555 Sun Valley Drive, Suite M-2 · Roswell, GA 30076',
    image: '/authorities/alex-crenshaw-phd.png',
    imageAlt: 'Dr. Alex Crenshaw, PhD — licensed psychologist and clinical reviewer for adult ADHD testing',
    bio: 'Dr. Alex Crenshaw is a licensed psychologist with a PhD in clinical psychology. He conducts adult psychological testing and evidence-based psychotherapy at Peachtree Psychology in Roswell, Georgia, and serves as Assistant Professor of Psychology at Kennesaw State University.',
    overviewParagraphs: [
      'Dr. Crenshaw provides structured psychological testing for adults seeking diagnostic clarity around ADHD, OCD, anxiety, depression, PTSD, and related conditions. Evaluations combine clinical interview, standardized measures, and written reports designed to support treatment planning and documentation when clinically appropriate.',
      'Testing at Peachtree Psychology begins with a phone screening to determine which evaluation fits your concerns. All assessments are conducted in person at the Roswell office.',
    ],
    expertiseSummary:
      'His clinical work spans adult ADHD testing, differential diagnosis when anxiety, depression, OCD, or trauma overlap with attention concerns, and evidence-based psychotherapy including CBT, ACT, DBT, and exposure-based treatments such as ERP, PE, and CPT.',
    expertiseTags: [
      'adult ADHD testing',
      'psychological testing',
      'diagnostic evaluation',
      'OCD',
      'anxiety',
      'depression',
      'PTSD',
      'evidence-based psychotherapy',
    ],
    expertiseDomains: [
      {
        label: 'Adult ADHD Testing',
        description: 'Focus, executive function, emotional regulation, and diagnostic confirmation.',
      },
      {
        label: 'Diagnostic Evaluation',
        description: 'When symptoms overlap and the question is “what is actually going on?”',
      },
      {
        label: 'OCD',
        description: 'Intrusive thoughts, compulsive patterns, and ERP-informed treatment direction.',
      },
      {
        label: 'Anxiety',
        description: 'Worry, avoidance, panic, and anxiety that may overlap with attention concerns.',
      },
      {
        label: 'Depression',
        description: 'Low motivation, emotional fatigue, and mood symptoms that can complicate diagnosis.',
      },
      {
        label: 'PTSD',
        description: 'Trauma-related symptoms that may affect attention, sleep, mood, and threat response.',
      },
      {
        label: 'Psychological Testing',
        description: 'Structured evaluation, clinical interviews, written reports, and treatment recommendations.',
      },
      {
        label: 'Evidence-Based Therapy',
        description: 'CBT, ACT, DBT, IBCT, PE, CPT, CBCT, ERP.',
      },
    ],
    videoModule: {
      title: 'Meet Dr. Alex Crenshaw, PhD',
      caption:
        'A short introduction to adult ADHD testing, diagnostic clarity, and evidence-based care.',
      status: 'coming_soon',
      statusLabel: 'Coming soon',
    },
    clinicalPerspective:
      'Many adults seek ADHD testing after years of wondering why effort, focus, and follow-through feel harder than they should.',
    reviewedContentGroups: [
      {
        name: 'ADHD diagnosis & testing',
        viewAllPath: '/adhd/',
        slugs: [
          'how-do-i-know-if-i-have-adhd-as-an-adult',
          'how-do-i-get-tested-for-adhd-as-an-adult',
          'what-is-adhd-and-how-is-it-different-from-just-being-distracted',
          'what-are-the-signs-of-adhd-in-women',
          'can-trauma-look-like-adhd',
          'what-is-the-difference-between-adhd-and-bipolar-disorder',
        ],
      },
      {
        name: 'Executive function & daily life',
        viewAllPath: '/adhd/',
        slugs: [
          'what-is-executive-dysfunction-and-how-does-it-affect-daily-life',
          'how-do-i-cope-with-adhd-time-blindness',
          'how-do-i-stop-forgetting-things-with-adhd',
          'is-hyperfocus-a-symptom-of-adhd',
          'why-do-i-feel-overwhelmed-by-simple-dail-190648-007',
          'why-do-i-feel-like-i-cant-handle-normal-adult-184730-088',
          'can-depression-make-basic-tasks-hard',
        ],
      },
      {
        name: 'Emotional regulation & anxiety',
        viewAllPath: '/adhd/',
        slugs: [
          'why-do-i-get-so-emotionally-overwhelmed-with-adhd',
          'what-is-rejection-sensitive-dysphoria-and-adhd',
          'how-do-i-stop-feeling-overwhelmed-by-everything',
          'how-do-i-function-when-anxiety-makes-everything-feel-overwhelming',
          'can-adhd-cause-anxiety-and-depression',
        ],
      },
      {
        name: 'Treatment, medication & routines',
        viewAllPath: '/adhd/',
        slugs: [
          'how-do-i-manage-adhd-without-medication',
          'how-do-adhd-medications-work',
          'how-do-i-build-routines-with-adhd',
          'how-do-i-manage-adhd-burnout',
          'how-do-i-find-motivation-when-im-depressed-z8a9b1',
        ],
      },
      {
        name: 'Work, school & accommodations',
        viewAllPath: '/adhd/',
        slugs: [
          'how-do-i-stay-focused-at-work-with-adhd',
          'how-do-i-explain-adhd-to-my-employer',
          'what-workplace-accommodations-help-adults-with-adhd',
          'how-do-i-study-with-adhd',
          'how-do-i-deal-with-feeling-overwhelmed-by-wo-177941-013',
        ],
      },
      {
        name: 'Relationships & communication',
        viewAllPath: '/adhd/',
        slugs: [
          'how-do-i-manage-adhd-in-relationships',
          'what-should-i-tell-my-partner-about-adhd',
          'how-do-i-stop-feeling-overwhelmed-by-social-y7z3a6',
        ],
      },
      {
        name: 'OCD',
        viewAllPath: '/modalities/exposure-and-response-prevention-erp/',
        slugs: ['can-trauma-look-like-adhd'],
      },
    ],
    reviewedKnowledgeTitle: 'Clinically reviewed knowledge',
    reviewedKnowledgeIntro:
      'Expert guidance reviewed for accuracy, clarity, and educational value — connecting evidence-informed answers to the questions adults ask before seeking evaluation or care.',
    hubConnection: {
      hubPath: '/adhd/',
      hubLabel: 'ADHD hub',
      summary:
        'Explore evidence-informed answers about adult ADHD — signs, testing, executive dysfunction, and daily life — clinically reviewed within the Deeper knowledge graph.',
    },
    affiliations: [
      'Association for Behavioral and Cognitive Therapies',
      'Society for a Science of Clinical Psychology',
      'Society for the Improvement of Psychological Science',
    ],
    modalities: ['CBT', 'ACT', 'DBT', 'IBCT', 'PE', 'CPT', 'CBCT', 'ERP'],
    serviceOfferings: [
      {
        name: 'Full ADHD Assessment',
        price: '$2,300',
        description:
          'Comprehensive multi-method ADHD evaluation for adults when a full diagnostic workup is clinically warranted.',
        href: peachtreeReferralUrl('/service/adhd-testing', 'alex_crenshaw_service_adhd_testing'),
      },
      {
        name: 'Standalone Diagnostic Evaluation',
        price: '$900-$1,100',
        description:
          'Focused evaluation for adults seeking diagnostic clarity before treatment or when documentation is needed.',
        href: peachtreeReferralUrl('/service/diagnostic-evaluation', 'alex_crenshaw_service_diagnostic_evaluation'),
      },
      {
        name: 'OCD Evaluation',
        price: '$900-$1,100',
        description: 'Targeted assessment for adults who suspect OCD or need clarity before ERP-based treatment.',
        href: peachtreeReferralUrl('/service/ocd-testing', 'alex_crenshaw_service_ocd_testing'),
      },
      {
        name: 'Anxiety Evaluation',
        price: '$900-$1,100',
        description: 'Structured assessment to identify specific anxiety presentations and treatment direction.',
        href: peachtreeReferralUrl('/service/anxiety-assessment', 'alex_crenshaw_service_anxiety_assessment'),
      },
      {
        name: 'Depression Evaluation',
        price: '$900-$1,100',
        description: 'Clinical assessment to identify depressive presentation and rule out overlapping conditions.',
        href: peachtreeReferralUrl('/service/depression-evaluation', 'alex_crenshaw_service_depression_evaluation'),
      },
    ],
    serviceOverviewHref: peachtreeReferralUrl('/service/psychological-testing', 'alex_crenshaw_service_overview'),
    referralLinks: [
      {
        label: 'Peachtree profile',
        href: peachtreeReferralUrl('/therapists/alex-crenshaw', 'alex_crenshaw_referral_profile'),
        description: 'Practice biography, therapy, and testing overview',
      },
      { label: 'ADHD testing', href: peachtreeReferralUrl('/service/adhd-testing', 'alex_crenshaw_referral_adhd_testing') },
      {
        label: 'Psychological testing',
        href: peachtreeReferralUrl('/service/psychological-testing', 'alex_crenshaw_referral_psychological_testing'),
      },
      {
        label: 'Diagnostic evaluation',
        href: peachtreeReferralUrl('/service/diagnostic-evaluation', 'alex_crenshaw_referral_diagnostic_evaluation'),
      },
    ],
    practiceNotes: [
      'Adult psychological testing is conducted in person at Peachtree Psychology\'s Roswell office only.',
      'Evaluations are self-pay. Insurance is not billed directly.',
    ],
    primaryCta: {
      label: 'Learn about ADHD testing',
      href: peachtreeReferralUrl('/service/adhd-testing', 'alex_crenshaw_primary_cta'),
    },
    disclaimer: 'Clinical review is educational and does not create a therapist-client relationship.',
    sameAs: [`${PEACHTREE}/therapists/alex-crenshaw`],
    url: '/reviewers/alex-crenshaw-phd/',
  },
  {
    id: 'michelle-morris-lpc',
    slug: 'michelle-morris-lpc',
    name: 'Michelle Morris, LPC, LPCC',
    displayName: 'Michelle Morris, LPC, LPCC',
    specialtyLabel: 'Imago Couples Therapy & Neuroscience-Informed Relationships',
    designation: 'Clinical reviewer for Imago Relationship Therapy and couples conflict patterns',
    credentialLine: 'Licensed Professional Counselor · Certified Imago Relationship Therapist · Sandy Springs, GA',
    role: 'Licensed Professional Counselor',
    practiceName: 'Michelle Morris, LPC',
    practiceUrl: 'https://michellemorrislpc.com',
    locationLine: '6000 Lake Forrest Drive, Suite 400 · Sandy Springs, GA 30328',
    image: '/authorities/michelle-morris-lpc.jpeg',
    imageAlt:
      'Michelle Morris, LPC, LPCC — licensed professional counselor and certified Imago Relationship Therapist',
    bio: 'Michelle Morris, LPC, LPCC is a licensed professional counselor with more than three decades of clinical experience. She is a Certified Imago Relationship Therapist who helps couples understand how nervous-system patterns drive conflict and how structured dialogue can create lasting change.',
    overviewParagraphs: [
      'Michelle works with couples who are capable in daily life yet stuck in the same exhausting fight. Her approach treats relationship conflict as a nervous-system and pattern problem, not only a communication problem.',
      'She uses Imago Relationship Therapy, a structured method grounded in neuroscience and attachment, to help partners see what is driving their cycle and practice new responses with support in session.',
    ],
    expertiseSummary:
      'Her clinical perspective spans repetitive conflict cycles, nervous-system hijacking in conversations, the limits of insight without practice, and when structured Imago couples work is a good fit.',
    expertiseTags: [
      'Imago Relationship Therapy',
      'couples therapy',
      'relationship patterns',
      'nervous system and conflict',
      'communication under stress',
      'neuroscience-informed therapy',
      'attachment and connection',
      'pre-therapy consultation',
    ],
    expertiseDomains: [
      {
        label: 'Repetitive conflict cycles',
        description: 'Why capable couples reenact the same fight beneath changing topics.',
      },
      {
        label: 'Nervous-system activation',
        description: 'How tone, posture, and old wiring can hijack conversations before logic arrives.',
      },
      {
        label: 'Communication under stress',
        description: 'Why skills collapse when partners are activated and what helps in the moment.',
      },
      {
        label: 'Choosing couples therapy',
        description: 'What to look for when therapy feels like refereeing instead of change.',
      },
      {
        label: 'Insight and practice',
        description: 'Why understanding patterns is necessary but rarely sufficient on its own.',
      },
      {
        label: 'Imago fit and consultation',
        description: 'When Imago is appropriate and what a pre-therapy consultation should cover.',
      },
    ],
    clinicalPerspective:
      'Many couples arrive knowing what healthy communication sounds like. The work is learning why their nervous systems still run an older protection script when it matters most.',
    reviewedContentGroups: [
      {
        name: 'Imago Relationship Therapy',
        viewAllPath: '/modalities/imago-therapy/',
        slugs: [
          'why-do-capable-couples-keep-reenacting-the-same-relationship-fight',
          'how-does-my-nervous-system-hijack-conversations-with-my-partner',
          'why-do-communication-skills-fail-when-we-are-upset-with-our-partner',
          'why-does-couples-therapy-sometimes-feel-like-refereeing-not-change',
          'why-doesnt-understanding-our-patterns-fix-our-relationship',
          'when-is-imago-relationship-therapy-a-good-fit-for-couples',
          'what-should-couples-expect-from-a-pre-therapy-consultation-call',
        ],
      },
    ],
    reviewedKnowledgeTitle: 'Clinically reviewed Imago and couples guidance',
    reviewedKnowledgeIntro:
      'Answers reviewed for accuracy, clarity, and educational value on Imago Relationship Therapy, nervous-system patterns in conflict, and what couples can realistically expect from structured couples work.',
    hubConnection: {
      hubPath: '/modalities/imago-therapy/',
      hubLabel: 'Imago Therapy',
      summary:
        'Explore how Imago Relationship Therapy helps couples move from repetitive conflict toward structured dialogue and deeper connection.',
    },
    affiliations: ['Imago Relationships International', 'Georgia Regional Imago Therapists of the Southeast (GRITS)'],
    modalities: ['Imago Relationship Therapy'],
    referralLinks: [
      {
        label: 'michellemorrislpc.com',
        href: 'https://michellemorrislpc.com',
        description: 'Practice website, consultation booking, and couples therapy overview',
      },
      {
        label: 'About Michelle',
        href: 'https://michellemorrislpc.com/about',
        description: 'Background, philosophy, and Imago approach',
      },
      {
        label: 'Book a free consultation',
        href: 'https://michellemorrislpc.com/contact',
        description: '20-minute fit conversation by video or phone',
      },
    ],
    practiceNotes: [
      'Licensed in Georgia, Pennsylvania, and California.',
      'Couples and individual therapy available by telehealth where permitted.',
    ],
    primaryCta: {
      label: 'Book a free consultation',
      href: 'https://michellemorrislpc.com/contact',
    },
    disclaimer: 'Clinical review is educational and does not create a therapist-client relationship.',
    sameAs: ['https://michellemorrislpc.com'],
    url: '/reviewers/michelle-morris-lpc/',
  },
  {
    id: 'david-k-gore-phd',
    slug: 'david-k-gore-phd',
    name: 'Kenneth W. Christian, PhD',
    specialtyLabel: 'Addiction & Recovery',
    credentialLine: 'Licensed psychologist · 40+ years clinical experience',
    bio: 'Kenneth W. Christian, PhD is a licensed psychologist with more than four decades of clinical experience. He reviews selected Deeper Global answers related to addiction, recovery, substance use, and related care navigation.',
    expertiseTags: [
      'addiction',
      'substance use',
      'recovery',
      'relapse prevention',
      'sobriety',
      'family impact of addiction',
    ],
    disclaimer: 'Clinical review is educational and does not create a therapist-client relationship.',
    sameAs: [],
    url: '/reviewers/david-k-gore-phd/',
  },
  {
    id: 'kenneth-w-christian-phd',
    slug: 'kenneth-w-christian-phd',
    name: 'Kenneth W. Christian, PhD',
    specialtyLabel: 'Performance, Purpose & Self-Limiting Patterns',
    credentialLine: 'Performance, Purpose & Self-Limiting Patterns',
    bio: 'Kenneth W. Christian, PhD is a psychologist and performance psychology specialist whose work focuses on underachievement, self-limiting behavior, procrastination, perfectionism, and the psychological barriers that keep capable people from acting on their potential. He is the author of Your Own Worst Enemy: Breaking the Habit of Adult Underachievement.',
    expertiseTags: [
      'underachievement',
      'self-limiting behavior',
      'procrastination',
      'perfectionism',
      'imposter syndrome',
      'career stuckness',
      'purpose and motivation',
      'achievement anxiety',
      'self-worth tied to success',
    ],
    disclaimer: 'Clinical review is educational and does not create a therapist-client relationship.',
    sameAs: [],
    url: '/reviewers/kenneth-w-christian-phd/',
  },
];

export const reviewerProfilesById = new Map(reviewerProfiles.map((profile) => [profile.id, profile]));

export const reviewerProfilesBySlug = new Map(reviewerProfiles.map((profile) => [profile.slug, profile]));
