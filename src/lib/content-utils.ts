export function cleanText(value: string | null | undefined) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}
