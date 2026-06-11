// Generates Astro route wrappers under src/pages/
// Run: node scripts/generate-astro-routes.mjs
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();

const routes = [
  // path (URL without leading slash), view import path (after @/views/pages/), island component name for special cases
  { url: "ai-content", view: "AIContentLanding", island: "visible" },
  { url: "contact", islandComponent: "ContactIsland", island: "load" },
  { url: "meet-the-strategist", view: "MeetTheStrategist", island: "load" },
  { url: "packages", view: "Packages", island: "load" },
  { url: "consultation", view: "BrandClaritySession", island: "visible" },
  { url: "signal-call", view: "SignalCall", island: "visible" },
  { url: "blog", view: "BlogIndex", island: "visible" },
  { url: "blog/clarity-in-the-age-of-ai", view: "BlogClarityInAI", island: "visible" },
  { url: "blog/strategy-is-the-new-logo", view: "BlogStrategyIsTheNewLogo", island: "visible" },
  { url: "blog/scale-without-losing-soul", view: "BlogScaleWithoutLosingSoul", island: "visible" },
  { url: "blog/what-is-a-clarity-system", view: "BlogWhatIsAClaritySystem", island: "visible" },
  { url: "blog/brand-strategy-in-synthetic-era", view: "BlogBrandStrategyInSyntheticEra", island: "visible" },
  { url: "blog/brand-archetypes-ai-era", view: "BlogBrandArchetypesAIEra", island: "visible" },
  { url: "blog/clarity-operating-system", view: "BlogClarityOperatingSystem", island: "visible" },
  { url: "blog/mad-buddha", view: "BlogMadBuddha", island: "visible" },
  { url: "blog/second-brain-architecture", view: "BlogSecondBrainArchitecture", island: "visible" },
  { url: "case-study/loopo", view: "CaseStudyLoopo", island: "load" },
  { url: "clients", view: "Clients", island: "visible" },
  { url: "atlanta-brand-strategy", view: "AtlantaBrandStrategy", island: "visible" },
  { url: "rick-julian", view: "RickJulian", island: "visible" },
  { url: "strategic-answers", view: "strategic-answers/StrategicAnswersIndex", island: "visible" },
  { url: "strategic-answers/fractional-cmo-vs-agency", view: "strategic-answers/FractionalCMOvsAgency", island: "load" },
  { url: "strategic-answers/fractional-cmo-cost", view: "strategic-answers/FractionalCMOCost", island: "load" },
  { url: "strategic-answers/when-to-hire-fractional-cmo", view: "strategic-answers/WhenToHireFractionalCMO", island: "load" },
  { url: "strategic-answers/is-fractional-cmo-worth-it", view: "strategic-answers/IsFractionalCMOWorthIt", island: "load" },
  { url: "strategic-answers/fractional-cmo-saas-guide", view: "strategic-answers/FractionalCMOSaaSGuide", island: "load" },
  { url: "strategic-answers/why-growth-stalls", view: "strategic-answers/WhyGrowthStalls", island: "load" },
  { url: "strategic-answers/why-rebrands-fail", view: "strategic-answers/WhyRebrandsFail", island: "load" },
  { url: "strategic-answers/align-sales-and-marketing", view: "strategic-answers/AlignSalesAndMarketing", island: "load" },
  { url: "strategic-answers/gtm-system-not-campaign", view: "strategic-answers/GTMSystemNotCampaign", island: "load" },
  { url: "strategic-answers/installed-leadership-model", view: "strategic-answers/InstalledLeadershipModel", island: "load" },
  { url: "strategic-answers/what-does-a-cbo-do", view: "strategic-answers/WhatDoesACBODo", island: "load" },
  { url: "strategic-answers/brand-strategy-fails-without-leadership", view: "strategic-answers/BrandStrategyFailsWithoutLeadership", island: "load" },
  { url: "strategic-answers/brand-positioning-vs-brand-marketing", view: "strategic-answers/BrandPositioningVsBrandMarketing", island: "load" },
  { url: "answers", view: "answers/AnswersIndex", island: "visible" },
  { url: "answers/what-brand-strategy-actually-is", view: "answers/WhatBrandStrategyActuallyIs", island: "visible" },
  { url: "answers/what-creative-direction-controls", view: "answers/WhatCreativeDirectionControls", island: "visible" },
  { url: "answers/branding-vs-marketing", view: "answers/BrandingVsMarketing", island: "visible" },
  { url: "answers/when-rebrand-is-wrong", view: "answers/WhenRebrandIsWrong", island: "visible" },
  { url: "answers/founder-led-vs-committee-led", view: "answers/FounderLedVsCommitteeLed", island: "visible" },
  { url: "answers/what-breaks-when-brands-scale", view: "answers/WhatBreaksWhenBrandsScale", island: "visible" },
  { url: "answers/brand-strategy-vs-brand-identity", view: "answers/BrandStrategyVsBrandIdentity", island: "visible" },
  { url: "answers/creative-direction-vs-design", view: "answers/CreativeDirectionVsDesign", island: "visible" },
  { url: "answers/rebrand-vs-refresh", view: "answers/RebrandVsRefresh", island: "visible" },
  { url: "answers/ai-branding-vs-human-judgment", view: "answers/AIBrandingVsHumanJudgment", island: "visible" },
  { url: "answers/how-to-tell-if-brand-is-problem", view: "answers/HowToTellIfBrandIsProblem", island: "visible" },
  { url: "answers/polished-but-weak", view: "answers/PolishedButWeak", island: "visible" },
  { url: "answers/hired-agency-nothing-changed", view: "answers/HiredAgencyNothingChanged", island: "visible" },
  { url: "w9", view: "W9Download", island: "visible" },
  { url: "design-exploration", view: "DesignExploration", island: "visible" },
  { url: "design-exploration/elemental-void", view: "HomepageElementalVoid", island: "visible" },
  { url: "design-exploration/elemental-void-v2", view: "HomepageElementalVoidV2", island: "visible" },
  { url: "design-exploration/editorial", view: "HomepageEditorial", island: "visible" },
];

// Title + description by URL (from routes-meta)
const metaByPath = {};
const routesMetaPath = path.join(cwd, "src/lib/routes-meta.ts");
const raw = fs.readFileSync(routesMetaPath, "utf8");
const re = /\{\s*path:\s*"([^"]+)",\s*title:\s*"([^"]*)",\s*description:\s*"([^"]*)"/g;
let m;
while ((m = re.exec(raw)) !== null) {
  metaByPath[m[1]] = { title: m[2], description: m[3] };
}

const extras = {
  "/meet-the-strategist": {
    title: "Meet the Strategist | QV BRANDS",
    description: "Meet Rick Julian — fractional Chief Branding Officer and growth architect.",
  },
  "/signal-call": { title: "Signal Call | QV BRANDS", description: "Book a signal call with QV BRANDS." },
  "/w9": { title: "W-9 | QV BRANDS", description: "Download W-9 for QV BRANDS." },
  "/design-exploration": { title: "Design Exploration | QV BRANDS", description: "Internal design exploration." },
  "/design-exploration/elemental-void": { title: "Elemental Void | Design Exploration", description: "Homepage concept exploration." },
  "/design-exploration/elemental-void-v2": { title: "Elemental Void v2 | Design Exploration", description: "Homepage concept exploration." },
  "/design-exploration/editorial": { title: "Editorial | Design Exploration", description: "Homepage editorial concept." },
};
Object.assign(metaByPath, Object.fromEntries(Object.entries(extras).map(([k, v]) => [k, v])));

/** Relative prefix from src/pages/<url>.astro to src/ */
function toSrcRoot(url) {
  return "../".repeat(url.split("/").length);
}

function astroPage({ url, view, islandComponent, island }) {
  const root = toSrcRoot(url);
  const p = `/${url}`;
  const meta = metaByPath[p] || { title: "QV BRANDS", description: "Strategic brand consultancy." };
  const title = meta.title.replace(/"/g, '\\"');
  const desc = meta.description.replace(/"/g, '\\"');

  const importLine = islandComponent
    ? `import ${islandComponent} from '${root}components/islands/${islandComponent}';`
    : `import Page from '@/views/pages/${view}';`;

  const body = islandComponent
    ? `    <${islandComponent} client:${island} />`
    : `    <Page client:${island} />`;

  return `---
import BaseLayout from '${root}layouts/BaseLayout.astro';
import Navigation from '${root}components/Navigation.astro';
${importLine}
---

<BaseLayout title="${title}" description="${desc}">
  <Navigation pathname={Astro.url.pathname} />
${body}
</BaseLayout>
`;
}

for (const r of routes) {
  const filePath = path.join(cwd, "src/pages", r.url + ".astro");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, astroPage(r));
  console.log("wrote", path.relative(cwd, filePath));
}
