import { cleanText } from './content-enrichment-utils.mjs';

const RETIRED_DUPLICATE = 'retired_duplicate';
const INDEXABLE = new Set(['', 'reviewed', 'approved', 'published']);
const PAGE_SIZE = 1000;

function isIndexableStatus(value) {
  const status = cleanText(value).toLowerCase();
  return INDEXABLE.has(status);
}

function pickCanonical(rows) {
  return rows
    .slice()
    .sort((a, b) => {
      const aIndex = isIndexableStatus(a.review_status) ? 1 : 0;
      const bIndex = isIndexableStatus(b.review_status) ? 1 : 0;
      if (aIndex !== bIndex) return bIndex - aIndex;
      const aEnriched = Boolean(cleanText(a.content_enriched_at));
      const bEnriched = Boolean(cleanText(b.content_enriched_at));
      if (aEnriched !== bEnriched) return bEnriched ? 1 : -1;
      // Oldest created_at wins
      const aTime = Date.parse(a.created_at);
      const bTime = Date.parse(b.created_at);
      return aTime - bTime;
    })[0];
}

export async function fetchAllQuestionsCompact(client) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await client
      .from('questions_master')
      .select('id,slug,review_status,reviewed_by,reviewed_at,content_enriched_at,created_at,updated_at,citation_notes')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

export function planDuplicateFixFromRows(rows) {
  const bySlug = new Map();
  for (const row of rows) {
    const key = cleanText(row.slug);
    if (!key) continue; // skip null/blank slugs
    const list = bySlug.get(key) ?? [];
    list.push(row);
    bySlug.set(key, list);
  }

  const duplicates = [...bySlug.entries()].filter(([, list]) => list.length > 1);
  const patches = [];
  const backups = [];

  for (const [slug, list] of duplicates) {
    const canonical = pickCanonical(list);
    const canonicalId = canonical.id;
    for (const row of list) {
      if (row.id === canonical.id) continue;
      backups.push({ ...row });
      const retiredSlug = `${slug}-retired-duplicate-${String(row.id).slice(0, 8)}`.toLowerCase();
      patches.push({
        slug,
        canonical_slug: canonical.slug,
        canonical_id: canonicalId,
        update: {
          id: row.id,
          slug: retiredSlug,
          review_status: RETIRED_DUPLICATE,
          citation_notes: buildDemoteNote(canonical.slug, row.citation_notes),
        },
        previous: {
          slug: row.slug,
          review_status: row.review_status,
          citation_notes: row.citation_notes,
        },
      });
    }
  }

  const resolutions = duplicates.map(([slug, list]) => {
    const canonical = pickCanonical(list);
    return {
      slug,
      canonical_id: canonical.id,
      canonical_slug: canonical.slug,
      retired: list
        .filter((r) => r.id !== canonical.id)
        .map((r) => ({
          id: r.id,
          new_slug: `${slug}-retired-duplicate-${String(r.id).slice(0, 8)}`.toLowerCase(),
        })),
    };
  });

  return {
    duplicates: duplicates.length,
    backup_rows: backups,
    patches,
    resolutions,
  };
}

export async function applyDuplicateFix(client, patches) {
  const results = [];
  for (const patch of patches) {
    const { id, ...update } = patch.update;
    try {
      const { data, error } = await client.from('questions_master').update(update).eq('id', id).select('id,slug');
      if (error) {
        results.push({ id, slug: patch.slug, status: 'failed', error: error.message ?? String(error) });
        continue;
      }
      results.push({ id, slug: patch.slug, status: data?.length ? 'applied' : 'not_modified' });
    } catch (err) {
      results.push({ id, slug: patch.slug, status: 'failed', error: err.message ?? String(err) });
    }
  }
  return results;
}

function buildDemoteNote(canonicalSlug, existing) {
  const note = `Duplicate of canonical slug ${canonicalSlug}; demoted to ${RETIRED_DUPLICATE}.`;
  const prior = cleanText(existing);
  if (!prior) return note;
  if (prior.includes(canonicalSlug)) return prior;
  return `${prior}\n\n${note}`;
}
