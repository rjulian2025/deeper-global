import { LLMS_FULL_TXT_URL, LLMS_TXT_URL, SITEMAP_URL } from '@/lib/site';
import { shouldNoindex } from '@/lib/site-env';

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
  'cohere-ai',
  'Bytespider',
  'Diffbot',
  'YouBot',
  'Omgilibot',
  'FacebookBot',
  'PetalBot',
];

function nonIndexableRobots(): string {
  return ['# indexability-state: noindex', 'User-agent: *', 'Disallow: /', ''].join('\n');
}

function indexableRobots(): string {
  const lines: string[] = [
    '# indexability-state: indexable',
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

  return lines.join('\n');
}

export function buildRobotsTxt(): string {
  return shouldNoindex() ? nonIndexableRobots() : indexableRobots();
}
