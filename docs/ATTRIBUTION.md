# Attribution and GA4 Events

This implementation adds first/last-touch attribution capture on every landing and ensures key GA4 events carry the parameters needed to trace conversions back to the answer page, social post, or Google Business Profile link that drove them.

Important: This work is instrumentation-only. It does not change copy, answers, prices, or schedules.

## Attribution capture (client)

On every landing:
- Captured fields: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `referrer` (full `document.referrer`), `landing_page` (pathname + search), `first_seen_ts` (ISO 8601)
- First touch (localStorage, never overwritten): `dg_attribution_ft`
- Last touch (sessionStorage, replaced on new UTM/gclid landing): `dg_attribution_lt`

Client module: `src/lib/attribution.mjs`
- `captureAttributionOnLanding(location, referrer)`
- `getAttributionParams()` → `{ ft_source, ft_medium, ft_campaign, ft_content, lt_source, lt_medium, lt_campaign, lt_content, referrer, landing_page }`
- All values are trimmed and truncated to 100 chars.

Used automatically in `src/layouts/BaseLayout.astro` for GA4 events (gated to production hosts).

## GA4 events

All GA4 events include:
- `ft_source`, `ft_medium`, `ft_campaign`, `ft_content`
- `lt_source`, `lt_medium`, `lt_campaign`, `lt_content`
- `referrer`, `landing_page`, `page_path`
- `cta_location` where applicable (`header`, `nav`, `footer`, or `body`)

Parameter limits:
- Param names are ≤ 40 chars.
- Values are truncated to 100 chars.

Events and where they fire:
- `click_to_call`: click on `tel:+14046880088` (header/footer call links). Note: tel links cannot carry UTMs, so the event carries them from stored attribution.
- `primary_cta_clicked`: click on elements marked `data-cta="primary"` (global nav Ask CTA at minimum).
- `generate_lead`: reserved for confirmed-success lead captures (e.g., Ask/email capture). Hook via `src/lib/events.mjs`.
- `lead_message_submit`: reserved for confirmed-success contact/message forms. Hook via `src/lib/events.mjs`.
- `book_call`: only if an on-site booking link or flow exists. There is no on-site booking flow at present, so this is defined but not fired.

Wrapper module: `src/lib/events.mjs`
- `clickToCall(ctaLocation)`
- `primaryCtaClicked(ctaLocation)`
- `generateLead(ctaLocation, extra)`
- `leadMessageSubmit(ctaLocation, extra)`
- `bookCall(ctaLocation, extra)` (do not use until an on-site booking exists)

These call `window.deeperTrackEvent(eventName, params)` with attribution merged in. First-party `/api/intent-event` is also sent with allowed events.

## Forms and submissions

No visible fields added. For future forms:
- Client helper builds hidden fields for DB/email capture: `src/lib/forms-attribution.mjs`
  - `buildAttributionHiddenFields()` → `{ attr_ft_source, attr_ft_medium, attr_ft_campaign, attr_ft_content, attr_lt_source, attr_lt_medium, attr_lt_campaign, attr_lt_content, attr_referrer, attr_landing_page }`
  - `appendAttributionHiddenInputsToForm(form)` to auto-append hidden inputs
- If new DB columns are needed for a lead table, add a migration file before enabling writes. This PR does not run any migrations.

## UTM conventions

- Social (X draft generator): `utm_source=x`, `utm_medium=social`, `utm_campaign=social_question_only`, `utm_content=<answer-slug>`
  - Preserved by `src/lib/social/generate-drafts.ts` and tested in `tests/ai-seo-conversion.test.mjs`.
- Google Business Profile:
  - Posts: `utm_source=google_business_profile`, `utm_medium=post`, `utm_campaign=<site>_gbp_posts`, `utm_content=<post-slug>`
  - Listing: `utm_source=google_business_profile`, `utm_medium=listing`, `utm_campaign=<site>_gbp_listing`, `utm_content=<post-slug>`
- Never add UTMs to internal links (site navigation and internal paths). Enforced by `tests/utm-rules.test.mjs`.

## Exact GA4 event parameter list (for custom dimensions)

Register these GA4 custom dimensions/metrics as needed:
- `ft_source`
- `ft_medium`
- `ft_campaign`
- `ft_content`
- `lt_source`
- `lt_medium`
- `lt_campaign`
- `lt_content`
- `referrer`
- `landing_page`
- `page_path` (already present)
- `cta_location`

