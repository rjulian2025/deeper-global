# MCP Server for Deeper Global: Scoping Note

**Status:** Scoped, not yet implemented. This note captures what is required
so the sprint can be prioritized and sized without re-scoping from scratch.

---

## What MCP would add

The Model Context Protocol (MCP) lets Claude, Cursor agents, and other MCP-aware
tools discover and call Deeper Global endpoints natively, without the agent
needing to know the API URL or parse OpenAPI docs. An MCP server turns the
existing `/api/v1/answers` data into first-class tools that agents can invoke
by name (`get_answer`, `search_answers`).

The existing public read API already does everything the data layer needs.
MCP is a discoverability and ergonomics layer on top, not a new data surface.

---

## Required work

### 1. Server implementation

**Hosting options (choose one):**

| Option | Effort | Notes |
|---|---|---|
| Vercel serverless function at `/api/mcp` | Low | Fits existing infra; stateless HTTP transport works with remote MCP clients |
| Standalone Node.js service | Medium | More flexible but adds a new deployment target |
| Cloudflare Worker | Medium | Low latency; requires Wrangler setup |

Recommended: Vercel function at `/api/mcp` using the `@modelcontextprotocol/sdk`
package (TypeScript). Stateless HTTP transport is sufficient; no persistent
connection (SSE/WebSocket) needed for read-only tools.

### 2. Tool definitions

The two obvious tools map directly to existing API routes:

```ts
// Tool: search_answers
// Input: { q?: string, topic?: string, limit?: number }
// Output: AnswerSummary[]
// Maps to: GET /api/v1/answers

// Tool: get_answer
// Input: { slug: string }
// Output: full Answer payload including sections, key_takeaways, source_refs
// Maps to: GET /api/v1/answers/{slug}
```

Optional third tool if priority/entity indexes are useful to agents:

```ts
// Tool: get_entity_map
// Input: { entity?: string }
// Output: entity node(s) from /llms/entities.json
```

### 3. Auth approach

The existing API is fully public with no keys. Two options:

- **Keep public:** MCP server passes calls through with no auth. Rate limit
  (120 req/min/IP) applies at the underlying API layer. Simple, matches
  current posture. Risk: a single MCP client could saturate the rate limit
  on behalf of many users.

- **MCP-level API key:** Issue a single key scoped to MCP clients, checked
  in the `/api/mcp` handler before proxying downstream. Enables separate
  rate-limit tracking for MCP vs. direct API consumers. Adds ~1 day of work.

Recommended: start public, add MCP-specific key in the same sprint as the
first real consumer (when you have someone to issue the key to).

### 4. `.well-known/` manifest

MCP-aware tools discover servers via `GET /.well-known/mcp.json` (Claude) or
`GET /.well-known/ai-plugin.json` (OpenAI plugin standard, older). A static
JSON file at `public/.well-known/mcp.json` advertising the server URL and
tool list is all that is needed. One file, no logic.

### 5. Vercel cron / long-running concerns

MCP tool calls are synchronous and short (same latency as the underlying API,
< 500 ms expected). No cron or durable workflow needed.

### 6. Testing

- Use `@modelcontextprotocol/inspector` locally to verify tool discovery
  and response shapes before deploying.
- A Cursor agent test ("use the deeper.global MCP to find answers about ADHD")
  confirms end-to-end discoverability.

---

## Estimated effort

| Phase | Work | Est. |
|---|---|---|
| Implement `/api/mcp` Vercel function + 2 tools | 1 Cursor session | ~2–3 hours |
| `.well-known/mcp.json` manifest | Trivial | 15 min |
| Local test with MCP inspector | Verification | 30 min |
| Deploy + smoke test in Cursor | Verification | 30 min |

Total: approximately half a day of engineering work. No new infrastructure
or external accounts required; all runs on existing Vercel project.

---

## Dependencies before starting

- `@modelcontextprotocol/sdk` npm package (MIT licensed, Anthropic-maintained)
- Decision on auth model (public vs. MCP-level key)
- No Supabase schema changes needed

---

## Recommended sprint trigger

Prioritize when the first concrete MCP consumer appears (e.g., a Cursor rule
or automation that would benefit from native tool access), or when the public
API has confirmed real consumer traffic and you want to differentiate the
discovery surface.
