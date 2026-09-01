/**
 * Indexability and analytics environment helpers for production vs preview builds.
 */
import {
  resolveGaMeasurementId,
  resolveIndexability,
  resolveRobotsMetaContent,
  resolveShouldLoadAnalytics,
} from './site-env-resolve.mjs';

export type IndexabilityEnv = {
  publicIndexable?: string;
  vercelEnv?: string;
  isProd?: boolean;
};

export type AnalyticsEnv = IndexabilityEnv & {
  gaMeasurementId?: string;
};

export {
  resolveGaMeasurementId,
  resolveIndexability,
  resolveRobotsMetaContent,
  resolveShouldLoadAnalytics,
};

function currentEnv(): IndexabilityEnv {
  return {
    publicIndexable: import.meta.env.PUBLIC_INDEXABLE,
    vercelEnv: import.meta.env.VERCEL_ENV,
    isProd: import.meta.env.PROD,
  };
}

function readMeasurementId(): string | undefined {
  return (
    import.meta.env.PUBLIC_GA_MEASUREMENT_ID ||
    import.meta.env.PUBLIC_GA4_MEASUREMENT_ID ||
    import.meta.env.NEXT_PUBLIC_GA_ID
  );
}

function currentAnalyticsEnv(): AnalyticsEnv {
  return {
    ...currentEnv(),
    gaMeasurementId: readMeasurementId(),
  };
}

export function isIndexableBuild(): boolean {
  return resolveIndexability(currentEnv());
}

export function shouldNoindex(): boolean {
  return !isIndexableBuild();
}

export function robotsMetaContent(): string | null {
  return resolveRobotsMetaContent(currentEnv());
}

export function getGaMeasurementId(): string | null {
  return resolveGaMeasurementId(currentAnalyticsEnv());
}

export function shouldLoadAnalytics(): boolean {
  return resolveShouldLoadAnalytics(currentAnalyticsEnv());
}
