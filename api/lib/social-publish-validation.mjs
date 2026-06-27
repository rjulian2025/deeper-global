/** Matches canonical and legacy answer URLs in social post bodies. */
export const ANSWER_URL_PATTERN = /https?:\/\/(?:www\.)?deeper\.global\/answers\/([^/?#\s]+)/i;

export function normalizeAnswerSlug(value) {
  return decodeURIComponent(String(value).trim().replace(/\/+$/, ''));
}

export function extractAnswerSlugFromBody(body) {
  const match = String(body ?? '').match(ANSWER_URL_PATTERN);
  return match ? normalizeAnswerSlug(match[1]) : null;
}

export function validateSocialPostForPublish(body, expectedSlug) {
  const trimmed = String(body ?? '').trim();
  if (!trimmed) return 'x_post_body_required';

  const embeddedSlug = extractAnswerSlugFromBody(trimmed);
  if (!embeddedSlug) return 'x_post_missing_answer_url';

  const normalizedExpected = normalizeAnswerSlug(expectedSlug);
  if (embeddedSlug !== normalizedExpected) {
    return `x_post_slug_mismatch:${embeddedSlug}:${normalizedExpected}`;
  }

  return null;
}
