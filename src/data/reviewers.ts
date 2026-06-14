export type ReviewerProfile = {
  id: string;
  slug: string;
  name: string;
  specialtyLabel: string;
  credentialLine: string;
  bio: string;
  expertiseTags: string[];
  disclaimer: string;
  sameAs: string[];
  url: string;
};

export const reviewerProfiles: ReviewerProfile[] = [
  {
    id: 'david-k-gore-phd',
    slug: 'david-k-gore-phd',
    name: 'David K. Gore, PhD',
    specialtyLabel: 'Addiction & Recovery',
    credentialLine: 'Licensed psychologist · 40+ years clinical experience',
    bio: 'David K. Gore, PhD is a licensed psychologist with more than four decades of clinical experience. He reviews selected Deeper Global answers related to addiction, recovery, substance use, and related care navigation.',
    expertiseTags: [
      'addiction',
      'substance use',
      'recovery',
      'relapse prevention',
      'sobriety',
      'family impact of addiction',
    ],
    disclaimer: 'Clinical review is educational and does not create a therapist-client relationship.',
    sameAs: [],
    url: '/reviewers/david-k-gore-phd/',
  },
  {
    id: 'kenneth-w-christian-phd',
    slug: 'kenneth-w-christian-phd',
    name: 'Kenneth W. Christian, PhD',
    specialtyLabel: 'Performance, Purpose & Self-Limiting Patterns',
    credentialLine: 'Performance, Purpose & Self-Limiting Patterns',
    bio: 'Kenneth W. Christian, PhD is a psychologist and performance psychology specialist whose work focuses on underachievement, self-limiting behavior, procrastination, perfectionism, and the psychological barriers that keep capable people from acting on their potential. He is the author of Your Own Worst Enemy: Breaking the Habit of Adult Underachievement.',
    expertiseTags: [
      'underachievement',
      'self-limiting behavior',
      'procrastination',
      'perfectionism',
      'imposter syndrome',
      'career stuckness',
      'purpose and motivation',
      'achievement anxiety',
      'self-worth tied to success',
    ],
    disclaimer: 'Clinical review is educational and does not create a therapist-client relationship.',
    sameAs: [],
    url: '/reviewers/kenneth-w-christian-phd/',
  },
];

export const reviewerProfilesById = new Map(reviewerProfiles.map((profile) => [profile.id, profile]));

export const reviewerProfilesBySlug = new Map(reviewerProfiles.map((profile) => [profile.slug, profile]));
