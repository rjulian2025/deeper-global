// Link rewriting utility to replace Wikipedia links with internal category routes
// Maps known mental health categories to internal routes for better user experience

export const categoryMap: Record<string, string> = {
  // Core conditions
  "Anxiety disorder": "/categories/Anxiety%20%26%20Stress",
  "Major depressive disorder": "/categories/Depression",
  "Depression": "/categories/Depression",
  "Post-traumatic stress disorder": "/categories/Trauma%20%26%20Grief",
  "Obsessive-compulsive disorder": "/categories/Intrusive%20Thoughts",
  "Bipolar disorder": "/categories/Depression",
  "Attention deficit hyperactivity disorder": "/categories/General%20Mental%20Health",
  "Autism spectrum disorder": "/categories/General%20Mental%20Health",
  "Eating disorder": "/categories/General%20Mental%20Health",
  "Substance use disorder": "/categories/Addiction%20%26%20Recovery",
  "Schizophrenia": "/categories/General%20Mental%20Health",
  
  // Therapies and treatments
  "Psychotherapy": "/categories/Therapy%20%26%20Mental%20Health",
  "Cognitive behavioral therapy": "/categories/Therapy%20%26%20Mental%20Health",
  "Dialectical behavior therapy": "/categories/Therapy%20%26%20Mental%20Health",
  "Psychiatric medication": "/categories/Mental%20Health%20Treatment",
  "Mindfulness": "/categories/Anxiety%20Management",
  "Meditation": "/categories/Anxiety%20Management",
  
  // Mental health concepts
  "Self-care": "/categories/Self-Compassion",
  "Mental health": "/categories/General%20Mental%20Health",
  "Wellness": "/categories/General%20Mental%20Health",
  "Psychological resilience": "/categories/Self-Actualization",
  "Psychological stress": "/categories/Anxiety%20%26%20Stress",
  "Occupational burnout": "/categories/Work%20%26%20Burnout",
  
  // Relationships and social
  "Interpersonal relationship": "/categories/Relationships",
  "Communication": "/categories/Communication%20%26%20Conflict",
  "Personal boundaries": "/categories/Family%20Boundaries",
  "Attachment theory": "/categories/Attachment%20Styles%20%26%20Relationship%20Dynamics",
  
  // Life stages and transitions
  "Adolescence": "/categories/Teens%20%26%20Identity",
  "Adult": "/categories/Life%20Transitions",
  "Ageing": "/categories/Life%20Transitions",
  "Grief": "/categories/Grief%20%26%20Loss",
  "Psychological trauma": "/categories/Trauma%20%26%20Grief",
  
  // Additional mappings for common variations
  "Anxiety": "/categories/Anxiety%20%26%20Stress",
  "Stress": "/categories/Anxiety%20%26%20Stress",
  "Worry": "/categories/Anxiety%20%26%20Worry",
  "Therapy": "/categories/Therapy%20%26%20Mental%20Health",
  "CBT": "/categories/Therapy%20%26%20Mental%20Health",
  "DBT": "/categories/Therapy%20%26%20Mental%20Health",
  "Medication": "/categories/Mental%20Health%20Treatment",
  "Burnout": "/categories/Work%20%26%20Burnout",
  "Relationships": "/categories/Relationships",
  "Parenting": "/categories/Parenting",
  "Family": "/categories/Family%20%26%20Parenting",
  "Work": "/categories/Work%20%26%20Life%20Balance",
  "Career": "/categories/Career%20%26%20Purpose",
  "Identity": "/categories/Identity%20%26%20Self-Worth",
  "Self-worth": "/categories/Self-Worth",
  "Self-compassion": "/categories/Self-Compassion",
  "Loneliness": "/categories/Loneliness%20%26%20Isolation",
  "Isolation": "/categories/Loneliness%20%26%20Isolation",
  "Social anxiety": "/categories/Social%20Anxiety",
  "Social connection": "/categories/Social%20Connection",
  "Social belonging": "/categories/Social%20Belonging",
  "Social media": "/categories/Social%20Media",
  "Workplace": "/categories/Workplace",
  "Workplace mental health": "/categories/Workplace%20Mental%20Health",
  "Work stress": "/categories/Work%2C%20Stress%20%26%20Burnout",
  "Life purpose": "/categories/Life%20Purpose",
  "Life transitions": "/categories/Life%20Transitions",
  "Life comparison": "/categories/Life%20Comparison",
  "Existential": "/categories/Existential",
  "Spiritual doubt": "/categories/Spiritual%20Doubt",
  "Spiritual struggle": "/categories/Spiritual%20Struggle%20%2F%20Existential%20Crisis",
  "Gender identity": "/categories/Gender%20Identity",
  "Gender and sexuality": "/categories/Gender%20%26%20Sexuality",
  "Sexuality": "/categories/Sexuality%2C%20Gender%20Identity%2C%20and%20Intimacy",
  "Intimacy": "/categories/Sexuality%2C%20Gender%20Identity%2C%20and%20Intimacy",
  "Codependency": "/categories/Codependency",
  "People pleasing": "/categories/People%20Pleasing",
  "Perfectionism": "/categories/Perfectionism%20%26%20Control%20Issues",
  "Control issues": "/categories/Perfectionism%20%26%20Control%20Issues",
  "Anger": "/categories/Anger%20%26%20Emotional%20Regulation",
  "Emotional regulation": "/categories/Emotional%20Regulation",
  "Crisis support": "/categories/Crisis%20Support",
  "Current events": "/categories/Current%20Events",
  "Numbness": "/categories/Depression%20%26%20Numbness",
  "Relationship abuse": "/categories/Relationship%20Abuse",
  "Relationship balance": "/categories/Relationship%20Balance",
  "Relationship comparison": "/categories/Relationship%20Comparison",
  "Relationship identity": "/categories/Relationship%20Identity",
  "Relationship insecurity": "/categories/Relationship%20Insecurity",
  "Relationship communication": "/categories/Relationships%20%26%20Communication",
  "Divorce": "/categories/Relationships%20%26%20Divorce",
  "Family relationships": "/categories/Family%20Relationships",
  "Forgiveness": "/categories/Forgiveness",
  "Inner child": "/categories/Inner%20Child%20%26%20Parenting",
  "Money": "/categories/Money%20%26%20Self-Worth",
  "Physical health": "/categories/Physical%20Health",
  "Mental health access": "/categories/Mental%20Health%20Access",
  "Therapy navigation": "/categories/Therapy%20Navigation",
  "Triggers": "/categories/Trauma%20%26%20Triggers",
  "Teen-specific": "/categories/Teen-Specific%20Questions",
  "Teens": "/categories/Teens%20%26%20Identity"
}

/**
 * Rewrites Wikipedia links to internal category routes when possible
 * @param html - The HTML content containing links
 * @returns The HTML with rewritten links
 */
export function rewriteLinks(html: string): string {
  return html.replace(
    /<a href="https:\/\/en\.wikipedia\.org\/wiki\/([^"]+)">([^<]+)<\/a>/g, 
    (match, slug, text) => {
      const cleanText = decodeURIComponent(text).trim()
      
      // Check if we have a mapping for this text
      if (categoryMap[cleanText]) {
        return `<a href="${categoryMap[cleanText]}" class="internal-link">${cleanText}</a>`
      }
      
      // Also check the Wikipedia slug (decoded) for matches
      const decodedSlug = decodeURIComponent(slug).replace(/_/g, ' ')
      if (categoryMap[decodedSlug]) {
        return `<a href="${categoryMap[decodedSlug]}" class="internal-link">${cleanText}</a>`
      }
      
      // Keep external link if no match found
      return match
    }
  )
}

/**
 * Checks if a Wikipedia link should be rewritten to an internal route
 * @param url - The Wikipedia URL
 * @param text - The link text
 * @returns The internal route if it should be rewritten, null otherwise
 */
export function shouldRewriteLink(url: string, text: string): string | null {
  if (!url.startsWith('https://en.wikipedia.org/wiki/')) {
    return null
  }
  
  const cleanText = decodeURIComponent(text).trim()
  return categoryMap[cleanText] || null
}

/**
 * Gets all available category mappings
 * @returns Object with Wikipedia terms as keys and internal routes as values
 */
export function getCategoryMappings(): Record<string, string> {
  return { ...categoryMap }
}
