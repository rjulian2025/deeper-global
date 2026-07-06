import { reviewerProfiles } from '@/data/reviewers';
import {
  answerPath,
  categoryPath,
  displayCategory,
  formatDate,
  getAnswerDisplayTitle,
  getAnswerPlainText,
  getAnswerSummary,
  getFollowUpQuestions,
  getPrimaryTheme,
  getRelatedThemeNames,
} from './content';
import {
  getPilotEnrichmentBySlug,
  getSemanticSearchTerms,
  resolveSemanticEnrichmentSync,
} from './semantic-enrichment';
import type { Question } from './supabase';

export type AnswersSearchIndexEntry = {
  title: string;
  summary: string;
  category: string;
  categoryUrl: string;
  url: string;
  updated: string;
  searchableText: string;
};

/**
 * Search index for the /answers/ library, served as a static JSON asset
 * (/answers/search-index.json) and lazy-loaded by the client search script.
 * searchableText intentionally includes the full answer plain text so recall
 * matches the previous inline-index behavior.
 */
export function buildAnswersSearchIndex(questions: Question[]): AnswersSearchIndexEntry[] {
  const pilotBySlug = getPilotEnrichmentBySlug();

  const questionEntries = questions.map((question) => {
    const category = displayCategory(question);
    const title = getAnswerDisplayTitle(question);
    const summary = getAnswerSummary(question);
    const enrichment = resolveSemanticEnrichmentSync(question, pilotBySlug);
    const searchTerms = getSemanticSearchTerms(enrichment);
    const searchableText = [
      question.question,
      title,
      summary,
      category,
      getPrimaryTheme(question),
      ...getRelatedThemeNames(question),
      ...getFollowUpQuestions(question),
      getAnswerPlainText(question),
      ...searchTerms.high,
      ...searchTerms.medium,
      ...searchTerms.low,
    ].join(' ');

    return {
      title,
      summary,
      category,
      categoryUrl: categoryPath(category),
      url: answerPath(question.slug),
      updated: formatDate(question.updated_at || question.created_at),
      searchableText,
    };
  });

  const reviewerEntries = reviewerProfiles.map((reviewer) => {
    const nameParts = reviewer.name.replace(/^Dr\.\s*/i, '').split(' ');
    const lastName = nameParts[nameParts.length - 2] ?? '';
    const expertiseParts = [
      reviewer.expertiseSummary ?? '',
      ...(reviewer.expertiseTags ?? []),
      ...(reviewer.expertiseDomains?.map((d) => `${d.label} ${d.description}`) ?? []),
      ...(reviewer.modalities ?? []),
      ...(reviewer.overviewParagraphs ?? []),
      reviewer.credentialLine ?? '',
      reviewer.specialtyLabel ?? '',
    ];
    const searchableText = [
      reviewer.name,
      lastName,
      reviewer.bio,
      reviewer.specialtyLabel ?? '',
      'reviewer clinical reviewer reviewed by',
      ...expertiseParts,
    ].join(' ');

    return {
      title: `${reviewer.name} — Clinical Reviewer`,
      summary: reviewer.bio,
      category: 'Clinical Reviewer',
      categoryUrl: '/reviewers/',
      url: reviewer.url,
      updated: 'Jun 2026',
      searchableText,
    };
  });

  return [...questionEntries, ...reviewerEntries];
}
