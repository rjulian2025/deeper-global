/**
 * Removes Helmet blocks, Navigation imports/usages, and scroll-only useEffects
 * from migrated React page views (Astro provides layout + nav).
 */
import fs from "node:fs";
import path from "node:path";

const roots = [
  "src/views/pages",
  "src/views/pages/answers",
  "src/views/pages/strategic-answers",
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (name.endsWith(".tsx")) files.push(p);
  }
  return files;
}

function strip(content) {
  let s = content;

  // Remove Navigation import
  s = s.replace(
    /import Navigation from ["']@\/components\/Navigation["'];\s*\n/g,
    ""
  );

  // Remove Helmet import
  s = s.replace(/import \{ Helmet \} from ["']react-helmet-async["'];\s*\n/g, "");
  s = s.replace(/import \{ Helmet \} from ["']react-helmet-async["'];\r?\n/g, "");

  // Remove <Navigation /> (possibly with whitespace)
  s = s.replace(/\n\s*<Navigation\s*\/>\s*\n/g, "\n");

  // Remove Helmet blocks (non-greedy)
  s = s.replace(
    /<Helmet>[\s\S]*?<\/Helmet>\s*/g,
    ""
  );

  // Remove scroll-only useEffect
  s = s.replace(
    /useEffect\(\(\) => \{\s*window\.scrollTo\(0,\s*0\);\s*\},\s*\[\]\);\s*\n/g,
    ""
  );

  // Clean unused useEffect import if line only had scroll
  // (manual review may be needed for mixed useEffect files)

  return s;
}

for (const root of roots) {
  const full = path.join(process.cwd(), root);
  for (const file of walk(full)) {
    const before = fs.readFileSync(file, "utf8");
    const after = strip(before);
    if (after !== before) {
      fs.writeFileSync(file, after);
      console.log("stripped:", file);
    }
  }
}
