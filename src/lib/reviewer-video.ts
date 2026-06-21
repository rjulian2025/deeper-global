import type { ReviewerVideoModule } from '@/data/reviewers';

export function getVideoMetaLabel(video: ReviewerVideoModule): string {
  if (video.status === 'live') return 'VIDEO';

  const suffix = (video.statusLabel ?? 'Coming soon').toUpperCase();
  return `VIDEO · ${suffix}`;
}

export function isVideoInteractive(video: ReviewerVideoModule): boolean {
  return video.status === 'live' && Boolean(video.embedUrl);
}
