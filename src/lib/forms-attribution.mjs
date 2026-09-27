/**
 * Forms attribution helpers.
 * - Build a flat mapping of hidden field names to values suitable for DB/email capture
 * - Caller is responsible for actually appending fields to a form or request payload
 */
import { getAttributionParams } from './attribution.mjs';

/**
 * Return key/value pairs for hidden attribution fields.
 * Field names use a consistent prefix to avoid collisions.
 */
export function buildAttributionHiddenFields() {
  const at = getAttributionParams();
  const map = new Map();
  // First-touch
  if (at.ft_source) map.set('attr_ft_source', at.ft_source);
  if (at.ft_medium) map.set('attr_ft_medium', at.ft_medium);
  if (at.ft_campaign) map.set('attr_ft_campaign', at.ft_campaign);
  if (at.ft_content) map.set('attr_ft_content', at.ft_content);
  // Last-touch
  if (at.lt_source) map.set('attr_lt_source', at.lt_source);
  if (at.lt_medium) map.set('attr_lt_medium', at.lt_medium);
  if (at.lt_campaign) map.set('attr_lt_campaign', at.lt_campaign);
  if (at.lt_content) map.set('attr_lt_content', at.lt_content);
  // Shared
  if (at.referrer) map.set('attr_referrer', at.referrer);
  if (at.landing_page) map.set('attr_landing_page', at.landing_page);
  return Object.fromEntries(map.entries());
}

/**
 * Append attribution hidden inputs to a given HTMLFormElement.
 * Safe no-op if not running in a browser or form not provided.
 */
export function appendAttributionHiddenInputsToForm(form) {
  try {
    if (typeof window === 'undefined' || !form || typeof form.querySelector !== 'function') return;
    const fields = buildAttributionHiddenFields();
    for (const [name, value] of Object.entries(fields)) {
      if (!value) continue;
      let input = form.querySelector(`input[name="${name}"]`);
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.appendChild(input);
      }
      input.value = String(value);
    }
  } catch {
    // no-op
  }
}

