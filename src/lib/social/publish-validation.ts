/** Matches canonical and legacy answer URLs in social post bodies. */
export const ANSWER_URL_PATTERN = /https?:\/\/(?:www\.)?deeper\.global\/answers\/([^/?#\s]+)/i;

export function normalizeAnswerSlug(value: string) {
  return decodeURIComponent(value.trim().replace(/\/+$/, ''));
}

export function extractAnswerSlugFromBody(body: string): string | null {
  const match = body.match(ANSWER_URL_PATTERN);
  return match ? normalizeAnswerSlug(match[1]) : null;
}

export function validateSocialPostForPublish(body: string, expectedSlug: string) {
  const trimmed = body.trim();
  if (!trimmed) return 'x_post_body_required';

  const embeddedSlug = extractAnswerSlugFromBody(trimmed);
  if (!embeddedSlug) return 'x_post_missing_answer_url';

  const normalizedExpected = normalizeAnswerSlug(expectedSlug);
  if (embeddedSlug !== normalizedExpected) {
    return `x_post_slug_mismatch:${embeddedSlug}:${normalizedExpected}`;
  }

  return null;
}
