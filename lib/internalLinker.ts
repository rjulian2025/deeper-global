import { TERM_LINKS, CANON } from './internalLinkPolicy';

const MAX_LINKS_PER_DOC = 4;

export function addInternalLinks(html: string): string {
  if (!html) return html;
  
  let result = html;
  let linkCount = 0;
  
  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = Object.entries(TERM_LINKS)
    .sort(([a], [b]) => b.length - a.length);
  
  for (const [term, path] of sortedTerms) {
    if (linkCount >= MAX_LINKS_PER_DOC) break;
    
    // Create regex to match whole words only, case insensitive
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    
    // Replace the term with a link, but only if it's not already inside an anchor tag
    result = result.replace(regex, (match, offset, string) => {
      // Check if we're inside an anchor tag
      const beforeText = string.substring(0, offset);
      const afterText = string.substring(offset + match.length);
      
      // Count opening and closing anchor tags before this position
      const beforeOpenTags = (beforeText.match(/<a[^>]*>/g) || []).length;
      const beforeCloseTags = (beforeText.match(/<\/a>/g) || []).length;
      const afterCloseTags = (afterText.match(/<\/a>/g) || []).length;
      
      // If we're inside an anchor tag, don't link
      if (beforeOpenTags > beforeCloseTags) {
        return match;
      }
      
      // If we've reached the link limit, don't link
      if (linkCount >= MAX_LINKS_PER_DOC) {
        return match;
      }
      
      linkCount++;
      return `<a href="${CANON}${path}" class="internal-link">${match}</a>`;
    });
  }
  
  return result;
}
