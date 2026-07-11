# Old Campaign Exports (Instantly)

Place **read-only** CSV exports from the paused TherapistGPS Instantly pilot here.

## Before you export

1. Confirm the old campaign is **paused** (do not resume).
2. Rename it clearly in Instantly, for example: `ARCHIVE - TherapistGPS Pilot - Do Not Resume`
3. Export all available lead and activity data.
4. Do not delete old records until suppression files are confirmed.

## What to place in this folder

Copy CSV exports here. **Keep original filenames** from Instantly when possible.

| Priority | Export type | Filename hint |
|---|---|---|
| Required | Anyone previously sent / contacted | `sent`, `contacted`, `delivered` |
| Required | All replies | `replies`, `replied` |
| Required | Unsubscribes | `unsub`, `optout` |
| Required | Bounces | `bounce`, `bounced` |
| Recommended | Positive / interested replies | `positive`, `interested` |
| Recommended | Negative replies | `negative`, `not interested` |
| Recommended | Full old campaign lead export | `leads`, `campaign` |
| Recommended | Existing blocklist / suppression | `block`, `suppress`, `blacklist` |
| If available | Active conversations | `conversation`, `active` |

If Instantly only provides a combined export, place that file here unchanged. The processor infers suppression reasons from filename keywords and any `status` / `reply status` columns.

## Required column

At minimum, each CSV needs a column the script can map to email. Recognized headers include:

- `email`
- `Email Address`
- `Contact Email`
- `Lead Email`
- `E-mail`

## What not to do

- Do not edit CSV contents after export (preserve the audit trail).
- Do not move files into subfolders; place CSVs directly in this directory.
- Do not delete originals after processing; they stay here as source of truth.

## Optional manual exclusions

For one-off emails not in Instantly exports, add `input/manual-exclusions.csv` at the project root (sibling to this folder) with at least an `email` column.

## Next step

After all exports are in place:

```bash
python3 instantly-relaunch/working/process_leads.py
```

Review `output/suppression/master_suppression_list.csv` before proceeding.
