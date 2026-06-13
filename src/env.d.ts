/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  deeperTrackEvent?: (eventName: string, params?: Record<string, unknown>) => void;
}
