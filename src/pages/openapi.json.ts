import { SITE_URL } from '@/lib/site';

const openApiDocument = {
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
      name: 'Developer preview - contact for commercial terms',
      url: `${SITE_URL}/developers/`,
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
          'Returns the canonical v1 answer inventory with slugs, titles, canonical URLs, summaries, extracts, risk classes, review metadata, source references, and upgrade-priority signals.',
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
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AnswerDetailResponse',
                },
              },
            },
          },
          '404': {
            description: 'Answer not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
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
          clinical_boundary: { type: 'string' },
          answers: {
            type: 'array',
            items: { $ref: '#/components/schemas/AnswerRecord' },
          },
        },
        required: ['name', 'base_url', 'generated_at', 'count', 'clinical_boundary', 'answers'],
      },
    },
  },
};

export async function GET() {
  return Response.json(openApiDocument, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
