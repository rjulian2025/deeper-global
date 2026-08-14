# Structured data treatment for clinical contributors

## Problem

Schema.org has `reviewedBy` for genuine review relationships, but specialty-matched
organizational contributor attribution is not a completed page-level clinical review.

## Chosen treatment

| State | Visible label | Schema |
| --- | --- | --- |
| Clinical contributor | Clinical contributor | `Article`/`MedicalWebPage` `contributor` → Person `@id`; Person may include `affiliation` to Peachtree Organization. **Do not** emit `reviewedBy` or `dateReviewed`. |
| Clinical reviewer | Clinically reviewed by | `reviewedBy` → Person `@id` when a true review + supported date exist. Still avoid inventing `dateReviewed` unless product later adopts it with a real date. |
| Editorially reviewed by Deeper | Editorially reviewed by Deeper | No Person reviewer; author/publisher remain Deeper Organization. |
| Legacy Ken bulk (pre-apply display) | Clinical contributor | Treat as contributor-style Person link; never advertise bulk `reviewed_at` as clinical review date. |

## Why not force `reviewedBy`

Using `reviewedBy` for specialty-matched migration would overclaim clinical review.
`contributor` is the most accurate first-class property available for “this person
contributed clinical specialty oversight to the page” without asserting a completed review event.

## Matching rule

Visible attribution state and JSON-LD must always agree.
