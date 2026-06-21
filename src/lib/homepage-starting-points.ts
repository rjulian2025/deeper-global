/**
 * Editorial mood-based entry points for the homepage sidebar.
 * Copy is intentional — do not replace with template-generated filler.
 */
export type HomepageStartingPoint = {
  label: string;
  href: string;
};

export const homepageStartingPoints: HomepageStartingPoint[] = [
  {
    label: 'Feeling overwhelmed right now',
    href: '/categories/anxiety-and-stress/',
  },
  {
    label: 'Just got a diagnosis',
    href: '/answers/how-do-i-find-a-therapist-thats-right-fo-184729-014/',
  },
  {
    label: 'Supporting someone you love',
    href: '/categories/relationships-and-communication/',
  },
  {
    label: 'Choosing the right therapy',
    href: '/modalities/',
  },
];
