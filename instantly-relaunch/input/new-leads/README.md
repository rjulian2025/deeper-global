# New Deeper.global Candidate Leads

Place the **new** lead list for the Deeper.global Instantly campaign here.

This list is compared against the master suppression list built from `input/old-campaign/` exports. Any overlap is excluded automatically.

## What to place in this folder

One or more CSV files with your candidate therapists or practices for the relaunch.

Suggested filename: `deeper-global-candidates.csv` (any `.csv` name is accepted).

## Recommended columns

Include whatever Instantly needs for import. The processor maps common headers to:

| Output field | Accepted source headers |
|---|---|
| `email` | email, Email Address, Contact Email, Lead Email |
| `first_name` | First Name, Firstname, First |
| `last_name` | Last Name, Lastname, Last, Surname |
| `company` | Company, Company Name, Practice, Clinic |
| `website` | Website, URL, Domain |
| `city` | City, Town |
| `state` | State, Province, Region |
| `personalization` | Personalization, Notes, Icebreaker, Custom Field |

Columns not present in your source CSV are left blank in the import-ready output.

## Quality expectations

The processor will flag or exclude:

- Emails already in the old campaign / suppression list
- Duplicate emails within this folder's files
- Blank or malformed emails
- Generic role-based addresses (`info@`, `admin@`, `support@`, etc.)
- Records that clearly look non-therapist (heuristic; see `data_quality_flags.csv`)

Ambiguous records (cannot confirm therapist relevance) are **kept** but flagged for manual review.

## What not to do

- Do not pre-filter against old campaign contacts manually unless you have a specific reason; let the script apply suppression consistently.
- Do not edit files here after a run if you want to compare against prior reports; add a new file or replace and re-run.
- Do not import this raw folder into Instantly. Use only `output/cleaned-leads/deeper_global_import_ready.csv` after human review.

## Next step

1. Confirm `input/old-campaign/` exports are in place.
2. Run:

```bash
python3 instantly-relaunch/working/process_leads.py
```

3. Review `output/cleaned-leads/deeper_global_import_ready.csv` and `output/reports/excluded_leads_report.csv`.

**Stop before importing into Instantly.** Approval is required for any live campaign change.
