export const SITE_URL = 'https://www.deeper.global';
export const SITE_NAME = 'Deeper Global';
export const CONTENT_LICENSE_NAME = 'CC BY 4.0';
export const CONTENT_LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';
export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
export const FEED_URL = `${SITE_URL}/feed.xml`;
export const LLMS_TXT_URL = `${SITE_URL}/llms.txt`;
export const LLMS_FULL_TXT_URL = `${SITE_URL}/llms-full.txt`;

export function normalizePath(path = '/') {
  const value = path.startsWith('/') ? path : `/${path}`;

  if (value === '/' || /\.[a-z0-9]+$/i.test(value)) {
    return value;
  }

  return value.endsWith('/') ? value : `${value}/`;
}

export function siteUrl(path = '/') {
  return new URL(normalizePath(path), SITE_URL).toString();
}

export function organizationId() {
  return `${siteUrl()}#organization`;
}

export function websiteId() {
  return `${siteUrl()}#website`;
}
