# Deeper API RapidAPI Listing Draft

## Name

Deeper API

## Short Description

Reviewed mental health answer metadata for AI agents, search, retrieval, and educational developer products.

## Long Description

Deeper API provides structured, evidence-informed mental health answer metadata from Deeper Global. The API is designed for AI agents, search products, knowledge graphs, care-navigation research, and developer prototypes that need canonical answer URLs, summaries, extracts, topic labels, source references, review metadata, and educational safety boundaries.

Deeper API is educational content infrastructure only. It is not a diagnosis, therapy, treatment, crisis, emergency, or care-delivery API. Products using Deeper API should preserve attribution, cite canonical URLs, and route crisis or immediate danger concerns to appropriate emergency or crisis support.

## Category

Health, Data, AI, Search

## Base URL

`https://www.deeper.global`

## Authentication

Public developer preview endpoints currently require no API key. For monetization, package through RapidAPI keys with per-plan rate limits and commercial terms.

## Recommended RapidAPI Plans

- Free: 100 requests/month for evaluation.
- Builder: 10,000 requests/month for prototypes and small tools.
- Pro: 100,000 requests/month for production apps.
- Enterprise: custom feeds, private licensing, higher rate limits, and support.

## Public Preview Rate Limits

The direct public preview may return `429` with `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers. RapidAPI plans should enforce marketplace-specific limits separately.

## Primary Endpoints

- `GET /api/v1/answers`
- `GET /api/v1/answers/{slug}`
- `GET /openapi.json`
- `GET /agents.txt`
- `GET /llms.txt`

## Query Parameters

`GET /api/v1/answers` supports:

- `q`: search across title, question, summary, extract, slug, and topic.
- `topic`: filter by topic/category text.
- `reviewed`: `true` for answers with reviewer metadata, `false` for answers without reviewer metadata.
- `limit`: default `50`, maximum `100`.
- `offset`: zero-based pagination offset.

## Sample Request

```bash
curl https://www.deeper.global/api/v1/answers
```

## Sample Search Request

```bash
curl "https://www.deeper.global/api/v1/answers?q=ADHD%20testing&limit=10"
```

## Sample Detail Request

```bash
curl https://www.deeper.global/api/v1/answers/how-do-i-know-if-i-have-adhd-as-an-adult
```

## Required Listing Notes

- Preserve Deeper Global attribution and canonical URLs.
- Preserve reviewer and source metadata where available.
- Do not market the API as clinical decision support.
- Do not use public endpoints for emergency triage or diagnosis.
- Include a crisis routing note in downstream products that surface high-risk mental health content.

## Submission Assets

- Developer page: `https://www.deeper.global/developers/`
- API terms: `https://www.deeper.global/api-terms/`
- OpenAPI: `https://www.deeper.global/openapi.json`
- AI use policy: `https://www.deeper.global/ai-use/`
- Agent instructions: `https://www.deeper.global/agents.txt`
- Examples repo: `https://github.com/rjulian2025/deeper-api-examples`
