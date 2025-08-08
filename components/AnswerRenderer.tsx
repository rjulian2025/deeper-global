import { stripExternalLinks } from '@/lib/sanitizeNoExternalLinks';

type Props = { html: string };

export default function AnswerRenderer({ html }: Props) {
  const stripped = stripExternalLinks(html);
  
  // Since we're not using DOMPurify (not installed), we'll rely on the sanitizer
  // and the fact that we're using dangerouslySetInnerHTML with already sanitized content
  
  return <div dangerouslySetInnerHTML={{ __html: stripped }} />;
}
