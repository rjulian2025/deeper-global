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

Optional: add one-off exclusions to `input/manual-exclusions.csv` (same columns as any export with an `email` field).

See `input/old-campaign/README.md` and `input/new-leads/README.md` for detailed intake rules.

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
| `output/reports/data_quality_flags.csv` | Invalid, role-based, or ambiguous rows |
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
    old-campaign/          # Instantly exports (read-only for the script)
    new-leads/             # New candidate list CSVs
    manual-exclusions.csv  # Optional manual suppressions
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

## How new leads are cleaned

Each row in `input/new-leads/*.csv` is checked against:

| Check | Exclusion reason |
|---|---|
| On master suppression list | `suppressed` |
| Duplicate email in new list | `duplicate_in_new_list` |
| Invalid / malformed email | `invalid_or_malformed_email` |
| Missing email | `missing_email` |
| Role-based inbox (`info@`, `admin@`, `support@`, etc.) | `role_based_email` |
| Clearly non-therapist record (heuristic) | `likely_irrelevant_record` |

Ambiguous therapist relevance is **not** auto-excluded; it is flagged for human review.

## Email normalization

- Trim whitespace
- Lowercase
- Remove internal spaces
- Validate with a basic `local@domain.tld` pattern
- Preserve original values in exclusion/quality reports

## Detected column names

The script maps common header variants automatically. Supported import fields:

`email`, `first_name`, `last_name`, `company`, `website`, `city`, `state`, `personalization`

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
- Role-based filtering is on by default for generic inboxes
- Re-include specific addresses by removing them from the new list and contacting manually, or adjust the script's `ROLE_BASED_LOCAL_PARTS` set if your team approves a policy change

## Re-running

Safe to re-run after adding or replacing input CSVs. Inputs are never modified.

```bash
python3 instantly-relaunch/working/process_leads.py
```

Compare `relaunch_summary.md` and `processing_audit.log` across runs to verify counts.
