# Spirituality & Meaning Part C batch (15 candidates)

Generated: 2026-06-27T17:56:47.811Z

Approved Step 5 classification. Inserts use `review_status: draft`; `reviewed_by` set only after human review.

| # | Class | Crisis | Category | Question | Slug | Target reviewer |
|---:|---|---|---|---|---|---|
| 1 | a | no | Spiritual Doubt | How do I tell my partner I'm no longer religious? | `how-do-i-tell-my-partner-im-no-longer-religious` | rick-julian |
| 2 | b | yes | Spiritual Doubt | Is it normal to grieve the loss of my faith like a death? | `is-it-normal-to-grieve-the-loss-of-my-faith-like-a-death` | david-k-gore-phd |
| 4 | a | no | Spiritual Doubt | What is faith deconstruction and how is it different from a crisis of faith? | `what-is-faith-deconstruction-and-how-is-it-different-from-a-crisis-of-faith` | rick-julian |
| 6 | b | yes | Spiritual Struggle / Existential Crisis | How do I live with knowing everyone I love will die someday? | `how-do-i-live-with-knowing-everyone-i-love-will-die-someday` | david-k-gore-phd |
| 8 | b | yes | Spiritual Struggle / Existential Crisis | How do I talk to my children about death if I no longer believe in an afterlife? | `how-do-i-talk-to-my-children-about-death-without-an-afterlife` | david-k-gore-phd |
| 10 | a | no | Existential | Why does achieving my goals leave me feeling empty instead of fulfilled? | `why-does-achieving-my-goals-leave-me-feeling-empty` | rick-julian |
| 13 | a | no | Life Purpose | Is it okay if I never find a single life purpose? | `is-it-okay-if-i-never-find-a-single-life-purpose` | rick-julian |
| 16 | a | no | Spiritual Doubt | How do I build a personal spiritual practice outside organized religion? | `how-do-i-build-a-personal-spiritual-practice-outside-organized-religion` | rick-julian |
| 19 | a | no | Spiritual Doubt | How do I make new friends after leaving my church or religious community? | `how-do-i-make-new-friends-after-leaving-my-church` | rick-julian |
| 20 | b | yes | Spiritual Struggle / Existential Crisis | How do believers make sense of suffering if God is loving? | `how-do-believers-make-sense-of-suffering-if-god-is-loving` | david-k-gore-phd |
| 21 | b | yes | Spiritual Struggle / Existential Crisis | Why do bad things happen to good people? | `why-do-bad-things-happen-to-good-people` | david-k-gore-phd |
| 22 | a | no | Spiritual Doubt | Can life be meaningful without believing in God? | `can-life-be-meaningful-without-believing-in-god` | rick-julian |
| 23 | a | no | Existential | What is existentialism and can it help when life feels meaningless? | `what-is-existentialism-and-can-it-help-when-life-feels-meaningless` | rick-julian |
| 24 | a | no | Spiritual Doubt | Why am I questioning all my beliefs in midlife? | `why-am-i-questioning-all-my-beliefs-in-midlife` | rick-julian |
| 25 | a | no | Spiritual Doubt | How do I respect my family's faith while I no longer believe? | `how-do-i-respect-my-familys-faith-while-i-no-longer-believe` | rick-julian |

## Crisis-safety flagged (#6, #8, #20, #21, plus #2 grief-as-death)

Rewrite pipeline adds 988/escalation language in reach-out sections where appropriate. Do not promote until reviewer assignment is approved.

## Post-promote status (2026-06-27)

- 15 drafts inserted, rewritten, promoted to live fields.
- Reviewer assignments applied: 10 `rick-julian`, 5 `david-k-gore-phd`.
- #23 lede trimmed via `scripts/patch-spirituality-meaning-23-staging.mjs` (shorter canonical + lede; philosophical framing preserved).
- **Not deployed** until explicit deploy approval.

## Commands

```bash
node scripts/check-spirituality-meaning-overlap.mjs
npm run content:publish-spirituality-meaning-15
npm run content:publish-spirituality-meaning-15 -- --apply
npm run content:run-spirituality-meaning-rewrite-pipeline -- --apply
```
