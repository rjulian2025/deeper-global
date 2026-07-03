import { answerPath, getAnswerDisplayTitle, getAnswerSummary } from '@/lib/content';
import { filterPublishableQuestions } from '@/lib/indexing-policy';
import { FEED_URL, SITE_NAME, SITE_URL, siteUrl } from '@/lib/site';
import type { Question } from '@/lib/supabase';

export type FeedItem = {
  title: string;
  href: string;
  description: string;
  pubDate: string;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(date: string) {
  return new Date(date).toUTCString();
}

export function getFeedItems(questions: Question[], limit = 50): FeedItem[] {
  return filterPublishableQuestions(questions)
    .map((question) => ({
      title: getAnswerDisplayTitle(question),
      href: answerPath(question.slug),
      description: getAnswerSummary(question),
      pubDate: question.updated_at || question.created_at,
    }))
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit);
}

export function buildRssFeed(items: FeedItem[]) {
  const latestDate = items[0]?.pubDate ?? new Date().toISOString();
  const channelItems = items
    .map(
      (item) => `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${siteUrl(item.href)}</link>
  <guid isPermaLink="true">${siteUrl(item.href)}</guid>
  <description>${escapeXml(item.description)}</description>
  <pubDate>${toRfc822(item.pubDate)}</pubDate>
</item>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Mental Health Answers</title>
    <link>${SITE_URL}/</link>
    <description>Recently updated expert-vetted mental health answers from Deeper Global — structured for people, search engines, and AI systems.</description>
    <language>en-us</language>
    <lastBuildDate>${toRfc822(latestDate)}</lastBuildDate>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
${channelItems}
  </channel>
</rss>`;
}
