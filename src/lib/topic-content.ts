export type TopicContentEntry = {
  slug: string;
  /** 2-4 sentence editorial intro. AI-drafted; needs human review before any topic page is indexed. */
  intro: string;
  /** Slugs for a "Start here" section. Only populate once a human has picked them for a topic. */
  startHereSlugs?: string[];
  /** Path to an existing curated hub this topic substantially overlaps with. */
  curatedHubPath?: string;
  /** Marks topics that warrant an extra crisis/support note in the trust strip. */
  sensitive?: boolean;
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
  },
  depression: {
    slug: 'depression',
    intro:
      'Depression can show up as low mood, numbness, fatigue, or a loss of interest in things that used to matter. These answers explore common depression symptoms, what tends to help, and when it may be time to involve a professional.',
    sensitive: true,
  },
  'addiction-and-recovery': {
    slug: 'addiction-and-recovery',
    intro:
      'Addiction and recovery questions cover substance use, relapse, cravings, and the day-to-day work of staying sober. This topic brings together answers for people early in recovery and for those supporting someone else through it.',
    sensitive: true,
  },
  'trauma-and-safety': {
    slug: 'trauma-and-safety',
    intro:
      'Trauma changes how safe the world can feel, sometimes long after the original event has passed. These answers address triggers, flashbacks, and rebuilding a sense of safety, drawing on trauma-informed approaches to healing.',
    sensitive: true,
  },
  'therapy-and-care-navigation': {
    slug: 'therapy-and-care-navigation',
    intro:
      'Finding the right kind of professional support can be its own challenge. This topic covers how therapy works, what different treatment options involve, and how to navigate access to mental health care.',
  },
  'identity-and-self-worth': {
    slug: 'identity-and-self-worth',
    intro:
      'Questions of identity and self-worth often center on self-esteem, comparison, and the gap between who you are and who you feel you should be. These answers explore self-compassion, confidence, and letting go of the need to prove yourself.',
  },
  'relationships-and-communication': {
    slug: 'relationships-and-communication',
    intro:
      "Relationships bring some of life's deepest connection and some of its hardest conflict. This topic covers communication, boundaries, attachment patterns, and the ordinary friction of staying close to another person.",
  },
  'family-and-parenting': {
    slug: 'family-and-parenting',
    intro:
      'Family relationships and parenting bring their own patterns, expectations, and sources of friction across every stage of life. These answers address parent-child dynamics, sibling relationships, and the family boundaries people navigate as adults.',
  },
  'grief-and-loss': {
    slug: 'grief-and-loss',
    intro:
      "Grief and loss are natural responses to something ending, whether that's a death, a relationship, or a major life change. This topic gathers answers about mourning, complicated grief, and finding a way through loss at your own pace.",
  },
  'work-and-burnout': {
    slug: 'work-and-burnout',
    intro:
      'Work and burnout questions cover the stress, exhaustion, and loss of purpose that can build up in a job or career. This topic addresses workplace pressure, work-life balance, and recognizing the line between normal stress and burnout.',
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
  },
  'neurodivergence-and-attention': {
    slug: 'neurodivergence-and-attention',
    intro:
      'Neurodivergence and attention questions cover ADHD, autism, and how a differently wired brain interacts with daily life, work, and relationships. This topic focuses on executive function, focus, and practical day-to-day strategies.',
    curatedHubPath: '/adhd/',
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
  },
  'general-mental-health': {
    slug: 'general-mental-health',
    intro:
      "This topic gathers mental health questions that span everyday emotional regulation, physical health connections, and how modern life, including AI tools and social media, intersects with mental well-being. It's a broader collection for questions that do not fit neatly into a single specialty area.",
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
