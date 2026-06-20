import { API_CONSTANTS, jsonResponse } from '../lib/answer-api.mjs';

const OPENAPI = {
  openapi: '3.1.0',
  info: {
    title: 'Deeper Global Read API',
    version: '1.0.0',
    description:
      'Public read API for evidence-informed mental health answers. Educational use only; attribution required.',
    contact: {
      name: 'Deeper Global',
      url: API_CONSTANTS.site_url,
    },
    license: {
      name: 'CC-BY-4.0',
      url: API_CONSTANTS.license_url,
    },
  },
  servers: [{ url: API_CONSTANTS.site_url }],
  paths: {
    '/api/v1/answers': {
      get: {
        operationId: 'listAnswers',
        summary: 'List or search indexable mental health answers',
        parameters: [
          { name: 'topic', in: 'query', schema: { type: 'string' }, description: 'Topic slug or label filter' },
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Free-text search across title and summary' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 25 } },
          { name: 'cursor', in: 'query', schema: { type: 'string' }, description: 'Pagination offset cursor' },
        ],
        responses: {
          '200': {
            description: 'Paginated answer summaries',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AnswerList' },
              },
            },
          },
        },
      },
    },
    '/api/v1/answers/{slug}': {
      get: {
        operationId: 'getAnswer',
        summary: 'Get a structured mental health answer by slug',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'how-do-i-know-if-i-have-adhd-as-an-adult',
          },
        ],
        responses: {
          '200': {
            description: 'Structured answer payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Answer' },
              },
            },
          },
          '404': {
            description: 'Answer not found or not publicly available',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/llms/answers.json': {
      get: {
        operationId: 'listAnswerIndex',
        summary: 'Bulk answer inventory with summaries and extracts',
        responses: {
          '200': {
            description: 'Answer index',
          },
        },
      },
    },
    '/ai-use/': {
      get: {
        operationId: 'aiUsePolicy',
        summary: 'AI reuse and citation policy',
        responses: {
          '200': {
            description: 'HTML policy page',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      AnswerSection: {
        type: 'object',
        properties: {
          type: { type: 'string', nullable: true },
          heading: { type: 'string', nullable: true },
          body: { type: 'string' },
        },
        required: ['body'],
      },
      SourceRef: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
          publisher: { type: 'string' },
        },
      },
      Reviewer: {
        type: 'object',
        nullable: true,
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          specialty_label: { type: 'string', nullable: true },
          profile_url: { type: 'string', nullable: true },
        },
      },
      SemanticEnrichmentV1: {
        type: 'object',
        description:
          'Educational semantic metadata centered on the human question. Supports discovery and self-understanding; does not diagnose the reader.',
        required: [
          'canonical_question',
          'intended_next_step',
          'safety_disclaimer',
          'enrichment_status',
          'enrichment_updated_at',
        ],
        properties: {
          canonical_question: { type: 'string', example: 'How do I know if I have ADHD as an adult?' },
          alternate_questions: { type: 'array', items: { type: 'string' } },
          emotional_phrasings: { type: 'array', items: { type: 'string' } },
          related_symptoms: { type: 'array', items: { type: 'string' } },
          possible_interpretations: {
            type: 'array',
            items: { type: 'string' },
            description: 'Broad meaning frames; not diagnoses',
          },
          differential_considerations: {
            type: 'array',
            items: { type: 'string' },
            description: 'Topics that may overlap; for educational context only',
          },
          user_situations: { type: 'array', items: { type: 'string' } },
          ai_prompt_variants: { type: 'array', items: { type: 'string' } },
          related_entities: { type: 'array', items: { type: 'string' } },
          primary_hub: { type: 'string', example: '/adhd/' },
          secondary_hubs: { type: 'array', items: { type: 'string' } },
          reviewer_id: { type: 'string', nullable: true },
          intended_next_step: {
            type: 'string',
            enum: [
              'self_education',
              'self_reflection',
              'professional_evaluation',
              'therapy',
              'crisis_support',
              'medical_consult',
              'relationship_support',
              'no_specific_next_step',
            ],
          },
          safety_disclaimer: { type: 'string' },
          enrichment_status: {
            type: 'string',
            enum: ['not_started', 'ai_generated', 'human_reviewed', 'clinically_reviewed', 'needs_review'],
          },
          enrichment_updated_at: { type: 'string', format: 'date-time' },
          semantic_boundary: {
            type: 'string',
            description: 'API reminder that semantic fields are not diagnostic',
          },
        },
      },
      Answer: {
        type: 'object',
        required: ['api_version', 'slug', 'canonical_url', 'api_url', 'title', 'sections', 'license', 'citation_required'],
        properties: {
          api_version: { type: 'string', example: 'v1' },
          id: { oneOf: [{ type: 'string' }, { type: 'number' }] },
          slug: { type: 'string' },
          canonical_url: { type: 'string', format: 'uri' },
          api_url: { type: 'string', format: 'uri' },
          title: { type: 'string' },
          original_question: { type: 'string' },
          schema_question: { type: 'string' },
          schema_answer: { type: 'string' },
          topic: { type: 'string' },
          primary_theme: { type: 'string' },
          summary: { type: 'string' },
          lede: { type: 'string' },
          key_takeaways: { type: 'array', items: { type: 'string' } },
          sections: { type: 'array', items: { $ref: '#/components/schemas/AnswerSection' } },
          care_note: { type: 'string', nullable: true },
          review_status: { type: 'string', nullable: true },
          reviewed_by: { type: 'string', nullable: true },
          reviewed_at: { type: 'string', nullable: true },
          reviewer: { $ref: '#/components/schemas/Reviewer' },
          source_refs: { type: 'array', items: { $ref: '#/components/schemas/SourceRef' } },
          content_prompt_version: { type: 'string', nullable: true },
          content_enriched_at: { type: 'string', nullable: true },
          created_at: { type: 'string', nullable: true },
          updated_at: { type: 'string', nullable: true },
          indexable: { type: 'boolean' },
          license: { type: 'string', example: 'CC-BY-4.0' },
          license_url: { type: 'string', format: 'uri' },
          citation_required: { type: 'boolean', example: true },
          attribution: { type: 'string' },
          clinical_boundary: { type: 'string' },
          crisis_boundary: { type: 'string' },
          semantic_enrichment_v1: {
            allOf: [{ $ref: '#/components/schemas/SemanticEnrichmentV1' }],
            nullable: true,
            description: 'Present only when semantic enrichment has been attached to the answer.',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          slug: { type: 'string' },
          message: { type: 'string' },
        },
      },
      AnswerSummary: {
        type: 'object',
        required: ['slug', 'canonical_url', 'api_url', 'title', 'summary'],
        properties: {
          slug: { type: 'string' },
          canonical_url: { type: 'string', format: 'uri' },
          api_url: { type: 'string', format: 'uri' },
          full_text_available: { type: 'boolean' },
          title: { type: 'string' },
          summary: { type: 'string' },
          topic: { type: 'string' },
          primary_theme: { type: 'string' },
          review_status: { type: 'string', nullable: true },
          reviewed_by: { type: 'string', nullable: true },
          attribution: { type: 'string' },
        },
      },
      AnswerList: {
        type: 'object',
        required: ['api_version', 'answers', 'count', 'total'],
        properties: {
          api_version: { type: 'string' },
          count: { type: 'integer' },
          total: { type: 'integer' },
          limit: { type: 'integer' },
          cursor: { type: 'string' },
          next_cursor: { type: 'string', nullable: true },
          license: { type: 'string' },
          license_url: { type: 'string', format: 'uri' },
          citation_required: { type: 'boolean' },
          answers: { type: 'array', items: { $ref: '#/components/schemas/AnswerSummary' } },
        },
      },
    },
  },
  'x-attribution': {
    required: true,
    template: API_CONSTANTS.attribution_template,
    header: 'X-Deeper-Attribution (optional telemetry)',
  },
  'x-clinical-boundary': API_CONSTANTS.clinical_boundary,
  'x-crisis-boundary': API_CONSTANTS.crisis_boundary,
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return jsonResponse(res, 405, { error: 'method_not_allowed' });
  }

  return jsonResponse(res, 200, OPENAPI, { cacheSeconds: 86400 });
}
