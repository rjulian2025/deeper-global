export const SITE_URL = 'https://www.deeper.global';
export const SITE_NAME = 'Deeper Global';

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
