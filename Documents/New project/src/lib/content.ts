import type { Question } from './supabase';

const crisisTerms = [
  'suicide',
  'suicidal',
  'self-harm',
  'self harm',
  'kill myself',
  'overdose',
  'crisis',
];

export type CategorySummary = {
  name: string;
  slug: string;
  count: number;
  description: string;
};

export type EntitySummary = CategorySummary & {
  type: 'Topic';
  canonicalUrl: string;
  sameAs: string[];
  relatedQuestionSlugs: string[];
};

const entityAliases: Record<string, string[]> = {
  'Addiction and Recovery': ['Substance use recovery', 'Sobriety', 'Relapse prevention'],
  'Addiction & Recovery': ['Substance use recovery', 'Sobriety', 'Relapse prevention'],
  'Anxiety and Stress': ['Anxiety', 'Stress', 'Worry', 'Panic'],
  'Anxiety & Stress': ['Anxiety', 'Stress', 'Worry', 'Panic'],
  Depression: ['Depressive symptoms', 'Mood disorders', 'Low mood'],
  'Family and Parenting': ['Parenting', 'Family relationships', 'Children and teens'],
  'Family & Parenting': ['Parenting', 'Family relationships', 'Children and teens'],
  'Grief and Loss': ['Bereavement', 'Loss', 'Complicated grief'],
  'Grief & Loss': ['Bereavement', 'Loss', 'Complicated grief'],
  'Identity and Self-Worth': ['Self-worth', 'Identity', 'Self-esteem'],
  'Identity & Self-Worth': ['Self-worth', 'Identity', 'Self-esteem'],
  'Relationships and Communication': ['Relationships', 'Communication', 'Conflict'],
  'Relationships & Communication': ['Relationships', 'Communication', 'Conflict'],
  'Therapy and Mental Health': ['Therapy', 'Mental health treatment', 'Care navigation'],
  'Therapy & Mental Health': ['Therapy', 'Mental health treatment', 'Care navigation'],
  'Trauma and Grief': ['Trauma', 'Grief', 'Triggers'],
  'Trauma & Grief': ['Trauma', 'Grief', 'Triggers'],
  'Work and Burnout': ['Burnout', 'Work stress', 'Workplace mental health'],
  'Work & Burnout': ['Burnout', 'Work stress', 'Workplace mental health'],
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function categoryPath(category: string | null) {
  return `/categories/${slugify(category || 'general')}`;
}

export function displayCategory(question: Question) {
  return question.category || question.raw_category || 'General';
}

export function formatDate(value: string | null) {
  if (!value) return 'Not yet reviewed';

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function toPlainText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncate(value: string, maxLength = 240) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

export function isCrisisSensitive(question: Question) {
  const text = `${question.question} ${question.short_answer} ${question.triage ?? ''}`.toLowerCase();
  return crisisTerms.some((term) => text.includes(term));
}

export function getCategorySummaries(questions: Question[]): CategorySummary[] {
  const counts = new Map<string, number>();

  for (const question of questions) {
    const category = displayCategory(question);
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: slugify(name),
      description: describeCategory(name, count),
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function describeCategory(name: string, count: number) {
  return `${count} vetted answer${count === 1 ? '' : 's'} about ${name.toLowerCase()}, written for people seeking clear next steps.`;
}

export function pluralizeAnswer(count: number) {
  return `${count} answer${count === 1 ? '' : 's'}`;
}

export function getRelatedQuestions(current: Question, questions: Question[], limit = 4) {
  return questions
    .filter((question) => question.slug !== current.slug)
    .filter((question) => displayCategory(question) === displayCategory(current))
    .slice(0, limit);
}

export function getEntitySummaries(questions: Question[]): EntitySummary[] {
  return getCategorySummaries(questions).map((category) => ({
    ...category,
    type: 'Topic',
    canonicalUrl: `/entities/${category.slug}`,
    sameAs: entityAliases[category.name] ?? [],
    relatedQuestionSlugs: questions
      .filter((question) => displayCategory(question) === category.name)
      .slice(0, 24)
      .map((question) => question.slug),
  }));
}

export function getQuestionCitation(question: Question) {
  return {
    title: question.question,
    url: `https://deeper.global/answers/${question.slug}`,
    publisher: 'Deeper Global',
    datePublished: question.created_at,
    dateModified: question.updated_at || question.created_at,
  };
}
