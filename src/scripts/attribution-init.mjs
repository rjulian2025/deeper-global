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

// Mark attribution ready and flush any queued events
try {
  const queued = Array.isArray(window.__dgEventQueue) ? window.__dgEventQueue.splice(0) : [];
  window.__dgAttributionReady = true;
  if (queued && typeof window.deeperTrackEvent === 'function') {
    for (const item of queued) {
      try {
        window.deeperTrackEvent(item.name, item.params || {});
      } catch {}
    }
  }
} catch {}

