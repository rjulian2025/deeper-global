/**
 * Versioned specialty crosswalk: Peachtree clinician specialties → Deeper taxonomy.
 *
 * Matching uses each clinician's verified specialties (not the practice-wide menu alone).
 * Topic IDs are Deeper canonical topic slugs from src/lib/taxonomy.ts.
 * Theme IDs are ThemeClusterSlug values from src/lib/theme-directory.ts.
 */

export type CrosswalkTopicMatch = {
  id: string;
  weight: number;
  rationale: string;
};

export type SpecialtyCrosswalkEntry = {
  specialty: string;
  aliases: string[];
  eligibleTopics: CrosswalkTopicMatch[];
  eligibleThemes: Array<{ id: string; weight: number }>;
  excludedTopics: string[];
  roleRestrictions: string[];
  /** Minimum confidence when this specialty is the only match signal. */
  baseConfidence: 'high' | 'medium' | 'low';
  sourceSpecialty: string;
  confidenceRules: string[];
};

function topic(id: string, weight: number, rationale: string): CrosswalkTopicMatch {
  return { id, weight, rationale };
}

export const specialtyCrosswalk: SpecialtyCrosswalkEntry[] = [
  {
    specialty: 'Anxiety',
    aliases: ['anxiety', 'anxiety management', 'anticipatory anxiety', 'generalized anxiety', 'panic', 'stress', 'health anxiety'],
    eligibleTopics: [
      topic('anxiety-and-stress', 1.0, 'Exact anxiety/stress topic match'),
      topic('general-mental-health', 0.45, 'Broad emotional regulation adjacency'),
    ],
    eligibleThemes: [{ id: 'anxiety-and-mood', weight: 0.75 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Anxiety',
    confidenceRules: ['exact_topic=high', 'theme_only=medium'],
  },
  {
    specialty: 'Social Anxiety',
    aliases: ['social anxiety', 'social anxiety disorder'],
    eligibleTopics: [topic('anxiety-and-stress', 0.95, 'Social anxiety sits in anxiety cluster')],
    eligibleThemes: [{ id: 'anxiety-and-mood', weight: 0.7 }, { id: 'relationships-and-connection', weight: 0.4 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Social Anxiety',
    confidenceRules: ['alias_or_title_match=high'],
  },
  {
    specialty: 'Depression',
    aliases: ['depression', 'depressive', 'low mood', 'numbness', 'hopeless', 'seasonal affective'],
    eligibleTopics: [
      topic('depression', 1.0, 'Exact depression topic match'),
      topic('anxiety-and-stress', 0.35, 'Common comorbidity adjacency only'),
    ],
    eligibleThemes: [{ id: 'anxiety-and-mood', weight: 0.75 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Depression',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'Mood Disorders',
    aliases: ['mood disorders', 'mood disorder'],
    eligibleTopics: [topic('depression', 0.85, 'Mood disorders map primarily to depression cluster')],
    eligibleThemes: [{ id: 'anxiety-and-mood', weight: 0.7 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'medium',
    sourceSpecialty: 'Mood Disorders',
    confidenceRules: ['parent_mood=medium_unless_title_confirms'],
  },
  {
    specialty: 'ADHD',
    aliases: ['adhd', 'add', 'attention deficit', 'executive functioning', 'executive function', 'neurodiversity', 'neurodivergent'],
    eligibleTopics: [topic('neurodivergence-and-attention', 1.0, 'Exact ADHD/neurodivergence topic')],
    eligibleThemes: [{ id: 'care-and-therapy', weight: 0.7 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'ADHD',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'Adult ADHD Testing',
    aliases: ['adhd testing', 'add/adhd', 'adhd assessment'],
    eligibleTopics: [topic('neurodivergence-and-attention', 1.0, 'Testing specialty within ADHD topic')],
    eligibleThemes: [{ id: 'care-and-therapy', weight: 0.65 }],
    excludedTopics: [],
    roleRestrictions: ['testing_specialty'],
    baseConfidence: 'high',
    sourceSpecialty: 'Adult ADHD Testing',
    confidenceRules: ['testing_keywords_boost'],
  },
  {
    specialty: 'Autism',
    aliases: ['autism', 'autism level 1', 'autistic'],
    eligibleTopics: [topic('neurodivergence-and-attention', 0.95, 'Autism within neurodivergence topic')],
    eligibleThemes: [{ id: 'care-and-therapy', weight: 0.65 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Autism',
    confidenceRules: ['exact_or_alias=high'],
  },
  {
    specialty: 'OCD',
    aliases: ['ocd', 'obsessive-compulsive', 'obsessive compulsive', 'intrusive thoughts', 'compulsion'],
    eligibleTopics: [
      topic('anxiety-and-stress', 0.9, 'OCD/intrusive thoughts currently cluster under anxiety taxonomy'),
    ],
    eligibleThemes: [{ id: 'anxiety-and-mood', weight: 0.7 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'OCD',
    confidenceRules: ['alias_or_title_match=high', 'generic_anxiety_alone=not_enough'],
  },
  {
    specialty: 'Obsessive-Compulsive (OCD)',
    aliases: ['obsessive-compulsive (ocd)', 'pediatric ocd'],
    eligibleTopics: [topic('anxiety-and-stress', 0.9, 'OCD taxonomy adjacency')],
    eligibleThemes: [{ id: 'anxiety-and-mood', weight: 0.7 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Obsessive-Compulsive (OCD)',
    confidenceRules: ['alias_or_title_match=high'],
  },
  {
    specialty: 'Addiction',
    aliases: ['addiction', 'substance use', 'substance abuse', 'alcohol use', 'drug abuse', 'addictive behaviors', 'chemical dependency', 'recovery', 'relapse', 'sobriety'],
    eligibleTopics: [topic('addiction-and-recovery', 1.0, 'Exact addiction topic')],
    eligibleThemes: [{ id: 'trauma-and-safety', weight: 0.7 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Addiction',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'Substance Use',
    aliases: ['substance use', 'substance abuse & chemical dependency'],
    eligibleTopics: [topic('addiction-and-recovery', 1.0, 'Substance use maps to addiction topic')],
    eligibleThemes: [{ id: 'trauma-and-safety', weight: 0.7 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Substance Use',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'Trauma',
    aliases: ['trauma', 'trauma and ptsd', 'trauma & ptsd', 'trauma and ptsd', 'ptsd', 'medical trauma', 'complex trauma'],
    eligibleTopics: [topic('trauma-and-safety', 1.0, 'Exact trauma topic')],
    eligibleThemes: [{ id: 'trauma-and-safety', weight: 0.8 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Trauma',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'PTSD',
    aliases: ['ptsd', 'post-traumatic'],
    eligibleTopics: [topic('trauma-and-safety', 1.0, 'PTSD within trauma topic')],
    eligibleThemes: [{ id: 'trauma-and-safety', weight: 0.8 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'PTSD',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'Grief',
    aliases: ['grief', 'grief & loss', 'grief and loss', 'bereavement', 'loss'],
    eligibleTopics: [topic('grief-and-loss', 1.0, 'Exact grief topic')],
    eligibleThemes: [{ id: 'life-transitions-and-change', weight: 0.75 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Grief',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'Life Transitions',
    aliases: ['life transitions', 'life events & transitions', 'adjustment'],
    eligibleTopics: [
      topic('general-mental-health', 0.7, 'Life transitions live under general mental health aliases'),
      topic('work-and-burnout', 0.45, 'Work transitions adjacency'),
      topic('identity-and-self-worth', 0.4, 'Identity transitions adjacency'),
    ],
    eligibleThemes: [{ id: 'life-transitions-and-change', weight: 0.7 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'medium',
    sourceSpecialty: 'Life Transitions',
    confidenceRules: ['theme_or_alias=medium', 'needs_title_support_for_high'],
  },
  {
    specialty: 'Parenting',
    aliases: ['parenting', 'family conflict', 'child', 'school issues'],
    eligibleTopics: [
      topic('family-and-parenting', 1.0, 'Exact family/parenting topic'),
      topic('teens-and-identity', 0.7, 'Teen parenting adjacency'),
    ],
    eligibleThemes: [{ id: 'family-and-parenting', weight: 0.8 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Parenting',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'Relationship Issues',
    aliases: [
      'relationship issues',
      'relationship counseling',
      'building healthy relationships',
      'marital and premarital',
      'couples',
      'codependency',
      'divorce',
      'infidelity',
      'jealousy',
    ],
    eligibleTopics: [
      topic('relationships-and-communication', 1.0, 'Exact relationships topic'),
      topic('loneliness-and-belonging', 0.45, 'Connection adjacency'),
    ],
    eligibleThemes: [{ id: 'relationships-and-connection', weight: 0.8 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Relationship Issues',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'Eating Disorders',
    aliases: ['eating disorders', 'disordered eating', 'arfid', 'body image', 'body dysmorphic disorder'],
    eligibleTopics: [
      topic('general-mental-health', 0.55, 'No dedicated eating-disorder canonical topic; require title/specialty keywords'),
      topic('identity-and-self-worth', 0.4, 'Body image adjacency'),
    ],
    eligibleThemes: [{ id: 'anxiety-and-mood', weight: 0.35 }],
    excludedTopics: [],
    roleRestrictions: ['requires_keyword_support'],
    baseConfidence: 'medium',
    sourceSpecialty: 'Eating Disorders',
    confidenceRules: ['keyword_required_for_assignment', 'topic_alone=low'],
  },
  {
    specialty: 'Pregnancy, Prenatal, Postpartum',
    aliases: ['pregnancy', 'prenatal', 'postpartum', 'perinatal', 'infertility', 'reproductive mental health', 'motherhood'],
    eligibleTopics: [
      topic('family-and-parenting', 0.7, 'Perinatal often family-adjacent'),
      topic('depression', 0.55, 'Postpartum depression adjacency'),
      topic('anxiety-and-stress', 0.5, 'Perinatal anxiety adjacency'),
    ],
    eligibleThemes: [{ id: 'family-and-parenting', weight: 0.55 }, { id: 'anxiety-and-mood', weight: 0.45 }],
    excludedTopics: [],
    roleRestrictions: ['requires_keyword_support'],
    baseConfidence: 'high',
    sourceSpecialty: 'Pregnancy, Prenatal, Postpartum',
    confidenceRules: ['keyword_match=high'],
  },
  {
    specialty: 'Chronic Illness',
    aliases: ['chronic illness', 'chronic illness & disability', 'chronic pain', 'cancer', 'caregiver stress'],
    eligibleTopics: [topic('general-mental-health', 0.65, 'Physical health aliases under general mental health')],
    eligibleThemes: [{ id: 'life-transitions-and-change', weight: 0.45 }],
    excludedTopics: [],
    roleRestrictions: ['requires_keyword_support'],
    baseConfidence: 'medium',
    sourceSpecialty: 'Chronic Illness',
    confidenceRules: ['keyword_required'],
  },
  {
    specialty: 'Self Esteem',
    aliases: ['self esteem', 'self-esteem', 'self-compassion', 'shame', 'impostor', 'perfectionism'],
    eligibleTopics: [topic('identity-and-self-worth', 1.0, 'Exact identity/self-worth topic')],
    eligibleThemes: [{ id: 'identity-and-self-worth', weight: 0.8 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Self Esteem',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'LGBTQ+',
    aliases: ['lgbtq+', 'lgbtqia+', 'lgbtqia+ issues', 'lgbtqia+ concerns', 'transgender', 'bisexual', 'lesbian'],
    eligibleTopics: [topic('gender-sexuality-and-intimacy', 1.0, 'Exact gender/sexuality topic')],
    eligibleThemes: [{ id: 'relationships-and-connection', weight: 0.55 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'LGBTQ+',
    confidenceRules: ['exact_topic=high'],
  },
  {
    specialty: 'Spirituality',
    aliases: ['spirituality', 'spiritual issues'],
    eligibleTopics: [topic('meaning-faith-and-existential-questions', 0.85, 'Spirituality maps to meaning/faith topic')],
    eligibleThemes: [{ id: 'spirituality-and-meaning', weight: 0.8 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'medium',
    sourceSpecialty: 'Spirituality',
    confidenceRules: ['prefer_editorial_reviewer_when_rick_protected', 'theme_match=medium'],
  },
  {
    specialty: 'Student Athletic Challenges',
    aliases: ['student athletic', 'sports performance', 'athlete'],
    eligibleTopics: [
      topic('teens-and-identity', 0.55, 'Student athlete adjacency'),
      topic('anxiety-and-stress', 0.45, 'Performance anxiety adjacency'),
      topic('neurodivergence-and-attention', 0.35, 'Performance/ADHD overlap'),
    ],
    eligibleThemes: [{ id: 'family-and-parenting', weight: 0.35 }],
    excludedTopics: [],
    roleRestrictions: ['requires_keyword_support'],
    baseConfidence: 'medium',
    sourceSpecialty: 'Student Athletic Challenges',
    confidenceRules: ['keyword_required'],
  },
  {
    specialty: 'Psychological Testing',
    aliases: ['psychological testing', 'diagnostic evaluation', 'anxiety assessment', 'depression evaluation', 'ocd testing'],
    eligibleTopics: [
      topic('neurodivergence-and-attention', 0.7, 'Testing often ADHD-related in this corpus'),
      topic('therapy-and-care-navigation', 0.65, 'Evaluation/care navigation'),
    ],
    eligibleThemes: [{ id: 'care-and-therapy', weight: 0.7 }],
    excludedTopics: [],
    roleRestrictions: ['testing_specialty'],
    baseConfidence: 'medium',
    sourceSpecialty: 'Psychological Testing',
    confidenceRules: ['requires_testing_or_diagnosis_language'],
  },
  {
    specialty: 'Executive Functioning',
    aliases: ['executive functioning', 'productivity coaching', 'school issues', 'education and learning disabilities'],
    eligibleTopics: [
      topic('neurodivergence-and-attention', 0.8, 'Executive function strongly ADHD-adjacent'),
      topic('teens-and-identity', 0.45, 'Student coaching adjacency'),
      topic('work-and-burnout', 0.4, 'Adult productivity adjacency'),
    ],
    eligibleThemes: [{ id: 'care-and-therapy', weight: 0.5 }],
    excludedTopics: [],
    roleRestrictions: ['coaching_ok'],
    baseConfidence: 'medium',
    sourceSpecialty: 'Executive Functioning',
    confidenceRules: ['coach_role_allowed_for_these_topics'],
  },
  {
    specialty: 'Work/Life Balance',
    aliases: ['work/life balance', 'burnout', 'career counseling', 'productivity'],
    eligibleTopics: [topic('work-and-burnout', 1.0, 'Exact work/burnout topic')],
    eligibleThemes: [{ id: 'work-and-purpose', weight: 0.8 }],
    excludedTopics: [],
    roleRestrictions: [],
    baseConfidence: 'high',
    sourceSpecialty: 'Work/Life Balance',
    confidenceRules: ['exact_topic=high'],
  },
];

export function normalizeSpecialtyKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const crosswalkByKey = new Map<string, SpecialtyCrosswalkEntry>();
for (const entry of specialtyCrosswalk) {
  crosswalkByKey.set(normalizeSpecialtyKey(entry.specialty), entry);
  for (const alias of entry.aliases) {
    crosswalkByKey.set(normalizeSpecialtyKey(alias), entry);
  }
}

export function resolveSpecialtyCrosswalk(specialty: string): SpecialtyCrosswalkEntry | null {
  return crosswalkByKey.get(normalizeSpecialtyKey(specialty)) ?? null;
}

export function listCrosswalkMatchesForText(text: string): SpecialtyCrosswalkEntry[] {
  const hay = normalizeSpecialtyKey(text);
  const hits: SpecialtyCrosswalkEntry[] = [];
  const seen = new Set<string>();
  for (const entry of specialtyCrosswalk) {
    const keys = [entry.specialty, ...entry.aliases].map(normalizeSpecialtyKey);
    if (keys.some((key) => key.length >= 4 && hay.includes(key))) {
      if (!seen.has(entry.specialty)) {
        seen.add(entry.specialty);
        hits.push(entry);
      }
    }
  }
  return hits;
}
