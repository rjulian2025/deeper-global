# Deeper Phase 1C — intent intelligence foundation

**Status:** Initial GA4 instrumentation implemented for aggregate intent signals.
**Goal:** prepare Deeper Global to learn from aggregate mental health information demand without creating individual-level mental health profiles or weakening user trust.

## Strategic purpose

Deeper Global's long-term opportunity is not only SEO traffic or backlinks. It is an intent graph: a structured view of what people ask before, during, and after mental health care.

At scale, that graph can inform:

- mental health topic demand by region;
- care-navigation questions that precede therapist search;
- practitioner positioning for Deeper Websites clients;
- referral-market gaps by specialty, location, or concern cluster;
- editorial prioritization for new answers and reviewed upgrades;
- public-interest trend reports, if aggregated and privacy-safe.

The product posture should be:

> Deeper observes aggregate mental health information needs. It does not build individual mental health dossiers.

## Non-goals

Phase 1C now implements lightweight GA4 event tracking. It does not implement a first-party event warehouse, persistent user accounts, raw event exports, or referral personalization.

Do not do these in Phase 1C:

- no ad retargeting based on mental health topics;
- no sale of raw query logs;
- no user-level mental health profiles;
- no zip-code reporting without high minimum sample sizes;
- no crisis-topic personalization;
- no combining sensitive question behavior with personally identifiable data;
- no therapist referral ranking based on undisclosed paid placement.

## Privacy rules

### 1. Aggregate first

Store and report aggregate patterns, not individual user stories. The primary unit of insight should be topic/category/region/time window, not a person.

### 2. Minimize identifiers

Avoid persistent user IDs unless there is a clear product need and explicit policy support. If session analysis is needed, use short-lived anonymous session identifiers with retention limits.

### 3. Coarsen location

Prefer country, state, or large metro. Treat zip code as sensitive and only report it when:

- it is derived from explicit user input or privacy-safe geo lookup;
- it is aggregated;
- minimum sample size thresholds are met;
- crisis, abuse, addiction, sexuality, minors, and other sensitive topics are suppressed or generalized.

### 4. Suppress low-volume segments

Do not expose local trend data unless the segment has enough volume to avoid inference about individuals.

Default minimums:

- public/partner reports: at least 100 events per segment per period;
- internal strategy reports: at least 25 events per segment per period;
- crisis-sensitive local reports: state-level only unless manually approved.

### 5. Separate education from referral logic

Educational content behavior can inform aggregate demand. It should not automatically create a referral profile for an individual visitor.

### 6. Avoid sensitive retargeting

Do not use Deeper behavior to retarget people with ads for therapy, crisis support, addiction treatment, medication, trauma services, or other sensitive categories.

### 7. Keep commercial disclosures clear

If a practitioner listing, referral path, or Deeper Websites bridge is sponsored, paid, or affiliate-based, disclose it plainly.

### 8. Preserve crisis safety

Crisis-sensitive events can be counted in aggregate for safety QA, but should not be used for commercial targeting or local lead generation.

## Event taxonomy

Events should describe what happened and the content context around it. They should not include raw personal identifiers.

### Core fields

Every event should include:

| Field | Type | Notes |
| --- | --- | --- |
| `event_name` | string | One of the approved event names below. |
| `occurred_at` | ISO timestamp | Event time. |
| `page_path` | string | Path only, not full URL with query params unless needed. |
| `referrer_domain` | string | Domain only; avoid full referrer URL by default. |
| `session_id` | string/null | Optional short-lived anonymous ID. |
| `content_type` | string | `answer`, `category`, `entity`, `hub`, `policy`, `search`, `external_referral`. |
| `answer_slug` | string/null | For answer pages and answer clicks. |
| `category` | string/null | Display category when known. |
| `entity_slug` | string/null | Canonical/future concept slug when known. |
| `review_status` | string/null | `draft`, `reviewed`, `approved`, etc. |
| `risk_class` | string | `standard`, `crisis-sensitive`, `unknown`. |
| `intent_stage` | string/null | See intent-stage taxonomy below. |
| `region_country` | string/null | Coarse location only. |
| `region_state` | string/null | Optional state-level location. |
| `region_metro` | string/null | Optional large metro. |
| `device_type` | string/null | `desktop`, `mobile`, `tablet`, `unknown`. |

### Approved event names

| Event | Purpose | Initial implementation priority |
| --- | --- | --- |
| `answer_viewed` | Measures question demand. | High |
| `category_viewed` | Measures browse-topic demand. | Medium |
| `entity_viewed` | Measures semantic-topic demand. | Medium |
| `answer_related_clicked` | Measures question-to-question paths. | Medium |
| `site_search_performed` | Measures unmet demand and query language. | High, once search exists |
| `site_search_result_clicked` | Measures successful search outcomes. | Medium |
| `crisis_banner_seen` | Safety observability only. | Medium |
| `crisis_resource_clicked` | Safety observability only; never commercial. | Medium |
| `source_ref_clicked` | Measures trust/source engagement. | Low |
| `practitioner_callout_viewed` | Measures commercial bridge exposure. | Medium |
| `practitioner_callout_clicked` | Measures bridge interest. | High |
| `external_referral_clicked` | Measures outbound referral intent. | High |
| `editorial_policy_viewed` | Measures trust-policy engagement. | Low |

## Intent-stage taxonomy

Each answer or event should eventually be classified into one primary intent stage:

| Intent stage | Meaning | Example |
| --- | --- | --- |
| `understanding_symptom` | User wants to understand an experience. | “Why do I feel anxious for no reason?” |
| `self_management` | User wants coping strategies. | “How do I calm down during a panic attack?” |
| `care_navigation` | User is evaluating therapy, cost, fit, or next steps. | “How do I know if I need therapy?” |
| `relationship_navigation` | User is navigating interpersonal conflict. | “How do I talk to my partner about therapy?” |
| `identity_meaning` | User is processing identity, self-worth, purpose, or belonging. | “Why do I feel like I am not enough?” |
| `risk_support` | User may need urgent or specialized support. | “What should I do if I am having suicidal thoughts?” |
| `practitioner_relevance` | User or practitioner intent connects to services/site strategy. | “What should a therapist website explain before booking?” |

The first analytics version can infer this from category + curated mapping. A later version can store `intent_stage` per answer in Supabase.

## Sensitivity taxonomy

Use sensitivity labels to suppress or aggregate reporting:

| Sensitivity | Meaning |
| --- | --- |
| `standard` | General mental health education. |
| `diagnosis-risk` | Content may imply diagnosis or disorder identification. |
| `medication` | Medication, side effects, tapering, or prescribing concerns. |
| `crisis-sensitive` | Suicide, self-harm, overdose, acute danger, or crisis language. |
| `abuse` | Domestic violence, coercion, stalking, or unsafe relationships. |
| `minor` | Teens, minors, parents asking about child mental health. |
| `addiction` | Substance use, relapse, sobriety, withdrawal, recovery. |
| `trauma` | Trauma, PTSD, flashbacks, dissociation, grief trauma. |

Sensitive categories can still be measured in aggregate. They should not be used for individual targeting or low-volume local reports.

## Location policy

### Allowed

- state-level aggregate demand;
- metro-level aggregate demand when volume is high enough;
- country-level trends;
- internal editorial planning by region.

### Restricted

- zip-code reporting;
- neighborhood-level trend claims;
- local reports for crisis, abuse, addiction, minors, medication, or sexuality without manual review;
- combining location with raw query text in external reports.

### Default thresholds

| Reporting level | Minimum volume | Notes |
| --- | ---: | --- |
| National | 25 events | Safe for broad trends. |
| State | 50 events | Good default for internal reports. |
| Metro | 100 events | Use only larger metros. |
| Zip | 250 events | Internal-only unless legally/privacy reviewed. |

## Reporting concepts

Initial reports should answer strategic questions without exposing raw behavior:

1. **Rising concerns:** which categories and intent stages increased over 7, 30, and 90 days.
2. **Care navigation demand:** which answers precede practitioner/referral clicks.
3. **Coverage gaps:** high search/query demand with no matching answer.
4. **Regional demand:** state-level concern clusters.
5. **Trust engagement:** source/ref/editorial-policy engagement on reviewed pages.
6. **Referral bridge performance:** which contextual practitioner callouts earn clicks without dominating education.
7. **Safety observability:** crisis banner exposure and resource clicks in aggregate.

## Suggested storage model

This is a future implementation sketch, not a migration plan.

### `intent_events`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key. |
| `event_name` | text | Approved event name. |
| `occurred_at` | timestamptz | Event time. |
| `session_id_hash` | text/null | Short-lived anonymous session hash, if used. |
| `page_path` | text | Path only. |
| `referrer_domain` | text/null | Domain only. |
| `content_type` | text | Answer/category/entity/etc. |
| `answer_slug` | text/null | Answer slug. |
| `category` | text/null | Display category. |
| `entity_slug` | text/null | Entity/concept slug. |
| `review_status` | text/null | Content review status. |
| `risk_class` | text | Standard/crisis/unknown. |
| `intent_stage` | text/null | Intent-stage taxonomy. |
| `sensitivity` | text[] | Sensitivity labels. |
| `region_country` | text/null | Coarse location. |
| `region_state` | text/null | Coarse location. |
| `region_metro` | text/null | Coarse location. |
| `device_type` | text/null | Device class. |
| `metadata` | jsonb | Strict allowlist only. |

### `intent_daily_rollups`

Pre-aggregate for reporting:

| Column | Type |
| --- | --- |
| `date` | date |
| `event_name` | text |
| `category` | text/null |
| `entity_slug` | text/null |
| `intent_stage` | text/null |
| `sensitivity` | text/null |
| `region_country` | text/null |
| `region_state` | text/null |
| `count` | integer |

Do not expose raw `intent_events` to clients or partners. Reports should read from rollups.

## Implementation sequence

### Phase 1C-0 — spec and policy

- Approve this document.
- Decide analytics provider/storage approach.
- Update public privacy language before tracking begins.

### Phase 1C-1 — metadata readiness

- Add or derive `intent_stage` and `sensitivity` classifications for existing answers.
- Start with a local report, not runtime tracking.
- Use the Phase 1B 100-question pilot to test classifications.

### Phase 1C-2 — lightweight first-party tracking

Initial implementation tracks these GA4 events:

- `answer_viewed`;
- `category_viewed`;
- `entity_viewed`;
- `site_search_performed`;
- `site_search_result_clicked`;
- `crisis_banner_seen`;
- `practitioner_callout_clicked`;
- `practitioner_callout_viewed`;
- `source_ref_clicked`;
- `crisis_resource_clicked`;
- `external_referral_clicked`;
- `editorial_policy_viewed`;
- `answer_related_clicked`.

No raw user accounts. No ad retargeting. No zip-level reports. GA pageview config sends path-only URLs, and event parameters use structured context such as page path, answer slug, category/entity, result count, outbound domain, and coarse intent/sensitivity labels.

### Phase 1C-3 — reporting

Create internal monthly reports:

- top categories by answer views;
- top care-navigation pages;
- rising state-level categories;
- practitioner bridge click-through by category;
- coverage gaps from search, once site search exists.

### Phase 1C-4 — external products

Only after enough volume and policy maturity:

- therapist website strategy reports;
- state/metro mental health demand reports;
- practitioner referral matching;
- anonymized trend reports.

## Go / no-go gates before expanded instrumentation

Before expanding beyond the current GA4 instrumentation:

- event fields are finalized;
- location policy is approved;
- sensitive-topic suppression rules are approved;
- storage/retention policy is decided;
- analytics output is limited to internal use at first.

## Open decisions

1. Future analytics backend beyond GA4: Vercel Analytics, PostHog, Supabase table, or a dedicated warehouse?
2. Session model: no session IDs vs short-lived anonymous session hash?
3. Location source: coarse IP geolocation, self-reported location, or no location initially?
4. Retention: 30, 90, 180, or 365 days for raw events before rollup-only storage?
5. Raw event export policy: GA4-only reporting vs future first-party rollups.
