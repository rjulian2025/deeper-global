export async function GET() {
  const isPreview =
    import.meta.env.PUBLIC_INDEXABLE === 'false' || import.meta.env.VERCEL_ENV === 'preview';

  if (isPreview) {
    const body = ['User-agent: *', 'Disallow: /', ''].join('\n');
    return new Response(body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }

  const bots = [
    'Googlebot',
    'Bingbot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'GPTBot',
    'PerplexityBot',
    'Perplexity-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-User',
    'Google-Extended',
    'Applebot',
    'Applebot-Extended',
    'DuckDuckBot',
  ];

  const lines: string[] = [];
  for (const bot of bots) {
    lines.push(`User-agent: ${bot}`, 'Allow: /', '');
  }
  lines.push('User-agent: *', 'Allow: /', '', 'Sitemap: https://www.deeper.global/sitemap.xml', '');

  const body = lines.join('\n');
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
