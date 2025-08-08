import { generateEntityLinks } from '@/lib/schema'

interface EntityLinkedContentProps {
  content: string
  className?: string
}

export default function EntityLinkedContent({ content, className = '' }: EntityLinkedContentProps) {
  const { text: linkedContent } = generateEntityLinks(content)
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: linkedContent }}
    />
  )
}
