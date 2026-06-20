import { adhdHubSlugs, isAdhdHubSlug } from './adhd-hub';
import { aiMentalHealthHubSlugs, isAiMentalHealthHubSlug } from './ai-mental-health-hub';
import { isModalityAnswerSlug } from './modality-hub';
import type { AnswerSection, Question } from './supabase';
import { siteUrl } from './site';

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
  return `/categories/${slugify(category || 'general')}/`;
}

export function answerPath(slug: string) {
  return `/answers/${slug}/`;
}

export type PhraseIndex = Map<string, string>;

export function buildPhraseIndex(questions: Question[], currentSlug?: string): PhraseIndex {
  const index = new Map<string, string>();

  for (const q of questions) {
    if (q.slug === currentSlug) continue;
    if (!q.slug) continue;

    const path = answerPath(q.slug);
    const candidates: string[] = [];

    if (q.primary_theme) {
      candidates.push(q.primary_theme.trim());
    }

    if (q.improved_title) {
      const words = q.improved_title
        .replace(/[?.,!]/g, '')
        .trim()
        .split(/\s+/)
        .slice(0, 5);
      if (words.length >= 3) {
        candidates.push(words.join(' '));
      }
    }

    if (q.question) {
      const words = q.question
        .replace(/[?.,!]/g, '')
        .trim()
        .split(/\s+/)
        .slice(0, 5);
      if (words.length >= 3) {
        candidates.push(words.join(' '));
      }
    }

    for (const phrase of candidates) {
      const key = phrase.toLowerCase().trim();
      if (key.length >= 3 && !index.has(key)) {
        index.set(key, path);
      }
    }
  }

  return new Map([...index.entries()].sort((a, b) => b[0].length - a[0].length));
}

export function bodyTextToParagraphHtml(text: string) {
  const trimmed = typeof text === 'string' ? text.trim() : '';
  if (!trimmed) return '';

  return trimmed
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('');
}

export function insertContextualLinks(html: string, phraseIndex: PhraseIndex, maxLinks = 6): string {
  if (!html || phraseIndex.size === 0) return html;

  let linksInserted = 0;
  let result = html;
  const usedPhrases = new Set<string>();

  for (const [phrase, path] of phraseIndex) {
    if (linksInserted >= maxLinks) break;
    if (usedPhrases.has(phrase)) continue;

    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!<a[^>]*>)(?<!href=")\\b(${escaped})\\b(?![^<]*<\\/a>)`, 'i');

    result = result.replace(/<p>(.*?)<\/p>/gs, (match, content) => {
      if (linksInserted >= maxLinks) return match;
      if (content.includes('<a ')) return match;

      const linked = content.replace(regex, (matched: string) => {
        if (linksInserted >= maxLinks) return matched;
        linksInserted += 1;
        usedPhrases.add(phrase);
        return `<a href="${path}" class="answer-body-link" data-link-type="contextual">${matched}</a>`;
      });

      return `<p>${linked}</p>`;
    });
  }

  return result;
}

export function displayCategory(question: Question) {
  return question.category || question.raw_category || 'General';
}

export function getAnswerDisplayTitle(question: Question) {
  return cleanText(question.improved_title) || question.question;
}

export function getAnswerSummary(question: Question) {
  return cleanText(question.improved_summary) || question.short_answer;
}

export function getDisplayLede(question: Question) {
  const staged = cleanText(question.staging_lede);
  if (staged) return staged;
  return getAnswerSummary(question);
}

export function getDisplayKeyTakeaways(question: Question) {
  const staged = getStringList(question.staging_key_takeaways);
  if (staged.length >= 5) return staged.slice(0, 5);
  return getKeyTakeaways(question);
}

function hasStagingBody(question: Question) {
  return Boolean(
    cleanText(question.staging_what_you_might_be_experiencing) &&
      cleanText(question.staging_what_can_help) &&
      cleanText(question.staging_when_to_reach_out)
  );
}

export function getDisplayAnswerSections(question: Question): AnswerSection[] {
  if (!hasStagingBody(question)) {
    return getStructuredAnswerSections(question);
  }

  return [
    {
      type: 'what-you-might-be-experiencing',
      heading: 'What you might be experiencing',
      body: cleanText(question.staging_what_you_might_be_experiencing),
    },
    {
      type: 'what-can-help',
      heading: 'What can help',
      body: cleanText(question.staging_what_can_help),
    },
    {
      type: 'when-to-reach-out',
      heading: 'When to reach out',
      body: cleanText(question.staging_when_to_reach_out),
    },
  ];
}

export function getDisplayAnswerHtml(question: Question) {
  const sections = getDisplayAnswerSections(question);

  if (sections.length) {
    return sections
      .map((section) => {
        const heading = section.heading
          ? `<h2 data-answer-section="${escapeHtml(section.type || slugify(section.heading))}">${escapeHtml(section.heading)}</h2>`
          : '';
        const body = paragraphizeText(section.body)
          .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
          .join('');

        return `<section class="answer-section">${heading}${body}</section>`;
      })
      .join('');
  }

  return formatAnswerHtml(question);
}

export function getAnswerSchemaQuestion(question: Question) {
  return cleanText(question.suggested_schema_question) || question.question;
}

export function getAnswerSchemaAnswer(question: Question) {
  const stagedCanonical = cleanText(question.staging_canonical_answer);
  if (stagedCanonical) return stagedCanonical;

  return cleanText(question.suggested_schema_answer) || getAnswerPlainText(question);
}

export function getPrimaryTheme(question: Question) {
  return cleanText(question.primary_theme) || displayCategory(question);
}

export function getRelatedThemeNames(question: Question) {
  return getStringList(question.related_themes);
}

export function getFollowUpQuestions(question: Question) {
  return getStringList(question.related_questions).slice(0, 6);
}

export function resolveFollowUpQuestions(
  question: Question,
  allQuestions: Question[]
): Question[] {
  const rawFollowUps = getFollowUpQuestions(question);
  const index = buildQuestionTextIndex(allQuestions);
  const seen = new Set<string>();
  const resolved: Question[] = [];

  for (const text of rawFollowUps) {
    const normalized = text.trim().toLowerCase().replace(/[?.,!]/g, '');

    let match =
      allQuestions.find((q) => {
        const qText = (q.question ?? '').trim().toLowerCase().replace(/[?.,!]/g, '');
        const qTitle = (q.improved_title ?? '').trim().toLowerCase().replace(/[?.,!]/g, '');

        return qText === normalized || qTitle === normalized;
      }) ?? findQuestionForFollowUpText(text, allQuestions, index);

    if (!match || match.slug === question.slug || seen.has(match.slug)) continue;

    seen.add(match.slug);
    resolved.push(match);
    if (resolved.length >= 6) break;
  }

  return resolved;
}

export function getCareNote(question: Question, crisisSensitive = false) {
  const explicitCareNote = cleanText(question.care_note);

  if (explicitCareNote) return explicitCareNote;

  if (crisisSensitive) {
    return 'If you may hurt yourself or someone else, call or text 988 in the U.S. or contact local emergency services now.';
  }

  return 'If this is interfering with daily life, relationships, work, sleep, or your sense of safety, consider talking with a licensed mental health professional.';
}

export function getKeyTakeaways(question: Question) {
  return getStringList(question.key_takeaways).slice(0, 5);
}

export function formatDate(value: string | null) {
  if (!value) return 'Not yet reviewed';

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, Number(value.slice(8, 10)))
    : new Date(value);

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
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

export function getAnswerPlainText(question: Question) {
  const sections = getStructuredAnswerSections(question);

  if (sections.length) {
    return sections
      .map((section) => [section.heading, section.body].filter(Boolean).join('. '))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return toPlainText(question.answer);
}

export function formatAnswerHtml(question: Question) {
  const sections = getStructuredAnswerSections(question);

  if (sections.length) {
    return sections
      .map((section) => {
        const heading = section.heading
          ? `<h2 data-answer-section="${escapeHtml(section.type || slugify(section.heading))}">${escapeHtml(section.heading)}</h2>`
          : '';
        const body = paragraphizeText(section.body)
          .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
          .join('');

        return `<section class="answer-section">${heading}${body}</section>`;
      })
      .join('');
  }

  if (hasBlockHtml(question.answer)) {
    return question.answer;
  }

  return paragraphizeText(question.answer)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('');
}

export function getStructuredAnswerSections(question: Question): AnswerSection[] {
  if (!Array.isArray(question.answer_sections)) {
    return [];
  }

  return question.answer_sections.filter(
    (section): section is AnswerSection => Boolean(section && typeof section.body === 'string' && section.body.trim())
  );
}

export function truncate(value: string, maxLength = 240) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).replace(/\s+\S*$/, '')}...`;
}

export function getAnswerMetaDescription(question: Question) {
  const improvedDescription = cleanText(question.improved_meta_description);

  if (improvedDescription) {
    return truncate(improvedDescription, 158);
  }

  const shortAnswer = toPlainText(question.short_answer || '');
  const category = displayCategory(question).toLowerCase();
  const fallback = `Understand this ${category} question with clear, evidence-informed guidance from Deeper Global.`;
  const description = shortAnswer.length >= 90 ? shortAnswer : `${shortAnswer || fallback} Learn what may be happening and when support could help.`;

  return truncate(description, 158);
}

export function getCategoryMetaDescription(category: string, count: number) {
  return truncate(
    `Explore ${count} evidence-informed Deeper Global answer${count === 1 ? '' : 's'} about ${category.toLowerCase()}, including common questions, patterns, and care-seeking language.`,
    158
  );
}

export function shouldIndexQuestion(question: Question) {
  const status = question.review_status?.toLowerCase().trim();

  if (!status) return true;

  return ['approved', 'published', 'reviewed'].includes(status);
}

function hasBlockHtml(value: string) {
  return /<\/?(p|h[1-6]|ul|ol|li|blockquote|section|article|div)\b/i.test(value);
}

function paragraphizeText(value: string) {
  const text = toPlainText(value);

  if (!text) return [];

  const explicitParagraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (explicitParagraphs.length > 1) {
    return explicitParagraphs.flatMap(splitLongParagraph);
  }

  return splitLongParagraph(text);
}

function splitLongParagraph(value: string) {
  const sentences = value.match(/[^.!?]+(?:[.!?]+['"]?|$)/g)?.map((sentence) => sentence.trim()) ?? [value];
  const paragraphs: string[] = [];
  let current: string[] = [];

  for (const sentence of sentences) {
    const nextLength = [...current, sentence].join(' ').length;
    const shouldStartNew =
      current.length > 0 && (isTransitionSentence(sentence) || nextLength > 760 || current.length >= 8);

    if (shouldStartNew) {
      paragraphs.push(current.join(' '));
      current = [];
    }

    current.push(sentence);
  }

  if (current.length) {
    paragraphs.push(current.join(' '));
  }

  return paragraphs;
}

function isTransitionSentence(sentence: string) {
  return /^(This pattern|When you|The most effective approach|You might also|Remember that|One helpful|Building|If you|Over time)/i.test(
    sentence
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanText(value: string | null | undefined) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function getStringList(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        const value = record.question ?? record.theme ?? record.name ?? record.text ?? record.title;
        return typeof value === 'string' ? value : '';
      }

      return '';
    })
    .map((item) => cleanText(item))
    .filter(Boolean);
}

export function isCrisisSensitive(question: Question) {
  const text = `${question.question} ${question.improved_title ?? ''} ${question.short_answer} ${question.improved_summary ?? ''} ${question.triage ?? ''}`.toLowerCase();
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

export type FollowUpLink = {
  label: string;
  href: string;
  slug: string | null;
  matched: boolean;
};

function normalizeMatchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildQuestionTextIndex(questions: Question[]) {
  const index = new Map<string, Question>();

  for (const question of questions) {
    index.set(normalizeMatchText(question.question), question);
    const title = question.improved_title?.trim();
    if (title) index.set(normalizeMatchText(title), question);
  }

  return index;
}

function looksLikeSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(value);
}

function findQuestionForFollowUpText(text: string, questions: Question[], index: Map<string, Question>) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  if (looksLikeSlug(trimmed)) {
    return questions.find((question) => question.slug === trimmed) ?? null;
  }

  const normalized = normalizeMatchText(trimmed);
  const exact = index.get(normalized);
  if (exact) return exact;

  let best: { question: Question; score: number } | null = null;

  for (const question of questions) {
    const candidates = [normalizeMatchText(question.question)];
    if (question.improved_title?.trim()) {
      candidates.push(normalizeMatchText(question.improved_title));
    }

    for (const candidate of candidates) {
      if (!candidate) continue;
      if (candidate === normalized) return question;
      if (candidate.includes(normalized) || normalized.includes(candidate)) {
        const score = Math.min(candidate.length, normalized.length);
        if (!best || score > best.score) best = { question, score };
      }
    }
  }

  return best?.question ?? null;
}

export function resolveFollowUpQuestionLinks(
  question: Question,
  questions: Question[],
  limit = 6
): FollowUpLink[] {
  const index = buildQuestionTextIndex(questions);
  const links: FollowUpLink[] = [];
  const seen = new Set<string>();

  for (const text of getFollowUpQuestions(question)) {
    const match = findQuestionForFollowUpText(text, questions, index);
    if (match && match.slug !== question.slug && !seen.has(match.slug)) {
      seen.add(match.slug);
      links.push({
        label: getAnswerDisplayTitle(match),
        href: answerPath(match.slug),
        slug: match.slug,
        matched: true,
      });
      continue;
    }

    links.push({
      label: text,
      href: `/answers/?q=${encodeURIComponent(text)}`,
      slug: null,
      matched: false,
    });
  }

  return links.slice(0, limit);
}

function sharedThemeScore(current: Question, candidate: Question) {
  const currentThemes = new Set(
    [getPrimaryTheme(current), ...getRelatedThemeNames(current), displayCategory(current)]
      .map((theme) => normalizeMatchText(theme))
      .filter(Boolean)
  );

  let score = 0;
  for (const theme of [getPrimaryTheme(candidate), ...getRelatedThemeNames(candidate)]) {
    if (currentThemes.has(normalizeMatchText(theme))) score += 3;
  }
  return score;
}

export function getRelatedQuestions(current: Question, questions: Question[], limit = 4) {
  const followUpSlugs = new Set(
    resolveFollowUpQuestionLinks(current, questions)
      .map((link) => link.slug)
      .filter((slug): slug is string => Boolean(slug))
  );

  const scored = questions
    .filter((question) => question.slug !== current.slug)
    .map((question) => {
      let score = 0;

      if (displayCategory(question) === displayCategory(current)) score += 2;
      score += sharedThemeScore(current, question);
      if (followUpSlugs.has(question.slug)) score += 6;
      if (isAdhdHubSlug(current.slug) && isAdhdHubSlug(question.slug)) score += 5;
      if (isAiMentalHealthHubSlug(current.slug) && isAiMentalHealthHubSlug(question.slug)) score += 5;
      if (isModalityAnswerSlug(current.slug) && isModalityAnswerSlug(question.slug)) score += 4;

      const currentInAdhdCluster = adhdHubSlugs.includes(current.slug);
      const candidateInAdhdCluster = adhdHubSlugs.includes(question.slug);
      if (currentInAdhdCluster && candidateInAdhdCluster) score += 3;

      const currentInAiCluster = aiMentalHealthHubSlugs.includes(current.slug);
      const candidateInAiCluster = aiMentalHealthHubSlugs.includes(question.slug);
      if (currentInAiCluster && candidateInAiCluster) score += 3;

      return { question, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.question.slug.localeCompare(b.question.slug));

  const results = scored.slice(0, limit).map((entry) => entry.question);

  if (results.length < limit) {
    const filler = questions
      .filter(
        (question) =>
          question.slug !== current.slug &&
          displayCategory(question) === displayCategory(current) &&
          !results.some((picked) => picked.slug === question.slug)
      )
      .slice(0, limit - results.length);
    results.push(...filler);
  }

  return results.slice(0, limit);
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
    title: getAnswerDisplayTitle(question),
    url: siteUrl(`/answers/${question.slug}`),
    publisher: 'Deeper Global',
    datePublished: question.created_at,
    dateModified: question.updated_at || question.created_at,
  };
}
