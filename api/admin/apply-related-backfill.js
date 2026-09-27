import { createClient } from '@supabase/supabase-js';
import { isBearerAuthorized, cleanText } from '../../scripts/lib/admin-auth.mjs';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function listPlanFiles() {
  try {
    return readdirSync('reports/data-integrity')
      .filter((f) => /^related-backfill-plan-\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort()
      .map((f) => join('reports/data-integrity', f));
  } catch {
    return [];
  }
}

function loadLatestPlan() {
  const files = listPlanFiles();
  if (!files.length) return null;
  const path = files[files.length - 1];
  const json = JSON.parse(readFileSync(path, 'utf8'));
  return { path, json };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  if (!isBearerAuthorized(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized.' }));
    return;
  }

  const serviceRoleKey = cleanText(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const url = cleanText(process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL);
  if (!url || !serviceRoleKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel Production environment.' }));
    return;
  }

  try {
    const { path, json } = loadLatestPlan() ?? {};
    if (!json || !json.plan) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'No related backfill plan found.' }));
      return;
    }

    const body = (() => {
      try {
        return JSON.parse(req.body || '{}');
      } catch {
        return {};
      }
    })();
    const apply = body && body.apply === true;

    const client = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
    const slugs = Object.keys(json.plan);
    const { data: rows, error } = await client
      .from('questions_master')
      .select('id,slug,related_questions')
      .in('slug', slugs);
    if (error) throw error;
    const bySlug = new Map((rows ?? []).map((r) => [r.slug, r]));

    const patches = [];
    const conflicts = [];
    for (const slug of slugs) {
      const entry = json.plan[slug];
      const row = bySlug.get(slug);
      if (!row) continue;
      const before = Array.isArray(entry.before) ? entry.before : [];
      const current = Array.isArray(row.related_questions) ? row.related_questions : [];
      const same =
        before.length === current.length &&
        before.every((v, i) => String(v) === String(current[i]));
      if (!same) {
        conflicts.push({ slug, expected_before: before, current });
        continue;
      }
      patches.push({ id: row.id, slug, related_questions: entry.after });
    }

    const results = [];
    if (apply) {
      for (const p of patches) {
        const { data: upd, error: uerr } = await client.from('questions_master').update({ related_questions: p.related_questions }).eq('id', p.id).select('id,slug');
        if (uerr) throw uerr;
        results.push({ slug: p.slug, applied: Boolean(upd?.length), related_count: p.related_questions.length });
      }
    }

    res.statusCode = 200;
    res.end(JSON.stringify({
      generated_at: new Date().toISOString(),
      mode: apply ? 'applied-remote' : 'dry-run-remote',
      plan_path: path ?? null,
      summary: {
        planned: Object.keys(json.plan).length,
        eligible: patches.length,
        conflicts: conflicts.length,
        applied: results.filter((r) => r.applied).length,
      },
      conflicts,
      patches: apply ? undefined : patches,
      apply_results: apply ? results : null,
    }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message ?? String(error) }));
  }
}

