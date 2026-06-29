import { Resvg } from '@resvg/resvg-js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = join(__dirname, '../fonts');

/** Bundled TTFs — Resvg on Vercel Linux has no system fonts; woff2 is not supported. */
const OG_FONT_FILES = [
  join(FONTS_DIR, 'Inter.ttf'),
  join(FONTS_DIR, 'NotoSerifDisplay.ttf'),
];

export function renderOgPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: {
      fontFiles: OG_FONT_FILES,
      loadSystemFonts: false,
      defaultFontFamily: 'Inter',
    },
  });
  return resvg.render().asPng();
}
