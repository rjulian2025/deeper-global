/** Shared Open Graph card artwork (1200×630) for answer pages and site defaults. */

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const EYEBROW = 'THE QUESTIONS YOU ASK WHEN NO ONE IS LOOKING';
const DEFAULT_HEADLINE = 'Mental health answers worth asking';
const DEFAULT_SUBCOPY =
  'Clinically reviewed mental health answers for questions too personal, too tangled, or too hard to ask out loud.';

export const OG_IMAGE_WIDTH = OG_WIDTH;
export const OG_IMAGE_HEIGHT = OG_HEIGHT;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function wrapOgHeadline(text, maxCharsPerLine = 38, maxLines = 3) {
  const normalized = String(text).replace(/\s+/g, ' ').trim();
  if (!normalized) return [DEFAULT_HEADLINE];

  const words = normalized.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length >= maxLines - 1) break;
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === maxLines && words.length > 0) {
    const used = lines.join(' ').split(' ').length;
    if (used < words.length) {
      const last = lines[lines.length - 1];
      if (!last.endsWith('…') && last.length + 1 <= maxCharsPerLine - 1) {
        lines[lines.length - 1] = `${last}…`;
      } else if (!last.endsWith('…')) {
        lines[lines.length - 1] = `${last.slice(0, maxCharsPerLine - 1)}…`;
      }
    }
  }

  return lines.length > 0 ? lines : [DEFAULT_HEADLINE];
}

function headlineTspans(lines, x = 72, startY = 152, lineHeight = 62) {
  return lines
    .map((line, index) => {
      const y = startY + index * lineHeight;
      return `<tspan x="${x}" y="${y}">${escapeXml(line)}</tspan>`;
    })
    .join('');
}

export function buildAnswerOgSvg(title) {
  const headlineLines = wrapOgHeadline(title);
  const headlineBlock = headlineTspans(headlineLines);

  return buildOgSvgMarkup({
    headlineBlock,
    subcopyY: headlineLines.length >= 3 ? 360 : headlineLines.length >= 2 ? 318 : 276,
  });
}

export function buildDefaultOgSvg() {
  const headlineLines = wrapOgHeadline(DEFAULT_HEADLINE, 42, 2);
  const headlineBlock = headlineTspans(headlineLines, 72, 152, 62);

  return buildOgSvgMarkup({
    headlineBlock,
    subcopyY: headlineLines.length >= 2 ? 318 : 276,
    subcopy: DEFAULT_SUBCOPY,
  });
}

function buildOgSvgMarkup(options) {
  const subcopy = options.subcopy ?? DEFAULT_SUBCOPY;
  const subcopyLines = wrapOgHeadline(subcopy, 52, 2);
  const subcopyTspans = subcopyLines
    .map((line, index) => {
      const y = options.subcopyY + index * 34;
      return `<tspan x="72" y="${y}">${escapeXml(line)}</tspan>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" role="img">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e1f33" />
      <stop offset="55%" stop-color="#102a43" />
      <stop offset="100%" stop-color="#163552" />
    </linearGradient>
  </defs>
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#bg)" />
  <text x="72" y="92" fill="#a8cde8" font-family="Inter, sans-serif" font-size="18" font-weight="600" letter-spacing="3.2">${escapeXml(EYEBROW)}</text>
  <text fill="#fffdf9" font-family="'Noto Serif Display', serif" font-size="54" font-weight="600" letter-spacing="-0.5">
    ${options.headlineBlock}
  </text>
  <text fill="rgba(255,253,249,0.72)" font-family="Inter, sans-serif" font-size="24" font-weight="400">
    ${subcopyTspans}
  </text>
  <text x="72" y="572" fill="#a8cde8" font-family="Inter, sans-serif" font-size="22" font-weight="500" letter-spacing="0.4">deeper.global</text>
  <text x="1128" y="572" text-anchor="end" fill="rgba(255,253,249,0.48)" font-family="Inter, sans-serif" font-size="18" font-weight="500" letter-spacing="2.4">DEEPER GLOBAL</text>
</svg>`;
}

export function getAnswerDisplayTitle(question) {
  const improved = typeof question.improved_title === 'string' ? question.improved_title.replace(/\s+/g, ' ').trim() : '';
  const raw = typeof question.question === 'string' ? question.question.replace(/\s+/g, ' ').trim() : '';
  return improved || raw || question.slug || '';
}
