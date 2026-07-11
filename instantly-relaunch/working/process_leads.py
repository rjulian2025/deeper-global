#!/usr/bin/env python3
"""
Deterministic CSV processing for the Deeper.global Instantly relaunch workflow.

Reads exports from input/ (never modified), writes all outputs to output/ and working/.
No external APIs, no network calls, no Instantly integration.
"""

from __future__ import annotations

import csv
import re
import sys
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
INPUT_OLD = ROOT / "input" / "old-campaign"
INPUT_NEW = ROOT / "input" / "new-leads"
INPUT_MANUAL_EXCLUSIONS = ROOT / "input" / "manual-exclusions.csv"
WORKING = ROOT / "working"
OUTPUT_SUPPRESSION = ROOT / "output" / "suppression"
OUTPUT_CLEANED = ROOT / "output" / "cleaned-leads"
OUTPUT_REPORTS = ROOT / "output" / "reports"

AUDIT_LOG = WORKING / "processing_audit.log"

# ---------------------------------------------------------------------------
# Field detection (deterministic header matching)
# ---------------------------------------------------------------------------

EMAIL_ALIASES = frozenset(
    {
        "email",
        "e-mail",
        "e_mail",
        "email address",
        "emailaddress",
        "contact email",
        "lead email",
        "work email",
        "primary email",
        "recipient",
        "to",
    }
)

STATUS_ALIASES = frozenset(
    {
        "status",
        "lead status",
        "campaign status",
        "contact status",
        "reply status",
        "email status",
    }
)

IMPORT_FIELD_MAP: dict[str, tuple[str, ...]] = {
    "email": ("email", "e-mail", "email address", "contact email", "lead email"),
    "first_name": ("first name", "firstname", "first", "given name", "fname"),
    "last_name": ("last name", "lastname", "last", "surname", "family name", "lname"),
    "company": ("company", "company name", "organization", "organisation", "practice", "clinic"),
    "website": ("website", "web site", "url", "company website", "domain"),
    "city": ("city", "town", "locality"),
    "state": ("state", "province", "region", "state/province"),
    "personalization": (
        "personalization",
        "personalisation",
        "custom variable",
        "custom field",
        "notes",
        "icebreaker",
    ),
}

# Filename keyword -> default suppression reason when status column is absent
FILENAME_SUPPRESSION_RULES: list[tuple[tuple[str, ...], str]] = [
    (("sent", "contacted", "delivered", "outreach"), "previously_emailed"),
    (("reply", "replied", "response"), "replied"),
    (("positive", "interested", "warm"), "positive_reply"),
    (("negative", "not interested", "reject"), "negative_reply"),
    (("unsub", "optout", "opt-out", "opt out"), "unsubscribed"),
    (("bounce", "bounced", "invalid"), "bounced"),
    (("block", "suppress", "blacklist", "do not contact", "dnc"), "blocklisted"),
    (("conversation", "active"), "active_conversation"),
]

ROLE_BASED_LOCAL_PARTS = frozenset(
    {
        "info",
        "admin",
        "support",
        "help",
        "contact",
        "sales",
        "office",
        "team",
        "hello",
        "noreply",
        "no-reply",
        "billing",
        "hr",
        "jobs",
        "careers",
        "marketing",
        "press",
        "media",
    }
)

# Status column values -> suppression reason
STATUS_VALUE_RULES: list[tuple[tuple[str, ...], str]] = [
    (("sent", "contacted", "delivered", "completed", "finished"), "previously_emailed"),
    (("replied", "reply", "responded"), "replied"),
    (("interested", "positive", "warm"), "positive_reply"),
    (("not interested", "negative", "reject", "declined"), "negative_reply"),
    (("unsub", "opted out", "opt-out"), "unsubscribed"),
    (("bounce", "bounced", "hard bounce", "soft bounce"), "bounced"),
    (("block", "suppressed", "blacklist"), "blocklisted"),
    (("conversation", "active"), "active_conversation"),
]

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------


@dataclass
class NormalizedEmail:
    original: str
    normalized: str
    is_valid: bool
    is_malformed: bool


@dataclass
class SuppressionRecord:
    email: str
    suppression_reason: str
    source_file: str
    original_status: str = ""
    notes: str = ""


@dataclass
class ProcessingStats:
    old_campaign_files: int = 0
    new_lead_files: int = 0
    old_campaign_rows: int = 0
    new_lead_rows_raw: int = 0
    suppression_records: int = 0
    unique_suppressed_emails: int = 0
    import_ready_count: int = 0
    excluded_suppressed: int = 0
    excluded_duplicates: int = 0
    excluded_invalid_email: int = 0
    excluded_missing_required: int = 0
    excluded_role_based: int = 0
    excluded_irrelevant: int = 0
    flagged_ambiguous: int = 0
    suppression_reason_counts: dict[str, int] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------


def log(message: str) -> None:
    line = f"[{datetime.now(timezone.utc).isoformat()}] {message}"
    print(line)
    with AUDIT_LOG.open("a", encoding="utf-8") as fh:
        fh.write(line + "\n")


def normalize_header(name: str) -> str:
    return re.sub(r"[\s_\-]+", " ", (name or "").strip().lower())


def find_column(headers: list[str], aliases: frozenset[str] | tuple[str, ...]) -> str | None:
    normalized = {normalize_header(h): h for h in headers}
    for alias in aliases:
        key = normalize_header(alias)
        if key in normalized:
            return normalized[key]
    return None


def map_import_columns(headers: list[str]) -> dict[str, str | None]:
    normalized = {normalize_header(h): h for h in headers}
    mapping: dict[str, str | None] = {}
    for target, aliases in IMPORT_FIELD_MAP.items():
        mapping[target] = None
        for alias in aliases:
            key = normalize_header(alias)
            if key in normalized:
                mapping[target] = normalized[key]
                break
    return mapping


def normalize_email(raw: str) -> NormalizedEmail:
    original = (raw or "").strip()
    if not original:
        return NormalizedEmail(original=original, normalized="", is_valid=False, is_malformed=False)

    candidate = original.lower().strip()
    candidate = re.sub(r"\s+", "", candidate)

    if "@" not in candidate:
        return NormalizedEmail(
            original=original, normalized=candidate, is_valid=False, is_malformed=True
        )

    if EMAIL_RE.match(candidate):
        return NormalizedEmail(
            original=original, normalized=candidate, is_valid=True, is_malformed=False
        )

    return NormalizedEmail(
        original=original, normalized=candidate, is_valid=False, is_malformed=True
    )


def infer_suppression_from_filename(filename: str) -> str | None:
    name = filename.lower()
    for keywords, reason in FILENAME_SUPPRESSION_RULES:
        if any(kw in name for kw in keywords):
            return reason
    return None


def infer_suppression_from_status(status: str) -> str | None:
    value = (status or "").strip().lower()
    if not value:
        return None
    for keywords, reason in STATUS_VALUE_RULES:
        if any(kw in value for kw in keywords):
            return reason
    return None


def is_role_based_email(email: str) -> bool:
    if "@" not in email:
        return False
    local = email.split("@", 1)[0].lower()
    local = local.split("+", 1)[0]
    return local in ROLE_BASED_LOCAL_PARTS


def looks_like_therapist_lead(row: dict[str, str], mapping: dict[str, str | None]) -> bool | None:
    """
    Return True if clearly therapist-relevant, False if clearly irrelevant, None if ambiguous.
    Heuristic only; flags ambiguous rows for human review instead of auto-dropping.
    """
    company = (row.get(mapping.get("company") or "", "") or "").strip().lower()
    website = (row.get(mapping.get("website") or "", "") or "").strip().lower()

    therapist_signals = (
        "therapy",
        "therapist",
        "counsel",
        "counseling",
        "counselling",
        "psycholog",
        "mental health",
        "lcsw",
        "lmft",
        "lpc",
        "psyd",
        "phd",
        "practice",
        "clinic",
    )
    irrelevant_signals = (
        "restaurant",
        "plumbing",
        "real estate",
        "auto repair",
        "grocery",
        "university admissions",
        "saas",
        "software company",
    )

    haystack = f"{company} {website}"
    if any(sig in haystack for sig in irrelevant_signals):
        return False
    if any(sig in haystack for sig in therapist_signals):
        return True
    return None


def read_csv_rows(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    rows: list[dict[str, str]] = []
    with path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        if not reader.fieldnames:
            return [], []
        headers = [h for h in reader.fieldnames if h]
        for row in reader:
            cleaned = {k: (v or "").strip() for k, v in row.items() if k}
            rows.append(cleaned)
    return headers, rows


def write_csv(path: Path, fieldnames: list[str], rows: Iterable[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in fieldnames})


def list_csv_files(directory: Path) -> list[Path]:
    if not directory.exists():
        return []
    return sorted(p for p in directory.iterdir() if p.is_file() and p.suffix.lower() == ".csv")


# ---------------------------------------------------------------------------
# Suppression list
# ---------------------------------------------------------------------------


def collect_suppression_from_file(path: Path) -> list[SuppressionRecord]:
    headers, rows = read_csv_rows(path)
    if not headers:
        log(f"SKIP (no headers): {path.name}")
        return []

    email_col = find_column(headers, EMAIL_ALIASES)
    if not email_col:
        log(f"SKIP (no email column): {path.name} | headers={headers}")
        return []

    status_col = find_column(headers, STATUS_ALIASES)
    default_reason = infer_suppression_from_filename(path.name) or "prior_campaign_contact"
    records: list[SuppressionRecord] = []

    for row in rows:
        norm = normalize_email(row.get(email_col, ""))
        if not norm.normalized:
            records.append(
                SuppressionRecord(
                    email="",
                    suppression_reason="malformed_or_blank_email",
                    source_file=path.name,
                    original_status=row.get(status_col, "") if status_col else "",
                    notes=f"original={norm.original!r}",
                )
            )
            continue

        status_value = row.get(status_col, "") if status_col else ""
        reason = infer_suppression_from_status(status_value) or default_reason

        if norm.is_malformed or not norm.is_valid:
            records.append(
                SuppressionRecord(
                    email=norm.normalized or norm.original.lower(),
                    suppression_reason="malformed_email",
                    source_file=path.name,
                    original_status=status_value,
                    notes=f"original={norm.original!r}",
                )
            )
            continue

        records.append(
            SuppressionRecord(
                email=norm.normalized,
                suppression_reason=reason,
                source_file=path.name,
                original_status=status_value,
                notes="",
            )
        )

    return records


def merge_suppression_records(records: list[SuppressionRecord]) -> list[dict[str, str]]:
    """
    Merge multiple suppression hits per email. Preserve all reasons in notes when collapsed.
    """
    by_email: dict[str, list[SuppressionRecord]] = defaultdict(list)
    for rec in records:
        key = rec.email or f"__blank__:{rec.source_file}:{rec.notes}"
        by_email[key].append(rec)

    merged: list[dict[str, str]] = []
    for email, hits in sorted(by_email.items(), key=lambda item: item[0]):
        reasons = sorted({h.suppression_reason for h in hits})
        sources = sorted({h.source_file for h in hits})
        statuses = sorted({h.original_status for h in hits if h.original_status})
        extra_notes = sorted({h.notes for h in hits if h.notes})

        primary_reason = reasons[0]
        notes_parts: list[str] = []
        if len(reasons) > 1:
            notes_parts.append("reasons=" + ";".join(reasons))
        if extra_notes:
            notes_parts.append("details=" + " | ".join(extra_notes))

        merged.append(
            {
                "email": "" if email.startswith("__blank__:") else email,
                "suppression_reason": primary_reason,
                "source_file": ";".join(sources),
                "original_status": ";".join(statuses),
                "notes": " | ".join(notes_parts),
            }
        )

    return merged


def build_master_suppression_list() -> tuple[list[dict[str, str]], ProcessingStats]:
    stats = ProcessingStats()
    all_records: list[SuppressionRecord] = []

    old_files = list_csv_files(INPUT_OLD)
    stats.old_campaign_files = len(old_files)

    for path in old_files:
        file_records = collect_suppression_from_file(path)
        stats.old_campaign_rows += len(file_records)
        all_records.extend(file_records)
        log(f"OLD-CAMPAIGN {path.name}: {len(file_records)} suppression candidate rows")

    if INPUT_MANUAL_EXCLUSIONS.exists():
        manual_records = collect_suppression_from_file(INPUT_MANUAL_EXCLUSIONS)
        for rec in manual_records:
            if rec.suppression_reason == "prior_campaign_contact":
                rec.suppression_reason = "manual_exclusion"
        all_records.extend(manual_records)
        log(f"MANUAL-EXCLUSIONS: {len(manual_records)} rows")

    merged = merge_suppression_records(all_records)
    stats.suppression_records = len(merged)
    stats.unique_suppressed_emails = len(
        {row["email"] for row in merged if row["email"]}
    )

    for row in merged:
        reason = row["suppression_reason"]
        stats.suppression_reason_counts[reason] = (
            stats.suppression_reason_counts.get(reason, 0) + 1
        )

    return merged, stats


# ---------------------------------------------------------------------------
# New lead cleaning
# ---------------------------------------------------------------------------


@dataclass
class LeadProcessingResult:
    import_rows: list[dict[str, str]]
    excluded_rows: list[dict[str, str]]
    duplicate_rows: list[dict[str, str]]
    quality_flags: list[dict[str, str]]
    ambiguous_rows: list[dict[str, str]]


def build_suppression_lookup(
    suppression_rows: list[dict[str, str]],
) -> dict[str, list[dict[str, str]]]:
    lookup: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in suppression_rows:
        email = row.get("email", "").strip().lower()
        if email:
            lookup[email].append(row)
    return lookup


def process_new_leads(suppression_rows: list[dict[str, str]], stats: ProcessingStats) -> LeadProcessingResult:
    suppression_lookup = build_suppression_lookup(suppression_rows)

    import_rows: list[dict[str, str]] = []
    excluded_rows: list[dict[str, str]] = []
    duplicate_rows: list[dict[str, str]] = []
    quality_flags: list[dict[str, str]] = []
    ambiguous_rows: list[dict[str, str]] = []

    seen_emails: dict[str, str] = {}

    new_files = list_csv_files(INPUT_NEW)
    stats.new_lead_files = len(new_files)

    for path in new_files:
        headers, rows = read_csv_rows(path)
        if not headers:
            log(f"SKIP new leads (no headers): {path.name}")
            continue

        email_col = find_column(headers, EMAIL_ALIASES)
        if not email_col:
            log(f"SKIP new leads (no email column): {path.name}")
            continue

        mapping = map_import_columns(headers)

        for idx, row in enumerate(rows, start=2):
            stats.new_lead_rows_raw += 1
            raw_email = row.get(email_col, "")
            norm = normalize_email(raw_email)
            source_ref = f"{path.name}:row{idx}"

            base_excluded = {
                "email": norm.normalized or norm.original,
                "original_email": norm.original,
                "source_file": path.name,
                "source_row": str(idx),
                "exclusion_reason": "",
                "notes": "",
            }

            if not norm.normalized:
                base_excluded["exclusion_reason"] = "missing_email"
                excluded_rows.append(base_excluded)
                stats.excluded_missing_required += 1
                quality_flags.append(
                    {
                        "email": "",
                        "flag": "missing_email",
                        "source_file": path.name,
                        "source_row": str(idx),
                        "details": "No email value present",
                    }
                )
                continue

            if norm.is_malformed or not norm.is_valid:
                base_excluded["exclusion_reason"] = "invalid_or_malformed_email"
                base_excluded["notes"] = f"normalized={norm.normalized!r}"
                excluded_rows.append(base_excluded)
                stats.excluded_invalid_email += 1
                quality_flags.append(
                    {
                        "email": norm.normalized,
                        "flag": "malformed_email",
                        "source_file": path.name,
                        "source_row": str(idx),
                        "details": f"original={norm.original!r}",
                    }
                )
                continue

            first_name = row.get(mapping.get("first_name") or "", "").strip()
            last_name = row.get(mapping.get("last_name") or "", "").strip()
            if not first_name and not last_name:
                quality_flags.append(
                    {
                        "email": norm.normalized,
                        "flag": "missing_name",
                        "source_file": path.name,
                        "source_row": str(idx),
                        "details": "Both first_name and last_name are blank",
                    }
                )

            if norm.normalized in suppression_lookup:
                hit = suppression_lookup[norm.normalized][0]
                base_excluded["exclusion_reason"] = "suppressed"
                base_excluded["notes"] = (
                    f"suppression_reason={hit.get('suppression_reason', '')}; "
                    f"source={hit.get('source_file', '')}"
                )
                excluded_rows.append(base_excluded)
                stats.excluded_suppressed += 1
                continue

            if norm.normalized in seen_emails:
                duplicate_rows.append(
                    {
                        "email": norm.normalized,
                        "first_seen_in": seen_emails[norm.normalized],
                        "duplicate_in": source_ref,
                        "source_file": path.name,
                        "source_row": str(idx),
                    }
                )
                excluded_rows.append(
                    {
                        **base_excluded,
                        "exclusion_reason": "duplicate_in_new_list",
                        "notes": f"first_seen={seen_emails[norm.normalized]}",
                    }
                )
                stats.excluded_duplicates += 1
                continue

            if is_role_based_email(norm.normalized):
                base_excluded["exclusion_reason"] = "role_based_email"
                base_excluded["notes"] = f"local_part={norm.normalized.split('@', 1)[0]}"
                excluded_rows.append(base_excluded)
                stats.excluded_role_based += 1
                quality_flags.append(
                    {
                        "email": norm.normalized,
                        "flag": "role_based_email",
                        "source_file": path.name,
                        "source_row": str(idx),
                        "details": "Generic inbox address",
                    }
                )
                continue

            relevance = looks_like_therapist_lead(row, mapping)
            if relevance is False:
                base_excluded["exclusion_reason"] = "likely_irrelevant_record"
                base_excluded["notes"] = "Heuristic mismatch for therapist outreach"
                excluded_rows.append(base_excluded)
                stats.excluded_irrelevant += 1
                continue
            if relevance is None:
                ambiguous_rows.append(
                    {
                        "email": norm.normalized,
                        "source_file": path.name,
                        "source_row": str(idx),
                        "reason": "ambiguous_relevance",
                        "notes": "Could not confirm therapist relevance from available fields",
                    }
                )
                stats.flagged_ambiguous += 1

            seen_emails[norm.normalized] = source_ref

            import_row: dict[str, str] = {"email": norm.normalized}
            for target, source_col in mapping.items():
                if target == "email":
                    continue
                import_row[target] = row.get(source_col, "").strip() if source_col else ""

            import_rows.append(import_row)

    stats.import_ready_count = len(import_rows)
    return LeadProcessingResult(
        import_rows=import_rows,
        excluded_rows=excluded_rows,
        duplicate_rows=duplicate_rows,
        quality_flags=quality_flags,
        ambiguous_rows=ambiguous_rows,
    )


# ---------------------------------------------------------------------------
# Reports
# ---------------------------------------------------------------------------


def write_summary_report(stats: ProcessingStats, result: LeadProcessingResult) -> None:
    top_reasons = sorted(
        stats.suppression_reason_counts.items(), key=lambda item: (-item[1], item[0])
    )[:10]

    lines = [
        "# Deeper.global Relaunch Summary",
        "",
        f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "",
        "## Input reviewed",
        "",
        f"- Old campaign CSV files: **{stats.old_campaign_files}**",
        f"- Old campaign rows scanned for suppression: **{stats.old_campaign_rows}**",
        f"- New lead CSV files: **{stats.new_lead_files}**",
        f"- New lead rows reviewed: **{stats.new_lead_rows_raw}**",
        "",
        "## Suppression",
        "",
        f"- Suppression records written: **{stats.suppression_records}**",
        f"- Unique suppressed emails: **{stats.unique_suppressed_emails}**",
        "",
        "### Top suppression reasons",
        "",
    ]

    if top_reasons:
        for reason, count in top_reasons:
            lines.append(f"- `{reason}`: {count}")
    else:
        lines.append("- No suppression rows produced (check `input/old-campaign/` exports).")

    lines.extend(
        [
            "",
            "## New lead cleaning",
            "",
            f"- Excluded (suppressed): **{stats.excluded_suppressed}**",
            f"- Excluded (duplicates in new list): **{stats.excluded_duplicates}**",
            f"- Excluded (invalid/malformed email): **{stats.excluded_invalid_email}**",
            f"- Excluded (missing email): **{stats.excluded_missing_required}**",
            f"- Excluded (role-based addresses): **{stats.excluded_role_based}**",
            f"- Excluded (likely irrelevant): **{stats.excluded_irrelevant}**",
            f"- Ambiguous records flagged for review: **{stats.flagged_ambiguous}**",
            f"- **Import-ready leads: {stats.import_ready_count}**",
            "",
            "## Ambiguous records requiring human review",
            "",
        ]
    )

    if result.ambiguous_rows:
        lines.append(
            f"See `data_quality_flags.csv` and review {len(result.ambiguous_rows)} ambiguous relevance rows."
        )
        for row in result.ambiguous_rows[:20]:
            lines.append(
                f"- `{row['email']}` ({row['source_file']} row {row['source_row']}): {row['notes']}"
            )
        if len(result.ambiguous_rows) > 20:
            lines.append(f"- ... and {len(result.ambiguous_rows) - 20} more")
    else:
        lines.append("- None flagged.")

    lines.extend(
        [
            "",
            "## Recommendation before launch",
            "",
            "1. Confirm old Instantly campaign remains paused and archived.",
            "2. Review `master_suppression_list.csv` for unexpected gaps or duplicates.",
            "3. Spot-check `deeper_global_import_ready.csv` (10-20 rows minimum).",
            "4. Resolve ambiguous relevance flags before import.",
            "5. **Stop here.** Do not import into Instantly until a human explicitly approves.",
            "",
            "## Output files",
            "",
            "- `output/suppression/master_suppression_list.csv`",
            "- `output/cleaned-leads/deeper_global_import_ready.csv`",
            "- `output/reports/excluded_leads_report.csv`",
            "- `output/reports/duplicate_leads_report.csv`",
            "- `output/reports/data_quality_flags.csv`",
            "- `output/reports/launch_qa_checklist.md`",
            "",
        ]
    )

    path = OUTPUT_REPORTS / "relaunch_summary.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    log(f"Wrote {path.relative_to(ROOT)}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def ensure_directories() -> None:
    for directory in (
        INPUT_OLD,
        INPUT_NEW,
        WORKING,
        OUTPUT_SUPPRESSION,
        OUTPUT_CLEANED,
        OUTPUT_REPORTS,
    ):
        directory.mkdir(parents=True, exist_ok=True)

    if AUDIT_LOG.exists():
        AUDIT_LOG.unlink()
    log("Starting Instantly relaunch local processing")


def main() -> int:
    ensure_directories()

    if not list_csv_files(INPUT_OLD) and not INPUT_MANUAL_EXCLUSIONS.exists():
        log("WARNING: No old-campaign CSVs found. Suppression list will be minimal.")

    if not list_csv_files(INPUT_NEW):
        log("WARNING: No new-leads CSVs found. Import-ready output will be empty.")

    suppression_rows, stats = build_master_suppression_list()
    write_csv(
        OUTPUT_SUPPRESSION / "master_suppression_list.csv",
        ["email", "suppression_reason", "source_file", "original_status", "notes"],
        suppression_rows,
    )
    log(
        f"Wrote master suppression list: {len(suppression_rows)} rows, "
        f"{stats.unique_suppressed_emails} unique emails"
    )

    result = process_new_leads(suppression_rows, stats)

    import_fieldnames = [
        "email",
        "first_name",
        "last_name",
        "company",
        "website",
        "city",
        "state",
        "personalization",
    ]
    write_csv(
        OUTPUT_CLEANED / "deeper_global_import_ready.csv",
        import_fieldnames,
        result.import_rows,
    )
    write_csv(
        OUTPUT_REPORTS / "excluded_leads_report.csv",
        ["email", "original_email", "source_file", "source_row", "exclusion_reason", "notes"],
        result.excluded_rows,
    )
    write_csv(
        OUTPUT_REPORTS / "duplicate_leads_report.csv",
        ["email", "first_seen_in", "duplicate_in", "source_file", "source_row"],
        result.duplicate_rows,
    )
    write_csv(
        OUTPUT_REPORTS / "data_quality_flags.csv",
        ["email", "flag", "source_file", "source_row", "details"],
        result.quality_flags,
    )

    write_summary_report(stats, result)

    log("Processing complete")
    log(f"Import-ready leads: {stats.import_ready_count}")
    log("No live Instantly changes were made.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
