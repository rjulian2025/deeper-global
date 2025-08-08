import { generateEntityLinks } from '@/lib/schema'
import { rewriteLinks } from '@/lib/linkRewriter'
import { stripExternalLinks } from '@/lib/sanitizeNoExternalLinks'
import { addInternalLinks } from '@/lib/internalLinker'

interface EntityLinkedContentProps {
  content: string
  className?: string
}

export default function EntityLinkedContent({ content, className = '' }: EntityLinkedContentProps) {
  // First, generate entity links (this creates Wikipedia links)
  const { text: linkedContent } = generateEntityLinks(content)
  
  // Then, rewrite Wikipedia links to internal category routes where possible
  const rewrittenContent = rewriteLinks(linkedContent)
  
  // Add internal links to our allowlist terms
  const withInternalLinks = addInternalLinks(rewrittenContent)
  
  // Finally, strip any remaining external links
  const sanitizedContent = stripExternalLinks(withInternalLinks)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  )
}
