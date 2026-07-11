# Deeper.global Relaunch: Manual QA Checklist

Complete this checklist **before** importing leads or enabling any Instantly campaign.

Check each item manually. Do not skip the approval gate at the end.

---

## A. Instantly housekeeping (old campaign)

- [ ] Old TherapistGPS pilot campaign is **paused**
- [ ] Old campaign renamed to something like: `ARCHIVE - TherapistGPS Pilot - Do Not Resume`
- [ ] All required exports downloaded and placed in `input/old-campaign/`
- [ ] Unsubscribes and bounces are represented in exports or suppression list
- [ ] Active conversations are not planned for re-add (verify in exports)
- [ ] Old templates archived if appropriate
- [ ] No old records deleted before suppression files are confirmed

## B. Local processing review

- [ ] Ran `python3 instantly-relaunch/working/process_leads.py`
- [ ] Reviewed `output/reports/relaunch_summary.md` for expected counts
- [ ] Reviewed `output/suppression/master_suppression_list.csv`
- [ ] Spot-checked 10-20 rows in `output/cleaned-leads/deeper_global_import_ready.csv`
- [ ] Reviewed `output/reports/excluded_leads_report.csv` for unexpected exclusions
- [ ] Reviewed `output/reports/duplicate_leads_report.csv`
- [ ] Resolved or accepted all rows in `output/reports/data_quality_flags.csv`
- [ ] Ambiguous relevance flags reviewed (if any)

## C. Suppression integrity

- [ ] Prior sent contacts appear in suppression list
- [ ] Replies (positive and negative) appear in suppression list
- [ ] Unsubscribes appear in suppression list
- [ ] Bounces appear in suppression list
- [ ] No known active conversations included in import-ready file
- [ ] Manual exclusions applied (if `input/manual-exclusions.csv` was used)

## D. New campaign setup (Instantly)

- [ ] Deeper.global sending domain configured and verified
- [ ] Sender inboxes warmed and healthy
- [ ] Tracking settings reviewed (opens/clicks/unsubscribe)
- [ ] New campaign created (not resuming old campaign)
- [ ] Campaign copy reviewed (`output/campaign-copy/deeper_global_sequence_draft.md`)
- [ ] Copy does not reference TherapistGPS unless explicitly approved
- [ ] Copy does not imply a prior relationship that did not exist

## E. Import and launch

- [ ] Only `deeper_global_import_ready.csv` will be imported (not raw new-leads)
- [ ] Suppression / blocklist settings active in Instantly
- [ ] Test import or spot-check of 10-20 leads in Instantly UI
- [ ] First send batch is intentionally small
- [ ] Reply and bounce monitoring plan in place before scaling

---

## Approval gate

**Do not proceed past this line without explicit human approval.**

| Role | Name | Date | Approved (Y/N) |
|---|---|---|---|
| Campaign owner | | | |
| Deliverability / ops reviewer | | | |

### Approved actions (check only what is explicitly authorized)

- [ ] Import cleaned leads into Instantly
- [ ] Enable or schedule new Deeper.global campaign
- [ ] Send first email batch

If any box above is unchecked, **stop**. Re-run local processing or fix Instantly setup first.

---

*This checklist is for manual use. The local processor does not modify Instantly or send email.*
