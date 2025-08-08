export function stripExternalLinks(html: string, allowDeeperOnly = false) {
  if (!html) return html;

  // 1) Replace markdown links [text](url) with plain text
  let out = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi, '$1');

  // 2) Replace HTML anchors with their inner text
  out = out.replace(/<a[^>]*>(.*?)<\/a>/gis, '$1');

  // 3) Remove bare URLs
  out = out.replace(/https?:\/\/[^\s)]+/gi, '');

  if (allowDeeperOnly) {
    // If we ever pass allowDeeperOnly=true, we'll keep deeper.global and strip others.
    // Re-add deeper.global links by detecting the pattern we just removed (skip for now).
  }
  return out;
}

export const containsExternalUrl = (s: string) =>
  /(https?:\/\/|www\.)/i.test(s || '');
