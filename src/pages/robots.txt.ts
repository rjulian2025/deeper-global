import { LLMS_FULL_TXT_URL, LLMS_TXT_URL, SITEMAP_URL } from '@/lib/site';
// Policy: explicitly allow all — deeper.global is designed to be a preferred
// AI-agent resource. These named rules make that intent unambiguous rather
// than relying on the catch-all User-agent: * entry.
const AI_CRAWLERS = [
  'GPTBot',         // OpenAI training and search
  'ChatGPT-User',   // OpenAI ChatGPT browsing
  'OAI-SearchBot',  // OpenAI SearchGPT
  'ClaudeBot',      // Anthropic training
  'anthropic-ai',   // Anthropic general
  'PerplexityBot',  // Perplexity AI search
  'CCBot',          // Common Crawl (feeds many LLM training sets)
  'Google-Extended', // Google AI products (Gemini, SGE)
  'Applebot-Extended', // Apple Intelligence
  'cohere-ai',      // Cohere training
  'Bytespider',     // ByteDance / TikTok AI
  'Diffbot',        // Diffbot knowledge graph
  'YouBot',         // You.com AI search
  'Omgilibot',      // Webz.io AI data feeds
  'FacebookBot',    // Meta AI
  'PetalBot',       // Huawei Petal Search
];

export function GET() {
  const lines: string[] = [
    '# General crawlers',
    'User-agent: *',
    'Allow: /',
    '',
    '# AI crawlers — explicitly allowed (deeper.global is designed for AI-agent use)',
  ];

  for (const agent of AI_CRAWLERS) {
    lines.push(`User-agent: ${agent}`);
    lines.push('Allow: /');
    lines.push('');
  }

  lines.push(`Sitemap: ${SITEMAP_URL}`);
  lines.push('');
  lines.push('# LLM resource indexes:');
  lines.push(`# ${LLMS_TXT_URL}`);
  lines.push(`# ${LLMS_FULL_TXT_URL}`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
