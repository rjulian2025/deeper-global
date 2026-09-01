/**
 * Pure indexability/analytics resolution helpers (testable without TypeScript loader).
 */

/** @typedef {{ publicIndexable?: string; vercelEnv?: string; isProd?: boolean }} IndexabilityEnv */
/** @typedef {IndexabilityEnv & { gaMeasurementId?: string }} AnalyticsEnv */

/** @param {IndexabilityEnv} env */
export function resolveIndexability(env) {
  if (env.publicIndexable === 'true') return true;
  if (env.publicIndexable === 'false') return false;
  if (env.vercelEnv === 'production') return true;
  if (env.vercelEnv === 'preview' || env.vercelEnv === 'development') return false;
  return env.isProd ?? false;
}

/** @param {IndexabilityEnv} env */
export function resolveRobotsMetaContent(env) {
  return resolveIndexability(env) ? null : 'noindex, nofollow';
}

/** @param {AnalyticsEnv} env */
export function resolveGaMeasurementId(env) {
  const id = env.gaMeasurementId?.trim();
  return id || null;
}

/** @param {AnalyticsEnv} env */
export function resolveShouldLoadAnalytics(env) {
  const id = resolveGaMeasurementId(env);
  if (!id) return false;
  if (env.publicIndexable === 'false') return false;
  if (env.vercelEnv === 'preview' || env.vercelEnv === 'development') return false;
  if (env.vercelEnv === 'production') return true;
  return env.isProd ?? false;
}
