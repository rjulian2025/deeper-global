// This route previously served a separate OpenAPI document.
// The canonical spec is now /api/v1/openapi.json, which accurately reflects
// the live API. This redirect ensures existing links remain functional.

export async function GET() {
  return new Response(null, {
    status: 301,
    headers: {
      Location: '/api/v1/openapi.json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

// ——— archived spec below (no longer served) ———
import { SITE_URL } from '@/lib/site';

const _deprecatedOpenApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Deeper API',
    version: '0.1.0',
    summary: 'Structured mental health answer and topic intelligence for AI agents and developer products.',
    description:
      'Deeper API exposes reviewed, evidence-informed mental health answer metadata, topic maps, and upgrade-priority signals from Deeper Global. It is educational content infrastructure only and is not a substitute for diagnosis, treatment, crisis support, or emergency care.',
    contact: {
      name: 'Deeper Global',
      url: SITE_URL,
    },
    license: {
      name: 'Developer preview terms',
      url: `${SITE_URL}/api-terms/`,
    },
  },
  servers: [
    {
      url: SITE_URL,
      description: 'Production',
    },
  ],
  tags: [
    {
      name: 'Answer intelligence',
      description: 'Machine-readable mental health answer metadata and extracts.',
    },
    {
      name: 'Topic intelligence',
      description: 'Mental health topic maps, aliases, and representative answer coverage.',
    },
    {
      name: 'Agent discovery',
      description: 'Agent-readable context files and priority indexes.',
    },
  ],
  paths: {
    '/api/v1/answers': {
      get: {
        tags: ['Answer intelligence'],
        operationId: 'listV1Answers',
        summary: 'List reviewed Deeper Global answers',
        description:
          'Returns the canonical v1 answer inventory with slugs, titles, canonical URLs, summaries, extracts, risk classes, review metadata, source references, and upgrade-priority signals. Supports lightweight search, topic filtering, reviewed-only filtering, and offset pagination.',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: false,
            description: 'Search across title, question, summary, extract, slug, and topic text.',
            schema: { type: 'string', example: 'ADHD testing' },
          },
          {
            name: 'topic',
            in: 'query',
            required: false,
            description: 'Filter by topic/category text.',
            schema: { type: 'string', example: 'Anxiety' },
          },
          {
            name: 'reviewed',
            in: 'query',
            required: false,
            description: 'When true, return answers with reviewer metadata. When false, return answers without reviewer metadata.',
            schema: { type: 'boolean', example: true },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Maximum records to return. Defaults to 50; maximum 100.',
            schema: { type: 'integer', minimum: 0, maximum: 100, default: 50 },
          },
          {
            name: 'offset',
            in: 'query',
            required: false,
            description: 'Zero-based offset for pagination.',
            schema: { type: 'integer', minimum: 0, default: 0 },
          },
        ],
        responses: {
          '200': {
            description: 'Answer inventory',
            headers: {
              'X-RateLimit-Limit': { $ref: '#/components/headers/XRateLimitLimit' },
              'X-RateLimit-Remaining': { $ref: '#/components/headers/XRateLimitRemaining' },
              'X-RateLimit-Reset': { $ref: '#/components/headers/XRateLimitReset' },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AnswerIndexResponse',
                },
                examples: {
                  adhdSearch: {
                    summary: 'Search for ADHD testing answers',
                    value: {
                      name: 'Deeper Global Answer Index',
                      base_url: SITE_URL,
                      generated_at: '2026-06-20T00:00:00.000Z',
                      count: 1,
                      total_count: 12,
                      limit: 1,
                      offset: 0,
                      next_offset: 1,
                      clinical_boundary:
                        'Educational content only; not a substitute for diagnosis, treatment, therapy, crisis support, or emergency care.',
                      answers: [
                        {
                          slug: 'how-do-i-know-if-i-have-adhd-as-an-adult',
                          canonical_url: `${SITE_URL}/answers/how-do-i-know-if-i-have-adhd-as-an-adult/`,
                          api_url: `${SITE_URL}/api/v1/answers/how-do-i-know-if-i-have-adhd-as-an-adult`,
                          title: 'How do I know if I have ADHD as an adult?',
                          topic: 'Neurodivergence and Attention',
                          summary: 'A reviewed educational answer about adult ADHD signs and evaluation.',
                          extract: 'Adult ADHD can show up as persistent patterns with attention, organization, time, impulsivity, and emotional regulation.',
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          '429': {
            description: 'Rate limited',
            headers: {
              'Retry-After': {
                description: 'Seconds until the client should retry.',
                schema: { type: 'integer' },
              },
              'X-RateLimit-Limit': { $ref: '#/components/headers/XRateLimitLimit' },
              'X-RateLimit-Remaining': { $ref: '#/components/headers/XRateLimitRemaining' },
              'X-RateLimit-Reset': { $ref: '#/components/headers/XRateLimitReset' },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/answers/{slug}': {
      get: {
        tags: ['Answer intelligence'],
        operationId: 'getV1AnswerBySlug',
        summary: 'Get one reviewed answer by slug',
        description:
          'Returns a single answer detail record with canonical URL, API URL, summary, extract, answer sections, care note, follow-up questions, risk class, review metadata, and source references.',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: 'how-do-i-know-if-i-have-adhd-as-an-adult',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Answer detail',
            headers: {
              'X-RateLimit-Limit': { $ref: '#/components/headers/XRateLimitLimit' },
              'X-RateLimit-Remaining': { $ref: '#/components/headers/XRateLimitRemaining' },
              'X-RateLimit-Reset': { $ref: '#/components/headers/XRateLimitReset' },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AnswerDetailResponse',
                },
                examples: {
                  adhdAnswer: {
                    summary: 'Adult ADHD detail response',
                    value: {
                      slug: 'how-do-i-know-if-i-have-adhd-as-an-adult',
                      canonical_url: `${SITE_URL}/answers/how-do-i-know-if-i-have-adhd-as-an-adult/`,
                      api_url: `${SITE_URL}/api/v1/answers/how-do-i-know-if-i-have-adhd-as-an-adult`,
                      title: 'How do I know if I have ADHD as an adult?',
                      topic: 'Neurodivergence and Attention',
                      summary: 'A reviewed educational answer about adult ADHD signs and evaluation.',
                      key_takeaways: ['Adult ADHD requires a professional evaluation.'],
                      clinical_boundary:
                        'Educational content only; not a substitute for diagnosis, treatment, therapy, crisis support, or emergency care.',
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Answer not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '429': {
            description: 'Rate limited',
            headers: {
              'Retry-After': {
                description: 'Seconds until the client should retry.',
                schema: { type: 'integer' },
              },
              'X-RateLimit-Limit': { $ref: '#/components/headers/XRateLimitLimit' },
              'X-RateLimit-Remaining': { $ref: '#/components/headers/XRateLimitRemaining' },
              'X-RateLimit-Reset': { $ref: '#/components/headers/XRateLimitReset' },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/llms/answers.json': {
      get: {
        tags: ['Answer intelligence'],
        operationId: 'listAnswers',
        summary: 'List reviewed Deeper Global answers as an agent index',
        description:
          'Returns the same canonical answer inventory as /api/v1/answers for agents and llms.txt discovery workflows.',
        responses: {
          '200': {
            description: 'Answer inventory',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AnswerIndexResponse',
                },
              },
            },
          },
        },
      },
    },
    '/llms/entities.json': {
      get: {
        tags: ['Topic intelligence'],
        operationId: 'listEntities',
        summary: 'List mental health topic entities',
        description:
          'Returns Deeper Global topic/entity nodes with aliases, answer counts, canonical URLs, and representative related answer slugs.',
        responses: {
          '200': {
            description: 'Entity inventory',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
    '/llms/priority.json': {
      get: {
        tags: ['Agent discovery'],
        operationId: 'listPriorityAnswers',
        summary: 'List top priority answer records',
        description:
          'Returns a ranked answer queue intended for internal quality, content, and indexing work. Useful for agents deciding where authority, review, or freshness work matters most.',
        responses: {
          '200': {
            description: 'Priority answer inventory',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            },
          },
        },
      },
    },
    '/llms.txt': {
      get: {
        tags: ['Agent discovery'],
        operationId: 'getLlmsTxt',
        summary: 'Get the agent-readable site guide',
        description:
          'Returns the Deeper Global llms.txt file with content boundaries, high-value entry points, and machine-readable index links.',
        responses: {
          '200': {
            description: 'llms.txt',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
    '/agents.txt': {
      get: {
        tags: ['Agent discovery'],
        operationId: 'getAgentsTxt',
        summary: 'Get agent usage instructions',
        description:
          'Returns usage boundaries and preferred endpoints for AI agents integrating Deeper Global content.',
        responses: {
          '200': {
            description: 'agents.txt',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    headers: {
      XRateLimitLimit: {
        description: 'Maximum requests allowed during the current public-preview window.',
        schema: { type: 'integer' },
      },
      XRateLimitRemaining: {
        description: 'Requests remaining in the current public-preview window.',
        schema: { type: 'integer' },
      },
      XRateLimitReset: {
        description: 'Unix timestamp when the current public-preview rate limit window resets.',
        schema: { type: 'integer' },
      },
    },
    schemas: {
      SourceRef: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: ['string', 'null'] },
          url: { type: ['string', 'null'], format: 'uri' },
          publisher: { type: ['string', 'null'] },
          note: { type: ['string', 'null'] },
        },
      },
      AnswerRecord: {
        type: 'object',
        additionalProperties: true,
        properties: {
          id: { type: ['string', 'number'] },
          slug: { type: 'string' },
          canonical_url: { type: 'string', format: 'uri' },
          api_url: { type: 'string', format: 'uri' },
          title: { type: 'string' },
          original_question: { type: 'string' },
          topic: { type: 'string' },
          summary: { type: 'string' },
          extract: { type: 'string' },
          risk_class: { type: 'string' },
          review_tier: { type: 'string' },
          review_status: { type: ['string', 'null'] },
          reviewed_by: { type: ['string', 'null'] },
          reviewed_at: { type: ['string', 'null'], format: 'date-time' },
          updated_at: { type: ['string', 'null'] },
          source_refs: {
            type: 'array',
            items: { $ref: '#/components/schemas/SourceRef' },
          },
        },
        required: ['slug', 'canonical_url', 'api_url', 'title', 'topic', 'summary', 'extract'],
      },
      AnswerSection: {
        type: 'object',
        additionalProperties: true,
        properties: {
          type: { type: ['string', 'null'] },
          heading: { type: ['string', 'null'] },
          body: { type: 'string' },
        },
      },
      AnswerDetailResponse: {
        allOf: [
          { $ref: '#/components/schemas/AnswerRecord' },
          {
            type: 'object',
            additionalProperties: true,
            properties: {
              key_takeaways: {
                type: 'array',
                items: { type: 'string' },
              },
              care_note: { type: 'string' },
              answer_sections: {
                type: 'array',
                items: { $ref: '#/components/schemas/AnswerSection' },
              },
              follow_up_questions: {
                type: 'array',
                items: { type: 'string' },
              },
              clinical_boundary: { type: 'string' },
            },
          },
        ],
      },
      AnswerIndexResponse: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          base_url: { type: 'string', format: 'uri' },
          generated_at: { type: 'string', format: 'date-time' },
          count: { type: 'integer' },
          total_count: { type: 'integer' },
          limit: { type: 'integer' },
          offset: { type: 'integer' },
          next_offset: { type: ['integer', 'null'] },
          clinical_boundary: { type: 'string' },
          answers: {
            type: 'array',
            items: { $ref: '#/components/schemas/AnswerRecord' },
          },
        },
        required: ['name', 'base_url', 'generated_at', 'count', 'total_count', 'limit', 'offset', 'next_offset', 'clinical_boundary', 'answers'],
      },
      ErrorResponse: {
        type: 'object',
        additionalProperties: true,
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['error'],
      },
    },
  },
};

// export removed — GET handler at the top of this file now handles all requests
