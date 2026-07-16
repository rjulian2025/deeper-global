# Clinical contributor QA sample

Generated: 2026-07-16T21:08:23.029Z

## Composition

- Sample size: **105**
- Source pool: **923** high-confidence assignments
- Clinicians represented: **15** / 15 proposed
- Human QA decision column: `pending` (not auto-filled)
- Replacement column for revise: `human_qa_replacement_clinician_id` (required when decision=`revise`)
- After filling decisions, run: `npm run reviewers:reconcile-qa`
- Production apply stays blocked while any row remains `pending`

### By clinician

- laura-hilsen: 14
- lynn-lane: 12
- samantha-bryant: 11
- jackie-malone: 9
- meredith-price: 9
- alex-crenshaw-phd: 8
- susan-keenan: 7
- amanda-gaines: 6
- michaela-hilburn: 6
- jeannine-jannot: 5
- kelsey-donahue: 5
- liz-webb: 4
- lauren-sanders: 3
- lexi-cooper: 3
- sarah-evers: 3

### By theme

- anxiety-and-mood: 35
- trauma-and-safety: 12
- life-transitions-and-change: 12
- spirituality-and-meaning: 12
- relationships-and-connection: 10
- family-and-parenting: 10
- identity-and-self-worth: 7
- work-and-purpose: 7

### Inclusion strata

- every proposed clinician
- top 10 by volume
- share > 8% of migratable corpus
- near high/medium threshold (score 80–85)
- alias and parent-theme matches
- YMYL clusters (trauma, abuse, addiction, eating, postpartum, OCD, chronic illness, testing)
- ≥5 examples per major theme where available
- broad-generalist topic clusters

## Sample rows

| Title | Clinician | Topic | Score | Match type | QA |
| --- | --- | --- | ---: | --- | --- |
| Can AI Make Me Feel Emotionally Numb? | Dr. Alex Crenshaw | Depression | 100 | exact_topic_plus_alias | pending |
| How Chronic Stress Can Wear Down Your Mental Health | Dr. Alex Crenshaw | Anxiety & Stress | 100 | exact_topic_plus_alias | pending |
| Can You Change Your Attachment Style? | Dr. Alex Crenshaw | Relationships & Communication | 100 | exact_topic | pending |
| Signs Someone May Be Manipulating You | Dr. Alex Crenshaw | Trauma & Safety | 100 | exact_topic | pending |
| Coping With Depression When You Have a Chronic Illness | Dr. Alex Crenshaw | Depression | 100 | exact_topic_plus_alias | pending |
| Dealing With Intrusive Sexual Thoughts | Dr. Alex Crenshaw | Anxiety & Stress | 100 | exact_topic | pending |
| How to Tell If What You’re Feeling Might Be Depression | Dr. Alex Crenshaw | Depression | 100 | exact_topic_plus_alias | pending |
| AI Easier Than Therapist | Dr. Alex Crenshaw | Depression | 100 | exact_topic_plus_alias | pending |
| Can AI Make Health Anxiety Worse? | Amanda Gaines | Anxiety & Stress | 100 | exact_topic_plus_alias | pending |
| Can You Drink Alcohol While on Psychiatric Medication? | Amanda Gaines | Addiction & Recovery | 100 | exact_topic | pending |
| Postpartum Depression vs. Baby Blues | Amanda Gaines | Depression | 100 | exact_topic_plus_alias | pending |
| Overthinking Everything You Say and Do | Amanda Gaines | Anxiety & Stress | 100 | exact_topic_plus_alias | pending |
| Exercise for Depression | Amanda Gaines | Depression | 100 | exact_topic_plus_alias | pending |
| Why Do I Keep Going Back to AI Even When It Makes Me Feel Worse? | Amanda Gaines | Anxiety & Stress | 100 | exact_topic_plus_alias | pending |
| Can AI Companionship Replace Human Intimacy? | Jackie Malone | Relationships & Communication | 100 | exact_topic | pending |
| Can AI Make Intrusive Thoughts Worse? | Jackie Malone | Anxiety & Stress | 100 | exact_topic_plus_alias | pending |
| Can AI Make Me Feel Like My Creativity Does Not Matter? | Jackie Malone | Identity & Self-Worth | 100 | exact_topic_plus_alias | pending |
| Can Using AI for Emotional Support Become Addictive? | Jackie Malone | Addiction & Recovery | 100 | exact_topic_plus_alias | pending |
| How to Create a Calming Environment at Home | Jackie Malone | General Mental Health | 86 | exact_topic_plus_alias | pending |
| Feeling Lost During a Major Life Transition | Jackie Malone | General Mental Health | 86 | exact_topic_plus_alias | pending |
| When People Do Not Support Your Life Changes | Jackie Malone | General Mental Health | 86 | exact_topic_plus_alias | pending |
| Eating Dinner Alone | Jackie Malone | Identity & Self-Worth | 100 | exact_topic | pending |
| Throat Tightness When Stressed | Jackie Malone | Anxiety & Stress | 100 | exact_topic_plus_alias | pending |
| How to Help Someone Who Thinks AI Is Sending Secret Messages | Jeannine Jannot, Ph.D. | Family & Parenting | 100 | exact_topic_plus_alias | pending |
| Helping Your Child Adjust to Divorce | Jeannine Jannot, Ph.D. | Family & Parenting | 100 | exact_topic_plus_alias | pending |
| Coping With Academic Pressure and Fear of Failure | Jeannine Jannot, Ph.D. | Teens & Identity | 86 | exact_topic_plus_alias | pending |
| Dealing With Toxic Family Members | Jeannine Jannot, Ph.D. | Family & Parenting | 100 | exact_topic | pending |
| Unpaid Child Support | Jeannine Jannot, Ph.D. | Family & Parenting | 100 | exact_topic_plus_alias | pending |
| Can AI Make Avoidance Easier When I Am Anxious? | Kelsey Madsen (Donahue) | Anxiety & Stress | 100 | exact_topic_plus_alias | pending |
| How Parents Can Support a Child Who Worries a Lot | Kelsey Madsen (Donahue) | Family & Parenting | 100 | exact_topic_plus_alias | pending |
| How Long Do You Take Psychiatric Medication? | Kelsey Madsen (Donahue) | Depression | 100 | exact_topic_plus_alias | pending |
| Supporting a Gender-Questioning Child | Kelsey Madsen (Donahue) | Teens & Identity | 94 | exact_topic_plus_alias | pending |
| Why Depression Can Come Back After You Start Feeling Better | Kelsey Madsen (Donahue) | Depression | 100 | exact_topic_plus_alias | pending |
| Are You Too Dependent on AI for Work Decisions? | Laura Hilsen | Work & Burnout | 100 | exact_topic | pending |
| Can AI Make Burnout Worse? | Laura Hilsen | Work & Burnout | 100 | exact_topic | pending |
| Can AI Workplace Monitoring Affect Mental Health? | Laura Hilsen | Work & Burnout | 100 | exact_topic_plus_alias | pending |
| Can Deepfakes Cause Trauma or Anxiety? | Laura Hilsen | Trauma & Safety | 100 | exact_topic_plus_alias | pending |
| Who You Are Beyond Others' Expectations | Laura Hilsen | Identity & Self-Worth | 100 | exact_topic | pending |
| Asking for a Mental Health Day Without Guilt | Laura Hilsen | Work & Burnout | 100 | exact_topic_plus_alias | pending |
| Coping After Losing Someone to Suicide | Laura Hilsen | General Mental Health | 94 | exact_topic_plus_alias | pending |

Full machine-readable sample: `qa-sample.csv`.
