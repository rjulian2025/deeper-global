import { cleanText } from './admin-auth.mjs';

/** Production env vars that gate cron, admin APIs, DB writes, and outbound integrations. */
export const MONITORED_ENV_VARS = [
  'CRON_SECRET',
  'REPORT_CRON_SECRET',
  'ADMIN_PASSPHRASE',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'ANTHROPIC_API_KEY',
  'RESEND_API_KEY',
  'REPORT_EMAIL_FROM',
  'REPORT_EMAIL_TO',
  'CONTENT_OPS_EMAIL_TO',
  'SERPAPI_KEY',
  'MAPBOX_TOKEN',
  'PUBLIC_MAPBOX_TOKEN',
  'GA4_PROPERTY_ID',
  'GA4_CLIENT_EMAIL',
  'GA4_PRIVATE_KEY',
  'GSC_SITE_URL',
  'GSC_PROXY_URL',
  'GSC_PROXY_SECRET',
  'GSC_CLIENT_EMAIL',
  'GSC_PRIVATE_KEY',
  'X_API_KEY',
  'X_API_SECRET',
  'X_ACCESS_TOKEN',
  'X_ACCESS_TOKEN_SECRET',
];

function readEnv(name) {
  return cleanText(process.env[name]);
}

function isHex64(value) {
  return value.length === 64 && /^[0-9a-f]+$/i.test(value);
}

function isPrivateKeyPem(value) {
  return value.includes('BEGIN PRIVATE KEY') || value.includes('BEGIN RSA PRIVATE KEY');
}

function isSupabaseJwt(value) {
  return value.startsWith('eyJ') && value.split('.').length === 3;
}

/**
 * @param {string} name
 * @param {string} value
 */
export function describeEnvVar(name, value) {
  const exists = value.length > 0;
  const report = { exists };

  if (!exists) {
    return report;
  }

  report.length = value.length;

  switch (name) {
    case 'CRON_SECRET':
    case 'REPORT_CRON_SECRET':
      report.hex64 = isHex64(value);
      break;
    case 'SUPABASE_SERVICE_ROLE_KEY':
    case 'SUPABASE_ANON_KEY':
      report.jwt = isSupabaseJwt(value);
      break;
    case 'ANTHROPIC_API_KEY':
      report.sk_ant_prefix = value.startsWith('sk-ant-');
      break;
    case 'RESEND_API_KEY':
      report.re_prefix = value.startsWith('re_');
      break;
    case 'GA4_PRIVATE_KEY':
    case 'GSC_PRIVATE_KEY':
      report.private_key_pem = isPrivateKeyPem(value);
      break;
    case 'MAPBOX_TOKEN':
    case 'PUBLIC_MAPBOX_TOKEN':
      report.mapbox_prefix = value.startsWith('pk.') || value.startsWith('sk.');
      break;
    case 'SUPABASE_URL':
    case 'GSC_PROXY_URL':
    case 'GSC_SITE_URL':
      report.https_url = /^https:\/\//i.test(value);
      break;
    case 'GA4_CLIENT_EMAIL':
    case 'GSC_CLIENT_EMAIL':
      report.service_account_email = /@.+\.iam\.gserviceaccount\.com$/i.test(value);
      break;
    case 'REPORT_EMAIL_FROM':
    case 'REPORT_EMAIL_TO':
    case 'CONTENT_OPS_EMAIL_TO':
      report.email_shape = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      break;
    default:
      break;
  }

  return report;
}

export function buildEnvHealthReport() {
  const vars = Object.fromEntries(
    MONITORED_ENV_VARS.map((name) => [name, describeEnvVar(name, readEnv(name))])
  );

  const critical = ['CRON_SECRET', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'ANTHROPIC_API_KEY'];
  const ok = critical.every((name) => {
    const entry = vars[name];
    if (!entry?.exists || !entry.length) return false;
    if (name === 'CRON_SECRET' && entry.hex64 === false) return false;
    return true;
  });

  return {
    ok,
    checked_at: new Date().toISOString(),
    ...vars,
  };
}
