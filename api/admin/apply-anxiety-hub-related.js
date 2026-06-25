import { createClient } from '@supabase/supabase-js';

function cleanText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET ?? process.env.REPORT_CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.authorization ?? req.headers.Authorization;
  const headerSecret = req.headers['x-report-secret'];
  return authHeader === `Bearer ${secret}` || headerSecret === secret;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  if (!isAuthorized(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized.' }));
    return;
  }

  const serviceRoleKey = cleanText(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const url = cleanText(process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL);
  if (!url || !serviceRoleKey) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel Production environment.',
      })
    );
    return;
  }

  try {
    const body = await readBody(req);
    const apply = Boolean(body.apply);
    const batch = Array.isArray(body.batch) ? body.batch : [];

    if (!batch.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Request body must include a non-empty batch array.' }));
      return;
    }

    const client = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
    const slugs = batch.map((entry) => cleanText(entry.slug)).filter(Boolean);
    const { data: rows, error } = await client
      .from('questions_master')
      .select('id,slug,related_questions')
      .in('slug', slugs);

    if (error) throw error;

    const bySlug = new Map((rows ?? []).map((row) => [row.slug, row]));
    const patches = [];
    const missing = [];

    for (const entry of batch) {
      const slug = cleanText(entry.slug);
      const row = bySlug.get(slug);
      if (!row) {
        missing.push(slug);
        continue;
      }

      if (!Array.isArray(entry.related_questions) || entry.related_questions.length < 3) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: `${slug}: related_questions must include at least 3 items.` }));
        return;
      }

      patches.push({
        id: row.id,
        slug,
        related_questions: entry.related_questions,
        previous_related_questions: row.related_questions ?? null,
      });
    }

    const applyResults = [];
    if (apply) {
      for (const patch of patches) {
        const { data, error: updateError } = await client
          .from('questions_master')
          .update({ related_questions: patch.related_questions })
          .eq('id', patch.id)
          .select('id,slug,related_questions');

        if (updateError) throw updateError;
        applyResults.push({
          slug: patch.slug,
          applied: Boolean(data?.length),
          related_count: patch.related_questions.length,
        });
      }
    }

    if (missing.length) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: `Missing slugs in questions_master: ${missing.join(', ')}` }));
      return;
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        generated_at: new Date().toISOString(),
        mode: apply ? 'applied-remote' : 'dry-run-remote',
        apply_path: 'remote',
        summary: {
          batch_entries: batch.length,
          rows_found: patches.length,
          missing_slugs: missing.length,
          applied: applyResults.filter((item) => item.applied).length,
        },
        patches,
        apply_results: apply ? applyResults : null,
      })
    );
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message ?? 'Apply anxiety hub related questions failed.' }));
  }
}
