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
  viewAllPath?: string;
};

export type ReviewerServiceOffering = {
  name: string;
  price: string;
  description: string;
  href: string;
};

export type ReviewerHubConnection = {
  hubPath: string;
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
};

const PEACHTREE = 'https://peachtreepsychology.com';

export const reviewerProfiles: ReviewerProfile[] = [
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
        name: 'ADHD',
        viewAllPath: '/adhd/',
        slugs: [
          'how-do-i-know-if-i-have-adhd-as-an-adult',
          'how-do-i-get-tested-for-adhd-as-an-adult',
          'what-are-the-signs-of-adhd-in-women',
          'can-trauma-look-like-adhd',
        ],
      },
      {
        name: 'Testing',
        viewAllPath: '/adhd/',
        slugs: [
          'how-do-i-get-tested-for-adhd-as-an-adult',
          'what-is-adhd-and-how-is-it-different-from-just-being-distracted',
        ],
      },
      {
        name: 'Anxiety',
        viewAllPath: '/categories/anxiety-and-stress/',
        slugs: [
          'how-do-i-function-when-anxiety-makes-everything-feel-overwhelming',
          'can-adhd-cause-anxiety-and-depression',
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
        href: `${PEACHTREE}/service/adhd-testing`,
      },
      {
        name: 'Standalone Diagnostic Evaluation',
        price: '$700',
        description:
          'Focused evaluation for adults seeking diagnostic clarity before treatment or when documentation is needed.',
        href: `${PEACHTREE}/service/diagnostic-evaluation`,
      },
      {
        name: 'OCD Evaluation',
        price: '$700',
        description: 'Targeted assessment for adults who suspect OCD or need clarity before ERP-based treatment.',
        href: `${PEACHTREE}/service/ocd-testing`,
      },
      {
        name: 'Anxiety Evaluation',
        price: '$700',
        description: 'Structured assessment to identify specific anxiety presentations and treatment direction.',
        href: `${PEACHTREE}/service/anxiety-assessment`,
      },
      {
        name: 'Depression Evaluation',
        price: '$700',
        description: 'Clinical assessment to identify depressive presentation and rule out overlapping conditions.',
        href: `${PEACHTREE}/service/depression-evaluation`,
      },
    ],
    serviceOverviewHref: `${PEACHTREE}/service/psychological-testing`,
    referralLinks: [
      {
        label: 'Peachtree profile',
        href: `${PEACHTREE}/therapists/alex-crenshaw`,
        description: 'Practice biography, therapy, and testing overview',
      },
      { label: 'ADHD testing', href: `${PEACHTREE}/service/adhd-testing` },
      { label: 'Psychological testing', href: `${PEACHTREE}/service/psychological-testing` },
      { label: 'Diagnostic evaluation', href: `${PEACHTREE}/service/diagnostic-evaluation` },
    ],
    practiceNotes: [
      'Adult psychological testing is conducted in person at Peachtree Psychology\'s Roswell office only.',
      'Evaluations are self-pay. Insurance is not billed directly.',
    ],
    primaryCta: {
      label: 'Learn about ADHD testing',
      href: `${PEACHTREE}/service/adhd-testing`,
    },
    disclaimer: 'Clinical review is educational and does not create a therapist-client relationship.',
    sameAs: [`${PEACHTREE}/therapists/alex-crenshaw`],
    url: '/reviewers/alex-crenshaw-phd/',
  },
  {
    id: 'david-k-gore-phd',
    slug: 'david-k-gore-phd',
    name: 'David K. Gore, PhD',
    specialtyLabel: 'Addiction & Recovery',
    credentialLine: 'Licensed psychologist · 40+ years clinical experience',
    bio: 'David K. Gore, PhD is a licensed psychologist with more than four decades of clinical experience. He reviews selected Deeper Global answers related to addiction, recovery, substance use, and related care navigation.',
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
