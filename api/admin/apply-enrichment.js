import { createClient } from '@supabase/supabase-js';
import {
  applyPromotionUpdates,
  buildPromotionPlan,
  fetchExistingRows,
  promotionReport,
} from '../../scripts/lib/enrichment-promote.mjs';

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
    const campaign = cleanText(body.campaign) || 'addiction-enrichment';
    const preserveReview = body.preserveReview !== false;
    const drafts = Array.isArray(body.drafts) ? body.drafts : [];

    if (!drafts.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Request body must include a non-empty drafts array.' }));
      return;
    }

    const plan = buildPromotionPlan(drafts, { campaign, preserveReview });
    const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
    const existingBySlug = await fetchExistingRows(supabase, plan.slugs);

    if (!apply) {
      const previewRows = plan.updateRows.map((row) => ({
        ...row,
        reviewed_by: preserveReview ? existingBySlug.get(row.slug)?.reviewed_by ?? row.reviewed_by : row.reviewed_by,
        reviewed_at: preserveReview ? existingBySlug.get(row.slug)?.reviewed_at ?? row.reviewed_at : row.reviewed_at,
        review_status: preserveReview
          ? existingBySlug.get(row.slug)?.review_status ?? row.review_status
          : row.review_status,
      }));

      res.statusCode = 200;
      res.end(
        JSON.stringify(
          promotionReport({
            mode: 'dry-run-remote',
            campaign,
            preserveReview,
            mergedRows: previewRows,
          })
        )
      );
      return;
    }

    const mergedRows = await applyPromotionUpdates(supabase, plan.updateRows, existingBySlug, preserveReview);
    res.statusCode = 200;
    res.end(
      JSON.stringify(
        promotionReport({
          mode: 'applied-remote',
          campaign,
          preserveReview,
          mergedRows,
        })
      )
    );
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message ?? 'Apply enrichment failed.' }));
  }
}
