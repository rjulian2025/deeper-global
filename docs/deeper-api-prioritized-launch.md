# Deeper API Prioritized Launch

## Priority 1 - Postman Public API Network

Why: strongest public API discovery fit. Postman is designed for API consumers, public workspaces, collections, and OpenAPI-backed docs.

Task:

1. Import `https://www.deeper.global/openapi.json` into Postman.
2. Create a public workspace named `Deeper API`.
3. Add a collection with example requests for:
   - `/llms/answers.json`
   - `/llms/entities.json`
   - `/llms/priority.json`
   - `/llms.txt`
   - `/agents.txt`
4. Add the safety boundary from the submission kit.
5. Publish to the Public API Network.
6. Use UTM URL: `https://www.deeper.global/developers/?utm_source=postman&utm_medium=directory&utm_campaign=deeper_api_adoption`

## Priority 2 - RapidAPI

Why: best fit for future monetization, key management, usage limits, and marketplace packaging.

Task:

1. Create a RapidAPI provider project.
2. Use `Deeper API` as product name.
3. Import or map the public endpoints.
4. Start with free public endpoints; reserve paid tiers for higher rate limits, private keys, and commercial feeds.
5. Use UTM URL: `https://www.deeper.global/developers/?utm_source=rapidapi&utm_medium=marketplace&utm_campaign=deeper_api_adoption`

## Priority 3 - GitHub examples repo

Why: highest credibility for builders and a prerequisite for Show HN, MCP directories, GitHub awesome-list PRs, and developer outreach.

Task:

1. Publish the local `deeper-api-examples` folder as a public repo.
2. Include curl, JavaScript, and Python examples.
3. Add a clear safety boundary and attribution requirement.
4. Link to the developer page, OpenAPI spec, and Postman workspace.

## Priority 4 - IndexNow

Why: fast URL discovery across participating search engines after verification.

Task:

1. Deploy the IndexNow key file: `https://www.deeper.global/3ba9ef76-3c68-49af-aefb-ffa306c3569a.txt`
2. After deployment, run `npm run seo:indexnow`.
3. Confirm a successful `200` or `202` response.

## Priority 5 - MCP directories

Why: useful discovery only after there is a real MCP server wrapper.

Hold until:

- A public MCP repo exists.
- The server exposes tools for answer search, answer lookup, entity lookup, and safety-boundary retrieval.
- The README includes install instructions and examples.

Directories to use after wrapper exists:

- Glama MCP
- mcpservers.org
- Smithery
- PulseMCP
- MCP.so
