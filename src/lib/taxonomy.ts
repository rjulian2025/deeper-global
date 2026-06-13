import type { Question } from './supabase';

export type RiskClass = 'standard' | 'care-navigation' | 'sensitive' | 'crisis';

export type CanonicalTopic = {
  name: string;
  slug: string;
  aliases: string[];
  searchTerms: string[];
};

export const canonicalTopics: CanonicalTopic[] = [
  {
    name: 'Anxiety & Stress',
    slug: 'anxiety-and-stress',
    aliases: ['Anxiety and Stress', 'Anxiety & Worry', 'Anxiety Management', 'Generalized Anxiety', 'Intrusive Thoughts', 'Perfectionism & Control Issues', 'Social Anxiety', 'Panic', 'Stress'],
    searchTerms: ['anxiety', 'anxious', 'panic', 'stress', 'worry', 'overthinking', 'intrusive thoughts', 'perfectionism', 'control', 'social anxiety', 'racing thoughts', 'nervous'],
  },
  {
    name: 'Depression',
    slug: 'depression',
    aliases: ['Depression & Numbness', 'Depressive symptoms', 'Low mood', 'Mood disorders'],
    searchTerms: ['depression', 'depressed', 'sad', 'numb', 'empty', 'hopeless', 'low mood', 'tired'],
  },
  {
    name: 'Addiction & Recovery',
    slug: 'addiction-and-recovery',
    aliases: ['Addiction and Recovery', 'Substance use recovery', 'Sobriety', 'Relapse prevention'],
    searchTerms: ['addiction', 'substance', 'recovery', 'relapse', 'sober', 'sobriety', 'cravings', 'drinking'],
  },
  {
    name: 'Trauma & Safety',
    slug: 'trauma-and-safety',
    aliases: ['Trauma & Grief', 'Trauma and Grief', 'Trauma & Triggers', 'Relationship Abuse', 'Crisis Support'],
    searchTerms: ['trauma', 'ptsd', 'trigger', 'flashback', 'abuse', 'unsafe', 'crisis', 'self-harm', 'suicide'],
  },
  {
    name: 'Therapy & Care Navigation',
    slug: 'therapy-and-care-navigation',
    aliases: ['Therapy & Mental Health', 'Therapy Navigation', 'Mental Health Treatment', 'Mental Health Access'],
    searchTerms: ['therapy', 'therapist', 'counseling', 'treatment', 'professional help', 'medication', 'psychiatrist'],
  },
  {
    name: 'Identity & Self-Worth',
    slug: 'identity-and-self-worth',
    aliases: ['Identity and Self-Worth', 'Self-Worth', 'Self-worth', 'Identity', 'Self-esteem', 'Self-Compassion', 'Life Comparison', 'Money & Self-Worth', 'People Pleasing', 'Self-Actualization'],
    searchTerms: ['identity', 'self-worth', 'self esteem', 'confidence', 'shame', 'not good enough', 'validation', 'comparison', 'people pleasing', 'purpose'],
  },
  {
    name: 'Relationships & Communication',
    slug: 'relationships-and-communication',
    aliases: ['Relationships and Communication', 'Relationships', 'Communication & Conflict', 'Relationship Insecurity', 'Attachment Styles & Relationship Dynamics', 'Forgiveness', 'Relationship Balance', 'Relationship Comparison', 'Relationship Identity', 'Relationships & Divorce', 'Codependency'],
    searchTerms: ['relationship', 'partner', 'communication', 'conflict', 'boundary', 'attachment', 'forgiveness', 'divorce', 'dating', 'breakup', 'jealous'],
  },
  {
    name: 'Family & Parenting',
    slug: 'family-and-parenting',
    aliases: ['Family and Parenting', 'Parenting', 'Family Relationships', 'Family Boundaries', 'Inner Child & Parenting'],
    searchTerms: ['parent', 'child', 'teen', 'family', 'sibling', 'co-parent', 'adult child'],
  },
  {
    name: 'Grief & Loss',
    slug: 'grief-and-loss',
    aliases: ['Grief and Loss', 'Bereavement', 'Loss', 'Complicated grief'],
    searchTerms: ['grief', 'loss', 'death', 'bereavement', 'mourning', 'pet loss'],
  },
  {
    name: 'Work & Burnout',
    slug: 'work-and-burnout',
    aliases: ['Work and Burnout', 'Work & Life Balance', 'Work, Stress & Burnout', 'Workplace Mental Health', 'Career & Purpose', 'Workplace'],
    searchTerms: ['work', 'job', 'career', 'burnout', 'boss', 'workplace', 'laid off', 'imposter', 'purpose'],
  },
  {
    name: 'Teens & Identity',
    slug: 'teens-and-identity',
    aliases: ['Teen-Specific Questions', 'Teens', 'Youth'],
    searchTerms: ['teen', 'teenager', 'school', 'parents', 'identity', 'peer pressure'],
  },
  {
    name: 'Loneliness & Belonging',
    slug: 'loneliness-and-belonging',
    aliases: ['Loneliness & Isolation', 'Social Belonging', 'Social Connection'],
    searchTerms: ['lonely', 'loneliness', 'isolated', 'belong', 'friends', 'connection'],
  },
  {
    name: 'Neurodivergence & Attention',
    slug: 'neurodivergence-and-attention',
    aliases: ['ADHD', 'Autism', 'Autistic', 'Neurodivergence'],
    searchTerms: ['adhd', 'autism', 'autistic', 'neurodivergent', 'focus', 'executive function'],
  },
  {
    name: 'Gender, Sexuality & Intimacy',
    slug: 'gender-sexuality-and-intimacy',
    aliases: ['Sexuality, Gender Identity, and Intimacy', 'Gender & Sexuality', 'Gender Identity'],
    searchTerms: ['gender', 'sexuality', 'lgbtq', 'coming out', 'intimacy', 'sex'],
  },
  {
    name: 'Meaning, Faith & Existential Questions',
    slug: 'meaning-faith-and-existential-questions',
    aliases: ['Spiritual Struggle / Existential Crisis', 'Spiritual Doubt', 'Existential', 'Life Purpose'],
    searchTerms: ['meaning', 'purpose', 'faith', 'spiritual', 'existential', 'religion'],
  },
  {
    name: 'General Mental Health',
    slug: 'general-mental-health',
    aliases: ['Mental Health', 'Physical Health', 'Emotional Regulation', 'Anger & Emotional Regulation', 'Current Events', 'Life Transitions', 'Social Media'],
    searchTerms: ['mental health', 'emotion', 'regulation', 'anger', 'life transition', 'physical symptoms', 'current events', 'social media'],
  },
];

const aliasToTopic = new Map<string, CanonicalTopic>();
for (const topic of canonicalTopics) {
  aliasToTopic.set(normalizeTopicKey(topic.name), topic);
  aliasToTopic.set(normalizeTopicKey(topic.slug), topic);
  for (const alias of topic.aliases) aliasToTopic.set(normalizeTopicKey(alias), topic);
}

const crisisPatterns = [/suicid/i, /self[-\s]?harm/i, /kill myself/i, /overdose/i, /cannot stay safe/i, /immediate danger/i];
const sensitivePatterns = [
  /trauma|ptsd|flashback|abuse|abusive|stalking|coerc/i,
  /addiction|relapse|substance|withdrawal/i,
  /medication|antidepressant|ssri|psychiatr/i,
  /psychosis|hallucinat|delusion/i,
  /pregnan|postpartum/i,
  /teen|child|minor/i,
];
const careNavigationPatterns = [/therapy|therapist|counseling|treatment|professional help|inpatient|outpatient|diagnos/i];
const demandPatterns = [/how do i/i, /what should i/i, /why do i/i, /do i need/i, /is it normal/i, /when should/i, /can .* help/i];

export function normalizeTopicKey(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugifyTopic(value: string) {
  return normalizeTopicKey(value).replace(/\s+/g, '-');
}

export function getCanonicalTopic(value: string | null | undefined) {
  const fallback = canonicalTopics.at(-1)!;
  if (!value) return fallback;
  return (
    aliasToTopic.get(normalizeTopicKey(value)) ?? {
      name: value,
      slug: slugifyTopic(value),
      aliases: [],
      searchTerms: normalizeTopicKey(value).split(' ').filter(Boolean),
    }
  );
}

export function canonicalizeTopicName(value: string | null | undefined) {
  return getCanonicalTopic(value).name;
}

export function getRiskClass(question: Question): RiskClass {
  const haystack = searchableQuestionText(question);
  if (crisisPatterns.some((pattern) => pattern.test(haystack))) return 'crisis';
  if (sensitivePatterns.some((pattern) => pattern.test(haystack))) return 'sensitive';
  if (careNavigationPatterns.some((pattern) => pattern.test(haystack))) return 'care-navigation';
  return 'standard';
}

export function getReviewTier(question: Question) {
  const status = question.review_status?.toLowerCase().trim();
  const hasReviewer = Boolean(question.reviewed_by?.trim());
  const hasSources = Array.isArray(question.source_refs) && question.source_refs.length > 0;

  if (status === 'clinically_reviewed') return 'Clinically reviewed';
  if (['reviewed', 'approved', 'published'].includes(status || '') && hasReviewer && hasSources) return 'Human reviewed + source aligned';
  if (['reviewed', 'approved', 'published'].includes(status || '') && hasReviewer) return 'Human reviewed';
  if (hasSources) return 'Source aligned';
  return 'Needs human review';
}

export function getUpgradePriority(question: Question) {
  const riskClass = getRiskClass(question);
  const text = searchableQuestionText(question);
  const slug = question.slug;
  let score = 0;
  const reasons: string[] = [];

  if (riskClass === 'crisis') {
    score += 100;
    reasons.push('crisis-sensitive');
  } else if (riskClass === 'sensitive') {
    score += 70;
    reasons.push('sensitive mental-health topic');
  } else if (riskClass === 'care-navigation') {
    score += 45;
    reasons.push('care-navigation intent');
  }

  if (demandPatterns.some((pattern) => pattern.test(question.question))) {
    score += 20;
    reasons.push('natural high-demand question phrasing');
  }

  if (!Array.isArray(question.source_refs) || question.source_refs.length === 0) {
    score += 16;
    reasons.push('missing visible sources');
  }

  if (!question.reviewed_by) {
    score += 14;
    reasons.push('needs attributable reviewer');
  }

  if (/-\d{6}-\d{3}$|-[a-z]\d[a-z]\d[a-z]\d$/i.test(slug) || slug.length > 72) {
    score += 12;
    reasons.push('legacy/prototype slug');
  }

  if (/diagnos|medication|therap|suicid|self[-\s]?harm|abuse|addiction|depress|anxiety|panic/i.test(text)) {
    score += 10;
    reasons.push('high-impact query language');
  }

  return {
    score,
    riskClass,
    topic: canonicalizeTopicName(question.category || question.raw_category || question.primary_theme),
    reasons,
  };
}

export function getCanonicalTopicSummaries(questions: Question[]) {
  const bySlug = new Map<
    string,
    CanonicalTopic & {
      count: number;
      relatedQuestionSlugs: string[];
    }
  >();

  for (const question of questions) {
    const topic = getCanonicalTopic(question.category || question.raw_category || question.primary_theme);
    const current =
      bySlug.get(topic.slug) ??
      ({
        ...topic,
        count: 0,
        relatedQuestionSlugs: [],
      });

    current.count += 1;
    if (current.relatedQuestionSlugs.length < 24) {
      current.relatedQuestionSlugs.push(question.slug);
    }

    bySlug.set(topic.slug, current);
  }

  return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function searchableQuestionText(question: Question) {
  return normalizeTopicKey(
    [
      question.question,
      question.slug.replace(/-/g, ' '),
      question.improved_title,
      question.improved_summary,
      question.short_answer,
      question.answer,
      question.primary_theme,
      question.triage,
      question.category,
      question.raw_category,
    ]
      .filter(Boolean)
      .join(' ')
  );
}
