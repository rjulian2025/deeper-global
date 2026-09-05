# Deeper.global Instantly Relaunch: Local Cleanup Workflow

Local, deterministic CSV processing to prepare a clean Deeper.global campaign import while protecting prior TherapistGPS pilot contacts from accidental re-outreach.

**This workflow does not:**
- Log into Instantly
- Send emails
- Call external APIs
- Modify live campaigns

**Human approval is required before** importing leads, enabling campaigns, or making any live Instantly changes.

## Quick start

### 1. Export data from Instantly (manual)

From the paused TherapistGPS pilot, export CSVs and place them in `input/old-campaign/`. Preserve original filenames.

Desired exports (use closest available if Instantly groups them):

| Category | Suggested filename pattern |
|---|---|
| Old campaign leads | `old-campaign-leads.csv` |
| Sent / contacted | `sent-contacts.csv` |
| All replies | `replies.csv` |
| Positive / interested replies | `positive-replies.csv` |
| Negative replies | `negative-replies.csv` |
| Unsubscribes | `unsubscribes.csv` |
| Bounces | `bounces.csv` |
| Blocklist / suppression | `blocklist.csv` |

Place your new Deeper.global candidate list in `input/new-leads/`.

Optional files at the project root of `input/`:

- `manual-exclusions.csv` with columns `email`, `reason`, `notes`
- `role-based-allowlist.csv` with column `email` (override role-based hard exclusions)

See `input/old-campaign/README.md`, `input/new-leads/README.md`, and `docs/instantly-csv-headers.md` for compatible Instantly CSV headers.

### 2. Run the processor

```bash
python3 instantly-relaunch/working/process_leads.py
```

No dependencies required (Python 3.10+ standard library only).

### 3. Review outputs

| File | Purpose |
|---|---|
| `output/suppression/master_suppression_list.csv` | All emails that must not be re-contacted |
| `output/cleaned-leads/deeper_global_import_ready.csv` | Import-ready leads for a new Deeper.global campaign |
| `output/reports/excluded_leads_report.csv` | Every removed new lead with reason |
| `output/reports/duplicate_leads_report.csv` | Duplicate emails within the new list |
| `output/reports/data_quality_flags.csv` | Review-only flags (rows still in import-ready file) |
| `output/reports/relaunch_summary.md` | Run summary and recommendation |
| `output/reports/launch_qa_checklist.md` | Manual pre-launch checklist |
| `working/processing_audit.log` | Timestamped processing log |

### 4. Stop before live changes

Do **not** import into Instantly until you have:

1. Reviewed the suppression list
2. Spot-checked 10-20 import-ready rows
3. Resolved ambiguous relevance flags
4. Completed `launch_qa_checklist.md`
5. Explicitly approved going live

## Folder structure

```
instantly-relaunch/
  input/
    old-campaign/            # Instantly exports (read-only for the script)
    new-leads/               # New candidate list CSVs
    manual-exclusions.csv    # Optional: email, reason, notes
    role-based-allowlist.csv # Optional: allow role-based emails through
  docs/
    instantly-csv-headers.md # Compatible Instantly column reference
  output/
    suppression/
    cleaned-leads/
    reports/
    campaign-copy/
  working/
    process_leads.py
    processing_audit.log   # Created on each run
```

## Rules

- **Never edit files inside `input/`** via the script. Original exports stay unchanged.
- All transformed data goes to `output/` or `working/`.
- Re-running the script overwrites previous outputs (not inputs).
- Suppression logic is deterministic: email normalization, filename/status inference, deduplication, and rule-based exclusions only.

## How suppression is built

Every row in `input/old-campaign/*.csv` with a detectable email column is added to the master suppression list.

Reason assignment (in order):

1. **Status column** values (`status`, `reply status`, etc.) matched against known patterns
2. **Filename** keywords (`sent`, `replies`, `unsubscribes`, `bounces`, etc.)
3. Fallback: `prior_campaign_contact`

Malformed or blank emails are recorded with `malformed_or_blank_email` or `malformed_email` reasons.

## Hard exclusions vs review-only flags

The processor writes two separate report types:

### Hard exclusions (`excluded_leads_report.csv`)

Rows **removed** from the import-ready file. Column `exclusion_type` is always `hard_exclusion`.

| Check | `exclusion_reason` |
|---|---|
| On master suppression list | `suppressed` |
| Duplicate email in new list | `duplicate_in_new_list` |
| Invalid / malformed email | `invalid_or_malformed_email` |
| Missing email | `missing_email` |
| Role-based inbox (`info@`, `admin@`, `support@`, etc.) | `role_based_email` |
| Clearly non-therapist record (heuristic) | `likely_irrelevant_record` |

### Review-only flags (`data_quality_flags.csv`)

Rows **still included** in `deeper_global_import_ready.csv` but flagged for human review. Column `disposition` is always `review_only`.

| Flag | Meaning |
|---|---|
| `missing_name` | Both first and last name are blank |
| `ambiguous_relevance` | Could not confirm therapist fit from available fields |

Resolve review flags before import. Remove rows manually from the import-ready CSV if needed.

## Email normalization

- Trim whitespace
- Lowercase
- Remove internal spaces
- Validate with a basic `local@domain.tld` pattern
- Preserve original values in exclusion/quality reports

## Instantly CSV headers

Full header compatibility reference: [`docs/instantly-csv-headers.md`](docs/instantly-csv-headers.md)

Import fields mapped automatically: `email`, `first_name`, `last_name`, `company`, `website`, `city`, `state`, `personalization`

Only columns present (or mappable) in your new-leads CSV are included in the import-ready file.

## Campaign copy

Draft sequence placeholder lives at `output/campaign-copy/deeper_global_sequence_draft.md`. Fill in approved messaging before launch; the processor does not generate or upload copy.

## Troubleshooting

**Empty suppression list**
- Confirm CSVs are in `input/old-campaign/` (not a subfolder)
- Confirm files have a recognizable email column header

**All new leads excluded**
- Check that the new list does not overlap heavily with old campaign exports
- Review `excluded_leads_report.csv` for `exclusion_reason`

**Unexpected role-based exclusions**
- Role-based filtering is on by default for generic inboxes (`info@`, `admin@`, `support@`, etc.)
- **Override per email:** add the address to `input/role-based-allowlist.csv` and re-run
- **Override policy:** edit `ROLE_BASED_LOCAL_PARTS` in `working/process_leads.py` only with team approval
- **Manual re-include after run:** copy approved rows from `excluded_leads_report.csv` into a separate human-reviewed import file (do not edit generated outputs in place)

## Dry-run validation (sample fixtures)

Built-in sample CSVs under `working/samples/` validate the processor without touching `input/`:

```bash
python3 instantly-relaunch/working/process_leads.py --use-samples
```

## Re-running

Safe to re-run after adding or replacing input CSVs. Inputs are never modified.

```bash
python3 instantly-relaunch/working/process_leads.py
```

Compare `relaunch_summary.md` and `processing_audit.log` across runs to verify counts.
