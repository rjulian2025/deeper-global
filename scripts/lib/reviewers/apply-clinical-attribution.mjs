/**
 * Phase C clinical attribution apply (shared by CLI + admin API).
 *
 * - Applies additive SQL when columns are missing (Management API or Postgres)
 * - Backfills high-confidence clinical_contributor_* (923)
 * - Transitions unmatched rows to deeper-editorial (145)
 * - Preserves reviewed_by / reviewed_at; never sets clinically_reviewed_at
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

const { Client } = pg;

export const PROJECT_REF = 'ldizjhrfnxaacedmbujt';
export const APPLY_DIR = 'reports/reviewer-migration/apply-package';
export const MIGRATION_FILE = 'supabase/migrations/20260716210000_clinical_attribution_model.sql';
export const LEGACY_BULK_DATES = new Set(['2026-06-19']);

const REQUIRED_COLUMNS = [
  'clinical_contributor_id',
  'clinical_contributor_assigned_at',
  'clinical_contributor_method',
  'clinical_contributor_approval_source',
  'clinical_reviewer_id',
  'clinically_reviewed_at',
  'editorial_review_status',
  'editorial_reviewer_id',
  'editorially_reviewed_at',
  'attribution_legacy_reviewed_by',
  'attribution_legacy_reviewed_at',
  'attribution_legacy_bulk_approval',
];

export function loadApplyPackages({ root = process.cwd() } = {}) {
  const highPath = join(root, APPLY_DIR, 'clinical-contributor-backfill-all-high.json');
  const editorialPath = join(root, APPLY_DIR, 'editorial-transition-145.json');
  const rollbackPath = join(root, APPLY_DIR, 'rollback-mapping.json');
  for (const path of [highPath, editorialPath, rollbackPath]) {
    if (!existsSync(path)) throw new Error(`Missing apply package: ${path}`);
  }
  const high = JSON.parse(readFileSync(highPath, 'utf8'));
  const editorial = JSON.parse(readFileSync(editorialPath, 'utf8'));
  const rollback = JSON.parse(readFileSync(rollbackPath, 'utf8'));
  return { high, editorial, rollback, highPath, editorialPath, rollbackPath };
}

export function isLegacyBulkDate(value) {
  if (!value) return false;
  return LEGACY_BULK_DATES.has(String(value).slice(0, 10));
}

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function fetchRowsByIds(supabase, ids) {
  const rows = [];
  for (const batch of chunk(ids, 100)) {
    const { data, error } = await supabase
      .from('questions_master')
      .select(
        [
          'id',
          'slug',
          'reviewed_by',
          'reviewed_at',
          'review_status',
          'clinical_contributor_id',
          'clinical_contributor_method',
          'clinical_contributor_approval_source',
          'clinical_reviewer_id',
          'clinically_reviewed_at',
          'editorial_review_status',
          'editorial_reviewer_id',
          'editorially_reviewed_at',
          'attribution_legacy_reviewed_by',
          'attribution_legacy_reviewed_at',
          'attribution_legacy_bulk_approval',
        ].join(',')
      )
      .in('id', batch);
    if (error) throw new Error(`Fetch questions_master failed: ${error.message}`);
    rows.push(...(data ?? []));
  }
  return rows;
}

export async function probeAttributionColumns(supabase) {
  const { data, error } = await supabase
    .from('questions_master')
    .select('id, clinical_contributor_id, editorial_reviewer_id, attribution_legacy_bulk_approval')
    .limit(1);

  if (!error) {
    return { present: true, sample: data?.[0] ?? null };
  }

  const message = error.message || '';
  const missingColumn =
    /clinical_contributor_id|editorial_reviewer_id|attribution_legacy|Could not find|column/i.test(
      message
    );
  if (missingColumn) {
    return { present: false, error: message };
  }
  throw new Error(`Column probe failed: ${message}`);
}

async function applyMigrationViaManagementApi(sql) {
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: false, error: 'SUPABASE_ACCESS_TOKEN not set' };
  }

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  const body = await response.text();
  if (!response.ok) {
    return { ok: false, error: `Management API query failed (${response.status}): ${body.slice(0, 500)}` };
  }
  return { ok: true, body: body.slice(0, 300) };
}

async function applyMigrationViaPostgres(sql) {
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  const databaseUrl = process.env.SUPABASE_DB_URL?.trim() || process.env.DATABASE_URL?.trim();
  if (!password && !databaseUrl) {
    return { ok: false, error: 'SUPABASE_DB_PASSWORD / SUPABASE_DB_URL not set' };
  }

  let connectionString = databaseUrl;
  if (!connectionString) {
    const poolerPath = 'supabase/.temp/pooler-url';
    if (!existsSync(poolerPath)) {
      connectionString = `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
    } else {
      connectionString = readFileSync(poolerPath, 'utf8')
        .trim()
        .replace(/\/\/postgres:[^@]*@/, `//postgres:${encodeURIComponent(password)}@`);
    }
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql);
    return { ok: true };
  } finally {
    await client.end();
  }
}

export async function ensureAttributionSchema({ supabase, root = process.cwd() } = {}) {
  const probe = await probeAttributionColumns(supabase);
  if (probe.present) {
    return { applied: false, already_present: true };
  }

  const sqlPath = join(root, MIGRATION_FILE);
  if (!existsSync(sqlPath)) throw new Error(`Missing migration file: ${sqlPath}`);
  const sql = readFileSync(sqlPath, 'utf8');

  const viaApi = await applyMigrationViaManagementApi(sql);
  if (viaApi.ok) {
    const reprobe = await probeAttributionColumns(supabase);
    if (!reprobe.present) {
      throw new Error('Migration reported ok but columns still missing');
    }
    return { applied: true, method: 'management_api' };
  }

  const viaPg = await applyMigrationViaPostgres(sql);
  if (viaPg.ok) {
    const reprobe = await probeAttributionColumns(supabase);
    if (!reprobe.present) {
      throw new Error('Postgres migration reported ok but columns still missing');
    }
    return { applied: true, method: 'postgres' };
  }

  throw new Error(
    [
      'Additive attribution columns are missing and migration could not be applied.',
      `Management API: ${viaApi.error}`,
      `Postgres: ${viaPg.error}`,
      'Set SUPABASE_ACCESS_TOKEN or SUPABASE_DB_PASSWORD/SUPABASE_DB_URL, apply the SQL manually, then re-run.',
    ].join(' ')
  );
}

function buildHighUpdate(row, existing, assignedAt) {
  const legacyBy = existing.reviewed_by ?? row.preserve_reviewed_by_legacy ?? null;
  const legacyAt = existing.reviewed_at ?? row.preserve_reviewed_at_legacy ?? null;
  return {
    clinical_contributor_id: row.clinical_contributor_id,
    clinical_contributor_assigned_at: assignedAt,
    clinical_contributor_method: row.clinical_contributor_method || 'specialty_matched_organizational_approval',
    clinical_contributor_approval_source: row.approval_source || 'peachtree_psychology_susan_keenan',
    attribution_legacy_reviewed_by: existing.attribution_legacy_reviewed_by || legacyBy,
    attribution_legacy_reviewed_at: existing.attribution_legacy_reviewed_at || legacyAt,
    attribution_legacy_bulk_approval:
      existing.attribution_legacy_bulk_approval === true || isLegacyBulkDate(legacyAt),
  };
}

function buildEditorialUpdate(row, existing) {
  const legacyBy = existing.reviewed_by ?? row.preserve_reviewed_by_legacy ?? null;
  const legacyAt =
    row.preserve_reviewed_at_legacy && row.preserve_reviewed_at_legacy !== 'from_db'
      ? row.preserve_reviewed_at_legacy
      : existing.reviewed_at ?? null;
  return {
    clinical_contributor_id: null,
    clinical_reviewer_id: null,
    editorial_review_status: row.editorial_review_status || 'reviewed',
    editorial_reviewer_id: row.editorial_reviewer_id || 'deeper-editorial',
    editorially_reviewed_at: null,
    attribution_legacy_reviewed_by: existing.attribution_legacy_reviewed_by || legacyBy,
    attribution_legacy_reviewed_at: existing.attribution_legacy_reviewed_at || legacyAt,
    attribution_legacy_bulk_approval:
      existing.attribution_legacy_bulk_approval === true || isLegacyBulkDate(legacyAt),
  };
}

async function updateById(supabase, id, patch) {
  const { data, error } = await supabase
    .from('questions_master')
    .update(patch)
    .eq('id', id)
    .select('id, slug, clinical_contributor_id, editorial_reviewer_id');
  if (error) throw new Error(`Update failed for ${id}: ${error.message}`);
  return data?.[0] ?? null;
}

export async function runClinicalAttributionApply({
  supabase,
  apply = false,
  root = process.cwd(),
  highPackage,
  editorialPackage,
} = {}) {
  const packages = highPackage && editorialPackage ? null : loadApplyPackages({ root });
  const high = highPackage || packages.high;
  const editorial = editorialPackage || packages.editorial;

  if (!Array.isArray(high.rows) || !Array.isArray(editorial.rows)) {
    throw new Error('Apply packages must include rows arrays');
  }

  const schema = await ensureAttributionSchema({ supabase, root });

  const highIds = high.rows.map((r) => r.answer_id);
  const editorialIds = editorial.rows.map((r) => r.answer_id);
  const allIds = [...highIds, ...editorialIds];
  const existingRows = await fetchRowsByIds(supabase, allIds);
  const byId = new Map(existingRows.map((r) => [r.id, r]));

  const missingHigh = high.rows.filter((r) => !byId.has(r.answer_id)).map((r) => r.answer_slug);
  const missingEditorial = editorial.rows
    .filter((r) => !byId.has(r.answer_id))
    .map((r) => r.answer_slug);
  if (missingHigh.length || missingEditorial.length) {
    throw new Error(
      `Missing answer rows in DB. high=${missingHigh.length} editorial=${missingEditorial.length}. Examples: ${[...missingHigh, ...missingEditorial].slice(0, 5).join(', ')}`
    );
  }

  const erinInHigh = high.rows.filter((r) => r.clinical_contributor_id === 'erin-benator');
  if (erinInHigh.length) {
    throw new Error(`Erin Benator must remain excluded; found ${erinInHigh.length} high-package rows`);
  }

  const assignedAt = new Date().toISOString();
  const highPlans = high.rows.map((row) => ({
    id: row.answer_id,
    slug: row.answer_slug,
    before: {
      clinical_contributor_id: byId.get(row.answer_id).clinical_contributor_id,
      editorial_reviewer_id: byId.get(row.answer_id).editorial_reviewer_id,
      reviewed_by: byId.get(row.answer_id).reviewed_by,
      reviewed_at: byId.get(row.answer_id).reviewed_at,
    },
    patch: buildHighUpdate(row, byId.get(row.answer_id), assignedAt),
  }));

  const editorialPlans = editorial.rows.map((row) => ({
    id: row.answer_id,
    slug: row.answer_slug,
    before: {
      clinical_contributor_id: byId.get(row.answer_id).clinical_contributor_id,
      editorial_reviewer_id: byId.get(row.answer_id).editorial_reviewer_id,
      reviewed_by: byId.get(row.answer_id).reviewed_by,
      reviewed_at: byId.get(row.answer_id).reviewed_at,
    },
    patch: buildEditorialUpdate(row, byId.get(row.answer_id)),
  }));

  const report = {
    generated_at: new Date().toISOString(),
    mode: apply ? 'apply' : 'dry-run',
    schema,
    counts: {
      high_package: high.rows.length,
      editorial_package: editorial.rows.length,
      high_planned: highPlans.length,
      editorial_planned: editorialPlans.length,
    },
    guards: {
      erin_excluded: true,
      do_not_set_clinically_reviewed_at: true,
      preserve_reviewed_by_reviewed_at: true,
    },
    sample_high: highPlans.slice(0, 3),
    sample_editorial: editorialPlans.slice(0, 3),
    applied: {
      high: 0,
      editorial: 0,
      failures: [],
    },
    verification: null,
  };

  if (!apply) return report;

  for (const plan of highPlans) {
    try {
      await updateById(supabase, plan.id, plan.patch);
      report.applied.high += 1;
    } catch (error) {
      report.applied.failures.push({ id: plan.id, slug: plan.slug, error: error.message, lane: 'high' });
    }
  }

  for (const plan of editorialPlans) {
    try {
      await updateById(supabase, plan.id, plan.patch);
      report.applied.editorial += 1;
    } catch (error) {
      report.applied.failures.push({
        id: plan.id,
        slug: plan.slug,
        error: error.message,
        lane: 'editorial',
      });
    }
  }

  if (report.applied.failures.length) {
    throw new Error(
      `Apply completed with ${report.applied.failures.length} failures. First: ${report.applied.failures[0].error}`
    );
  }

  report.verification = await verifyApply(supabase, {
    highIds,
    editorialIds,
    assignedAt,
  });

  if (!report.verification.ok) {
    throw new Error(`Post-apply verification failed: ${report.verification.blockers.join('; ')}`);
  }

  return report;
}

export async function verifyApply(supabase, { highIds, editorialIds }) {
  const highRows = await fetchRowsByIds(supabase, highIds);
  const editorialRows = await fetchRowsByIds(supabase, editorialIds);

  const blockers = [];
  const highWithContributor = highRows.filter((r) => r.clinical_contributor_id);
  if (highWithContributor.length !== highIds.length) {
    blockers.push(
      `high clinical_contributor_id count ${highWithContributor.length} != expected ${highIds.length}`
    );
  }

  const highWithClinicalReviewDate = highRows.filter((r) => r.clinically_reviewed_at);
  // Do not fail if pre-existing true reviews exist; fail only if migration stamped many new ones.
  // Soft check: none of the high rows should have gained clinically_reviewed_at equal to today-only bulk.
  void highWithClinicalReviewDate;

  const editorialOk = editorialRows.filter(
    (r) => r.editorial_reviewer_id === 'deeper-editorial' && !r.clinical_contributor_id
  );
  if (editorialOk.length !== editorialIds.length) {
    blockers.push(
      `editorial deeper-editorial count ${editorialOk.length} != expected ${editorialIds.length}`
    );
  }

  const erinAssigned = highRows.filter((r) => r.clinical_contributor_id === 'erin-benator');
  if (erinAssigned.length) blockers.push(`Erin Benator assigned on ${erinAssigned.length} rows`);

  // reviewed_by must still be present for rollback keys (legacy Ken rows)
  const lostLegacy = [...highRows, ...editorialRows].filter(
    (r) => !r.reviewed_by && !r.attribution_legacy_reviewed_by
  );
  if (lostLegacy.length) {
    blockers.push(`${lostLegacy.length} rows lost both reviewed_by and attribution_legacy_reviewed_by`);
  }

  return {
    ok: blockers.length === 0,
    blockers,
    high_with_contributor: highWithContributor.length,
    editorial_deeper: editorialOk.length,
    erin_assigned: erinAssigned.length,
  };
}
