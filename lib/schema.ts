// Comprehensive Schema.org structured data library for Deeper Global
// Mental health entity mapping and enhanced semantic annotations

export interface MentalHealthEntity {
  name: string
  url: string
  type: string
  description?: string
}

// Core mental health entities mapped to authoritative sources
export const MENTAL_HEALTH_ENTITIES: Record<string, MentalHealthEntity> = {
  // Core conditions
  'anxiety': {
    name: 'Anxiety disorder',
    url: 'https://en.wikipedia.org/wiki/Anxiety_disorder',
    type: 'MedicalCondition',
    description: 'A group of mental disorders characterized by significant feelings of anxiety and fear'
  },
  'depression': {
    name: 'Major depressive disorder',
    url: 'https://en.wikipedia.org/wiki/Major_depressive_disorder',
    type: 'MedicalCondition',
    description: 'A mental disorder characterized by at least two weeks of pervasive low mood'
  },
  'ptsd': {
    name: 'Post-traumatic stress disorder',
    url: 'https://en.wikipedia.org/wiki/Post-traumatic_stress_disorder',
    type: 'MedicalCondition',
    description: 'A mental disorder that can develop after exposure to a traumatic event'
  },
  'ocd': {
    name: 'Obsessive-compulsive disorder',
    url: 'https://en.wikipedia.org/wiki/Obsessive%E2%80%93compulsive_disorder',
    type: 'MedicalCondition',
    description: 'A mental disorder characterized by intrusive thoughts and repetitive behaviors'
  },
  'bipolar': {
    name: 'Bipolar disorder',
    url: 'https://en.wikipedia.org/wiki/Bipolar_disorder',
    type: 'MedicalCondition',
    description: 'A mental disorder characterized by periods of depression and elevated mood'
  },
  'adhd': {
    name: 'Attention deficit hyperactivity disorder',
    url: 'https://en.wikipedia.org/wiki/Attention_deficit_hyperactivity_disorder',
    type: 'MedicalCondition',
    description: 'A neurodevelopmental disorder characterized by inattention and hyperactivity'
  },
  'autism': {
    name: 'Autism spectrum disorder',
    url: 'https://en.wikipedia.org/wiki/Autism_spectrum',
    type: 'MedicalCondition',
    description: 'A neurodevelopmental disorder characterized by difficulties in social interaction'
  },
  'eating-disorders': {
    name: 'Eating disorder',
    url: 'https://en.wikipedia.org/wiki/Eating_disorder',
    type: 'MedicalCondition',
    description: 'Mental disorders defined by abnormal eating habits that negatively affect physical or mental health'
  },
  'substance-abuse': {
    name: 'Substance use disorder',
    url: 'https://en.wikipedia.org/wiki/Substance_use_disorder',
    type: 'MedicalCondition',
    description: 'A condition in which the use of one or more substances leads to clinically significant impairment'
  },
  'schizophrenia': {
    name: 'Schizophrenia',
    url: 'https://en.wikipedia.org/wiki/Schizophrenia',
    type: 'MedicalCondition',
    description: 'A mental disorder characterized by abnormal behavior and a decreased ability to understand reality'
  },

  // Therapies and treatments
  'therapy': {
    name: 'Psychotherapy',
    url: 'https://en.wikipedia.org/wiki/Psychotherapy',
    type: 'MedicalTherapy',
    description: 'The use of psychological methods to help a person change behavior and overcome problems'
  },
  'cbt': {
    name: 'Cognitive behavioral therapy',
    url: 'https://en.wikipedia.org/wiki/Cognitive_behavioral_therapy',
    type: 'MedicalTherapy',
    description: 'A psycho-social intervention that aims to improve mental health'
  },
  'dbt': {
    name: 'Dialectical behavior therapy',
    url: 'https://en.wikipedia.org/wiki/Dialectical_behavior_therapy',
    type: 'MedicalTherapy',
    description: 'A type of cognitive behavioral therapy for treating personality disorders'
  },
  'medication': {
    name: 'Psychiatric medication',
    url: 'https://en.wikipedia.org/wiki/Psychiatric_medication',
    type: 'Drug',
    description: 'Medications used to treat mental disorders'
  },
  'mindfulness': {
    name: 'Mindfulness',
    url: 'https://en.wikipedia.org/wiki/Mindfulness',
    type: 'MedicalTherapy',
    description: 'The practice of purposely focusing attention on the present moment'
  },
  'meditation': {
    name: 'Meditation',
    url: 'https://en.wikipedia.org/wiki/Meditation',
    type: 'MedicalTherapy',
    description: 'A practice where an individual uses a technique to focus attention'
  },

  // Mental health concepts
  'self-care': {
    name: 'Self-care',
    url: 'https://en.wikipedia.org/wiki/Self-care',
    type: 'Thing',
    description: 'The practice of taking action to preserve or improve one\'s own health'
  },
  'mental-health': {
    name: 'Mental health',
    url: 'https://en.wikipedia.org/wiki/Mental_health',
    type: 'Thing',
    description: 'A level of psychological well-being or an absence of mental illness'
  },
  'wellness': {
    name: 'Wellness',
    url: 'https://en.wikipedia.org/wiki/Wellness_(alternative_medicine)',
    type: 'Thing',
    description: 'An active process of becoming aware of and making choices toward a healthy and fulfilling life'
  },
  'resilience': {
    name: 'Psychological resilience',
    url: 'https://en.wikipedia.org/wiki/Psychological_resilience',
    type: 'Thing',
    description: 'The ability to mentally or emotionally cope with a crisis or to return to pre-crisis status quickly'
  },
  'stress': {
    name: 'Psychological stress',
    url: 'https://en.wikipedia.org/wiki/Psychological_stress',
    type: 'MedicalCondition',
    description: 'A feeling of emotional or physical tension'
  },
  'burnout': {
    name: 'Occupational burnout',
    url: 'https://en.wikipedia.org/wiki/Occupational_burnout',
    type: 'MedicalCondition',
    description: 'A state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress'
  },

  // Relationships and social
  'relationships': {
    name: 'Interpersonal relationship',
    url: 'https://en.wikipedia.org/wiki/Interpersonal_relationship',
    type: 'Thing',
    description: 'A strong, deep, or close association or acquaintance between two or more people'
  },
  'communication': {
    name: 'Communication',
    url: 'https://en.wikipedia.org/wiki/Communication',
    type: 'Thing',
    description: 'The act of conveying meanings from one entity or group to another'
  },
  'boundaries': {
    name: 'Personal boundaries',
    url: 'https://en.wikipedia.org/wiki/Personal_boundaries',
    type: 'Thing',
    description: 'Guidelines, rules or limits that a person creates to identify reasonable, safe and permissible ways'
  },
  'attachment': {
    name: 'Attachment theory',
    url: 'https://en.wikipedia.org/wiki/Attachment_theory',
    type: 'Thing',
    description: 'A psychological, evolutionary and ethological theory concerning relationships between humans'
  },

  // Life stages and transitions
  'adolescence': {
    name: 'Adolescence',
    url: 'https://en.wikipedia.org/wiki/Adolescence',
    type: 'Thing',
    description: 'A transitional stage of physical and psychological development'
  },
  'adulthood': {
    name: 'Adult',
    url: 'https://en.wikipedia.org/wiki/Adult',
    type: 'Thing',
    description: 'A human or other organism that has reached sexual maturity'
  },
  'aging': {
    name: 'Ageing',
    url: 'https://en.wikipedia.org/wiki/Ageing',
    type: 'Thing',
    description: 'The process of becoming older'
  },
  'grief': {
    name: 'Grief',
    url: 'https://en.wikipedia.org/wiki/Grief',
    type: 'MedicalCondition',
    description: 'The response to loss, particularly to the loss of someone or something that has died'
  },
  'trauma': {
    name: 'Psychological trauma',
    url: 'https://en.wikipedia.org/wiki/Psychological_trauma',
    type: 'MedicalCondition',
    description: 'Damage to the mind that occurs as a result of a distressing event'
  }
}

// Deeper Global organization schema
export const DEEPER_GLOBAL_ORGANIZATION = {
  '@type': 'Organization',
  '@id': 'https://deeper.global/#organization',
  name: 'Deeper Global',
  url: 'https://deeper.global',
  logo: 'https://deeper.global/logo.png',
  description: 'Evidence-informed mental health answers for humans and machines',
  foundingDate: '2024',
  sameAs: [
    'https://twitter.com/deeperglobal',
    'https://linkedin.com/company/deeperglobal',
    'https://github.com/deeperglobal'
  ],
  knowsAbout: Object.values(MENTAL_HEALTH_ENTITIES).map(entity => entity.url),
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://deeper.global/answers?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
}

// Enhanced Q&A page schema with entity linking
export function generateQuestionSchema(question: any, relatedQuestions: any[] = []) {
  const entities = extractEntities(question.question + ' ' + (question.short_answer || '') + ' ' + (question.answer || ''))
  
  // If we have related questions, use FAQPage schema
  if (relatedQuestions.length > 0) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `https://deeper.global/answers/${question.slug}`,
      mainEntity: [
        {
          '@type': 'Question',
          '@id': `https://deeper.global/answers/${question.slug}#question`,
          name: question.question,
          text: question.question,
          dateCreated: question.created_at,
          dateModified: question.updated_at,
          author: DEEPER_GLOBAL_ORGANIZATION,
          about: entities.map(entity => ({
            '@type': entity.type,
            name: entity.name,
            url: entity.url
          })),
          acceptedAnswer: {
            '@type': 'Answer',
            '@id': `https://deeper.global/answers/${question.slug}#answer`,
            text: question.answer || question.short_answer,
            dateCreated: question.created_at,
            dateModified: question.updated_at,
            author: DEEPER_GLOBAL_ORGANIZATION,
            about: entities.map(entity => ({
              '@type': entity.type,
              name: entity.name,
              url: entity.url
            }))
          }
        },
        ...relatedQuestions.map((related, index) => ({
          '@type': 'Question',
          '@id': `https://deeper.global/answers/${question.slug}#related-${index}`,
          name: related.question,
          text: related.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: related.short_answer,
            author: DEEPER_GLOBAL_ORGANIZATION
          }
        }))
      ],
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://deeper.global'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Answers',
            item: 'https://deeper.global/answers'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: question.category || 'Mental Health',
            item: `https://deeper.global/categories/${encodeURIComponent(question.category || 'mental-health')}`
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: question.question
          }
        ]
      },
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://deeper.global/#website',
        name: 'Deeper Global',
        url: 'https://deeper.global',
        publisher: DEEPER_GLOBAL_ORGANIZATION
      }
    }
  }
  
  // Otherwise use QAPage schema
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    '@id': `https://deeper.global/answers/${question.slug}`,
    mainEntity: {
      '@type': 'Question',
      '@id': `https://deeper.global/answers/${question.slug}#question`,
      name: question.question,
      text: question.question,
      dateCreated: question.created_at,
      dateModified: question.updated_at,
      author: DEEPER_GLOBAL_ORGANIZATION,
      about: entities.map(entity => ({
        '@type': entity.type,
        name: entity.name,
        url: entity.url
      })),
      acceptedAnswer: {
        '@type': 'Answer',
        '@id': `https://deeper.global/answers/${question.slug}#answer`,
        text: question.answer || question.short_answer,
        dateCreated: question.created_at,
        dateModified: question.updated_at,
        author: DEEPER_GLOBAL_ORGANIZATION,
        about: entities.map(entity => ({
          '@type': entity.type,
          name: entity.name,
          url: entity.url
        }))
      }
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://deeper.global'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Answers',
          item: 'https://deeper.global/answers'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: question.category || 'Mental Health',
          item: `https://deeper.global/categories/${encodeURIComponent(question.category || 'mental-health')}`
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: question.question
        }
      ]
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://deeper.global/#website',
      name: 'Deeper Global',
      url: 'https://deeper.global',
      publisher: DEEPER_GLOBAL_ORGANIZATION
    }
  }
}

// Enhanced category/cluster page schema
export function generateCategorySchema(category: string, questions: any[], totalCount: number) {
  const categoryEntity = MENTAL_HEALTH_ENTITIES[category.toLowerCase()] || {
    name: category,
    url: `https://deeper.global/categories/${encodeURIComponent(category)}`,
    type: 'Thing'
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://deeper.global/categories/${encodeURIComponent(category)}`,
    name: `${category} Questions`,
    description: `Mental health questions and answers in the ${category} category`,
    url: `https://deeper.global/categories/${encodeURIComponent(category)}`,
    about: [{
      '@type': categoryEntity.type,
      name: categoryEntity.name,
      url: categoryEntity.url
    }],
    mainEntity: {
      '@type': 'ItemList',
      name: `${category} Questions`,
      numberOfItems: totalCount,
      itemListElement: questions.slice(0, 20).map((question, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Question',
          '@id': `https://deeper.global/answers/${question.slug}`,
          name: question.question,
          url: `https://deeper.global/answers/${question.slug}`,
          author: DEEPER_GLOBAL_ORGANIZATION
        }
      }))
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://deeper.global'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Answers',
          item: 'https://deeper.global/answers'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category
        }
      ]
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://deeper.global/#website',
      name: 'Deeper Global',
      url: 'https://deeper.global',
      publisher: DEEPER_GLOBAL_ORGANIZATION
    }
  }
}

// Homepage schema with organization and search
export function generateHomepageSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      DEEPER_GLOBAL_ORGANIZATION,
      {
        '@type': 'WebSite',
        '@id': 'https://deeper.global/#website',
        name: 'Deeper Global',
        url: 'https://deeper.global',
        description: 'Evidence-informed mental health answers for humans and machines',
        publisher: DEEPER_GLOBAL_ORGANIZATION,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://deeper.global/answers?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': 'https://deeper.global/#webpage',
        name: 'Deeper Global - Mental Health Answers',
        description: '1,000+ evidence-informed answers for humans and machines',
        url: 'https://deeper.global',
        isPartOf: {
          '@id': 'https://deeper.global/#website'
        },
        about: Object.values(MENTAL_HEALTH_ENTITIES).slice(0, 10).map(entity => ({
          '@type': entity.type,
          name: entity.name,
          url: entity.url
        })),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home'
            }
          ]
        }
      }
    ]
  }
}

// Extract entities from text content
function extractEntities(text: string): MentalHealthEntity[] {
  const entities: MentalHealthEntity[] = []
  const lowerText = text.toLowerCase()
  
  for (const [key, entity] of Object.entries(MENTAL_HEALTH_ENTITIES)) {
    if (lowerText.includes(key.toLowerCase()) || 
        lowerText.includes(entity.name.toLowerCase())) {
      entities.push(entity)
    }
  }
  
  return entities.slice(0, 5) // Limit to top 5 most relevant entities
}

// Generate entity links for HTML content
export function generateEntityLinks(text: string): { text: string; links: Array<{ term: string; url: string; name: string }> } {
  const links: Array<{ term: string; url: string; name: string }> = []
  let processedText = text
  
  for (const [key, entity] of Object.entries(MENTAL_HEALTH_ENTITIES)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi')
    if (regex.test(processedText)) {
      links.push({
        term: key,
        url: entity.url,
        name: entity.name
      })
      // Replace first occurrence with link
      processedText = processedText.replace(regex, `<a href="${entity.url}" target="_blank" rel="noopener noreferrer">${entity.name}</a>`)
    }
  }
  
  return { text: processedText, links }
}
