#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../../..');
const outPath = join(root, 'src/data/reviewer-specialty-crosswalk.json');

/**
 * Export crosswalk JSON by evaluating a CommonJS-compatible transform of the TS data file.
 * Keeps assignment scripts in sync with the version-controlled TS source.
 */
export function writeCrosswalkJson() {
  const ts = readFileSync(join(root, 'src/data/reviewer-specialty-crosswalk.ts'), 'utf8');
  const marker = 'export const specialtyCrosswalk: SpecialtyCrosswalkEntry[] = ';
  const start = ts.indexOf(marker);
  if (start < 0) throw new Error('Could not find specialtyCrosswalk export');
  const from = start + marker.length;
  const endMarker = '\nexport function normalizeSpecialtyKey';
  const end = ts.indexOf(endMarker, from);
  if (end < 0) throw new Error('Could not find end of specialtyCrosswalk');
  let literal = ts.slice(from, end).trim();
  if (literal.endsWith(';')) literal = literal.slice(0, -1);

  const helper = `
    function topic(id, weight, rationale) { return { id, weight, rationale }; }
    return ${literal};
  `;
  // eslint-disable-next-line no-new-func
  const specialtyCrosswalk = new Function(helper)();
  writeFileSync(outPath, JSON.stringify({ specialtyCrosswalk }, null, 2) + '\n');
  return outPath;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('export-crosswalk-json.mjs')) {
  const path = writeCrosswalkJson();
  console.log(JSON.stringify({ wrote: path }, null, 2));
}
