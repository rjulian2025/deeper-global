import type { Question } from '@/lib/supabase';
import type { ReviewerContentGroup, ReviewerProfile, ReviewerServiceOffering } from '@/data/reviewers';

export type ReviewerQuickLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type CollapsedServiceRow = {
  label: string;
  price: string;
};

export type ReviewGroupDisplay = {
  name: string;
  viewAllPath?: string;
  visible: Question[];
  totalCount: number;
  hiddenCount: number;
};

export const REVIEWER_EXCERPT_MAX = 140;
export const REVIEWER_GROUP_VISIBLE_MAX = 3;

export function buildReviewerQuickLinks(reviewer: ReviewerProfile): ReviewerQuickLink[] {
  const links: ReviewerQuickLink[] = [];

  if (reviewer.primaryCta) {
    links.push({ ...reviewer.primaryCta, external: true });
  }

  if (reviewer.reviewedContentGroups?.length || reviewer.reviewedKnowledgeTitle) {
    links.push({ label: 'View reviewed answers', href: '#reviewed-knowledge' });
  }

  if (reviewer.hubConnection) {
    links.push({
      label: reviewer.hubConnection.hubLabel,
      href: reviewer.hubConnection.hubPath,
    });
  }

  return links;
}

export function dedupeReviewGroups(
  groups: ReviewerContentGroup[],
  questionsBySlug: Map<string, Question>,
): ReviewerContentGroup[] {
  const seen = new Set<string>();

  return groups
    .map((group) => {
      const slugs = group.slugs.filter((slug) => {
        if (seen.has(slug)) return false;
        if (!questionsBySlug.has(slug)) return false;
        seen.add(slug);
        return true;
      });

      return { ...group, slugs };
    })
    .filter((group) => group.slugs.length > 0);
}

export function buildReviewGroupDisplays(
  groups: ReviewerContentGroup[],
  questionsBySlug: Map<string, Question>,
  visibleMax = REVIEWER_GROUP_VISIBLE_MAX,
): ReviewGroupDisplay[] {
  const deduped = dedupeReviewGroups(groups, questionsBySlug);

  return deduped.map((group) => {
    const questions = group.slugs
      .map((slug) => questionsBySlug.get(slug))
      .filter((question): question is Question => Boolean(question));

    return {
      name: group.name,
      viewAllPath: group.viewAllPath,
      visible: questions.slice(0, visibleMax),
      totalCount: questions.length,
      hiddenCount: Math.max(0, questions.length - visibleMax),
    };
  });
}

function serviceShortLabel(name: string): string {
  if (/^OCD\b/i.test(name)) return 'OCD';
  if (/Anxiety/i.test(name)) return 'anxiety';
  if (/Depression/i.test(name)) return 'depression';
  if (/Standalone Diagnostic/i.test(name)) return 'standalone diagnostic';
  if (/Full ADHD/i.test(name)) return 'full ADHD assessment';
  return name.replace(/ Evaluation$/i, '');
}

export function collapseServiceOfferings(offerings: ReviewerServiceOffering[]): CollapsedServiceRow[] {
  const priceOrder: string[] = [];
  const byPrice = new Map<string, ReviewerServiceOffering[]>();

  for (const offering of offerings) {
    if (!byPrice.has(offering.price)) {
      priceOrder.push(offering.price);
      byPrice.set(offering.price, []);
    }
    byPrice.get(offering.price)?.push(offering);
  }

  return priceOrder.map((price) => {
    const items = byPrice.get(price) ?? [];

    if (items.length === 1) {
      return { label: items[0].name, price };
    }

    return {
      label: items.map((item) => serviceShortLabel(item.name)).join(' / '),
      price,
    };
  });
}

export function getReviewerLocationShort(reviewer: ReviewerProfile): string | null {
  if (!reviewer.locationLine) return null;
  const parts = reviewer.locationLine.split('·').map((part) => part.trim());
  return parts[parts.length - 1] ?? reviewer.locationLine;
}

export function getReviewerPracticeLocation(reviewer: ReviewerProfile): string | null {
  if (!reviewer.practiceName) return null;
  const location = getReviewerLocationShort(reviewer);
  return location ? `${reviewer.practiceName} · ${location}` : reviewer.practiceName;
}

export function getExpertiseInlineTerms(reviewer: ReviewerProfile): string[] {
  if (reviewer.expertiseDomains?.length) {
    return reviewer.expertiseDomains.map((domain) => domain.label);
  }

  return reviewer.expertiseTags;
}

export function topicAnswersLabel(topic: string, count: number): string {
  const topicLower = topic.toLowerCase();
  return `View all ${count} ${topicLower} ${count === 1 ? 'answer' : 'answers'} →`;
}
