/**
 * GA4 event wrappers with attribution params.
 * These wrappers call window.deeperTrackEvent under the hood.
 */
import { getAttributionParams } from './attribution.mjs';

function withAttribution(params = {}) {
  return { ...getAttributionParams(), ...params };
}

function dispatch(eventName, params) {
  try {
    if (typeof window !== 'undefined' && typeof window.deeperTrackEvent === 'function') {
      window.deeperTrackEvent(eventName, withAttribution(params));
    }
  } catch {
    // no-op
  }
}

export function clickToCall(ctaLocation) {
  dispatch('click_to_call', { cta_location: ctaLocation });
}

export function primaryCtaClicked(ctaLocation) {
  dispatch('primary_cta_clicked', { cta_location: ctaLocation });
}

export function generateLead(ctaLocation, extra = {}) {
  dispatch('generate_lead', { cta_location: ctaLocation, ...extra });
}

export function leadMessageSubmit(ctaLocation, extra = {}) {
  dispatch('lead_message_submit', { cta_location: ctaLocation, ...extra });
}

// Only use if an on-site booking flow exists. Do not fire on off-site links.
export function bookCall(ctaLocation, extra = {}) {
  dispatch('book_call', { cta_location: ctaLocation, ...extra });
}

export const __EVENT_NAMES__ = [
  'click_to_call',
  'primary_cta_clicked',
  'generate_lead',
  'lead_message_submit',
  'book_call',
];

