import { alexCrenshawPhd } from '@/data/authorities/alex-crenshaw-phd';
import { siteUrl } from '@/lib/site';
import type { Question } from '@/lib/supabase';

export type ServiceFitCard = {
  id: string;
  label: string;
  description: string;
  destinationUrl: string;
  destinationLabel: string;
  specialty: string;
  isExternal?: boolean;
  isPhone?: boolean;
};

export type ExpertiseDomain = {
  id: string;
  label: string;
  description: string;
};

export type ServiceOffering = {
  name: string;
  price: string;
  description: string;
  href: string;
};

export type ReviewedContentGroup = {
  name: string;
  slugs: string[];
};

export type ClinicalPerspective = {
  id: string;
  text: string;
};

export type DiagnosticJourneyStep = {
  title: string;
  description: string;
};

export type AuthorityVideoModule = {
  title: string;
  subtitle: string;
  statusLabel: string;
  previewBullets: string[];
  metadataTags: string[];
};

export type WhyDrCrenshawCard = {
  title: string;
  description: string;
};

export type ReferralLink = {
  label: string;
  href: string;
  description?: string;
  isSecondary?: boolean;
};

export type AuthorityProfile = {
  slug: string;
  reviewerId: string;
  name: string;
  credentials: string;
  displayName: string;
  designation: string;
  role: string;
  academicAffiliation: string;
  practiceName: string;
  practiceUrl: string;
  practiceProfilePath: string;
  phone: string;
  phoneTel: string;
  location: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  testingNote: string;
  insuranceNote: string;
  image: string;
  imageAlt: string;
  bio: string;
  overviewParagraphs: string[];
  expertiseDomains: ExpertiseDomain[];
  modalities: string[];
  affiliations: string[];
  knowsAbout: string[];
  serviceOfferings: ServiceOffering[];
  serviceFitCards: ServiceFitCard[];
  reviewedContentGroups: ReviewedContentGroup[];
  referralLinks: ReferralLink[];
  hubConnections: {
    hubPath: string;
    hubLabel: string;
    summary: string;
  };
  videoModule: AuthorityVideoModule;
  clinicalPerspectives: ClinicalPerspective[];
  whyDrCrenshaw: {
    title: string;
    lede: string;
    cards: WhyDrCrenshawCard[];
  };
  diagnosticJourney: {
    title: string;
    steps: DiagnosticJourneyStep[];
    cta: {
      label: string;
      href: string;
    };
  };
  knowledgeNetwork: {
    title: string;
    description: string;
    valueExplanation: string;
    ctaLabel: string;
  };
  reviewedKnowledgeTitle: string;
  reviewedKnowledgeIntro: string;
  referralPrimaryCta: {
    label: string;
    href: string;
  };
  expertiseSectionTitle: string;
  disclaimers: string[];
  sameAs: string[];
};

export type ReviewedGroupCount = {
  name: string;
  count: number;
};

const authorityProfiles: AuthorityProfile[] = [alexCrenshawPhd];

export const authorityProfilesBySlug = new Map(authorityProfiles.map((profile) => [profile.slug, profile]));
export const authorityProfilesByReviewerId = new Map(
  authorityProfiles.map((profile) => [profile.reviewerId, profile])
);

const reviewedSlugToAuthority = new Map<string, AuthorityProfile>();
for (const profile of authorityProfiles) {
  for (const group of profile.reviewedContentGroups) {
    for (const slug of group.slugs) {
      reviewedSlugToAuthority.set(slug, profile);
    }
  }
}

export function getAuthorityProfile(slug: string): AuthorityProfile | undefined {
  return authorityProfilesBySlug.get(slug);
}

export function getAuthorityByReviewerId(reviewerId: string): AuthorityProfile | undefined {
  const normalized = reviewerId.toLowerCase().trim();
  return (
    authorityProfilesByReviewerId.get(normalized) ??
    authorityProfilesByReviewerId.get(normalized.replace(/\s+/g, '-'))
  );
}

export function getAuthorityForAnswer(question: Question): AuthorityProfile | undefined {
  const reviewedBy = question.reviewed_by?.trim();
  if (reviewedBy) {
    const byReviewer = getAuthorityByReviewerId(reviewedBy);
    if (byReviewer) return byReviewer;
  }
  return reviewedSlugToAuthority.get(question.slug);
}

export function authorityPath(slug: string): string {
  return `/authorities/${slug}/`;
}

export function authorityUrl(slug: string): string {
  return siteUrl(authorityPath(slug));
}

export function buildAuthorityJsonLd(profile: AuthorityProfile) {
  const pageUrl = authorityUrl(profile.slug);
  const personId = `${pageUrl}#person`;

  return {
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#profilepage`,
        url: pageUrl,
        name: `${profile.displayName} — Clinical Authority Profile`,
        description: profile.designation,
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: profile.name,
        honorificPrefix: 'Dr.',
        honorificSuffix: profile.credentials,
        jobTitle: profile.role,
        description: profile.bio,
        image: siteUrl(profile.image),
        url: pageUrl,
        telephone: profile.phoneTel.replace('tel:', ''),
        knowsAbout: profile.knowsAbout,
        affiliation: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Kennesaw State University',
          },
          {
            '@type': 'MedicalBusiness',
            name: profile.practiceName,
            url: profile.practiceUrl,
          },
        ],
        worksFor: {
          '@type': 'MedicalBusiness',
          name: profile.practiceName,
          url: profile.practiceUrl,
        },
        sameAs: profile.sameAs,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Deeper Global', item: siteUrl() },
          { '@type': 'ListItem', position: 2, name: 'Clinical Authorities', item: siteUrl('/authorities/') },
          { '@type': 'ListItem', position: 3, name: profile.displayName, item: pageUrl },
        ],
      },
    ],
  };
}

export function getReviewedGroupCounts(profile: AuthorityProfile): ReviewedGroupCount[] {
  return profile.reviewedContentGroups.map((group) => ({
    name: group.name,
    count: group.slugs.length,
  }));
}

export function getResolvedReviewedGroupCounts(
  profile: AuthorityProfile,
  questionsBySlug: Map<string, Question>
): ReviewedGroupCount[] {
  return profile.reviewedContentGroups.map((group) => ({
    name: group.name,
    count: group.slugs.filter((slug) => questionsBySlug.has(slug)).length,
  }));
}

export function getResolvedUniqueReviewedCount(
  profile: AuthorityProfile,
  questionsBySlug: Map<string, Question>
): number {
  const slugs = new Set<string>();
  for (const group of profile.reviewedContentGroups) {
    for (const slug of group.slugs) {
      if (questionsBySlug.has(slug)) slugs.add(slug);
    }
  }
  return slugs.size;
}

export function getUniqueReviewedSlugCount(profile: AuthorityProfile): number {
  const slugs = new Set<string>();
  for (const group of profile.reviewedContentGroups) {
    for (const slug of group.slugs) slugs.add(slug);
  }
  return slugs.size;
}

export function authorityToTrustAdapter(profile: AuthorityProfile) {
  return {
    id: profile.reviewerId,
    slug: profile.slug,
    name: profile.displayName,
    specialtyLabel: profile.designation,
    credentialLine: `${profile.role} · ${profile.academicAffiliation}`,
    bio: profile.bio,
    expertiseTags: profile.knowsAbout,
    disclaimer: 'Clinical review is educational and does not create a therapist-client relationship.',
    sameAs: profile.sameAs,
    url: authorityPath(profile.slug),
    isAuthority: true as const,
  };
}

export type AuthorityTrustProfile = ReturnType<typeof authorityToTrustAdapter>;
