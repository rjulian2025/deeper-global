# Instantly CSV Header Reference

Compatible headers for the local `process_leads.py` processor. Header matching is **case-insensitive** and ignores underscores/hyphens vs spaces.

You do not need to rename Instantly export columns. Place exports as-is in `input/old-campaign/` or `input/new-leads/`.

## Email column (required)

At least one file per folder must include an email column. Recognized headers:

| Header in export | Used for |
|---|---|
| `email` | Primary match |
| `Email` | Instantly lead export |
| `Email Address` | Common export label |
| `E-mail` | Variant |
| `Contact Email` | CRM-style exports |
| `Lead Email` | Lead list exports |
| `Work Email` | Contact fields |
| `Primary Email` | Multi-email records |
| `Recipient` | Send logs |
| `To` | Activity exports |

## Status / activity columns (old-campaign exports)

Used to infer suppression reason when present. First matching column wins.

| Header | Typical Instantly meaning |
|---|---|
| `status` | Lead or campaign status |
| `lead status` | Pipeline state |
| `campaign status` | Per-campaign state |
| `contact status` | Contact-level state |
| `reply status` | Reply classification |
| `email status` | Delivery / engagement state |

### Status values mapped automatically

| Value contains | Suppression reason |
|---|---|
| sent, contacted, delivered, completed | `previously_emailed` |
| replied, reply, responded | `replied` |
| interested, positive, warm | `positive_reply` |
| not interested, negative, reject, declined | `negative_reply` |
| unsub, opted out | `unsubscribed` |
| bounce, bounced | `bounced` |
| block, suppressed, blacklist | `blocklisted` |
| conversation, active | `active_conversation` |

If no status column or value matches, the processor uses **filename keywords** (see `input/old-campaign/README.md`), then falls back to `prior_campaign_contact`.

## New lead import columns (new-leads/)

Mapped to `output/cleaned-leads/deeper_global_import_ready.csv`:

| Output column | Recognized source headers |
|---|---|
| `email` | email, e-mail, email address, contact email, lead email |
| `first_name` | first name, firstname, first, given name, fname |
| `last_name` | last name, lastname, last, surname, family name, lname |
| `company` | company, company name, organization, practice, clinic |
| `website` | website, web site, url, company website, domain |
| `city` | city, town, locality |
| `state` | state, province, region, state/province |
| `personalization` | personalization, custom variable, custom field, icebreaker |

**Note:** A source column named `Notes` maps to `personalization` in the import file, not to a separate notes field.

### Common Instantly lead export headers (informational)

Instantly lead CSVs may also include columns the processor **does not transform** but preserves context in source files:

- `Campaign Name`
- `Lead Status`
- `Last Contacted`
- `Opened`
- `Clicked`
- `Replied`
- `Bounced`
- `Unsubscribed`
- `Phone`
- `LinkedIn`
- `Title`
- `Industry`
- `Location`

Extra columns are ignored unless they match a recognized alias above.

## Manual exclusions (`input/manual-exclusions.csv`)

| Column | Required | Purpose |
|---|---|---|
| `email` | Yes | Address to suppress |
| `reason` | No | Custom suppression reason (defaults to `manual_exclusion`) |
| `notes` | No | Free-text audit note |

Example:

```csv
email,reason,notes
former-client@example.com,manual_exclusion,Requested no outreach
competitor@example.com,do_not_contact,Competitor domain
```

## Role-based allowlist (`input/role-based-allowlist.csv`)

Optional override for role-based filtering. Emails listed here are **not** excluded for generic inbox local parts (`info@`, `admin@`, etc.).

| Column | Required |
|---|---|
| `email` | Yes |

Example:

```csv
email
info@known-practice.com
```

## Hard exclusions vs review-only flags

| Output file | Contents |
|---|---|
| `excluded_leads_report.csv` | **Hard exclusions only** (removed from import-ready file) |
| `data_quality_flags.csv` | **Review-only flags** (import-ready rows that need human eyes) |

See main `README.md` for the full exclusion rule table.
