/** Cache-busted OG image path for answer pages (served via /api/og/answer rewrite). */

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function answerOgImagePath(slug: string, updatedAt?: string | null): string {
  const version = updatedAt?.trim() ? encodeURIComponent(updatedAt.trim()) : '1';
  return `/og/answers/${slug}.png?v=${version}`;
}
