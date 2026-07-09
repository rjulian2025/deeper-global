export type TopicContentEntry = {
  slug: string;
  /** 2-4 sentence editorial intro. AI-drafted; needs human review before any topic page is indexed. */
  intro: string;
  /** Slugs for a "Start here" section. Only populate once a human has picked them for a topic. */
  startHereSlugs?: string[];
  /** Path to an existing curated hub related to this topic. */
  curatedHubPath?: string;
  /** Overrides the default curated-hub callout sentence; use when the overlap with curatedHubPath is not one-to-one. */
  curatedHubNote?: string;
  /** Marks topics that warrant an extra crisis/support note in the trust strip. */
  sensitive?: boolean;
  /** Whether /topics/{slug}/ is indexable. Defaults to false — set only after editorial sign-off. */
  indexable?: boolean;
};

/**
 * Editorial content for the 16 canonical topics (src/lib/taxonomy.ts).
 * Intro copy is AI-drafted and restrained/non-diagnostic by design; it still
 * needs human editorial sign-off before any topic page becomes indexable.
 */
export const topicContent: Record<string, TopicContentEntry> = {
  'anxiety-and-stress': {
    slug: 'anxiety-and-stress',
    intro:
      'Anxiety and stress touch nearly everyone at some point, from everyday worry to panic that disrupts daily life. This topic gathers answers about racing thoughts, social anxiety, perfectionism, and physical stress symptoms, along with grounding strategies people use to cope.',
    curatedHubPath: '/anxiety/',
    startHereSlugs: [
      'how-do-i-know-if-i-have-anxiety-or-if-im-just-stressed',
      'why-do-i-feel-anxious-for-no-reason',
      'what-should-i-do-during-a-panic-attack',
      'my-chest-tightens-whenever-someone-texts-me-unexpectedly',
    ],
  },
  depression: {
    slug: 'depression',
    intro:
      'Depression can show up as low mood, numbness, fatigue, or a loss of interest in things that used to matter. These answers explore common depression symptoms, what tends to help, and when it may be time to involve a professional.',
    sensitive: true,
    startHereSlugs: [
      'how-do-i-know-if-i-might-be-depressed',
      'how-do-i-know-if-im-depressed-or-just-go-181288-005',
      'why-does-depression-come-back-after-feeling-better',
      'what-to-do-if-my-friend-is-depressed',
    ],
  },
  'addiction-and-recovery': {
    slug: 'addiction-and-recovery',
    intro:
      'Addiction and recovery questions cover substance use, relapse, cravings, and the day-to-day work of staying sober. This topic brings together answers for people early in recovery and for those supporting someone else through it.',
    sensitive: true,
    startHereSlugs: [
      'when-to-seek-professional-help-for-substance-use',
      'how-do-i-know-if-im-drinking-too-much-190974-009',
      'what-should-i-do-after-a-relapse-in-recovery',
      'what-should-i-expect-from-my-first-aa-or-na-meeting',
      'support-someone-with-addiction-without-enabling',
    ],
  },
  'trauma-and-safety': {
    slug: 'trauma-and-safety',
    intro:
      'Trauma changes how safe the world can feel, sometimes long after the original event has passed. These answers address triggers, flashbacks, and rebuilding a sense of safety, drawing on trauma-informed approaches to healing.',
    sensitive: true,
    startHereSlugs: [
      'how-do-i-know-if-i-have-ptsd-or-trauma',
      'what-are-healthy-ways-to-cope-with-flashbacks',
      'how-do-i-deal-with-trauma-triggers-in-ev-190219-011',
      'how-can-i-support-someone-who-has-experienced-trauma',
    ],
  },
  'therapy-and-care-navigation': {
    slug: 'therapy-and-care-navigation',
    intro:
      'Finding the right kind of professional support can be its own challenge. This topic covers how therapy works, what different treatment options involve, and how to navigate access to mental health care.',
    indexable: true,
    startHereSlugs: [
      'how-do-i-know-if-i-need-therapy',
      'how-do-i-find-a-therapist-thats-right-fo-184729-014',
      'what-do-i-do-when-i-cant-afford-therapy-177940-020',
      'how-do-i-prepare-for-my-first-therapy-se-186032-047',
    ],
  },
  'identity-and-self-worth': {
    slug: 'identity-and-self-worth',
    intro:
      'Questions of identity and self-worth often center on self-esteem, comparison, and the gap between who you are and who you feel you should be. These answers explore self-compassion, confidence, and letting go of the need to prove yourself.',
    startHereSlugs: [
      'why-do-i-feel-like-i-am-not-good-enough',
      'how-to-stop-comparing-myself-to-everyone-else',
      'can-low-self-esteem-affect-relationships',
      'why-do-compliments-make-me-uncomfortable',
    ],
  },
  'relationships-and-communication': {
    slug: 'relationships-and-communication',
    intro:
      "Relationships bring some of life's deepest connection and some of its hardest conflict. This topic covers communication, boundaries, attachment patterns, and the ordinary friction of staying close to another person.",
    startHereSlugs: [
      'tell-my-partner-i-feel-disconnected',
      'partner-refuses-to-talk-about-problems',
      'how-can-couples-rebuild-trust-after-lying',
      'how-do-i-know-if-my-relationship-is-toxic',
    ],
  },
  'family-and-parenting': {
    slug: 'family-and-parenting',
    intro:
      'Family relationships and parenting bring their own patterns, expectations, and sources of friction across every stage of life. These answers address parent-child dynamics, sibling relationships, and the family boundaries people navigate as adults.',
    startHereSlugs: [
      'how-can-parents-support-a-child-who-worries-a-lot',
      'what-if-my-child-does-not-want-to-talk-about-feelings',
      'how-do-i-help-my-anxious-child-without-m-190974-004',
      'repair-relationship-with-adult-child',
    ],
  },
  'grief-and-loss': {
    slug: 'grief-and-loss',
    intro:
      "Grief and loss are natural responses to something ending, whether that's a death, a relationship, or a major life change. This topic gathers answers about mourning, complicated grief, and finding a way through loss at your own pace.",
    sensitive: true,
    startHereSlugs: [
      'why-does-grief-come-in-waves',
      'how-long-is-it-normal-to-grieve-after-lo-184729-001',
      'when-to-get-help-for-grief',
      'how-do-i-cope-with-the-loss-of-a-pet',
    ],
  },
  'work-and-burnout': {
    slug: 'work-and-burnout',
    intro:
      'Work and burnout questions cover the stress, exhaustion, and loss of purpose that can build up in a job or career, including the newer strain of AI-driven change fatigue and job-security anxiety. This topic addresses workplace pressure, work-life balance, and recognizing the line between normal stress and burnout.',
    indexable: true,
    startHereSlugs: [
      'how-do-i-know-if-im-burned-out-or-just-s-190219-012',
      'why-work-stress-makes-me-irritable-at-home',
      'why-do-i-feel-guilty-when-i-rest',
      'make-time-for-myself-when-everyone-needs-something',
    ],
  },
  'teens-and-identity': {
    slug: 'teens-and-identity',
    intro:
      'Adolescence brings its own mental health questions, from school pressure to identity and peer relationships. These answers are written with teens and the adults who support them in mind, covering common teen-specific concerns.',
    sensitive: true,
  },
  'loneliness-and-belonging': {
    slug: 'loneliness-and-belonging',
    intro:
      "Loneliness can happen even when you're surrounded by people, and belonging is not always easy to find. This topic covers isolation, social connection, and what tends to help people feel less alone.",
    startHereSlugs: [
      'why-do-i-feel-lonely-even-around-people',
      'what-to-do-if-i-have-no-one-to-talk-to',
      'how-do-i-make-friends-as-an-adult-when-it-feels-impossible',
      'can-loneliness-affect-my-mental-health',
    ],
  },
  'neurodivergence-and-attention': {
    slug: 'neurodivergence-and-attention',
    intro:
      'Neurodivergence and attention questions cover ADHD, autism, and how a differently wired brain interacts with daily life, work, and relationships. This topic focuses on diagnosis, executive function, and practical day-to-day strategies.',
    curatedHubPath: '/adhd/',
    curatedHubNote:
      'Our ADHD hub has additional curated coverage of this subject, including deeper clusters on diagnosis, daily strategies, and treatment: ',
    startHereSlugs: [
      'how-do-i-know-if-i-have-adhd-as-an-adult',
      'what-is-adhd-and-how-is-it-different-from-just-being-distracted',
      'how-do-i-get-tested-for-adhd-as-an-adult',
      'what-are-the-signs-of-adhd-in-women',
      'what-is-executive-dysfunction-and-how-does-it-affect-daily-life',
    ],
  },
  'gender-sexuality-and-intimacy': {
    slug: 'gender-sexuality-and-intimacy',
    intro:
      'Gender, sexuality, and intimacy questions touch identity, relationships, and how people understand themselves. This topic covers coming out, gender identity, and the intimacy challenges that show up in relationships.',
    sensitive: true,
  },
  'meaning-faith-and-existential-questions': {
    slug: 'meaning-faith-and-existential-questions',
    intro:
      'Meaning, faith, and existential questions arise when the usual answers about purpose or belief stop feeling sufficient. This topic covers spiritual doubt, existential crisis, and the search for purpose that many people encounter at some point.',
    indexable: true,
    startHereSlugs: [
      'what-is-existentialism-and-can-it-help-when-life-feels-meaningless',
      'is-it-normal-to-grieve-the-loss-of-my-faith-like-a-death',
      'can-life-be-meaningful-without-believing-in-god',
      'is-it-okay-if-i-never-find-a-single-life-purpose',
    ],
  },
  'general-mental-health': {
    slug: 'general-mental-health',
    intro:
      "This is a broad, internal collection of everyday mental-health questions that do not yet fit neatly into one of our more specific topics, spanning emotional regulation, life transitions, and general psychoeducation. Some answers here may be reorganized under a more specific topic over time, so treat this as a general reference rather than a definitive guide to any one concern.",
    sensitive: true,
  },
};

const fallbackIntro = (name: string) =>
  `Answers about ${name.toLowerCase()}, part of the Deeper Global canonical topic map.`;

export function getTopicContent(slug: string, name: string): TopicContentEntry {
  return (
    topicContent[slug] ?? {
      slug,
      intro: fallbackIntro(name),
    }
  );
}

/**
 * Hub precedence: a curated hub (e.g. /anxiety/, /adhd/) is the canonical indexable
 * surface for its topic, so the corresponding /topics/{slug}/ page must stay noindex.
 * Fails the build if this invariant is ever violated.
 */
function assertHubPrecedence(content: Record<string, TopicContentEntry>) {
  for (const entry of Object.values(content)) {
    if (entry.indexable && entry.curatedHubPath) {
      throw new Error(
        `topic-content.ts: "${entry.slug}" cannot be indexable while curatedHubPath is set ` +
          `(${entry.curatedHubPath}). The curated hub takes indexation precedence over its canonical topic page.`
      );
    }
  }
}

assertHubPrecedence(topicContent);

export function isTopicIndexable(slug: string): boolean {
  return Boolean(topicContent[slug]?.indexable);
}
