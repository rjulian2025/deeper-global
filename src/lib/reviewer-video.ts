import type { ReviewerProfile, ReviewerVideoModule } from '@/data/reviewers';

export function getVideoMetaLabel(video: ReviewerVideoModule): string {
  if (video.status === 'live') return 'VIDEO';

  const suffix = (video.statusLabel ?? 'Coming soon').toUpperCase();
  return `VIDEO · ${suffix}`;
}

export function isVideoInteractive(video: ReviewerVideoModule): boolean {
  return video.status === 'live' && Boolean(video.embedUrl);
}

/** Prefer `videoModules` when present; otherwise fall back to a single `videoModule`. */
export function getReviewerVideos(reviewer: ReviewerProfile): ReviewerVideoModule[] {
  if (reviewer.videoModules?.length) return reviewer.videoModules;
  return reviewer.videoModule ? [reviewer.videoModule] : [];
}
