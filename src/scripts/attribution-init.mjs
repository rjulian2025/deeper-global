import { captureAttributionOnLanding, getAttributionParams } from '../lib/attribution.mjs';

try {
  captureAttributionOnLanding(window.location, document.referrer);
} catch {}

// Expose a safe accessor for attribution so inline scripts can read without imports.
window.__dgAttribution = () => {
  try {
    return getAttributionParams();
  } catch {
    return {};
  }
};

