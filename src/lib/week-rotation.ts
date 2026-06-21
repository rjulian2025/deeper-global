export function getIsoWeek(date: Date): number {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function weekRotationScore(key: string, week: number): number {
  let hash = week;
  for (const char of key) {
    hash = (Math.imul(31, hash) + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}
