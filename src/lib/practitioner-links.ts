export const DEEPER_WEBSITES_BASE = 'https://deeperwebsites.com';

export type PractitionerLink = {
  href: string;
  label: string;
  title: string;
  body: string;
};

/** Contextual practitioner callouts on entity hub pages. */
export const entityPractitionerLinks: Record<string, PractitionerLink> = {
  'anxiety-and-stress': {
    href: `${DEEPER_WEBSITES_BASE}/website-design-for-therapists/`,
    label: 'how therapist website design builds trust for anxiety seekers',
    title: 'For practitioners',
    body:
      'People researching anxiety often evaluate fit online before they book. Private practices need sites that answer those questions with clarity and calm, not generic wellness copy.',
  },
  'therapy-navigation': {
    href: `${DEEPER_WEBSITES_BASE}/website-design-for-therapists/`,
    label: 'website design for therapists',
    title: 'For practitioners',
    body:
      'Clients arrive here with navigation questions. Your practice website should answer the same questions with specificity: fees, fit, location, and what happens next.',
  },
  'therapy-and-mental-health': {
    href: `${DEEPER_WEBSITES_BASE}/website-design-for-therapists/`,
    label: 'psychologically informed therapist websites',
    title: 'For practitioners',
    body:
      'When someone is choosing care, your site is often the first relationship they have with your practice. Design is trust infrastructure, not decoration.',
  },
  'social-anxiety': {
    href: `${DEEPER_WEBSITES_BASE}/website-design-for-therapists/`,
    label: 'therapist websites that reduce hesitation for socially anxious clients',
    title: 'For practitioners',
    body:
      'Low-pressure pacing, plain language, and clear next steps matter doubly for socially anxious clients. Your site should model the safety you offer in session.',
  },
  'work-and-burnout': {
    href: `${DEEPER_WEBSITES_BASE}/website-design-for-therapists/`,
    label: 'practice websites for burnout-focused therapists',
    title: 'For practitioners',
    body:
      'Clinicians treating burnout while running full caseloads need websites that pre-qualify fit, so inquiries match the work you actually want to do.',
  },
  'mental-health-access': {
    href: `${DEEPER_WEBSITES_BASE}/how-to-choose-a-therapist-website-designer/`,
    label: 'how to choose a therapist website designer',
    title: 'For private practice owners',
    body:
      'Access starts with being findable. When you invest in a practice website, evaluate providers on positioning strategy and citability, not just aesthetics.',
  },
  'general-mental-health': {
    href: `${DEEPER_WEBSITES_BASE}/how-to-choose-a-therapist-website-designer/`,
    label: 'choosing a web designer for private practice',
    title: 'For clinicians and coaches',
    body:
      'If you are building a referral-ready presence, use an honest framework to compare template platforms, agencies, and specialist studios before you hire.',
  },
  'identity-and-self-worth': {
    href: `${DEEPER_WEBSITES_BASE}/how-to-choose-a-therapist-website-designer/`,
    label: 'honest checklist for hiring a therapy website studio',
    title: 'For practitioners',
    body:
      'Serving identity and self-worth in session is clinical work. Choosing a web partner is a separate decision, one that affects who finds you and how accurately you are represented online.',
  },
};

/** Sidebar callouts on individual answer pages. */
export const answerPractitionerLinks: Record<string, PractitionerLink> = {
  'how-do-i-find-a-therapist-thats-right-fo-184729-014': {
    href: `${DEEPER_WEBSITES_BASE}/website-design-for-therapists/`,
    label: 'what a therapist website must include before you book',
    title: 'If you are a clinician',
    body:
      'Clients use the same signals described here to evaluate your site. Service-page architecture, fees clarity, and calm CTAs are part of how fit gets decided before the first call.',
  },
  'what-do-i-do-if-i-cant-afford-therapy-185759-045': {
    href: `${DEEPER_WEBSITES_BASE}/how-to-choose-a-therapist-website-designer/`,
    label: 'evaluation framework for therapist website providers',
    title: 'For private practice owners',
    body:
      'Directories and platforms are channels, not a substitute for a site you control. When you hire a web partner, ask how they will help the right clients recognize themselves and reach out.',
  },
};

export function getEntityPractitionerLink(slug: string) {
  return entityPractitionerLinks[slug];
}

export function getAnswerPractitionerLink(slug: string) {
  return answerPractitionerLinks[slug];
}
